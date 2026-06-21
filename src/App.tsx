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
  Phone,
  Facebook,
  Youtube,
  Instagram
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
  CategoryItem,
  Suggestion
} from "./data";

import { collection, onSnapshot, doc, setDoc, deleteDoc } from "firebase/firestore";
import { ref as rtdbRef, onValue as onRtdbValue, set as rtdbSet } from "firebase/database";
import { db, rtdb, isPlaceholderFirebase } from "./lib/firebase";

import AdminPanel from "./components/AdminPanel";
import CyberStudioTools from "./components/CyberStudioTools";
import DashboardServices from "./components/DashboardServices";
import DashboardAllLinks from "./components/DashboardAllLinks";
import DashboardTools from "./components/DashboardTools";
// @ts-ignore
import kolkataHeroBanner from "./assets/images/kolkata_hero_banner_1781608902642.jpg";
// @ts-ignore
import userLogo from "./assets/images/user_logo.svg";

// Import motion for clean high-fidelity transitions
import { motion, AnimatePresence } from "motion/react";

const BENGALI_TO_ENGLISH_TITLES: { [key: string]: string } = {
  // Common WB Schemes and services
  "লক্ষ্মীর ভাণ্ডার": "Lakshmir Bhandar Portal",
  "লক্ষ্মীর ভান্ডার": "Lakshmir Bhandar Portal",
  "লক্ষ্মী ভান্ডার": "Lakshmir Bhandar Portal",
  "লক্ষ্মী ভাণ্ডার": "Lakshmir Bhandar Portal",
  "কৃষক বন্ধু": "Krishak Bandhu Scheme",
  "কৃষকবন্ধু": "Krishak Bandhu Scheme",
  "স্টুডেন্ট ক্রেডিট কার্ড": "Student Credit Card Scheme",
  "স্টুডেন্ট ক্রেডিট": "Student Credit Card Scheme",
  "শিক্ষার্থী ক্রেডিট কার্ড": "Student Credit Card Scheme",
  "কন্যাশ্রী": "Kanyashree Prakalpa (K1/K2)",
  "কন্যাশ্রী প্রকল্প": "Kanyashree Prakalpa (K1/K2)",
  "রূপশ্রী": "Rupashree Prakalpa",
  "রূপশ্রী প্রকল্প": "Rupashree Prakalpa",
  "স্বাস্থ্য সাথী": "Swasthya Sathi Card Portal",
  "স্বাস্থ্যসাথী": "Swasthya Sathi Card Portal",
  "বার্ধক্য ভাতা": "Old Age Pension Scheme",
  "প্রবীণ পেনশন": "Old Age Pension Scheme",
  "বিধবা ভাতা": "Widow Pension Scheme",
  "মানবিক": "Manabik Pension Scheme",
  "মানবিক প্রকল্প": "Manabik Pension Scheme",
  "ঐক্যশ্রী": "Aikyashree Scholarship",
  "ঐক্যশ্রী স্কলারশিপ": "Aikyashree Scholarship",
  "নবান্ন": "Nabanna CM Relief Fund",
  "নবান্ন স্কলারশিপ": "Nabanna CM Relief Fund",
  "ওএসিস": "OASIS Scholarship Portal",
  "oasis": "OASIS Scholarship Portal",
  "স্বামী বিবেকানন্দ": "SVMCM Merit Scholarship",
  "বিবেকানন্দ স্কলারশিপ": "SVMCM Merit Scholarship",
  "যুবশ্রী": "Yuvashree Scheme",
  "উৎকর্ষ বাংলা": "Utkarsh Bangla Scheme",
  "উত্কর্ষ বাংলা": "Utkarsh Bangla Scheme",
  "গতিধারা": "Gatidhara Scheme",
  "খাদ্য সাথী": "Khadya Sathi (Digital Ration Card)",
  "খাদ্যসাথী": "Khadya Sathi (Digital Ration Card)",
  "রেশন কার্ড": "Ration Card Services",
  "রেশন": "Ration Card Services",
  "আধার কার্ড": "Aadhaar Card Services",
  "আধার": "Aadhaar Card Services",
  "আধার সেবা": "Aadhaar Card Services",
  "প্যান কার্ড": "PAN Card Services",
  "প্যান": "PAN Card Services",
  "প্যান সেবা": "PAN Card Services",
  "ভোটার কার্ড": "Voter Card Services",
  "ভোটার": "Voter Card Services",
  "ভোটার পোর্টাল": "Voter Card Services",
  "ড্রাইভিং লাইসেন্স": "Driving Licence Services",
  "ড্রাইভিং": "Driving Licence Services",
  "লাইসেন্স": "Licence Services",
  "পাসপোর্ট": "Passport Seva Portal",
  "জন্ম শংসাপত্র": "Birth Certificate Services",
  "জন্ম সার্টিফিকেট": "Birth Certificate Services",
  "জন্ম তথ্য": "Birth Certificate Services",
  "মৃত্যু শংসাপত্র": "Death Certificate Services",
  "মৃত্যু সার্টিফিকেট": "Death Certificate Services",
  "মৃত্যু রেকর্ড": "Death Certificate Services",
  "জাতিগত শংসাপত্র": "Caste Certificate Services",
  "কাস্ট সার্টিফিকেট": "Caste Certificate Services",
  "আয়ের শংসাপত্র": "Income Certificate Services",
  "ইনকাম সার্টিফিকেট": "Income Certificate Services",
  "ইনকাম গাইড": "Income Certificate Services",
  "বাংলারভূমি": "Banglarbhumi (Land Records)",
  "জমির পরচা": "Land Records (Jomir Porcha)",
  "জমির পর্চা": "Land Records (Jomir Porcha)",
  "মিউটেশন": "Land Mutation Services",
  "অন্নপূর্ণা": "Annapurna Scheme",
  "অন্নপূর্ণা প্রকল্প": "Annapurna Scheme",
  "পৌরসভা": "Municipal Service Board",
  "পৌরসভা চাকরি": "Municipal Service Board Job",
  "পুলিশ নিয়োগ": "WBP Police Recruitment",
  "পুলিশ": "Police Recruitment Services",
  "শিক্ষা শ্রী": "Sikshashree Scholarship",
  "শিক্ষাশ্রী": "Sikshashree Scholarship",
  "তরুণের স্বপ্ন": "Taruner Swapno Scheme",
  "সবুজ সাথী": "Sabooj Sathi (Bicycle Scheme)",
  "সবুজসাথী": "Sabooj Sathi (Bicycle Scheme)",
  "সবুজশ্রী": "Sabujshree Scheme",
  "সবুজ শ্রী": "Sabujshree Scheme",
  " can নিজের ও অভিভাবকের আধার কার্ড সহ সর্বশেষ মার্কশিট": "Nabanna CM Relief Fund Support",
  "শিশু সাথী": "Shishu Sathi Scheme",
  "বিনামূল্যে সামাজিক সুরক্ষা": "Samajik Suraksha Yojana (BM-SSY)",
  "সামাজিক সুরক্ষা": "Samajik Suraksha Yojana (BM-SSY)",
  "কর্মসাথী": "Karma Sathi Prakalpa",
  "পথশ্রী": "Pathashree Prakalpa",
  "সমব্যথী": "Samabyathi Scheme",
  "লোকপ্রসার": "Lokaprasar Prakalpa",
  "গীতাঞ্জলি হাউজিং": "Gitanjali Housing Scheme",
  "গীতাঞ্জলি": "Gitanjali Housing Scheme",
  "জয় বাংলা": "Jai Bangla Pension Scheme",
  "উত্সব": "Utsav Portal",
  "উৎসব": "Utsav Portal"
};

export function getEnglishTitleUnified(title: string): string {
  if (!title) return "";
  const trimmed = title.trim();

  // 1. Check exact key in dictionary
  if (BENGALI_TO_ENGLISH_TITLES[trimmed]) {
    return BENGALI_TO_ENGLISH_TITLES[trimmed];
  }

  // 2. Substring matching of keys
  for (const [bengali, english] of Object.entries(BENGALI_TO_ENGLISH_TITLES)) {
    if (trimmed.includes(bengali)) {
      return english;
    }
  }

  // 3. Fallback, return as is (if already English)
  return trimmed;
}

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
    case "Sparkles": return Sparkles;
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

const getServiceMetadata = (id: string, cat: string) => {
  let rating = 4.5;
  const charSum = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  rating = 4.5 + (charSum % 5) * 0.1;
  if (rating > 4.9) rating = 4.9;

  let badgeText = "অফিসিয়াল";
  let badgeType: 'official' | 'free' | 'popular' = 'official';

  if (cat === "jobs") {
    badgeText = "নতুন নিয়োগ";
    badgeType = 'popular';
  } else if (cat === "scholarships") {
    badgeText = "জনপ্রিয়";
    badgeType = 'popular';
  } else if (cat === "welfare") {
    badgeText = "বিনামূল্যে";
    badgeType = 'free';
  } else if (cat === "utility") {
    badgeText = "ডিজিটাল সেবা";
    badgeType = 'free';
  } else if (cat === "cyber_cafe") {
    badgeText = "বিশেষ সেবা";
    badgeType = 'popular';
  } else if (id.includes("srv1") || id.includes("srv2") || id.includes("srv7") || id.includes("srv9")) {
    badgeText = "অফিসিয়াল";
    badgeType = 'official';
  }
  
  return { rating: rating.toFixed(1), badgeText, badgeType };
};

