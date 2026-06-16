import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  getDocs, 
  setDoc, 
  doc, 
  deleteDoc, 
  getDocFromServer
} from "firebase/firestore";
import { getDatabase, ref, set as rtdbSet, get as rtdbGet, remove as rtdbRemove } from "firebase/database";
import { readFileSync } from "fs";
import { join } from "path";
import { 
  Scheme, 
  Job, 
  Scholarship, 
  ServiceItem,
  INITIAL_SCHEMES, 
  INITIAL_JOBS, 
  INITIAL_SCHOLARSHIPS, 
  SERVICES_DATA 
} from "../data.ts";

// Read and parse firebase config from workspace
let firebaseConfig: any = null;
try {
  const configPath = join(process.cwd(), "firebase-applet-config.json");
  const configRaw = readFileSync(configPath, "utf-8");
  firebaseConfig = JSON.parse(configRaw);
} catch (err) {
  console.error("[Firebase Server] Failed to read firebase-applet-config.json:", err);
}

// Check if credentials are placeholder
const isPlaceholder = !firebaseConfig || 
  !firebaseConfig.projectId || 
  firebaseConfig.projectId === "" ||
  firebaseConfig.projectId === "YOUR_PROJECT_ID" ||
  firebaseConfig.apiKey === "YOUR_API_KEY";

let db: any = null;
let rtdb: any = null;

if (!isPlaceholder && firebaseConfig) {
  try {
    const app = initializeApp(firebaseConfig);
    
    // Initialize Realtime Database if a database URL is specified
    if (firebaseConfig.databaseURL) {
      rtdb = getDatabase(app);
      console.log(`[Firebase Server] Initialized Realtime Database for Project: ${firebaseConfig.projectId}`);
    }
    
    // Also initialize Firestore as a parallel option or fallback
    db = getFirestore(app, firebaseConfig.firestoreDatabaseId || "(default)");
    console.log(`[Firebase Server] Initialized Firestore for Project: ${firebaseConfig.projectId}`);
  } catch (err) {
    console.error("[Firebase Server] Initialization error:", err);
  }
} else {
  console.warn("[Firebase Server] No real Firebase credentials found. Running in in-memory fallback mode.");
}

export interface CategoryItem {
  id: string;
  label: string;
  desc: string;
  iconName: string;
}

export const DEFAULT_CATEGORIES: CategoryItem[] = [
  { id: "welfare", label: "সরকারি প্রকল্প", desc: "লক্ষ্মীর ভাণ্ডার ও সেবা", iconName: "Award" },
  { id: "jobs", label: "সরকারি চাকরি", desc: "PSC, পুলিশ ও নিয়োগ", iconName: "Briefcase" },
  { id: "scholarships", label: "স্কলারশিপ", desc: "SVMCM ও অনুদান", iconName: "GraduationCap" },
  { id: "identity", label: "পরিচয় ও কার্ড", desc: "আধার, ভোটার ও রেশন", iconName: "IdCard" },
  { id: "utility", label: "শংসাপত্র", desc: "জন্ম, জাতি ও সার্টিফিকেট", iconName: "FileText" },
  { id: "health", label: "হেলথ ও বিমা", desc: "স্বাস্থ্য সাথী ও ABHA", iconName: "HeartPulse" },
  { id: "land", label: "জমি ও পরচা", desc: "বাংলারভূমি ও খাজনা", iconName: "MapPin" },
  { id: "cyber_cafe", label: "সাইবার ক্যাফে", desc: "পাবলিক ও জেনারেল সেবা", iconName: "Laptop" }
];

export interface SystemSettings {
  geminiApiKey: string;
}

import { writeFileSync, existsSync } from "fs";

const DATA_STORE_PATH = join(process.cwd(), "data-store.json");

// Start with standard initial data so user's app is pre-populated
const localMemoryStore = {
  schemes: [...INITIAL_SCHEMES] as Scheme[],
  jobs: [...INITIAL_JOBS] as Job[],
  scholarships: [...INITIAL_SCHOLARSHIPS] as Scholarship[],
  services: [...SERVICES_DATA] as ServiceItem[],
  categories: [...DEFAULT_CATEGORIES] as CategoryItem[],
  settings: { geminiApiKey: "" } as SystemSettings,
};

function saveLocalStore() {
  try {
    writeFileSync(DATA_STORE_PATH, JSON.stringify(localMemoryStore, null, 2), "utf-8");
  } catch (err) {
    console.error("[Data Store] Failed to save data store:", err);
  }
}

