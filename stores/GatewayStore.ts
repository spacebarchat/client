import {
  GatewayDispatchEvents,
  GatewayDispatchPayload,
  GatewayHeartbeat,
  GatewayIdentify,
  GatewayOpcodes,
  GatewayReceivePayload,
  GatewaySendPayload,
} from "discord-api-types/v9";
import { action, makeObservable, observable } from "mobx";
import { Platform } from "react-native";
import { GatewayReadyDispatchData } from "../interfaces/gateway/Gateway";
import BaseStoreEventEmitter from "./BaseStoreEventEmitter";
import { DomainStore } from "./DomainStore";

const GATEWAY_VERSION = "9";
const GATEWAY_ENCODING = "json";

export default class GatewayStore extends BaseStoreEventEmitter {
  @observable private token?: string;
  @observable socket?: WebSocket;
  @observable sessionId?: string;
  private domain: DomainStore;
  private url?: string;
  private heartbeatTimer?: NodeJS.Timeout;
  private dispatchHandlers: Map<GatewayDispatchEvents, Function> = new Map();

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
    this.url = url;
    const url2 = new URL(this.url);
    url2.searchParams.append("v", GATEWAY_VERSION);
    url2.searchParams.append("encoding", GATEWAY_ENCODING);
    this.logger.debug(`Connecting to ${url2}`);
    this.socket = new WebSocket(url2);

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
  }

  private onopen = () => {
    console.debug("[Gateway] Connected");
    this.sendIdentify();
  };

  private onmessage = (e: WebSocketMessageEvent) => {
    const payload: GatewayReceivePayload = JSON.parse(e.data);
    console.debug("[Gateway] Received", payload);

    switch (payload.op) {
      case GatewayOpcodes.Dispatch:
        this.logger.debug("Received dispatch");
        this.processDispatch(payload);
        break;
      case GatewayOpcodes.Heartbeat:
        this.logger.debug("Received heartbeat");
        this.sendHeartbeat();
        break;
      case GatewayOpcodes.Reconnect:
        this.logger.debug("Received reconnect");
        break;
      case GatewayOpcodes.InvalidSession:
        this.logger.debug("Received invalid session");
        break;
      case GatewayOpcodes.Hello:
        this.logger.debug("Received hello");
        this.startHeartbeat(payload.d.heartbeat_interval);
        break;
      case GatewayOpcodes.HeartbeatAck:
        this.logger.debug("Received heartbeat ack");
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
    console.debug(`[Gateway] Closed with code ${e.code}`, e);
    this.clearHeartbeat();
  };

  private sendJson = (payload: GatewaySendPayload) => {
    this.socket!.send(JSON.stringify(payload));
  };

  private sendIdentify = () => {
    this.logger.debug("Sending identify");
    const payload: GatewayIdentify = {
      op: GatewayOpcodes.Identify,
      d: {
        token: this.token!,
        properties: {
          os: Platform.OS,
          browser: "",
          device: "",
        },
        compress: false,
      },
    };
    this.sendJson(payload);
  };

  private sendHeartbeat = () => {
    const payload: GatewayHeartbeat = {
      op: GatewayOpcodes.Heartbeat,
      d: null,
    };
    this.logger.debug("Sending heartbeat");
    this.sendJson(payload);
  };

  private startHeartbeat = (interval: number) => {
    const jitterInterval = interval - Math.random();
    this.logger.debug(`Starting heartbeat timer with interval ${interval} ms.`);

    this.sendHeartbeat();
    this.heartbeatTimer = setInterval(() => {
      this.sendHeartbeat();
    }, jitterInterval);
  };

  private clearHeartbeat = () => {
    this.logger.debug("Clearning heartbeat timer");
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
    }
  };

  private onReady = (data: GatewayReadyDispatchData) => {
    this.logger.debug("Received ready event");

    const { session_id, guilds, users, user } = data;
    this.sessionId = session_id;
    this.domain.account.setUser(user);
    guilds.forEach((guild) => this.domain.guild.add(guild));
    users?.forEach((user) => this.domain.user.add(user));

    this.logger.debug(`Stored ${this.domain.guild.guilds.size} guilds`);
    this.logger.debug(`Stored ${this.domain.user.users.size} users`);
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
}
