"use client";

import * as React from "react";
import Link from "next/link";
import { PageHeader } from "@/shared/components/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { useUIStore } from "@/shared/stores/ui.store";
import { useDemoJourneyStore } from "@/shared/stores/demo-journey.store";
import {
  Smartphone,
  Laptop,
  FileText,
  Download,
  Calendar,
  Pill,
  Activity,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  Image as ImageIcon,
} from "lucide-react";

export default function PatientPortalPage() {
  const { showToast } = useUIStore();
  const {
    patientName,
    patientCode,
    encounterCode,
    rxCode,
    isAppointmentBooked,
    appointmentCode,
  } = useDemoJourneyStore();

  const [deviceView, setDeviceView] = React.useState<"desktop" | "mobile">("desktop");

  const handleDownloadPdf = () => {
    showToast(`Đang tải file PDF: Ket_qua_kham_${encounterCode}.pdf (Đã ký số)`);
  };

  const handleAddToCalendar = () => {
    showToast("Đã thêm lịch tái khám ngày 17/10/2026 vào Lịch thiết bị (Google/Apple Calendar)!");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="CỔNG THÔNG TIN BỆNH NHÂN TRỰC TUYẾN"
        title="Cổng Thông Tin Người Bệnh — Tra cứu kết quả & Đơn thuốc"
        description="Giao diện tra cứu dành cho người bệnh: xem kết quả cận lâm sàng đã ký số, xem đơn thuốc điện tử, tải PDF hồ sơ và đồng bộ lịch tái khám"
        action={
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <Button
              size="sm"
              variant={deviceView === "desktop" ? "default" : "ghost"}
              onClick={() => setDeviceView("desktop")}
              className={`h-8 text-xs font-bold ${
                deviceView === "desktop" ? "bg-clinic-blue text-white" : "text-slate-600"
              }`}
            >
              <Laptop className="w-3.5 h-3.5 mr-1" />
              Xem bản Máy tính (Desktop)
            </Button>
            <Button
              size="sm"
              variant={deviceView === "mobile" ? "default" : "ghost"}
              onClick={() => setDeviceView("mobile")}
              className={`h-8 text-xs font-bold ${
                deviceView === "mobile" ? "bg-clinic-blue text-white" : "text-slate-600"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 mr-1" />
              Xem bản Điện thoại (Mobile)
            </Button>
          </div>
        }
      />

      <div className="flex justify-center">
        {/* Container: Toggles between desktop max-width or smartphone phone frame */}
        <div
          className={`transition-all duration-300 ${
            deviceView === "mobile"
              ? "w-[390px] border-[10px] border-slate-900 rounded-[44px] shadow-2xl overflow-hidden bg-slate-100 ring-1 ring-slate-800"
              : "w-full max-w-5xl"
          }`}
        >
          {/* Mobile Notch Bar (Only visible in mobile mode) */}
          {deviceView === "mobile" && (
            <div className="h-6 bg-slate-900 flex items-center justify-between px-6 text-[11px] text-white select-none">
              <span>09:41</span>
              <div className="w-20 h-4 bg-black rounded-b-xl" />
              <span>5G 100%</span>
            </div>
          )}

          {/* Portal Header */}
          <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white p-6 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center font-black text-sm">
                  +
                </div>
                <div className="font-black tracking-tight text-base">ClinicOne Portal</div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[11px] font-bold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Đã xác thực OTP
              </span>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full bg-white text-clinic-blue font-black flex items-center justify-center text-lg shadow-md shrink-0">
                NA
              </div>
              <div>
                <h2 className="text-lg font-bold text-white leading-tight uppercase">{patientName}</h2>
                <div className="text-xs text-blue-100 flex items-center gap-2 mt-0.5 font-medium">
                  <span>Mã BN: {patientCode}</span>
                  <span>•</span>
                  <span>45 tuổi (1981)</span>
                  <span>•</span>
                  <span>Nam</span>
                </div>
              </div>
            </div>
          </div>

          {/* Portal Main Body */}
          <div className="p-4 sm:p-6 bg-slate-50 space-y-4">
            {/* Current Visit Card */}
            <Card className="border-blue-200 shadow-sm bg-white">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="success" className="text-[10px] font-bold">
                    LƯỢT KHÁM HÔM NAY
                  </Badge>
                  <span className="text-xs text-slate-500 font-mono">17/09/2026 — 08:30</span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Khám Nội tổng quát & Tim mạch (P.203)
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    Bác sĩ phụ trách: <b>BS. CKI Lê Minh</b> • Mã lượt khám: <b className="font-mono">{encounterCode}</b>
                  </p>
                  <div className="text-xs text-slate-700 mt-2 bg-blue-50/60 p-2.5 rounded-xl border border-blue-100">
                    Chẩn đoán: <b>I10 - Tăng huyết áp nguyên phát / Rối loạn lipid máu</b>
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleDownloadPdf}
                    className="w-full font-bold text-xs text-clinic-blue border-blue-200 hover:bg-blue-50"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Tải file PDF kết quả khám bệnh (Đã ký số điện tử)
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Diagnostic Results Section */}
            <Card className="shadow-sm bg-white border-slate-200">
              <CardHeader className="pb-2 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase font-bold text-clinic-blue tracking-wider">
                    KẾT QUẢ CẬN LÂM SÀNG ĐÃ KÝ DUYỆT
                  </span>
                  <span className="text-[11px] text-emerald-600 font-bold">Đã đủ 3/3 dịch vụ</span>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-3">
                {/* Lab Result */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between hover:bg-slate-100/80 transition-colors">
                  <div className="space-y-0.5">
                    <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-clinic-blue" />
                      Xét nghiệm huyết học (CTM 18 thông số)
                    </div>
                    <div className="text-[11px] text-red-600 font-bold">
                      Bạch cầu (WBC): 12.8 G/L ↑ (Vượt ngưỡng tham chiếu 4.0 - 10.0 G/L)
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Glucose: 5.8 mmol/L · KTV Nguyễn Đức Hải duyệt 09:20
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => showToast("Đang mở bảng chi tiết 18 chỉ số công thức máu...")}
                    className="text-xs font-bold text-clinic-blue shrink-0"
                  >
                    Xem chi tiết
                  </Button>
                </div>

                {/* Ultrasound Result */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between hover:bg-slate-100/80 transition-colors">
                  <div className="space-y-0.5">
                    <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-purple-600" />
                      Siêu âm Doppler ổ bụng tổng quát
                    </div>
                    <div className="text-[11px] text-emerald-700 font-bold">
                      Kết luận: Gan mật tụy lách thận bình thường, chưa phát hiện u cục
                    </div>
                    <div className="text-[10px] text-slate-500">
                      BS. Trần Thu Hà kết luận tại Phòng 105
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => showToast("Đang mở hình ảnh siêu âm Doppler...")}
                    className="text-xs font-bold text-clinic-blue shrink-0"
                  >
                    Xem ảnh
                  </Button>
                </div>

                {/* ECG Result */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between hover:bg-slate-100/80 transition-colors">
                  <div className="space-y-0.5">
                    <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-emerald-600" />
                      Điện tâm đồ vi tính (ECG 12 chuyển đạo)
                    </div>
                    <div className="text-[11px] text-emerald-700 font-bold">
                      Kết luận: Nhịp xoang 82 ck/p, dày thất trái nhẹ, không thiếu máu cơ tim cấp
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Đo tại Phòng 208 · KTV. Vũ Tuấn duyệt
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => showToast("Đang mở đồ thị sóng điện tim 12 chuyển đạo...")}
                    className="text-xs font-bold text-clinic-blue shrink-0"
                  >
                    Xem đồ thị
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Electronic Prescription Card */}
            <Card className="shadow-sm bg-white border-slate-200">
              <CardHeader className="pb-2 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase font-bold text-clinic-blue tracking-wider">
                    ĐƠN THUỐC ĐIỆN TỬ
                  </span>
                  <span className="font-mono text-xs font-bold text-clinic-blue bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {rxCode}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-2.5 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-900 flex items-center justify-between">
                    <span>1. Amlodipine 5mg</span>
                    <span className="font-mono text-slate-700">30 viên</span>
                  </div>
                  <div className="text-slate-600 text-[11px]">
                    Uống: 1 viên/ngày vào buổi sáng sau khi ăn no
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-900 flex items-center justify-between">
                    <span>2. Atorvastatin 10mg</span>
                    <span className="font-mono text-slate-700">30 viên</span>
                  </div>
                  <div className="text-slate-600 text-[11px]">
                    Uống: 1 viên/ngày vào buổi tối sau ăn no
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Follow-up Appointment Card */}
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-sm">
              <CardContent className="p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase font-bold text-clinic-blue tracking-wider flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    LỊCH HẸN TÁI KHÁM
                  </span>
                  <Badge variant="purple" className="text-[10px] font-bold">
                    NHẮC QUA ZALO OA
                  </Badge>
                </div>

                <div>
                  <div className="text-base font-black text-slate-900">
                    17/10/2026 — 08:30 Sáng (Thứ Bảy)
                  </div>
                  <div className="text-xs text-slate-600 mt-0.5">
                    Phòng khám Nội 203 · BS. Lê Minh · Tái khám HA & Đánh giá đáp ứng thuốc
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={handleAddToCalendar}
                  className="w-full font-bold bg-clinic-blue hover:bg-blue-700 text-white text-xs h-9"
                >
                  <Calendar className="w-3.5 h-3.5 mr-1.5" />
                  Thêm lịch nhắc vào điện thoại (Google / Apple Calendar)
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
