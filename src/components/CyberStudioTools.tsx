import React, { useState, useRef, useEffect } from "react";
import { 
  Camera, 
  Crop, 
  Calendar, 
  FileText, 
  Download, 
  Plus, 
  Trash2, 
  RefreshCw, 
  Calculator, 
  ArrowRight, 
  User, 
  Image as ImageIcon,
  CheckCircle,
  HelpCircle,
  TrendingUp,
  CreditCard
} from "lucide-react";

export default function CyberStudioTools() {
  const [activeTool, setActiveTool] = useState<"resizer" | "age" | "billing">("resizer");

  // --- TOOL 1: IMAGE RESIZER STATES ---
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [resizeMode, setResizeMode] = useState<"passport" | "signature" | "custom">("passport");
  const [customWidth, setCustomWidth] = useState<string>("300");
  const [customHeight, setCustomHeight] = useState<string>("300");
  const [maxKb, setMaxKb] = useState<number>(50); // Target compressed KB limit
  const [compressionQuality, setCompressionQuality] = useState<number>(0.85);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [resizedBlob, setResizedBlob] = useState<Blob | null>(null);
  const [resizedPreview, setResizedPreview] = useState<string | null>(null);
  const [resizedInfo, setResizedInfo] = useState<{ width: number; height: number; sizeKb: number } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // --- TOOL 2: AGE CALCULATOR STATES ---
  const [dob, setDob] = useState<string>("");
  const [targetDate, setTargetDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [ageResult, setAgeResult] = useState<{ years: number; months: number; days: number; category: string } | null>(null);

  // --- TOOL 3: BILLING CALCULATOR STATES ---
  const [billItems, setBillItems] = useState<Array<{ id: string; service: string; rate: number; qty: number }>>([
    { id: "1", service: "জেরক্স / Photocopy (A4)", rate: 3, qty: 1 },
    { id: "2", service: "পাসপোর্ট ছবি প্রিন্ট (Passport Color Photo)", rate: 10, qty: 1 }
  ]);
  const [newServiceName, setNewServiceName] = useState<string>("");
  const [newServiceRate, setNewServiceRate] = useState<string>("");
  const [cashReceived, setCashReceived] = useState<string>("");
  const [billingHistory, setBillingHistory] = useState<Array<{ id: string; timestamp: string; total: number; change: number }>>([]);

  // Load billing history on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("sahaj_seba_billing_history");
      if (saved) {
        setBillingHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Save billing history
  const saveHistoryToLocalStorage = (newHistory: any) => {
    setBillingHistory(newHistory);
    try {
      localStorage.setItem("sahaj_seba_billing_history", JSON.stringify(newHistory));
    } catch (e) {
      console.error(e);
    }
  };

  // Preset services list
  const BILLING_PRESETS = [
    { service: "জেরক্স / Photocopy", rate: 3 },
    { service: "কালার প্রিন্ট (A4 Color Print)", rate: 15 },
    { service: "ব্ল্যাক এন্ড হোয়াইট প্রিন্ট", rate: 5 },
    { service: "অনলাইন ফর্ম আবেদন (Form Fillup)", rate: 50 },
    { service: "ল্যামিনেশন / Lamination", rate: 20 },
    { service: "পাসপোর্ট ফটো প্রিন্ট (4x6 Sheet)", rate: 30 },
    { service: "আধার কার্ড ল্যামিনেশন", rate: 40 },
    { service: "প্যান কার্ড অনলাইন আবেদন", rate: 150 }
  ];

  // --- RESIZER LOGIC ---
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      setResizedPreview(null);
      setResizedBlob(null);
      setResizedInfo(null);
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setResizedPreview(null);
    setResizedBlob(null);
    setResizedInfo(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const selectResizeMode = (mode: "passport" | "signature" | "custom") => {
    setResizeMode(mode);
    if (mode === "passport") {
      setCustomWidth("300");
      setCustomHeight("300");
      setMaxKb(50);
    } else if (mode === "signature") {
      setCustomWidth("300");
      setCustomHeight("80");
      setMaxKb(20);
    }
  };

  const processImageToTarget = () => {
    if (!imagePreview) return;
    setIsProcessing(true);

    const targetW = resizeMode === "passport" ? 300 : resizeMode === "signature" ? 300 : parseInt(customWidth) || 300;
    const targetH = resizeMode === "passport" ? 300 : resizeMode === "signature" ? 80 : parseInt(customHeight) || 300;

    const img = new Image();
    img.src = imagePreview;
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = targetW;
      canvas.height = targetH;

      // Draw and crop optimally to fit center
      const sourceAspect = img.width / img.height;
      const targetAspect = targetW / targetH;
      let sx = 0, sy = 0, sWidth = img.width, sHeight = img.height;

      if (sourceAspect > targetAspect) {
        // Source is wider
        sWidth = img.height * targetAspect;
        sx = (img.width - sWidth) / 2;
      } else if (sourceAspect < targetAspect) {
        // Source is taller
        sHeight = img.width / targetAspect;
        sy = (img.height - sHeight) / 2;
      }

      ctx.clearRect(0, 0, targetW, targetH);
      // High-quality rendering properties
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      
      ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, targetW, targetH);

      // Recursive compression loop to fit under target KB optionally
      let quality = compressionQuality;
      const compressAndCheck = () => {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              setIsProcessing(false);
              return;
            }
            const sizeKb = blob.size / 1024;
            // If size is too big and quality is still above 0.1, compress more
            if (sizeKb > maxKb && quality > 0.15 && resizeMode !== "custom") {
              quality -= 0.05;
              compressAndCheck();
            } else {
              setResizedBlob(blob);
              if (resizedPreview) URL.revokeObjectURL(resizedPreview);
              const previewUrl = URL.createObjectURL(blob);
              setResizedPreview(previewUrl);
              setResizedInfo({
                width: targetW,
                height: targetH,
                sizeKb: parseFloat(sizeKb.toFixed(2))
              });
              setIsProcessing(false);
            }
          },
          "image/jpeg",
          quality
        );
      };

      compressAndCheck();
    };
  };

  useEffect(() => {
    if (imagePreview) {
      processImageToTarget();
    }
  }, [imagePreview, resizeMode, customWidth, customHeight, maxKb, compressionQuality]);

  const downloadProcessedImage = () => {
    if (!resizedPreview || !resizedBlob) return;
    const link = document.createElement("a");
    const extension = "jpg";
    const prefix = resizeMode === "passport" ? "passport_photo" : resizeMode === "signature" ? "signature" : "resized_image";
    link.download = `${prefix}_${Date.now()}.${extension}`;
    link.href = resizedPreview;
    link.click();
  };

  // --- AGE CALCULATOR LOGIC ---
  const calculateAge = () => {
    if (!dob) return;
    
    const dobDate = new Date(dob);
    const end = new Date(targetDate);
    
    if (isNaN(dobDate.getTime()) || isNaN(end.getTime())) return;
    
    let years = end.getFullYear() - dobDate.getFullYear();
    let months = end.getMonth() - dobDate.getMonth();
    let days = end.getDate() - dobDate.getDate();

    if (days < 0) {
      months--;
      // Get days of the previous month
      const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    let category = "জেনারেল যোগ্য";
    if (years < 18) category = "নাবালক (Under 18)";
    else if (years >= 18 && years <= 40) category = "আবেদনযোগ্য যুব (18-40)";
    else if (years > 40 && years <= 60) category = "প্রৌঢ় (40-60)";
    else category = "সিনিয়র সিটিজেন (60+)";

    setAgeResult({ years, months, days, category });
  };

  useEffect(() => {
    if (dob && targetDate) {
      calculateAge();
    }
  }, [dob, targetDate]);


  // --- BILLING CALCULATOR LOGIC ---
  const addBillItem = (preset?: { service: string; rate: number }) => {
    const itemToAdd = preset ? {
      id: Date.now().toString(),
      service: preset.service,
      rate: preset.rate,
      qty: 1
    } : {
      id: Date.now().toString(),
      service: newServiceName || "নতুন সেবা",
      rate: parseFloat(newServiceRate) || 0,
      qty: 1
    };

    setBillItems([...billItems, itemToAdd]);
    if (!preset) {
      setNewServiceName("");
      setNewServiceRate("");
    }
  };

  const updateBillQty = (id: string, qty: number) => {
    if (qty < 1) return;
    setBillItems(billItems.map(item => item.id === id ? { ...item, qty } : item));
  };

  const updateBillRate = (id: string, rate: number) => {
    setBillItems(billItems.map(item => item.id === id ? { ...item, rate } : item));
  };

  const deleteBillItem = (id: string) => {
    setBillItems(billItems.filter(item => item.id !== id));
  };

  const getBillTotal = () => {
    return billItems.reduce((acc, current) => acc + (current.rate * current.qty), 0);
  };

  const getChangeTotal = () => {
    const total = getBillTotal();
    const received = parseFloat(cashReceived) || 0;
    return received > total ? received - total : 0;
  };

  const handleCheckoutBill = () => {
    const total = getBillTotal();
    if (total === 0) return;

    const change = getChangeTotal();
    const now = new Date();
    const cleanTime = now.toLocaleTimeString("bn-IN", { hour: "2-digit", minute: "2-digit" });

    const newRecord = {
      id: Date.now().toString(),
      timestamp: cleanTime,
      total,
      change
    };

    const updatedHistory = [newRecord, ...billingHistory].slice(0, 10);
    saveHistoryToLocalStorage(updatedHistory);
    
    // Reset items and received cash
    setBillItems([
      { id: "1", service: "জেরক্স / Photocopy (A4)", rate: 3, qty: 1 }
    ]);
    setCashReceived("");
  };

  const clearBillingHistory = () => {
    saveHistoryToLocalStorage([]);
  };

  return (
    <div className="w-full bg-slate-50/20 py-2">
      {/* Tab Selectors */}
      <div className="flex items-center justify-center p-1 bg-slate-105 border border-slate-200/60 rounded-xl mb-6 max-w-xl mx-auto select-none mt-2">
        <button
          onClick={() => setActiveTool("resizer")}
          className={`flex-1 py-2 sm:py-2.5 px-3 rounded-lg text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTool === "resizer"
              ? "bg-[#15803D] text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/50"
          }`}
        >
          <ImageIcon className="h-4 w-4 shrink-0" />
          <span>পাসপোর্ট ছবি ও সিগনেচার রিসাইজার</span>
        </button>

        <button
          onClick={() => setActiveTool("age")}
          className={`flex-1 py-2 sm:py-2.5 px-3 rounded-lg text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTool === "age"
              ? "bg-[#15803D] text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/50"
          }`}
        >
          <Calendar className="h-4 w-4 shrink-0" />
          <span>বয়স ক্যালকুলেটর</span>
        </button>

        <button
          onClick={() => setActiveTool("billing")}
          className={`flex-1 py-2 sm:py-2.5 px-3 rounded-lg text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTool === "billing"
              ? "bg-[#15803D] text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/50"
          }`}
        >
          <Calculator className="h-4 w-4 shrink-0" />
          <span>কাস্টমার বিল ক্যালকুলেটর</span>
        </button>
      </div>

      {/* RENDER ACTIVE TOOL */}
      <div className="w-full select-none">
        {/* TOOL 1: HIGH FIDELITY IMAGE RESIZER & COMPRESSOR */}
        {activeTool === "resizer" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm">
            {/* Control Sidebar (Lg: 5 columns) */}
            <div className="lg:col-span-5 space-y-5">
              <div>
                <h4 className="font-extrabold text-[#0F172A] text-sm flex items-center gap-1.5 mb-1">
                  <Crop className="h-4.5 w-4.5 text-[#15803D]" />
                  রিসাইজ ফরম্যাট নির্বাচন করুন:
                </h4>
                <p className="text-[11px] text-slate-400 font-bold mb-3">সরকারি ফর্মে আবেদনের জন্য নির্দিষ্ট সাইজ সেট করুন</p>
                
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => selectResizeMode("passport")}
                    className={`py-2 px-2.5 rounded-xl text-center text-xs font-black border transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                      resizeMode === "passport"
                        ? "bg-green-50 text-[#15803D] border-[#15803D]/65"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span className="text-[11px]">পাসপোর্ট ছবি</span>
                    <span className="text-[9px] opacity-75 font-mono">300 x 300 px</span>
                  </button>

                  <button
                    onClick={() => selectResizeMode("signature")}
                    className={`py-2 px-2.5 rounded-xl text-center text-xs font-black border transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                      resizeMode === "signature"
                        ? "bg-green-50 text-[#15803D] border-[#15803D]/65"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span className="text-[11px]">স্বাক্ষর / Signature</span>
                    <span className="text-[9px] opacity-75 font-mono">300 x 80 px</span>
                  </button>

                  <button
                    onClick={() => selectResizeMode("custom")}
                    className={`py-2 px-2.5 rounded-xl text-center text-xs font-black border transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                      resizeMode === "custom"
                        ? "bg-green-50 text-[#15803D] border-[#15803D]/65"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span className="text-[11px]">কাস্টম সাইজ</span>
                    <span className="text-[9px] opacity-75 font-sans">নিজের মতো</span>
                  </button>
                </div>
              </div>

              {/* Custom Size Fields (Shown if custom is selected) */}
              {resizeMode === "custom" && (
                <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50/50 rounded-xl border border-slate-150 animate-fade-in">
                  <div>
                    <label className="text-[10px] font-black text-slate-500 block mb-1">প্রস্থ (Width in px)</label>
                    <input
                      type="number"
                      value={customWidth}
                      onChange={(e) => setCustomWidth(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg py-1.5 px-3 font-mono text-xs text-slate-800 font-bold focus:outline-none focus:ring-1 focus:ring-[#15803D]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 block mb-1">উচ্চতা (Height in px)</label>
                    <input
                      type="number"
                      value={customHeight}
                      onChange={(e) => setCustomHeight(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg py-1.5 px-3 font-mono text-xs text-slate-800 font-bold focus:outline-none focus:ring-1 focus:ring-[#15803D]"
                    />
                  </div>
                </div>
              )}

              {/* KB Compression Target Limits */}
              {resizeMode !== "custom" && (
                <div className="space-y-2 p-3.5 bg-slate-50 border border-slate-150 rounded-xl">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-extrabold text-[#0F172A]">টার্গেট ফাইল সাইজ (Max Kb Limit):</span>
                    <span className="text-xs font-mono font-black text-[#15803D]">{maxKb} KB</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="200"
                    step="5"
                    value={maxKb}
                    onChange={(e) => setMaxKb(parseInt(e.target.value))}
                    className="w-full accent-[#15803D] h-1 bg-slate-200 rounded-lg cursor-pointer"
                  />
                  <p className="text-[9px] text-slate-400 font-bold">
                    * এই সাইজের চেয়ে কম বা সমান করার জন্য সিস্টেম স্বয়ংক্রিয় গুণমান (JPG Quality Quality) নিয়ন্ত্রণ করবে।
                  </p>
                </div>
              )}

              {/* Upload Input wrapper */}
              <div className="space-y-1.5">
                <span className="text-xs font-extrabold text-slate-650 block">উৎস ফাইল নির্বাচন করুন:</span>
                <div className="flex gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 bg-gradient-to-r from-[#15803D] to-green-700 text-white rounded-xl py-2.5 px-4 text-xs font-black hover:from-green-700 hover:to-emerald-800 transition-all cursor-pointer shadow-md select-none text-center flex items-center justify-center gap-1.5"
                  >
                    <Camera className="h-4 w-4" />
                    <span>মোবাইল বা পিসি থেকে ছবি আনুন</span>
                  </button>
                  {imagePreview && (
                    <button
                      onClick={clearImage}
                      className="px-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all border border-red-200 cursor-pointer"
                      title="ছবি মুছুন"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Guidance card */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-150 text-[10px] text-slate-500 font-semibold space-y-1 text-left">
                <p className="font-extrabold text-[#15803D] text-[11px]">💡 ডিজিটাল স্টুডিও টিপস:</p>
                <p>• সাধারণত পশ্চিমবঙ্গের সরকারি চাকরির আবেদন (যেমন WB Police, PSC) ১টি ৩০০x৩০০ ছবি (২০-৫০ কেবি) এবং ৩০x৮০ স্বাক্ষর (১০-২০ কেবি) দাবি করে।</p>
                <p>• রিসাইজ করার সময় কোনো ডেটা আমাদের সার্ভারে আপলোড হয় না, সবকিছু আপনার ব্রাউজারে সম্পূর্ণ গোপনে ও অফলাইনে করা হয়।</p>
              </div>
            </div>

            {/* Preview Output Frame (Lg: 7 columns) */}
            <div className="lg:col-span-7 flex flex-col justify-between border border-slate-150 rounded-2xl bg-slate-50/40 p-5 min-h-[320px] relative">
              
              {!imagePreview && (
                <div className="m-auto flex flex-col items-center justify-center text-center p-6 space-y-3">
                  <div className="bg-[#15803D]/10 text-[#15803D] p-4 rounded-full border border-[#15803D]/15">
                    <ImageIcon className="h-8 w-8" />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-xs text-slate-800 mb-1">কোনো ফাইল এখনো সিলেক্ট করা হয়নি</h5>
                    <p className="text-[10px] text-slate-400 font-bold max-w-xs">
                      উপরোক্ত আপলোড বাটনটি চাপুন এবং আপনার কম্পিউটারের যেকোন ছবি সিলেক্ট করুন। মুহূর্তেই প্রফেশনাল রিসাইজ করা হবে।
                    </p>
                  </div>
                </div>
              )}

              {imagePreview && (
                <div className="space-y-5 flex-1 flex flex-col justify-between">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                    {/* Source Preview Column */}
                    <div className="space-y-2 flex flex-col items-center">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wide">১. আসল ছবি (Original File Preview)</span>
                      <div className="w-40 h-40 max-w-full relative border border-slate-200 bg-white p-1 rounded-xl flex items-center justify-center overflow-hidden">
                        <img 
                          src={imagePreview} 
                          alt="Original Input" 
                          className="max-w-full max-h-full object-contain"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </div>

                    {/* Resized Output Column */}
                    <div className="space-y-2 flex flex-col items-center">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wide">২. রিসাইজড ফলাফল (Resized Pro Output)</span>
                      <div className="w-40 h-40 max-w-full relative border border-slate-350 bg-white p-1 rounded-xl flex items-center justify-center overflow-hidden">
                        {isProcessing ? (
                          <div className="flex flex-col items-center justify-center gap-1">
                            <RefreshCw className="h-5 w-5 text-[#15803D] animate-spin" />
                            <span className="text-[9px] font-black text-slate-400">রিসাইজ হচ্ছে...</span>
                          </div>
                        ) : resizedPreview ? (
                          <img 
                            src={resizedPreview} 
                            alt="Resized Output" 
                            className="max-w-full max-h-full object-contain" 
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <span className="text-[9px] text-slate-400">তৈরি করা হচ্ছে...</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Resized details output report */}
                  {resizedInfo && (
                    <div className="bg-emerald-50/70 border border-emerald-100 p-3.5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs font-black text-emerald-900">
                          <CheckCircle className="h-4 w-4 text-emerald-700 shrink-0" />
                          <span>ফাইল সফলভাবে অপ্টিমাইজড হয়েছে!</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-[10px] sm:text-xs text-slate-500 font-bold font-sans">
                          <span>সাইজ: {resizedInfo.width}px x {resizedInfo.height}px</span>
                          <span className="text-slate-300">|</span>
                          <span className="bg-emerald-600 text-white rounded-md px-1.5 py-0.5 text-[10px] font-mono">ফাইল সাইজ: {resizedInfo.sizeKb} KB</span>
                          {resizedInfo.sizeKb <= maxKb && (
                            <span className="text-emerald-700 font-extrabold">(আবেদনযোগ্য সীমার মধ্যে)</span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={downloadProcessedImage}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-2 px-3.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 shadow-sm"
                      >
                        <Download className="h-4 w-4" />
                        <span>ডাউনলোড করুন (JPG)</span>
                      </button>
                    </div>
                  )}

                </div>
              )}

              {/* Reference hidden canvas */}
              <canvas ref={canvasRef} className="hidden" />
            </div>
          </div>
        )}

        {/* TOOL 2: COMPACT AGE CALCULATOR */}
        {activeTool === "age" && (
          <div className="max-w-3xl mx-auto bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm">
            <div className="border-b border-slate-100 pb-3 mb-4 text-left">
              <h4 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
                <Calendar className="h-5 w-5 text-[#15803D]" />
                বয়স ক্যালকুলেটর (Official Age Counter)
              </h4>
              <p className="text-slate-400 text-[11px] font-bold mt-0.5">কলকাতা পুলিশ, পিএসসি ও স্কুলের ফর্মে বয়স হিসেব করুন মুহূর্তে</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 select-none">
              {/* Inputs Column */}
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-black text-slate-600 block mb-1.5 text-left">১. আপনার জন্ম তারিখ (Date of Birth) :</label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs text-slate-800 font-bold focus:outline-none focus:ring-1 focus:ring-[#15803D] font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-black text-slate-600 block mb-1.5 text-left">২. বয়স গণনার হিসাবের তারিখ (As of Date Offset) :</label>
                  <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs text-slate-800 font-bold focus:outline-none focus:ring-1 focus:ring-[#15803D] font-mono"
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => setTargetDate(new Date().toISOString().split("T")[0])}
                      className="px-2.5 py-1 text-[10px] font-bold text-slate-500 border border-slate-200 rounded-md hover:bg-slate-50 cursor-pointer"
                    >
                      আজকের দিন
                    </button>
                    <button
                      onClick={() => setTargetDate(`${new Date().getFullYear()}-01-01`)}
                      className="px-2.5 py-1 text-[10px] font-bold text-slate-500 border border-slate-200 rounded-md hover:bg-slate-50 cursor-pointer"
                    >
                      ১লা জানুয়ারি ({new Date().getFullYear()})
                    </button>
                  </div>
                </div>
              </div>

              {/* Results Display Column */}
              <div className="border border-slate-100 bg-slate-50/50 rounded-2xl p-5 flex flex-col justify-center relative select-none">
                {!dob && (
                  <div className="text-center py-6">
                    <HelpCircle className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs font-black text-slate-500">জন্ম তারিখ ইনপুট লিখুন</p>
                    <p className="text-[10px] text-slate-400 font-bold max-w-xs mx-auto mt-1">
                      উপরে আপনার বা কাস্টমারের আসল জন্ম পরিচয় তারিখ নির্বাচন করলে বয়স হিসেব দেখানো শুরু হবে।
                    </p>
                  </div>
                )}

                {dob && ageResult && (
                  <div className="space-y-4 animate-fade-in text-left">
                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">হিসাবকৃত নিখুঁত বয়স:</span>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        <div className="bg-white border border-slate-150 p-2.5 rounded-xl text-center shadow-xs">
                          <span className="text-lg md:text-xl font-mono font-black text-[#15803D] block">{ageResult.years}</span>
                          <span className="text-[10px] font-bold text-slate-500">বছর (Yrs)</span>
                        </div>
                        <div className="bg-white border border-slate-150 p-2.5 rounded-xl text-center shadow-xs">
                          <span className="text-lg md:text-xl font-mono font-black text-[#15803D] block">{ageResult.months}</span>
                          <span className="text-[10px] font-bold text-slate-500">মাস (Mths)</span>
                        </div>
                        <div className="bg-white border border-slate-150 p-2.5 rounded-xl text-center shadow-xs">
                          <span className="text-lg md:text-xl font-mono font-black text-[#15803D] block">{ageResult.days}</span>
                          <span className="text-[10px] font-bold text-slate-500">দিন (Days)</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-between gap-2.5">
                      <div className="flex gap-2 items-center">
                        <CheckCircle className="h-4 w-4 text-emerald-700 shrink-0" />
                        <div>
                          <span className="text-[10px] font-black text-slate-450 block leading-none mb-0.5">বয়সের যোগ্যতা বিভাগ:</span>
                          <span className="text-xs font-black text-emerald-900">{ageResult.category}</span>
                        </div>
                      </div>
                      <span className="bg-[#DCFCE7] text-[#15803D] text-[10px] font-black px-2 py-0.5 rounded-md border border-[#86EFAC]/30 font-sans">
                        সঠিক বয়স
                      </span>
                    </div>

                    <div className="text-[10px] text-slate-450 font-bold leading-relaxed border-t border-slate-150 pt-2 font-mono">
                      * সঠিক দিনসংখ্যা মাস পরিবর্তনের দিন অনুযায়ী পরিমেয় (Leap Year ও ৩০/৩১ দিন সমন্বিত)।
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TOOL 3: DAILY CUSTOMER BILLING CALCULATOR */}
        {activeTool === "billing" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm">
            {/* Left panel: Bill Compiler Column (Lg: 7 columns) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 text-left">
                <h4 className="font-extrabold text-slate-850 text-sm flex items-center gap-1.5">
                  <Calculator className="h-4.5 w-4.5 text-[#15803D]" />
                  চলতি কাস্টমার ড্যাশবোর্ড রশিদ (Active Receipt)
                </h4>
                <button
                  onClick={() => setBillItems([])}
                  className="text-xs font-bold text-red-600 hover:text-red-750 px-2 py-1 rounded bg-red-50 hover:bg-red-100/50 cursor-pointer"
                >
                  সব মুছুন
                </button>
              </div>

              {/* Compile items list */}
              <div className="space-y-2 max-h-[290px] overflow-y-auto pr-1">
                {billItems.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-xl space-y-1">
                    <p className="text-xs font-black text-slate-500">কাস্টমারের সেবা তালিকায় কোনো হিসাব এখনো যোগ করা হয়নি</p>
                    <p className="text-[10px] text-slate-400 font-bold">নিচের কুইক প্রিসেট অথবা কাস্টম ইনপুট দিয়ে যোগ করুন।</p>
                  </div>
                ) : (
                  billItems.map((item) => (
                    <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 p-3.5 bg-slate-50 border border-slate-200/60 rounded-xl hover:bg-slate-100/30 transition-all text-left">
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-black text-[#0F172A] block truncate">{item.service}</span>
                        <span className="text-[10px] font-bold text-slate-400">প্রতি পিসের মূল্য: ৳{item.rate}</span>
                      </div>

                      <div className="flex items-center gap-3 justify-end shrink-0">
                        <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white">
                          <button
                            onClick={() => updateBillQty(item.id, item.qty - 1)}
                            className="bg-slate-55 px-2.5 py-1 text-slate-650 hover:bg-slate-100 font-black cursor-pointer text-xs"
                          >
                            -
                          </button>
                          <span className="px-3.5 text-xs font-mono font-black text-slate-800">{item.qty}</span>
                          <button
                            onClick={() => updateBillQty(item.id, item.qty + 1)}
                            className="bg-slate-55 px-2.5 py-1 text-slate-650 hover:bg-slate-100 font-black cursor-pointer text-xs"
                          >
                            +
                          </button>
                        </div>

                        <div className="w-16 text-right">
                          <span className="text-xs font-mono font-black text-slate-900 block">৳{item.rate * item.qty}</span>
                        </div>

                        <button
                          onClick={() => deleteBillItem(item.id)}
                          className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg cursor-pointer"
                          title="মুছুন"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Inline Custom Item Add Row */}
              <div className="bg-slate-50/50 border border-slate-150 rounded-xl p-3.5 space-y-3">
                <span className="text-[10.5px] font-extrabold text-[#15803D] block tracking-wide uppercase">১. নতুন কাস্টম বিবরণী যোগ করুন (Custom Item Input)</span>
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                  <input
                    type="text"
                    value={newServiceName}
                    onChange={(e) => setNewServiceName(e.target.value)}
                    placeholder="কাজের ধরণ (যেমন: ফোটোগ্রাফি প্রিন্ট, ইত্যাদি)"
                    className="sm:col-span-7 bg-white border border-slate-200 rounded-lg py-1.5 px-3 text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#15803D]"
                  />
                  <input
                    type="number"
                    value={newServiceRate}
                    onChange={(e) => setNewServiceRate(e.target.value)}
                    placeholder="৳ রেট"
                    className="sm:col-span-3 bg-white border border-slate-200 rounded-lg py-1.5 px-3 text-xs font-bold font-mono text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#15803D]"
                  />
                  <button
                    onClick={() => addBillItem()}
                    className="sm:col-span-2 bg-[#15803D] hover:bg-emerald-700 text-white font-extrabold text-xs py-1.5 px-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 shadow-sm"
                  >
                    <Plus className="h-4 w-4 shrink-0" />
                    <span>যোগ করুন</span>
                  </button>
                </div>
              </div>

              {/* Shop Presets shortcuts */}
              <div>
                <span className="text-[10.5px] font-extrabold text-slate-450 block tracking-wide uppercase mb-2 text-left">২. স্টুডিও চটজলদি প্রিসেট (Quick Studio Presets List)</span>
                <div className="flex flex-wrap gap-1.5">
                  {BILLING_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => addBillItem(preset)}
                      className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-lg text-[10.5px] font-extrabold text-slate-700 hover:text-[#15803D] transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Plus className="h-3 w-3 text-slate-400 shrink-0" />
                      <span>{preset.service} - ৳{preset.rate}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right panel: Receipts metadata and cash ledger (Lg: 5 columns) */}
            <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col justify-between min-h-[380px] text-left">
              <div className="space-y-4">
                <span className="text-xs font-black text-slate-400 uppercase tracking-wide block">৩. বিল গণনা বিবরণী</span>
                
                <div className="space-y-2 border-b border-dashed border-slate-200 pb-3">
                  <div className="flex justify-between items-center text-slate-700 text-xs font-bold">
                    <span>মোট সংগৃহীত সেবা টাইপ:</span>
                    <span className="font-mono">{billItems.length} টি</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-900 text-base font-black">
                    <span>সর্বমোট বিল (Total Bill):</span>
                    <span className="text-lg font-mono text-[#15803D]">৳{getBillTotal()}</span>
                  </div>
                </div>

                {/* Cash Drawer Calculator */}
                <div className="bg-white border border-slate-150 rounded-xl p-3.5 space-y-2.5">
                  <div>
                    <label className="text-[10.5px] font-black text-slate-550 block mb-1">কাস্টমার কত টাকা দিয়েছে (Cash Paid):</label>
                    <div className="relative rounded-lg shadow-sm">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-xs font-bold text-slate-450">৳</span>
                      <input
                        type="number"
                        placeholder="যেমন: ৫০, ১০০, ৫০০..."
                        value={cashReceived}
                        onChange={(e) => setCashReceived(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg py-1.5 pl-7 pr-3 font-mono text-xs text-slate-800 font-bold focus:outline-none focus:ring-1 focus:ring-[#15803D]"
                      />
                    </div>
                  </div>

                  {cashReceived && (
                    <div className="flex justify-between items-center p-2 bg-[#DCFCE7]/60 rounded-lg border border-[#86EFAC]/30">
                      <span className="text-[11px] font-black text-emerald-950">ফেরত দিতে হবে (Give Change):</span>
                      <span className="text-sm font-mono font-black text-emerald-700">৳{getChangeTotal()}</span>
                    </div>
                  )}
                </div>

                {/* Finish & Save button */}
                <button
                  onClick={handleCheckoutBill}
                  disabled={getBillTotal() === 0}
                  className="w-full bg-gradient-to-r from-teal-600 to-[#15803D] hover:from-teal-700 hover:to-green-700 text-white rounded-xl py-2.5 px-4 text-xs font-bold select-none cursor-pointer text-center duration-300 transform active:translate-y-0 hover:-translate-y-0.5 shadow-md flex items-center justify-center gap-1.5 disabled:opacity-45 disabled:pointer-events-none"
                >
                  <TrendingUp className="h-4 w-4" />
                  <span>বিল সম্পন্ন ও সেভ করুন (Checkout)</span>
                </button>
              </div>

              {/* Running summary ledger history */}
              <div className="mt-4 border-t border-slate-200 pt-3 flex-1 flex flex-col justify-end">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">আজকের শেষ ১০টি ট্রানজ্যাকশন</span>
                  {billingHistory.length > 0 && (
                    <button
                      onClick={clearBillingHistory}
                      className="text-[9px] font-black text-slate-400 hover:text-red-600 cursor-pointer"
                    >
                      ক্লিয়ার
                    </button>
                  )}
                </div>

                <div className="max-h-[110px] overflow-y-auto space-y-1">
                  {billingHistory.length === 0 ? (
                    <p className="text-[9px] font-bold text-slate-400 italic">এখানে সম্পন্ন ট্রানজ্যাকশনগুলোর হিসাব জমা হবে...</p>
                  ) : (
                    billingHistory.map((h) => (
                      <div key={h.id} className="flex justify-between items-center text-[10.5px] bg-white border border-slate-150 rounded px-2.5 py-1 shadow-2xs">
                        <span className="font-mono text-slate-400 font-bold">{h.timestamp}</span>
                        <div className="space-x-2">
                          <span className="font-black text-slate-750">বিল: ৳{h.total}</span>
                          {h.change > 0 && <span className="text-slate-400 font-semibold">(ফেরত: ৳{h.change})</span>}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
