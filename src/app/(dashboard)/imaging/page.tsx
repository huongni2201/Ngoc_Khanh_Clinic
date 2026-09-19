"use client";

import * as React from "react";
import Link from "next/link";
import { PageHeader } from "@/shared/components/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { useUIStore } from "@/shared/stores/ui.store";
import { useDemoClinicFlowStore } from "@/shared/stores/demo-clinic-flow.store";
import { MOCK_ECG_RESULT } from "@/shared/constants/mock-data";
import { Activity, Camera, CheckCircle2, Sliders, Eye, FileCheck, ArrowRight, Lock } from "lucide-react";

export default function ImagingPage() {
  const { showToast } = useUIStore();
  const {
    patientName,
    patientCode,
    encounterCode,
    imagingStatus,
    labStatus,
    diagnosticInvoiceStatus,
    isDiagnosticAuthorized,
    finalizeImaging,
  } = useDemoClinicFlowStore();

  const [activeModality, setActiveModality] = React.useState<"ULTRASOUND" | "ECG" | "XRAY">("ECG");
  const [template, setTemplate] = React.useState("ECG");
  const [conclusion, setConclusion] = React.useState(
    "Nhịp xoang đều, tần số 82 chu kỳ/phút. Dày thất trái nhẹ theo chỉ số Sokolow-Lyon. Chưa thấy biến đổi đoạn ST-T thiếu máu cơ tim cấp."
  );

  const isAuthorized = isDiagnosticAuthorized(1) || diagnosticInvoiceStatus === "PAID";

  const handleApprove = () => {
    if (!isAuthorized) {
      showToast("Không thể bắt đầu dịch vụ: Chưa được xác nhận thanh toán phí cận lâm sàng tại phòng bác sĩ!");
      return;
    }
    finalizeImaging();
    if (labStatus === "FINAL") {
      showToast("Đã ký duyệt Final! Đủ 3/3 kết quả CLS → Bệnh nhân đã tự động chuyển sang Chờ Bác sĩ kết luận.");
    } else {
      showToast("Đã ký duyệt Final kết quả CĐHA & ECG! Kết quả đã tự động trả về máy tính BS. Lê Minh.");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="CHẨN ĐOÁN HÌNH ẢNH & THĂM DÒ CHỨC NĂNG"
        title="Siêu âm & Điện tim (Phòng P.105 & P.208)"
        description="Đối soát quyền thực hiện (Payment Authorization), dạng sóng điện tim 12 chuyển đạo vi tính và duyệt báo cáo tự động trả về máy bác sĩ"
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="success"
              disabled={!isAuthorized}
              onClick={handleApprove}
              className="font-bold text-xs"
            >
              <CheckCircle2 className="w-4 h-4 mr-1.5" />
              Ký duyệt Final & Auto-Return về Bác sĩ
            </Button>
          </div>
        }
      />

      {/* Lock Gate Warning if Not Authorized */}
      {!isAuthorized && (
        <Card className="border-amber-300 bg-amber-50/90 text-amber-950 p-4 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
            <Lock className="w-5 h-5 text-amber-700" />
            <span>KHÓA CỔNG THỰC HIỆN — CHƯA THANH TOÁN PHÍ DỊCH VỤ (PAYMENT AUTHORIZATION: PENDING)</span>
          </div>
          <p className="text-xs text-amber-800 leading-relaxed">
            Chỉ định kỹ thuật Điện tim & Siêu âm của người bệnh <b>{patientName} ({patientCode})</b> chưa được cấp quyền thực hiện (Payment Authorization Status: PENDING). Người bệnh cần hoàn tất thanh toán phí cận lâm sàng tại phòng khám của bác sĩ trước khi vào phòng kỹ thuật.
          </p>
          <div className="pt-1 flex items-center gap-2">
            <Link href="/clinical">
              <Button size="sm" className="bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs h-8">
                Xem phòng Bác sĩ khám (P.203) →
              </Button>
            </Link>
          </div>
        </Card>
      )}

      {/* Modality Switcher Tabs */}
      <div className="flex items-center bg-slate-200/80 p-1 rounded-2xl border border-slate-300 max-w-lg">
        <button
          type="button"
          onClick={() => {
            setActiveModality("ECG");
            setTemplate("ECG");
            setConclusion("Nhịp xoang đều, tần số 82 chu kỳ/phút. Dày thất trái nhẹ theo chỉ số Sokolow-Lyon. Chưa thấy biến đổi đoạn ST-T thiếu máu cơ tim cấp.");
          }}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
            activeModality === "ECG"
              ? "bg-white text-clinic-blue shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Điện tâm đồ ECG (P.208)
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveModality("ULTRASOUND");
            setTemplate("ABDOMEN");
            setConclusion("Gan kích thước bình thường, nhu mô đồng nhất. Túi mật không sỏi. Tụy lách thận bình thường.");
          }}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
            activeModality === "ULTRASOUND"
              ? "bg-white text-clinic-blue shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Siêu âm Doppler (P.105)
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveModality("XRAY");
            setTemplate("CHEST");
            setConclusion("Hình thái bóng tim và trường phổi hai bên trong giới hạn bình thường.");
          }}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
            activeModality === "XRAY"
              ? "bg-white text-clinic-blue shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          X-quang KTS (P.102)
        </button>
      </div>

      {/* Patient info bar */}
      <div className="p-3 bg-slate-900 text-white rounded-2xl flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <span className="font-black text-sm uppercase text-white">{patientName}</span>
          <span className="px-2 py-0.5 rounded bg-blue-900 text-blue-300 font-mono font-bold">{patientCode}</span>
          <span className="text-slate-400">Lượt khám: <b>{encounterCode}</b></span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-1 rounded font-bold text-[10px] ${
            isAuthorized ? "bg-emerald-950 border border-emerald-700 text-emerald-300" : "bg-red-950 border border-red-800 text-red-300"
          }`}>
            {isAuthorized ? "✓ AUTHORIZED" : "LOCKED"}
          </span>
          <Badge variant={imagingStatus === "FINAL" ? "success" : "warn"} className="font-bold">
            {imagingStatus === "FINAL" ? "FINAL (ĐÃ DUYỆT)" : "ĐANG THỰC HIỆN"}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Image Viewer & Waveform (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {activeModality === "ECG" && (
            <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
              <CardHeader className="bg-slate-50 p-4 border-b border-slate-200 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-clinic-blue" />
                  <CardTitle className="text-sm font-bold text-slate-800">
                    Dạng sóng điện tâm đồ ECG 12 chuyển đạo vi tính (Lead II)
                  </CardTitle>
                </div>
                <span className="text-xs font-mono font-bold text-slate-700">82 chu kỳ/phút</span>
              </CardHeader>
              <CardContent className="p-4">
                <div className="w-full h-32 bg-slate-950 rounded-xl p-3 flex items-center justify-center overflow-hidden shadow-inner">
                  <svg className="w-full h-full text-emerald-400" viewBox="0 0 500 80" preserveAspectRatio="none">
                    <path
                      d="M0,40 L40,40 L45,35 L50,45 L55,40 L90,40 L95,20 L100,65 L105,10 L110,48 L115,38 L120,40 L160,40 L165,35 L170,45 L175,40 L210,40 L215,20 L220,65 L225,10 L230,48 L235,38 L240,40 L280,40 L285,35 L290,45 L295,40 L330,40 L335,20 L340,65 L345,10 L350,48 L355,38 L360,40 L400,40 L405,35 L410,45 L415,40 L450,40 L455,20 L460,65 L465,10 L470,48 L475,38 L480,40 L500,40"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 font-mono mt-3">
                  <span>Tốc độ kéo giấy: 25mm/s</span>
                  <span>Điện thế chuẩn: 10mm/mV</span>
                  <span>Bộ lọc tần số: 0.05 - 150 Hz</span>
                </div>
              </CardContent>
            </Card>
          )}

          {activeModality === "ULTRASOUND" && (
            <Card className="border-slate-800 bg-slate-950 text-white shadow-xl overflow-hidden">
              <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300">ĐẦU DÒ LINEAR 9L (7.5 MHz) • GAIN 68 • DEPTH 4.0cm</span>
                <Badge variant="outline" className="text-emerald-400 border-emerald-600 font-mono text-[10px]">
                  DICOM STREAM
                </Badge>
              </div>

              <div className="aspect-video bg-black flex flex-col items-center justify-center relative p-4">
                <div className="w-52 h-40 border border-slate-700 rounded-2xl flex items-center justify-center bg-slate-900/60 text-center p-3">
                  <Camera className="w-10 h-10 text-slate-500 mb-1" />
                </div>
                <span className="text-[11px] text-slate-400 mt-2">Mô phỏng hình ảnh Doppler ổ bụng tổng quát</span>
                <div className="absolute bottom-2 left-3 text-[10px] font-mono text-slate-500">
                  {patientCode} • {patientName} • FPS: 28 • MI: 0.9
                </div>
              </div>
            </Card>
          )}

          {activeModality === "XRAY" && (
            <Card className="border-slate-800 bg-slate-950 text-white shadow-xl overflow-hidden">
              <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300">X-QUANG PHỔI THẲNG KTS (PA VIEW) • 120kV • 3.2mAs</span>
                <Badge variant="outline" className="text-blue-400 border-blue-600 font-mono text-[10px]">
                  PACS READY
                </Badge>
              </div>
              <div className="aspect-video bg-black flex flex-col items-center justify-center p-4">
                <div className="w-48 h-40 border border-slate-700 rounded-2xl flex items-center justify-center bg-slate-900/40 text-center">
                  <Activity className="w-10 h-10 text-slate-500" />
                </div>
                <span className="text-[11px] text-slate-400 mt-2">Mô phỏng phim X-quang tim phổi kỹ thuật số</span>
              </div>
            </Card>
          )}
        </div>

        {/* Right Column: Template Selection & Conclusion (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-slate-200 shadow-sm bg-white">
            <CardHeader className="bg-slate-50/80 p-4 border-b border-slate-200">
              <CardTitle className="text-sm font-bold text-slate-800">
                Mẫu kết luận chuyên môn (Report Templates)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Mẫu báo cáo kết quả:</label>
                <select
                  value={template}
                  onChange={(e) => setTemplate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-clinic-blue outline-none"
                >
                  <option value="ECG">Điện tâm đồ thông thường 12 chuyển đạo vi tính (ECG)</option>
                  <option value="ABDOMEN">Siêu âm ổ bụng tổng quát (Gan, Mật, Tụy, Thận)</option>
                  <option value="CHEST">X-quang tim phổi thẳng kỹ thuật số</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Mô tả tổn thương / Sóng điện tim:</label>
                <textarea
                  rows={4}
                  value={conclusion}
                  onChange={(e) => setConclusion(e.target.value)}
                  className="w-full p-3 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-clinic-blue transition-all"
                />
              </div>

              <div className="p-3.5 bg-blue-50/80 border border-blue-200 rounded-xl space-y-1">
                <span className="font-bold text-blue-900 block text-[11px]">KẾT LUẬN CHUYÊN MÔN:</span>
                <p className="text-slate-800 font-medium">
                  {template === "ECG"
                    ? MOCK_ECG_RESULT.conclusion
                    : "Chưa phát hiện tổn thương khu trú trên hình ảnh siêu âm."}
                </p>
              </div>

              <div className="pt-2">
                <Button
                  disabled={!isAuthorized}
                  onClick={handleApprove}
                  className="w-full font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white h-10 shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Ký duyệt Final & Auto-Return về Bác sĩ →
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
