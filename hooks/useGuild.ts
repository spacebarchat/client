import { useContext } from "react";
import { Snowflake } from "../interfaces/common";
import { DomainContext } from "../stores/DomainStore";

function useGuild(guildId: Snowflake) {
  const domain = useContext(DomainContext);
  const guild = domain.guild.guilds.get(guildId);
  return guild;
}

export default useGuild;
