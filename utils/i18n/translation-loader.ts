import { BackendModule } from "i18next";
import * as config from "./i18n";
import { localeLogger } from "./locale-detector";

const translationLoader: BackendModule & { backendOptions: object } = {
  type: "backend",
  backendOptions: {},
  init: function (services, backendOptions, i18nextOptions) {
    this.backendOptions = backendOptions;
  },
  read: function (
    language: string,
    namespace: string,
    callback: (error: any, resource: any) => void
  ) {
    let resource,
      error = null;
    try {
      if (!(language in config.locales)) {
        localeLogger.warn(
          `Language ${language} not found, falling back to ${config.fallback}`
        );
        language = config.fallback;
      }
      const locale = config.locales[language];
      if (!(namespace in locale))
        throw new Error(
          `Namespace ${namespace} not found for locale ${language}`
        );
      resource = locale[namespace];
    } catch (_error) {
      console.error(language, namespace, _error);
      error = _error;
    }
    callback(error, resource);
  },
};
export default translationLoader;
