/* =============================================================
   Lifestyle & Wellness Assessment — app.js
   Single-file vanilla JS: translations, wizard, scoring,
   submission, result screen.
   ============================================================= */

'use strict';

// ── State ─────────────────────────────────────────────────────
let currentLang = CONFIG.defaultLanguage;
let currentStep = 1;
const TOTAL_STEPS = 5;

const formData = {
  date: '', name: '', age: '', gender: '', contact: '',
  surveyDoneBy: '',
  q1: '', q2: '', q3: '', q4: '',
  q5: [], q5Other: '',
  q6: '', q7: '', q8: '',
  q9: '', q9Other: '',
  q10: '',
  guidanceRequested: '', preferredMode: '', preferredTime: ''
};

let computedScores = null;

// ── Translations ───────────────────────────────────────────────
const T = {
  en: {
    langCode: 'en',
    langName: 'English',
    brandName: 'Lifestyle & Wellness',

    // Landing page
    heroBadge: 'FREE LIFESTYLE & WELLNESS SURVEY',
    heroLine1: 'YOUR HEALTH.',
    heroLine2: 'YOUR LIFESTYLE.',
    heroLine3: 'YOUR NEXT STEP.',
    heroTagline: '"A small step today can lead to a healthier, happier you tomorrow!"',
    heroQuestion: 'Do you often experience any of these?',
    symptoms: [
      'Low Energy',
      'Poor Sleep',
      'Digestive Discomfort',
      'Unhealthy Eating Habits',
      'Weight Management Challenges',
      'Frequent Cravings',
      'Low Water Intake',
      'Lack of Regular Exercise',
      'Stress / Busy Lifestyle',
      'Feeling "Not at My Best"'
    ],
    ctaOffer: 'Complete the survey & get a FREE Wellness Guidance Session',
    ctaModes: 'Online & Offline Guidance Available',
    ctaStart: 'Start Your Free Wellness Survey',
    ctaDuration: 'Takes only 2–3 minutes',
    contactStrip: 'Moulika – 6302552079',

    // Steps
    stepLabel: (n, t) => `Step ${n} of ${t}`,
    stepTitles: [
      "Let's Get Started",
      "Your Current Lifestyle",
      "How Are You Feeling?",
      "Your Goal",
      "Free Wellness Guidance"
    ],
    stepSubtitles: [
      "Please fill in your personal details below.",
      "Tell us about your daily habits.",
      "Help us understand how you feel day-to-day.",
      "Let's set a direction for your wellness.",
      "Claim your free personalised guidance session."
    ],

    // Buttons
    previous: 'Previous',
    next: 'Next',
    submit: 'Submit Survey',
    submitting: 'Submitting…',
    retryBtn: 'Retry',

    // Personal details
    fieldDate: 'Date',
    fieldName: 'Full Name',
    fieldAge: 'Age',
    fieldGender: 'Gender',
    fieldContact: 'Contact Number',
    genderOptions: [
      { value: 'Male', label: 'Male' },
      { value: 'Female', label: 'Female' },
      { value: 'Prefer not to say', label: 'Prefer not to say' }
    ],
    placeholderDate: '',
    placeholderName: 'Enter your full name',
    placeholderAge: 'e.g. 28',
    placeholderContact: '10-digit mobile number',
    placeholderTime: 'e.g. 10 AM – 12 PM',
    fieldSurveyDoneBy: 'Survey Done By',
    placeholderSurveyDoneBy: 'Name of the person conducting the survey',

    // Questions
    questions: {
      q1: {
        text: 'How would you rate your overall lifestyle?',
        type: 'radio',
        options: [
          { value: 'Excellent', label: 'Excellent' },
          { value: 'Good', label: 'Good' },
          { value: 'Average', label: 'Average' },
          { value: 'Needs Improvement', label: 'Needs Improvement' }
        ]
      },
      q2: {
        text: 'How many days per week do you exercise or stay physically active?',
        type: 'radio',
        options: [
          { value: '0', label: '0 days' },
          { value: '1-2', label: '1–2 days' },
          { value: '3-4', label: '3–4 days' },
          { value: '5+', label: '5+ days' }
        ]
      },
      q3: {
        text: 'How many glasses of water do you usually drink per day?',
        type: 'radio',
        options: [
          { value: '<4', label: 'Less than 4' },
          { value: '4-6', label: '4–6' },
          { value: '7-9', label: '7–9' },
          { value: '10+', label: '10+' }
        ]
      },
      q4: {
        text: 'How would you describe your daily food habits?',
        type: 'radio',
        options: [
          { value: 'Mostly balanced', label: 'Mostly balanced' },
          { value: 'Frequently eat outside', label: 'Frequently eat outside' },
          { value: 'Irregular meal timings', label: 'Irregular meal timings' },
          { value: 'Frequent snacking/cravings', label: 'Frequent snacking / cravings' },
          { value: 'Not sure', label: 'Not sure' }
        ]
      },
      q5: {
        text: 'Which areas would you like to improve?',
        hint: 'You may select more than one.',
        type: 'checkbox',
        options: [
          { value: 'Energy levels', label: 'Energy Levels' },
          { value: 'Sleep quality', label: 'Sleep Quality' },
          { value: 'Digestive health', label: 'Digestive Health' },
          { value: 'Eating habits', label: 'Eating Habits' },
          { value: 'Weight management', label: 'Weight Management' },
          { value: 'Hydration', label: 'Hydration' },
          { value: 'Physical fitness', label: 'Physical Fitness' },
          { value: 'Stress management', label: 'Stress Management' },
          { value: 'Mood', label: 'Mood' },
          { value: 'Overall wellness', label: 'Overall Wellness' },
          { value: 'Other', label: 'Other' }
        ],
        otherPlaceholder: 'Please specify…'
      },
      q6: {
        text: 'How would you rate your sleep quality?',
        type: 'radio',
        options: [
          { value: 'Very good', label: 'Very Good' },
          { value: 'Good', label: 'Good' },
          { value: 'Fair', label: 'Fair' },
          { value: 'Poor', label: 'Poor' },
          { value: 'Very poor', label: 'Very Poor' }
        ]
      },
      q7: {
        text: 'How is your energy level throughout the day?',
        type: 'radio',
        options: [
          { value: 'High and consistent', label: 'High and Consistent' },
          { value: 'Moderate', label: 'Moderate' },
          { value: 'Low in the afternoon', label: 'Low in the Afternoon' },
          { value: 'Low most of the day', label: 'Low Most of the Day' },
          { value: 'Very low', label: 'Very Low' }
        ]
      },
      q8: {
        text: 'How comfortable is your digestion on most days?',
        type: 'radio',
        options: [
          { value: 'No issues', label: 'No Issues' },
          { value: 'Occasional bloating', label: 'Occasional Bloating' },
          { value: 'Frequent bloating', label: 'Frequent Bloating' },
          { value: 'Acidity/Heartburn', label: 'Acidity / Heartburn' },
          { value: 'Irregular bowel movements', label: 'Irregular Bowel Movements' },
          { value: 'Multiple issues', label: 'Multiple Issues' }
        ]
      },
      q9: {
        text: 'What is your MAIN wellness goal right now?',
        type: 'radio',
        options: [
          { value: 'Lose weight', label: 'Lose Weight' },
          { value: 'Improve energy', label: 'Improve Energy' },
          { value: 'Sleep better', label: 'Sleep Better' },
          { value: 'Eat healthier', label: 'Eat Healthier' },
          { value: 'Reduce stress', label: 'Reduce Stress' },
          { value: 'Build fitness', label: 'Build Fitness' },
          { value: 'Improve digestion', label: 'Improve Digestion' },
          { value: 'Overall wellness', label: 'Overall Wellness' },
          { value: 'Other', label: 'Other' }
        ],
        otherPlaceholder: 'Please describe your goal…'
      },
      q10: {
        text: 'How motivated are you to make lifestyle changes?',
        type: 'radio',
        options: [
          { value: 'Very motivated', label: 'Very Motivated' },
          { value: 'Somewhat motivated', label: 'Somewhat Motivated' },
          { value: 'Neutral', label: 'Neutral' },
          { value: 'Not very motivated', label: 'Not Very Motivated' },
          { value: 'Not motivated at all', label: 'Not Motivated at All' }
        ]
      }
    },

    // Section B heading
    sectionBHeading: 'HOW ARE YOU FEELING?',
    // Section C heading
    sectionCHeading: 'YOUR GOAL',
    // Section D
    sectionDHeading: 'FREE WELLNESS GUIDANCE',
    guidanceQuestion: 'Would you like a FREE personal wellness guidance session based on your answers?',
    guidanceOptions: [
      { value: 'Yes', label: 'Yes' },
      { value: 'Maybe', label: 'Maybe' },
      { value: 'No', label: 'No' }
    ],
    preferredModeLabel: 'Preferred mode of guidance:',
    modeOptions: [
      { value: 'At Wellness Centre', label: 'At Wellness Centre' },
      { value: 'Phone/WhatsApp', label: 'Phone / WhatsApp' },
      { value: 'Online', label: 'Online' }
    ],
    preferredTimeLabel: 'Preferred time slot:',

    // Privacy
    privacyNotice: 'Your responses are collected only for the purpose of this lifestyle and wellness survey and guidance follow-up.',

    // Validation messages
    validation: {
      required: 'This field is required.',
      nameRequired: 'Please enter your name.',
      ageRequired: 'Please enter your age.',
      ageInvalid: 'Please enter a valid age (1–120).',
      genderRequired: 'Please select your gender.',
      contactRequired: 'Please enter your contact number.',
      contactInvalid: 'Please enter a valid 10-digit mobile number.',
      dateRequired: 'Please select a date.',
      selectOption: 'Please select an option.',
      selectAtLeastOne: 'Please select at least one option.',
      otherRequired: 'Please describe your choice.',
      guidanceRequired: 'Please let us know if you\'d like guidance.',
      modeRequired: 'Please select a preferred mode.'
    },

    // Result page
    thankYou: 'Thank You',
    assessmentComplete: 'Your Lifestyle & Wellness Assessment is Complete!',
    wellnessScoreLabel: 'Your Lifestyle Wellness Score',
    focusAreasHeading: 'Your Top Focus Areas',
    resultDisclaimer: 'Your responses suggest a few areas where small lifestyle improvements may be helpful. This is not a medical diagnosis.',
    guidanceBanner: 'You requested a FREE Wellness Guidance Session — we\'ll reach out soon!',
    callLabel: 'Call Moulika',
    whatsappLabel: 'WhatsApp Moulika',
    sendResultLabel: 'Send My Results to WhatsApp',
    shareLabel: 'Share Your Result',

    // Error / loading
    errorMessage: "We couldn't save your response. Please check your internet connection and try again.",
    loadingMessage: 'Submitting your survey…',

    // Focus area titles & suggestions
    focusAreas: {
      hydration: {
        title: 'Hydration',
        icon: '💧',
        suggestion: 'Try to drink at least 8 glasses of water daily. Keeping a water bottle nearby can help you stay on track.'
      },
      activity: {
        title: 'Physical Activity',
        icon: '🏃',
        suggestion: 'Even a 20-minute walk 3–4 times a week can significantly improve your energy and mood.'
      },
      sleep: {
        title: 'Sleep Quality',
        icon: '😴',
        suggestion: 'Aim for 7–8 hours of sleep. A consistent bedtime routine can greatly improve sleep quality.'
      },
      diet: {
        title: 'Food Habits',
        icon: '🥗',
        suggestion: 'Focus on home-cooked, balanced meals. Reducing outside food and late-night snacking makes a big difference.'
      },
      energy: {
        title: 'Energy & Stress',
        icon: '⚡',
        suggestion: 'Short breaks, light stretching, and mindful breathing during the day can help maintain steady energy levels.'
      },
      digestion: {
        title: 'Digestive Health',
        icon: '🌿',
        suggestion: 'Eating slowly, staying hydrated, and reducing fried/spicy foods can improve digestion noticeably.'
      },
      overall: {
        title: 'Overall Wellness',
        icon: '🌟',
        suggestion: 'Small, consistent changes in sleep, diet, and movement together create a powerful wellness transformation.'
      }
    }
  },

  // ── TELUGU ────────────────────────────────────────────────────
  te: {
    langCode: 'te',
    langName: 'తెలుగు',
    brandName: 'జీవనశైలి & వెల్‌నెస్',

    heroBadge: 'ఉచిత జీవనశైలి & వెల్‌నెస్ సర్వే',
    heroLine1: 'మీ ఆరోగ్యం.',
    heroLine2: 'మీ జీవనశైలి.',
    heroLine3: 'మీ తదుపరి అడుగు.',
    heroTagline: '"ఈరోజు వేసే చిన్న అడుగు రేపు మరింత ఆరోగ్యకరమైన, ఆనందమైన జీవితానికి దారి తీస్తుంది!"',
    heroQuestion: 'మీకు తరచుగా వీటిలో ఏమైనా అనిపిస్తుందా?',
    symptoms: [
      'శక్తి తగ్గినట్లు అనిపించడం',
      'నిద్ర సరిగా లేకపోవడం',
      'జీర్ణక్రియలో అసౌకర్యం',
      'ఆరోగ్యకరమైన ఆహారపు అలవాట్లు లేకపోవడం',
      'బరువు నిర్వహణలో ఇబ్బందులు',
      'తరచుగా తినాలనే కోరికలు',
      'తగినంత నీరు తాగకపోవడం',
      'క్రమం తప్పకుండా వ్యాయామం చేయకపోవడం',
      'ఒత్తిడి / బిజీ జీవనశైలి',
      'ఆరోగ్యం బాగాలేదనే భావన'
    ],
    ctaOffer: 'సర్వే పూర్తి చేయండి & ఉచిత వెల్‌నెస్ మార్గదర్శకత్వ సెషన్ పొందండి',
    ctaModes: 'ఆన్‌లైన్ & ఆఫ్‌లైన్ మార్గదర్శకత్వం అందుబాటులో ఉంది',
    ctaStart: 'మీ ఉచిత వెల్‌నెస్ సర్వే ప్రారంభించండి',
    ctaDuration: 'కేవలం 2–3 నిమిషాలు మాత్రమే పడుతుంది',
    contactStrip: 'మౌళిక – 6302552079',

    stepLabel: (n, t) => `దశ ${n} / ${t}`,
    stepTitles: [
      'ప్రారంభిద్దాం',
      'మీ ప్రస్తుత జీవనశైలి',
      'మీకు ఎలా అనిపిస్తోంది?',
      'మీ లక్ష్యం',
      'ఉచిత వెల్‌నెస్ మార్గదర్శకత్వం'
    ],
    stepSubtitles: [
      'దయచేసి మీ వ్యక్తిగత వివరాలు నమోదు చేయండి.',
      'మీ రోజువారీ అలవాట్ల గురించి చెప్పండి.',
      'మీరు రోజూ ఎలా అనుభవిస్తున్నారో అర్థం చేసుకోవడానికి సహాయం చేయండి.',
      'మీ వెల్‌నెస్ దిశను నిర్ణయిద్దాం.',
      'మీ ఉచిత వ్యక్తిగత మార్గదర్శకత్వ సెషన్ పొందండి.'
    ],

    previous: 'వెనుకకు',
    next: 'తదుపరి',
    submit: 'సర్వే సమర్పించండి',
    submitting: 'సమర్పిస్తోంది…',
    retryBtn: 'మళ్లీ ప్రయత్నించండి',

    fieldDate: 'తేదీ',
    fieldName: 'పూర్తి పేరు',
    fieldAge: 'వయస్సు',
    fieldGender: 'లింగం',
    fieldContact: 'సంప్రదింపు నంబర్',
    genderOptions: [
      { value: 'Male', label: 'పురుషుడు' },
      { value: 'Female', label: 'స్త్రీ' },
      { value: 'Prefer not to say', label: 'చెప్పదలచుకోలేదు' }
    ],
    placeholderDate: '',
    placeholderName: 'మీ పూర్తి పేరు నమోదు చేయండి',
    placeholderAge: 'ఉదా: 28',
    placeholderContact: '10 అంకెల మొబైల్ నంబర్',
    placeholderTime: 'ఉదా: ఉదయం 10 – మధ్యాహ్నం 12',
    fieldSurveyDoneBy: 'సర్వే నిర్వహించినవారు',
    placeholderSurveyDoneBy: 'సర్వే నిర్వహించిన వ్యక్తి పేరు',

    questions: {
      q1: {
        text: 'మీ మొత్తం జీవనశైలిని మీరు ఎలా అంచనా వేస్తారు?',
        type: 'radio',
        options: [
          { value: 'Excellent', label: 'చాలా మంచిది' },
          { value: 'Good', label: 'మంచిది' },
          { value: 'Average', label: 'సగటు' },
          { value: 'Needs Improvement', label: 'మెరుగుపరచాలి' }
        ]
      },
      q2: {
        text: 'మీరు వారానికి ఎన్ని రోజులు వ్యాయామం లేదా శారీరకంగా చురుకుగా ఉంటారు?',
        type: 'radio',
        options: [
          { value: '0', label: '0 రోజులు' },
          { value: '1-2', label: '1–2 రోజులు' },
          { value: '3-4', label: '3–4 రోజులు' },
          { value: '5+', label: '5 లేదా అంతకంటే ఎక్కువ రోజులు' }
        ]
      },
      q3: {
        text: 'మీరు సాధారణంగా రోజుకు ఎన్ని గ్లాసుల నీరు తాగుతారు?',
        type: 'radio',
        options: [
          { value: '<4', label: '4 కంటే తక్కువ' },
          { value: '4-6', label: '4–6' },
          { value: '7-9', label: '7–9' },
          { value: '10+', label: '10+' }
        ]
      },
      q4: {
        text: 'మీ రోజువారీ ఆహారపు అలవాట్లను ఎలా వివరిస్తారు?',
        type: 'radio',
        options: [
          { value: 'Mostly balanced', label: 'ఎక్కువగా సమతుల్యమైన ఆహారం' },
          { value: 'Frequently eat outside', label: 'తరచుగా బయట ఆహారం తినడం' },
          { value: 'Irregular meal timings', label: 'క్రమం లేని భోజన సమయాలు' },
          { value: 'Frequent snacking/cravings', label: 'తరచుగా స్నాక్స్ / తినాలనే కోరికలు' },
          { value: 'Not sure', label: 'ఖచ్చితంగా తెలియదు' }
        ]
      },
      q5: {
        text: 'మీరు ఏ అంశాలను మెరుగుపరచుకోవాలనుకుంటున్నారు?',
        hint: 'ఒకటి కంటే ఎక్కువ ఎంచుకోవచ్చు.',
        type: 'checkbox',
        options: [
          { value: 'Energy levels', label: 'శక్తి స్థాయిలు' },
          { value: 'Sleep quality', label: 'నిద్ర నాణ్యత' },
          { value: 'Digestive health', label: 'జీర్ణ ఆరోగ్యం' },
          { value: 'Eating habits', label: 'ఆహారపు అలవాట్లు' },
          { value: 'Weight management', label: 'బరువు నిర్వహణ' },
          { value: 'Hydration', label: 'నీరు తాగడం' },
          { value: 'Physical fitness', label: 'శారీరక దృఢత్వం' },
          { value: 'Stress management', label: 'ఒత్తిడి నిర్వహణ' },
          { value: 'Mood', label: 'మానసిక స్థితి' },
          { value: 'Overall wellness', label: 'మొత్తం ఆరోగ్యం' },
          { value: 'Other', label: 'ఇతర' }
        ],
        otherPlaceholder: 'దయచేసి వివరించండి…'
      },
      q6: {
        text: 'మీ నిద్ర నాణ్యతను ఎలా అంచనా వేస్తారు?',
        type: 'radio',
        options: [
          { value: 'Very good', label: 'చాలా మంచిది' },
          { value: 'Good', label: 'మంచిది' },
          { value: 'Fair', label: 'సాధారణం' },
          { value: 'Poor', label: 'పేద' },
          { value: 'Very poor', label: 'చాలా పేద' }
        ]
      },
      q7: {
        text: 'రోజంతా మీ శక్తి స్థాయి ఎలా ఉంటుంది?',
        type: 'radio',
        options: [
          { value: 'High and consistent', label: 'ఎక్కువగా మరియు స్థిరంగా' },
          { value: 'Moderate', label: 'మధ్యస్తంగా' },
          { value: 'Low in the afternoon', label: 'మధ్యాహ్నం తర్వాత తక్కువగా' },
          { value: 'Low most of the day', label: 'చాలా సమయం తక్కువగా' },
          { value: 'Very low', label: 'చాలా తక్కువగా' }
        ]
      },
      q8: {
        text: 'మీ జీర్ణక్రియ సాధారణంగా ఎలా ఉంటుంది?',
        type: 'radio',
        options: [
          { value: 'No issues', label: 'సమస్యలు లేవు' },
          { value: 'Occasional bloating', label: 'అప్పుడప్పుడు గ్యాస్ / ఉబ్బరం' },
          { value: 'Frequent bloating', label: 'తరచుగా గ్యాస్ / ఉబ్బరం' },
          { value: 'Acidity/Heartburn', label: 'యాసిడిటీ / గుండె మంట' },
          { value: 'Irregular bowel movements', label: 'అనియమిత మలవిసర్జన' },
          { value: 'Multiple issues', label: 'అనేక సమస్యలు' }
        ]
      },
      q9: {
        text: 'ప్రస్తుతం మీ ప్రధాన వెల్‌నెస్ లక్ష్యం ఏమిటి?',
        type: 'radio',
        options: [
          { value: 'Lose weight', label: 'బరువు తగ్గడం' },
          { value: 'Improve energy', label: 'శక్తి పెంచుకోవడం' },
          { value: 'Sleep better', label: 'నిద్ర మెరుగుపరచడం' },
          { value: 'Eat healthier', label: 'ఆరోగ్యకరమైన ఆహారం తినడం' },
          { value: 'Reduce stress', label: 'ఒత్తిడి తగ్గించుకోవడం' },
          { value: 'Build fitness', label: 'ఫిట్‌నెస్ పెంచడం' },
          { value: 'Improve digestion', label: 'జీర్ణక్రియ మెరుగుపరచడం' },
          { value: 'Overall wellness', label: 'మొత్తం ఆరోగ్యం' },
          { value: 'Other', label: 'ఇతర' }
        ],
        otherPlaceholder: 'మీ లక్ష్యాన్ని వివరించండి…'
      },
      q10: {
        text: 'జీవనశైలిలో మార్పులు చేసుకోవడానికి మీరు ఎంత ప్రేరణగా ఉన్నారు?',
        type: 'radio',
        options: [
          { value: 'Very motivated', label: 'చాలా ప్రేరణగా ఉన్నాను' },
          { value: 'Somewhat motivated', label: 'కొంత ప్రేరణగా ఉన్నాను' },
          { value: 'Neutral', label: 'తటస్థంగా ఉన్నాను' },
          { value: 'Not very motivated', label: 'అంత ప్రేరణగా లేను' },
          { value: 'Not motivated at all', label: 'అస్సలు ప్రేరణగా లేను' }
        ]
      }
    },

    sectionBHeading: 'మీకు ఎలా అనిపిస్తోంది?',
    sectionCHeading: 'మీ లక్ష్యం',
    sectionDHeading: 'ఉచిత వెల్‌నెస్ మార్గదర్శకత్వం',
    guidanceQuestion: 'మీ సమాధానాల ఆధారంగా ఉచిత వ్యక్తిగత వెల్‌నెస్ మార్గదర్శకత్వ సెషన్ కావాలనుకుంటున్నారా?',
    guidanceOptions: [
      { value: 'Yes', label: 'అవును' },
      { value: 'Maybe', label: 'బహుశా' },
      { value: 'No', label: 'వద్దు' }
    ],
    preferredModeLabel: 'మీకు నచ్చే మార్గదర్శకత్వ విధానం:',
    modeOptions: [
      { value: 'At Wellness Centre', label: 'వెల్‌నెస్ సెంటర్‌లో' },
      { value: 'Phone/WhatsApp', label: 'ఫోన్ / వాట్సాప్' },
      { value: 'Online', label: 'ఆన్‌లైన్‌లో' }
    ],
    preferredTimeLabel: 'మీకు నచ్చే సమయం:',

    privacyNotice: 'మీ సమాధానాలు ఈ జీవనశైలి మరియు వెల్‌నెస్ సర్వే మరియు తదుపరి మార్గదర్శకత్వం కోసం మాత్రమే సేకరించబడతాయి.',

    validation: {
      required: 'ఈ ఫీల్డ్ అవసరం.',
      nameRequired: 'దయచేసి మీ పేరు నమోదు చేయండి.',
      ageRequired: 'దయచేసి మీ వయస్సు నమోదు చేయండి.',
      ageInvalid: 'దయచేసి సరైన వయస్సు నమోదు చేయండి (1–120).',
      genderRequired: 'దయచేసి మీ లింగాన్ని ఎంచుకోండి.',
      contactRequired: 'దయచేసి మీ సంప్రదింపు నంబర్ నమోదు చేయండి.',
      contactInvalid: 'దయచేసి సరైన 10 అంకెల మొబైల్ నంబర్ నమోదు చేయండి.',
      dateRequired: 'దయచేసి తేదీ ఎంచుకోండి.',
      selectOption: 'దయచేసి ఒక ఎంపికను ఎంచుకోండి.',
      selectAtLeastOne: 'దయచేసి కనీసం ఒక ఎంపికను ఎంచుకోండి.',
      otherRequired: 'దయచేసి మీ ఎంపికను వివరించండి.',
      guidanceRequired: 'మీకు మార్గదర్శకత్వం కావాలా అని తెలియజేయండి.',
      modeRequired: 'దయచేసి మీకు నచ్చే విధానాన్ని ఎంచుకోండి.'
    },

    thankYou: 'ధన్యవాదాలు',
    assessmentComplete: 'మీ జీవనశైలి & వెల్‌నెస్ అంచనా పూర్తయింది!',
    wellnessScoreLabel: 'మీ జీవనశైలి వెల్‌నెస్ స్కోర్',
    focusAreasHeading: 'మీ ముఖ్యమైన దృష్టి పెట్టాల్సిన అంశాలు',
    resultDisclaimer: 'మీ సమాధానాల ఆధారంగా, కొన్ని జీవనశైలి అంశాల్లో చిన్న మార్పులు చేయడం మీకు ఉపయోగకరంగా ఉండవచ్చు. ఇది వైద్య నిర్ధారణ కాదు.',
    guidanceBanner: 'మీరు ఉచిత వెల్‌నెస్ మార్గదర్శకత్వ సెషన్ అభ్యర్థించారు — మేము త్వరలో సంప్రదిస్తాం!',
    callLabel: 'మౌళికకు కాల్ చేయండి',
    whatsappLabel: 'మౌళికకు వాట్సాప్ చేయండి',
    sendResultLabel: 'నా ఫలితాలను వాట్సాప్‌కు పంపండి',
    shareLabel: 'మీ ఫలితం షేర్ చేయండి',

    errorMessage: 'మీ సమాధానాలను సేవ్ చేయలేకపోయాము. దయచేసి మీ ఇంటర్నెట్ కనెక్షన్‌ను తనిఖీ చేసి మళ్లీ ప్రయత్నించండి.',
    loadingMessage: 'మీ సర్వే సమర్పిస్తోంది…',

    focusAreas: {
      hydration: {
        title: 'నీరు తాగడం (Hydration)',
        icon: '💧',
        suggestion: 'రోజూ కనీసం 8 గ్లాసుల నీరు తాగడానికి ప్రయత్నించండి. దగ్గర నీళ్ళ సీసా ఉంచుకుంటే సులభంగా అలవాటు చేసుకోవచ్చు.'
      },
      activity: {
        title: 'శారీరక చురుకుదనం (Physical Activity)',
        icon: '🏃',
        suggestion: 'వారంలో 3–4 సార్లు 20 నిమిషాల నడక కూడా మీ శక్తిని మరియు మానసిక స్థితిని గణనీయంగా మెరుగుపరుస్తుంది.'
      },
      sleep: {
        title: 'నిద్ర నాణ్యత (Sleep Quality)',
        icon: '😴',
        suggestion: '7–8 గంటల నిద్ర లక్ష్యంగా పెట్టుకోండి. నిద్రవేళ నిత్యం పాటించడం నిద్ర నాణ్యతను చాలా మెరుగుపరుస్తుంది.'
      },
      diet: {
        title: 'ఆహారపు అలవాట్లు (Food Habits)',
        icon: '🥗',
        suggestion: 'ఇంట్లో వండిన సమతుల్యమైన ఆహారం తినడంపై దృష్టి పెట్టండి. బయట ఆహారం మరియు రాత్రి పూట స్నాక్స్ తగ్గించడం చాలా మంచి మార్పు తెస్తుంది.'
      },
      energy: {
        title: 'శక్తి & ఒత్తిడి (Energy & Stress)',
        icon: '⚡',
        suggestion: 'పని మధ్య చిన్న విరామాలు, తేలికపాటి వ్యాయామం మరియు శ్వాస సాధన మీ శక్తి స్థిరంగా ఉండటానికి సహాయపడతాయి.'
      },
      digestion: {
        title: 'జీర్ణ ఆరోగ్యం (Digestive Health)',
        icon: '🌿',
        suggestion: 'నెమ్మదిగా తినడం, తగినంత నీరు తాగడం మరియు వేయించిన/కారపు ఆహారం తగ్గించడం జీర్ణక్రియను మెరుగుపరుస్తుంది.'
      },
      overall: {
        title: 'మొత్తం ఆరోగ్యం (Overall Wellness)',
        icon: '🌟',
        suggestion: 'నిద్ర, ఆహారం మరియు వ్యాయామంలో చిన్న, స్థిరమైన మార్పులు కలిసి శక్తివంతమైన వెల్‌నెస్ మార్పును తీసుకొస్తాయి.'
      }
    }
  }
};

