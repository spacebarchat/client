import { Snowflake } from "@puyodead1/fosscord-api-types/globals";
import { DomainStore } from "../stores/DomainStore";

function useGuild(guildId: Snowflake, domain: DomainStore) {
  const guild = domain.guilds.get(guildId);
  return guild;
}

export default useGuild;
