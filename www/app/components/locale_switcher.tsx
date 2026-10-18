'use client'

import { Check, Languages } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { localeNames, locales } from "@/messages/config";
import { useLocale } from "./locale_provider";

export default function LocaleSwitcher() {
  const t = useTranslations("nav");
  const { locale, setLocale } = useLocale();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t("language")}
        title={t("language")}
        className="flex items-center gap-1.5 rounded-md px-2 py-1 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors cursor-pointer"
      >
        <Languages size={18} />
        <span className="uppercase">{locale}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((value) => (
          <DropdownMenuItem
            key={value}
            lang={value}
            onSelect={() => setLocale(value)}
            className="flex justify-between gap-6 cursor-pointer"
          >
            {localeNames[value]}
            {value === locale && <Check size={14} />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
