export type ClassCourseCard = {
  id: string;
  title: string;
  subject: string;
  lessons: number;
  duration: string;
  description: string;
};

export type SkillModule = {
  id: string;
  title: string;
  focus: string;
  duration: string;
};

export type SkillTrack = {
  id: string;
  title: string;
  teacher: string;
  videoSubject: string;
  modules: SkillModule[];
};

export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export type LeaderboardEntry = {
  name: string;
  classLabel: string;
  score: number;
  quizzes: number;
  streak: number;
  badge: string;
};

export const CLASS_ID_BY_LABEL: Record<string, string> = {
  "শ্রেণি ১": "class-1",
  "শ্রেণি ২": "class-2",
  "শ্রেণি ৩": "class-3",
  "শ্রেণি ৪": "class-4",
  "শ্রেণি ৫": "class-5",
  "শ্রেণি ৬": "class-6",
  "শ্রেণি ৭": "class-7",
  "শ্রেণি ৮": "class-8",
  "শ্রেণি ৯": "class-9",
  "শ্রেণি ১০": "class-10",
  "শ্রেণি ১১": "class-11",
  "শ্রেণি ১২": "class-12",
};

export const CLASS_LABEL_BY_ID: Record<string, string> = {
  "class-1": "শ্রেণি ১",
  "class-2": "শ্রেণি ২",
  "class-3": "শ্রেণি ৩",
  "class-4": "শ্রেণি ৪",
  "class-5": "শ্রেণি ৫",
  "class-6": "শ্রেণি ৬",
  "class-7": "শ্রেণি ৭",
  "class-8": "শ্রেণি ৮",
  "class-9": "শ্রেণি ৯",
  "class-10": "শ্রেণি ১০",
  "class-11": "শ্রেণি ১১",
  "class-12": "শ্রেণি ১২",
};

export const CLASS_VIDEO_SUBJECTS: Record<string, string[]> = {
  "শ্রেণি ১২": ["পদার্থবিজ্ঞান", "রসায়নবিজ্ঞান", "গণিত", "জীববিজ্ঞান"],
  "শ্রেণি ১১": ["পদার্থবিজ্ঞান", "রসায়নবিজ্ঞান", "বেসিক পাইথন প্রোগ্রামিং", "ইংরেজি"],
  "শ্রেণি ১০": ["বাংলা ১ম পত্র", "গণিত", "সাধারণ বিজ্ঞান", "পদার্থবিজ্ঞান", "ইতিহাস"],
  "শ্রেণি ৯": ["বাংলা", "ইংরেজি", "গণিত", "বিজ্ঞান"],
  "শ্রেণি ৮": ["বাংলা", "ইংরেজি", "গণিত", "বিজ্ঞান"],
  "শ্রেণি ৭": ["বাংলা", "ইংরেজি", "গণিত", "বিজ্ঞান"],
  "শ্রেণি ৬": ["বাংলা", "ইংরেজি", "গণিত", "বিজ্ঞান"],
  "শ্রেণি ৫": ["বাংলা", "ইংরেজি", "গণিত", "বিজ্ঞান"],
  "শ্রেণি ৪": ["বাংলা", "ইংরেজি", "গণিত", "বিজ্ঞান"],
  "শ্রেণি ৩": ["বাংলা", "ইংরেজি", "গণিত", "বিজ্ঞান"],
  "শ্রেণি ২": ["বাংলা", "ইংরেজি", "গণিত", "বিজ্ঞান"],
  "শ্রেণি ১": ["বাংলা", "ইংরেজি", "গণিত", "বিজ্ঞান"],
  স্কিলস: [
    "IELTS কোর্স",
    "ঘরে বসে Spoken English",
    "IELTS LIVE ব্যাচ",
    "জুনিয়র Spoken English",
  ],
};

