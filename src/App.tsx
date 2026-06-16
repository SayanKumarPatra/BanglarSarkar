import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  Bot,
  User,
  Settings,
  Globe,
  Award,
  Briefcase,
  GraduationCap,
  Bell,
  BookOpen,
  Smartphone,
  MessageSquare,
  Calendar,
  ArrowUpRight,
  Lock,
  Bookmark,
  ChevronRight,
  Info,
  MapPin,
  CheckCircle2,
  PhoneCall,
  Mail,
  Zap,
  Shield,
  Clock,
  Sparkles,
  X,
  PlusCircle,
  HelpCircle,
  Grid,
  ClipboardList,
  Fingerprint,
  CreditCard,
  Vote,
  ShoppingBag,
  Car,
  Baby,
  IdCard,
  HeartPulse,
  FileText,
  Laptop,
  Eye,
  EyeOff,
  Phone
} from "lucide-react";

import {
  INITIAL_SCHEMES,
  INITIAL_JOBS,
  INITIAL_SCHOLARSHIPS,
  SERVICES_DATA,
  INITIAL_UPDATES,
  Scheme,
  Job,
  Scholarship,
  ServiceItem,
  AppUpdate,
  CategoryItem
} from "./data";

import { collection, onSnapshot } from "firebase/firestore";
import { ref as rtdbRef, onValue as onRtdbValue } from "firebase/database";
import { db, rtdb, isPlaceholderFirebase } from "./lib/firebase";

import AiAssistant from "./components/AiAssistant";
import AdminPanel from "./components/AdminPanel";

const renderOfficialLogo = (id: string) => {
  switch (id) {
    case "srv1": // Aadhaar Card
      return (
        <svg viewBox="0 0 100 100" className="w-10 h-10 shrink-0 select-none">
          <g transform="translate(50,52)">
            {[...Array(12)].map((_, i) => (
              <path
                key={i}
                d="M 0,-14 L 3,-40 L -3,-40 Z"
                fill="#E96A1F"
                transform={`rotate(${i * 30})`}
              />
            ))}
            <circle cx="0" cy="0" r="24" fill="#FFFBEB" stroke="#E96A1F" strokeWidth="1.5" />
            <path
              d="M -11,0 C -11,-12 11,-12 11,0 M -8,4 C -8,-6 8,-6 8,4 M -4,8 C -4,-1 4,-1 4,8 M -14,-4 C -14,-17 14,-17 14,-4"
              stroke="#1D4ED8"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
          </g>
        </svg>
      );
    case "srv2": // PAN Card
      return (
        <svg viewBox="0 0 100 100" className="w-10 h-10 shrink-0 select-none">
          <rect x="5" y="16" width="90" height="68" rx="8" fill="url(#panColorGrad)" stroke="#1E40AF" strokeWidth="1" />
          <defs>
            <linearGradient id="panColorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E3A8A" />
              <stop offset="50%" stopColor="#0D9488" />
              <stop offset="100%" stopColor="#064E3B" />
            </linearGradient>
          </defs>
          <g transform="translate(50,38) scale(0.65)" fill="#FBBF24" opacity="0.9">
            <path d="M 0,-15 Q -5,-8 -5,0 L 5,0 Q 5,-8 0,-15 Z M -7,0 L 7,0 L 5,14 L -5,14 Z" />
          </g>
          <text x="50" y="66" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="bold" letterSpacing="0.5">INCOME TAX</text>
          <rect x="70" y="24" width="16" height="20" fill="#E2E8F0" rx="1" />
          <circle cx="78" cy="31" r="3.5" fill="#475569" />
          <path d="M 72,41 C 72,36 84,36 84,41" fill="#475569" />
        </svg>
      );
    case "srv3": // Birth Certificate
      return (
        <svg viewBox="0 0 100 100" className="w-10 h-10 shrink-0 select-none">
          <circle cx="50" cy="50" r="45" fill="#FFFBEB" stroke="#D97706" strokeWidth="2.5" />
          <circle cx="50" cy="50" r="38" fill="none" stroke="#F59E0B" strokeWidth="1" strokeDasharray="3,3" />
          <g fill="#B45309" stroke="none">
            <ellipse cx="41" cy="52" rx="4" ry="7.5" transform="rotate(-15, 41, 52)" />
            <circle cx="35" cy="40" r="1.5" />
            <circle cx="39" cy="38" r="1.3" />
            <circle cx="43" cy="39" r="1.2" />
            <circle cx="46" cy="41" r="1.1" />
            <ellipse cx="59" cy="52" rx="4" ry="7.5" transform="rotate(15, 59, 52)" />
            <circle cx="65" cy="40" r="1.5" />
            <circle cx="61" cy="38" r="1.3" />
            <circle cx="57" cy="39" r="1.2" />
            <circle cx="54" cy="41" r="1.1" />
          </g>
          <text x="50" y="90" textAnchor="middle" fill="#78350F" fontSize="7" fontWeight="bold">BIRTH</text>
        </svg>
      );
    case "srv4": // Caste Certificate
      return (
        <svg viewBox="0 0 100 100" className="w-10 h-10 shrink-0 select-none">
          <circle cx="50" cy="50" r="45" fill="#FDF4FF" stroke="#A21CAF" strokeWidth="2.5" />
          <g transform="translate(50,42) scale(0.7)" fill="#C084FC">
            <path d="M 0,-20 L 18,12 L -18,12 Z" />
            <polygon points="0,-10 8,10 -8,10" fill="#E879F9" />
          </g>
          <rect x="25" y="65" width="50" height="6" rx="1.5" fill="#C084FC" />
          <text x="50" y="88" textAnchor="middle" fill="#701A75" fontSize="7.5" fontWeight="bold">CASTE</text>
        </svg>
      );
    case "srv5": // Income Certificate
      return (
        <svg viewBox="0 0 100 100" className="w-10 h-10 shrink-0 select-none">
          <circle cx="50" cy="50" r="45" fill="#F0FDF4" stroke="#15803D" strokeWidth="2.5" />
          <rect x="26" y="24" width="48" height="40" rx="3" fill="#FFFFFF" stroke="#16A34A" strokeWidth="2" />
          <line x1="34" y1="34" x2="66" y2="34" stroke="#16A34A" strokeWidth="2" />
          <line x1="34" y1="44" x2="66" y2="44" stroke="#16A34A" strokeWidth="2" />
          <line x1="34" y1="54" x2="54" y2="54" stroke="#16A34A" strokeWidth="2" />
          <circle cx="64" cy="54" r="5" fill="#F59E0B" />
          <text x="50" y="88" textAnchor="middle" fill="#14532D" fontSize="7.5" fontWeight="black" letterSpacing="0.2">INCOME</text>
        </svg>
      );
    case "srv6": // PAN & Aadhaar Link
      return (
        <svg viewBox="0 0 100 100" className="w-10 h-10 shrink-0 select-none">
          <circle cx="50" cy="50" r="45" fill="#F0FDFA" stroke="#0D9488" strokeWidth="2.5" />
          <circle cx="38" cy="46" r="14" fill="none" stroke="#E96A1F" strokeWidth="3.5" />
          <circle cx="62" cy="46" r="14" fill="none" stroke="#1E3A8A" strokeWidth="3.5" />
          <path d="M 46,55 L 54,63 L 70,47" stroke="#14B8A6" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <text x="50" y="88" textAnchor="middle" fill="#115E59" fontSize="7" fontWeight="bold">LINKING</text>
        </svg>
      );
    case "srv7": // Voter ID
      return (
        <svg viewBox="0 0 100 100" className="w-10 h-10 shrink-0 select-none">
          <circle cx="50" cy="50" r="45" fill="#FAFAF9" stroke="#1E3A8A" strokeWidth="2.5" />
          <path d="M 12,28 C 30,30 70,30 88,28" stroke="#EA580C" strokeWidth="3.5" fill="none" />
          <path d="M 10,48 C 30,50 70,50 90,48" stroke="#1E53A3" strokeWidth="3.5" fill="none" />
          <path d="M 12,68 C 30,70 70,70 88,68" stroke="#16A34A" strokeWidth="3.5" fill="none" />
          <g transform="translate(18, 5) scale(0.65)" stroke="#1E293B" strokeWidth="2.5" fill="#FFFFFF" strokeLinejoin="round">
            <path d="M 30,85 L 30,50 Q 30,40 40,40 Q 50,40 50,55 L 50,85 Z" />
            <path d="M 50,60 Q 60,60 60,70 L 60,85" />
            <path d="M 60,65 Q 70,65 70,75 L 70,85" />
            <path d="M 30,55 L 30,15 C 30,5 50,5 50,15 L 50,55" />
            <path d="M 40,10 L 40,28" stroke="#6366F1" strokeWidth="4" strokeLinecap="round" />
          </g>
          <text x="50" y="91" textAnchor="middle" fill="#1E3A8A" fontSize="7" fontWeight="black" letterSpacing="0.2">ECI / VOTER</text>
        </svg>
      );
    case "srv8": // Ration Card
      return (
        <svg viewBox="0 0 100 100" className="w-10 h-10 shrink-0 select-none">
          <circle cx="50" cy="50" r="45" fill="#ECFDF5" stroke="#059669" strokeWidth="2.5" />
          <ellipse cx="50" cy="50" rx="38" ry="38" fill="none" stroke="#10B981" strokeWidth="0.5" strokeDasharray="3,3" />
          <g stroke="#D97706" strokeWidth="2.5" fill="none" strokeLinecap="round">
            <path d="M 50,80 Q 50,45 35,26" />
            <path d="M 50,80 Q 50,45 65,26" />
            <path d="M 50,80 Q 50,40 50,22" />
            <circle cx="35" cy="26" r="2" fill="#FBBF24" stroke="none" />
            <circle cx="39" cy="33" r="2" fill="#FBBF24" stroke="none" />
            <circle cx="43" cy="40" r="2" fill="#FBBF24" stroke="none" />
            <circle cx="65" cy="26" r="2" fill="#FBBF24" stroke="none" />
            <circle cx="61" cy="33" r="2" fill="#FBBF24" stroke="none" />
            <circle cx="57" cy="40" r="2" fill="#FBBF24" stroke="none" />
          </g>
          <text x="50" y="92" textAnchor="middle" fill="#047857" fontSize="7" fontWeight="black">খাদ্যসাথী</text>
        </svg>
      );
    case "srv9": // Passport
      return (
        <svg viewBox="0 0 100 100" className="w-10 h-10 shrink-0 select-none">
          <rect x="22" y="10" width="56" height="80" rx="5" fill="#0F172A" stroke="#475569" strokeWidth="1" />
          <g transform="translate(50,45) scale(0.6)" fill="#FBBF24" stroke="#D97706" strokeWidth="0.5">
            <path d="M -10,-10 C -15,-20 15,-20 10,-10 C 15,-10 15,10 10,12 L -10,12 Z" />
            <rect x="-12" y="12" width="24" height="4" rx="1" />
            <path d="M -8,16 L -10,32 L 10,32 L 8,16" />
          </g>
          <text x="50" y="21" textAnchor="middle" fill="#FBBF24" fontSize="6" fontWeight="bold">PASSPORT</text>
          <text x="50" y="85" textAnchor="middle" fill="#FBBF24" fontSize="6.5" fontWeight="bold">REPUBLIC OF INDIA</text>
        </svg>
      );
    case "srv10": // Driving License
      return (
        <svg viewBox="0 0 100 100" className="w-10 h-10 shrink-0 select-none">
          <circle cx="50" cy="50" r="45" fill="#F0F9FF" stroke="#0369A1" strokeWidth="2.5" />
          <circle cx="50" cy="50" r="28" fill="none" stroke="#0284C7" strokeWidth="5.5" />
          <circle cx="50" cy="50" r="8" fill="#0284C7" />
          <line x1="50" y1="50" x2="50" y2="78" stroke="#0284C7" strokeWidth="5" />
          <line x1="50" y1="50" x2="25" y2="35" stroke="#0284C7" strokeWidth="5" />
          <line x1="50" y1="50" x2="75" y2="35" stroke="#0284C7" strokeWidth="5" />
          <text x="50" y="92" textAnchor="middle" fill="#0369A1" fontSize="7" fontWeight="bold">SARATHI</text>
        </svg>
      );
    case "srv11": // Death Certificate
      return (
        <svg viewBox="0 0 100 100" className="w-10 h-10 shrink-0 select-none">
          <circle cx="50" cy="50" r="45" fill="#F8FAFC" stroke="#475569" strokeWidth="2.5" />
          <g stroke="#334155" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" transform="translate(0, 3)">
            <path d="M 32,45 C 40,43 50,49 50,49 C 50,49 60,43 68,45 L 68,72 C 60,70 50,76 50,76 C 50,76 40,70 32,72 Z" />
            <line x1="50" y1="49" x2="50" y2="76" />
            <path d="M 68,34 C 68,34 56,36 54,48" stroke="#64748B" strokeWidth="1.5" />
          </g>
          <text x="50" y="91" textAnchor="middle" fill="#334155" fontSize="7.5" fontWeight="bold">DEATH CERT</text>
        </svg>
      );
    case "srv12": // ABHA Card
      return (
        <svg viewBox="0 0 100 100" className="w-10 h-10 shrink-0 select-none">
          <circle cx="50" cy="50" r="45" fill="#EFF6FF" stroke="#2563EB" strokeWidth="2.5" />
          <path d="M 15,50 L 35,50 L 42,20 L 50,80 L 58,40 L 63,55 L 70,50 L 85,50" fill="none" stroke="#1D4ED8" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          <g transform="translate(42,32) scale(0.35)" fill="#EA580C">
            <path d="M 25,0 L 50,15 L 50,45 C 50,65 25,80 25,80 C 25,80 0,65 0,45 L 0,15 Z" />
            <rect x="21" y="20" width="8" height="25" fill="#FFFFFF" rx="1" />
            <rect x="12" y="29" width="26" height="8" fill="#FFFFFF" rx="1" />
          </g>
          <text x="50" y="92" textAnchor="middle" fill="#1D4ED8" fontSize="7.5" fontWeight="black" letterSpacing="0.5">ABHA</text>
        </svg>
      );
    case "srv_swasthya": // Swasthya Sathi Card
      return (
        <svg viewBox="0 0 100 100" className="w-10 h-10 shrink-0 select-none">
          <circle cx="50" cy="50" r="45" fill="#F0FDF4" stroke="#16A34A" strokeWidth="2.5" />
          <path d="M 50,75 C 15,50 30,22 50,38 C 70,22 85,50 50,75 Z" fill="#DCFCE7" stroke="#16A34A" strokeWidth="2" />
          <g fill="#15803D" stroke="none" transform="translate(0, 1)">
            <circle cx="43" cy="46" r="3.2" />
            <path d="M 38,58 C 38,51 48,51 48,58 L 46,69 L 40,69 Z" />
            <circle cx="57" cy="48" r="3" />
            <path d="M 52,60 C 52,53 62,53 62,60 L 60,69 L 54,69 Z" />
          </g>
          <text x="50" y="91" textAnchor="middle" fill="#15803D" fontSize="7" fontWeight="bold">SWASTHYA</text>
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 100 100" className="w-10 h-10 shrink-0 select-none">
          <circle cx="50" cy="50" r="45" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="2" />
          <circle cx="50" cy="50" r="15" fill="#64748B" />
        </svg>
      );
  }
};

