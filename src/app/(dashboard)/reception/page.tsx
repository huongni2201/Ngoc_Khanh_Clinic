"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { PageHeader } from "@/shared/components/page-header";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Input } from "@/shared/ui/input";
import { VietQRCard } from "@/shared/components/vietqr-card";
import { useDemoClinicFlowStore } from "@/shared/stores/demo-clinic-flow.store";
import { useUIStore } from "@/shared/stores/ui.store";
import { MOCK_PATIENTS, MockPatient } from "@/shared/constants/mock-data";
import { formatCurrencyVND } from "@/shared/lib/formatters";
import {
  UserPlus,
  Search,
  CheckCircle2,
  Users,
  ShieldAlert,
  Printer,
  CreditCard,
  QrCode,
  Banknote,
  Stethoscope,
  ArrowRight,
  Sparkles,
  Activity,
  Phone,
  AlertCircle,
  FileCheck,
} from "lucide-react";

function ReceptionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useUIStore();

  const {
    activePatientId,
    patientName,
    patientCode,
    encounterCode,
    journeyStage,
    initialExamFeePaid,
    selectPatient,
    createEncounter,
    confirmInitialExamPayment,
  } = useDemoClinicFlowStore();

  // Search query state
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedPatient, setSelectedPatient] = React.useState<MockPatient | null>(() => {
    return MOCK_PATIENTS.find((p) => p.id === activePatientId) || MOCK_PATIENTS[0];
  });

  // Intake Form states
  const [reason, setReason] = React.useState("Chóng mặt, đau đầu từng cơn khi đổi tư thế 3 ngày nay");
  const [department, setDepartment] = React.useState("Nội tổng quát");
  const [roomCode, setRoomCode] = React.useState("P.203");
  const [doctorName, setDoctorName] = React.useState("BS. Lê Minh");
  const [paymentMethod, setPaymentMethod] = React.useState<"CASH" | "VIETQR" | "POS">("CASH");
  const [isSuccessSubmitted, setIsSuccessSubmitted] = React.useState(false);

  // Sync from URL search params (e.g. from Patient Search Table "?patient=PT-001842")
  React.useEffect(() => {
    const patientParam = searchParams.get("patient");
    if (patientParam) {
      const found = MOCK_PATIENTS.find(
        (p) => p.patientCode === patientParam || p.id === patientParam
      );
      if (found) {
        setSelectedPatient(found);
        selectPatient(found.id);
      }
    }
  }, [searchParams, selectPatient]);

  // Filtered patients for search
  const filteredPatients = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return MOCK_PATIENTS.filter(
      (p) =>
        p.fullName.toLowerCase().includes(q) ||
        p.phone.includes(q) ||
        p.identityCard.includes(q) ||
        p.patientCode.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const handleSelectPatient = (patient: MockPatient) => {
    setSelectedPatient(patient);
    selectPatient(patient.id);
    setSearchQuery("");
    setIsSuccessSubmitted(false);
    showToast(`Đã chọn bệnh nhân: ${patient.fullName} (${patient.patientCode})`);
  };

  const handleConfirmIntakeAndPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    // 1. Create Encounter in shared store
    createEncounter({
      patientId: selectedPatient.id,
      department,
      roomCode,
      doctorName,
      chiefComplaint: reason,
    });

    // 2. Confirm initial consultation fee
    confirmInitialExamPayment(paymentMethod);

    setIsSuccessSubmitted(true);
    showToast(`Tiếp nhận thành công! Đã thu 150.000 đ phí khám cho bệnh nhân ${selectedPatient.fullName}.`);
  };

  const handleResetForNext = () => {
    setIsSuccessSubmitted(false);
    setReason("Chóng mặt, đau đầu");
    setSearchQuery("");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="BÀN LỄ TÂN & TIẾP NHẬN BỆNH NHÂN (FRONT DESK)"
        title="Tiếp nhận & Thu phí khám ban đầu"
        description="Đăng ký lượt khám ngoại trú, phân luồng phòng bác sĩ và xác nhận thu phí khám lâm sàng ban đầu (150.000 đ)"
        action={
          <div className="flex items-center gap-2">
            <Link href="/patients/new">
              <Button variant="outline" size="sm" className="font-bold text-xs border-slate-300">
                <UserPlus className="w-3.5 h-3.5 mr-1 text-clinic-blue" />
                Tạo hồ sơ bệnh nhân mới
              </Button>
            </Link>
            <Link href="/clinical">
              <Button size="sm" className="font-bold text-xs bg-clinic-blue text-white">
                Mở hàng đợi Bác sĩ →
              </Button>
            </Link>
          </div>
        }
      />

      {/* Success State Card */}
      {isSuccessSubmitted ? (
        <Card className="border-emerald-300 bg-emerald-50/90 text-emerald-950 p-6 shadow-xl animate-in zoom-in-95 space-y-5">
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                  TIẾP NHẬN & THANH TOÁN THÀNH CÔNG
                </span>
                <h2 className="text-xl font-black text-emerald-950 uppercase mt-1">
                  {selectedPatient?.fullName}
                </h2>
                <div className="text-xs text-emerald-900 font-mono mt-0.5">
                  Mã BN: <b>{selectedPatient?.patientCode}</b> • CCCD: {selectedPatient?.identityCard} • {selectedPatient?.phone}
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-emerald-700 block">MÃ LƯỢT KHÁM (ENCOUNTER):</span>
              <span className="font-mono text-xl font-black text-clinic-blue">{encounterCode}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-xl border border-emerald-200 text-xs">
            <div>
              <span className="text-slate-500 block font-semibold">Phòng khám chỉ định:</span>
              <span className="font-bold text-base text-slate-900">{roomCode} — {department}</span>
              <span className="text-[11px] text-slate-600 block mt-0.5">Bác sĩ: <b>{doctorName}</b></span>
            </div>
            <div>
              <span className="text-slate-500 block font-semibold">Lý do vào khám:</span>
              <span className="font-bold text-slate-800">{reason}</span>
            </div>
            <div>
              <span className="text-slate-500 block font-semibold">Phí khám ban đầu:</span>
              <span className="font-mono text-base font-black text-emerald-700">150.000 đ</span>
              <span className="text-[11px] text-emerald-800 font-bold block mt-0.5">
                ✓ Đã thanh toán ({paymentMethod === "VIETQR" ? "VietQR" : paymentMethod === "POS" ? "Thẻ POS" : "Tiền mặt"})
              </span>
            </div>
          </div>

          <div className="p-3.5 bg-blue-50/80 rounded-xl border border-blue-200 text-xs text-blue-900 leading-relaxed flex items-center gap-2.5">
            <Stethoscope className="w-5 h-5 text-clinic-blue shrink-0" />
            <span>
              Người bệnh đã được chuyển vào <b>Danh sách chờ khám</b> của <b>{doctorName} ({roomCode})</b>. Vui lòng hướng dẫn bệnh nhân di chuyển tới trước cửa phòng {roomCode}.
            </span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-emerald-200 flex-wrap gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleResetForNext}
              className="text-xs font-bold border-emerald-400 text-emerald-900 hover:bg-emerald-100 bg-white"
            >
              + Tiếp nhận bệnh nhân khác
            </Button>

            <div className="flex items-center gap-2">
              <Link href={`/patients/${selectedPatient?.id}`}>
                <Button variant="outline" size="sm" className="text-xs font-bold bg-white text-slate-800">
                  Xem hồ sơ bệnh nhân
                </Button>
              </Link>
              <Link href="/clinical">
                <Button size="sm" className="font-bold text-xs bg-emerald-700 hover:bg-emerald-800 text-white shadow-md">
                  <span>Mở danh sách chờ Bác sĩ (P.203)</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      ) : null}

      {/* Main Intake Layout (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Patient Search & Demographics (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Patient Search Card */}
          <Card className="border-slate-200 shadow-sm bg-white">
            <CardHeader className="p-4 bg-slate-50/80 border-b border-slate-200">
              <span className="text-[10px] font-black uppercase text-clinic-blue tracking-wider">
                10.1 TÌM KIẾM BỆNH NHÂN
              </span>
              <CardTitle className="text-sm font-bold text-slate-900">
                Tìm kiếm theo Họ tên / SĐT / CCCD / Mã BN
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Nhập tên, số điện thoại, CCCD hoặc mã BN..."
                  className="pl-9 text-xs font-medium"
                />
              </div>

              {/* Quick Search Results Dropdown */}
              {searchQuery.trim() && (
                <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 bg-white shadow-lg max-h-56 overflow-y-auto">
                  {filteredPatients.length === 0 ? (
                    <div className="p-3 text-center text-xs text-slate-500 italic">
                      Không tìm thấy bệnh nhân phù hợp. Có thể tạo mới hồ sơ.
                    </div>
                  ) : (
                    filteredPatients.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => handleSelectPatient(p)}
                        className="p-2.5 hover:bg-blue-50 cursor-pointer flex items-center justify-between text-xs transition-colors"
                      >
                        <div>
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            <span>{p.fullName}</span>
                            <span className="font-mono text-[10px] text-blue-700 bg-blue-50 px-1 rounded">
                              {p.patientCode}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {p.gender === "MALE" ? "Nam" : "Nữ"}, {p.age}T • {p.phone} • CCCD: {p.identityCard}
                          </div>
                        </div>
                        <Button size="sm" variant="ghost" className="h-7 text-xs text-clinic-blue font-bold">
                          Chọn
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Quick Preset Patient Selector */}
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1.5">
                  BỆNH NHÂN DEMO CHUẨN:
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleSelectPatient(MOCK_PATIENTS[0])}
                    className={`flex-1 p-2 rounded-lg border text-left text-xs transition-all ${
                      selectedPatient?.id === "p1"
                        ? "bg-blue-50 border-clinic-blue ring-1 ring-clinic-blue text-clinic-blue font-bold"
                        : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700"
                    }`}
                  >
                    <div className="font-bold">Nguyễn Văn An</div>
                    <div className="text-[10px] opacity-80 font-mono">PT-001842 • 45T</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectPatient(MOCK_PATIENTS[1])}
                    className={`flex-1 p-2 rounded-lg border text-left text-xs transition-all ${
                      selectedPatient?.id === "p2"
                        ? "bg-blue-50 border-clinic-blue ring-1 ring-clinic-blue text-clinic-blue font-bold"
                        : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700"
                    }`}
                  >
                    <div className="font-bold">Nguyễn Văn Ân</div>
                    <div className="text-[10px] opacity-80 font-mono">PT-004910 • 46T</div>
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Selected Patient Information Card */}
          {selectedPatient && (
            <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
              <CardHeader className="p-4 bg-slate-50/80 border-b border-slate-200 flex flex-row items-center justify-between">
                <span className="text-[10px] font-black uppercase text-slate-700 tracking-wider">
                  HỒ SƠ BỆNH NHÂN TIẾP NHẬN
                </span>
                <Badge variant="success" className="font-bold text-[10px]">
                  ĐÃ XÁC THỰC
                </Badge>
              </CardHeader>
              <CardContent className="p-4 space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="font-black text-base text-slate-900 uppercase">
                      {selectedPatient.fullName}
                    </h3>
                    <div className="text-slate-500 font-mono mt-0.5">
                      Mã BN: <b className="text-clinic-blue">{selectedPatient.patientCode}</b> • CCCD: {selectedPatient.identityCard}
                    </div>
                  </div>
                  <div className="text-right text-slate-600">
                    <div>{selectedPatient.gender === "MALE" ? "Nam" : "Nữ"}</div>
                    <div className="font-semibold">{selectedPatient.age} tuổi ({selectedPatient.dateOfBirth})</div>
                  </div>
                </div>

                {/* Penicillin Allergy Warning */}
                {selectedPatient.allergies.length > 0 && (
                  <div className="p-3 bg-red-50 border-2 border-red-300 rounded-xl space-y-1">
                    <div className="flex items-center gap-1.5 font-black text-red-700 text-xs uppercase">
                      <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
                      CẢNH BÁO DỊ ỨNG NGUY HIỂM:
                    </div>
                    {selectedPatient.allergies.map((a, idx) => (
                      <div key={idx} className="text-xs text-red-900 leading-snug">
                        <b>{a.substance}</b> ({a.severity}) — {a.note}
                      </div>
                    ))}
                  </div>
                )}

                {/* Chronic & Vitals */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-slate-700">
                  <div>
                    <b>Bệnh nền: </b>{selectedPatient.chronicConditions.join(" • ") || "Không ghi nhận"}
                  </div>
                  <div>
                    <b>Thuốc thường dùng: </b>{selectedPatient.regularMedications.join(" • ") || "Không"}
                  </div>
                  {selectedPatient.latestVitals && (
                    <div className="pt-1 flex items-center gap-3">
                      <span>Huyết áp gần nhất: <b className="text-red-600 font-mono">{selectedPatient.latestVitals.bloodPressure}</b></span>
                      <span>Nhịp tim: <b className="text-slate-900 font-mono">{selectedPatient.latestVitals.heartRate} ck/p</b></span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column: Encounter Information & Initial Consultation Fee (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          <Card className="border-slate-200 shadow-sm bg-white">
            <CardHeader className="p-4 bg-slate-50/80 border-b border-slate-200">
              <span className="text-[10px] font-black uppercase text-clinic-blue tracking-wider">
                10.2 & 10.3 THÔNG TIN KHÁM & THU PHÍ BAN ĐẦU
              </span>
              <CardTitle className="text-sm font-bold text-slate-900">
                Chỉ định phòng khám & Xác nhận thu phí khám
              </CardTitle>
            </CardHeader>

            <form onSubmit={handleConfirmIntakeAndPayment}>
              <CardContent className="p-5 space-y-4 text-xs">
                {/* Reason */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-800 block">
                    Lý do vào khám & Triệu chứng chính: <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    required
                    className="text-xs font-semibold"
                    placeholder="Nhập triệu chứng chính của người bệnh..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Department */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-800 block">
                      Chuyên khoa khám: <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg border border-slate-300 bg-white text-xs font-bold text-slate-900 focus:ring-2 focus:ring-clinic-blue outline-none"
                    >
                      <option value="Nội tổng quát">Nội Tổng Quát (Chuyên khoa)</option>
                      <option value="Tim mạch">Tim Mạch & Huyết Áp</option>
                      <option value="Tiêu hóa">Tiêu Hóa & Gan Mật</option>
                      <option value="Tai Mũi Họng">Tai Mũi Họng</option>
                    </select>
                  </div>

                  {/* Room & Doctor */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-800 block">
                      Phòng khám & Bác sĩ: <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={roomCode}
                      onChange={(e) => {
                        setRoomCode(e.target.value);
                        if (e.target.value === "P.203") setDoctorName("BS. Lê Minh");
                        else if (e.target.value === "P.204") setDoctorName("BS. Trần Thu Hà");
                        else setDoctorName("BS. Nguyễn Quốc Tuấn");
                      }}
                      className="w-full h-10 px-3 rounded-lg border border-slate-300 bg-white text-xs font-bold text-slate-900 focus:ring-2 focus:ring-clinic-blue outline-none"
                    >
                      <option value="P.203">P.203 — BS. Lê Minh (Nội tổng quát)</option>
                      <option value="P.204">P.204 — BS. Trần Thu Hà (Tim mạch)</option>
                      <option value="P.205">P.205 — BS. Nguyễn Quốc Tuấn (Tiêu hóa)</option>
                    </select>
                  </div>
                </div>

                {/* Section 10.3: Initial Consultation Fee Box */}
                <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider block">
                        PHÍ KHÁM LÂM SÀNG BAN ĐẦU
                      </span>
                      <span className="text-sm font-bold text-white">
                        Khám {department} ({roomCode})
                      </span>
                    </div>
                    <span className="font-mono text-xl font-black text-emerald-400">
                      150.000 đ
                    </span>
                  </div>

                  {/* Payment Method Selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300 block">
                      Chọn phương thức thanh toán phí khám:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("CASH")}
                        className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                          paymentMethod === "CASH"
                            ? "bg-blue-600 text-white border-blue-400 shadow-md ring-2 ring-blue-400/30"
                            : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                        }`}
                      >
                        <Banknote className="w-4 h-4" />
                        <span className="font-bold text-xs">TIỀN MẶT</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod("VIETQR")}
                        className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                          paymentMethod === "VIETQR"
                            ? "bg-blue-600 text-white border-blue-400 shadow-md ring-2 ring-blue-400/30"
                            : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                        }`}
                      >
                        <QrCode className="w-4 h-4" />
                        <span className="font-bold text-xs">VIETQR</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod("POS")}
                        className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                          paymentMethod === "POS"
                            ? "bg-blue-600 text-white border-blue-400 shadow-md ring-2 ring-blue-400/30"
                            : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                        }`}
                      >
                        <CreditCard className="w-4 h-4" />
                        <span className="font-bold text-xs">THẺ POS</span>
                      </button>
                    </div>
                  </div>

                  {/* VietQR Preview if selected */}
                  {paymentMethod === "VIETQR" && (
                    <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-300">Quét mã VietQR Napas247:</span>
                        <span className="font-mono text-emerald-400 font-bold">150.000 đ</span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        Nội dung: PHIKHAM {selectedPatient?.patientCode} {selectedPatient?.fullName}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>

              <CardFooter className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  Sau khi xác nhận, người bệnh sẽ chuyển sang trạng thái <b>Chờ bác sĩ khám</b>
                </span>
                <Button
                  type="submit"
                  size="sm"
                  className="font-bold text-xs bg-clinic-blue hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 h-11 px-6"
                >
                  <CheckCircle2 className="w-4 h-4 mr-1.5" />
                  Xác nhận tiếp nhận & Thu phí khám (150.000 đ) →
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function ReceptionPage() {
  return (
    <React.Suspense
      fallback={
        <div className="p-8 text-center text-xs text-slate-500 font-semibold">
          Đang tải phân hệ Lễ tân & Thu phí khám...
        </div>
      }
    >
      <ReceptionContent />
    </React.Suspense>
  );
}