export const CLASS_COURSE_CATALOG: Record<string, ClassCourseCard[]> = {
  "class-1": [
    {
      id: "c1-bn-01",
      title: "বাংলা বর্ণ পরিচিতি",
      subject: "বাংলা",
      lessons: 16,
      duration: "৫ সপ্তাহ",
      description: "স্বরবর্ণ, ব্যঞ্জনবর্ণ ও সহজ শব্দগঠনের ভিত্তি।",
    },
    {
      id: "c1-math-01",
      title: "গণিতের হাতেখড়ি",
      subject: "গণিত",
      lessons: 14,
      duration: "৪ সপ্তাহ",
      description: "সংখ্যা চেনা, যোগ-বিয়োগ এবং আকারভিত্তিক অনুশীলন।",
    },
    {
      id: "c1-eng-01",
      title: "ইংরেজি অ্যালফাবেট ও শব্দ",
      subject: "ইংরেজি",
      lessons: 12,
      duration: "৪ সপ্তাহ",
      description: "A-Z, basic words এবং ছোট বাক্য গঠন শেখানো হয়।",
    },
  ],
  "class-2": [
    {
      id: "c2-bn-01",
      title: "বাংলা পাঠ অনুশীলন",
      subject: "বাংলা",
      lessons: 18,
      duration: "৬ সপ্তাহ",
      description: "ছোট গল্প পড়া, প্রশ্নোত্তর ও বানান অনুশীলন।",
    },
    {
      id: "c2-sci-01",
      title: "আমাদের চারপাশের বিজ্ঞান",
      subject: "বিজ্ঞান",
      lessons: 15,
      duration: "৫ সপ্তাহ",
      description: "প্রাণী, উদ্ভিদ এবং পরিবেশের প্রাথমিক ধারণা।",
    },
    {
      id: "c2-math-01",
      title: "সংখ্যা, যোগ ও বিয়োগ",
      subject: "গণিত",
      lessons: 17,
      duration: "৫ সপ্তাহ",
      description: "দৈনন্দিন উদাহরণের মাধ্যমে প্রাথমিক গণিত চর্চা।",
    },
  ],
  "class-3": [
    {
      id: "c3-bn-01",
      title: "বাংলা গল্প ও অনুচ্ছেদ",
      subject: "বাংলা",
      lessons: 20,
      duration: "৬ সপ্তাহ",
      description: "পাঠ্যভিত্তিক অনুচ্ছেদ, শব্দার্থ ও ব্যাকরণ চর্চা।",
    },
    {
      id: "c3-eng-01",
      title: "Basic English Grammar",
      subject: "ইংরেজি",
      lessons: 18,
      duration: "৬ সপ্তাহ",
      description: "Noun, verb, sentence pattern এবং writing practice।",
    },
    {
      id: "c3-math-01",
      title: "গুণ ও ভাগ অনুশীলন",
      subject: "গণিত",
      lessons: 16,
      duration: "৫ সপ্তাহ",
      description: "মৌলিক গুণ, ভাগ এবং শব্দভিত্তিক সমস্যা সমাধান।",
    },
  ],
  "class-10": [
    {
      id: "c10-bn-01",
      title: "বাংলা ১ম পত্র দ্রুত প্রস্তুতি",
      subject: "বাংলা ১ম পত্র",
      lessons: 26,
      duration: "৯ সপ্তাহ",
      description: "পাঠ বিশ্লেষণ, সৃজনশীল প্রশ্ন ও সাজেশনভিত্তিক চর্চা।",
    },
    {
      id: "c10-math-01",
      title: "SSC গণিত মাস্টার কোর্স",
      subject: "গণিত",
      lessons: 30,
      duration: "১০ সপ্তাহ",
      description: "অধ্যায়ভিত্তিক সমাধান, শর্টকাট ও মডেল টেস্ট।",
    },
  ],
  "class-11": [
    {
      id: "c11-phy-01",
      title: "HSC পদার্থবিজ্ঞান ভিত্তি",
      subject: "পদার্থবিজ্ঞান",
      lessons: 28,
      duration: "১০ সপ্তাহ",
      description: "Concept building, numerical practice ও chapter test।",
    },
    {
      id: "c11-ict-01",
      title: "বেসিক পাইথন প্রোগ্রামিং",
      subject: "বেসিক পাইথন প্রোগ্রামিং",
      lessons: 18,
      duration: "৬ সপ্তাহ",
      description: "Programming logic, variable, loop, function এর ভিত্তি।",
    },
  ],
  "class-12": [
    {
      id: "c12-phy-01",
      title: "পদার্থবিজ্ঞান বোর্ড ক্র্যাশ",
      subject: "পদার্থবিজ্ঞান",
      lessons: 30,
      duration: "১০ সপ্তাহ",
      description: "বোর্ড টার্গেটেড থিওরি, নিউমেরিক্যাল ও লাইভ সলভ।",
    },
    {
      id: "c12-chem-01",
      title: "রসায়নবিজ্ঞান এক্সাম ফোকাস",
      subject: "রসায়নবিজ্ঞান",
      lessons: 29,
      duration: "৯ সপ্তাহ",
      description: "গুরুত্বপূর্ণ বিক্রিয়া ও MCQ/CQ এর পরীক্ষাভিত্তিক প্রস্তুতি।",
    },
  ],
};

