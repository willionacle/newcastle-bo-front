import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import ko from "./locales/ko.json";
import en from "./locales/en.json";
import fil from "./locales/fil.json";

// Resources are bundled (static imports) rather than fetched at runtime so that
// the detected language + its strings are available synchronously before the
// first render. This guarantees no flash of untranslated / wrong-language content
// on reload. (The previous http-backend setup loaded JSON asynchronously.)
i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ko: { translation: ko },
      en: { translation: en },
      fil: { translation: fil },
    },
    fallbackLng: "en",
    supportedLngs: ["ko", "en", "fil"],
    nonExplicitSupportedLngs: true, // en-US -> en, ko-KR -> ko, fil-PH -> fil
    interpolation: { escapeValue: false }, // React already escapes
    react: { useSuspense: false }, // bundled resources => nothing to suspend on
    detection: {
      order: ["localStorage", "navigator"], // saved choice wins, else browser default
      caches: ["localStorage"],
      lookupLocalStorage: "i18nextLng",
      convertDetectedLanguage: (lng: string) => {
        const base = lng.toLowerCase().split("-")[0]; // collapse region (en-US -> en)
        return base === "tl" ? "fil" : base; // Tagalog code -> Filipino
      },
    },
  });

i18next.on("languageChanged", (lng) => {
  document.documentElement.lang = lng;
});

export default i18next;
