export interface CategoryItem {
  id: string;
  label: string;
  desc: string;
  iconName: string;
}

export interface Scheme {
  id: string;
  title: string;
  titleEn: string;
  category: "women" | "students" | "farmers" | "senior" | "workers";
  categoryName: string;
  description: string;
  benefits: string;
  eligibility: string;
  documents: string[];
  officialUrl: string;
  isPopular?: boolean;
  logoUrl?: string;
}

export interface Job {
  id: string;
  title: string;
  subtitle: string;
  category: "ssc" | "railway" | "banking" | "defence" | "wbpsc" | "police" | "private" | "internship";
  categoryName: string;
  vacancy: string;
  qualification: string;
  lastDate: string;
  officialUrl: string;
  salary?: string;
  isPopular?: boolean;
  logoUrl?: string;
}

export interface Scholarship {
  id: string;
  title: string;
  amount: string;
  eligibility: string;
  lastDate: string;
  officialUrl: string;
  description: string;
  logoUrl?: string;
}

export interface ServiceItemSubLink {
  label: string;
  url: string;
  desc: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  subtitle?: string;
  category: "identity" | "utility" | "health" | "jobs" | "scholarships" | "welfare" | "land" | "aadhaar_pan" | "certificates" | string;
  categoryName: string;
  badge?: string;
  btnText?: string;
  description: string;
  steps: string[];
  officialUrl: string;
  logoUrl?: string;
  subLinks?: ServiceItemSubLink[];
}

export interface AppUpdate {
  id: string;
  title: string;
  date: string;
  category: "Scheme" | "Job" | "Scholarship" | "General";
  url?: string;
}

export interface Suggestion {
  id: string;
  name?: string;
  mobile?: string;
  type: "difficulty" | "feature" | "other" | string;
  text: string;
  created_at: string;
  status: "pending" | "resolved" | "ignored" | string;
  adminNotes?: string;
}

