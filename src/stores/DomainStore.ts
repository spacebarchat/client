import {APIUser} from '@puyodead1/fosscord-api-types/v9';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo, {
  NetInfoState,
  NetInfoSubscription,
} from '@react-native-community/netinfo';
import {action, computed, makeObservable, observable} from 'mobx';
import {createContext} from 'react';
import {NavigationTheme} from 'react-native-paper/lib/typescript/types';
import {getTheme, ThemeName, themes} from '../constants/Colors';
import useLogger from '../hooks/useLogger';
import {CustomTheme} from '../types';
import REST from '../utils/REST';
import AccountStore from './AccountStore';
import BaseStore from './BaseStore';
import GatewayConnectionStore from './GatewayConnectionStore';
import GuildStore from './GuildStore';
import UserStore from './UserStore';

export class DomainStore extends BaseStore {
  // whether the gateway is ready
  @observable isGatewayReady = false;
  // whether the app is still loading
  @observable isAppLoading = true;

  @observable account: AccountStore | null = null;
  @observable gateway = new GatewayConnectionStore(this);
  @observable guilds = new GuildStore();
  @observable users = new UserStore();
  @observable rest = new REST(this);

  @observable theme: NavigationTheme & CustomTheme = themes.dark;
  @observable isNetworkConnected: boolean | null = null;
  @observable token: string | null = null;
  @observable tokenLoaded = false;
  @observable showFPS = false;

  public readonly devSkipAuth = false;
  private readonly networkInfoUnsubscribe: NetInfoSubscription;
  private readonly networkLogger = useLogger('Network');

  constructor() {
    super();

    makeObservable(this);

    this.networkInfoUnsubscribe = NetInfo.addEventListener(
      this.onNetChange.bind(this),
    );
  }

  @action
  private onNetChange(state: NetInfoState) {
    this.networkLogger.info(
      `Connection state changed; type: ${state.type}, isConnected: ${state.isConnected}`,
    );
    this.isNetworkConnected = state.isConnected;
  }

  @action
  setTheme(value: ThemeName, save = false) {
    const theme = getTheme(value);
    if (!theme) {
      throw new Error(`Theme ${value} not found.`);
    }

    if (save) {
      AsyncStorage.setItem('theme', value, err => {
        if (err) {
          this.logger.error(`Failed to save theme to storage: ${err}`);
          return;
        }
        this.logger.debug(`Saved theme ${value} to storage.`);
      });
    }

    this.theme = theme;
  }

  @action
  setGatewayReady(value: boolean) {
    this.isGatewayReady = value;
  }

  @action
  setAppLoading(value: boolean) {
    this.isAppLoading = value;
  }

  @action
  setUser(user: APIUser) {
    this.account = new AccountStore(user);
  }

  @action
  setShowFPS(value: boolean) {
    this.showFPS = value;
  }

  @action
  setToken(token: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.token = token;

      AsyncStorage.setItem('token', token, err => {
        if (err) {
          return reject(err);
        }

        this.tokenLoaded = true;
        this.logger.debug('Token saved to storage.');
        resolve();
      });
    });
  }

  @action
  async loadToken(): Promise<void> {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem('token', (err, result) => {
        if (err) {
          return reject(err);
        }

        this.tokenLoaded = true;

        if (result) {
          this.logger.debug('Loaded token from storage.');
          this.setToken(result);
          resolve();
        } else {
          this.logger.debug('No token found in storage.');
          this.setGatewayReady(true);
          resolve();
        }
      });
    });
  }

  @action
  logout() {
    this.token = null;
    AsyncStorage.removeItem('token', err => {
      if (err) {
        console.error(err);
      } else {
        console.debug('Token removed from storage.');
      }
    });
  }

  @action
  loadTheme() {
    AsyncStorage.getItem('theme', (err, result) => {
      if (err) {
        this.logger.error(`Failed to load theme: ${err}`);
      } else if (result) {
        this.logger.debug(`Loaded theme from storage: ${result}`);
        this.setTheme(result as ThemeName, false);
      }
    });
  }

  @computed
  /**
   * Whether the app is done loading and ready to be displayed
   */
  get isAppReady() {
    return !this.isAppLoading && this.isGatewayReady && this.isNetworkConnected;
  }
}

export const DomainContext = createContext(new DomainStore());
