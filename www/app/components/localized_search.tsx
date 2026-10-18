'use client'

import { Search } from "nextra/components";
import { useTranslations } from "next-intl";

export default function LocalizedSearch() {
  const t = useTranslations("search");
  return (
    <Search
      placeholder={t("placeholder")}
      emptyResult={t("emptyResult")}
      errorText={t("errorText")}
      loading={t("loading")}
    />
  );
}
