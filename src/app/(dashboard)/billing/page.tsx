"use client";

import * as React from "react";
import { PageHeader } from "@/shared/components/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { VietQRCard } from "@/shared/components/vietqr-card";
import { useUIStore } from "@/shared/stores/ui.store";
import { useDemoJourneyStore } from "@/shared/stores/demo-journey.store";
import { useWorkspaceStore } from "@/shared/stores/workspace.store";
import { MOCK_ACTIVE_ENCOUNTER } from "@/shared/constants/mock-data";
import { formatCurrencyVND } from "@/shared/lib/formatters";
import {
  CreditCard,
  CheckCircle2,
  ShieldCheck,
  Printer,
  ArrowRight,
  Building2,
  Receipt,
  QrCode,
  Sparkles,
  RotateCcw,
} from "lucide-react";

export default function BillingPage() {
  const { showToast, openPrintModal } = useUIStore();
  const {
    patientName,
    patientCode,
    encounterCode,
    isPaid,
    paymentMethod,
    authorizationStatus,
    confirmPayment,
  } = useDemoJourneyStore();

  const { authorizeAllRound } = useWorkspaceStore();
  const encounter = MOCK_ACTIVE_ENCOUNTER;

  const handleConfirmCash = () => {
    confirmPayment("CASH");
    authorizeAllRound();
    showToast("Đã xác nhận thu 400.000đ tiền mặt! Tất cả dịch vụ CLS đã chuyển sang AUTHORIZED.");
  };

  const handleConfirmQR = () => {
    confirmPayment("VIETQR");
    authorizeAllRound();
    showToast("Webhook VietQR Napas247 xác nhận giao dịch thành công! Đã cấp quyền AUTHORIZED.");
  };

  const handleCompanyCreditWaiver = () => {
    confirmPayment("COMPANY_CREDIT");
    authorizeAllRound();
    showToast("Đã ghi nhận diện Bảo lãnh doanh nghiệp / Khám sức khỏe công ty! Dịch vụ được AUTHORIZED mà không thu tiền mặt.");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="QUẦY THU NGÂN & QUẢN TRỊ VIỆN PHÍ"
        title="Thu ngân & Quản lý Quyền thực hiện dịch vụ (Payment Gate)"
        description="Nguyên tắc Payment Gate: Chỉ khi thu ngân xác nhận nộp tiền hoặc duyệt bảo lãnh hợp lệ, dịch vụ mới chuyển sang trạng thái AUTHORIZED để mở cổng phòng CLS"
        action={
          <Button variant="outline" onClick={() => openPrintModal("invoice")} className="font-bold text-xs h-9">
            <Printer className="w-4 h-4 mr-1.5" />
            In hóa đơn tạm thu & VietQR
          </Button>
        }
      />

      {/* Patient & Invoice Banner */}
      <Card className="border-slate-800 shadow-md bg-slate-900 text-white">
        <CardContent className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono font-bold text-blue-400">{encounter.invoice.invoiceCode}</span>
              <span className="text-slate-500">•</span>
              <span className="font-black text-sm uppercase text-white">{patientName}</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">{patientCode}</span>
            </div>
            <p className="text-slate-400 mt-1">
              Lượt khám: <b>{encounterCode}</b> • Bác sĩ chỉ định: BS. Lê Minh (P.203 — Nội tổng quát)
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">TRẠNG THÁI VIỆN PHÍ:</span>
              <span className="font-bold text-xs text-white">
                {isPaid
                  ? paymentMethod === "COMPANY_CREDIT"
                    ? "Bảo lãnh doanh nghiệp (Nợ đối tác)"
                    : `Đã thu (${paymentMethod === "VIETQR" ? "VietQR Napas247" : "Tiền mặt"})`
                  : "Chờ thanh toán (Payment Gate)"}
              </span>
            </div>
            <Badge
              variant={isPaid ? "success" : "danger"}
              className="text-xs font-bold py-1 px-3 uppercase"
            >
              {isPaid ? "AUTHORIZED (ĐÃ MỞ CỔNG)" : "GATE LOCKED"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Itemized Breakdown (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
            <CardHeader className="bg-slate-50/80 p-4 border-b border-slate-200 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold text-slate-800">
                Chi tiết dịch vụ phát sinh y lệnh (Đợt 1 — 4 khoản mục)
              </CardTitle>
              <Badge variant="outline" className="text-[11px] font-mono font-bold text-slate-600 bg-white">
                Bảng giá niêm yết 2026
              </Badge>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                  <tr>
                    <th className="p-3 text-left">Tên dịch vụ y tế</th>
                    <th className="p-3 text-center">Phòng</th>
                    <th className="p-3 text-right">Đơn giá</th>
                    <th className="p-3 text-center">Trạng thái thanh toán</th>
                    <th className="p-3 text-right">Quyền thực hiện</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-3 font-semibold text-slate-800">Khám lâm sàng Nội tổng quát (Chuyên gia)</td>
                    <td className="p-3 text-center text-slate-500 font-mono">P.203</td>
                    <td className="p-3 text-right font-mono font-bold">150.000 đ</td>
                    <td className="p-3 text-center">
                      <span className="text-emerald-700 font-semibold text-[11px]">Đã thu</span>
                    </td>
                    <td className="p-3 text-right">
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                        AUTHORIZED
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-800">Tổng phân tích tế bào máu ngoại vi (CTM 18 chỉ số)</td>
                    <td className="p-3 text-center text-slate-500 font-mono">P.202</td>
                    <td className="p-3 text-right font-mono font-bold">85.000 đ</td>
                    <td className="p-3 text-center">
                      <span className={isPaid ? "text-emerald-700 font-semibold text-[11px]" : "text-amber-700 font-semibold text-[11px]"}>
                        {isPaid ? "Đã xác nhận" : "Chờ thu"}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                        authorizationStatus === "AUTHORIZED" || authorizationStatus === "WAIVED"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}>
                        {authorizationStatus === "AUTHORIZED" || authorizationStatus === "WAIVED" ? "AUTHORIZED" : "PENDING"}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-800">Định lượng Glucose máu tĩnh mạch (Hóa sinh)</td>
                    <td className="p-3 text-center text-slate-500 font-mono">P.202</td>
                    <td className="p-3 text-right font-mono font-bold">45.000 đ</td>
                    <td className="p-3 text-center">
                      <span className={isPaid ? "text-emerald-700 font-semibold text-[11px]" : "text-amber-700 font-semibold text-[11px]"}>
                        {isPaid ? "Đã xác nhận" : "Chờ thu"}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                        authorizationStatus === "AUTHORIZED" || authorizationStatus === "WAIVED"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}>
                        {authorizationStatus === "AUTHORIZED" || authorizationStatus === "WAIVED" ? "AUTHORIZED" : "PENDING"}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-800">Điện tâm đồ thông thường (ECG 12 chuyển đạo)</td>
                    <td className="p-3 text-center text-slate-500 font-mono">P.208</td>
                    <td className="p-3 text-right font-mono font-bold">120.000 đ</td>
                    <td className="p-3 text-center">
                      <span className={isPaid ? "text-emerald-700 font-semibold text-[11px]" : "text-amber-700 font-semibold text-[11px]"}>
                        {isPaid ? "Đã xác nhận" : "Chờ thu"}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                        authorizationStatus === "AUTHORIZED" || authorizationStatus === "WAIVED"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}>
                        {authorizationStatus === "AUTHORIZED" || authorizationStatus === "WAIVED" ? "AUTHORIZED" : "PENDING"}
                      </span>
                    </td>
                  </tr>
                </tbody>
                <tfoot className="bg-slate-50 font-bold border-t border-slate-200">
                  <tr>
                    <td colSpan={2} className="p-3 text-right uppercase text-slate-700">TỔNG CỘNG TIỀN PHẢI NỘP:</td>
                    <td colSpan={3} className="p-3 text-right text-base text-clinic-blue font-mono font-black">
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
          <Card className="border-slate-200 shadow-sm bg-white">
            <CardHeader className="bg-slate-50/80 p-4 border-b border-slate-200">
              <CardTitle className="text-sm font-bold text-slate-800">
                Thanh toán VietQR Napas247 & Mở cổng dịch vụ
              </CardTitle>
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
                <Button variant="default" onClick={handleConfirmCash} className="font-bold h-10 bg-emerald-600 hover:bg-emerald-700 text-white">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  1. Xác nhận đã thu Tiền mặt (400.000đ)
                </Button>

                <Button variant="outline" onClick={handleConfirmQR} className="border-blue-300 text-clinic-blue hover:bg-blue-50 font-bold h-10">
                  <QrCode className="w-4 h-4 mr-2" />
                  2. Mô phỏng Webhook VietQR (Tự động xác nhận)
                </Button>

                {/* Case 2 Demo: Company Credit / Insurance */}
                <Button
                  variant="outline"
                  onClick={handleCompanyCreditWaiver}
                  className="border-purple-300 text-purple-700 hover:bg-purple-50 font-bold h-10"
                >
                  <Building2 className="w-4 h-4 mr-2 text-purple-600" />
                  3. Case Demo: Bảo lãnh Doanh nghiệp (Ghi nợ công ty)
                </Button>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-600 text-[11px] leading-relaxed">
                <b>Nguyên tắc bóc tách kiến trúc: </b>
                Dịch vụ được mở quyền thực hiện (AUTHORIZED) có thể thông qua thanh toán trực tiếp hoặc qua cơ chế miễn/bảo lãnh hợp lệ mà không giả lập giao dịch tiền mặt đã thu.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
