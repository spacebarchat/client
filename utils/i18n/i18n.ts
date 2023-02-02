export const fallback = "en";

export const supportedLocales: { [key: string]: any } = {
  en: {
    name: "English",
    translationFileLoader: () => require("../../locales/en.json"),
    momentLocaleLoader: () => Promise.resolve(),
  },
  // es: {
  //   name: "Español",

  //   translationFileLoader: () => require("../../locales/es.json"),
  //   // @ts-expect-error moment doesn't let me import this
  //   momentLocaleLoader: () => import("moment/locale/es"),
  // },
};

export const defaultNamespace = "common";
export const namespaces = [
  "common",
  "LoginScreen",
  "RegisterScreen",
  "NotFoundScreen",
];
