"""Editorial decisions for the dataset, kept in one reviewable place."""

# Languages shipped as translations. English is the base language of the dataset.
LANGS = ['en', 'fr', 'de', 'es', 'pt', 'ru', 'zh', 'ja', 'ar', 'hi', 'bn', 'pa']

# Territories that ISO 3166-1 lists separately but this dataset treats as subdivisions of
# another country (UN position for Taiwan, kept for Hong Kong / Macao as in earlier releases).
FOLD_INTO = {
    'TW': ('CN', 'CN-TW'),
    'HK': ('CN', 'CN-HK'),
    'MO': ('CN', 'CN-MO'),
}

# GeoNames country codes that are not ISO 3166-1 entries in this dataset, mapped onto the
# country/state that holds them under the UN position.
GEONAMES_COUNTRY_REMAP = {
    'XK': ('RS', 'RS-KM'),  # Kosovo -> Serbia, Kosovo-Metohija (UNSCR 1244)
}

# Countries whose ISO 3166-2 top level is a non-administrative grouping (geographical units,
# provinces with no government, ...). For these the next level down is used as "state".
FLATTEN_TOP_LEVEL = {'ID', 'CV', 'UG', 'IE', 'BE'}

# Subdivisions that duplicate a separate ISO 3166-1 entry present in this dataset.
EXCLUDE_SUBDIVISIONS = {
    'FR-971', 'FR-972', 'FR-973', 'FR-974', 'FR-976', 'FR-BL', 'FR-MF', 'FR-NC', 'FR-PF',
    'FR-PM', 'FR-TF', 'FR-WF',
    'NL-AW', 'NL-CW', 'NL-SX', 'NL-BQ1', 'NL-BQ2', 'NL-BQ3',
    'US-AS', 'US-GU', 'US-MP', 'US-PR', 'US-UM', 'US-VI',
    'NO-21', 'NO-22',
    'FI-01',
}

# Reforms already reflected in ISO 3166-2 / Wikidata but not yet in the Debian iso-codes
# release used by pycountry. Only applied where the new codes are confirmed on Wikidata.
#   NO: 2024 county reform (Viken, Vestfold og Telemark, Troms og Finnmark split up).
#   VN: 2025 provincial merger, 63 -> 34; surviving provinces keep their ISO codes.
APPLY_WIKIDATA_DISSOLUTIONS = {'NO', 'VN'}
ADD_SUBDIVISIONS = {
    'NO-31': 'County', 'NO-32': 'County', 'NO-33': 'County', 'NO-39': 'County',
    'NO-40': 'County', 'NO-55': 'County', 'NO-56': 'County',
}

# Words stripped from Wikidata English labels when what remains matches the ISO name
# ("Ashanti Region" -> "Ashanti", "Adrar Province" -> "Adrar").
LABEL_SUFFIXES = [
    'Region', 'Province', 'County', 'Governorate', 'District', 'Department', 'Prefecture',
    'Division', 'Municipality', 'Parish', 'State', 'Oblast', 'Voivodeship', 'Canton',
    'Emirate', 'Popularate', 'Regional State', 'Atoll', 'Wilaya', 'Island', 'Islands',
]

# GeoNames feature codes that are not cities: neighbourhoods, historical/abandoned/destroyed
# places and historical capitals.
EXCLUDED_FEATURE_CODES = {'PPLX', 'PPLH', 'PPLQ', 'PPLW', 'PPLCH'}

# Wikidata classes that disqualify an otherwise matching city/town item.
WD_EXCLUDED_TYPES = {
    'Q74047',     # ghost town
    'Q19953632',  # former administrative territorial entity
    'Q15661340',  # ancient city
    'Q839954',    # archaeological site
    'Q123705',    # neighbourhood
    'Q2983893',   # quarter
}

# GeoNames export used as the city backbone: every place with 500+ inhabitants plus every
# administrative seat down to the 4th level (PPLA4), whatever its population.
GEONAMES_CITIES = 'cities500.txt'

# Minimum recorded population for a Wikidata city/town that GeoNames lacks (same bar as
# GeoNames). Items with no recorded population are accepted: being typed a city or town is
# the evidence.
WIKIDATA_MIN_POPULATION = 500