export const SKILL_ID_BY_TITLE: Record<string, string> = {
  "IELTS কোর্স": "ielts-course",
  "ঘরে বসে Spoken English": "spoken-english-home",
  "IELTS LIVE ব্যাচ": "ielts-live-batch",
  "জুনিয়র Spoken English": "junior-spoken-english",
};

export const SKILL_TRACKS: Record<string, SkillTrack> = {
  "ielts-course": {
    id: "ielts-course",
    title: "IELTS কোর্স",
    teacher: "প্রফেসর আহমেদ হোসেন",
    videoSubject: "IELTS কোর্স",
    modules: [
      { id: "ielts-m1", title: "Reading Strategy", focus: "Skimming, scanning ও time management", duration: "৩.৫ ঘন্টা" },
      { id: "ielts-m2", title: "Writing Task 1 + Task 2", focus: "Essay structure ও score boosting", duration: "৪.০ ঘন্টা" },
      { id: "ielts-m3", title: "Listening + Speaking Practice", focus: "Real exam simulation ও feedback", duration: "৩.০ ঘন্টা" },
    ],
  },
  "spoken-english-home": {
    id: "spoken-english-home",
    title: "ঘরে বসে Spoken English",
    teacher: "মিস রাহেলা পারভীন",
    videoSubject: "ঘরে বসে Spoken English",
    modules: [
      { id: "spk-m1", title: "Daily Conversation", focus: "বাস্তব জীবনের common কথোপকথন", duration: "২.৫ ঘন্টা" },
      { id: "spk-m2", title: "Fluency Builder", focus: "Sentence pattern ও pronunciation", duration: "৩.০ ঘন্টা" },
      { id: "spk-m3", title: "Confidence Sessions", focus: "Public speaking drills", duration: "২.০ ঘন্টা" },
    ],
  },
  "ielts-live-batch": {
    id: "ielts-live-batch",
    title: "IELTS LIVE ব্যাচ",
    teacher: "মি. করিম উদ্দিন",
    videoSubject: "IELTS LIVE ব্যাচ",
    modules: [
      { id: "live-m1", title: "Live Mock Test 1", focus: "Full-length test + live review", duration: "২.৫ ঘন্টা" },
      { id: "live-m2", title: "Band 7+ Writing Clinic", focus: "Task response ও coherence", duration: "৩.০ ঘন্টা" },
      { id: "live-m3", title: "Speaking Feedback Day", focus: "1:1 speaking correction", duration: "২.০ ঘন্টা" },
    ],
  },
  "junior-spoken-english": {
    id: "junior-spoken-english",
    title: "জুনিয়র Spoken English",
    teacher: "মিস সুমাইয়া খান",
    videoSubject: "জুনিয়র Spoken English",
    modules: [
      { id: "jun-m1", title: "Kids Vocabulary", focus: "Fun activities with words", duration: "১.৫ ঘন্টা" },
      { id: "jun-m2", title: "Story Speaking", focus: "Story retelling and confidence", duration: "২.০ ঘন্টা" },
      { id: "jun-m3", title: "Grammar Basics", focus: "Simple tense and sentence making", duration: "২.০ ঘন্টা" },
    ],
  },
};

