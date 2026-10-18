'use client'

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Check, Copy } from "lucide-react";
import { SiNpm } from "react-icons/si";
import { Button } from "@/components/ui/button";
import AnimatedGlobe from "../animated_globe";

const INSTALL = "npm i countries-geo";

function InstallCommand() {
  const t = useTranslations("home");
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(INSTALL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div dir="ltr" className="flex w-full max-w-[360px] items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white/60 py-1.5 ps-4 pe-1.5 font-mono text-sm backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/60">
      <span className="truncate">
        <span className="select-none text-teal-600 dark:text-teal-400">$ </span>
        {INSTALL}
      </span>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? t("copied") : t("copy")}
        title={copied ? t("copied") : t("copy")}
        className="rounded-md p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-neutral-800 dark:hover:text-gray-100"
      >
        {copied ? <Check size={16} className="text-teal-500" /> : <Copy size={16} />}
      </button>
    </div>
  );
}

export default function HomeHero() {
  const t = useTranslations("home");

  return (
    <section className="grid grid-cols-12 items-center gap-5 md:gap-9">
      <div className="col-span-12 md:col-span-7">
        <div className="my-9 flex flex-col gap-6 py-9">
          <h1 className="max-w-[800px] text-4xl font-bold md:text-5xl lg:text-6xl">
            {t.rich("title", { hl: (chunks) => <span className="text-teal-500">{chunks}</span> })}
          </h1>
          <p className="max-w-[600px] text-lg text-gray-600 dark:text-gray-400">{t("subtitle")}</p>
          <InstallCommand />
          <div className="flex flex-wrap gap-3">
            <Button className="rounded-lg bg-teal-500 px-6 py-2 text-white hover:bg-teal-600" asChild>
              <Link href="/docs">{t("learnMore")}</Link>
            </Button>
            <Button variant="outline" className="rounded-lg border-teal-500 px-6 py-2 text-teal-600 hover:bg-teal-50 dark:text-teal-400 dark:hover:bg-teal-500/10" asChild>
              <Link href="https://www.npmjs.com/package/countries-geo" target="_blank">
                <span className="flex items-center gap-3"><SiNpm /> {t("getPackage")}</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
      <div className="col-span-12 md:col-span-5">
        <div className="hidden md:block">
          <AnimatedGlobe />
        </div>
      </div>
    </section>
  );
}
