"use client";

import { useState, useEffect } from "react";

export default function SettingsPage() {
  const [waterRate, setWaterRate] = useState(17);
  const [electricRate, setElectricRate] = useState(7);
  const [promptPayId, setPromptPayId] = useState("0105569000123");
  const [companyName, setCompanyName] = useState("บริษัท ซอฟเวอเรน โวลต์ จำกัด");
  const [taxId, setTaxId] = useState("0105569000123");
  
  const [isMounted, setIsMounted] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    // Run after mount in a single tick to avoid hydration mismatches and synchronous setState warning
    setTimeout(() => {
      const savedWater = localStorage.getItem("setting_water_rate");
      const savedElectric = localStorage.getItem("setting_electric_rate");
      const savedPromptPay = localStorage.getItem("setting_promptpay_id");
      const savedCompany = localStorage.getItem("setting_company_name");
      const savedTax = localStorage.getItem("setting_tax_id");

      if (savedWater) setWaterRate(parseFloat(savedWater));
      if (savedElectric) setElectricRate(parseFloat(savedElectric));
      if (savedPromptPay) setPromptPayId(savedPromptPay);
      if (savedCompany) setCompanyName(savedCompany);
      if (savedTax) setTaxId(savedTax);
      
      setIsMounted(true);
    }, 0);
  }, []);

  const handleSave = () => {
    localStorage.setItem("setting_water_rate", waterRate.toString());
    localStorage.setItem("setting_electric_rate", electricRate.toString());
    localStorage.setItem("setting_promptpay_id", promptPayId);
    localStorage.setItem("setting_company_name", companyName);
    localStorage.setItem("setting_tax_id", taxId);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  if (!isMounted) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-[fadeIn_0.5s_ease-out]">
      <div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">ตั้งค่าระบบ (Settings)</h1>
        <p className="text-slate-500 text-xs mt-0.5">กำหนดค่าคงที่และพารามิเตอร์ต่างๆ ของระบบ</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-8 space-y-8">
        
        {/* Utilities Rate */}
        <section className="space-y-4">
          <h2 className="text-sm font-bold text-slate-700 flex items-center gap-2">
            <span>💧</span> อัตราค่าสาธารณูปโภค (Utility Rates)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">ค่าน้ำ (บาท/หน่วย)</label>
              <input
                type="number"
                value={waterRate}
                onChange={(e) => setWaterRate(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition outline-none font-bold text-slate-700"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">ค่าไฟ (บาท/หน่วย)</label>
              <input
                type="number"
                value={electricRate}
                onChange={(e) => setElectricRate(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition outline-none font-bold text-slate-700"
              />
            </div>
          </div>
        </section>

        {/* Company profile & Promtppay config */}
        <section className="pt-6 border-t border-slate-50 space-y-4">
          <h2 className="text-sm font-bold text-slate-700 flex items-center gap-2">
            <span>🏦</span> ข้อมูลธุรกิจ & พร้อมเพย์ (Company Profile & PromptPay)
          </h2>
          
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">ชื่อธุรกิจ / บริษัทผู้เรียกเก็บเงิน</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="เช่น: บริษัท ของคุณ จำกัด"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition outline-none font-bold text-slate-700 text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">เลขประจำตัวผู้เสียภาษีอากร</label>
                <input
                  type="text"
                  value={taxId}
                  onChange={(e) => setTaxId(e.target.value)}
                  placeholder="เลข 13 หลัก"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition outline-none font-bold text-slate-700 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">เบอร์พร้อมเพย์ / เลขผู้เสียภาษีผู้รับเงิน</label>
                <input
                  type="text"
                  value={promptPayId}
                  onChange={(e) => setPromptPayId(e.target.value)}
                  placeholder="เบอร์โทรศัพท์ หรือ เลขบัตรประชาชน/นิติบุคคล"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition outline-none font-bold text-slate-700 text-xs"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Save button */}
        <section className="pt-6 border-t border-slate-50">
          <button
            onClick={handleSave}
            className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-sm transition-all shadow-lg shadow-blue-600/20 active:scale-95"
          >
            บันทึกการตั้งค่า
          </button>
        </section>
      </div>

      {showToast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-[fadeIn_0.2s_ease-out] font-bold text-sm">
          <span>✅</span> บันทึกการตั้งค่าเรียบร้อยแล้ว
        </div>
      )}
    </div>
  );
}
