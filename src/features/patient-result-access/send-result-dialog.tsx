"use client";

import * as React from "react";
import { PatientResultService } from "@/entities/patient-result/services/patient-result.service";
import { PatientResultAccessLink } from "@/entities/patient-result/model/patient-result.types";
import { maskPhoneNumber } from "@/entities/patient-result/lib/security";
import { useRoleStore } from "@/shared/stores/role.store";
import { hasPermission } from "@/shared/constants/roles";
import { useUIStore } from "@/shared/stores/ui.store";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Input } from "@/shared/ui/input";
import {
  Send,
  Link as LinkIcon,
  ShieldCheck,
  RotateCcw,
  Ban,
  KeyRound,
  Copy,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Smartphone,
  Mail,
  Clock,
  MessageSquare,
  Lock,
} from "lucide-react";

interface SendResultDialogProps {
  isOpen: boolean;
  onClose: () => void;
  encounterCode?: string;
  patientName?: string;
  defaultPhone?: string;
  defaultEmail?: string;
}

export function SendResultDialog({
  isOpen,
  onClose,
  encounterCode = "ENC-260919-041",
  patientName = "Nguyễn Văn An",
  defaultPhone = "0912345678",
  defaultEmail = "nguyenvanan.hn@gmail.com",
}: SendResultDialogProps) {
  const { currentRole } = useRoleStore();
  const { showToast } = useUIStore();

  const [channel, setChannel] = React.useState<"SMS" | "ZALO" | "EMAIL">("ZALO");
  const [recipient, setRecipient] = React.useState(defaultPhone);
  const [isProcessing, setIsProcessing] = React.useState(false);

  // Issued link state
  const [issuedLink, setIssuedLink] = React.useState<PatientResultAccessLink | null>(null);
  const [oneTimePin, setOneTimePin] = React.useState<string | null>(null);
  const [accessUrl, setAccessUrl] = React.useState<string | null>(null);

  const canIssue = hasPermission(currentRole, "patient_result_link.issue");
  const canResend = hasPermission(currentRole, "patient_result_link.resend");
  const canRevoke = hasPermission(currentRole, "patient_result_link.revoke");

  // Check for any existing active link on open
  React.useEffect(() => {
    if (isOpen) {
      const existing = PatientResultService.getLinkForEncounter(encounterCode);
      if (existing) {
        setIssuedLink(existing);
        const url = typeof window !== "undefined"
          ? `${window.location.origin}/r/${existing.token}`
          : `/r/${existing.token}`;
        setAccessUrl(url);
      }
    }
  }, [isOpen, encounterCode]);

  if (!isOpen) return null;

  const handleGenerateAndSend = async () => {
    if (!recipient.trim()) {
      showToast("Vui lòng nhập số điện thoại hoặc email người nhận.");
      return;
    }

    setIsProcessing(true);
    try {
      const res = await PatientResultService.issueAccessLink(encounterCode, {
        recipientPhone: recipient,
        recipientEmail: channel === "EMAIL" ? recipient : defaultEmail,
        channel,
      });

      setIssuedLink(res.accessLink);
      setOneTimePin(res.plainPin);
      setAccessUrl(res.accessUrl);

      showToast(`Đã tạo liên kết bảo mật và gửi thông báo qua ${channel} tới ${recipient}!`);
    } catch {
      showToast("Có lỗi xảy ra khi tạo liên kết.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResend = async () => {
    if (!issuedLink) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      showToast(`Đã gửi lại tin nhắn thông báo link kết quả qua ${channel} tới ${recipient}!`);
    }, 400);
  };

  const handleRevoke = () => {
    if (!issuedLink) return;
    if (!confirm("Bạn có chắc chắn muốn THU HỒI liên kết này? Người bệnh sẽ không thể truy cập lại.")) {
      return;
    }

    const ok = PatientResultService.revokeLink(issuedLink.token);
    if (ok) {
      setIssuedLink({ ...issuedLink, status: "REVOKED" });
      setOneTimePin(null);
      showToast("Đã thu hồi quyền truy cập của liên kết kết quả.");
    }
  };

  const handleResetPin = async () => {
    if (!issuedLink) return;
    setIsProcessing(true);
    try {
      const res = await PatientResultService.resetPassword(issuedLink.token);
      if (res.success && res.newPin) {
        setOneTimePin(res.newPin);
        setIssuedLink({ ...issuedLink, status: "ACTIVE", failedAttempts: 0 });
        showToast(`Đã đổi mã PIN mới thành công! Mã mới: ${res.newPin}`);
      }
    } catch {
      showToast("Không thể đổi mã PIN.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`Đã sao chép ${label} vào bộ nhớ tạm!`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-950 text-white p-5 flex justify-between items-start">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-blue-300 bg-blue-900/60 px-2 py-0.5 rounded border border-blue-700">
              TRẢ KẾT QUẢ BẢO MẬT (ZERO-ACCOUNT)
            </span>
            <h2 className="text-base font-black text-white">Gửi Kết Quả Cho Người Bệnh</h2>
            <div className="text-xs text-slate-300">
              Bệnh nhân: <b className="text-white uppercase">{patientName}</b> ({encounterCode})
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 text-xs">
          {/* Channel selector */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 block">Kênh gửi thông báo:</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setChannel("ZALO");
                  setRecipient(defaultPhone);
                }}
                className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 font-bold transition-all ${
                  channel === "ZALO"
                    ? "border-blue-600 bg-blue-50 text-blue-900 shadow-xs"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <MessageSquare className="w-4 h-4 text-blue-600" />
                <span>Zalo OA</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setChannel("SMS");
                  setRecipient(defaultPhone);
                }}
                className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 font-bold transition-all ${
                  channel === "SMS"
                    ? "border-emerald-600 bg-emerald-50 text-emerald-900 shadow-xs"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Smartphone className="w-4 h-4 text-emerald-600" />
                <span>Tin nhắn SMS</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setChannel("EMAIL");
                  setRecipient(defaultEmail);
                }}
                className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 font-bold transition-all ${
                  channel === "EMAIL"
                    ? "border-purple-600 bg-purple-50 text-purple-900 shadow-xs"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Mail className="w-4 h-4 text-purple-600" />
                <span>Email</span>
              </button>
            </div>
          </div>

          {/* Recipient Input */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700 block">
              {channel === "EMAIL" ? "Địa chỉ Email nhận kết quả:" : "Số điện thoại nhận tin nhắn:"}
            </label>
            <Input
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder={channel === "EMAIL" ? "name@example.com" : "0912345678"}
              className="font-mono text-xs font-bold"
            />
          </div>

          {/* ACTIVE LINK DETAILS BOX (IF GENERATED) */}
          {issuedLink && accessUrl && (
            <div className="p-4 bg-emerald-50/80 border border-emerald-300 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold text-emerald-950">Liên kết truy cập an toàn đã sẵn sàng</span>
                </div>
                <Badge
                  variant={issuedLink.status === "ACTIVE" ? "success" : "danger"}
                  className="font-mono text-[10px] font-bold"
                >
                  {issuedLink.status}
                </Badge>
              </div>

              {/* Secure Link */}
              <div className="space-y-1">
                <span className="text-[11px] text-slate-600 font-medium">Đường dẫn bảo mật (Chống lộ ID):</span>
                <div className="flex items-center gap-1.5">
                  <Input
                    readOnly
                    value={accessUrl}
                    className="font-mono text-[11px] bg-white text-slate-900"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopy(accessUrl, "Đường link")}
                    className="shrink-0 h-9"
                    title="Sao chép liên kết"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </Button>
                  <a href={accessUrl} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" variant="outline" className="shrink-0 h-9 text-clinic-blue">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Button>
                  </a>
                </div>
              </div>

              {/* One-Time PIN display */}
              {oneTimePin && (
                <div className="p-3 bg-white rounded-xl border border-emerald-300 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase text-emerald-800 tracking-wider block">
                      MÃ PIN BẢO VỆ (CUNG CẤP CHO BỆNH NHÂN)
                    </span>
                    <span className="font-mono text-xl font-black text-emerald-950 tracking-widest">
                      {oneTimePin}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopy(oneTimePin, "Mã PIN")}
                    className="font-bold text-xs border-emerald-400 text-emerald-900 hover:bg-emerald-50"
                  >
                    <Copy className="w-3.5 h-3.5 mr-1" />
                    Sao chép PIN
                  </Button>
                </div>
              )}

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-emerald-200">
                <span>Thời hạn hiệu lực: 30 ngày</span>
                <span>Số lần nhập sai: {issuedLink.failedAttempts} / 5</span>
              </div>
            </div>
          )}

          {/* Security Principle Note */}
          <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-[11px] text-blue-900 leading-relaxed">
            <b>Nguyên tắc bảo mật y tế Zero-Account: </b>
            Bệnh nhân không cần đăng ký tài khoản. Kết quả chỉ mở khi nhập đúng mã PIN. Toàn bộ mã PIN được lưu dưới dạng băm SHA-256 một chiều và không bao giờ lưu trữ dạng văn bản thô.
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
          {issuedLink ? (
            <div className="flex items-center gap-2 flex-wrap w-full justify-between">
              <div className="flex items-center gap-1.5">
                {canRevoke && issuedLink.status === "ACTIVE" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleRevoke}
                    className="font-bold text-xs text-red-700 hover:bg-red-50 border-red-300"
                  >
                    <Ban className="w-3.5 h-3.5 mr-1 text-red-600" />
                    Thu hồi link
                  </Button>
                )}

                {canIssue && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleResetPin}
                    className="font-bold text-xs text-amber-800 hover:bg-amber-50 border-amber-300"
                  >
                    <RotateCcw className="w-3.5 h-3.5 mr-1 text-amber-600" />
                    Đổi PIN mới
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-2">
                {canResend && (
                  <Button
                    size="sm"
                    onClick={handleResend}
                    disabled={isProcessing || issuedLink.status === "REVOKED"}
                    className="font-bold text-xs bg-clinic-blue hover:bg-blue-700 text-white"
                  >
                    <Send className="w-3.5 h-3.5 mr-1.5" />
                    Gửi lại tin nhắn
                  </Button>
                )}
                <Button size="sm" variant="ghost" onClick={onClose} className="font-bold text-xs">
                  Đóng
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex justify-end gap-2 w-full">
              <Button size="sm" variant="ghost" onClick={onClose} className="font-bold text-xs">
                Để sau
              </Button>
              <Button
                size="sm"
                onClick={handleGenerateAndSend}
                disabled={isProcessing || !canIssue}
                className="font-bold text-xs bg-clinic-blue hover:bg-blue-700 text-white shadow-md"
              >
                <Send className="w-4 h-4 mr-1.5" />
                {isProcessing ? "Đang xử lý..." : "Tạo Link & Gửi Kết Quả Cho Người Bệnh →"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
