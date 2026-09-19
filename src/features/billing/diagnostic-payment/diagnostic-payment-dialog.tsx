"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { useDemoClinicFlowStore } from "@/shared/stores/demo-clinic-flow.store";
import { useWorkspaceStore } from "@/shared/stores/workspace.store";
import { useUIStore } from "@/shared/stores/ui.store";
import { formatCurrencyVND } from "@/shared/lib/formatters";
import { VietQRCard } from "@/shared/components/vietqr-card";
import {
  CreditCard,
  QrCode,
  Banknote,
  Building2,
  CheckCircle2,
  Printer,
  X,
  Stethoscope,
  ShieldCheck,
} from "lucide-react";

interface DiagnosticPaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  round?: number;
}

export function DiagnosticPaymentDialog({
  isOpen,
  onClose,
  round,
}: DiagnosticPaymentDialogProps) {
  const { showToast, openPrintModal } = useUIStore();
  const {
    patientName,
    patientCode,
    encounterCode,
    orderRound,
    orders,
    confirmDiagnosticPayment,
  } = useDemoClinicFlowStore();

  const { authorizeAllRound } = useWorkspaceStore();

  const activeRound = round ?? orderRound;
  const roundOrders = orders.filter((o) => o.round === activeRound);
  const totalAmount = roundOrders.reduce((sum, o) => sum + o.price, 0);

  const [paymentMethod, setPaymentMethod] = React.useState<"CASH" | "VIETQR" | "POS" | "COMPANY_CREDIT">("CASH");
  const [isConfirmed, setIsConfirmed] = React.useState(false);

  // Reset confirmed state when dialog opens
  React.useEffect(() => {
    if (isOpen) {
      setIsConfirmed(false);
    }
  }, [isOpen]);

  const handleConfirm = () => {
    confirmDiagnosticPayment(paymentMethod);
    authorizeAllRound(activeRound);
    setIsConfirmed(true);
    showToast(
      `Đã xác nhận thu phí CLS ${formatCurrencyVND(totalAmount)} tại phòng khám! ${roundOrders.length} dịch vụ đã được kích hoạt thực hiện (AUTHORIZED).`
    );
  };

  const handlePrintRouting = () => {
    onClose();
    openPrintModal("routing", activeRound);
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-xl p-0 overflow-hidden bg-white border border-slate-200 shadow-2xl rounded-2xl">
        {/* Modal Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-clinic-blue text-white flex items-center justify-center font-bold">
              <Stethoscope className="w-4 h-4" />
            </div>
            <div>
              <DialogTitle className="text-sm font-black uppercase tracking-tight text-white">
                THU PHÍ CẬN LÂM SÀNG TẠI PHÒNG BÁC SĨ
              </DialogTitle>
              <p className="text-[11px] text-slate-400">
                Thu phí trực tiếp & Kích hoạt quyền thực hiện dịch vụ (Payment Authorization)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success State view */}
        {isConfirmed ? (
          <div className="p-6 space-y-4 text-xs bg-emerald-50/70">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                  THANH TOÁN THÀNH CÔNG • ĐÃ MỞ QUYỀN THỰC HIỆN
                </span>
                <h3 className="text-base font-black text-emerald-950 uppercase mt-1">
                  Đã thu: {formatCurrencyVND(totalAmount)}
                </h3>
                <p className="text-[11px] text-emerald-800">
                  Toàn bộ {roundOrders.length} dịch vụ Đợt {activeRound} đã chuyển sang trạng thái <b>AUTHORIZED</b>.
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-emerald-200 text-slate-800 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Bệnh nhân:</span>
                <span className="font-bold text-slate-900 uppercase">{patientName} ({patientCode})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Lượt khám / Đợt:</span>
                <span className="font-mono font-bold text-slate-800">{encounterCode} • Đợt {activeRound}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Hình thức thanh toán:</span>
                <span className="font-bold text-slate-900">
                  {paymentMethod === "VIETQR" ? "VietQR Napas247" : paymentMethod === "POS" ? "Thẻ POS" : paymentMethod === "COMPANY_CREDIT" ? "Bảo lãnh doanh nghiệp" : "Tiền mặt tại phòng"}
                </span>
              </div>
            </div>

            <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-200 text-blue-900 text-[11px] leading-relaxed">
              Bác sĩ in <b>Phiếu chỉ định Cận lâm sàng & Lộ trình phòng</b> cho người bệnh cầm đến phòng kỹ thuật làm xét nghiệm, siêu âm, điện tim.
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-emerald-200">
              <Button variant="outline" size="sm" onClick={onClose} className="text-xs font-bold bg-white">
                Đóng
              </Button>
              <Button
                size="sm"
                onClick={handlePrintRouting}
                className="font-bold text-xs bg-emerald-700 hover:bg-emerald-800 text-white shadow-md"
              >
                <Printer className="w-4 h-4 mr-1.5" />
                In Phiếu chỉ định CLS & Lộ trình →
              </Button>
            </div>
          </div>
        ) : (
          /* Payment Form */
          <div className="p-5 space-y-4 text-xs">
            {/* Patient & Round Info Bar */}
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Người bệnh:</span>
                <span className="font-black text-slate-900 uppercase text-xs">{patientName}</span>
                <span className="font-mono text-[10px] text-slate-500 ml-1">({patientCode})</span>
              </div>
              <div className="text-right">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Đợt chỉ định:</span>
                <Badge variant="purple" className="font-bold text-[10px]">
                  Đợt {activeRound} ({roundOrders.length} dịch vụ)
                </Badge>
              </div>
            </div>

            {/* Diagnostic Services Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="p-2.5 bg-slate-100/70 border-b border-slate-200 font-bold text-slate-800 text-xs">
                Danh sách dịch vụ cận lâm sàng thu phí:
              </div>
              <div className="divide-y divide-slate-100 max-h-48 overflow-y-auto">
                {roundOrders.map((item, idx) => (
                  <div key={item.id || idx} className="p-2.5 flex items-center justify-between gap-2 hover:bg-slate-50 text-xs">
                    <div className="space-y-0.5 min-w-0 flex-1">
                      <div className="font-bold text-slate-900 truncate">{item.serviceName}</div>
                      <div className="text-[10px] text-slate-500">
                        {item.serviceCode} • Phòng: <b>{item.roomName}</b> ({item.roomCode})
                      </div>
                    </div>
                    <span className="font-mono font-bold text-slate-900 shrink-0">
                      {formatCurrencyVND(item.price)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between font-bold text-xs">
                <span className="uppercase text-slate-700">TỔNG PHÍ CẬN LÂM SÀNG (ĐỢT {activeRound}):</span>
                <span className="font-mono text-base font-black text-emerald-700">
                  {formatCurrencyVND(totalAmount)}
                </span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="font-bold text-slate-800 block text-xs">
                Phương thức thanh toán:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("CASH")}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                    paymentMethod === "CASH"
                      ? "bg-blue-50 border-clinic-blue text-clinic-blue font-bold ring-2 ring-blue-400/20 shadow-xs"
                      : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <Banknote className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs">Tiền mặt</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("VIETQR")}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                    paymentMethod === "VIETQR"
                      ? "bg-blue-50 border-clinic-blue text-clinic-blue font-bold ring-2 ring-blue-400/20 shadow-xs"
                      : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <QrCode className="w-4 h-4 text-clinic-blue" />
                  <span className="text-xs">VietQR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("POS")}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                    paymentMethod === "POS"
                      ? "bg-blue-50 border-clinic-blue text-clinic-blue font-bold ring-2 ring-blue-400/20 shadow-xs"
                      : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-slate-700" />
                  <span className="text-xs">Thẻ POS</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("COMPANY_CREDIT")}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                    paymentMethod === "COMPANY_CREDIT"
                      ? "bg-blue-50 border-clinic-blue text-clinic-blue font-bold ring-2 ring-blue-400/20 shadow-xs"
                      : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <Building2 className="w-4 h-4 text-purple-600" />
                  <span className="text-xs">Bảo lãnh</span>
                </button>
              </div>
            </div>

            {/* Dynamic VietQR Preview */}
            {paymentMethod === "VIETQR" && (
              <div className="p-3 bg-slate-900 text-white rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">Mã VietQR động Napas247:</span>
                  <span className="font-mono text-emerald-400 font-bold">{formatCurrencyVND(totalAmount)}</span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  Nội dung: CLS {patientCode} {encounterCode} R{activeRound}
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-200">
              <Button type="button" variant="ghost" size="sm" onClick={onClose} className="text-xs font-bold text-slate-600">
                Hủy bỏ
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleConfirm}
                className="font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 h-10 px-5"
              >
                <CheckCircle2 className="w-4 h-4 mr-1.5" />
                Xác nhận đã thu tiền ({formatCurrencyVND(totalAmount)}) →
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