export const QUIZ_BANK: Record<string, QuizQuestion[]> = {
  default: [
    { id: "q-d1", question: "পাঠ শেষে পুনরাবৃত্তি করার সেরা পদ্ধতি কোনটি?", options: ["কেবল বই পড়া", "নিজেকে প্রশ্ন করা", "কোনো অনুশীলন না করা", "শুধু ভিডিও দেখা"], correctIndex: 1, explanation: "Self-testing শিখনকে দীর্ঘমেয়াদে স্থায়ী করে।" },
    { id: "q-d2", question: "দৈনিক পড়াশোনার পরিকল্পনায় কোনটি জরুরি?", options: ["নির্দিষ্ট লক্ষ্য", "অনিয়মিত সময়", "একসাথে সব বিষয়", "কোনো বিরতি নয়"], correctIndex: 0, explanation: "নির্দিষ্ট লক্ষ্য ফোকাস ও ধারাবাহিকতা বাড়ায়।" },
  ],
  গণিত: [
    { id: "q-m1", question: "১২ × ৮ এর মান কত?", options: ["৮৬", "৯৬", "৯২", "১০২"], correctIndex: 1, explanation: "১২ × ৮ = ৯৬" },
    { id: "q-m2", question: "গুণের ফলকে কী বলা হয়?", options: ["ভাগফল", "যোগফল", "গুণফল", "বিয়োগফল"], correctIndex: 2, explanation: "Multiplication এর ফল হচ্ছে গুণফল।" },
    { id: "q-m3", question: "π এর আসন্ন মান কত?", options: ["3.14", "2.72", "1.41", "3.00"], correctIndex: 0, explanation: "π ≈ 3.14159" },
    { id: "q-m4", question: "একটি বর্গের ক্ষেত্রফল নির্ণয়ের সূত্র কোনটি?", options: ["2 × ভুজ", "ভুজ²", "4 × ভুজ", "ভুজ × ২"], correctIndex: 1, explanation: "বর্গের ক্ষেত্রফল = (ভুজ)²" },
  ],
  বাংলা: [
    { id: "q-bn1", question: "বাংলা ভাষায় মোট স্বরবর্ণ কয়টি?", options: ["৯টি", "১১টি", "১৩টি", "১৫টি"], correctIndex: 1, explanation: "বাংলায় ১১টি স্বরবর্ণ আছে।" },
    { id: "q-bn2", question: "সঠিক বাক্য গঠনে কোনটি দরকার?", options: ["শব্দের সঠিক ক্রম", "শুধু কঠিন শব্দ", "শুধু বড় বাক্য", "যেকোনো ক্রম"], correctIndex: 0, explanation: "সঠিক ক্রম না থাকলে বাক্যের অর্থ নষ্ট হয়।" },
    { id: "q-bn3", question: "'রবীন্দ্রনাথ ঠাকুর' কোন ধরনের সাহিত্যের জন্য বিখ্যাত?", options: ["উপন্যাস, কবিতা ও গান", "শুধু উপন্যাস", "শুধু নাটক", "শুধু প্রবন্ধ"], correctIndex: 0, explanation: "রবীন্দ্রনাথ কবিতা, গান, উপন্যাস, নাটকসহ বহু বিষয়ে লিখেছেন।" },
  ],
  "বাংলা ১ম পত্র": [
    { id: "q-b1p1", question: "SSC বাংলা ১ম পত্রে সৃজনশীল প্রশ্নের ক ধাপে কী থাকে?", options: ["বিশ্লেষণ", "জ্ঞান যাচাই", "প্রয়োগ", "উচ্চতর দক্ষতা"], correctIndex: 1, explanation: "ক ধাপে জ্ঞানমূলক প্রশ্ন থাকে।" },
    { id: "q-b1p2", question: "'অপরিচিতা' গল্পটির লেখক কে?", options: ["শরৎচন্দ্র", "রবীন্দ্রনাথ ঠাকুর", "মানিক বন্দ্যোপাধ্যায়", "জীবনানন্দ দাশ"], correctIndex: 1, explanation: "'অপরিচিতা' রবীন্দ্রনাথ ঠাকুরের একটি বিখ্যাত গল্প।" },
  ],
  ইংরেজি: [
    { id: "q-en1", question: "Which sentence is correct?", options: ["She don't know.", "She doesn't know.", "She not know.", "She no knows."], correctIndex: 1, explanation: "With third person singular, use 'doesn't'." },
    { id: "q-en2", question: "'Quickly' is which part of speech?", options: ["Noun", "Adjective", "Adverb", "Verb"], correctIndex: 2, explanation: "'Quickly' modifies a verb, so it is an adverb." },
    { id: "q-en3", question: "The past tense of 'go' is?", options: ["goed", "goes", "went", "gone"], correctIndex: 2, explanation: "'go' is an irregular verb; its past tense is 'went'." },
  ],
  বিজ্ঞান: [
    { id: "q-sci1", question: "পানির রাসায়নিক সংকেত কী?", options: ["CO₂", "H₂O", "O₂", "NaCl"], correctIndex: 1, explanation: "পানির রাসায়নিক সংকেত H₂O।" },
    { id: "q-sci2", question: "সবুজ উদ্ভিদ সালোকসংশ্লেষণে কোন গ্যাস ব্যবহার করে?", options: ["অক্সিজেন", "হাইড্রোজেন", "কার্বন ডাইঅক্সাইড", "নাইট্রোজেন"], correctIndex: 2, explanation: "সালোকসংশ্লেষণে CO₂ শোষিত হয়।" },
    { id: "q-sci3", question: "পৃথিবীর কেন্দ্রে অভিকর্ষজ ত্বরণ g এর মান কত?", options: ["9.8 m/s²", "0 m/s²", "4.9 m/s²", "19.6 m/s²"], correctIndex: 1, explanation: "পৃথিবীর কেন্দ্রে g = 0।" },
  ],
  "সাধারণ বিজ্ঞান": [
    { id: "q-gs1", question: "মানবদেহের সবচেয়ে বড় অঙ্গ কোনটি?", options: ["হৃৎপিণ্ড", "যকৃত", "ত্বক", "মস্তিষ্ক"], correctIndex: 2, explanation: "ত্বক মানবদেহের সবচেয়ে বড় অঙ্গ।" },
    { id: "q-gs2", question: "আলো সেকেন্ডে কত কিলোমিটার যায়?", options: ["3 লক্ষ", "1 লক্ষ", "5 লক্ষ", "10 লক্ষ"], correctIndex: 0, explanation: "আলোর গতি ≈ ৩ × ১০⁵ km/s।" },
  ],
  পদার্থবিজ্ঞান: [
    { id: "q-phy1", question: "নিউটনের প্রথম সূত্রকে কী বলা হয়?", options: ["গতিসূত্র", "জড়তার সূত্র", "ক্রিয়া-প্রতিক্রিয়া সূত্র", "ভরবেগের সূত্র"], correctIndex: 1, explanation: "নিউটনের ১ম সূত্র জড়তার সূত্র নামে পরিচিত।" },
    { id: "q-phy2", question: "বলের SI একক কোনটি?", options: ["জুল", "ওয়াট", "নিউটন", "প্যাসকেল"], correctIndex: 2, explanation: "বলের SI একক নিউটন (N)।" },
    { id: "q-phy3", question: "শব্দের বেগ বায়ুতে প্রায় কত m/s?", options: ["340", "300", "1500", "3000"], correctIndex: 0, explanation: "বায়ুতে শব্দের বেগ ≈ 340 m/s।" },
  ],
  রসায়নবিজ্ঞান: [
    { id: "q-chem1", question: "পর্যায় সারণিতে প্রথম মৌল কোনটি?", options: ["হিলিয়াম", "লিথিয়াম", "হাইড্রোজেন", "অক্সিজেন"], correctIndex: 2, explanation: "পর্যায় সারণিতে প্রথম মৌল হাইড্রোজেন (H)।" },
    { id: "q-chem2", question: "অ্যাসিডের pH মান কত এর নিচে?", options: ["7", "10", "14", "0"], correctIndex: 0, explanation: "অ্যাসিডের pH < 7।" },
    { id: "q-chem3", question: "NaCl এর সাধারণ নাম কী?", options: ["চুন", "লবণ", "সোডা", "চিনি"], correctIndex: 1, explanation: "NaCl হলো সোডিয়াম ক্লোরাইড, সাধারণ লবণ।" },
  ],
  জীববিজ্ঞান: [
    { id: "q-bio1", question: "কোষের 'শক্তিঘর' কাকে বলা হয়?", options: ["নিউক্লিয়াস", "রাইবোসোম", "মাইটোকন্ড্রিয়া", "গলগি বডি"], correctIndex: 2, explanation: "মাইটোকন্ড্রিয়া ATP উৎপন্ন করে তাই একে শক্তিঘর বলে।" },
    { id: "q-bio2", question: "DNA-এর পূর্ণ নাম কী?", options: ["Deoxyribonucleic Acid", "Diribose Nucleic Acid", "Deoxyribose Nitrogen Acid", "Dual Nucleic Acid"], correctIndex: 0, explanation: "DNA = Deoxyribonucleic Acid।" },
  ],
  ইতিহাস: [
    { id: "q-his1", question: "বাংলাদেশ স্বাধীন হয় কত সালে?", options: ["১৯৫২", "১৯৬৯", "১৯৭১", "১৯৭৫"], correctIndex: 2, explanation: "১৯৭১ সালের ১৬ ডিসেম্বর বাংলাদেশ স্বাধীনতা লাভ করে।" },
    { id: "q-his2", question: "ভাষা আন্দোলন কত সালে হয়েছিল?", options: ["১৯৪৮", "১৯৫২", "১৯৫৪", "১৯৬৬"], correctIndex: 1, explanation: "১৯৫২ সালের ২১ ফেব্রুয়ারি ভাষা আন্দোলন সংঘটিত হয়।" },
    { id: "q-his3", question: "মুক্তিযুদ্ধে বাংলাদেশের সর্বোচ্চ বেসামরিক পুরস্কারের নাম কী?", options: ["বীর উত্তম", "বীর বিক্রম", "বীরশ্রেষ্ঠ", "স্বাধীনতা পদক"], correctIndex: 2, explanation: "বীরশ্রেষ্ঠ মুক্তিযুদ্ধের সর্বোচ্চ খেতাব।" },
  ],
  "বেসিক পাইথন প্রোগ্রামিং": [
    { id: "q-py1", question: "Python-এ print ফাংশন দিয়ে কী করা হয়?", options: ["ইনপুট নেওয়া", "আউটপুট দেখানো", "লুপ চালানো", "ভেরিয়েবল তৈরি করা"], correctIndex: 1, explanation: "print() ফাংশন স্ক্রিনে আউটপুট দেখায়।" },
    { id: "q-py2", question: "Python-এ লিস্ট তৈরিতে কোন ব্র্যাকেট ব্যবহার হয়?", options: ["{ }", "( )", "[ ]", "< >"], correctIndex: 2, explanation: "Python লিস্ট square brackets [ ] দিয়ে তৈরি হয়।" },
    { id: "q-py3", question: "Python-এ for loop কিভাবে শুরু হয়?", options: ["for i in range(n):", "for(i=0;i<n;i++)", "loop i to n:", "repeat i n times:"], correctIndex: 0, explanation: "Python-এ for i in range(n): দিয়ে loop লেখা হয়।" },
  ],
  "IELTS কোর্স": [
    { id: "q-ielts1", question: "IELTS Writing Task 2 এ কত শব্দ লিখতে হয়?", options: ["কমপক্ষে 100", "কমপক্ষে 150", "কমপক্ষে 250", "কমপক্ষে 300"], correctIndex: 2, explanation: "Task 2 এর জন্য কমপক্ষে 250 words দরকার।" },
    { id: "q-ielts2", question: "IELTS Listening পরীক্ষায় কয়টি section থাকে?", options: ["2", "3", "4", "5"], correctIndex: 2, explanation: "Listening test এ 4টি section থাকে।" },
    { id: "q-ielts3", question: "IELTS Band Score এর সর্বোচ্চ মান কত?", options: ["7", "8", "9", "10"], correctIndex: 2, explanation: "IELTS-এর সর্বোচ্চ Band Score হলো 9।" },
  ],
  "ঘরে বসে Spoken English": [
    { id: "q-spk1", question: "'I am going to the market' — এটি কোন Tense?", options: ["Simple Present", "Present Continuous", "Past Simple", "Future Simple"], correctIndex: 1, explanation: "'am going' হলো Present Continuous Tense।" },
    { id: "q-spk2", question: "Fluency বাড়াতে সবচেয়ে কার্যকর পদ্ধতি কোনটি?", options: ["শুধু Grammar পড়া", "প্রতিদিন Speaking Practice", "শুধু Vocabulary মুখস্থ করা", "Translation করা"], correctIndex: 1, explanation: "নিয়মিত Speaking Practice-ই fluency বাড়ানোর সেরা উপায়।" },
  ],
  "IELTS LIVE ব্যাচ": [
    { id: "q-live1", question: "IELTS Speaking পরীক্ষায় কয়টি Part থাকে?", options: ["1", "2", "3", "4"], correctIndex: 2, explanation: "IELTS Speaking-এ Part 1, 2 ও 3 থাকে।" },
    { id: "q-live2", question: "Band 7 পেতে Writing Task 2-এ কোন বিষয়ে মনোযোগ দেওয়া জরুরি?", options: ["শুধু শব্দ সংখ্যা", "Task Response ও Coherence", "শুধু Vocabulary", "Handwriting"], correctIndex: 1, explanation: "Task Response ও Coherence Band 7+ পেতে সবচেয়ে গুরুত্বপূর্ণ।" },
  ],
  "জুনিয়র Spoken English": [
    { id: "q-jun1", question: "'Apple' শব্দটির বাংলা অর্থ কী?", options: ["কমলা", "আপেল", "আম", "কলা"], correctIndex: 1, explanation: "Apple = আপেল।" },
    { id: "q-jun2", question: "'I have a cat' — এখানে 'have' কোন ধরনের শব্দ?", options: ["Noun", "Adjective", "Verb", "Adverb"], correctIndex: 2, explanation: "'have' এখানে Verb হিসেবে ব্যবহৃত হয়েছে।" },
  ],
};


