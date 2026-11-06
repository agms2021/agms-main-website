import type { Language } from '../types/site';

/**
 * High-precision bilingual dictionary for Maharashtra Citizen, CSC, Revenue, 
 * Transport, Scheme & Certificate services.
 */

// Service Title Translations
const SERVICE_TRANSLATIONS: Record<string, { mr: string; en: string }> = {
  'tests': {
    mr: 'नागरी सेवा चाचणी (Demo)',
    en: 'Citizen Service Demo Test',
  },
  'driving licence application': {
    mr: 'नवीन ड्रायव्हिंग लायसन्स अर्ज व प्रक्रिया',
    en: 'Driving Licence Application & Test',
  },
  'ड्रायव्हिंग लायसन्स (driving licence)': {
    mr: 'ड्रायव्हिंग लायसन्स अर्ज व प्रक्रिया',
    en: 'Driving Licence Application',
  },
  'driving licence': {
    mr: 'ड्रायव्हिंग लायसन्स (लर्निंग व पक्के)',
    en: 'Driving Licence (Learner & Permanent)',
  },
  'mutation entry - digital': {
    mr: '७/१२ डिजिटल फेरफार नोंद',
    en: '7/12 Digital Mutation Entry Extract',
  },
  'डिजिटल फेरफार नोंद': {
    mr: 'डिजिटल फेरफार नोंद प्रत',
    en: 'Digital Mutation Entry Extract',
  },
  'mutation entry - standard': {
    mr: 'साधी फेरफार नोंद प्रत',
    en: 'Standard Mutation Entry Extract',
  },
  'साधी फेरफार नोंद': {
    mr: 'साधी फेरफार नोंद प्रत',
    en: 'Standard Mutation Entry Extract',
  },
  '8a / khata extract': {
    mr: '८-अ खाते उतारा (डिजिटल स्वाक्षरी)',
    en: '8A Land Account Extract',
  },
  '8a / खाते उतारा': {
    mr: '८-अ खाते उतारा (डिजिटल स्वाक्षरी)',
    en: '8A Land Account Extract',
  },
  '7/12 extract - digital': {
    mr: '७/१२ डिजिटल स्वाक्षरी उतारा',
    en: '7/12 Digitally Signed Extract',
  },
  'डिजिटल 7/12 उतारा': {
    mr: '७/१२ डिजिटल स्वाक्षरी उतारा',
    en: '7/12 Digitally Signed Extract',
  },
  'साधा 7/12 उतारा': {
    mr: 'साधा ७/१२ जमिनीचा उतारा',
    en: 'Standard 7/12 Land Record',
  },
  'पॅन कार्ड दुरुस्ती (pan card correction)': {
    mr: 'पॅन कार्ड दुरुस्ती व बदल',
    en: 'PAN Card Correction & Update',
  },
  'नवीन पॅन कार्ड (new pan card)': {
    mr: 'नवीन पॅन कार्ड अर्ज',
    en: 'New PAN Card Application',
  },
  'जातीचा दाखला (caste certificate)': {
    mr: 'जातीचा दाखला (Caste Certificate)',
    en: 'Caste Certificate Application',
  },
  'रहिवासी दाखला (domicile certificate)': {
    mr: 'रहिवासी / अधिवास दाखला (Domicile)',
    en: 'Domicile / Residence Certificate',
  },
  'नवीन पासपोर्ट अर्ज (passport application)': {
    mr: 'नवीन पासपोर्ट अर्ज व अपॉइंटमेंट',
    en: 'Passport Online Application & Slot',
  },
  'उत्पन्नाचा दाखला (income certificate)': {
    mr: 'तहसीलदार उत्पन्नाचा दाखला (१ व ३ वर्षे)',
    en: 'Income Certificate (1 & 3 Years)',
  },
  'मतदान ओळखपत्र (voter id application)': {
    mr: 'नवीन मतदान ओळखपत्र नोंदणी (Voter ID)',
    en: 'New Voter ID Card Application',
  },
  'ई-श्रम कार्ड (e-shram card)': {
    mr: 'ई-श्रम कार्ड नोंदणी व अपडेट',
    en: 'E-Shram Card Registration',
  },
};

