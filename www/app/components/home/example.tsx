'use client'

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Countries, loadLanguage, type Country } from "countries-geo";

// One key per line, nested values kept inline so the output stays short
const format = (value: object) =>
  `{\n${Object.entries(value).map(([key, v]) => `  "${key}": ${JSON.stringify(v).replace(/,(?=["{\[\d-])/g, ", ").replace(/":/g, '": ')}`).join(",\n")}\n}`;

// The code shown is passed in as children from page.mdx (so Nextra highlights it); this runs the same call
export default function HomeExample({ children }: { children: React.ReactNode }) {
  const t = useTranslations("home.example");
  const [result, setResult] = useState<Country>();

  useEffect(() => {
    loadLanguage("ja").then(() => setResult(Countries.get("GH", { language: "ja" })));
  }, []);

  return (
    <section className="grid items-center gap-6 lg:grid-cols-2 lg:gap-9">
      <div className="flex min-w-0 flex-col gap-5 [&_pre]:!my-0 [&>div]:!mt-0">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold md:text-3xl">{t("title")}</h2>
          <p className="max-w-[640px] text-gray-600 dark:text-gray-400">{t("description")}</p>
        </div>
        {children}
      </div>
      <div className="min-w-0 overflow-hidden rounded-xl border border-gray-200 dark:border-neutral-800">
        <div className="border-b border-gray-200 bg-gray-50 px-4 py-2 text-xs text-gray-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-gray-400">
          {t("output")}
        </div>
        <pre dir="ltr" className="min-h-[264px] overflow-x-auto p-4 text-sm leading-relaxed">
          {result ? format(result) : "…"}
        </pre>
      </div>
    </section>
  );
}
