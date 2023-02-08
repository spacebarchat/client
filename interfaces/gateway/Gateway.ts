import {
  APIChannel,
  APIGuildMember,
  APIGuildScheduledEvent,
  APIStageInstance,
  APIUser,
  GatewayDispatchEvents,
  GatewayOpcodes,
  GatewayPresenceUpdate,
  GatewayVoiceState,
} from "discord-api-types/v9";
import { APIGuild } from "../api/Guild";
import { IUserSettings } from "../api/UserSettings";

interface BasePayload {
  /**
   * Opcode for the payload
   */
  op: GatewayOpcodes;
  /**
   * Event data
   */
  d?: unknown;
  /**
   * Sequence number, used for resuming sessions and heartbeats
   */
  s: number;
  /**
   * The event name for this payload
   */
  t?: string;
}

interface DataPayload<Event extends GatewayDispatchEvents, D = unknown>
  extends BasePayload {
  op: GatewayOpcodes.Dispatch;
  t: Event;
  d: D;
}

export interface GatewayReadyDispatchData {
  v: number;
  user: APIUser;
  private_channels: APIChannel[]; // this will be empty for bots
  session_id: string; // resuming
  guilds: APIGuild[];
  analytics_token?: string;
  // connected_accounts?: APIConnectedAccount[];
  consents?: {
    personalization?: {
      consented?: boolean;
    };
  };
  country_code?: string; // e.g. DE
  friend_suggestion_count?: number;
  geo_ordered_rtc_regions?: string[]; // ["europe","russie","india","us-east","us-central"]
  experiments?: [number, number, number, number, number][];
  guild_experiments?: [
    // ? what are guild_experiments?
    // this is the structure of it:
    number,
    null,
    number,
    [[number, { e: number; s: number }[]]],
    [number, [[number, [number, number]]]],
    { b: number; k: bigint[] }[]
  ][];
  guild_join_requests?: unknown[]; // ? what is this? this is new
  shard?: [number, number];
  user_settings?: IUserSettings;
  // relationships?: APIRelationship[]; // TODO
  // read_state: {
  //   entries: APIReadState[]; // TODO
  //   partial: boolean;
  //   version: number;
  // };
  // user_guild_settings?: {
  //   entries: UserGuildSettings[];
  //   version: number;
  //   partial: boolean;
  // };
  application?: {
    id: string;
    flags: number;
  };
  merged_members?: APIGuildMember[][];
  // probably all users who the user is in contact with
  users?: APIUser[];
  sessions: unknown[];
}

export interface GatewayGuildCreateDispatchData extends APIGuild {
  /**
   * When this guild was joined at
   *
   * **This field is only sent within the [GUILD_CREATE](https://discord.com/developers/docs/topics/gateway-events#guild-create) event**
   */
  joined_at: string;
  /**
   * `true` if this is considered a large guild
   *
   * **This field is only sent within the [GUILD_CREATE](https://discord.com/developers/docs/topics/gateway-events#guild-create) event**
   */
  large: boolean;
  /**
   * `true` if this guild is unavailable due to an outage
   */
  unavailable?: boolean;
  /**
   * Total number of members in this guild
   *
   * **This field is only sent within the [GUILD_CREATE](https://discord.com/developers/docs/topics/gateway-events#guild-create) event**
   */
  member_count: number;
  /**
   * States of members currently in voice channels; lacks the `guild_id` key
   *
   * **This field is only sent within the [GUILD_CREATE](https://discord.com/developers/docs/topics/gateway-events#guild-create) event**
   *
   * See https://discord.com/developers/docs/resources/voice#voice-state-object
   */
  voice_states: Omit<GatewayVoiceState, "guild_id">[];
  /**
   * Users in the guild
   *
   * **This field is only sent within the [GUILD_CREATE](https://discord.com/developers/docs/topics/gateway-events#guild-create) event**
   *
   * See https://discord.com/developers/docs/resources/guild#guild-member-object
   */
  members: APIGuildMember[];
  /**
   * Channels in the guild
   *
   * **This field is only sent within the [GUILD_CREATE](https://discord.com/developers/docs/topics/gateway-events#guild-create) event**
   *
   * See https://discord.com/developers/docs/resources/channel#channel-object
   */
  channels: APIChannel[];
  /**
   * Threads in the guild
   *
   * **This field is only sent within the [GUILD_CREATE](https://discord.com/developers/docs/topics/gateway-events#guild-create) event**
   *
   * See https://discord.com/developers/docs/resources/channel#channel-object
   */
  threads: APIChannel[];
  /**
   * Presences of the members in the guild, will only include non-offline members if the size is greater than `large_threshold`
   *
   * **This field is only sent within the [GUILD_CREATE](https://discord.com/developers/docs/topics/gateway-events#guild-create) event**
   *
   * See https://discord.com/developers/docs/topics/gateway-events#presence-update
   */
  presences: GatewayPresenceUpdate[];
  /**
   * The stage instances in the guild
   *
   * **This field is only sent within the [GUILD_CREATE](https://discord.com/developers/docs/topics/gateway-events#guild-create) event**
   *
   * See https://discord.com/developers/docs/resources/stage-instance#stage-instance-object-stage-instance-structure
   */
  stage_instances: APIStageInstance[];
  /**
   * The scheduled events in the guild
   *
   * **This field is only sent within the [GUILD_CREATE](https://discord.com/developers/docs/topics/gateway-events#guild-create) event**
   *
   * https://discord.com/developers/docs/resources/guild-scheduled-event#guild-scheduled-event-object
   */
  guild_scheduled_events: APIGuildScheduledEvent[];
}

export declare type GatewayGuildCreateDispatch = DataPayload<
  GatewayDispatchEvents.GuildCreate,
  GatewayGuildCreateDispatchData
>;
