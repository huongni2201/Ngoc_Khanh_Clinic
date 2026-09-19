"use client";

import * as React from "react";
import { PageHeader } from "@/shared/components/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { useUIStore } from "@/shared/stores/ui.store";
import {
  BarChart3,
  Download,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Layers,
  ArrowUpRight,
  Filter,
  Sparkles,
} from "lucide-react";

export default function ReportsPage() {
  const { showToast } = useUIStore();

  const handleExport = () => {
    showToast("Đang kết xuất tệp Báo cáo Vận hành & SLA Phòng khám (Excel & PDF)...");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="BÁO CÁO VẬN HÀNH & CHỈ SỐ TAT / SLA"
        title="Báo Cáo Vận Hành & Chỉ Số TAT / SLA"
        description="Giám sát hiệu suất luồng bệnh nhân, thời gian trả kết quả (Turnaround Time - TAT), tỷ lệ đạt SLA cận lâm sàng và phân tích doanh thu"
        action={
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleExport}
              className="font-bold text-slate-700"
            >
              <Download className="w-4 h-4 mr-1.5" />
              Xuất file Excel / PDF
            </Button>
          </div>
        }
      />

      {/* 4 Primary Operational KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-clinic-blue shadow-sm">
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                LƯỢT KHÁM THÁNG 09/2026
              </span>
              <span className="text-xs font-bold text-emerald-700 flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5" /> +12.4%
              </span>
            </div>
            <div className="text-2xl font-black text-slate-900">2.486</div>
            <p className="text-[11px] text-slate-600">Trung bình 98 lượt / ngày làm việc</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-indigo-600 shadow-sm">
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                TAT TOÀN HÀNH TRÌNH
              </span>
              <Clock className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-2xl font-black text-slate-900">
              58 <span className="text-sm font-normal text-slate-600">phút</span>
            </div>
            <p className="text-[11px] text-emerald-700 font-semibold">
              Giảm 8 phút so với trước khi số hóa
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500 shadow-sm">
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                ĐẠT SLA CẬN LÂM SÀNG
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            </div>
            <div className="text-2xl font-black text-emerald-700">96.8%</div>
            <p className="text-[11px] text-amber-800">3.2% vượt chuẩn cam kết trả kết quả</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500 shadow-sm">
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                TỶ LỆ NO-SHOW LỊCH HẸN
              </span>
              <Calendar className="w-4 h-4 text-amber-800" />
            </div>
            <div className="text-2xl font-black text-amber-800">4.8%</div>
            <p className="text-[11px] text-emerald-700">Giảm mạnh nhờ cơ chế nhắc Zalo OA tự động</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Analysis Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Wait Time & TAT SLA Breakdown */}
        <div className="lg:col-span-6 space-y-4">
          <Card>
            <CardHeader className="pb-3 border-b border-slate-100">
              <span className="text-[11px] uppercase font-bold text-clinic-blue tracking-wider">
                THỜI GIAN CHỜ TRUNG BÌNH THEO CHUYÊN KHOA
              </span>
              <CardTitle className="text-base">Đánh giá chuẩn cam kết dịch vụ (SLA Service Levels)</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-5">
              {/* Internal Medicine */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">Khám Nội tổng quát (Mục tiêu: ≤ 20 phút)</span>
                  <span className="font-bold text-emerald-700 font-mono">18 phút (Đạt SLA)</span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full" style={{ width: "72%" }} />
                </div>
              </div>

              {/* Cardiology */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">Khám Tim mạch P.203 (Mục tiêu: ≤ 25 phút)</span>
                  <span className="font-bold text-emerald-700 font-mono">24 phút (Đạt SLA)</span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full" style={{ width: "80%" }} />
                </div>
              </div>

              {/* Ultrasound */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">Phòng Siêu âm P.105 (Mục tiêu: ≤ 20 phút)</span>
                  <span className="font-bold text-amber-800 font-mono">22 phút (Chớm vượt SLA)</span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-600 rounded-full" style={{ width: "90%" }} />
                </div>
              </div>

              {/* Laboratory Hematology */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">Xét nghiệm CTM P.202 (Mục tiêu: ≤ 45 phút)</span>
                  <span className="font-bold text-emerald-700 font-mono">38 phút (Đạt SLA)</span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full" style={{ width: "65%" }} />
                </div>
              </div>

              {/* ECG Functional */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">Đo điện tim ECG P.208 (Mục tiêu: ≤ 15 phút)</span>
                  <span className="font-bold text-emerald-700 font-mono">11 phút (Đạt SLA)</span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full" style={{ width: "55%" }} />
                </div>
              </div>

              <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200 text-xs text-blue-900 leading-relaxed flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <div>
                  <b>Khuyến nghị điều hành:</b> Lưu lượng bệnh nhân dồn ứ tại Phòng Siêu âm trong khung
                  giờ <b>09:00 - 10:30</b>. Đề xuất mở thêm bàn siêu âm số 2 vào các buổi sáng đầu tuần.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Revenue Structure by Service Group */}
        <div className="lg:col-span-6 space-y-4">
          <Card>
            <CardHeader className="pb-3 border-b border-slate-100">
              <span className="text-[11px] uppercase font-bold text-clinic-blue tracking-wider">
                DOANH THU & CƠ CẤU DỊCH VỤ
              </span>
              <CardTitle className="text-base">Phân tích nguồn thu dịch vụ khám & CLS</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Nhóm dịch vụ</th>
                      <th className="p-3 text-center">Số lượt</th>
                      <th className="p-3 text-right">Doanh thu (VND)</th>
                      <th className="p-3 text-center">Tỷ trọng</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-900">
                        Xét nghiệm huyết học & hóa sinh
                      </td>
                      <td className="p-3 text-center font-mono font-bold">1.420</td>
                      <td className="p-3 text-right font-mono font-bold text-clinic-blue">
                        182.500.000 đ
                      </td>
                      <td className="p-3 text-center">
                        <Badge variant="default" className="font-bold">38%</Badge>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-900">
                        Khám lâm sàng chuyên khoa
                      </td>
                      <td className="p-3 text-center font-mono font-bold">2.486</td>
                      <td className="p-3 text-right font-mono font-bold text-clinic-blue">
                        148.000.000 đ
                      </td>
                      <td className="p-3 text-center">
                        <Badge variant="purple" className="font-bold">31%</Badge>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-900">
                        Siêu âm màu & Doppler
                      </td>
                      <td className="p-3 text-center font-mono font-bold">640</td>
                      <td className="p-3 text-right font-mono font-bold text-clinic-blue">
                        96.000.000 đ
                      </td>
                      <td className="p-3 text-center">
                        <Badge variant="warn" className="font-bold">20%</Badge>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-900">
                        CĐHA khác (X-quang, ECG)
                      </td>
                      <td className="p-3 text-center font-mono font-bold">580</td>
                      <td className="p-3 text-right font-mono font-bold text-clinic-blue">
                        52.800.000 đ
                      </td>
                      <td className="p-3 text-center">
                        <Badge variant="neutral" className="font-bold">11%</Badge>
                      </td>
                    </tr>
                  </tbody>
                  <tfoot className="bg-slate-100 font-bold text-slate-900 border-t border-slate-200">
                    <tr>
                      <td className="p-3 uppercase">Tổng cộng doanh thu</td>
                      <td className="p-3 text-center font-mono">5.126</td>
                      <td className="p-3 text-right font-mono text-emerald-800 text-sm">
                        479.300.000 đ
                      </td>
                      <td className="p-3 text-center font-mono">100%</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                <span>Dữ liệu chốt sổ đến 17/09/2026 23:00</span>
                <span className="font-bold text-slate-700">Tỷ lệ thanh toán VietQR: 64.2%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