function loadLocalStore() {
  try {
    if (existsSync(DATA_STORE_PATH)) {
      const raw = readFileSync(DATA_STORE_PATH, "utf-8");
      const parsed = JSON.parse(raw);
      if (parsed.schemes) localMemoryStore.schemes = parsed.schemes;
      if (parsed.jobs) localMemoryStore.jobs = parsed.jobs;
      if (parsed.scholarships) localMemoryStore.scholarships = parsed.scholarships;
      if (parsed.services) localMemoryStore.services = parsed.services;
      if (parsed.categories) localMemoryStore.categories = parsed.categories;
      if (parsed.settings) localMemoryStore.settings = parsed.settings;
      console.log("[Data Store] Loaded persistent local store from disk:", DATA_STORE_PATH);
    } else {
      saveLocalStore();
    }
  } catch (err) {
    console.error("[Data Store] Failed to load data store:", err);
  }
}

// Immediately load stored settings and arrays on startup
loadLocalStore();

export async function getSystemSettings(): Promise<SystemSettings> {
  // If we have Firestore/Realtime DB connected, fetch from database or fallback to localMemoryStore
  if (rtdb) {
    try {
      const snapshot = await rtdbGet(ref(rtdb, "settings"));
      if (snapshot.exists()) {
        const val = snapshot.val();
        if (val) return val as SystemSettings;
      }
    } catch (err) {
      console.error("[Firebase RTDB] Error in getSystemSettings:", err);
    }
  } else if (db) {
    try {
      const docRef = doc(db, "settings", "config");
      const snapshot = await getDocFromServer(docRef);
      if (snapshot.exists()) {
        const val = snapshot.data();
        if (val) return val as SystemSettings;
      }
    } catch (err) {
      console.error("[Firebase Firestore] Error in getSystemSettings:", err);
    }
  }
  return localMemoryStore.settings;
}

export async function saveSystemSettings(settings: SystemSettings): Promise<void> {
  localMemoryStore.settings = settings;
  saveLocalStore();

  if (isPlaceholder) return;

  if (rtdb) {
    try {
      await rtdbSet(ref(rtdb, "settings"), settings);
    } catch (err) {
      console.error("[Firebase RTDB] Error setting settings:", err);
    }
  } else if (db) {
    try {
      await setDoc(doc(db, "settings", "config"), settings);
    } catch (err) {
      console.error("[Firebase Firestore] Error setting settings:", err);
    }
  }
}

export interface FirebaseStatus {
  connected: boolean;
  isFallback: boolean;
  projectId: string;
  databaseURL?: string;
  usingRTDB: boolean;
  usingFirestore: boolean;
  collectionsExist: {
    schemes: boolean;
    jobs: boolean;
    scholarships: boolean;
    services: boolean;
  };
  hasError: boolean;
  errorMessage: string | null;
}

/**
 * Checks connection state
 */
export async function getFirebaseStatus(): Promise<FirebaseStatus> {
  const status: FirebaseStatus = {
    connected: false,
    isFallback: isPlaceholder,
    projectId: firebaseConfig?.projectId || "None",
    databaseURL: firebaseConfig?.databaseURL || undefined,
    usingRTDB: false,
    usingFirestore: false,
    collectionsExist: {
      schemes: !isPlaceholder,
      jobs: !isPlaceholder,
      scholarships: !isPlaceholder,
      services: !isPlaceholder,
    },
    hasError: false,
    errorMessage: null,
  };

  if (isPlaceholder) {
    status.errorMessage = "Placeholder credentials detected. Displaying local memory fallback data.";
    return status;
  }

  // Determine active database and test connectivity
  if (rtdb) {
    status.usingRTDB = true;
    status.connected = true;
  } else if (db) {
    status.usingFirestore = true;
    status.connected = true;
  } else {
    status.isFallback = true;
    status.errorMessage = "No database instance (Realtime DB or Firestore) could be initialized.";
  }

  return status;
}

/**
 * SCHEMES OPERATIONS
 */
