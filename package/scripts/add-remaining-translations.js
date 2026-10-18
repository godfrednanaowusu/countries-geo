const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../src/data.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Comprehensive translations for ALL countries
const translations = {
  // EUROPE
  "AL": { en: "Albania", zh: "阿尔巴尼亚", es: "Albania", hi: "अल्बानिया", ar: "ألبانيا", pt: "Albânia", bn: "আলবেনিয়া", ru: "Албания", ja: "アルバニア", pa: "ਅਲਬਾਨੀਆ" },
  "AD": { en: "Andorra", zh: "安道尔", es: "Andorra", hi: "अंडोरा", ar: "أندورا", pt: "Andorra", bn: "অ্যান্ডোরা", ru: "Андорра", ja: "アンドラ", pa: "ਅੰਡੋਰਾ" },
  "AT": { en: "Austria", zh: "奥地利", es: "Austria", hi: "ऑस्ट्रिया", ar: "النمسا", pt: "Áustria", bn: "অস্ট্রিয়া", ru: "Австрия", ja: "オーストリア", pa: "ਆਸਟਰੀਆ" },
  "BY": { en: "Belarus", zh: "白俄罗斯", es: "Bielorrusia", hi: "बेलारूस", ar: "بيلاروسيا", pt: "Bielorrússia", bn: "বেলারুশ", ru: "Беларусь", ja: "ベラルーシ", pa: "ਬੇਲਾਰੂਸ" },
  "BE": { en: "Belgium", zh: "比利时", es: "Bélgica", hi: "बेल्जियम", ar: "بلجيكا", pt: "Bélgica", bn: "বেলজিয়াম", ru: "Бельгия", ja: "ベルギー", pa: "ਬੈਲਜੀਅਮ" },
  "BA": { en: "Bosnia and Herzegovina", zh: "波黑", es: "Bosnia y Herzegovina", hi: "बोस्निया", ar: "البوسنة والهرسك", pt: "Bósnia", bn: "বসনিয়া", ru: "Босния", ja: "ボスニア", pa: "ਬੋਸਨੀਆ" },
  "BG": { en: "Bulgaria", zh: "保加利亚", es: "Bulgaria", hi: "बुल्गारिया", ar: "بلغاريا", pt: "Bulgária", bn: "বুলগেরিয়া", ru: "Болгария", ja: "ブルガリア", pa: "ਬੁਲਗਾਰੀਆ" },
  "HR": { en: "Croatia", zh: "克罗地亚", es: "Croacia", hi: "क्रोएशिया", ar: "كرواتيا", pt: "Croácia", bn: "ক্রোয়েশিয়া", ru: "Хорватия", ja: "クロアチア", pa: "ਕਰੋਏਸ਼ੀਆ" },
  "CZ": { en: "Czechia", zh: "捷克", es: "Chequia", hi: "चेकिया", ar: "التشيك", pt: "Tchéquia", bn: "চেকিয়া", ru: "Чехия", ja: "チェコ", pa: "ਚੈਕੀਆ" },
  "DK": { en: "Denmark", zh: "丹麦", es: "Dinamarca", hi: "डेनमार्क", ar: "الدنمارك", pt: "Dinamarca", bn: "ডেনমার্ক", ru: "Дания", ja: "デンマーク", pa: "ਡੈਨਮਾਰਕ" },
  "EE": { en: "Estonia", zh: "爱沙尼亚", es: "Estonia", hi: "एस्टोनिया", ar: "إستونيا", pt: "Estônia", bn: "এস্তোনিয়া", ru: "Эстония", ja: "エストニア", pa: "ਐਸਟੋਨੀਆ" },
  "FI": { en: "Finland", zh: "芬兰", es: "Finlandia", hi: "फिनलैंड", ar: "فنلندا", pt: "Finlândia", bn: "ফিনল্যান্ড", ru: "Финляндия", ja: "フィンランド", pa: "ਫਿਨਲੈਂਡ" },
  "FR": { en: "France", zh: "法国", es: "Francia", hi: "फ्रांस", ar: "فرنسا", pt: "França", bn: "ফ্রান্স", ru: "Франция", ja: "フランス", pa: "ਫਰਾਂਸ" },
  "DE": { en: "Germany", zh: "德国", es: "Alemania", hi: "जर्मनी", ar: "ألمانيا", pt: "Alemanha", bn: "জার্মানি", ru: "Германия", ja: "ドイツ", pa: "ਜਰਮਨੀ" },
  "GR": { en: "Greece", zh: "希腊", es: "Grecia", hi: "ग्रीस", ar: "اليونان", pt: "Grécia", bn: "গ্রিস", ru: "Греция", ja: "ギリシャ", pa: "ਗ੍ਰੀਸ" },
  "HU": { en: "Hungary", zh: "匈牙利", es: "Hungría", hi: "हंगरी", ar: "المجر", pt: "Hungria", bn: "হাঙ্গেরি", ru: "Венгрия", ja: "ハンガリー", pa: "ਹੰਗਰੀ" },
  "IS": { en: "Iceland", zh: "冰岛", es: "Islandia", hi: "आइसलैंड", ar: "آيسلندا", pt: "Islândia", bn: "আইসল্যান্ড", ru: "Исландия", ja: "アイスランド", pa: "ਆਈਸਲੈਂਡ" },
  "IE": { en: "Ireland", zh: "爱尔兰", es: "Irlanda", hi: "आयरलैंड", ar: "أيرلندا", pt: "Irlanda", bn: "আয়ারল্যান্ড", ru: "Ирландия", ja: "アイルランド", pa: "ਆਇਰਲੈਂਡ" },
  "IT": { en: "Italy", zh: "意大利", es: "Italia", hi: "इटली", ar: "إيطاليا", pt: "Itália", bn: "ইতালি", ru: "Италия", ja: "イタリア", pa: "ਇਟਲੀ" },
  "XK": { en: "Kosovo", zh: "科索沃", es: "Kosovo", hi: "कोसोवो", ar: "كوسوفو", pt: "Kosovo", bn: "কসোভো", ru: "Косово", ja: "コソボ", pa: "ਕੋਸੋਵੋ" },
  "LV": { en: "Latvia", zh: "拉脱维亚", es: "Letonia", hi: "लातविया", ar: "لاتفيا", pt: "Letônia", bn: "লাটভিয়া", ru: "Латвия", ja: "ラトビア", pa: "ਲਾਤਵੀਆ" },
  "LI": { en: "Liechtenstein", zh: "列支敦士登", es: "Liechtenstein", hi: "लिकटेंस्टीन", ar: "ليختنشتاين", pt: "Liechtenstein", bn: "লিশটেনস্টাইন", ru: "Лихтенштейн", ja: "リヒテンシュタイン", pa: "ਲਿਕਟੈਂਸਟਾਈਨ" },
  "LT": { en: "Lithuania", zh: "立陶宛", es: "Lituania", hi: "लिथुआनिया", ar: "ليتوانيا", pt: "Lituânia", bn: "লিথুয়ানিয়া", ru: "Литва", ja: "リトアニア", pa: "ਲਿਥੁਆਨੀਆ" },
  "LU": { en: "Luxembourg", zh: "卢森堡", es: "Luxemburgo", hi: "लक्जमबर्ग", ar: "لوكسمبورغ", pt: "Luxemburgo", bn: "লুক্সেমবার্গ", ru: "Люксембург", ja: "ルクセンブルク", pa: "ਲਕਸਮਬਰਗ" },
  "MT": { en: "Malta", zh: "马耳他", es: "Malta", hi: "माल्टा", ar: "مالطا", pt: "Malta", bn: "মাল্টা", ru: "Мальта", ja: "マルタ", pa: "ਮਾਲਟਾ" },
  "MD": { en: "Moldova", zh: "摩尔多瓦", es: "Moldavia", hi: "मोल्दोवा", ar: "مولدوفا", pt: "Moldávia", bn: "মলদোভা", ru: "Молдова", ja: "モルドバ", pa: "ਮੋਲਡੋਵਾ" },
  "MC": { en: "Monaco", zh: "摩纳哥", es: "Mónaco", hi: "मोनाको", ar: "موناكو", pt: "Mônaco", bn: "মোনাকো", ru: "Монако", ja: "モナコ", pa: "ਮੋਨਾਕੋ" },
  "ME": { en: "Montenegro", zh: "黑山", es: "Montenegro", hi: "मोंटेनेग्रो", ar: "الجبل الأسود", pt: "Montenegro", bn: "মন্টিনিগ্রো", ru: "Черногория", ja: "モンテネグロ", pa: "ਮੋਂਟੇਨੇਗਰੋ" },
  "NL": { en: "Netherlands", zh: "荷兰", es: "Países Bajos", hi: "नीदरलैंड", ar: "هولندا", pt: "Países Baixos", bn: "নেদারল্যান্ডস", ru: "Нидерланды", ja: "オランダ", pa: "ਨੀਦਰਲੈਂਡ" },
  "MK": { en: "North Macedonia", zh: "北马其顿", es: "Macedonia del Norte", hi: "उत्तर मैसेडोनिया", ar: "مقدونيا الشمالية", pt: "Macedônia do Norte", bn: "উত্তর মেসিডোনিয়া", ru: "Северная Македония", ja: "北マケドニア", pa: "ਉੱਤਰੀ ਮੈਸੇਡੋਨੀਆ" },
  "NO": { en: "Norway", zh: "挪威", es: "Noruega", hi: "नॉर्वे", ar: "النرويج", pt: "Noruega", bn: "নরওয়ে", ru: "Норвегия", ja: "ノルウェー", pa: "ਨਾਰਵੇ" },
  "PL": { en: "Poland", zh: "波兰", es: "Polonia", hi: "पोलैंड", ar: "بولندا", pt: "Polônia", bn: "পোল্যান্ড", ru: "Польша", ja: "ポーランド", pa: "ਪੋਲੈਂਡ" },
  "PT": { en: "Portugal", zh: "葡萄牙", es: "Portugal", hi: "पुर्तगाल", ar: "البرتغال", pt: "Portugal", bn: "পর্তুগাল", ru: "Португалия", ja: "ポルトガル", pa: "ਪੁਰਤਗਾਲ" },
  "RO": { en: "Romania", zh: "罗马尼亚", es: "Rumania", hi: "रोमानिया", ar: "رومانيا", pt: "Romênia", bn: "রোমানিয়া", ru: "Румыния", ja: "ルーマニア", pa: "ਰੋਮਾਨੀਆ" },
  "RU": { en: "Russia", zh: "俄罗斯", es: "Rusia", hi: "रूस", ar: "روسيا", pt: "Rússia", bn: "রাশিয়া", ru: "Россия", ja: "ロシア", pa: "ਰੂਸ" },
  "SM": { en: "San Marino", zh: "圣马力诺", es: "San Marino", hi: "सैन मैरिनो", ar: "سان مارينو", pt: "San Marino", bn: "সান মারিনো", ru: "Сан-Марино", ja: "サンマリノ", pa: "ਸੈਨ ਮਰੀਨੋ" },
  "RS": { en: "Serbia", zh: "塞尔维亚", es: "Serbia", hi: "सर्बिया", ar: "صربيا", pt: "Sérvia", bn: "সার্বিয়া", ru: "Сербия", ja: "セルビア", pa: "ਸਰਬੀਆ" },
  "SK": { en: "Slovakia", zh: "斯洛伐克", es: "Eslovaquia", hi: "स्लोवाकिया", ar: "سلوفاكيا", pt: "Eslováquia", bn: "স্লোভাকিয়া", ru: "Словакия", ja: "スロバキア", pa: "ਸਲੋਵਾਕੀਆ" },
  "SI": { en: "Slovenia", zh: "斯洛文尼亚", es: "Eslovenia", hi: "स्लोवेनिया", ar: "سلوفينيا", pt: "Eslovênia", bn: "স্লোভেনিয়া", ru: "Словения", ja: "スロベニア", pa: "ਸਲੋਵੇਨੀਆ" },
  "ES": { en: "Spain", zh: "西班牙", es: "España", hi: "स्पेन", ar: "إسبانيا", pt: "Espanha", bn: "স্পেন", ru: "Испания", ja: "スペイン", pa: "ਸਪੇਨ" },
  "SE": { en: "Sweden", zh: "瑞典", es: "Suecia", hi: "स्वीडन", ar: "السويد", pt: "Suécia", bn: "সুইডেন", ru: "Швеция", ja: "スウェーデン", pa: "ਸਵੀਡਨ" },
  "CH": { en: "Switzerland", zh: "瑞士", es: "Suiza", hi: "स्विट्जरलैंड", ar: "سويسرا", pt: "Suíça", bn: "সুইজারল্যান্ড", ru: "Швейцария", ja: "スイス", pa: "ਸਵਿਟਜ਼ਰਲੈਂਡ" },
  "UA": { en: "Ukraine", zh: "乌克兰", es: "Ucrania", hi: "यूक्रेन", ar: "أوكرانيا", pt: "Ucrânia", bn: "ইউক্রেন", ru: "Украина", ja: "ウクライナ", pa: "ਯੂਕਰੇਨ" },
  "GB": { en: "United Kingdom", zh: "英国", es: "Reino Unido", hi: "यूनाइटेड किंगडम", ar: "المملكة المتحدة", pt: "Reino Unido", bn: "যুক্তরাজ্য", ru: "Великобритания", ja: "イギリス", pa: "ਯੂਕੇ" },
  "VA": { en: "Vatican City", zh: "梵蒂冈", es: "Ciudad del Vaticano", hi: "वेटिकन सिटी", ar: "الفاتيكان", pt: "Vaticano", bn: "ভ্যাটিকান", ru: "Ватикан", ja: "バチカン", pa: "ਵੈਟੀਕਨ" },

  // NORTH AMERICA
  "AG": { en: "Antigua and Barbuda", zh: "安提瓜和巴布达", es: "Antigua y Barbuda", hi: "एंटीगुआ", ar: "أنتيغوا", pt: "Antígua e Barbuda", bn: "অ্যান্টিগুয়া", ru: "Антигуа", ja: "アンティグア", pa: "ਐਂਟੀਗੁਆ" },
  "BS": { en: "Bahamas", zh: "巴哈马", es: "Bahamas", hi: "बहामास", ar: "الباهاما", pt: "Bahamas", bn: "বাহামা", ru: "Багамы", ja: "バハマ", pa: "ਬਹਾਮਾਸ" },
  "BB": { en: "Barbados", zh: "巴巴多斯", es: "Barbados", hi: "बारबाडोस", ar: "باربادوس", pt: "Barbados", bn: "বার্বাডোস", ru: "Барбадос", ja: "バルバドス", pa: "ਬਾਰਬਾਡੋਸ" },
  "BZ": { en: "Belize", zh: "伯利兹", es: "Belice", hi: "बेलीज", ar: "بليز", pt: "Belize", bn: "বেলিজ", ru: "Белиз", ja: "ベリーズ", pa: "ਬੇਲੀਜ਼" },
  "CA": { en: "Canada", zh: "加拿大", es: "Canadá", hi: "कनाडा", ar: "كندا", pt: "Canadá", bn: "কানাডা", ru: "Канада", ja: "カナダ", pa: "ਕੈਨੇਡਾ" },
  "CR": { en: "Costa Rica", zh: "哥斯达黎加", es: "Costa Rica", hi: "कोस्टा रिका", ar: "كوستاريكا", pt: "Costa Rica", bn: "কোস্টা রিকা", ru: "Коста-Рика", ja: "コスタリカ", pa: "ਕੋਸਟਾ ਰੀਕਾ" },
  "CU": { en: "Cuba", zh: "古巴", es: "Cuba", hi: "क्यूबा", ar: "كوبا", pt: "Cuba", bn: "কিউবা", ru: "Куба", ja: "キューバ", pa: "ਕਿਊਬਾ" },
  "DM": { en: "Dominica", zh: "多米尼克", es: "Dominica", hi: "डोमिनिका", ar: "دومينيكا", pt: "Dominica", bn: "ডোমিনিকা", ru: "Доминика", ja: "ドミニカ国", pa: "ਡੋਮਿਨਿਕਾ" },
  "DO": { en: "Dominican Republic", zh: "多米尼加", es: "República Dominicana", hi: "डोमिनिकन गणराज्य", ar: "جمهورية الدومينيكان", pt: "República Dominicana", bn: "ডোমিনিকান প্রজাতন্ত্র", ru: "Доминиканская Республика", ja: "ドミニカ共和国", pa: "ਡੋਮਿਨਿਕਨ ਗਣਰਾਜ" },
  "SV": { en: "El Salvador", zh: "萨尔瓦多", es: "El Salvador", hi: "अल सल्वाडोर", ar: "السلفادور", pt: "El Salvador", bn: "এল সালভাদর", ru: "Сальвадор", ja: "エルサルバドル", pa: "ਅਲ ਸਲਵਾਡੋਰ" },
  "GD": { en: "Grenada", zh: "格林纳达", es: "Granada", hi: "ग्रेनाडा", ar: "غرينادا", pt: "Granada", bn: "গ্রেনাডা", ru: "Гренада", ja: "グレナダ", pa: "ਗ੍ਰੇਨਾਡਾ" },
  "GT": { en: "Guatemala", zh: "危地马拉", es: "Guatemala", hi: "ग्वाटेमाला", ar: "غواتيمالا", pt: "Guatemala", bn: "গুয়াতেমালা", ru: "Гватемала", ja: "グアテマラ", pa: "ਗੁਆਟੇਮਾਲਾ" },
  "HT": { en: "Haiti", zh: "海地", es: "Haití", hi: "हैती", ar: "هايتي", pt: "Haiti", bn: "হাইতি", ru: "Гаити", ja: "ハイチ", pa: "ਹੈਤੀ" },
  "HN": { en: "Honduras", zh: "洪都拉斯", es: "Honduras", hi: "होंडुरास", ar: "هندوراس", pt: "Honduras", bn: "হন্ডুরাস", ru: "Гондурас", ja: "ホンジュラス", pa: "ਹੋਂਡੁਰਾਸ" },
  "JM": { en: "Jamaica", zh: "牙买加", es: "Jamaica", hi: "जमैका", ar: "جامايكا", pt: "Jamaica", bn: "জ্যামাইকা", ru: "Ямайка", ja: "ジャマイカ", pa: "ਜਮਾਇਕਾ" },
  "MX": { en: "Mexico", zh: "墨西哥", es: "México", hi: "मेक्सिको", ar: "المكسيك", pt: "México", bn: "মেক্সিকো", ru: "Мексика", ja: "メキシコ", pa: "ਮੈਕਸੀਕੋ" },
  "NI": { en: "Nicaragua", zh: "尼加拉瓜", es: "Nicaragua", hi: "निकारागुआ", ar: "نيكاراغوا", pt: "Nicarágua", bn: "নিকারাগুয়া", ru: "Никарагуа", ja: "ニカラグア", pa: "ਨਿਕਾਰਾਗੁਆ" },
  "PA": { en: "Panama", zh: "巴拿马", es: "Panamá", hi: "पनामा", ar: "بنما", pt: "Panamá", bn: "পানামা", ru: "Панама", ja: "パナマ", pa: "ਪਨਾਮਾ" },
  "KN": { en: "Saint Kitts and Nevis", zh: "圣基茨和尼维斯", es: "San Cristóbal y Nieves", hi: "सेंट किट्स", ar: "سانت كيتس", pt: "São Cristóvão e Névis", bn: "সেন্ট কিটস", ru: "Сент-Китс", ja: "セントクリストファー", pa: "ਸੇਂਟ ਕਿਟਸ" },
  "LC": { en: "Saint Lucia", zh: "圣卢西亚", es: "Santa Lucía", hi: "सेंट लूसिया", ar: "سانت لوسيا", pt: "Santa Lúcia", bn: "সেন্ট লুসিয়া", ru: "Сент-Люсия", ja: "セントルシア", pa: "ਸੇਂਟ ਲੂਸੀਆ" },
  "VC": { en: "Saint Vincent", zh: "圣文森特", es: "San Vicente", hi: "सेंट विंसेंट", ar: "سانت فنسنت", pt: "São Vicente", bn: "সেন্ট ভিনসেন্ট", ru: "Сент-Винсент", ja: "セントビンセント", pa: "ਸੇਂਟ ਵਿਨਸੈਂਟ" },
  "TT": { en: "Trinidad and Tobago", zh: "特立尼达和多巴哥", es: "Trinidad y Tobago", hi: "त्रिनिदाद", ar: "ترينيداد وتوباغو", pt: "Trinidad e Tobago", bn: "ত্রিনিদাদ", ru: "Тринидад", ja: "トリニダード", pa: "ਤ੍ਰਿਨੀਦਾਦ" },
  "US": { en: "United States", zh: "美国", es: "Estados Unidos", hi: "संयुक्त राज्य", ar: "الولايات المتحدة", pt: "Estados Unidos", bn: "মার্কিন যুক্তরাষ্ট্র", ru: "США", ja: "アメリカ", pa: "ਅਮਰੀਕਾ" },

  // SOUTH AMERICA
  "AR": { en: "Argentina", zh: "阿根廷", es: "Argentina", hi: "अर्जेंटीना", ar: "الأرجنتين", pt: "Argentina", bn: "আর্জেন্টিনা", ru: "Аргентина", ja: "アルゼンチン", pa: "ਅਰਜਨਟੀਨਾ" },
  "BO": { en: "Bolivia", zh: "玻利维亚", es: "Bolivia", hi: "बोलीविया", ar: "بوليفيا", pt: "Bolívia", bn: "বলিভিয়া", ru: "Боливия", ja: "ボリビア", pa: "ਬੋਲੀਵੀਆ" },
  "BR": { en: "Brazil", zh: "巴西", es: "Brasil", hi: "ब्राज़ील", ar: "البرازيل", pt: "Brasil", bn: "ব্রাজিল", ru: "Бразилия", ja: "ブラジル", pa: "ਬ੍ਰਾਜ਼ੀਲ" },
  "CL": { en: "Chile", zh: "智利", es: "Chile", hi: "चिली", ar: "تشيلي", pt: "Chile", bn: "চিলি", ru: "Чили", ja: "チリ", pa: "ਚਿਲੀ" },
  "CO": { en: "Colombia", zh: "哥伦比亚", es: "Colombia", hi: "कोलंबिया", ar: "كولومبيا", pt: "Colômbia", bn: "কলম্বিয়া", ru: "Колумбия", ja: "コロンビア", pa: "ਕੋਲੰਬੀਆ" },
  "EC": { en: "Ecuador", zh: "厄瓜多尔", es: "Ecuador", hi: "इक्वाडोर", ar: "الإكوادور", pt: "Equador", bn: "ইকুয়েডর", ru: "Эквадор", ja: "エクアドル", pa: "ਇਕਵਾਡੋਰ" },
  "GY": { en: "Guyana", zh: "圭亚那", es: "Guyana", hi: "गुयाना", ar: "غيانا", pt: "Guiana", bn: "গায়ানা", ru: "Гайана", ja: "ガイアナ", pa: "ਗੁਆਨਾ" },
  "PY": { en: "Paraguay", zh: "巴拉圭", es: "Paraguay", hi: "पैराग्वे", ar: "باراغواي", pt: "Paraguai", bn: "প্যারাগুয়ে", ru: "Парагвай", ja: "パラグアイ", pa: "ਪੈਰਾਗੁਏ" },
  "PE": { en: "Peru", zh: "秘鲁", es: "Perú", hi: "पेरू", ar: "بيرو", pt: "Peru", bn: "পেরু", ru: "Перу", ja: "ペルー", pa: "ਪੇਰੂ" },
  "SR": { en: "Suriname", zh: "苏里南", es: "Surinam", hi: "सूरीनाम", ar: "سورينام", pt: "Suriname", bn: "সুরিনাম", ru: "Суринам", ja: "スリナム", pa: "ਸੂਰੀਨਾਮ" },
  "UY": { en: "Uruguay", zh: "乌拉圭", es: "Uruguay", hi: "उरुग्वे", ar: "أوروغواي", pt: "Uruguai", bn: "উরুগুয়ে", ru: "Уругвай", ja: "ウルグアイ", pa: "ਉਰੂਗੁਏ" },
  "VE": { en: "Venezuela", zh: "委内瑞拉", es: "Venezuela", hi: "वेनेजुएला", ar: "فنزويلا", pt: "Venezuela", bn: "ভেনেজুয়েলা", ru: "Венесуэла", ja: "ベネズエラ", pa: "ਵੈਨੇਜ਼ੁਏਲਾ" },

  // OCEANIA
  "AU": { en: "Australia", zh: "澳大利亚", es: "Australia", hi: "ऑस्ट्रेलिया", ar: "أستراليا", pt: "Austrália", bn: "অস্ট্রেলিয়া", ru: "Австралия", ja: "オーストラリア", pa: "ਆਸਟ੍ਰੇਲੀਆ" },
  "FJ": { en: "Fiji", zh: "斐济", es: "Fiyi", hi: "फिजी", ar: "فيجي", pt: "Fiji", bn: "ফিজি", ru: "Фиджи", ja: "フィジー", pa: "ਫਿਜੀ" },
  "KI": { en: "Kiribati", zh: "基里巴斯", es: "Kiribati", hi: "किरिबाती", ar: "كيريباتي", pt: "Kiribati", bn: "কিরিবাতি", ru: "Кирибати", ja: "キリバス", pa: "ਕਿਰੀਬਾਤੀ" },
  "MH": { en: "Marshall Islands", zh: "马绍尔群岛", es: "Islas Marshall", hi: "मार्शल द्वीप", ar: "جزر مارشال", pt: "Ilhas Marshall", bn: "মার্শাল দ্বীপপুঞ্জ", ru: "Маршалловы Острова", ja: "マーシャル諸島", pa: "ਮਾਰਸ਼ਲ ਟਾਪੂ" },
  "FM": { en: "Micronesia", zh: "密克罗尼西亚", es: "Micronesia", hi: "माइक्रोनेशिया", ar: "ميكرونيزيا", pt: "Micronésia", bn: "মাইক্রোনেশিয়া", ru: "Микронезия", ja: "ミクロネシア", pa: "ਮਾਈਕ੍ਰੋਨੇਸ਼ੀਆ" },
  "NR": { en: "Nauru", zh: "瑙鲁", es: "Nauru", hi: "नाउरू", ar: "ناورو", pt: "Nauru", bn: "নাউরু", ru: "Науру", ja: "ナウル", pa: "ਨਾਉਰੂ" },
  "NZ": { en: "New Zealand", zh: "新西兰", es: "Nueva Zelanda", hi: "न्यूजीलैंड", ar: "نيوزيلندا", pt: "Nova Zelândia", bn: "নিউজিল্যান্ড", ru: "Новая Зеландия", ja: "ニュージーランド", pa: "ਨਿਊਜ਼ੀਲੈਂਡ" },
  "PW": { en: "Palau", zh: "帕劳", es: "Palaos", hi: "पलाउ", ar: "بالاو", pt: "Palau", bn: "পালাউ", ru: "Палау", ja: "パラオ", pa: "ਪਲਾਊ" },
  "PG": { en: "Papua New Guinea", zh: "巴布亚新几内亚", es: "Papúa Nueva Guinea", hi: "पापुआ न्यू गिनी", ar: "بابوا غينيا الجديدة", pt: "Papua-Nova Guiné", bn: "পাপুয়া নিউ গিনি", ru: "Папуа — Новая Гвинея", ja: "パプアニューギニア", pa: "ਪਾਪੂਆ ਨਿਊ ਗਿਨੀ" },
  "WS": { en: "Samoa", zh: "萨摩亚", es: "Samoa", hi: "समोआ", ar: "ساموا", pt: "Samoa", bn: "সামোয়া", ru: "Самоа", ja: "サモア", pa: "ਸਾਮੋਆ" },
  "SB": { en: "Solomon Islands", zh: "所罗门群岛", es: "Islas Salomón", hi: "सोलोमन द्वीप", ar: "جزر سليمان", pt: "Ilhas Salomão", bn: "সলোমন দ্বীপপুঞ্জ", ru: "Соломоновы Острова", ja: "ソロモン諸島", pa: "ਸੋਲੋਮਨ ਟਾਪੂ" },
  "TO": { en: "Tonga", zh: "汤加", es: "Tonga", hi: "टोंगा", ar: "تونغا", pt: "Tonga", bn: "টোঙ্গা", ru: "Тонга", ja: "トンガ", pa: "ਟੋਂਗਾ" },
  "TV": { en: "Tuvalu", zh: "图瓦卢", es: "Tuvalu", hi: "तुवालू", ar: "توفالو", pt: "Tuvalu", bn: "টুভালু", ru: "Тувалу", ja: "ツバル", pa: "ਤੁਵਾਲੂ" },
  "VU": { en: "Vanuatu", zh: "瓦努阿图", es: "Vanuatu", hi: "वानुअतु", ar: "فانواتو", pt: "Vanuatu", bn: "ভানুয়াতু", ru: "Вануату", ja: "バヌアツ", pa: "ਵਾਨੂਆਟੂ" }
};

