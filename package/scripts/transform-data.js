const fs = require('fs');
const path = require('path');

// Load current data
const dataPath = path.join(__dirname, '../src/data.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// ISO3 codes for countries (standard ISO 3166-1 alpha-3)
const countryISO3Codes = {
  'AF': 'AFG', 'AL': 'ALB', 'DZ': 'DZA', 'US': 'USA', 'AD': 'AND', 'AO': 'AGO',
  'AI': 'AIA', 'AQ': 'ATA', 'AG': 'ATG', 'AR': 'ARG', 'AM': 'ARM', 'AW': 'ABW',
  'AU': 'AUS', 'AT': 'AUT', 'AZ': 'AZE', 'BS': 'BHS', 'BH': 'BHR', 'BD': 'BGD',
  'BB': 'BRB', 'BY': 'BLR', 'BE': 'BEL', 'BZ': 'BLZ', 'BJ': 'BEN', 'BM': 'BMU',
  'BT': 'BTN', 'BO': 'BOL', 'BQ': 'BES', 'BA': 'BIH', 'BW': 'BWA', 'BR': 'BRA',
  'IO': 'IOT', 'BN': 'BRN', 'BG': 'BGR', 'BF': 'BFA', 'BI': 'BDI', 'CV': 'CPV',
  'KH': 'KHM', 'CM': 'CMR', 'CA': 'CAN', 'KY': 'CYM', 'CF': 'CAF', 'TD': 'TCD',
  'CL': 'CHL', 'CN': 'CHN', 'CX': 'CXR', 'CC': 'CCK', 'CO': 'COL', 'KM': 'COM',
  'CG': 'COG', 'CD': 'COD', 'CK': 'COK', 'CR': 'CRI', 'CI': 'CIV', 'HR': 'HRV',
  'CU': 'CUB', 'CW': 'CUW', 'CY': 'CYP', 'CZ': 'CZE', 'DK': 'DNK', 'DJ': 'DJI',
  'DM': 'DMA', 'DO': 'DOM', 'EC': 'ECU', 'EG': 'EGY', 'SV': 'SLV', 'GQ': 'GNQ',
  'ER': 'ERI', 'EE': 'EST', 'SZ': 'SWZ', 'ET': 'ETH', 'FK': 'FLK', 'FO': 'FRO',
  'FJ': 'FJI', 'FI': 'FIN', 'FR': 'FRA', 'GF': 'GUF', 'PF': 'PYF', 'TF': 'ATF',
  'GA': 'GAB', 'GM': 'GMB', 'GE': 'GEO', 'DE': 'DEU', 'GH': 'GHA', 'GI': 'GIB',
  'GR': 'GRC', 'GL': 'GRL', 'GD': 'GRD', 'GP': 'GLP', 'GU': 'GUM', 'GT': 'GTM',
  'GG': 'GGY', 'GN': 'GIN', 'GW': 'GNB', 'GY': 'GUY', 'HT': 'HTI', 'HM': 'HMD',
  'VA': 'VAT', 'HN': 'HND', 'HK': 'HKG', 'HU': 'HUN', 'IS': 'ISL', 'IN': 'IND',
  'ID': 'IDN', 'IR': 'IRN', 'IQ': 'IRQ', 'IE': 'IRL', 'IM': 'IMN', 'IL': 'ISR',
  'IT': 'ITA', 'JM': 'JAM', 'JP': 'JPN', 'JE': 'JEY', 'JO': 'JOR', 'KZ': 'KAZ',
  'KE': 'KEN', 'KI': 'KIR', 'KP': 'PRK', 'KR': 'KOR', 'KW': 'KWT', 'KG': 'KGZ',
  'LA': 'LAO', 'LV': 'LVA', 'LB': 'LBN', 'LS': 'LSO', 'LR': 'LBR', 'LY': 'LBY',
  'LI': 'LIE', 'LT': 'LTU', 'LU': 'LUX', 'MO': 'MAC', 'MG': 'MDG', 'MW': 'MWI',
  'MY': 'MYS', 'MV': 'MDV', 'ML': 'MLI', 'MT': 'MLT', 'MH': 'MHL', 'MQ': 'MTQ',
  'MR': 'MRT', 'MU': 'MUS', 'YT': 'MYT', 'MX': 'MEX', 'FM': 'FSM', 'MD': 'MDA',
  'MC': 'MCO', 'MN': 'MNG', 'ME': 'MNE', 'MS': 'MSR', 'MA': 'MAR', 'MZ': 'MOZ',
  'MM': 'MMR', 'NA': 'NAM', 'NR': 'NRU', 'NP': 'NPL', 'NL': 'NLD', 'NC': 'NCL',
  'NZ': 'NZL', 'NI': 'NIC', 'NE': 'NER', 'NG': 'NGA', 'NU': 'NIU', 'NF': 'NFK',
  'MK': 'MKD', 'MP': 'MNP', 'NO': 'NOR', 'OM': 'OMN', 'PK': 'PAK', 'PW': 'PLW',
  'PS': 'PSE', 'PA': 'PAN', 'PG': 'PNG', 'PY': 'PRY', 'PE': 'PER', 'PH': 'PHL',
  'PN': 'PCN', 'PL': 'POL', 'PT': 'PRT', 'PR': 'PRI', 'QA': 'QAT', 'RE': 'REU',
  'RO': 'ROU', 'RU': 'RUS', 'RW': 'RWA', 'BL': 'BLM', 'SH': 'SHN', 'KN': 'KNA',
  'LC': 'LCA', 'MF': 'MAF', 'PM': 'SPM', 'VC': 'VCT', 'WS': 'WSM', 'SM': 'SMR',
  'ST': 'STP', 'SA': 'SAU', 'SN': 'SEN', 'RS': 'SRB', 'SC': 'SYC', 'SL': 'SLE',
  'SG': 'SGP', 'SX': 'SXM', 'SK': 'SVK', 'SI': 'SVN', 'SB': 'SLB', 'SO': 'SOM',
  'ZA': 'ZAF', 'GS': 'SGS', 'SS': 'SSD', 'ES': 'ESP', 'LK': 'LKA', 'SD': 'SDN',
  'SR': 'SUR', 'SJ': 'SJM', 'SE': 'SWE', 'CH': 'CHE', 'SY': 'SYR', 'TW': 'TWN',
  'TJ': 'TJK', 'TZ': 'TZA', 'TH': 'THA', 'TL': 'TLS', 'TG': 'TGO', 'TK': 'TKL',
  'TO': 'TON', 'TT': 'TTO', 'TN': 'TUN', 'TR': 'TUR', 'TM': 'TKM', 'TC': 'TCA',
  'TV': 'TUV', 'UG': 'UGA', 'UA': 'UKR', 'AE': 'ARE', 'GB': 'GBR', 'UM': 'UMI',
  'UY': 'URY', 'UZ': 'UZB', 'VU': 'VUT', 'VE': 'VEN', 'VN': 'VNM', 'VG': 'VGB',
  'VI': 'VIR', 'WF': 'WLF', 'EH': 'ESH', 'YE': 'YEM', 'ZM': 'ZMB', 'ZW': 'ZWE'
};

// Continent ISO3 codes
const continentISO3 = {
  'AF': 'AFR', 'AS': 'ASI', 'EU': 'EUR', 'NA': 'NAM', 'SA': 'SAM', 'OC': 'OCE', 'AN': 'ANT'
};

// Continent names in 10 major languages
const continentNames = {
  'AF': { 'en': 'Africa', 'zh': '非洲', 'es': 'África', 'hi': 'अफ़्रीका', 'ar': 'أفريقيا', 'pt': 'África', 'bn': 'আফ্রিকা', 'ru': 'Африка', 'ja': 'アフリカ', 'pa': 'ਅਫ਼ਰੀਕਾ' },
  'AS': { 'en': 'Asia', 'zh': '亚洲', 'es': 'Asia', 'hi': 'एशिया', 'ar': 'آسيا', 'pt': 'Ásia', 'bn': 'এশিয়া', 'ru': 'Азия', 'ja': 'アジア', 'pa': 'ਏਸ਼ੀਆ' },
  'EU': { 'en': 'Europe', 'zh': '欧洲', 'es': 'Europa', 'hi': 'यूरोप', 'ar': 'أوروبا', 'pt': 'Europa', 'bn': 'ইউরোপ', 'ru': 'Европа', 'ja': 'ヨーロッパ', 'pa': 'ਯੂਰਪ' },
  'NA': { 'en': 'North America', 'zh': '北美洲', 'es': 'América del Norte', 'hi': 'उत्तर अमेरिका', 'ar': 'أمريكا الشمالية', 'pt': 'América do Norte', 'bn': 'উত্তর আমেরিকা', 'ru': 'Северная Америка', 'ja': '北アメリカ', 'pa': 'ਉੱਤਰੀ ਅਮਰੀਕਾ' },
  'SA': { 'en': 'South America', 'zh': '南美洲', 'es': 'América del Sur', 'hi': 'दक्षिण अमेरिका', 'ar': 'أمريكا الجنوبية', 'pt': 'América do Sul', 'bn': 'দক্ষিণ আমেরিকা', 'ru': 'Южная Америка', 'ja': '南アメリカ', 'pa': 'ਦੱਖਣੀ ਅਮਰੀਕਾ' },
  'OC': { 'en': 'Oceania', 'zh': '大洋洲', 'es': 'Oceanía', 'hi': 'ओशिआनिया', 'ar': 'أوقيانوسيا', 'pt': 'Oceania', 'bn': 'ওশেনিয়া', 'ru': 'Океания', 'ja': 'オセアニア', 'pa': 'ਓਸ਼ੇਨੀਆ' },
  'AN': { 'en': 'Antarctica', 'zh': '南极洲', 'es': 'Antártida', 'hi': 'अंटार्कटिका', 'ar': 'أنتاركتيكا', 'pt': 'Antártida', 'bn': 'আন্টার্কটিকা', 'ru': 'Антарктида', 'ja': '南極', 'pa': 'ਅੰਟਾਰਕਟਿਕਾ' }
};

// Telephone codes for countries
const telephoneCodes = {
  'US': '+1', 'CN': '+86', 'GB': '+44', 'IN': '+91', 'BR': '+55', 'RU': '+7', 'JP': '+81',
  'DE': '+49', 'FR': '+33', 'IT': '+39', 'ES': '+34', 'CA': '+1', 'AU': '+61', 'MX': '+52',
  'KR': '+82', 'ID': '+62', 'TR': '+90', 'SA': '+966', 'NL': '+31', 'CH': '+41', 'PL': '+48',
  'BE': '+32', 'SE': '+46', 'AT': '+43', 'NO': '+47', 'AE': '+971', 'IL': '+972', 'SG': '+65',
  'HK': '+852', 'DK': '+45', 'FI': '+358', 'IE': '+353', 'NZ': '+64', 'PT': '+351', 'GR': '+30',
  'CZ': '+420', 'RO': '+40', 'HU': '+36', 'ZA': '+27', 'PH': '+63', 'EG': '+20', 'VN': '+84',
  'PK': '+92', 'BD': '+880', 'NG': '+234', 'AR': '+54', 'CO': '+57', 'TH': '+66', 'MY': '+60',
  'UA': '+380', 'PE': '+51', 'CL': '+56', 'KE': '+254', 'GH': '+233', 'MA': '+212', 'DZ': '+213'
};

// Helper function to generate ISO3 for states/cities
// NOTE: the previous implementation did `(code + code[last]).substring(0,3)`,
// which produced collisions when a 2-char code padded by its last letter equalled
// a sibling 3-char code (e.g. generateISO3('SH') === 'SHH' === generateISO3('SHH')).
// The dedupe-aware generator below fixes those collisions.
function baseISO3(iso2) {
  if (!iso2) return 'XXX';
  const code = iso2.toString().toUpperCase();
  if (code.length >= 3) return code.substring(0, 3);
  return (code + code[code.length - 1]).substring(0, 3);
}

// Manual overrides for known collisions / intentionally curated codes.
// Keyed by `${countryIso2}|${stateOrCityIso2}`.
const iso3Overrides = {
  'AZ|SH': 'SHI',   // Shirvan collided with Shahbuz District (SHH)
  'JO|MA': 'MAD',   // Madaba Governorate collided with Ma'an Governorate (MAA)
  'MV|HA': 'HAL',   // Haa Alif Atoll collided with Haa Dhaalu Atoll (HAA)
  'MV|GA': 'GAL',   // Gaafu Alif Atoll collided with Gaafu Dhaalu Atoll (GAA)
  'OM|AD': 'DAK',   // Ad Dakhiliyah collided with Ad Dhahirah (ADD)
  'TH|UT': 'UTH',   // Uthai Thani collided with Uttaradit (UTT)
  'YE|SA': 'SAC',   // Sana'a City collided with Saada Governorate (SAA)
  'SI|TI': 'TIS',   // Tišina collided with duplicate Tišina (TII)
  'CH|AP': 'APA',   // Appenzell Ausserrhoden collided with Appenzell Innerrhoden (APP)
  'GF|AR': 'CAY',   // Arrondissement of Cayenne collided with Saint-Laurent-du-Maroni (ARR)
  'GY|UP': 'UDB',   // Upper Demerara-Berbice collided with Upper Takutu-Upper Essequibo (UPP)
  'PY|CA': 'CAG'    // Caaguazú collided with Caazapá (CAA)
};

// Generates a unique ISO3 within a single country context, applying overrides
// and resolving any residual collisions by suffixing A, B, C, ...
function makeUniqueISO3(countryIso2, iso2, usedSet) {
  const key = `${countryIso2}|${iso2}`;
  let code = iso3Overrides[key] || baseISO3(iso2);
  if (!usedSet.has(code)) {
    usedSet.add(code);
    return code;
  }
  for (let i = 0; i < 26; i++) {
    const candidate = (code.substring(0, 2) + String.fromCharCode(65 + i)).substring(0, 3);
    if (!usedSet.has(candidate)) {
      usedSet.add(candidate);
      return candidate;
    }
  }
  const fallback = `Z${usedSet.size % 10}${usedSet.size % 10}`;
  usedSet.add(fallback);
  return fallback;
}

// Preserve existing translations when present; otherwise fall back to English-only.
function buildNs(existing, name) {
  if (existing && existing.en) return existing;
  return {
    'en': name, 'zh': name, 'es': name, 'hi': name, 'ar': name,
    'pt': name, 'bn': name, 'ru': name, 'ja': name, 'pa': name
  };
}

// Preserve existing metadata (coordinates, telephone codes) if present.
function buildMtd(existing, iso2, telc) {
  const mtd = existing && typeof existing === 'object' ? { ...existing } : {};
  if (telc && !mtd.telc) mtd.telc = telc;
  return Object.keys(mtd).length ? mtd : undefined;
}

console.log('🔄 Transforming data structure...');

const transformedData = data.map(continent => {
  const continentData = {
    i: continent.i,
    n: continent.n,
    iso: { '2': continent.i, '3': continentISO3[continent.i] || baseISO3(continent.i) },
    ns: buildNs(continent.ns, continent.n),
    cn: continent.cn.map(country => {
      const countryData = {
        i: country.i,
        n: country.n,
        iso: { '2': country.i, '3': countryISO3Codes[country.i] || baseISO3(country.i) },
        ns: buildNs(country.ns, country.n)
      };

      countryData.mtd = buildMtd(country.mtd, country.i, telephoneCodes[country.i]);

      if (country.s && country.s.length > 0) {
        // Track used ISO3 codes per country to keep state codes unique.
        const usedStateIso3 = new Set();
        countryData.s = country.s.map(state => {
          const stateData = {
            i: state.i,
            n: state.n,
            iso: { '2': state.i, '3': makeUniqueISO3(country.i, state.i, usedStateIso3) },
            ns: buildNs(state.ns, state.n)
          };

          stateData.mtd = buildMtd(state.mtd, state.i);

          if (state.c && state.c.length > 0) {
            // Track used city ISO3 within the same state as well.
            const usedCityIso3 = new Set();
            stateData.c = state.c.map(city => ({
              i: city.i,
              n: city.n,
              iso: { '2': city.i, '3': makeUniqueISO3(country.i, city.i, usedCityIso3) },
              ns: buildNs(city.ns, city.n)
            }));
          }

          return stateData;
        });
      }

      return countryData;
    })
  };

  return continentData;
});

// Write transformed data
fs.writeFileSync(dataPath, JSON.stringify(transformedData, null, 2));

console.log('✅ Data transformation complete!');
console.log('📊 Enhanced structure with ISO2/ISO3 and 10 languages');
console.log('🌍 Continents:', transformedData.length);
console.log('🏳️ Countries:', transformedData.reduce((sum, c) => sum + c.cn.length, 0));
