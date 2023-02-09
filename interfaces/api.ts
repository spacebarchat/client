import { Snowflake } from "./common";

export interface APIUnavailableGuild {
  id: Snowflake;
  unavailable?: boolean;
}
