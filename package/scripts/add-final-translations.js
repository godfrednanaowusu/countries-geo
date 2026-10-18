const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../src/data.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Remaining translations
const translations = {
  // AFRICA (remaining)
  "AO": { en: "Angola", zh: "安哥拉", es: "Angola", hi: "अंगोला", ar: "أنغولا", pt: "Angola", bn: "অ্যাঙ্গোলা", ru: "Ангола", ja: "アンゴラ", pa: "ਅੰਗੋਲਾ" },
  "BJ": { en: "Benin", zh: "贝宁", es: "Benín", hi: "बेनिन", ar: "بنين", pt: "Benim", bn: "বেনিন", ru: "Бенин", ja: "ベナン", pa: "ਬੇਨਿਨ" },
  "BW": { en: "Botswana", zh: "博茨瓦纳", es: "Botsuana", hi: "बोत्सवाना", ar: "بوتسوانا", pt: "Botsuana", bn: "বতসোয়ানা", ru: "Ботсвана", ja: "ボツワナ", pa: "ਬੋਤਸਵਾਨਾ" },
  "BF": { en: "Burkina Faso", zh: "布基纳法索", es: "Burkina Faso", hi: "बुर्किना फासो", ar: "بوركينا فاسو", pt: "Burkina Faso", bn: "বুর্কিনা ফাসো", ru: "Буркина-Фасо", ja: "ブルキナファソ", pa: "ਬੁਰਕੀਨਾ ਫਾਸੋ" },
  "BI": { en: "Burundi", zh: "布隆迪", es: "Burundi", hi: "बुरुंडी", ar: "بوروندي", pt: "Burundi", bn: "বুরুন্ডি", ru: "Бурунди", ja: "ブルンジ", pa: "ਬੁਰੁੰਡੀ" },
  "CV": { en: "Cabo Verde", zh: "佛得角", es: "Cabo Verde", hi: "केप वर्डे", ar: "الرأس الأخضر", pt: "Cabo Verde", bn: "কেপ ভার্দে", ru: "Кабо-Верде", ja: "カーボベルデ", pa: "ਕੇਪ ਵਰਡੇ" },
  "CM": { en: "Cameroon", zh: "喀麦隆", es: "Camerún", hi: "कैमरून", ar: "الكاميرون", pt: "Camarões", bn: "ক্যামেরুন", ru: "Камерун", ja: "カメルーン", pa: "ਕੈਮਰੂਨ" },
  "CF": { en: "Central African Republic", zh: "中非共和国", es: "República Centroafricana", hi: "मध्य अफ़्रीकी गणराज्य", ar: "جمهورية أفريقيا الوسطى", pt: "República Centro-Africana", bn: "মধ্য আফ্রিকান প্রজাতন্ত্র", ru: "ЦАР", ja: "中央アフリカ", pa: "ਕੇਂਦਰੀ ਅਫ਼ਰੀਕੀ ਗਣਰਾਜ" },
  "TD": { en: "Chad", zh: "乍得", es: "Chad", hi: "चाड", ar: "تشاد", pt: "Chade", bn: "চাদ", ru: "Чад", ja: "チャド", pa: "ਚਾਡ" },
  "KM": { en: "Comoros", zh: "科摩罗", es: "Comoras", hi: "कोमोरोस", ar: "جزر القمر", pt: "Comores", bn: "কমোরোস", ru: "Коморы", ja: "コモロ", pa: "ਕੋਮੋਰੋਸ" },
  "CD": { en: "DR Congo", zh: "刚果民主共和国", es: "RD del Congo", hi: "कांगो लोकतांत्रिक गणराज्य", ar: "الكونغو الديمقراطية", pt: "RD Congo", bn: "গণতান্ত্রিক কঙ্গো", ru: "ДР Конго", ja: "コンゴ民主共和国", pa: "ਕਾਂਗੋ ਲੋਕਤੰਤਰੀ ਗਣਰਾਜ" },
  "CG": { en: "Congo", zh: "刚果", es: "Congo", hi: "कांगो", ar: "الكونغو", pt: "Congo", bn: "কঙ্গো", ru: "Конго", ja: "コンゴ", pa: "ਕਾਂਗੋ" },
  "CI": { en: "Côte d'Ivoire", zh: "科特迪瓦", es: "Costa de Marfil", hi: "आइवरी कोस्ट", ar: "ساحل العاج", pt: "Costa do Marfim", bn: "আইভরি কোস্ট", ru: "Кот-д'Ивуар", ja: "コートジボワール", pa: "ਆਈਵਰੀ ਕੋਸਟ" },
  "DJ": { en: "Djibouti", zh: "吉布提", es: "Yibuti", hi: "जिबूती", ar: "جيبوتي", pt: "Djibuti", bn: "জিবুতি", ru: "Джибути", ja: "ジブチ", pa: "ਜਿਬੂਤੀ" },
  "GQ": { en: "Equatorial Guinea", zh: "赤道几内亚", es: "Guinea Ecuatorial", hi: "इक्वेटोरियल गिनी", ar: "غينيا الاستوائية", pt: "Guiné Equatorial", bn: "বিষুবীয় গিনি", ru: "Экваториальная Гвинея", ja: "赤道ギニア", pa: "ਭੂਮੱਧ ਗਿਨੀ" },
  "ER": { en: "Eritrea", zh: "厄立特里亚", es: "Eritrea", hi: "इरिट्रिया", ar: "إريتريا", pt: "Eritreia", bn: "ইরিত্রিয়া", ru: "Эритрея", ja: "エリトリア", pa: "ਇਰੀਟ੍ਰੀਆ" },
  "SZ": { en: "Eswatini", zh: "斯威士兰", es: "Esuatini", hi: "एस्वातिनी", ar: "إسواتيني", pt: "Essuatíni", bn: "ইসোয়াতিনি", ru: "Эсватини", ja: "エスワティニ", pa: "ਐਸਵਾਤੀਨੀ" },
  "GA": { en: "Gabon", zh: "加蓬", es: "Gabón", hi: "गैबॉन", ar: "الغابون", pt: "Gabão", bn: "গ্যাবন", ru: "Габон", ja: "ガボン", pa: "ਗੈਬੋਨ" },
  "GM": { en: "Gambia", zh: "冈比亚", es: "Gambia", hi: "गाम्बिया", ar: "غامبيا", pt: "Gâmbia", bn: "গাম্বিয়া", ru: "Гамбия", ja: "ガンビア", pa: "ਗੈਂਬੀਆ" },
  "GN": { en: "Guinea", zh: "几内亚", es: "Guinea", hi: "गिनी", ar: "غينيا", pt: "Guiné", bn: "গিনি", ru: "Гвинея", ja: "ギニア", pa: "ਗਿਨੀ" },
  "GW": { en: "Guinea-Bissau", zh: "几内亚比绍", es: "Guinea-Bisáu", hi: "गिनी-बिसाउ", ar: "غينيا بيساو", pt: "Guiné-Bissau", bn: "গিনি-বিসাউ", ru: "Гвинея-Бисау", ja: "ギニアビサウ", pa: "ਗਿਨੀ-ਬਿਸਾਊ" },
  "LS": { en: "Lesotho", zh: "莱索托", es: "Lesoto", hi: "लेसोथो", ar: "ليسوتو", pt: "Lesoto", bn: "লেসোথো", ru: "Лесото", ja: "レソト", pa: "ਲੈਸੋਥੋ" },
  "LR": { en: "Liberia", zh: "利比里亚", es: "Liberia", hi: "लाइबेरिया", ar: "ليبيريا", pt: "Libéria", bn: "লাইবেরিয়া", ru: "Либерия", ja: "リベリア", pa: "ਲਾਈਬੇਰੀਆ" },
  "LY": { en: "Libya", zh: "利比亚", es: "Libia", hi: "लीबिया", ar: "ليبيا", pt: "Líbia", bn: "লিবিয়া", ru: "Ливия", ja: "リビア", pa: "ਲੀਬੀਆ" },
  "MG": { en: "Madagascar", zh: "马达加斯加", es: "Madagascar", hi: "मेडागास्कर", ar: "مدغشقر", pt: "Madagáscar", bn: "মাদাগাস্কার", ru: "Мадагаскар", ja: "マダガスカル", pa: "ਮੈਡਾਗਾਸਕਰ" },
  "MW": { en: "Malawi", zh: "马拉维", es: "Malaui", hi: "मलावी", ar: "مالاوي", pt: "Malawi", bn: "মালাউই", ru: "Малави", ja: "マラウイ", pa: "ਮਲਾਵੀ" },
  "ML": { en: "Mali", zh: "马里", es: "Malí", hi: "माली", ar: "مالي", pt: "Mali", bn: "মালি", ru: "Мали", ja: "マリ", pa: "ਮਾਲੀ" },
  "MR": { en: "Mauritania", zh: "毛里塔尼亚", es: "Mauritania", hi: "मॉरिटानिया", ar: "موريتانيا", pt: "Mauritânia", bn: "মৌরিতানিয়া", ru: "Мавритания", ja: "モーリタニア", pa: "ਮੌਰੀਤਾਨੀਆ" },
  "MU": { en: "Mauritius", zh: "毛里求斯", es: "Mauricio", hi: "मॉरीशस", ar: "موريشيوس", pt: "Maurícia", bn: "মরিশাস", ru: "Маврикий", ja: "モーリシャス", pa: "ਮੌਰੀਸ਼ਸ" },
  "YT": { en: "Mayotte", zh: "马约特", es: "Mayotte", hi: "मायोट", ar: "مايوت", pt: "Mayotte", bn: "মায়োট", ru: "Майотта", ja: "マヨット", pa: "ਮਾਯੋਟ" },
  "MZ": { en: "Mozambique", zh: "莫桑比克", es: "Mozambique", hi: "मोज़ाम्बिक", ar: "موزمبيق", pt: "Moçambique", bn: "মোজাম্বিক", ru: "Мозамбик", ja: "モザンビーク", pa: "ਮੋਜ਼ਾਮਬੀਕ" },
  "NA": { en: "Namibia", zh: "纳米比亚", es: "Namibia", hi: "नामीबिया", ar: "ناميبيا", pt: "Namíbia", bn: "নামিবিয়া", ru: "Намибия", ja: "ナミビア", pa: "ਨਾਮੀਬੀਆ" },
  "NE": { en: "Niger", zh: "尼日尔", es: "Níger", hi: "नाइजर", ar: "النيجر", pt: "Níger", bn: "নাইজার", ru: "Нигер", ja: "ニジェール", pa: "ਨਾਈਜਰ" },
  "RE": { en: "Réunion", zh: "留尼汪", es: "Reunión", hi: "रीयूनियन", ar: "ريونيون", pt: "Reunião", bn: "রিইউনিয়ন", ru: "Реюньон", ja: "レユニオン", pa: "ਰੀਯੂਨੀਅਨ" },
  "RW": { en: "Rwanda", zh: "卢旺达", es: "Ruanda", hi: "रवांडा", ar: "رواندا", pt: "Ruanda", bn: "রুয়ান্ডা", ru: "Руанда", ja: "ルワンダ", pa: "ਰਵਾਂਡਾ" },
  "SH": { en: "Saint Helena", zh: "圣赫勒拿", es: "Santa Elena", hi: "सेंट हेलेना", ar: "سانت هيلينا", pt: "Santa Helena", bn: "সেন্ট হেলেনা", ru: "Святая Елена", ja: "セントヘレナ", pa: "ਸੇਂਟ ਹੈਲੇਨਾ" },
  "ST": { en: "São Tomé and Príncipe", zh: "圣多美和普林西比", es: "Santo Tomé y Príncipe", hi: "साओ टोमे", ar: "ساو تومي", pt: "São Tomé e Príncipe", bn: "সাঁউ তুমি", ru: "Сан-Томе", ja: "サントメ・プリンシペ", pa: "ਸਾਓ ਟੋਮੇ" },
  "SN": { en: "Senegal", zh: "塞内加尔", es: "Senegal", hi: "सेनेगल", ar: "السنغال", pt: "Senegal", bn: "সেনেগাল", ru: "Сенегал", ja: "セネガル", pa: "ਸੇਨੇਗਲ" },
  "SC": { en: "Seychelles", zh: "塞舌尔", es: "Seychelles", hi: "सेशेल्स", ar: "سيشل", pt: "Seicheles", bn: "সেশেলস", ru: "Сейшелы", ja: "セーシェル", pa: "ਸੇਸ਼ੇਲਸ" },
  "SL": { en: "Sierra Leone", zh: "塞拉利昂", es: "Sierra Leona", hi: "सिएरा लियोन", ar: "سيراليون", pt: "Serra Leoa", bn: "সিয়েরা লিওন", ru: "Сьерра-Леоне", ja: "シエラレオネ", pa: "ਸੀਅਰਾ ਲਿਓਨ" },
  "SO": { en: "Somalia", zh: "索马里", es: "Somalia", hi: "सोमालिया", ar: "الصومال", pt: "Somália", bn: "সোমালিয়া", ru: "Сомали", ja: "ソマリア", pa: "ਸੋਮਾਲੀਆ" },
  "SS": { en: "South Sudan", zh: "南苏丹", es: "Sudán del Sur", hi: "दक्षिण सूडान", ar: "جنوب السودان", pt: "Sudão do Sul", bn: "দক্ষিণ সুদান", ru: "Южный Судан", ja: "南スーダン", pa: "ਦੱਖਣੀ ਸੁਡਾਨ" },
  "SD": { en: "Sudan", zh: "苏丹", es: "Sudán", hi: "सूडान", ar: "السودان", pt: "Sudão", bn: "সুদান", ru: "Судан", ja: "スーダン", pa: "ਸੁਡਾਨ" },
  "TG": { en: "Togo", zh: "多哥", es: "Togo", hi: "टोगो", ar: "توغو", pt: "Togo", bn: "টোগো", ru: "Того", ja: "トーゴ", pa: "ਟੋਗੋ" },
  "TN": { en: "Tunisia", zh: "突尼斯", es: "Túnez", hi: "ट्यूनीशिया", ar: "تونس", pt: "Tunísia", bn: "তিউনিসিয়া", ru: "Тунис", ja: "チュニジア", pa: "ਟਿਊਨੀਸ਼ੀਆ" },
  "UG": { en: "Uganda", zh: "乌干达", es: "Uganda", hi: "युगांडा", ar: "أوغندا", pt: "Uganda", bn: "উগান্ডা", ru: "Уганда", ja: "ウガンダ", pa: "ਯੂਗਾਂਡਾ" },
  "EH": { en: "Western Sahara", zh: "西撒哈拉", es: "Sahara Occidental", hi: "पश्चिमी सहारा", ar: "الصحراء الغربية", pt: "Saara Ocidental", bn: "পশ্চিম সাহারা", ru: "Западная Сахара", ja: "西サハラ", pa: "ਪੱਛਮੀ ਸਹਾਰਾ" },
  "ZM": { en: "Zambia", zh: "赞比亚", es: "Zambia", hi: "जाम्बिया", ar: "زامبيا", pt: "Zâmbia", bn: "জাম্বিয়া", ru: "Замбия", ja: "ザンビア", pa: "ਜ਼ੈਂਬੀਆ" },
  "ZW": { en: "Zimbabwe", zh: "津巴布韦", es: "Zimbabue", hi: "जिम्बाब्वे", ar: "زيمبابوي", pt: "Zimbábue", bn: "জিম্বাবুয়ে", ru: "Зимбабве", ja: "ジンバブエ", pa: "ਜ਼ਿੰਬਾਬਵੇ" },

  // ASIA (remaining)
  "AM": { en: "Armenia", zh: "亚美尼亚", es: "Armenia", hi: "आर्मेनिया", ar: "أرمينيا", pt: "Armênia", bn: "আর্মেনিয়া", ru: "Армения", ja: "アルメニア", pa: "ਅਰਮੀਨੀਆ" },
  "AZ": { en: "Azerbaijan", zh: "阿塞拜疆", es: "Azerbaiyán", hi: "अज़रबैजान", ar: "أذربيجان", pt: "Azerbaijão", bn: "আজারবাইজান", ru: "Азербайджан", ja: "アゼルバイジャン", pa: "ਅਜ਼ਰਬਾਈਜਾਨ" },
  "BH": { en: "Bahrain", zh: "巴林", es: "Baréin", hi: "बहरीन", ar: "البحرين", pt: "Bahrein", bn: "বাহরাইন", ru: "Бахрейн", ja: "バーレーン", pa: "ਬਹਿਰੀਨ" },
  "BT": { en: "Bhutan", zh: "不丹", es: "Bután", hi: "भूटान", ar: "بوتان", pt: "Butão", bn: "ভুটান", ru: "Бутан", ja: "ブータン", pa: "ਭੂਟਾਨ" },
  "BN": { en: "Brunei", zh: "文莱", es: "Brunéi", hi: "ब्रुनेई", ar: "بروناي", pt: "Brunei", bn: "ব্রুনাই", ru: "Бруней", ja: "ブルネイ", pa: "ਬਰੂਨੇਈ" },
  "GE": { en: "Georgia", zh: "格鲁吉亚", es: "Georgia", hi: "जॉर्जिया", ar: "جورجيا", pt: "Geórgia", bn: "জর্জিয়া", ru: "Грузия", ja: "ジョージア", pa: "ਜਾਰਜੀਆ" },
  "JO": { en: "Jordan", zh: "约旦", es: "Jordania", hi: "जॉर्डन", ar: "الأردن", pt: "Jordânia", bn: "জর্ডান", ru: "Иордания", ja: "ヨルダン", pa: "ਜਾਰਡਨ" },
  "KZ": { en: "Kazakhstan", zh: "哈萨克斯坦", es: "Kazajistán", hi: "कजाखस्तान", ar: "كازاخستان", pt: "Cazaquistão", bn: "কাজাখস্তান", ru: "Казахстан", ja: "カザフスタン", pa: "ਕਜ਼ਾਖ਼ਸਤਾਨ" },
  "KP": { en: "North Korea", zh: "朝鲜", es: "Corea del Norte", hi: "उत्तर कोरिया", ar: "كوريا الشمالية", pt: "Coreia do Norte", bn: "উত্তর কোরিয়া", ru: "Северная Корея", ja: "北朝鮮", pa: "ਉੱਤਰੀ ਕੋਰੀਆ" },
  "KG": { en: "Kyrgyzstan", zh: "吉尔吉斯斯坦", es: "Kirguistán", hi: "किर्गिस्तान", ar: "قيرغيزستان", pt: "Quirguistão", bn: "কিরগিজস্তান", ru: "Киргизия", ja: "キルギス", pa: "ਕਿਰਗਿਜ਼ਸਤਾਨ" },
  "LA": { en: "Laos", zh: "老挝", es: "Laos", hi: "लाओस", ar: "لاوس", pt: "Laos", bn: "লাওস", ru: "Лаос", ja: "ラオス", pa: "ਲਾਓਸ" },
  "LB": { en: "Lebanon", zh: "黎巴嫩", es: "Líbano", hi: "लेबनान", ar: "لبنان", pt: "Líbano", bn: "লেবানন", ru: "Ливан", ja: "レバノン", pa: "ਲੈਬਨਾਨ" },
  "MV": { en: "Maldives", zh: "马尔代夫", es: "Maldivas", hi: "मालदीव", ar: "جزر المالديف", pt: "Maldivas", bn: "মালদ্বীপ", ru: "Мальдивы", ja: "モルディブ", pa: "ਮਾਲਦੀਵ" },
  "MN": { en: "Mongolia", zh: "蒙古", es: "Mongolia", hi: "मंगोलिया", ar: "منغوليا", pt: "Mongólia", bn: "মঙ্গোলিয়া", ru: "Монголия", ja: "モンゴル", pa: "ਮੰਗੋਲੀਆ" },
  "OM": { en: "Oman", zh: "阿曼", es: "Omán", hi: "ओमान", ar: "عُمان", pt: "Omã", bn: "ওমান", ru: "Оман", ja: "オマーン", pa: "ਓਮਾਨ" },
  "SY": { en: "Syria", zh: "叙利亚", es: "Siria", hi: "सीरिया", ar: "سوريا", pt: "Síria", bn: "সিরিয়া", ru: "Сирия", ja: "シリア", pa: "ਸੀਰੀਆ" },
  "TJ": { en: "Tajikistan", zh: "塔吉克斯坦", es: "Tayikistán", hi: "ताजिकिस्तान", ar: "طاجيكستان", pt: "Tajiquistão", bn: "তাজিকিস্তান", ru: "Таджикистан", ja: "タジキスタン", pa: "ਤਾਜਿਕਿਸਤਾਨ" },
  "TL": { en: "Timor-Leste", zh: "东帝汶", es: "Timor Oriental", hi: "तिमोर-लेस्ते", ar: "تيمور الشرقية", pt: "Timor-Leste", bn: "তিমুর-লেস্তে", ru: "Восточный Тимор", ja: "東ティモール", pa: "ਤਿਮੋਰ-ਲੇਸਤੇ" },
  "TM": { en: "Turkmenistan", zh: "土库曼斯坦", es: "Turkmenistán", hi: "तुर्कमेनिस्तान", ar: "تركمانستان", pt: "Turcomenistão", bn: "তুর্কমেনিস্তান", ru: "Туркменистан", ja: "トルクメニスタン", pa: "ਤੁਰਕਮੇਨਿਸਤਾਨ" },
  "UZ": { en: "Uzbekistan", zh: "乌兹别克斯坦", es: "Uzbekistán", hi: "उज़्बेकिस्तान", ar: "أوزبكستان", pt: "Uzbequistão", bn: "উজবেকিস্তান", ru: "Узбекистан", ja: "ウズベキスタン", pa: "ਉਜ਼ਬੇਕਿਸਤਾਨ" },
  "YE": { en: "Yemen", zh: "也门", es: "Yemen", hi: "यमन", ar: "اليمن", pt: "Iêmen", bn: "ইয়েমেন", ru: "Йемен", ja: "イエメン", pa: "ਯਮਨ" },
  "CY": { en: "Cyprus", zh: "塞浦路斯", es: "Chipre", hi: "साइप्रस", ar: "قبرص", pt: "Chipre", bn: "সাইপ্রাস", ru: "Кипр", ja: "キプロス", pa: "ਸਾਈਪ੍ਰਸ" },

  // OCEANIA (territories)
  "AS": { en: "American Samoa", zh: "美属萨摩亚", es: "Samoa Americana", hi: "अमेरिकी समोआ", ar: "ساموا الأمريكية", pt: "Samoa Americana", bn: "আমেরিকান সামোয়া", ru: "Американское Самоа", ja: "アメリカ領サモア", pa: "ਅਮਰੀਕੀ ਸਮੋਆ" },
  "CK": { en: "Cook Islands", zh: "库克群岛", es: "Islas Cook", hi: "कुक द्वीप", ar: "جزر كوك", pt: "Ilhas Cook", bn: "কুক দ্বীপপুঞ্জ", ru: "Острова Кука", ja: "クック諸島", pa: "ਕੁੱਕ ਟਾਪੂ" },
  "PF": { en: "French Polynesia", zh: "法属波利尼西亚", es: "Polinesia Francesa", hi: "फ्रेंच पोलिनेशिया", ar: "بولينيزيا الفرنسية", pt: "Polinésia Francesa", bn: "ফরাসি পলিনেশিয়া", ru: "Французская Полинезия", ja: "フランス領ポリネシア", pa: "ਫ੍ਰੈਂਚ ਪੋਲੀਨੇਸ਼ੀਆ" },
  "GU": { en: "Guam", zh: "关岛", es: "Guam", hi: "गुआम", ar: "غوام", pt: "Guam", bn: "গুয়াম", ru: "Гуам", ja: "グアム", pa: "ਗੁਆਮ" },
  "NC": { en: "New Caledonia", zh: "新喀里多尼亚", es: "Nueva Caledonia", hi: "न्यू कैलेडोनिया", ar: "كاليدونيا الجديدة", pt: "Nova Caledônia", bn: "নিউ ক্যালেডোনিয়া", ru: "Новая Каледония", ja: "ニューカレドニア", pa: "ਨਿਊ ਕੈਲੇਡੋਨੀਆ" },
  "NU": { en: "Niue", zh: "纽埃", es: "Niue", hi: "नीयू", ar: "نييوي", pt: "Niue", bn: "নিউয়ে", ru: "Ниуэ", ja: "ニウエ", pa: "ਨਿਊਏ" },
  "NF": { en: "Norfolk Island", zh: "诺福克岛", es: "Isla Norfolk", hi: "नॉरफ़ॉक द्वीप", ar: "جزيرة نورفولك", pt: "Ilha Norfolk", bn: "নরফোক দ্বীপ", ru: "Остров Норфолк", ja: "ノーフォーク島", pa: "ਨੌਰਫੋਕ ਟਾਪੂ" },
  "MP": { en: "Northern Mariana Islands", zh: "北马里亚纳群岛", es: "Islas Marianas del Norte", hi: "उत्तरी मारियाना द्वीप", ar: "جزر ماريانا الشمالية", pt: "Ilhas Marianas do Norte", bn: "উত্তর মারিয়ানা দ্বীপপুঞ্জ", ru: "Северные Марианские острова", ja: "北マリアナ諸島", pa: "ਉੱਤਰੀ ਮਾਰੀਆਨਾ ਟਾਪੂ" },
  "TK": { en: "Tokelau", zh: "托克劳", es: "Tokelau", hi: "टोकेलाऊ", ar: "توكيلاو", pt: "Tokelau", bn: "টোকেলাউ", ru: "Токелау", ja: "トケラウ", pa: "ਟੋਕੇਲਾਊ" },
  "WF": { en: "Wallis and Futuna", zh: "瓦利斯和富图纳", es: "Wallis y Futuna", hi: "वालिस और फ़्यूचूना", ar: "واليس وفوتونا", pt: "Wallis e Futuna", bn: "ওয়ালিস ও ফুটুনা", ru: "Уоллис и Футуна", ja: "ウォリス・フツナ", pa: "ਵਾਲਿਸ ਅਤੇ ਫੁਟੂਨਾ" },

  // SOUTH AMERICA (territories)
  "FK": { en: "Falkland Islands", zh: "福克兰群岛", es: "Islas Malvinas", hi: "फ़ॉकलैंड द्वीप", ar: "جزر فوكلاند", pt: "Ilhas Malvinas", bn: "ফকল্যান্ড দ্বীপপুঞ্জ", ru: "Фолклендские острова", ja: "フォークランド諸島", pa: "ਫਾਕਲੈਂਡ ਟਾਪੂ" },
  "GF": { en: "French Guiana", zh: "法属圭亚那", es: "Guayana Francesa", hi: "फ्रेंच गयाना", ar: "غويانا الفرنسية", pt: "Guiana Francesa", bn: "ফরাসি গায়ানা", ru: "Французская Гвиана", ja: "フランス領ギアナ", pa: "ਫ੍ਰੈਂਚ ਗੁਆਨਾ" },
  "GS": { en: "South Georgia", zh: "南乔治亚", es: "Georgia del Sur", hi: "दक्षिण जॉर्जिया", ar: "جورجيا الجنوبية", pt: "Geórgia do Sul", bn: "দক্ষিণ জর্জিয়া", ru: "Южная Георгия", ja: "サウスジョージア", pa: "ਦੱਖਣੀ ਜਾਰਜੀਆ" }
};

