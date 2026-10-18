import { languages } from '../generated/loaders.js';
import type { Language } from '../types.js';

type Translations = Record<'continents' | 'countries' | 'states', Record<string, string>>;

const loaded: Partial<Record<Language, Translations>> = {};
const pending: Partial<Record<Language, Promise<void>>> = {};
const warned = new Set<string>();

export const supportedLanguages: Language[] = ['en', ...(Object.keys(languages) as Language[])];

/** Loads the translations for a language so the synchronous getters can return it. */
export function loadLanguage(language: Language): Promise<void> {
  if (language === 'en' || loaded[language]) return Promise.resolve();
  const load = (languages as Record<string, (() => Promise<{ default: Translations }>) | undefined>)[language];
  if (!load) return Promise.reject(new Error(`countries-geo: unsupported language "${language}"`));
  return (pending[language] ??= load().then((m) => {
    loaded[language] = m.default;
  }));
}

export function isLanguageLoaded(language: Language): boolean {
  return language === 'en' || Boolean(loaded[language]);
}

export function translate(kind: keyof Translations, key: string, fallback: string, language?: Language): string {
  if (!language || language === 'en') return fallback;
  const table = loaded[language];
  if (!table) {
    if (!warned.has(language)) {
      warned.add(language);
      console.warn(`countries-geo: call loadLanguage('${language}') before requesting it; falling back to English.`);
    }
    return fallback;
  }
  return table[kind][key] ?? fallback;
}
