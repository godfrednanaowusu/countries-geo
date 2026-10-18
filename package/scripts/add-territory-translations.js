const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../src/data.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Remaining territory translations
const translations = {
  "AQ-ARG": { en: "Argentine Antarctica", zh: "阿根廷南极领地", es: "Antártida Argentina", hi: "अर्जेंटीना अंटार्कटिका", ar: "أنتاركتيكا الأرجنتينية", pt: "Antártida Argentina", bn: "আর্জেন্টিনা অ্যান্টার্কটিকা", ru: "Аргентинская Антарктика", ja: "アルゼンチン領南極", pa: "ਅਰਜਨਟੀਨੀ ਅੰਟਾਰਕਟਿਕਾ" },
  "AQ-AUS": { en: "Australian Antarctic Territory", zh: "澳大利亚南极领地", es: "Territorio Antártico Australiano", hi: "ऑस्ट्रेलियाई अंटार्कटिक क्षेत्र", ar: "إقليم أنتاركتيكا الأسترالي", pt: "Território Antártico Australiano", bn: "অস্ট্রেলিয়ান অ্যান্টার্কটিক অঞ্চল", ru: "Австралийская антарктическая территория", ja: "オーストラリア南極領土", pa: "ਆਸਟ੍ਰੇਲੀਅਨ ਅੰਟਾਰਕਟਿਕ ਖੇਤਰ" },
  "AQ-CHL": { en: "Chilean Antarctic Territory", zh: "智利南极领地", es: "Territorio Antártico Chileno", hi: "चिली अंटार्कटिक क्षेत्र", ar: "إقليم أنتاركتيكا التشيلي", pt: "Território Antártico Chileno", bn: "চিলির অ্যান্টার্কটিক অঞ্চল", ru: "Чилийская антарктическая территория", ja: "チリ領南極", pa: "ਚਿਲੀ ਅੰਟਾਰਕਟਿਕ ਖੇਤਰ" },
  "AQ-FRA": { en: "Adélie Land", zh: "阿黛利地", es: "Tierra Adelia", hi: "एडेली लैंड", ar: "أرض أديلي", pt: "Terra Adélia", bn: "আদেলি ল্যান্ড", ru: "Земля Адели", ja: "アデリーランド", pa: "ਐਡੇਲੀ ਲੈਂਡ" },
  "AQ-NZL": { en: "Ross Dependency", zh: "罗斯属地", es: "Dependencia Ross", hi: "रॉस डिपेंडेंसी", ar: "تبعية روس", pt: "Dependência de Ross", bn: "রস ডিপেন্ডেন্সি", ru: "Зависимая территория Росса", ja: "ロス海属領", pa: "ਰੌਸ ਡਿਪੈਂਡੈਂਸੀ" },
  "AQ-NOR": { en: "Queen Maud Land", zh: "毛德皇后地", es: "Tierra de la Reina Maud", hi: "क्वीन मॉड लैंड", ar: "أرض الملكة مود", pt: "Terra da Rainha Maud", bn: "কুইন মড ল্যান্ড", ru: "Земля Королевы Мод", ja: "クイーンモードランド", pa: "ਕੁਈਨ ਮੌਡ ਲੈਂਡ" },
  "AQ-GBR": { en: "British Antarctic Territory", zh: "英属南极领地", es: "Territorio Antártico Británico", hi: "ब्रिटिश अंटार्कटिक क्षेत्र", ar: "إقليم أنتاركتيكا البريطاني", pt: "Território Antártico Britânico", bn: "ব্রিটিশ অ্যান্টার্কটিক অঞ্চল", ru: "Британская антарктическая территория", ja: "イギリス領南極地域", pa: "ਬ੍ਰਿਟਿਸ਼ ਅੰਟਾਰਕਟਿਕ ਖੇਤਰ" },
  "AQ-UNCLAIMED": { en: "Marie Byrd Land", zh: "玛丽伯德地", es: "Tierra de Marie Byrd", hi: "मैरी बर्ड लैंड", ar: "أرض ماري بيرد", pt: "Terra de Marie Byrd", bn: "মেরি বার্ড ল্যান্ড", ru: "Земля Мэри Бэрд", ja: "マリーバードランド", pa: "ਮੈਰੀ ਬਰਡ ਲੈਂਡ" },
  "EI": { en: "Easter Island", zh: "复活节岛", es: "Isla de Pascua", hi: "ईस्टर द्वीप", ar: "جزيرة القيامة", pt: "Ilha de Páscoa", bn: "ইস্টার দ্বীপ", ru: "Остров Пасхи", ja: "イースター島", pa: "ਈਸਟਰ ਟਾਪੂ" },
  "UM": { en: "Pacific Remote Islands", zh: "美国本土外小岛屿", es: "Islas Remotas del Pacífico", hi: "प्रशांत दूरस्थ द्वीप", ar: "جزر المحيط الهادئ النائية", pt: "Ilhas Remotas do Pacífico", bn: "প্রশান্ত মহাসাগরীয় দূরবর্তী দ্বীপপুঞ্জ", ru: "Внешние малые острова США", ja: "合衆国領有小離島", pa: "ਪੈਸੀਫਿਕ ਰਿਮੋਟ ਟਾਪੂ" },
  "PN": { en: "Pitcairn Islands", zh: "皮特凯恩群岛", es: "Islas Pitcairn", hi: "पिटकेर्न द्वीप", ar: "جزر بيتكيرن", pt: "Ilhas Pitcairn", bn: "পিটকেয়ার্ন দ্বীপপুঞ্জ", ru: "Острова Питкэрн", ja: "ピトケアン諸島", pa: "ਪਿਟਕੇਅਰਨ ਟਾਪੂ" }
};

const coords = {
  "AQ-ARG": { lat: -75.0, lng: -60.0 },
  "AQ-AUS": { lat: -75.0, lng: 110.0 },
  "AQ-CHL": { lat: -75.0, lng: -70.0 },
  "AQ-FRA": { lat: -67.0, lng: 140.0 },
  "AQ-NZL": { lat: -80.0, lng: 175.0 },
  "AQ-NOR": { lat: -75.0, lng: 0.0 },
  "AQ-GBR": { lat: -75.0, lng: -45.0 },
  "AQ-UNCLAIMED": { lat: -80.0, lng: -120.0 },
  "EI": { lat: -27.11, lng: -109.35 },
  "UM": { lat: 16.73, lng: -169.53 },
  "PN": { lat: -24.38, lng: -128.32 }
};

console.log('🔄 Adding territory translations...');

let updated = 0;

data.forEach(continent => {
  continent.cn.forEach(country => {
    const iso = country.i;
    
    if (translations[iso]) {
      country.ns = translations[iso];
      updated++;
    }
    
    if (coords[iso]) {
      country.mtd = country.mtd || {};
      country.mtd.coor = coords[iso];
    }
  });
});

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

console.log(`✅ Updated ${updated} territories with translations`);
