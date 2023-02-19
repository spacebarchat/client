import {
  APIGuild,
  ChannelType,
  GatewayChannelCreateDispatchData,
  GatewayChannelDeleteDispatchData,
  GatewayDispatchEvents,
  GatewayDispatchPayload,
  GatewayGuildCreateDispatchData,
  GatewayGuildDeleteDispatchData,
  GatewayGuildMemberListUpdateDispatchData,
  GatewayGuildModifyDispatchData,
  GatewayHeartbeat,
  GatewayHelloData,
  GatewayIdentify,
  GatewayLazyRequest,
  GatewayLazyRequestData,
  GatewayMessageCreateDispatchData,
  GatewayMessageDeleteDispatchData,
  GatewayMessageUpdateDispatchData,
  GatewayOpcodes,
  GatewayReadyDispatchData,
  GatewayReceivePayload,
  GatewaySendPayload,
  Snowflake,
} from "@puyodead1/fosscord-api-types/v9";
import * as Application from "expo-application";
import * as Device from "expo-device";
import { action, makeObservable, observable, reaction } from "mobx";
import { Platform } from "react-native";
import { Globals } from "../constants/Globals";
import BaseStore from "./BaseStore";
import { DomainStore } from "./DomainStore";

const GATEWAY_VERSION = "9";
const GATEWAY_ENCODING = "json";

export default class GatewayStore extends BaseStore {
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
  private sequence: number | null = null;
  private heartbeatAck: boolean = true;
  private lazyRequestChannels = new Map<string, Snowflake[]>(); // guild, channels

  constructor(domain: DomainStore) {
    super();

    this.domain = domain;

    reaction(
      () => domain.account.token,
      (token) => {
        if (token) {
          this.connect(Globals.routeSettings.gateway);
        } else {
          this.socket?.close(1000, "user is no longer authenticated");
        }
      }
    );

    makeObservable(this);
  }
  /**
   * Starts connection to gateway
   */
  @action
  async connect(url: string) {
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
      GatewayDispatchEvents.GuildUpdate,
      this.onGuildUpdate
    );
    this.dispatchHandlers.set(
      GatewayDispatchEvents.GuildDelete,
      this.onGuildDelete
    );
    this.dispatchHandlers.set(
      GatewayDispatchEvents.GuildMemberListUpdate,
      this.onGuildMemberListUpdate
    );

    this.dispatchHandlers.set(
      GatewayDispatchEvents.ChannelCreate,
      this.onChannelCreate
    );
    this.dispatchHandlers.set(
      GatewayDispatchEvents.ChannelDelete,
      this.onChannelDelete
    );

    this.dispatchHandlers.set(
      GatewayDispatchEvents.MessageCreate,
      this.onMessageCreate
    );
    this.dispatchHandlers.set(
      GatewayDispatchEvents.MessageUpdate,
      this.onMessageUpdate
    );
    this.dispatchHandlers.set(
      GatewayDispatchEvents.MessageDelete,
      this.onMessageDelete
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
    if (payload.op !== GatewayOpcodes.Dispatch)
      this.logger.debug(`[Gateway] -> ${payload.op}`, payload);

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
    this.logger.error("[Gateway] Socket Error", e);
  };

  private onclose = (e: WebSocketCloseEvent) => {
    this.handleClose(e.code);
  };

