"use client"

import { useState, useEffect } from "react"
import type { Language } from "@/lib/i18n"
import { defaultLanguage } from "@/lib/i18n"

export function useLanguage() {
  const [language, setLanguage] = useState<Language>(defaultLanguage)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Get language from localStorage or browser preference
    const stored = localStorage.getItem("language") as Language | null
    if (stored) {
      setLanguage(stored)
    } else {
      const browserLang = navigator.language.split("-")[0] as Language
      const validLang = ["en", "tw", "ha", "ga"].includes(browserLang) ? (browserLang as Language) : defaultLanguage
      setLanguage(validLang)
    }
    setIsLoaded(true)
  }, [])

  const changeLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage)
    localStorage.setItem("language", newLanguage)
  }

  return { language, changeLanguage, isLoaded }
}
