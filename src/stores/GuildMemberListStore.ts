import {
  GatewayGuildMemberListUpdateDispatchData,
  GatewayGuildMemberListUpdateGroup,
  GatewayGuildMemberListUpdateOperation,
} from '@puyodead1/fosscord-api-types/v9';
import {action, observable} from 'mobx';

import BaseStore from './BaseStore';
import {DomainStore} from './DomainStore';
import Guild from './objects/Guild';
import GuildMember from './objects/GuildMember';

export default class GuildMemberListStore extends BaseStore {
  private readonly domain: DomainStore;

  id: string;
  private readonly guild: Guild;
  @observable groups: GatewayGuildMemberListUpdateGroup[] = [];
  @observable member_count: number;
  @observable online_count: number;
  @observable listData: {
    title: string;
    data: GuildMember[];
  }[] = [];

  constructor(
    domain: DomainStore,
    guild: Guild,
    data: GatewayGuildMemberListUpdateDispatchData,
  ) {
    super();
    this.domain = domain;
    this.guild = guild;

    const {groups, id, member_count, online_count, ops} = data;

    this.id = id;
    this.groups = groups;
    this.member_count = member_count;
    this.online_count = online_count;
    this.computeListData(data.ops);
  }

  @action
  update(data: GatewayGuildMemberListUpdateDispatchData) {
    const {groups, id, member_count, online_count, ops} = data;

    this.id = id;
    this.groups = groups;
    this.member_count = member_count;
    this.online_count = online_count;
    this.computeListData(data.ops);
  }

  private computeListData(
    ops: GatewayGuildMemberListUpdateDispatchData['ops'],
  ) {
    for (const i of ops) {
      const {op, items, range, item, index} = i;
      switch (op) {
        case GatewayGuildMemberListUpdateOperation.SYNC:
          let listData: {
            title: string;
            data: GuildMember[];
          }[] = [];

          for (const item of items) {
            if ('group' in item) {
              const role = this.guild.roles.get(item.group.id);

              listData.push({
                title: `${(role?.name ?? item.group.id).toUpperCase()}`,
                data: [],
              });
            } else {
              // try to get the existing member
              if (item.member.user?.id) {
                const member = this.guild.members.get(item.member.user.id);
                if (member) {
                  listData[listData.length - 1].data.push(member);
                  return;
                }
              }
              listData[listData.length - 1].data.push(
                new GuildMember(this.domain, this.guild, item.member),
              );
            }
          }

          // remove empty groups
          listData = listData.filter(i => i.data.length > 0);
          // add the number of members in each group to the group name
          listData = listData.map(i => ({
            ...i,
            title: `${i.title} - ${i.data.length}`,
          }));

          // hide offline group if it has more than 100 members
          listData = listData.filter(
            i =>
              !(
                i.title.toLowerCase().startsWith('offline') &&
                i.data.length >= 100
              ),
          );

          this.listData = listData;

          break;
        case GatewayGuildMemberListUpdateOperation.DELETE:
          //   for (const item of items) {
          //     if ("group" in item) {
          //       this.logger.debug(
          //         `Delete group ${item.group.id} from ${this.id}`,
          //         i
          //       );
          //       //   this.listData.splice(range[0], 1);
          //     } else {
          //       //   this.listData[range[0]].data.splice(range[1], 1);
          //       this.logger.debug(
          //         `Delete member ${item.member.user.username} from ${this.id}`,
          //         i
          //       );
          //     }
          //   }
          this.logger.debug('DELETE', item);
          break;
        case GatewayGuildMemberListUpdateOperation.UPDATE:
          this.logger.debug('UPDATE', item);
          //   for (const item of items) {
          //     if ("group" in item) {
          //       //   this.listData[range[0]].title = item.group.id;
          //       this.logger.debug(
          //         `Update group ${item.group.id} from ${this.id}`,
          //         i
          //       );
          //     } else {
          //       //   this.listData[range[0]].data[range[1]] = item.member;
          //       this.logger.debug(
          //         `Update member ${item.member.user.username} from ${this.id}`,
          //         i
          //       );
          //     }
          //   }
          break;
        case GatewayGuildMemberListUpdateOperation.INSERT:
          if ('group' in item) {
            this.listData.splice(index, 0, {
              title: item.group.id,
              data: [],
            });
          } else {
            // try to get the existing member
            if (item.member.user?.id) {
              const member = this.guild.members.get(item.member.user.id);
              if (member) {
                this.listData[index].data.push(member);
                return;
              }
            }

            this.listData[index].data.splice(
              index,
              0,
              new GuildMember(this.domain, this.guild, item.member),
            );
          }
          break;
        default:
          this.logger.warn(`Uknown OP: ${op}`);
          break;
      }
    }
  }
}
