import {
  APIChannel,
  APIInvite,
  APIOverwrite,
  APIReadState,
  APIUser,
  APIWebhook,
  ChannelType,
  GatewayVoiceState,
  RESTGetAPIChannelMessagesQuery,
  RESTGetAPIChannelMessagesResult,
  RESTPostAPIChannelMessageJSONBody,
  RESTPostAPIChannelMessageResult,
  Snowflake as SnowflakeType,
} from '@puyodead1/fosscord-api-types/v9';
import {action, makeObservable, observable} from 'mobx';
import {Routes} from '../../utils/Endpoints';
import Snowflake from '../../utils/Snowflake';
import BaseStore from '../BaseStore';
import {DomainStore} from '../DomainStore';
import MessageStore from '../MessageStore';

export default class Channel extends BaseStore {
  private readonly domain: DomainStore;

  id: SnowflakeType;
  createdAt: Date;
  @observable name?: string;
  @observable icon?: string | null;
  type: number;
  @observable recipients?: APIUser[];
  @observable lastMessageId?: SnowflakeType;
  guildId?: SnowflakeType;
  @observable parentId: SnowflakeType;
  ownerId?: SnowflakeType;
  @observable lastPinTimestamp?: number;
  @observable defaultAutoArchiveDuration?: number;
  @observable position?: number;
  @observable permissionOverwrites?: APIOverwrite[];
  @observable videoQualityMode?: number;
  @observable bitrate?: number;
  @observable userLimit?: number;
  @observable nsfw: boolean;
  @observable rateLimiTPerUser?: number;
  @observable topic?: string;
  @observable invites?: APIInvite[];
  @observable retentionPolicyId?: string;
  @observable messages: MessageStore;
  @observable voiceStates?: GatewayVoiceState[];
  @observable readStates?: APIReadState[];
  @observable webhooks?: APIWebhook[];
  @observable flags: number;
  @observable defaultThreadRateLimitPerUser: number;
  @observable channelIcon?: string;
  private hasFetchedMessages = false;

  constructor(domain: DomainStore, channel: APIChannel) {
    super();
    this.domain = domain;

    this.messages = new MessageStore(domain);

    this.id = channel.id;
    this.createdAt = new Date(channel.created_at);
    this.name = channel.name;
    this.icon = channel.icon;
    this.type = channel.type;
    this.recipients = channel.recipients;
    this.lastMessageId = channel.last_message_id;
    this.guildId = channel.guild_id;
    this.parentId = channel.parent_id;
    this.ownerId = channel.owner_id;
    this.lastPinTimestamp = channel.last_pin_timestamp;
    this.defaultAutoArchiveDuration = channel.default_auto_archive_duration;
    this.position = channel.position;
    this.permissionOverwrites = channel.permission_overwrites;
    this.videoQualityMode = channel.video_quality_mode;
    this.bitrate = channel.bitrate;
    this.userLimit = channel.user_limit;
    this.nsfw = channel.nsfw;
    this.rateLimiTPerUser = channel.rate_limit_per_user;
    this.topic = channel.topic;
    this.invites = channel.invites;
    this.retentionPolicyId = channel.retention_policy_id;
    this.voiceStates = channel.voice_states;
    this.readStates = channel.read_states;
    this.webhooks = channel.webhooks;
    this.flags = channel.flags;
    this.defaultThreadRateLimitPerUser =
      channel.default_thread_rate_limit_per_user;

    if (channel.messages) {
      this.messages.addAll(channel.messages);
    }

    switch (this.type) {
      case ChannelType.GuildText:
        this.channelIcon = 'pound';
        break;
      case ChannelType.GuildVoice:
        this.channelIcon = 'volume-high';
        break;
      case ChannelType.GuildAnnouncement:
      case ChannelType.AnnouncementThread:
        this.channelIcon = 'bullhorn-variant';
        break;
      case ChannelType.GuildStore:
      case ChannelType.Transactional:
        this.channelIcon = 'tag';
        break;
      case ChannelType.Encrypted:
      case ChannelType.EncryptedThread:
        this.channelIcon = 'message-lock';
        break;
      case ChannelType.PublicThread:
      case ChannelType.PrivateThread:
        this.channelIcon = 'comment-text-multiple';
        break;
      case ChannelType.GuildStageVoice:
        this.channelIcon = 'broadcast';
        break;
      case ChannelType.GuildForum:
        this.channelIcon = 'forum';
        break;
      case ChannelType.TicketTracker:
        this.channelIcon = 'ticket-outline';
        break;
      case ChannelType.KanBan:
        this.channelIcon = 'developer-board';
        break;
      case ChannelType.VoicelessWhiteboard:
        this.channelIcon = 'draw';
        break;
      case ChannelType.GuildDirectory:
        this.channelIcon = 'folder';
        break;
    }

    makeObservable(this);
  }

  @action
  update(data: APIChannel) {
    Object.assign(this, data);
  }

  @action
  async getChannelMessages(
    domain: DomainStore,
    isInitial: boolean,
    limit?: number,
    before?: SnowflakeType,
    after?: SnowflakeType,
    around?: SnowflakeType,
  ) {
    if (isInitial && this.hasFetchedMessages) {
      return;
    }

    let opts: RESTGetAPIChannelMessagesQuery = {
      limit: limit || 50,
    };

    if (before) {
      opts = {...opts, before};
    }
    if (after) {
      opts = {...opts, after};
    }
    if (around) {
      opts = {...opts, around};
    }

    this.hasFetchedMessages = true;
    this.logger.info(`Fetching messags for ${this.id}`);
    // TODO: catch errors
    const messages = await domain.rest.get<RESTGetAPIChannelMessagesResult>(
      Routes.channelMessages(this.id),
      opts,
    );
    this.messages.addAll(
      messages.filter(x => !this.messages.has(x.id)).reverse(),
      // .sort((a, b) => {
      //   const aTimestamp = new Date(a.timestamp as unknown as string);
      //   const bTimestamp = new Date(b.timestamp as unknown as string);
      //   return aTimestamp.getTime() - bTimestamp.getTime();
      // })
    );
  }

  @action
  async sendMessage(data: RESTPostAPIChannelMessageJSONBody) {
    data.nonce = Snowflake.generate();
    // check if the message is empty, contains only spaces, or contains only newlines
    if (
      !data.content ||
      !data.content.trim() ||
      !data.content.replace(/\r?\n|\r/g, '')
    ) {
      return;
    }

    // const partial = {
    //   ...data,
    //   id: data.nonce,
    //   author: {
    //     id: this.domain.account!.id,
    //     username: this.domain.account!.username,
    //     discriminator: this.domain.account!.discriminator,
    //     avatar: this.domain.account!.avatar,
    //   },
    //   channel_id: this.id,
    //   timestamp: new Date().toISOString(),
    //   edited_timestamp: null,
    //   flags: undefined,
    //   type: MessageType.Default,
    //   mention_everyone: false,
    //   mentions: [],
    //   mention_roles: [],
    //   attachments: [],
    //   pinned: false,
    //   ghost: true,
    // };

    // this.messages.add(partial as APICustomMessage);
    // TODO: handle errors
    return this.domain.rest
      .post<RESTPostAPIChannelMessageJSONBody, RESTPostAPIChannelMessageResult>(
        Routes.channelMessages(this.id),
        data,
      )
      .then(res => {
        this.messages.add(res);
        return res;
      });
  }
}
