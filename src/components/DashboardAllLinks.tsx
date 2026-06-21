import React from "react";
import { Globe, HelpCircle, ArrowUpRight } from "lucide-react";
import { CategoryItem } from "../data";

interface DashboardAllLinksProps {
  categories: CategoryItem[];
  docCategory: string;
  setDocCategory: (catId: string) => void;
  displayedItems: any[];
  getCategoryIcon: (iconName: string) => React.ComponentType<{ className?: string }>;
  getCategoryColorAccent: (cat: string) => {
    gradient: string;
    glow: string;
    iconBg: string;
    iconBorder: string;
    badgeBg: string;
    badgeDot: string;
    borderAccent: string;
    arrowClass: string;
    orbGradient: string;
  };
  getServiceMetadata: (id: string, cat: string) => { rating: string; badgeText: string; badgeType?: string };
  renderOfficialLogo: (id: string) => React.ReactNode;
  onSelectService: (service: any) => void;
}

export default function DashboardAllLinks({
  categories,
  docCategory,
  setDocCategory,
  displayedItems,
  getCategoryIcon,
  getCategoryColorAccent,
  getServiceMetadata,
  renderOfficialLogo,
  onSelectService
}: DashboardAllLinksProps) {
  
  return (
    <div className="space-y-5 animate-fade-in select-none">
      
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-emerald-500/10 bg-linear-to-br bg-gradient-to-br from-emerald-900 to-[#022c22] p-5 sm:p-6 text-white shadow-md">
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#86efac_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
            <Globe className="h-5 w-5 text-emerald-300" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm sm:text-base font-sans leading-tight">সমস্ত লিংক ও সরকারি পোর্টালসমূহ</h3>
            <p className="text-[10px] sm:text-xs text-emerald-300/80 font-bold">পশ্চিমবঙ্গের নাগরিকদের সুবিধার্থে যাবতীয় জরুরি সার্ভিস ডাইরেক্ট লিঙ্ক</p>
          </div>
        </div>
      </div>

      {/* 2. CATEGORY SLIDER CONTROL */}
      <div className="w-full bg-white border border-slate-200/70 select-none py-3.5 px-4 rounded-2xl relative z-10 shadow-3xs">
        <div className="space-y-2">
          <div className="text-[10px] text-slate-400 font-black tracking-wider uppercase font-sans select-none text-left">ক্যাটাগরি ফিল্টার করুন:</div>
          <div className="flex flex-wrap items-center gap-1.5 md:gap-2 select-none w-full">
            {[
              { id: "all", label: "সব সেবা", iconName: "Grid" },
              ...categories.map((c) => ({ id: c.id, label: c.label, iconName: c.iconName }))
            ].map((cat) => {
              const IconComponent = getCategoryIcon(cat.iconName);
              const isCatActive = docCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setDocCategory(cat.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-300 flex items-center gap-1.5 cursor-pointer border select-none ${
                    isCatActive
                      ? "bg-[#D1FAE5] text-emerald-900 border-[#6EE7B7] font-extrabold shadow-sm scale-[1.02]"
                      : "text-slate-650 bg-slate-50 border-slate-200/60 hover:bg-slate-100/80 hover:text-emerald-800"
                  }`}
                >
                  <IconComponent className={`h-3.5 w-3.5 ${isCatActive ? "text-emerald-800" : "text-slate-400"}`} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. CORE SERVICES LISTINGS */}
      <div id="services-anchor" />
      <section id="digital-document-hub-section" className="w-full bg-transparent pb-6 pt-1 animate-fade-in select-none">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 font-sans animate-fade-in">
          {displayedItems.length === 0 ? (
            <div className="col-span-full py-16 px-4 text-center bg-white border border-dashed border-emerald-200 rounded-3xl animate-fade-in flex flex-col items-center justify-center space-y-2 py-10">
              <HelpCircle className="h-10 w-10 text-emerald-400" />
              <p className="text-sm text-slate-700 font-extrabold font-sans">কোনো নাগরিক সেবা বা অফিশিয়াল লিংক পাওয়া যায়নি।</p>
              <p className="text-xs text-slate-500 max-w-md">সার্চ বক্সে অন্য কোনো সার্ভিস বা বানান ট্রাই করে দেখুন, অথবা অফিসিয়াল লগইন ড্যাশবোর্ডে গিয়ে সেবা যুক্ত করুন।</p>
            </div>
          ) : (
            displayedItems.map((item) => {
              const { rating, badgeText } = getServiceMetadata(item.id, item.cat || item.category || "");
              const style = getCategoryColorAccent(item.cat || item.category || "");
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectService({
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
                  className={`p-4 bg-white/85 backdrop-blur-md bg-gradient-to-br ${style.gradient} border border-slate-200/85 hover:border-emerald-355 ${style.borderAccent} ${style.glow} min-h-[145px] h-auto rounded-3xl cursor-pointer hover:-translate-y-1 group transition-all duration-300 flex flex-col justify-between gap-3.5 relative overflow-hidden select-none shadow-[2px_4px_16px_rgba(0,0,0,0.01)]`}
                  id={`service-card-${item.id}`}
                >
                  <div className={`absolute -top-14 -right-14 w-28 h-28 rounded-full bg-gradient-to-br ${style.orbGradient} blur-2xl opacity-35 group-hover:opacity-65 transition-opacity duration-500`} />
                  <div className="absolute -bottom-16 -left-16 w-14 h-14 rounded-full bg-slate-500/5 blur-xl group-hover:bg-slate-500/8 transition-colors duration-300" />

                  <div className="flex items-center justify-between w-full relative z-10">
                    <div className={`w-10 h-10 rounded-[14px] flex items-center justify-center shrink-0 border ${style.iconBorder} ${style.iconBg} relative shadow-3xs overflow-hidden transition-all duration-350 group-hover:scale-105`}>
                      <div className="absolute inset-0 bg-white/5 opacity-50 rounded-[14px]" />
                      {item.logoUrl ? (
                        <img 
                          src={item.logoUrl} 
                          className="w-full h-full rounded-[12px] object-contain p-1 transition-transform duration-300 shrink-0 bg-transparent" 
                          referrerPolicy="no-referrer" 
                          alt="" 
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full group-hover:scale-105 transition-transform duration-355 shrink-0 flex items-center justify-center p-1 [&_svg]:w-full [&_svg]:h-full [&_svg]:shrink-0">
                          {renderOfficialLogo(item.id)}
                        </div>
                      )}
                    </div>

                    <div className="shrink-0">
                      <span className={`w-7 h-7 rounded-xl flex items-center justify-center border border-slate-200/40 shadow-3xs transition-all duration-300 ${style.arrowClass} group-hover:translate-x-0.5 group-hover:-translate-y-0.5`}>
                        <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-45" />
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 min-w-0 relative z-10 flex-1 flex flex-col justify-between">
                    <h4 className="font-extrabold text-[12.5px] text-slate-800 leading-snug tracking-tight transition-colors duration-250 group-hover:text-slate-950 group-hover:translate-x-0.5 max-w-[98%] line-clamp-2 select-text">
                      {item.title}
                    </h4>

                    <div className="flex items-center justify-between gap-1.5 pt-1.5 border-t border-slate-100/60 group-hover:border-slate-200/40 transition-colors mt-auto">
                      <span className={`inline-flex items-center gap-1 text-[8.5px] sm:text-[9.5px] font-black px-2.5 py-0.5 rounded-lg border ${style.badgeBg} truncate max-w-[70%] sm:max-w-none shadow-[inset_0_1px_2px_rgba(255,255,255,0.4)]`}>
                        <span className={`w-1 h-1 rounded-full ${style.badgeDot} shrink-0`} />
                        <span className="truncate">{badgeText}</span>
                      </span>

                      <span className="inline-flex items-center gap-0.5 text-[8.5px] sm:text-[9.5px] font-black text-amber-600 bg-amber-55/10 hover:bg-amber-55/20 border border-amber-150/30 px-1.5 py-0.5 rounded-lg shrink-0 shadow-3xs">
                        ★ {rating}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

    </div>
  );
}
