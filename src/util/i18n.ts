import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import i18nHttpBackend from "i18next-http-backend";
// import LanguageDetector from "i18next-browser-languagedetector";

i18n.use(i18nHttpBackend)
	// .use(LanguageDetector)
	.use(initReactI18next) // passes i18n down to react-i18next
	.init({
		fallbackLng: "en",
		interpolation: {
			escapeValue: false, // not needed for react as it escapes by default
		},
	});

export default i18n;
