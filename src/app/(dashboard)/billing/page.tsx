"use client";

import * as React from "react";
import { PageHeader } from "@/shared/components/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { VietQRCard } from "@/shared/components/vietqr-card";
import { useUIStore } from "@/shared/stores/ui.store";
import { MOCK_ACTIVE_ENCOUNTER } from "@/shared/constants/mock-data";
import { formatCurrencyVND } from "@/shared/lib/formatters";
import { CreditCard, CheckCircle2, ShieldCheck, Printer, ArrowRight } from "lucide-react";

export default function BillingPage() {
  const { showToast, openPrintModal } = useUIStore();
  const encounter = MOCK_ACTIVE_ENCOUNTER;
  const [isPaid, setIsPaid] = React.useState(encounter.invoice.status === "PAID");

  const handleConfirmCash = () => {
    setIsPaid(true);
    showToast("Đã xác nhận thu tiền mặt! Dịch vụ đã chuyển trạng thái PAID_AUTHORIZED mở cổng phòng CLS.");
  };

  const handleConfirmQR = () => {
    setIsPaid(true);
    showToast("Webhook VietQR Napas247 đã xác nhận giao dịch thành công! Đã kích hoạt PAID_AUTHORIZED.");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="CỔNG THANH TOÁN VIỆN PHÍ (UC-BIL-01 → 08 / BR-003)"
        title="12. Billing & Payment Gate — Quầy Thu Ngân Tầng 1"
        description="Nguyên tắc Payment Gate: Chỉ khi thu ngân xác nhận nộp tiền hoặc quét VietQR thành công, dịch vụ mới chuyển thành PAID_AUTHORIZED"
        action={
          <Button variant="outline" onClick={() => openPrintModal("invoice")} className="font-bold">
            <Printer className="w-4 h-4 mr-1.5" />
            In hóa đơn tạm thu (VietQR)
          </Button>
        }
      />

      {/* Patient & Invoice Banner */}
      <Card className="border-slate-200 shadow-sm bg-slate-900 text-white">
        <CardContent className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-blue-400">{encounter.invoice.invoiceCode}</span>
              <span className="text-slate-400">•</span>
              <span className="font-black text-sm uppercase text-white">{encounter.patientName}</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">{encounter.patientCode}</span>
            </div>
            <p className="text-slate-400 mt-1">
              Lượt khám: <b>{encounter.encounterCode}</b> (STT {encounter.queueNumber}) • Bác sĩ chỉ định: {encounter.doctorName} (P.203)
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={isPaid ? "success" : "danger"} className="text-xs font-bold py-1 px-3">
              {isPaid ? "ĐÃ THANH TOÁN (PAID_AUTHORIZED)" : "CHỜ THANH TOÁN (PAYMENT GATE)"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Itemized Breakdown (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="bg-slate-50/70 p-4 border-b border-slate-200 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold text-slate-800">
                Chi tiết các dịch vụ phát sinh y lệnh (Round 1)
              </CardTitle>
              <span className="text-xs text-slate-500 font-mono">4 khoản mục</span>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                  <tr>
                    <th className="p-3 text-left">Dịch vụ</th>
                    <th className="p-3 text-center">Phòng</th>
                    <th className="p-3 text-right">Đơn giá</th>
                    <th className="p-3 text-right">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-3 font-semibold text-slate-800">Khám lâm sàng Nội tổng quát (Chuyên gia)</td>
                    <td className="p-3 text-center text-slate-500 font-mono">P.203</td>
                    <td className="p-3 text-right font-mono font-bold">150.000 đ</td>
                    <td className="p-3 text-right">
                      <span className="text-emerald-700 font-bold">Đã thanh toán</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-800">Tổng phân tích tế bào máu ngoại vi (CTM)</td>
                    <td className="p-3 text-center text-slate-500 font-mono">P.202</td>
                    <td className="p-3 text-right font-mono font-bold">85.000 đ</td>
                    <td className="p-3 text-right">
                      <span className="text-emerald-700 font-bold">PAID_AUTHORIZED</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-800">Định lượng Glucose máu tĩnh mạch</td>
                    <td className="p-3 text-center text-slate-500 font-mono">P.202</td>
                    <td className="p-3 text-right font-mono font-bold">45.000 đ</td>
                    <td className="p-3 text-right">
                      <span className="text-emerald-700 font-bold">PAID_AUTHORIZED</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-800">Điện tâm đồ thông thường (ECG 12 cần)</td>
                    <td className="p-3 text-center text-slate-500 font-mono">P.208</td>
                    <td className="p-3 text-right font-mono font-bold">120.000 đ</td>
                    <td className="p-3 text-right">
                      <span className="text-emerald-700 font-bold">PAID_AUTHORIZED</span>
                    </td>
                  </tr>
                </tbody>
                <tfoot className="bg-slate-50 font-bold border-t border-slate-200">
                  <tr>
                    <td colSpan={2} className="p-3 text-right uppercase text-slate-700">TỔNG CỘNG TIỀN PHẢI NỘP:</td>
                    <td colSpan={2} className="p-3 text-right text-base text-clinic-blue font-mono font-black">
                      400.000 đ
                    </td>
                  </tr>
                </tfoot>
              </table>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Payment Gate Actions & Dynamic VietQR (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="bg-slate-50/70 p-4 border-b border-slate-200">
              <CardTitle className="text-sm font-bold text-slate-800">Xác nhận thanh toán & Mở cổng CLS</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4 text-xs">
              <VietQRCard
                bankName={encounter.invoice.vietQR.bankName}
                accountNumber={encounter.invoice.vietQR.accountNumber}
                accountName={encounter.invoice.vietQR.accountName}
                amount={encounter.invoice.vietQR.amount}
                transferContent={encounter.invoice.vietQR.transferContent}
              />

              <div className="flex flex-col gap-2 pt-2">
                <Button variant="default" onClick={handleConfirmCash} className="font-bold h-10">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Xác nhận đã thu Tiền mặt (400.000đ)
                </Button>
                <Button variant="outline" onClick={handleConfirmQR} className="border-blue-300 text-clinic-blue hover:bg-blue-50 font-bold h-10">
                  Simulate Webhook VietQR (Xác nhận chuyển khoản)
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