export const INITIAL_SCHEMES: Scheme[] = [
  {
    id: "s1",
    title: "Lakshmir Bhandar Portal",
    titleEn: "Lakshmir Bhandar Scheme",
    category: "women",
    categoryName: "মহিলা ও শিশু কল্যাণ",
    description: "পশ্চিমবঙ্গ সরকারের একটি সফল প্রকল্প যা প্রতিটি সাধারণ পরিবারের উপার্জনকারী মহিলাদের এবং সুবিধাবঞ্চিত নারীদের আর্থিক সুরক্ষা প্রদান করতে মাসিক লিকুইড ক্যাশ অনুদান দেয়।",
    benefits: "সাধারণ ক্যাটাগরির মহিলাদের প্রতি মাসে ১,০০০ টাকা এবং তপশিলি জাতি (SC) ও তপশিলি উপজাতি (ST) সম্প্রদায়ভুক্ত মহিলাদের প্রতি মাসে ১,২০০ টাকা সরাসরি ব্যাংক অ্যাকাউন্টে প্রদান করা হয়।",
    eligibility: "পশ্চিমবঙ্গের স্থায়ী বাসিন্দা হতে হবে, বয়স ২৫ থেকে ৬০ বছরের মধ্যে হতে হবে এবং পরিবারের যেকোনো একজন মহিলার ব্যাংক অ্যাকাউন্ট থাকতে হবে। সরকারি স্থায়ী কর্মী হলে চলবে না।",
    documents: [
      "স্বাস্থ্য সাথী কার্ড (Swasthya Sathi Card)",
      "আধার কার্ড (Aadhaar Card)",
      "জাতিগত শংসাপত্র (SC/ST Certificate - যদি প্রযোজ্য হয়)",
      "ব্যাংক পাসবই এর প্রথম পাতা বা ক্যানসেলড চেক",
      "রঙিন পাসপোর্ট সাইজ ছবি"
    ],
    officialUrl: "https://socialsecurity.wb.gov.in/",
    isPopular: true
  },
  {
    id: "s2",
    title: "Krishak Bandhu Scheme",
    titleEn: "Krishak Bandhu Scheme",
    category: "farmers",
    categoryName: "কৃষক কল্যাণ",
    description: "রাজ্যের কৃষকদের চাষের জন্য সার, বীজ সংগ্রহ এবং আনুষাঙ্গিক খরচের লক্ষ্যে খরিফ ও রবি মরশুমের আগে প্রত্যক্ষ আর্থিক সাহায্য ও দুর্ঘটনাজনিত বিমা কভারেজ প্রদান করা হয়।",
    benefits: "সর্বোচ্চ ১০,০০০ টাকা বার্ষিক অনুদান (দুটি কিস্তিতে) এবং ন্যূনতম ৪,০০০ টাকা প্রতি বছর। এছাড়াও ১৮-৬০ বছর বয়সের কৃষকদের মৃত্যুতে ২ লক্ষ টাকা জীবন বিমা সুবিধা প্রদান করা হয় পরিবারের পাশে দাঁড়াতে।",
    eligibility: "আবেদনকারীকে পশ্চিমবঙ্গের কৃষক বা নথিবদ্ধ ভাগচাষী হতে হবে। জমির পরিমাণ অনুযায়ী অনুদান নির্ধারিত হয়।",
    documents: [
      "জমির নতুন পর্চা বা খতিয়ান নং",
      "আধার কার্ড এবং ভোটার কার্ড",
      "ব্যাংক একাউন্ট সম্পর্কিত তথ্য ও পাসবই",
      "রজিস্টার্ড কৃষক বন্ধু অ্যাকাউন্ট ফর্ম"
    ],
    officialUrl: "https://krishakbandhu.wb.gov.in/",
    isPopular: true
  },
  {
    id: "s3",
    title: "Swasthya Sathi Card Portal",
    titleEn: "Swasthya Sathi Scheme",
    category: "senior",
    categoryName: "পরিবার ও প্রবীণ কল্যাণ",
    description: "রাজ্যের সাধারণ মানুষের বিনামূল্যে আধুনিক চিকিৎসা পরিষেবা নিশ্চিত করতে সরকারি স্বাস্থ্য বিমা সুবিধা প্রকল্প। পরিবারের মহিলা কর্ত্রীর নামে কার্ড ইস্যু করা হয়।",
    benefits: "প্রতি পরিবারে বাৎসরিক ৫ লক্ষ টাকা পর্যন্ত ক্যাশলেস ইনডোর ও হসপিটালাইজেশন চিকিৎসার সুযোগ পাওয়া যায় পশ্চিমবঙ্গের বিভিন্ন সরকারি ও অনুমোদিত বেসরকারি হাসপাতালে।",
    eligibility: "পরিবারের কোনো সদস্য সঙ্ঘবদ্ধ সরকারি বিমা বা সরকারি চাকরিজীবী না হলে সকলেই এর সুবিধা পাবেন।",
    documents: [
      "পরিবারের সকলের আধার কার্ড বিশদ বিবরণ",
      "মোবাইল নম্বর",
      "রেশন কার্ড কপি",
      "আবেদন ফর্ম-বি বা ফর্ম-এ"
    ],
    officialUrl: "https://swasthyasathi.gov.in/",
    isPopular: true
  },
  {
    id: "s4",
    title: "Student Credit Card Scheme",
    titleEn: "Student Credit Card Scheme",
    category: "students",
    categoryName: "শিক্ষার্থী কল্যাণ",
    description: "উচ্চশিক্ষার খরচ মেটানোর জন্য কোনো গ্যারান্টার ছাড়াই সহজ শর্তে ও ৪% সরল সুদে দীর্ঘস্থায়ী ঋণ পাওয়ার চমৎকার রাজ্য প্রকল্প।",
    benefits: "১০ লক্ষ টাকা পর্যন্ত সহজ শিক্ষার ঋণ সুবিধা, যা ১৫ বছরের মধ্যে পরিশোধ করার ছাড় দেওয়া হয়। কোর্স ফি, হোস্টেল চার্জ ও ল্যাপটপ-বই ক্রয়ের জন্য এই ঋণ ব্যবহার্য।",
    eligibility: "পশ্চিমবঙ্গে অন্তত ১০ বছর ধরে বসবাসকারী শিক্ষার্থীরা এবং সর্বোচ্চ ৪০ বছর বয়স পর্যন্ত আবেদন করতে পারবেন স্নাতক, স্নাতকোত্তর, পিএইচডি বা পেশাদার কোর্স করার জন্য।",
    documents: [
      "ছাত্র এবং কো-বোরোয়ার (অভিভাবক) আধার/প্যান বিবরণ",
      "কোর্সে ভর্তির রশিদ ও কোর্স ফি স্ট্রাকচার",
      "পরিবারের বার্ষিক আয়ের ঘোষণা",
      "ব্যাংক বিবরণী ও মোবাইল নম্বর"
    ],
    officialUrl: "https://wbscc.wb.gov.in/",
    isPopular: true
  },
  {
    id: "s5",
    title: "Kanyashree Portal (K1 / K2)",
    titleEn: "Kanyashree Prakalpa",
    category: "students",
    categoryName: "শিক্ষার্থী কল্যাণ",
    description: "মেয়েদের স্কুলছুট বন্ধ করা ও বাল্যবিবাহ রোখার উদ্দেশ্যে এই বিশ্বখ্যাত প্রকল্প যাতে পড়াশোনা চালিয়ে যাওয়ার জন্য আর্থিক উৎসাহ দেওয়া হয়।",
    benefits: "কে-১ (বার্ষিক ১,০০০ টাকা অনুদান ১৩-১৮ বছর বয়সী অবিবাহিত ছাত্রীদের জন্য) এবং কে-২ (অষ্টাদশ বর্ষে উন্নীত ছাত্রীদের এককালীন ২৫,০০০ টাকা অনুদান যদি তারা পড়াশোনা চালিয়ে যান)।",
    eligibility: "পশ্চিমবঙ্গের সরকারি বা সরকার-পোষিত স্কুলে পঠন-পাঠনরত ৮ম শ্রেণী থেকে ১২শ শ্রেণীর সব ছাত্রী এবং বয়স ১৩ উর্ধ্ব হতে হবে।",
    documents: [
      "আবেদনকারী ছাত্রীর একক ব্যাংক সেভিংস একাউন্ট",
      "অবিবাহিত অবস্থার স্বঘোষণা পত্র",
      "বিদ্যালয় প্রধানের ভেরিফিকেশন সার্টিফিকেট",
      "আধার কার্ড এবং জন্ম নথিপত্র"
    ],
    officialUrl: "https://www.wbkanyashree.gov.in/",
    isPopular: true
  },
  {
    id: "s6",
    title: "Rupashree Portal",
    titleEn: "Rupashree Prakalpa",
    category: "women",
    categoryName: "মহিলা কল্যাণ",
    description: "দরিদ্র পরিবারের মেয়েদের বিয়ের খরচ জোগাতে এককালীন আর্থিক অনুদান প্রদানের রাজ্য সরকারি জনপ্রিয় প্রকল্প।",
    benefits: "যেকোনো ধর্মের পাত্রী বিয়ের সময় এককালীন ২৫,০০০ টাকা সরাসরি নিজের ব্যাংক অ্যাকাউন্টে রাজ্য সাহায্য হিসেবে পেয়ে থাকেন।",
    eligibility: "মেয়ের বয়স ১৮ বছরের বেশি ও পাত্রের বয়স ২১ বছর হতে হবে। পরিবারের বার্ষিক আয় ১.৫ লক্ষ টাকার নিচে হতে হবে এবং মেয়ের আবেদন বিয়ের ন্যূনতম ১ মাস পূর্বে জড়া করতে হবে।",
    documents: [
      "মেয়ের ও হবু বরের বয়স প্রমাণের নথি (জন্ম সনদ/মাধ্যমিক অ্যাডমিট কার্ড)",
      "স্বঘোষিত অবিবাহিত ও বিয়ের ও প্রস্তাবিত বিয়ের স্থান প্রমাণ",
      "পারিবারিক বার্ষিক আয় সার্টিফিকেট",
      "ব্যাংক পাসবুক ও উভয় পক্ষের ছবি"
    ],
    officialUrl: "https://www.wbrupashree.gov.in/",
    isPopular: true
  },
  {
    id: "s7",
    title: "Old Age Pension Scheme",
    titleEn: "Old Age Pension Scheme",
    category: "senior",
    categoryName: "প্রবীণ কল্যাণ",
    description: "পশ্চিমবঙ্গের প্রবীণ ও বয়স্ক নাগরিকদের সামাজিক মর্যাদা ও আর্থিক নিরাপত্তা সুনিশ্চিত করার লক্ষ্যে এই মাসিক সামাজিক সুরক্ষা পেনশন চালু করা হয়েছে।",
    benefits: "প্রতি মাসে ১,০০০ টাকা সরাসরি প্রবীণ আবেদনকারীর নিজস্ব ব্যাংক অ্যাকাউন্টে রাজ্য ব্যাংক ট্র্যান্সফার সুবিধা দ্বারা পাঠানো হয়।",
    eligibility: "বয়স ৬০ বছর বা তার বেশি হতে হবে, পশ্চিমবঙ্গের স্থায়ী বাসিন্দা হতে হবে এবং কোনো সরকারি চাকরি বা অন্য বড় উৎস থেকে পেনশনভোগী হলে আবেদন করতে পারবেন না।",
    documents: [
      "আধার কার্ড এবং ভোটার কার্ড প্রবীণ প্রমাণের জন্য",
      "আয়ের শংসাপত্র (লোকাল মিউনিসিপ্যালিটি বা পঞ্চায়েত প্রধান থেকে)",
      "তপশিলি জাতিভুক্ত সার্টিফিকেট যদি প্রযোজ্য হয়",
      "আবেদনকারীর ব্যাংক সেভিংস একাউন্ট ও পাসপোর্ট ছবি"
    ],
    officialUrl: "https://jaibangla.wb.gov.in/",
    isPopular: false
  },
  {
    id: "s8",
    title: "Samajik Suraksha Yojana (BM-SSY)",
    titleEn: "Bina Mulya Samajik Suraksha Yojana",
    category: "workers",
    categoryName: "শ্রমিক কল্যাণ",
    description: "অসংগঠিত ক্ষেত্রের শ্রমিকদের সামাজিক নিরাপত্তা ও বার্ধক্য পেনশন নিশ্চিত করতে রাজ্য সরকারের বিনামূল্যে তহবিল চালনার সামাজিক প্রকল্প।",
    benefits: "বার্ধক্যে ৬০ বছর বয়সে পৌঁছানোর পর সুদসহ ট্রাস্ট সঞ্চয় ফেরত পাওয়া যায়। দুর্ঘটনার সম্মুখীন হলে চিকিৎসা ভাতা ও পরিবারের জন্য সর্বোচ্চ ২ লক্ষ টাকা অনুদান রয়েছে।",
    eligibility: "অসংগঠিত ক্ষেত্র ও দিনমজুর শ্রমিকদের জন্য, বয়স ১৮ থেকে ৬০ বছরের নিচে এবং পশ্চিমবঙ্গের স্থায়ী বাসিন্দা হওয়া আবশ্যক।",
    documents: [
      "আধার কার্ড এবং ভোটার কার্ড",
      "পেশা ও আয়গত স্বঘোষণা পত্র",
      "ব্যাংক অ্যাকাউন্ট বিবরন",
      "নির্মাণ কর্মী বা দিনমজুর হিসেবে স্থানীয় পঞ্চায়েত/মিউনিসিপ্যালিটি শংসাপত্র"
    ],
    officialUrl: "https://bmssy.wblabour.gov.in/",
    isPopular: false
  }
];

