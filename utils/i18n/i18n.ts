export const fallback = "en";

export const supportedLocales: { [key: string]: any } = {
  af: {
    name: "Afrikaans",
    translationFileLoader: () => require("../../locales/af.json"),
    // @ts-expect-error types don't exist
    momentLocaleLoader: () => import("moment/locale/af"),
  },
  ar: {
    name: "Arabic",
    translationFileLoader: () => require("../../locales/ar.json"),
    // @ts-expect-error types don't exist
    momentLocaleLoader: () => import("moment/locale/ar"),
  },
  az: {
    name: "Azerbaijani",
    translationFileLoader: () => require("../../locales/az.json"),
    // @ts-expect-error types don't exist
    momentLocaleLoader: () => import("moment/locale/az"),
  },
  be: {
    name: "Belarusian",
    translationFileLoader: () => require("../../locales/be.json"),
    // @ts-expect-error types don't exist
    momentLocaleLoader: () => import("moment/locale/be"),
  },
  ber: {
    name: "Berber languages",
    translationFileLoader: () => require("../../locales/ber.json"),
    momentLocaleLoader: () => Promise.resolve(),
  },
  bg: {
    name: "Bulgarian",
    translationFileLoader: () => require("../../locales/bg.json"),
    // @ts-expect-error types don't exist
    momentLocaleLoader: () => import("moment/locale/bg"),
  },
  bo: {
    name: "Tibetan",
    translationFileLoader: () => require("../../locales/bo.json"),
    // @ts-expect-error types don't exist
    momentLocaleLoader: () => import("moment/locale/bo"),
  },
  ca: {
    name: "Catalan",
    translationFileLoader: () => require("../../locales/ca.json"),
    // @ts-expect-error types don't exist
    momentLocaleLoader: () => import("moment/locale/ca"),
  },
  cs: {
    name: "Czech",
    translationFileLoader: () => require("../../locales/cs.json"),
    // @ts-expect-error types don't exist
    momentLocaleLoader: () => import("moment/locale/cs"),
  },
  da: {
    name: "Danish",
    translationFileLoader: () => require("../../locales/da.json"),
    // @ts-expect-error types don't exist
    momentLocaleLoader: () => import("moment/locale/da"),
  },
  de: {
    name: "German",
    translationFileLoader: () => require("../../locales/de.json"),
    // @ts-expect-error types don't exist
    momentLocaleLoader: () => import("moment/locale/de"),
  },
  el: {
    name: "Modern Greek (1453-)",
    translationFileLoader: () => require("../../locales/el.json"),
    // @ts-expect-error types don't exist
    momentLocaleLoader: () => import("moment/locale/el"),
  },
  en: {
    name: "English",
    translationFileLoader: () => require("../../locales/en.json"),
    momentLocaleLoader: () => Promise.resolve(),
  },
  eo: {
    name: "Esperanto",
    translationFileLoader: () => require("../../locales/eo.json"),
    // @ts-expect-error types don't exist
    momentLocaleLoader: () => import("moment/locale/eo"),
  },
  es: {
    name: "Spanish",
    translationFileLoader: () => require("../../locales/es.json"),
    // @ts-expect-error types don't exist
    momentLocaleLoader: () => import("moment/locale/es"),
  },
  eu: {
    name: "Basque",
    translationFileLoader: () => require("../../locales/eu.json"),
    // @ts-expect-error types don't exist
    momentLocaleLoader: () => import("moment/locale/eu"),
  },
  fa: {
    name: "Persian",
    translationFileLoader: () => require("../../locales/fa.json"),
    // @ts-expect-error types don't exist
    momentLocaleLoader: () => import("moment/locale/fa"),
  },
  fi: {
    name: "Finnish",
    translationFileLoader: () => require("../../locales/fi.json"),
    // @ts-expect-error types don't exist
    momentLocaleLoader: () => import("moment/locale/fi"),
  },
  fr: {
    name: "French",
    translationFileLoader: () => require("../../locales/fr.json"),
    // @ts-expect-error types don't exist
    momentLocaleLoader: () => import("moment/locale/fr"),
  },
  gn: {
    name: "Guarani",
    translationFileLoader: () => require("../../locales/gn.json"),
    // @ts-expect-error types don't exist
    momentLocaleLoader: () => import("moment/locale/gn"),
  },
  ha: {
    name: "Hausa",
    translationFileLoader: () => require("../../locales/ha.json"),
    // @ts-expect-error types don't exist
    momentLocaleLoader: () => import("moment/locale/ha"),
  },
  he: {
    name: "Hebrew",
    translationFileLoader: () => require("../../locales/he.json"),
    // @ts-expect-error types don't exist
    momentLocaleLoader: () => import("moment/locale/he"),
  },
  hi: {
    name: "Hindi",
    translationFileLoader: () => require("../../locales/hi.json"),
    // @ts-expect-error types don't exist
    momentLocaleLoader: () => import("moment/locale/hi"),
  },
  hr: {
    name: "Croatian",
    translationFileLoader: () => require("../../locales/hr.json"),
    // @ts-expect-error types don't exist
    momentLocaleLoader: () => import("moment/locale/hr"),
  },
  hu: {
    name: "Hungarian",
    translationFileLoader: () => require("../../locales/hu.json"),
    // @ts-expect-error types don't exist
    momentLocaleLoader: () => import("moment/locale/hu"),
  },
  id: {
    name: "Indonesian",
    translationFileLoader: () => require("../../locales/id.json"),
    // @ts-expect-error types don't exist
    momentLocaleLoader: () => import("moment/locale/id"),
  },
  it: {
    name: "Italian",
    translationFileLoader: () => require("../../locales/it.json"),
    // @ts-expect-error types don't exist
    momentLocaleLoader: () => import("moment/locale/it"),
  },
  ja: {
    name: "Japanese",
    translationFileLoader: () => require("../../locales/ja.json"),
    // @ts-expect-error types don't exist
    momentLocaleLoader: () => import("moment/locale/ja"),
  },
  jv: {
    name: "Javanese",
    translationFileLoader: () => require("../../locales/jv.json"),
    // @ts-expect-error types don't exist
    momentLocaleLoader: () => import("moment/locale/jv"),
  },
  kk: {
    name: "Kazakh",
    translationFileLoader: () => require("../../locales/kk.json"),
    // @ts-expect-error types don't exist
    momentLocaleLoader: () => import("moment/locale/kk"),
  },
  ko: {
    name: "Korean",
    translationFileLoader: () => require("../../locales/ko.json"),
    // @ts-expect-error types don't exist
    momentLocaleLoader: () => import("moment/locale/ko"),
  },
  ku: {
    name: "Kurdish",
    translationFileLoader: () => require("../../locales/ku.json"),
    // @ts-expect-error types don't exist
    momentLocaleLoader: () => import("moment/locale/ku"),
  },
  la: {
    name: "Latin",
    translationFileLoader: () => require("../../locales/la.json"),
    // @ts-expect-error types don't exist
    momentLocaleLoader: () => import("moment/locale/la"),
  },
  lt: {
    name: "Lithuanian",
    translationFileLoader: () => require("../../locales/lt.json"),
    // @ts-expect-error types don't exist
    momentLocaleLoader: () => import("moment/locale/lt"),
  },
  mi: {
    name: "Maori",
    translationFileLoader: () => require("../../locales/mi.json"),
    // @ts-expect-error types don't exist
    momentLocaleLoader: () => import("moment/locale/mi"),
  },
  mn: {
    name: "Mongolian",
    translationFileLoader: () => require("../../locales/mn.json"),
    // @ts-expect-error types don't exist
    momentLocaleLoader: () => import("moment/locale/mn"),
  },
  mr: {
    name: "Marathi",
    translationFileLoader: () => require("../../locales/mr.json"),
    // @ts-expect-error types don't exist
    momentLocaleLoader: () => import("moment/locale/mr"),
  },
  nl: {
    name: "Dutch",
    translationFileLoader: () => require("../../locales/nl.json"),
    // @ts-expect-error types don't exist
    momentLocaleLoader: () => import("moment/locale/nl"),
  },
  nn: {
    name: "Norwegian Nynorsk",
    translationFileLoader: () => require("../../locales/nn.json"),
    // @ts-expect-error types don't exist
    momentLocaleLoader: () => import("moment/locale/nn"),
  },
  no: {
    name: "Norwegian",
    translationFileLoader: () => require("../../locales/no.json"),
    // @ts-expect-error types don't exist
    momentLocaleLoader: () => import("moment/locale/no"),
  },
  pa: {
    name: "Panjabi",
    translationFileLoader: () => require("../../locales/pa.json"),
    // @ts-expect-error types don't exist
    momentLocaleLoader: () => import("moment/locale/pa"),
  },
  pl: {
    name: "Polish",
    translationFileLoader: () => require("../../locales/pl.json"),
    // @ts-expect-error types don't exist
    momentLocaleLoader: () => import("moment/locale/pl"),
  },
  pt: {
    name: "Portuguese",
    translationFileLoader: () => require("../../locales/pt.json"),
    // @ts-expect-error types don't exist
    momentLocaleLoader: () => import("moment/locale/pt"),
  },
  qu: {
    name: "Quechua",
    translationFileLoader: () => require("../../locales/qu.json"),
    // @ts-expect-error types don't exist
    momentLocaleLoader: () => import("moment/locale/qu"),
  },
  ro: {
    name: "Romanian",
    translationFileLoader: () => require("../../locales/ro.json"),
    // @ts-expect-error types don't exist
    momentLocaleLoader: () => import("moment/locale/ro"),
  },
  ru: {
    name: "Russian",
    translationFileLoader: () => require("../../locales/ru.json"),
    // @ts-expect-error types don't exist
    momentLocaleLoader: () => import("moment/locale/ru"),
  },
  sh: {
    name: "Russian",
    translationFileLoader: () => require("../../locales/sh.json"),
    // @ts-expect-error types don't exist
    momentLocaleLoader: () => import("moment/locale/ru"),
  },
  si: {
    name: "Sinhala",
    translationFileLoader: () => require("../../locales/si.json"),
    // @ts-expect-error types don't exist
    momentLocaleLoader: () => import("moment/locale/si"),
  },
  sk: {
    name: "Slovak",
    translationFileLoader: () => require("../../locales/sk.json"),
    // @ts-expect-error types don't exist
    momentLocaleLoader: () => import("moment/locale/sk"),
  },
  sr: {
    name: "Serbian",
    translationFileLoader: () => require("../../locales/sr.json"),
    // @ts-expect-error types don't exist
    momentLocaleLoader: () => import("moment/locale/sr"),
  },
  sv: {
    name: "Swedish",
    translationFileLoader: () => require("../../locales/sv.json"),
    // @ts-expect-error types don't exist
    momentLocaleLoader: () => import("moment/locale/sv"),
  },
  sw: {
    name: "Swahili (macrolanguage)",
    translationFileLoader: () => require("../../locales/sw.json"),
    // @ts-expect-error types don't exist
    momentLocaleLoader: () => import("moment/locale/sw"),
  },
  ta: {
    name: "Tamil",
    translationFileLoader: () => require("../../locales/ta.json"),
    // @ts-expect-error types don't exist
    momentLocaleLoader: () => import("moment/locale/ta"),
  },
  te: {
    name: "Telugu",
    translationFileLoader: () => require("../../locales/te.json"),
    // @ts-expect-error types don't exist
    momentLocaleLoader: () => import("moment/locale/te"),
  },
  tl: {
    name: "Tagalog",
    translationFileLoader: () => require("../../locales/tl.json"),
    // @ts-expect-error types don't exist
    momentLocaleLoader: () => import("moment/locale/tl"),
  },
  tr: {
    name: "Turkish",
    translationFileLoader: () => require("../../locales/tr.json"),
    // @ts-expect-error types don't exist
    momentLocaleLoader: () => import("moment/locale/tr"),
  },
  ug: {
    name: "Uighur",
    translationFileLoader: () => require("../../locales/ug.json"),
    // @ts-expect-error types don't exist
    momentLocaleLoader: () => import("moment/locale/ug"),
  },
  uk: {
    name: "Ukrainian",
    translationFileLoader: () => require("../../locales/uk.json"),
    // @ts-expect-error types don't exist
    momentLocaleLoader: () => import("moment/locale/uk"),
  },
  ur: {
    name: "Urdu",
    translationFileLoader: () => require("../../locales/ur.json"),
    // @ts-expect-error types don't exist
    momentLocaleLoader: () => import("moment/locale/ur"),
  },
  vec: {
    name: "Urdu",
    translationFileLoader: () => require("../../locales/vec.json"),
    // @ts-expect-error types don't exist
    momentLocaleLoader: () => import("moment/locale/ur"),
  },
  vi: {
    name: "Vietnamese",
    translationFileLoader: () => require("../../locales/vi.json"),
    // @ts-expect-error types don't exist
    momentLocaleLoader: () => import("moment/locale/vi"),
  },
  zh: {
    name: "Chinese",
    translationFileLoader: () => require("../../locales/zh.json"),
    // @ts-expect-error types don't exist
    momentLocaleLoader: () => import("moment/locale/zh"),
  },
};

export const defaultNamespace = "common";
export const namespaces = [
  "common",
  "LoginScreen",
  "RegisterScreen",
  "NotFoundScreen",
];
