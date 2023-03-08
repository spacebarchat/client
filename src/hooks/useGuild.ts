import {Snowflake} from '@puyodead1/fosscord-api-types/globals';
import React from 'react';
import {DomainContext} from '../stores/DomainStore';

export default function (guildId: Snowflake) {
  const domain = React.useContext(DomainContext);
  return domain.guilds.get(guildId);
}
