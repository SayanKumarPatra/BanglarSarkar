import React from "react";
import {
  Sparkles,
  ArrowUpRight,
  Bell,
  Globe,
  Laptop,
  CheckCircle2,
  Zap,
  Shield,
  Clock,
  PhoneCall,
  Phone,
  Grid,
  FileText,
  User,
  MapPin,
  ClipboardList
} from "lucide-react";
import { CategoryItem, AppUpdate } from "../data";

interface DashboardServicesProps {
  categories: CategoryItem[];
  updates: AppUpdate[];
  onSelectCategory: (catId: string) => void;
  onNavigateTab: (tab: "services" | "all-links" | "tools") => void;
  getCategoryIcon: (iconName: string) => React.ComponentType<{ className?: string }>;
}

export default function DashboardServices({
  categories,
  updates,
  onSelectCategory,
  onNavigateTab,
  getCategoryIcon
}: DashboardServicesProps) {
  
  // Custom statistics summary items
  const stats = [
    {
      id: "stat1",
      title: "৩০০+ সরকারি পোর্টাল",
      desc: "পরচা, রেশন ও প্যান কার্ড লিঙ্ক সরাসরি সোর্স",
      icon: Globe,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
      accent: "border-emerald-200"
    },
    {
      id: "stat2",
      title: "১০+ ড্যাশবোর্ড টুলস",
      desc: "মেমো রসিদ ও ফটোকপি রিসাইজার গাইডলাইন",
      icon: Laptop,
      color: "text-blue-600 bg-blue-50 border-blue-100",
      accent: "border-blue-200"
    },
    {
      id: "stat3",
      title: "১০০% ভেরিফাইড তথ্য",
      desc: "কোনো স্প্যাম রিডাইরেক্ট বা ঝঞ্ঝাট নেই",
      icon: Shield,
      color: "text-indigo-600 bg-indigo-50 border-indigo-100",
      accent: "border-indigo-200"
    },
    {
      id: "stat4",
      title: "২৪x৭ লাইভ সাপোর্ট",
      desc: "সমস্যা নিরসনে সরাসরি কল বা চ্যাট উইন্ডো",
      icon: PhoneCall,
      color: "text-amber-600 bg-amber-50 border-amber-100",
      accent: "border-amber-200"
    }
  ];

  // Steps for 'How It Works'
  const steps = [
    {
      no: "১",
      title: "সহজে বিভাগ খুঁজুন",
      desc: "আমাদের রিচ ক্যটাগরি বা ডাইরেক্ট ড্যাশবোর্ড ফিল্টার থেকে আপনার প্রয়োজনীয় অনলাইন কাজটি নির্বাচন করুন।"
    },
    {
      no: "২",
      title: "নির্দেশিকা ও গাইড চেক করুন",
      desc: "আবেদনের জন্য প্রয়োজনীয় নথি সম্বলিত বিবরণ, মূল্য ও শেষ সময় এক ক্লিকে অফলাইনে দেখে নিশ্চিত হোন।"
    },
    {
      no: "৩",
      title: "কাজ সম্পন্ন ও মেমো রসিদ",
      desc: "সরাসরি সরকারি পোর্টালে কাজ সম্পন্ন করুন এবং গ্রাহকের জন্য প্রফেশনাল ক্যাশ মেমো জেনারেট করে প্রিন্ট আউট নিন।"
    }
  ];

  // Benefits for 'Why Choose Us'
  const benefits = [
    {
      title: "পশ্চিমবঙ্গের নির্ভরযোগ্য হাব",
      desc: "সহজ সেবা সম্পূর্ণ বিজ্ঞাপন মুক্ত এবং আসল ব্যাকএন্ড সোর্সের সাথে সংযুক্ত, তাই কোনো লিংক বিভ্রান্তি ঘটে না।"
    },
    {
      title: "সম্পূর্ণ সরল বাংলা অনুবাদ",
      desc: "ইংরাজী পোর্টালে কাজের প্রতিটি জটিল টেকনিক্যাল পরিভাষা আমরা সহজ সাধারণ বাংলা ভাষায় আপনাদের জন্য সাজিয়েছি।"
    },
    {
      title: "ক্যাফে-বান্ধব ইনবিল্ট টুলস",
      desc: "আমাদের ক্যাশ মেমো মেকার ও আপলোড সাইজ গাইডলাইন কম্পিউটার স্টুডিও মালিকদের সময় ও পরিশ্রম বিপুল কমায়।"
    },
    {
      title: "২৪x৭ পুশ নোটিফিকেশন",
      desc: "পশ্চিমবঙ্গের সরকারি স্কিম, লক্ষ্মীর ভাণ্ডার, বা স্কলারশিপ সম্পর্কিত প্রতি মুহূর্তের তথ্য পুশ নোটিফিকেশনে আপডেট।"
    }
  ];

  const popularShortcuts = [
    { title: "আধার কার্ড সংশোধন / স্ট্যাটাস", url: "https://myaadhaar.uidai.gov.in/", desc: "আধার ডেমোগ্রাফিক তথ্য আপডেট ও ফটো সংশোধন স্ট্যাটাস ট্র্যাকিং", rating: "4.9", category: "আধার কার্ড" },
    { title: "ভোটার কার্ডের লিঙ্ক ও সংশোধন", url: "https://voters.eci.gov.in/", desc: "ভোটার আইডি নতুন আবেদন, স্থানাস্তর এবং আধার লিঙ্কিং সুবিধা", rating: "4.8", category: "ভোটার কার্ড" },
    { title: "প্যান কার্ড তৈরি ও স্ট্যাটাস", url: "https://www.pan.utiitsl.com/", desc: "UTIITSL বা NSDL প্যান কার্ড নতুন আবেদন বা সংশোধন উইন্ডো", rating: "4.7", category: "প্যান কার্ড" },
    { title: "বাংলারভূমি খতিয়ান ও পরচা", url: "https://banglarbhumi.gov.in/", desc: "দাগের তথ্য ও মিউটেসন স্ট্যাটাস চেক এবং অনলাইন ফি পেমেন্ট", rating: "4.9", category: "বাংলারভূমি" },
    { title: "কৃষক বন্ধু স্কিম সুবিধা", url: "https://krishakbandhu.net/", desc: "কৃষক নথিভুক্তি ও ব্যাংক অ্যাকাউন্ট সরাসরি আর্থিক অনুদান ট্র্যাকার", rating: "4.8", category: "কৃষক বন্ধু" },
    { title: "লক্ষ্মীর ভাণ্ডার স্ট্যাটাস ও তথ্য", url: "https://socialsecurity.wb.gov.in/", desc: "মহিলাদের মাসিক আর্থিক ভাতার আবেদন ফর্ম ও সুবিধাভোগী পেমেন্ট ট্র্যাকিং", rating: "4.9", category: "লক্ষ্মীর ভাণ্ডার" }
  ];

  return (
    <div className="space-y-6 sm:space-y-8 select-none animate-fade-in">
      
      {/* 1. HERO SECTION (GLASSMORPHISM EMBOSS GREEN THEME) */}
      <div className="relative overflow-hidden rounded-3xl border border-emerald-500/10 bg-linear-to-br bg-gradient-to-br from-[#064e3b] via-[#022c22] to-slate-950 p-6 sm:p-8 md:p-10 text-white shadow-xl">
        {/* Geometric Matrix Dot Web Overlay */}
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#86efac_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none select-none z-0" />
        
        {/* Dynamic Neon Sphere Blur Backdrops */}
        <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-emerald-500/20 blur-3xl z-0 pointer-events-none select-none" />
        <div className="absolute -bottom-20 -left-6 w-44 h-44 rounded-full bg-green-500/10 blur-2xl z-0 pointer-events-none select-none" />

        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-400/20 rounded-full text-[10px] md:text-xs font-black text-emerald-300 tracking-wider">
            <Sparkles className="h-3 w-3 text-emerald-400 animate-spin" style={{ animationDuration: "3s" }} />
            <span>পশ্চিমবঙ্গের ডিজিটাল সার্ভিস ও ইনফো বোর্ড ড্যাশবোর্ড</span>
          </div>

          <div className="max-w-2xl space-y-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
              আপনার অনলাইন স্টুডিও ও সাইবার ক্যাফে হবে{" "}
              <span className="bg-gradient-to-r from-emerald-400 via-green-400 to-teal-300 bg-clip-text text-transparent font-black">
                স্মার্ট ও প্রফেশনাল!
              </span>
            </h1>
            <p className="text-xs sm:text-sm font-medium text-slate-350 leading-relaxed max-w-xl">
              পশ্চিমবঙ্গের প্রতিটি নাগরিকের জন্য সরকারি স্কিম, লক্ষ্মীর ভাণ্ডার, রেশন কার্ড ও দাগের পরচা-সহ যাবতীয় সেবার নির্ভরযোগ্য বাংলা ডিরেক্টরি।
            </p>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => onNavigateTab("all-links")}
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-[0_4px_16px_rgba(16,185,129,0.3)] hover:scale-[1.02] flex items-center gap-1.5 cursor-pointer border border-emerald-400/20"
            >
              <Globe className="h-4 w-4" />
              <span>সমস্ত লিংক ব্রাউজ করুন</span>
            </button>
            <button
              onClick={() => onNavigateTab("tools")}
              className="px-5 py-2.5 bg-white/10 hover:bg-white/15 border border-white/20 hover:border-white/30 text-white font-extrabold text-xs sm:text-sm rounded-xl transition-all duration-200 hover:scale-[1.02] flex items-center gap-1.5 cursor-pointer backdrop-blur-md"
            >
              <Laptop className="h-4 w-4" />
              <span>সহায়ক ক্যাফে টুলস</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. SERVICE OVERVIEW STATISTICS CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
        {stats.map((item) => {
          const IconComponent = item.icon;
          return (
            <div
              key={item.id}
              className={`p-4 sm:p-5 bg-white border border-slate-205/80 rounded-2xl flex flex-col justify-between hover:border-emerald-300 hover:shadow-xs transition-all duration-300 group`}
            >
              <div className="space-y-3">
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${item.color} group-hover:scale-105 transition-transform`}>
                  <IconComponent className="h-4.5 w-4.5" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="font-extrabold text-[#0F172A] text-sm sm:text-base tracking-tight leading-none">
                    {item.title}
                  </h4>
                  <p className="text-[10px] sm:text-xs text-slate-500 leading-snug">
                    {item.desc}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. LATEST UPDATES NOTIFICATION SEC */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-6 shadow-[0_8px_30px_rgba(0,0,0,0.015)] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="relative flex h-2 w-2 min-w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
            </div>
            <h3 className="font-extrabold text-slate-800 text-sm sm:text-base">পশ্চিমবঙ্গের মেগা সরকারি নোটিফিকেশন বোর্ড</h3>
          </div>
          <span className="text-[10px] sm:text-xs text-slate-400 font-bold">পুশ বিজ্ঞপ্তি</span>
        </div>
        
        <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1">
          {updates && updates.length > 0 ? (
            updates.map((upd) => (
              <div key={upd.id} className="p-3 bg-[#F4FBF7] rounded-xl border border-emerald-100/60 hover:border-emerald-200/80 transition-all flex items-start gap-3">
                <span className="px-2 py-0.5 bg-amber-50 border border-amber-200 text-amber-800 text-[8.5px] font-black rounded-md shrink-0 block mt-0.5">
                  {upd.date}
                </span>
                <div className="space-y-0.5 flex-1 min-w-0">
                  <h4 className="font-extrabold text-slate-800 text-xs leading-normal select-text">
                    {upd.title}
                  </h4>
                  <p className="text-[10px] text-emerald-800/80 font-bold">
                    {upd.category || "পোর্টাল এলার্ট"} • পশ্চিমবঙ্গ তথ্য দফতর বিজ্ঞপ্তি
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-slate-400 text-xs italic text-center py-4">বর্তমানে কোনো নতুন নোটিফিকেশন নেই।</p>
          )}
        </div>
      </div>

      {/* 4. GOVERNMENT SERVICE CATEGORIES SECTION */}
      <div className="space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-4.5 bg-[#15803D] rounded-full" />
            <h3 className="font-extrabold text-slate-800 text-sm sm:text-base">সরকারি সেবাসমূহের ক্যাটাগরি ফোল্ডার</h3>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-500 font-bold pl-3.5">
            নির্দিষ্ট ক্যাটাগরি ফোল্ডারে ক্লিক করে সরাসরি সেই বিষয়ের সব সরকারি পোর্টাল লিঙ্ক ও বাংলা গাইড এক ক্লিকে ব্রাউজ করুন
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {categories.map((cat) => {
            const IconComponent = getCategoryIcon(cat.iconName);
            return (
              <div
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className="p-4 bg-white hover:bg-emerald-50/20 border border-slate-200/80 hover:border-[#86EFAC]/60 rounded-2xl cursor-pointer transition-all duration-300 flex flex-col justify-between gap-4 group relative overflow-hidden"
              >
                <div className="space-y-3 z-10 relative">
                  <div className="w-10 h-10 rounded-xl bg-[#EFFDF4] border border-[#86EFAC]/30 flex items-center justify-center text-[#15803D] shrink-0 shadow-3xs group-hover:scale-105 transition-transform duration-300">
                    <IconComponent className="h-5 w-5 text-emerald-700" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-800 text-xs sm:text-sm group-hover:text-emerald-800 transition-colors">
                      {cat.label}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                      সব ভেরিফাইড পোর্টাল
                    </p>
                  </div>
                </div>

                <div className="flex items-center text-[10px] font-extrabold text-[#15803D] bg-emerald-55/15 w-fit px-2 py-0.5 rounded-lg gap-0.5 mt-1 z-10 relative">
                  <span>সব লিংক দেখুন</span>
                  <ArrowUpRight className="h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
                <div className="absolute right-0 bottom-0 translate-x-2 translate-y-2 opacity-[0.015] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
                  <IconComponent className="h-28 w-28 text-[#15803D]" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. POPULAR SERVICES PANEL & QUICK LINKS */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-6 shadow-[0_8px_30px_rgba(0,0,0,0.015)] space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-4.5 bg-[#15803D] rounded-full" />
            <h3 className="font-extrabold text-slate-800 text-sm sm:text-base">জনপ্রিয় উইজেট ও কুইক পোর্টাল অ্যাক্সেস</h3>
          </div>
          <button
            onClick={() => onNavigateTab("all-links")}
            className="text-xs font-bold text-[#15803D] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>সমস্ত পোর্টাল লিংক</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 pt-1">
          {popularShortcuts.map((item, idx) => (
            <a
              key={idx}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-gradient-to-br from-slate-50/70 to-emerald-50/15 border border-slate-180 hover:border-[#86EFAC] rounded-2xl hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between h-30 group relative"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="inline-block px-2 py-0.5 bg-[#EFFDF4] border border-[#86EFAC]/20 text-[#15803D] text-[9px] font-black rounded-lg">
                    {item.category}
                  </span>
                  <span className="text-[10px] text-amber-600 font-extrabold flex items-center gap-0.5">
                    ★ {item.rating}
                  </span>
                </div>
                <h4 className="font-bold text-slate-800 text-xs group-hover:text-[#15803D] tracking-tight line-clamp-1">
                  {item.title}
                </h4>
                <p className="text-[10px] sm:text-[10.5px] text-slate-500 leading-snug line-clamp-2">
                  {item.desc}
                </p>
              </div>
              <div className="flex items-center justify-end text-[#15803D] font-extrabold text-[10px] gap-0.5 mt-2">
                <span>সরাসরি অফিশিয়াল লিঙ্ক</span>
                <ArrowUpRight className="h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* 6. DIGITAL TOOLS SECTION PROMO WITH QUICK LAUNCH BUTTONS */}
      <div className="bg-gradient-to-r from-[#EFFDF4] via-[#F4FBF7] to-white border border-[#86EFAC]/40 rounded-3xl p-5 sm:p-6 shadow-3xs flex flex-col md:flex-row items-center justify-between gap-5 relative">
        <div className="absolute top-0 right-0 p-3 text-emerald-900/5 select-none pointer-events-none">
          <Laptop className="h-24 w-24" />
        </div>

        <div className="space-y-1.5 max-w-xl text-center md:text-left">
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-100 border border-emerald-200 text-[#15803D] text-[9px] font-black rounded-lg tracking-wider">
            ক্যাফে সিকিউরিটি ও ইউটিলিটি
          </div>
          <h3 className="font-extrabold text-slate-800 text-sm sm:text-base font-sans">
            ইনবিল্ট ডিজিটাল মেমো ও সিগনেচার রিসাইজার কনভার্টার
          </h3>
          <p className="text-[11px] sm:text-xs text-slate-500 font-bold leading-normal">
            আপনার সাইবার ক্যাফে বা বাড়িতে বসে প্রতিটি গ্রাহকের সম্পূর্ণ মেমো রসিদ তৈরি করুন, প্রিন্ট করুন এবং আধার/ভোটার ছবির সঠিক সাইজ কনভার্টার গাইডলাইন চেক করুন সম্পূর্ণ ফ্রিতে।
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 min-w-[240px] w-full md:w-auto">
          <button
            onClick={() => onNavigateTab("tools")}
            className="px-4 py-2.5 bg-slate-850 hover:bg-slate-950 text-white font-extrabold text-xs rounded-xl cursor-pointer transition-all text-center flex-1 sm:flex-none shadow-3xs hover:scale-[1.01]"
          >
            ক্যাশ রসিদ অ্যাপ খুলুন
          </button>
          <button
            onClick={() => onNavigateTab("tools")}
            className="px-4 py-2.5 bg-white hover:bg-slate-50/80 text-emerald-800 border border-emerald-300 font-extrabold text-xs rounded-xl cursor-pointer transition-all text-center flex-1 sm:flex-none shadow-3xs hover:scale-[1.01]"
          >
            ফটো গাইডলাইন দেখুন
          </button>
        </div>
      </div>

      {/* 7. HOW IT WORKS SECTION */}
      <div className="bg-white border border-slate-205/75 rounded-3xl p-5 sm:p-6 shadow-[0_8px_30px_rgba(0,0,0,0.015)] space-y-5">
        <div className="space-y-1 text-center max-w-lg mx-auto">
          <h3 className="font-extrabold text-slate-800 text-sm sm:text-base">সহজ সেবা যেভাবে কাজ করে</h3>
          <p className="text-[11px] sm:text-xs text-slate-400 font-bold leading-relaxed">
            পশ্চিমবঙ্গের নাগরিকদের অনলাইন কাজের পথ সুবিধাজনক ও নির্ভুল করতে আমাদের ডিজিটাল হাব ৩টি সহজ ধাপে কাজ করে
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Connecting Line behind on Desktop */}
          <div className="hidden md:block absolute top-7 left-14 right-14 h-0.5 bg-slate-100 z-0 border-dashed" />
          
          {steps.map((step, idx) => (
            <div key={idx} className="flex gap-4 md:flex-col md:items-center text-left md:text-center z-10 relative">
              <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-[#EFFDF4] border-2 border-emerald-500 flex items-center justify-center shrink-0 font-extrabold text-emerald-800 text-sm shadow-3xs">
                {step.no}
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-slate-800 text-xs sm:text-sm">
                  {step.title}
                </h4>
                <p className="text-[10px] sm:text-xs text-slate-500 leading-snug">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 8. WHY CHOOSE US SECTION */}
      <div className="space-y-4">
        <div className="space-y-1 text-center max-w-lg mx-auto pb-1">
          <h3 className="font-extrabold text-slate-800 text-sm sm:text-base">কেন সহজ সেবা ব্যবহার করবেন?</h3>
          <p className="text-[11px] sm:text-xs text-slate-400 font-bold">অন্যান্য পোর্টালের তুলনা আমাদের সেবার গুণগত পাথর্ক্য নিম্নরূপ</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {benefits.map((bene, idx) => (
            <div key={idx} className="p-4.5 bg-white border border-slate-200/80 hover:border-emerald-250 rounded-2xl flex gap-3 shadow-3xs transition-colors">
              <div className="w-6 h-6 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 shrink-0 mt-0.5">
                <CheckCircle2 className="h-3.5 w-3.5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-slate-800 text-xs sm:text-sm">
                  {bene.title}
                </h4>
                <p className="text-[10px] sm:text-xs text-slate-500 leading-relaxed">
                  {bene.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