export async function getSchemes(): Promise<Scheme[]> {
  if (isPlaceholder) {
    return localMemoryStore.schemes;
  }

  // 1. Try Realtime Database (RTDB) if enabled
  if (rtdb) {
    try {
      const snapshot = await rtdbGet(ref(rtdb, "schemes"));
      if (!snapshot.exists()) {
        return [];
      }
      const val = snapshot.val();
      const list = Array.isArray(val) 
        ? val.filter(Boolean) 
        : Object.keys(val).map(key => val[key]);
      return list as Scheme[];
    } catch (err) {
      console.error("[Firebase RTDB] Error in getSchemes:", err);
    }
  }

  // 2. Try Firestore
  if (db) {
    try {
      const colRef = collection(db, "schemes");
      const qSnapshot = await getDocs(colRef);
      
      if (qSnapshot.empty) {
        console.log("Seeding schemes into Firestore...");
        for (const item of INITIAL_SCHEMES) {
          const payload = {
            id: item.id,
            title: item.title,
            titleEn: item.titleEn || "",
            category: item.category,
            categoryName: item.categoryName,
            description: item.description,
            benefits: item.benefits || "",
            eligibility: item.eligibility || "",
            documents: item.documents || [],
            officialUrl: item.officialUrl,
            isPopular: item.isPopular || false,
            logoUrl: item.logoUrl || "",
            created_at: new Date().toISOString()
          };
          await setDoc(doc(db, "schemes", item.id), payload);
        }
        return INITIAL_SCHEMES;
      }

      const list: Scheme[] = [];
      qSnapshot.forEach((doc) => {
        list.push(doc.data() as Scheme);
      });
      return list;
    } catch (err) {
      console.error("[Firebase Firestore] Error in getSchemes:", err);
    }
  }

  return localMemoryStore.schemes;
}

export async function upsertScheme(scheme: Scheme): Promise<void> {
  // Sync in-memory store
  const idx = localMemoryStore.schemes.findIndex(s => s.id === scheme.id);
  if (idx !== -1) {
    localMemoryStore.schemes[idx] = scheme;
  } else {
    localMemoryStore.schemes.unshift(scheme);
  }
  saveLocalStore();

  if (isPlaceholder) return;

  const payload = {
    id: scheme.id,
    title: scheme.title,
    titleEn: scheme.titleEn || "",
    category: scheme.category,
    categoryName: scheme.categoryName,
    description: scheme.description,
    benefits: scheme.benefits,
    eligibility: scheme.eligibility,
    documents: scheme.documents || [],
    officialUrl: scheme.officialUrl,
    isPopular: scheme.isPopular || false,
    logoUrl: scheme.logoUrl || "",
    created_at: new Date().toISOString()
  };

  if (rtdb) {
    try {
      await rtdbSet(ref(rtdb, `schemes/${scheme.id}`), payload);
    } catch (err) {
      console.error("[Firebase RTDB] Error upserting scheme:", err);
    }
  } else if (db) {
    try {
      await setDoc(doc(db, "schemes", scheme.id), payload);
    } catch (err) {
      console.error("[Firebase Firestore] Error upserting scheme:", err);
    }
  }
}

export async function removeScheme(id: string): Promise<void> {
  localMemoryStore.schemes = localMemoryStore.schemes.filter(s => s.id !== id);
  saveLocalStore();
  if (isPlaceholder) return;
  
  if (rtdb) {
    try {
      await rtdbRemove(ref(rtdb, `schemes/${id}`));
    } catch (err) {
      console.error(`[Firebase RTDB] Error deleting scheme ${id}:`, err);
    }
  } else if (db) {
    try {
      await deleteDoc(doc(db, "schemes", id));
    } catch (err) {
      console.error(`[Firebase Firestore] Error deleting scheme ${id}:`, err);
    }
  }
}

/**
 * JOBS OPERATIONS
 */
