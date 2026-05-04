import { createContext, useContext, useState, useEffect } from 'react';

const LANG_KEY = 'healthid_language';

// State → language mapping for auto-detection
const stateLanguageMap = {
  'Andhra Pradesh': 'te', 'Telangana': 'te',
  'Tamil Nadu': 'ta', 'Puducherry': 'ta',
  'Karnataka': 'kn',
  'Kerala': 'kl',
  'Maharashtra': 'mr', 'Goa': 'mr',
  'Gujarat': 'gu', 'Dadra and Nagar Haveli': 'gu',
  'West Bengal': 'bn', 'Tripura': 'bn',
  'Punjab': 'pa',
  'Delhi': 'hi', 'Uttar Pradesh': 'hi', 'Madhya Pradesh': 'hi',
  'Rajasthan': 'hi', 'Bihar': 'hi', 'Jharkhand': 'hi',
  'Chhattisgarh': 'hi', 'Haryana': 'hi', 'Himachal Pradesh': 'hi',
  'Uttarakhand': 'hi',
};

export const languages = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు' },
  { code: 'bn', label: 'Bengali', native: 'বাংলা' },
  { code: 'mr', label: 'Marathi', native: 'मराठी' },
  { code: 'gu', label: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'kl', label: 'Malayalam', native: 'മലയാളം' },
  { code: 'pa', label: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
];

