"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { PageHeader } from "@/shared/components/page-header";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Input } from "@/shared/ui/input";
import { useDemoJourneyStore } from "@/shared/stores/demo-journey.store";
import { useUIStore } from "@/shared/stores/ui.store";
import {
  UserPlus,
  ArrowRight,
  Clock,
  CheckCircle2,
  QrCode,
  Users,
  ShieldAlert,
  Printer,
  Volume2,
  Sparkles,
  Stethoscope,
  ChevronRight,
  Activity,
  Calendar,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";

function ReceptionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast, openPrintModal } = useUIStore();

  const {
    patientName,
    patientCode,
    encounterCode,
    currentStage,
    receptionTicket,
    receptionQueueList,
    initialExamTicket,
    returnExamTicket,
    isEncounterCreated,
    callReceptionTicket,
    startServingReception,
    confirmReception,
  } = useDemoJourneyStore();

  const [activeTab, setActiveTab] = React.useState<"QUEUE" | "INTAKE" | "JOURNEY">("QUEUE");

  // Form states
  const [reason, setReason] = React.useState("Đau đầu từng cơn vùng chẩm, chóng mặt khi đổi tư thế 3 ngày nay");
  const [department, setDepartment] = React.useState("NỘI TỔNG QUÁT");
  const [roomCode, setRoomCode] = React.useState("P.203");
  const [doctorName, setDoctorName] = React.useState("BS. Lê Minh");
  const [priority, setPriority] = React.useState("NORMAL");
  const [isSuccessSubmitted, setIsSuccessSubmitted] = React.useState(false);

  // Check URL search param (e.g., coming from Quick-View or Kiosk)
  React.useEffect(() => {
    const ticketParam = searchParams.get("ticket");
    const patientParam = searchParams.get("patient");
    if (ticketParam || patientParam) {
      setActiveTab("INTAKE");
    }
  }, [searchParams]);

  const handleCallTicket = (ticketNum: string) => {
    callReceptionTicket();
    showToast(`Hệ thống phát âm thanh: "Xin mời số thứ tự ${ticketNum} đến quầy số 01 tiếp đón"`);
  };

  const handleStartIntake = (ticketNum: string) => {
    startServingReception();
    setActiveTab("INTAKE");
    showToast(`Bắt đầu tiếp nhận số ${ticketNum}`);
  };

  const handleConfirmIntake = (e: React.FormEvent) => {
    e.preventDefault();
    confirmReception(roomCode, doctorName);
    setIsSuccessSubmitted(true);
    showToast(`Đã tạo lượt khám ${encounterCode} và cấp số thứ tự khám P203-032!`);
  };

  const waitingTickets = receptionQueueList.filter((t) => t.status === "WAITING" || t.status === "CALLED");
  const servingTicket = receptionQueueList.find((t) => t.status === "SERVING") || receptionTicket;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="QUẦY TIẾP ĐÓN & TIẾP NHẬN BỆNH NHÂN"
        title="Tiếp nhận & Cấp số thứ tự khám"
        description="Quản lý hàng đợi tiếp đón tại sảnh, đối soát định danh bệnh nhân, tạo lượt khám và cấp vé khám chuyên khoa tại phòng bác sĩ"
        action={
          <div className="flex items-center gap-2">
            <Link href="/check-in">
              <Button variant="outline" size="sm" className="font-bold text-xs border-slate-300">
                <QrCode className="w-3.5 h-3.5 mr-1 text-clinic-blue" />
                Mở Kiosk lấy số
              </Button>
            </Link>
            <Link href="/encounters/ENC-260917-032">
              <Button size="sm" className="font-bold text-xs bg-clinic-blue text-white">
                Mở ca khám bác sĩ →
              </Button>
            </Link>
          </div>
        }
      />

      {/* Modern Tab Bar */}
      <div className="flex items-center bg-slate-200/80 p-1 rounded-2xl border border-slate-300 max-w-xl">
        <button
          type="button"
          onClick={() => setActiveTab("QUEUE")}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === "QUEUE"
              ? "bg-white text-clinic-blue shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Hàng đợi tiếp nhận</span>
          <span className="px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-800 text-[10px] font-mono">
            {waitingTickets.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("INTAKE")}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === "INTAKE"
              ? "bg-white text-clinic-blue shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Đang tiếp nhận & Tạo ca</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("JOURNEY")}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === "JOURNEY"
              ? "bg-white text-clinic-blue shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Hành trình người bệnh</span>
        </button>
      </div>

      {/* TAB 1: HÀNG ĐỢI TIẾP NHẬN (RECEPTION QUEUE) */}
      {activeTab === "QUEUE" && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Left: Quầy đang phục vụ (5 cols) */}
            <div className="md:col-span-5 space-y-4">
              <Card className="border-blue-300 bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-950 text-white shadow-xl overflow-hidden">
                <CardHeader className="p-5 border-b border-blue-800/60 pb-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-black tracking-widest text-blue-400 bg-blue-900/60 px-2.5 py-0.5 rounded-full border border-blue-700">
                      BÀN TIẾP NHẬN SỐ 01
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-bold">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Đang tiếp đón
                    </span>
                  </div>
                  <CardTitle className="text-base text-white mt-2">Số thứ tự đang phục vụ</CardTitle>
                </CardHeader>

                <CardContent className="p-5 space-y-4">
                  <div className="text-center py-3 bg-slate-900/60 rounded-2xl border border-blue-900/80">
                    <div className="text-xs font-semibold text-slate-400">SỐ TIẾP ĐÓN</div>
                    <div className="font-mono text-5xl font-black text-blue-400 tracking-wider my-1">
                      {servingTicket?.number || "A023"}
                    </div>
                    <div className="text-xs font-bold text-white uppercase">
                      {servingTicket?.patientName || "Nguyễn Văn An"}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      Mã BN: {servingTicket?.patientCode || "PT-001842"} • Giờ cấp: {servingTicket?.issuedAt || "08:15"}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCallTicket(servingTicket?.number || "A023")}
                      className="flex-1 font-bold text-xs border-blue-700 text-blue-300 hover:bg-blue-900/50 bg-slate-900"
                    >
                      <Volume2 className="w-3.5 h-3.5 mr-1" />
                      Gọi lại số
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleStartIntake(servingTicket?.number || "A023")}
                      className="flex-1 font-bold text-xs bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/30"
                    >
                      <span>Tiếp nhận ngay</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Info Box */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs space-y-2 shadow-sm text-slate-600">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-clinic-blue" />
                  Quy tắc xếp hàng tiếp đón (Reception Queue)
                </div>
                <p className="text-[11px] leading-relaxed">
                  Số thứ tự tiếp nhận <b>Axxx</b> do Kiosk tự động cấp tại sảnh và độc lập với số phòng khám. Bệnh nhân chỉ được cấp số phòng bác sĩ sau khi hoàn tất thủ tục tiếp nhận.
                </p>
              </div>
            </div>

            {/* Right: Danh sách chờ tiếp nhận (7 cols) */}
            <div className="md:col-span-7 space-y-4">
              <Card className="border-slate-200 shadow-sm">
                <CardHeader className="p-4 bg-slate-50/80 border-b border-slate-200 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-sm font-bold text-slate-900">
                      Danh sách chờ tiếp nhận tại sảnh ({waitingTickets.length} người)
                    </CardTitle>
                    <span className="text-[11px] text-slate-500">
                      Sắp xếp theo thứ tự thời gian bấm số Kiosk
                    </span>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleStartIntake("A023")}
                    className="font-bold text-xs bg-clinic-blue text-white"
                  >
                    Gọi số tiếp theo (A023) →
                  </Button>
                </CardHeader>

                <div className="divide-y divide-slate-100">
                  {receptionQueueList.map((ticket) => (
                    <div
                      key={ticket.id}
                      className={`p-3.5 flex items-center justify-between gap-3 text-xs transition-colors ${
                        ticket.number === "A023"
                          ? "bg-blue-50/80 border-l-4 border-l-clinic-blue"
                          : ticket.status === "SERVING"
                          ? "bg-emerald-50/70 border-l-4 border-l-emerald-600"
                          : "hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-base font-black text-slate-900 w-12 text-center">
                          {ticket.number}
                        </span>
                        <div>
                          <div className="font-bold text-slate-900 flex items-center gap-2">
                            <span>{ticket.patientName}</span>
                            <span className="text-[10px] font-mono text-slate-500 bg-white px-1.5 py-0.2 rounded border border-slate-200">
                              {ticket.patientCode}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                            <span>Nguồn: <b>{ticket.source}</b></span>
                            <span>•</span>
                            <span>Giờ lấy: {ticket.issuedAt}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {ticket.status === "SERVING" ? (
                          <Badge variant="success" className="font-bold text-[10px]">
                            ĐANG PHỤC VỤ
                          </Badge>
                        ) : ticket.status === "COMPLETED" ? (
                          <Badge variant="secondary" className="font-bold text-[10px] text-slate-500">
                            ĐÃ TIẾP NHẬN
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="font-bold text-[10px] border-blue-300 text-clinic-blue">
                            ĐANG CHỜ
                          </Badge>
                        )}

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleStartIntake(ticket.number)}
                          className="h-8 text-xs font-bold text-clinic-blue hover:bg-blue-100"
                        >
                          Chọn →
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ĐANG TIẾP NHẬN & TẠO ENCOUNTER (INTAKE WORKSPACE) */}
      {activeTab === "INTAKE" && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Ticket Context Pill */}
          <div className="p-3 bg-blue-950 text-white rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xl font-black text-blue-400 bg-blue-900/60 px-3 py-1 rounded-xl border border-blue-700">
                A023
              </span>
              <div>
                <span className="font-bold text-white block">ĐANG TIẾP NHẬN SỐ THỨ TỰ A023</span>
                <span className="text-slate-300 text-[11px]">
                  Thời gian cấp: 08:15 • Nguồn Kiosk Sảnh Tầng 1 • Người bệnh đã đến quầy
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link href="/patients">
                <Button variant="outline" size="sm" className="font-bold text-xs text-white border-blue-700 hover:bg-blue-900">
                  <Users className="w-3.5 h-3.5 mr-1" />
                  Đổi hồ sơ bệnh nhân khác
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Patient Safety & Demographic Context (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              {/* Identified Patient Card */}
              <Card className="border-slate-200 shadow-sm overflow-hidden bg-white">
                <CardHeader className="p-4 bg-slate-50/80 border-b border-slate-200 flex flex-row items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-clinic-blue tracking-wider">
                    HỒ SƠ BỆNH NHÂN ĐÃ ĐỐI SOÁT
                  </span>
                  <Badge variant="success" className="font-bold text-[10px]">
                    CHÍNH XÁC 100%
                  </Badge>
                </CardHeader>

                <CardContent className="p-4 space-y-3 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <div className="font-black text-base text-slate-900 uppercase">{patientName}</div>
                      <div className="text-slate-500 font-mono mt-0.5">
                        Mã BN: <b className="text-clinic-blue">{patientCode}</b> • CCCD: 001081008892
                      </div>
                    </div>
                    <div className="text-right text-slate-600">
                      <div>45 tuổi (1981)</div>
                      <div className="font-semibold">Nam</div>
                    </div>
                  </div>

                  {/* Safety Allergy Warning */}
                  <div className="p-3 bg-red-50 border-2 border-red-300 rounded-xl space-y-1">
                    <div className="flex items-center gap-1.5 font-black text-red-700 text-xs uppercase">
                      <ShieldAlert className="w-4 h-4 text-red-600" />
                      CẢNH BÁO AN TOÀN ĐẶC BIỆT:
                    </div>
                    <div className="text-xs text-red-900 leading-snug">
                      <b>Dị ứng Penicillin</b> (Phản vệ độ 2 năm 2021). Tuyệt đối không chỉ định hoặc kê đơn nhóm Beta-lactam.
                    </div>
                  </div>

                  {/* Chronic & Vitals */}
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-slate-700">
                    <div><b>Bệnh nền: </b>Tăng huyết áp nguyên phát (I10), Rối loạn lipid máu</div>
                    <div><b>Thuốc định kỳ: </b>Amlodipine 5mg (1 viên sáng)</div>
                    <div><b>Huyết áp đo gần nhất: </b><span className="font-bold text-red-600 font-mono">148/92 mmHg</span></div>
                  </div>
                </CardContent>
              </Card>

              {/* Success Result Box (When Form Submitted) */}
              {isSuccessSubmitted && (
                <Card className="border-emerald-300 bg-emerald-50/90 text-emerald-950 p-4 shadow-lg animate-in zoom-in-95 space-y-3">
                  <div className="flex items-center gap-2 font-black text-sm text-emerald-900">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    TIẾP NHẬN THÀNH CÔNG! ĐÃ CẤP SỐ KHÁM
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-emerald-200 space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Mã lượt khám (Encounter):</span>
                      <span className="font-mono font-bold text-slate-900">{encounterCode}</span>
                    </div>
                    <div className="flex justify-between items-center pt-1 border-t border-slate-100">
                      <span className="text-slate-500 font-bold">Số chờ tại phòng bác sĩ:</span>
                      <span className="font-mono text-xl font-black text-clinic-blue">P203-032</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Phòng khám chỉ định:</span>
                      <span className="font-bold text-slate-800">P.203 — BS. Lê Minh</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openPrintModal("routing")}
                      className="flex-1 font-bold text-xs border-emerald-400 text-emerald-800 hover:bg-emerald-100 bg-white"
                    >
                      <Printer className="w-3.5 h-3.5 mr-1" />
                      In phiếu chờ khám
                    </Button>
                    <Link href="/clinical" className="flex-1">
                      <Button size="sm" className="w-full font-bold text-xs bg-emerald-700 hover:bg-emerald-800 text-white">
                        Xem hàng đợi Bác sĩ →
                      </Button>
                    </Link>
                  </div>
                </Card>
              )}
            </div>

            {/* Right: Intake Form (7 cols) */}
            <div className="lg:col-span-7">
              <Card className="border-slate-200 shadow-sm bg-white">
                <CardHeader className="p-4 bg-slate-50/80 border-b border-slate-200">
                  <span className="text-[10px] font-black uppercase text-clinic-blue tracking-wider">
                    THÔNG TIN TIẾP NHẬN KHÁM NGOẠI TRÚ
                  </span>
                  <CardTitle className="text-sm font-bold text-slate-900">
                    Phân luồng chuyên khoa & Chỉ định phòng bác sĩ
                  </CardTitle>
                </CardHeader>

                <form onSubmit={handleConfirmIntake}>
                  <CardContent className="p-5 space-y-4 text-xs">
                    {/* Reason */}
                    <div className="space-y-1">
                      <label className="font-bold text-slate-800 block">
                        Lý do vào khám & Triệu chứng chính: <span className="text-red-500">*</span>
                      </label>
                      <Input
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        required
                        className="text-xs font-semibold"
                        placeholder="Nhập triệu chứng chính..."
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Department */}
                      <div className="space-y-1">
                        <label className="font-bold text-slate-800 block">
                          Chuyên khoa khám: <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={department}
                          onChange={(e) => setDepartment(e.target.value)}
                          className="w-full h-10 px-3 rounded-lg border border-slate-300 bg-white text-xs font-bold text-slate-900 focus:ring-2 focus:ring-clinic-blue outline-none"
                        >
                          <option value="NỘI TỔNG QUÁT">Nội Tổng Quát (Chuyên khoa)</option>
                          <option value="TIM MẠCH">Tim Mạch & Huyết Áp</option>
                          <option value="TIÊU HÓA">Tiêu Hóa & Gan Mật</option>
                          <option value="TAI MŨI HỌNG">Tai Mũi Họng</option>
                        </select>
                      </div>

                      {/* Room & Doctor */}
                      <div className="space-y-1">
                        <label className="font-bold text-slate-800 block">
                          Phòng khám & Bác sĩ: <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={roomCode}
                          onChange={(e) => {
                            setRoomCode(e.target.value);
                            setDoctorName("BS. Lê Minh");
                          }}
                          className="w-full h-10 px-3 rounded-lg border border-slate-300 bg-white text-xs font-bold text-slate-900 focus:ring-2 focus:ring-clinic-blue outline-none"
                        >
                          <option value="P.203">P.203 — BS. Lê Minh (Chờ: 2 người)</option>
                          <option value="P.204">P.204 — BS. Trần Thu Hà (Chờ: 5 người)</option>
                          <option value="P.205">P.205 — BS. Nguyễn Quốc Tuấn (Chờ: 1 người)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Priority */}
                      <div className="space-y-1">
                        <label className="font-bold text-slate-800 block">Mức độ ưu tiên tiếp đón:</label>
                        <select
                          value={priority}
                          onChange={(e) => setPriority(e.target.value)}
                          className="w-full h-10 px-3 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-clinic-blue outline-none"
                        >
                          <option value="NORMAL">Bình thường (Theo thứ tự hàng đợi)</option>
                          <option value="PRIORITY">Ưu tiên (Người già &gt; 75T, trẻ nhỏ, phụ nữ mang thai)</option>
                          <option value="EMERGENCY">Khẩn cấp (Cần xử trí ngay)</option>
                        </select>
                      </div>

                      {/* Source */}
                      <div className="space-y-1">
                        <label className="font-bold text-slate-800 block">Số tiếp nhận liên kết:</label>
                        <Input
                          value="A023 (Kiosk Check-in)"
                          readOnly
                          className="bg-slate-100 font-mono font-bold text-slate-700 text-xs"
                        />
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setActiveTab("QUEUE")}
                      className="text-xs text-slate-600"
                    >
                      ← Quay lại Hàng đợi
                    </Button>
                    <Button
                      type="submit"
                      size="sm"
                      className="font-bold text-xs bg-clinic-blue hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 h-10 px-5"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-1.5" />
                      Xác nhận tiếp nhận & Cấp số khám P203-032 →
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: HÀNH TRÌNH BỆNH NHÂN (JOURNEY BOARD) */}
      {activeTab === "JOURNEY" && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3.5 items-start">
            {/* Column 1: Chờ khám ban đầu */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-[10px] font-black text-slate-700 uppercase">
                  1. Chờ khám ban đầu
                </span>
                <span className="px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
                  2
                </span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-xs space-y-1">
                  <div className="flex justify-between font-mono font-bold text-clinic-blue">
                    <span>P203-035</span>
                    <span className="text-[10px] text-slate-400">PT-003194</span>
                  </div>
                  <div className="font-bold text-slate-900">Trần Thị Bích</div>
                  <div className="text-[11px] text-slate-500">P.203 — Chờ 12 phút</div>
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-xs space-y-1">
                  <div className="flex justify-between font-mono font-bold text-clinic-blue">
                    <span>P203-038</span>
                    <span className="text-[10px] text-slate-400">PT-007812</span>
                  </div>
                  <div className="font-bold text-slate-900">Lê Hoàng Nam</div>
                  <div className="text-[11px] text-slate-500">P.203 — Chờ 7 phút</div>
                </div>
              </div>
            </div>

            {/* Column 2: Đang khám tại phòng */}
            <div className="bg-blue-50/50 border border-blue-200 rounded-2xl p-3 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-blue-200">
                <span className="text-[10px] font-black text-blue-900 uppercase">
                  2. Đang khám tại phòng
                </span>
                <span className="px-1.5 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold">
                  1
                </span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-3 bg-white border-2 border-blue-400 rounded-xl shadow-sm space-y-1.5 ring-2 ring-blue-400/20">
                  <div className="flex justify-between font-mono font-black text-clinic-blue">
                    <span>P203-032</span>
                    <span className="text-[10px] text-blue-800">PT-001842</span>
                  </div>
                  <div className="font-bold text-slate-900">{patientName}</div>
                  <div className="text-[11px] text-slate-600">P.203 — BS. Lê Minh</div>
                  <div className="text-[10px] text-red-600 font-bold">⚠ Dị ứng Penicillin</div>
                  <Link href="/encounters/ENC-260917-032" className="block pt-1">
                    <Button size="sm" variant="outline" className="w-full text-[11px] h-7 font-bold border-blue-300 text-clinic-blue">
                      Xem ca khám →
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Column 3: Chờ nộp phí */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-[10px] font-black text-slate-700 uppercase">
                  3. Chờ nộp phí (Gate)
                </span>
                <span className="px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                  1
                </span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-xs space-y-1">
                  <div className="flex justify-between font-mono font-bold text-slate-700">
                    <span>#030</span>
                    <span className="text-[10px] text-slate-400">PT-002241</span>
                  </div>
                  <div className="font-bold text-slate-900">Vũ Đình Trọng</div>
                  <div className="text-[11px] text-slate-500">Quầy Thu ngân T1 • 5 phút</div>
                </div>
              </div>
            </div>

            {/* Column 4: Đang làm cận lâm sàng */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-[10px] font-black text-slate-700 uppercase">
                  4. Đang làm CLS
                </span>
                <span className="px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold">
                  2
                </span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-xs space-y-1">
                  <div className="flex justify-between font-mono font-bold text-purple-700">
                    <span>#031</span>
                    <span className="text-[10px] text-slate-400">PT-008910</span>
                  </div>
                  <div className="font-bold text-slate-900">Phạm Hồng Phúc</div>
                  <div className="text-[11px] text-slate-500">P.202 Xét nghiệm (Đang chạy máy)</div>
                </div>
                <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-xs space-y-1">
                  <div className="flex justify-between font-mono font-bold text-purple-700">
                    <span>#029</span>
                    <span className="text-[10px] text-slate-400">PT-005112</span>
                  </div>
                  <div className="font-bold text-slate-900">Đỗ Kim Oanh</div>
                  <div className="text-[11px] text-slate-500">P.105 Siêu âm Doppler</div>
                </div>
              </div>
            </div>

            {/* Column 5: Quay lại bác sĩ kết luận */}
            <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-3 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-emerald-200">
                <span className="text-[10px] font-black text-emerald-900 uppercase">
                  5. Quay lại kết luận
                </span>
                <span className="px-1.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold">
                  1
                </span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-3 bg-emerald-50 border-2 border-emerald-400 rounded-xl shadow-sm space-y-1.5">
                  <div className="flex justify-between font-mono font-black text-emerald-800">
                    <span>P203-R015</span>
                    <span className="text-[10px] text-emerald-700 font-bold">ĐỦ 3/3 KQ</span>
                  </div>
                  <div className="font-bold text-slate-900">{patientName}</div>
                  <div className="text-[11px] text-emerald-900 font-medium">
                    Quay lại P.203 — Kết quả đã tự động trả về máy bác sĩ
                  </div>
                  <Link href="/clinical" className="block pt-1">
                    <Button size="sm" variant="success" className="w-full text-[11px] h-7 font-bold">
                      Mời vào kết luận →
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ReceptionPage() {
  return (
    <React.Suspense
      fallback={
        <div className="p-8 text-center text-xs text-slate-500 font-semibold">
          Đang tải phân hệ Tiếp nhận & Phân luồng...
        </div>
      }
    >
      <ReceptionContent />
    </React.Suspense>
  );
}
