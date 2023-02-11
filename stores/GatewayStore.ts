import { Guild } from "@puyodead1/fosscord-types";
import { action, makeObservable, observable } from "mobx";
import { Platform } from "react-native";
import {
  GatewayDispatchEvents,
  GatewayDispatchPayload,
  GatewayGuildCreateDispatchData,
  GatewayGuildDeleteDispatchData,
  GatewayHeartbeat,
  GatewayHelloData,
  GatewayIdentify,
  GatewayOpcodes,
  GatewayReadyDispatchData,
  GatewayReceivePayload,
  GatewaySendPayload,
} from "../interfaces/Gateway";
import BaseStore from "./BaseStore";
import { DomainStore } from "./DomainStore";

const GATEWAY_VERSION = "9";
const GATEWAY_ENCODING = "json";

export default class GatewayStore extends BaseStore {
  @observable private token: string | null = null;
  @observable private socket: WebSocket | null = null;
  @observable private sessionId: string | null = null;
  private domain: DomainStore;
  private url?: string;
  private heartbeatInterval: number | null = null;
  private heartbeater: NodeJS.Timeout | null = null;
  private initialHeartbeatTimeout: NodeJS.Timeout | null = null;
  private dispatchHandlers: Map<GatewayDispatchEvents, Function> = new Map();
  private connectionStartTime?: number;
  private identifyStartTime?: number;
  private sequence: number = 0;
  private heartbeatAck: boolean = true;

  constructor(domain: DomainStore) {
    super();

    this.domain = domain;

    makeObservable(this);
  }
  /**
   * Starts connection to gateway
   */
  @action
  async connect(url: string, token: string) {
    this.token = token;
    const newUrl = new URL(url);
    newUrl.searchParams.append("v", GATEWAY_VERSION);
    newUrl.searchParams.append("encoding", GATEWAY_ENCODING);
    this.url = newUrl.href;
    this.logger.debug(`[Connect] ${this.url}`);
    this.connectionStartTime = Date.now();
    this.socket = new WebSocket(this.url);

    this.setupListeners();
    this.setupDispatchHandler();
  }

  private setupListeners() {
    this.socket!.onopen = this.onopen;
    this.socket!.onmessage = this.onmessage;
    this.socket!.onerror = this.onerror;
    this.socket!.onclose = this.onclose;
  }

  private setupDispatchHandler() {
    this.dispatchHandlers.set(GatewayDispatchEvents.Ready, this.onReady);
    this.dispatchHandlers.set(
      GatewayDispatchEvents.GuildCreate,
      this.onGuildCreate
    );
    this.dispatchHandlers.set(
      GatewayDispatchEvents.GuildDelete,
      this.onGuildDelete
    );
  }

  private onopen = () => {
    this.logger.debug(
      `[Connected] ${this.url} (took ${
        Date.now() - this.connectionStartTime!
      }ms)`
    );
    this.handleIdentify();
  };

  private onmessage = (e: WebSocketMessageEvent) => {
    const payload: GatewayReceivePayload = JSON.parse(e.data);
    console.debug("[Gateway] Received", payload);

    switch (payload.op) {
      case GatewayOpcodes.Dispatch:
        this.processDispatch(payload);
        break;
      case GatewayOpcodes.Heartbeat:
        this.sendHeartbeat();
        break;
      case GatewayOpcodes.Reconnect:
        this.logger.debug("Received reconnect");
        break;
      case GatewayOpcodes.InvalidSession:
        this.logger.debug("Received invalid session");
        break;
      case GatewayOpcodes.Hello:
        this.handleHello(payload.d);
        break;
      case GatewayOpcodes.HeartbeatAck:
        this.handleHeartbeatAck();
        break;
      default:
        this.logger.debug("Received unknown opcode");
        break;
    }
  };

  private onerror = (e: Event) => {
    console.error("[Gateway] Socket Error", e);
  };

  private onclose = (e: WebSocketCloseEvent) => {
    this.handleClose(e.code);
  };