// Country coordinates for remaining
const coords = {
  "AO": { lat: -11.20, lng: 17.87 }, "BJ": { lat: 9.31, lng: 2.32 }, "BW": { lat: -22.33, lng: 24.68 },
  "BF": { lat: 12.24, lng: -1.56 }, "BI": { lat: -3.37, lng: 29.92 }, "CV": { lat: 16.54, lng: -23.04 },
  "CM": { lat: 7.37, lng: 12.35 }, "CF": { lat: 6.61, lng: 20.94 }, "TD": { lat: 15.45, lng: 18.73 },
  "KM": { lat: -11.65, lng: 43.33 }, "CD": { lat: -4.04, lng: 21.76 }, "CG": { lat: -0.23, lng: 15.83 },
  "CI": { lat: 7.54, lng: -5.55 }, "DJ": { lat: 11.83, lng: 42.59 }, "GQ": { lat: 1.65, lng: 10.27 },
  "ER": { lat: 15.18, lng: 39.78 }, "SZ": { lat: -26.52, lng: 31.47 }, "GA": { lat: -0.80, lng: 11.61 },
  "GM": { lat: 13.44, lng: -15.31 }, "GN": { lat: 9.95, lng: -9.70 }, "GW": { lat: 11.80, lng: -15.18 },
  "LS": { lat: -29.61, lng: 28.23 }, "LR": { lat: 6.43, lng: -9.43 }, "LY": { lat: 26.34, lng: 17.23 },
  "MG": { lat: -18.77, lng: 46.87 }, "MW": { lat: -13.25, lng: 34.30 }, "ML": { lat: 17.57, lng: -4.00 },
  "MR": { lat: 21.01, lng: -10.94 }, "MU": { lat: -20.35, lng: 57.55 }, "YT": { lat: -12.83, lng: 45.17 },
  "MZ": { lat: -18.67, lng: 35.53 }, "NA": { lat: -22.96, lng: 18.49 }, "NE": { lat: 17.61, lng: 8.08 },
  "RE": { lat: -21.12, lng: 55.54 }, "RW": { lat: -1.94, lng: 29.87 }, "SH": { lat: -15.97, lng: -5.70 },
  "ST": { lat: 0.19, lng: 6.61 }, "SN": { lat: 14.50, lng: -14.45 }, "SC": { lat: -4.68, lng: 55.49 },
  "SL": { lat: 8.46, lng: -11.78 }, "SO": { lat: 5.15, lng: 46.20 }, "SS": { lat: 6.88, lng: 31.31 },
  "SD": { lat: 12.86, lng: 30.22 }, "TG": { lat: 8.62, lng: 0.82 }, "TN": { lat: 33.89, lng: 9.54 },
  "UG": { lat: 1.37, lng: 32.29 }, "EH": { lat: 24.22, lng: -12.89 }, "ZM": { lat: -13.13, lng: 27.85 },
  "ZW": { lat: -19.02, lng: 29.15 },
  "AM": { lat: 40.07, lng: 45.04 }, "AZ": { lat: 40.14, lng: 47.58 }, "BH": { lat: 26.07, lng: 50.56 },
  "BT": { lat: 27.51, lng: 90.43 }, "BN": { lat: 4.54, lng: 114.73 }, "GE": { lat: 42.32, lng: 43.36 },
  "JO": { lat: 30.59, lng: 36.24 }, "KZ": { lat: 48.02, lng: 66.92 }, "KP": { lat: 40.34, lng: 127.51 },
  "KG": { lat: 41.20, lng: 74.77 }, "LA": { lat: 19.86, lng: 102.50 }, "LB": { lat: 33.85, lng: 35.86 },
  "MV": { lat: 3.20, lng: 73.22 }, "MN": { lat: 46.86, lng: 103.85 }, "OM": { lat: 21.47, lng: 55.98 },
  "SY": { lat: 34.80, lng: 39.00 }, "TJ": { lat: 38.86, lng: 71.28 }, "TL": { lat: -8.87, lng: 125.73 },
  "TM": { lat: 38.97, lng: 59.56 }, "UZ": { lat: 41.38, lng: 64.59 }, "YE": { lat: 15.55, lng: 48.52 },
  "CY": { lat: 35.13, lng: 33.43 },
  "AS": { lat: -14.27, lng: -170.13 }, "CK": { lat: -21.24, lng: -159.78 }, "PF": { lat: -17.68, lng: -149.41 },
  "GU": { lat: 13.44, lng: 144.79 }, "NC": { lat: -20.90, lng: 165.62 }, "NU": { lat: -19.05, lng: -169.87 },
  "NF": { lat: -29.04, lng: 167.95 }, "MP": { lat: 15.10, lng: 145.67 }, "TK": { lat: -9.20, lng: -171.85 },
  "WF": { lat: -13.77, lng: -177.16 },
  "FK": { lat: -51.80, lng: -59.55 }, "GF": { lat: 3.93, lng: -53.13 }, "GS": { lat: -54.43, lng: -36.59 }
};

