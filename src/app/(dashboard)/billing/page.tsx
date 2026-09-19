"use client";

import * as React from "react";
import Link from "next/link";
import { PageHeader } from "@/shared/components/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Input } from "@/shared/ui/input";
import { VietQRCard } from "@/shared/components/vietqr-card";
import { useUIStore } from "@/shared/stores/ui.store";
import { useDemoClinicFlowStore } from "@/shared/stores/demo-clinic-flow.store";
import { useWorkspaceStore } from "@/shared/stores/workspace.store";
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
  Banknote,
  Search,
  Sparkles,
  RotateCcw,
  Check,
  AlertCircle,
  Layers,
} from "lucide-react";

export default function DiagnosticBillingPage() {
  const { showToast, openPrintModal } = useUIStore();
  const {
    patientName,
    patientCode,
    encounterCode,
    journeyStage,
    diagnosticInvoiceStatus,
    diagnosticPaymentMethod,
    orders,
    confirmDiagnosticPayment,
  } = useDemoClinicFlowStore();

  const { authorizeAllRound } = useWorkspaceStore();

  const [searchQuery, setSearchQuery] = React.useState("ENC-260919-041");
  const [selectedMethod, setSelectedMethod] = React.useState<"CASH" | "VIETQR" | "POS" | "COMPANY_CREDIT">("VIETQR");
  const [isSuccessPaid, setIsSuccessPaid] = React.useState(() => diagnosticInvoiceStatus === "PAID");

  const round1Orders = orders.filter((o) => o.round === 1);
  const totalAmount = round1Orders.reduce((sum, o) => sum + o.price, 0);

  const isAlreadyPaid = diagnosticInvoiceStatus === "PAID" || isSuccessPaid;

  const handleConfirmPayment = (method?: "CASH" | "VIETQR" | "POS" | "COMPANY_CREDIT") => {
    const chosen = method || selectedMethod;
    confirmDiagnosticPayment(chosen);
    authorizeAllRound();
    setIsSuccessPaid(true);

    if (chosen === "COMPANY_CREDIT") {
      showToast("Đã duyệt bảo lãnh doanh nghiệp (WAIVED)! Quyền thực hiện CLS đã mở.");
    } else {
      showToast(`Đã xác nhận thanh toán ${formatCurrencyVND(totalAmount)}! 3/3 dịch vụ CLS đã AUTHORIZED.`);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="QUẢN TRỊ VIỆN PHÍ & ĐỐI SOÁT"
        title="Đối soát & Quản lý Viện phí Cận Lâm Sàng"
        description="Phân hệ dành cho Kế toán / Thu ngân đối soát giao dịch, tra cứu hóa đơn và xử lý bảo lãnh/hoàn phí. Lưu ý: Quy trình khám chuẩn thu phí CLS trực tiếp tại phòng khám Bác sĩ."
        action={
          <div className="flex items-center gap-2">
            <Link href="/clinical">
              <Button variant="outline" size="sm" className="font-bold text-xs">
                Tới buồng khám Bác sĩ →
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={() => openPrintModal("payment-slip")}
              className="font-bold text-xs"
            >
              <Receipt className="w-3.5 h-3.5 mr-1" />
              Xem Phiếu thanh toán
            </Button>
            {isAlreadyPaid && (
              <Button
                variant="success"
                size="sm"
                onClick={() => openPrintModal("routing")}
                className="font-bold text-xs"
              >
                <Printer className="w-3.5 h-3.5 mr-1" />
                In phiếu chỉ định CLS
              </Button>
            )}
          </div>
        }
      />

      {/* Search Header Bar */}
      <Card className="border-slate-200 shadow-sm bg-white">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm theo Mã lượt khám (ENC), Mã BN hoặc Số hóa đơn..."
                className="text-xs font-mono font-bold"
              />
              <Button size="sm" variant="outline" className="text-xs font-bold shrink-0">
                Tìm kiếm
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-medium">Đợt chỉ định:</span>
              <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold font-mono text-xs">
                Đợt 1 ({round1Orders.length} dịch vụ)
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Success Notification Banner when Paid */}
      {isAlreadyPaid && (
        <Card className="border-emerald-300 bg-emerald-50/90 text-emerald-950 p-5 shadow-lg animate-in zoom-in-95 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                  THANH TOÁN THÀNH CÔNG • ĐÃ MỞ QUYỀN THỰC HIỆN
                </span>
                <div className="text-base font-black text-emerald-950 mt-0.5 uppercase">
                  {patientName} — {encounterCode}
                </div>
                <div className="text-xs text-emerald-800">
                  3/3 dịch vụ cận lâm sàng đã chuyển sang trạng thái <b>AUTHORIZED (Được phép thực hiện)</b>.
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <Button
                size="sm"
                onClick={() => openPrintModal("routing")}
                className="font-bold text-xs bg-emerald-700 hover:bg-emerald-800 text-white shadow-md"
              >
                <Printer className="w-4 h-4 mr-1.5" />
                In Phiếu chỉ định CLS & Lộ trình phòng
              </Button>
              <Link href="/laboratory">
                <Button size="sm" variant="outline" className="font-bold text-xs border-emerald-400 text-emerald-900 bg-white">
                  Xem phòng Lab →
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      )}

      {/* Main Billing Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Diagnostic Items Breakdown (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
            <CardHeader className="bg-slate-50/80 p-4 border-b border-slate-200 flex flex-row items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-clinic-blue tracking-wider block">
                  CHI TIẾT CHỈ ĐỊNH CẬN LÂM SÀNG
                </span>
                <CardTitle className="text-sm font-bold text-slate-800">
                  Danh mục dịch vụ cần thu phí (Đợt chỉ định 1)
                </CardTitle>
              </div>
              <Badge variant="outline" className="text-[10px] font-mono font-bold text-slate-600 bg-white">
                Bảng giá niêm yết 2026
              </Badge>
            </CardHeader>

            <CardContent className="p-0">
              <table className="w-full text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                  <tr>
                    <th className="p-3 text-left">Tên kỹ thuật cận lâm sàng</th>
                    <th className="p-3 text-center">Phòng</th>
                    <th className="p-3 text-right">Đơn giá</th>
                    <th className="p-3 text-center">Trạng thái thanh toán</th>
                    <th className="p-3 text-right">Quyền thực hiện</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {round1Orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3">
                        <div className="font-bold text-slate-900">{ord.serviceName}</div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">{ord.serviceCode}</div>
                      </td>
                      <td className="p-3 text-center text-slate-600 font-mono font-bold">
                        {ord.roomCode}
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-slate-900">
                        {formatCurrencyVND(ord.price)}
                      </td>
                      <td className="p-3 text-center">
                        {isAlreadyPaid ? (
                          <span className="text-emerald-700 font-bold text-[11px]">✓ Đã thanh toán</span>
                        ) : (
                          <span className="text-amber-700 font-bold text-[11px]">Chờ thanh toán</span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        <span
                          className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                            isAlreadyPaid
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {isAlreadyPaid ? "AUTHORIZED" : "PENDING"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-50 font-bold border-t border-slate-200">
                  <tr>
                    <td colSpan={2} className="p-3 text-right uppercase text-slate-700">
                      TỔNG TIỀN CLS CẦN THANH TOÁN (ĐỢT 1):
                    </td>
                    <td colSpan={3} className="p-3 text-right text-base text-emerald-700 font-mono font-black">
                      {formatCurrencyVND(totalAmount)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Payment Methods & VietQR (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <Card className="border-slate-200 shadow-sm bg-white">
            <CardHeader className="bg-slate-50/80 p-4 border-b border-slate-200">
              <span className="text-[10px] font-black uppercase text-clinic-blue tracking-wider block">
                PHƯƠNG THỨC THANH TOÁN
              </span>
              <CardTitle className="text-sm font-bold text-slate-800">
                Thu tiền & Kích hoạt dịch vụ
              </CardTitle>
            </CardHeader>

            <CardContent className="p-4 space-y-4 text-xs">
              {/* Patient info reminder */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Người nộp tiền:</span>
                  <span className="font-bold text-slate-900 uppercase">{patientName}</span>
                </div>
                <div className="flex justify-between font-mono">
                  <span className="text-slate-500">Mã BN / Lượt khám:</span>
                  <span className="font-bold text-slate-800">{patientCode} • {encounterCode}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200">
                  <span className="text-slate-700 font-bold">Số tiền CLS cần thu:</span>
                  <span className="font-mono text-base font-black text-emerald-700">{formatCurrencyVND(totalAmount)}</span>
                </div>
              </div>

              {/* VietQR Dynamic Card */}
              <VietQRCard
                bankName="MB Bank (Ngân Hàng Quân Đội)"
                accountNumber="09123456789"
                accountName="PHONG KHAM DA KHOA NGOC KHANH CLINICONE"
                amount={totalAmount}
                transferContent={`ENC-041 NGUYEN VAN AN CLS1 ${totalAmount}`}
              />

              {/* Payment Method Action Buttons */}
              <div className="flex flex-col gap-2 pt-2">
                <Button
                  onClick={() => handleConfirmPayment("CASH")}
                  className="font-bold h-10 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                >
                  <Banknote className="w-4 h-4 mr-2" />
                  1. Xác nhận đã thu Tiền mặt ({formatCurrencyVND(totalAmount)})
                </Button>

                <Button
                  variant="outline"
                  onClick={() => handleConfirmPayment("VIETQR")}
                  className="border-blue-300 text-clinic-blue hover:bg-blue-50 font-bold h-10"
                >
                  <QrCode className="w-4 h-4 mr-2" />
                  2. Webhook VietQR Napas247 (Tự động xác nhận)
                </Button>

                <Button
                  variant="outline"
                  onClick={() => handleConfirmPayment("POS")}
                  className="border-slate-300 text-slate-700 hover:bg-slate-50 font-bold h-10"
                >
                  <CreditCard className="w-4 h-4 mr-2 text-slate-600" />
                  3. Quẹt thẻ ngân hàng qua máy POS
                </Button>

                <Button
                  variant="outline"
                  onClick={() => handleConfirmPayment("COMPANY_CREDIT")}
                  className="border-purple-300 text-purple-700 hover:bg-purple-50 font-bold h-10"
                >
                  <Building2 className="w-4 h-4 mr-2 text-purple-600" />
                  4. Bảo lãnh Doanh nghiệp / Miễn nộp (WAIVED)
                </Button>
              </div>

              <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200 text-blue-900 text-[11px] leading-relaxed">
                <b>Nguyên tắc nghiệp vụ Payment Authorization: </b>
                Dịch vụ chỉ được cấp quyền thực hiện (AUTHORIZED) tại phòng xét nghiệm và CĐHA sau khi thu ngân xác nhận nộp tiền hoặc duyệt diện bảo lãnh hợp lệ.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
