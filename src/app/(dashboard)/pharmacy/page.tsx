"use client";

import * as React from "react";
import Link from "next/link";
import { PageHeader } from "@/shared/components/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Input } from "@/shared/ui/input";
import { useUIStore } from "@/shared/stores/ui.store";
import { useDemoJourneyStore } from "@/shared/stores/demo-journey.store";
import {
  QrCode,
  CheckCircle2,
  Printer,
  ShieldAlert,
  ArrowRight,
  Pill,
  Sparkles,
  PackageCheck,
  Check,
} from "lucide-react";

interface DispensingItem {
  id: string;
  name: string;
  instructions: string;
  quantity: string;
  batchNumber: string;
  expiryDate: string;
}

export default function PharmacyPage() {
  const { showToast } = useUIStore();
  const {
    patientName,
    patientCode,
    encounterCode,
    rxCode,
    isDispensed,
    dispensePrescription,
  } = useDemoJourneyStore();

  const [inputCode, setInputCode] = React.useState(rxCode || "RX-260919-018");

  const [items] = React.useState<DispensingItem[]>([
    {
      id: "med-1",
      name: "Amlodipine 5mg (Kháng calci)",
      instructions: "Uống 1 viên vào lúc 08h00 sáng sau ăn no",
      quantity: "30 viên (1 tháng)",
      batchNumber: "AML2604",
      expiryDate: "12/2027",
    },
    {
      id: "med-2",
      name: "Atorvastatin 10mg (Hạ lipid máu)",
      instructions: "Uống 1 viên vào lúc 20h00 tối sau ăn no",
      quantity: "30 viên (1 tháng)",
      batchNumber: "ATV2602",
      expiryDate: "09/2027",
    },
  ]);

  const handleSimulateScan = () => {
    setInputCode(rxCode || "RX-260919-018");
    showToast(`Quét thành công mã QR ${rxCode || "RX-260919-018"} (Toàn bộ đơn tải tức thì, không cần nhập lại)`);
  };

  const handleDispense = () => {
    dispensePrescription();
    showToast("Đã xác nhận cấp phát thuốc thành công cho bệnh nhân Nguyễn Văn An!");
  };

  const handlePrintLabel = () => {
    showToast("Đang in tem nhãn hướng dẫn liều dùng dán lọ thuốc...");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="QUẦY THUỐC & CẤP PHÁT ĐIỆN TỬ"
        title="Quét mã QR & Cấp phát thuốc (Zero Re-typing)"
        description="Nhận diện đơn thuốc tức thì qua mã QR điện tử, đối soát cảnh báo an toàn dị ứng thuốc và xác nhận cấp phát không cần nhập lại dữ liệu"
        action={
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-300 rounded-full text-xs font-bold flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" />
              Không cần gõ lại đơn thuốc
            </span>
          </div>
        }
      />

      {/* Safety Alert Banner */}
      <div className="p-4 bg-red-50 border-2 border-red-300 rounded-2xl flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5">
          <ShieldAlert className="w-5 h-5 text-red-600 shrink-0" />
          <div className="text-xs text-red-900 leading-snug">
            <strong>ĐỐI SOÁT AN TOÀN DƯỢC: </strong> Bệnh nhân <b>{patientName}</b> có tiền sử{" "}
            <span className="font-black underline">Dị ứng Penicillin</span> (Phản vệ độ 2). Đơn thuốc này đã được bác sĩ kê an toàn, không chứa nhóm kháng sinh Beta-lactam.
          </div>
        </div>
        <Badge variant="danger" className="text-[10px] uppercase font-bold shrink-0">
          AN TOÀN ✓
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Column: QR Scanner Simulator (4 cols) */}
        <div className="md:col-span-5 lg:col-span-4 space-y-4">
          <Card className="border-slate-200 shadow-sm bg-white text-center">
            <CardHeader className="pb-2">
              <span className="text-[10px] uppercase font-bold text-clinic-blue tracking-wider">
                MÁY QUÉT MÃ TOA THUỐC (RX QR SCANNER)
              </span>
              <CardTitle className="text-sm font-bold text-slate-900">
                Quét mã từ toa giấy hoặc điện thoại
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-44 border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center bg-slate-50 p-4 relative overflow-hidden group">
                <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-clinic-blue mb-2 shadow-sm">
                  <QrCode className="w-8 h-8" />
                </div>
                <span className="text-xs font-bold text-slate-800">Đưa mã QR trên toa thuốc vào vùng quét</span>
                <span className="text-[11px] text-slate-500 mt-0.5">Máy quét 2D quang học hoặc Camera</span>

                {/* Laser scan line simulation */}
                <div className="absolute inset-x-4 top-1/2 h-0.5 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse" />
              </div>

              <div className="space-y-2">
                <Input
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  className="font-mono text-xs uppercase font-bold text-center"
                  placeholder="Mã đơn thuốc..."
                />

                <Button
                  type="button"
                  onClick={handleSimulateScan}
                  className="w-full font-bold text-xs bg-clinic-blue text-white h-10 shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                  Mô phỏng: Quét mã {rxCode}
                </Button>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-left text-xs space-y-1 text-slate-600">
                <div className="font-bold text-slate-800 flex items-center gap-1">
                  <PackageCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Nguyên tắc Handoff Dược:
                </div>
                <p className="text-[11px] leading-relaxed">
                  Toàn bộ thuốc, hàm lượng, số lượng và liều dùng tự động điền vào quầy thuốc, loại bỏ 100% rủi ro nhập sai dữ liệu.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Dispensing Table (8 cols) */}
        <div className="md:col-span-7 lg:col-span-8 space-y-4">
          <Card className="border-slate-200 shadow-sm bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-100 p-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-clinic-blue tracking-wider">
                  THÔNG TIN ĐƠN THUỐC ĐÃ NHẬN DIỆN
                </span>
                <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2 mt-0.5">
                  Đơn thuốc: <span className="font-mono text-clinic-blue">{inputCode}</span>
                  <span className="text-xs font-normal text-slate-500">(BS. Lê Minh — P.203)</span>
                </CardTitle>
              </div>
              <Badge variant={isDispensed ? "success" : "warn"} className="font-bold">
                {isDispensed ? "ĐÃ CẤP PHÁT XONG" : "CHỜ CẤP PHÁT"}
              </Badge>
            </CardHeader>

            <CardContent className="p-4 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>Bệnh nhân: <b className="text-slate-900 uppercase">{patientName}</b> ({patientCode})</div>
                <div>Lượt khám: <b className="font-mono text-slate-900">{encounterCode}</b></div>
                <div>Chẩn đoán: <b className="text-slate-900">I10 - Tăng huyết áp nguyên phát</b></div>
              </div>

              {/* Medication Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Tên thuốc & Cách dùng</th>
                      <th className="p-3 text-center">Số lượng</th>
                      <th className="p-3">Số lô / HSD</th>
                      <th className="p-3 text-center">Đối soát</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {items.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3">
                          <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                            <Pill className="w-3.5 h-3.5 text-clinic-blue shrink-0" />
                            {item.name}
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">{item.instructions}</div>
                        </td>
                        <td className="p-3 text-center font-bold font-mono text-slate-900 text-sm">
                          {item.quantity}
                        </td>
                        <td className="p-3">
                          <div className="font-mono text-xs font-bold text-slate-800">
                            Lô: {item.batchNumber}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono">HSD: {item.expiryDate}</div>
                        </td>
                        <td className="p-3 text-center">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full font-bold text-[11px]">
                            <Check className="w-3 h-3" />
                            Khớp 100%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handlePrintLabel}
                  className="w-full sm:w-auto font-bold text-xs text-slate-700"
                >
                  <Printer className="w-4 h-4 mr-1.5" />
                  In tem dán lọ thuốc
                </Button>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Link href="/appointments" className="w-full sm:w-auto">
                    <Button variant="ghost" size="sm" className="w-full font-bold text-xs text-slate-600">
                      Lịch tái khám →
                    </Button>
                  </Link>

                  <Button
                    type="button"
                    disabled={isDispensed}
                    onClick={handleDispense}
                    className={`w-full sm:w-auto font-bold text-xs h-10 ${
                      isDispensed
                        ? "bg-slate-300 text-slate-600 cursor-not-allowed"
                        : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20"
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-1.5" />
                    {isDispensed ? "Đã cấp phát xong ✓" : "Xác nhận cấp phát thuốc →"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
