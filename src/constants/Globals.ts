import AsyncStorage from '@react-native-async-storage/async-storage';
import useLogger from '../hooks/useLogger';
import {SERVER_URL} from "@env"

interface RouteSettings {
  api: string;
  cdn: string;
  invite: string;
  template: string;
  gift: string;
  scheduledEvent: string;
  gateway: string;
}

export const DefaultRouteSettings: RouteSettings = {
  api: 'https://${SEVER_URL}/api',
  cdn: 'https://${SEVER_URL}',
  invite: 'https://${SEVER_URL}/invite',
  template: 'https://${SEVER_URL}/template',
  gift: 'https://${SEVER_URL}/gift',
  scheduledEvent: 'https://${SEVER_URL}/events',
  gateway: 'wss://${SEVER_URL}',
};

export const Globals: {
  logger: {
    debug: (...args: unknown[]) => void;
    info: (...args: unknown[]) => void;
    warn: (...args: unknown[]) => void;
    error: (...args: unknown[]) => void;
  };
  load: () => Promise<void>;
  save: () => Promise<void>;
  routeSettings: RouteSettings;
} = {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  logger: useLogger('Globals'),
  load: async () => {
    return new Promise((resolve, reject) => {
      Globals.logger.info('Initializing Globals');
      AsyncStorage.getItem('routeSettings')
        .then(settings => {
          if (!settings) {
            return resolve();
          }
          Globals.routeSettings = JSON.parse(settings);
          Globals.logger.info('Loaded route settings from storage');
          resolve();
        })
        .catch(e => {
          Globals.logger.error(
            `Error loading route settings from storage: ${e}`,
          );
          reject();
        });
    });
  },
  save: async () => {
    return new Promise((resolve, reject) => {
      AsyncStorage.setItem(
        'routeSettings',
        JSON.stringify(Globals.routeSettings),
      )
        .then(() => {
          resolve();
        })
        .catch(e => {
          Globals.logger.error(`Error saving route settings to storage: ${e}`);
          reject();
        });
    });
  },
  routeSettings: DefaultRouteSettings,
};
