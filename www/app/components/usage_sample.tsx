'use client'

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Continents, Countries, States, Cities, loadLanguage, type City, type Language } from 'countries-geo'
import ComboBox from "./combo_box";
import DataLanguageSelect from "./data_language_select";
import Flag from "react-world-flags";
import { useConfigStore } from "@/zustand/store";
import { MapPinPlus } from "lucide-react";

// GitHub issue form (.github/ISSUE_TEMPLATE/missing-place.yml), pre-filled from the current selection
const reportUrl = (country: string, state: string) => {
    const params = new URLSearchParams({ template: "missing-place.yml", title: "[Data]: " })
    if (country) params.set("country", country)
    if (state) params.set("state", state)
    return `https://github.com/godfrednanaowusu/countries-geo/issues/new?${params}`
}

export default function UsageSample(){
    const t = useTranslations("usage")
    const dataLanguage = useConfigStore((state) => state.dataLanguage)
    // Sync getters only return a language once its translations are loaded; English until then
    const [language, setLanguage] = useState<Language>('en')
    const [getContinent, setContinent] = useState('')
    const [getCountry, setCountry] = useState('')
    const [getState, setState] = useState('')
    const [getCity, setCity] = useState('')
    const [cities, setCities] = useState<City[]>([])

    useEffect(() => {
        let active = true
        loadLanguage(dataLanguage).then(() => active && setLanguage(dataLanguage)).catch(() => active && setLanguage('en'))
        return () => { active = false }
    }, [dataLanguage])

    const options = { language }
    const continentItems = useMemo(() => Continents.list(options), [language])
    const countryItems = useMemo(() => Countries.getByContinent(getContinent, options), [language, getContinent])
    const stateItems = useMemo(() => States.getByCountry(getCountry, options), [language, getCountry])

    // City data is loaded lazily per country
    useEffect(() => {
        let active = true
        if (!getState) { setCities([]); return }
        Cities.getByState(getState, options).then((list) => active && setCities(list))
        return () => { active = false }
    }, [language, getState])

    return (
        <div className="flex flex-col gap-3">
        <DataLanguageSelect />
        <div className="flex gap-3 flex-wrap" lang={language}>

             <ComboBox
                                placeholder={t("selectContinent")}
                                noItemsText={t("allContinents")}
                                searchPlaceholder={t("search")}
                                value={getContinent}
                                onValueChange={setContinent}
                                width={"auto"}
                                items={continentItems.map((val) => ({
                                  value: val.iso,
                                  text: val.name,
                                }))}
                                align="left"
                              />


<ComboBox
                                placeholder={t("selectCountry")}
                                noItemsText={t("allCountries")}
                                searchPlaceholder={t("search")}
                                value={getCountry}
                                onValueChange={setCountry}
                                width={"auto"}
                                items={countryItems.map((val) => ({
                                  value: val.iso,
                                  icon: (
                                    <Flag
                                      height={15}
                                      width={20}
                                      code={val.iso}
                                      style={{ borderRadius: 3 }}
                                    />
                                  ),
                                  text: val.name,
                                }))}
                              />

<ComboBox
                                placeholder={t("selectState")}
                                noItemsText={t("allStates")}
                                searchPlaceholder={t("search")}
                                value={getState}
                                onValueChange={setState}
                                width={"auto"}
                                items={stateItems.map((val) => ({
                                  value: val.iso,
                                  text: val.name,
                                }))}
                              />

<ComboBox
                                placeholder={t("selectCity")}
                                noItemsText={t("allCities")}
                                searchPlaceholder={t("search")}
                                value={getCity}
                                onValueChange={setCity}
                                width={"auto"}
                                items={cities.map((val) => ({
                                  value: val.id,
                                  text: val.name,
                                }))}
                              />
        </div>
        <a
            href={reportUrl(getCountry, getState)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-fit items-center gap-1.5 text-sm text-gray-600 hover:text-teal-600 dark:text-gray-400 dark:hover:text-teal-400"
        >
            <MapPinPlus size={14} />
            {t("report")}
        </a>
        </div>
    )
}
