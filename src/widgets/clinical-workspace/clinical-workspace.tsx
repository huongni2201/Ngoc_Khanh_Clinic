"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUIStore } from "@/shared/stores/ui.store";
import { useWorkspaceStore } from "@/shared/stores/workspace.store";
import { useDemoJourneyStore } from "@/shared/stores/demo-journey.store";
import { MOCK_ACTIVE_ENCOUNTER, MOCK_LAB_RESULTS, MOCK_ECG_RESULT } from "@/shared/constants/mock-data";
import { formatCurrencyVND } from "@/shared/lib/formatters";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Input } from "@/shared/ui/input";
import {
  Printer,
  Receipt,
  Plus,
  PlusCircle,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  FlaskConical,
  Activity,
  FileCheck,
  QrCode,
  ArrowRight,
  ShieldAlert,
  Stethoscope,
  ClipboardList,
  Calendar,
  Check,
  Clock,
  Sparkles,
  Layers,
} from "lucide-react";

export function ClinicalWorkspace() {
  const router = useRouter();
  const { openPrintModal, showToast } = useUIStore();
  const {
    activeTab,
    setActiveTab,
    orderRound,
    orders,
    openServicePicker,
    removeOrder,
    createNewRound,
    getTotalCLSAmount,
  } = useWorkspaceStore();

  const {
    patientName,
    patientCode,
    encounterCode,
    isPrescriptionIssued,
    rxCode,
    isAppointmentBooked,
    appointmentCode,
    labStatus,
    imagingStatus,
    issuePrescription,
    bookAppointment,
    completeEncounter,
  } = useDemoJourneyStore();

  const encounter = MOCK_ACTIVE_ENCOUNTER;

  const round1Orders = orders.filter((o) => o.round === 1);
  const round2Orders = orders.filter((o) => o.round === 2);
  const round1Total = round1Orders.reduce((sum, o) => sum + o.price, 0);
  const round2Total = round2Orders.reduce((sum, o) => sum + o.price, 0);
  const totalCLS = getTotalCLSAmount();

  const [notes, setNotes] = React.useState(encounter.clinicalNotes);
  const [chiefComplaint, setChiefComplaint] = React.useState(encounter.chiefComplaint);
  const [finalDiagnosis, setFinalDiagnosis] = React.useState("I10 - Tăng huyết áp nguyên phát / Rối loạn tuần hoàn não do xơ vữa");
  const [finalConclusion, setFinalConclusion] = React.useState(
    "Cơn tăng huyết áp giai đoạn 2 có biến đổi dày thất trái trên ECG. Đáp ứng kiểm soát tốt với thuốc phối hợp hạ áp và điều chỉnh lối sống. Hẹn tái khám sau 4 tuần hoặc khi có dấu hiệu bất thường."
  );

  const handleIssuePrescription = () => {
    issuePrescription();
    showToast(`Đã ký duyệt phát hành Đơn thuốc điện tử mã ${rxCode}!`);
  };

  const handleBookAppointment = () => {
    bookAppointment();
    showToast("Đã lập lịch hẹn tái khám ngày 17/10/2026 và tự động lên lịch nhắc qua Zalo OA!");
  };

  const handleFinishVisit = () => {
    completeEncounter();
    showToast(`Đã hoàn tất toàn bộ ca khám ${encounterCode}! Hồ sơ đã lưu trữ vào Cổng thông tin người bệnh.`);
    router.push("/clinical");
  };

  return (
    <div className="space-y-6">
      {/* 4 Primary Clinical Tabs */}
      <div className="flex items-center bg-slate-200/80 p-1 rounded-2xl border border-slate-300 max-w-2xl">
        <button
          type="button"
          onClick={() => setActiveTab("EXAM")}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === "EXAM"
              ? "bg-white text-clinic-blue shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Stethoscope className="w-3.5 h-3.5" />
          <span>1. Khám lâm sàng</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("ORDERS")}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === "ORDERS"
              ? "bg-white text-clinic-blue shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <FlaskConical className="w-3.5 h-3.5" />
          <span>2. Chỉ định CLS</span>
          <span className="px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-800 text-[10px] font-mono">
            {orders.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("RESULTS")}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === "RESULTS"
              ? "bg-white text-clinic-blue shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>3. Kết quả CLS</span>
          <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold">
            3/3 KQ
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("CONCLUSION")}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === "CONCLUSION"
              ? "bg-white text-clinic-blue shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <FileCheck className="w-3.5 h-3.5" />
          <span>4. Kết luận & Đơn</span>
        </button>
      </div>

      {/* TAB 1: KHÁM LÂM SÀNG & SINH HIỆU */}
      {activeTab === "EXAM" && (
        <Card className="border-slate-200 shadow-sm bg-white animate-in fade-in duration-150">
          <CardHeader className="bg-slate-50/80 p-4 border-b border-slate-200 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-clinic-blue" />
              <CardTitle className="text-sm font-bold text-slate-800">
                1. Khám lâm sàng & Sinh hiệu tại phòng khám (P.203)
              </CardTitle>
            </div>
            <span className="text-xs text-slate-500 font-mono">BS. Lê Minh • 17/09/2026 08:35</span>
          </CardHeader>

          <CardContent className="p-5 space-y-4">
            {/* Vitals Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-600 font-bold uppercase block">Huyết áp tại chỗ</span>
                <span className="text-base font-black text-red-600 font-mono">148/92 mmHg</span>
                <span className="text-[10px] text-red-500 block">Tăng độ 2</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-600 font-bold uppercase block">Nhịp tim</span>
                <span className="text-base font-bold text-slate-900 font-mono">84 ck/phút</span>
                <span className="text-[10px] text-emerald-600 block">Đều</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-600 font-bold uppercase block">Nhiệt độ</span>
                <span className="text-base font-bold text-slate-900 font-mono">36.8 °C</span>
                <span className="text-[10px] text-slate-500 block">Bình thường</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-600 font-bold uppercase block">SpO2</span>
                <span className="text-base font-bold text-slate-900 font-mono">98%</span>
                <span className="text-[10px] text-emerald-600 block">Khí phòng</span>
              </div>
            </div>

            {/* Complaint and Notes */}
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Lý do vào khám & Bệnh sử:
                </label>
                <Input
                  value={chiefComplaint}
                  onChange={(e) => setChiefComplaint(e.target.value)}
                  className="text-xs font-semibold"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Khám lâm sàng và ghi chú triệu chứng thực thể:
                </label>
                <textarea
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-3 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-clinic-blue transition-all"
                />
              </div>
            </div>

            {/* ICD-10 Preliminary Diagnosis */}
            <div className="p-3.5 bg-blue-50/80 border border-blue-200 rounded-xl text-xs space-y-1">
              <span className="font-bold text-blue-900 uppercase tracking-wide text-[10px] block">
                CHẨN ĐOÁN SƠ BỘ BAN ĐẦU (ICD-10):
              </span>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-blue-600 text-white font-mono font-bold rounded text-xs">
                  {encounter.icdCode}
                </span>
                <span className="font-bold text-slate-900 text-xs">{encounter.icdName}</span>
              </div>
            </div>
          </CardContent>

          <CardFooter className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
            <Button
              size="sm"
              onClick={() => setActiveTab("ORDERS")}
              className="font-bold text-xs bg-clinic-blue hover:bg-blue-700 text-white"
            >
              <span>Chuyển sang: Chỉ định Cận lâm sàng</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* TAB 2: CHỈ ĐỊNH CẬN LÂM SÀNG (MULTIPLE ORDER ROUNDS) */}
      {activeTab === "ORDERS" && (
        <Card className="border-slate-200 shadow-sm bg-white animate-in fade-in duration-150">
          <CardHeader className="bg-slate-50/80 p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-purple-600" />
              <div>
                <CardTitle className="text-sm font-bold text-slate-800">
                  2. Chỉ định Cận lâm sàng đa đợt (Multiple Order Rounds)
                </CardTitle>
                <p className="text-[11px] text-slate-500">
                  Phân bổ phòng thực hiện, xuất in phiếu lộ trình di chuyển và hóa đơn tạm thu VietQR
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="purple" className="font-mono font-bold text-xs">
                {orderRound >= 2 ? `2 Đợt chỉ định (Round 1 & 2)` : `Đợt 1 (Round 1)`}
              </Badge>
              {orderRound < 2 && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    createNewRound();
                    showToast("Đã kích hoạt Đợt 2 (Chỉ định bổ sung sau khi hội chẩn).");
                  }}
                  className="h-7 text-xs font-bold border-purple-300 text-purple-700 hover:bg-purple-50 shadow-xs"
                >
                  <PlusCircle className="w-3.5 h-3.5 mr-1 text-purple-600" />
                  + Khởi tạo Đợt 2 (Bổ sung)
                </Button>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-5 space-y-5">
            {/* ROUND 1 SECTION */}
            <div className="border border-blue-200 rounded-2xl overflow-hidden bg-slate-50/40">
              <div className="px-4 py-2.5 bg-blue-50/90 border-b border-blue-200 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                    1
                  </span>
                  <span className="font-bold text-xs text-blue-950">
                    Đợt 1 — Chỉ định Thường quy Ban đầu
                  </span>
                  <Badge variant="secondary" className="text-[10px] bg-blue-100 text-blue-800 font-bold">
                    {round1Orders.length} dịch vụ
                  </Badge>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-slate-700">
                    Tổng đợt 1: <b className="text-blue-900">{formatCurrencyVND(round1Total)}</b>
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openServicePicker(1)}
                    className="h-6 px-2 text-[11px] font-bold border-blue-300 text-blue-700 hover:bg-blue-100 bg-white"
                  >
                    <Plus className="w-3 h-3 mr-0.5" />
                    Thêm dịch vụ Đợt 1
                  </Button>
                </div>
              </div>

              <div className="p-3 space-y-2">
                {round1Orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-3 text-xs shadow-xs"
                  >
                    <div className="space-y-0.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-slate-800 font-bold bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                          {ord.serviceCode}
                        </span>
                        <span className="font-bold text-slate-900">{ord.serviceName}</span>
                      </div>
                      <div className="text-[11px] text-slate-600 flex items-center gap-2 flex-wrap">
                        <span>
                          Địa điểm: <b className="text-clinic-blue font-bold">{ord.roomName}</b> ({ord.roomCode} — {ord.floor})
                        </span>
                        {ord.preparationInstructions && (
                          <span className="text-slate-500 italic truncate max-w-md">
                            • {ord.preparationInstructions}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-mono font-bold text-slate-900 text-xs">
                        {formatCurrencyVND(ord.price)}
                      </span>
                      <Badge
                        variant={ord.paymentAuthorizationStatus === "AUTHORIZED" ? "success" : "warn"}
                        className="text-[10px] font-bold"
                      >
                        {ord.paymentAuthorizationStatus === "AUTHORIZED" ? "ĐÃ THANH TOÁN (AUTHORIZED)" : "CHỜ THANH TOÁN"}
                      </Badge>
                      <button
                        type="button"
                        onClick={() => {
                          removeOrder(ord.id);
                          showToast(`Đã xóa [${ord.serviceCode}]`);
                        }}
                        className="p-1 rounded text-slate-400 hover:text-red-600 transition-colors"
                        title="Xóa chỉ định này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ROUND 2 SECTION (IF ACTIVATED) */}
            {orderRound >= 2 && (
              <div className="border border-purple-200 rounded-2xl overflow-hidden bg-purple-50/20">
                <div className="px-4 py-2.5 bg-purple-50/80 border-b border-purple-200 flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center">
                      2
                    </span>
                    <span className="font-bold text-xs text-purple-950">
                      Đợt 2 — Chỉ định Bổ sung
                    </span>
                    <Badge variant="purple" className="text-[10px]">
                      {round2Orders.length} dịch vụ
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-slate-700">
                      Tổng đợt 2: <b className="text-purple-900">{formatCurrencyVND(round2Total)}</b>
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openServicePicker(2)}
                      className="h-6 px-2 text-[11px] font-bold border-purple-300 text-purple-700 hover:bg-purple-100 bg-white"
                    >
                      <Plus className="w-3 h-3 mr-0.5" />
                      Thêm dịch vụ Đợt 2
                    </Button>
                  </div>
                </div>

                <div className="p-3 space-y-2">
                  {round2Orders.length === 0 ? (
                    <div className="text-center py-4 text-xs text-slate-400 italic">
                      Chưa có dịch vụ nào trong Đợt 2. Bấm "+ Thêm dịch vụ Đợt 2" để chọn.
                    </div>
                  ) : (
                    round2Orders.map((ord) => (
                      <div
                        key={ord.id}
                        className="p-3 bg-white border border-purple-200 rounded-xl flex items-center justify-between gap-3 text-xs shadow-xs"
                      >
                        <div className="space-y-0.5 flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-purple-900 font-bold bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200">
                              {ord.serviceCode}
                            </span>
                            <span className="font-bold text-slate-900">{ord.serviceName}</span>
                          </div>
                          <div className="text-[11px] text-slate-600">
                            Địa điểm: <b>{ord.roomName}</b> ({ord.roomCode} — {ord.floor})
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <span className="font-mono font-bold text-slate-900">
                            {formatCurrencyVND(ord.price)}
                          </span>
                          <Badge variant="warn" className="text-[10px] font-bold">
                            CHỜ THANH TOÁN (GATE)
                          </Badge>
                          <button
                            type="button"
                            onClick={() => removeOrder(ord.id)}
                            className="p-1 rounded text-slate-400 hover:text-red-600"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Medical Print Triggers Bar */}
            <div className="p-4 bg-slate-900 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <div>
                <div className="font-black text-sm">XUẤT BIỂU MẪU Y TẾ CHO BỆNH NHÂN</div>
                <div className="text-slate-300 mt-0.5">
                  Tổng chi phí CLS: <b className="text-blue-400 font-mono">{formatCurrencyVND(totalCLS)}</b> (Chưa tính công khám 150.000đ)
                </div>
              </div>

              <div className="flex items-center gap-2.5 flex-wrap">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openPrintModal("routing")}
                  className="font-bold text-xs bg-white text-slate-900 hover:bg-slate-100 h-9"
                >
                  <Printer className="w-3.5 h-3.5 mr-1.5 text-clinic-blue" />
                  In Phiếu chỉ định CLS & Lộ trình phòng
                </Button>

                <Button
                  size="sm"
                  onClick={() => openPrintModal("invoice")}
                  className="font-bold text-xs bg-blue-600 hover:bg-blue-700 text-white h-9"
                >
                  <Receipt className="w-3.5 h-3.5 mr-1.5" />
                  Xuất Hóa đơn tạm thu (VietQR)
                </Button>
              </div>
            </div>
          </CardContent>

          <CardFooter className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between">
            <Button size="sm" variant="ghost" onClick={() => setActiveTab("EXAM")} className="text-xs">
              ← Quay lại Khám lâm sàng
            </Button>
            <Button
              size="sm"
              onClick={() => setActiveTab("RESULTS")}
              className="font-bold text-xs bg-clinic-blue hover:bg-blue-700 text-white"
            >
              <span>Xem Kết quả cận lâm sàng</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* TAB 3: KẾT QUẢ CẬN LÂM SÀNG (AUTO-RETURNED RESULTS) */}
      {activeTab === "RESULTS" && (
        <Card className="border-slate-200 shadow-sm bg-white animate-in fade-in duration-150">
          <CardHeader className="bg-emerald-50/70 p-4 border-b border-emerald-200 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <div>
                <CardTitle className="text-sm font-bold text-emerald-950">
                  3. Kết quả Cận lâm sàng tự động trả về (Auto-Returned Results)
                </CardTitle>
                <p className="text-[11px] text-emerald-800">
                  Dữ liệu đồng bộ trực tiếp từ máy xét nghiệm và thăm dò chức năng. Bác sĩ xem ngay tại chỗ.
                </p>
              </div>
            </div>
            <Badge variant="success" className="font-bold text-xs">
              ĐÃ ĐỦ 3/3 KẾT QUẢ
            </Badge>
          </CardHeader>

          <CardContent className="p-5 space-y-6">
            {/* Blood Test Results Table */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
              <div className="p-3 bg-slate-100/70 border-b border-slate-200 font-bold text-xs text-slate-800 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <FlaskConical className="w-3.5 h-3.5 text-purple-600" />
                  XÉT NGHIỆM HUYẾT HỌC & HÓA SINH (P.202 — KTV. Nguyễn Đức Hải duyệt)
                </span>
                <span className="text-emerald-700 font-bold">✓ Đã duyệt Final</span>
              </div>

              <table className="w-full text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                  <tr>
                    <th className="p-2.5 text-left">Chỉ số xét nghiệm</th>
                    <th className="p-2.5 text-center">Kết quả</th>
                    <th className="p-2.5 text-center">Đơn vị</th>
                    <th className="p-2.5 text-center">Khoảng tham chiếu</th>
                    <th className="p-2.5 text-right">Đánh giá</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {MOCK_LAB_RESULTS[0].analytes.map((item, idx) => (
                    <tr key={idx} className={item.isAbnormal ? "bg-red-50/70 font-medium" : "hover:bg-slate-50"}>
                      <td className="p-2.5 font-bold text-slate-800">{item.name}</td>
                      <td className={`p-2.5 text-center font-bold font-mono ${item.isAbnormal ? "text-red-600 text-sm" : "text-slate-900"}`}>
                        {item.value}
                      </td>
                      <td className="p-2.5 text-center text-slate-500">{item.unit}</td>
                      <td className="p-2.5 text-center text-slate-600 font-mono">{item.refRange}</td>
                      <td className="p-2.5 text-right">
                        {item.isAbnormal ? (
                          <Badge variant="danger" className="text-[10px] font-black">
                            {item.flag}
                          </Badge>
                        ) : (
                          <span className="text-emerald-700 font-semibold text-[11px]">Bình thường</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  <tr className="hover:bg-slate-50">
                    <td className="p-2.5 font-bold text-slate-800">Glucose máu tĩnh mạch</td>
                    <td className="p-2.5 text-center font-bold font-mono text-slate-900">5.8</td>
                    <td className="p-2.5 text-center text-slate-500">mmol/L</td>
                    <td className="p-2.5 text-center text-slate-600 font-mono">3.9 - 6.4</td>
                    <td className="p-2.5 text-right">
                      <span className="text-emerald-700 font-semibold text-[11px]">Bình thường</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* ECG Result Card */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-2">
              <div className="flex items-center justify-between font-bold text-slate-800">
                <span className="flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-clinic-blue" />
                  ĐIỆN TÂM ĐỒ (ECG): {MOCK_ECG_RESULT.serviceName}
                </span>
                <span className="text-emerald-700 font-bold">✓ KTV. Vũ Tuấn (P.208)</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 text-slate-800 font-medium leading-relaxed">
                <b className="text-slate-900">Kết luận chuyên môn: </b>
                {MOCK_ECG_RESULT.conclusion}
              </div>
            </div>
          </CardContent>

          <CardFooter className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between">
            <Button size="sm" variant="ghost" onClick={() => setActiveTab("ORDERS")} className="text-xs">
              ← Quay lại Chỉ định CLS
            </Button>
            <Button
              size="sm"
              onClick={() => setActiveTab("CONCLUSION")}
              className="font-bold text-xs bg-clinic-blue hover:bg-blue-700 text-white"
            >
              <span>Chuyển sang: Kết luận & Đơn thuốc</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* TAB 4: KẾT LUẬN & ĐƠN THUỐC (FINISH ENCOUNTER) */}
      {activeTab === "CONCLUSION" && (
        <Card className="border-slate-200 shadow-sm bg-white animate-in fade-in duration-150">
          <CardHeader className="p-4 bg-slate-50/80 border-b border-slate-200 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold text-slate-800">
                4. Kết luận chẩn đoán, Kê đơn điều trị & Lịch hẹn
              </CardTitle>
              <p className="text-[11px] text-slate-500">
                Phát hành đơn thuốc điện tử an toàn dị ứng, sinh mã QR cấp phát và đặt lịch tái khám
              </p>
            </div>
            <Badge variant="purple" className="font-bold font-mono">
              {rxCode}
            </Badge>
          </CardHeader>

          <CardContent className="p-5 space-y-5 text-xs">
            {/* Diagnosis & Conclusion Inputs */}
            <div className="space-y-3">
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Chẩn đoán xác định sau cận lâm sàng: <span className="text-red-500">*</span>
                </label>
                <Input
                  value={finalDiagnosis}
                  onChange={(e) => setFinalDiagnosis(e.target.value)}
                  className="font-bold text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Lời dặn dò & Hướng điều trị của bác sĩ:
                </label>
                <textarea
                  rows={3}
                  value={finalConclusion}
                  onChange={(e) => setFinalConclusion(e.target.value)}
                  className="w-full p-3 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-clinic-blue transition-all"
                />
              </div>
            </div>

            {/* Medication Prescriptions */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-xs">
                  Danh mục thuốc điều trị (Đã kiểm tra an toàn dị ứng Penicillin):
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  ✓ Không chứa Beta-lactam
                </span>
              </div>

              <div className="space-y-2">
                <div className="p-3 bg-white rounded-xl border border-slate-200 flex justify-between items-center shadow-xs">
                  <div>
                    <b className="text-slate-900">1. Amlodipine 5mg (Kháng calci)</b>
                    <div className="text-[11px] text-slate-500">Uống 1 viên vào lúc 08h00 sáng sau ăn no</div>
                  </div>
                  <span className="font-mono font-bold text-clinic-blue text-sm">30 viên (1 tháng)</span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 flex justify-between items-center shadow-xs">
                  <div>
                    <b className="text-slate-900">2. Atorvastatin 10mg (Hạ lipid máu)</b>
                    <div className="text-[11px] text-slate-500">Uống 1 viên vào lúc 20h00 tối sau ăn no</div>
                  </div>
                  <span className="font-mono font-bold text-clinic-blue text-sm">30 viên (1 tháng)</span>
                </div>
              </div>

              {/* Prescription Issued Notification Card */}
              {isPrescriptionIssued ? (
                <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl flex items-center justify-between gap-4 animate-in zoom-in-95">
                  <div className="space-y-1">
                    <div className="font-black text-emerald-950 flex items-center gap-1.5 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ĐƠN THUỐC ĐIỆN TỬ ĐÃ ĐƯỢC KÝ DUYỆT & PHÁT HÀNH
                    </div>
                    <div className="text-xs text-emerald-800">
                      Mã đơn thuốc: <b className="font-mono text-emerald-950">{rxCode}</b>. Dược sĩ tại Quầy thuốc chỉ cần quét mã QR để lấy đúng đơn mà không phải gõ lại bất kỳ chữ nào.
                    </div>
                  </div>
                  <div className="w-16 h-16 bg-slate-900 text-white rounded-xl flex flex-col items-center justify-center font-mono font-bold text-[9px] shrink-0 shadow-md">
                    <QrCode className="w-8 h-8 text-white mb-0.5" />
                    RX-018
                  </div>
                </div>
              ) : (
                <Button
                  onClick={handleIssuePrescription}
                  className="w-full font-bold text-xs bg-purple-700 hover:bg-purple-800 text-white h-10 shadow-sm"
                >
                  <QrCode className="w-4 h-4 mr-2" />
                  Ký duyệt & Phát hành Đơn thuốc điện tử (Mã QR)
                </Button>
              )}
            </div>

            {/* Follow-up Appointment Box */}
            <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-black uppercase text-blue-800 tracking-wider block">
                  LỊCH TÁI KHÁM THEO DÕI
                </span>
                <span className="font-bold text-slate-900 text-xs">
                  {isAppointmentBooked
                    ? `Đã lên lịch hẹn: 17/10/2026 (Thứ Bảy, 08:30) — ${appointmentCode}`
                    : "Hẹn tái khám sau 4 tuần để đánh giá đáp ứng hạ áp"}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                disabled={isAppointmentBooked}
                onClick={handleBookAppointment}
                className="font-bold text-xs border-blue-300 text-clinic-blue bg-white hover:bg-blue-50 self-start sm:self-auto"
              >
                <Calendar className="w-3.5 h-3.5 mr-1.5" />
                {isAppointmentBooked ? "Đã đặt lịch hẹn ✓" : "Tạo lịch tái khám từ Encounter"}
              </Button>
            </div>
          </CardContent>

          <CardFooter className="p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <Button size="sm" variant="ghost" onClick={() => setActiveTab("RESULTS")} className="text-xs">
              ← Quay lại Kết quả CLS
            </Button>
            <Button
              size="sm"
              onClick={handleFinishVisit}
              className="w-full sm:w-auto font-black text-xs h-11 px-6 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/30"
            >
              <FileCheck className="w-4 h-4 mr-2" />
              Hoàn tất ca khám & Đóng hồ sơ bệnh án →
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