  private sendJson = (payload: GatewaySendPayload) => {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      this.logger.error("Socket is not open");
      return;
    }
    this.logger.debug(`[Gateway] <- ${payload.op}`, payload);
    this.socket.send(JSON.stringify(payload));
  };

  private handleIdentify = () => {
    this.logger.debug("handleIdentify called");
    if (!this.domain.account.token)
      return this.logger.error(`Token shouldn't be null here`);
    this.identifyStartTime = Date.now();

    let browser;
    if (Platform.OS === "ios") browser = "Fosscord iOS";
    else if (Platform.OS === "android") browser = "Fosscord Android";
    else if (Platform.isDesktop) browser = "Fosscord Desktop";
    else browser = "Fosscord Web";

    const payload: GatewayIdentify = {
      op: GatewayOpcodes.Identify,
      d: {
        token: this.domain.account.token,
        properties: {
          browser,
          client_build_number: 0,
          client_version: Application.nativeApplicationVersion ?? undefined,
          browser_version: Device.osVersion ?? undefined,
          os: Platform.OS,
          os_version: Device.osVersion ?? undefined,
          release_channel: "dev",
        },
        compress: false,
      },
    };
    this.sendJson(payload);
  };

  private handleHello = (data: GatewayHelloData) => {
    this.heartbeatInterval = data.heartbeat_interval;
    this.logger.info(
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
      // remove token, this will send us back to the login screen
      // TODO: maybe we could show a toast here so the user knows why they got logged out
      this.domain.account.logout();
      this.reset();
      this.domain.setAppLoading(false);
      return;
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
      d: this.sequence,
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
    const { d, t, s } = data;
    this.logger.debug(`[Gateway] -> ${t}`, d);
    this.sequence = s;
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
    this.logger.info(
      `[Ready] took ${Date.now() - this.connectionStartTime!}ms`
    );

    this.domain.account.setUser(user);
    guilds.forEach((guild) => {
      // TODO: handle different data modes
      this.domain.guilds.add({
        ...guild,
        ...guild.properties,
      } as unknown as APIGuild);
    });
    users?.forEach((user) => this.domain.users.add(user));

    this.logger.debug(`Stored ${this.domain.guilds.size} guilds`);
    this.logger.debug(`Stored ${this.domain.users.size} users`);

    this.domain.setAppLoading(false);
  };

  public onChannelOpen = (guild_id: Snowflake, channelId: Snowflake) => {
    let payload: GatewayLazyRequestData;

    const guildChannels = this.lazyRequestChannels.get(guild_id);

    if (!guildChannels) {
      payload = {
        guild_id,
        activities: true,
        threads: true,
        typing: true,
        channels: {
          [channelId]: [[0, 99]],
        },
      };
      this.lazyRequestChannels.set(guild_id, [channelId]);

      this.sendJson({
        op: GatewayOpcodes.LazyRequest,
        d: payload,
      } as GatewayLazyRequest);
    } else {
      if (guildChannels.includes(channelId)) return;

      const d: Record<string, [number, number][]> = {};
      guildChannels.forEach((x) => (d[x] = [[0, 99]]));
      payload = {
        guild_id,
        channels: d,
      };
      guildChannels.push(channelId);

      this.sendJson({
        op: GatewayOpcodes.LazyRequest,
        d: payload,
      } as GatewayLazyRequest);
    }
  };

  // Start dispatch handlers

  private onGuildCreate = (data: GatewayGuildCreateDispatchData) => {
    this.logger.debug("Received guild create event");
    this.domain.guilds.add({
      ...data,
      ...data.properties,
    } as unknown as APIGuild);
  };

  private onGuildUpdate = (data: GatewayGuildModifyDispatchData) => {
    this.logger.debug("Received guild update event");
    this.domain.guilds.get(data.id)?.update(data);
  };

  private onGuildDelete = (data: GatewayGuildDeleteDispatchData) => {
    this.logger.debug("Received guild delete event");
    this.domain.guilds.remove(data.id);
  };

  private onGuildMemberListUpdate = (
    data: GatewayGuildMemberListUpdateDispatchData
  ) => {
    this.logger.debug("Received GuildMemberListUpdate event");
    const { guild_id } = data;
    const guild = this.domain.guilds.get(guild_id);

    if (!guild) {
      this.logger.warn(`[GuildMemberListUpdate] Guild ${guild_id} not found`);
      return;
    }

    guild.onMemberListUpdate(data);
  };

  private onChannelCreate = (data: GatewayChannelCreateDispatchData) => {
    if (data.type === ChannelType.DM || data.type === ChannelType.GroupDM)
      return; // TODO: handle these

    const guild = this.domain.guilds.get(data.guild_id!);
    if (!guild) {
      this.logger.warn(
        `[ChannelCreate] Guild ${data.guild_id} not found for channel ${data.id}`
      );
      return;
    }
    this.domain.channels.add(data);
  };

  private onChannelDelete = (data: GatewayChannelDeleteDispatchData) => {
    if (data.type === ChannelType.DM || data.type === ChannelType.GroupDM)
      return; // TODO: handle these

    const guild = this.domain.guilds.get(data.guild_id!);
    if (!guild) {
      this.logger.warn(
        `[ChannelDelete] Guild ${data.guild_id} not found for channel ${data.id}`
      );
      return;
    }
    this.domain.channels.remove(data.id);
  };

  private onMessageCreate = (data: GatewayMessageCreateDispatchData) => {
    const channel = this.domain.channels.get(data.channel_id);
    if (!channel) {
      this.logger.warn(
        `[MessageCreate] Channel ${data.channel_id} not found for message ${data.id}`
      );
      return;
    }

    channel.messages.add(data);
  };

  private onMessageUpdate = (data: GatewayMessageUpdateDispatchData) => {
    const channel = this.domain.channels.get(data.channel_id);
    if (!channel) {
      this.logger.warn(
        `[MessageCreate] Channel ${data.channel_id} not found for message ${data.id}`
      );
      return;
    }

    // channel.messages.update(data)
  };

  private onMessageDelete = (data: GatewayMessageDeleteDispatchData) => {
    const channel = this.domain.channels.get(data.channel_id);
    if (!channel) {
      this.logger.warn(
        `[MessageCreate] Channel ${data.channel_id} not found for message ${data.id}`
      );
      return;
    }

    channel.messages.remove(data.id);
  };
}
