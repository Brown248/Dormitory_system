"use client";

import { useEffect, useState } from "react";
import { generatePromptPayPayload } from "@/lib/promptpay";

interface PromptPayQRCardProps {
  amount: number;
  title?: string;
  onClose?: () => void;
}

export default function PromptPayQRCard({ amount, title = "ชำระเงินค่าเช่า/ค่าบริการ", onClose }: PromptPayQRCardProps) {
  const [promptPayId, setPromptPayId] = useState("0105569000123");
  const [companyName, setCompanyName] = useState("บริษัท ซอฟเวอเรน โวลต์ จำกัด");
  const [copied, setCopied] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      const savedPromptPay = localStorage.getItem("setting_promptpay_id");
      const savedCompany = localStorage.getItem("setting_company_name");
      if (savedPromptPay) setPromptPayId(savedPromptPay);
      if (savedCompany) setCompanyName(savedCompany);
    }, 0);
  }, []);

  const qrPayload = generatePromptPayPayload(promptPayId, amount);
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrPayload)}`;

  const handleCopyId = () => {
    navigator.clipboard.writeText(promptPayId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyAmount = () => {
    navigator.clipboard.writeText(amount.toString());
    setCopiedAmount(true);
    setTimeout(() => setCopiedAmount(false), 2000);
  };

  return (
    <div className="bg-slate-900/40 backdrop-blur-md fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-out]">
      <div className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-sm w-full border border-slate-100 animate-[scaleUp_0.3s_ease-out] flex flex-col">
        
        {/* Card Header (Thai QR Payment Style) */}
        <div className="bg-[#0f2354] px-6 py-4 text-white text-center relative">
          <div className="text-[10px] font-black tracking-widest text-blue-200 uppercase mb-0.5">Thai QR Payment</div>
          <div className="font-extrabold text-sm flex items-center justify-center gap-1.5">
            <span>Scan to Pay</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          {onClose && (
            <button 
              onClick={onClose}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white font-bold"
            >
              ✕
            </button>
          )}
        </div>

        {/* PromptPay Brand Strip */}
        <div className="bg-sky-50 py-2 border-b border-sky-100 flex items-center justify-center gap-2">
          <div className="font-black text-[15px] tracking-tight text-blue-900 flex items-center gap-1">
            <span className="text-sky-500">🛡️</span>
            <span>Prompt</span>
            <span className="text-sky-500">Pay</span>
          </div>
          <span className="text-[9px] font-bold text-sky-600 bg-sky-100 px-1.5 py-0.5 rounded">พร้อมเพย์</span>
        </div>

        {/* QR Code Area */}
        <div className="p-6 flex flex-col items-center justify-center">
          <div className="p-4 bg-white border border-slate-100 rounded-3xl shadow-inner relative flex items-center justify-center">
            {/* Custom corners */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-blue-600 rounded-tl-2xl" />
            <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-blue-600 rounded-tr-2xl" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-blue-600 rounded-bl-2xl" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-blue-600 rounded-br-2xl" />
            
            {/* QR Image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={qrImageUrl} 
              alt="PromptPay QR Code" 
              className="w-48 h-48 rounded-lg select-none"
            />
          </div>

          <p className="text-[10px] font-bold text-slate-400 mt-4 uppercase tracking-wider text-center">
            ใช้แอปธนาคารสแกนคิวอาร์โค้ดเพื่อชำระเงิน
          </p>
        </div>

        {/* Billing Information & Total */}
        <div className="bg-slate-50 p-6 border-t border-slate-100 space-y-4 rounded-b-3xl">
          <div className="text-center">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">ยอดเงินเรียกเก็บสุทธิ</div>
            <div className="text-3xl font-black text-slate-800 tracking-tight flex items-center justify-center gap-1.5">
              <span>{amount.toLocaleString("th-TH", { minimumFractionDigits: 2 })}</span>
              <span className="text-sm font-bold text-slate-400">บาท</span>
            </div>
            <div className="text-[10px] font-semibold text-slate-500 mt-1 max-w-[250px] mx-auto truncate">
              {title}
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-200/60">
            {/* Merchant Details */}
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-400">ผู้รับเงิน:</span>
              <span className="font-bold text-slate-700 text-right truncate max-w-[180px]">
                {companyName}
              </span>
            </div>

            {/* PromptPay ID (with Copy option) */}
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-400">พร้อมเพย์:</span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono font-bold text-slate-700">{promptPayId}</span>
                <button 
                  onClick={handleCopyId}
                  className="px-2 py-0.5 rounded bg-blue-50 text-[10px] font-bold text-blue-600 hover:bg-blue-100 transition-colors"
                >
                  {copied ? "ก๊อปปี้แล้ว!" : "คัดลอก"}
                </button>
              </div>
            </div>

            {/* Amount details (with Copy option) */}
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-400">คัดลอกยอดเงิน:</span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono font-bold text-slate-700">{amount.toFixed(2)}</span>
                <button 
                  onClick={handleCopyAmount}
                  className="px-2 py-0.5 rounded bg-blue-50 text-[10px] font-bold text-blue-600 hover:bg-blue-100 transition-colors"
                >
                  {copiedAmount ? "ก๊อปปี้แล้ว!" : "คัดลอก"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
