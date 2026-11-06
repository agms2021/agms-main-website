export type Language = 'mr' | 'en';

export const content = {
  mr: {
    nav: {
      brand: 'AG Multi Services',
      tagline: 'शासकीय व नागरी सेवा केंद्र',
      home: 'मुख्यपृष्ठ',
      services: 'शासकीय सेवा',
      crmTab: 'स्मार्ट CRM पोर्टल',
      about: 'आमच्याबद्दल',
      contact: 'संपर्क केंद्र',
      openCrm: 'CRM लॉगिन करा',
      langSwitch: 'English',
    },
    hero: {
      badge: 'अधिकृत महा-ई-सेवा व नागरी सुविधा केंद्र | Powered by भाषिणी AI',
      titleStart: 'सर्व शासकीय योजना व सेवांचा',
      titleHighlight: 'एकाच छताखाली विश्वासू साथीदार',
      subtitle: 'आधार, पॅन कार्ड, ७/१२, उत्पन्न व जात दाखले, महाडीबीटी शिष्यवृत्ती आणि व्यावसायिक सेवा आता एकाच ठिकाणी मिळवा जलद व पारदर्शक पद्धतीने.',
      exploreServices: 'सेवांची यादी पहा',
      exploreCrm: 'आमचे स्मार्ट CRM तंत्रज्ञान',
      searchPlaceholder: 'भाषिणी AI द्वारे सेवा शोधा (उदा. आधार, ७/१२, पॅन, शिष्यवृत्ती...)',
      voiceSearchLabel: 'मराठीत बोलून शोधा',
      bhashiniBadge: 'डिजिटल इंडिया भाषिणी AI सक्षम',
      stats: {
        citizens: '५००+ समाधानी नागरिक',
        successRate: '१००% अचूक व डिजिटल काम',
        tracking: 'WhatsApp वर थेट अपडेट',
        support: 'स्थानिक भाषिणी AI व्हॉईस सहाय्य',
      }
    },
    metrics: [
      { value: '५००+', label: 'नोंदणीकृत नागरिक', desc: 'विविध गावांतून' },
      { value: '४५+', label: 'शासकीय व व्यावसायिक सेवा', desc: 'सुलभ व जलद' },
      { value: '१००%', label: 'डिजिटल पावती व ट्रॅकिंग', desc: 'रोख व UPI पावती' },
      { value: '२४/७', label: 'WhatsApp सहाय्यता', desc: 'स्वयंचलित माहिती' },
    ],
    services: {
      sectionBadge: 'सेवा सूची',
      title: 'नागरी व शासकीय सेवा (Services Catalog)',
      subtitle: 'आपल्या दैनंदिन व शासकीय कामांसाठी लागणारी सर्व कागदपत्रे व दाखले अचूक तयार करून मिळतील.',
      categories: {
        all: 'सर्व सेवा',
        identity: 'ओळखपत्रे व दाखले',
        farmer: 'शेतकरी व जमीन महसूल',
        welfare: 'शासकीय योजना व शिष्यवृत्ती',
        business: 'उद्योग व व्यावसायिक नोंदणी',
      },
      items: [
        {
          id: 1,
          category: 'identity',
          name: 'आधार कार्ड दुरुस्ती व अपडेट',
          price: '₹१००',
          desc: 'नाव, जन्मतारीख, पत्ता आणि मोबाईल नंबर अपडेट व बायोमेट्रिक प्रमाणीकरण.',
          badge: 'जलद सेवा'
        },
        {
          id: 2,
          category: 'identity',
          name: 'नवीन पॅन कार्ड व सुधारणा',
          price: '₹१५०',
          desc: 'नवीन डिजिटल व प्रत्यक्ष पॅन कार्ड, हरवलेले पॅन कार्ड रीप्रिंट आणि आधार लिंकिंग.',
          badge: 'आवश्यक'
        },
        {
          id: 3,
          category: 'farmer',
          name: '७/१२, ८-अ व फेरफार उतारा',
          price: '₹५०',
          desc: 'डिजिटल स्वाक्षरीसह चालू ७/१२, ८-अ, जुने फेरफार उतारे व नकाशा.',
          badge: 'डिजिटल स्वाक्षरी'
        },
        {
          id: 4,
          category: 'identity',
          name: 'उत्पन्न व रहिवासी दाखला',
          price: '₹१२०',
          desc: '१ वर्ष व ३ वर्षांचा अधिकृत तहसील उत्पन्न दाखला व डोमिसाईल प्रमाणपत्र.',
          badge: 'तहसील अधिकृत'
        },
        {
          id: 5,
          category: 'identity',
          name: 'जात प्रमाणपत्र (Caste Certificate)',
          price: '₹१५०',
          desc: 'एससी, एसटी, ओबीसी, ईडब्ल्यूएस आणि एसईबीसी जात प्रमाणपत्रासाठी ऑनलाइन अर्ज.',
          badge: 'सरकारी'
        },
        {
          id: 6,
          category: 'welfare',
          name: 'महाडीबीटी शिष्यवृत्ती अर्ज',
          price: '₹१००',
          desc: 'शालेय व महाविद्यालयीन विद्यार्थ्यांसाठी सर्व शासकीय महाडीबीटी स्कॉलरशिप अर्ज.',
          badge: 'विद्यार्थी विशेष'
        },
        {
          id: 7,
          category: 'welfare',
          name: 'पीएम किसान सन्मान निधी व ई-केवायसी',
          price: '₹५०',
          desc: 'पीएम किसान हप्ता नोंदणी, आधार प्रमाणीकरण, ई-केवायसी व बँक खाते लिंकिंग.',
          badge: 'शेतकरी विशेष'
        },
        {
          id: 8,
          category: 'welfare',
          name: 'आयुष्मान भारत (PM-JAY) गोल्डन कार्ड',
          price: '₹८०',
          desc: '५ लाखांपर्यंत मोफत उपचाराचे आयुष्मान भारत आरोग्य कार्ड त्वरित प्रिंट.',
          badge: 'आरोग्य योजना'
        },
        {
          id: 9,
          category: 'business',
          name: 'उद्यम आधार (MSME) नोंदणी',
          price: '₹२००',
          desc: 'छोट्या व मोठ्या व्यवसायांसाठी केंद्र सरकारचे अधिकृत उद्यम नोंदणी प्रमाणपत्र.',
          badge: 'व्यवसाय'
        },
        {
          id: 10,
          category: 'business',
          name: 'गुमास्ता परवाना व फूड लायसन्स (FSSAI)',
          price: '₹३५०',
          desc: 'दुकान व आस्थापना नोंदणी, अन्न सुरक्षा व मानक प्राधिकरणाचे FSSAI परवाना.',
          badge: 'परवाना'
        },
        {
          id: 11,
          category: 'farmer',
          name: 'पिक विमा (PMFBY) नोंदणी',
          price: '₹६०',
          desc: 'खरीप व रब्बी हंगाम प्रधानमंत्री पिक विमा योजना अर्ज व पावती.',
          badge: 'शेतकरी'
        },
        {
          id: 12,
          category: 'welfare',
          name: 'रेशन कार्ड सेवा (नाव वाढवणे/कमी करणे)',
          price: '₹१००',
          desc: 'नवीन रेशन कार्ड, विभक्त रेशन कार्ड व सदस्यांचे नाव समाविष्ट करणे.',
          badge: 'नागरी सेवा'
        }
      ]
    },
    crmSection: {
      badge: 'AGMS CRM तंत्रज्ञान',
      title: 'आमचे स्मार्ट CRM व्यवस्थापन प्रणाली',
      subtitle: 'नागरिकांच्या अर्जांवर पारदर्शक काम करण्यासाठी आणि त्वरित अपडेट्स देण्यासाठी आम्ही AGMS CRM वापरतो.',
      desc: 'हे केवळ शासकीय केंद्र नाही, तर अत्याधुनिक तंत्रज्ञानाने सुसज्ज आधुनिक ग्राहक व्यवस्थापन प्लॅटफॉर्म आहे.',
      openButton: 'थेट CRM पोर्टल उघडा (Login)',
      demoHint: 'ऑपरेशन्स व डेटा व्यवस्थापनासाठी crm.agmultiservices.online वर जा →',
      features: [
        {
          title: 'WhatsApp बिझनेस ऑटोमेशन',
          desc: 'ग्राहकांनी कागदपत्रे पाठवल्यावर स्वयंचलित पावती, अर्जाचे अपडेट्स आणि थेट मेसेज संवाद.',
          tag: '24/7 चॅटबॉट'
        },
        {
          title: 'शासकीय अर्ज ट्रॅकिंग (Live Status)',
          desc: 'प्रत्येक अर्जाचा युनिक आयडी (उदा. #APP-9821). अर्ज प्रलंबित, प्रक्रियेत की पूर्ण हे रिअल-टाइम दिसते.',
          tag: 'पारदर्शक'
        },
        {
          title: 'सुरक्षित डॉक्युमेंट व्हॉल्ट & OCR',
          desc: 'आधार, पॅन आणि ७/१२ चे डिजिटल बँक-ग्रेड स्टोरेज. स्मार्ट OCR मुळे स्पेलिंग चुका टळतात.',
          tag: 'सुरक्षित स्टोरेज'
        },
        {
          title: 'डिजिटल बिलिंग व इन्स्टंट पावत्या',
          desc: 'रोख आणि UPI पेमेंटचे अचूक दैनंदिन हिशेब. ग्राहकांना लगेच WhatsApp वर डिजिटल पावती दिली जाते.',
          tag: '१००% पारदर्शकता'
        },
        {
          title: 'Android Companion Mobile App',
          desc: 'मोबाईलवरून थेट अर्ज तपासणे, ग्राहकांशी संवाद साधणे आणि नवीन सेवा ॲड करण्याची सोय.',
          tag: 'नेटिव्ह ॲप v1.4'
        },
        {
          title: 'डिजिटल इंडिया भाषिणी AI (Bhashini Engine)',
          desc: 'भाषिणी AI द्वारे शासकीय अर्जांचे मराठी ⇄ इंग्रजी भाषांतर, आवाजाद्वारे संभाषण (Voice ASR/TTS) आणि स्थानिक भाषेत WhatsApp सहाय्य.',
          tag: 'भाषिणी AI'
        }
      ]
    },
    howItWorks: {
      badge: 'कार्यपद्धती',
      title: 'आपले काम कसे होते?',
      steps: [
        { num: '०१', title: 'केंद्राला भेट किंवा WhatsApp संपर्क', desc: 'आवश्यक कागदपत्रांसह केंद्रावर या किंवा थेट WhatsApp वर संपर्क साधा.' },
        { num: '०२', title: 'डिजिटल स्कॅनिंग व अर्ज दाखल', desc: 'डॉक्युमेंट व्हॉल्टमध्ये कागदपत्रे सुरक्षित साठवून अचूक सरकारी अर्ज भरला जातो.' },
        { num: '०३', title: 'डिजिटल पावती व URN ट्रॅकिंग', desc: 'अर्ज भरल्याची अधिकृत पावती त्वरित आपल्या मोबाईलवर WhatsApp द्वारे दिली जाते.' },
        { num: '०४', title: 'दाखला / कागदपत्र सुपूर्द', desc: 'सरकारी मान्यता मिळताच आपले अंतिम प्रमाणपत्र / कार्ड आपल्याला दिले जाते.' },
      ]
    },
    contact: {
      badge: 'संपर्क व केंद्र पत्ता',
      title: 'आमच्या सेवा केंद्राला भेट द्या',
      subtitle: 'आपल्या सर्व शासकीय व व्यावसायिक कामांसाठी आजच आमच्याशी संपर्क साधा.',
      centerName: 'AG Multi Services (महा-ई-सेवा व नागरी सुविधा केंद्र)',
      vleName: 'अधिकृत VLE संचालक: AG Multi Services',
      emailLabel: 'ईमेल संपर्क:',
      email: 'agmultis2021@gmail.com',
      crmUrlLabel: 'CRM पोर्टल:',
      crmUrl: 'https://crm.agmultiservices.online',
      timingsLabel: 'वेळ:',
      timings: 'सकाळी ८:३० ते रात्री ८:३० (सोमवार ते शनिवार)',
      sunday: 'रविवार: सकाळी ९:०० ते दुपारी २:००',
      whatsappCta: 'WhatsApp वर संपर्क करा',
      whatsappMsg: 'नमस्कार, मला शासकीय सेवेबद्दल माहिती हवी आहे.',
    },
    announcement: {
      enabled: true,
      text: '📢 नवीन: "मुख्यमंत्री माझी लाडकी बहीण योजना" व "पिक विमा २०२६" ऑनलाइन नोंदणी केंद्रावर सुरू आहे!',
      linkText: 'तपशील पहा'
    },
    faq: {
      badge: 'वारंवार विचारले जाणारे प्रश्न',
      title: 'नागरिकांच्या मनातील महत्त्वाचे प्रश्न (FAQ)',
      subtitle: 'आपल्या शासकीय कागदपत्रांबद्दल नेहमी विचारल्या जाणाऱ्या प्रश्नांची उत्तरे खालीलप्रमाणे आहेत.',
      items: [
        {
          id: 1,
          question: 'शासकीय दाखल्यांसाठी (उदा. उत्पन्न, जात, रहिवासी) कोणती कागदपत्रे लागतात?',
          answer: 'साधारणपणे आधार कार्ड, रेशन कार्ड, जुना पुरावा किंवा शाळेचा दाखला (LC), आणि पासपोर्ट आकाराचा फोटो आवश्यक असतो. विशिष्ट दाखल्यानुसार लागणाऱ्या कागदपत्रांची यादी आपण केंद्रावर किंवा WhatsApp वर मिळवू शकता.'
        },
        {
          id: 2,
          question: 'अर्ज भरल्याची अधिकृत पावती कशी आणि कधी मिळते?',
          answer: 'केंद्रावर अर्ज सादर होताच आमच्या स्मार्ट CRM द्वारे संगणकीकृत अधिकृत पावती (URN क्रमांकासह) त्वरित आपल्या WhatsApp वर PDF स्वरूपात पाठवली जाते.'
        },
        {
          id: 3,
          question: 'दाखला मंजूर व्हायला किती दिवसांचा कालावधी लागतो?',
          answer: 'शासकीय नियमांनुसार तहसील कार्यालयातून ३ ते ७ कार्यालयीन दिवसांत दाखले मंजूर होतात. अर्जाची सद्यस्थिती (Live Status) आपण WhatsApp वर सहज ट्रॅक करू शकता.'
        },
        {
          id: 4,
          question: 'मी थेट WhatsApp वरून कागदपत्रे पाठवून अर्ज करू शकतो का?',
          answer: 'होय! आपण आपली कागदपत्रे आमच्या अधिकृत WhatsApp वर पाठवून प्राथमिक पडताळणी करून घेऊ शकता. आमचा ऑपरेटर आपल्याशी संपर्क साधून अर्ज प्रक्रिया पूर्ण करेल.'
        },
        {
          id: 5,
          question: 'केंद्रावर पैसे भरण्यासाठी कोणते पर्याय उपलब्ध आहेत?',
          answer: 'आपण रोख रक्कम (Cash), Google Pay, PhonePe, Paytm किंवा कोणत्याही UPI QR कोडद्वारे त्वरित आणि सुरक्षित पेमेंट करू शकता. प्रत्येक व्यवहाराची डिजिटल पावती मिळते.'
        }
      ]
    },
    footer: {
      rights: 'सर्व हक्क सुरक्षित. अधिकृत नागरी व शासकीय सेवा केंद्र.',
      madeWith: 'नागरिकांच्या सेवेसाठी सदैव तत्पर.',
    }
  },
  en: {
    nav: {
      brand: 'AG Multi Services',
      tagline: 'Citizen & Government Services Center',
      home: 'Home',
      services: 'Services',
      crmTab: 'Smart CRM Portal',
      about: 'About Us',
      contact: 'Contact Center',
      openCrm: 'Open CRM',
      langSwitch: 'मराठी',
    },
    hero: {
      badge: 'Authorized Citizen Service Center (CSC) | Powered by Bhashini AI',
      titleStart: 'Your Trusted Partner for',
      titleHighlight: 'All Government & Citizen Services',
      subtitle: 'Aadhaar, PAN Card, 7/12 land records, Income & Caste certificates, MahaDBT scholarships, and business registrations in one transparent place.',
      exploreServices: 'Browse Services',
      exploreCrm: 'Explore Smart CRM',
      searchPlaceholder: 'Search services via Bhashini AI (e.g. Aadhaar, 7/12, PAN, Scholarship...)',
      voiceSearchLabel: 'Speak to search',
      bhashiniBadge: 'Powered by Digital India Bhashini AI',
      stats: {
        citizens: '500+ Happy Citizens',
        successRate: '100% Digital & Accurate',
        tracking: 'Direct WhatsApp Updates',
        support: 'Local Bhashini Voice AI',
      }
    },
    metrics: [
      { value: '500+', label: 'Registered Citizens', desc: 'Across regions' },
      { value: '45+', label: 'Government & Digital Services', desc: 'Fast & Reliable' },
      { value: '100%', label: 'Digital Receipts & Tracking', desc: 'Cash & UPI' },
      { value: '24/7', label: 'WhatsApp Assistance', desc: 'Automated Status' },
    ],
    services: {
      sectionBadge: 'Services Catalog',
      title: 'Official Government & Citizen Services',
      subtitle: 'All certificates, document corrections, and welfare applications processed with precision.',
      categories: {
        all: 'All Services',
        identity: 'Identity & Certificates',
        farmer: 'Farmer & Land Records',
        welfare: 'Welfare & Scholarships',
        business: 'Business & Licenses',
      },
      items: [
        {
          id: 1,
          category: 'identity',
          name: 'Aadhaar Card Update & Correction',
          price: '₹100',
          desc: 'Name, birth date, address, mobile number updates and biometric authentication.',
          badge: 'Fast Track'
        },
        {
          id: 2,
          category: 'identity',
          name: 'New PAN Card & Reprint',
          price: '₹150',
          desc: 'New physical/digital PAN card, lost PAN reprint, and Aadhaar-PAN linkage.',
          badge: 'Essential'
        },
        {
          id: 3,
          category: 'farmer',
          name: '7/12 & 8-A Digital Land Record',
          price: '₹50',
          desc: 'Digitally signed 7/12, 8-A, historical ferfar extracts and cadastral maps.',
          badge: 'Digital Signed'
        },
        {
          id: 4,
          category: 'identity',
          name: 'Income & Domicile Certificate',
          price: '₹120',
          desc: '1-year and 3-year official Tehsil income certificates and Maharashtra domicile.',
          badge: 'Tehsil Approved'
        },
        {
          id: 5,
          category: 'identity',
          name: 'Caste Certificate (जात प्रमाणपत्र)',
          price: '₹150',
          desc: 'Official applications for SC, ST, OBC, EWS, and SEBC certificates.',
          badge: 'Official'
        },
        {
          id: 6,
          category: 'welfare',
          name: 'MahaDBT Scholarship Applications',
          price: '₹100',
          desc: 'End-to-end applications for school and college government scholarships.',
          badge: 'Students'
        },
        {
          id: 7,
          category: 'welfare',
          name: 'PM-Kisan Registration & e-KYC',
          price: '₹50',
          desc: 'Installment registration, Aadhaar authentication, e-KYC, and bank linkage.',
          badge: 'Farmers'
        },
        {
          id: 8,
          category: 'welfare',
          name: 'Ayushman Bharat (PM-JAY) Golden Card',
          price: '₹80',
          desc: 'Cashless healthcare cover up to ₹5 Lakhs — instant verification & print.',
          badge: 'Healthcare'
        },
        {
          id: 9,
          category: 'business',
          name: 'Udyam (MSME) Registration',
          price: '₹200',
          desc: 'Official central government business registration for micro and small enterprises.',
          badge: 'Business'
        },
        {
          id: 10,
          category: 'business',
          name: 'Shop Act (Gumasta) & Food License (FSSAI)',
          price: '₹350',
          desc: 'Establishment registrations, food safety compliance, and commercial permits.',
          badge: 'License'
        },
        {
          id: 11,
          category: 'farmer',
          name: 'Crop Insurance (PMFBY)',
          price: '₹60',
          desc: 'Kharif and Rabi seasonal crop insurance filing and instant receipt.',
          badge: 'Farmer'
        },
        {
          id: 12,
          category: 'welfare',
          name: 'Ration Card Member Services',
          price: '₹100',
          desc: 'Name addition, deletion, separation, and new digital ration cards.',
          badge: 'Civil Supplies'
        }
      ]
    },
    crmSection: {
      badge: 'AGMS CRM Technology',
      title: 'Our Smart CRM Management Platform',
      subtitle: 'We use AGMS CRM to ensure full transparency, fast turnaround, and instant updates for every citizen.',
      desc: 'More than a service center — we operate on a cutting-edge CRM engine built for modern operations.',
      openButton: 'Open Live CRM Portal (Login)',
      demoHint: 'For operations, staff logins & records visit crm.agmultiservices.online →',
      features: [
        {
          title: 'WhatsApp Business Automation',
          desc: 'Instant auto-receipts, application status broadcasts, and real-time chat updates directly on WhatsApp.',
          tag: '24/7 Chatbot'
        },
        {
          title: 'Live Government Application Tracking',
          desc: 'Each application has a unique ID (e.g., #APP-9821). Clear tracking: Pending, In-Progress, Completed.',
          tag: 'Transparent'
        },
        {
          title: 'Secure Document Vault & OCR',
          desc: 'Bank-grade encrypted storage for client Aadhaar, PAN, and 7/12. Automated OCR prevents manual typos.',
          tag: 'Secure Vault'
        },
        {
          title: 'Digital Billing & Instant Receipts',
          desc: 'Automated cash & UPI reconciliation. Instant WhatsApp digital PDF receipt generated on submission.',
          tag: '100% Digital'
        },
        {
          title: 'Native Android Companion App',
          desc: 'Companion mobile app with one-click customer dialer, push alerts, and field service management.',
          tag: 'Android v1.4'
        },
        {
          title: 'Digital India Bhashini AI Engine',
          desc: 'Integrated with Bhashini AI for Marathi ⇄ English translation, voice recognition (ASR/TTS) and regional language WhatsApp support.',
          tag: 'Bhashini AI'
        }
      ]
    },
    howItWorks: {
      badge: 'Workflow',
      title: 'How It Works',
      steps: [
        { num: '01', title: 'Visit Center or WhatsApp Us', desc: 'Walk into our center with required documents or start via WhatsApp.' },
        { num: '02', title: 'Digital Scanning & Filing', desc: 'Secure document capture into vault and accurate application submission.' },
        { num: '03', title: 'Digital Receipt & Tracking', desc: 'Instant acknowledgment receipt and tracking ID sent to your mobile.' },
        { num: '04', title: 'Certificate Handover', desc: 'Once approved by government authorities, your official document is delivered.' },
      ]
    },
    contact: {
      badge: 'Contact & Center Location',
      title: 'Visit Our Citizen Service Center',
      subtitle: 'Reach out today for all citizen, business, and governmental applications.',
      centerName: 'AG Multi Services (Authorized Citizen Facility Center)',
      vleName: 'Authorized VLE Director: AG Multi Services',
      emailLabel: 'Contact Email:',
      email: 'agmultis2021@gmail.com',
      crmUrlLabel: 'CRM Portal:',
      crmUrl: 'https://crm.agmultiservices.online',
      timingsLabel: 'Operating Hours:',
      timings: '8:30 AM to 8:30 PM (Monday to Saturday)',
      sunday: 'Sunday: 9:00 AM to 2:00 PM',
      whatsappCta: 'Chat on WhatsApp',
      whatsappMsg: 'Hello, I would like to inquire about citizen services.',
    },
    announcement: {
      enabled: true,
      text: '📢 New: "Majhi Ladki Bahin Yojana" & "Crop Insurance (PMFBY)" registrations are actively open at our center!',
      linkText: 'Learn More'
    },
    faq: {
      badge: 'Frequently Asked Questions',
      title: 'Frequently Asked Questions (FAQ)',
      subtitle: 'Answers to the most common questions regarding citizen services, documents, and processing.',
      items: [
        {
          id: 1,
          question: 'What documents are required for government certificates (Income, Domicile, Caste)?',
          answer: 'Generally, Aadhaar Card, Ration Card, School Leaving Certificate (LC), and passport photo are required. Specific requirements can be verified with our team on WhatsApp.'
        },
        {
          id: 2,
          question: 'How and when do I receive the official application receipt?',
          answer: 'As soon as your application is filed, our Smart CRM instantly delivers a digital PDF receipt with your official URN directly to your WhatsApp.'
        },
        {
          id: 3,
          question: 'How long does it take for certificates to get approved?',
          answer: 'Typically 3 to 7 working days as per Tehsil and Revenue department schedules. You can track live status anytime.'
        },
        {
          id: 4,
          question: 'Can I apply directly by sending documents on WhatsApp?',
          answer: 'Yes! You can share your documents directly on our official WhatsApp for pre-verification, and our operator will guide you through the process.'
        },
        {
          id: 5,
          question: 'What payment modes are accepted at the center?',
          answer: 'We accept Cash, UPI (Google Pay, PhonePe, Paytm, BHIM), and QR codes. Instant digital receipts are generated for all transactions.'
        }
      ]
    },
    footer: {
      rights: 'All rights reserved. Authorized Government & Citizen Service Center.',
      madeWith: 'Dedicated to empowering citizens with digital services.',
    }
  }
};