const getCategoryColorAccent = (cat: string) => {
  switch (cat) {
    case "jobs":
      return {
        gradient: "from-white/95 via-white/98 to-blue-50/30 hover:to-blue-100/45",
        glow: "hover:shadow-[0_20px_35px_-12px_rgba(59,130,246,0.18)]",
        iconBg: "bg-blue-500/10 text-[#2563EB]",
        iconBorder: "border-blue-200/50",
        badgeBg: "bg-blue-50/80 text-blue-850 border-blue-150/40",
        badgeDot: "bg-[#2563EB]",
        borderAccent: "hover:border-blue-300 hover:ring-4 hover:ring-blue-100/40",
        arrowClass: "bg-blue-50 text-[#2563EB] group-hover:bg-[#2563EB] group-hover:text-white",
        orbGradient: "from-blue-500/10 to-indigo-500/10"
      };
    case "scholarships":
      return {
        gradient: "from-white/95 via-white/98 to-emerald-50/30 hover:to-emerald-100/45",
        glow: "hover:shadow-[0_20px_35px_-12px_rgba(16,185,129,0.18)]",
        iconBg: "bg-emerald-500/10 text-[#059669]",
        iconBorder: "border-emerald-200/50",
        badgeBg: "bg-emerald-50/80 text-emerald-850 border-emerald-150/40",
        badgeDot: "bg-[#059669]",
        borderAccent: "hover:border-emerald-300 hover:ring-4 hover:ring-emerald-100/40",
        arrowClass: "bg-emerald-50 text-[#059669] group-hover:bg-[#059669] group-hover:text-white",
        orbGradient: "from-emerald-500/10 to-teal-500/10"
      };
    case "welfare":
      return {
        gradient: "from-white/95 via-white/98 to-orange-50/30 hover:to-orange-100/45",
        glow: "hover:shadow-[0_20px_35px_-12px_rgba(249,115,22,0.18)]",
        iconBg: "bg-orange-500/10 text-[#EA580C]",
        iconBorder: "border-orange-200/50",
        badgeBg: "bg-orange-50/80 text-orange-850 border-orange-150/40",
        badgeDot: "bg-[#EA580C]",
        borderAccent: "hover:border-orange-300 hover:ring-4 hover:ring-orange-100/40",
        arrowClass: "bg-orange-50 text-[#EA580C] group-hover:bg-[#EA580C] group-hover:text-white",
        orbGradient: "from-orange-500/10 to-amber-500/10"
      };
    case "identity":
      return {
        gradient: "from-white/95 via-white/98 to-violet-50/30 hover:to-violet-100/45",
        glow: "hover:shadow-[0_20px_35px_-12px_rgba(139,92,246,0.18)]",
        iconBg: "bg-violet-500/10 text-[#7C3AED]",
        iconBorder: "border-violet-200/50",
        badgeBg: "bg-violet-50/80 text-violet-850 border-violet-150/40",
        badgeDot: "bg-[#7C3AED]",
        borderAccent: "hover:border-violet-300 hover:ring-4 hover:ring-violet-100/40",
        arrowClass: "bg-violet-50 text-[#7C3AED] group-hover:bg-[#7C3AED] group-hover:text-white",
        orbGradient: "from-violet-500/10 to-fuchsia-500/10"
      };
    case "utility":
      return {
        gradient: "from-white/95 via-white/98 to-teal-50/30 hover:to-teal-100/45",
        glow: "hover:shadow-[0_20px_35px_-12px_rgba(13,148,136,0.18)]",
        iconBg: "bg-teal-500/10 text-[#0D9488]",
        iconBorder: "border-teal-200/50",
        badgeBg: "bg-teal-50/80 text-teal-850 border-teal-150/40",
        badgeDot: "bg-[#0D9488]",
        borderAccent: "hover:border-teal-300 hover:ring-4 hover:ring-teal-100/40",
        arrowClass: "bg-teal-50 text-[#0D9488] group-hover:bg-[#0D9488] group-hover:text-white",
        orbGradient: "from-teal-500/10 to-cyan-500/10"
      };
    case "health":
      return {
        gradient: "from-white/95 via-white/98 to-rose-50/30 hover:to-rose-100/45",
        glow: "hover:shadow-[0_20px_35px_-12px_rgba(225,29,72,0.18)]",
        iconBg: "bg-rose-500/10 text-[#E11D48]",
        iconBorder: "border-rose-200/50",
        badgeBg: "bg-rose-50/80 text-rose-850 border-rose-150/40",
        badgeDot: "bg-[#E11D48]",
        borderAccent: "hover:border-rose-300 hover:ring-4 hover:ring-rose-100/40",
        arrowClass: "bg-rose-50 text-[#E11D48] group-hover:bg-[#E11D48] group-hover:text-white",
        orbGradient: "from-rose-500/10 to-pink-500/10"
      };
    case "land":
      return {
        gradient: "from-white/95 via-white/98 to-amber-50/30 hover:to-amber-100/45",
        glow: "hover:shadow-[0_20px_35px_-12px_rgba(217,119,6,0.18)]",
        iconBg: "bg-amber-500/10 text-[#D97706]",
        iconBorder: "border-amber-200/50",
        badgeBg: "bg-amber-50/80 text-amber-850 border-amber-150/40",
        badgeDot: "bg-[#D97706]",
        borderAccent: "hover:border-amber-300 hover:ring-4 hover:ring-amber-100/40",
        arrowClass: "bg-amber-50 text-[#D97706] group-hover:bg-[#D97706] group-hover:text-white",
        orbGradient: "from-amber-500/10 to-yellow-500/10"
      };
    case "cyber_cafe":
      return {
        gradient: "from-white/95 via-white/98 to-orange-50/30 hover:to-orange-100/45",
        glow: "hover:shadow-[0_20px_35px_-12px_rgba(234,88,12,0.18)]",
        iconBg: "bg-orange-500/10 text-[#EA580C]",
        iconBorder: "border-orange-200/50",
        badgeBg: "bg-orange-50/80 text-orange-850 border-orange-150/40",
        badgeDot: "bg-[#EA580C]",
        borderAccent: "hover:border-orange-300 hover:ring-4 hover:ring-orange-100/40",
        arrowClass: "bg-orange-50 text-[#EA580C] group-hover:bg-[#EA580C] group-hover:text-white",
        orbGradient: "from-orange-500/10 to-amber-500/10"
      };
    default:
      return {
        gradient: "from-white/95 via-white/98 to-slate-50/30 hover:to-slate-100/40",
        glow: "hover:shadow-[0_20px_35px_-12px_rgba(71,85,105,0.12)]",
        iconBg: "bg-slate-500/10 text-[#475569]",
        iconBorder: "border-slate-200/50",
        badgeBg: "bg-slate-100 text-slate-800 border-slate-200/60",
        badgeDot: "bg-[#475569]",
        borderAccent: "hover:border-slate-300 hover:ring-4 hover:ring-slate-100/40",
        arrowClass: "bg-slate-50 text-[#475569] group-hover:bg-[#475569] group-hover:text-white",
        orbGradient: "from-slate-500/10 to-zinc-500/10"
      };
  }
};

const getServiceSubLinks = (id: string, officialUrl: string, customSubLinks?: { label: string; url: string; desc: string }[]) => {
  if (customSubLinks && customSubLinks.length > 0) {
    return customSubLinks;
  }
  switch (id) {
    case "srv1": // Aadhaar Card
      return [
        {
          label: "আধার আবেদনের লিঙ্ক (Check Enrolment & Update Status)",
          url: "https://myaadhaar.uidai.gov.in/CheckAadhaarStatus",
          desc: "SRN / Enrolment ID এবং ওটিপি দিয়ে স্ট্যাটাস দেখুন"
        },
        {
          label: "ই-আধার অনলাইন ডাউনলোড (Download e-Aadhaar PDF)",
          url: "https://myaadhaar.uidai.gov.in/gen-download-aadhaar",
          desc: "আধার নম্বর ও ওটিপি দিয়ে সরাসরি ডাউনলোড করুন"
        },
        {
          label: "লিঙ্কড মোবাইল নাম্বার চেক (Verify Email & Mobile)",
          url: "https://myaadhaar.uidai.gov.in/verify-email-mobile",
          desc: "কোন মোবাইল নম্বর আধারের সাথে যুক্ত আছে জেনে নিন"
        },
        {
          label: "আধার কেন্দ্র অনলাইন বুকিং (Book Aadhaar Appointment)",
          url: "https://appointments.uidai.gov.in/bookappointment.aspx",
          desc: "নিকটবর্তী আধার সেবা কেন্দ্রে অ্যাপয়েন্টমেন্ট বুকিং লিঙ্ক"
        }
      ];
    case "srv2": // PAN Card
      return [
        {
          label: "প্যান কার্ড স্ট্যাটাস ট্র্যাকিং করুন (Track PAN Card)",
          url: "https://tin.tin.nsdl.com/pantan/StatusTrack.html",
          desc: "NSDL পোর্টালে Acknowledgement নম্বর দিয়ে দেখুন"
        },
        {
          label: "প্যান আধার লিঙ্ক স্ট্যাটাস জানুন (PAN-Aadhaar Link Status)",
          url: "https://eportal.incometax.gov.in/iec/foservices/#/pre-login/link-aadhaar-status",
          desc: "আপনার প্যান কার্ডটি আধার সাথে লিঙ্কড আছে কি না চেক করুন"
        },
        {
          label: "ই-প্যান ডাউনলোড করুন সরাসরি (Download Instant e-PAN)",
          url: "https://www.onlineservices.nsdl.com/paam/MPanLogin.html",
          desc: "অনলাইন NSDL পোর্টাল থেকে ডিজিটাল ই-প্যান ডাউনলোড করুন"
        }
      ];
    case "srv7": // Voter ID
      return [
        {
          label: "ভোটার তালিকায় নাম অনুসন্ধান (Search Elector Roll)",
          url: "https://electoralsearch.eci.gov.in/",
          desc: "আপনার নাম বা EPIC ভোটার কার্ড নম্বর দিয়ে সার্চ করুন"
        },
        {
          label: "ভোটার আবেদন স্ট্যাটাস ট্র্যাক (Track Voter Application)",
          url: "https://voters.eci.gov.in/track-application-status",
          desc: "আবেদন করার পর Reference ID দিয়ে বর্তমান স্ট্যাটাস জানুন"
        },
        {
          label: "ডিজিটাল ভোটার কার্ড ডাউনলোড (Download e-EPIC PDF)",
          url: "https://voters.eci.gov.in/download-epic",
          desc: "নির্বাচনী পরিচয়পত্রের ডিজিটাল কপি ওটিপি দিয়ে ডাউনলোড করুন"
        }
      ];
    case "srv8": // Ration Card
      return [
        {
          label: "রেশন কার্ড আবেদন স্ট্যাটাস চেক (Track Ration Status)",
          url: "https://food.wb.gov.in/index.aspx",
          desc: "খাদ্য দপ্তরের পোর্টালে কার্ডের বর্তমান বিবরণী ট্র্যাকিং করুন"
        },
        {
          label: "রেশন কার্ড ও আধার লিঙ্ক লিংক (Link Aadhaar with Ration)",
          url: "https://food.wb.gov.in/Link_Aadhaar.aspx",
          desc: "বাড়িতে বসেই রেশন কার্ডের সাথে মোবাইল ও আধার নথিভুক্ত করুন"
        },
        {
          label: "ই-রেশন কার্ড অনলাইন ডাউনলোড (Download e-Ration Card)",
          url: "https://food.wb.gov.in/e_RationCard_Download.aspx",
          desc: "ডিজিটাল রেশন কার্ডের কপি ডাউনলোড করে প্রিন্ট নিন"
        }
      ];
    case "srv3": // Birth Certificate
      return [
        {
          label: "জন্ম শংসাপত্র স্ট্যাটাস চেক করুন (Track Birth App)",
          url: "https://janma-mrityutathya.wb.gov.in/index.php/citizens/track-application",
          desc: "Ack বা রেজিস্ট্রেশন নম্বর দিয়ে আবেদনের অগ্রগতি পরীক্ষা করুন"
        },
        {
          label: "ডিজিটাল জন্ম শংসাপত্র ডাউনলোড (Download Birth Certificate)",
          url: "https://janma-mrityutathya.wb.gov.in/index.php/citizens/download-certificate",
          desc: "অনুমোদিত ও ভেরিফায়েড জন্ম তথ্য সার্টিফিকেট অনলাইন ডাউনলোড"
        }
      ];
    case "srv4": // Caste Certificate
      return [
        {
          label: "জাতি শংসাপত্র স্ট্যাটাস চেক (Track Caste Certificate)",
          url: "https://castetest.wb.gov.in/track-application",
          desc: "SC/ST/OBC সার্টিফিকেট আবেদনের স্ট্যাটাস অনলাইন চেক"
        },
        {
          label: "জাতি শংসাপত্র ডাউনলোড সরাসরি (Download Caste Certificate)",
          url: "https://castetest.wb.gov.in/download-certificate",
          desc: "অনুমোদিত ডিজিটাল কাস্ট সার্টিফিকেট অনলাইন ডাউনলোড করুন"
        }
      ];
    case "srv5": // Income Certificate
      return [
        {
          label: "আয় শংসাপত্র আবেদন স্ট্যাটাস ট্র্যাক (Track Income App)",
          url: "https://edistrict.wb.gov.in/pace/trackApplication.action",
          desc: "ই-ডিস্ট্রিক্ট পোর্টালে AIN নম্বর আপলোড করে চেক করুন"
        },
        {
          label: "আয় শংসাপত্র ভেরিফিকেশন (Verify Income Certificate)",
          url: "https://edistrict.wb.gov.in/pace/verificationLink.action",
          desc: "ডিজিটাল সিগনেচার ও ওরিজিনাল বারকোড সার্টিফিকেট চেক করুন"
        }
      ];
    case "srv11": // Death Certificate
      return [
        {
          label: "মৃত্যু শংসাপত্র স্ট্যাটাস চেক করুন (Track Death App)",
          url: "https://janma-mrityutathya.wb.gov.in/index.php/citizens/track-application",
          desc: "Ack বা রেজিস্ট্রেশন নম্বর দিয়ে আবেদনের অগ্রগতি পরীক্ষা করুন"
        },
        {
          label: "ডিজিটাল মৃত্যু শংসাপত্র ডাউনলোড (Download Death Certificate)",
          url: "https://janma-mrityutathya.wb.gov.in/index.php/citizens/download-certificate",
          desc: "অনুমোদিত ও ভেরিফায়েড মৃত্যু তথ্য সার্টিফিকেট অনলাইন ডাউনলোড"
        }
      ];
    default:
      return [
        {
          label: "সরাসরি অফিসিয়াল পোর্টাল লিংক (Official Direct Link)",
          url: officialUrl,
          desc: "বিস্তারিত নির্দেশিকা এবং অনলাইন পরিষেবার জন্য সরাসরি লিঙ্কে প্রবেশ করুন।"
        }
      ];
  }
};