// ── Language helpers ───────────────────────────────────────────
function t(key) {
  return T[currentLang][key] !== undefined ? T[currentLang][key] : (T.en[key] || key);
}

function selectLanguage(lang) {
  document.getElementById('lang-select-screen').classList.add('hidden');
  document.getElementById('app').classList.remove('hidden');
  setLanguage(lang);
  renderLandingPage();
}

function setLanguage(lang) {
  if (!T[lang]) return;
  currentLang = lang;
  localStorage.setItem(CONFIG.langStorageKey, lang);
  document.documentElement.lang = lang === 'te' ? 'te' : 'en';
  updateHeaderSwitcher();
  // Re-render whichever page is visible
  if (!document.getElementById('landing-page').classList.contains('hidden')) {
    renderLandingPage();
  } else if (!document.getElementById('survey-page').classList.contains('hidden')) {
    renderStep(currentStep);
    updateProgress();
  } else if (!document.getElementById('result-page').classList.contains('hidden')) {
    renderResult(computedScores);
  }
}

function updateHeaderSwitcher() {
  const enBtn = document.getElementById('sw-en');
  const teBtn = document.getElementById('sw-te');
  if (!enBtn || !teBtn) return;
  enBtn.classList.toggle('active', currentLang === 'en');
  teBtn.classList.toggle('active', currentLang === 'te');
  enBtn.setAttribute('aria-pressed', currentLang === 'en' ? 'true' : 'false');
  teBtn.setAttribute('aria-pressed', currentLang === 'te' ? 'true' : 'false');
  document.getElementById('header-brand-text').textContent = T[currentLang].brandName;
}

