"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useUIStore } from "@/shared/stores/ui.store";
import { useWorkspaceStore } from "@/shared/stores/workspace.store";
import { MOCK_ACTIVE_ENCOUNTER, MOCK_LAB_RESULTS, MOCK_ECG_RESULT } from "@/shared/constants/mock-data";
import { formatCurrencyVND } from "@/shared/lib/formatters";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
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
  ShieldCheck,
} from "lucide-react";

export function ClinicalWorkspace() {
  const router = useRouter();
  const { openPrintModal, showToast } = useUIStore();
  const {
    orderRound,
    orders,
    openServicePicker,
    removeOrder,
    createNewRound,
    getTotalCLSAmount,
  } = useWorkspaceStore();
  const encounter = MOCK_ACTIVE_ENCOUNTER;

  const round1Orders = orders.filter((o) => o.round === 1);
  const round2Orders = orders.filter((o) => o.round === 2);
  const round1Total = round1Orders.reduce((sum, o) => sum + o.price, 0);
  const round2Total = round2Orders.reduce((sum, o) => sum + o.price, 0);
  const totalCLS = getTotalCLSAmount();

  const [notes, setNotes] = React.useState(encounter.clinicalNotes);
  const [chiefComplaint, setChiefComplaint] = React.useState(encounter.chiefComplaint);
  const [isPrescriptionReady, setIsPrescriptionReady] = React.useState(false);

  const handleFinishVisit = () => {
    setIsPrescriptionReady(true);
    showToast("Đã hoàn tất kê đơn và phát hành mã QR đơn thuốc RX-260917-0018.");
  };

  return (
    <div className="space-y-6">
      {/* 1. CLINICAL EXAMINATION & VITALS */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="bg-slate-50/70 p-4 border-b border-slate-200 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-clinic-blue" />
            <CardTitle className="text-sm font-bold text-slate-800">
              1. Khám lâm sàng & Sinh hiệu tại phòng khám (P.203)
            </CardTitle>
          </div>
          <span className="text-xs text-slate-500 font-mono">BS. Lê Minh • 17/09/2026 08:35</span>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-700 font-bold uppercase block">Huyết áp tại chỗ</span>
              <span className="text-sm font-black text-red-600">148/92 mmHg</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-700 font-bold uppercase block">Nhịp tim</span>
              <span className="text-sm font-bold text-slate-800">84 chu kỳ/phút</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-700 font-bold uppercase block">Nhiệt độ</span>
              <span className="text-sm font-bold text-slate-800">36.8 °C</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-700 font-bold uppercase block">SpO2</span>
              <span className="text-sm font-bold text-slate-800">98% (Khí phòng)</span>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label htmlFor="chiefComplaintInput" className="font-bold text-slate-700 block mb-1">
                Lý do vào khám & Bệnh sử (Chief Complaint):
              </label>
              <Input
                id="chiefComplaintInput"
                aria-label="Lý do vào khám & Bệnh sử (Chief Complaint)"
                value={chiefComplaint}
                onChange={(e) => setChiefComplaint(e.target.value)}
                className="text-xs font-medium"
              />
            </div>
            <div>
              <label htmlFor="clinicalNotesTextarea" className="font-bold text-slate-700 block mb-1">
                Khám lâm sàng và ghi chú bác sĩ:
              </label>
              <textarea
                id="clinicalNotesTextarea"
                aria-label="Khám lâm sàng và ghi chú bác sĩ"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-clinic-blue transition-all"
              />
            </div>
          </div>

          {/* ICD-10 Preliminary Diagnosis */}
          <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-xl text-xs space-y-1">
            <span className="font-bold text-blue-900 uppercase tracking-wide text-[10px] block">
              CHẨN ĐOÁN SƠ BỘ (ICD-10):
            </span>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-blue-600 text-white font-mono font-bold rounded text-xs">
                {encounter.icdCode}
              </span>
              <span className="font-bold text-slate-800 text-xs">{encounter.icdName}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. MULTIPLE ORDER ROUNDS & MEDICAL PRINT BUTTONS */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="bg-slate-50/70 p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <FlaskConical className="w-4 h-4 text-purple-600" />
            <div>
              <CardTitle className="text-sm font-bold text-slate-800">
                2. Chỉ định Cận lâm sàng đa đợt (Multiple Order Rounds)
              </CardTitle>
              <p className="text-[11px] text-slate-500">
                Bác sĩ có thể thêm/xóa chỉ định từng đợt, phân bổ phòng thực hiện và xuất in phiếu cho bệnh nhân
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
                  showToast("Đã kích hoạt Đợt 2 (Chỉ định cận lâm sàng bổ sung).");
                }}
                className="h-7 text-xs font-bold border-purple-300 text-purple-700 hover:bg-purple-50 shadow-sm"
              >
                <PlusCircle className="w-3.5 h-3.5 mr-1 text-purple-600" />
                + Khởi tạo Đợt 2 (Bổ sung)
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-4 space-y-5">
          {/* ROUND 1 SECTION */}
          <div className="border border-blue-200/80 rounded-xl overflow-hidden bg-slate-50/40">
            <div className="px-3.5 py-2.5 bg-blue-50/80 border-b border-blue-200/80 flex items-center justify-between flex-wrap gap-2">
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
                  className="h-6 px-2 text-[11px] font-bold border-blue-300 text-blue-700 hover:bg-blue-100"
                >
                  <Plus className="w-3 h-3 mr-0.5" />
                  Thêm chỉ định Đợt 1
                </Button>
              </div>
            </div>

            <div className="p-3 space-y-2">
              {round1Orders.length === 0 ? (
                <div className="text-center py-4 text-xs text-slate-400 italic">
                  Chưa có dịch vụ nào trong Đợt 1. Bấm "+ Thêm chỉ định Đợt 1" để chọn dịch vụ.
                </div>
              ) : (
                round1Orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-3 text-xs shadow-sm hover:border-slate-300 transition-colors"
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
                        variant={ord.status === "PAID_AUTHORIZED" ? "success" : "warn"}
                        className="text-[10px] font-bold"
                      >
                        {ord.status === "PAID_AUTHORIZED" ? "PAID_AUTHORIZED" : "WAITING_PAYMENT"}
                      </Badge>
                      <button
                        type="button"
                        onClick={() => {
                          removeOrder(ord.id);
                          showToast(`Đã xóa chỉ định [${ord.serviceCode}] khỏi Đợt 1.`);
                        }}
                        className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Xóa chỉ định này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}

              {round1Orders.length > 0 && (
                <div className="mt-3 pt-3 border-t border-blue-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-blue-50/40 p-2.5 rounded-lg">
                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    <span className="text-slate-600 font-medium">Viện phí Đợt 1 (Khám + CLS):</span>
                    <span className="font-mono font-black text-blue-900">
                      {formatCurrencyVND(round1Total + 150000)}
                    </span>
                    <Badge variant="success" className="text-[10px] font-bold">
                      ĐÃ THANH TOÁN (PAID_AUTHORIZED)
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openPrintModal("routing", 1)}
                      className="h-7 text-xs font-bold border-blue-300 text-blue-700 hover:bg-blue-100 shadow-sm"
                      title="In phiếu chỉ định y tế của riêng Đợt 1"
                    >
                      <Printer className="w-3.5 h-3.5 mr-1 text-clinic-blue" />
                      Phiếu chỉ định Đợt 1 ({round1Orders.length})
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openPrintModal("invoice", 1)}
                      className="h-7 text-xs font-bold border-emerald-300 text-emerald-700 hover:bg-emerald-100 shadow-sm"
                      title="In hóa đơn thu tiền của riêng Đợt 1"
                    >
                      <Receipt className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                      Hóa đơn Đợt 1
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ROUND 2 SECTION (IF ACTIVE) */}
          {orderRound >= 2 && (
            <div className="border border-purple-200/80 rounded-xl overflow-hidden bg-purple-50/20 animate-in fade-in">
              <div className="px-3.5 py-2.5 bg-purple-50 border-b border-purple-200/80 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center">
                    2
                  </span>
                  <span className="font-bold text-xs text-purple-950">
                    Đợt 2 — Chỉ định Bổ sung sau Khám/Kết quả đợt 1
                  </span>
                  <Badge variant="secondary" className="text-[10px] bg-purple-100 text-purple-800 font-bold">
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
                    className="h-6 px-2 text-[11px] font-bold border-purple-300 text-purple-700 hover:bg-purple-100"
                  >
                    <Plus className="w-3 h-3 mr-0.5" />
                    Thêm chỉ định Đợt 2
                  </Button>
                </div>
              </div>

              <div className="p-3 space-y-2">
                {round2Orders.length === 0 ? (
                  <div className="text-center py-5 text-xs text-purple-700 bg-purple-50/40 rounded-lg border border-dashed border-purple-200">
                    <p className="font-semibold mb-1">Chưa có chỉ định nào trong Đợt 2</p>
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => openServicePicker(2)}
                      className="h-7 text-xs font-bold bg-purple-600 hover:bg-purple-700"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Thêm dịch vụ bổ sung vào Đợt 2
                    </Button>
                  </div>
                ) : (
                  <>
                    {round2Orders.map((ord) => (
                      <div
                        key={ord.id}
                        className="p-3 bg-white border border-purple-200/60 rounded-xl flex items-center justify-between gap-3 text-xs shadow-sm hover:border-purple-300 transition-colors"
                      >
                        <div className="space-y-0.5 flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-purple-900 font-bold bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200">
                              {ord.serviceCode}
                            </span>
                            <span className="font-bold text-slate-900">{ord.serviceName}</span>
                          </div>
                          <div className="text-[11px] text-slate-600 flex items-center gap-2 flex-wrap">
                            <span>
                              Địa điểm: <b className="text-purple-700 font-bold">{ord.roomName}</b> ({ord.roomCode} — {ord.floor})
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
                            variant={ord.status === "PAID_AUTHORIZED" ? "success" : "warn"}
                            className="text-[10px] font-bold"
                          >
                            {ord.status === "PAID_AUTHORIZED" ? "PAID_AUTHORIZED" : "WAITING_PAYMENT"}
                          </Badge>
                          <button
                            type="button"
                            onClick={() => {
                              removeOrder(ord.id);
                              showToast(`Đã xóa chỉ định [${ord.serviceCode}] khỏi Đợt 2.`);
                            }}
                            className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Xóa chỉ định này"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Dedicated Round 2 Action Bar */}
                    <div className="mt-3 pt-3 border-t border-purple-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-purple-50/50 p-2.5 rounded-lg">
                      <div className="flex items-center gap-2 flex-wrap text-xs">
                        <span className="text-slate-600 font-medium">Viện phí phát sinh Đợt 2:</span>
                        <span className="font-mono font-black text-purple-900">
                          {formatCurrencyVND(round2Total)}
                        </span>
                        <Badge variant="warn" className="text-[10px] font-bold">
                          CHỜ NỘP TIỀN ĐỢT 2
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openPrintModal("routing", 2)}
                          className="h-7 text-xs font-bold border-purple-300 text-purple-700 hover:bg-purple-100 shadow-sm"
                          title="In phiếu chỉ định y tế của riêng Đợt 2"
                        >
                          <Printer className="w-3.5 h-3.5 mr-1 text-purple-600" />
                          Phiếu chỉ định Đợt 2 ({round2Orders.length})
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openPrintModal("invoice", 2)}
                          className="h-7 text-xs font-bold border-emerald-400 text-emerald-800 hover:bg-emerald-100 shadow-sm bg-emerald-50/60"
                          title="In hóa đơn nộp tiền riêng cho Đợt 2 kèm VietQR động"
                        >
                          <Receipt className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                          Hóa đơn nộp tiền Đợt 2 (VietQR)
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 3. LIVE AUTO-RETURNED RESULTS PANE */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="bg-slate-50/70 p-4 border-b border-slate-200 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <CardTitle className="text-sm font-bold text-slate-800">
              3. Kết quả cận lâm sàng đã trả về tự động (Auto-Return to Clinic)
            </CardTitle>
          </div>
          <Badge variant="success" className="font-bold">
            RESULTS_COMPLETE (Tự động cập nhật)
          </Badge>
        </CardHeader>

        <CardContent className="p-4 space-y-4">
          {/* Lab Hematology Analyte Grid */}
          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <div className="p-2.5 bg-slate-100 font-bold text-slate-800 flex items-center justify-between">
              <span>HUYẾT HỌC: Tổng phân tích tế bào máu ngoại vi (CTM 18 chỉ số)</span>
              <span className="text-[11px] text-emerald-700 font-bold">✓ KTV. Trần Thu Hà đã duyệt Final</span>
            </div>
            <table className="w-full text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                <tr>
                  <th className="p-2 text-left">Chỉ số xét nghiệm</th>
                  <th className="p-2 text-center">Kết quả đo</th>
                  <th className="p-2 text-center">Đơn vị</th>
                  <th className="p-2 text-center">Khoảng tham chiếu</th>
                  <th className="p-2 text-right">Đánh giá</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {MOCK_LAB_RESULTS[0].analytes.map((item, idx) => (
                  <tr key={idx} className={item.isAbnormal ? "bg-red-50/60 font-medium" : ""}>
                    <td className="p-2 font-medium text-slate-800">{item.name}</td>
                    <td className={`p-2 text-center font-bold font-mono ${item.isAbnormal ? "text-red-600 text-sm" : "text-slate-900"}`}>
                      {item.value}
                    </td>
                    <td className="p-2 text-center text-slate-500">{item.unit}</td>
                    <td className="p-2 text-center text-slate-600 font-mono">{item.refRange}</td>
                    <td className="p-2 text-right">
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
              </tbody>
            </table>
          </div>

          {/* ECG Result Card */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1.5">
            <div className="flex items-center justify-between font-bold text-slate-800">
              <span className="flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-clinic-blue" />
                ĐIỆN TÂM ĐỒ: {MOCK_ECG_RESULT.serviceName}
              </span>
              <span className="text-emerald-700 font-bold">✓ KTV. Vũ Tuấn (P.208)</span>
            </div>
            <div className="p-2 bg-white rounded border border-slate-200 text-slate-700 font-medium leading-relaxed">
              <b>Kết luận chuyên môn: </b>
              {MOCK_ECG_RESULT.conclusion}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4. PRESCRIPTION & FINISH ENCOUNTER */}
      <Card className="border-slate-200 shadow-sm bg-gradient-to-br from-white to-slate-50">
        <CardHeader className="p-4 border-b border-slate-200 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-bold text-slate-800">
            4. Kê đơn điều trị & Hoàn tất đợt khám (Prescription Handoff)
          </CardTitle>
          <Badge variant="purple" className="font-bold">
            RX-260917-0018
          </Badge>
        </CardHeader>

        <CardContent className="p-4 space-y-4 text-xs">
          <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-2">
            <div className="font-bold text-slate-900">Danh mục thuốc điều trị (An toàn dị ứng Penicillin):</div>
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-center">
              <div>
                <b className="text-slate-800">1. Amlodipine 5mg (Kháng calci)</b>
                <div className="text-[11px] text-slate-500">Uống 1 viên vào lúc 08h00 sáng sau ăn • Số lượng: 30 viên (1 tháng)</div>
              </div>
              <span className="font-mono font-bold text-clinic-blue">30 viên</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-center">
              <div>
                <b className="text-slate-800">2. Atorvastatin 10mg (Hạ lipid máu)</b>
                <div className="text-[11px] text-slate-500">Uống 1 viên vào lúc 20h00 tối • Số lượng: 30 viên (1 tháng)</div>
              </div>
              <span className="font-mono font-bold text-clinic-blue">30 viên</span>
            </div>
          </div>

          {isPrescriptionReady && (
            <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-xl flex items-center justify-between animate-in fade-in">
              <div className="space-y-1">
                <div className="font-black text-emerald-900 flex items-center gap-1.5 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ĐƠN THUỐC ĐIỆN TỬ ĐÃ PHÁT HÀNH THÀNH CÔNG
                </div>
                <div className="text-xs text-emerald-800">
                  Mã QR đơn thuốc: <b className="font-mono">RX-260917-0018</b>. Dược sĩ tại Quầy thuốc chỉ cần quét mã QR để cấp phát tức thì mà không cần nhập lại dữ liệu.
                </div>
              </div>
              <div className="w-16 h-16 bg-slate-900 text-white rounded-lg flex flex-col items-center justify-center font-mono font-bold text-[9px] shrink-0">
                <QrCode className="w-8 h-8 text-white mb-0.5" />
                RX-018
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="success"
              onClick={handleFinishVisit}
              className="font-bold shadow-md h-10 px-5 text-xs"
            >
              <FileCheck className="w-4 h-4 mr-1.5" />
              Ký duyệt đơn & Hoàn tất lượt khám →
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