export const SERVICES_DATA: ServiceItem[] = [
  // West Bengal Cards & Core Documents (identity)
  {
    id: "srv1",
    title: "Aadhaar Services",
    subtitle: "Aadhaar Card",
    category: "identity",
    categoryName: "পরিচয় ও কার্ড",
    badge: "UIDAI",
    btnText: "আধার সেবা",
    description: "আধার কার্ড ভারতীয় নাগরিকদের অন্যতম প্রধান পরিচয়পত্র। নতুন কার্ড আবেদন বা বায়োমেট্রিক ও নাম ঠিকানা আপডেট করার অফিসিয়াল সেবা পোর্টাল।",
    steps: [
      "'My Aadhaar' পোর্টালে ভিজিট করুন।",
      "আধার কেন্দ্র অ্যাপয়েন্টমেন্ট বুকিং সম্পন্ন করুন বা বায়োমেট্রিক স্লট বেছে নিন।",
      "প্রয়োজনীয় নথি যেমন পরিচয় ও ঠিকানার প্রমাণপত্র নিয়ে কেন্দ্রে যান।",
      "বাচ্চাদের ক্ষেত্রে ৫ ও ১৫ বছর বয়সে বাধ্যতামুলক বায়োমেট্রিক আপডেট করান।"
    ],
    officialUrl: "https://uidai.gov.in/"
  },
  {
    id: "srv2",
    title: "PAN Card",
    subtitle: "PAN Card Registration",
    category: "identity",
    categoryName: "পরিচয় ও কার্ড",
    badge: "Income Tax",
    btnText: "প্যান সেবা",
    description: "ব্যাংকিং ও ট্যাক্স লেনদেনের জন্য ই-প্যান বা ফিজিক্যাল প্যান কার্ড নতুন আবেদন বা বিবরণী সংশোধন প্রসেস পোর্টাল।",
    steps: [
      "অনলাইন NSDL/UTIITSL প্যান পোর্টালে ফর্ম ৪৯এ (Form 49A) সিলেক্ট করুন।",
      "আপনার সঠিক আধার কার্ড অনুযায়ী নাম, জন্মতারিখ ও পিতা লিখুন।",
      "আধার ওটিপির মাধ্যমে ই-কেওয়াইসি সম্পন্ন করুন সম্পূর্ণ ডিজিটাল পদ্ধতিতে।",
      "ডিজিটাল প্যান কয়েক ঘণ্টার মধ্যেই ইমেইলে চলে আসবে, ফিজিক্যাল কার্ড পোস্ট অফ থ্রু আসবে।"
    ],
    officialUrl: "https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html"
  },
  {
    id: "srv7",
    title: "Voter Services",
    subtitle: "Voter Card / e-EPIC",
    category: "identity",
    categoryName: "পরিচয় ও কার্ড",
    badge: "ECI India",
    btnText: "ভোটার পোর্টাল",
    description: "জাতীয় ভোটার সেবা পোর্টালে নতুন ভোটার নাম নথিভুক্তকরণ, নাম সংশোধন বা ডিজিটাল ভোটার কার্ড ডাউনলোড প্রসেস।",
    steps: [
      "ভারতের নির্বাচন কমিশন ভোটার সার্ভিস পোর্টালে (voters.eci.gov.in) সাইন ইন করুন।",
      "নতুন ভোটারের জন্য ফর্ম-৬ বা সংশোধনের জন্য ফর্ম-৮ পূরণ করুন।",
      "বয়স ও ঠিকানার প্রমাণপত্র স্ক্যান করে আপলোড করুন।",
      "অনুমোদনের পর বিএলও আপনার বাড়িতে গিয়ে ডিজিটাল ভোটার কার্ড ডেলিভারি করে দেবে।"
    ],
    officialUrl: "https://voters.eci.gov.in/"
  },
  {
    id: "srv8",
    title: "Ration Card Services",
    subtitle: "Ration Card (Khadya)",
    category: "identity",
    categoryName: "পরিচয় ও কার্ড",
    badge: "Khadya Sathi",
    btnText: "খাদ্যসাথী",
    description: "পশ্চিমবঙ্গ খাদ্য ও সরবরাহ মন্ত্রকের অধীনে ডিজিটাল রেশন কার্ড স্ট্যাটাস, মোবাইল লিঙ্কিং ও দোকান বদলের পোর্টাল।",
    steps: [
      "খাদ্যের দপ্তরের অফিসিয়াল পোর্টালে গিয়ে 'Citizen Card Status' ট্যাব খুলুন।",
      "আধার কার্ড সংযুক্ত করতে 'Link Aadhaar with Ration Card' নির্বাচন করুন।",
      "ওটিপি দিয়ে মেম্বার ট্রান্সফার বা নতুন সদস্যের আবেদন সম্পূর্ণ করুন।",
      "প্রয়োজনীয় ই-রেশন কার্ড ডাউনলোড করে তৎক্ষণাৎ চাল-গম তুলুন বিনা মূল্যে।"
    ],
    officialUrl: "https://food.wb.gov.in/"
  },
  {
    id: "srv9",
    title: "Passport Seva",
    subtitle: "Passport Services",
    category: "identity",
    categoryName: "পরিচয় ও কার্ড",
    badge: "Govt of India",
    btnText: "পাসপোর্ট পোর্টাল",
    description: "সহজ পদ্ধতিতে অনলাইন পোর্টালের মাধ্যমে নতুন পাসপোর্ট আবেদন ও নিকটবর্তী পাসপোর্ট সেবা কেন্দ্রে অ্যাপয়েন্টমেন্ট বুকিং গাইড।",
    steps: [
      "ভারতের পাসপোর্ট সেবা পোর্টালে নতুন ইউজার রেজিস্ট্রেশন করুন।",
      "Fresh Passport ফর্ম পূরণ করে ব্যক্তিগত ও ঠিকানার বিবরণ খতিয়ে জমা দিন।",
      "অ্যাপয়েন্টমেন্ট স্লট পছন্দ করে অনলাইন পেমেন্ট সম্পন্ন করুন।",
      "রিসিভ কপি নিয়ে পাসপোর্ট অফিসে ডকুমেন্ট স্ক্রিনিং করান ও police ভেরিফিকেশন ফেস করুন।"
    ],
    officialUrl: "https://www.passportindia.gov.in/"
  },
  {
    id: "srv10",
    title: "Driving Licence",
    subtitle: "Driving License",
    category: "identity",
    categoryName: "পরিচয় ও কার্ড",
    badge: "Sarathi PM",
    btnText: "পরিবহন লাইসেন্স",
    description: "লার্নার্স লাইসেন্স টেস্ট এবং স্থায়ী ড্রাইভিং লাইসেন্স অ্যাপয়েন্টমেন্ট প্রক্রিয়া সম্পন্ন করুন সম্পূর্ণ ডিজিটালভাবে আরটিও বা আরটিআই সেবায়।",
    steps: [
      "সারথি পরিবহন সেবা পোর্টালে গিয়ে রাজ্য 'West Bengal' সিলেক্ট করুন।",
      "'Apply for Learner's Licence' ক্লিক করে আধার ই-কেওয়াইসি সম্পন্ন করুন।",
      "ঘরে বসেই অনলাইনে লার্নার টেস্ট দিয়ে শংসাপত্র ডাউনলোড করুন।",
      "স্থায়ী লাইসেন্সের জন্য RTO ড্রাইভিং ট্রায়াল বুক করুন ও পাস করলেই কার্ড পান।"
    ],
    officialUrl: "https://sarathi.parivahan.gov.in/"
  },
  
  // West Bengal Certificates (utility)
  {
    id: "srv3",
    title: "Birth Certificate",
    subtitle: "Birth Certificate",
    category: "utility",
    categoryName: "শংসাপত্র",
    badge: "Govt of WB",
    btnText: "জন্ম তথ্য",
    description: "পশ্চিমবঙ্গে জন্মগ্রহণকারী শিশুদের বা পুরোনো নাগরিকদের জন্য ডিজিটালভাবে বার্থ সার্টিফিকেট ডিরেক্ট আবেদন ও ডাউনলোডের পোর্টাল।",
    steps: [
      "'জন্ম-মৃত্যু তথ্য' পোর্টাল (janma-mrityutathya.wb.gov.in) ভিজিট করুন।",
      "সিটিজেন ট্যাব থেকে 'Birth' এবং 'Apply for New Application' ক্লিক করুন।",
      "শিশুর জন্ম ও হাসপাতাল রিলিজ স্লিপের স্ক্যান কপি আপলোড করুন।",
      "অ্যাপ্রুভ হওয়ার পর একই পোর্টাল থেকে ডিজিটাল শংসাপত্র ডাউনলোড করুন।"
    ],
    officialUrl: "https://janma-mrityutathya.wb.gov.in/"
  },
  {
    id: "srv4",
    title: "Caste Certificate",
    subtitle: "Caste Certificate",
    category: "utility",
    categoryName: "শংসাপত্র",
    badge: "Kalyan Dept",
    btnText: "কাস্ট সার্টিফিকেট",
    description: "পশ্চিমবঙ্গে তপশিলি জাতি (SC), উপজাতি (ST) এবং OBC শংসাপত্র পাওয়ার ব্যাকওয়ার্ড ক্লাসেস উন্নয়ন দপ্তরের পোর্টাল।",
    steps: [
      "ব্যাকওয়ার্ড ডেস্কে অ্যাপ্লিকেশন লিঙ্কে ক্লিক করে ফর্ম খুলুন।",
      "আবেদনকারীর শিক্ষাগত বিবরণ ও রক্তের সম্পর্কযুক্ত আত্মীয়ের কাস্ট কার্ডের বিবরণ দিন।",
      "ঠিকানা ও জাতি প্রমাণের স্বঘোষণাপত্র বা প্রধানের শংসাপত্র আপলোড করুন।",
      "SDO/BDO অফিসে হেয়ারিং শেষে সার্টিফিকেট ডিজিটালভাবে ডাউনলোড বা সংগ্রহ করুন।"
    ],
    officialUrl: "http://casterepresentationwb.gov.in/"
  },
  {
    id: "srv5",
    title: "Income Certificate",
    subtitle: "Income Certificate",
    category: "utility",
    categoryName: "শংসাপত্র",
    badge: "e-District",
    btnText: "ইনকাম গাইড",
    description: "স্কলারশিপের মেধা বা ঋণের জন্য পশ্চিমবঙ্গ ই-ডিস্ট্রিক্ট পোর্টাল ২.০ এর মাধ্যমে বিডিও (BDO) দ্বারা অনুমোদিত আয় শংসাপত্রের পোর্টাল।",
    steps: [
      "পশ্চিমবঙ্গ ই-ডিস্ট্রিক্ট পোর্টালে নিজের নাগরিক আইডি দিয়ে লগইন করুন।",
      "সার্ভিস লিস্ট থেকে 'Income Certificate' বিকল্প বেছে নিন।",
      "আবেদনকারীর আয়ের বিবরণী ও স্থানীয় প্রধান/মিউনিসিপ্যালিটি প্যাড আপলোড করুন।",
      "বিডিও ই-সাইন করার পর ৩ দিনের মাথায় ডিজিটাল বারকোড শংসাপত্র ডাউনলোড করুন।"
    ],
    officialUrl: "https://edistrict.wb.gov.in/"
  },
  {
    id: "srv11",
    title: "Death Certificate",
    subtitle: "Death Certificate",
    category: "utility",
    categoryName: "শংসাপত্র",
    badge: "Govt of WB",
    btnText: "ডেথ রেকর্ড",
    description: "পশ্চিমবঙ্গ সরকারের জন্ম-মৃত্যু তথ্য পোর্টাল ব্যবহার করে মৃত ব্যক্তির ডেথ সার্টিফিকেটের অনলাইন আবেদন ও ভেরিফিকেশন।",
    steps: [
      "'জন্ম-মৃত্যু তথ্য' পোর্টাল ওপেন করুন ও সিটিজেন সেকশন নির্বাচন করুন।",
      "'Death' সেগমেন্ট থেকে নতুন ডিজিটাল ডেথ রেজিস্ট্রি ফর্ম ফিল আপ করুন।",
      "হাসপাতাল বা শব্দদাহ প্রমাণের নথি আপলোড করুন।",
      "ডিজিটাল ভেরিফায়েড সই যুক্ত শংসাপত্র ফ্রিতে ডাউনলোড করুন।"
    ],
    officialUrl: "https://janma-mrityutathya.wb.gov.in/"
  },
  
  // West Bengal Government Jobs & Exams (jobs)
  {
    id: "job_psc",
    title: "West Bengal Government Jobs (WBPSC)",
    subtitle: "PSC Clerkship, Miscellaneous",
    category: "jobs",
    categoryName: "सरकारी नौकरी",
    badge: "WBPSC",
    btnText: "পিএসসি পোর্টাল",
    description: "পশ্চিমবঙ্গ পাবলিক সার্ভিস কমিশন দ্বারা গ্রুপ-সি, গ্রুপ-ডি, মিউনিসিপ্যাল, ক্লার্কশিপ ও সিভিল সার্ভিস নিয়োগ সংক্রান্ত অফিসিয়াল পোর্টাল।",
    steps: [
      "অফিসিয়াল WBPSC পোর্টালে (psc.wb.gov.in) ভিজিট করুন।",
      "নতুন ওটিআর (One Time Registration) সম্পন্ন করুন অথবা পুরোনো আইডি দিয়ে লগইন করুন।",
      "অ্যাক্টিভ নোটিফিকেশন থেকে ক্লাকশিপ বা ফুড এসআই বা মিসলেনিয়াস সিলেক্ট করে অ্যাপ্লিকেশন ফর্ম ফিলাপ করুন।",
      "নির্ভুলভাবে ছবি, স্বাক্ষর ও প্রামাণ্য নথিপত্র আপলোড করে সাবমিট করুন ও ফর্ম ডাউনলোড করুন।"
    ],
    officialUrl: "https://psc.wb.gov.in"
  },
  {
    id: "job_police",
    title: "WBP Recruitment Services",
    subtitle: "WBP Constable Recruit",
    category: "jobs",
    categoryName: "सरकारी नौकरी",
    badge: "WBPB",
    btnText: "police নিয়োগ",
    description: "পশ্চিমবঙ্গ পুলিশ রিক্রুটমেন্ট বোর্ড দ্বারা কনস্টেবল এবং সাব-ইন্সপেক্টর পদে সরাসরি পুরুষ এবং মহিলা প্রার্থী নিয়োগ আবেদন।",
    steps: [
      "পশ্চিমবঙ্গ পুলিশ রিক্রুটমেন্ট বোর্ড (prb.wb.gov.in) অফিশিয়াল ওয়েবপেজটি খুলুন।",
      "চলতি রিক্রুটমেন্ট ট্যাবে 'Apply Online' বাটনে ক্লিক করুন।",
      "ব্যক্তিগত তথ্য, শিক্ষাগত যোগ্যতা এবং পছন্দের পরীক্ষার জেলা সিলেক্ট করুন।",
      "পাসপোর্ট সাইজ রঙিন ছবি এবং স্বাক্ষর স্ক্যান করে আপলোড করুন ও সাবমিট করুন।"
    ],
    officialUrl: "https://prb.wb.gov.in"
  },
  {
    id: "job_tet",
    title: "Primary Teacher Eligibility Test (TET)",
    subtitle: "Primary Teacher Eligibility Test",
    category: "jobs",
    categoryName: "सरकारी नौकरी",
    badge: "WBBPE",
    btnText: "টেট আবেদন",
    description: "পশ্চিমবঙ্গ প্রাথমিক শিক্ষা পর্ষদ দ্বারা প্রাথমিকে শিক্ষক নিয়োগ সংক্রান্ত টেট শংসাপত্র ও সরাসরি বিজ্ঞপ্তির ফর্ম ফিলআপ।",
    steps: [
      "প্রাথমিক শিক্ষা পর্ষদের অফিশিয়াল সাইট (wbbprimaryeducation.org) খুলুন।",
      "'TET Query & Application' ট্যাবে গিয়ে আপনার মোবাইল ও আধার বিবরণ দিয়ে সাইন ইন করুন।",
      "আপনার শিক্ষকতার প্রশিক্ষণ (D.El.Ed / B.Ed) ও শিক্ষাগত শংসাপত্র কপি আপলোড করুন।",
      "আবেদন ফি অনলাইনে পেমেন্ট করে চূড়ান্ত ক্যানডিডেট কপি সংগ্রহে রাখুন।"
    ],
    officialUrl: "https://www.wbbprimaryeducation.org"
  },
  {
    id: "job_ssc",
    title: "School Service Commission (WBSSC)",
    subtitle: "Assistant Teacher & Group C/D",
    category: "jobs",
    categoryName: "सरकारी नौकरी",
    badge: "WBSSC",
    btnText: "এসএসসি পোর্টাল",
    description: "পশ্চিমবঙ্গ স্কুল সার্ভিস কমিশন দ্বারা রানিং স্কুলের মাধ্যমিক ও উচ্চ মাধ্যমিক স্তরে শিক্ষক ও শিক্ষাকর্মী নতুন নিয়োগ প্রক্রিয়ার পোর্টাল।",
    steps: [
      "স্কুল সার্ভিস কমিশন (westbengalssc.com) পোর্টাল খুলুন।",
      "নতুন নিয়োগ আবেদনের অনলাইন লিংকে ক্লিক করুন বা অ্যাডভার্টাইজ তালিকা বাছুন।",
      "রোল নম্বর ও রেজিস্ট্রেশন দিয়ে লগইন করে নির্দেশাবলী অনুযায়ী ফর্ম ফিলাপ করুন।",
      "আবেদন ফি সাবমিট করে চূড়ান্ত ডিক্লারেশন সাবমিট করে পৃষ্ঠা প্রিন্ট করে রাখুন।"
    ],
    officialUrl: "http://www.westbengalssc.com"
  },
  {
    id: "job_msc",
    title: "Municipal Service Commission (MSC)",
    subtitle: "Municipal Service Recruit",
    category: "jobs",
    categoryName: "सरकारी नौकरी",
    badge: "MSCWB",
    btnText: "পৌরসভা চাকরি",
    description: "কলকাতা পৌরনিগম ও রাজ্যের বিভিন্ন পৌরসভায় সাব-অ্যাসিস্ট্যান্ট ইঞ্জিনিয়ার, ক্লার্ক ও গ্রুপ-ডি পদের সরাসরি নিয়োগের তথ্য।",
    steps: [
      "পৌর নিয়োগ বোর্ড (mscwb.org) সাইটটি খুলুন।",
      "নতুন অ্যাকাউন্ট নিবন্ধন সম্পন্ন করে 'Apply online for active advertisements' ক্লিক করুন।",
      "আপনার শিক্ষাগত যোগ্যতা ও কাজের অভিজ্ঞতা সঠিক তথ্য দিয়ে ড্রাফট করুন ও নথিপত্র আপলোড করুন।",
      "অনলাইন নেট ব্যাংকিং বা ইউপিআই দিয়ে আবেদন ফি জমা করে পে স্লিপ এবং ফর্মটি ডাউনলোড করুন।"
    ],
    officialUrl: "https://www.mscwb.org"
  },
  {
    id: "job_health",
    title: "Health Recruitment Board (WBHRB)",
    subtitle: "WB Health Recruitment Board",
    category: "jobs",
    categoryName: "सरकारी नौकरी",
    badge: "WBHRB",
    btnText: "স্বাস্থ্য নিয়োগ",
    description: "পশ্চিমবঙ্গ স্বাস্থ্য ও পরিবার কল্যাণ দপ্তরের অধীনে ডাক্তার, স্টাফ নার্স, মেডিকেল টেকনিশিয়ান পদে সরাসরি বিজ্ঞপ্তির আবেদন পদ্ধতি।",
    steps: [
      "স্বাস্থ্য নিয়োগ বোর্ড (hrb.wb.gov.in) পোর্টালে ভিজিট করুন।",
      "ইমেইল ও মোবাইল দিয়ে পোর্টাল রেজিস্ট্রেশন সম্পন্ন করুন ও ওটিপি ভেরিফাই করুন।",
      "আপনার নার্সিং কাউন্সিল বা ওয়েস্ট বেঙ্গল ডেন্টাল কাউন্সিল সার্টিফিকেশন এবং শিক্ষাগত মার্কশিট আপলোড করুন।",
      "সব তথ্য পুনরায় ভেরিফাই করে অনলাইন সার্ভারে সাবমিট করুন ও প্রিন্টআউট নিন।"
    ],
    officialUrl: "https://www.hrb.wb.gov.in"
  },
  
  // Student Scholarships (scholarships)
  {
    id: "sc_svmcm",
    title: "Swami Vivekananda Scholarship (SVMCM)",
    subtitle: "SVMCM Merit Scholarship",
    category: "scholarships",
    categoryName: "স্কলারশিপ",
    badge: "WBHED",
    btnText: "SVMCM পোর্টাল",
    description: "মেধাবী শিক্ষার্থীদের জন্য পশ্চিমবঙ্গ উচ্চশিক্ষা দপ্তরের বাৎসরিক ১২,০০০ থেকে ৯৬,০০০ টাকার স্কলারশিপের ফর্ম ফিলাপ পোর্টাল।",
    steps: [
      "স্বামী বিবেকানন্দ পোর্টাল (svmcm.wbhed.gov.in) ওপেন করুন।",
      "Fresh Application ট্যাবে গিয়ে আধার ও সর্বশেষ বোর্ড পরীক্ষার মার্কশিট আপলোড করুন (৬০% নম্বর আবশ্যক)।",
      "পারিবারিক বার্ষিক আয়ের ঘোষণা ও ব্যাংক পাসবই কপি স্ক্যান করুন।",
      "প্রতিষ্ঠানের আইডি দিয়ে ভেরিফাই সম্পন্ন হলে সরাসরি ব্যাংক অ্যাকাউন্টে টাকা ঢুকবে।"
    ],
    officialUrl: "https://svmcm.wbhed.gov.in/"
  },
  {
    id: "sc_oasis",
    title: "OASIS Scholarship Portal",
    subtitle: "OASIS SC/ST/OBC Relief",
    category: "scholarships",
    categoryName: "স্কলারশিপ",
    badge: "BCW Dept",
    btnText: "ওএসিস পোর্টাল",
    description: "তপশিলি জাতি, উপজাতি এবং অনগ্রসর ছাত্রছাত্রীদের জন্য বাৎসরিক পোস্ট-মেট্রিক স্কলারশিপের ডিজিটাল আবেদন।",
    steps: [
      "ওএসিস স্কলারশিপ পোর্টাল (oasis.gov.in) ওপেন করে 'Student Registration' করুন।",
      "আপনার জেলা ও কাস্ট সার্টিফিকেটের নম্বর দিয়ে প্রোফাইল রেজিস্টার করুন।",
      "ইনституটিউট প্রোফাইল ও курс বিবরণ পূরণ করে আবেদন প্রিন্টআউট নিন।",
      "প্রিন্টআউট ও প্রয়োজনীয় প্রশংসাপত্র প্রতিষ্ঠানে ভেরিফিকেশনের জন্য জমা দিন।"
    ],
    officialUrl: "https://oasis.gov.in"
  },
  {
    id: "sc_aikyashree",
    title: "Aikyashree Scholarship Portal",
    subtitle: "Aikyashree Minorities",
    category: "scholarships",
    categoryName: "স্কলারশিপ",
    badge: "WBMDFC",
    btnText: "ঐক্যশ্রী পোর্টাল",
    description: "পশ্চিমবঙ্গের সংখ্যালঘু মুসলিম, শিখ, খ্রিস্টান, বৌদ্ধ ছাত্রছাত্রীদের জন্য ঐক্যশ্রী যোজনার অধীনে স্কলারশিপ পোর্টাল।",
    steps: [
      "WBMDFC স্কলারশিপ ওয়েবসাইটটিতে গিয়ে 'Minority Scholarship' সিলেক্ট করুন।",
      "শিক্ষা স্তর প্রাক-মেট্রিক বা পোস্ট-মেট্রিক অনুযায়ী ফর্ম সাবমিশন প্রক্রিয়া শুরু করুন।",
      "ব্যাংক একাউন্ট ডিটেলস ও আধার নম্বর ভেরিফাই করুন।",
      "ইনституটিউট লগইন ভেরিফাই করার পর আপনার একাউন্টে ডিরেক্ট টাকা পাঠানো হবে।"
    ],
    officialUrl: "https://wbmdfcscholarship.org/"
  },
  {
    id: "sc_nabanna",
    title: "Nabanna CM Relief Fund",
    subtitle: "Chief Minister's Relief Fund",
    category: "scholarships",
    categoryName: "স্কলারশিপ",
    badge: "WB Govt",
    btnText: "নবান্ন আবেদন",
    description: "পশ্চিমবঙ্গ সরকারের মুখ্যমন্ত্রী ত্রাণ তহবিল থেকে মেধাবী অসচ্ছল ছাত্রছাত্রীদের এককালীন ১০,০০০ টাকার আর্থিক সাহায্য।",
    steps: [
      "মুখ্যমন্ত্রী ত্রাণ তহবিল অফিসিয়াল অ্যাপ্লিকমেন্ট গাইডলাইন এ যান।",
      "আপনার পরিবারের বাৎসরিক আয়ের প্রশংসাপত্র ও বিধায়ক বা মন্ত্রীর রেকমেন্ডেশন লেটার আপলোড করুন।",
      " can নিজের ও অভিভাবকের আধার কার্ড সহ সর্বশেষ মার্কশিট সংযুক্ত করুন।",
      "অফিসিয়াল হার্ডকপি সরাসরি নবান্ন বা উত্তরণ ডেস্কে ব্যক্তিগত বা কুরিয়ারে জমা করতে হয়।"
    ],
    officialUrl: "https://wbcmo.gov.in"
  },
  
  // Social Welfare Schemes (welfare)
  {
    id: "s_lakshmir",
    title: "Lakshmir Bhandar Portal",
    subtitle: "Lakshmir Bhandar WB",
    category: "welfare",
    categoryName: "সরকারি প্রকল্প",
    badge: "WCD&SW",
    btnText: "লক্ষ্মীর ভাণ্ডার",
    description: "পশ্চিমবঙ্গ সরকারের অন্যতম জনপ্রিয় সামাজিক প্রকল্প যা উপার্জনকারী নারীদের প্রতি মাসে ১০০০ বা ১২০০ টাকা নগদ সাহায্য দিয়ে স্বাবলম্বী করে।",
    steps: [
      "দুয়ারে সরকার ক্যাম্প বা পঞ্চায়েত অফিস থেকে কুপন সংবলিত ইউনিক ফর্ম সংগ্রহ করুন।",
      "স্বাস্থ্য সাথী কার্ড, আধার কার্ড ও ব্যাংক পাসবুক জেরক্স দিয়ে ফর্মটি সুন্দরভাবে পূরণ করুন।",
      "বিডিও বা ক্যাম্প ভেরিফিকেশন অফিসারকে ফর্ম এবং নথি জমা করে প্রাপ্তি রসিদ (Acknowledgement) লিন।",
      "অনুমোদনের পর প্রতি মাসের ১-১০ তারিখের মধ্যে টাকা সরাসরি ব্যাংক একাউন্টে ঢুকে যাবে।"
    ],
    officialUrl: "https://socialsecurity.wb.gov.in/"
  },
  {
    id: "s_krishak",
    title: "Krishak Bandhu Scheme",
    subtitle: "Krishak Bandhu Financial Aid",
    category: "welfare",
    categoryName: "সরকারি প্রকল্প",
    badge: "Krishi Dept",
    btnText: "কৃষক বন্ধু",
    description: "পশ্চিমবঙ্গের কৃষকদের চাষাবাদের আর্থিক সাহায্য এবং ২ লক্ষ টাকার জীবন বিমা কভারেজ প্রদান করার কৃষি প্রকল্প।",
    steps: [
      "নিকটবর্তী কৃষি অধিকর্তা (ADAI) বা দুয়ারে সরকার ক্যাম্পে গিয়ে ফর্ম সংগ্রহ করুন।",
      "জমির বর্তমান পর্চা (খতিয়ান রেকর্ড), আধার, ভোটার ও ব্যাংক পাসবুক জেরক্স সংযুক্ত করুন।",
      "কৃষি আধিকারিক দ্বারা আপনার তথ্য নিবন্ধিত ও স্যাংশন সম্পন্ন করুন।",
      "খরিফ ও রবি মরশুমের পূর্বে দুটি কিস্তিতে টাকা অ্যাকাউন্টে জমা হবে।"
    ],
    officialUrl: "https://krishakbandhu.wb.gov.in/"
  },
  {
    id: "s_kanyashree",
    title: "Kanyashree Portal",
    subtitle: "Kanyashree Girl Support",
    category: "welfare",
    categoryName: "সরকারি প্রকল্প",
    badge: "WB Govt",
    btnText: "কন্যাশ্রী",
    description: "বাল্যবিবাহ রোখার উদ্দেশ্যে শিক্ষাপ্রতিষ্ঠানে পড়ুয়া ১৩-১৮ বছর মেয়েদের বাৎসরিক এবং ১৮ বছরে এককালীন ২৫,০০০ টাকার প্রকল্প।",
    steps: [
      "আপনার পড়তে থাকা বিদ্যালয় বা কলেজ অফিস থেকে কন্যাশ্রী ফর্ম এবং আইডি নম্বর সংগ্রহ করুন।",
      "ছাত্রীর নিজস্ব সিঙ্গেল ব্যাংক সেভিংস অ্যাকাউন্টের পাসবুক এবং আধার কার্ড ফটোকপি সংযুক্ত করুন।",
      "অবিাবাহিত থাকার স্বঘোষণাপত্র ও অভিভাবকের স্বাক্ষর সহ স্কুলে ফর্মটি জমা করুন।",
      "স্কুল প্রধান ফর্মটি অনলাইনে ভেরিফাই করলেই আপনার টাকা বরাদ্দ হবে।"
    ],
    officialUrl: "https://www.wbkanyashree.gov.in/"
  },
  {
    id: "s_rupashree",
    title: "Rupashree Portal",
    subtitle: "Rupashree Marriage Grant",
    category: "welfare",
    categoryName: "সরকারি প্রকল্প",
    badge: "Social Welfare",
    btnText: "রূপশ্রী গাইড",
    description: "দরিদ্র পরিবারের মেয়েদের বিয়ের খরচ মেটাতে পশ্চিমবঙ্গ সরকারের ২৫,০০০ টাকার এককালীন বিয়ের আগে আর্থিক সাহায্য।",
    steps: [
      "বিয়ের প্রস্তাবিত তারিখের ন্যূনতম ৩০ দিন আগে স্থানীয় বিডিও বা মিউনিসিপালিটি অফিসে ফর্ম জমা করতে হবে।",
      "মেয়ের বয়স ১৮+ ও বরের বয়স ২১+ প্রমাণপত্র (মাধ্যমিক অ্যাডমিট/বার্থ সার্টিফিকেট) জেরক্স যোগ করুন।",
      "বিয়ের কার্ড, প্রস্তাবিত বিয়ের স্থান প্রমাণ ও পারিবারিক আয়ের স্বঘোষণাপত্র দিন।",
      "যাচাইকরণ সফল হলে বিয়ের অন্তত ৫ দিন পূর্বে মেয়ের নিজস্ব ব্যাংক অ্যাকাউন্টে ২৫,০০০ টাকা ঢুকে যাবে।"
    ],
    officialUrl: "https://www.wbrupashree.gov.in/"
  },
  {
    id: "s_ssy",
    title: "Samajik Suraksha Yojana (BM-SSY)",
    subtitle: "Bina Mulya Samajik Suraksha",
    category: "welfare",
    categoryName: "সরকারি প্রকল্প",
    badge: "Labour Dept",
    btnText: "সামাজিক সুরক্ষা",
    description: "অসংগঠিত ক্ষেত্রের শ্রমিক, রিকশাচালক ও দিনমজুরদের ভবিষ্যৎ ক্যাশলেস চিকিৎসা এবং দুর্ঘটনা পেনশনের রাজ্য প্রকল্প।",
    steps: [
      "শ্রমিক কল্যাণ দপ্তরের পোর্টালে (bmssy.wblabour.gov.in) ভিজিট করুন।",
      "আপনার ভোটার কার্ড, আধার, রেশন কার্ড ও পেশাগত নামের স্বঘোষণা পত্র নিয়ে রেজিস্ট্রেশন করুন।",
      "নমিনিদের বিবরণ এবং একটি সচল ব্যাংক পাসবুকের ফ্রন্ট পেজের কপি আপলোড করুন।",
      "মিউনিসিপ্যালিটি বা পঞ্চায়েতের অনুমোদনের পর লেবার ওয়েলফেয়ার থেকে ই-কার্ড বা বই পেয়ে যাবেন।"
    ],
    officialUrl: "https://bmssy.wblabour.gov.in/"
  },

  // West Bengal Land Records (land)
  {
    id: "land_record",
    title: "Land Records (Banglarbhumi)",
    subtitle: "Banglarbhumi Land Records",
    category: "land",
    categoryName: "জমি ও পরচা",
    badge: "L&LR Dept",
    btnText: "বাংলারভূমি",
    description: "পশ্চিমবঙ্গ সরকারের ভূমি ও ভূমি সংস্কার দপ্তরের মাধ্যমে অনলাইনে রেকর্ড অফ রাইট বা খতিয়ান পরচা এবং আরএস-এলআর মাপ দেখা।",
    steps: [
      "বাংলারভূমি অফিসিয়াল পোর্টাল (banglarbhumi.gov.in) এ গিয়ে 'Know Your Property' খুলুন।",
      "আপনার সংশ্লিষ্ট জেলা, ব্লক এবং মৌজা সঠিক খতিয়ান নং বা দাগ নং দিয়ে সার্চ করুন।",
      "ক্যাপচা কোড এন্টার করে মুহূর্তেই পরচা ও জমির মিউটেশন বিবরণ দেখে নিন।",
      "সার্টিফায়েড ডিজিটাল কপি ডাউনলোড করতে আইডি ক্রিয়েট করে ন্যূনতম ফি পে করুন।"
    ],
    officialUrl: "https://banglarbhumi.gov.in/"
  },
  {
    id: "land_deed",
    title: "Land Deed Registration",
    subtitle: "Search & Register Deed",
    category: "land",
    categoryName: "জমি ও পরচা",
    badge: "Registration",
    btnText: "দলিল রেজিস্ট্রি",
    description: "জমির ফিজিক্যাল দলিলের মার্কেট ভ্যালু চেক এবং অনলাইনে ই-দলিল খোজা বা নতুন দলিল খসড়া তৈরি করা পোর্টাল।",
    steps: [
      "ডাইরেক্টরেট অফ রেজিস্ট্রেশন সার্ভিস (wbregistration.gov.in) পোর্টাল ওপেন করুন।",
      "'Market Value of Land' এ দাগ ও খতিয়ান দিয়ে জমির বর্তমান বাজারমূল্য জেনে নিন।",
      "নতুন ক্রয়ের ক্ষেত্রে ই-দলিল খসড়া সাবমিট করে স্ট্যাম্প ডিউটি হিসেব করতে পারেন।",
      "সম্পন্ন দলিলের সার্টিফায়েড অনুলিপি দেখতে 'Search Your Deed' অপশনে গিয়ে ক্রেতা/বিক্রেতার নাম দিন।"
    ],
    officialUrl: "https://wbregistration.gov.in/"
  },
  {
    id: "land_mutation",
    title: "Mutation & Conversion",
    subtitle: "Mutation & Conversion",
    category: "land",
    categoryName: "জমি ও পরচা",
    badge: "L&LR Portal",
    btnText: "মিউটেশন গাইড",
    description: "ক্রয়কৃত জমির নাম সংশোধন বা রেকর্ড নিজের নামের করার জন্য অনলাইন মিউটেশন বা জমির শ্রেণী বদল (শ্রেণী পরিবর্তন)।",
    steps: [
      "বাংলারভূমি পোর্টালে নিজের ইউজার রেজিস্টার সম্পন্ন করে Citizen Services এ যান।",
      "'Online Application' ট্যাব থেকে 'Mutation Application' সিলেক্ট করে ফর্ম পূরণ করুন।",
      "রেজিস্টার ডিড (দলিল কপি), বিক্রেতার পর্চা এবং সেল ডিডের প্রথম ৭ পাতার কপি আপলোড করুন।",
      "অনলাইনে প্রসেস চার্জ পেমেন্ট সম্পন্ন করে হেয়ারিং এর নোটিশের জন্য অপেক্ষা করুন ও বিএলআরও অফিসে জমা দিন।"
    ],
    officialUrl: "https://banglarbhumi.gov.in/"
  },
  {
    id: "land_revenue",
    title: "Land Revenue (Khajna)",
    subtitle: "Land Revenue (Khajna)",
    category: "land",
    categoryName: "জমি ও পরচা",
    badge: "WB Revenue",
    btnText: "অনলাইন খাজনা",
    description: "পশ্চিমবঙ্গে কৃষিজমি বা ডাঙ্গা জমির বার্ষিক ল্যান্ড রেভিনিউ বা খাজনা অনলাইনে জমা করে কিস্তিবন্ডী টিকিট বা রসিদ পাওয়া।",
    steps: [
      "বাংলারভূমি পোর্টালে নাগরিক লগইন সম্পন্ন করে 'Land Revenue Application' ক্লিক করুন।",
      "আপনার জমির বিবরণ ও পূর্ববর্তী খাজনার শেষ বছরের রসিদের তথ্য ইনপুট করুন।",
      "বকেয়া হিসেব দেখার পর আপনার মোবাইল নম্বরে ওটিপি দিয়ে কনফার্ম করুন।",
      "নেট ব্যাংকিং বা জিআরআইপিএস (GRIPS) দিয়ে অনলাইন খাজনা পে করে খাজনা দাখিলা ডাউনলোড করুন।"
    ],
    officialUrl: "https://banglarbhumi.gov.in/"
  },

  // West Bengal Digital Health Services (health)
  {
    id: "srv12",
    title: "ABHA Card (Digital Health ID)",
    subtitle: "Digital Health ID",
    category: "health",
    categoryName: "ডিজিটাল হেলথ কার্ড",
    badge: "NHA India",
    btnText: "হেলথ কার্ড",
    description: "ভারত সরকারের জাতীয় digital স্বাস্থ্য মিশনের অধীনে তৈরি ১৪ ডিজিটের ইউনিক হেলথ অ্যাকাউন্ট আইডি কার্ড। এর মাধ্যমে সমস্ত মেডিকেল প্রেসক্রিপশন ও রিপোর্ট সুরক্ষিতভাবে অনলাইনে রাখা যায়।",
    steps: [
      "নিচের অফিশিয়াল জাতীয় স্বাস্থ্য কর্তৃপক্ষ (NHA) লিংকে ক্লিক করুন।",
      "‘Create ABHA Number’ বাটনে ক্লিক করে আপনার আধার নম্বর বা ড্রাইভিং লাইসেন্স লিখুন।",
      "আধার কার্ডের সাথে সংযুক্ত মোবাইল নম্বরে প্রেরিত ওটিপি (OTP) ভেরিফাই করুন।",
      "আপনার ছবি ও মোবাইল নম্বর মিলিয়ে নিয়ে মুহূর্তেই ডিজিটাল ABHA হেলথ কার্ড ডাউনলোড করে নিন।"
    ],
    officialUrl: "https://abha.abdm.gov.in/"
  },
  {
    id: "srv_swasthya",
    title: "Swasthya Sathi Card Portal",
    subtitle: "Swasthya Sathi",
    category: "health",
    categoryName: "ডিজিটাল হেলথ কার্ড",
    badge: "WB Govt Health",
    btnText: "স্বাস্থ্য বীমা",
    description: "পশ্চিমবঙ্গ राज्य সরকারের সামাজিক সুরক্ষার অন্যতম জনপ্রিয় ক্যাশলেস স্বাস্থ্য বিমা কার্ড, যা প্রতি বছর প্রতিটি পরিবারকে ৫ লক্ষ টাকা পর্যন্ত ক্যাশলেস হসপিটালাইজেশন সেবা দেয়।",
    steps: [
      "স্বাস্থ্য সাথী প্রকল্পের অফিসিয়াল কাস্টম পোর্টাল ওপেন করুন।",
      "মেনু বার থেকে ‘Find Your Name’ এ ক্লিক করে আপনার অ্যাক্টিভ মোবাইল নম্বর ও জেলা নির্বাচন করুন।",
      "আপনার পরিবারের রেশন কার্ড (RC) নম্বর অথবা আধার নম্বর দিয়ে সার্চ বাটনে চাপুন।",
      "এখানে আপনার কার্ডের বর্তমান স্ট্যাটাস, আধার লিঙ্কিং সক্রিয় আছে কি না এবং URN বিবরণী সহজে দেখে নিন।"
    ],
    officialUrl: "https://swasthyasathi.gov.in/"
  }
];

