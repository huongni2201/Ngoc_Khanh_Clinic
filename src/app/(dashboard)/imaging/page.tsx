"use client";

import * as React from "react";
import { PageHeader } from "@/shared/components/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { useUIStore } from "@/shared/stores/ui.store";
import { MOCK_ECG_RESULT } from "@/shared/constants/mock-data";
import { Activity, Camera, CheckCircle2, Sliders, Eye } from "lucide-react";

export default function ImagingPage() {
  const { showToast } = useUIStore();
  const [template, setTemplate] = React.useState("ABDOMEN");
  const [conclusion, setConclusion] = React.useState(
    "Gan kích thước bình thường, nhu mô đồng nhất, không thấy khối khu trú. Túi mật thành mỏng, không sỏi. Tụy, lách, hai thận bình thường."
  );

  const handleApprove = () => {
    showToast("Đã ký duyệt kết quả Chẩn đoán hình ảnh và tự động trả về Encounter!");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="CHẨN ĐOÁN HÌNH ẢNH & ĐIỆN TIM (UC-US / UC-ECG)"
        title="17. Ultrasound & ECG Workspace — Phòng P.105 & P.208"
        description="Viewer ảnh siêu âm Doppler đa tần số, sóng điện tim 12 chuyển đạo và duyệt báo cáo tự động"
        action={
          <Button variant="success" onClick={handleApprove} className="font-bold">
            <CheckCircle2 className="w-4 h-4 mr-1.5" />
            Ký duyệt kết quả Final
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Image Viewer & Waveform (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Ultrasound Viewer Simulation */}
          <Card className="border-slate-800 bg-slate-950 text-white shadow-xl overflow-hidden">
            <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-300">ĐẦU DÒ LINEAR 9L (7.5 MHz) • GAIN 68 • DEPTH 4.0cm</span>
              <Badge variant="outline" className="text-emerald-400 border-emerald-600 font-mono text-[10px]">
                DICOM LIVE STREAM
              </Badge>
            </div>

            <div className="aspect-video bg-black flex flex-col items-center justify-center relative p-4">
              <div className="w-48 h-36 border border-slate-700 rounded-lg flex items-center justify-center bg-slate-900/60 text-center p-2">
                <Camera className="w-8 h-8 text-slate-500 mb-1" />
              </div>
              <span className="text-[11px] text-slate-400 mt-2">Mô phỏng hình ảnh Doppler ổ bụng tổng quát</span>
              <div className="absolute bottom-2 left-3 text-[10px] font-mono text-slate-500">
                PT-001842 • NGUYEN VAN AN • FPS: 28 • MI: 0.9 • TIS: 0.4
              </div>
            </div>
          </Card>

          {/* ECG Waveform SVG Simulation */}
          <Card className="border-slate-200 shadow-sm bg-white">
            <CardHeader className="bg-slate-50 p-4 border-b border-slate-200 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-clinic-blue" />
                <CardTitle className="text-sm font-bold text-slate-800">
                  Dạng sóng điện tâm đồ ECG 12 chuyển đạo (Lead II)
                </CardTitle>
              </div>
              <span className="text-xs font-mono font-bold text-slate-700">82 bpm</span>
            </CardHeader>
            <CardContent className="p-4">
              <div className="w-full h-24 bg-slate-900 rounded-lg p-2 flex items-center justify-center overflow-hidden">
                <svg className="w-full h-full text-emerald-400" viewBox="0 0 500 80" preserveAspectRatio="none">
                  <path
                    d="M0,40 L40,40 L45,35 L50,45 L55,40 L90,40 L95,20 L100,65 L105,10 L110,48 L115,38 L120,40 L160,40 L165,35 L170,45 L175,40 L210,40 L215,20 L220,65 L225,10 L230,48 L235,38 L240,40 L280,40 L285,35 L290,45 L295,40 L330,40 L335,20 L340,65 L345,10 L350,48 L355,38 L360,40 L400,40 L405,35 L410,45 L415,40 L450,40 L455,20 L460,65 L465,10 L470,48 L475,38 L480,40 L500,40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <div className="flex justify-between text-[11px] text-slate-500 font-mono mt-2">
                <span>Tốc độ giấy: 25mm/s</span>
                <span>Điện thế chuẩn: 10mm/mV</span>
                <span>Bộ lọc: 0.05 - 150 Hz</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Template Selection & Conclusion (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="bg-slate-50/70 p-4 border-b border-slate-200">
              <CardTitle className="text-sm font-bold text-slate-800">
                Mẫu kết luận chẩn đoán (Report Templates)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Chọn mẫu kết luận:</label>
                <select
                  value={template}
                  onChange={(e) => setTemplate(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-clinic-blue outline-none"
                >
                  <option value="ABDOMEN">Siêu âm ổ bụng tổng quát (Gan, Mật, Tụy, Thận)</option>
                  <option value="THYROID">Siêu âm tuyến giáp (TIRADS)</option>
                  <option value="BREAST">Siêu âm tuyến vú (BIRADS)</option>
                  <option value="ECG">Điện tâm đồ thông thường 12 chuyển đạo</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Mô tả chi tiết tổn thương:</label>
                <textarea
                  rows={4}
                  value={conclusion}
                  onChange={(e) => setConclusion(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-clinic-blue transition-all"
                />
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl space-y-1">
                <span className="font-bold text-blue-900 block">KẾT LUẬN CUỐI CÙNG:</span>
                <p className="text-slate-800 font-medium">
                  {template === "ECG" ? MOCK_ECG_RESULT.conclusion : "Hiện tại chưa phát hiện bất thường hình thái trên siêu âm ổ bụng."}
                </p>
              </div>

              <div className="pt-2">
                <Button onClick={handleApprove} className="w-full font-bold">
                  Lưu & Tự động trả kết quả về Bác sĩ khám →
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
