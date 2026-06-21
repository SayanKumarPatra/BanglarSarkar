import React, { useState, useRef } from "react";
import { Scheme, Job, Scholarship, ServiceItem, AppUpdate, CategoryItem, Suggestion } from "../data";
import { 
  Plus, 
  Trash, 
  Trash2,
  Zap,
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
  ChevronRight,
  MessageSquare
} from "lucide-react";

const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 1200;
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.75);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error("Image load error"));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("File read error"));
    reader.readAsDataURL(file);
  });
};

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
  settings: { geminiApiKey: string; heroBannerUrl?: string };
  onSaveSettings: (newSettings: { geminiApiKey: string; heroBannerUrl?: string }) => Promise<boolean>;
  suggestions?: Suggestion[];
  onSaveSuggestion?: (suggestion: Suggestion) => Promise<void>;
  onDeleteSuggestion?: (id: string) => Promise<void>;
}

const getCategoryIcon = (iconName?: string) => {
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
    case "Layers": return Layers;
    case "Bell": return Bell;
    case "FileCheck": return FileCheck;
    default: return Grid;
  }
};

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
  onSaveSettings,
  suggestions = [],
  onSaveSuggestion = async () => {},
  onDeleteSuggestion = async () => {}
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<string>("analytics");
  const [notificationMsg, setNotificationMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // A.I. & Appearance Settings states
  const [apiKeyInput, setApiKeyInput] = useState(settings?.geminiApiKey || "");
  const [showApiKey, setShowApiKey] = useState(false);
  const [heroBannerUrlInput, setHeroBannerUrlInput] = useState(settings?.heroBannerUrl || "");
  const [isUploading, setIsUploading] = useState(false);

  React.useEffect(() => {
    if (settings) {
      setApiKeyInput(settings.geminiApiKey || "");
      setHeroBannerUrlInput(settings.heroBannerUrl || "");
    }
  }, [settings]);

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

  // Service SubLinks state
  const [serviceSubLinks, setServiceSubLinks] = useState<{ label: string; url: string; desc: string }[]>([]);
  const [newSubLinkLabel, setNewSubLinkLabel] = useState("");
  const [newSubLinkUrl, setNewSubLinkUrl] = useState("");
  const [newSubLinkDesc, setNewSubLinkDesc] = useState("");
  const [editingSubLinkIndex, setEditingSubLinkIndex] = useState<number | null>(null);

  const getLocalDefaultSubLinks = (id: string, officialUrl: string) => {
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
            label: "কাস্ট সার্টিফিকেট স্ট্যাটাস জানুন (Track Caste App)",
            url: "http://casterepresentationwb.gov.in/track_application",
            desc: "SC / ST / OBC আবেদনের রিসিভ নম্বর দিয়ে যাচাই করুন"
          },
          {
            label: "কাস্ট সার্টিফিকেট ডিটেইলস ভেরিফিকেশন (Verify Caste Card)",
            url: "http://casterepresentationwb.gov.in/view_certificate",
            desc: "অনুমোদিত সার্টিফিকেটের সত্যতা ও রেজিস্টার নম্বর মিলিয়ে নিন"
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
            label: "মৃত্যু শংসাপত্র স্ট্যাটাস খোঁজ (Track Death Application)",
            url: "https://janma-mrityutathya.wb.gov.in/index.php/citizens/track-application",
            desc: "Ack/রেজিস্ট্রেশন নম্বর দিয়ে বর্তমান অবস্থা যাচাই করুন"
          },
          {
            label: "ডিজিটাল মৃত্যু শংসাপত্র ডাউনলোড (Download e-Death Certificate)",
            url: "https://janma-mrityutathya.wb.gov.in/index.php/citizens/download-certificate",
            desc: "অনলাইনে ডিজিটালি ভেরিফায়েড ডেথ সার্টিফিকেট ডাউনলোড"
          }
        ];
      case "srv6": // PAN Aadhaar Link
        return [
          {
            label: "লিঙ্ক করার সরাসরি লিঙ্ক (Link Aadhaar with PAN)",
            url: "https://eportal.incometax.gov.in/iec/foservices/#/pre-login/link-aadhaar",
            desc: "প্যান কার্ডের সাথে আধার লিঙ্কিং অনলাইন পোর্টাল"
          },
          {
            label: "লিঙ্ক স্ট্যাটাস যাচাই (Check Link Status)",
            url: "https://eportal.incometax.gov.in/iec/foservices/#/pre-login/link-aadhaar-status",
            desc: "আপনার কার্ড দুটি যুক্ত সফল হয়েছে কি না তা দেখুন"
          }
        ];
      case "srv9": // Passport
        return [
          {
            label: "পাসপোর্ট ফাইল স্ট্যাটাস ট্র্যাকিং (Track Passport Status)",
            url: "https://portal2.passportindia.gov.in/AppOnlineProject/statusTracker/trackStatusInpNew",
            desc: "ফাইল নাম্বার ও জন্মতারিখ দিয়ে আবেদনের স্থিতি জানুন"
          },
          {
            label: "অফিস স্লট উপলব্ধতা চেক (Check Appointment Availability)",
            url: "https://portal2.passportindia.gov.in/AppOnlineProject/online/appointmentAvailState",
            desc: "নিকটবর্তী পাসপোর্ট অফিসে কয়টি স্লট ফাঁকা আছে দেখে নিন"
          }
        ];
      case "srv10": // Driving License
        return [
          {
            label: "লাইসেন্স আবেদনের সরাসরি ট্র্যাকিং (Link Sarathi Application)",
            url: "https://sarathi.parivahan.gov.in/sarathiservice/applViewStatus.do",
            desc: "আবেদন নম্বর এবং জন্মতারিখ দিয়ে স্ট্যাটাস ট্র্যাকিং করুন"
          },
          {
            label: "লার্নার টেস্ট অনলাইন মক প্র্যাক্টিস (LL Road Safety Test)",
            url: "https://sarathi.parivahan.gov.in/sarathiservice/mockTestInp.do",
            desc: "লার্নার স্ক্রিনিং টেস্টের জন্য বিনামূল্যে মক প্রশ্ন প্র্যাকটিস"
          }
        ];
      default:
        return [
          {
            label: "সরাসরি অফিসিয়াল পোর্টাল লিংক (Official Direct Link)",
            url: officialUrl,
            desc: "অফিসিয়াল ওয়েবসাইটে প্রবেশ করে আবেদন বা অনুসন্ধান করুন"
          }
        ];
    }
  };

  const startEditSubLink = (idx: number) => {
    const link = serviceSubLinks[idx];
    if (link) {
      setNewSubLinkLabel(link.label);
      setNewSubLinkUrl(link.url);
      setNewSubLinkDesc(link.desc || "");
      setEditingSubLinkIndex(idx);
    }
  };

  const cancelEditSubLink = () => {
    setNewSubLinkLabel("");
    setNewSubLinkUrl("");
    setNewSubLinkDesc("");
    setEditingSubLinkIndex(null);
  };

  const handleAddSubLink = () => {
    if (!newSubLinkLabel.trim() || !newSubLinkUrl.trim()) {
      showNotification("লিঙ্কের নাম এবং ওয়েব অ্যাড্রেস (URL) দিতে হবে!");
      return;
    }
    const item = {
      label: newSubLinkLabel.trim(),
      url: newSubLinkUrl.trim(),
      desc: newSubLinkDesc.trim()
    };

    if (editingSubLinkIndex !== null) {
      setServiceSubLinks(prev => prev.map((link, idx) => idx === editingSubLinkIndex ? item : link));
      setEditingSubLinkIndex(null);
      showNotification("সরাসরি লিঙ্কটি সফলভাবে সংশোধন করা হয়েছে!");
    } else {
      setServiceSubLinks(prev => [
        ...prev,
        item
      ]);
      showNotification("সরাসরি লিঙ্কটি যোগ করা হয়েছে!");
    }
    setNewSubLinkLabel("");
    setNewSubLinkUrl("");
    setNewSubLinkDesc("");
  };

  const handleRemoveSubLink = (idx: number) => {
    setServiceSubLinks(prev => prev.filter((_, i) => i !== idx));
    if (editingSubLinkIndex === idx) {
      cancelEditSubLink();
    } else if (editingSubLinkIndex !== null && editingSubLinkIndex > idx) {
      setEditingSubLinkIndex(prev => prev !== null ? prev - 1 : null);
    }
  };

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
    
    // Seed defaults if subLinks are empty/null to make editing super friendly:
    const defaults = getLocalDefaultSubLinks(item.id, item.officialUrl || "https://wb.gov.in");
    setServiceSubLinks(item.subLinks && item.subLinks.length > 0 ? item.subLinks : defaults);
    
    setNewSubLinkLabel("");
    setNewSubLinkUrl("");
    setNewSubLinkDesc("");
    setEditingSubLinkIndex(null);

    window.scrollTo({ top: 320, behavior: "smooth" });
  };

  const cancelServiceEdit = () => {
    setEditingServiceId(null);
    setServiceTitle("");
    setServiceDescription("");
    setServiceSteps("");
    setServiceUrl("");
    setServiceLogoUrl("");
    setServiceSubLinks([]);
    setNewSubLinkLabel("");
    setNewSubLinkUrl("");
    setNewSubLinkDesc("");
    setEditingSubLinkIndex(null);
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
      logoUrl: serviceLogoUrl || "",
      subLinks: serviceSubLinks
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

  const serviceTabIds = categories
    .filter((c) => c && c.id && c.id !== "welfare" && c.id !== "jobs" && c.id !== "scholarships")
    .map((c) => c.id);

  const tabItems = [
    { id: "analytics", label: "সার্বিক অ্যানালিটিক্স", icon: PieChart, count: null },
    
    // Include schemes/welfare if welfare is in categories
    ...(categories.some((c) => c && c.id === "welfare")
      ? [{ id: "welfare", label: "সরকারি প্রকল্প", icon: Layers, count: schemes.length }]
      : []),

    // Include jobs if jobs is in categories
    ...(categories.some((c) => c && c.id === "jobs")
      ? [{ id: "jobs", label: "সরকারি চাকরি", icon: Briefcase, count: jobs.length }]
      : []),

    // Include scholarships if scholarships is in categories
    ...(categories.some((c) => c && c.id === "scholarships")
      ? [{ id: "scholarships", label: "স্কলারশিপ", icon: GraduationCap, count: scholarships.length }]
      : []),

    // Dynamic digital service categories
    ...categories
      .filter((c) => c && c.id && c.id !== "welfare" && c.id !== "jobs" && c.id !== "scholarships")
      .map((c) => {
        let count = 0;
        if (c.id === "identity") {
          count = services.filter((s) => s.category === "identity" || s.category === "aadhaar_pan").length;
        } else if (c.id === "utility") {
          count = services.filter((s) => s.category === "utility" || s.category === "certificates").length;
        } else {
          count = services.filter((s) => s.category === c.id).length;
        }
        return {
          id: c.id,
          label: c.label || "ডিজিটাল সেবা",
          icon: getCategoryIcon(c.iconName),
          count: count
        };
      }),

    { id: "categories", label: "বিভাগ পরিচালনা", icon: Grid, count: categories.length },
    { id: "suggestions", label: "সাজেশন ও অভিযোগ", icon: MessageSquare, count: suggestions.length },
    { id: "settings", label: "ব্যানার পরিবর্তন সেটিংস", icon: Settings, count: null }
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xl" id="admin-panel-component">
      {/* Admin Title */}
      <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-tr from-bengali-orange to-amber-500 rounded-xl shadow-md">
            <Settings className="h-5 w-5 text-white animate-spin-slow" />
          </div>
          <div>
            <h2 className="font-extrabold text-base md:text-lg text-white font-sans tracking-wide">অ্যাডমিন কন্ট্রোল পোর্টাল</h2>
            <p className="text-[11px] text-slate-400 font-medium">রিয়েল-টাইম লাইভ ফায়ারবেস ডেটাবেস সিঙ্ক্রোনাইজেশন প্যানেল</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-xs px-4 py-2 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-xl text-slate-300 transition-colors font-bold cursor-pointer border border-slate-700/60"
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

      {/* Main Responsive Split Layout */}
      <div className="flex flex-col md:flex-row min-h-[680px]">
        
        {/* Adaptive Sidebar Controller */}
        <aside className="w-full md:w-[270px] shrink-0 bg-[#F8FAFC] border-b md:border-b-0 md:border-r border-slate-205 flex flex-col justify-between font-sans">
          
          {/* MOBILE TABS MENU */}
          <div className="block md:hidden p-4 border-b border-slate-200 bg-white">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2 font-sans">
              অ্যাডমিন সেকশন নেভিগেশন (পছন্দ করুন)
            </label>
            <div className="relative">
              <select
                value={activeTab}
                onChange={(e) => {
                  const val = e.target.value as any;
                  setActiveTab(val);
                  cancelSchemeEdit();
                  cancelJobEdit();
                  cancelScholarshipEdit();
                  cancelServiceEdit();
                  cancelCategoryEdit();
                  if (serviceTabIds.includes(val)) {
                    setServiceCategory(val as any);
                  }
                }}
                className="w-full px-4 py-3 text-xs font-black bg-slate-900 border border-slate-800 text-white rounded-xl outline-none focus:ring-2 focus:ring-bengali-orange cursor-pointer appearance-none shadow-sm font-sans"
              >
                {tabItems.map((tab) => (
                  <option key={tab.id} value={tab.id} className="text-slate-800 bg-white font-semibold">
                    {tab.label} {tab.count !== null ? `(${tab.count})` : ""}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-white">
                <ChevronRight className="h-4 w-4 rotate-90" />
              </div>
            </div>

            {/* Sliding Pillbar on Mobile */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none mt-3 pb-1">
              {tabItems.map((tab) => {
                const IconComponent = tab.icon;
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id as any);
                      cancelSchemeEdit();
                      cancelJobEdit();
                      cancelScholarshipEdit();
                      cancelServiceEdit();
                      cancelCategoryEdit();
                      if (serviceTabIds.includes(tab.id)) {
                        setServiceCategory(tab.id as any);
                      }
                    }}
                    className={`flex items-center gap-1.5 shrink-0 px-3.5 py-1.8 rounded-full text-[11px] font-black tracking-wide border transition-all cursor-pointer shadow-xs ${
                      isSelected
                        ? "bg-bengali-orange border-orange-600 text-white font-black"
                        : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                    }`}
                  >
                    <IconComponent className="h-3.5 w-3.5" />
                    <span>{tab.label}</span>
                    {tab.count !== null && (
                      <span className={`text-[9.5px] px-1.5 py-0.2 rounded-full font-bold font-mono ${
                        isSelected ? "bg-white/20 text-white" : "bg-slate-200 text-slate-605"
                      }`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* DESKTOP SIDEBAR MENU */}
          <div className="hidden md:flex flex-col flex-1 p-5 space-y-1.5">
            <div className="px-3.5 pb-2 text-[10px] font-black text-slate-400 uppercase tracking-widest font-sans">
              ম্যানেজমেন্ট ক্যাটাগরি
            </div>
            
            <div className="space-y-1">
              {tabItems.map((tab) => {
                const IconComponent = tab.icon;
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id as any);
                      cancelSchemeEdit();
                      cancelJobEdit();
                      cancelScholarshipEdit();
                      cancelServiceEdit();
                      cancelCategoryEdit();
                      if (serviceTabIds.includes(tab.id)) {
                        setServiceCategory(tab.id as any);
                      }
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-xs font-black transition-all duration-155 cursor-pointer group border ${
                      isSelected
                        ? "bg-gradient-to-r from-orange-500 to-amber-550 border-orange-500 text-white shadow-md shadow-orange-500/10 hover:shadow-lg hover:shadow-orange-500/15"
                        : "bg-transparent text-slate-705 hover:text-slate-905 hover:bg-slate-100 border-transparent hover:border-slate-200/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <IconComponent className={`h-4.5 w-4.5 shrink-0 transition-colors ${
                        isSelected ? "text-white" : "text-slate-405 group-hover:text-slate-600"
                      }`} />
                      <span className="font-sans text-xs translate-y-[-0.5px] leading-none shrink-0 truncate max-w-[140px]">{tab.label}</span>
                    </div>
                    {tab.count !== null && (
                      <span className={`text-[10px] font-extrabold font-mono px-2 py-0.5 rounded-md ${
                        isSelected ? "bg-white/25 text-white" : "bg-slate-200 text-slate-600"
                      }`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* DESKTOP SIDEBAR FOOTER METRICS */}
          <div className="hidden md:block p-5 border-t border-slate-200/60 bg-[#F1F5F9]/40 mt-auto">
            <div className="bg-slate-900 text-slate-100 rounded-2xl p-4 text-xs shadow-md space-y-1.5 border border-slate-800">
              <div className="text-[9px] font-black text-amber-400 tracking-wider font-sans uppercase">
                লাইভ ডেটা সেন্টার
              </div>
              <div className="font-bold flex items-center gap-1.5 text-white text-[11px]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                ফায়ারবেস ক্লাউড কানেক্টেড
              </div>
              <p className="text-[10px] text-slate-400 font-sans leading-relaxed pt-1 font-semibold">
                প্যানেলে যেকোনো পরিবর্তনের সাথে সাথে সমস্ত নাগরিকের অ্যাপে ডেটা রিয়েল-টাইমে আপডেট হয়ে যাবে।
              </p>
            </div>
          </div>
        </aside>

        {/* WORKSPACE SECTION */}
        <div className="flex-1 p-4 md:p-8 bg-white min-w-0">
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
                    {categories.map((c) => {
                      let count = 0;
                      if (c.id === "welfare") {
                        count = schemes.length + services.filter(s => s.category === "welfare").length;
                      } else if (c.id === "jobs") {
                        count = jobs.length + services.filter(s => s.category === "jobs").length;
                      } else if (c.id === "scholarships") {
                        count = scholarships.length + services.filter(s => s.category === "scholarships").length;
                      } else if (c.id === "identity") {
                        count = services.filter(s => s.category === "identity" || s.category === "aadhaar_pan").length;
                      } else if (c.id === "utility") {
                        count = services.filter(s => s.category === "utility" || s.category === "certificates").length;
                      } else {
                        count = services.filter(s => s.category === c.id).length;
                      }

                      return {
                        name: `${c.label} (${c.id.charAt(0).toUpperCase() + c.id.slice(1)})`,
                        key: c.id,
                        count
                      };
                    }).map((cat) => (
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
                {editingScholarshipId ? "স্কলারশিপ বিবরণী সংশোধন করুন" : "নতুন মেধাবী স্কলারশিপ বা বৃত্তি প্রকল্প যোগ করুন"}
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
                  <label className="text-xs font-bold text-slate-600 block mb-1">বাৎসরিক স্কলারশিপ রাশি / বৃত্তির পরিমাণ *</label>
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
                    placeholder="মেধাবী শিক্ষার্থীদের জন্য পশ্চিমবঙ্গ উচ্চশিক্ষা দপ্তরের বিশেষ আর্থিক বৃত্তি যোজনা..."
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
        {serviceTabIds.includes(activeTab) && (
          <div className="space-y-6">
            <form onSubmit={handleServiceSubmit} className="bg-slate-50 p-5 rounded-xl border border-slate-100 space-y-4">
              <h3 className="font-extrabold text-slate-800 flex items-center gap-1.5 text-sm md:text-base">
                <PlusCircle className="h-4.5 w-4.5 text-bengali-orange animate-bounce" />
                {editingServiceId ? "সিটিজেন ডিজিটাল সার্ভিস বিবরণ সংশোধন করুন" : `নতুন "${
                  tabItems.find(t => t.id === activeTab)?.label || "সেবা"
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

              {/* Dynamic Service Sublinks Section */}
              <div className="bg-white/60 p-4 rounded-xl border border-slate-200 space-y-3.5 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5 uppercase">
                      <Zap className="h-4 w-4 text-bengali-orange animate-pulse" />
                      গুরুত্বপূর্ণ সরাসরি লিঙ্ক ও সার্ভিসসমূহ ({serviceSubLinks.length})
                    </h4>
                    <p className="text-[10px] text-slate-500 mt-0.5 font-medium">পোর্টালে ক্লিক করার পর সরাসরি অ্যাকশনের জন্য লিঙ্কসমূহ এখানে যোগ করুন</p>
                  </div>
                </div>

                {/* Sublinks List */}
                {serviceSubLinks.length === 0 ? (
                  <div className="py-4 text-center rounded-lg border border-dashed border-slate-200 bg-slate-50/50">
                    <p className="text-xs text-slate-400 font-medium font-bengali">কোনো সরাসরি কাস্টম লিঙ্ক এখনও যুক্ত করা হয়নি। নিচে তথ্য দিয়ে নতুন লিঙ্ক যুক্ত করুন অথবা ডিফল্ট লিঙ্ক এডিট করুন।</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                    {serviceSubLinks.map((link, idx) => (
                      <div key={idx} className={`flex items-start justify-between p-2.5 rounded-lg border transition-all ${editingSubLinkIndex === idx ? 'border-bengali-orange bg-orange-50/20' : 'border-slate-150 bg-slate-50 hover:bg-orange-50/20 hover:border-orange-200'}`}>
                        <div className="min-w-0 pr-2">
                          <p className="text-xs font-bold text-slate-800 truncate">
                            {link.label}
                            {editingSubLinkIndex === idx && (
                              <span className="ml-1.5 inline-block text-[9px] bg-bengali-orange text-white px-1.5 py-0.5 rounded font-extrabold animation-pulse uppercase">সম্পাদনা চলছে</span>
                            )}
                          </p>
                          <p className="text-[10px] text-slate-500 truncate mt-0.5">{link.desc || "কোনো সংক্ষিপ্ত বিবরণ নেই"}</p>
                          <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-[9px] text-bengali-orange hover:underline truncate block mt-0.5 font-mono">{link.url}</a>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => startEditSubLink(idx)}
                            className="text-amber-600 hover:text-amber-800 p-1 rounded hover:bg-amber-100 transition-colors cursor-pointer"
                            title="লিঙ্কটি এডিট করুন"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveSubLink(idx)}
                            className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors cursor-pointer"
                            title="লিঙ্কটি মুছে ফেলুন"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Addition Controls */}
                <div className="bg-slate-50/50 p-3 rounded-lg border border-slate-150 space-y-3">
                  <p className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    {editingSubLinkIndex !== null ? "মনোনীত সরাসরি লিঙ্ক সংশোধন করুন:" : "নতুন সরাসরি লিঙ্ক যোগ করুন:"}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block mb-0.5 font-bengali">লিঙ্কের নাম বা লেবেল *</label>
                      <input
                        type="text"
                        value={newSubLinkLabel}
                        onChange={(e) => setNewSubLinkLabel(e.target.value)}
                        placeholder="যেমন: নতুন ভোটার কার্ডের স্ট্যাটাস ট্র্যাকিং"
                        className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-bengali-orange shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block mb-0.5 font-bengali">সরাসরি ওয়েব ওয়েব লিঙ্ক (URL) *</label>
                      <input
                        type="text"
                        value={newSubLinkUrl}
                        onChange={(e) => setNewSubLinkUrl(e.target.value)}
                        placeholder="https://voters.eci.gov.in/track"
                        className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-bengali-orange shadow-sm"
                      />
                    </div>
                    <div className="sm:col-span-2 lg:col-span-1">
                      <label className="text-[10px] font-bold text-slate-600 block mb-0.5 font-bengali">সংক্ষিপ্ত বিবরণ বা নোট (ঐচ্ছিক)</label>
                      <input
                        type="text"
                        value={newSubLinkDesc}
                        onChange={(e) => setNewSubLinkDesc(e.target.value)}
                        placeholder="Reference ID দিয়ে স্ট্যাটাস জানুন"
                        className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-bengali-orange shadow-sm"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-1.5">
                    {editingSubLinkIndex !== null && (
                      <button
                        type="button"
                        onClick={cancelEditSubLink}
                        className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold py-1.5 px-4 rounded-md transition-colors cursor-pointer font-bold"
                      >
                        বাতিল করুন
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={handleAddSubLink}
                      className="bg-slate-800 hover:bg-slate-950 text-white text-xs font-bold py-1.5 px-4 rounded-md transition-colors flex items-center gap-1 shadow-xs cursor-pointer font-bold"
                    >
                      {editingSubLinkIndex !== null ? (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          লিঙ্ক পরিবর্তন সংরক্ষণ করুন
                        </>
                      ) : (
                        <>
                          <Plus className="h-3.5 w-3.5" />
                          লিঙ্ক তালিকায় যুক্ত করুন
                        </>
                      )}
                    </button>
                  </div>
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
                            {categories.find((c) => c.id === srv.category || (srv.category === "aadhaar_pan" && c.id === "identity") || (srv.category === "certificates" && c.id === "utility"))?.label || srv.categoryName || srv.category}
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

        {/* TAB 8.5: SUGGESTIONS & COMPLAINTS */}
        {activeTab === "suggestions" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8 space-y-6">
              <div className="border-b border-slate-100 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm md:text-base font-extrabold text-slate-800 flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-bengali-orange" />
                    নাগরিক সাজেশন ও অভিযোগ ড্যাশবোর্ড (Suggestions & Feedback)
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium mt-1">
                    সহজ সেবা অ্যাপ্লিকেশনে নাগরিকরা যেসব সমস্যা বা নতুন ফিচার অনুরোধ করেছেন সেগুলো এখানে পর্যালোচনা করুন এবং অ্যাকশন রেকর্ড করুন।
                  </p>
                </div>
                
                {/* Stats recap row */}
                <div className="flex gap-2">
                  <div className="bg-orange-50 border border-orange-100 px-3 py-1.5 rounded-lg text-center">
                    <div className="text-[10px] text-orange-600 font-extrabold">মোট মতামত</div>
                    <div className="text-sm font-black text-[#EA580C]">{suggestions.length}</div>
                  </div>
                  <div className="bg-amber-50 border border-amber-100 px-3 py-1.5 rounded-lg text-center">
                    <div className="text-[10px] text-amber-700 font-extrabold">অপেক্ষমান</div>
                    <div className="text-sm font-black text-amber-600">
                      {suggestions.filter(s => s.status === "pending" || !s.status).length}
                    </div>
                  </div>
                  <div className="bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-lg text-center">
                    <div className="text-[10px] text-emerald-700 font-extrabold">সমাধান করা</div>
                    <div className="text-sm font-black text-emerald-600">
                      {suggestions.filter(s => s.status === "resolved").length}
                    </div>
                  </div>
                </div>
              </div>

              {suggestions.length === 0 ? (
                <div className="text-center py-12 px-4 bg-slate-50 rounded-xl border border-dashed border-slate-200/80">
                  <MessageSquare className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                  <p className="text-xs font-bold text-slate-600">বর্তমানে কোনো সাজেশন বা অভিযোগ জমা পড়েনি।</p>
                  <p className="text-[11px] text-slate-400 mt-1">গ্রাহকরা হোমে সাজেশন বক্সে মন্তব্য জমা দিলে এখানে রিয়েল-টাইমে তা চলে আসবে।</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {suggestions.map((item) => {
                    return (
                      <div 
                        key={item.id} 
                        className={`p-5 rounded-xl border transition-all ${
                          item.status === "resolved" 
                            ? "border-emerald-100 bg-emerald-50/10" 
                            : item.status === "ignored"
                            ? "border-slate-200 bg-slate-50/40 opacity-70"
                            : "border-slate-200 bg-white shadow-xs"
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              {/* Type status badge */}
                              {item.type === "difficulty" ? (
                                <span className="bg-red-50 text-red-700 border border-red-100 text-[10px] px-2.5 py-0.5 rounded-full font-bold">
                                  সমস্যা / অসুবিধা
                                </span>
                              ) : item.type === "feature" ? (
                                <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 text-[10px] px-2.5 py-0.5 rounded-full font-bold">
                                  নতুন ফিচার অনুরোধ
                                </span>
                              ) : (
                                <span className="bg-slate-100 text-slate-700 border border-slate-200 text-[10px] px-2.5 py-0.5 rounded-full font-bold">
                                  অন্যান্য মতামত
                                </span>
                              )}

                              {/* Action status badge */}
                              {item.status === "resolved" ? (
                                <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] px-2.5 py-0.5 rounded-full font-extrabold flex items-center gap-1">
                                  <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full"></span>
                                  সমাধান করা (Resolved)
                                </span>
                              ) : item.status === "ignored" ? (
                                <span className="bg-slate-200 text-slate-650 border border-slate-300 text-[10px] px-2.5 py-0.5 rounded-full font-bold">
                                  বাতিল করা (Ignored)
                                </span>
                              ) : (
                                <span className="bg-amber-50 text-amber-800 border border-amber-200 text-[10px] px-2.5 py-0.5 rounded-full font-extrabold flex items-center gap-1">
                                  <span className="h-1.5 w-1.5 bg-amber-500 rounded-full animate-pulse"></span>
                                  পর্যালোচনা চলছে (Pending)
                                </span>
                              )}
                            </div>
                            
                            <h4 className="text-xs font-black text-slate-800">
                              প্রেরক: {item.name || "অজ্ঞাত নাগরিক"}
                              {item.mobile && <span className="text-slate-400 font-semibold font-mono text-[10px] ml-2">({item.mobile})</span>}
                            </h4>
                          </div>

                          <span className="text-[10px] text-slate-400 font-semibold font-mono sm:text-right">
                            {item.created_at ? new Date(item.created_at).toLocaleString("bn-BD") : "কিছুক্ষণ আগে"}
                          </span>
                        </div>

                        {/* Suggestion Text */}
                        <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-100 text-xs font-semibold text-slate-700 leading-relaxed break-words">
                          {item.text}
                        </div>

                        {/* Admin responses and notes section */}
                        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                          {/* Notes field */}
                          <div className="flex-1 flex items-center gap-2 max-w-xl">
                            <span className="text-[10px] font-extrabold text-slate-500 whitespace-nowrap">অ্যাডমিন নোট:</span>
                            <input
                              type="text"
                              value={item.adminNotes || ""}
                              placeholder="এই বিষয়ে আপনার পদক্ষেপ লিখুন..."
                              onChange={async (e) => {
                                const val = e.target.value;
                                await onSaveSuggestion({
                                  ...item,
                                  adminNotes: val
                                });
                              }}
                              className="w-full text-xs font-semibold border-b border-dashed border-slate-300 hover:border-slate-400 focus:border-bengali-orange focus:outline-none bg-transparent py-0.5 px-1 text-slate-700"
                            />
                          </div>

                          {/* Action toggle buttons */}
                          <div className="flex items-center gap-2 shrink-0">
                            {item.status !== "resolved" && (
                              <button
                                onClick={async () => {
                                  await onSaveSuggestion({
                                    ...item,
                                    status: "resolved"
                                  });
                                  showNotification("মতামত বা সমাধান হিসেবে চিহ্নিত করা হয়েছে!");
                                }}
                                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-extrabold border border-emerald-200 px-3 py-1.5 rounded-lg text-[11px] transition-colors cursor-pointer flex items-center gap-1"
                              >
                                সমাধান করা
                              </button>
                            )}

                            {item.status !== "ignored" && (
                              <button
                                onClick={async () => {
                                  await onSaveSuggestion({
                                    ...item,
                                    status: "ignored"
                                  });
                                  showNotification("অভিযোগ বাতিল তালিকায় যুক্ত করা হয়েছে।");
                                }}
                                className="bg-slate-100 hover:bg-slate-200 text-slate-650 font-bold border border-slate-200 px-3 py-1.5 rounded-lg text-[11px] transition-colors cursor-pointer"
                              >
                                এড়িয়ে যান
                              </button>
                            )}

                            {item.status && item.status !== "pending" && (
                              <button
                                onClick={async () => {
                                  await onSaveSuggestion({
                                    ...item,
                                    status: "pending"
                                  });
                                  showNotification("রিভিউতে ফেরত নেওয়া হয়েছে।");
                                }}
                                className="bg-amber-50 hover:bg-amber-100 text-amber-700 font-semibold border border-amber-200 px-3 py-1.5 rounded-lg text-[11px] transition-colors cursor-pointer"
                              >
                                পেন্ডিং করুন
                              </button>
                            )}

                            <button
                              onClick={async () => {
                                if (deleteConfirmId === item.id && deleteConfirmType === "suggestion") {
                                  await onDeleteSuggestion(item.id);
                                  showNotification("মতামত মুছে ফেলা হয়েছে।");
                                  setDeleteConfirmId(null);
                                  setDeleteConfirmType(null);
                                } else {
                                  setDeleteConfirmId(item.id);
                                  setDeleteConfirmType("suggestion");
                                  setTimeout(() => {
                                    setDeleteConfirmId(null);
                                    setDeleteConfirmType(null);
                                  }, 5000);
                                }
                              }}
                              className={`font-black border p-1.5 rounded-lg text-xs transition-colors cursor-pointer flex items-center justify-center gap-1 ${
                                deleteConfirmId === item.id && deleteConfirmType === "suggestion"
                                  ? "bg-red-600 border-red-700 text-white px-2.5 py-1"
                                  : "bg-red-50 hover:bg-red-100 text-red-650 border-red-200"
                              }`}
                              title={deleteConfirmId === item.id && deleteConfirmType === "suggestion" ? "নিশ্চিত করতে পুনরায় ক্লিক করুন" : "মুছে ফেলুন"}
                            >
                              {deleteConfirmId === item.id && deleteConfirmType === "suggestion" ? (
                                "নিশ্চিত?"
                              ) : (
                                <Trash2 className="h-3.5 w-3.5" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 9: AI SETTINGS PLAN */}
        {activeTab === "settings" && (
          <div className="space-y-6 max-w-4xl">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8 space-y-6 animate-fade-in">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-sm md:text-base font-extrabold text-slate-800 flex items-center gap-2">
                  <Settings className="h-5 w-5 text-bengali-orange animate-spin-slow" />
                  ব্যানার ও পটভূমি সেটিংস (Banner & Background Settings)
                </h3>
                <p className="text-[11px] text-slate-500 font-medium mt-1">
                  এখানে ল্যান্ডিং পেজের হিরো ব্যানার ব্যাকগ্রাউন্ডের ছবি সম্পূর্ণ নিজের মতো পরিবর্তন করুন।
                </p>
              </div>

              <div className="bg-amber-50/50 border border-amber-100/70 rounded-xl p-4 text-xs text-amber-900 space-y-2">
                <h4 className="font-extrabold flex items-center gap-1.5 text-amber-800">
                  <AlertCircle className="h-4 w-4 text-bengali-orange shrink-0" />
                  কীভাবে সেটিংস পরিবর্তন করবেন?
                </h4>
                <p className="leading-relaxed font-semibold text-slate-650">
                  ল্যান্ডিং পেজে যে প্রধান ছবি রয়েছে তা পরিবর্তন করতে নিচের প্রি-সেটগুলো ব্যবহার করতে পারেন অথবা কাস্টম ছবি আপলোড করতে পারেন। সেভ করার পর এটি অবিলম্বে আপডেট ও সক্রিয় হয়ে যাবে।
                </p>
              </div>

              <form onSubmit={async (e) => {
                e.preventDefault();
                setIsSubmitting(true);
                try {
                  const success = await onSaveSettings({ 
                    geminiApiKey: apiKeyInput,
                    heroBannerUrl: heroBannerUrlInput
                  });
                  if (success) {
                    showNotification("ব্যানার ইমেজ সফলভাবে সংরক্ষণ করা হয়েছে!");
                  } else {
                    showNotification("সেটিংস সেভ করতে ব্যর্থ হয়েছে।");
                  }
                } catch (err) {
                  showNotification("সার্ভার ত্রুটি ঘটেছে।");
                } finally {
                  setIsSubmitting(false);
                }
              }} className="space-y-6">
                
                {/* SECTION: HERO BANNER IMAGE SETTINGS */}
                <div className="p-4 border border-slate-100 rounded-xl bg-slate-50/50 space-y-5">
                  <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider block">ল্যান্ডিং পেজ হিরো ব্যানার পরিবর্তন করুন</h4>
                  
                  {/* Preset Banner Grid with thumbnails */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-extrabold text-slate-600 block">সুন্দর প্রি-সেট ইমেজগুলো থেকে সিলেক্ট করুন (১-ক্লিক)</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {[
                        { id: "p1", name: "সূর্যাস্ত হাওড়া ব্রিজ", url: "https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=1200&q=80" },
                        { id: "p2", name: "ভিক্টোরিয়া মেমোরিয়াল", url: "https://images.unsplash.com/photo-1595841696660-ab6189ef9492?auto=format&fit=crop&w=1200&q=80" },
                        { id: "p3", name: "সবুজ বাংলার প্রকৃতি", url: "https://images.unsplash.com/photo-1626314811808-f40b2f155986?auto=format&fit=crop&w=1200&q=80" },
                        { id: "p4", name: "ডিজিটাল ক্যাসকেড গ্রিড", url: "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1200&q=80" }
                      ].map((preset) => (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => setHeroBannerUrlInput(preset.url)}
                          className={`group relative rounded-lg overflow-hidden border-2 h-14 transition-all duration-300 text-left cursor-pointer ${
                            heroBannerUrlInput === preset.url ? "border-bengali-orange scale-[1.02] shadow-xs" : "border-slate-200 hover:border-slate-400"
                          }`}
                        >
                          <img src={preset.url} alt={preset.name} className="absolute inset-0 w-full h-full object-cover brightness-[0.7] group-hover:scale-105 transition-all duration-305" referrerPolicy="no-referrer" />
                          <div className="absolute inset-0 bg-black/10" />
                          <span className="absolute bottom-1 left-1.5 right-1.5 text-[9px] font-extrabold text-white truncate drop-shadow-sm">{preset.name}</span>
                          {heroBannerUrlInput === preset.url && (
                            <span className="absolute top-1 right-1 bg-bengali-orange text-white rounded-full p-0.5 shadow-xs">
                              <Check className="h-2 w-2" />
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Device File Upload Drag-n-Drop box */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-extrabold text-slate-600 block">কম্পিউটার বা মোবাইল থেকে নতুন ছবি আপলোড করুন</label>
                    <div className="flex items-center gap-4">
                      <div className="relative grow">
                        <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:border-bengali-orange bg-white rounded-xl py-4 px-5 cursor-pointer transition-all group hover:bg-orange-50/10">
                          <svg className="h-5 w-5 text-slate-400 group-hover:text-bengali-orange mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-[11px] font-extrabold text-slate-700">ছবি নির্বাচন করতে ক্লিক করুন</span>
                          <span className="text-[9px] text-slate-400 font-semibold mt-0.5">সবোর্চ্চ সাইজ ও রেজুলেশন ক্লায়েন্টে স্বয়ংক্রিয় কম্প্রেস হবে (JPEG)</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setIsUploading(true);
                                try {
                                  const compressedBase64 = await compressImage(file);
                                  setHeroBannerUrlInput(compressedBase64);
                                } catch (err) {
                                  console.error("Failed to compress image:", err);
                                  showNotification("ছবি প্রসেসিং করতে সমস্যা হয়েছে। অনুগ্রহ করে অন্য ছবি নির্বাচন করুন।");
                                } finally {
                                  setIsUploading(false);
                                }
                              }
                            }}
                          />
                        </label>
                      </div>

                      {/* Preview Thumb of current selection */}
                      {heroBannerUrlInput && (
                        <div className="shrink-0 relative border border-slate-200 rounded-xl overflow-hidden shadow-xs h-16 w-28 bg-slate-100 flex items-center justify-center">
                          <img
                            src={heroBannerUrlInput}
                            alt="Preview"
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <button
                            type="button"
                            onClick={() => setHeroBannerUrlInput("")}
                            className="absolute inset-0 bg-black/40 hover:bg-black/60 opacity-0 hover:opacity-100 transition-all flex items-center justify-center text-[10px] text-white font-extrabold cursor-pointer"
                          >
                            বাদ দিন
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Custom URL Input Field */}
                  <div>
                    <label className="text-[11px] font-extrabold text-slate-650 block mb-1">অথবা পটভূমির ছবির কাস্টম লিঙ্ক দিন (Custom Web URL)</label>
                    <input
                      type="url"
                      value={heroBannerUrlInput}
                      onChange={(e) => setHeroBannerUrlInput(e.target.value)}
                      placeholder="https://images.unsplash.com/... বা অন্য কোনো ছবির পূর্ণাঙ্গ লিঙ্ক"
                      className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-orange-500/10 focus:border-bengali-orange"
                    />
                  </div>
                </div>

                {/* Submitting state status */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between border-t border-slate-100 pt-5">
                  <div className="text-xs font-bold flex items-center gap-1.5">
                    <span className="text-slate-500">কালার ও কন্টেন্ট ব্যানার লাইভ অবস্থা:</span>
                    {heroBannerUrlInput ? (
                      <span className="text-orange-655 bg-orange-50 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border border-orange-100 flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-orange-500"></span>
                        কাস্টম ব্যানার সক্রিয় (Custom Banner)
                      </span>
                    ) : (
                      <span className="text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                        ডিফল্ট (Default Unsplash)
                      </span>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || isUploading}
                    className="bg-bengali-orange hover:bg-orange-650 text-white font-extrabold py-2 px-5 rounded-lg text-xs tracking-wider transition-all shadow-sm flex items-center gap-1.5 cursor-pointer border border-orange-600/50 disabled:opacity-50"
                  >
                    <Check className="h-3.5 w-3.5" />
                    {isSubmitting ? "সংরক্ষণ করা হচ্ছে..." : isUploading ? "ছবি আপলোড হচ্ছে..." : "সেটিংস সংরক্ষণ করুন (Save)"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
