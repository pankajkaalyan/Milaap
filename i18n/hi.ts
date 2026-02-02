
export const hi = {
  nav: {
    home: 'होम',
    about: 'हमारे बारे में',
    contact: 'हमसे संपर्क करें',
    matches: 'मैचेस',
    search: 'खोज',
    favourites: 'पसंदीदा',
    visitors: 'विज़िटर्स',
    messages: 'संदेश',
    profile: 'मेरी प्रोफाइल',
    my_profile: 'मेरी प्रोफाइल',
    settings: 'सेटिंग्स',
    verification: 'सत्यापन',
    success_stories: 'सफलता की कहानियाँ',
    dashboard: 'डैशबोर्ड',
    admin_users: 'उपयोगकर्ता प्रबंधित करें',
    login: 'लॉग इन करें',
    logout: 'लॉग आउट',
    register: 'पंजीकरण करें',
    upgrade: 'अपग्रेड',
    admin_dashboard: 'एडमिन डैशबोर्ड',
    admin_verification: 'सत्यापन',
    admin_reports: 'उपयोगकर्ता रिपोर्ट',
    admin_stories: 'कहानी प्रस्तुतियाँ',
    admin_verification_logs: 'सत्यापन लॉग',
    admin_access_control: 'एक्सेस कंट्रोल',
    admin_communication: 'संचार',
    admin_reporting: 'रिपोर्टिंग',
    changelog: 'चैंजलॉग',
    interests: 'दिलचस्पियाँ',
    mutual_matches: 'आपसी मैच',
    admin_servic_requests: 'सेवा अनुरोध',
  },

  register: {
    title: 'अपनी प्रोफ़ाइल बनाएं',
    name: 'पूरा नाम',
    cta: 'खाता बनाएं',
    have_account: 'पहले से ही एक खाता है?',
    next: 'अगला',
    prev: 'पिछला',
    finish: 'पंजीकरण पूरा करें',
    dob: 'जन्म तिथि',
    tob: 'जन्म का समय',
    mobile: 'मोबाइल नंबर',
    countryCode: 'देश कोड',
    height: 'ऊंचाई (सेमी में)',
    caste: 'जाति',
    subcaste: 'उप-जाति (वैकल्पिक)',
    profession: 'पेशा',
    education: 'उच्चतम शिक्षा',

    linkedin:
      'लिंक्डइन प्रोफ़ाइल\n(प्रोफ़ाइल लिंक जैसे https://www.linkedin.com/in/username)',
    socialMedia:
      'सोशल मीडिया प्रोफ़ाइल (Facebook / Instagram / TikTok)\n(Facebook / Instagram / TikTok प्रोफ़ाइल लिंक)',

    steps: {
      account: 'खाता विवरण',
      personal: 'व्यक्तिगत जानकारी',
      family: 'परिवार और राशिफल',
      cast: 'जाति और कुंडली',
      uploads: 'अपलोड',
    },
  },

  profile: {
    completeness: 'प्रोफ़ाइल पूर्णता',
    edit: 'प्रोफ़ाइल संपादित करें',
    about: 'मेरे बारे में',
    gender: 'लिंग',
  },

  interests: {
    title: 'दिलचस्पियाँ',
    received: 'प्राप्त',
    sent: 'भेजी गई',
    status: {
      none: 'कोई नहीं',
      pending: 'लंबित',
      accepted: 'स्वीकृत',
      declined: 'अस्वीकृत',
    },
    accept: 'स्वीकार करें',
    decline: 'अस्वीकार करें',
  },

  admin: {
    users: {
      title: 'उपयोगकर्ता प्रबंधन',
      table: {
        name: 'नाम',
        email: 'ईमेल',
        role: 'भूमिका',
        joined: 'शामिल होने की तिथि',
        status: 'स्थिति',
        actions: 'कार्रवाइयाँ',
        activate: 'सक्रिय करें',
      },

      activate_confirm_title: 'सक्रिय करने की पुष्टि',
      activate_confirm: 'क्या आप वाकई {name} को सक्रिय करना चाहते हैं?',
      activate_confirm_bulk:
        'क्या आप वाकई {count} चयनित उपयोगकर्ताओं को सक्रिय करना चाहते हैं?',
    },

    actions: {
      approve: 'स्वीकृत करें',
      reject: 'अस्वीकार करें',
      dismiss: 'खारिज करें',
      resolve: 'हल के रूप में चिह्नित करें',
      warn: 'उपयोगकर्ता को चेतावनी दें',
      suspend_chat: 'चैट निलंबित करें',
      suspend_user: 'उपयोगकर्ता निलंबित करें',
    },
  },

  toasts: {
    users: {
      activate: 'उपयोगकर्ता {name} को सफलतापूर्वक सक्रिय किया गया।',
      imported: '{count} उपयोगकर्ता सफलतापूर्वक आयात किए गए!',
      exported: 'उपयोगकर्ता डेटा सफलतापूर्वक निर्यात किया गया!',
      deleted_bulk: '{count} उपयोगकर्ताओं को सफलतापूर्वक हटा दिया गया है।',
      updated_bulk: '{count} उपयोगकर्ताओं को सफलतापूर्वक अपडेट किया गया है।',
    },
  },
};
