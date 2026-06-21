import React from "react";
import { Laptop, FileText, Sparkles } from "lucide-react";

interface DashboardToolsProps {
  slipCustomer: string;
  setSlipCustomer: (val: string) => void;
  slipPhone: string;
  setSlipPhone: (val: string) => void;
  slipService: string;
  setSlipService: (val: string) => void;
  slipAmount: string;
  setSlipAmount: (val: string) => void;
  slipPaid: boolean;
  setSlipPaid: (val: boolean) => void;
  generatedSlip: any | null;
  setGeneratedSlip: (val: any) => void;
}

export default function DashboardTools({
  slipCustomer,
  setSlipCustomer,
  slipPhone,
  setSlipPhone,
  slipService,
  setSlipService,
  slipAmount,
  setSlipAmount,
  slipPaid,
  setSlipPaid,
  generatedSlip,
  setGeneratedSlip
}: DashboardToolsProps) {

  const handleGenerateSlip = () => {
    if (!slipCustomer.trim()) {
      alert("অনুগ্রহ করে গ্রাহকের নাম দিন!");
      return;
    }
    setGeneratedSlip({
      slipId: "SS-" + Math.floor(100000 + Math.random() * 900000),
      date: new Date().toLocaleDateString("en-IN"),
      customer: slipCustomer,
      phone: slipPhone,
      service: slipService,
      amount: slipAmount,
      status: slipPaid ? "PAID" : "DUE",
    });
  };

  return (
    <div className="space-y-6 sm:space-y-7 animate-fade-in select-none">
      
      {/* 1. Header Block */}
      <div className="relative overflow-hidden rounded-3xl border border-emerald-500/10 bg-linear-to-br bg-gradient-to-br from-emerald-950 to-slate-900 p-5 sm:p-6 text-white shadow-md">
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#86efac_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
            <Laptop className="h-5 w-5 text-emerald-300" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm sm:text-base font-sans leading-tight">স্মার্ট ক্যাফে ট্র্যাকিং ও কাস্টমার রসিদ মেকার</h3>
            <p className="text-[10px] sm:text-xs text-emerald-300/80 font-bold">ফটোকপি ও সাইবার সেন্টারের দৈনন্দিন হিসাব এবং দ্রুত মেমো রসিদ প্রিন্ট করার অ্যাপস</p>
          </div>
        </div>
      </div>

      {/* 2. SPLIT WORKSPACE: Generator vs Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        
        {/* INPUT PANEL CARD */}
        <div className="bg-white border border-slate-205/85 rounded-3xl p-5 sm:p-6 space-y-4 shadow-3xs">
          <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#15803D] flex items-center justify-center border border-emerald-100 shrink-0">
              <FileText className="h-4 w-4" />
            </div>
            <h4 className="font-extrabold text-slate-800 text-xs sm:text-sm">নতুন ক্যাশ মেমো জেনারেটর</h4>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] text-slate-500 font-extrabold tracking-wide uppercase mb-1">গ্রাহকের নাম (Customer Name) <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={slipCustomer}
                onChange={(e) => setSlipCustomer(e.target.value)}
                placeholder="গ্রাহকের সম্পূর্ণ নাম"
                className="w-full text-xs font-bold border border-slate-200/80 px-3 py-2.5 rounded-xl bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-[#15803D] transition-all"
              />
            </div>

            <div>
              <label className="block text-[10px] text-slate-500 font-extrabold tracking-wide uppercase mb-1">মোবাইল নম্বর (ঐচ্ছিক)</label>
              <input
                type="text"
                value={slipPhone}
                onChange={(e) => setSlipPhone(e.target.value)}
                placeholder="১০ সংখ্যার মোবাইল (Phone)"
                className="w-full text-xs font-bold border border-slate-200/80 px-3 py-2.5 rounded-xl bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-[#15803D] transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold tracking-wide uppercase mb-1">সেবার নাম (Selected Service)</label>
                <select
                  value={slipService}
                  onChange={(e) => setSlipService(e.target.value)}
                  className="w-full text-xs font-bold border border-slate-200/80 px-3 py-2.5 rounded-xl bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-[#15803D] transition-all text-slate-850 cursor-pointer"
                >
                  <option>আধার কার্ড সংশোধন / বায়োমেট্রিক</option>
                  <option>নতুন ভোটার কার্ড আবেদন / শিফট</option>
                  <option>প্যান কার্ড নতুন / সংশোধন</option>
                  <option>বাংলারভূমি নাম পত্তন ও পরচা</option>
                  <option>লক্ষ্মীর ভাণ্ডার আবেদন ফরম</option>
                  <option>রেশন কার্ড সংশোধন / লিংক</option>
                  <option>ফটোকপি / প্রিন্টআউট / টাইピング</option>
                  <option>অন্যান্য অনলাইন আবেদন কাজ</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold tracking-wide uppercase mb-1">পরিষেবা ফি (Amount Rs.)</label>
                <input
                  type="number"
                  value={slipAmount}
                  onChange={(e) => setSlipAmount(e.target.value)}
                  className="w-full text-xs font-bold border border-slate-200/80 px-3 py-2.5 rounded-xl bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-[#15803D] transition-all text-slate-850"
                  placeholder="পরিমাণ"
                />
              </div>
            </div>

            <div className="flex items-center gap-4 py-2 border-t border-dashed border-slate-100">
              <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider">পেমেন্ট স্থিতি :</span>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-1.5 cursor-pointer select-none">
                  <input
                    type="radio"
                    checked={slipPaid === true}
                    onChange={() => setSlipPaid(true)}
                    className="accent-emerald-700 cursor-pointer h-4 w-4"
                  />
                  <span className="text-xs font-extrabold text-emerald-800 bg-[#E8F5E9] border border-[#A5D6A7]/40 px-2.5 py-1 rounded-lg">Paid (পরিশোধিত)</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer select-none">
                  <input
                    type="radio"
                    checked={slipPaid === false}
                    onChange={() => setSlipPaid(false)}
                    className="accent-rose-700 cursor-pointer h-4 w-4"
                  />
                  <span className="text-xs font-extrabold text-rose-800 bg-[#FFEBEE] border border-[#FFCDD2]/40 px-2.5 py-1 rounded-lg">Due (বাকি)</span>
                </label>
              </div>
            </div>

            <button
              onClick={handleGenerateSlip}
              className="w-full bg-[#15803D] hover:bg-green-700 text-white font-black text-xs sm:text-sm py-3 rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer text-center hover:scale-[1.01]"
            >
              মেমো ক্যাশ রসিদ তৈরি করুন
            </button>
          </div>
        </div>

        {/* PREVIEW PANEL CARD */}
        <div className="bg-[#FAFDFB] border border-slate-200/80 rounded-3xl p-5 sm:p-6 flex flex-col justify-between shadow-3xs relative min-h-[360px]">
          {generatedSlip ? (
            <div className="font-mono text-slate-850 select-text flex-1 flex flex-col justify-between space-y-4">
              
              {/* Slip Layout Frame */}
              <div className="border border-dashed border-slate-300 p-4 sm:p-5 bg-white rounded-2xl space-y-4 relative overflow-hidden shadow-3xs">
                {/* Vintage Watermark Stamp */}
                <div className="absolute right-4 bottom-4 font-black text-xs border-2 border-emerald-600/10 rounded-lg p-1.5 uppercase transform rotate-12 pointer-events-none select-none text-emerald-600/10">
                  Verified Hub
                </div>

                <div className="text-center border-b border-dashed border-slate-200 pb-3 space-y-0.5">
                  <h5 className="font-extrabold text-[#15803D] text-sm tracking-wide uppercase">সহজ সেবা ডিজিটাল ক্যাফে</h5>
                  <p className="text-[9px] text-slate-400">কাস্টমার পেমেন্ট রিসিভ ও মেমো ভাউচার</p>
                </div>

                <div className="text-[10.5px] space-y-1.5">
                  <div className="flex justify-between">
                    <span>রসিদ নম্বর (Slip ID):</span>
                    <span className="font-black text-slate-900">{generatedSlip.slipId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>তারিখ (Date/Time):</span>
                    <span className="font-bold">{generatedSlip.date}</span>
                  </div>
                  <div className="h-px bg-slate-100 my-1.5" />
                  <div className="flex justify-between">
                    <span>গ্রাহক নাম (Customer Name):</span>
                    <span className="font-extrabold text-slate-900">{generatedSlip.customer}</span>
                  </div>
                  {generatedSlip.phone && (
                    <div className="flex justify-between">
                      <span>মোবাইল নং (Phone):</span>
                      <span>{generatedSlip.phone}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>পরিষেবা (Seba/Service):</span>
                    <span className="font-black text-slate-900 truncate max-w-[170px]">{generatedSlip.service}</span>
                  </div>
                  <div className="h-px bg-slate-100 my-1.5" />
                  <div className="flex justify-between text-xs font-black">
                    <span>মোট ফি (Fee Paid):</span>
                    <span className="text-[#15803D] text-sm">Rs. {generatedSlip.amount}/-</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] mt-2">
                    <span>পেমেন্ট স্থিতি (Payment Status):</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black ${generatedSlip.status === 'PAID' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200/40' : 'bg-red-100 text-red-850 border border-red-200/40'}`}>
                      {generatedSlip.status}
                    </span>
                  </div>
                </div>

                <div className="text-center border-t border-dashed border-slate-150 pt-2.5 text-[8.5px] text-slate-400">
                  আমাদের অনলাইন ক্যাফে ব্যবহার করার জন্য আপনাকে ধন্যবাদ!
                </div>
              </div>

              {/* Action Trigger */}
              <button
                onClick={() => {
                  window.print();
                }}
                className="w-full bg-slate-800 hover:bg-slate-950 text-white font-extrabold text-xs sm:text-sm py-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
              >
                <FileText className="h-4 w-4" />
                <span>মেমো রসিদ প্রিন্ট করুন</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center space-y-2 py-16 flex-1">
              <FileText className="h-11 w-11 text-slate-300 animate-pulse" />
              <p className="text-xs font-black text-slate-650">কোনো গ্রাহক ক্যাশ রসিদ ক্যাপিটাল মেমো প্রস্তুত করা নেই</p>
              <p className="text-[10px] text-slate-400 max-w-[220px]">বামদিকের ফর্মে যথোপযুক্ত তথ্য প্রদান করে মেমো রসিদ তৈরি বাটনে ক্লিক করুন।</p>
            </div>
          )}
        </div>

      </div>

      {/* 3. CONVERTER SIZE CAP GUIDELINE CHART */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-3xs animate-fade-in text-slate-800">
        <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100 mb-4 bg-transparent">
          <Sparkles className="h-4.5 w-4.5 text-amber-500" />
          <h4 className="font-extrabold text-xs sm:text-sm">অনলাইন ফর্ম আপলোড সাইজ গাইডলাইন (Quick Converter)</h4>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3 bg-[#FAFDFB] border border-emerald-100/60 hover:border-emerald-200 rounded-2xl space-y-1 transition-colors">
            <div className="text-[10px] text-slate-400 font-bold block">পাসপোর্ট ছবি (Standard)</div>
            <div className="text-xs font-extrabold text-[#15803D]">3.5 x 4.5 CM</div>
            <div className="text-[9px] text-slate-500 font-mono">300 DPI (413 x 531 PX)</div>
          </div>
          <div className="p-3 bg-[#FAFDFB] border border-emerald-100/60 hover:border-emerald-200 rounded-2xl space-y-1 transition-colors">
            <div className="text-[10px] text-slate-400 font-bold block">অনলাইন স্বাক্ষর (Signature)</div>
            <div className="text-xs font-extrabold text-[#15803D]">6.0 x 2.0 CM</div>
            <div className="text-[9px] text-slate-500 font-mono">150 DPI (256 x 64 PX)</div>
          </div>
          <div className="p-3 bg-[#FAFDFB] border border-emerald-100/60 hover:border-emerald-200 rounded-2xl space-y-1 transition-colors">
            <div className="text-[10px] text-slate-400 font-bold block">জন্ম/মৃত্যু বা পরচা ডকুমেন্ট</div>
            <div className="text-xs font-extrabold text-amber-600">Max PDF: 250 KB</div>
            <div className="text-[9px] text-slate-500 font-mono">Gray Scale (100 DPI)</div>
          </div>
          <div className="p-3 bg-[#FAFDFB] border border-emerald-100/60 hover:border-emerald-200 rounded-2xl space-y-1 transition-colors">
            <div className="text-[10px] text-slate-400 font-bold block">আধার কার্ড আপলোড ফাইল</div>
            <div className="text-xs font-extrabold text-amber-600">Max JPEG: 100 KB</div>
            <div className="text-[9px] text-slate-500 font-mono">High Quality (150 DPI)</div>
          </div>
        </div>
      </div>

    </div>
  );
}
