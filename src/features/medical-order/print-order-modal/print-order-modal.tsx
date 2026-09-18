"use client";

import * as React from "react";
import { useUIStore } from "@/shared/stores/ui.store";
import { useWorkspaceStore } from "@/shared/stores/workspace.store";
import { MOCK_ACTIVE_ENCOUNTER } from "@/shared/constants/mock-data";
import { formatCurrencyVND } from "@/shared/lib/formatters";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Printer, X, ShieldAlert, ArrowRight, QrCode, Layers } from "lucide-react";

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
  const encounter = MOCK_ACTIVE_ENCOUNTER;

  if (!isPrintModalOpen) return null;

  // Filter orders strictly by the active round (never merged)
  const currentRoundOrders = orders.filter((o) => o.round === printModalRound);
  const currentRoundCLSTotal = currentRoundOrders.reduce((sum, o) => sum + o.price, 0);

  // For invoice:
  // Round 1 includes 150.000 exam fee + Round 1 CLS
  // Round 2 includes ONLY Round 2 CLS (no re-charge of exam fee!)
  const invoiceExamFee = printModalRound === 1 ? 150000 : 0;
  const invoiceTotalAmount = invoiceExamFee + currentRoundCLSTotal;

  // Extract unique rooms for current round only
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
    showToast(`Đang gửi lệnh in y tế Đợt ${printModalRound}...`);
    setTimeout(() => {
      window.print();
    }, 250);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/75 backdrop-blur-sm animate-in fade-in print:p-0 print:static print:bg-white">
      {/* Backdrop click to close (disabled in print) */}
      <div className="fixed inset-0 print:hidden" onClick={closePrintModal} />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-4xl max-h-[95vh] bg-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-700 print:border-none print:shadow-none print:max-w-none print:max-h-none print:rounded-none">
        {/* Top bar (Hidden when printing) */}
        <div className="p-3 bg-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-700 print:hidden">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm font-black flex items-center gap-1.5 shrink-0">
              <Printer className="w-4 h-4 text-blue-400" />
              Xem trước & In ấn Y tế
            </span>

            {/* Round Selector (Separate rounds, never merged) */}
            {hasMultipleRounds && (
              <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg border border-slate-700 text-xs">
                <span className="text-slate-400 px-1.5 text-[11px] font-semibold flex items-center gap-1">
                  <Layers className="w-3 h-3 text-purple-400" />
                  Đợt in:
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
                  Đợt 2 bổ sung ({orders.filter((o) => o.round === 2).length} DV)
                </button>
              </div>
            )}

            {/* Document Type Selector */}
            <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700 text-xs">
              <button
                type="button"
                onClick={() => setPrintModalTab("routing")}
                className={`px-3 py-1 rounded-md font-bold transition-all ${
                  printModalTab === "routing"
                    ? "bg-clinic-blue text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                1. Phiếu chỉ định Đợt {printModalRound} ({currentRoundOrders.length})
              </button>
              <button
                type="button"
                onClick={() => setPrintModalTab("invoice")}
                className={`px-3 py-1 rounded-md font-bold transition-all ${
                  printModalTab === "invoice"
                    ? "bg-clinic-blue text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                2. Hóa đơn nộp tiền Đợt {printModalRound}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
            <Button size="sm" variant="success" onClick={handlePrint} className="font-bold shadow text-xs">
              <Printer className="w-3.5 h-3.5 mr-1.5" />
              In phiếu Đợt {printModalRound}
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
          {/* TAB 1: PHIẾU CHỈ ĐỊNH CLS THEO TỪNG ĐỢT */}
          {printModalTab === "routing" && (
            <div className="w-full max-w-[780px] bg-white text-slate-900 p-6 sm:p-8 rounded-lg shadow-xl print:shadow-none print:p-0 font-sans text-xs leading-relaxed h-fit my-auto sm:my-3">
              {/* Header cơ sở */}
              <div className="flex justify-between items-start border-b-2 border-slate-900 pb-3 mb-4">
                <div>
                  <div className="text-[11px] font-black uppercase text-slate-700 tracking-wider">
                    SỞ Y TẾ HÀ NỘI — PHÒNG KHÁM ĐA KHOA QUỐC TẾ NGỌC KHÁNH (CLINICONE)
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    Địa chỉ: Số 42, Phố Cầu Giấy, Hà Nội • Hotline: 1900 6868 • Website: clinicone.vn
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-black text-sm text-slate-900">
                    {encounter.encounterCode}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Mã BN: <b className="text-slate-800">{encounter.patientCode}</b> • STT:{" "}
                    <b className="text-clinic-blue text-xs font-mono">{encounter.queueNumber}</b>
                  </div>
                </div>
              </div>

              {/* Title with Explicit Round Identification */}
              <div className="text-center mb-4">
                <div className="inline-block px-3 py-0.5 mb-1 rounded-full text-[11px] font-black uppercase tracking-wide bg-slate-100 border border-slate-300 text-slate-800">
                  CHỈ ĐỊNH CẬN LÂM SÀNG — ĐỢT {printModalRound} {printModalRound >= 2 ? "(BỔ SUNG)" : "(BAN ĐẦU)"}
                </div>
                <h1 className="text-base sm:text-lg font-black tracking-wider uppercase text-slate-900">
                  PHIẾU CHỈ ĐỊNH DỊCH VỤ CẬN LÂM SÀNG
                </h1>
                <p className="text-[11px] text-slate-500 italic mt-0.5">
                  (Kèm lộ trình di chuyển phòng chuyên môn dành riêng cho Đợt {printModalRound})
                </p>
              </div>

              {/* Patient Demographics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 border border-slate-200 p-3 rounded-lg mb-4 text-xs">
                <div className="col-span-2">
                  Họ và tên người bệnh: <b className="text-sm font-black uppercase">{encounter.patientName}</b>
                </div>
                <div>
                  Năm sinh: <b>1981 ({encounter.age}T)</b>
                </div>
                <div>
                  Giới tính: <b>Nam</b>
                </div>
                <div>
                  Số CCCD: <b>00108100xxxx</b>
                </div>
                <div>
                  Điện thoại: <b>0912 345 678</b>
                </div>
                <div className="col-span-2">
                  Khoa/Phòng khám: <b>P.203 — Nội tổng quát</b>
                </div>
                <div className="col-span-4 text-red-700 font-medium flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5 text-red-600 shrink-0" />
                  <span>
                    <b>Cảnh báo dị ứng:</b> <b>Dị ứng Penicillin (Phản vệ độ 2)</b> — Tuyệt đối không dùng nhóm Beta-lactam!
                  </span>
                </div>
                <div className="col-span-4">
                  Chẩn đoán sơ bộ: <b>{encounter.icdCode} — {encounter.icdName}</b>
                </div>
              </div>

              {/* Ordered Services Table (FOR THIS ROUND ONLY) */}
              <div className="mb-4">
                <div className="font-black text-xs uppercase mb-2 text-slate-800 flex items-center justify-between">
                  <span>
                    I. DANH SÁCH KỸ THUẬT CẦN THỰC HIỆN ĐỢT {printModalRound} ({currentRoundOrders.length} DỊCH VỤ):
                  </span>
                  <Badge variant={printModalRound === 1 ? "default" : "purple"} className="text-[10px]">
                    Đợt {printModalRound}
                  </Badge>
                </div>
                <table className="w-full border-collapse border border-slate-300 text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-800 font-bold">
                      <th className="border border-slate-300 p-2 w-8 text-center">STT</th>
                      <th className="border border-slate-300 p-2 text-left">Tên kỹ thuật / Dịch vụ</th>
                      <th className="border border-slate-300 p-2 text-left">Phòng thực hiện & Vị trí</th>
                      <th className="border border-slate-300 p-2 text-left">Hướng dẫn chuẩn bị</th>
                      <th className="border border-slate-300 p-2 text-right w-24">Đơn giá</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentRoundOrders.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="border border-slate-300 p-4 text-center text-slate-400 italic">
                          Chưa có dịch vụ nào trong Đợt {printModalRound}.
                        </td>
                      </tr>
                    ) : (
                      currentRoundOrders.map((ord, idx) => (
                        <tr key={ord.id} className={ord.round >= 2 ? "bg-purple-50/20" : ""}>
                          <td className="border border-slate-300 p-2 text-center font-bold">{idx + 1}</td>
                          <td className="border border-slate-300 p-2">
                            <div className="font-bold text-slate-900">{ord.serviceName}</div>
                            <div className="text-[10px] text-slate-500 mt-0.5">
                              Mã: {ord.serviceCode} {ord.sampleType ? `• ${ord.sampleType}` : ""}
                            </div>
                          </td>
                          <td className="border border-slate-300 p-2">
                            <b className="text-clinic-blue">{ord.roomName}</b>
                            <div className="text-[11px] text-slate-600 font-semibold">
                              {ord.roomCode} — {ord.floor}
                            </div>
                          </td>
                          <td className="border border-slate-300 p-2 text-slate-600">
                            {ord.preparationInstructions || "Theo hướng dẫn của nhân viên y tế"}
                          </td>
                          <td className="border border-slate-300 p-2 text-right font-mono font-medium">
                            {formatCurrencyVND(ord.price)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-50 font-bold">
                      <td colSpan={4} className="border border-slate-300 p-2 text-right">
                        CỘNG TIỀN DỊCH VỤ CLS ĐỢT {printModalRound}:
                      </td>
                      <td className="border border-slate-300 p-2 text-right text-clinic-blue font-mono font-black">
                        {formatCurrencyVND(currentRoundCLSTotal)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Patient Journey & Step-by-Step Instructions (SPECIFIC TO THIS ROUND) */}
              <div className="mb-5 p-4 bg-blue-50/70 border-2 border-blue-200 rounded-xl space-y-2">
                <div className="font-black text-xs uppercase text-blue-900 flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
                  II. HƯỚNG DẪN LỘ TRÌNH DI CHUYỂN DÀNH CHO BỆNH NHÂN (ĐỢT {printModalRound}):
                </div>
                <div className="grid grid-cols-1 gap-2 text-xs">
                  <div className="p-2 bg-white rounded border border-blue-200">
                    <span className="font-bold text-blue-900">Bước 1 (Nộp tiền Đợt {printModalRound}): </span>
                    Mang phiếu này xuống <b>Quầy Thu ngân (Tầng 1)</b> để nộp viện phí Đợt {printModalRound} ({formatCurrencyVND(invoiceTotalAmount)}) hoặc quét mã VietQR. Sau khi nộp, các phòng sẽ tự động kích hoạt tiếp nhận.
                  </div>

                  {uniqueRooms.map((room, rIdx) => (
                    <div key={room.code} className="p-2 bg-white rounded border border-blue-200">
                      <span className="font-bold text-blue-900">Bước {rIdx + 2} ({room.name}): </span>
                      Di chuyển tới <b>{room.name} — {room.code} ({room.floor})</b> xuất trình phiếu để thực hiện ({room.tests.slice(0, 2).join(", ")}{room.tests.length > 2 ? "..." : ""}).
                    </div>
                  ))}

                  <div className="p-2.5 bg-emerald-50 rounded border-2 border-emerald-300 text-emerald-950 font-medium">
                    <span className="font-black text-emerald-800">
                      Bước {uniqueRooms.length + 2} (Kết luận):{" "}
                    </span>
                    Sau khi làm xong các phòng Đợt {printModalRound}, quý khách <b>quay trở lại ngồi chờ trước Phòng 203 (gặp BS. Lê Minh)</b>. Kết quả sẽ được <b>tự động trả về máy tính bác sĩ (Auto-return)</b>. Quý khách <b>KHÔNG CẦN PHẢI CHỜ LẤY BẢN IN KẾT QUẢ TẠI CÁC PHÒNG XÉT NGHIỆM / CĐHA</b>.
                  </div>
                </div>
              </div>

              {/* Signatures & Barcode */}
              <div className="flex justify-between items-end pt-4 border-t border-slate-200">
                <div className="text-center">
                  <div className="text-[10px] text-slate-500 mb-1">Mã đợt khám (Đợt {printModalRound})</div>
                  <div className="w-24 h-24 bg-slate-900 text-white rounded flex flex-col items-center justify-center font-mono font-bold text-xs shadow-inner">
                    <span>ENC-032</span>
                    <span className="text-[10px] text-blue-300 font-normal">ĐỢT {printModalRound}</span>
                  </div>
                  <div className="font-mono text-[10px] mt-1 text-slate-600">*ENC-260917-032-R{printModalRound}*</div>
                </div>
                <div className="text-center min-w-[220px]">
                  <div className="text-[11px] text-slate-500">Hà Nội, ngày 17 tháng 09 năm 2026</div>
                  <div className="font-bold text-xs mt-1 mb-14 uppercase text-slate-900">BÁC SĨ CHỈ ĐỊNH</div>
                  <div className="font-bold text-slate-900 text-sm">{encounter.doctorName}</div>
                  <div className="text-[10px] text-slate-500">CCHN: 014285/BYT</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: HÓA ĐƠN NỘP TIỀN THEO TỪNG ĐỢT (CHỈ THU TIỀN ĐỢT NÀY) */}
          {printModalTab === "invoice" && (
            <div className="w-full max-w-[780px] bg-white text-slate-900 p-6 sm:p-8 rounded-lg shadow-xl print:shadow-none print:p-0 font-sans text-xs leading-relaxed h-fit my-auto sm:my-3">
              {/* Header hóa đơn */}
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
                    INV-260917-088{printModalRound >= 2 ? `-R${printModalRound}` : ""}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Lượt khám: <b>{encounter.encounterCode}</b>
                  </div>
                </div>
              </div>

              {/* Title with Explicit Round Distinction */}
              <div className="text-center mb-5">
                <div className="inline-block px-3 py-0.5 mb-1 rounded-full text-[11px] font-black uppercase tracking-wide bg-slate-100 border border-slate-300 text-slate-800">
                  {printModalRound === 1 ? "BIÊN LAI THU VIỆN PHÍ — ĐỢT 1 (BAN ĐẦU)" : "BIÊN LAI NỘP TIỀN BỔ SUNG — ĐỢT 2"}
                </div>
                <h1 className="text-base sm:text-lg font-black tracking-wider uppercase text-slate-900">
                  {printModalRound === 1 ? "HÓA ĐƠN TẠM THU & BẢNG KÊ CHI PHÍ" : "HÓA ĐƠN NỘP TIỀN CHỈ ĐỊNH PHÁT SINH"}
                </h1>
                <p className="text-[11px] text-slate-500 italic mt-0.5">
                  {printModalRound === 1
                    ? "(Phiếu nộp viện phí ban đầu: Công khám chuyên khoa + Cận lâm sàng Đợt 1)"
                    : "(Phiếu nộp viện phí chỉ định bổ sung Đợt 2 — Không tính lại tiền khám và các dịch vụ Đợt 1 đã nộp)"}
                </p>
              </div>

              {/* Patient info */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-slate-50 border border-slate-200 p-3 rounded-lg mb-4 text-xs">
                <div>
                  Người nộp tiền: <b className="uppercase">{encounter.patientName}</b>
                </div>
                <div>
                  Năm sinh: <b>1981 ({encounter.age}T)</b>
                </div>
                <div>
                  Điện thoại: <b>0912 345 678</b>
                </div>
                <div className="col-span-2">
                  Phòng khám chỉ định: <b>P.203 — {encounter.doctorName}</b>
                </div>
                <div>
                  Thời gian: <b>17/09/2026 08:35</b>
                </div>
              </div>

              {/* Itemized Table (ONLY SERVICES IN THIS ROUND) */}
              <table className="w-full border-collapse border border-slate-300 text-xs mb-5">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 font-bold">
                    <th className="border border-slate-300 p-2 w-8 text-center">STT</th>
                    <th className="border border-slate-300 p-2 text-left">
                      {printModalRound === 1 ? "Nội dung dịch vụ Đợt 1" : "Nội dung dịch vụ phát sinh Đợt 2"}
                    </th>
                    <th className="border border-slate-300 p-2 text-center w-14">SL</th>
                    <th className="border border-slate-300 p-2 text-right w-24">Đơn giá</th>
                    <th className="border border-slate-300 p-2 text-right w-28">Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Round 1 includes general consultation fee */}
                  {printModalRound === 1 && (
                    <tr>
                      <td className="border border-slate-300 p-2 text-center font-bold">1</td>
                      <td className="border border-slate-300 p-2 font-medium">
                        Khám lâm sàng Nội tổng quát (Chuyên gia)
                        <span className="text-[10px] text-slate-500 block font-normal">
                          Phòng Khám Nội Tổng Quát (P.203 — Tầng 2)
                        </span>
                      </td>
                      <td className="border border-slate-300 p-2 text-center">1</td>
                      <td className="border border-slate-300 p-2 text-right font-mono">150.000 đ</td>
                      <td className="border border-slate-300 p-2 text-right font-mono font-semibold">
                        150.000 đ
                      </td>
                    </tr>
                  )}

                  {/* Round-specific services */}
                  {currentRoundOrders.map((ord, i) => (
                    <tr key={ord.id}>
                      <td className="border border-slate-300 p-2 text-center font-bold">
                        {printModalRound === 1 ? i + 2 : i + 1}
                      </td>
                      <td className="border border-slate-300 p-2 font-medium">
                        <span>{ord.serviceName}</span>
                        <span className="text-[10px] text-slate-500 block font-normal">
                          {ord.roomName} ({ord.roomCode} — {ord.floor})
                        </span>
                      </td>
                      <td className="border border-slate-300 p-2 text-center">1</td>
                      <td className="border border-slate-300 p-2 text-right font-mono">
                        {formatCurrencyVND(ord.price)}
                      </td>
                      <td className="border border-slate-300 p-2 text-right font-mono font-semibold">
                        {formatCurrencyVND(ord.price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-50 font-bold">
                    <td colSpan={4} className="border border-slate-300 p-2 text-right uppercase">
                      TỔNG TIỀN ĐỢT {printModalRound} PHẢI NỘP:
                    </td>
                    <td className="border border-slate-300 p-2 text-right text-base text-clinic-blue font-mono font-black">
                      {formatCurrencyVND(invoiceTotalAmount)}
                    </td>
                  </tr>
                </tfoot>
              </table>

              {/* VietQR Section (CALCULATED SPECIFICALLY FOR THIS ROUND) */}
              <div className="p-4 bg-slate-50 border-2 border-slate-300 rounded-xl flex items-center gap-6 mb-6">
                <div className="w-32 h-32 bg-slate-900 text-white p-2 rounded-lg flex flex-col items-center justify-center text-center shrink-0 shadow-inner">
                  <QrCode className="w-8 h-8 text-blue-400 mb-1" />
                  <div className="font-black text-xs">VIETQR</div>
                  <div className="text-[9px] text-slate-300 font-mono">MB BANK</div>
                  <div className="text-[8px] text-emerald-400 font-bold mt-1">Napas 247</div>
                </div>
                <div className="space-y-1 text-xs flex-1">
                  <div className="font-bold text-slate-900 text-sm">
                    HƯỚNG DẪN NỘP TIỀN CHUYỂN KHOẢN ĐỢT {printModalRound} (VIETQR):
                  </div>
                  <div>
                    Ngân hàng: <b>MB Bank (Ngân Hàng Quân Đội)</b>
                  </div>
                  <div>
                    Số tài khoản: <b className="font-mono text-sm">09123456789</b>
                  </div>
                  <div>
                    Chủ tài khoản: <b>PHONG KHAM DA KHOA NGOC KHANH CLINICONE</b>
                  </div>
                  <div>
                    Số tiền cần nộp Đợt {printModalRound}:{" "}
                    <b className="text-clinic-blue font-bold text-sm font-mono">
                      {formatCurrencyVND(invoiceTotalAmount)}
                    </b>
                  </div>
                  <div className="pt-1">
                    Cú pháp chuyển khoản bắt buộc:{" "}
                    <span className="px-2 py-0.5 bg-amber-100 border border-amber-300 font-mono font-black text-amber-900 rounded">
                      ENC-032 NGUYEN VAN AN DOT{printModalRound} {invoiceTotalAmount}
                    </span>
                  </div>
                </div>
              </div>

              {/* Invoice Footer (Customer signature removed per policy) */}
              <div className="flex justify-between items-end pt-3 border-t border-slate-200">
                <div className="text-[11px] text-slate-500 italic max-w-xs space-y-1">
                  <p>• Phiếu tạm thu viện phí Đợt {printModalRound} được khởi tạo tự động từ hệ thống ClinicOne.</p>
                  <p>• Quý khách vui lòng lưu giữ biên lai để nhân viên các phòng CLS tiếp nhận.</p>
                </div>
                <div className="text-center min-w-[200px]">
                  <div className="text-[11px] text-slate-500">Hà Nội, ngày 17 tháng 09 năm 2026</div>
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
