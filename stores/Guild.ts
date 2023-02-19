import {
  APIChannel,
  APIEmoji,
  APIGuild,
  APIGuildWelcomeScreen,
  APISticker,
  ChannelType,
  GatewayGuildMemberListUpdateDispatchData,
  GatewayGuildModifyDispatchData,
  GuildDefaultMessageNotifications,
  GuildExplicitContentFilter,
  GuildFeature,
  GuildHubType,
  GuildMFALevel,
  GuildNSFWLevel,
  GuildPremiumTier,
  GuildSystemChannelFlags,
  GuildVerificationLevel,
} from "@puyodead1/fosscord-api-types/v9";
import { action, makeObservable, observable } from "mobx";
import BaseStore from "./BaseStore";
import ChannelStore from "./Channel";
import { DomainStore } from "./DomainStore";
import GuildMemberListStore from "./GuildMemberListStore";
import GuildMembersStore from "./GuildMembersStore";
import RolesStore from "./RolesStore";

export default class Guild extends BaseStore {
  private readonly domain: DomainStore;

  id: string;
  @observable icon_hash?: string | null | undefined;
  @observable discovery_splash: string | null;
  @observable owner?: boolean | undefined;
  @observable owner_id: string;
  @observable permissions?: string | undefined;
  @observable region: string;
  @observable afk_channel_id: string | null;
  @observable afk_timeout: 60 | 300 | 900 | 1800 | 3600;
  @observable widget_enabled?: boolean | undefined;
  @observable widget_channel_id?: string | null | undefined;
  @observable verification_level: GuildVerificationLevel;
  @observable default_message_notifications: GuildDefaultMessageNotifications;
  @observable explicit_content_filter: GuildExplicitContentFilter;
  @observable roles: RolesStore;
  @observable emojis: APIEmoji[];
  @observable features: GuildFeature[];
  @observable mfa_level: GuildMFALevel;
  @observable application_id: string | null;
  @observable system_channel_id: string | null;
  @observable system_channel_flags: GuildSystemChannelFlags;
  @observable rules_channel_id: string | null;
  @observable max_presences?: number | null | undefined;
  @observable max_members?: number | undefined;
  @observable vanity_url_code: string | null;
  @observable description: string | null;
  @observable banner: string | null;
  @observable premium_tier: GuildPremiumTier;
  @observable premium_subscription_count?: number | undefined;
  @observable preferred_locale: string;
  @observable public_updates_channel_id: string | null;
  @observable max_video_channel_users?: number | undefined;
  @observable approximate_member_count?: number | undefined;
  @observable approximate_presence_count?: number | undefined;
  @observable welcome_screen?: APIGuildWelcomeScreen | undefined;
  @observable nsfw_level: GuildNSFWLevel;
  @observable stickers: APISticker[];
  @observable premium_progress_bar_enabled: boolean;
  hub_type: GuildHubType | null;
  @observable name: string;
  @observable icon: string | null;
  @observable splash: string | null;
  @observable memberList: GuildMemberListStore | null = null;
  @observable channels = observable.map<string, ChannelStore>();
  @observable members: GuildMembersStore;

  constructor(domain: DomainStore, guild: APIGuild) {
    super();
    this.domain = domain;
    this.roles = new RolesStore(domain);
    this.members = new GuildMembersStore(domain, this);

    this.id = guild.id;
    this.name = guild.name;
    this.icon = guild.icon;
    this.icon_hash = guild.icon_hash;
    this.splash = guild.splash;
    this.discovery_splash = guild.discovery_splash;
    this.owner = guild.owner;
    this.owner_id = guild.owner_id;
    this.permissions = guild.permissions;
    this.region = guild.region;
    this.afk_channel_id = guild.afk_channel_id;
    this.afk_timeout = guild.afk_timeout;
    this.widget_enabled = guild.widget_enabled;
    this.widget_channel_id = guild.widget_channel_id;
    this.verification_level = guild.verification_level;
    this.default_message_notifications = guild.default_message_notifications;
    this.explicit_content_filter = guild.explicit_content_filter;
    this.roles.addAll(guild.roles);
    this.emojis = guild.emojis;
    this.features = guild.features;
    this.mfa_level = guild.mfa_level;
    this.application_id = guild.application_id;
    this.system_channel_id = guild.system_channel_id;
    this.system_channel_flags = guild.system_channel_flags;
    this.rules_channel_id = guild.rules_channel_id;
    this.max_presences = guild.max_presences;
    this.max_members = guild.max_members;
    this.vanity_url_code = guild.vanity_url_code;
    this.description = guild.description;
    this.banner = guild.banner;
    this.premium_tier = guild.premium_tier;
    this.premium_subscription_count = guild.premium_subscription_count;
    this.preferred_locale = guild.preferred_locale;
    this.public_updates_channel_id = guild.public_updates_channel_id;
    this.max_video_channel_users = guild.max_video_channel_users;
    this.approximate_member_count = guild.approximate_member_count;
    this.approximate_presence_count = guild.approximate_presence_count;
    this.welcome_screen = guild.welcome_screen;
    this.nsfw_level = guild.nsfw_level;
    this.stickers = guild.stickers;
    this.premium_progress_bar_enabled = guild.premium_progress_bar_enabled;
    this.hub_type = guild.hub_type;

    if (guild.channels)
      guild.channels
        .sort((a, b) => a.position - b.position)
        .forEach((x) => {
          const c = this.domain.channels.add(x as APIChannel);
          c && this.channels.set(c.id, c);
        });

    makeObservable(this);
  }

  @action
  update(guild: GatewayGuildModifyDispatchData) {
    Object.assign(this, guild);
  }

  @action
  onMemberListUpdate(data: GatewayGuildMemberListUpdateDispatchData) {
    if (this.memberList) {
      this.memberList.update(data);
    } else {
      this.memberList = new GuildMemberListStore(this, data);
    }
  }

  get channelList(): {
    title?: string;
    data: ChannelStore[];
  }[] {
    const channels = this.domain.channels.getGuildChannels(this.id);
    const channelsWithoutCategory = channels.filter(
      (x) => !x.parent_id && x.type !== ChannelType.GuildCategory
    ); // TODO: we should be checking if its a guild channel, not just not a category

    const mapped = channels
      .filter((x) => x.type === ChannelType.GuildCategory)
      .map((category) => {
        const channelsInCategory = channels.filter(
          (channel) => channel.parent_id === category.id
        );
        return {
          title: category.name!,
          data: channelsInCategory,
        };
      });

    return [...mapped, { data: channelsWithoutCategory }];
  }
}