const expandQuery = (query: string): string[] => {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  const expansions: string[] = [];
  const dict: Record<string, string[]> = {
    "নিয়োগ": ["নিয়োগ", "নিয়োগ", "কর্মসংস্থান", "ফলাফল", "পুলিশ", "কনস্টেবল", "ক্লার্ক", "psc", "tet", "ssc", "job"],
    "nigo": ["নিয়োগ", "নিয়োগ", "কর্মসংস্থান", "job"],
    "jobs": ["চাকরি", "নিয়োগ", "নিয়োগ", "কর্মসংস্থান", "ফলাফল", "পুলিশ", "কনস্টেবল", "ক্লার্ক", "psc", "tet", "ssc", "job"],
    "recruitment": ["নিয়োগ", "নিয়োগ", "বিজ্ঞপ্তি", "চাকরি", "recruit"],
    "recruit": ["নিয়োগ", "নিয়োগ", "বিজ্ঞপ্তি", "চাকরি", "recruit"],
    "vacancy": ["শূন্যপদ", "আসন", "vacancy"],
    "aadhar": ["aadhar", "adhar", "আধার", "uidad"],
    "adhar": ["aadhar", "adhar", "আধার", "uidad"],
    "আধার": ["aadhar", "adhar", "আধার", "uidad"],
    "pan": ["pan", "pancard", "প্যান"],
    "প্যান": ["pan", "pancard", "প্যান"],
    "voter": ["voter", "epic", "ভোটার", "ভোট"],
    "ভোটার": ["voter", "epic", "ভোটার", "ভোট"],
    "ration": ["ration", "রেশন", "খাদ্য", "khadya"],
    "রেশন": ["ration", "রেশন", "খাদ্য", "khadya"],
    "passport": ["passport", "পাসপোর্ট"],
    "পাসপোর্ট": ["passport", "পাসপোর্ট"],
    "license": ["license", "licence", "লাইসেন্স", "vehicle"],
    "licence": ["license", "licence", "লাইসেন্স", "vehicle"],
    "লাইসেন্স": ["license", "licence", "লাইসেন্স", "vehicle"],
    "birth": ["birth", "জন্ম", "janma"],
    "জন্ম": ["birth", "জন্ম", "janma"],
    "death": ["death", "মৃত্যু", "mrityu"],
    "মৃত্যু": ["death", "মৃত্যু", "mrityu"],
    "caste": ["caste", "জাতি", "sc", "st", "obc"],
    "জাতি": ["caste", "জাতি", "sc", "st", "obc"],
    "income": ["income", "আয়", "ay", "bdo"],
    "আয়": ["income", "আয়", "ay", "bdo"],
    "land": ["land", "জমি", "jomi", "পরচা", "khajna", "খাজনা", "mutation", "মিউটেশন", "banglarbhumi", "বাংলারভূমি"],
    "জমি": ["land", "জমি", "jomi", "পরচা", "khajna", "খাজনা", "mutation", "মিউটেশন", "banglarbhumi", "বাংলারভূমি"],
    "deed": ["deed", "দলিল", "registration"],
    "দলিল": ["deed", "দলিল", "registration"],
    "scholarship": ["scholarship", "স্কলারশিপ", "svmcm", "oasis", "aikyashree", "nsp"],
    "স্কলারশিপ": ["scholarship", "স্কলারশিপ", "svmcm", "oasis", "aikyashree", "nsp"],
    "health": ["health", "স্বাস্থ্য", "swasthya", "abha", "সাথী"],
    "স্বাস্থ্য": ["health", "স্বাস্থ্য", "swasthya", "abha", "সাথী"]
  };

  words.forEach(word => {
    expansions.push(word);
    if (dict[word]) {
      expansions.push(...dict[word]);
    }
  });

  return Array.from(new Set(expansions));
};

const DEFAULT_CATEGORIES: CategoryItem[] = [
  { id: "welfare", label: "সরকারি প্রকল্প", desc: "লক্ষ্মীর ভাণ্ডার, রূপশ্রী ও রাজ্য সরকারের নানাবিধ জনকল্যাণ মূলক প্রকল্প", iconName: "Award" },
  { id: "jobs", label: "সরকারি চাকরি", desc: "রাজ্য ও কেন্দ্র সরকারের নতুন নিয়োগ, সিলেবাস ও পরীক্ষার খবরাখবর", iconName: "Briefcase" },
  { id: "scholarships", label: "স্কলারশিপ", desc: "ঐক্যশ্রী, ওএসিস, বিবেকানন্দ স্কলারশিপ ও বিভিন্ন আর্থিক অনুদান স্কিম", iconName: "GraduationCap" },
  { id: "identity", label: "আধার ও পরিচয়পত্র", desc: "আধার, ভোটার, প্যান কার্ড ও অনুষঙ্গিক পরিচয় প্রমাণ প্রক্রিয়াকরণ", iconName: "IdCard" },
  { id: "utility", label: "সার্টিফিকেট ও লাইসেন্স", desc: "জাতভিত্তিক শংসাপত্র, জন্ম-মৃত্যু নিবন্ধন ও ডিজিটাল লাইসেন্স আবেদন", iconName: "FileText" },
  { id: "health", label: "হেলথ ও বিমা", desc: "স্বাস্থ্য সাথী ও ABHA বিমা কার্ড সংক্রান্ত গাইডসমূহ", iconName: "HeartPulse" },
  { id: "land", label: "জমি ও সম্পত্তি", desc: "বাংলাভূমি খতিয়ান, দাগের তথ্য ও সম্পত্তি রেজিস্ট্রেশন সংক্রান্ত পোর্টালসমূহ", iconName: "MapPin" },
  { id: "cyber_cafe", label: "সাইবার ক্যাফে", desc: "সাইবার ক্যাফে ও অন্যান্য সাধারণ নাগরিক সুবিধাসমূহ", iconName: "Laptop" }
];

