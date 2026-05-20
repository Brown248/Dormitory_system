"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchRentalHouses, updateRentalHouse } from "@/lib/api";

interface RentalHouse {
  id: string;
  name: string;
  tenantName: string;
  monthlyRent: number;
  waterBill: number;
  electricBill: number;
  paymentStatus: "unpaid" | "paid";
  lastPaymentDate?: string;
}

const DEFAULT_HOUSES: RentalHouse[] = [
  { id: "h1", name: "บ้านเช่า หลังที่ 1", tenantName: "", monthlyRent: 5000, waterBill: 0, electricBill: 0, paymentStatus: "unpaid" },
  { id: "h2", name: "บ้านเช่า หลังที่ 2", tenantName: "", monthlyRent: 4500, waterBill: 0, electricBill: 0, paymentStatus: "unpaid" },
  { id: "h3", name: "บ้านเช่า หลังที่ 3", tenantName: "", monthlyRent: 6000, waterBill: 0, electricBill: 0, paymentStatus: "unpaid" },
];

const KpiCard = ({ label, value, unit = "฿", color = "text-slate-800", sub }: any) => (
  <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col items-center text-center">
    <div className="text-slate-500 font-semibold text-xs mb-1.5 tracking-wide">{label}</div>
    <div className={`text-2xl font-extrabold ${color} tracking-tight`}>
      {value.toLocaleString("th-TH")}
      <span className="text-sm font-semibold text-slate-400 ml-1">{unit}</span>
    </div>
    {sub && <div className="text-[10px] text-slate-400 mt-1 font-medium">{sub}</div>}
  </div>
);