const translations = {
  en: {
    // Navbar
    home: 'Home', symptomChecker: 'Symptom Checker', findDoctors: 'Find Doctors',
    checklist: 'Checklist', rxDecoder: 'Rx Decoder', billBreakdown: 'Bill Breakdown',
    doctorLogin: 'Doctor Login', patientLogin: 'Patient Login', myAccount: 'My Account',
    // Home
    heroTitle: 'The Blind Consultation Ends Here',
    heroSubtitle: 'Find the right specialist, verify your doctor, and walk into every consultation fully prepared.',
    checkSymptoms: 'Check My Symptoms', findVerifiedDoctors: 'Find Verified Doctors',
    patientsInIndia: 'Patients in India', relyOnGoogle: 'Rely on Google for medical decisions',
    noMetrics: 'Verified quality metrics exist today', verifiedDoctors: 'Verified doctors on HealthID',
    everythingYouNeed: 'Everything you need. One platform.',
    getStarted: 'Get started', howItWorks: 'How it works',
    step1: 'Describe your symptoms and urgency level',
    step2: 'Get matched to the right verified specialist',
    step3: 'Walk in prepared with your personalised checklist',
    emergencyBanner: 'Experiencing a medical emergency? Select Emergency urgency level and get directed to the nearest appropriate care immediately.',
    checkSymptomsNow: 'Check Symptoms Now',
    // Features
    treatmentAware: 'Treatment Aware', treatmentAwareDesc: 'Doctor visit? Medication? Just rest? A smart tool to figure out the approach.',
    reportIssue: 'Report Issue', reportIssueDesc: 'Flag bad hygiene, poor service, or billing problems at any clinic.',
    postConsultChat: '7-Day Chat', postConsultChatDesc: 'Post-consult follow-up chat. Ask anything within the window.',
    ayurvedaCounts: 'Ayurveda Counts', ayurvedaCountsDesc: 'Practitioners of ayurved medicine deserve certification too.',
    documentVault: 'My Health Vault', documentVaultDesc: 'Store prescriptions, bills, and reports securely for future reference.',
    // Common
    submit: 'Submit', cancel: 'Cancel', save: 'Save', delete: 'Delete', upload: 'Upload',
    loading: 'Loading...', noResults: 'No results found', search: 'Search',
    // Symptom Checker
    whichSpecialist: 'Which Specialist Do I Need',
    describeSymptoms: 'Describe your symptoms in plain language. No medical jargon needed.',
    howUrgent: 'How urgent are your symptoms?',
    findSpecialist: 'Find the Right Specialist',
    // Footer
    tools: 'Tools', doctors: 'Doctors', login: 'Login',
    findVerifiedDoctorsFooter: 'Find Verified Doctors', bookAppointment: 'Book Appointment',
    doctorPortal: 'Doctor Portal', patientPortal: 'Patient Portal',
    tagline: 'See Clearly. Choose Right.',
    footerCopy: 'Built for patients, verified by evaluators',
    // Patient
    welcomeBack: 'Welcome back', myAppointments: 'My Appointments',
    myDocuments: 'My Health Vault', profile: 'Profile', logout: 'Logout',
  },
  hi: {
    home: 'होम', symptomChecker: 'लक्षण जांच', findDoctors: 'डॉक्टर खोजें',
    checklist: 'चेकलिस्ट', rxDecoder: 'नुस्खा समझें', billBreakdown: 'बिल विश्लेषण',
    doctorLogin: 'डॉक्टर लॉगिन', patientLogin: 'मरीज़ लॉगिन', myAccount: 'मेरा खाता',
    heroTitle: 'अंधेरे में परामर्श अब बंद',
    heroSubtitle: 'सही विशेषज्ञ खोजें, अपने डॉक्टर को सत्यापित करें, और हर परामर्श में पूरी तैयारी से जाएं।',
    checkSymptoms: 'लक्षण जांचें', findVerifiedDoctors: 'सत्यापित डॉक्टर खोजें',
    patientsInIndia: 'भारत में मरीज़', relyOnGoogle: 'चिकित्सा निर्णय के लिए Google पर निर्भर',
    noMetrics: 'आज कोई सत्यापित गुणवत्ता मानक नहीं', verifiedDoctors: 'HealthID पर सत्यापित डॉक्टर',
    everythingYouNeed: 'सब कुछ जो आपको चाहिए। एक मंच।',
    getStarted: 'शुरू करें', howItWorks: 'यह कैसे काम करता है',
    step1: 'अपने लक्षण और तात्कालिकता स्तर बताएं',
    step2: 'सही सत्यापित विशेषज्ञ से मिलान करें',
    step3: 'अपनी व्यक्तिगत चेकलिस्ट के साथ तैयार जाएं',
    emergencyBanner: 'चिकित्सा आपातकाल? आपातकालीन तात्कालिकता चुनें और तुरंत उचित देखभाल के लिए निर्देशित हों।',
    checkSymptomsNow: 'अभी लक्षण जांचें',
    treatmentAware: 'उपचार जागरूकता', treatmentAwareDesc: 'डॉक्टर? दवाई? आराम? सही दृष्टिकोण जानें।',
    reportIssue: 'शिकायत दर्ज करें', reportIssueDesc: 'खराब स्वच्छता, खराब सेवा की रिपोर्ट करें।',
    postConsultChat: '7-दिन चैट', postConsultChatDesc: 'परामर्श के बाद 7 दिन तक कुछ भी पूछें।',
    ayurvedaCounts: 'आयुर्वेद मायने रखता है', ayurvedaCountsDesc: 'आयुर्वेदिक चिकित्सक भी प्रमाणन के हकदार हैं।',
    documentVault: 'मेरा स्वास्थ्य वॉल्ट', documentVaultDesc: 'नुस्खे, बिल और रिपोर्ट सुरक्षित रखें।',
    submit: 'जमा करें', cancel: 'रद्द करें', save: 'सहेजें', delete: 'हटाएं', upload: 'अपलोड',
    loading: 'लोड हो रहा है...', noResults: 'कोई परिणाम नहीं', search: 'खोजें',
    whichSpecialist: 'मुझे कौन सा विशेषज्ञ चाहिए',
    describeSymptoms: 'अपने लक्षण सरल भाषा में बताएं। चिकित्सा शब्दावली की जरूरत नहीं।',
    howUrgent: 'आपके लक्षण कितने गंभीर हैं?',
    findSpecialist: 'सही विशेषज्ञ खोजें',
    tools: 'उपकरण', doctors: 'डॉक्टर', login: 'लॉगिन',
    findVerifiedDoctorsFooter: 'सत्यापित डॉक्टर खोजें', bookAppointment: 'अपॉइंटमेंट बुक करें',
    doctorPortal: 'डॉक्टर पोर्टल', patientPortal: 'मरीज़ पोर्टल',
    tagline: 'स्पष्ट देखें। सही चुनें।',
    footerCopy: 'मरीज़ों के लिए बनाया, मूल्यांककों द्वारा सत्यापित',
    welcomeBack: 'वापसी पर स्वागत', myAppointments: 'मेरी अपॉइंटमेंट',
    myDocuments: 'मेरा स्वास्थ्य वॉल्ट', profile: 'प्रोफ़ाइल', logout: 'लॉग आउट',
  },
  ta: {
    home: 'முகப்பு', symptomChecker: 'அறிகுறி சோதனை', findDoctors: 'மருத்துவர் தேடல்',
    checklist: 'சரிபார்ப்பு', rxDecoder: 'மருந்து விளக்கம்', billBreakdown: 'பில் பகுப்பாய்வு',
    doctorLogin: 'மருத்துவர் உள்நுழைவு', patientLogin: 'நோயாளி உள்நுழைவு', myAccount: 'என் கணக்கு',
    heroTitle: 'கண்மூடி ஆலோசனை இங்கே முடிகிறது',
    heroSubtitle: 'சரியான நிபுணரைக் கண்டறியுங்கள், உங்கள் மருத்துவரை சரிபார்க்கவும்.',
    checkSymptoms: 'அறிகுறிகளை சோதிக்கவும்', findVerifiedDoctors: 'சரிபார்க்கப்பட்ட மருத்துவர்கள்',
    everythingYouNeed: 'உங்களுக்கு தேவையான அனைத்தும்.',
    getStarted: 'தொடங்கு', howItWorks: 'இது எப்படி வேலை செய்கிறது',
    submit: 'சமர்ப்பிக்கவும்', cancel: 'ரத்து', save: 'சேமி', upload: 'பதிவேற்றம்',
    loading: 'ஏற்றுகிறது...', search: 'தேடு',
    tagline: 'தெளிவாகப் பாருங்கள். சரியாகத் தேர்வு செய்யுங்கள்.',
    documentVault: 'என் சுகாதார பெட்டகம்',
    welcomeBack: 'மீண்டும் வரவேற்கிறோம்', logout: 'வெளியேறு',
  },
  te: {
    home: 'హోమ్', symptomChecker: 'లక్షణ తనిఖీ', findDoctors: 'డాక్టర్ కనుగొనండి',
    checklist: 'చెక్‌లిస్ట్', rxDecoder: 'ప్రిస్క్రిప్షన్', billBreakdown: 'బిల్ విశ్లేషణ',
    doctorLogin: 'డాక్టర్ లాగిన్', patientLogin: 'రోగి లాగిన్', myAccount: 'నా ఖాతా',
    heroTitle: 'గుడ్డి సంప్రదింపు ఇక్కడ ముగుస్తుంది',
    checkSymptoms: 'లక్షణాలు తనిఖీ చేయండి', findVerifiedDoctors: 'ధృవీకరించిన డాక్టర్లు',
    everythingYouNeed: 'మీకు కావలసినదంతా. ఒకే వేదిక.',
    getStarted: 'ప్రారంభించండి', submit: 'సమర్పించు', cancel: 'రద్దు', save: 'సేవ్',
    tagline: 'స్పష్టంగా చూడండి. సరైనది ఎంచుకోండి.',
    documentVault: 'నా ఆరోగ్య భాండాగారం',
    welcomeBack: 'తిరిగి స్వాగతం', logout: 'లాగ్ అవుట్',
  },
  bn: {
    home: 'হোম', symptomChecker: 'লক্ষণ পরীক্ষা', findDoctors: 'ডাক্তার খুঁজুন',
    checklist: 'চেকলিস্ট', rxDecoder: 'প্রেসক্রিপশন', billBreakdown: 'বিল বিশ্লেষণ',
    doctorLogin: 'ডাক্তার লগইন', patientLogin: 'রোগী লগইন', myAccount: 'আমার অ্যাকাউন্ট',
    heroTitle: 'অন্ধ পরামর্শ এখানে শেষ',
    checkSymptoms: 'লক্ষণ পরীক্ষা করুন', findVerifiedDoctors: 'যাচাইকৃত ডাক্তার',
    everythingYouNeed: 'আপনার যা দরকার সব। একটি প্ল্যাটফর্ম।',
    getStarted: 'শুরু করুন', submit: 'জমা দিন', cancel: 'বাতিল', save: 'সংরক্ষণ',
    tagline: 'স্পষ্ট দেখুন। সঠিক চয়ন করুন।',
    documentVault: 'আমার স্বাস্থ্য ভল্ট',
    welcomeBack: 'আবার স্বাগতম', logout: 'লগ আউট',
  },
  mr: {
    home: 'मुख्यपृष्ठ', symptomChecker: 'लक्षण तपासणी', findDoctors: 'डॉक्टर शोधा',
    checklist: 'तपासणी यादी', rxDecoder: 'औषध माहिती', billBreakdown: 'बिल विश्लेषण',
    doctorLogin: 'डॉक्टर लॉगिन', patientLogin: 'रुग्ण लॉगिन', myAccount: 'माझे खाते',
    heroTitle: 'आंधळ्या सल्ल्याचा अंत इथे होतो',
    checkSymptoms: 'लक्षणे तपासा', findVerifiedDoctors: 'सत्यापित डॉक्टर',
    everythingYouNeed: 'तुम्हाला हवे ते सर्व. एक व्यासपीठ.',
    getStarted: 'सुरू करा', submit: 'सबमिट करा', cancel: 'रद्द', save: 'जतन करा',
    tagline: 'स्पष्ट पहा. योग्य निवडा.',
    documentVault: 'माझे आरोग्य कक्ष',
    welcomeBack: 'पुन्हा स्वागत', logout: 'लॉग आउट',
  },
  gu: {
    home: 'ઘર', symptomChecker: 'લક્ષણ તપાસ', findDoctors: 'ડૉક્ટર શોધો',
    checklist: 'ચેકલિસ્ટ', rxDecoder: 'દવા સમજો', billBreakdown: 'બિલ વિશ્લેષણ',
    doctorLogin: 'ડૉક્ટર લૉગિન', patientLogin: 'દર્દી લૉગિન', myAccount: 'મારું ખાતું',
    heroTitle: 'અંધ સલાહનો અંત અહીં થાય છે',
    checkSymptoms: 'લક્ષણો તપાસો', findVerifiedDoctors: 'ચકાસાયેલા ડૉક્ટર',
    everythingYouNeed: 'તમને જરૂરી બધું. એક પ્લેટફોર્મ.',
    getStarted: 'શરૂ કરો', submit: 'સબમિટ', cancel: 'રદ', save: 'સાચવો',
    tagline: 'સ્પષ્ટ જુઓ. યોગ્ય પસંદ કરો.',
    documentVault: 'મારું આરોગ્ય કક્ષ',
    welcomeBack: 'ફરી સ્વાગત', logout: 'લૉગ આઉટ',
  },
  kn: {
    home: 'ಮುಖಪುಟ', symptomChecker: 'ಲಕ್ಷಣ ಪರೀಕ್ಷೆ', findDoctors: 'ವೈದ್ಯರ ಹುಡುಕಿ',
    checklist: 'ಚೆಕ್‌ಲಿಸ್ಟ್', rxDecoder: 'ಔಷಧ ವಿವರ', billBreakdown: 'ಬಿಲ್ ವಿಶ್ಲೇಷಣೆ',
    doctorLogin: 'ವೈದ್ಯ ಲಾಗಿನ್', patientLogin: 'ರೋಗಿ ಲಾಗಿನ್', myAccount: 'ನನ್ನ ಖಾತೆ',
    heroTitle: 'ಕುರುಡು ಸಮಾಲೋಚನೆ ಇಲ್ಲಿ ಕೊನೆಗೊಳ್ಳುತ್ತದೆ',
    checkSymptoms: 'ಲಕ್ಷಣಗಳನ್ನು ಪರೀಕ್ಷಿಸಿ', findVerifiedDoctors: 'ಪರಿಶೀಲಿಸಿದ ವೈದ್ಯರು',
    getStarted: 'ಪ್ರಾರಂಭಿಸಿ', submit: 'ಸಲ್ಲಿಸಿ', cancel: 'ರದ್ದು',
    tagline: 'ಸ್ಪಷ್ಟವಾಗಿ ನೋಡಿ. ಸರಿಯಾದದ್ದನ್ನು ಆಯ್ಕೆ ಮಾಡಿ.',
    documentVault: 'ನನ್ನ ಆರೋಗ್ಯ ಕೊಠಡಿ',
    welcomeBack: 'ಮರಳಿ ಸ್ವಾಗತ', logout: 'ಲಾಗ್ ಔಟ್',
  },
  kl: {
    home: 'ഹോം', symptomChecker: 'ലക്ഷണ പരിശോധന', findDoctors: 'ഡോക്ടറെ കണ്ടെത്തുക',
    checklist: 'ചെക്ക്‌ലിസ്റ്റ്', rxDecoder: 'മരുന്ന് വിശദീകരണം', billBreakdown: 'ബിൽ വിശകലനം',
    doctorLogin: 'ഡോക്ടർ ലോഗിൻ', patientLogin: 'രോഗി ലോഗിൻ', myAccount: 'എന്റെ അക്കൗണ്ട്',
    heroTitle: 'അന്ധമായ കൺസൾട്ടേഷൻ ഇവിടെ അവസാനിക്കുന്നു',
    checkSymptoms: 'ലക്ഷണങ്ങൾ പരിശോധിക്കുക', findVerifiedDoctors: 'സ്ഥിരീകരിച്ച ഡോക്ടർമാർ',
    getStarted: 'ആരംഭിക്കുക', submit: 'സമർപ്പിക്കുക', cancel: 'റദ്ദാക്കുക',
    tagline: 'വ്യക്തമായി കാണുക. ശരിയായത് തിരഞ്ഞെടുക്കുക.',
    documentVault: 'എന്റെ ആരോഗ്യ നിലവറ',
    welcomeBack: 'തിരികെ സ്വാഗതം', logout: 'ലോഗ് ഔട്ട്',
  },
  pa: {
    home: 'ਘਰ', symptomChecker: 'ਲੱਛਣ ਜਾਂਚ', findDoctors: 'ਡਾਕਟਰ ਲੱਭੋ',
    checklist: 'ਚੈੱਕਲਿਸਟ', rxDecoder: 'ਦਵਾਈ ਸਮਝੋ', billBreakdown: 'ਬਿਲ ਵਿਸ਼ਲੇਸ਼ਣ',
    doctorLogin: 'ਡਾਕਟਰ ਲਾਗਇਨ', patientLogin: 'ਮਰੀਜ਼ ਲਾਗਇਨ', myAccount: 'ਮੇਰਾ ਖਾਤਾ',
    heroTitle: 'ਅੰਨ੍ਹੀ ਸਲਾਹ ਇੱਥੇ ਖਤਮ ਹੁੰਦੀ ਹੈ',
    checkSymptoms: 'ਲੱਛਣ ਜਾਂਚੋ', findVerifiedDoctors: 'ਪ੍ਰਮਾਣਿਤ ਡਾਕਟਰ',
    getStarted: 'ਸ਼ੁਰੂ ਕਰੋ', submit: 'ਜਮ੍ਹਾ', cancel: 'ਰੱਦ',
    tagline: 'ਸਾਫ਼ ਦੇਖੋ। ਸਹੀ ਚੁਣੋ।',
    documentVault: 'ਮੇਰਾ ਸਿਹਤ ਕਮਰਾ',
    welcomeBack: 'ਵਾਪਸੀ ਤੇ ਸੁਆਗਤ', logout: 'ਲਾਗ ਆਊਟ',
  },
};