// Document Name Translations
const DOCUMENT_TRANSLATIONS: Record<string, { mr: string; en: string }> = {
  'aadhaar card': { mr: 'आधार कार्ड', en: 'Aadhaar Card' },
  'date of birth proof': { mr: 'जन्मतारखेचा पुरावा (जन्म दाखला / LC)', en: 'Date of Birth Proof' },
  'passport size photos': { mr: 'पासपोर्ट आकाराचे फोटो (२ प्रती)', en: 'Passport Size Photos (2 copies)' },
  'blood group report': { mr: 'रक्तगट अहवाल (Blood Group)', en: 'Blood Group Report' },
  'ferfar number / year / gat number': { mr: 'फेरफार क्रमांक / वर्ष / गट क्रमांक', en: 'Mutation No. / Year / Gat No.' },
  'फेरफार नंबर किंवा वर्ष व गट नंबर': { mr: 'फेरफार क्रमांक किंवा वर्ष व गट क्रमांक', en: 'Mutation No., Year or Gat No.' },
  'survey / gat number': { mr: 'सर्व्हे / गट क्रमांक', en: 'Survey / Gat Number' },
  'survey / gat number / ulpin': { mr: 'सर्व्हे / गट क्रमांक / ULPIN', en: 'Survey / Gat Number / ULPIN' },
  'खाते नंबर किंवा खातेदाराचे नाव किंवा गट नंबर': { mr: 'खाते क्रमांक किंवा खातेदाराचे नाव', en: 'Account Number or Landholder Name' },
  'पत्याचा पुरावा': { mr: 'पत्याचा पुरावा (लाईट बिल / रेशन कार्ड)', en: 'Address Proof (Electricity Bill / Ration Card)' },
  'पासपोर्ट साईझ फोटो (२ प्रती)': { mr: 'पासपोर्ट साईझ फोटो (२ प्रती)', en: 'Passport Size Photos (2 copies)' },
  'जन्मतारखेचा पुरावा': { mr: 'जन्मतारखेचा पुरावा (शाळा सोडल्याचा दाखला)', en: 'Date of Birth Proof (School Leaving Certificate)' },
  'ration card': { mr: 'रेशन कार्ड झेरॉक्स', en: 'Ration Card' },
  'income proof': { mr: 'उत्पन्नाचा पुरावा / तलाठी अहवाल', en: 'Income Proof / Talathi Report' },
  'pan card': { mr: 'पॅन कार्ड', en: 'PAN Card' },
  'voter id': { mr: 'मतदान ओळखपत्र', en: 'Voter ID Card' },
  'bank passbook': { mr: 'बँक पासबुक झेरॉक्स', en: 'Bank Passbook' },
  'electricity bill': { mr: 'लाईट बिल', en: 'Electricity Bill' },
  'caste certificate': { mr: 'जातीचा दाखला', en: 'Caste Certificate' },
  'self declaration': { mr: 'स्वयंघोषणापत्र', en: 'Self Declaration' },
};

// Category / Department Badge Translations
const CATEGORY_TRANSLATIONS: Record<string, { mr: string; en: string }> = {
  'पॅन कार्ड सेवा': { mr: 'पॅन कार्ड सेवा', en: 'PAN Card Services' },
  'शासकीय दाखले': { mr: 'शासकीय दाखले', en: 'Govt Certificates' },
  'पासपोर्ट सेवा': { mr: 'पासपोर्ट सेवा', en: 'Passport Services' },
  'महसूल सेवा': { mr: 'महसूल सेवा', en: 'Revenue Land Services' },
  'निवडणूक सेवा': { mr: 'निवडणूक सेवा', en: 'Election Services' },
  'शासकीय योजना': { mr: 'शासकीय योजना', en: 'Government Schemes' },
  'rto / वाहन सेवा': { mr: 'RTO / वाहन सेवा', en: 'RTO / Transport Services' },
  'teest': { mr: 'चाचणी सेवा', en: 'Test Service' },
  'identity': { mr: 'ओळखपत्र व दाखले', en: 'Identity & Certificates' },
  'farmer': { mr: 'शेतकरी व जमीन महसूल', en: 'Farmer & Land Records' },
  'welfare': { mr: 'कल्याणकारी व शिष्यवृत्ती', en: 'Welfare & Scholarships' },
  'business': { mr: 'उद्योग व इतर परवाने', en: 'Business & Licenses' },
};

