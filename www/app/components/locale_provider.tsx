'use client'

import { createContext, useContext, useEffect, useState } from "react";
import { NextIntlClientProvider, useTranslations, type AbstractIntlMessages } from "next-intl";
import { defaultLocale, isLocale, localeStorageKey, locales, rtlLocales, type Locale } from "@/messages/config";
import { useConfigStore } from "@/zustand/store";

import en from "@/messages/en.json";
import de from "@/messages/de.json";
import zh from "@/messages/zh.json";
import fr from "@/messages/fr.json";
import es from "@/messages/es.json";
import ru from "@/messages/ru.json";
import pt from "@/messages/pt.json";
import hi from "@/messages/hi.json";
import ar from "@/messages/ar.json";

const messages: Record<Locale, AbstractIntlMessages> = { en, de, zh, fr, es, ru, pt, hi, ar };

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

const LocaleContext = createContext<LocaleContextValue>({
  locale: defaultLocale,
  setLocale: () => {},
});

export const useLocale = () => useContext(LocaleContext);

// Pages are statically rendered in the default locale (keeps pagefind search working),
// then switched on the client to the stored or browser-preferred locale.
const detectLocale = (): Locale => {
  try {
    const stored = localStorage.getItem(localeStorageKey);
    if (isLocale(stored)) return stored;
  } catch {}
  const browser = navigator.languages?.map((lang) => lang.split("-")[0]).find(isLocale);
  return browser ?? defaultLocale;
};

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);

  useEffect(() => {
    setLocaleState(detectLocale());
    useConfigStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = rtlLocales.includes(locale) ? "rtl" : "ltr";
  }, [locale]);

  const setLocale = (next: Locale) => {
    if (!locales.includes(next)) return;
    setLocaleState(next);
    try {
      localStorage.setItem(localeStorageKey, next);
    } catch {}
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      <NextIntlClientProvider locale={locale} messages={messages[locale]} timeZone="UTC">
        {children}
      </NextIntlClientProvider>
    </LocaleContext.Provider>
  );
}

// Formats a number for the active locale; usable from server components
export function LocalizedNumber({ value }: { value: number }) {
  const { locale } = useLocale();
  return <>{new Intl.NumberFormat(locale).format(value)}</>;
}

const linkClass ="x:focus-visible:nextra-focus x:text-primary-600 x:underline x:hover:no-underline x:decoration-from-font x:[text-underline-position:from-font]";

// Renders a translated message; usable from server components, MDX and _meta files.
// Messages may contain <b>…</b>, and any tag named in `links` becomes an external link.
export function T({ k, values, links }: {
  k: string;
  values?: Record<string, string | number>;
  links?: Record<string, string>;
}) {
  const t = useTranslations();
  const tags = Object.fromEntries(
    Object.entries(links ?? {}).map(([tag, href]) => [
      tag,
      (chunks: React.ReactNode) => <a href={href} target="_blank" rel="noreferrer" className={linkClass}>{chunks}</a>,
    ])
  );
  return <>{t.rich(k as any, { ...values, b: (chunks) => <strong>{chunks}</strong>, ...tags })}</>;
}
