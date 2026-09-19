"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDemoJourneyStore } from "@/shared/stores/demo-journey.store";
import { useUIStore } from "@/shared/stores/ui.store";
import {
  Sparkles,
  Printer,
  QrCode,
  CalendarCheck,
  UserPlus,
  ArrowRight,
  Clock,
  RotateCcw,
  CheckCircle2,
  Building2,
  Home,
  Check,
} from "lucide-react";

export default function CheckInKioskPage() {
  const router = useRouter();
  const { showToast } = useUIStore();
  const { receptionTicket, issueReceptionTicket } = useDemoJourneyStore();

  const [step, setStep] = React.useState<"SELECT_SERVICE" | "INPUT_IDENTIFIER" | "TICKET_ISSUED">("SELECT_SERVICE");
  const [selectedPurpose, setSelectedPurpose] = React.useState<"NEW_EXAM" | "RE_EXAM" | "APPOINTMENT">("NEW_EXAM");
  const [phoneOrCccd, setPhoneOrCccd] = React.useState("0912 345 678");
  const [issuedTicketNumber, setIssuedTicketNumber] = React.useState("A023");

  const [currentTime, setCurrentTime] = React.useState("");

  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }) +
          " • " +
          now.toLocaleDateString("vi-VN", { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric" })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSelectOption = (purpose: "NEW_EXAM" | "RE_EXAM" | "APPOINTMENT") => {
    setSelectedPurpose(purpose);
    setStep("INPUT_IDENTIFIER");
  };

  const handleConfirmIssueTicket = () => {
    const num = "A023";
    setIssuedTicketNumber(num);
    issueReceptionTicket(
      selectedPurpose === "APPOINTMENT" ? "APPOINTMENT" : "KIOSK",
      num
    );
    setStep("TICKET_ISSUED");
    showToast(`Kiosk đã cấp số thứ tự tiếp nhận: ${num}`);
  };

  const handlePrint = () => {
    showToast("Đang in phiếu tiếp đón A023 từ máy in nhiệt Kiosk...");
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-6 md:p-10 max-w-6xl mx-auto w-full">
      {/* Top Kiosk Header */}
      <header className="flex items-center justify-between border-b border-slate-800/80 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 text-white flex items-center justify-center font-black text-2xl shadow-xl shadow-blue-500/20">
            +
          </div>
          <div>
            <div className="text-xl md:text-2xl font-black text-white tracking-tight uppercase">
              Phòng Khám Đa Khoa Quốc Tế Ngọc Khánh
            </div>
            <div className="text-xs md:text-sm text-slate-400 font-medium flex items-center gap-2 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Hệ thống Kiosk tự phục vụ tiếp đón thông minh (Arrival Check-in)</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-xs text-slate-400 font-mono block">{currentTime}</span>
            <span className="text-[11px] font-bold text-blue-400 font-mono">KIOSK #01 — SẢNH TẦNG 1</span>
          </div>
          <Link
            href="/reception"
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-xs font-semibold flex items-center gap-1.5"
            title="Quay lại Bàn Tiếp Nhận Lễ Tân"
          >
            <Home className="w-4 h-4" />
            <span className="hidden md:inline">Quầy Lễ Tân</span>
          </Link>
        </div>
      </header>

      {/* Main Kiosk Content Area */}
      <main className="my-auto py-8">
        {step === "SELECT_SERVICE" && (
          <div className="space-y-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <span className="text-xs font-black uppercase text-blue-400 tracking-widest bg-blue-950/80 px-3 py-1 rounded-full border border-blue-800/60 inline-block">
                BƯỚC 1: XÁC ĐỊNH NHU CẦU ĐẾN KHÁM
              </span>
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                Kính chào Quý khách! Xin mời chọn nhu cầu
              </h1>
              <p className="text-sm text-slate-400">
                Chạm vào màn hình cảm ứng để lấy số thứ tự tiếp nhận tại quầy lễ tân
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {/* Option 1: Khám mới / Walk-in */}
              <button
                type="button"
                onClick={() => handleSelectOption("NEW_EXAM")}
                className="group p-8 rounded-3xl bg-slate-900/90 hover:bg-gradient-to-b hover:from-blue-950/80 hover:to-slate-900 border-2 border-slate-800 hover:border-blue-500 transition-all duration-300 shadow-xl text-left flex flex-col justify-between min-h-[260px] active:scale-95"
              >
                <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-lg">
                  <UserPlus className="w-8 h-8" />
                </div>
                <div className="space-y-2 mt-4">
                  <div className="text-xl font-black text-white group-hover:text-blue-300 transition-colors">
                    1. Khám bệnh mới
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Dành cho bệnh nhân đến khám lần đầu hoặc khám triệu chứng mới phát sinh (Walk-in).
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-blue-400 group-hover:text-white">
                  <span>Chạm để chọn</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              {/* Option 2: Tái khám */}
              <button
                type="button"
                onClick={() => handleSelectOption("RE_EXAM")}
                className="group p-8 rounded-3xl bg-slate-900/90 hover:bg-gradient-to-b hover:from-emerald-950/80 hover:to-slate-900 border-2 border-slate-800 hover:border-emerald-500 transition-all duration-300 shadow-xl text-left flex flex-col justify-between min-h-[260px] active:scale-95"
              >
                <div className="w-16 h-16 rounded-2xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-lg">
                  <CalendarCheck className="w-8 h-8" />
                </div>
                <div className="space-y-2 mt-4">
                  <div className="text-xl font-black text-white group-hover:text-emerald-300 transition-colors">
                    2. Tái khám định kỳ
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Dành cho bệnh nhân tái khám bệnh mãn tính, theo dõi tiến triển hoặc hẹn của bác sĩ.
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-emerald-400 group-hover:text-white">
                  <span>Chạm để chọn</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              {/* Option 3: Đã có lịch hẹn trước */}
              <button
                type="button"
                onClick={() => handleSelectOption("APPOINTMENT")}
                className="group p-8 rounded-3xl bg-slate-900/90 hover:bg-gradient-to-b hover:from-purple-950/80 hover:to-slate-900 border-2 border-slate-800 hover:border-purple-500 transition-all duration-300 shadow-xl text-left flex flex-col justify-between min-h-[260px] active:scale-95"
              >
                <div className="w-16 h-16 rounded-2xl bg-purple-600/20 border border-purple-500/40 text-purple-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-lg">
                  <QrCode className="w-8 h-8" />
                </div>
                <div className="space-y-2 mt-4">
                  <div className="text-xl font-black text-white group-hover:text-purple-300 transition-colors">
                    3. Đã có lịch hẹn
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Quét mã QR trên Zalo OA / Tin nhắn SMS hoặc nhập mã hẹn để check-in ưu tiên.
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-purple-400 group-hover:text-white">
                  <span>Chạm để quét mã</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </div>
          </div>
        )}

        {step === "INPUT_IDENTIFIER" && (
          <div className="max-w-xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="text-center space-y-1">
              <span className="text-xs font-black uppercase text-blue-400 tracking-widest bg-blue-950/80 px-3 py-1 rounded-full border border-blue-800/60 inline-block">
                BƯỚC 2: NHẬP SỐ ĐIỆN THOẠI HOẶC CCCD
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-white">
                Tra cứu nhanh hồ sơ người bệnh
              </h2>
              <p className="text-xs text-slate-400">
                (Có thể bỏ qua bước này nếu Quý khách là bệnh nhân khám mới chưa có thông tin)
              </p>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xl">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-2">
                  Số điện thoại / Căn cước công dân (12 số):
                </label>
                <input
                  type="text"
                  value={phoneOrCccd}
                  onChange={(e) => setPhoneOrCccd(e.target.value)}
                  className="w-full h-14 bg-slate-950 border-2 border-slate-700 rounded-2xl px-4 text-center font-mono text-xl font-black text-blue-400 tracking-wider focus:outline-none focus:border-blue-500"
                  placeholder="0912 345 678"
                />
              </div>

              {/* Demo quick patient pill */}
              <div className="p-3 bg-blue-950/40 border border-blue-800/50 rounded-xl text-xs flex items-center justify-between text-blue-200">
                <span className="flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  Đã nhận diện: Nguyễn Văn An (PT-001842)
                </span>
                <span className="text-[11px] text-slate-400 font-mono">1981 • Nam</span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep("SELECT_SERVICE")}
                  className="h-12 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all"
                >
                  ← Quay lại chọn lại
                </button>
                <button
                  type="button"
                  onClick={handleConfirmIssueTicket}
                  className="h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-black shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
                >
                  <span>Cấp số tiếp nhận ngay</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {step === "TICKET_ISSUED" && (
          <div className="max-w-lg mx-auto space-y-6 text-center animate-in fade-in zoom-in-95 duration-200">
            {/* The Ticket Card */}
            <div className="bg-gradient-to-b from-white to-slate-100 text-slate-900 rounded-3xl p-8 shadow-2xl border-4 border-blue-500 space-y-6 relative overflow-hidden">
              {/* Header inside ticket */}
              <div className="space-y-1 border-b border-slate-200 pb-4">
                <div className="font-black text-xs uppercase tracking-wider text-slate-500">
                  PHÒNG KHÁM ĐA KHOA QUỐC TẾ NGỌC KHÁNH
                </div>
                <div className="text-xs text-slate-600 font-semibold">
                  PHIẾU SỐ THỨ TỰ TIẾP ĐÓN (RECEPTION TICKET)
                </div>
              </div>

              {/* Huge Ticket Number */}
              <div className="space-y-2">
                <span className="text-xs font-black uppercase text-blue-700 tracking-widest bg-blue-100 px-3 py-1 rounded-full inline-block">
                  SỐ TIẾP NHẬN CỦA QUÝ KHÁCH
                </span>
                <div className="font-mono text-6xl md:text-7xl font-black text-blue-900 tracking-wider">
                  {issuedTicketNumber}
                </div>
                <div className="text-xs text-slate-500 font-semibold">
                  (Số chờ lễ tân tiếp nhận ban đầu • Chưa phải số phòng khám bác sĩ)
                </div>
              </div>

              {/* Status info */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs space-y-2 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Hiện đang phục vụ:</span>
                  <span className="font-mono font-black text-emerald-700 text-sm">A022 (Quầy 01)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Số lượng đang chờ trước:</span>
                  <span className="font-bold text-slate-800">1 người (~ 2-3 phút)</span>
                </div>
                <div className="flex items-center justify-between border-t border-slate-200/60 pt-2">
                  <span className="text-slate-500">Người bệnh:</span>
                  <span className="font-bold text-slate-900 uppercase">Nguyễn Văn An (PT-001842)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Khu vực chờ:</span>
                  <span className="font-bold text-blue-800">Sảnh Chờ Tiếp Đón — Tầng 1</span>
                </div>
              </div>

              {/* Instructions */}
              <div className="text-xs text-slate-600 italic">
                Xin Quý khách vui lòng ngồi nghỉ tại sảnh và chú ý theo dõi bảng điện tử gọi số tại Quầy tiếp đón.
              </div>

              {/* Action Buttons inside ticket */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="flex-1 h-12 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  In phiếu giấy
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/reception")}
                  className="flex-1 h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-500/25 transition-colors"
                >
                  <span>Mở bàn lễ tân ({issuedTicketNumber})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setStep("SELECT_SERVICE")}
              className="text-xs font-semibold text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Lấy số cho người đi cùng / Thao tác lại
            </button>
          </div>
        )}
      </main>

      {/* Kiosk Footer */}
      <footer className="border-t border-slate-800/80 pt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-slate-600" />
          <span>ClinicOne HIS • Module Kiosk Arrival Check-in (Màn hình cảm ứng tự phục vụ)</span>
        </div>
        <div className="flex items-center gap-3">
          <span>Hỗ trợ kỹ thuật: 1900 6868</span>
          <span>•</span>
          <Link href="/reception" className="text-blue-400 hover:underline">
            Chuyển về Giao diện Nhân viên Lễ tân →
          </Link>
        </div>
      </footer>
    </div>
  );
}