export const INITIAL_SCHOLARSHIPS: Scholarship[] = [
  {
    id: "sc1",
    title: "Swami Vivekananda Scholarship (SVMCM)",
    amount: "বার্ষিক ১২,০০০ টাকা থেকে ৯৬,০০০ টাকা পর্যন্ত (শ্রেণী ও কোর্স ভিত্তিক)",
    eligibility: "পশ্চিমবঙ্গের স্থায়ী বাসিন্দা এবং মাধ্যমিক/উচ্চ মাধ্যমিক বা স্নাতক স্তরে ন্যূনতম ৬০% নম্বর প্রাপ্ত শিক্ষার্থী, যার পারিবারিক বার্ষিক আয় ২.৫ লক্ষ টাকার নিচে।",
    lastDate: "২০২৬-১২-৩১",
    officialUrl: "https://svmcm.wb.gov.in/",
    description: "অর্থনৈতিকভাবে পিছিয়ে পড়া রাজ্যের মেধাবী ছাত্রছাত্রীদের উচ্চশিক্ষার খরচ বহন করার জন্য এই নামী মেরিট স্কলারশিপ প্রদান করা হয়।"
  },
  {
    id: "sc2",
    title: "OASIS Scholarship Portal",
    amount: "বার্ষিক ৫,০০০ টাকা থেকে ২০,০০০ টাকা পর্যন্ত (শ্রেণী ও হোস্টেল অবস্থান ভিত্তিক)",
    eligibility: "রাজ্যের তপশিলি জাতি (SC), তপশিলি উপজাতি (ST) এবং ওবিসি (OBC) সম্প্রদায়ভুক্ত ছাত্রছাত্রীদের জন্য যারা পোস্ট-মেট্রিক নিয়ে পড়াশোনা করছেন।",
    lastDate: "২০২৬-০৯-৩০",
    officialUrl: "https://oasis.gov.in/",
    description: "অনগ্রসর শ্রেণী কল্যাণ ও আদিবাসী উন্নয়ন দপ্তরের অধীনে মাধ্যমিক পরবর্তী বিভিন্ন প্রফেশনাল, টেকনিক্যাল ও একাডেমিক কোর্সের জন্য বিশেষ ছাড় ও হোস্টেল স্কলারশিপ।"
  },
  {
    id: "sc3",
    title: "Aikyashree Scholarship Portal",
    amount: "বাৎসরিক ৪,৮০০ টাকা থেকে ২২,০০০ টাকা পর্যন্ত (অগ্রাধিকার ভিত্তিতে)",
    eligibility: "পশ্চিমবঙ্গের সংখ্যালঘু মুসলিম, শিখ, খ্রিস্টান, বৌদ্ধ, পার্সি বা জৈন শিক্ষার্থী এবং বিগত বার্ষিক পরীক্ষায় ন্যূনতম ৫০% নম্বর প্রাপক।",
    lastDate: "২০২৬-০৯-১৫",
    officialUrl: "https://wbmdfcscholarship.org/",
    description: "সংখ্যালঘু উন্নয়ন ও বৃত্ত নিগম দ্বারা পরিচালিত আর্থিক সহযোগিতা কর্মসূচি যাতে স্কুলের ছোট ক্লাস থেকে উচ্চশিক্ষা স্তর পর্যন্ত স্কলারশিপ প্রদান করা হয়।"
  },
  {
    id: "sc4",
    title: "National Scholarship Portal (NSP)",
    amount: "বাৎসরিক ১০,০০০ টাকা থেকে শুরু করে প্রফেশনাল কোর্সে ২৫,০০০ টাকা পর্যন্ত",
    eligibility: "কেন্দ্রীয় সরকারের নির্ধারিত গাইডলাইন অনুযায়ী অনগ্রসর ও বিশেষ প্রতিভাবান দরিদ্র ছাত্রছাত্রী।",
    lastDate: "২০২৬-১০-৩০",
    officialUrl: "https://scholarships.gov.in/",
    description: "ভারত সরকার কর্তৃক পরিচালিত একটি কেন্দ্রীয় পোর্টাল যা বিভিন্ন জাতীয় স্কলারশিপ একত্রিত করে যোগ্য রাজ্যের শিক্ষার্থীদের ব্যাংকে ডিরেক্ট বেনিফিট প্রদান করে।"
  }
];