export async function getJobs(): Promise<Job[]> {
  if (isPlaceholder) {
    return localMemoryStore.jobs;
  }

  // 1. Try Realtime Database (RTDB) if enabled
  if (rtdb) {
    try {
      const snapshot = await rtdbGet(ref(rtdb, "jobs"));
      if (!snapshot.exists()) {
        return [];
      }
      const val = snapshot.val();
      const list = Array.isArray(val) 
        ? val.filter(Boolean) 
        : Object.keys(val).map(key => val[key]);
      return list as Job[];
    } catch (err) {
      console.error("[Firebase RTDB] Error in getJobs:", err);
    }
  }

  // 2. Try Firestore
  if (db) {
    try {
      const colRef = collection(db, "jobs");
      const qSnapshot = await getDocs(colRef);
      
      if (qSnapshot.empty) {
        console.log("Seeding jobs into Firestore...");
        for (const item of INITIAL_JOBS) {
          const payload = {
            id: item.id,
            title: item.title,
            subtitle: item.subtitle || "",
            category: item.category,
            categoryName: item.categoryName,
            vacancy: item.vacancy || "",
            qualification: item.qualification || "",
            lastDate: item.lastDate || "",
            officialUrl: item.officialUrl || "https://wb.gov.in",
            salary: item.salary || "",
            isPopular: item.isPopular || false,
            logoUrl: item.logoUrl || "",
            created_at: new Date().toISOString()
          };
          await setDoc(doc(db, "jobs", item.id), payload);
        }
        return INITIAL_JOBS;
      }

      const list: Job[] = [];
      qSnapshot.forEach((doc) => {
        list.push(doc.data() as Job);
      });
      return list;
    } catch (err) {
      console.error("[Firebase Firestore] Error in getJobs:", err);
    }
  }

  return localMemoryStore.jobs;
}

export async function upsertJob(job: Job): Promise<void> {
  const idx = localMemoryStore.jobs.findIndex(j => j.id === job.id);
  if (idx !== -1) {
    localMemoryStore.jobs[idx] = job;
  } else {
    localMemoryStore.jobs.unshift(job);
  }
  saveLocalStore();

  if (isPlaceholder) return;

  const payload = {
    id: job.id,
    title: job.title,
    subtitle: job.subtitle || "",
    category: job.category,
    categoryName: job.categoryName,
    vacancy: job.vacancy,
    qualification: job.qualification,
    lastDate: job.lastDate,
    officialUrl: job.officialUrl,
    salary: job.salary || "",
    isPopular: job.isPopular || false,
    logoUrl: job.logoUrl || "",
    created_at: new Date().toISOString()
  };

  if (rtdb) {
    try {
      await rtdbSet(ref(rtdb, `jobs/${job.id}`), payload);
    } catch (err) {
      console.error("[Firebase RTDB] Error upserting job:", err);
    }
  } else if (db) {
    try {
      await setDoc(doc(db, "jobs", job.id), payload);
    } catch (err) {
      console.error("[Firebase Firestore] Error upserting job:", err);
    }
  }
}

export async function removeJob(id: string): Promise<void> {
  localMemoryStore.jobs = localMemoryStore.jobs.filter(j => j.id !== id);
  saveLocalStore();
  if (isPlaceholder) return;

  if (rtdb) {
    try {
      await rtdbRemove(ref(rtdb, `jobs/${id}`));
    } catch (err) {
      console.error(`[Firebase RTDB] Error deleting job ${id}:`, err);
    }
  } else if (db) {
    try {
      await deleteDoc(doc(db, "jobs", id));
    } catch (err) {
      console.error(`[Firebase Firestore] Error deleting job ${id}:`, err);
    }
  }
}

/**
 * SCHOLARSHIPS OPERATIONS
 */
export async function getScholarships(): Promise<Scholarship[]> {
  if (isPlaceholder) {
    return localMemoryStore.scholarships;
  }

  // 1. Try Realtime Database (RTDB) if enabled
  if (rtdb) {
    try {
      const snapshot = await rtdbGet(ref(rtdb, "scholarships"));
      if (!snapshot.exists()) {
        return [];
      }
      const val = snapshot.val();
      const list = Array.isArray(val) 
        ? val.filter(Boolean) 
        : Object.keys(val).map(key => val[key]);
      return list as Scholarship[];
    } catch (err) {
      console.error("[Firebase RTDB] Error in getScholarships:", err);
    }
  }

  // 2. Try Firestore
  if (db) {
    try {
      const colRef = collection(db, "scholarships");
      const qSnapshot = await getDocs(colRef);
      
      if (qSnapshot.empty) {
        console.log("Seeding scholarships into Firestore...");
        for (const item of INITIAL_SCHOLARSHIPS) {
          const payload = {
            id: item.id,
            title: item.title,
            amount: item.amount || "",
            eligibility: item.eligibility || "",
            lastDate: item.lastDate || "",
            officialUrl: item.officialUrl || "https://wb.gov.in",
            description: item.description || "",
            logoUrl: item.logoUrl || "",
            created_at: new Date().toISOString()
          };
          await setDoc(doc(db, "scholarships", item.id), payload);
        }
        return INITIAL_SCHOLARSHIPS;
      }

      const list: Scholarship[] = [];
      qSnapshot.forEach((doc) => {
        list.push(doc.data() as Scholarship);
      });
      return list;
    } catch (err) {
      console.error("[Firebase Firestore] Error in getScholarships:", err);
    }
  }

  return localMemoryStore.scholarships;
}