# Countries where GeoNames lists fewer populated places (pop >= 1000) than this per million
# inhabitants are considered thinly covered; there Wikidata towns without a recorded
# population are added too.
THIN_COVERAGE_PER_MILLION = 8

# Coordinate precision (decimal places) shipped in the package.
PRECISION = 3

CONTINENTS = [
    # code, iso3, M49 area code (for CLDR names), names
    ('AF', 'AFR', '002', {'en': 'Africa', 'fr': 'Afrique', 'de': 'Afrika', 'es': 'África', 'pt': 'África',
                          'ru': 'Африка', 'zh': '非洲', 'ja': 'アフリカ', 'ar': 'أفريقيا', 'hi': 'अफ़्रीका',
                          'bn': 'আফ্রিকা', 'pa': 'ਅਫ਼ਰੀਕਾ'}),
    ('AQ', 'ANT', 'AQ', {'en': 'Antarctica', 'fr': 'Antarctique', 'de': 'Antarktis', 'es': 'Antártida',
                         'pt': 'Antártida', 'ru': 'Антарктида', 'zh': '南极洲', 'ja': '南極大陸',
                         'ar': 'القارة القطبية الجنوبية', 'hi': 'अंटार्कटिका', 'bn': 'অ্যান্টার্কটিকা',
                         'pa': 'ਅੰਟਾਰਕਟਿਕਾ'}),
    ('AS', 'ASI', '142', {'en': 'Asia', 'fr': 'Asie', 'de': 'Asien', 'es': 'Asia', 'pt': 'Ásia', 'ru': 'Азия',
                          'zh': '亚洲', 'ja': 'アジア', 'ar': 'آسيا', 'hi': 'एशिया', 'bn': 'এশিয়া',
                          'pa': 'ਏਸ਼ੀਆ'}),
    ('EU', 'EUR', '150', {'en': 'Europe', 'fr': 'Europe', 'de': 'Europa', 'es': 'Europa', 'pt': 'Europa',
                          'ru': 'Европа', 'zh': '欧洲', 'ja': 'ヨーロッパ', 'ar': 'أوروبا', 'hi': 'यूरोप',
                          'bn': 'ইউরোপ', 'pa': 'ਯੂਰਪ'}),
    ('NA', 'NAM', '003', {'en': 'North America', 'fr': 'Amérique du Nord', 'de': 'Nordamerika',
                          'es': 'América del Norte', 'pt': 'América do Norte', 'ru': 'Северная Америка',
                          'zh': '北美洲', 'ja': '北アメリカ', 'ar': 'أمريكا الشمالية', 'hi': 'उत्तर अमेरिका',
                          'bn': 'উত্তর আমেরিকা', 'pa': 'ਉੱਤਰੀ ਅਮਰੀਕਾ'}),
    ('OC', 'OCE', '009', {'en': 'Oceania', 'fr': 'Océanie', 'de': 'Ozeanien', 'es': 'Oceanía',
                          'pt': 'Oceania', 'ru': 'Океания', 'zh': '大洋洲', 'ja': 'オセアニア',
                          'ar': 'أوقيانوسيا', 'hi': 'ओशिनिया', 'bn': 'ওশিয়ানিয়া', 'pa': 'ਓਸ਼ੇਨੀਆ'}),
    ('SA', 'SAM', '005', {'en': 'South America', 'fr': 'Amérique du Sud', 'de': 'Südamerika',
                          'es': 'América del Sur', 'pt': 'América do Sul', 'ru': 'Южная Америка',
                          'zh': '南美洲', 'ja': '南アメリカ', 'ar': 'أمريكا الجنوبية', 'hi': 'दक्षिण अमेरिका',
                          'bn': 'দক্ষিণ আমেরিকা', 'pa': 'ਦੱਖਣੀ ਅਮਰੀਕਾ'}),
]

# Longitude of the Ural boundary used to split Russia between Europe and Asia when computing
# continent centres (federal subjects whose centre lies west of it count towards Europe).
URAL_LONGITUDE = 60.0