export const CLASS_LEADERBOARD: LeaderboardEntry[] = [
  // শ্রেণি ১২
  { name: "করিম উদ্দিন",      classLabel: "শ্রেণি ১২",  score: 95, quizzes: 12, streak: 17, badge: "Gold" },
  { name: "রাকিব হাসান",      classLabel: "শ্রেণি ১২",  score: 88, quizzes: 10, streak: 12, badge: "Silver" },
  { name: "জারা আহমেদ",       classLabel: "শ্রেণি ১২",  score: 82, quizzes: 9,  streak: 8,  badge: "Bronze" },
  
  // শ্রেণি ১১
  { name: "তানভীর আহমেদ",    classLabel: "শ্রেণি ১১",  score: 94, quizzes: 11, streak: 15, badge: "Gold" },
  { name: "সাদিয়া ইসলাম",     classLabel: "শ্রেণি ১১",  score: 86, quizzes: 9,  streak: 10, badge: "Silver" },
  { name: "ফাহিম মুনতাসির",    classLabel: "শ্রেণি ১১",  score: 79, quizzes: 8,  streak: 6,  badge: "Bronze" },

  // শ্রেণি ১০
  { name: "আহমেদ হোসেন",      classLabel: "শ্রেণি ১০",  score: 96, quizzes: 13, streak: 20, badge: "Gold" },
  { name: "নাজমুল হক",       classLabel: "শ্রেণি ১০",  score: 89, quizzes: 11, streak: 14, badge: "Silver" },
  { name: "মিম আক্তার",       classLabel: "শ্রেণি ১০",  score: 81, quizzes: 9,  streak: 7,  badge: "Bronze" },

  // শ্রেণি ৯
  { name: "ইমরান হোসেন",      classLabel: "শ্রেণি ৯",   score: 92, quizzes: 10, streak: 16, badge: "Gold" },
  { name: "রাইসা ইসলাম",      classLabel: "শ্রেণি ৯",   score: 85, quizzes: 8,  streak: 11, badge: "Silver" },
  { name: "অপু বিশ্বাস",       classLabel: "শ্রেণি ৯",   score: 77, quizzes: 7,  streak: 5,  badge: "Bronze" },

  // শ্রেণি ৮
  { name: "সাইফুল ইসলাম",    classLabel: "শ্রেণি ৮",   score: 90, quizzes: 12, streak: 14, badge: "Gold" },
  { name: "নুসরাত জাহান",     classLabel: "শ্রেণি ৮",   score: 84, quizzes: 9,  streak: 10, badge: "Silver" },
  { name: "হৃদয় খান",         classLabel: "শ্রেণি ৮",   score: 76, quizzes: 7,  streak: 4,  badge: "Bronze" },

  // শ্রেণি ৭
  { name: "ফারহানা ইসলাম",   classLabel: "শ্রেণি ৭",   score: 93, quizzes: 11, streak: 18, badge: "Gold" },
  { name: "তাসনিম আক্তার",    classLabel: "শ্রেণি ৭",   score: 87, quizzes: 9,  streak: 12, badge: "Silver" },
  { name: "জুবায়ের আহমেদ",    classLabel: "শ্রেণি ৭",   score: 78, quizzes: 8,  streak: 6,  badge: "Bronze" },

  // শ্রেণি ৬
  { name: "নুসরাত ফারিয়া",     classLabel: "শ্রেণি ৬",   score: 91, quizzes: 10, streak: 14, badge: "Gold" },
  { name: "সাকিব আল হাসান",   classLabel: "শ্রেণি ৬",   score: 85, quizzes: 9,  streak: 9,  badge: "Silver" },
  { name: "মারুফ হোসেন",      classLabel: "শ্রেণি ৬",   score: 74, quizzes: 6,  streak: 3,  badge: "Bronze" },

  // শ্রেণি ৫
  { name: "মাহমুদা বেগম",     classLabel: "শ্রেণি ৫",   score: 89, quizzes: 11, streak: 13, badge: "Gold" },
  { name: "তাহসিন আহমেদ",    classLabel: "শ্রেণি ৫",   score: 83, quizzes: 8,  streak: 8,  badge: "Silver" },
  { name: "লামিয়া আক্তার",    classLabel: "শ্রেণি ৫",   score: 75, quizzes: 7,  streak: 5,  badge: "Bronze" },

  // শ্রেণি ৪
  { name: "আরিফ হোসেন",      classLabel: "শ্রেণি ৪",   score: 92, quizzes: 12, streak: 15, badge: "Gold" },
  { name: "সাবিহা রহমান",     classLabel: "শ্রেণি ৪",   score: 86, quizzes: 9,  streak: 11, badge: "Silver" },
  { name: "রনি শেখ",         classLabel: "শ্রেণি ৪",   score: 77, quizzes: 7,  streak: 6,  badge: "Bronze" },

  // শ্রেণি ৩
  { name: "সুমাইয়া খান",      classLabel: "শ্রেণি ৩",   score: 95, quizzes: 14, streak: 19, badge: "Gold" },
  { name: "আবরার জাহিদ",     classLabel: "শ্রেণি ৩",   score: 88, quizzes: 10, streak: 12, badge: "Silver" },
  { name: "তাবাসসুম মীম",    classLabel: "শ্রেণি ৩",   score: 80, quizzes: 8,  streak: 7,  badge: "Bronze" },

  // শ্রেণি ২
  { name: "মোশাররফ মিয়া",    classLabel: "শ্রেণি ২",   score: 94, quizzes: 11, streak: 16, badge: "Gold" },
  { name: "ফাতেমা তুজ জোহরা", classLabel: "শ্রেণি ২",   score: 87, quizzes: 9,  streak: 10, badge: "Silver" },
  { name: "সিয়াম আহমেদ",     classLabel: "শ্রেণি ২",   score: 79, quizzes: 7,  streak: 5,  badge: "Bronze" },

  // শ্রেণি ১
  { name: "আলিফা ইসলাম",      classLabel: "শ্রেণি ১",   score: 96, quizzes: 15, streak: 22, badge: "Gold" },
  { name: "আরিয়ান আহমেদ",    classLabel: "শ্রেণি ১",   score: 89, quizzes: 11, streak: 13, badge: "Silver" },
  { name: "সুমি আক্তার",       classLabel: "শ্রেণি ১",   score: 81, quizzes: 8,  streak: 6,  badge: "Bronze" },
];