export const INITIAL_JOBS: Job[] = [
  {
    id: "job_psc",
    title: "West Bengal Government Jobs (WBPSC)",
    subtitle: "PSC Clerkship, Miscellaneous",
    category: "wbpsc",
    categoryName: "পিএসসি নিয়োগ",
    vacancy: "৩,৯২৭ টি শূন্যপদ",
    qualification: "মাধ্যমিক বা সমতুল্য পাস ও কম্পিউটার টাইপিং জ্ঞান",
    lastDate: "২০২৬-০৮-৩০",
    officialUrl: "https://psc.wb.gov.in",
    salary: "২২,৭০০ - ৫৮,৫০০ টাকা",
    isPopular: true
  },
  {
    id: "job_police",
    title: "WBP Recruitment Services",
    subtitle: "WBP Constable Recruit",
    category: "police",
    categoryName: "পুলিশ রিক্রুটমেন্ট",
    vacancy: "৮,৪২০ টি শূন্যপদ (পুরুষ ও মহিলা)",
    qualification: "মাধ্যমিক পাস ও শারীরিক মাপজোখ ও দক্ষতা",
    lastDate: "২০২৬-০৮-১৫",
    officialUrl: "https://prb.wb.gov.in",
    salary: "২২,৭০০ - ৫৮,৫০০ টাকা",
    isPopular: true
  },
  {
    id: "job_tet",
    title: "Primary Teacher Eligibility Test (TET)",
    subtitle: "Primary Teacher Eligibility Test",
    category: "wbpsc",
    categoryName: "প্রাথমিক শিক্ষকতা",
    vacancy: "১২,০০০+ সম্ভাব্য পদ",
    qualification: "উচ্চ মাধ্যমিক (৫০% নম্বর সহ) এবং ডি.এল.এড / বি.এড ডিগ্রি",
    lastDate: "২০২৬-১০-১৫",
    officialUrl: "https://www.wbbprimaryeducation.org",
    salary: "২৯,০০০ - ৭৪,০০০ টাকা",
    isPopular: false
  },
  {
    id: "job_ssc",
    title: "School Service Commission (WBSSC)",
    subtitle: "Assistant Teacher & Group C/D",
    category: "ssc",
    categoryName: "স্কুল সার্ভিস কমিশন",
    vacancy: "৫,৬০০+ আনুমানিক পদ",
    qualification: "স্নাতক/স্নাতকোত্তর ডিগ্রী ও বি.এড (প্রযোজ্য ক্ষেত্রে)",
    lastDate: "২০২৬-০৯-৩০",
    officialUrl: "http://www.westbengalssc.com",
    salary: "২৫,৭০০ - ৮৩,৬০০ টাকা",
    isPopular: false
  },
  {
    id: "job_msc",
    title: "Municipal Service Commission (MSC)",
    subtitle: "Municipal Service Recruit",
    category: "private",
    categoryName: "পৌরসভা নিয়োগ",
    vacancy: "৪৫০ টি শূন্যপদ",
    qualification: "মাধ্যমিক/উচ্চ মাধ্যমিক বা সংশ্লিষ্ট ট্রেডে ডিপ্লোমা বা স্নাতক",
    lastDate: "২০২৬-০৭-৩১",
    officialUrl: "https://www.mscwb.org",
    salary: "১৮,০০০ - ৪৮, ০০ টাকা",
    isPopular: false
  },
  {
    id: "job_health",
    title: "Health Recruitment Board (WBHRB)",
    subtitle: "WB Health Recruitment Board",
    category: "banking",
    categoryName: "স্বাস্থ্য নিয়োগ",
    vacancy: "২,৪০০ টি স্টাফ নার্স ও টেকনিশিয়ান",
    qualification: "জিএনএম নার্সিং বা বিএসসি নার্সিং বা নির্দিষ্ট ল্যাব টেকনিশিয়ান ডিপ্লোমা",
    lastDate: "২০২৬-০৮-২৪",
    officialUrl: "https://www.hrb.wb.gov.in",
    salary: "২৮,৯০০ - ৭৪,৫০০ টাকা",
    isPopular: true
  }
];