export default function HousePage() {
  const [houses, setHouses] = useState<RentalHouse[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHouse, setEditingHouse] = useState<RentalHouse | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    tenantName: "",
    monthlyRent: 0,
    waterBill: 0,
    electricBill: 0,
    paymentStatus: "unpaid" as RentalHouse["paymentStatus"],
  });

  const loadHouses = async () => {
    try {
      const data = await fetchRentalHouses();
      setHouses(data);
    } catch (err) {
      console.error("Failed to load rental houses:", err);
    }
  };

  useEffect(() => {
    loadHouses();
  }, []);

  const handleSave = async () => {
    if (editingHouse) {
      try {
        const updated = await updateRentalHouse(editingHouse.id, {
          ...editingHouse,
          ...formData
        });
        setHouses(houses.map(h => h.id === editingHouse.id ? updated : h));
        setIsModalOpen(false);
        setEditingHouse(null);
      } catch (err) {
        console.error("Failed to save rental house:", err);
        alert("❌ เกิดข้อผิดพลาดในการบันทึกข้อมูลบ้านเช่า");
      }
    }
  };

  const openEdit = (house: RentalHouse) => {
    setEditingHouse(house);
    setFormData({
      tenantName: house.tenantName,
      monthlyRent: house.monthlyRent,
      waterBill: house.waterBill,
      electricBill: house.electricBill,
      paymentStatus: house.paymentStatus,
    });
    setIsModalOpen(true);
  };

  const togglePayment = async (id: string) => {
    const house = houses.find(h => h.id === id);
    if (!house) return;

    const nextStatus = (house.paymentStatus === "paid" ? "unpaid" : "paid") as "paid" | "unpaid";
    const lastPaymentDate = nextStatus === "paid" ? new Date().toISOString() : house.lastPaymentDate;

    // Optimistic update
    setHouses(houses.map(h => h.id === id ? { ...h, paymentStatus: nextStatus, lastPaymentDate } : h));

    try {
      await updateRentalHouse(id, {
        ...house,
        paymentStatus: nextStatus,
        lastPaymentDate
      });
    } catch (err) {
      console.error("Failed to toggle payment status:", err);
      // Revert on error
      setHouses(houses.map(h => h.id === id ? house : h));
      alert("❌ เกิดข้อผิดพลาดในการบันทึกสถานะการชำระเงิน");
    }
  };

  // Stats
  const totalExpected = houses.reduce((sum, h) => sum + h.monthlyRent + h.waterBill + h.electricBill, 0);
  const totalPaid = houses.reduce((sum, h) => sum + (h.paymentStatus === "paid" ? (h.monthlyRent + h.waterBill + h.electricBill) : 0), 0);
  const occupiedCount = houses.filter(h => h.tenantName.trim() !== "").length;

  return (
    <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-md mb-2 inline-block">
            Property Module
          </span>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">ระบบบ้านเช่า (Rental House)</h1>
          <p className="text-slate-500 text-xs mt-0.5">จัดการบ้านเช่า, ติดตามค่าเช่า และการชำระเงินรายเดือน</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="บ้านที่มีผู้เช่า" value={occupiedCount} unit="หลัง" color="text-amber-600" sub={`จากทั้งหมด ${houses.length} หลัง`} />
        <KpiCard label="ยอดเรียกเก็บรวม" value={totalExpected} color="text-blue-600" />
        <KpiCard label="ชำระแล้ว" value={totalPaid} color="text-emerald-600" />
        <KpiCard label="ยอดค้างชำระ" value={totalExpected - totalPaid} color="text-rose-600" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {houses.map((house) => (
          <div key={house.id} className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="p-6 bg-gradient-to-br from-slate-50 to-white border-b border-slate-100 relative">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 text-xl">
                  🏠
                </div>
                <button
                  onClick={() => openEdit(house)}
                  className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </button>
              </div>
              <h3 className="text-lg font-black text-slate-800">{house.name}</h3>
              <div className="mt-1 flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${house.tenantName ? "bg-emerald-500 animate-pulse" : "bg-slate-300"}`} />
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  {house.tenantName ? "มีผู้เช่าแล้ว" : "ว่าง"}
                </span>
              </div>
            </div>

            <div className="p-6 flex-1 space-y-4">
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">ผู้เช่าปัจจุบัน</div>
                <div className="text-sm font-bold text-slate-700">
                  {house.tenantName || "—"}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">ค่าเช่า</div>
                  <div className="text-sm font-black text-slate-800">{house.monthlyRent.toLocaleString()} ฿</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">น้ำ/ไฟ</div>
                  <div className="text-sm font-black text-slate-800">{(house.waterBill + house.electricBill).toLocaleString()} ฿</div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">สถานะการจ่ายเงิน</span>
                  <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase ${house.paymentStatus === "paid" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                    {house.paymentStatus === "paid" ? "จ่ายแล้ว ✅" : "ค้างชำระ ❌"}
                  </span>
                </div>
                <button
                  onClick={() => togglePayment(house.id)}
                  className={`w-full py-2.5 rounded-xl text-xs font-black transition-all ${
                    house.paymentStatus === "paid"
                      ? "bg-slate-100 text-slate-500 hover:bg-slate-200"
                      : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-600/20"
                  }`}
                >
                  {house.paymentStatus === "paid" ? "ยกเลิกการจ่าย" : "ยืนยันการจ่ายเงิน"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- Edit Modal --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-[scaleUp_0.3s_ease-out]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-black text-slate-800">จัดการข้อมูล: {editingHouse?.name}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">ชื่อผู้เช่า</label>
                <input
                  type="text"
                  value={formData.tenantName}
                  onChange={(e) => setFormData({ ...formData, tenantName: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition outline-none text-sm"
                  placeholder="ปล่อยว่างหากไม่มีผู้เช่า"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">ค่าเช่ารายเดือน (บาท)</label>
                <input
                  type="number"
                  value={formData.monthlyRent}
                  onChange={(e) => setFormData({ ...formData, monthlyRent: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition outline-none text-sm font-bold"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">ค่าน้ำ (บาท)</label>
                  <input
                    type="number"
                    value={formData.waterBill}
                    onChange={(e) => setFormData({ ...formData, waterBill: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">ค่าไฟ (บาท)</label>
                  <input
                    type="number"
                    value={formData.electricBill}
                    onChange={(e) => setFormData({ ...formData, electricBill: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition outline-none text-sm"
                  />
                </div>
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-100 transition"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-3 bg-amber-600 text-white font-bold rounded-xl hover:bg-amber-700 transition shadow-lg shadow-amber-600/20"
              >
                บันทึกข้อมูล
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
