import {
  APIChannel,
  APIGuild,
  APIGuildMember,
  APIUser,
} from "discord-api-types/v9";
import { IUserSettings } from "../api/UserSettings";

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