// Get translation — falls back to English
export function t(key, lang = 'en') {
  return translations[lang]?.[key] || translations.en[key] || key;
}

// Detect language from browser or timezone
function detectLanguage() {
  const saved = localStorage.getItem(LANG_KEY);
  if (saved && translations[saved]) return saved;

  // Try browser language
  const browserLang = navigator.language?.substring(0, 2);
  const langMap = { hi: 'hi', ta: 'ta', te: 'te', bn: 'bn', mr: 'mr', gu: 'gu', kn: 'kn', ml: 'kl', pa: 'pa' };
  if (langMap[browserLang]) return langMap[browserLang];

  // Try timezone (IST = Asia/Kolkata → default Hindi for non-English Indian browsers)
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (tz === 'Asia/Kolkata' || tz === 'Asia/Calcutta') {
    return 'hi'; // Default to Hindi for Indian users
  }

  return 'en';
}

// Context
const I18nContext = createContext({ lang: 'en', setLang: () => {}, t: (k) => k });

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(() => detectLanguage());

  const setLang = (code) => {
    setLangState(code);
    localStorage.setItem(LANG_KEY, code);
  };

  useEffect(() => {
    // Auto-detect on first load if no saved preference
    if (!localStorage.getItem(LANG_KEY)) {
      const detected = detectLanguage();
      setLangState(detected);
    }
  }, []);

  const translate = (key) => t(key, lang);

  return (
    <I18nContext.Provider value={{ lang, setLang, t: translate }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