export async function upsertScholarship(scholarship: Scholarship): Promise<void> {
  const idx = localMemoryStore.scholarships.findIndex(s => s.id === scholarship.id);
  if (idx !== -1) {
    localMemoryStore.scholarships[idx] = scholarship;
  } else {
    localMemoryStore.scholarships.unshift(scholarship);
  }
  saveLocalStore();

  if (isPlaceholder) return;

  const payload = {
    id: scholarship.id,
    title: scholarship.title,
    amount: scholarship.amount,
    eligibility: scholarship.eligibility,
    lastDate: scholarship.lastDate,
    officialUrl: scholarship.officialUrl,
    description: scholarship.description,
    logoUrl: scholarship.logoUrl || "",
    created_at: new Date().toISOString()
  };

  if (rtdb) {
    try {
      await rtdbSet(ref(rtdb, `scholarships/${scholarship.id}`), payload);
    } catch (err) {
      console.error("[Firebase RTDB] Error upserting scholarship:", err);
    }
  } else if (db) {
    try {
      await setDoc(doc(db, "scholarships", scholarship.id), payload);
    } catch (err) {
      console.error("[Firebase Firestore] Error upserting scholarship:", err);
    }
  }
}

export async function removeScholarship(id: string): Promise<void> {
  localMemoryStore.scholarships = localMemoryStore.scholarships.filter(s => s.id !== id);
  saveLocalStore();
  if (isPlaceholder) return;

  if (rtdb) {
    try {
      await rtdbRemove(ref(rtdb, `scholarships/${id}`));
    } catch (err) {
      console.error(`[Firebase RTDB] Error deleting scholarship ${id}:`, err);
    }
  } else if (db) {
    try {
      await deleteDoc(doc(db, "scholarships", id));
    } catch (err) {
      console.error(`[Firebase Firestore] Error deleting scholarship ${id}:`, err);
    }
  }
}

/**
 * SERVICES OPERATIONS
 */
export async function getServices(): Promise<ServiceItem[]> {
  if (isPlaceholder) {
    return localMemoryStore.services;
  }

  // 1. Try Realtime Database (RTDB) if enabled
  if (rtdb) {
    try {
      const snapshot = await rtdbGet(ref(rtdb, "services"));
      if (!snapshot.exists()) {
        return [];
      }
      const val = snapshot.val();
      const list = Array.isArray(val) 
        ? val.filter(Boolean) 
        : Object.keys(val).map(key => val[key]);
      return list as ServiceItem[];
    } catch (err) {
      console.error("[Firebase RTDB] Error in getServices:", err);
    }
  }

  // 2. Try Firestore
  if (db) {
    try {
      const colRef = collection(db, "services");
      const qSnapshot = await getDocs(colRef);
      
      if (qSnapshot.empty) {
        console.log("Seeding services into Firestore...");
        for (const item of SERVICES_DATA) {
          const payload = {
            id: item.id,
            title: item.title,
            subtitle: item.subtitle || "",
            category: item.category,
            categoryName: item.categoryName,
            badge: item.badge || "",
            btnText: item.btnText || "",
            description: item.description || "",
            steps: item.steps || [],
            officialUrl: item.officialUrl || "https://wb.gov.in",
            logoUrl: item.logoUrl || "",
            created_at: new Date().toISOString()
          };
          await setDoc(doc(db, "services", item.id), payload);
        }
        return SERVICES_DATA;
      }

      const list: ServiceItem[] = [];
      qSnapshot.forEach((doc) => {
        list.push(doc.data() as ServiceItem);
      });
      return list;
    } catch (err) {
      console.error("[Firebase Firestore] Error in getServices:", err);
    }
  }

  return localMemoryStore.services;
}

