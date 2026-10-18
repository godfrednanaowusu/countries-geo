'use client'

import { LastUpdated } from "nextra-theme-docs";
import { useTranslations } from "next-intl";
import { useLocale } from "./locale_provider";

// Nextra clones this element with the page `date`
export default function LocalizedLastUpdated({ date }: { date?: Date }) {
  const t = useTranslations("page");
  const { locale } = useLocale();
  return <LastUpdated date={date} locale={locale}>{t("lastUpdated")}</LastUpdated>;
}
