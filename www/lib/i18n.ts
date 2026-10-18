export const languages = {
  en: "English",
  tw: "Twi",
  ha: "Hausa",
  ga: "Ga",
} as const

export type Language = keyof typeof languages

export const defaultLanguage: Language = "en"

export const translations: Record<Language, Record<string, string>> = {
  en: {
    "nav.signin": "Sign In",
    "nav.getstarted": "Get Started",
    "home.hero.title": "Ghana's Premier Waste Management Solution",
    "home.hero.subtitle":
      "Professional waste collection, sustainable practices, and reliable service for homes and businesses across Ghana.",
    "home.features.title": "Why Choose Verifeed?",
    "home.features.eco": "Eco-Friendly",
    "home.features.eco.desc": "Sustainable waste management practices for a cleaner Ghana.",
    "home.features.reliable": "Reliable Service",
    "home.features.reliable.desc": "On-time collection with professional, trained riders.",
    "home.features.pricing": "Transparent Pricing",
    "home.features.pricing.desc": "Clear, competitive rates with no hidden charges.",
    "home.features.secure": "Secure Platform",
    "home.features.secure.desc": "Your data is protected with enterprise-grade security.",
    "home.cta.title": "Ready to Get Started?",
    "home.cta.subtitle": "Join thousands of satisfied customers across Ghana.",
    "footer.company": "Company",
    "footer.legal": "Legal",
    "footer.support": "Support",
    "footer.copyright": "© 2025 Verifeed. All rights reserved.",
  },
  tw: {
    "nav.signin": "Hyɛ Mu",
    "nav.getstarted": "Firi Ase",
    "home.hero.title": "Ghana Nkɔsoɔ Ade Mu Ɔkwan Titire",
    "home.hero.subtitle":
      "Ade mu ɔkwan a ɛyɛ den, ade mu ɔkwan a ɛyɛ papa, ne ade mu ɔkwan a ɛyɛ nokware ma afi ne aguamam wɔ Ghana nyinaa.",
    "home.features.title": "Adɛn nti na ɛsɛ sɛ wokɔ Verifeed?",
    "home.features.eco": "Asase Mu Ade",
    "home.features.eco.desc": "Ade mu ɔkwan a ɛyɛ papa ma Ghana a ɛyɛ papa.",
    "home.features.reliable": "Ade Mu Ɔkwan a Ɛyɛ Nokware",
    "home.features.reliable.desc": "Ade mu ɔkwan a ɛba wɔ bere a ɛsɛ no.",
    "home.features.pricing": "Sika a Ɛyɛ Nokware",
    "home.features.pricing.desc": "Sika a ɛyɛ den na ɛnni sika a wɔakoka.",
    "home.features.secure": "Ɔkwan a Ɛyɛ Nokware",
    "home.features.secure.desc": "Wo ade a ɛyɛ nokware wɔ ɔkwan a ɛyɛ den.",
    "home.cta.title": "Woasɛ sɛ wofiri ase?",
    "home.cta.subtitle": "Bom ne nnipa a wɔagye ade yi wɔ Ghana nyinaa.",
    "footer.company": "Adwuma",
    "footer.legal": "Mmara",
    "footer.support": "Boa",
    "footer.copyright": "© 2025 Verifeed. Ɔkwan nyinaa a ɛyɛ nokware.",
  },
  ha: {
    "nav.signin": "Shiga",
    "nav.getstarted": "Fara",
    "home.hero.title": "Ghana's Premier Waste Management Solution",
    "home.hero.subtitle":
      "Professional waste collection, sustainable practices, and reliable service for homes and businesses across Ghana.",
    "home.features.title": "Me yasa Verifeed?",
    "home.features.eco": "Eco-Friendly",
    "home.features.eco.desc": "Sustainable waste management practices for a cleaner Ghana.",
    "home.features.reliable": "Reliable Service",
    "home.features.reliable.desc": "On-time collection with professional, trained riders.",
    "home.features.pricing": "Transparent Pricing",
    "home.features.pricing.desc": "Clear, competitive rates with no hidden charges.",
    "home.features.secure": "Secure Platform",
    "home.features.secure.desc": "Your data is protected with enterprise-grade security.",
    "home.cta.title": "Kuna shirye?",
    "home.cta.subtitle": "Shiga tare da dubbun masu gamsuwa a duk Ghana.",
    "footer.company": "Kamfani",
    "footer.legal": "Shari'a",
    "footer.support": "Goyon",
    "footer.copyright": "© 2025 Verifeed. Duk haƙƙi na karɓa.",
  },
  ga: {
    "nav.signin": "Shiga",
    "nav.getstarted": "Fara",
    "home.hero.title": "Ghana's Premier Waste Management Solution",
    "home.hero.subtitle":
      "Professional waste collection, sustainable practices, and reliable service for homes and businesses across Ghana.",
    "home.features.title": "Why Choose Verifeed?",
    "home.features.eco": "Eco-Friendly",
    "home.features.eco.desc": "Sustainable waste management practices for a cleaner Ghana.",
    "home.features.reliable": "Reliable Service",
    "home.features.reliable.desc": "On-time collection with professional, trained riders.",
    "home.features.pricing": "Transparent Pricing",
    "home.features.pricing.desc": "Clear, competitive rates with no hidden charges.",
    "home.features.secure": "Secure Platform",
    "home.features.secure.desc": "Your data is protected with enterprise-grade security.",
    "home.cta.title": "Ready to Get Started?",
    "home.cta.subtitle": "Join thousands of satisfied customers across Ghana.",
    "footer.company": "Company",
    "footer.legal": "Legal",
    "footer.support": "Support",
    "footer.copyright": "© 2025 Verifeed. All rights reserved.",
  },
}

export function getTranslation(language: Language, key: string): string {
  return translations[language]?.[key] || translations.en[key] || key
}