const mergeCategoriesWithDefaults = (dbList: CategoryItem[]): CategoryItem[] => {
  const merged = [...DEFAULT_CATEGORIES];
  if (!dbList || !Array.isArray(dbList)) return merged;
  dbList.forEach((item) => {
    if (item && item.id) {
      const idx = merged.findIndex((c) => c.id === item.id);
      if (idx !== -1) {
        merged[idx] = { ...merged[idx], ...item };
      } else {
        merged.push(item);
      }
    }
  });
  return merged;
};
export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // PWA Add-to-Home-Screen prompt states
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBanner(true);
      console.log('beforeinstallprompt event captured!');
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Check if launching directly inside standard standalone web app mode
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone;
    if (isStandalone) {
      setShowInstallBanner(false);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallApp = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User installation choice outcome: ${outcome}`);
    setDeferredPrompt(null);
    setShowInstallBanner(false);
  };

  // Global States (shared state for instant reactions)
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [updates, setUpdates] = useState<AppUpdate[]>(INITIAL_UPDATES);
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>(DEFAULT_CATEGORIES);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [firebaseStatus, setFirebaseStatus] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [docCategory, setDocCategory] = useState<string>("all");
  const [activeSidebarTab, setActiveSidebarTab] = useState<"services" | "all-links" | "tools">("services");
  const [settings, setSettings] = useState<{ geminiApiKey: string; heroBannerUrl?: string }>({ geminiApiKey: "", heroBannerUrl: "" });

  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [showAdminPasswordModal, setShowAdminPasswordModal] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState("");
  const [adminPasswordError, setAdminPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showHelpCenterModal, setShowHelpCenterModal] = useState(false);

  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedService, setSelectedService] = useState<any | null>(null);

  const [savedSchemeIds, setSavedSchemeIds] = useState<string[]>([]);
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);

  const [activeSchemeTab, setActiveSchemeTab] = useState<"info" | "docs" | "apply">("info");
  const [activeJobTab, setActiveJobTab] = useState<"info" | "requirements" | "apply">("info");

  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
  const [subType, setSubType] = useState<string>("general");
  const [subSuccess, setSubTypeSuccess] = useState(false);

  const [activeLegalModal, setActiveLegalModal] = useState<string | null>(null);
  const [broadcastNotices, setBroadcastNotices] = useState<string[]>([]);

  const [suggestionName, setSuggestionName] = useState("");
  const [suggestionMobile, setSuggestionMobile] = useState("");
  const [suggestionType, setSuggestionType] = useState("difficulty");
  const [suggestionText, setSuggestionText] = useState("");
  const [suggestionSubmitting, setSuggestionSubmitting] = useState(false);
  const [suggestionSubmitted, setSuggestionSubmitted] = useState(false);

  // Digital shop receipt slip developer helper states
  const [slipCustomer, setSlipCustomer] = useState("");
  const [slipPhone, setSlipPhone] = useState("");
  const [slipService, setSlipService] = useState("আধার কার্ড সংশোধন / বায়োমেট্রিক");
  const [slipAmount, setSlipAmount] = useState("50");
  const [slipPaid, setSlipPaid] = useState(true);
  const [generatedSlip, setGeneratedSlip] = useState<any>(null);

  const toggleSaveScheme = (id: string) => {
    setSavedSchemeIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleSaveJob = (id: string) => {
    setSavedJobIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleSubscribeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobileNumber) return;
    try {
      setSubTypeSuccess(true);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAdminPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPasswordInput === "100") {
      setIsAdminOpen(true);
      setShowAdminPasswordModal(false);
      setAdminPasswordInput("");
      setAdminPasswordError("");
    } else {
      setAdminPasswordError("ভুল সিকিউরিটি কোড! দয়া করে সঠিক কোডটি দিন।");
    }
  };

  const submitSuggestionForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!suggestionText.trim()) return;
    setSuggestionSubmitting(true);
    const id = "sug_" + Date.now();
    const newSug: Suggestion = {
      id,
      name: suggestionName || "বেনামী নাগরিক",
      mobile: suggestionMobile || "",
      type: suggestionType,
      text: suggestionText,
      status: "pending",
      created_at: new Date().toISOString()
    };
    try {
      if (!isPlaceholderFirebase) {
        if (rtdb) {
          await rtdbSet(rtdbRef(rtdb, `suggestions/${id}`), newSug);
        } else if (db) {
          await setDoc(doc(db, "suggestions", id), newSug);
        }
      }
      await fetch("/api/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSug)
      }).catch((e) => console.warn("API fallback ignored:", e));

      setSuggestions((prev) => [newSug, ...prev]);
      setSuggestionSubmitted(true);
      setSuggestionText("");
    } catch (err) {
      console.error("Error submitting suggestion:", err);
    } finally {
      setSuggestionSubmitting(false);
    }
  };

  const allDashboardItems = useMemo(() => {
    const list: any[] = [];

    // Helper to translate to English if needed
    const getTargetTitle = (t: string, tEn?: string) => {
      if (tEn && tEn.trim()) {
        return getEnglishTitleUnified(tEn);
      }
      return getEnglishTitleUnified(t);
    };

    // 1. Schemes -> welfare category
    if (Array.isArray(schemes)) {
      schemes.forEach((item) => {
        list.push({
          id: item.id,
          title: getTargetTitle(item.title, item.titleEn),
          subtitle: item.titleEn || item.categoryName || "সরকারি প্রকল্প",
          cat: "welfare",
          category: item.category || "welfare",
          categoryName: item.categoryName || "জনকল্যাণ",
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
          title: getTargetTitle(item.title),
          subtitle: item.subtitle || item.categoryName || "নিয়োগ বিজ্ঞপ্তি",
          cat: "jobs",
          category: item.category || "jobs",
          categoryName: item.categoryName || "সরকারি চাকরি",
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
          title: getTargetTitle(item.title),
          subtitle: item.amount || "শিক্ষাবৃত্তি অনুদান",
          cat: "scholarships",
          category: item.category || "scholarships",
          categoryName: item.categoryName || "স্কলারশিপ",
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
            title: getTargetTitle(item.title, item.titleEn),
            subtitle: item.subtitle || item.categoryName || "ডিজিটাল সেবা",
            category: mappedCat,
            categoryName: item.categoryName || "সেবা",
            description: item.description || "ডিজিটাল পোর্টাল ও অনলাইন আবেদন প্রক্রিয়া",
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
    const activeCategoryFiltered = allDashboardItems.filter((item) => {
      return docCategory === "all" || item.cat === docCategory || item.category === docCategory;
    });

    if (!searchQuery.trim()) {
      return activeCategoryFiltered;
    }

    const cleanQuery = searchQuery.trim().toLowerCase();
    const expandedTerms = expandQuery(searchQuery);

    const scoredList = activeCategoryFiltered
      .map((item) => {
        let score = 0;
        const titleLower = item.title.toLowerCase();
        const subtitleLower = item.subtitle ? item.subtitle.toLowerCase() : "";
        const descLower = item.description ? item.description.toLowerCase() : "";
        const badgeLower = item.badge ? item.badge.toLowerCase() : "";
        const catNameLower = item.categoryName ? item.categoryName.toLowerCase() : "";

        // Direct/Exact Match Scoring
        if (titleLower === cleanQuery || subtitleLower === cleanQuery) {
          score += 500;
        } else if (titleLower.includes(cleanQuery)) {
          score += 300;
          if (titleLower.startsWith(cleanQuery)) score += 100;
        } else if (subtitleLower.includes(cleanQuery)) {
          score += 200;
          if (subtitleLower.startsWith(cleanQuery)) score += 50;
        }

        // Expanded Terms and partial keywords (English or Bengali)
        expandedTerms.forEach((term) => {
          const t = term.toLowerCase();
          if (titleLower.includes(t)) {
            score += 80;
          }
          if (subtitleLower.includes(t)) {
            score += 60;
          }
          if (badgeLower.includes(t) || catNameLower.includes(t)) {
            score += 40;
          }
          if (descLower.includes(t)) {
            score += 20;
          }
        });

        return { item, score };
      })
      .filter((entry) => entry.score > 0);

    // Sort by descending score to place matching portals first
    scoredList.sort((a, b) => b.score - a.score);

    return scoredList.map((entry) => entry.item);
  }, [allDashboardItems, searchQuery, docCategory]);

  // Fetch and sync all databases in real-time
  useEffect(() => {
    let unsubSchemes = () => {};
    let unsubJobs = () => {};
    let unsubScholarships = () => {};
    let unsubServices = () => {};
    let unsubCategories = () => {};
    let unsubSuggestions = () => {};

    if (!isPlaceholderFirebase) {
      try {
        if (rtdb) {
          unsubSchemes = onRtdbValue(rtdbRef(rtdb, "schemes"), (snapshot) => {
            const val = snapshot.val();
            if (val) {
              const list = Array.isArray(val)
                ? val.filter(Boolean)
                : Object.keys(val).map((k) => val[k]);
              setSchemes(list);
            } else {
              setSchemes([]);
            }
          }, (err) => {
            console.warn("Client-side schemes RTDB listener skipped:", err);
            // Fallback to Firestore listener
            unsubSchemes = onSnapshot(collection(db, "schemes"), (snap) => {
              const list: Scheme[] = [];
              snap.forEach((doc) => list.push(doc.data() as Scheme));
              setSchemes(list);
            }, (fsErr) => {
              console.warn("Fallback client schemes Firestore skipped:", fsErr);
            });
          });

          unsubJobs = onRtdbValue(rtdbRef(rtdb, "jobs"), (snapshot) => {
            const val = snapshot.val();
            if (val) {
              const list = Array.isArray(val)
                ? val.filter(Boolean)
                : Object.keys(val).map((k) => val[k]);
              setJobs(list);
            } else {
              setJobs([]);
            }
          }, (err) => {
            console.warn("Client-side jobs RTDB listener skipped:", err);
            // Fallback to Firestore listener
            unsubJobs = onSnapshot(collection(db, "jobs"), (snap) => {
              const list: Job[] = [];
              snap.forEach((doc) => list.push(doc.data() as Job));
              setJobs(list);
            }, (fsErr) => {
              console.warn("Fallback client jobs Firestore skipped:", fsErr);
            });
          });

          unsubScholarships = onRtdbValue(rtdbRef(rtdb, "scholarships"), (snapshot) => {
            const val = snapshot.val();
            if (val) {
              const list = Array.isArray(val)
                ? val.filter(Boolean)
                : Object.keys(val).map((k) => val[k]);
              setScholarships(list);
            } else {
              setScholarships([]);
            }
          }, (err) => {
            console.warn("Client-side scholarships RTDB listener skipped:", err);
            // Fallback to Firestore listener
            unsubScholarships = onSnapshot(collection(db, "scholarships"), (snap) => {
              const list: Scholarship[] = [];
              snap.forEach((doc) => list.push(doc.data() as Scholarship));
              setScholarships(list);
            }, (fsErr) => {
              console.warn("Fallback client scholarships Firestore skipped:", fsErr);
            });
          });

          unsubServices = onRtdbValue(rtdbRef(rtdb, "services"), (snapshot) => {
            const val = snapshot.val();
            if (val) {
              const list = Array.isArray(val)
                ? val.filter(Boolean)
                : Object.keys(val).map((k) => val[k]);
              setServices(list);
            } else {
              setServices([]);
            }
          }, (err) => {
            console.warn("Client-side services RTDB listener skipped:", err);
            // Fallback to Firestore listener
            unsubServices = onSnapshot(collection(db, "services"), (snap) => {
              const list: ServiceItem[] = [];
              snap.forEach((doc) => list.push(doc.data() as ServiceItem));
              setServices(list);
            }, (fsErr) => {
              console.warn("Fallback client services Firestore skipped:", fsErr);
            });
          });

          unsubCategories = onRtdbValue(rtdbRef(rtdb, "categories"), (snapshot) => {
            const val = snapshot.val();
            if (val) {
              const list = Array.isArray(val)
                ? val.filter(Boolean)
                : Object.keys(val).map((k) => val[k]);
              setCategories(list);
            } else {
              setCategories([]);
            }
          }, (err) => {
            console.warn("Client-side categories RTDB listener skipped:", err);
            // Fallback to Firestore listener
            unsubCategories = onSnapshot(collection(db, "categories"), (snap) => {
              const list: CategoryItem[] = [];
              snap.forEach((doc) => list.push(doc.data() as CategoryItem));
              setCategories(list);
            }, (fsErr) => {
              console.warn("Fallback client categories Firestore skipped:", fsErr);
            });
          });
        } else {
          unsubSchemes = onSnapshot(collection(db, "schemes"), (snapshot) => {
            const list: Scheme[] = [];
            snapshot.forEach((doc) => {
              list.push(doc.data() as Scheme);
            });
            setSchemes(list);
          }, (err) => {
            console.warn("Client-side schemes onSnapshot listener skipped:", err);
          });

          unsubJobs = onSnapshot(collection(db, "jobs"), (snapshot) => {
            const list: Job[] = [];
            snapshot.forEach((doc) => {
              list.push(doc.data() as Job);
            });
            setJobs(list);
          }, (err) => {
            console.warn("Client-side jobs onSnapshot listener skipped:", err);
          });

          unsubScholarships = onSnapshot(collection(db, "scholarships"), (snapshot) => {
            const list: Scholarship[] = [];
            snapshot.forEach((doc) => {
              list.push(doc.data() as Scholarship);
            });
            setScholarships(list);
          }, (err) => {
            console.warn("Client-side scholarships onSnapshot listener skipped:", err);
          });

          unsubServices = onSnapshot(collection(db, "services"), (snapshot) => {
            const list: ServiceItem[] = [];
            snapshot.forEach((doc) => {
              list.push(doc.data() as ServiceItem);
            });
            setServices(list);
          }, (err) => {
            console.warn("Client-side services onSnapshot listener skipped:", err);
          });

          unsubCategories = onSnapshot(collection(db, "categories"), (snapshot) => {
            const list: CategoryItem[] = [];
            snapshot.forEach((doc) => {
              list.push(doc.data() as CategoryItem);
            });
            setCategories(list);
          }, (err) => {
            console.warn("Client-side categories onSnapshot listener skipped:", err);
          });

          unsubSuggestions = onSnapshot(collection(db, "suggestions"), (snapshot) => {
            const list: Suggestion[] = [];
            snapshot.forEach((doc) => {
              list.push(doc.data() as Suggestion);
            });
            setSuggestions(list);
          }, (err) => {
            console.warn("Client-side suggestions onSnapshot listener skipped:", err);
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
        if (Array.isArray(schemesR)) {
          setSchemes((prev) => prev.length === 0 ? schemesR : prev);
        }

        const jobsR = await fetch("/api/jobs").then(r => r.json()).catch(() => []);
        if (Array.isArray(jobsR)) {
          setJobs((prev) => prev.length === 0 ? jobsR : prev);
        }

        const scholarshipsR = await fetch("/api/scholarships").then(r => r.json()).catch(() => []);
        if (Array.isArray(scholarshipsR)) {
          setScholarships((prev) => prev.length === 0 ? scholarshipsR : prev);
        }

        const servicesR = await fetch("/api/services").then(r => r.json()).catch(() => []);
        if (Array.isArray(servicesR)) {
          setServices((prev) => prev.length === 0 ? servicesR : prev);
        }

        const categoriesR = await fetch("/api/categories").then(r => r.json()).catch(() => []);
        if (Array.isArray(categoriesR)) {
          setCategories((prev) => prev.length === 0 || prev === DEFAULT_CATEGORIES ? categoriesR : prev);
        }

        const suggestionsR = await fetch("/api/suggestions").then(r => r.json()).catch(() => []);
        if (Array.isArray(suggestionsR) && suggestionsR.length > 0) {
          setSuggestions((prev) => prev.length === 0 ? suggestionsR : prev);
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
      unsubSuggestions();
    };
  }, []);

  const handleCreateScheme = async (scheme: Scheme) => {
    try {
      if (!isPlaceholderFirebase) {
        if (rtdb) {
          await rtdbSet(rtdbRef(rtdb, `schemes/${scheme.id}`), scheme);
        } else if (db) {
          await setDoc(doc(db, "schemes", scheme.id), scheme);
        }
      }
      await fetch("/api/schemes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(scheme)
      }).catch((e) => console.warn("API fallback ignored (expected on Vercel):", e));
      
      setSchemes((prev) => {
        if (prev.some((s) => s.id === scheme.id)) return prev;
        return [scheme, ...prev];
      });
    } catch (err) {
      console.error("Error creating scheme:", err);
    }
  };
  const handleSaveScheme = async (scheme: Scheme) => {
    try {
      if (!isPlaceholderFirebase) {
        if (rtdb) {
          await rtdbSet(rtdbRef(rtdb, `schemes/${scheme.id}`), scheme);
        } else if (db) {
          await setDoc(doc(db, "schemes", scheme.id), scheme);
        }
      }
      await fetch("/api/schemes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(scheme)
      }).catch((e) => console.warn("API fallback ignored (expected on Vercel):", e));
      
      setSchemes((prev) => prev.map((s) => (s.id === scheme.id ? scheme : s)));
    } catch (err) {
      console.error("Error saving scheme:", err);
    }
  };
  const handleDeleteScheme = async (id: string) => {
    try {
      if (!isPlaceholderFirebase) {
        if (rtdb) {
          await rtdbSet(rtdbRef(rtdb, `schemes/${id}`), null);
        } else if (db) {
          await deleteDoc(doc(db, "schemes", id));
        }
      }
      await fetch(`/api/schemes/${id}`, { method: "DELETE" }).catch((e) => console.warn("API fallback ignored (expected on Vercel):", e));
      setSchemes((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Error deleting scheme:", err);
    }
  };

  const handleCreateJob = async (job: Job) => {
    try {
      if (!isPlaceholderFirebase) {
        if (rtdb) {
          await rtdbSet(rtdbRef(rtdb, `jobs/${job.id}`), job);
        } else if (db) {
          await setDoc(doc(db, "jobs", job.id), job);
        }
      }
      await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(job)
      }).catch((e) => console.warn("API fallback ignored (expected on Vercel):", e));
      
      setJobs((prev) => {
        if (prev.some((j) => j.id === job.id)) return prev;
        return [job, ...prev];
      });
    } catch (err) {
      console.error("Error creating job:", err);
    }
  };
  const handleSaveJob = async (job: Job) => {
    try {
      if (!isPlaceholderFirebase) {
        if (rtdb) {
          await rtdbSet(rtdbRef(rtdb, `jobs/${job.id}`), job);
        } else if (db) {
          await setDoc(doc(db, "jobs", job.id), job);
        }
      }
      await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(job)
      }).catch((e) => console.warn("API fallback ignored (expected on Vercel):", e));
      
      setJobs((prev) => prev.map((j) => (j.id === job.id ? job : j)));
    } catch (err) {
      console.error("Error saving job:", err);
    }
  };
  const handleDeleteJob = async (id: string) => {
    try {
      if (!isPlaceholderFirebase) {
        if (rtdb) {
          await rtdbSet(rtdbRef(rtdb, `jobs/${id}`), null);
        } else if (db) {
          await deleteDoc(doc(db, "jobs", id));
        }
      }
      await fetch(`/api/jobs/${id}`, { method: "DELETE" }).catch((e) => console.warn("API fallback ignored (expected on Vercel):", e));
      setJobs((prev) => prev.filter((j) => j.id !== id));
    } catch (err) {
      console.error("Error deleting job:", err);
    }
  };

  const handleCreateScholarship = async (scholarship: Scholarship) => {
    try {
      if (!isPlaceholderFirebase) {
        if (rtdb) {
          await rtdbSet(rtdbRef(rtdb, `scholarships/${scholarship.id}`), scholarship);
        } else if (db) {
          await setDoc(doc(db, "scholarships", scholarship.id), scholarship);
        }
      }
      await fetch("/api/scholarships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(scholarship)
      }).catch((e) => console.warn("API fallback ignored (expected on Vercel):", e));
      
      setScholarships((prev) => {
        if (prev.some((s) => s.id === scholarship.id)) return prev;
        return [scholarship, ...prev];
      });
    } catch (err) {
      console.error("Error creating scholarship:", err);
    }
  };
  const handleSaveScholarship = async (scholarship: Scholarship) => {
    try {
      if (!isPlaceholderFirebase) {
        if (rtdb) {
          await rtdbSet(rtdbRef(rtdb, `scholarships/${scholarship.id}`), scholarship);
        } else if (db) {
          await setDoc(doc(db, "scholarships", scholarship.id), scholarship);
        }
      }
      await fetch("/api/scholarships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(scholarship)
      }).catch((e) => console.warn("API fallback ignored (expected on Vercel):", e));
      
      setScholarships((prev) => prev.map((s) => (s.id === scholarship.id ? scholarship : s)));
    } catch (err) {
      console.error("Error saving scholarship:", err);
    }
  };
  const handleDeleteScholarship = async (id: string) => {
    try {
      if (!isPlaceholderFirebase) {
        if (rtdb) {
          await rtdbSet(rtdbRef(rtdb, `scholarships/${id}`), null);
        } else if (db) {
          await deleteDoc(doc(db, "scholarships", id));
        }
      }
      await fetch(`/api/scholarships/${id}`, { method: "DELETE" }).catch((e) => console.warn("API fallback ignored (expected on Vercel):", e));
      setScholarships((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Error deleting scholarship:", err);
    }
  };

  const handleCreateService = async (service: ServiceItem) => {
    try {
      if (!isPlaceholderFirebase) {
        if (rtdb) {
          await rtdbSet(rtdbRef(rtdb, `services/${service.id}`), service);
        } else if (db) {
          await setDoc(doc(db, "services", service.id), service);
        }
      }
      await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(service)
      }).catch((e) => console.warn("API fallback ignored (expected on Vercel):", e));
      
      setServices((prev) => {
        if (prev.some((s) => s.id === service.id)) return prev;
        return [service, ...prev];
      });
    } catch (err) {
      console.error("Error creating service:", err);
    }
  };

  const handleSaveService = async (service: ServiceItem) => {
    try {
      if (!isPlaceholderFirebase) {
        if (rtdb) {
          await rtdbSet(rtdbRef(rtdb, `services/${service.id}`), service);
        } else if (db) {
          await setDoc(doc(db, "services", service.id), service);
        }
      }
      await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(service)
      }).catch((e) => console.warn("API fallback ignored (expected on Vercel):", e));
      
      setServices((prev) => prev.map((s) => (s.id === service.id ? service : s)));
    } catch (err) {
      console.error("Error saving service:", err);
    }
  };

  const handleDeleteService = async (id: string) => {
    try {
      if (!isPlaceholderFirebase) {
        if (rtdb) {
          await rtdbSet(rtdbRef(rtdb, `services/${id}`), null);
        } else if (db) {
          await deleteDoc(doc(db, "services", id));
        }
      }
      await fetch(`/api/services/${id}`, { method: "DELETE" }).catch((e) => console.warn("API fallback ignored (expected on Vercel):", e));
      setServices((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Error deleting service:", err);
    }
  };

  const handleSaveCategory = async (category: CategoryItem) => {
    try {
      if (!isPlaceholderFirebase) {
        if (rtdb) {
          await rtdbSet(rtdbRef(rtdb, `categories/${category.id}`), category);
        } else if (db) {
          await setDoc(doc(db, "categories", category.id), category);
        }
      }
      await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(category)
      }).catch((e) => console.warn("API categories save fallback ignored:", e));

      setCategories((prev) => {
        if (prev.some((c) => c.id === category.id)) {
          return prev.map((c) => c.id === category.id ? category : c);
        }
        return [...prev, category];
      });
      triggerPushBroadcast(`নতুন ক্যাটাগরি যুক্ত বা আপডেট করা হয়েছে: ${category.label}`);
    } catch (err) {
      console.error("Error saving category:", err);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      if (!isPlaceholderFirebase) {
        if (rtdb) {
          await rtdbSet(rtdbRef(rtdb, `categories/${id}`), null);
        } else if (db) {
          await deleteDoc(doc(db, "categories", id));
        }
      }
      await fetch(`/api/categories/${id}`, { method: "DELETE" }).catch((e) => console.warn("API categories delete fallback ignored:", e));
      setCategories((prev) => prev.filter((c) => c.id !== id));
      triggerPushBroadcast("ক্যাটাগরি সফলভাবে মুছে ফেলা হয়েছে।");
    } catch (err) {
      console.error("Error deleting category:", err);
    }
  };

  const handleSaveSettings = async (newSettings: { geminiApiKey: string; heroBannerUrl?: string }): Promise<boolean> => {
    try {
      if (!isPlaceholderFirebase) {
        if (rtdb) {
          await rtdbSet(rtdbRef(rtdb, "settings"), newSettings);
        } else if (db) {
          await setDoc(doc(db, "settings", "global"), newSettings);
        }
      }
      await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSettings)
      }).catch((e) => console.warn("API settings save fallback ignored:", e));

      setSettings(newSettings);
      triggerPushBroadcast("সিস্টেম সেটিংস সফলভাবে সেভ করা হয়েছে।");
      return true;
    } catch (err) {
      console.error("Error saving settings:", err);
      return false;
    }
  };

  const savedSchemesList = useMemo(() => {
    return schemes.filter((s) => savedSchemeIds.includes(s.id));
  }, [schemes, savedSchemeIds]);

  const savedJobsList = useMemo(() => {
    return jobs.filter((j) => savedJobIds.includes(j.id));
  }, [jobs, savedJobIds]);

  const filteredSchemes = useMemo(() => {
    if (!searchQuery.trim()) {
      return schemes.filter((scheme) => {
        return activeSchemeTab === "all" || scheme.category === activeSchemeTab;
      });
    }

    const expandedTerms = expandQuery(searchQuery);

    return schemes.filter((scheme) => {
      const matchesSearch = expandedTerms.some((term) => {
        const lowerTerm = term.toLowerCase();
        return (
          scheme.title.toLowerCase().includes(lowerTerm) ||
          (scheme.titleEn && scheme.titleEn.toLowerCase().includes(lowerTerm)) ||
          scheme.benefits.toLowerCase().includes(lowerTerm) ||
          scheme.category.toLowerCase().includes(lowerTerm) ||
          (scheme.categoryName && scheme.categoryName.toLowerCase().includes(lowerTerm))
        );
      });

      const matchesTab = activeSchemeTab === "all" || scheme.category === activeSchemeTab;
      return matchesSearch && matchesTab;
    });
  }, [schemes, searchQuery, activeSchemeTab]);

  const filteredJobs = useMemo(() => {
    if (!searchQuery.trim()) {
      return jobs.filter((job) => {
        return activeJobTab === "all" || job.category === activeJobTab;
      });
    }

    const expandedTerms = expandQuery(searchQuery);

    return jobs.filter((job) => {
      const matchesSearch = expandedTerms.some((term) => {
        const lowerTerm = term.toLowerCase();
        return (
          job.title.toLowerCase().includes(lowerTerm) ||
          (job.subtitle && job.subtitle.toLowerCase().includes(lowerTerm)) ||
          job.qualification.toLowerCase().includes(lowerTerm) ||
          job.category.toLowerCase().includes(lowerTerm) ||
          (job.categoryName && job.categoryName.toLowerCase().includes(lowerTerm))
        );
      });

      const matchesTab = activeJobTab === "all" || job.category === activeJobTab;
      return matchesSearch && matchesTab;
    });
  }, [jobs, searchQuery, activeJobTab]);

  const triggerPushBroadcast = (text: string) => {
    setBroadcastNotices((prev) => [text, ...prev]);
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-[#F8FAFC] md:bg-slate-50/70 text-[#0F172A] transition-all duration-300 text-sm">
      
      {/* 2. MAIN WRAPPER CONTAINER - Desktop & Mobile Unified Hub Card */}
      <div className="w-full flex-grow flex flex-col max-w-7xl mx-auto md:my-6 bg-white md:border md:border-slate-200/95 md:rounded-3xl md:shadow-[0_10px_35px_-8px_rgba(15,23,42,0.04)] overflow-hidden">
        
        {/* GLOBAL TOP NAVIGATION BAR */}
        <nav className="bg-white border-b border-slate-200 sticky top-0 md:static z-40 w-full shadow-[0_1px_3px_rgba(0,0,0,0.02)] md:shadow-none select-none font-sans">
          <div className="w-full px-4 sm:px-6">
            <div className="flex justify-between h-16 items-center gap-2 sm:gap-4">
              {/* Logo and Brand */}
              <div 
                onClick={() => {
                  setIsAdminOpen(false);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="flex items-center gap-1.5 sm:gap-2 cursor-pointer group active:scale-95 transition-transform shrink-0"
              >
                <img 
                  src={userLogo} 
                  className="h-8 w-8 sm:h-10 sm:w-10 object-contain bg-slate-50 border border-slate-100/80 rounded-xl p-0.5 sm:p-1 shrink-0" 
                  alt="সহজ সেবা লোগো"
                  referrerPolicy="no-referrer"
                />
                <div className="text-left leading-none font-sans select-none block">
                  <h1 className="text-xs sm:text-sm md:text-base font-extrabold text-[#15803D] tracking-tight">
                    সহজ সেবা
                  </h1>
                  <span className="text-[7.5px] sm:text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-wider block">নাগরিক সেবা পোর্টাল</span>
                </div>
              </div>

              {/* Middle Search Bar with Search/খুঁজুন Button & Elegant Glow Styling */}
              <div className="flex-1 max-w-sm md:max-w-md mx-2 sm:mx-4 relative z-20">
                <div className="relative flex items-center bg-[#F8FAFC] hover:bg-slate-100/80 border border-slate-250 border-slate-300/80 focus-within:ring-4 focus-within:ring-emerald-500/10 focus-within:border-[#15803D] focus-within:bg-white rounded-xl sm:rounded-2xl overflow-hidden transition-all shadow-[0_2px_8px_-1px_rgba(15,23,42,0.03)]">
                  <div className="pl-3 sm:pl-4 flex items-center pointer-events-none text-slate-400">
                    <Search className="h-4 w-4 shrink-0 transition-colors" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      if (e.target.value.trim() && activeSidebarTab !== "all-links") {
                        setActiveSidebarTab("all-links");
                        setIsAdminOpen(false);
                      }
                    }}
                    placeholder="Search government services & portals..."
                    className="w-full pl-2 pr-2 py-1.5 sm:py-2.5 text-xs sm:text-sm font-bold bg-transparent border-0 outline-hidden focus:ring-0 focus:outline-hidden text-slate-800 placeholder-slate-400"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="p-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer mr-1 shrink-0"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                  <button 
                    onClick={() => {
                      setActiveSidebarTab("all-links");
                      setIsAdminOpen(false);
                      setTimeout(() => {
                        const element = document.getElementById("services-anchor");
                        if (element) {
                          element.scrollIntoView({ behavior: "smooth", block: "start" });
                        }
                      }, 50);
                    }}
                    className="bg-[#15803D] hover:bg-green-700 text-white px-3 sm:px-4 py-1.5 sm:py-2.5 text-[11px] sm:text-xs font-black transition-all duration-150 shrink-0 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] flex items-center gap-1 border-l border-emerald-600"
                  >
                    <span>খুঁজুন</span>
                  </button>
                </div>
              </div>

              {/* Action area on the right */}
              <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
                {/* Free Help Center Trigger */}
                <button
                  onClick={() => {
                    setSuggestionSubmitted(false);
                    setSuggestionText("");
                    setShowHelpCenterModal(true);
                  }}
                  className="bg-amber-50 hover:bg-amber-100/80 text-amber-800 border border-amber-200/90 px-2 sm:px-3.5 py-1.5 rounded-xl text-[10px] sm:text-xs font-black cursor-pointer transition-all duration-150 flex items-center gap-1 shadow-3xs"
                >
                  <HelpCircle className="h-3 sm:h-3.5 sm:w-3.5 text-amber-600 shrink-0" />
                  <span className="hidden leading-none md:inline">ফ্রি হেল্প সেন্টার</span>
                  <span className="md:hidden">হেল্প</span>
                </button>

                {/* Admin/Login Trigger */}
                <button
                  onClick={() => setShowAdminPasswordModal(true)}
                  className="text-[#15803D] hover:bg-emerald-50 bg-emerald-50/45 border border-[#86EFAC]/45 px-2.5 sm:px-3.5 py-1.5 rounded-xl text-[10px] sm:text-xs font-black cursor-pointer transition-all duration-150 flex items-center gap-1 shadow-3xs"
                >
                  <Shield className="h-3 sm:h-3.5 sm:w-3.5 text-emerald-600 shrink-0" />
                  <span className="hidden sm:inline">লগইন</span>
                  <span className="sm:hidden">লগইন</span>
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* 4. Main Container / Content Conditional */}
        <main className="flex-grow">
          {isAdminOpen ? (
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-10">
              {/* Render Admin Panel with its full settings */}
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
                firebaseStatus={null}
                settings={settings}
                onSaveSettings={handleSaveSettings}
                suggestions={suggestions}
                onSaveSuggestion={async (item) => {
                  try {
                    if (!isPlaceholderFirebase) {
                      if (rtdb) {
                        await rtdbSet(rtdbRef(rtdb, `suggestions/${item.id}`), item);
                      } else if (db) {
                        await setDoc(doc(db, "suggestions", item.id), item);
                      }
                    }
                    await fetch("/api/suggestions", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(item)
                    }).catch((e) => console.warn("API fallback ignored:", e));
                    setSuggestions(prev => prev.map(x => x.id === item.id ? item : x));
                  } catch (e) {
                    console.error("Error updating suggestion:", e);
                  }
                }}
                onDeleteSuggestion={async (id) => {
                  try {
                    if (!isPlaceholderFirebase) {
                      if (rtdb) {
                        await rtdbSet(rtdbRef(rtdb, `suggestions/${id}`), null);
                      } else if (db) {
                        await deleteDoc(doc(db, "suggestions", id));
                      }
                    }
                    await fetch(`/api/suggestions/${id}`, {
                      method: "DELETE"
                    }).catch((e) => console.warn("API fallback ignored:", e));
                    setSuggestions(prev => prev.filter(x => x.id !== id));
                  } catch (e) {
                    console.error("Error deleting suggestion:", e);
                  }
                }}
              />
            </div>
          ) : (

          <div className="w-full mx-auto px-4 sm:px-6 lg:px-0 py-5 lg:py-0 sm:py-7">
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-0 items-start lg:items-stretch">
              
              {/* LEFT SIDEBAR (সহজ সেবা লোগো থেকে পুরো একটা পেছনে বক্স আকারের নামবে) */}
              <aside className="w-full lg:w-64 shrink-0 bg-white border border-slate-200/80 lg:border-y-0 lg:border-l-0 lg:border-r lg:border-slate-150/80 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.03)] lg:shadow-none rounded-2xl lg:rounded-none p-4 sm:p-5 lg:p-6 flex flex-col gap-5 select-none self-start lg:self-auto lg:bg-slate-50/50 lg:sticky lg:top-0">
                
                {/* 1. Menu List Header at the very top (Enlarged and highlighted) */}
                <div className="space-y-3">
                  <div className="text-sm sm:text-base font-extrabold text-slate-800 tracking-wider uppercase pb-2 border-b border-slate-200 flex items-center gap-2 px-0.5">
                    <ClipboardList className="h-4.5 w-4.5 text-[#15803D]" />
                    <span>মেনু তালিকা</span>
                  </div>

                  <div className="grid grid-cols-3 lg:grid-cols-1 gap-1.5 pt-1">
                    {/* সেবা সমূহ - Active & beautiful */}
                    <button
                      onClick={() => {
                        setActiveSidebarTab("services");
                        setIsAdminOpen(false);
                      }}
                      className={`flex items-center gap-2.5 px-3 py-2.5 sm:py-3 rounded-xl text-[11px] sm:text-xs text-left cursor-pointer transition-all duration-200 border ${
                        activeSidebarTab === "services"
                          ? "text-[#15803D] bg-emerald-50 border-[#86EFAC]/45 font-black shadow-3xs"
                          : "text-slate-650 bg-slate-50 border-slate-200/60 hover:bg-slate-100/30 font-bold"
                      }`}
                    >
                      <Grid className={`h-3.5 w-3.5 shrink-0 ${activeSidebarTab === "services" ? "text-emerald-600" : "text-slate-400"}`} />
                      <span className="truncate">সেবা সমূহ</span>
                    </button>

                    {/* সমস্ত লিংক - Inactive but beautiful */}
                    <button
                      onClick={() => {
                        setActiveSidebarTab("all-links");
                        setIsAdminOpen(false);
                      }}
                      className={`flex items-center gap-2.5 px-3 py-2.5 sm:py-3 rounded-xl text-[11px] sm:text-xs text-left cursor-pointer transition-all duration-200 border ${
                        activeSidebarTab === "all-links"
                          ? "text-[#15803D] bg-emerald-50 border-[#86EFAC]/45 font-black shadow-3xs"
                          : "text-slate-650 bg-slate-50 border-slate-200/60 hover:bg-slate-100/30 font-bold"
                      }`}
                    >
                      <Globe className={`h-3.5 w-3.5 shrink-0 ${activeSidebarTab === "all-links" ? "text-emerald-600" : "text-slate-400"}`} />
                      <span className="truncate">সমস্ত লিংক</span>
                    </button>

                    {/* টুলস - Inactive but beautiful */}
                    <button
                      onClick={() => {
                        setActiveSidebarTab("tools");
                        setIsAdminOpen(false);
                      }}
                      className={`flex items-center gap-2.5 px-3 py-2.5 sm:py-3 rounded-xl text-[11px] sm:text-xs text-left cursor-pointer transition-all duration-200 border ${
                        activeSidebarTab === "tools"
                          ? "text-[#15803D] bg-emerald-50 border-[#86EFAC]/45 font-black shadow-3xs"
                          : "text-slate-650 bg-slate-50 border-slate-200/60 hover:bg-slate-100/30 font-bold"
                      }`}
                    >
                      <Laptop className={`h-3.5 w-3.5 shrink-0 ${activeSidebarTab === "tools" ? "text-emerald-600" : "text-slate-400"}`} />
                      <span className="truncate">টুলস</span>
                    </button>
                  </div>
                </div>

                {/* 3. Supports Helpline (হালকা গ্রীন কালার দিয়ে সাপোর্ট হেল্পলাইন করবে ভালো করে 9382040746, নিচে বিকাল ৪ঃ০০ টা থেকে রাত্রি ১০:০০) */}
                <div className="bg-[#EFFDF4]/90 border border-[#86EFAC]/45 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-3xs select-none">
                  <div className="w-8.5 h-8.5 bg-emerald-100 flex items-center justify-center rounded-xl text-[#15803D] mb-1.5 border border-[#86EFAC]/30 shrink-0">
                    <Phone className="h-4.5 w-4.5 text-emerald-700 animate-pulse" />
                  </div>
                  <div className="text-[10px] text-emerald-800 font-extrabold tracking-wider uppercase mb-0.5 font-sans">
                    সাপোর্ট হেল্পলাইন
                  </div>
                  <a href="tel:9382040746" className="text-sm sm:text-base font-black text-[#15803D] font-sans tracking-tight hover:underline mb-1 flex items-center gap-1">
                    9382040746
                  </a>
                  <div className="text-[9px] sm:text-[9.5px] text-emerald-800 font-extrabold bg-emerald-100/50 border border-emerald-200/30 px-2 py-0.5 rounded-md leading-relaxed whitespace-nowrap">
                    বিকাল ৪ঃ০০ টা থেকে রাত্রি ১০:০০
                  </div>
                </div>

              </aside>

              {/* RIGHT CONTENT COLUMN */}
              <div className="flex-1 min-w-0 w-full space-y-5 lg:space-y-6 lg:p-6 lg:bg-white">

                {activeSidebarTab === "services" && (
                  <DashboardServices
                    categories={categories}
                    updates={updates}
                    onSelectCategory={(catId) => {
                      setDocCategory(catId);
                      setActiveSidebarTab("all-links");
                      setTimeout(() => {
                        const el = document.getElementById("services-anchor");
                        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                      }, 80);
                    }}
                    onNavigateTab={(tab) => {
                      setActiveSidebarTab(tab);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    getCategoryIcon={getCategoryIcon}
                  />
                )}

                {activeSidebarTab === "all-links" && (
                  <DashboardAllLinks
                    categories={categories}
                    docCategory={docCategory}
                    setDocCategory={setDocCategory}
                    displayedItems={displayedItems}
                    getCategoryIcon={getCategoryIcon}
                    getCategoryColorAccent={getCategoryColorAccent}
                    renderOfficialLogo={renderOfficialLogo}
                    getServiceMetadata={getServiceMetadata}
                    onSelectService={setSelectedService}
                  />
                )}


                {activeSidebarTab === "tools" && (
                  <DashboardTools
                    slipCustomer={slipCustomer}
                    setSlipCustomer={setSlipCustomer}
                    slipPhone={slipPhone}
                    setSlipPhone={setSlipPhone}
                    slipService={slipService}
                    setSlipService={setSlipService}
                    slipAmount={slipAmount}
                    setSlipAmount={setSlipAmount}
                    slipPaid={slipPaid}
                    setSlipPaid={setSlipPaid}
                    generatedSlip={generatedSlip}
                    setGeneratedSlip={setGeneratedSlip}
                  />
                )}


              </div> {/* Close RIGHT CONTENT COLUMN */}
            </div> {/* Close flex row */}
          </div>
        )}
      </main>
      </div> {/* Close Desktop Wrapper Card */}

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
      <footer className="relative w-full overflow-hidden bg-gradient-to-br from-[#064E3B] via-[#065F46] to-[#022C22] text-white pt-8 pb-0 border-t border-emerald-800/60 shadow-[0_-10px_30px_rgba(6,78,59,0.12)] flex flex-col justify-between">
        {/* Modern SaaS Grid/Glow Overlay */}
        <div className="absolute inset-0 z-0 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.07)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent z-1 pointer-events-none" />
        <div className="absolute -top-40 left-12 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl z-0 pointer-events-none" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 w-full pb-8 pt-2">
          <div className="grid grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            
            {/* Left Section: Logo, Tagline, Bio & Socials */}
            <div className="col-span-4 sm:col-span-4 md:col-span-1 space-y-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <img 
                    src={userLogo} 
                    className="h-8 w-8 object-contain bg-white/10 backdrop-blur-md rounded-lg p-1 border border-white/20 select-none shrink-0" 
                    alt="সহজ সেবা লোগো" 
                    referrerPolicy="no-referrer"
                  />
                  <span className="font-extrabold text-base sm:text-lg tracking-tight text-white font-sans">
                    সহজ সেবা
                  </span>
                </div>
                <div className="inline-block px-1.5 py-0.5 bg-emerald-500/10 border border-emerald-400/20 rounded-md text-[8px] sm:text-[9px] font-black text-emerald-300 tracking-wider font-sans">
                  সব সেবা, এক ক্লিকে
                </div>
              </div>
              
              <p className="text-[10px] sm:text-xs text-white/70 leading-relaxed font-sans max-w-none font-medium">
                পশ্চিমবঙ্গের নাগরিকদের জন্য সরকারি, শিক্ষা, চাকরি, স্বাস্থ্য ও প্রয়োজনীয় সকল সেবার নির্ভরযোগ্য তথ্যভাণ্ডার।
              </p>
              
              {/* Social Media Icons with circular layout and hover effects */}
              <div className="flex items-center gap-2 pt-0.5">
                <a
                  href="https://www.facebook.com/share/1Cw5LUeDrT/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-7 h-7 rounded-full bg-white/5 border border-white/10 hover:bg-[#15803D] hover:border-emerald-400 text-white/80 hover:text-white transition-all duration-300 transform hover:scale-110 flex items-center justify-center cursor-pointer shadow-sm focus:outline-hidden"
                  aria-label="Facebook"
                >
                  <Facebook className="h-3.5 w-3.5" />
                </a>

                <a
                  href="https://whatsapp.com/channel/0029Vb81iAi1SWszw7skrt29"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-7 h-7 rounded-full bg-white/5 border border-white/10 hover:bg-[#15803D] hover:border-emerald-400 text-white/80 hover:text-white transition-all duration-300 transform hover:scale-110 flex items-center justify-center cursor-pointer shadow-sm focus:outline-hidden"
                  aria-label="WhatsApp"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.1 1.45 4.675 1.451 5.435 0 9.851-4.413 9.854-9.855.002-2.636-1.02-5.115-2.883-6.98C16.426 1.854 13.945 1.83 11.31 1.83a9.85 9.85 0 00-6.974 2.89C2.457 6.58 1.833 9.062 1.835 11.696c.001 1.636.438 3.23 1.266 4.634L2.14 21.8l5.525-1.451c-1.396-.757-1.396-.757.982-1.195z" />
                  </svg>
                </a>
                
                <a
                  href="https://youtube.com/@habajabatech"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-7 h-7 rounded-full bg-white/5 border border-white/10 hover:bg-[#15803D] hover:border-emerald-400 text-white/80 hover:text-white transition-all duration-300 transform hover:scale-110 flex items-center justify-center cursor-pointer shadow-sm focus:outline-hidden"
                  aria-label="YouTube"
                >
                  <Youtube className="h-3.5 w-3.5" />
                </a>

                <a
                  href="https://www.instagram.com/habajabatech"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-7 h-7 rounded-full bg-white/5 border border-white/10 hover:bg-[#15803D] hover:border-emerald-400 text-white/80 hover:text-white transition-all duration-300 transform hover:scale-110 flex items-center justify-center cursor-pointer shadow-sm focus:outline-hidden"
                  aria-label="Instagram"
                >
                  <Instagram className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
            
            {/* Column 1: গুরুত্বপূর্ণ লিংক */}
            <div className="col-span-4 sm:col-span-4 md:col-span-1 space-y-3">
              <h4 className="font-extrabold text-[11px] sm:text-xs uppercase tracking-wider text-emerald-300 font-sans border-b border-white/10 pb-1.5">
                গুরুত্বপূর্ণ লিংক
              </h4>
              <ul className="space-y-2 text-[10px] sm:text-[11px]">
                <li>
                  <button
                    onClick={() => {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="text-white/70 hover:text-white transition-all duration-300 transform hover:translate-x-1 inline-block cursor-pointer outline-hidden font-medium"
                  >
                    হোম
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      const el = document.getElementById("services-anchor");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="text-white/70 hover:text-white transition-all duration-300 transform hover:translate-x-1 inline-block cursor-pointer outline-hidden font-medium"
                  >
                    সেবা সমূহ
                  </button>
                </li>
              </ul>
            </div>
            
            {/* Column 2: সহায়তা */}
            <div className="col-span-4 sm:col-span-4 md:col-span-1 space-y-3">
              <h4 className="font-extrabold text-[11px] sm:text-xs uppercase tracking-wider text-emerald-300 font-sans border-b border-white/10 pb-1.5">
                সহায়তা
              </h4>
              <ul className="space-y-2 text-[10px] sm:text-[11px]">
                <li>
                  <button
                    onClick={() => setActiveLegalModal("privacy")}
                    className="text-white/70 hover:text-white transition-all duration-300 transform hover:translate-x-1 inline-block cursor-pointer outline-hidden font-medium"
                  >
                    গোপনীয়তা নীতি
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveLegalModal("terms")}
                    className="text-white/70 hover:text-white transition-all duration-300 transform hover:translate-x-1 inline-block cursor-pointer outline-hidden font-medium"
                  >
                    শর্তাবলী
                  </button>
                </li>
              </ul>
            </div>
            
            {/* Column 3: আমাদের সম্পর্কে */}
            <div className="col-span-4 sm:col-span-4 md:col-span-1 space-y-3">
              <h4 className="font-extrabold text-[11px] sm:text-xs uppercase tracking-wider text-emerald-300 font-sans border-b border-white/10 pb-1.5">
                আমাদের সম্পর্কে
              </h4>
              <ul className="space-y-2 text-[10px] sm:text-[11px]">
                <li>
                  <button
                    onClick={() => setActiveLegalModal("disclaimer")}
                    className="text-white/70 hover:text-white transition-all duration-300 transform hover:translate-x-1 inline-block cursor-pointer outline-hidden font-medium"
                  >
                    আমাদের সম্পর্কে
                  </button>
                </li>
              </ul>
            </div>
            
          </div>
        </div>
        
        {/* Bottom Footer Bar */}
        <div className="w-full bg-[#021D16] border-t border-white/5 py-3 sm:py-0 sm:h-[50px] flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-4 px-6 md:px-12 text-[10px] sm:text-xs text-white/50 font-sans mt-2">
          <span>
            © 2026 সহজ সেবা | সর্বস্বত্ব সংরক্ষিত
          </span>
          <span className="font-extrabold text-emerald-400 hover:text-emerald-300 transition-colors duration-300 tracking-wide">
            Design By HabaJaba Tech
          </span>
          <span className="flex items-center gap-1 font-semibold text-white/70">
            Made with <span className="text-red-500 animate-pulse">❤️</span> for West Bengal
          </span>
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

              {/* Dynamic Service Sub-Links (Direct Portal Actions) */}
              <div className="space-y-3.5 pt-3 border-t border-slate-100">
                <h4 className="font-extrabold text-slate-900 border-b border-orange-50 pb-1 text-xs uppercase tracking-wider text-slate-500">গুরুত্বপূর্ণ সরাসরি লিঙ্ক ও সার্ভিস সমূহ:</h4>
                <div className="grid grid-cols-1 gap-2">
                  {getServiceSubLinks(selectedService.id, selectedService.officialUrl, selectedService.subLinks).map((sublink, idx) => (
                    <a
                      key={idx}
                      href={sublink.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/sublink flex items-center justify-between p-2.5 rounded-xl border border-slate-150 bg-slate-50/50 hover:bg-orange-50/40 hover:border-orange-200 active:scale-[0.99] transition-all duration-250"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="h-7 w-7 rounded-lg bg-orange-100/70 text-bengali-orange flex items-center justify-center shrink-0 group-hover/sublink:bg-bengali-orange group-hover/sublink:text-white transition-colors">
                          <Zap className="h-3.5 w-3.5" />
                        </div>
                        <div className="min-w-0 text-left">
                          <p className="text-xs font-bold text-slate-800 leading-snug group-hover/sublink:text-bengali-orange transition-colors truncate">
                            {sublink.label}
                          </p>
                          <p className="text-[10px] text-slate-500 truncate mt-0.5">
                            {sublink.desc}
                          </p>
                        </div>
                      </div>
                      <span className="text-slate-400 group-hover/sublink:text-bengali-orange duration-200 p-1 bg-white border border-slate-150 rounded-lg shadow-3xs shrink-0">
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </span>
                    </a>
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
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-3 text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-orange-500/10 text-slate-900 font-sans"
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

      {activeLegalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-xs animate-fade-in font-sans">
          <div className="bg-white rounded-2xl w-full max-w-[600px] max-h-[85vh] overflow-hidden border border-slate-100 shadow-2xl flex flex-col">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-amber-400" />
                <h3 className="font-extrabold text-sm md:text-base text-white">
                  {activeLegalModal === "terms" && "আমাদের ব্যবহার বিধি ও শর্তাবলী"}
                  {activeLegalModal === "disclaimer" && "সরকারি তথ্য অস্বীকৃতিপত্র (Disclaimer)"}
                  {activeLegalModal === "privacy" && "ব্যক্তিগত গোপনীয়তা রক্ষা নীতি (Privacy Policy)"}
                </h3>
              </div>
              <button
                onClick={() => setActiveLegalModal(null)}
                className="text-white hover:bg-white/10 rounded-lg p-1.5 transition-colors cursor-pointer underline-none outline-none"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 overflow-y-auto shrink text-slate-705 leading-relaxed max-h-full">
              {activeLegalModal === "terms" && (
                <div className="space-y-4 text-xs md:text-sm text-slate-650 leading-relaxed font-sans">
                  <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl text-xs text-amber-850 font-semibold leading-relaxed font-sans">
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

      {/* MODAL: FREE HELP CENTER (CITIZEN OPINION & SUGGESTION POPUP) */}
      {showHelpCenterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fade-in animate-duration-150">
          <div className="bg-white rounded-3xl w-full max-w-[500px] overflow-hidden border border-amber-200/60 shadow-2xl flex flex-col transform transition-all scale-100 font-sans">
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-white p-5 flex items-center justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-8 -mt-8" />
              <div className="flex items-center gap-2.5 relative z-10">
                <div className="p-1.5 bg-white/10 rounded-lg shrink-0">
                  <HelpCircle className="h-5 w-5 text-amber-300 animate-pulse" />
                </div>
                <div className="flex flex-col">
                  <h3 className="font-extrabold text-sm md:text-base text-white tracking-wide">সহজ সেবা হেল্প সেন্টার</h3>
                  <span className="text-[10px] text-amber-100 font-medium tracking-wider uppercase">নাগরিক মতামত, পরামর্শ ও সাহায্য</span>
                </div>
              </div>
              <button 
                onClick={() => {
                  setShowHelpCenterModal(false);
                  setSuggestionSubmitted(false);
                }} 
                className="text-white hover:text-amber-105 bg-white/10 hover:bg-white/20 rounded-xl p-2 transition-all cursor-pointer relative z-10"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <div className="p-6 overflow-y-auto max-h-[75vh]">
              {suggestionSubmitted ? (
                <div className="py-6 flex flex-col items-center justify-center text-center space-y-3 animate-fade-in">
                  <div className="h-12 w-12 bg-emerald-50 rounded-full border border-emerald-100 flex items-center justify-center text-emerald-500">
                    <CheckCircle2 className="h-6 w-6 animate-bounce" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-black text-slate-800">আপনার মতামত সফলভাবে জমা হয়েছে!</h4>
                    <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                      সহজ সেবা হেল্প সেন্টারে আপনার গুরুত্বপূর্ণ সাজেশান বা পরামর্শটি রিয়েল-টাইমে সেভ করা হয়েছে। আমরা দ্রুত এটি পর্যালোচনা করব। ধন্যবাদ!
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setShowHelpCenterModal(false);
                      setSuggestionSubmitted(false);
                      setSuggestionText("");
                    }}
                    className="mt-4 px-5 py-2 text-xs font-bold text-white bg-[#15803D] hover:bg-emerald-700 rounded-xl transition-all cursor-pointer shadow-md"
                  >
                    বন্ধ করুন
                  </button>
                </div>
              ) : (
                <form onSubmit={submitSuggestionForm} className="space-y-4">
                  <p className="text-xs text-slate-600 font-bold leading-relaxed mb-1">
                    সহজ সেবাকে আরও উন্নত ও সমৃদ্ধ করতে আপনার যেকোনো পরামর্শ বা সমস্যার কথা আমাদের জানান। আমরা আপনার মতামত অত্যন্ত গুরুত্ব সহকারে বিবেচনা করি।
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    {/* Name field */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold text-slate-600 flex items-center gap-1">
                        <span>আপনার নাম</span>
                        <span className="text-[8px] text-slate-400 font-normal">(ঐচ্ছিক)</span>
                      </label>
                      <input
                        type="text"
                        value={suggestionName}
                        onChange={(e) => setSuggestionName(e.target.value)}
                        placeholder="যেমন: উজ্জ্বল দে"
                        className="w-full px-3 py-2 text-xs font-semibold border border-slate-200 rounded-xl focus:outline-hidden focus:ring-4 focus:ring-amber-500/10 focus:border-amber-600 bg-white hover:bg-slate-50/50 transition-all text-slate-800"
                      />
                    </div>

                    {/* Mobile No field */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold text-slate-600 flex items-center gap-1">
                        <span>মোবাইল নম্বর</span>
                        <span className="text-[8px] text-slate-400 font-normal">(ঐচ্ছিক)</span>
                      </label>
                      <input
                        type="tel"
                        value={suggestionMobile}
                        onChange={(e) => setSuggestionMobile(e.target.value)}
                        placeholder="যেমন: 9382040746"
                        className="w-full px-3 py-2 text-xs font-semibold border border-slate-200 rounded-xl focus:outline-hidden focus:ring-4 focus:ring-amber-500/10 focus:border-amber-600 bg-white hover:bg-slate-50/50 transition-all text-slate-800 font-sans"
                      />
                    </div>
                  </div>

                  {/* Suggestion Type block */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-[#334155]">মন্তব্যের ধরন</label>
                    <select
                      value={suggestionType}
                      onChange={(e) => setSuggestionType(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-semibold border border-slate-200 rounded-xl bg-white text-slate-700 outline-hidden focus:ring-4 focus:ring-amber-500/10 focus:border-amber-600 transition-all cursor-pointer"
                    >
                      <option value="difficulty">সমস্যা (Issue/Bug)</option>
                      <option value="feature">নতুন ফিচার সংক্রান্ত পরামর্শ (Feature Request)</option>
                      <option value="other">অন্যান্য (Other feedback)</option>
                    </select>
                  </div>

                  {/* Message field & submit button */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-slate-600 flex items-center justify-between">
                      <span>আপনার সাজেশান বা অভিযোগ</span>
                      <span className="text-[8px] text-red-500 font-bold">*প্রয়োজনীয়</span>
                    </label>
                    <textarea
                      value={suggestionText}
                      onChange={(e) => setSuggestionText(e.target.value)}
                      required
                      placeholder="এখানে আপনার সাজেশান বা পরম প্রয়োজনীয় সমস্যাটি বিস্তারিত লিখুন..."
                      rows={4}
                      className="w-full px-3 py-2 text-xs font-semibold border border-slate-200 rounded-xl focus:outline-hidden focus:ring-4 focus:ring-amber-500/10 focus:border-amber-600 bg-white hover:bg-slate-50 transition-all text-slate-800 placeholder-slate-400 font-sans"
                    />
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100/70">
                    <button
                      type="button"
                      onClick={() => {
                        setShowHelpCenterModal(false);
                      }}
                      className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-red-650 hover:bg-red-50 rounded-xl transition-all cursor-pointer border border-transparent hover:border-red-100 font-sans"
                    >
                      বাতিল
                    </button>
                    <button
                      type="submit"
                      disabled={suggestionSubmitting}
                      className="px-5 py-2.5 text-xs font-black text-white bg-[#15803D] hover:bg-emerald-600 rounded-xl transition-all cursor-pointer shadow-md shadow-[#15803D]/10 hover:shadow-lg flex items-center gap-1.5 font-sans animate-fade-in"
                    >
                      {suggestionSubmitting ? (
                        <span className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      ) : (
                        <>
                          <MessageSquare className="h-3.5 w-3.5" />
                          <span>পরামর্শ জমা দিন</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADMIN PASSWORD VERIFICATION (ONLY ACCESSED BY TYPING "100") */}
      {showAdminPasswordModal && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fade-in animate-duration-200">
          <div className="bg-white rounded-3xl w-full max-w-[420px] overflow-hidden border border-emerald-100/60 shadow-2xl flex flex-col transform transition-all scale-100">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-700 via-green-700 to-emerald-800 text-white p-5.5 flex items-center justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-8 -mt-8" />
              <div className="flex items-center gap-2.5 relative z-10 animate-fade-in">
                <div className="p-1.5 bg-white/10 rounded-lg shrink-0">
                  <Shield className="h-5 w-5 text-amber-350 animate-pulse" />
                </div>
                <div className="flex flex-col">
                  <h3 className="font-black text-base text-white tracking-wide font-sans">অফিসিয়াল লগইন</h3>
                  <span className="text-[10px] text-emerald-100 font-medium tracking-wider uppercase">Secure Access Port</span>
                </div>
              </div>
              <button 
                onClick={() => {
                  setShowAdminPasswordModal(false);
                  setAdminPasswordError("");
                  setAdminPasswordInput("");
                }} 
                className="text-white hover:text-emerald-100 bg-white/10 hover:bg-white/20 rounded-xl p-2 transition-all cursor-pointer relative z-10"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleAdminPasswordSubmit} className="p-6.5 space-y-5.5 bg-linear-to-b from-white via-white to-emerald-50/10">
              {/* Central padlock illustration */}
              <div className="flex flex-col items-center justify-center space-y-2.5 pb-2">
                <div className="p-5 bg-gradient-to-br from-emerald-500/10 to-green-500/5 rounded-full border border-emerald-500/15 shadow-inner relative">
                  <div className="absolute inset-0 rounded-full bg-emerald-500/5 animate-ping opacity-75" />
                  <Lock className="h-9 w-9 text-emerald-600 relative z-10 animate-pulse" />
                  <div className="absolute top-0.5 right-0.5 bg-emerald-500 rounded-full h-3.5 w-3.5 border-4 border-white"></div>
                </div>
                <div className="text-center">
                  <h4 className="font-black text-emerald-800 text-xs tracking-widest uppercase font-sans">
                    STAFF VERIFICATION SECURED
                  </h4>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5 font-sans">Encryption Status: Active (TLS 1.3)</p>
                </div>
              </div>

              <p className="text-xs text-slate-600 font-bold text-center leading-relaxed font-sans">
                এই সুরক্ষিত পোর্টালটি শুধুমাত্র সহজ সেবা প্যানেল অ্যাডমিন ও আধিকারিকদের ব্যবহারের জন্য সংরক্ষিত। প্রবেশ করতে সিকিউরিটি কোড দিন।
              </p>

              {adminPasswordError && (
                <div className="bg-red-50 border border-red-150 p-3 rounded-xl text-xs text-red-655 font-bold leading-normal animate-shake flex items-center gap-2 justify-center">
                  <span className="shrink-0 text-red-500">🛑</span> 
                  <span>{adminPasswordError}</span>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-700 block">
                  ডিভাইস সিকিউরিটি পাসওয়ার্ড
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={adminPasswordInput}
                    onChange={(e) => setAdminPasswordInput(e.target.value)}
                    placeholder="অ্যাডমিন সিকিউর পাসওয়ার্ড লিখুন..."
                    className="w-full pl-4 pr-11 py-3 text-sm border-2 border-slate-200 rounded-xl text-slate-800 font-bold focus:outline-hidden focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-655 transition-all bg-slate-50/60 hover:bg-slate-50/40"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-emerald-650 transition-colors focus:outline-hidden cursor-pointer"
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
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100/70">
                <button
                  type="button"
                  onClick={() => {
                    setShowAdminPasswordModal(false);
                    setAdminPasswordError("");
                    setAdminPasswordInput("");
                    setShowPassword(false);
                  }}
                  className="px-4.5 py-2.5 text-xs font-black text-slate-500 hover:text-red-650 hover:bg-red-50 rounded-xl transition-all cursor-pointer border border-transparent hover:border-red-100 font-sans"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5.5 py-2.5 text-xs font-black text-white bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 rounded-xl transition-all cursor-pointer shadow-md shadow-emerald-600/10 hover:shadow-lg hover:shadow-emerald-600/15 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-1.5 font-sans"
                >
                  <span>প্রবেশ করুন</span>
                  <ArrowUpRight className="h-3.5 w-3.5 stroke-[2.5]" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PWA Floating Install Banner */}
      <AnimatePresence>
        {showInstallBanner && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-96 bg-white/95 backdrop-blur-md rounded-2xl border border-[#15803D]/20 shadow-[0_10px_30px_-5px_rgba(21,128,61,0.15)] p-5 z-55 flex flex-col gap-3.5 transform font-sans"
          >
            <div className="flex items-start gap-3">
              <div className="bg-[#15803D]/10 p-2.5 rounded-xl shrink-0 flex items-center justify-center border border-[#15803D]/15">
                {/* SVG Logo icon directly replicated for sharp vector rendering */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" className="w-9 h-9">
                  <defs>
                    <linearGradient id="bannerLogoGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#0F766E" />
                      <stop offset="40%" stopColor="#15803D" />
                      <stop offset="100%" stopColor="#22C55E" />
                    </linearGradient>
                  </defs>
                  <rect x="8" y="14" width="94" height="94" rx="28" fill="url(#bannerLogoGrad)" />
                  <path d="M 26,52 L 48,74 L 88,28" fill="none" stroke="#FFFFFF" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M 28,66 L 48,87 L 86,43" fill="none" stroke="#FFFFFF" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="106" cy="18" r="8" fill="#22C55E" stroke="#15803D" strokeWidth="1" />
                </svg>
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-extrabold text-[#0F172A] text-[14px] sm:text-[15px] tracking-tight mb-0.5 leading-snug">
                  সহজ সেবা অ্যাপ ইনস্টল করুন
                </h4>
                <p className="text-slate-500 text-[11px] sm:text-xs leading-relaxed font-semibold">
                  এক ক্লিকে সকল সরকারি প্রকল্প, চাকরি ও নাগরিক তথ্য দ্রুত অ্যাক্সেস করতে হোম স্ক্রিনে অ্যাপটি ডাউনলোড করুন।
                </p>
              </div>

              <button
                onClick={() => setShowInstallBanner(false)}
                className="text-slate-400 hover:text-slate-650 p-1 hover:bg-slate-50 rounded-full transition-colors cursor-pointer shrink-0"
                aria-label="Close"
              >
                <X className="h-4.5 w-4.5 stroke-[2.5]" />
              </button>
            </div>

            <div className="flex items-center gap-2.5 justify-end">
              <button
                onClick={() => setShowInstallBanner(false)}
                className="px-4 py-2 text-[11px] font-extrabold text-[#15803D] hover:bg-[#15803D]/5 rounded-xl transition-all cursor-pointer border border-[#15803D]/10 hover:border-[#15803D]/25"
              >
                পরে করুন
              </button>
              <button
                onClick={handleInstallApp}
                className="px-4.5 py-2 text-[11px] font-extrabold text-white bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 rounded-xl transition-all cursor-pointer shadow-md shadow-[#15803D]/10 hover:shadow-lg hover:shadow-[#15803D]/20 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-1.5"
              >
                <Smartphone className="h-3.5 w-3.5 stroke-[2.5]" />
                <span>ডাউনলোড করুন</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
