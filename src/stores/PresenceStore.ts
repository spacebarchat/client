import {
  GatewayActivity,
  GatewayGuildMemberListUpdateMember,
  GatewayPresenceClientStatus,
  GatewayPresenceUpdate,
  PresenceUpdateStatus,
  Snowflake,
} from '@puyodead1/fosscord-api-types/v9';
import {action, makeObservable, observable} from 'mobx';
import {useTheme} from 'react-native-paper';
import {OneKeyFrom} from '../interfaces/common';
import {CustomTheme} from '../types';
import BaseStore from './BaseStore';
import {DomainStore} from './DomainStore';

export default class PresenceStore extends BaseStore {
  private readonly domain: DomainStore;
  @observable presences = observable.map<Snowflake, PresenceUpdateStatus>();
  @observable presencesForGuilds = observable.map<
    Snowflake,
    Map<
      Snowflake,
      Pick<GatewayPresenceUpdate, 'activities' | 'client_status' | 'status'> & {
        timestamp: number;
      }
    >
  >();
  @observable activities = observable.map<Snowflake, GatewayActivity[]>();
  @observable clientStatuses = observable.map<
    Snowflake,
    OneKeyFrom<GatewayPresenceClientStatus>
  >();

  constructor(domain: DomainStore) {
    super();
    this.domain = domain;

    makeObservable(this);
  }

  @action
  add(
    presence:
      | GatewayPresenceUpdate
      | GatewayGuildMemberListUpdateMember['presence'],
  ) {
    if (presence.status) {
      this.presences.set(presence.user.id, presence.status);
    }

    if (presence.activities) {
      this.activities.set(presence.user.id, presence.activities);
    }

    if ('client_status' in presence) {
      this.clientStatuses.set(
        presence.user.id,
        presence.client_status as OneKeyFrom<GatewayPresenceClientStatus>,
      );
    }

    if ('guild_id' in presence) {
      const guild = this.presencesForGuilds.get(presence.guild_id);
      if (guild) {
        guild.set(presence.user.id, {
          activities: presence.activities,
          client_status: presence.client_status,
          status: presence.status,
          timestamp: Date.now(),
        });
      }
    }
  }

  static getStatusColor(status: PresenceUpdateStatus) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const theme = useTheme<CustomTheme>();

    switch (status) {
      case 'online':
        return theme.colors.palette.green80;
      case 'idle':
        return theme.colors.palette.yellow80;
      case 'dnd':
        return theme.colors.palette.red80;
      case 'offline':
      case 'invisible':
        return theme.colors.palette.gray80;
    }
  }

  get size() {
    return this.presences.size;
  }
}
