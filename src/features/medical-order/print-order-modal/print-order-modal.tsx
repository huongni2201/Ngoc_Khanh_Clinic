"use client";

import * as React from "react";
import { useUIStore, PrintModalTab } from "@/shared/stores/ui.store";
import { useWorkspaceStore } from "@/shared/stores/workspace.store";
import { useDemoClinicFlowStore } from "@/shared/stores/demo-clinic-flow.store";
import { formatCurrencyVND } from "@/shared/lib/formatters";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Printer, X, ShieldAlert, ArrowRight, QrCode, Layers, FileText, Receipt } from "lucide-react";

export function PrintOrderModal() {
  const {
    isPrintModalOpen,
    printModalTab,
    printModalRound,
    closePrintModal,
    setPrintModalTab,
    setPrintModalRound,
    showToast,
  } = useUIStore();

  const { orders } = useWorkspaceStore();
  const {
    patientName,
    patientCode,
    encounterCode,
    roomCode,
    doctorName,
    diagnosticInvoiceStatus,
  } = useDemoClinicFlowStore();

  if (!isPrintModalOpen) return null;

  // Filter orders strictly by the active round
  const currentRoundOrders = orders.filter((o) => o.round === printModalRound);
  const currentRoundCLSTotal = currentRoundOrders.reduce((sum, o) => sum + o.price, 0);

  // Diagnostic fee is ONLY the CLS items of the round (no 150k consultation re-charge)
  const invoiceTotalAmount = currentRoundCLSTotal;

  // Extract unique rooms for current round
  const uniqueRooms = Array.from(
    new Map(
      currentRoundOrders.map((o) => [
        o.roomCode,
        {
          code: o.roomCode,
          name: o.roomName,
          floor: o.floor,
          tests: currentRoundOrders.filter((x) => x.roomCode === o.roomCode).map((x) => x.serviceName),
        },
      ])
    ).values()
  );

  const hasMultipleRounds = orders.some((o) => o.round >= 2);

  const handlePrint = () => {
    showToast(`Đang gửi lệnh in: ${printModalTab === "payment-slip" ? "Phiếu thanh toán" : printModalTab === "routing" ? "Phiếu chỉ định CLS" : "Hóa đơn"} Đợt ${printModalRound}...`);
    setTimeout(() => {
      window.print();
    }, 250);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/75 backdrop-blur-sm animate-in fade-in print:p-0 print:static print:bg-white">
      {/* Backdrop click to close */}
      <div className="fixed inset-0 print:hidden" onClick={closePrintModal} />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-4xl max-h-[95vh] bg-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-700 print:border-none print:shadow-none print:max-w-none print:max-h-none print:rounded-none">
        {/* Top bar */}
        <div className="p-3 bg-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-700 print:hidden">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm font-black flex items-center gap-1.5 shrink-0">
              <Printer className="w-4 h-4 text-blue-400" />
              Biểu mẫu Y tế In ấn
            </span>

            {/* Round Selector */}
            {hasMultipleRounds && (
              <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg border border-slate-700 text-xs">
                <span className="text-slate-400 px-1.5 text-[11px] font-semibold flex items-center gap-1">
                  <Layers className="w-3 h-3 text-purple-400" />
                  Đợt:
                </span>
                <button
                  type="button"
                  onClick={() => setPrintModalRound(1)}
                  className={`px-2.5 py-1 rounded font-bold transition-all text-xs ${
                    printModalRound === 1
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Đợt 1 ({orders.filter((o) => o.round === 1).length} DV)
                </button>
                <button
                  type="button"
                  onClick={() => setPrintModalRound(2)}
                  className={`px-2.5 py-1 rounded font-bold transition-all text-xs ${
                    printModalRound === 2
                      ? "bg-purple-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Đợt 2 ({orders.filter((o) => o.round === 2).length} DV)
                </button>
              </div>
            )}

            {/* Document Type Selector (3 Tabs) */}
            <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700 text-xs flex-wrap">
              <button
                type="button"
                onClick={() => setPrintModalTab("payment-slip")}
                className={`px-3 py-1 rounded-md font-bold transition-all flex items-center gap-1.5 ${
                  printModalTab === "payment-slip"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Receipt className="w-3.5 h-3.5" />
                <span>1. Phiếu thanh toán dịch vụ</span>
              </button>
              <button
                type="button"
                onClick={() => setPrintModalTab("routing")}
                className={`px-3 py-1 rounded-md font-bold transition-all flex items-center gap-1.5 ${
                  printModalTab === "routing"
                    ? "bg-clinic-blue text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>2. Phiếu chỉ định CLS & Lộ trình</span>
              </button>
              <button
                type="button"
                onClick={() => setPrintModalTab("invoice")}
                className={`px-3 py-1 rounded-md font-bold transition-all flex items-center gap-1.5 ${
                  printModalTab === "invoice"
                    ? "bg-purple-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>3. Biên lai VietQR</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
            <Button size="sm" variant="success" onClick={handlePrint} className="font-bold shadow text-xs">
              <Printer className="w-3.5 h-3.5 mr-1.5" />
              In phiếu
            </Button>
            <button
              onClick={closePrintModal}
              className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Paper Simulation Area */}
        <div className="p-4 sm:p-8 overflow-y-auto bg-slate-200 flex justify-center items-start print:p-0 print:bg-white">
          {/* TAB 1: PHIẾU THANH TOÁN DỊCH VỤ (BÁC SĨ IN GỬI BỆNH NHÂN ĐI NỘP TIỀN) */}
          {printModalTab === "payment-slip" && (
            <div className="w-full max-w-[780px] bg-white text-slate-900 p-6 sm:p-8 rounded-lg shadow-xl print:shadow-none print:p-0 font-sans text-xs leading-relaxed h-fit my-auto sm:my-3">
              <div className="flex justify-between items-start border-b-2 border-slate-900 pb-3 mb-4">
                <div>
                  <div className="text-[11px] font-black uppercase text-slate-700 tracking-wider">
                    PHÒNG KHÁM ĐA KHOA QUỐC TẾ NGỌC KHÁNH (CLINICONE)
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    Địa chỉ: Số 42, Phố Cầu Giấy, Hà Nội • Hotline: 1900 6868
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-black text-sm text-slate-900">
                    {encounterCode}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Mã BN: <b className="text-slate-800">{patientCode}</b>
                  </div>
                </div>
              </div>

              <div className="text-center mb-4">
                <div className="inline-block px-3 py-0.5 mb-1 rounded-full text-[11px] font-black uppercase tracking-wide bg-emerald-50 border border-emerald-300 text-emerald-800">
                  PHIẾU THANH TOÁN DỊCH VỤ CẬN LÂM SÀNG — ĐỢT {printModalRound}
                </div>
                <h1 className="text-base sm:text-lg font-black tracking-wider uppercase text-slate-900">
                  PHIẾU THANH TOÁN DỊCH VỤ
                </h1>
                <p className="text-[11px] text-slate-500 italic mt-0.5">
                  (Bệnh nhân vui lòng mang phiếu này đến Quầy thu ngân nộp phí trước khi thực hiện CLS)
                </p>
              </div>

              {/* Patient info */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 border border-slate-200 p-3 rounded-lg mb-4 text-xs">
                <div className="col-span-2">
                  Họ và tên: <b className="text-sm font-black uppercase">{patientName}</b>
                </div>
                <div>Mã BN: <b className="font-mono">{patientCode}</b></div>
                <div>Lượt khám: <b className="font-mono">{encounterCode}</b></div>
                <div>Phòng chỉ định: <b>{roomCode}</b></div>
                <div>Bác sĩ: <b>{doctorName}</b></div>
                <div className="col-span-2">Đợt chỉ định: <b>Đợt {printModalRound}</b></div>
              </div>

              {/* Items */}
              <table className="w-full border-collapse border border-slate-300 text-xs mb-4">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 font-bold">
                    <th className="border border-slate-300 p-2 w-8 text-center">STT</th>
                    <th className="border border-slate-300 p-2 text-left">Tên dịch vụ cận lâm sàng</th>
                    <th className="border border-slate-300 p-2 text-left">Địa điểm thực hiện</th>
                    <th className="border border-slate-300 p-2 text-right w-28">Đơn giá</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRoundOrders.map((ord, idx) => (
                    <tr key={ord.id}>
                      <td className="border border-slate-300 p-2 text-center font-bold">{idx + 1}</td>
                      <td className="border border-slate-300 p-2 font-medium">{ord.serviceName}</td>
                      <td className="border border-slate-300 p-2 text-slate-600">{ord.roomName} ({ord.roomCode})</td>
                      <td className="border border-slate-300 p-2 text-right font-mono font-bold">
                        {formatCurrencyVND(ord.price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-50 font-bold">
                    <td colSpan={3} className="border border-slate-300 p-2 text-right uppercase">
                      TỔNG CHI PHÍ CLS ĐỢT {printModalRound} CẦN THANH TOÁN:
                    </td>
                    <td className="border border-slate-300 p-2 text-right text-base text-emerald-700 font-mono font-black">
                      {formatCurrencyVND(invoiceTotalAmount)}
                    </td>
                  </tr>
                </tfoot>
              </table>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 mb-4">
                <b>Hướng dẫn người bệnh: </b>
                Quý khách vui lòng mang phiếu này đến Quầy thu ngân để thanh toán (Tiền mặt, VietQR Napas247 hoặc Thẻ POS). Sau khi nộp phí, hệ thống sẽ tự động kích hoạt quyền thực hiện (AUTHORIZED) tại các phòng cận lâm sàng.
              </div>

              <div className="flex justify-between items-end pt-3 border-t border-slate-200">
                <div className="text-center font-mono text-[10px] text-slate-500">
                  Mã y lệnh: *{encounterCode}-R{printModalRound}*
                </div>
                <div className="text-center min-w-[200px]">
                  <div className="text-[11px] text-slate-500">Hà Nội, ngày 19 tháng 09 năm 2026</div>
                  <div className="font-bold text-xs mt-1 mb-12 uppercase text-slate-900">BÁC SĨ CHỈ ĐỊNH</div>
                  <div className="font-bold text-slate-900 text-sm">{doctorName}</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PHIẾU CHỈ ĐỊNH CLS & LỘ TRÌNH PHÒNG (IN SAU KHI ĐÃ THANH TOÁN) */}
          {printModalTab === "routing" && (
            <div className="w-full max-w-[780px] bg-white text-slate-900 p-6 sm:p-8 rounded-lg shadow-xl print:shadow-none print:p-0 font-sans text-xs leading-relaxed h-fit my-auto sm:my-3">
              <div className="flex justify-between items-start border-b-2 border-slate-900 pb-3 mb-4">
                <div>
                  <div className="text-[11px] font-black uppercase text-slate-700 tracking-wider">
                    SỞ Y TẾ HÀ NỘI — PHÒNG KHÁM ĐA KHOA QUỐC TẾ NGỌC KHÁNH (CLINICONE)
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    Địa chỉ: Số 42, Phố Cầu Giấy, Hà Nội • Hotline: 1900 6868
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-black text-sm text-slate-900">
                    {encounterCode}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Mã BN: <b className="text-slate-800">{patientCode}</b>
                  </div>
                </div>
              </div>

              <div className="text-center mb-4">
                <div className="inline-block px-3 py-0.5 mb-1 rounded-full text-[11px] font-black uppercase tracking-wide bg-blue-50 border border-blue-300 text-clinic-blue">
                  PHIẾU CHỈ ĐỊNH CẬN LÂM SÀNG & LỘ TRÌNH PHÒNG — ĐỢT {printModalRound}
                </div>
                <h1 className="text-base sm:text-lg font-black tracking-wider uppercase text-slate-900">
                  PHIẾU CHỈ ĐỊNH CẬN LÂM SÀNG
                </h1>
                <p className="text-[11px] text-slate-500 italic mt-0.5">
                  (Đã xác nhận thanh toán viện phí — Được phép thực hiện dịch vụ)
                </p>
              </div>

              {/* Patient Demographics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 border border-slate-200 p-3 rounded-lg mb-4 text-xs">
                <div className="col-span-2">
                  Họ và tên người bệnh: <b className="text-sm font-black uppercase">{patientName}</b>
                </div>
                <div>Mã BN: <b className="font-mono">{patientCode}</b></div>
                <div>Năm sinh: <b>1981 (45T) • Nam</b></div>
                <div className="col-span-4 text-red-700 font-medium flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5 text-red-600 shrink-0" />
                  <span>
                    <b>Cảnh báo dị ứng:</b> <b>Dị ứng Penicillin (Phản vệ độ 2)</b> — Cấm dùng nhóm Beta-lactam!
                  </span>
                </div>
              </div>

              {/* Routing List */}
              <div className="mb-4">
                <div className="font-black text-xs uppercase mb-2 text-slate-800">
                  DANH SÁCH PHÒNG CẬN LÂM SÀNG CẦN THỰC HIỆN (ĐỢT {printModalRound}):
                </div>
                <table className="w-full border-collapse border border-slate-300 text-xs mb-4">
                  <thead>
                    <tr className="bg-slate-100 text-slate-800 font-bold">
                      <th className="border border-slate-300 p-2 w-8 text-center">STT</th>
                      <th className="border border-slate-300 p-2 text-left">Tên dịch vụ</th>
                      <th className="border border-slate-300 p-2 text-left">Phòng thực hiện & Vị trí</th>
                      <th className="border border-slate-300 p-2 text-left">Hướng dẫn chuẩn bị</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentRoundOrders.map((ord, idx) => (
                      <tr key={ord.id}>
                        <td className="border border-slate-300 p-2 text-center font-bold">{idx + 1}</td>
                        <td className="border border-slate-300 p-2 font-bold text-slate-900">{ord.serviceName}</td>
                        <td className="border border-slate-300 p-2">
                          <b className="text-clinic-blue">{ord.roomName}</b> ({ord.roomCode} — {ord.floor})
                        </td>
                        <td className="border border-slate-300 p-2 text-slate-600">
                          {ord.preparationInstructions || "Theo hướng dẫn kỹ thuật viên"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Instructions */}
              <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-xl space-y-2 mb-4 text-xs text-emerald-950">
                <div className="font-black text-emerald-900 uppercase flex items-center gap-1.5">
                  <ArrowRight className="w-4 h-4 text-emerald-600" />
                  HƯỚNG DẪN QUAN TRỌNG DÀNH CHO BỆNH NHÂN:
                </div>
                <p>
                  1. Sau khi hoàn tất các dịch vụ cận lâm sàng tại phòng <b>P.202</b> và <b>P.208</b>, quý khách <b>vui lòng quay lại khu vực ngồi chờ trước phòng P.203 (BS. Lê Minh)</b>.
                </p>
                <p>
                  2. <b>Kết quả được tự động gửi về máy tính bác sĩ (Auto-return)</b>. Quý khách <b>KHÔNG CẦN PHẢI CHỜ LẤY BẢN IN GIẤY</b> tại các phòng xét nghiệm. Bác sĩ sẽ gọi tên quý khách vào phòng kết luận ngay khi đủ kết quả.
                </p>
              </div>

              <div className="flex justify-between items-end pt-3 border-t border-slate-200">
                <div className="text-center font-mono text-[10px] text-slate-500">
                  ENC: {encounterCode} • Đợt {printModalRound}
                </div>
                <div className="text-center min-w-[200px]">
                  <div className="text-[11px] text-slate-500">Hà Nội, ngày 19 tháng 09 năm 2026</div>
                  <div className="font-bold text-xs mt-1 mb-12 uppercase text-slate-900">BÁC SĨ CHỈ ĐỊNH</div>
                  <div className="font-bold text-slate-900 text-sm">{doctorName}</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BIÊN LAI NỘP TIỀN VIỆTQR */}
          {printModalTab === "invoice" && (
            <div className="w-full max-w-[780px] bg-white text-slate-900 p-6 sm:p-8 rounded-lg shadow-xl print:shadow-none print:p-0 font-sans text-xs leading-relaxed h-fit my-auto sm:my-3">
              <div className="flex justify-between items-start border-b-2 border-slate-900 pb-3 mb-4">
                <div>
                  <div className="text-[11px] font-black uppercase text-slate-700 tracking-wider">
                    PHÒNG KHÁM ĐA KHOA QUỐC TẾ NGỌC KHÁNH CLINICONE
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    Mã số thuế: 0108998877 • Quầy Thu ngân Tầng 1
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-black text-sm text-slate-900">
                    INV-260919-041{printModalRound >= 2 ? `-R${printModalRound}` : ""}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Lượt khám: <b>{encounterCode}</b>
                  </div>
                </div>
              </div>

              <div className="text-center mb-5">
                <div className="inline-block px-3 py-0.5 mb-1 rounded-full text-[11px] font-black uppercase tracking-wide bg-slate-100 border border-slate-300 text-slate-800">
                  BIÊN LAI THU VIỆN PHÍ DỊCH VỤ CẬN LÂM SÀNG — ĐỢT {printModalRound}
                </div>
                <h1 className="text-base sm:text-lg font-black tracking-wider uppercase text-slate-900">
                  HÓA ĐƠN NỘP TIỀN DỊCH VỤ CLS
                </h1>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-slate-50 border border-slate-200 p-3 rounded-lg mb-4 text-xs">
                <div>Người nộp tiền: <b className="uppercase">{patientName}</b></div>
                <div>Mã BN: <b className="font-mono">{patientCode}</b></div>
                <div>Lượt khám: <b className="font-mono">{encounterCode}</b></div>
              </div>

              <table className="w-full border-collapse border border-slate-300 text-xs mb-5">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 font-bold">
                    <th className="border border-slate-300 p-2 w-8 text-center">STT</th>
                    <th className="border border-slate-300 p-2 text-left">Dịch vụ cận lâm sàng Đợt {printModalRound}</th>
                    <th className="border border-slate-300 p-2 text-center w-14">SL</th>
                    <th className="border border-slate-300 p-2 text-right w-28">Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRoundOrders.map((ord, i) => (
                    <tr key={ord.id}>
                      <td className="border border-slate-300 p-2 text-center font-bold">{i + 1}</td>
                      <td className="border border-slate-300 p-2 font-medium">{ord.serviceName}</td>
                      <td className="border border-slate-300 p-2 text-center">1</td>
                      <td className="border border-slate-300 p-2 text-right font-mono font-semibold">
                        {formatCurrencyVND(ord.price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-50 font-bold">
                    <td colSpan={3} className="border border-slate-300 p-2 text-right uppercase">
                      TỔNG TIỀN CLS ĐỢT {printModalRound} ĐÃ NỘP:
                    </td>
                    <td className="border border-slate-300 p-2 text-right text-base text-clinic-blue font-mono font-black">
                      {formatCurrencyVND(invoiceTotalAmount)}
                    </td>
                  </tr>
                </tfoot>
              </table>

              {/* VietQR Box */}
              <div className="p-4 bg-slate-50 border-2 border-slate-300 rounded-xl flex items-center gap-6 mb-6">
                <div className="w-28 h-28 bg-slate-900 text-white p-2 rounded-lg flex flex-col items-center justify-center text-center shrink-0">
                  <QrCode className="w-8 h-8 text-blue-400 mb-1" />
                  <div className="font-black text-xs">VIETQR</div>
                  <div className="text-[8px] text-emerald-400 font-bold">Napas 247</div>
                </div>
                <div className="space-y-1 text-xs flex-1">
                  <div className="font-bold text-slate-900 text-sm">
                    GIAO DỊCH VIETQR NAPAS247 THÀNH CÔNG:
                  </div>
                  <div>Ngân hàng: <b>MB Bank (09123456789)</b></div>
                  <div>Chủ TK: <b>PHONG KHAM DA KHOA NGOC KHANH CLINICONE</b></div>
                  <div>Số tiền: <b className="text-clinic-blue font-mono font-bold">{formatCurrencyVND(invoiceTotalAmount)}</b></div>
                  <div>Nội dung: <span className="font-mono font-bold text-slate-800">ENC-041 NGUYEN VAN AN DOT{printModalRound}</span></div>
                </div>
              </div>

              <div className="flex justify-between items-end pt-3 border-t border-slate-200">
                <div className="text-[11px] text-slate-500 italic max-w-xs">
                  Biên lai điện tử khởi tạo từ hệ thống HIS ClinicOne.
                </div>
                <div className="text-center min-w-[200px]">
                  <div className="text-[11px] text-slate-500">Hà Nội, ngày 19 tháng 09 năm 2026</div>
                  <div className="font-bold text-xs uppercase mt-1 mb-12 text-slate-900">NGƯỜI THU TIỀN</div>
                  <div className="font-bold text-slate-900 text-sm">Nguyễn Thị Mai</div>
                  <div className="text-[10px] text-slate-500">Quầy Thu ngân Tầng 1</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
