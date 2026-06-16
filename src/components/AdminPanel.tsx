import React, { useState, useRef } from "react";
import { Scheme, Job, Scholarship, ServiceItem, AppUpdate, CategoryItem } from "../data";
import { 
  Plus, 
  Trash, 
  Settings, 
  PieChart, 
  Bell, 
  Check, 
  PlusCircle, 
  AlertCircle, 
  FileText, 
  Edit3, 
  ExternalLink,
  GraduationCap,
  Briefcase,
  Layers,
  FileCheck,
  Grid,
  HeartPulse,
  Laptop,
  Award,
  IdCard,
  MapPin,
  Globe,
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

interface AdminPanelProps {
  schemes: Scheme[];
  onCreateScheme: (scheme: Scheme) => Promise<void>;
  onSaveScheme: (scheme: Scheme) => Promise<void>;
  onDeleteScheme: (id: string) => Promise<void>;

  jobs: Job[];
  onCreateJob: (job: Job) => Promise<void>;
  onSaveJob: (job: Job) => Promise<void>;
  onDeleteJob: (id: string) => Promise<void>;

  scholarships: Scholarship[];
  onCreateScholarship: (scholarship: Scholarship) => Promise<void>;
  onSaveScholarship: (scholarship: Scholarship) => Promise<void>;
  onDeleteScholarship: (id: string) => Promise<void>;

  services: ServiceItem[];
  onCreateService: (service: ServiceItem) => Promise<void>;
  onSaveService: (service: ServiceItem) => Promise<void>;
  onDeleteService: (id: string) => Promise<void>;

  categories: CategoryItem[];
  onSaveCategory: (cat: CategoryItem) => Promise<void>;
  onDeleteCategory: (id: string) => Promise<void>;

  updates: AppUpdate[];
  setUpdates: React.Dispatch<React.SetStateAction<AppUpdate[]>>;
  onClose: () => void;
  triggerPushNotification: (text: string) => void;
  firebaseStatus?: any;
  settings: { geminiApiKey: string };
  onSaveSettings: (newSettings: { geminiApiKey: string }) => Promise<boolean>;
}

export default function AdminPanel({
  schemes,
  onCreateScheme,
  onSaveScheme,
  onDeleteScheme,
  jobs,
  onCreateJob,
  onSaveJob,
  onDeleteJob,
  scholarships,
  onCreateScholarship,
  onSaveScholarship,
  onDeleteScholarship,
  services,
  onCreateService,
  onSaveService,
  onDeleteService,
  categories,
  onSaveCategory,
  onDeleteCategory,
  updates,
  setUpdates,
  onClose,
  triggerPushNotification,
  firebaseStatus,
  settings,
  onSaveSettings
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<
    | "analytics"
    | "welfare"
    | "jobs"
    | "scholarships"
    | "identity"
    | "utility"
    | "health"
    | "land"
    | "cyber_cafe"
    | "categories"
    | "settings"
  >("analytics");
  const [notificationMsg, setNotificationMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // A.I. Settings states
  const [apiKeyInput, setApiKeyInput] = useState(settings?.geminiApiKey || "");
  const [showApiKey, setShowApiKey] = useState(false);

  React.useEffect(() => {
    if (settings?.geminiApiKey) {
      setApiKeyInput(settings.geminiApiKey);
    }
  }, [settings?.geminiApiKey]);

  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const scrollTabs = (direction: "left" | "right") => {
    if (tabsContainerRef.current) {
      const scrollAmount = 240;
      tabsContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  // 1. Schemes state & editing
  const [editingSchemeId, setEditingSchemeId] = useState<string | null>(null);
  const [schemeTitle, setSchemeTitle] = useState("");
  const [schemeCategory, setSchemeCategory] = useState<Scheme["category"]>("women");
  const [schemeBenefits, setSchemeBenefits] = useState("");
  const [schemeDescription, setSchemeDescription] = useState("");
  const [schemeEligibility, setSchemeEligibility] = useState("");
  const [schemeDocs, setSchemeDocs] = useState("");
  const [schemeUrl, setSchemeUrl] = useState("");
  const [schemeLogoUrl, setSchemeLogoUrl] = useState("");

  // 2. Jobs state & editing
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [jobTitle, setJobTitle] = useState("");
  const [jobCategory, setJobCategory] = useState<Job["category"]>("wbpsc");
  const [jobVacancy, setJobVacancy] = useState("");
  const [jobQual, setJobQual] = useState("");
  const [jobLastDate, setJobLastDate] = useState("");
  const [jobSalary, setJobSalary] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [jobLogoUrl, setJobLogoUrl] = useState("");

  // 3. Scholarships state & editing
  const [editingScholarshipId, setEditingScholarshipId] = useState<string | null>(null);
  const [scholarshipTitle, setScholarshipTitle] = useState("");
  const [scholarshipAmount, setScholarshipAmount] = useState("");
  const [scholarshipEligibility, setScholarshipEligibility] = useState("");
  const [scholarshipLastDate, setScholarshipLastDate] = useState("");
  const [scholarshipUrl, setScholarshipUrl] = useState("");
  const [scholarshipDescription, setScholarshipDescription] = useState("");
  const [scholarshipLogoUrl, setScholarshipLogoUrl] = useState("");

  // 4. Digital Services state & editing
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [serviceTitle, setServiceTitle] = useState("");
  const [serviceCategory, setServiceCategory] = useState<ServiceItem["category"]>("aadhaar_pan");
  const [serviceDescription, setServiceDescription] = useState("");
  const [serviceSteps, setServiceSteps] = useState("");
  const [serviceUrl, setServiceUrl] = useState("");
  const [serviceLogoUrl, setServiceLogoUrl] = useState("");

  // 5. App Updates
  const [updateTitle, setUpdateTitle] = useState("");
  const [updateCategory, setUpdateCategory] = useState<AppUpdate["category"]>("General");

  // 6. Push notification
  const [pushBody, setPushBody] = useState("");

  // 4b. Category States
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [catId, setCatId] = useState("");
  const [catLabel, setCatLabel] = useState("");
  const [catDesc, setCatDesc] = useState("");
  const [catIconName, setCatIconName] = useState("Award");

  const cancelCategoryEdit = () => {
    setEditingCategoryId(null);
    setCatId("");
    setCatLabel("");
    setCatDesc("");
    setCatIconName("Award");
  };

  // 7. Click-twice Delete Confirmation State
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteConfirmType, setDeleteConfirmType] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotificationMsg(msg);
    setTimeout(() => setNotificationMsg(""), 3500);
  };

  // Category CRUD Handlers
  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catLabel || !catDesc) {
      showNotification("সবগুলি ঘর পূরণ করা আবশ্যক!");
      return;
    }
    const activeId = editingCategoryId || catId.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "");
    if (!activeId) {
      showNotification("সঠিক ইংরেজি ID দিন!");
      return;
    }
    setIsSubmitting(true);
    try {
      const payload: CategoryItem = {
        id: activeId,
        label: catLabel.trim(),
        desc: catDesc.trim(),
        iconName: catIconName
      };
      await onSaveCategory(payload);
      showNotification(editingCategoryId ? "বিভাগ সফলভাবে সংশোধন করা হয়েছে!" : "নতুন বিভাগ সফলভাবে যুক্ত করা হয়েছে!");
      cancelCategoryEdit();
    } catch (err) {
      console.error(err);
      showNotification("ত্রুটি ঘটেছে। আবার চেষ্টা করুন।");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Schemes Handlers: add / edit / save / delete
  const startEditScheme = (item: Scheme) => {
    setEditingSchemeId(item.id);
    setSchemeTitle(item.title);
    setSchemeCategory(item.category);
    setSchemeBenefits(item.benefits);
    setSchemeDescription(item.description || "");
    setSchemeEligibility(item.eligibility || "");
    setSchemeDocs(item.documents ? item.documents.join(", ") : "");
    setSchemeUrl(item.officialUrl || "");
    setSchemeLogoUrl(item.logoUrl || "");
    window.scrollTo({ top: 320, behavior: "smooth" });
  };

  const cancelSchemeEdit = () => {
    setEditingSchemeId(null);
    setSchemeTitle("");
    setSchemeBenefits("");
    setSchemeDescription("");
    setSchemeEligibility("");
    setSchemeDocs("");
    setSchemeUrl("");
    setSchemeLogoUrl("");
  };

  const handleSchemeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schemeTitle || !schemeBenefits) return;
    setIsSubmitting(true);

    const data: Scheme = {
      id: editingSchemeId || `s-admin-${Date.now()}`,
      title: schemeTitle,
      titleEn: schemeTitle,
      category: schemeCategory,
      categoryName: categories.find(c => c.id === schemeCategory)?.label || "অন্যান্য কল্যাণ",
      description: schemeDescription || "প্রশাসনিক প্যানেল দ্বারা সংযুক্ত প্রকল্প।",
      benefits: schemeBenefits,
      eligibility: schemeEligibility || "পশ্চিমবঙ্গের উপযুক্ত যোগ্যতাসম্পন্ন স্থায়ী নাগরিক।",
      documents: schemeDocs ? schemeDocs.split(",").map((d) => d.trim()) : ["আধার কার্ড", "আয়ের শংসাপত্র"],
      officialUrl: schemeUrl || "https://wb.gov.in",
      logoUrl: schemeLogoUrl || "",
      isPopular: true
    };

    try {
      if (editingSchemeId) {
        await onSaveScheme(data);
        showNotification("প্রকল্পটির পরিবর্তন রিয়েল-টাইমে সেভ করা হয়েছে!");
      } else {
        await onCreateScheme(data);
        showNotification("নতুন সরকারি প্রকল্প সফলভাবে লাইভ ডেটাবেসে যুক্ত হয়েছে!");
      }
      cancelSchemeEdit();
    } catch (err) {
      alert("তথ্য সেভ করতে ত্রুটি ঘটেছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Jobs Handlers: add / edit / save / delete
  const startEditJob = (item: Job) => {
    setEditingJobId(item.id);
    setJobTitle(item.title);
    setJobCategory(item.category);
    setJobVacancy(item.vacancy);
    setJobQual(item.qualification);
    setJobLastDate(item.lastDate);
    setJobSalary(item.salary || "");
    setJobUrl(item.officialUrl || "");
    setJobLogoUrl(item.logoUrl || "");
    window.scrollTo({ top: 320, behavior: "smooth" });
  };

  const cancelJobEdit = () => {
    setEditingJobId(null);
    setJobTitle("");
    setJobVacancy("");
    setJobQual("");
    setJobLastDate("");
    setJobSalary("");
    setJobUrl("");
    setJobLogoUrl("");
  };

  const handleJobSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle || !jobVacancy) return;
    setIsSubmitting(true);

    const data: Job = {
      id: editingJobId || `j-admin-${Date.now()}`,
      title: jobTitle,
      subtitle: jobTitle,
      category: jobCategory,
      categoryName: categories.find(c => c.id === jobCategory)?.label || "অন্যান্য নিয়োগ",
      vacancy: jobVacancy,
      qualification: jobQual || "মাধ্যমিক বা উচ্চমাধ্যমিক পাস।",
      lastDate: jobLastDate || "২০২৬-১২-৩১",
      salary: jobSalary || "গ্রেড পে অনুযায়ী চমৎকার ভাতা",
      officialUrl: jobUrl || "https://wb.gov.in",
      logoUrl: jobLogoUrl || ""
    };

    try {
      if (editingJobId) {
        await onSaveJob(data);
        showNotification("চাকরির বিজ্ঞপ্তি রিয়েল-টাইমে আপডেট করা হয়েছে!");
      } else {
        await onCreateJob(data);
        showNotification("নতুন চাকরির বিজ্ঞপ্তি সফলভাবে লাইভ ডেটাবেসে পোস্ট করা হয়েছে!");
      }
      cancelJobEdit();
    } catch (err) {
      alert("তথ্য সেভ করতে ত্রুটি ঘটেছে।");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Scholarships Handlers: add / edit / save / delete
  const startEditScholarship = (item: Scholarship) => {
    setEditingScholarshipId(item.id);
    setScholarshipTitle(item.title);
    setScholarshipAmount(item.amount);
    setScholarshipEligibility(item.eligibility);
    setScholarshipLastDate(item.lastDate);
    setScholarshipUrl(item.officialUrl);
    setScholarshipDescription(item.description);
    setScholarshipLogoUrl(item.logoUrl || "");
    window.scrollTo({ top: 320, behavior: "smooth" });
  };

  const cancelScholarshipEdit = () => {
    setEditingScholarshipId(null);
    setScholarshipTitle("");
    setScholarshipAmount("");
    setScholarshipEligibility("");
    setScholarshipLastDate("");
    setScholarshipUrl("");
    setScholarshipDescription("");
    setScholarshipLogoUrl("");
  };

  const handleScholarshipSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scholarshipTitle || !scholarshipAmount) return;
    setIsSubmitting(true);

    const data: Scholarship = {
      id: editingScholarshipId || `sc-admin-${Date.now()}`,
      title: scholarshipTitle,
      amount: scholarshipAmount,
      eligibility: scholarshipEligibility || "যোগ্য মাধ্যমিক বা উচ্চমাধ্যমিক মেধা সম্পন্ন পশ্চিমবঙ্গের স্থায়ী ছাত্রছাত্রী।",
      lastDate: scholarshipLastDate || "২০২৬-১০-৩১",
      officialUrl: scholarshipUrl || "https://wb.gov.in",
      description: scholarshipDescription || "আর্থিকভাবে অসচ্ছল শিক্ষার্থীদের উচ্চশিক্ষায় অগ্রসর করার জন্য রাজ্যবৃত্তি পোর্টাল।",
      logoUrl: scholarshipLogoUrl || ""
    };

    try {
      if (editingScholarshipId) {
        await onSaveScholarship(data);
        showNotification("স্কলারশিপ বিবরণ রিয়েল-টাইমে আপডেট করা হয়েছে!");
      } else {
        await onCreateScholarship(data);
        showNotification("নতুন স্কলারশিপ প্রকল্প সফলভাবে লাইভ ডেটাবেসে সংযু্ক্ত হয়েছে!");
      }
      cancelScholarshipEdit();
    } catch (err) {
      alert("তথ্য সেভ করতে ত্রুটি ঘটেছে।");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Services Handlers: add / edit / save / delete
  const startEditService = (item: ServiceItem) => {
    setEditingServiceId(item.id);
    setServiceTitle(item.title);
    setServiceCategory(item.category);
    setServiceDescription(item.description);
    setServiceSteps(item.steps ? item.steps.join("\n") : "");
    setServiceUrl(item.officialUrl);
    setServiceLogoUrl(item.logoUrl || "");
    window.scrollTo({ top: 320, behavior: "smooth" });
  };

  const cancelServiceEdit = () => {
    setEditingServiceId(null);
    setServiceTitle("");
    setServiceDescription("");
    setServiceSteps("");
    setServiceUrl("");
    setServiceLogoUrl("");
  };

  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceTitle || !serviceDescription) return;
    setIsSubmitting(true);

    const data: ServiceItem = {
      id: editingServiceId || `srv-admin-${Date.now()}`,
      title: serviceTitle,
      category: serviceCategory,
      categoryName: categories.find(c => c.id === serviceCategory)?.label || "নাগরিক সেবা",
      description: serviceDescription,
      steps: serviceSteps ? serviceSteps.split("\n").map(s => s.trim()).filter(Boolean) : [
        "অফিসিয়াল সরকারী পোর্টালে ভিজিট করুন।",
        "সিটিজেন লগইন সম্পন্ন করুন ও ওটিপি ভেরিফাই করুন।",
        "প্রয়োজনীয় নথি আপলোড করে আবেদন সমাপ্ত করুন।"
      ],
      officialUrl: serviceUrl || "https://wb.gov.in",
      logoUrl: serviceLogoUrl || ""
    };

    try {
      if (editingServiceId) {
        await onSaveService(data);
        showNotification("ডিজিটাল সিটিজেন সার্ভিস বিবরণ রিয়েল-টাইমে আপডেট করা হয়েছে!");
      } else {
        await onCreateService(data);
        showNotification("নতুন ডিজিটাল সিটিজেন সার্ভিস সফলভাবে লাইভ ডেটাবেসে যুক্ত হয়েছে!");
      }
      cancelServiceEdit();
    } catch (err) {
      alert("তথ্য সেভ করতে ত্রুটি ঘটেছে।");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Updates Handlers
  const handleAddUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!updateTitle) return;

    const newUpdate: AppUpdate = {
      id: `up-admin-${Date.now()}`,
      title: updateTitle,
      date: new Date().toISOString().split("T")[0],
      category: updateCategory
    };

    setUpdates((prev) => [newUpdate, ...prev]);
    showNotification("সফলভাবে নতুন আপডেট নোটিশ যুক্ত করা হয়েছে!");
    setUpdateTitle("");
  };

  const handleDeleteUpdate = (id: string) => {
    setUpdates((prev) => prev.filter((u) => u.id !== id));
  };

  // Broadcast Handler
  const handleDispatchPush = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pushBody) return;
    triggerPushNotification(pushBody);
    setPushBody("");
    showNotification("পোর্টাল জুড়ে ব্রডকাস্ট पुश ঘোষণা তাৎক্ষণিক সফল!");
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm" id="admin-panel-component">
      {/* Admin Title */}
      <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-bengali-orange animate-spin" />
          <div>
            <h2 className="font-semibold text-lg text-white">অ্যাডমিন কন্ট্রোল পোর্টাল</h2>
            <p className="text-xs text-slate-400">রিয়েল-টাইম লাইভ ফায়ারবেস ডেটাবেস সিঙ্ক্রোনাইজেশন প্যানেল</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-xs px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-lg text-slate-300 transition-colors font-bold cursor-pointer"
        >
          বন্ধ করুন
        </button>
      </div>

      {notificationMsg && (
        <div className="bg-emerald-50 border-b border-emerald-500/20 px-6 py-3 flex items-center gap-2 text-emerald-700 text-sm font-semibold animate-fade-in">
          <Check className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>{notificationMsg}</span>
        </div>
      )}

      {/* Tabs list */}
      <div className="relative group border-b border-slate-100 bg-slate-50/50 flex items-center">
        {/* Left scroll button for desktop */}
        <button
          onClick={() => scrollTabs("left")}
          className="absolute left-0 top-0 bottom-0 z-10 bg-slate-100/95 hover:bg-slate-200 text-slate-700 w-8 flex items-center justify-center border-r border-slate-200/60 shadow-xs cursor-pointer opacity-70 hover:opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200"
          title="বামে স্ক্রোল করুন"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div 
          ref={tabsContainerRef}
          className="flex-1 flex items-center overflow-x-auto scrollbar-none whitespace-nowrap select-none px-8 scroll-smooth"
        >
          {[
            { id: "analytics", label: "সার্বিক অ্যানালিটিক্স", icon: PieChart, count: null },
            { id: "welfare", label: "সরকারি প্রকল্প", icon: Layers, count: schemes.length },
            { id: "jobs", label: "সরকারি চাকরি", icon: Briefcase, count: jobs.length },
            { id: "scholarships", label: "স্কলারশিপ", icon: GraduationCap, count: scholarships.length },
            { id: "identity", label: "পরিচয় ও কার্ড", icon: FileCheck, count: services.filter(s => s.category === "identity" || s.category === "aadhaar_pan").length },
            { id: "utility", label: "শংসাপত্র", icon: FileText, count: services.filter(s => s.category === "utility" || s.category === "certificates").length },
            { id: "health", label: "হেলথ ও বিমা", icon: HeartPulse, count: services.filter(s => s.category === "health").length },
            { id: "land", label: "জমি ও পরচা", icon: FileCheck, count: services.filter(s => s.category === "land").length },
            { id: "cyber_cafe", label: "সাইবার ক্যাফে", icon: Laptop, count: services.filter(s => s.category === "cyber_cafe").length },
            { id: "categories", label: "বিভাগ পরিচালনা", icon: Grid, count: categories.length },
            { id: "settings", label: "এআই সিস্টেম সেটিংস", icon: Settings, count: null }
          ].map((tab) => {
            const IconComponent = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  // Also reset active edit forms to prevent confusion across tabs
                  cancelSchemeEdit();
                  cancelJobEdit();
                  cancelScholarshipEdit();
                  cancelServiceEdit();
                  cancelCategoryEdit();
                  if (["identity", "utility", "health", "land", "cyber_cafe"].includes(tab.id)) {
                    setServiceCategory(tab.id as any);
                  }
                }}
                className={`px-3 md:px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  isSelected
                    ? "border-bengali-orange text-[#EA580C] bg-white font-black"
                    : "border-transparent text-slate-600 hover:text-slate-800 hover:bg-slate-50"
                }`}
              >
                <IconComponent className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
                {tab.count !== null && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold font-mono ${
                    isSelected ? "bg-orange-100 text-[#EA580C]" : "bg-slate-200 text-slate-650"
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right scroll button for desktop */}
        <button
          onClick={() => scrollTabs("right")}
          className="absolute right-0 top-0 bottom-0 z-10 bg-slate-100/95 hover:bg-slate-200 text-slate-700 w-8 flex items-center justify-center border-l border-slate-200/60 shadow-xs cursor-pointer opacity-70 hover:opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200"
          title="ডানে স্ক্রোল করুন"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="p-6">
        {/* TAB 1: ANALYTICS */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            {firebaseStatus && (
              <div className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                firebaseStatus.connected 
                  ? "bg-emerald-50/70 border-emerald-100 text-emerald-900" 
                  : "bg-amber-50/70 border-amber-100 text-amber-900"
              }`}>
                <div className="flex items-center gap-3">
                  <span className="relative flex h-3 w-3">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      firebaseStatus.connected ? "bg-emerald-400" : "bg-amber-400"
                    }`}></span>
                    <span className={`relative inline-flex rounded-full h-3 w-3 ${
                      firebaseStatus.connected ? "bg-emerald-500" : "bg-amber-500"
                    }`}></span>
                  </span>
                  <div>
                    <h4 className="font-bold text-sm">
                      {firebaseStatus.connected 
                        ? `ফায়ারবেস ক্লাউড ডেটাবেস সংযুক্ত (${firebaseStatus.usingRTDB ? "Realtime Database" : "Firestore"})` 
                        : "ফায়ারবেস লোকাল মেমোরি ফলব্যাক মোড"}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {firebaseStatus.connected 
                        ? `প্রজেক্ট আইডি: ${firebaseStatus.projectId} ${firebaseStatus.databaseURL ? `(${firebaseStatus.databaseURL})` : ""}`
                        : "কনফিগ ডেটা লোড হয়নি। বর্তমানে এটি লোকাল মেমোরি ফলব্যাক মোডে চলছে।"
                      }
                    </p>
                  </div>
                </div>
                {firebaseStatus.connected && (
                  <span className="bg-emerald-100/75 border border-emerald-200/50 text-emerald-800 text-[10px] font-mono font-bold px-2 py-1 rounded-md self-start md:self-auto select-none">
                    ● লাইভ সিঙ্কড
                  </span>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">মোট নাগরিক তথ্য পরিদর্শক</span>
                <span className="text-2xl font-black text-slate-900 block mt-1">৩,৮৯,৪২০ +</span>
                <span className="text-[11px] text-emerald-600 font-bold block mt-1">★ ১৫.৪% বৃদ্ধি গত সপ্তাহ</span>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">লাইভ সরকারি স্কিমসমূহ</span>
                <span className="text-2xl font-black text-bengali-orange block mt-1">{schemes.length} টি</span>
                <p className="text-[11px] text-slate-450 mt-1">লাইফ ফায়ারবেস ডেটাবেস সিঙ্কড</p>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">সক্রিয় বৃত্তি ও স্কলারশিপ</span>
                <span className="text-2xl font-black text-indigo-650 block mt-1">{scholarships.length} টি</span>
                <p className="text-[11px] text-slate-450 mt-1">অনলাইন সরাসরি আবেদনযোগ্য</p>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">ডিজিটাল নাগরিক নথি সেবা</span>
                <span className="text-2xl font-black text-emerald-700 block mt-1">{services.length} টি</span>
                <span className="text-[11px] text-emerald-600 font-bold block mt-1">আধার, প্যান, ভোটার গাইড</span>
              </div>
            </div>

            {/* Real-time Category Status Dashboard (Solves user's request to see all dashboard category items in one place) */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="bg-slate-55 relative border-b border-slate-200 px-5 py-4">
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-orange-400 via-amber-400 to-indigo-500 opacity-90" />
                <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
                  <Grid className="h-4.5 w-4.5 text-bengali-orange animate-pulse" />
                  বিভাগ অনুযায়ী সক্রিয় তথ্যের লাইভ অবস্থা ও এনালিটিক্স
                </h3>
                <p className="text-[10.5px] text-slate-400 font-semibold mt-0.5">সবগুলো বিভাগের ডেটা সংবলিত সেন্ট্রাল কন্টেন্ট মনিটর</p>
              </div>
              <div className="p-4 overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 font-black border-b border-slate-200">
                      <th className="px-4 py-3">বিভাগের নাম (Department)</th>
                      <th className="px-4 py-3">সিস্টেম কি (System Key)</th>
                      <th className="px-4 py-3 text-center">সক্রিয় আইটেম সংখ্যা</th>
                      <th className="px-4 py-3 text-center">অবস্থা (Status)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150">
                    {[
                      { name: "সরকারি প্রকল্প (Welfare)", key: "welfare", count: schemes.length + services.filter(s => s.category === "welfare").length },
                      { name: "সরকারি চাকরি (Jobs)", key: "jobs", count: jobs.length + services.filter(s => s.category === "jobs").length },
                      { name: "স্কলারশিপ (Scholarships)", key: "scholarships", count: scholarships.length + services.filter(s => s.category === "scholarships").length },
                      { name: "পরিচয় ও কার্ড (Identity)", key: "identity", count: services.filter(s => s.category === "identity" || s.category === "aadhaar_pan").length },
                      { name: "শংসাপত্র (Utility)", key: "utility", count: services.filter(s => s.category === "utility" || s.category === "certificates").length },
                      { name: "হেলথ ও বিমা (Health)", key: "health", count: services.filter(s => s.category === "health").length },
                      { name: "জমি ও পরচা (Land)", key: "land", count: services.filter(s => s.category === "land").length },
                      { name: "সাইবার ক্যাফে (Cyber Cafe)", key: "cyber_cafe", count: services.filter(s => s.category === "cyber_cafe").length }
                    ].map((cat) => (
                      <tr key={cat.key} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-4 py-3 font-bold text-slate-800">{cat.name}</td>
                        <td className="px-4 py-3 font-mono text-slate-450 font-semibold text-[10.5px]">{cat.key}</td>
                        <td className="px-4 py-3 text-center font-black text-[#A94F12] text-sm font-mono">{cat.count} টি</td>
                        <td className="px-4 py-3 flex justify-center">
                          {cat.count > 0 ? (
                            <span className="inline-flex items-center gap-1.2 bg-emerald-50 border border-emerald-150 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold text-[10px]">
                              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"></span>
                              সক্রিয় ডাটা বর্তমান
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.2 bg-slate-50 border border-slate-200 text-slate-500 px-2.5 py-0.5 rounded-full font-bold text-[10px]">
                              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full"></span>
                              খালি (তথ্য নেই)
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: WELFARE SCHEME MANAGE */}
        {activeTab === "welfare" && (
          <div className="space-y-6">
            <form onSubmit={handleSchemeSubmit} className="bg-slate-50 p-5 rounded-xl border border-slate-100 space-y-4">
              <h3 className="font-bold text-slate-800 flex items-center gap-1.5 text-sm md:text-base">
                <PlusCircle className="h-4.5 w-4.5 text-bengali-orange" />
                {editingSchemeId ? "সরকারি স্কিমটি সংশোধন করুন" : "নতুন সরকারি স্কিম বা প্রকল্প লাইভ যুক্ত করুন"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">প্রকল্পের নাম (বাংলায়) *</label>
                  <input
                    type="text"
                    required
                    value={schemeTitle}
                    onChange={(e) => setSchemeTitle(e.target.value)}
                    placeholder="যেমন: পথশ্রী পথদিশা প্রকল্প"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/10 focus:border-bengali-orange"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">বিভাগ বা ক্যাটাগরি *</label>
                  <select
                    value={schemeCategory}
                    onChange={(e) => setSchemeCategory(e.target.value as any)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/10 focus:border-bengali-orange"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label} ({c.id})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-slate-600 block mb-1">প্রকল্পের সংক্ষিপ্ত বিবরণী *</label>
                  <input
                    type="text"
                    required
                    value={schemeDescription}
                    onChange={(e) => setSchemeDescription(e.target.value)}
                    placeholder="যেমন: পশ্চিমবঙ্গের স্থায়ী বাসিন্দাদের যাতায়াত ও রাস্তার উন্নয়নে রাজ্য সরকারি প্রকল্প।"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/10 focus:border-bengali-orange"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">লোগো ইমেজ লিঙ্ক (URL - লোগো পরিবর্তন করতে) *</label>
                  <input
                    type="text"
                    value={schemeLogoUrl}
                    onChange={(e) => setSchemeLogoUrl(e.target.value)}
                    placeholder="https://example.com/logo.png"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/10 focus:border-bengali-orange"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">প্রাপ্ত অনুদান বা সুবিধা *</label>
                  <textarea
                    required
                    value={schemeBenefits}
                    onChange={(e) => setSchemeBenefits(e.target.value)}
                    placeholder="যেমন: বছরে এককালীন ১০,০০০ টাকা বা বিনামূল্যে চিকিৎসা ব্যবস্থা"
                    rows={2}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/10 focus:border-bengali-orange"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">আবেদনের যোগ্যতা</label>
                  <textarea
                    value={schemeEligibility}
                    onChange={(e) => setSchemeEligibility(e.target.value)}
                    placeholder="যেমন: বয়স ২৫ থেকে ৬০ বছরের মধ্যে এবং নিজস্ব স্বীয় ব্যাংক অ্যাকাউন্ট।"
                    rows={2}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/10 focus:border-bengali-orange"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">প্রয়োজনীয় নথি (কমা দিয়ে আলাদা করুন)</label>
                  <input
                    type="text"
                    value={schemeDocs}
                    onChange={(e) => setSchemeDocs(e.target.value)}
                    placeholder="যেমন: আধার কার্ড, স্বাস্হ্য সাথী কার্ড, রঙিন ছবি"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/10"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">অফিশিয়াল পোর্টাল লিংক (URL)</label>
                  <input
                    type="text"
                    value={schemeUrl}
                    onChange={(e) => setSchemeUrl(e.target.value)}
                    placeholder="যেমন: https://socialsecurity.wb.gov.in"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/10"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-bengali-orange border border-orange-600 font-extrabold text-[#FFF] text-xs py-2 px-6 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-55 cursor-pointer"
                >
                  {isSubmitting ? "সংরক্ষিত হচ্ছে..." : editingSchemeId ? "স্কিম আপডেট নিশ্চিত করুন" : "স্কিম লাইভ পাবলিশ করুন"}
                </button>
                {editingSchemeId && (
                  <button
                    type="button"
                    onClick={cancelSchemeEdit}
                    className="bg-slate-350 hover:bg-slate-400 text-slate-900 border border-slate-300 font-bold text-xs py-2 px-4 rounded-lg transition-colors cursor-pointer"
                  >
                    বাতিল
                  </button>
                )}
              </div>
            </form>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto scrollbar-none">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 text-xs uppercase font-bold border-b border-slate-200">
                      <th className="px-4 py-3">লোগো</th>
                      <th className="px-4 py-3">নাম</th>
                      <th className="px-4 py-3">বিভাগ</th>
                      <th className="px-4 py-3">সুবিধা</th>
                      <th className="px-4 py-3 text-right">অ্যাকশন</th>
                    </tr>
                  </thead>
                <tbody className="divide-y divide-slate-150 text-xs text-slate-850">
                  {schemes.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        {s.logoUrl ? (
                          <img src={s.logoUrl} className="w-8 h-8 rounded-lg object-cover border border-slate-200 overflow-hidden" referrerPolicy="no-referrer" alt="" />
                        ) : (
                          <span className="text-[10px] text-slate-400 font-semibold uppercase font-mono">Default SVG</span>
                        )}
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-900">{s.title}</td>
                      <td className="px-4 py-3 text-[10px]">
                        <span className="bg-orange-50 text-bengali-orange font-bold px-2 py-0.5 rounded-full border border-orange-100">
                          {s.categoryName}
                        </span>
                      </td>
                      <td className="px-4 py-3 max-w-[250px] truncate text-slate-650">{s.benefits}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => startEditScheme(s)}
                            className="text-indigo-600 hover:text-indigo-800 p-1.5 rounded hover:bg-indigo-50 transition-colors cursor-pointer"
                            title="এডিট করুন"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (deleteConfirmId === s.id && deleteConfirmType === "scheme") {
                                onDeleteScheme(s.id);
                                showNotification("প্রকল্পটি মুছে ফেলা হয়েছে!");
                                setDeleteConfirmId(null);
                                setDeleteConfirmType(null);
                              } else {
                                setDeleteConfirmId(s.id);
                                setDeleteConfirmType("scheme");
                                setTimeout(() => {
                                  setDeleteConfirmId(null);
                                  setDeleteConfirmType(null);
                                }, 5000);
                              }
                            }}
                            className={`p-1.5 rounded transition-colors cursor-pointer flex items-center justify-center gap-1 leading-none ${
                              deleteConfirmId === s.id && deleteConfirmType === "scheme"
                                ? "bg-red-600 text-[#FFF] text-[10px] font-black px-2 py-1"
                                : "text-red-500 hover:text-red-700 hover:bg-red-50"
                            }`}
                            title={deleteConfirmId === s.id && deleteConfirmType === "scheme" ? "নিশ্চিত করতে পুনরায় ক্লিক করুন" : "মুছে ফেলুন"}
                          >
                            {deleteConfirmId === s.id && deleteConfirmType === "scheme" ? (
                              "নিশ্চিত?"
                            ) : (
                              <Trash className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          </div>
        )}

        {/* TAB 3: JOBS MANAGE */}
        {activeTab === "jobs" && (
          <div className="space-y-6">
            <form onSubmit={handleJobSubmit} className="bg-slate-50 p-5 rounded-xl border border-slate-100 space-y-4">
              <h3 className="font-bold text-slate-800 flex items-center gap-1.5 text-sm md:text-base">
                <PlusCircle className="h-4.5 w-4.5 text-bengali-orange" />
                {editingJobId ? "চাকরির বিজ্ঞপ্তিটি পরিবর্তন করুন" : "নতুন সরকারি/বেসরকারি চাকরির বিজ্ঞপ্তি পাবলিশ করুন"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">পদের টাইটেল বা বর্ণনা *</label>
                  <input
                    type="text"
                    required
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="যেমন: ওয়েস্ট বেঙ্গল কনস্টেবল রিক্রুটমেন্ট ২০২৬"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/10 focus:border-bengali-orange"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">চাকরির বোর্ড/ক্যাটাগরি *</label>
                  <select
                    value={jobCategory}
                    onChange={(e) => setJobCategory(e.target.value as any)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/10"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label} ({c.id})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">মোট শূন্যপদ *</label>
                  <input
                    type="text"
                    required
                    value={jobVacancy}
                    onChange={(e) => setJobVacancy(e.target.value)}
                    placeholder="যেমন: ৩,৫০০ টি সিট"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/10"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">শিক্ষাগত যোগ্যতা</label>
                  <input
                    type="text"
                    value={jobQual}
                    onChange={(e) => setJobQual(e.target.value)}
                    placeholder="যেমন: ১০ম / ১২ম পাস"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/10"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">লোগো লিঙ্ক (URL - লোগো পরিবর্তন করতে)</label>
                  <input
                    type="text"
                    value={jobLogoUrl}
                    onChange={(e) => setJobLogoUrl(e.target.value)}
                    placeholder="https://example.com/logo.png"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/10 focus:border-bengali-orange"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">আবেদনের শেষ তারিখ (যেমন: ২০২৬-০৮-১৫)</label>
                  <input
                    type="date"
                    value={jobLastDate}
                    onChange={(e) => setJobLastDate(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/10"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">বেতন বা ভাতা (গ্রস স্কিল)</label>
                  <input
                    type="text"
                    value={jobSalary}
                    onChange={(e) => setJobSalary(e.target.value)}
                    placeholder="যেমন: ₹২২,৭০০ - ₹৫৮,৫০০ প্রতি মাসে"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/10"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">অফিশিয়াল আবেদনের লিংক (URL)</label>
                  <input
                    type="text"
                    value={jobUrl}
                    onChange={(e) => setJobUrl(e.target.value)}
                    placeholder="যেমন: https://prb.wb.gov.in"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/10"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-bengali-orange border border-orange-600 font-extrabold text-[#FFF] text-xs py-2 px-6 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-55 cursor-pointer"
                >
                  {isSubmitting ? "সংরক্ষিত হচ্ছে..." : editingJobId ? "চাকরি বিজ্ঞপ্তি নিশ্চিত সংরক্ষণ" : "চাকরির বিজ্ঞপ্তি প্রকাশ করুন"}
                </button>
                {editingJobId && (
                  <button
                    type="button"
                    onClick={cancelJobEdit}
                    className="bg-slate-350 hover:bg-slate-400 text-slate-900 border border-slate-300 font-bold text-xs py-2 px-4 rounded-lg transition-colors cursor-pointer"
                  >
                    বাতিল
                  </button>
                )}
              </div>
            </form>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto scrollbar-none">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 text-xs uppercase font-bold border-b border-slate-200">
                      <th className="px-4 py-3">লোগো</th>
                      <th className="px-4 py-3">বিজ্ঞপ্তির বিবরণ</th>
                      <th className="px-4 py-3">শূন্যপদ</th>
                      <th className="px-4 py-3">শেষ তারিখ</th>
                      <th className="px-4 py-3 text-right">অ্যাকশন</th>
                    </tr>
                  </thead>
                <tbody className="divide-y divide-slate-150 text-xs text-slate-800">
                  {jobs.map((j) => (
                    <tr key={j.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        {j.logoUrl ? (
                          <img src={j.logoUrl} className="w-8 h-8 rounded-lg object-cover border border-slate-200 overflow-hidden" referrerPolicy="no-referrer" alt="" />
                        ) : (
                          <span className="text-[10px] text-slate-400 font-semibold uppercase font-mono">Default SVG</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-900">{j.title}</div>
                        <div className="text-[10.5px] text-slate-450 font-semibold mt-0.5">{j.categoryName}</div>
                      </td>
                      <td className="px-4 py-3 font-bold text-slate-700">{j.vacancy}</td>
                      <td className="px-4 py-3 text-xs font-bold text-red-600">{j.lastDate}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => startEditJob(j)}
                            className="text-indigo-600 hover:text-indigo-800 p-1.5 rounded hover:bg-indigo-50 transition-colors cursor-pointer"
                            title="এডিট করুন"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (deleteConfirmId === j.id && deleteConfirmType === "job") {
                                onDeleteJob(j.id);
                                showNotification("চাকরির খবরটি ডিলিট করা হয়েছে!");
                                setDeleteConfirmId(null);
                                setDeleteConfirmType(null);
                              } else {
                                setDeleteConfirmId(j.id);
                                setDeleteConfirmType("job");
                                setTimeout(() => {
                                  setDeleteConfirmId(null);
                                  setDeleteConfirmType(null);
                                }, 5000);
                              }
                            }}
                            className={`p-1.5 rounded transition-colors cursor-pointer flex items-center justify-center gap-1 leading-none ${
                              deleteConfirmId === j.id && deleteConfirmType === "job"
                                ? "bg-red-600 text-[#FFF] text-[10px] font-black px-2 py-1"
                                : "text-red-500 hover:text-red-700 hover:bg-red-50"
                            }`}
                            title={deleteConfirmId === j.id && deleteConfirmType === "job" ? "নিশ্চিত করতে পুনরায় ক্লিক করুন" : "মুছে ফেলুন"}
                          >
                            {deleteConfirmId === j.id && deleteConfirmType === "job" ? (
                              "নিশ্চিত?"
                            ) : (
                              <Trash className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          </div>
        )}

        {/* TAB 4: SCHOLARSHIPS MANAGE */}
        {activeTab === "scholarships" && (
          <div className="space-y-6">
            <form onSubmit={handleScholarshipSubmit} className="bg-slate-50 p-5 rounded-xl border border-slate-100 space-y-4">
              <h3 className="font-bold text-slate-800 flex items-center gap-1.5 text-sm md:text-base">
                <PlusCircle className="h-4.5 w-4.5 text-bengali-orange" />
                {editingScholarshipId ? "স্কলারশিপ বিবরণী সংশোধন করুন" : "নতুন মেধাবী স্কলারশিপ বা সহায়তা প্রকল্প যোগ করুন"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">স্কলারশিপ বা বৃত্তির নাম *</label>
                  <input
                    type="text"
                    required
                    value={scholarshipTitle}
                    onChange={(e) => setScholarshipTitle(e.target.value)}
                    placeholder="যেমন: স্বামী বিবেকানন্দ স্কলারশিপ পোর্টাল"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/10 focus:border-bengali-orange"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">সহায়তা পরিমাণ / বাৎসরিক স্কলারশিপ রাশি *</label>
                  <input
                    type="text"
                    required
                    value={scholarshipAmount}
                    onChange={(e) => setScholarshipAmount(e.target.value)}
                    placeholder="যেমন: বাৎসরিক ১২,০০০ টাকা থেকে ৯৬,০০০ টাকা"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/10 focus:border-bengali-orange"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-slate-600 block mb-1">স্কলারশিপের সংক্ষিপ্ত বিবরণী *</label>
                  <input
                    type="text"
                    required
                    value={scholarshipDescription}
                    onChange={(e) => setScholarshipDescription(e.target.value)}
                    placeholder="মেধাবী শিক্ষার্থীদের জন্য পশ্চিমবঙ্গ উচ্চশিক্ষা দপ্তরের বিশেষ আর্থিক সহায়তা যোজনা..."
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/10 focus:border-bengali-orange"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">লোগো ছবি (URL - পরিবর্তন করার জন্য)</label>
                  <input
                    type="text"
                    value={scholarshipLogoUrl}
                    onChange={(e) => setScholarshipLogoUrl(e.target.value)}
                    placeholder="https://example.com/logo.png"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-slate-600 block mb-1">আবশ্যিক যোগ্যতা বা মার্কস বিবরণী *</label>
                  <input
                    type="text"
                    value={scholarshipEligibility}
                    onChange={(e) => setScholarshipEligibility(e.target.value)}
                    placeholder="যেমন: সর্বশেষ পরীক্ষায় ৬০% নম্বর সহ পশ্চিমবঙ্গের স্থায়ী বাসিন্দা।"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/10"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">আবেদনের শেষ তারিখ</label>
                  <input
                    type="text"
                    value={scholarshipLastDate}
                    onChange={(e) => setScholarshipLastDate(e.target.value)}
                    placeholder="যেমন: ২০২৬-১০-১৫ বা রানিং পিরিয়ড"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/10"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">অফিশিয়াল পোর্টাল আবেদন লিংক (URL)</label>
                <input
                  type="text"
                  value={scholarshipUrl}
                  onChange={(e) => setScholarshipUrl(e.target.value)}
                  placeholder="https://svmcm.wbhed.gov.in/"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/10"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-bengali-orange border border-orange-600 font-extrabold text-[#FFF] text-xs py-2 px-6 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-55 cursor-pointer"
                >
                  {isSubmitting ? "সংরক্ষিত হচ্ছে..." : editingScholarshipId ? "স্কলারশিপ আপডেট সংরক্ষণ" : "বৃত্তি প্রকাশ করুন"}
                </button>
                {editingScholarshipId && (
                  <button
                    type="button"
                    onClick={cancelScholarshipEdit}
                    className="bg-slate-350 hover:bg-slate-400 text-slate-900 border border-slate-300 font-bold text-xs py-2 px-4 rounded-lg transition-colors cursor-pointer"
                  >
                    বাতিল
                  </button>
                )}
              </div>
            </form>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto scrollbar-none">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 text-xs uppercase font-bold border-b border-slate-200">
                      <th className="px-4 py-3">লোগো</th>
                      <th className="px-4 py-3">স্কলারশিপ নাম</th>
                      <th className="px-4 py-3">পরিমাণ</th>
                      <th className="px-4 py-3">যোগ্যতা</th>
                      <th className="px-4 py-3">শেষ তারিখ</th>
                      <th className="px-4 py-3 text-right">অ্যাকশন</th>
                    </tr>
                  </thead>
                <tbody className="divide-y divide-slate-150 text-xs text-slate-800">
                  {scholarships.map((sc) => (
                    <tr key={sc.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        {sc.logoUrl ? (
                          <img src={sc.logoUrl} className="w-8 h-8 rounded-lg object-cover border border-slate-200 overflow-hidden" referrerPolicy="no-referrer" alt="" />
                        ) : (
                          <span className="text-[10px] text-slate-400 font-semibold uppercase font-mono">Default SVG</span>
                        )}
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-900">{sc.title}</td>
                      <td className="px-4 py-3 font-semibold text-indigo-700">{sc.amount}</td>
                      <td className="px-4 py-3 text-slate-650 max-w-[200px] truncate">{sc.eligibility}</td>
                      <td className="px-4 py-3 font-bold text-red-600">{sc.lastDate}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => startEditScholarship(sc)}
                            className="text-indigo-600 hover:text-indigo-800 p-1.5 rounded hover:bg-indigo-50 transition-colors cursor-pointer"
                            title="এডিট করুন"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (deleteConfirmId === sc.id && deleteConfirmType === "scholarship") {
                                onDeleteScholarship(sc.id);
                                showNotification("স্কলারশিপ মুছে ফেলা হয়েছে!");
                                setDeleteConfirmId(null);
                                setDeleteConfirmType(null);
                              } else {
                                setDeleteConfirmId(sc.id);
                                setDeleteConfirmType("scholarship");
                                setTimeout(() => {
                                  setDeleteConfirmId(null);
                                  setDeleteConfirmType(null);
                                }, 5000);
                              }
                            }}
                            className={`p-1.5 rounded transition-colors cursor-pointer flex items-center justify-center gap-1 leading-none ${
                              deleteConfirmId === sc.id && deleteConfirmType === "scholarship"
                                ? "bg-red-600 text-[#FFF] text-[10px] font-black px-2 py-1"
                                : "text-red-500 hover:text-red-700 hover:bg-red-50"
                            }`}
                            title={deleteConfirmId === sc.id && deleteConfirmType === "scholarship" ? "নিশ্চিত করতে পুনরায় ক্লিক করুন" : "মুছে ফেলুন"}
                          >
                            {deleteConfirmId === sc.id && deleteConfirmType === "scholarship" ? (
                              "নিশ্চিত?"
                            ) : (
                              <Trash className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          </div>
        )}

        {/* TAB 5: CATEGORIZED DIGITAL SERVICES MANAGE */}
        {["identity", "utility", "health", "land", "cyber_cafe"].includes(activeTab) && (
          <div className="space-y-6">
            <form onSubmit={handleServiceSubmit} className="bg-slate-50 p-5 rounded-xl border border-slate-100 space-y-4">
              <h3 className="font-extrabold text-slate-800 flex items-center gap-1.5 text-sm md:text-base">
                <PlusCircle className="h-4.5 w-4.5 text-bengali-orange animate-bounce" />
                {editingServiceId ? "সিটিজেন ডিজিটাল সার্ভিস বিবরণ সংশোধন করুন" : `নতুন "${
                  activeTab === "identity" ? "পরিচয় ও কার্ড" :
                  activeTab === "utility" ? "শংসাপত্র ও সার্টিফিকেট" :
                  activeTab === "health" ? "হেলথ ও বিমা" :
                  activeTab === "land" ? "জমি ও পরচা" : "সাইবার ক্যাফে"
                }" গাইড বা সরাসরি লিঙ্ক যুক্ত করুন`}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">পরিষেবার টাইটেল বা নাম *</label>
                  <input
                    type="text"
                    required
                    value={serviceTitle}
                    onChange={(e) => setServiceTitle(e.target.value)}
                    placeholder="যেমন: নতুন ভোটার আইডি আবেদন এবং ভোটার কার্ড লিঙ্কিং প্রসেস"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/10 focus:border-bengali-orange"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">সার্ভিস ক্যাটাগরি *</label>
                  <select
                    value={serviceCategory}
                    onChange={(e) => setServiceCategory(e.target.value as any)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/10 focus:border-bengali-orange font-bold text-slate-800"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label} ({c.id})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">পরিষেবার সংক্ষিপ্ত ডেসক্রিপশন *</label>
                  <textarea
                    required
                    value={serviceDescription}
                    onChange={(e) => setServiceDescription(e.target.value)}
                    placeholder="আধার কার্ড ভারতীয় নাগরিকদের প্রধান পরিচয়পত্র। নতুন কার্ড সম্পর্কিত সম্পূর্ণ অনলাইন গাইড এবং সরাসরি লিঙ্ক।"
                    rows={2}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/10 focus:border-bengali-orange"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">অনলাইন আবেদনের প্রধান পদক্ষেপসমূহ (প্রতি লাইনে একটি করে স্টেপ)</label>
                  <textarea
                    value={serviceSteps}
                    onChange={(e) => setServiceSteps(e.target.value)}
                    placeholder="১. ভারতের প্রধান নির্বাচন কমিশনের ওয়েবসাইট ওপেন করুন।&#10;২. ওটিআর ও মোবাইল ওটিপি দিয়ে নিবন্ধন সম্পন্ন করুন।&#10;৩. ফর্ম-৬ নতুন ভোটারের জন্য পূরণ করে আধার প্রমাণ আপলোড করুন।"
                    rows={3}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500/10 focus:border-bengali-orange"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">লোগো ছবি (URL - পরিবর্তন করার জন্য)</label>
                  <input
                    type="text"
                    value={serviceLogoUrl}
                    onChange={(e) => setServiceLogoUrl(e.target.value)}
                    placeholder="https://example.com/logo.png"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/10 focus:border-bengali-orange"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">অফিশিয়াল আবেদনের সরাসরি ওয়েব লিঙ্ক (URL)</label>
                  <input
                    type="text"
                    value={serviceUrl}
                    onChange={(e) => setServiceUrl(e.target.value)}
                    placeholder="https://voters.eci.gov.in"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/10 focus:border-bengali-orange"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-bengali-orange border border-orange-600 font-extrabold text-[#FFF] text-xs py-2 px-6 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-55 cursor-pointer"
                >
                  {isSubmitting ? "সংরক্ষিত হচ্ছে..." : editingServiceId ? "সার্ভিস বিবরণ রিয়েল-টাইম আপডেট" : "ডিজিটাল সার্ভিস যুক্ত করুন"}
                </button>
                {editingServiceId && (
                  <button
                    type="button"
                    onClick={cancelServiceEdit}
                    className="bg-slate-350 hover:bg-slate-400 text-slate-900 border border-slate-300 font-bold text-xs py-2 px-4 rounded-lg transition-colors cursor-pointer"
                  >
                    বাতিল
                  </button>
                )}
              </div>
            </form>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto scrollbar-none">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 text-xs uppercase font-bold border-b border-slate-200">
                      <th className="px-4 py-3">লোগো</th>
                      <th className="px-4 py-3">পরিষেবার নাম ও ডেসক্রিপশন</th>
                      <th className="px-4 py-3">ক্যাটাগরি</th>
                      <th className="px-4 py-3 text-right">অ্যাকশন</th>
                    </tr>
                  </thead>
                <tbody className="divide-y divide-slate-150 text-xs text-slate-800">
                  {services.filter((srv) => {
                    if (activeTab === "identity") return srv.category === "identity" || srv.category === "aadhaar_pan";
                    if (activeTab === "utility") return srv.category === "utility" || srv.category === "certificates";
                    return srv.category === activeTab;
                  }).length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-slate-450 font-bold bg-slate-50/40">
                        এই বিভাগে বর্তমানে কোনো ডিজিটাল পোর্টাল সেবা নেই। উপরোক্ত ফর্মটি ব্যবহার করে নতুন গাইড যুক্ত করুন।
                      </td>
                    </tr>
                  ) : (
                    services
                      .filter((srv) => {
                        if (activeTab === "identity") return srv.category === "identity" || srv.category === "aadhaar_pan";
                        if (activeTab === "utility") return srv.category === "utility" || srv.category === "certificates";
                        return srv.category === activeTab;
                      })
                      .map((srv) => (
                        <tr key={srv.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3">
                            {srv.logoUrl ? (
                              <img src={srv.logoUrl} className="w-8 h-8 rounded-lg object-cover border border-slate-200 overflow-hidden" referrerPolicy="no-referrer" alt="" />
                            ) : (
                              <span className="text-[10px] text-slate-400 font-semibold uppercase font-mono">Default SVG</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <div className="font-semibold text-slate-900">{srv.title}</div>
                            <div className="text-[10.5px] text-slate-450 font-medium truncate max-w-[320px] mt-0.5">{srv.description}</div>
                          </td>
                          <td className="px-4 py-3 font-bold text-slate-800">
                            {
                              {
                                welfare: "সরকারি প্রকল্প",
                                jobs: "সরকারি চাকরি",
                                scholarships: "স্কলারশিপ",
                                identity: "পরিচয় ও কার্ড",
                                utility: "শংসাপত্র",
                                health: "হেলথ ও বিমা",
                                land: "জমি ও পরচা",
                                cyber_cafe: "সাইবার ক্যাফে"
                              }[srv.category] || srv.categoryName || srv.category
                            }
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => startEditService(srv)}
                                className="text-indigo-600 hover:text-indigo-800 p-1.5 rounded hover:bg-indigo-50 transition-colors cursor-pointer"
                                title="এডিট করুন"
                              >
                                <Edit3 className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  if (deleteConfirmId === srv.id && deleteConfirmType === "service") {
                                    onDeleteService(srv.id);
                                    showNotification("ডিজিটাল নাগরিক সেবা বিবরণ টি ডিলিট করা হয়েছে!");
                                    setDeleteConfirmId(null);
                                    setDeleteConfirmType(null);
                                  } else {
                                    setDeleteConfirmId(srv.id);
                                    setDeleteConfirmType("service");
                                    setTimeout(() => {
                                      setDeleteConfirmId(null);
                                      setDeleteConfirmType(null);
                                    }, 5000);
                                  }
                                }}
                                className={`p-1.5 rounded transition-colors cursor-pointer flex items-center justify-center gap-1 leading-none ${
                                  deleteConfirmId === srv.id && deleteConfirmType === "service"
                                    ? "bg-red-600 text-[#FFF] text-[10px] font-black px-2 py-1"
                                    : "text-red-500 hover:text-red-700 hover:bg-red-50"
                                }`}
                                title={deleteConfirmId === srv.id && deleteConfirmType === "service" ? "নিশ্চিত করতে পুনরায় ক্লিক করুন" : "মুছে ফেলুন"}
                              >
                                {deleteConfirmId === srv.id && deleteConfirmType === "service" ? (
                                  "নিশ্চিত?"
                                ) : (
                                  <Trash className="h-3.5 w-3.5" />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          </div>
        )}

        {/* TAB 8: CATEGORIES MANAGEMENT */}
        {activeTab === "categories" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Form Column - 5 cols */}
              <div className="lg:col-span-5 bg-slate-50 p-5 rounded-xl border border-slate-200">
                <h3 className="font-bold text-slate-800 flex items-center gap-1.5 text-sm md:text-base mb-4">
                  <Grid className="h-4 w-4 text-bengali-orange" />
                  {editingCategoryId ? "বিভাগ সংশোধন করুন" : "নতুন বিভাগ যুক্ত করুন"}
                </h3>
                
                <form onSubmit={handleCategorySubmit} className="space-y-4">
                  <div>
                    <label className="text-[11px] font-extrabold text-slate-650 block mb-1">বিভাগ বা ক্যাটাগরি অনন্য ID (যেমন: agri_dept)</label>
                    <input
                      type="text"
                      disabled={!!editingCategoryId}
                      required
                      value={catId}
                      onChange={(e) => setCatId(e.target.value)}
                      placeholder="ইংরেজি শুধুমাত্র অক্ষর ও আন্ডারস্কোর"
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/10 focus:border-bengali-orange disabled:opacity-50 disabled:bg-slate-100"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-extrabold text-[#E96A1F] block mb-1">বাংলা প্রদর্শনীর নাম (যেমন: কৃষি কল্যাণ দপ্তর)</label>
                    <input
                      type="text"
                      required
                      value={catLabel}
                      onChange={(e) => setCatLabel(e.target.value)}
                      placeholder="যেমন: কৃষক ও কৃষি কল্যাণ"
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/10 focus:border-bengali-orange"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-extrabold text-slate-650 block mb-1">প্রদর্শনীর সংক্ষিপ্ত বর্ণনা (যেমন: খতিয়ান, খাজনা ও সেবা)</label>
                    <input
                      type="text"
                      required
                      value={catDesc}
                      onChange={(e) => setCatDesc(e.target.value)}
                      placeholder="যেমন: সার, বীজ ও বিমা সুবিধা"
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/10 focus:border-bengali-orange"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-extrabold text-slate-650 block mb-1">বিভাগীয় আইকন নির্বাচন (Icon)</label>
                    <select
                      value={catIconName}
                      onChange={(e) => setCatIconName(e.target.value)}
                      className="w-full rounded-lg border border-slate-201 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/10 focus:border-bengali-orange"
                    >
                      <option value="Award">Award (পুরস্কার/প্রকল্প)</option>
                      <option value="Briefcase">Briefcase (উপকরণ/চাকরি)</option>
                      <option value="GraduationCap">GraduationCap (শিক্ষা/স্কলারশিপ)</option>
                      <option value="IdCard">IdCard (কার্ড/পরিচয়)</option>
                      <option value="FileText">FileText (নথিপত্র/শংসাপত্র)</option>
                      <option value="HeartPulse">HeartPulse (স্বাস্থ্য/বিমা)</option>
                      <option value="MapPin">MapPin (ঠিকানা/জমি পরচা)</option>
                      <option value="Laptop">Laptop (কম্পিউটার/সাইবার ক্যাফে)</option>
                      <option value="Globe">Globe (ইন্টারনেট/অন্যান্য)</option>
                      <option value="Layers">Layers (অন্যান্য সেবা)</option>
                      <option value="Bell">Bell (বিজ্ঞপ্তি)</option>
                    </select>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-bengali-orange hover:bg-orange-600 text-white font-extrabold py-2 px-4 rounded-lg text-xs tracking-wide transition-all shadow-sm flex items-center justify-center gap-1 cursor-pointer border border-orange-600"
                    >
                      <Check className="h-3.5 w-3.5" />
                      {isSubmitting ? "সংরক্ষিত হচ্ছে..." : editingCategoryId ? "তথ্য আপডেট করুন" : "বিভাগ যুক্ত করুন"}
                    </button>
                    {editingCategoryId && (
                      <button
                        type="button"
                        onClick={cancelCategoryEdit}
                        className="px-3 bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 font-bold rounded-lg text-xs cursor-pointer"
                      >
                        বাতিল
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Display Column - 7 cols */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-700 text-xs">সক্রিয় বিভাগসমূহের বিবরণ তালিকা ({categories.length} টি)</h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-1">
                  {categories.map((cat) => {
                    const isDeletingConfirm = deleteConfirmType === "category" && deleteConfirmId === cat.id;
                    return (
                      <div key={cat.id} className="bg-white border border-slate-155 rounded-xl p-4 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="p-2 rounded-lg bg-orange-50 text-bengali-orange">
                              {cat.iconName === "Award" && <Award className="h-4 w-4 text-orange-600" />}
                              {cat.iconName === "Briefcase" && <Briefcase className="h-4 w-4 text-orange-600" />}
                              {cat.iconName === "GraduationCap" && <GraduationCap className="h-4 w-4 text-orange-600" />}
                              {cat.iconName === "IdCard" && <IdCard className="h-4 w-4 text-orange-600" />}
                              {cat.iconName === "FileText" && <FileText className="h-4 w-4 text-orange-600" />}
                              {cat.iconName === "HeartPulse" && <HeartPulse className="h-4 w-4 text-orange-600" />}
                              {cat.iconName === "MapPin" && <MapPin className="h-4 w-4 text-orange-600" />}
                              {cat.iconName === "Laptop" && <Laptop className="h-4 w-4 text-orange-600" />}
                              {cat.iconName === "Globe" && <Globe className="h-4 w-4 text-orange-600" />}
                              {cat.iconName === "Layers" && <Layers className="h-4 w-4 text-orange-600" />}
                              {cat.iconName === "Bell" && <Bell className="h-4 w-4 text-orange-600" />}
                            </div>
                            <div>
                              <h5 className="font-extrabold text-xs text-slate-800 leading-tight">{cat.label}</h5>
                              <span className="text-[10px] font-mono text-slate-400 font-bold">ID: {cat.id}</span>
                            </div>
                          </div>
                          <p className="text-[11px] text-slate-500 font-semibold mb-3 leading-relaxed">{cat.desc}</p>
                        </div>

                        <div className="flex items-center justify-end gap-2 border-t border-slate-50 pt-2.5">
                          <button
                            onClick={() => {
                              setEditingCategoryId(cat.id);
                              setCatId(cat.id);
                              setCatLabel(cat.label);
                              setCatDesc(cat.desc);
                              setCatIconName(cat.iconName);
                            }}
                            className="p-1 px-2 border border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-100 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all"
                          >
                            <Edit3 className="h-3 w-3" />
                            সংশোধন
                          </button>

                          {isDeletingConfirm ? (
                            <button
                              onClick={async () => {
                                try {
                                  await onDeleteCategory(cat.id);
                                  showNotification("বিভাগটি সফলভাবে মুছে ফেলা হয়েছে!");
                                  setDeleteConfirmId(null);
                                  setDeleteConfirmType(null);
                                } catch (err) {
                                  showNotification("মুছে ফেলা সম্ভব হয়নি।");
                                }
                              }}
                              className="px-2 py-1 bg-red-600 border border-red-700 text-white rounded-lg text-[10px] font-black animate-pulse cursor-pointer"
                            >
                              নিশ্চিত মুছুন?
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setDeleteConfirmId(cat.id);
                                setDeleteConfirmType("category");
                                setTimeout(() => {
                                  setDeleteConfirmId(null);
                                  setDeleteConfirmType(null);
                                }, 3500);
                              }}
                              className="p-1 px-2 border border-slate-200 text-slate-450 hover:text-red-500 hover:bg-red-50 hover:border-red-100 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all"
                            >
                              <Trash className="h-3 w-3" />
                              মুছুন
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 9: AI SETTINGS PLAN */}
        {activeTab === "settings" && (
          <div className="space-y-6 max-w-4xl">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8 space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-sm md:text-base font-extrabold text-slate-800 flex items-center gap-2">
                  <Settings className="h-5 w-5 text-bengali-orange animate-spin-slow" />
                  এআই সিস্টেম কনফিগারেশন ও সেটিংস (AI Configuration)
                </h3>
                <p className="text-[11px] text-slate-500 font-medium mt-1">
                  এখানে আপনার Gemini (কৃত্তিম বুদ্ধিমত্তা) এপিআই কী সেট করুন যাতে চ্যাট হেল্পার সর্বদা সঠিক রিয়েল-টাইম উত্তর দিতে পারে।
                </p>
              </div>

              <div className="bg-amber-50/50 border border-amber-100/70 rounded-xl p-4 text-xs text-amber-900 space-y-2">
                <h4 className="font-extrabold flex items-center gap-1.5 text-amber-800">
                  <AlertCircle className="h-4 w-4 text-bengali-orange shrink-0" />
                  কেন কৃত্তিম বুদ্ধিমত্তা এপিআই কি প্রয়োজন?
                </h4>
                <p className="leading-relaxed font-semibold text-slate-650">
                  আপনার কাস্টম বা নিজস্ব Gemini API Key ব্যবহার করলে বাংলার সেবা পোর্টালের সহকারী চ্যাটবট অ্যাক্টিভ হবে। এর ফলে সরকারি ক্যাটাগরি, সুবিধা, এবং সাধারণ প্রশ্নোত্তর যেকোনো নাগরিক সম্পূর্ণ রিয়েল-টাইম লাইভ বাংলায় জানতে পারবেন।
                </p>
              </div>

              <form onSubmit={async (e) => {
                e.preventDefault();
                setIsSubmitting(true);
                try {
                  const success = await onSaveSettings({ geminiApiKey: apiKeyInput });
                  if (success) {
                    showNotification("এআই সিস্টেম সেটিংস সফলভাবে সংরক্ষণ করা হয়েছে!");
                  } else {
                    showNotification("সেটিংস সেভ করতে ব্যর্থ হয়েছে।");
                  }
                } catch (err) {
                  showNotification("সার্ভার ত্রুটি ঘটেছে।");
                } finally {
                  setIsSubmitting(false);
                }
              }} className="space-y-5">
                <div>
                  <label className="text-[11px] font-extrabold text-slate-700 block mb-2">Gemini API Key (সহায়তা চ্যাট জন্য)</label>
                  <div className="relative rounded-lg shadow-sm">
                    <input
                      type={showApiKey ? "text" : "password"}
                      value={apiKeyInput}
                      onChange={(e) => setApiKeyInput(e.target.value)}
                      placeholder="AIZAsy..."
                      className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-orange-500/10 focus:border-bengali-orange pr-20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="absolute inset-y-0 right-0 px-3 flex items-center text-xs font-bold text-slate-500 hover:text-slate-700 cursor-pointer"
                    >
                      {showApiKey ? "লুকান" : "দেখুন"}
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1.5 font-semibold">
                    * আপনার কাস্টম API কি ডাটাবেসে রিয়েল-টাইমে ও সুরক্ষিতভাবে পিং হবে। এটি বাংলায় উত্তর দেওয়ার জন্য Google Gemini SDK (gemini-3.5-flash) দ্বারা ব্যবহৃত হয়।
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between border-t border-slate-100 pt-5">
                  <div className="text-xs font-bold flex items-center gap-1.5">
                    <span className="text-slate-500">বর্তমান অবস্থা:</span>
                    {settings?.geminiApiKey ? (
                      <span className="text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border border-emerald-100 flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                        সক্রিয় ও কনফিগারড্ (Configured)
                      </span>
                    ) : (
                      <span className="text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                        অসংরক্ষিত (Not Set)
                      </span>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-bengali-orange hover:bg-orange-650 text-white font-extrabold py-2 px-5 rounded-lg text-xs tracking-wider transition-all shadow-sm flex items-center gap-1.5 cursor-pointer border border-orange-600/50 disabled:opacity-50"
                  >
                    <Check className="h-3.5 w-3.5" />
                    {isSubmitting ? "সংরক্ষণ করা হচ্ছে..." : "সেটিংস সংরক্ষণ করুন (Save)"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