export const SKILLS_LEADERBOARD: LeaderboardEntry[] = [
  { name: "রাহেলা পারভীন",    classLabel: "স্কিলস",     score: 98, quizzes: 14, streak: 21, badge: "Gold" },
  { name: "নাফিসা আক্তার",    classLabel: "স্কিলস",     score: 82, quizzes: 9,  streak: 6,  badge: "Silver" },
  { name: "জাহিদ হাসান",      classLabel: "স্কিলস",     score: 88, quizzes: 10, streak: 12, badge: "Gold" },
  { name: "মেহেদী হাসান",     classLabel: "স্কিলস",     score: 85, quizzes: 8,  streak: 9,  badge: "Silver" },
  { name: "সাদিয়া আফরিন",    classLabel: "স্কিলস",     score: 79, quizzes: 7,  streak: 5,  badge: "Bronze" },
  { name: "মনিরুল ইসলাম",     classLabel: "স্কিলস",     score: 75, quizzes: 6,  streak: 4,  badge: "Bronze" },
];

export const classRouteFromLabel = (label: string): string => {
  return CLASS_ID_BY_LABEL[label] ?? "class-1";
};

export const skillRouteFromTitle = (title: string): string => {
  return SKILL_ID_BY_TITLE[title] ?? "ielts-course";
};
