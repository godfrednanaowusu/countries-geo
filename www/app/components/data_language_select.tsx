'use client'

import { Database } from "lucide-react";
import { useTranslations } from "next-intl";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { dataLanguages, type DataLanguage } from "@/messages/config";
import { useConfigStore } from "@/zustand/store";

export default function DataLanguageSelect() {
  const t = useTranslations("usage");
  const { dataLanguage, setDataLanguage } = useConfigStore();

  return (
    <div className="flex items-center gap-2">
      <Database size={16} className="text-teal-500" />
      <span className="text-sm text-gray-600 dark:text-gray-400">{t("dataLanguage")}</span>
      <Select value={dataLanguage} onValueChange={(value) => setDataLanguage(value as DataLanguage)}>
        <SelectTrigger aria-label={t("dataLanguage")} className="h-8 w-[150px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(dataLanguages).map(([value, name]) => (
            <SelectItem key={value} value={value} lang={value}>
              {name} <span className="text-gray-400 uppercase text-xs ms-1">{value}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
