export const defaultLocale = "en";
export const locales = ["en", "de", "zh", "fr", "es", "ru", "pt", "hi", "ar"] as const;

export type Locale = (typeof locales)[number];

// Native names shown in the locale switcher
export const localeNames: Record<Locale, string> = {
  en: "English",
  de: "Deutsch",
  zh: "中文",
  fr: "Français",
  es: "Español",
  ru: "Русский",
  pt: "Português",
  hi: "हिन्दी",
  ar: "العربية",
};

export const rtlLocales: Locale[] = ["ar"];

export const localeStorageKey = "countries-geo-locale";

export const isLocale = (value: unknown): value is Locale =>
  typeof value === "string" && (locales as readonly string[]).includes(value);

// Languages the package ships translations for (its `Language` type). Independent of the UI locale.
export const dataLanguages = {
  en: "English",
  fr: "Français",
  de: "Deutsch",
  zh: "中文",
  es: "Español",
  hi: "हिन्दी",
  ar: "العربية",
  pt: "Português",
  bn: "বাংলা",
  ru: "Русский",
  ja: "日本語",
  pa: "ਪੰਜਾਬੀ",
} as const;

export type DataLanguage = keyof typeof dataLanguages;

export const defaultDataLanguage: DataLanguage = "en";