export async function upsertService(service: ServiceItem): Promise<void> {
  const idx = localMemoryStore.services.findIndex(s => s.id === service.id);
  if (idx !== -1) {
    localMemoryStore.services[idx] = service;
  } else {
    localMemoryStore.services.unshift(service);
  }
  saveLocalStore();

  if (isPlaceholder) return;

  const payload = {
    id: service.id,
    title: service.title,
    subtitle: service.subtitle || "",
    category: service.category,
    categoryName: service.categoryName,
    badge: service.badge || "",
    btnText: service.btnText || "",
    description: service.description,
    steps: service.steps || [],
    officialUrl: service.officialUrl,
    logoUrl: service.logoUrl || "",
    created_at: new Date().toISOString()
  };

  if (rtdb) {
    try {
      await rtdbSet(ref(rtdb, `services/${service.id}`), payload);
    } catch (err) {
      console.error("[Firebase RTDB] Error upserting service:", err);
    }
  } else if (db) {
    try {
      await setDoc(doc(db, "services", service.id), payload);
    } catch (err) {
      console.error("[Firebase Firestore] Error upserting service:", err);
    }
  }
}

export async function removeService(id: string): Promise<void> {
  localMemoryStore.services = localMemoryStore.services.filter(s => s.id !== id);
  saveLocalStore();
  if (isPlaceholder) return;

  if (rtdb) {
    try {
      await rtdbRemove(ref(rtdb, `services/${id}`));
    } catch (err) {
      console.error(`[Firebase RTDB] Error deleting service ${id}:`, err);
    }
  } else if (db) {
    try {
      await deleteDoc(doc(db, "services", id));
    } catch (err) {
      console.error(`[Firebase Firestore] Error deleting service ${id}:`, err);
    }
  }
}

/**
 * CATEGORIES OPERATIONS
 */
export async function getCategories(): Promise<CategoryItem[]> {
  if (isPlaceholder) {
    return localMemoryStore.categories;
  }

  // 1. Try Realtime Database (RTDB) if enabled
  if (rtdb) {
    try {
      const snapshot = await rtdbGet(ref(rtdb, "categories"));
      if (!snapshot.exists()) {
        // Seed first
        for (const cat of DEFAULT_CATEGORIES) {
          await rtdbSet(ref(rtdb, `categories/${cat.id}`), cat);
        }
        return DEFAULT_CATEGORIES;
      }
      const val = snapshot.val();
      const list = Array.isArray(val) 
        ? val.filter(Boolean) 
        : Object.keys(val).map(key => val[key]);
      return list as CategoryItem[];
    } catch (err) {
      console.error("[Firebase RTDB] Error in getCategories:", err);
    }
  }

  // 2. Try Firestore
  if (db) {
    try {
      const colRef = collection(db, "categories");
      const qSnapshot = await getDocs(colRef);
      
      if (qSnapshot.empty) {
        // Seed first
        for (const cat of DEFAULT_CATEGORIES) {
          await setDoc(doc(db, "categories", cat.id), cat);
        }
        return DEFAULT_CATEGORIES;
      }

      const list: CategoryItem[] = [];
      qSnapshot.forEach((doc) => {
        list.push(doc.data() as CategoryItem);
      });
      return list;
    } catch (err) {
      console.error("[Firebase Firestore] Error in getCategories:", err);
    }
  }

  return localMemoryStore.categories;
}

export async function upsertCategory(cat: CategoryItem): Promise<void> {
  const idx = localMemoryStore.categories.findIndex(c => c.id === cat.id);
  if (idx !== -1) {
    localMemoryStore.categories[idx] = cat;
  } else {
    localMemoryStore.categories.push(cat);
  }
  saveLocalStore();

  if (isPlaceholder) return;

  const payload = {
    id: cat.id,
    label: cat.label,
    desc: cat.desc,
    iconName: cat.iconName
  };

  if (rtdb) {
    try {
      await rtdbSet(ref(rtdb, `categories/${cat.id}`), payload);
    } catch (err) {
      console.error("[Firebase RTDB] Error upserting category:", err);
    }
  } else if (db) {
    try {
      await setDoc(doc(db, "categories", cat.id), payload);
    } catch (err) {
      console.error("[Firebase Firestore] Error upserting category:", err);
    }
  }
}

export async function removeCategory(id: string): Promise<void> {
  localMemoryStore.categories = localMemoryStore.categories.filter(c => c.id !== id);
  saveLocalStore();
  if (isPlaceholder) return;

  if (rtdb) {
    try {
      await rtdbRemove(ref(rtdb, `categories/${id}`));
    } catch (err) {
      console.error(`[Firebase RTDB] Error deleting category ${id}:`, err);
    }
  } else if (db) {
    try {
      await deleteDoc(doc(db, "categories", id));
    } catch (err) {
      console.error(`[Firebase Firestore] Error deleting category ${id}:`, err);
    }
  }
}

