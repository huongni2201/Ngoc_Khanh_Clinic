"use client";

import * as React from "react";
import Link from "next/link";
import { PageHeader } from "@/shared/components/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Input } from "@/shared/ui/input";
import { useUIStore } from "@/shared/stores/ui.store";
import {
  QrCode,
  CheckCircle2,
  Printer,
  ShieldAlert,
  ArrowRight,
  Pill,
  Sparkles,
  PackageCheck,
  Search,
  Check,
} from "lucide-react";

interface DispensingItem {
  id: string;
  name: string;
  instructions: string;
  quantity: string;
  batchNumber: string;
  expiryDate: string;
  stock: number;
  isScanned: boolean;
}

export default function PharmacyPage() {
  const { showToast } = useUIStore();
  const [rxCode, setRxCode] = React.useState("RX-260917-0018");
  const [isScannedSuccess, setIsScannedSuccess] = React.useState(true);
  const [isDispensed, setIsDispensed] = React.useState(false);

  const [items, setItems] = React.useState<DispensingItem[]>([
    {
      id: "med-1",
      name: "Amlodipine 5mg",
      instructions: "1 viên/ngày (uống buổi sáng sau ăn)",
      quantity: "30 viên",
      batchNumber: "AML2604",
      expiryDate: "12/2027",
      stock: 480,
      isScanned: true,
    },
    {
      id: "med-2",
      name: "Ginkgo Biloba 80mg",
      instructions: "2 viên/ngày (chia sáng 1, tối 1 sau ăn)",
      quantity: "60 viên",
      batchNumber: "GNK2511",
      expiryDate: "08/2027",
      stock: 320,
      isScanned: true,
    },
    {
      id: "med-3",
      name: "Paracetamol 500mg",
      instructions: "1 viên/lần khi đau đầu nhiều, cách nhau ít nhất 6 tiếng",
      quantity: "10 viên",
      batchNumber: "PARA2601",
      expiryDate: "05/2028",
      stock: 1200,
      isScanned: true,
    },
  ]);

  const handleSimulateScan = () => {
    setIsScannedSuccess(true);
    setIsDispensed(false);
    showToast("Mô phỏng: Đã quét thành công mã đơn RX-260917-0018 (Zero Re-typing)");
  };

  const handleDispense = () => {
    setIsDispensed(true);
    showToast("Đã xác nhận cấp phát thuốc thành công! Đã tự động trừ tồn kho và lưu audit trail.");
  };

  const handlePrintLabel = () => {
    showToast("Đang in tem hướng dẫn liều dùng cho 3 loại thuốc...");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="QUẦY THUỐC & CẤP PHÁT (UC-PHM-01 → 03 / BR-006)"
        title="21. Pharmacy Handoff — Quét QR & Cấp phát thuốc"
        description="Nhận diện đơn thuốc tức thì qua mã QR điện tử (Zero Re-typing), đối soát số lô, hạn dùng và cảnh báo an toàn dị ứng thuốc"
        action={
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              Không cần gõ lại đơn thuốc
            </span>
          </div>
        }
      />

      {/* Safety Alert Banner */}
      <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-red-600 shrink-0" />
          <div className="text-xs text-red-900">
            <strong>CẢNH BÁO AN TOÀN DƯỢC:</strong> Bệnh nhân Nguyễn Văn An có tiền sử{" "}
            <span className="font-black underline">Dị ứng Penicillin</span> (Sốc phản vệ độ 2). Đơn thuốc
            này đã được hệ thống kiểm tra an toàn, không chứa nhóm kháng sinh Beta-lactam.
          </div>
        </div>
        <Badge variant="danger" className="text-[10px] uppercase font-bold shrink-0">
          ĐÃ ĐỐI SOÁT
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column: QR Scanner Simulator */}
        <div className="md:col-span-5 lg:col-span-4 space-y-4">
          <Card className="text-center">
            <CardHeader className="pb-2">
              <span className="text-[11px] uppercase font-bold text-clinic-blue tracking-wider">
                QUÉT MÃ ĐƠN THUỐC (RX QR SCANNER)
              </span>
              <CardTitle className="text-base">Quét mã QR từ toa thuốc giấy hoặc Patient Portal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-48 border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center bg-slate-50/80 p-4 relative overflow-hidden group">
                <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center text-clinic-blue mb-3 group-hover:scale-110 transition-transform">
                  <QrCode className="w-10 h-10" />
                </div>
                <span className="text-xs font-bold text-slate-700">Đưa mã QR trên toa thuốc vào vùng quét</span>
                <span className="text-[11px] text-slate-500 mt-0.5">Máy quét 2D cầm tay hoặc Camera tích hợp</span>

                {/* Scanning laser line simulation */}
                <div className="absolute inset-x-4 top-1/2 h-0.5 bg-red-500/70 shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse" />
              </div>

              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={rxCode}
                    onChange={(e) => setRxCode(e.target.value)}
                    className="font-mono text-xs uppercase font-bold text-center"
                    placeholder="Mã đơn thuốc..."
                  />
                </div>

                <Button
                  type="button"
                  onClick={handleSimulateScan}
                  className="w-full font-bold bg-clinic-blue text-white active:scale-[0.98] transition-transform"
                >
                  <Sparkles className="w-4 h-4 mr-1.5" />
                  Mô phỏng: Quét mã RX-260917-0018
                </Button>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-left text-xs space-y-1 text-slate-600">
                <div className="font-bold text-slate-800 flex items-center gap-1">
                  <PackageCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Quy tắc nghiệp vụ BR-006:
                </div>
                <p className="text-[11px] leading-relaxed">
                  Khi quét mã QR, dữ liệu đơn thuốc tự động truyền thẳng vào hệ thống cấp phát thuốc mà
                  không cần nhân viên nhập lại bất kỳ thông tin nào, triệt tiêu 100% lỗi sao chép đơn.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Dispensing Table with Batches and Inventory */}
        <div className="md:col-span-7 lg:col-span-8 space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[11px] uppercase font-bold text-clinic-blue tracking-wider">
                  THÔNG TIN ĐƠN THUỐC ĐÃ NHẬN DIỆN
                </span>
                <CardTitle className="text-lg flex items-center gap-2 mt-0.5">
                  Đơn thuốc: <span className="font-mono text-clinic-blue">{rxCode}</span>
                  <span className="text-xs font-normal text-slate-500">(BS. Lê Minh — P.203)</span>
                </CardTitle>
              </div>
              {isDispensed ? (
                <Badge variant="success" className="font-bold flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  ĐÃ CẤP PHÁT THÀNH CÔNG
                </Badge>
              ) : (
                <Badge variant="warn" className="font-bold">
                  CHỜ CẤP PHÁT
                </Badge>
              )}
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  Bệnh nhân: <b className="text-slate-900 uppercase">Nguyễn Văn An</b> (PT-001842)
                </div>
                <div>
                  SĐT: <b className="font-mono text-slate-900">0912 345 678</b>
                </div>
                <div>
                  Ngày kê đơn: <b className="text-slate-900">17/09/2026 10:15</b>
                </div>
                <div>
                  Chẩn đoán: <b className="text-slate-900">I10 - Tăng huyết áp vô căn</b>
                </div>
              </div>

              {/* Medication Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Tên thuốc & Cách dùng</th>
                      <th className="p-3 text-center">Số lượng</th>
                      <th className="p-3">Số lô / HSD</th>
                      <th className="p-3 text-center">Tồn kho</th>
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
                          <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-md font-mono font-bold text-[11px]">
                            Tồn: {item.stock}v
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-clinic-blue border border-blue-200 rounded-full font-bold text-[11px]">
                            <Check className="w-3 h-3" />
                            Đã quét
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
                  className="w-full sm:w-auto font-bold text-slate-700"
                >
                  <Printer className="w-4 h-4 mr-1.5" />
                  In hướng dẫn sử dụng & Tem dán lọ thuốc
                </Button>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Link href="/appointments" className="w-full sm:w-auto">
                    <Button variant="ghost" size="sm" className="w-full font-bold text-slate-600">
                      Hẹn tái khám →
                    </Button>
                  </Link>

                  <Button
                    type="button"
                    disabled={isDispensed}
                    onClick={handleDispense}
                    className={`w-full sm:w-auto font-bold ${
                      isDispensed
                        ? "bg-slate-300 text-slate-600 cursor-not-allowed"
                        : "bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm"
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-1.5" />
                    {isDispensed ? "Đã cấp phát xong" : "Xác nhận cấp phát & Trừ kho →"}
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
