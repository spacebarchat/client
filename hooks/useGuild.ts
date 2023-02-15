import { Snowflake } from "../interfaces/common";
import { DomainStore } from "../stores/DomainStore";

function useGuild(guildId: Snowflake, domain: DomainStore) {
  const guild = domain.guilds.guilds.get(guildId);
  return guild;
}

export default useGuild;
