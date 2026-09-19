"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import {
  PatientResultPackage,
  PatientResultAccessLink,
} from "@/entities/patient-result/model/patient-result.types";
import { PatientResultService } from "@/entities/patient-result/services/patient-result.service";
import {
  maskPhoneNumber,
  verifyResultSession,
  clearResultSession,
} from "@/entities/patient-result/lib/security";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Input } from "@/shared/ui/input";
import {
  ShieldCheck,
  Lock,
  KeyRound,
  FileCheck,
  AlertCircle,
  Clock,
  Printer,
  Download,
  Calendar,
  Pill,
  Activity,
  CheckCircle2,
  Stethoscope,
  Heart,
  Eye,
  EyeOff,
  LogOut,
  AlertTriangle,
  Building2,
  ExternalLink,
} from "lucide-react";

export default function PublicPatientResultPage() {
  const params = useParams();
  const rawToken = Array.isArray(params?.token) ? params.token[0] : (params?.token as string) || "";

  const [pin, setPin] = React.useState("");
  const [showPin, setShowPin] = React.useState(false);
  const [isVerifying, setIsVerifying] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [remainingAttempts, setRemainingAttempts] = React.useState<number | null>(null);

  // Verified state
  const [isVerified, setIsVerified] = React.useState(false);
  const [resultPackage, setResultPackage] = React.useState<PatientResultPackage | null>(null);
  const [linkInfo, setLinkInfo] = React.useState<PatientResultAccessLink | null>(null);
  const [sessionTimeLeft, setSessionTimeLeft] = React.useState<number>(1200); // 20 minutes in seconds

  // Initialize: Check if session is already active or look up link info
  React.useEffect(() => {
    if (!rawToken) return;

    const link = PatientResultService.getLinkByToken(rawToken);
    setLinkInfo(link);

    // If session already verified in this browser tab
    if (verifyResultSession(rawToken)) {
      const pkg = PatientResultService.getPackageWithSession(rawToken);
      if (pkg) {
        setResultPackage(pkg);
        setIsVerified(true);
      }
    }
  }, [rawToken]);

  // Session countdown timer
  React.useEffect(() => {
    if (!isVerified) return;

    const interval = setInterval(() => {
      setSessionTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          clearResultSession(rawToken);
          setIsVerified(false);
          setResultPackage(null);
          setErrorMessage("Phiên truy cập đã hết thời hạn an toàn (20 phút). Vui lòng nhập lại mã PIN.");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isVerified, rawToken]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim()) {
      setErrorMessage("Vui lòng nhập mã PIN bảo vệ gồm 6 chữ số.");
      return;
    }

    setIsVerifying(true);
    setErrorMessage(null);

    try {
      const res = await PatientResultService.verifyPin(rawToken, pin);

      if (res.success && res.sessionToken) {
        setIsVerified(true);
        setResultPackage(PatientResultService.getPackageWithSession(rawToken));
        setSessionTimeLeft(1200); // reset 20 mins
      } else {
        setErrorMessage(res.error || "Mã PIN không chính xác.");
        if (res.remainingAttempts !== undefined) {
          setRemainingAttempts(res.remainingAttempts);
        }
      }
    } catch {
      setErrorMessage("Có lỗi xảy ra khi xác thực. Vui lòng thử lại.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLogout = () => {
    clearResultSession(rawToken);
    setIsVerified(false);
    setResultPackage(null);
    setPin("");
  };

  const handlePrint = () => {
    window.print();
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans">
      {/* Header: Clinic Brand & Security Badging */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-xs print:hidden">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-clinic-blue text-white flex items-center justify-center font-black text-lg shadow-sm">
              +
            </div>
            <div>
              <div className="font-black text-sm text-slate-900 tracking-tight flex items-center gap-1.5">
                PHÒNG KHÁM ĐA KHOA NGỌC KHÁNH
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                Cổng Tra Cứu Kết Quả Khám & Đơn Thuốc Điện Tử (Bảo Mật)
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isVerified && (
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
                  <Clock className="w-3.5 h-3.5 text-clinic-blue" />
                  Phiên hết hạn sau: <b>{formatSeconds(sessionTimeLeft)}</b>
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleLogout}
                  className="h-8 text-xs font-bold text-slate-600 hover:text-red-600 hover:bg-red-50"
                  title="Đóng phiên làm việc an toàn"
                >
                  <LogOut className="w-3.5 h-3.5 mr-1" />
                  Thoát
                </Button>
              </div>
            )}
            {!isVerified && (
              <Badge variant="outline" className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border-emerald-300">
                <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                Mã hóa đầu cuối SHA-256
              </Badge>
            )}
          </div>
        </div>
      </header>

      {/* VIEW 1: PIN VERIFICATION FORM (NO MEDICAL DATA EXPOSED BEFORE THIS) */}
      {!isVerified && (
        <main className="max-w-md mx-auto px-4 py-12">
          <Card className="border-slate-200 shadow-xl bg-white overflow-hidden rounded-2xl">
            <div className="h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500" />
            <CardHeader className="text-center p-6 pb-2">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-clinic-blue flex items-center justify-center mx-auto mb-3 border border-blue-200 shadow-sm">
                <KeyRound className="w-7 h-7" />
              </div>
              <CardTitle className="text-lg font-black text-slate-900 tracking-tight">
                Xác Thực Quyền Truy Cập Kết Quả
              </CardTitle>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Để bảo vệ quyền riêng tư hồ sơ y tế của người bệnh, vui lòng nhập mã PIN bảo mật 6 số đã được gửi qua tin nhắn SMS/Zalo.
              </p>
            </CardHeader>

            <CardContent className="p-6 pt-4 space-y-4">
              {linkInfo && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Mã lượt khám:</span>
                    <span className="font-mono font-bold text-slate-900">{linkInfo.encounterCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Người nhận thông báo:</span>
                    <span className="font-mono font-bold text-slate-800">
                      {maskPhoneNumber(linkInfo.recipientPhone)}
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>Thời hạn truy cập:</span>
                    <span>30 ngày (Đến {new Date(linkInfo.expiresAt).toLocaleDateString("vi-VN")})</span>
                  </div>
                </div>
              )}

              {/* Error / Alert Banner */}
              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-start gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">{errorMessage}</span>
                    {remainingAttempts !== null && remainingAttempts > 0 && (
                      <div className="text-[11px] mt-0.5 text-red-700 font-medium">
                        Cảnh báo: Nếu nhập sai quá 5 lần, đường link sẽ tự động bị khóa vĩnh viễn vì lý do bảo mật.
                      </div>
                    )}
                  </div>
                </div>
              )}

              <form onSubmit={handleVerify} className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="patientPinInput" className="text-xs font-bold text-slate-700 block">
                    Mã PIN bảo mật (6 chữ số):
                  </label>
                  <div className="relative">
                    <Input
                      id="patientPinInput"
                      type={showPin ? "text" : "password"}
                      maxLength={8}
                      placeholder="Ví dụ: 184201"
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      className="text-center font-mono text-xl tracking-widest font-black h-12 bg-slate-50 focus:bg-white"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowPin(!showPin)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                      tabIndex={-1}
                    >
                      {showPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500 italic text-center">
                    Mã PIN gồm 6 số đã được cung cấp tại buồng khám hoặc qua tin nhắn.
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={isVerifying || !pin}
                  className="w-full h-11 font-bold text-sm bg-clinic-blue hover:bg-blue-700 text-white shadow-md"
                >
                  {isVerifying ? "Đang xác thực bảo mật..." : "Mở Hồ Sơ Kết Quả Khám →"}
                </Button>
              </form>

              <div className="pt-2 text-[11px] text-slate-500 leading-relaxed text-center border-t border-slate-100">
                Nếu quý khách làm mất mã PIN hoặc không nhận được tin nhắn, vui lòng liên hệ Tổng đài Phòng khám Ngọc Khánh qua số <b>1900 6868</b> để được hỗ trợ cấp lại.
              </div>
            </CardContent>
          </Card>
        </main>
      )}

      {/* VIEW 2: VERIFIED PATIENT RESULT PACKAGE (CLEAN PATIENT-FACING DATA ONLY) */}
      {isVerified && resultPackage && (
        <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
          {/* Action Bar (Download & Print) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs print:hidden">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-800">
                Xác thực thành công • Hồ sơ bệnh án điện tử đã ký duyệt (FINAL)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                className="font-bold text-xs border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                <Printer className="w-3.5 h-3.5 mr-1.5 text-clinic-blue" />
                In kết quả
              </Button>
              <Button
                size="sm"
                onClick={() => alert(`Đang tải file PDF: Ket_qua_kham_${resultPackage.encounterCode}.pdf (Kèm chữ ký số SHA-256)`)}
                className="font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
              >
                <Download className="w-3.5 h-3.5 mr-1.5" />
                Tải bản PDF có ký số
              </Button>
            </div>
          </div>

          {/* Patient & Encounter Identity Header Card */}
          <Card className="border-slate-200 shadow-sm bg-white overflow-hidden rounded-2xl">
            <CardHeader className="bg-gradient-to-r from-blue-900 to-slate-900 text-white p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-300 bg-blue-950/80 px-2.5 py-1 rounded-full border border-blue-700">
                    PHIẾU KẾT QUẢ KHÁM CHỮA BỆNH NGOẠI TRÚ
                  </span>
                  <h1 className="text-2xl font-black mt-2 text-white uppercase tracking-tight">
                    {resultPackage.patientName}
                  </h1>
                  <div className="flex items-center gap-3 text-xs text-blue-200 mt-1 font-mono">
                    <span>Mã BN: {resultPackage.patientCode}</span>
                    <span>•</span>
                    <span>Năm sinh: {resultPackage.patientBirthYear} ({resultPackage.patientGender})</span>
                    <span>•</span>
                    <span>Lượt khám: {resultPackage.encounterCode}</span>
                  </div>
                </div>

                <div className="text-left sm:text-right text-xs text-slate-300 space-y-1">
                  <div className="text-slate-400">Bác sĩ khám phụ trách:</div>
                  <div className="font-bold text-white text-sm">{resultPackage.doctorName}</div>
                  <div className="text-[11px] text-blue-300 font-mono">
                    {resultPackage.departmentName} — {resultPackage.roomCode}
                  </div>
                  <div className="text-[11px] text-slate-400">Ngày khám: {resultPackage.encounterDate}</div>
                </div>
              </div>
            </CardHeader>

            {/* Diagnosis & Professional Synthesis */}
            <CardContent className="p-6 space-y-6">
              <div className="p-5 bg-blue-50/70 rounded-2xl border border-blue-200 space-y-2">
                <div className="flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-clinic-blue" />
                  <span className="text-[11px] font-black uppercase text-blue-900 tracking-wider">
                    CHẨN ĐOÁN XÁC ĐỊNH & KẾT LUẬN CHUYÊN MÔN
                  </span>
                </div>
                <div className="text-base font-black text-slate-950">
                  {resultPackage.finalDiagnosis.name} ({resultPackage.finalDiagnosis.code})
                </div>
                <div className="text-xs text-slate-700 leading-relaxed pt-1 border-t border-blue-200/80">
                  {resultPackage.conclusion}
                </div>
              </div>

              {/* Doctor's Advice Box */}
              <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200 space-y-1.5">
                <span className="text-[11px] font-black uppercase text-amber-900 tracking-wider flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-amber-600" />
                  LỜI DẶN DÒ CỦA BÁC SĨ ĐIỀU TRỊ
                </span>
                <div className="text-xs text-amber-950 whitespace-pre-line leading-relaxed font-medium">
                  {resultPackage.doctorAdvice}
                </div>
              </div>

              {/* SECTION: FINAL LAB RESULTS */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-clinic-blue" />
                    KẾT QUẢ XÉT NGHIỆM ĐÃ DUYỆT (LAB RESULTS)
                  </h2>
                  <Badge variant="success" className="text-[10px] font-bold">
                    ✓ ĐÃ KÝ DUYỆT (FINAL)
                  </Badge>
                </div>

                {resultPackage.labResults.map((panel, pIdx) => (
                  <div key={pIdx} className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                    <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex justify-between items-center">
                      <div>
                        <div className="font-bold text-xs text-slate-900">{panel.serviceName}</div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          {panel.department} • Duyệt bởi: {panel.verifiedBy} ({panel.verifiedAt})
                        </div>
                      </div>
                    </div>

                    <table className="w-full text-xs">
                      <thead className="bg-slate-50/50 border-b border-slate-200 text-slate-600 font-semibold">
                        <tr>
                          <th className="p-2.5 text-left">Tên chỉ số xét nghiệm</th>
                          <th className="p-2.5 text-center">Kết quả</th>
                          <th className="p-2.5 text-center">Đơn vị</th>
                          <th className="p-2.5 text-center">Khoảng tham chiếu</th>
                          <th className="p-2.5 text-right">Đánh giá</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {panel.items.map((item, idx) => (
                          <tr key={idx} className={item.isAbnormal ? "bg-amber-50/40" : "hover:bg-slate-50"}>
                            <td className="p-2.5 font-bold text-slate-800">{item.name}</td>
                            <td className="p-2.5 text-center font-mono font-black text-slate-900">
                              <span className={item.isAbnormal ? "text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded" : ""}>
                                {item.value}
                              </span>
                            </td>
                            <td className="p-2.5 text-center font-mono text-slate-600">{item.unit}</td>
                            <td className="p-2.5 text-center font-mono text-slate-500">{item.referenceRange}</td>
                            <td className="p-2.5 text-right">
                              {item.isAbnormal ? (
                                <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                                  Bất thường ↑
                                </span>
                              ) : (
                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                                  Bình thường
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>

              {/* SECTION: FINAL IMAGING & ECG REPORTS */}
              <div className="space-y-4 pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-clinic-blue" />
                    KẾT QUẢ CHẨN ĐOÁN HÌNH ẢNH & THĂM DÒ CHỨC NĂNG
                  </h2>
                  <Badge variant="success" className="text-[10px] font-bold">
                    ✓ ĐÃ KÝ DUYỆT (FINAL)
                  </Badge>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {resultPackage.imagingReports.map((report, idx) => (
                    <div key={idx} className="border border-slate-200 rounded-xl p-4 bg-white shadow-xs space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-100 pb-2">
                        <div className="font-bold text-xs text-slate-900">{report.serviceName}</div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          {report.roomLocation} • BS duyệt: {report.verifiedBy} ({report.verifiedAt})
                        </div>
                      </div>

                      <div className="text-xs text-slate-700 leading-relaxed">
                        <span className="font-bold text-slate-900 block mb-0.5">Mô tả hình ảnh:</span>
                        {report.findings}
                      </div>

                      <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200 text-xs">
                        <span className="font-bold text-emerald-900">Kết luận chuyên môn: </span>
                        <span className="font-black text-emerald-950">{report.conclusion}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION: ISSUED ELECTRONIC PRESCRIPTION */}
              {resultPackage.prescription && (
                <div className="space-y-4 pt-4 border-t border-slate-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
                      <Pill className="w-4 h-4 text-purple-700" />
                      ĐƠN THUỐC ĐIỆN TỬ ĐÃ CẤP (ELECTRONIC PRESCRIPTION)
                    </h2>
                    <span className="font-mono text-xs font-bold text-purple-900 bg-purple-100 px-2 py-0.5 rounded">
                      {resultPackage.prescription.prescriptionCode}
                    </span>
                  </div>

                  <div className="border border-purple-200 bg-purple-50/40 rounded-xl p-4 space-y-3">
                    <div className="divide-y divide-purple-100">
                      {resultPackage.prescription.items.map((med, mIdx) => (
                        <div key={mIdx} className="py-2.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                          <div>
                            <div className="font-black text-xs text-slate-900">
                              {mIdx + 1}. {med.medicationName}
                            </div>
                            <div className="text-xs text-purple-900 font-medium mt-0.5">
                              Cách dùng: {med.frequency}
                            </div>
                            <div className="text-[11px] text-slate-500 italic mt-0.5">
                              {med.instructions}
                            </div>
                          </div>
                          <div className="text-left sm:text-right font-mono text-xs font-bold text-slate-700 shrink-0">
                            {med.duration}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-purple-200 text-[11px] text-purple-900 italic">
                      Lưu ý: Quý khách mang đơn thuốc này đến Nhà thuốc bệnh viện hoặc bất kỳ hiệu thuốc GPP nào trên toàn quốc để mua đúng thuốc theo kê đơn.
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION: FOLLOW-UP APPOINTMENT */}
              {resultPackage.followUpAppointment && (
                <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-black uppercase text-blue-900 tracking-wider block">
                      LỊCH HẸN TÁI KHÁM THEO DÕI
                    </span>
                    <div className="font-bold text-xs text-slate-900">
                      {resultPackage.followUpAppointment.scheduledDate} — {resultPackage.followUpAppointment.scheduledTime}
                    </div>
                    <div className="text-[11px] text-blue-800">
                      Tại {resultPackage.followUpAppointment.roomCode} ({resultPackage.followUpAppointment.doctorName}) • {resultPackage.followUpAppointment.note}
                    </div>
                  </div>
                  <Badge variant="outline" className="font-mono text-xs font-bold text-clinic-blue border-blue-300 bg-white">
                    {resultPackage.followUpAppointment.appointmentCode}
                  </Badge>
                </div>
              )}
            </CardContent>

            <CardFooter className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
              <div>
                Hồ sơ y tế điện tử được số hóa & bảo mật theo Nghị định 13/2023/NĐ-CP.
              </div>
              <div className="font-mono text-[11px]">
                Thời gian xuất dữ liệu: {resultPackage.generatedAt}
              </div>
            </CardFooter>
          </Card>
        </main>
      )}
    </div>
  );
}
