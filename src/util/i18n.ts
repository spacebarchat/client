import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import * as RNLocalize from "react-native-localize";
import AsyncStorage from "@react-native-async-storage/async-storage";

// import i18nHttpBackend from "i18next-http-backend";
// import LanguageDetector from "i18next-browser-languagedetector";
const allLanguages = {
	en_login: () => import("../assets/locales/en/login.json"),
	en_network: () => import("../assets/locales/en/network.json"),
	en_register: () => import("../assets/locales/en/register.json"),
	en_translation: () => import("../assets/locales/en/translation.json"),
	de_login: () => import("../assets/locales/de/login.json"),
	de_network: () => import("../assets/locales/de/network.json"),
	de_register: () => import("../assets/locales/de/register.json"),
	de_translation: () => import("../assets/locales/de/translation.json"),
};

AsyncStorage.getItem("language").then((lng) => {
	if (!lng) lng = RNLocalize.getLocales()[0].languageCode || "en";

	i18n.changeLanguage(lng);
});

i18n.use(
	resourcesToBackend((language, namespace, callback) => {
		try {
			// import(`../assets/locales/${language}/${namespace}.json`)
			// @ts-ignore
			allLanguages[language + "_" + namespace]()
				.then((resources: any) => {
					callback(null, resources);
				})
				.catch((error: any) => {
					callback(error, null);
				});
		} catch (e) {
			const error = new Error("Language: " + language + " with namespace " + namespace + " not found");
			callback(error, null);
		}
	})
)
	// .use(i18nHttpBackend)
	// .use(LanguageDetector)
	.use(initReactI18next) // passes i18n down to react-i18next
	.init({
		fallbackLng: "en",
		interpolation: {
			escapeValue: false, // not needed for react as it escapes by default
		},
	});

export default i18n;