// ── Landing page renderer ──────────────────────────────────────
// Symptom icons mapped by index
const SYMPTOM_ICONS = ['⚡','😴','🌿','🥗','⚖️','🍫','💧','🏃','😓','💚'];

function renderLandingPage() {
  const L = T[currentLang];
  const landing = document.getElementById('landing-page');

  landing.innerHTML = `
    <!-- HERO -->
    <section class="hero">
      <div class="hero-inner">
        <div class="hero-badge">${escHtml(L.heroBadge)}</div>
        <h2 class="hero-headline">${escHtml(L.heroLine1)}</h2>
        <h2 class="hero-headline accent">${escHtml(L.heroLine2)}</h2>
        <h2 class="hero-headline">${escHtml(L.heroLine3)}</h2>
        <div class="hero-divider"></div>
        <p class="hero-tagline">${escHtml(L.heroTagline)}</p>
        <p class="hero-question">${escHtml(L.heroQuestion)}</p>
      </div>
    </section>

    <!-- SYMPTOMS -->
    <section class="symptoms-section" aria-label="Common symptoms">
      <div class="symptoms-inner">
        <div class="symptoms-heading">
          <h3>${escHtml(L.heroQuestion)}</h3>
        </div>
        <div class="symptoms-grid" id="symptoms-grid"></div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta-section">
      <div class="cta-inner">
        <span class="cta-eyebrow">✦ ${escHtml(L.heroBadge)} ✦</span>
        <p class="cta-offer">${escHtml(L.ctaOffer)}</p>
        <p class="cta-modes">
          <span>🏠 ${currentLang === 'te' ? 'ఆఫ్‌లైన్' : 'Offline'}</span>
          <span>💻 ${currentLang === 'te' ? 'ఆన్‌లైన్' : 'Online'}</span>
          <span>📱 WhatsApp</span>
        </p>
        <div class="btn-cta-wrap">
          <button class="btn btn-primary btn-cta" id="btn-start-survey" onclick="startSurvey()">
            ${escHtml(L.ctaStart)}
          </button>
        </div>
        <p class="cta-duration">${escHtml(L.ctaDuration)}</p>
        <div class="contact-card">
          <div class="contact-avatar">👩‍⚕️</div>
          <div class="contact-info">
            <div class="contact-name">${escHtml(CONFIG.contactName)}</div>
            <div class="contact-phone">📞 ${escHtml(CONFIG.phone)}</div>
          </div>
        </div>
      </div>
    </section>`;

  // Populate symptoms grid
  const grid = document.getElementById('symptoms-grid');
  if (grid) {
    L.symptoms.forEach((s, i) => {
      const card = document.createElement('div');
      card.className = 'symptom-card';
      card.innerHTML = `
        <div class="symptom-icon" aria-hidden="true">${SYMPTOM_ICONS[i] || '✦'}</div>
        <span class="symptom-text">${escHtml(s)}</span>`;
      grid.appendChild(card);
    });
  }

  setText('header-brand-text', L.brandName);
  updateHeaderSwitcher();
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function startSurvey() {
  showPage('survey-page');
  currentStep = 1;
  renderStep(1);
  updateProgress();
}

// ── Progress ───────────────────────────────────────────────────
function updateProgress() {
  const L = T[currentLang];
  const pct = Math.round((currentStep / TOTAL_STEPS) * 100);
  setText('progress-label', L.stepLabel(currentStep, TOTAL_STEPS));
  setText('progress-pct', pct + '%');
  const fill = document.getElementById('progress-fill');
  if (fill) {
    fill.style.width = pct + '%';
    document.getElementById('progress-bar-wrapper').setAttribute('aria-valuenow', pct);
  }
  // Prev button
  const prevBtn = document.getElementById('btn-prev');
  if (prevBtn) {
    prevBtn.textContent = L.previous;
    prevBtn.style.visibility = currentStep === 1 ? 'hidden' : 'visible';
  }
  // Next / Submit button
  const nextBtn = document.getElementById('btn-next');
  if (nextBtn) {
    nextBtn.textContent = currentStep === TOTAL_STEPS ? L.submit : L.next;
  }
}

// ── Step banner images (Unsplash — free, no auth required) ────
// w=800&h=280&fit=crop gives a consistent 800×280 crop
const STEP_IMAGES = [
  {
    // Step 1 — Personal details: warm, welcoming wellness consultation
    url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=280&fit=crop&auto=format',
    alt: 'Wellness consultation — calm morning scene'
  },
  {
    // Step 2 — Current Lifestyle: healthy food + active lifestyle
    url: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&h=280&fit=crop&auto=format',
    alt: 'Healthy food and lifestyle'
  },
  {
    // Step 3 — How Are You Feeling: peaceful mindfulness / wellbeing
    url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=280&fit=crop&auto=format',
    alt: 'Mindfulness and wellbeing'
  },
  {
    // Step 4 — Your Goal: woman stretching / fitness goal
    url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=280&fit=crop&auto=format',
    alt: 'Fitness and wellness goals'
  },
  {
    // Step 5 — Guidance: professional wellness coaching session
    url: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=280&fit=crop&auto=format',
    alt: 'Wellness guidance and coaching'
  }
];

// ── Step renderer ──────────────────────────────────────────────
function renderStep(n) {
  const L = T[currentLang];
  const container = document.getElementById('step-container');
  container.innerHTML = '';

  const card = document.createElement('div');
  card.className = 'step-card';

  // Full-width banner image above the green header
  const img = STEP_IMAGES[n - 1];
  const banner = document.createElement('div');
  banner.className = 'step-banner';
  banner.innerHTML = `
    <img
      src="${img.url}"
      alt="${img.alt}"
      class="step-banner-img"
      loading="lazy"
      onerror="this.parentElement.style.display='none'"
    />
    <div class="step-banner-overlay"></div>`;
  card.appendChild(banner);

  // Green header
  const header = document.createElement('div');
  header.className = 'step-header';
  header.innerHTML = `
    <div class="step-number">${L.stepLabel(n, TOTAL_STEPS)}</div>
    <h2 class="step-title">${L.stepTitles[n - 1]}</h2>
    <p class="step-subtitle">${L.stepSubtitles[n - 1]}</p>`;
  card.appendChild(header);

  // Body
  const body = document.createElement('div');
  body.className = 'step-body';
  card.appendChild(body);

  switch (n) {
    case 1: buildStep1(body, L); break;
    case 2: buildStep2(body, L); break;
    case 3: buildStep3(body, L); break;
    case 4: buildStep4(body, L); break;
    case 5: buildStep5(body, L); break;
  }

  container.appendChild(card);
  container.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ── Step 1: Personal Details ──────────────────────────────────
function buildStep1(card, L) {
  card.appendChild(makeField('date', 'input', {
    type: 'date', label: L.fieldDate, value: formData.date,
    placeholder: L.placeholderDate, required: true,
    onChange: v => { formData.date = v; }
  }));
  card.appendChild(makeField('name', 'input', {
    type: 'text', label: L.fieldName, value: formData.name,
    placeholder: L.placeholderName, required: true,
    onChange: v => { formData.name = v; }
  }));
  card.appendChild(makeField('age', 'input', {
    type: 'number', label: L.fieldAge, value: formData.age,
    placeholder: L.placeholderAge, required: true, min: 1, max: 120,
    onChange: v => { formData.age = v; }
  }));
  card.appendChild(makeRadioGroup('gender', L.fieldGender, L.genderOptions, formData.gender, v => {
    formData.gender = v;
  }));
  card.appendChild(makeField('contact', 'input', {
    type: 'tel', label: L.fieldContact, value: formData.contact,
    placeholder: L.placeholderContact, required: true, inputmode: 'numeric',
    onChange: v => { formData.contact = v; }
  }));
  card.appendChild(makeField('surveyDoneBy', 'input', {
    type: 'text', label: L.fieldSurveyDoneBy, value: formData.surveyDoneBy,
    placeholder: L.placeholderSurveyDoneBy, required: false,
    onChange: v => { formData.surveyDoneBy = v; }
  }));
}

// ── Step 2: Current Lifestyle (Q1–Q4) ─────────────────────────
function buildStep2(card, L) {
  ['q1', 'q2', 'q3', 'q4'].forEach(qk => {
    const q = L.questions[qk];
    card.appendChild(makeRadioGroup(qk, q.text, q.options, formData[qk], v => {
      formData[qk] = v;
    }));
  });
}

// ── Step 3: How Are You Feeling (Q5–Q8) ───────────────────────
function buildStep3(card, L) {
  const sectionHead = document.createElement('div');
  sectionHead.className = 'section-badge';
  sectionHead.textContent = L.sectionBHeading;
  card.appendChild(sectionHead);

  // Q5 multi-select
  const q5 = L.questions.q5;
  card.appendChild(makeCheckboxGroup('q5', q5.text, q5.hint, q5.options, formData.q5,
    q5.otherPlaceholder, formData.q5Other,
    (vals) => { formData.q5 = vals; },
    (val) => { formData.q5Other = val; }
  ));

  // Q6, Q7, Q8 single-select
  ['q6', 'q7', 'q8'].forEach(qk => {
    const q = L.questions[qk];
    card.appendChild(makeRadioGroup(qk, q.text, q.options, formData[qk], v => {
      formData[qk] = v;
    }));
  });
}

// ── Step 4: Goals (Q9–Q10) ────────────────────────────────────
function buildStep4(card, L) {
  const sectionHead = document.createElement('div');
  sectionHead.className = 'section-badge';
  sectionHead.textContent = L.sectionCHeading;
  card.appendChild(sectionHead);

  const q9 = L.questions.q9;
  card.appendChild(makeRadioGroup('q9', q9.text, q9.options, formData.q9, v => {
    formData.q9 = v;
    // Show/hide other field
    const otherWrap = document.getElementById('q9-other-wrap');
    if (otherWrap) otherWrap.style.display = v === 'Other' ? 'block' : 'none';
  }, { otherValue: 'Other', otherPlaceholder: q9.otherPlaceholder,
       otherCurrent: formData.q9Other, onOtherChange: v => { formData.q9Other = v; } }));

  const q10 = L.questions.q10;
  card.appendChild(makeRadioGroup('q10', q10.text, q10.options, formData.q10, v => {
    formData.q10 = v;
  }));
}

// ── Step 5: Guidance ──────────────────────────────────────────
function buildStep5(card, L) {
  const sectionHead = document.createElement('div');
  sectionHead.className = 'section-badge';
  sectionHead.textContent = L.sectionDHeading;
  card.appendChild(sectionHead);

  card.appendChild(makeRadioGroup('guidance', L.guidanceQuestion, L.guidanceOptions,
    formData.guidanceRequested, v => {
      formData.guidanceRequested = v;
      const modeSection = document.getElementById('guidance-mode-section');
      if (modeSection) modeSection.style.display = (v === 'Yes' || v === 'Maybe') ? 'block' : 'none';
    }
  ));

  // Mode + Time (conditionally visible)
  const modeSection = document.createElement('div');
  modeSection.id = 'guidance-mode-section';
  modeSection.style.display = (formData.guidanceRequested === 'Yes' || formData.guidanceRequested === 'Maybe') ? 'block' : 'none';

  modeSection.appendChild(makeRadioGroup('preferredMode', L.preferredModeLabel, L.modeOptions,
    formData.preferredMode, v => { formData.preferredMode = v; }
  ));

  modeSection.appendChild(makeField('preferredTime', 'input', {
    type: 'text', label: L.preferredTimeLabel, value: formData.preferredTime,
    placeholder: L.placeholderTime, required: false,
    onChange: v => { formData.preferredTime = v; }
  }));

  card.appendChild(modeSection);

  // Privacy notice
  const privacy = document.createElement('p');
  privacy.className = 'privacy-notice';
  privacy.textContent = L.privacyNotice;
  card.appendChild(privacy);
}

// ── DOM builders ───────────────────────────────────────────────
function makeField(id, tag, opts) {
  const wrap = document.createElement('div');
  wrap.className = 'field-wrap';

  const label = document.createElement('label');
  label.htmlFor = `field-${id}`;
  label.className = 'field-label';
  label.textContent = opts.label + (opts.required ? '' : '');
  wrap.appendChild(label);

  const input = document.createElement('input');
  input.type = opts.type || 'text';
  input.id = `field-${id}`;
  input.name = id;
  input.className = 'field-input';
  if (opts.value !== undefined) input.value = opts.value;
  if (opts.placeholder) input.placeholder = opts.placeholder;
  if (opts.required) input.required = true;
  if (opts.min !== undefined) input.min = opts.min;
  if (opts.max !== undefined) input.max = opts.max;
  if (opts.inputmode) input.inputMode = opts.inputmode;

  input.addEventListener('input', () => {
    opts.onChange(input.value);
    clearError(id);
  });

  wrap.appendChild(input);

  const errEl = document.createElement('span');
  errEl.className = 'field-error';
  errEl.id = `err-${id}`;
  errEl.setAttribute('role', 'alert');
  errEl.setAttribute('aria-live', 'polite');
  wrap.appendChild(errEl);

  return wrap;
}

function makeRadioGroup(name, labelText, options, currentVal, onChange, otherOpts) {
  const wrap = document.createElement('div');
  wrap.className = 'question-wrap';

  const lbl = document.createElement('p');
  lbl.className = 'question-text';
  lbl.id = `qlbl-${name}`;
  lbl.textContent = labelText;
  wrap.appendChild(lbl);

  const group = document.createElement('div');
  group.className = 'radio-group';
  group.setAttribute('role', 'radiogroup');
  group.setAttribute('aria-labelledby', `qlbl-${name}`);

  options.forEach((opt, i) => {
    const optWrap = document.createElement('label');
    optWrap.className = 'radio-label' + (currentVal === opt.value ? ' selected' : '');
    optWrap.htmlFor = `${name}-${i}`;

    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = name;
    radio.id = `${name}-${i}`;
    radio.value = opt.value;
    radio.checked = currentVal === opt.value;
    radio.setAttribute('aria-label', opt.label);

    radio.addEventListener('change', () => {
      onChange(radio.value);
      clearError(name);
      // Update selected class
      group.querySelectorAll('.radio-label').forEach(l => l.classList.remove('selected'));
      optWrap.classList.add('selected');
      // Handle other field visibility if applicable
      if (otherOpts && otherOpts.otherValue) {
        const otherWrap = document.getElementById(`${name}-other-wrap`);
        if (otherWrap) otherWrap.style.display = radio.value === otherOpts.otherValue ? 'block' : 'none';
      }
    });

    optWrap.appendChild(radio);
    const span = document.createElement('span');
    span.textContent = opt.label;
    optWrap.appendChild(span);
    group.appendChild(optWrap);
  });

  wrap.appendChild(group);

  // Optional "Other" text field
  if (otherOpts && otherOpts.otherValue) {
    const otherWrap = document.createElement('div');
    otherWrap.id = `${name}-other-wrap`;
    otherWrap.className = 'other-field-wrap';
    otherWrap.style.display = currentVal === otherOpts.otherValue ? 'block' : 'none';
    const otherInput = document.createElement('input');
    otherInput.type = 'text';
    otherInput.className = 'field-input';
    otherInput.id = `${name}-other-input`;
    otherInput.placeholder = otherOpts.otherPlaceholder || '';
    otherInput.value = otherOpts.otherCurrent || '';
    otherInput.addEventListener('input', () => {
      if (otherOpts.onOtherChange) otherOpts.onOtherChange(otherInput.value);
    });
    otherWrap.appendChild(otherInput);
    wrap.appendChild(otherWrap);
  }

  const errEl = document.createElement('span');
  errEl.className = 'field-error';
  errEl.id = `err-${name}`;
  errEl.setAttribute('role', 'alert');
  errEl.setAttribute('aria-live', 'polite');
  wrap.appendChild(errEl);

  return wrap;
}

function makeCheckboxGroup(name, labelText, hintText, options, currentVals, otherPlaceholder, otherCurrentVal, onChange, onOtherChange) {
  const wrap = document.createElement('div');
  wrap.className = 'question-wrap';

  const lbl = document.createElement('p');
  lbl.className = 'question-text';
  lbl.id = `qlbl-${name}`;
  lbl.textContent = labelText;
  wrap.appendChild(lbl);

  if (hintText) {
    const hint = document.createElement('p');
    hint.className = 'question-hint';
    hint.textContent = hintText;
    wrap.appendChild(hint);
  }

  const group = document.createElement('div');
  group.className = 'checkbox-group';

  options.forEach((opt, i) => {
    const optWrap = document.createElement('label');
    optWrap.className = 'checkbox-label' + (currentVals.includes(opt.value) ? ' selected' : '');
    optWrap.htmlFor = `${name}-${i}`;

    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.name = name;
    cb.id = `${name}-${i}`;
    cb.value = opt.value;
    cb.checked = currentVals.includes(opt.value);
    cb.setAttribute('aria-label', opt.label);

    cb.addEventListener('change', () => {
      // Read from formData directly so we always operate on the live array
      const vals = [...formData[name]];
      if (cb.checked) {
        if (!vals.includes(opt.value)) vals.push(opt.value);
        optWrap.classList.add('selected');
      } else {
        const idx = vals.indexOf(opt.value);
        if (idx > -1) vals.splice(idx, 1);
        optWrap.classList.remove('selected');
      }
      onChange(vals);
      clearError(name);
      // Show other field
      if (opt.value === 'Other') {
        const otherWrap = document.getElementById(`${name}-other-wrap`);
        if (otherWrap) otherWrap.style.display = cb.checked ? 'block' : 'none';
      }
    });

    optWrap.appendChild(cb);
    const span = document.createElement('span');
    span.textContent = opt.label;
    optWrap.appendChild(span);
    group.appendChild(optWrap);
  });

  wrap.appendChild(group);

  // Other text field
  const otherWrap = document.createElement('div');
  otherWrap.id = `${name}-other-wrap`;
  otherWrap.className = 'other-field-wrap';
  otherWrap.style.display = currentVals.includes('Other') ? 'block' : 'none';
  const otherInput = document.createElement('input');
  otherInput.type = 'text';
  otherInput.className = 'field-input';
  otherInput.id = `${name}-other-input`;
  otherInput.placeholder = otherPlaceholder || '';
  otherInput.value = otherCurrentVal || '';
  otherInput.addEventListener('input', () => { onOtherChange(otherInput.value); });
  otherWrap.appendChild(otherInput);
  wrap.appendChild(otherWrap);

  const errEl = document.createElement('span');
  errEl.className = 'field-error';
  errEl.id = `err-${name}`;
  errEl.setAttribute('role', 'alert');
  errEl.setAttribute('aria-live', 'polite');
  wrap.appendChild(errEl);

  return wrap;
}

// ── Validation ─────────────────────────────────────────────────
function showError(fieldId, msg) {
  const el = document.getElementById(`err-${fieldId}`);
  if (el) { el.textContent = msg; el.style.display = 'block'; }
  const input = document.getElementById(`field-${fieldId}`) || document.querySelector(`[name="${fieldId}"]`);
  if (input) input.setAttribute('aria-invalid', 'true');
}

function clearError(fieldId) {
  const el = document.getElementById(`err-${fieldId}`);
  if (el) { el.textContent = ''; el.style.display = 'none'; }
  const input = document.getElementById(`field-${fieldId}`) || document.querySelector(`[name="${fieldId}"]`);
  if (input) input.removeAttribute('aria-invalid');
}

function validateStep(n) {
  const V = T[currentLang].validation;
  let valid = true;

  function fail(id, msg) { showError(id, msg); valid = false; }

  if (n === 1) {
    if (!formData.date) fail('date', V.dateRequired);
    if (!formData.name.trim()) fail('name', V.nameRequired);
    const age = parseInt(formData.age, 10);
    if (!formData.age) fail('age', V.ageRequired);
    else if (isNaN(age) || age < 1 || age > 120) fail('age', V.ageInvalid);
    if (!formData.gender) fail('gender', V.genderRequired);
    if (!formData.contact.trim()) fail('contact', V.contactRequired);
    else if (!/^\d{10}$/.test(formData.contact.trim())) fail('contact', V.contactInvalid);
  }
  if (n === 2) {
    ['q1', 'q2', 'q3', 'q4'].forEach(qk => {
      if (!formData[qk]) fail(qk, V.selectOption);
    });
  }
  if (n === 3) {
    if (!formData.q5 || formData.q5.length === 0) fail('q5', V.selectAtLeastOne);
    else if (formData.q5.includes('Other') && !formData.q5Other.trim()) fail('q5', V.otherRequired);
    ['q6', 'q7', 'q8'].forEach(qk => {
      if (!formData[qk]) fail(qk, V.selectOption);
    });
  }
  if (n === 4) {
    if (!formData.q9) fail('q9', V.selectOption);
    else if (formData.q9 === 'Other' && !formData.q9Other.trim()) fail('q9', V.otherRequired);
    if (!formData.q10) fail('q10', V.selectOption);
  }
  if (n === 5) {
    if (!formData.guidanceRequested) fail('guidance', V.guidanceRequired);
    if ((formData.guidanceRequested === 'Yes' || formData.guidanceRequested === 'Maybe') && !formData.preferredMode) {
      fail('preferredMode', V.modeRequired);
    }
  }
  return valid;
}

// ── Navigation ─────────────────────────────────────────────────
function nextStep() {
  if (!validateStep(currentStep)) {
    // Scroll to first error
    const firstErr = document.querySelector('.field-error:not(:empty)');
    if (firstErr) firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }
  if (currentStep === TOTAL_STEPS) {
    submitSurvey();
    return;
  }
  currentStep++;
  renderStep(currentStep);
  updateProgress();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function prevStep() {
  if (currentStep === 1) return;
  currentStep--;
  renderStep(currentStep);
  updateProgress();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── Scoring ────────────────────────────────────────────────────
function scoreQ1(v) {
  return { Excellent: 100, Good: 75, Average: 50, 'Needs Improvement': 25 }[v] || 50;
}
function scoreQ2(v) {
  return { '0': 0, '1-2': 33, '3-4': 67, '5+': 100 }[v] || 0;
}
function scoreQ3(v) {
  return { '<4': 0, '4-6': 33, '7-9': 67, '10+': 100 }[v] || 0;
}
function scoreQ4(v) {
  return { 'Mostly balanced': 100, 'Frequently eat outside': 50,
    'Irregular meal timings': 50, 'Frequent snacking/cravings': 25, 'Not sure': 50 }[v] || 50;
}
function scoreQ6(v) {
  return { 'Very good': 100, Good: 75, Fair: 50, Poor: 25, 'Very poor': 0 }[v] || 50;
}
function scoreQ7(v) {
  return { 'High and consistent': 100, Moderate: 75, 'Low in the afternoon': 50,
    'Low most of the day': 25, 'Very low': 0 }[v] || 50;
}
function scoreQ10(v) {
  return { 'Very motivated': 100, 'Somewhat motivated': 75, Neutral: 50,
    'Not very motivated': 25, 'Not motivated at all': 0 }[v] || 50;
}

function calculateScores(fd) {
  const activityScore = scoreQ2(fd.q2);
  const dietScore = Math.round((scoreQ1(fd.q1) + scoreQ4(fd.q4)) / 2);
  const sleepScore = scoreQ6(fd.q6);
  const hydrationScore = scoreQ3(fd.q3);
  const energyScore = Math.round((scoreQ7(fd.q7) + scoreQ10(fd.q10)) / 2);

  const overall = Math.round(
    activityScore * 0.25 +
    dietScore * 0.25 +
    sleepScore * 0.20 +
    hydrationScore * 0.15 +
    energyScore * 0.15
  );

  // Focus areas: lowest 3 domain scores
  const domains = [
    { key: 'activity', score: activityScore },
    { key: 'diet', score: dietScore },
    { key: 'sleep', score: sleepScore },
    { key: 'hydration', score: hydrationScore },
    { key: 'energy', score: energyScore }
  ];
  domains.sort((a, b) => a.score - b.score);
  const focusAreas = domains.slice(0, 3).map(d => d.key);

  return { overall, activityScore, dietScore, sleepScore, hydrationScore, energyScore, focusAreas };
}

// ── Submission ─────────────────────────────────────────────────
function submitSurvey() {
  const scores = calculateScores(formData);
  computedScores = scores;

  const L = T[currentLang];
  const nextBtn = document.getElementById('btn-next');
  if (nextBtn) {
    nextBtn.disabled = true;
    nextBtn.textContent = L.submitting;
  }

  const payload = {
    language: currentLang.toUpperCase(),
    date: formData.date,
    name: formData.name.trim(),
    age: formData.age,
    gender: formData.gender,
    contact: formData.contact.trim(),
    surveyDoneBy: formData.surveyDoneBy.trim(),
    q1: formData.q1, q2: formData.q2, q3: formData.q3, q4: formData.q4,
    q5: formData.q5.join(', '), q5Other: formData.q5Other,
    q6: formData.q6, q7: formData.q7, q8: formData.q8,
    q9: formData.q9, q9Other: formData.q9Other,
    q10: formData.q10,
    guidanceRequested: formData.guidanceRequested,
    preferredMode: formData.preferredMode,
    preferredTime: formData.preferredTime,
    overallScore: scores.overall,
    activityScore: scores.activityScore,
    dietScore: scores.dietScore,
    hydrationScore: scores.hydrationScore,
    sleepScore: scores.sleepScore,
    energyScore: scores.energyScore,
    focusArea1: scores.focusAreas[0] || '',
    focusArea2: scores.focusAreas[1] || '',
    focusArea3: scores.focusAreas[2] || ''
  };

  // If no script URL configured, show result immediately (demo mode)
  if (!CONFIG.googleScriptUrl) {
    showPage('result-page');
    renderResult(scores, 'WL-DEMO-0001');
    return;
  }

  // Google Apps Script redirects POST requests, which causes CORS errors
  // in browsers when called from localhost or cross-origin pages.
  // Solution: use no-cors mode (opaque response) — we cannot read the
  // response body, so we show the result optimistically after the fetch
  // succeeds. The data is still written to the Sheet server-side.
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  fetch(CONFIG.googleScriptUrl, {
    method: 'POST',
    mode: 'no-cors',                       // prevents CORS block on redirect
    headers: { 'Content-Type': 'text/plain' }, // no-cors only allows simple headers
    body: JSON.stringify(payload),
    signal: controller.signal
  })
    .then(() => {
      // Opaque response — fetch succeeded, Sheet write happened server-side.
      // Generate a client-side response ID for display.
      clearTimeout(timeoutId);
      const today = new Date();
      const ymd   = today.getFullYear().toString() +
                    String(today.getMonth() + 1).padStart(2, '0') +
                    String(today.getDate()).padStart(2, '0');
      const rid   = 'WL-' + ymd + '-' + String(Math.floor(Math.random() * 9000) + 1000);
      showPage('result-page');
      renderResult(scores, rid);
    })
    .catch(err => {
      clearTimeout(timeoutId);
      showSubmitError(err.message || 'Network error');
    });
}

function showSubmitError(errDetail) {
  const L = T[currentLang];
  const nextBtn = document.getElementById('btn-next');
  if (nextBtn) {
    nextBtn.disabled = false;
    nextBtn.textContent = L.submit;
  }
  // Show error banner inside step container
  let errBanner = document.getElementById('submit-error-banner');
  if (!errBanner) {
    errBanner = document.createElement('div');
    errBanner.id = 'submit-error-banner';
    errBanner.className = 'submit-error-banner';
    errBanner.setAttribute('role', 'alert');
    const stepContainer = document.getElementById('step-container');
    stepContainer.insertAdjacentElement('afterend', errBanner);
  }
  errBanner.innerHTML = `<p>${L.errorMessage}</p>
    <button class="btn btn-secondary retry-btn" onclick="retrySubmit()">${L.retryBtn}</button>`;
}

function retrySubmit() {
  const banner = document.getElementById('submit-error-banner');
  if (banner) banner.remove();
  submitSurvey();
}

// ── Build WhatsApp "send results to self" URL ──────────────────
function buildWhatsAppResultUrl(scores, responseId) {
  const isTe = currentLang === 'te';

  const L = T[currentLang];

  // Emoji constants defined early so bandLine can use them too
  const E = {
    plant:    '\uD83C\uDF3F', // 🌿
    sparkles: '\u2728',       // ✨
    chart:    '\uD83D\uDCCA', // 📊
    target:   '\uD83C\uDFAF', // 🎯
    phone:    '\uD83D\uDCDE', // 📞
    notepad:  '\uD83D\uDCCB', // 📋
    person:   '\uD83D\uDC64', // 👤
    mobile:   '\uD83D\uDCF1', // 📱
    speech:   '\uD83D\uDCAC', // 💬
    blossom:  '\uD83C\uDF38', // 🌸
    wave:     '\uD83D\uDC4B', // 👋
    run:      '\uD83C\uDFC3', // 🏃
    salad:    '\uD83E\uDD57', // 🥗
    sleep:    '\uD83D\uDE34', // 😴
    drop:     '\uD83D\uDCA7', // 💧
    bolt:     '\u26A1',       // ⚡
    star:     '\uD83C\uDF1F', // 🌟
    flex:     '\uD83D\uDCAA', // 💪
    seedling: '\uD83C\uDF31', // 🌱
  };

  // Score band — inline encouragement sentence
  const bandLine = scores.overall >= 70
    ? (isTe
        ? `మీరు చాలా బాగా చేస్తున్నారు! మీ జీవనశైలి అద్భుతంగా ఉంది. దాన్ని కొనసాగించండి! ${E.star}`
        : `You're doing great! Your lifestyle is in excellent shape. Keep it up! ${E.star}`)
    : scores.overall >= 45
    ? (isTe
        ? `మెరుగుపడే అవకాశం ఖచ్చితంగా ఉంది, మరియు చిన్న, స్థిరమైన జీవనశైలి మార్పులు గణనీయమైన తేడా తీసుకొస్తాయి. ${E.flex}${E.seedling}`
        : `There's definitely room for improvement, and the good news is that small, consistent lifestyle changes can make a meaningful difference. ${E.flex}${E.seedling}`)
    : (isTe
        ? `మీ ఆరోగ్యానికి తక్షణ శ్రద్ధ అవసరం, కానీ సరైన అడుగులతో మీరు ఖచ్చితంగా మెరుగుపడతారు! ${E.flex}`
        : `Your wellness needs some attention, but with the right steps you can absolutely turn it around! ${E.flex}`);

  const focusLines = scores.focusAreas.map((key, i) => {
    const fa = L.focusAreas[key] || L.focusAreas.overall;
    return `${i + 1}. ${fa.icon} ${fa.title}`;
  }).join('\n');

  let msg;
  if (isTe) {
    msg =
`${E.plant} *జీవనశైలి & వెల్‌నెస్ అంచనా – మీ ఫలితం*

నమస్కారం ${formData.name}! ${E.wave}

మీ వెల్‌నెస్ అంచనా పూర్తి చేసినందుకు ధన్యవాదాలు.

${E.sparkles} *మీ వెల్‌నెస్ స్కోర్: ${scores.overall}/100*
${bandLine}

${E.chart} *మీ డొమైన్ స్కోర్లు:*
* ${E.run} వ్యాయామం: ${scores.activityScore}/100
* ${E.salad} ఆహారం: ${scores.dietScore}/100
* ${E.sleep} నిద్ర: ${scores.sleepScore}/100
* ${E.drop} నీరు: ${scores.hydrationScore}/100
* ${E.bolt} శక్తి: ${scores.energyScore}/100

${E.target} *మీ ముఖ్యమైన దృష్టి అంశాలు:*

${focusLines}

మీ ఫలితాలను చర్చించి, మీ జీవనశైలి మరియు లక్ష్యాల ఆధారంగా సరళమైన, ఆచరణాత్మక ప్రణాళిక రూపొందిద్దాం.

${E.phone} అనుకూలమైన సమయంలో నాకు తిరిగి కాల్ చేయమని మనవి.

${E.notepad} *సంప్రదింపు వివరాలు:*
${E.person} ${CONFIG.contactName}
${E.mobile} కాల్: ${CONFIG.phone}
${E.speech} వాట్సాప్: wa.me/${CONFIG.whatsapp}

${E.blossom} మీ వెల్‌నెస్ ప్రయాణం ఒక్క చిన్న అడుగుతో మొదలవుతుంది!${responseId ? `\n\nResponse ID: ${responseId}` : ''}`;
  } else {
    msg =
`${E.plant} *Lifestyle & Wellness Assessment – Your Result*

Hi ${formData.name}! ${E.wave}

Thank you for taking the time to complete your Wellness Assessment.

${E.sparkles} *Your Wellness Score: ${scores.overall}/100*
${bandLine}

${E.chart} *Your Domain Scores:*
* ${E.run} Exercise: ${scores.activityScore}/100
* ${E.salad} Diet: ${scores.dietScore}/100
* ${E.sleep} Sleep: ${scores.sleepScore}/100
* ${E.drop} Hydration: ${scores.hydrationScore}/100
* ${E.bolt} Energy: ${scores.energyScore}/100

${E.target} *Your Top Focus Areas:*

${focusLines}

Let's discuss your results and create a simple, practical plan based on your lifestyle and goals.

${E.phone} Kindly call me back when convenient.

${E.notepad} *Contact Details:*
${E.person} ${CONFIG.contactName}
${E.mobile} Call: ${CONFIG.phone}
${E.speech} WhatsApp: wa.me/${CONFIG.whatsapp}

${E.blossom} Your wellness journey starts with one small step!${responseId ? `\n\nResponse ID: ${responseId}` : ''}`;
  }

  // Send to customer's own WhatsApp — they keep a copy of their results
  const raw = formData.contact.trim().replace(/\D/g, '');
  const phone = raw.length === 10 ? '91' + raw : raw;

  return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
}

// ── Result Screen ──────────────────────────────────────────────
function renderResult(scores, responseId) {
  const L = T[currentLang];
  const container = document.getElementById('result-container');
  container.innerHTML = '';

  const scoreColor  = scores.overall >= 70 ? '#2E7D32' : scores.overall >= 45 ? '#F59E0B' : '#DC2626';
  const bandClass   = scores.overall >= 70 ? 'band-good' : scores.overall >= 45 ? 'band-average' : 'band-low';
  const bandText    = scores.overall >= 70
    ? (currentLang === 'te' ? '🌟 అద్భుతంగా ఉంది!' : '🌟 Great job!')
    : scores.overall >= 45
    ? (currentLang === 'te' ? '🌱 మెరుగుపరచవచ్చు' : '🌱 Room to improve')
    : (currentLang === 'te' ? '💪 దృష్టి పెట్టాలి' : '💪 Needs attention');

  // Domain rows HTML
  const domainKeys = [
    { key: 'activity',   label: currentLang === 'te' ? 'వ్యాయామం'     : 'Exercise',   score: scores.activityScore },
    { key: 'diet',       label: currentLang === 'te' ? 'ఆహారం'         : 'Diet',       score: scores.dietScore },
    { key: 'sleep',      label: currentLang === 'te' ? 'నిద్ర'          : 'Sleep',      score: scores.sleepScore },
    { key: 'hydration',  label: currentLang === 'te' ? 'నీరు'           : 'Hydration',  score: scores.hydrationScore },
    { key: 'energy',     label: currentLang === 'te' ? 'శక్తి / ఒత్తిడి' : 'Energy',    score: scores.energyScore }
  ];

  const domainHTML = domainKeys.map(d => `
    <div class="domain-row">
      <div class="domain-row-header">
        <span class="domain-name">${d.label}</span>
        <span class="domain-score-val">${d.score}</span>
      </div>
      <div class="domain-bar">
        <div class="domain-fill" style="width:${d.score}%"></div>
      </div>
    </div>`).join('');

  // Focus cards HTML
  const focusHTML = scores.focusAreas.map((key, i) => {
    const fa = L.focusAreas[key] || L.focusAreas.overall;
    return `
      <div class="focus-card">
        <div class="focus-num">${i + 1}</div>
        <div class="focus-icon" aria-hidden="true">${fa.icon}</div>
        <div class="focus-content">
          <h4 class="focus-title">${fa.title}</h4>
          <p class="focus-suggestion">${fa.suggestion}</p>
        </div>
      </div>`;
  }).join('');

  const guidanceBanner = (formData.guidanceRequested === 'Yes' || formData.guidanceRequested === 'Maybe')
    ? `<div class="guidance-banner">${L.guidanceBanner}</div>` : '';

  // SVG arc: circumference = 2π×52 ≈ 326.7 for r=52 in 120×120 viewBox
  container.innerHTML = `
    <div class="result-page-inner">
      <div class="result-card">

        <div class="result-header">
          <div class="result-checkmark" aria-hidden="true">✅</div>
          <h2 class="result-thankyou">${escHtml(L.thankYou)}, ${escHtml(formData.name)}!</h2>
          <p class="result-complete">${escHtml(L.assessmentComplete)}</p>
        </div>

        <div class="result-body">

          <div class="score-section">
            <p class="score-label">${escHtml(L.wellnessScoreLabel)}</p>
            <div class="score-circle" role="img" aria-label="${scores.overall} out of 100">
              <svg viewBox="0 0 120 120" class="score-svg">
                <circle cx="60" cy="60" r="52" class="score-track"/>
                <circle cx="60" cy="60" r="52" class="score-arc"
                  style="stroke:${scoreColor}; stroke-dasharray:${Math.round(scores.overall * 3.267)} 327"/>
              </svg>
              <div class="score-number">
                <span class="score-num">${scores.overall}</span>
                <span class="score-denom">/100</span>
              </div>
            </div>
            <div class="score-band ${bandClass}">${bandText}</div>
          </div>

          <div class="domain-scores">
            <div class="domain-title">${currentLang === 'te' ? 'డొమైన్ స్కోర్లు' : 'Domain Scores'}</div>
            ${domainHTML}
          </div>

          <div class="focus-section">
            <h3 class="focus-heading">${escHtml(L.focusAreasHeading)}</h3>
            ${focusHTML}
          </div>

          <p class="result-disclaimer">${escHtml(L.resultDisclaimer)}</p>
          ${guidanceBanner}

          <div class="result-cta-buttons">
            <a class="btn btn-call" href="tel:${CONFIG.phone}">📞 ${escHtml(L.callLabel)}</a>
            <a class="btn btn-whatsapp" href="https://wa.me/${CONFIG.whatsapp}" target="_blank" rel="noopener noreferrer">💬 ${escHtml(L.whatsappLabel)}</a>
          </div>

          <a class="btn btn-send-result" href="${buildWhatsAppResultUrl(scores, responseId)}" target="_blank" rel="noopener noreferrer">📲 ${escHtml(L.sendResultLabel)}</a>

          ${responseId ? `<p class="response-id">Response ID: ${responseId}</p>` : ''}
        </div>
      </div>
    </div>`;

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── Page navigation helper ─────────────────────────────────────
function showPage(pageId) {
  ['landing-page', 'survey-page', 'result-page'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.toggle('hidden', id !== pageId);
  });
}

// ── Bootstrap ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem(CONFIG.langStorageKey);
  if (saved && T[saved]) {
    // Skip language select screen, go straight to app
    selectLanguage(saved);
  }
  // Otherwise lang-select-screen is shown by default (from HTML)
  updateHeaderSwitcher();
});