// Country coordinates
const countryCoords = {
  "AL": { lat: 41.15, lng: 20.17 }, "AD": { lat: 42.55, lng: 1.60 }, "AT": { lat: 47.52, lng: 14.55 },
  "BY": { lat: 53.71, lng: 27.95 }, "BE": { lat: 50.50, lng: 4.47 }, "BA": { lat: 43.92, lng: 17.68 },
  "BG": { lat: 42.73, lng: 25.49 }, "HR": { lat: 45.10, lng: 15.20 }, "CZ": { lat: 49.82, lng: 15.47 },
  "DK": { lat: 56.26, lng: 9.50 }, "EE": { lat: 58.60, lng: 25.01 }, "FI": { lat: 61.92, lng: 25.75 },
  "FR": { lat: 46.23, lng: 2.21 }, "DE": { lat: 51.17, lng: 10.45 }, "GR": { lat: 39.07, lng: 21.82 },
  "HU": { lat: 47.16, lng: 19.50 }, "IS": { lat: 64.96, lng: -19.02 }, "IE": { lat: 53.14, lng: -8.00 },
  "IT": { lat: 41.87, lng: 12.57 }, "XK": { lat: 42.60, lng: 20.90 }, "LV": { lat: 56.88, lng: 24.60 },
  "LI": { lat: 47.17, lng: 9.56 }, "LT": { lat: 55.17, lng: 23.88 }, "LU": { lat: 49.82, lng: 6.13 },
  "MT": { lat: 35.94, lng: 14.38 }, "MD": { lat: 47.41, lng: 28.37 }, "MC": { lat: 43.74, lng: 7.42 },
  "ME": { lat: 42.71, lng: 19.37 }, "NL": { lat: 52.13, lng: 5.29 }, "MK": { lat: 41.51, lng: 21.75 },
  "NO": { lat: 60.47, lng: 8.47 }, "PL": { lat: 51.92, lng: 19.15 }, "PT": { lat: 39.40, lng: -8.22 },
  "RO": { lat: 45.94, lng: 24.97 }, "RU": { lat: 61.52, lng: 105.32 }, "SM": { lat: 43.94, lng: 12.46 },
  "RS": { lat: 44.02, lng: 21.01 }, "SK": { lat: 48.67, lng: 19.70 }, "SI": { lat: 46.15, lng: 14.99 },
  "ES": { lat: 40.46, lng: -3.75 }, "SE": { lat: 60.13, lng: 18.64 }, "CH": { lat: 46.82, lng: 8.23 },
  "UA": { lat: 48.38, lng: 31.17 }, "GB": { lat: 55.38, lng: -3.44 }, "VA": { lat: 41.90, lng: 12.45 },
  "AG": { lat: 17.06, lng: -61.80 }, "BS": { lat: 25.03, lng: -77.40 }, "BB": { lat: 13.19, lng: -59.54 },
  "BZ": { lat: 17.19, lng: -88.50 }, "CA": { lat: 56.13, lng: -106.35 }, "CR": { lat: 9.75, lng: -83.75 },
  "CU": { lat: 21.52, lng: -77.78 }, "DM": { lat: 15.41, lng: -61.34 }, "DO": { lat: 18.74, lng: -70.16 },
  "SV": { lat: 13.79, lng: -88.90 }, "GD": { lat: 12.26, lng: -61.60 }, "GT": { lat: 15.78, lng: -90.23 },
  "HT": { lat: 18.97, lng: -72.29 }, "HN": { lat: 15.20, lng: -86.24 }, "JM": { lat: 18.11, lng: -77.30 },
  "MX": { lat: 23.63, lng: -102.55 }, "NI": { lat: 12.87, lng: -85.21 }, "PA": { lat: 8.54, lng: -80.78 },
  "KN": { lat: 17.36, lng: -62.78 }, "LC": { lat: 13.91, lng: -60.98 }, "VC": { lat: 12.98, lng: -61.29 },
  "TT": { lat: 10.69, lng: -61.22 }, "US": { lat: 37.09, lng: -95.71 },
  "AR": { lat: -38.42, lng: -63.62 }, "BO": { lat: -16.29, lng: -63.59 }, "BR": { lat: -14.24, lng: -51.93 },
  "CL": { lat: -35.68, lng: -71.54 }, "CO": { lat: 4.57, lng: -74.30 }, "EC": { lat: -1.83, lng: -78.18 },
  "GY": { lat: 4.86, lng: -58.93 }, "PY": { lat: -23.44, lng: -58.44 }, "PE": { lat: -9.19, lng: -75.02 },
  "SR": { lat: 3.92, lng: -56.03 }, "UY": { lat: -32.52, lng: -55.77 }, "VE": { lat: 6.42, lng: -66.59 },
  "AU": { lat: -25.27, lng: 133.78 }, "FJ": { lat: -17.71, lng: 178.07 }, "KI": { lat: -3.37, lng: -168.73 },
  "MH": { lat: 7.13, lng: 171.18 }, "FM": { lat: 7.43, lng: 150.55 }, "NR": { lat: -0.52, lng: 166.93 },
  "NZ": { lat: -40.90, lng: 174.89 }, "PW": { lat: 7.51, lng: 134.58 }, "PG": { lat: -6.31, lng: 143.96 },
  "WS": { lat: -13.76, lng: -172.10 }, "SB": { lat: -9.43, lng: 160.02 }, "TO": { lat: -21.18, lng: -175.20 },
  "TV": { lat: -7.11, lng: 177.65 }, "VU": { lat: -15.38, lng: 166.96 }
};