const getCategoryIcon = (iconName: string) => {
  switch (iconName) {
    case "Award": return Award;
    case "Briefcase": return Briefcase;
    case "GraduationCap": return GraduationCap;
    case "IdCard": return IdCard;
    case "FileText": return FileText;
    case "HeartPulse": return HeartPulse;
    case "MapPin": return MapPin;
    case "Laptop": return Laptop;
    case "Globe": return Globe;
    case "Bell": return Bell;
    case "Grid": return Grid;
    default: return Grid;
  }
};

const getCategoryStyle = (id: string) => {
  switch (id) {
    case "all":
      return {
        bgActive: "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-orange-600 shadow-md",
        bgDefault: "bg-white hover:bg-amber-50/15 text-slate-700 border-slate-200/70 hover:border-amber-305",
        iconBgActive: "bg-white/20 text-white",
        iconBgDefault: "bg-amber-50 text-amber-600",
      };
    case "jobs":
      return {
        bgActive: "bg-gradient-to-r from-blue-600 to-indigo-650 text-white border-blue-700 shadow-md",
        bgDefault: "bg-white hover:bg-blue-50/15 text-slate-700 border-slate-200/70 hover:border-blue-300",
        iconBgActive: "bg-white/20 text-white",
        iconBgDefault: "bg-blue-50 text-blue-600",
      };
    case "scholarships":
      return {
        bgActive: "bg-gradient-to-r from-emerald-600 to-teal-650 text-white border-emerald-700 shadow-md",
        bgDefault: "bg-white hover:bg-emerald-50/15 text-slate-700 border-slate-200/70 hover:border-emerald-300",
        iconBgActive: "bg-white/20 text-white",
        iconBgDefault: "bg-emerald-50 text-emerald-600",
      };
    case "welfare":
      return {
        bgActive: "bg-gradient-to-r from-orange-500 to-red-650 text-white border-orange-605 shadow-md",
        bgDefault: "bg-white hover:bg-orange-50/15 text-slate-700 border-slate-200/70 hover:border-orange-300",
        iconBgActive: "bg-white/20 text-white",
        iconBgDefault: "bg-orange-50 text-bengali-orange",
      };
    case "identity":
      return {
        bgActive: "bg-gradient-to-r from-violet-600 to-purple-650 text-white border-violet-700 shadow-md",
        bgDefault: "bg-white hover:bg-violet-50/15 text-slate-700 border-slate-200/70 hover:border-violet-300",
        iconBgActive: "bg-white/20 text-white",
        iconBgDefault: "bg-violet-50 text-violet-600",
      };
    case "utility":
      return {
        bgActive: "bg-gradient-to-r from-teal-500 to-cyan-600 text-white border-teal-600 shadow-md",
        bgDefault: "bg-white hover:bg-teal-50/15 text-slate-700 border-slate-200/70 hover:border-teal-300",
        iconBgActive: "bg-white/20 text-white",
        iconBgDefault: "bg-teal-50 text-teal-600",
      };
    case "health":
      return {
        bgActive: "bg-gradient-to-r from-rose-500 to-pink-605 text-white border-rose-600 shadow-md",
        bgDefault: "bg-white hover:bg-rose-50/15 text-slate-705 border-slate-200/70 hover:border-rose-300",
        iconBgActive: "bg-white/20 text-white",
        iconBgDefault: "bg-rose-50 text-rose-600",
      };
    case "land":
      return {
        bgActive: "bg-gradient-to-r from-amber-600 to-[#8D3F0D] text-white border-[#75340A] shadow-md",
        bgDefault: "bg-white hover:bg-amber-50/15 text-slate-700 border-slate-200/70 hover:border-amber-400",
        iconBgActive: "bg-white/20 text-white",
        iconBgDefault: "bg-amber-50 text-amber-700",
      };
    case "cyber_cafe":
      return {
        bgActive: "bg-gradient-to-r from-[#A94F12] to-amber-700 text-white border-orange-850 shadow-md",
        bgDefault: "bg-white hover:bg-orange-50/15 text-slate-700 border-slate-200/70 hover:border-[#A94F12]/40",
        iconBgActive: "bg-white/20 text-white",
        iconBgDefault: "bg-orange-100 text-bengali-orange",
      };
    default:
      return {
        bgActive: "bg-gradient-to-r from-indigo-500 to-indigo-700 text-white border-indigo-700 shadow-md",
        bgDefault: "bg-white hover:bg-indigo-50/15 text-slate-700 border-slate-200/70 hover:border-indigo-300",
        iconBgActive: "bg-white/20 text-white",
        iconBgDefault: "bg-indigo-50 text-indigo-600",
      };
  }
};