  private sendJson = (payload: GatewaySendPayload) => {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      this.logger.error("Socket is not open");
      return;
    }
    this.socket.send(JSON.stringify(payload));
  };

  private handleIdentify = () => {
    this.logger.debug("handleIdentify called");
    if (!this.token) return this.logger.error(`Token shouldn't be null here`);
    this.identifyStartTime = Date.now();

    const payload: GatewayIdentify = {
      op: GatewayOpcodes.Identify,
      d: {
        token: this.token,
        properties: {
          os: Platform.OS,
        },
        compress: false,
      },
    };
    this.sendJson(payload);
  };

  private handleHello = (data: GatewayHelloData) => {
    this.heartbeatInterval = data.heartbeat_interval;
    this.logger.debug(
      `[Hello] heartbeat interval: ${data.heartbeat_interval} (took ${
        Date.now() - this.connectionStartTime!
      }ms)`
    );
    this.startHeartbeater();
  };

  private handleClose = (code: number | undefined) => {
    this.cleanup();

    if (code === 4004) {
      this.logger.warn(`closed because of authentication failure.`);
      return this.reset();
    }

    // TODO: reconnect
  };

  private reset = () => {
    this.sessionId = null;
    this.sequence = 0;
  };

  private startHeartbeater = () => {
    if (this.heartbeater) {
      clearInterval(this.heartbeater);
      this.heartbeater = null;
    }

    const heartbeaterFn = () => {
      if (this.heartbeatAck) {
        this.heartbeatAck = false;
        this.sendHeartbeat();
      } else {
        this.handleHeartbeatTimeout();
      }
    };

    this.initialHeartbeatTimeout = setTimeout(() => {
      this.initialHeartbeatTimeout = null;
      this.heartbeater = setInterval(heartbeaterFn, this.heartbeatInterval!);
      heartbeaterFn();
    }, Math.floor(Math.random() * this.heartbeatInterval!));
  };

  private stopHeartbeater = () => {
    if (this.heartbeater) {
      clearInterval(this.heartbeater);
      this.heartbeater = null;
    }

    if (this.initialHeartbeatTimeout) {
      clearTimeout(this.initialHeartbeatTimeout);
      this.initialHeartbeatTimeout = null;
    }
  };

  private handleHeartbeatTimeout = () => {
    this.socket?.close(4000);
    // TODO: handle reconnect
    this.logger.warn(
      `[Heartbeat ACK Timeout] should reconnect in ${(
        this.heartbeatInterval! / 1000
      ).toFixed(2)} seconds`
    );
  };

  private sendHeartbeat = () => {
    const payload: GatewayHeartbeat = {
      op: GatewayOpcodes.Heartbeat,
      d: null,
    };
    this.logger.debug("Sending heartbeat");
    this.sendJson(payload);
  };

  private cleanup = () => {
    this.stopHeartbeater();
    this.socket = null;
  };

  private handleHeartbeatAck = () => {
    this.logger.debug("Received heartbeat ack");
    this.heartbeatAck = true;
  };

  private processDispatch = (data: GatewayDispatchPayload) => {
    // TODO: store sequence number

    const { d, t, s } = data;
    const handler = this.dispatchHandlers.get(t);
    if (!handler) {
      this.logger.debug(`No handler for dispatch event ${t}`);
      return;
    }

    handler(d);
  };

  private onReady = (data: GatewayReadyDispatchData) => {
    const { session_id, guilds, users, user } = data;
    this.sessionId = session_id;
    this.logger.debug(
      `[Ready] took ${Date.now() - this.connectionStartTime!}ms`
    );

    this.domain.account.setUser(user);
    guilds.forEach((guild) => {
      // TODO: handle different data modes
      this.domain.guild.add({
        ...guild,
        ...guild.properties,
      } as unknown as Guild);
    });
    users?.forEach((user) => this.domain.user.add(user));

    this.logger.debug(`Stored ${this.domain.guild.guilds.size} guilds`);
    this.logger.debug(`Stored ${this.domain.user.users.size} users`);
  };

  private onGuildCreate = (data: GatewayGuildCreateDispatchData) => {
    this.logger.debug("Received guild create event");
    this.domain.guild.add({ ...data, ...data.properties } as unknown as Guild);
  };

  private onGuildDelete = (data: GatewayGuildDeleteDispatchData) => {
    console.log(data);
    this.logger.debug("Received guild delete event");
    this.domain.guild.guilds.delete(data.id);
  };
}