export const INITIAL_UPDATES: AppUpdate[] = [
  {
    id: "up1",
    title: "Lakshmir Bhandar প্রকল্পের জন্য দুয়ারে সরকার ক্যাম্পের নতুন ক্যাম্প ডেট প্রকাশিত হয়েছে",
    date: "২০২৬-০৬-১২",
    category: "Scheme"
  },
  {
    id: "up2",
    title: "West Bengal Government Jobs (WBPSC) ফুড এসআই পরীক্ষার ফলাফল আগামী সপ্তাহে প্রকাশের সম্ভাবনা",
    date: "২০২৬-০৬-১৫",
    category: "General"
  },
  {
    id: "up3",
    title: "Swami Vivekananda Scholarship (SVMCM) ২০২৬ পোর্টাল আবেদন নেওয়ার জন্য উন্মুক্ত করা হয়েছে",
    date: "২০২৬-০৬-১০",
    category: "Scholarship"
  },
  {
    id: "up4",
    title: "WBP Recruitment Services এর মোট ৮,৪২০টি শূন্যপদে অফিশিয়াল বিস্তারিত সিলেবাস নোটিশ জারি হয়েছে",
    date: "২০২৬-০৬-১৪",
    category: "Job"
  },
  {
    id: "up5",
    title: "Aadhaar Services এবং PAN Card এর বায়োমেট্রিক ফ্রিতে আপডেট করার লাস্ট ডেট আরও ৩০ দিন বৃদ্ধি করা হল",
    date: "২০২৬-০৬-০৮",
    category: "General"
  }
];