// Telephone codes
const telCodes = {
  "AO": "+244", "BJ": "+229", "BW": "+267", "BF": "+226", "BI": "+257", "CV": "+238", "CM": "+237",
  "CF": "+236", "TD": "+235", "KM": "+269", "CD": "+243", "CG": "+242", "CI": "+225", "DJ": "+253",
  "GQ": "+240", "ER": "+291", "SZ": "+268", "GA": "+241", "GM": "+220", "GN": "+224", "GW": "+245",
  "LS": "+266", "LR": "+231", "LY": "+218", "MG": "+261", "MW": "+265", "ML": "+223", "MR": "+222",
  "MU": "+230", "YT": "+262", "MZ": "+258", "NA": "+264", "NE": "+227", "RE": "+262", "RW": "+250",
  "SH": "+290", "ST": "+239", "SN": "+221", "SC": "+248", "SL": "+232", "SO": "+252", "SS": "+211",
  "SD": "+249", "TG": "+228", "TN": "+216", "UG": "+256", "EH": "+212", "ZM": "+260", "ZW": "+263",
  "AM": "+374", "AZ": "+994", "BH": "+973", "BT": "+975", "BN": "+673", "GE": "+995", "JO": "+962",
  "KZ": "+7", "KP": "+850", "KG": "+996", "LA": "+856", "LB": "+961", "MV": "+960", "MN": "+976",
  "OM": "+968", "SY": "+963", "TJ": "+992", "TL": "+670", "TM": "+993", "UZ": "+998", "YE": "+967",
  "CY": "+357",
  "AS": "+1", "CK": "+682", "PF": "+689", "GU": "+1", "NC": "+687", "NU": "+683", "NF": "+672",
  "MP": "+1", "TK": "+690", "WF": "+681",
  "FK": "+500", "GF": "+594", "GS": "+500"
};

console.log('🔄 Adding final translations...');

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
    
    if (telCodes[iso]) {
      country.mtd = country.mtd || {};
      country.mtd.telc = telCodes[iso];
    }
  });
});

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

console.log(`✅ Updated ${updated} countries with translations`);