// Telephone codes
const telCodes = {
  "AL": "+355", "AD": "+376", "AT": "+43", "BY": "+375", "BE": "+32", "BA": "+387", "BG": "+359",
  "HR": "+385", "CZ": "+420", "DK": "+45", "EE": "+372", "FI": "+358", "FR": "+33", "DE": "+49",
  "GR": "+30", "HU": "+36", "IS": "+354", "IE": "+353", "IT": "+39", "XK": "+383", "LV": "+371",
  "LI": "+423", "LT": "+370", "LU": "+352", "MT": "+356", "MD": "+373", "MC": "+377", "ME": "+382",
  "NL": "+31", "MK": "+389", "NO": "+47", "PL": "+48", "PT": "+351", "RO": "+40", "RU": "+7",
  "SM": "+378", "RS": "+381", "SK": "+421", "SI": "+386", "ES": "+34", "SE": "+46", "CH": "+41",
  "UA": "+380", "GB": "+44", "VA": "+379",
  "AG": "+1", "BS": "+1", "BB": "+1", "BZ": "+501", "CA": "+1", "CR": "+506", "CU": "+53",
  "DM": "+1", "DO": "+1", "SV": "+503", "GD": "+1", "GT": "+502", "HT": "+509", "HN": "+504",
  "JM": "+1", "MX": "+52", "NI": "+505", "PA": "+507", "KN": "+1", "LC": "+1", "VC": "+1",
  "TT": "+1", "US": "+1",
  "AR": "+54", "BO": "+591", "BR": "+55", "CL": "+56", "CO": "+57", "EC": "+593", "GY": "+592",
  "PY": "+595", "PE": "+51", "SR": "+597", "UY": "+598", "VE": "+58",
  "AU": "+61", "FJ": "+679", "KI": "+686", "MH": "+692", "FM": "+691", "NR": "+674", "NZ": "+64",
  "PW": "+680", "PG": "+675", "WS": "+685", "SB": "+677", "TO": "+676", "TV": "+688", "VU": "+678"
};

console.log('🔄 Adding remaining translations...');

let updated = 0;

data.forEach(continent => {
  continent.cn.forEach(country => {
    const iso = country.i;
    
    // Update translations if available
    if (translations[iso]) {
      country.ns = translations[iso];
      updated++;
    }
    
    // Update coordinates if available
    if (countryCoords[iso]) {
      country.mtd = country.mtd || {};
      country.mtd.coor = countryCoords[iso];
    }
    
    // Update telephone codes if available
    if (telCodes[iso]) {
      country.mtd = country.mtd || {};
      country.mtd.telc = telCodes[iso];
    }
  });
});

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

console.log(`✅ Updated ${updated} countries with translations`);
