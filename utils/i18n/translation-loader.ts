import { BackendModule } from "i18next";
import * as config from "./i18n";

const translationLoader: BackendModule = {
  type: "backend",
  init: () => {},
  read: function (
    language: string,
    namespace: string,
    callback: (error: any, resource: any) => void
  ) {
    let resource,
      error = null;
    try {
      resource =
        config.supportedLocales[language].translationFileLoader()[namespace];
    } catch (_error) {
      error = _error;
    }
    callback(error, resource);
  },
};
export default translationLoader;