export default function App() {
  // Global States (shared state for instant reactions)
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [updates, setUpdates] = useState<AppUpdate[]>(INITIAL_UPDATES);
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [firebaseStatus, setFirebaseStatus] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [docCategory, setDocCategory] = useState<string>("all");
  const [settings, setSettings] = useState<{ geminiApiKey: string }>({ geminiApiKey: "" });

  const allDashboardItems = useMemo(() => {
    const list: any[] = [];

    // 1. Schemes -> welfare category
    if (Array.isArray(schemes)) {
      schemes.forEach((item) => {
        list.push({
          id: item.id,
          title: item.title,
          subtitle: item.titleEn || item.categoryName || "সরকারি প্রকল্প",
          cat: "welfare",
          badge: item.categoryName || "জনকল্যাণ",
          btnText: "আবেদন গাইড",
          description: item.description || `সুবিধা: ${item.benefits || ""} | যোগ্যতা: ${item.eligibility || ""}`,
          steps: item.documents && item.documents.length > 0
            ? item.documents.map(d => `প্রয়োজনীয় নথি: ${d}`)
            : [
                "দুয়ারে সরকার ক্যাম্প বা পঞ্চায়েত অফিস থেকে ফর্ম সংগ্রহ করুন।",
                "প্রয়োজনীয় নথি সংযুক্ত করে ফর্মটি সতর্কভাবে পূরণ করুন।",
                "অনুমোদনের পর সরাসরি ব্যাংক অ্যাকাউন্টে টাকা পাঠানো হবে।"
              ],
          officialUrl: item.officialUrl || "https://wb.gov.in",
          logoUrl: item.logoUrl || ""
        });
      });
    }

    // 2. Jobs -> jobs category
    if (Array.isArray(jobs)) {
      jobs.forEach((item) => {
        list.push({
          id: item.id,
          title: item.title,
          subtitle: item.subtitle || item.categoryName || "নিয়োগ বিজ্ঞপ্তি",
          cat: "jobs",
          badge: item.categoryName || "সরকারি চাকরি",
          btnText: "আবেদন করুন",
          description: item.description || `শূন্যপদ: ${item.vacancy || "বিজ্ঞপ্তি অনুযায়ী"} | যোগ্যতা: ${item.qualification || "যোগ্যতা দেখুন"} | শেষ তারিখ: ${item.lastDate || "শীঘ্রই আসবে"}`,
          steps: [
            "ভারতের অফিসিয়াল রিক্রুটমেন্ট পোর্টালে ভিজিট করুন।",
            "নতুন নোটিফিকেশন থেকে সঠিক বিজ্ঞপ্তি বেছে নিন।",
            "ব্যক্তিগত ও শিক্ষাগত যোগ্যতা ফর্মটি ফিলাপ করুন।",
            "প্রয়োজনীয় ফটো, স্বাক্ষর সাবমিট করে পে স্লিপ এবং ফর্ম প্রিন্ট করুন।"
          ],
          officialUrl: item.officialUrl || "https://wb.gov.in",
          logoUrl: item.logoUrl || ""
        });
      });
    }

    // 3. Scholarships -> scholarships category
    if (Array.isArray(scholarships)) {
      scholarships.forEach((item) => {
        list.push({
          id: item.id,
          title: item.title,
          subtitle: item.amount || "শিক্ষাবৃত্তি অনুদান",
          cat: "scholarships",
          badge: "স্কলারশিপ",
          btnText: "আবেদন গাইড",
          description: item.description || `পরিমাপ: ${item.amount || ""} | যোগ্যতা: ${item.eligibility || ""} | শেষ তারিখ: ${item.lastDate || ""}`,
          steps: [
            "স্কলারশিপের অনলাইন পোর্টালে ভিজিট করুন।",
            "নতুন নিবন্ধকরণ সম্পন্ন করে আধার ও ব্যাংক লিঙ্ক করুন।",
            "প্রয়োজনীয় নথিপত্র এবং পূর্ববর্তী মার্কশিট আপলোড করুন।",
            "চূড়ান্ত কপি প্রতিষ্ঠানে জমা দিয়ে ভেরিফিকেশন করান।"
          ],
          officialUrl: item.officialUrl || "https://wb.gov.in",
          logoUrl: item.logoUrl || ""
        });
      });
    }

    // 4. Services -> identity, utility, health, land categories
    if (Array.isArray(services)) {
      services.forEach((item) => {
        let mappedCat = item.category;
        if (mappedCat === "aadhaar_pan") {
          mappedCat = "identity";
        } else if (mappedCat === "certificates") {
          mappedCat = "utility";
        }
        
        const existingIdx = list.findIndex((e) => e.id === item.id);
        if (existingIdx !== -1) {
          // Merge to enrich with the more detailed steps and fields from services
          list[existingIdx] = {
            ...list[existingIdx],
            steps: item.steps && item.steps.length > 0 ? item.steps : list[existingIdx].steps,
            description: item.description || list[existingIdx].description,
            badge: item.badge || list[existingIdx].badge || item.categoryName,
            btnText: item.btnText || list[existingIdx].btnText,
            subtitle: item.subtitle || list[existingIdx].subtitle || item.categoryName,
            logoUrl: item.logoUrl || list[existingIdx].logoUrl || ""
          };
        } else {
          list.push({
            id: item.id,
            title: item.title,
            subtitle: item.subtitle || item.categoryName || "ডিজিটাল সেবা",
            category: mappedCat,
            categoryName: item.categoryName || "সেবা",
            description: item.description || "ডিজিটাল পোর্টাল আবেদন প্রক্রিয়া ও সহায়তা",
            badge: item.badge || "ডিজিটাল",
            officialUrl: item.officialUrl || "https://wb.gov.in",
            btnText: item.btnText || "আবেদন লিংক",
            steps: item.steps || [],
            logoUrl: item.logoUrl || ""
          });
        }
      });
    }

    return list;
  }, [schemes, jobs, scholarships, services]);

  const displayedItems = useMemo(() => {
    return allDashboardItems.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        docCategory === "all" ||
        item.cat === docCategory ||
        item.category === docCategory;

      return matchesSearch && matchesCategory;
    });
  }, [allDashboardItems, searchQuery, docCategory]);

  // Fetch and sync all databases in real-time
  useEffect(() => {
    let unsubSchemes = () => {};
    let unsubJobs = () => {};
    let unsubScholarships = () => {};
    let unsubServices = () => {};
    let unsubCategories = () => {};

    if (!isPlaceholderFirebase) {
      try {
        if (rtdb) {
          unsubSchemes = onRtdbValue(rtdbRef(rtdb, "schemes"), (snapshot) => {
            const val = snapshot.val();
            if (val) {
              const list = Array.isArray(val)
                ? val.filter(Boolean)
                : Object.keys(val).map((k) => val[k]);
              if (list.length > 0) setSchemes(list);
            }
          }, (err) => {
            console.warn("Client-side schemes RTDB listener skipped:", err);
          });

          unsubJobs = onRtdbValue(rtdbRef(rtdb, "jobs"), (snapshot) => {
            const val = snapshot.val();
            if (val) {
              const list = Array.isArray(val)
                ? val.filter(Boolean)
                : Object.keys(val).map((k) => val[k]);
              if (list.length > 0) setJobs(list);
            }
          }, (err) => {
            console.warn("Client-side jobs RTDB listener skipped:", err);
          });

          unsubScholarships = onRtdbValue(rtdbRef(rtdb, "scholarships"), (snapshot) => {
            const val = snapshot.val();
            if (val) {
              const list = Array.isArray(val)
                ? val.filter(Boolean)
                : Object.keys(val).map((k) => val[k]);
              if (list.length > 0) setScholarships(list);
            }
          }, (err) => {
            console.warn("Client-side scholarships RTDB listener skipped:", err);
          });

          unsubServices = onRtdbValue(rtdbRef(rtdb, "services"), (snapshot) => {
            const val = snapshot.val();
            if (val) {
              const list = Array.isArray(val)
                ? val.filter(Boolean)
                : Object.keys(val).map((k) => val[k]);
              if (list.length > 0) setServices(list);
            }
          }, (err) => {
            console.warn("Client-side services RTDB listener skipped:", err);
          });

          unsubCategories = onRtdbValue(rtdbRef(rtdb, "categories"), (snapshot) => {
            const val = snapshot.val();
            if (val) {
              const list = Array.isArray(val)
                ? val.filter(Boolean)
                : Object.keys(val).map((k) => val[k]);
              if (list.length > 0) setCategories(list);
            }
          }, (err) => {
            console.warn("Client-side categories RTDB listener skipped:", err);
          });
        } else {
          unsubSchemes = onSnapshot(collection(db, "schemes"), (snapshot) => {
            const list: Scheme[] = [];
            snapshot.forEach((doc) => {
              list.push(doc.data() as Scheme);
            });
            if (list.length > 0) {
              setSchemes(list);
            }
          }, (err) => {
            console.warn("Client-side schemes onSnapshot listener skipped:", err);
          });

          unsubJobs = onSnapshot(collection(db, "jobs"), (snapshot) => {
            const list: Job[] = [];
            snapshot.forEach((doc) => {
              list.push(doc.data() as Job);
            });
            if (list.length > 0) {
              setJobs(list);
            }
          }, (err) => {
            console.warn("Client-side jobs onSnapshot listener skipped:", err);
          });

          unsubScholarships = onSnapshot(collection(db, "scholarships"), (snapshot) => {
            const list: Scholarship[] = [];
            snapshot.forEach((doc) => {
              list.push(doc.data() as Scholarship);
            });
            if (list.length > 0) {
              setScholarships(list);
            }
          }, (err) => {
            console.warn("Client-side scholarships onSnapshot listener skipped:", err);
          });

          unsubServices = onSnapshot(collection(db, "services"), (snapshot) => {
            const list: ServiceItem[] = [];
            snapshot.forEach((doc) => {
              list.push(doc.data() as ServiceItem);
            });
            if (list.length > 0) {
              setServices(list);
            }
          }, (err) => {
            console.warn("Client-side services onSnapshot listener skipped:", err);
          });

          unsubCategories = onSnapshot(collection(db, "categories"), (snapshot) => {
            const list: CategoryItem[] = [];
            snapshot.forEach((doc) => {
              list.push(doc.data() as CategoryItem);
            });
            if (list.length > 0) {
              setCategories(list);
            }
          }, (err) => {
            console.warn("Client-side categories onSnapshot listener skipped:", err);
          });
        }
      } catch (err) {
        console.warn("Failed to attach client-side real-time listeners:", err);
      }
    }

    // Load initial status, settings, and REST-based data as fallback/complements
    const loadAllStatusAndFallback = async () => {
      try {
        const [statusR, settingsR] = await Promise.all([
          fetch("/api/firebase/status").then(r => r.json()).catch(() => null),
          fetch("/api/settings").then(r => r.json()).catch(() => ({ geminiApiKey: "" }))
        ]);

        if (statusR) setFirebaseStatus(statusR);
        if (settingsR) setSettings(settingsR);

        // Fetch fallback REST data if onSnapshot has not initialized data yet
        const schemesR = await fetch("/api/schemes").then(r => r.json()).catch(() => []);
        if (Array.isArray(schemesR) && schemesR.length > 0) {
          setSchemes((prev) => prev.length === 0 ? schemesR : prev);
        }

        const jobsR = await fetch("/api/jobs").then(r => r.json()).catch(() => []);
        if (Array.isArray(jobsR) && jobsR.length > 0) {
          setJobs((prev) => prev.length === 0 ? jobsR : prev);
        }

        const scholarshipsR = await fetch("/api/scholarships").then(r => r.json()).catch(() => []);
        if (Array.isArray(scholarshipsR) && scholarshipsR.length > 0) {
          setScholarships((prev) => prev.length === 0 ? scholarshipsR : prev);
        }

        const servicesR = await fetch("/api/services").then(r => r.json()).catch(() => []);
        if (Array.isArray(servicesR) && servicesR.length > 0) {
          setServices((prev) => prev.length === 0 ? servicesR : prev);
        }

        const categoriesR = await fetch("/api/categories").then(r => r.json()).catch(() => []);
        if (Array.isArray(categoriesR) && categoriesR.length > 0) {
          setCategories((prev) => prev.length === 0 ? categoriesR : prev);
        }
      } catch (err) {
        console.error("Failed to load initial settings / fallback data:", err);
      }
    };

    loadAllStatusAndFallback();

    return () => {
      unsubSchemes();
      unsubJobs();
      unsubScholarships();
      unsubServices();
      unsubCategories();
    };
  }, []);

  const handleCreateScheme = async (scheme: Scheme) => {
    try {
      await fetch("/api/schemes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(scheme)
      });
      setSchemes((prev) => [scheme, ...prev]);
    } catch (err) {
      console.error("Error creating scheme:", err);
    }
  };
  const handleSaveScheme = async (scheme: Scheme) => {
    try {
      await fetch("/api/schemes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(scheme)
      });
      setSchemes((prev) => prev.map((s) => (s.id === scheme.id ? scheme : s)));
    } catch (err) {
      console.error("Error saving scheme:", err);
    }
  };
  const handleDeleteScheme = async (id: string) => {
    try {
      await fetch(`/api/schemes/${id}`, { method: "DELETE" });
      setSchemes((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Error deleting scheme:", err);
    }
  };

  const handleCreateJob = async (job: Job) => {
    try {
      await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(job)
      });
      setJobs((prev) => [job, ...prev]);
    } catch (err) {
      console.error("Error creating job:", err);
    }
  };
  const handleSaveJob = async (job: Job) => {
    try {
      await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(job)
      });
      setJobs((prev) => prev.map((j) => (j.id === job.id ? job : j)));
    } catch (err) {
      console.error("Error saving job:", err);
    }
  };
  const handleDeleteJob = async (id: string) => {
    try {
      await fetch(`/api/jobs/${id}`, { method: "DELETE" });
      setJobs((prev) => prev.filter((j) => j.id !== id));
    } catch (err) {
      console.error("Error deleting job:", err);
    }
  };

  const handleCreateScholarship = async (scholarship: Scholarship) => {
    try {
      await fetch("/api/scholarships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(scholarship)
      });
      setScholarships((prev) => [scholarship, ...prev]);
    } catch (err) {
      console.error("Error creating scholarship:", err);
    }
  };
  const handleSaveScholarship = async (scholarship: Scholarship) => {
    try {
      await fetch("/api/scholarships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(scholarship)
      });
      setScholarships((prev) => prev.map((s) => (s.id === scholarship.id ? scholarship : s)));
    } catch (err) {
      console.error("Error saving scholarship:", err);
    }
  };
  const handleDeleteScholarship = async (id: string) => {
    try {
      await fetch(`/api/scholarships/${id}`, { method: "DELETE" });
      setScholarships((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Error deleting scholarship:", err);
    }
  };

  const handleCreateService = async (service: ServiceItem) => {
    try {
      await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(service)
      });
      setServices((prev) => [service, ...prev]);
    } catch (err) {
      console.error("Error creating service:", err);
    }
  };
  const handleSaveService = async (service: ServiceItem) => {
    try {
      await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(service)
      });
      setServices((prev) => prev.map((s) => (s.id === service.id ? service : s)));
    } catch (err) {
      console.error("Error saving service:", err);
    }
  };
  const handleDeleteService = async (id: string) => {
    try {
      await fetch(`/api/services/${id}`, { method: "DELETE" });
      setServices((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Error deleting service:", err);
    }
  };

  const handleSaveCategory = async (cat: CategoryItem) => {
    try {
      await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cat)
      });
      setCategories((prev) => {
        const idx = prev.findIndex((c) => c.id === cat.id);
        if (idx !== -1) {
          const copy = [...prev];
          copy[idx] = cat;
          return copy;
        } else {
          return [cat, ...prev];
        }
      });
    } catch (err) {
      console.error("Error saving category:", err);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await fetch(`/api/categories/${id}`, { method: "DELETE" });
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Error deleting category:", err);
    }
  };

  const handleSaveSettings = async (newSettings: { geminiApiKey: string }) => {
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSettings),
      });
      const data = await res.json();
      if (data.success) {
        setSettings(newSettings);
        return true;
      }
    } catch (err) {
      console.error("Error saving settings:", err);
    }
    return false;
  };

  // Filter and Search States
  const [activeSchemeTab, setActiveSchemeTab] = useState<"all" | "women" | "students" | "farmers" | "senior" | "workers">("all");
  const [activeJobTab, setActiveJobTab] = useState<"all" | "wbpsc" | "police" | "railway" | "banking" | "defence" | "private" | "internship">("all");

  // Dialog/Modal states
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  // Widget Toggles
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Admin Official Login Password states
  const [showAdminPasswordModal, setShowAdminPasswordModal] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState("");
  const [adminPasswordError, setAdminPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleAdminPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPasswordInput === "100") {
      setIsAdminOpen(true);
      setShowAdminPasswordModal(false);
      setAdminPasswordInput("");
      setAdminPasswordError("");
      triggerPushBroadcast("অফিসিয়াল অ্যাডমিন লগইন সফল! আপনি এখন স্কলারশিপ, প্রকল্প ও চাকরি এডিট করতে পারবেন।");
    } else {
      setAdminPasswordError("ভুল পাসওয়ার্ড! অনুগ্রহ করে সঠিক পাসওয়ার্ড দিন।");
    }
  };

  // Dynamic user bookmarked schemes & jobs (Saved lists)
  const [savedSchemeIds, setSavedSchemeIds] = useState<string[]>([]);
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);

  // Simulation Alert/Push Notifications State
  const [broadcastNotices, setBroadcastNotices] = useState<string[]>([
    "স্বাগতম! বাংলার সেবা নাগরিক সেবা পোর্টালে পশ্চিমবঙ্গ রাজ্য সরকারের সমস্ত সামাজিক প্রকল্প, নিয়োগ এবং বৃত্তি সংক্রান্ত নির্ভরযোগ্য তথ্য বাংলায় পাবেন।"
  ]);

  // Subscription Alerts (WhatsApp & Telegram signup)
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [subType, setSubType] = useState<"WhatsApp" | "Telegram" | null>(null);
  const [mobileNumber, setMobileNumber] = useState("");
  const [subSuccess, setSubTypeSuccess] = useState(false);

  // Additional user interface states (satisfying design constraints)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("হোম");
  const [showMoreServicesModal, setShowMoreServicesModal] = useState(false);
  const [activeLegalModal, setActiveLegalModal] = useState<"terms" | "disclaimer" | "privacy" | null>(null);

  // Bookmark toggler helpers
  const toggleSaveScheme = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSavedSchemeIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSaveJob = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSavedJobIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const savedSchemesList = useMemo(() => {
    return schemes.filter((s) => savedSchemeIds.includes(s.id));
  }, [schemes, savedSchemeIds]);

  const savedJobsList = useMemo(() => {
    return jobs.filter((j) => savedJobIds.includes(j.id));
  }, [jobs, savedJobIds]);

  // Search logic covering titles, categories, subtitles, descriptions, etc.
  const filteredSchemes = useMemo(() => {
    return schemes.filter((scheme) => {
      const matchesSearch =
        scheme.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scheme.benefits.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scheme.eligibility.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTab = activeSchemeTab === "all" || scheme.category === activeSchemeTab;
      return matchesSearch && matchesTab;
    });
  }, [schemes, searchQuery, activeSchemeTab]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.qualification.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTab = activeJobTab === "all" || job.category === activeJobTab;
      return matchesSearch && matchesTab;
    });
  }, [jobs, searchQuery, activeJobTab]);

  const triggerPushBroadcast = (text: string) => {
    setBroadcastNotices((prev) => [text, ...prev]);
  };

  const handleSubscribeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobileNumber) return;
    setSubTypeSuccess(true);
    setTimeout(() => {
      setShowSubscriptionModal(false);
      setMobileNumber("");
      setSubTypeSuccess(false);
    }, 2500);
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-[#F9FBFC] text-slate-800 transition-all duration-300 text-sm">
      
      {/* 1. TOP BROADCAST ALERT BAND (Persistent Info) */}
      <div className="bg-gradient-to-r from-[#A94F12] to-[#E96A1F] text-white py-2 px-4 shadow-inner text-center text-xs md:text-sm font-semibold flex flex-col sm:flex-row items-center justify-center gap-2 relative z-50">
        <span className="bg-amber-400 text-slate-900 text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase leading-none shrink-0 tracking-wider animate-pulse">আজকের বিজ্ঞপ্তি</span>
        <p className="whitespace-normal break-words leading-relaxed text-slate-50">পশ্চিমবঙ্গ নতুন জনকল্যাণ প্রকল্প, নিয়োগ বিজ্ঞপ্তি ও স্কলারশিপের সর্বশেষ নির্ভরযোগ্য তথ্য জানতে এআই সহায়তা চ্যাট ব্যবহার করুন।</p>
      </div>

      {/* 2. TOP METADATA & ACCESSIBILITY WIDGETS BAR */}
      <div className="bg-slate-50 border-b border-slate-200/50 px-4 md:px-8 py-1 text-slate-600 text-xs flex flex-wrap items-center justify-between gap-2.5 select-none">
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-[10px] bg-slate-200 text-slate-700 font-bold px-1.5 py-0.5 rounded">বেসরকারি নাগরিক পোর্টাল</span>
          <div className="hidden sm:flex items-center gap-1.5 text-slate-550">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>সার্ভার স্ট্যাটাস: <strong className="text-slate-700">সক্রিয়</strong></span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Official Login (Admin switch with password) */}
          <button
            id="admin-btn"
            onClick={() => {
              if (isAdminOpen) {
                setIsAdminOpen(false);
                triggerPushBroadcast("অফিসিয়াল সেশন সমাপ্ত করা হয়েছে।");
              } else {
                setAdminPasswordInput("");
                setAdminPasswordError("");
                setShowAdminPasswordModal(true);
              }
            }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md border text-[11px] font-semibold transition-all cursor-pointer ${
              isAdminOpen
                ? "bg-slate-900 border-slate-900 text-white shadow-xs scale-[1.01]"
                : "bg-white border-slate-300 text-slate-700 hover:bg-[#E96A1F]/5"
            }`}
          >
            <Settings className={`h-3.5 w-3.5 ${isAdminOpen ? "animate-spin" : ""}`} />
            <span>{isAdminOpen ? "হোমপেজ ফিরুন" : "অফিসিয়াল লগইন"}</span>
          </button>
        </div>
      </div>
      <header className="bg-white py-4 px-4 md:px-8 border-b border-orange-100/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative select-none">
        {/* Left Side: Brand Name & Double Tagline aligned cleanly to the left margins */}
        <div className="w-full md:w-auto">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-xl md:text-2xl text-[#E96A1F] tracking-tight leading-none">
                বাংলার সেবা
              </h1>
              <span className="bg-[#E96A1F]/10 text-[#A94F12] text-[9px] font-extrabold px-1.5 py-0.5 rounded">নাগরিক গাইড</span>
            </div>
            {/* Tagline 1 */}
            <p className="text-[11px] text-slate-800 font-semibold leading-normal mt-1.5 font-sans">
              আপনার সেবা, আপনার তথ্য, এক প্ল্যাটফর্মে (বেসরকারি উদ্যোগ)
            </p>
            {/* Tagline 2 */}
            <p className="text-[10px] text-slate-500 font-medium leading-none mt-0.5 font-sans">
              পশ্চিমবঙ্গ রাজ্য সামাজিক সুরক্ষা ও জনকল্যাণ প্রকল্প নির্দেশিকা
            </p>
          </div>
        </div>

        {/* Right Side: Contact Hub (WhatsApp & Direct Phone Call) */}
        <div className="flex flex-row items-center gap-2 w-full md:w-auto justify-stretch md:justify-end">
          <a
            href="https://wa.me/919382040746"
            target="_blank"
            rel="noreferrer"
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-3 py-2.5 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs border border-emerald-600 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer font-sans text-center"
          >
            {/* Custom SVG WhatsApp Icon */}
            <svg 
              className="h-4 w-4 fill-current shrink-0" 
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413" />
            </svg>
            <span>হোয়াটসঅ্যাপ</span>
          </a>

          <a
            href="tel:9382040746"
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-3 py-2.5 bg-[#E96A1F] hover:bg-[#A94F12] active:bg-[#8D3F0D] text-white font-extrabold text-xs rounded-xl shadow-xs border border-orange-600 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer font-sans text-center"
          >
            <Phone className="h-3.8 w-3.8 shrink-0" />
            <span>সরাসরি কল</span>
          </a>
        </div>
      </header>

      {/* 4. TOTAL WIDTH ACCESSIBLE NAVIGATION BAR (Official Government Portal style) */}
      <nav className="bg-[#A94F12] text-white shadow-sm relative z-40 select-none border-b border-[#8D3F0D]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-0 flex items-center justify-between">
          
          {/* Desktop Links (Visible on Tablet/Desktop) - Professional non-button flat design */}
          <ul className="hidden lg:flex items-center flex-wrap">
            {[
              { label: "হোম", href: "#hero" },
              { label: "অফিসিয়াল ওয়েবসাইট", href: "#services" },
              { label: "সাইবার ক্যাফে", href: "#cyber-cafe" },
              { label: "সাহায্য ও সহায়তা", href: "#help" }
            ].map((item, idx) => {
              const isActive = activeNav === item.label;
              return (
                <li key={idx} className="border-r border-white/10 last:border-0">
                  <a
                    href={item.href}
                    onClick={(e) => {
                      setActiveNav(item.label);
                      if (item.label === "সাহায্য ও সহায়তা") {
                        e.preventDefault();
                        setIsAiOpen(true);
                      } else if (item.label === "হোম") {
                        e.preventDefault();
                        setSearchQuery("");
                        setActiveSchemeTab("all");
                        setActiveJobTab("all");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      } else if (item.label === "অফিসিয়াল ওয়েবসাইট") {
                        e.preventDefault();
                        document.getElementById("services-anchor")?.scrollIntoView({ behavior: "smooth" });
                      } else if (item.label === "সাইবার ক্যাফে") {
                        e.preventDefault();
                        setDocCategory("cyber_cafe");
                        setTimeout(() => {
                          document.getElementById("digital-document-hub-section")?.scrollIntoView({ behavior: "smooth" });
                        }, 50);
                      }
                    }}
                    className={`inline-flex items-center px-4.5 py-3 text-xs font-bold uppercase transition-all tracking-wide relative group cursor-pointer ${
                      isActive
                        ? "text-amber-300 bg-[#8D3F0D]/60"
                        : "text-orange-50 hover:text-white hover:bg-[#8D3F0D]/20"
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      {item.label === "সাহায্য ও সহায়তা" && (
                        <MessageSquare className="h-3.5 w-3.5 text-amber-300 animate-pulse shrink-0" />
                      )}
                      <span>{item.label === "সাহায্য ও সহায়তা" ? "সাহায্য ও সহায়তা (এআই চ্যাট)" : item.label}</span>
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>

          {/* Mobile Navigation bar with direct compact links (Clean official flat tabs, not buttons) */}
          <div className="lg:hidden flex items-center justify-between w-full py-0 overflow-x-auto scrollbar-none gap-2">
            <div className="flex items-center whitespace-nowrap overflow-x-auto scrollbar-none">
              {[
                { label: "হোম", target: "hero" },
                { label: "অফিসিয়াল ওয়েবসাইট", target: "services" },
                { label: "সাইবার ক্যাফে", target: "cyber_cafe" }
              ].map((item, idx) => {
                const isItemActive = activeNav === item.label;
                return (
                  <button
                    key={idx}
                    onClick={(e) => {
                      setActiveNav(item.label);
                      if (item.target === "hero") {
                        setSearchQuery("");
                        setActiveSchemeTab("all");
                        setActiveJobTab("all");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      } else if (item.target === "services") {
                        document.getElementById("services-anchor")?.scrollIntoView({ behavior: "smooth" });
                      } else if (item.target === "cyber_cafe") {
                        setDocCategory("cyber_cafe");
                        setTimeout(() => {
                          document.getElementById("digital-document-hub-section")?.scrollIntoView({ behavior: "smooth" });
                        }, 50);
                      }
                    }}
                    className={`px-3 py-2.5 text-xs font-bold transition-all relative cursor-pointer ${
                      isItemActive
                        ? "text-amber-300 bg-[#8D3F0D]/60 font-extrabold"
                        : "text-orange-100 hover:text-white"
                    }`}
                  >
                    <span>{item.label}</span>
                    {isItemActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-amber-400"></span>
                    )}
                  </button>
                );
              })}
            </div>
            
            {/* Simple Help / Ai shortcut - styled as a refined clean text tab link with chat icon */}
            <button
              onClick={() => {
                setActiveNav("সাহায্য ও সহায়তা");
                setIsAiOpen(true);
              }}
              className={`px-3 py-2.5 text-xs font-bold text-amber-300 hover:text-white flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer relative ${
                activeNav === "সাহায্য ও সহায়তা" ? "bg-[#8D3F0D]/60 font-extrabold" : ""
              }`}
            >
              <MessageSquare className="h-3.5 w-3.5 text-amber-300 animate-pulse shrink-0" />
              <span>সহায়তা (এআই চ্যাট)</span>
              {activeNav === "সাহায্য ও সহায়তা" && (
                <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-amber-400"></span>
              )}
            </button>
          </div>
 
        </div>
      </nav>





      {/* Main Container / Content Conditional (re-wired properly) */}
      <main className="flex-grow">
        {isAdminOpen ? (
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-10">
            <AdminPanel
              schemes={schemes}
              onCreateScheme={handleCreateScheme}
              onSaveScheme={handleSaveScheme}
              onDeleteScheme={handleDeleteScheme}
              jobs={jobs}
              onCreateJob={handleCreateJob}
              onSaveJob={handleSaveJob}
              onDeleteJob={handleDeleteJob}
              scholarships={scholarships}
              onCreateScholarship={handleCreateScholarship}
              onSaveScholarship={handleSaveScholarship}
              onDeleteScholarship={handleDeleteScholarship}
              services={services}
              onCreateService={handleCreateService}
              onSaveService={handleSaveService}
              onDeleteService={handleDeleteService}
              categories={categories}
              onSaveCategory={handleSaveCategory}
              onDeleteCategory={handleDeleteCategory}
              updates={updates}
              setUpdates={setUpdates}
              onClose={() => setIsAdminOpen(false)}
              triggerPushNotification={triggerPushBroadcast}
              firebaseStatus={firebaseStatus}
            />
          </div>
        ) : (
          <>
            {/* 1. SEAMLESS COMPACT SEARCH HERO (Lightened, modern light-orange-cream gradient) */}
            <div className="w-full bg-gradient-to-b from-amber-50/75 to-[#FFF8F4] py-8 md:py-14 px-4 md:px-8 border-b border-orange-100/70 select-none relative overflow-hidden">
              {/* Subtle background abstract shapes */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-black/10 rounded-full blur-2xl -ml-20 -mb-20 pointer-events-none"></div>
              
              <div className="max-w-4xl mx-auto text-center space-y-4 relative z-10">
                <h2 className="font-extrabold text-xl md:text-3xl text-slate-800 tracking-tight leading-tight">
                  পশ্চিমবঙ্গ রাজ্য সামাজিক সুরক্ষা ও জনকল্যাণ প্রকল্প নির্দেশিকা
                </h2>
                <p className="text-xs md:text-sm text-slate-500 font-semibold max-w-xl mx-auto">
                  আপনার প্রয়োজনীয় সরকারি প্রকল্প, চাকরি বা বৃত্তির সঠিক তথ্য বাংলায় অনুসন্ধান করুন
                </p>

                {/* Main Interactive Search Input */}
                <div className="max-w-2xl mx-auto mt-4 relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none font-bold">
                    <Search className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="অনুসন্ধান করুন..."
                    className="w-full bg-white text-slate-900 border border-orange-100/85 rounded-2xl pl-11 pr-4 py-3.5 text-sm md:text-base font-bold placeholder-slate-405 focus:outline-none focus:ring-4 focus:ring-orange-105/50 shadow-md"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 font-bold"
                    >
                      <X className="h-4.5 w-4.5" />
                    </button>
                  )}
                </div>

                {/* Dynamic Eye-Catching Compact Categories Grid */}
                <div className="max-w-4xl mx-auto mt-6 pt-4 border-t border-orange-100/40">
                  <p className="text-[10px] md:text-xs text-slate-400 font-bold tracking-widest uppercase mb-3.5 text-center">
                    সরাসরি প্রয়োজনীয় ডকুমেন্টস বা সরকারি কার্ড বিভাগে এগিয়ে যান
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-wrap md:justify-center gap-2 px-1">
                    {[
                      {
                        id: "all",
                        label: "সব নথি ও কার্ড",
                        desc: `${allDashboardItems.length}+ সরকারি সেবা`,
                        iconName: "Grid",
                      },
                      ...categories
                    ].map((cat) => {
                      const IconComponent = getCategoryIcon(cat.iconName);
                      const styles = getCategoryStyle(cat.id);
                      const isActive = docCategory === cat.id;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => {
                            setDocCategory(cat.id);
                            setTimeout(() => {
                              document.getElementById("digital-document-hub-section")?.scrollIntoView({ behavior: "smooth" });
                            }, 50);
                          }}
                          className={`flex items-center gap-2 px-2.5 py-1.5 md:px-3 md:py-2 rounded-xl border text-left transition-all duration-200 transform scale-100 hover:scale-[1.01] active:scale-95 cursor-pointer relative overflow-hidden group w-full md:w-auto md:min-w-[140px] md:max-w-[190px] ${
                            isActive ? styles.bgActive : styles.bgDefault
                          }`}
                        >
                          <div className={`p-1.5 rounded-lg transition-all shrink-0 ${
                            isActive ? styles.iconBgActive : styles.iconBgDefault
                          }`}>
                            <IconComponent className="h-3.8 w-3.8 shrink-0" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-extrabold text-[11px] leading-tight whitespace-normal break-words line-clamp-2">
                              {cat.label}
                            </span>
                            <span className={`text-[8.5px] font-semibold mt-0.5 line-clamp-1 leading-none ${isActive ? "text-white/85" : "text-slate-400"}`}>
                              {cat.desc}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. GANABHABAN BRANDED HUB OF OFFICIAL PORTALS - FLUSH WITH HERO */}
            <div id="services-anchor" />
            <section id="digital-document-hub-section" className="w-full bg-gradient-to-b from-[#FFF8F4] to-[#F9FBFC] pb-10 pt-4 px-4 md:px-8 border-b border-orange-100/40 animate-fade-in select-none">
              <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-orange-100/60 pb-5">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="p-2.5 bg-gradient-to-br from-orange-50 to-amber-100/60 text-bengali-orange rounded-2xl border border-orange-250/20 shadow-2xs">
                      <Shield className="h-5.5 w-5.5 text-bengali-orange animate-pulse" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-black text-base md:text-lg text-slate-800 tracking-tight">বাংলার সেবার সমস্ত অফিসিয়াল ওয়েবসাইট</h3>
                        {docCategory !== "all" && (
                          <span className="px-2 py-0.5 text-[10px] md:text-xs bg-orange-100 text-bengali-orange border border-orange-200/50 rounded-lg font-bold animate-fade-in">
                            {categories.find((c) => c.id === docCategory)?.label || docCategory}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">অরিジナル লোগো ও ডিজিটাল চিপ সংবলিত স্মার্ট কার্ড ডিরেক্টরি</p>
                    </div>
                  </div>
                </div>

                {/* Compact side-by-side cards grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5">
                  {displayedItems.length === 0 ? (
                    <div className="col-span-full py-16 px-4 text-center bg-white/65 backdrop-blur-xs border border-dashed border-orange-200 rounded-3xl animate-fade-in flex flex-col items-center justify-center space-y-2">
                      <HelpCircle className="h-10 w-10 text-orange-300" />
                      <p className="text-sm text-slate-700 font-extrabold font-sans">কোনো নাগরিক সেবা বা অফিশিয়াল লিংক পাওয়া যায়নি।</p>
                      <p className="text-xs text-slate-500 max-w-md">অফিসিয়াল লগইন (Admin) সেকশনে গিয়ে নতুন সেবা, প্রকল্প বা নোটিফিকেশন যুক্ত করুন, যা রিয়েল-টাইমে এখানে সরাসরি যুক্ত হবে।</p>
                    </div>
                  ) : (
                    displayedItems
                      .map((item) => {
                        return (
                          <div
                            key={item.id}
                            onClick={() => {
                              setSelectedService({
                                id: item.id,
                                title: item.title,
                                description: item.description,
                                steps: item.steps,
                                officialUrl: item.officialUrl,
                                category: item.cat,
                                categoryName: item.badge,
                                logoUrl: item.logoUrl || ""
                              });
                            }}
                            className="relative bg-white border border-slate-200/80 rounded-2xl p-3 hover:shadow-md cursor-pointer transition-all hover:-translate-y-1 duration-300 flex flex-col justify-between h-[155px] overflow-hidden group select-none hover:border-orange-250/90"
                          >
                            {/* Glow Gradient Stripe on Top simulating Real Plastic Smartcard overlay */}
                            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-orange-400 via-amber-400 to-emerald-400 opacity-80" />

                            <div className="space-y-2">
                              {/* Top Header Row of Card: Official Icon + Gold Chip */}
                              <div className="flex items-center justify-between">
                                {/* SVG Logo container */}
                                {item.logoUrl ? (
                                  <img 
                                    src={item.logoUrl} 
                                    className="w-10 h-10 rounded-lg object-contain border border-slate-100 p-0.5 bg-white shadow-3xs group-hover:scale-108 transition-all shrink-0" 
                                    referrerPolicy="no-referrer" 
                                    alt="" 
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                    }}
                                  />
                                ) : (
                                  <div className="group-hover:scale-108 transition-transform duration-250 shrink-0">
                                    {renderOfficialLogo(item.id)}
                                  </div>
                                )}

                                {/* Holographic Smartcard Golden Microchip & Dept Initials */}
                                <div className="flex flex-col items-end gap-1 shrink-0">
                                  <span className="text-[7.5px] font-extrabold text-slate-400 bg-slate-50 px-1 py-0.2 rounded-sm uppercase tracking-wider font-mono">
                                    {item.badge}
                                  </span>
                                  
                                  {/* Glowing Embedded Microchip Graphic */}
                                  <div className="w-5.5 h-4 rounded-sm bg-gradient-to-br from-amber-300 via-amber-400 to-yellow-200 border border-amber-400 p-[1.5px] flex flex-col justify-between relative overflow-hidden shrink-0 shadow-3xs">
                                    <div className="h-[0.5px] bg-amber-700/30 w-full" />
                                    <div className="flex justify-between">
                                      <div className="w-[0.5px] bg-amber-700/30 h-full" />
                                      <div className="w-1.5 h-1.5 rounded-full border border-amber-700/20 bg-amber-200/40" />
                                      <div className="w-[0.5px] bg-amber-700/30 h-full" />
                                    </div>
                                    <div className="h-[0.5px] bg-amber-700/30 w-full" />
                                  </div>
                                </div>
                              </div>

                              {/* Titles inside the card */}
                              <div className="pt-1.5">
                                <h4 className="font-extrabold text-[12px] md:text-[12.5px]/[13px] text-slate-800 leading-tight tracking-tight group-hover:text-bengali-orange transition-colors duration-200 line-clamp-2 min-h-[2.4em]">
                                  {item.title}
                                </h4>
                                <p className="text-[9.5px] text-slate-400 font-mono tracking-wider leading-none mt-0.5 uppercase truncate">
                                  {item.subtitle}
                                </p>
                              </div>
                            </div>

                            {/* Card bottom footer with compact CTA */}
                            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                              <span className="text-[8.5px] font-extrabold text-slate-500 bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded-md truncate max-w-[70px]">
                                {item.btnText}
                              </span>
                              <span className="text-[9px] font-black text-bengali-orange flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform duration-200">
                                আবেদন →
                              </span>
                            </div>
                          </div>
                        );
                      })
                  )}
                </div>
              </div>
            </section>

        </>
      )}

      </main>

      {/* 4. PREMIUM FOOTER TRUST BADGES CONTAINER */}
      <section className="bg-warm-cream/90 border-y border-orange-100 py-6 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-6 text-center text-xs">
          <div className="space-y-1.5">
            <CheckCircle2 className="h-6 w-6 text-orange-600 mx-auto" />
            <h5 className="font-bold text-slate-800">১০০% নির্ভরযোগ্য তথ্য</h5>
            <p className="text-[10px] text-slate-500">সরকারি অফিশিয়াল সোর্স থেকে প্রামাণ্য নথির সংগ্রহ</p>
          </div>
          <div className="space-y-1.5">
            <Zap className="h-6 w-6 text-amber-500 mx-auto" />
            <h5 className="font-bold text-slate-800">সহজ ও দ্রুত</h5>
            <p className="text-[10px] text-slate-500">জটিল ইংরেজি পরিভাষা এড়িয়ে সহজ ভাষায় বাংলা গাইড</p>
          </div>
          <div className="space-y-1.5">
            <Clock className="h-6 w-6 text-indigo-600 mx-auto" />
            <h5 className="font-bold text-slate-800">আপডেটেড তথ্য</h5>
            <p className="text-[10px] text-slate-500">নিয়মিত আবেদন ডেট ও শেষ সময় সতর্কবার্তা</p>
          </div>
          <div className="space-y-1.5">
            <Bot className="h-6 w-6 text-[#A94F12] mx-auto animate-pulse" />
            <h5 className="font-bold text-slate-800">এআই সহায়ক</h5>
            <p className="text-[10px] text-slate-500">যেকোনো প্রশ্ন জিজ্ঞেস করার ২৪x৭ এআই চ্যাট জিপিটি</p>
          </div>
          <div className="space-y-1.5 col-span-2 md:col-span-1">
            <Shield className="h-6 w-6 text-emerald-600 mx-auto" />
            <h5 className="font-bold text-slate-800">নিরাপদ ড্যাশবোর্ড</h5>
            <p className="text-[10px] text-slate-500">আপনার সংরক্ষিত পোর্টালে ব্যক্তিগত ডেটা সম্পূর্ণ নিরাপদ</p>
          </div>
        </div>
      </section>

      {/* 5. USER DISCLAIMER BAR (STRICT ASSIGNED TEXT) */}
      <footer className="bg-[#1E3A5F] text-white py-8 px-6 border-t border-slate-900/40 text-xs text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex flex-wrap justify-center gap-4 text-white/50 text-[11px] mb-2 font-medium">
            <button onClick={() => setActiveLegalModal("terms")} className="hover:text-white transition-colors cursor-pointer focus:outline-hidden">পরিষেবা নির্দেশিকা</button>
            <span>•</span>
            <button onClick={() => setActiveLegalModal("disclaimer")} className="hover:text-white transition-colors cursor-pointer focus:outline-hidden">আইনী নোটিশ</button>
            <span>•</span>
            <button onClick={() => setActiveLegalModal("privacy")} className="hover:text-white transition-colors cursor-pointer focus:outline-hidden">গোপনীয়তা নীতি</button>
          </div>
          <p className="leading-relaxed text-slate-300 font-medium">
            "বাংলার সেবা কোনো সরকারি ওয়েবসাইট নয়। আমরা শুধুমাত্র বিভিন্ন সরকারি পরিষেবা, প্রকল্প, চাকরি এবং স্কলারশিপ সংক্রান্ত অফিসিয়াল তথ্য ও লিংক একত্রে প্রদান করি। সকল আবেদন সংশ্লিষ্ট অফিসিয়াল ওয়েবসাইটে সম্পন্ন হয়।"
          </p>
          <p className="text-[10px] text-slate-400 font-mono pt-2 border-t border-white/5">
            © 2026 বাংলার সেবা সিটিজেন গাইডস ট্রাস্ট। সর্বস্বত্ব সংরক্ষিত।
          </p>
        </div>
      </footer>

      {/* ========================================================
          MODAL OVERLAYS AND INTERACTIVE POPUPS (COMPREHENSIVE)
         ======================================================== */}

      {/* MODAL 1: SCHEME DETAILS DIALOG WINDOW */}
      {selectedScheme && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-[650px] max-h-[85vh] overflow-y-auto border border-orange-50 shadow-2xl">
            {/* Modal Head */}
            <div className="bg-gradient-to-r from-bengali-orange to-[#8D3F0D] text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] bg-white/20 text-white font-bold p-1 rounded-full uppercase">
                  {selectedScheme.categoryName}
                </span>
                <h3 className="font-bold text-lg md:text-xl text-white mt-1.5">{selectedScheme.title}</h3>
              </div>
              <button onClick={() => setSelectedScheme(null)} className="text-white hover:bg-white/10 rounded-lg p-2">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 text-sm text-slate-700 leading-relaxed">
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 border-b border-orange-100 pb-1 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-bengali-orange block"></span>
                  প্রকল্পের মূল বিবরণ:
                </h4>
                <p className="text-slate-650 font-normal">{selectedScheme.description}</p>
              </div>

              <div className="space-y-2 bg-orange-50/50 p-4 rounded-xl border border-orange-100">
                <h4 className="font-extrabold text-bengali-orange flex items-center gap-1.5">
                  <StarIcon className="h-4 w-4 shrink-0" />
                  পাওয়া অনুদান বা সুযোগ-সুবিধা:
                </h4>
                <p className="text-slate-800 font-medium">{selectedScheme.benefits}</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 border-b border-orange-100 pb-1">আবেদনের আবশ্যিক যোগ্যতা:</h4>
                <p className="text-slate-650 font-normal">{selectedScheme.eligibility}</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 border-b border-orange-100 pb-1 flex items-center gap-1.5">
                  <span>চেকলিস্ট: আবশ্যিক প্রামাণ্য নথিসমূহ:</span>
                </h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-slate-650 text-xs">
                  {selectedScheme.documents.map((doc, idx) => (
                    <li key={idx} className="flex items-center gap-2 bg-slate-50 p-2 rounded border border-slate-100">
                      <span className="h-4 w-4 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center font-bold text-[9px] shrink-0">✓</span>
                      <span className="truncate">{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Sub-disclaimer inside details */}
              <div className="bg-slate-100 px-4 py-3 rounded-lg border border-slate-200 text-xs text-slate-500">
                <strong>গুরুত্বপূর্ণ তথ্য:</strong> অনুগ্রহ করে মনে রাখবেন যে বাংলার সেবা কোনো অফিসিয়াল সরকারি সংস্থা নয়। আপনার নথিসমূহ নিয়ে অফিশিয়াল সরকারি পোর্টালেই আবেদন জমা দিন।
              </div>
            </div>

            {/* Modal foot */}
            <div className="bg-slate-50 p-4 border-t border-slate-150 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <button
                onClick={() => {
                  toggleSaveScheme(selectedScheme.id);
                  setSelectedScheme(null);
                }}
                className={`text-xs font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 border transition-colors w-full sm:w-auto ${
                  savedSchemeIds.includes(selectedScheme.id)
                    ? "bg-orange-50 border-orange-200 text-bengali-orange"
                    : "border-slate-300 hover:bg-slate-100/50"
                }`}
              >
                <Bookmark className="h-4 w-4" />
                <span>{savedSchemeIds.includes(selectedScheme.id) ? "সংরক্ষিত আছে" : "বুকমার্ক সংরক্ষণ করুন"}</span>
              </button>
              <a
                href={selectedScheme.officialUrl}
                target="_blank"
                rel="noreferrer referrer"
                className="text-xs font-semibold py-2.5 px-5 bg-bengali-orange text-white hover:bg-[#8D3F0D] rounded-lg flex items-center justify-center gap-1 shadow-sm transition-transform active:scale-95 text-center leading-none w-full sm:w-auto"
              >
                <span>অফিশিয়াল ওয়েবসাইটে যান</span>
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: JOB VACANCY DETAILS DIALOG */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-[600px] max-h-[85vh] overflow-y-auto border border-emerald-50 shadow-2xl">
            {/* Job head */}
            <div className="bg-indigo-950 text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] bg-white/20 text-indigo-200 font-bold p-1 rounded-full uppercase tracking-wider">
                  {selectedJob.categoryName}
                </span>
                <h3 className="font-bold text-lg text-white mt-1.5">{selectedJob.title}</h3>
              </div>
              <button onClick={() => setSelectedJob(null)} className="text-white hover:bg-white/10 rounded-lg p-2">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Job info list parameters */}
            <div className="p-6 space-y-4 text-sm text-slate-700 leading-relaxed">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="text-xs text-slate-450 uppercase block font-semibold">কার্যকর শূন্যপদ:</span>
                  <span className="text-base font-bold text-[#1E3A5F]">{selectedJob.vacancy}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="text-xs text-slate-400 uppercase block font-semibold">মাসিক বেতন / স্কেল:</span>
                  <span className="text-base font-bold text-emerald-800">{selectedJob.salary || "গ্রেড পে অনুযায়ী"}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-900">আবশ্যক শিক্ষাগত যোগ্যতা এবং পরিমাপ:</h4>
                <p className="text-slate-650 bg-slate-50 p-3.5 rounded-xl border border-slate-100">{selectedJob.qualification}</p>
              </div>

              <div className="space-y-1 bg-red-50 text-red-900 p-3 rounded-xl border border-red-100 text-xs">
                <strong className="font-bold">আবেদনের সময়সীমা ও সতর্কতা:</strong>
                <p>সবচেয়ে দেরিতে আবেদনের তারিখ হল: <strong>{selectedJob.lastDate}</strong>। অনুগ্রহ করে নথির মাপকাঠি মিলিয়ে লাস্ট ডেইটের আগে রেজিস্ট্রেশন সাবমিট করুন।</p>
              </div>
            </div>

            {/* job modal foot */}
            <div className="bg-slate-50 p-4 border-t border-slate-150 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <button
                onClick={() => {
                  toggleSaveJob(selectedJob.id);
                  setSelectedJob(null);
                }}
                className={`text-xs font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 border transition-colors w-full sm:w-auto ${
                  savedJobIds.includes(selectedJob.id)
                    ? "bg-slate-100 border-slate-300 text-emerald-700"
                    : "border-slate-300 hover:bg-slate-100/50"
                }`}
              >
                <Bookmark className="h-4 w-4" />
                <span>{savedJobIds.includes(selectedJob.id) ? "সংরক্ষিত আছে" : "বুকমার্ক সেভ করুন"}</span>
              </button>
              <a
                href={selectedJob.officialUrl}
                target="_blank"
                rel="noreferrer referrer"
                className="text-xs font-semibold py-2.5 px-5 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg flex items-center justify-center gap-1 shadow-sm transition-transform active:scale-95 w-full sm:w-auto"
              >
                <span>অফিশিয়াল নিয়োগ লিংকে যান</span>
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>

          </div>
        </div>
      )}

      {/* MODAL 3: STEP-BY-STEP SERVICE ASSISTANCE MODAL */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-[550px] max-h-[85vh] overflow-y-auto border border-orange-50 shadow-2xl">
            {/* Header */}
            <div className="bg-gradient-to-r from-bengali-orange to-[#8D3F0D] text-white p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {selectedService.logoUrl ? (
                  <img 
                    src={selectedService.logoUrl} 
                    className="w-12 h-12 rounded-xl object-contain bg-white border border-white/20 p-1.5 shadow-sm" 
                    referrerPolicy="no-referrer" 
                    alt="" 
                  />
                ) : (
                  <div className="bg-white/10 p-2.5 rounded-xl border border-white/10 shrink-0">
                    {renderOfficialLogo(selectedService.id)}
                  </div>
                )}
                <div>
                  <span className="text-[9px] md:text-[10px] bg-white/20 text-white font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    নথিপত্র সেবা নির্দেশিকা
                  </span>
                  <h3 className="font-bold text-base md:text-lg text-white mt-1 leading-tight">{selectedService.title}</h3>
                </div>
              </div>
              <button onClick={() => setSelectedService(null)} className="text-white hover:bg-white/15 rounded-lg p-2 shrink-0">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Details and Steps progress layout */}
            <div className="p-6 space-y-4 text-sm text-slate-700">
              <p className="text-slate-500 font-medium text-xs leading-normal">{selectedService.description}</p>
              
              <div className="space-y-3.5">
                <h4 className="font-extrabold text-slate-900 border-b border-orange-50 pb-1 text-xs uppercase tracking-wider text-slate-500">অনলাইন আবেদনের সহজ ধাপগুলি:</h4>
                <div className="space-y-3">
                  {selectedService.steps.map((step, idx) => (
                    <div key={idx} className="flex gap-3">
                      <span className="h-5 w-5 rounded-full bg-orange-100 text-bengali-orange font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-xs text-slate-650 leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Feet */}
            <div className="bg-slate-50 p-4 border-t border-slate-150 flex flex-col sm:flex-row items-stretch sm:items-center justify-end">
              <a
                href={selectedService.officialUrl}
                target="_blank"
                rel="noreferrer referrer"
                className="text-xs font-semibold py-2.5 px-5 bg-bengali-orange text-white hover:bg-[#8D3F0D] rounded-lg flex items-center justify-center gap-1 shadow-sm transition-transform active:scale-95 w-full sm:w-auto"
              >
                <span>সরাসরি অফিসিয়াল পোর্টাল লিংক</span>
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: PREMIUM SUBSCRIPTION WHATSAPP / TELEGRAM PROMPT POPUP */}
      {showSubscriptionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-[420px] p-6 shadow-2xl border border-slate-100 relative">
            
            <button
              onClick={() => {
                setShowSubscriptionModal(false);
                setMobileNumber("");
                setSubTypeSuccess(false);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 rounded-lg p-1 animate-duration-200"
            >
              <X className="h-5 w-5" />
            </button>

            {subSuccess ? (
              <div className="text-center py-6 space-y-4">
                <div className="h-10 w-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-3">
                  <span className="text-lg font-bold">✓</span>
                </div>
                <h3 className="font-extrabold text-[#1E3A5F]">ধন্যবাদ!</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  আপনার রেজিস্ট্রেশন সফল হয়েছে। শীঘ্রই আপনার নম্বরে সরাসরি {subType} অ্যালার্ট পাঠানো হবে।
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubscribeSubmit} className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${subType === "WhatsApp" ? "bg-emerald-100 text-emerald-800 font-bold" : "bg-sky-100 text-sky-800 font-bold"}`}>
                    <Smartphone className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-950 text-sm">বাংলার {subType} অ্যালার্ট একটিভ করুন</h3>
                    <p className="text-[10px] text-slate-500">তাৎক্ষণিক আপডেট নোটিফিকেশন সঙ্কেত</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-600 block">আপনার ১০ সংখ্যার কার্যকর মোবাইল নাম্বার লিখুন *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">{subType === "WhatsApp" ? "+৯১" : "@"}</span>
                    <input
                      type="text"
                      required
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      placeholder="9876543210"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/10 text-slate-900 font-sans"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className={`w-full font-bold text-xs py-3 rounded-xl text-white transition-all shadow-sm active:scale-95 cursor-pointer ${
                    subType === "WhatsApp" ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20" : "bg-sky-600 hover:bg-sky-700 shadow-sky-500/20"
                  }`}
                >
                  ফ্রি মেম্বারশিপ একটিভ করুন
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* AI Bot floating window interface */}
      <AiAssistant isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />

      {/* MODAL: LEGAL, DISCLAIMER & PRIVACY DIALOG WINDOW */}
      {activeLegalModal && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-[650px] max-h-[85vh] overflow-hidden border border-orange-50 shadow-2xl flex flex-col">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-amber-400" />
                <h3 className="font-extrabold text-base md:text-lg text-white">
                  {activeLegalModal === "privacy" && "গোপনীয়তা নীতি (Privacy Policy)"}
                </h3>
              </div>
              <button 
                onClick={() => setActiveLegalModal(null)} 
                className="text-white bg-white/10 hover:bg-white/20 rounded-lg p-1.5 transition-all cursor-pointer font-sans"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              {activeLegalModal === "terms" && (
                <div className="space-y-4 text-xs md:text-sm text-slate-650 leading-relaxed font-sans">
                  <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl text-xs text-orange-850 font-semibold leading-relaxed">
                    📝 ব্যবহারের পূর্বে আমাদের নিয়মাবলী ও শর্তসমূহ মনোযোগ দিয়ে দয়া করে পড়ে নিন।
                  </div>
                  <section className="space-y-2">
                    <h4 className="font-bold text-slate-900 text-[15px] border-b border-slate-100 pb-1">১. অ্যাপ ব্যবহার ও দায়িত্ব</h4>
                    <p className="text-slate-650">
                      আমাদের 'বাংলার সেবা পোর্টাল' একটি তথ্য প্রদানকারী অ্যাপ্লিকেশন। যেখানে আমরা পাবলিক ডোমেনে থাকা নিখরচায় সাধারণ তথ্যাদি প্রদান এবং ব্যবহারকারীদের সরাসরি অফিশিয়াল সরকারি ওয়েব লিঙ্কে পোর্ট করার সুবিধা দিই। এখানে কোনো আর্থিক ফিস ছাড়া পরিষেবা পাওয়া যাবে।
                    </p>
                  </section>
                  <section className="space-y-2">
                    <h4 className="font-bold text-slate-900 text-[15px] border-b border-slate-100 pb-1">২. কোনো প্রতারণামূলক কাজের নিষেধ</h4>
                    <p className="text-slate-650 font-sans">
                      কোনো ইউজার অ্যাপ্লিকেশনটির তথ্য অসাধু উপায়ে বিপণন বা নকল সাইটে রিডাইরেক্ট করে মানুষের সাথে প্রতারণা করতে পারবে না। আমাদের পোর্টালের সমস্ত কনটেন্ট সাধারণ মানুষের স্বার্থে উন্মুক্ত।
                    </p>
                  </section>
                </div>
              )}

              {activeLegalModal === "disclaimer" && (
                <div className="space-y-4 text-xs md:text-sm text-slate-650 leading-relaxed font-sans">
                  <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl text-xs text-orange-850 font-semibold leading-relaxed font-sans">
                    ⚠️ এটি একটি অ-সরকারি জনকল্যাণমূলক তথ্য নির্দেশিকা পোর্টাল।
                  </div>
                  <section className="space-y-2">
                    <h4 className="font-bold text-slate-900 text-[15px] border-b border-slate-100 pb-1">১. অ-সরকারি চরিত্র</h4>
                    <p className="text-slate-650">
                      এই অ্যাপ্লিকেশনটি সম্পূর্ণ স্বাধীন এবং একটি বেসরকারী ডিরেক্টরি। এটি পশ্চিমবঙ্গ সরকার (Govt of West Bengal), ভারত সরকার (Govt of India), বা কোনো সরকারি অফিস বা মন্ত্রণালয়ের সাথে অনুমোদিত, স্পনসরড বা কোনোভাবেই অফিশিয়ালভাবে যুক্ত নয়।
                    </p>
                  </section>
                  <section className="space-y-2">
                    <h4 className="font-bold text-slate-900 text-[15px] border-b border-slate-100 pb-1">২. ট্রেডমার্ক এবং লোগো স্বত্বাধিকার</h4>
                    <p className="text-slate-650">
                      অ্যাপ্লিকেশনটিতে প্রদর্শিত বা ব্যবহৃত সমস্ত সরকারি কার্ডের নাম, অফিশিয়াল লোগো, ডোমেন নেম এবং স্লোগানগুলি সংশ্লিষ্ট সরকারি দপ্তর, মন্ত্রণালয় ও ভারত সরকারের নিজস্ব মেধা সম্পদ। আমরা শুধুমাত্র সাধারণ নাগরিকদের সহজ নেভিগেশন ও সরাসরি অ্যাক্সেস সুবিধার্থে রেফারেন্স স্বরুপ এগুলি প্রদর্শন করেছি। এর থেকে কোনো বাণিজ্যিক বা কপিরাইট দাবি করা আমাদের কাম্য নয়।
                    </p>
                  </section>
                  <section className="space-y-2">
                    <h4 className="font-bold text-[#E96A1F] text-[15px] border-b border-slate-100 pb-1">৩. দায়বদ্ধতা সীমা</h4>
                    <p className="text-[#E96A1F]">
                      কোনো ব্যবহারকারী ভুল তথ্যের ভিত্তিতে বা কোনো জাল সাইট বা থার্ড-পার্টি লিঙ্কের জন্য ক্ষতিগ্রস্ত হলে আমাদের প্ল্যাটফর্ম বা এর ডেভেলপার পক্ষ আইনগতভাবে বা আর্থিকভাবে দায়বদ্ধ থাকবে না। সর্বদা ব্যবহারকারীকে নিশ্চিত করতে হবে যেন আবেদন লিঙ্কটি .gov.in বা .nic.in এ শেষ হয়।
                    </p>
                  </section>
                </div>
              )}

              {activeLegalModal === "privacy" && (
                <div className="space-y-4 text-xs md:text-sm text-slate-650 leading-relaxed">
                  <div className="bg-emerald-50/70 border border-emerald-100 p-4 rounded-xl text-xs text-emerald-800 font-medium leading-relaxed">
                    🔒 আপনার ডেটার নিরাপত্তা আমাদের পরম অগ্রাধিকার। আমরা কোনো গোপন তথ্য সংগ্রহ করি না।
                  </div>
                  <section className="space-y-2">
                    <h4 className="font-bold text-slate-900 text-[15px] border-b border-slate-100 pb-1">১. শংসাপত্র ও ব্যক্তিগত নথি তথ্য</h4>
                    <p className="text-slate-650">
                      আমরা আপনার কোনো ব্যক্তিগত বা সরকারি আইডি কার্ড নম্বর (আধার, ভোটার, প্যান) বা সংবেদনশীল ফাইল আমাদের সার্ভারে জমা রাখি না বা সংগ্রহ করি না। আমরা আধার সংক্রান্ত কোনো ডেটাবেস প্রস্তুত ও সংরক্ষণ করি না। সম্পূর্ণ অ্যাপ্লিকেশনটি আপনার তথ্য ব্রাউজার স্তরে সুরক্ষিত রাখতে সাহায্য করে।
                    </p>
                  </section>
                  <section className="space-y-2">
                    <h4 className="font-bold text-slate-900 text-[15px] border-b border-slate-100 pb-1">২. লোকাল ডাটাবেস এবং বুকমার্ক</h4>
                    <p className="text-slate-650">
                      আপনার মনপছন্দ বা বুকমার্ক করা চাকরি, কার্ড এবং স্কলারশিপের তালিকা শুধুমাত্র আপনার ব্রাউজারের "Local Storage"-এ সংরক্ষিত থাকে। আপনি পেজটি রিসেট বা ব্রাউজার ডাটা ক্লিয়ার করলে এই ডেটা মুছে যাবে, আমাদের রিমোট সার্ভারে এর কোনো রেকর্ড থাকে না।
                    </p>
                  </section>
                  <section className="space-y-2">
                    <h4 className="font-bold text-slate-900 text-[15px] border-b border-slate-100 pb-1">৩. বিজ্ঞপ্তি সাবস্ক্রিপশন ও যোগাযোগ</h4>
                    <p className="text-slate-650">
                      যখন আপনি হোয়াটসঅ্যাপ বা টেলিগ্রাম বিজ্ঞপ্তির জন্য অনুরোধ করেন, তখন নম্বরটি কেবলমাত্র সেই বিজ্ঞপ্তি প্রেরণের জন্য সাময়িকভাবে সংরক্ষিত হয় এবং আপনি যেকোনো সময়ে চ্যাটে এসে "Stop" লিখে আনসাবস্ক্রাইব করতে পারেন।
                    </p>
                  </section>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 p-4 border-t border-slate-150 flex items-center justify-end shrink-0">
              <button
                onClick={() => setActiveLegalModal(null)}
                className="text-xs font-bold py-2 px-5 bg-slate-800 text-white hover:bg-slate-900 rounded-lg transition-colors cursor-pointer focus:outline-hidden"
              >
                আমি সচেতন ও সম্মত
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADMIN PASSWORD VERIFICATION (ONLY ACCESSED BY TYPING "100") */}
      {showAdminPasswordModal && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in animate-duration-200">
          <div className="bg-white rounded-2xl w-full max-w-[420px] overflow-hidden border border-orange-50 shadow-2xl flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-850 to-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-amber-400" />
                <h3 className="font-extrabold text-sm md:text-base text-white">অফিসিয়াল লগইন</h3>
              </div>
              <button 
                onClick={() => {
                  setShowAdminPasswordModal(false);
                  setAdminPasswordError("");
                  setAdminPasswordInput("");
                }} 
                className="text-white bg-white/10 hover:bg-white/20 rounded-lg p-1.5 transition-all cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleAdminPasswordSubmit} className="p-6 space-y-5">
              {/* Central padlock illustration */}
              <div className="flex flex-col items-center justify-center space-y-2 pb-2">
                <div className="p-4 bg-gradient-to-br from-orange-50 to-amber-100/60 rounded-full border border-orange-200/50 shadow-inner relative">
                  <Lock className="h-8 w-8 text-bengali-orange animate-pulse" />
                  <div className="absolute -top-1 -right-1 bg-green-500 rounded-full h-3 w-3 border-2 border-white"></div>
                </div>
                <h4 className="font-extrabold text-[#1E3A5F] text-xs tracking-wider uppercase font-mono">
                  SECURE STAFF ACCESS ONLY
                </h4>
              </div>

              <p className="text-xs text-slate-500 font-semibold text-center leading-relaxed">
                এই বিভাগটি শুধুমাত্র প্যানেল অ্যাডমিন ও আধিকারিকদের জন্য সংরক্ষিত। অনুগ্রহ করে প্রবেশের জন্য অ্যাক্সেস কোড লিখুন।
              </p>

              {adminPasswordError && (
                <div className="bg-red-50 border border-red-200 p-3 rounded-xl text-xs text-red-650 font-bold leading-normal animate-shake flex items-center gap-1.5 justify-center">
                  <span>⚠️</span> {adminPasswordError}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>ডিভাইস সিকিউরিটি কোড (পাসওয়ার্ড)</span>
                  <span className="text-[10px] text-slate-400 font-medium font-sans">পাসওয়ার্ড: ১০০</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={adminPasswordInput}
                    onChange={(e) => setAdminPasswordInput(e.target.value)}
                    placeholder="অ্যাডমিন সিকিউর পাসওয়ার্ড লিখুন..."
                    className="w-full pl-4 pr-10 py-3 text-sm border-2 border-slate-205 rounded-xl text-slate-850 font-semibold focus:outline-none focus:ring-4 focus:ring-orange-100/50 focus:border-[#E96A1F] transition-all bg-slate-50 hover:bg-slate-100/20"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors focus:outline-none cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4.5 w-4.5 shrink-0" />
                    ) : (
                      <Eye className="h-4.5 w-4.5 shrink-0" />
                    )}
                  </button>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowAdminPasswordModal(false);
                    setAdminPasswordError("");
                    setAdminPasswordInput("");
                    setShowPassword(false);
                  }}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-black text-white bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black rounded-xl transition-all cursor-pointer shadow-md transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  প্রবেশ করুন →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}



    </div>
  );
}

// Simple star SVG icon helper inline
function StarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