// Timeline Translations
const TIMELINE_TRANSLATIONS: Record<string, { mr: string; en: string }> = {
  'साधारण 1-2 दिवस': { mr: 'साधारण १ ते २ दिवस', en: 'Approx 1-2 Days' },
  'साधारण ७-१५ दिवस': { mr: 'साधारण ७ ते १५ दिवस', en: 'Approx 7-15 Days' },
  '१५ ते ३० दिवस (rto स्लॉट व चाचणीनुसार)': { mr: '१५ ते ३० दिवस (RTO स्लॉटनुसार)', en: '15-30 Days (As per RTO slot)' },
  'तत्काळ (१० मिनिटे)': { mr: 'तत्काळ (१० मिनिटांत उपलब्ध)', en: 'Instant (10 Minutes)' },
};

export function translateServiceName(rawName: string, lang: Language): string {
  if (!rawName) return '';
  const key = rawName.trim().toLowerCase();
  if (SERVICE_TRANSLATIONS[key]) {
    return SERVICE_TRANSLATIONS[key][lang];
  }
  // Try partial match
  for (const [k, v] of Object.entries(SERVICE_TRANSLATIONS)) {
    if (key.includes(k) || k.includes(key)) {
      return v[lang];
    }
  }
  return rawName;
}

export function translateDocName(rawName: string, lang: Language): string {
  if (!rawName) return '';
  const key = rawName.trim().toLowerCase();
  if (DOCUMENT_TRANSLATIONS[key]) {
    return DOCUMENT_TRANSLATIONS[key][lang];
  }
  for (const [k, v] of Object.entries(DOCUMENT_TRANSLATIONS)) {
    if (key.includes(k) || k.includes(key)) {
      return v[lang];
    }
  }
  return rawName;
}

export function translateCategoryName(rawCat: string | null | undefined, lang: Language): string {
  if (!rawCat) return lang === 'mr' ? 'अधिकृत सेवा' : 'Official Service';
  const key = rawCat.trim().toLowerCase();
  if (CATEGORY_TRANSLATIONS[key]) {
    return CATEGORY_TRANSLATIONS[key][lang];
  }
  for (const [k, v] of Object.entries(CATEGORY_TRANSLATIONS)) {
    if (key.includes(k) || k.includes(key)) {
      return v[lang];
    }
  }
  return rawCat;
}

export function translateTimeline(rawTimeline: string | null | undefined, lang: Language): string {
  if (!rawTimeline) {
    return lang === 'mr' ? 'साधारण ३ ते ७ दिवस' : '3 to 7 working days';
  }
  const key = rawTimeline.trim().toLowerCase();
  if (TIMELINE_TRANSLATIONS[key]) {
    return TIMELINE_TRANSLATIONS[key][lang];
  }
  for (const [k, v] of Object.entries(TIMELINE_TRANSLATIONS)) {
    if (key.includes(k) || k.includes(key)) {
      return v[lang];
    }
  }
  return rawTimeline;
}

export function translateDescription(rawDesc: string | null | undefined, lang: Language): string {
  if (!rawDesc) {
    return lang === 'mr'
      ? 'अधिकृत शासकीय नियमांनुसार अचूक व जलद ऑनलाईन अर्ज सुविधा.'
      : 'Official fast-track citizen online application service.';
  }
  const d = rawDesc.trim();
  if (lang === 'mr') {
    if (d.includes('Official fast-track') || d.includes('citizen online application')) {
      return 'अधिकृत शासकीय नियमांनुसार अचूक व जलद ऑनलाईन अर्ज सुविधा.';
    }
    if (d.includes('Required documents:')) {
      return d.replace('Required documents:', 'आवश्यक कागदपत्रे:');
    }
    return d;
  } else {
    // English translation of Marathi defaults
    if (d.includes('जमिनीचा साधा सातबारा')) {
      return 'Extract simple 7/12 land record copy.';
    }
    if (d.includes('जमिनीची साधी फेरफार नोंद')) {
      return 'Standard mutation entry extract copy.';
    }
    if (d.includes('डिजिटल स्वाक्षरी असलेली डिजिटल फेरफार नोंद प्रत')) {
      return 'Digitally signed mutation entry extract.';
    }
    if (d.includes('डिजिटल स्वाक्षरी असलेला शासकीय डिजिटल ७/१२')) {
      return 'Official digitally signed 7/12 land extract.';
    }
    if (d.includes('जमिनीचा ८अ (8A) खाते उतारा')) {
      return 'Extract official 8A land holding record.';
    }
    if (d.includes('नवीन ड्रायव्हिंग लायसन्स / लर्निंग लायसन्स')) {
      return 'New driving licence / learner licence application and processing.';
    }
    if (d.includes('अधिकृत शासकीय नियमांनुसार')) {
      return 'Official fast-track citizen online application service.';
    }
    return d;
  }
}

