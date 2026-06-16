import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, X, Sparkles, AlertCircle } from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
}

interface AiAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AiAssistant({ isOpen, onClose }: AiAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "msg-init",
      sender: "bot",
      text: "নমস্কার! আমি আপনার ডিজিটাল এআই সহায়ক। বাংলার সেবার বিভিন্ন সামাজিক প্রকল্প (যেমন লক্ষ্মীর ভাণ্ডার, কন্যাশ্রী), চাকরি, রেশন বা আধার সংশোধন নিয়ে আপনার মনে কোনো প্রশ্ন থাকলে আমাকে নির্দ্বিধায় জিজ্ঞাসা করুন।"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const samplePrompts = [
    "লক্ষ্মীর ভাণ্ডার করতে কি কি লাগে?",
    "কৃষক বন্ধু কিস্তির পরিমাণ কত?",
    "SVMCM মেরিট স্কলারশিপে কত নম্বর প্রয়োজন?",
    "জন্ম সার্টিফিকেট কিভাবে আবেদন করব?"
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsgId = `usr-${Date.now()}`;
    const newMsg: Message = { id: userMsgId, sender: "user", text: textToSend };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend }),
      });

      if (!response.ok) {
        throw new Error("api_error");
      }

      const data = await response.json();
      const botMsgId = `bot-${Date.now()}`;
      setMessages((prev) => [
        ...prev,
        { id: botMsgId, sender: "bot", text: data.text || "দুঃখিত, কোনো উত্তর পাওয়া যায়নি।" }
      ]);
    } catch (err) {
      console.error("Chat error:", err);
      // Fallback helpful static info if system experiences any problem or network latency
      const fallbackMsg = "দুঃখিত, বর্তমানে আমাদের সার্ভারে বেশি ট্র্যাফিক থাকার কারণে এআই সাময়িকভাবে অনুপুস্থিত। তবে দয়া করে প্রকল্প বিবরণী অথবা সরাসরি অফিশিয়াল আবেদনের সাহায্য নিন।";
      setMessages((prev) => [
        ...prev,
        { id: `bot-fail-${Date.now()}`, sender: "bot", text: fallbackMsg }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-0 right-0 md:bottom-6 md:right-6 z-50 flex h-full md:h-[600px] w-full md:max-w-[430px] flex-col rounded-none md:rounded-2xl border-t md:border border-orange-100 bg-white shadow-2xl overflow-hidden transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-bengali-orange to-[#8D3F0D] px-4 py-4 text-white">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-600/35 border border-white/20">
            <Bot className="h-5 w-5 text-white animate-pulse" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-white">বাংলার এআই সহায়ক</h3>
            <p className="text-xs text-orange-200 flex items-center gap-1">
              <Sparkles className="h-3 w-3 animate-spin text-amber-300" />
              ২৪x৭ লাইভ নাগরিক গাইড
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-white hover:bg-orange-850/40 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Warning Alert */}
      <div className="bg-orange-50/70 border-b border-orange-100 px-3 py-2 text-[11px] text-orange-800 flex items-start gap-1">
        <AlertCircle className="h-4 w-4 shrink-0 text-orange-600 mt-0.5" />
        <p>
          <strong>সতর্কতা:</strong> এটি একটি স্বাধীন পোর্টাল এআই। কোনো প্রকার ব্যক্তিগত পাসওয়ার্ড বা ওটিপি প্রদান করবেন না। আবেদনের প্রামাণ্য নথির বিবরণ এখানে জানুন।
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-slate-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.sender === "user"
                  ? "bg-bengali-orange text-white rounded-br-none shadow-sm shadow-orange-800/10"
                  : "bg-white text-slate-800 rounded-bl-none shadow-sm border border-slate-100"
              }`}
            >
              {msg.sender === "bot" && (
                <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-bengali-orange">
                  <Bot className="h-3 w-3" />
                  সহায়ক বট:
                </div>
              )}
              <div className="whitespace-pre-line font-normal">{msg.text}</div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white rounded-2xl rounded-bl-none px-4 py-3 text-sm text-slate-500 shadow-sm border border-slate-100 flex items-center gap-2">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </div>
              এআই ভাবছে...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Helper prompts */}
      {messages.length === 1 && (
        <div className="bg-slate-50 px-3 pb-2 pt-1 border-t border-slate-100">
          <p className="text-[11px] text-slate-400 font-medium mb-1.5 ml-1">সহজে জানতে নিচের যেকোনো একটিতে টাচ করুন:</p>
          <div className="flex flex-wrap gap-1.5">
            {samplePrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p)}
                className="text-left text-xs bg-white text-slate-600 hover:text-bengali-orange hover:bg-orange-50 border border-slate-200 hover:border-orange-200 rounded-full px-3 py-1.5 transition-all text-ellipsis overflow-hidden"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Action input */}
      <div className="border-t border-slate-100 bg-white p-3 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
          placeholder="এখানে বাংলায় আপনার প্রশ্নটি টাইপ করুন..."
          className="flex-1 rounded-xl bg-slate-100 px-4 py-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-slate-800 transition-all border border-transparent focus:border-orange-250"
        />
        <button
          onClick={() => handleSend(input)}
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-bengali-orange text-white hover:bg-orange-80D transition-transform active:scale-95 shadow-sm shadow-orange-500/30"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
