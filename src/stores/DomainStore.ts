import NetInfo, {
  NetInfoState,
  NetInfoSubscription,
} from '@react-native-community/netinfo';
import {action, makeObservable, observable} from 'mobx';
import {createContext} from 'react';
import useLogger from '../hooks/useLogger';
import REST from '../utils/REST';
import AccountStore from './AccountStore';
import BaseStore from './BaseStore';
import ChannelStore from './ChannelStore';
import GatewayStore from './GatewayStore';
import GuildStore from './GuildStore';
import UserStore from './UserStore';

export class DomainStore extends BaseStore {
  @observable isI18NInitialized: boolean = false;
  @observable isDarkTheme: boolean = true;
  @observable account: AccountStore = new AccountStore(this);
  @observable users: UserStore = new UserStore(this);
  @observable guilds: GuildStore = new GuildStore(this);
  @observable channels: ChannelStore = new ChannelStore(this);
  @observable gateway: GatewayStore = new GatewayStore(this);
  @observable isAppLoading: boolean = true;
  @observable isNetworkConnected: boolean | null = null;

  public readonly devSkipAuth = false;
  public rest: REST = new REST(this);
  private readonly networkInfoUnsubscribe: NetInfoSubscription;
  private readonly networkLogger = useLogger('Network');

  constructor() {
    super();

    makeObservable(this);

    this.networkInfoUnsubscribe = NetInfo.addEventListener(
      this.onNetChange.bind(this),
    );
  }

  private onNetChange(state: NetInfoState) {
    this.networkLogger.info(
      `Connection state changed; type: ${state.type}, isConnected: ${state.isConnected}`,
    );
    this.isNetworkConnected = state.isConnected;
  }

  @action
  toggleDarkTheme() {
    this.isDarkTheme = !this.isDarkTheme;
  }

  @action
  setDarkTheme(isDarkTheme: boolean) {
    this.isDarkTheme = isDarkTheme;
  }

  @action
  setAppLoading(isAppLoading: boolean) {
    this.isAppLoading = isAppLoading;
  }

  @action
  setI18NInitialized() {
    this.isI18NInitialized = true;
    // localeLogger.info('I18N Initialized');
  }

  get isAppReady() {
    return !this.isAppLoading && this.isI18NInitialized;
  }
}

export const DomainContext = createContext(new DomainStore());
