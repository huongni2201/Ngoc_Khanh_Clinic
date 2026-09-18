import * as React from "react";
import { formatCurrencyVND } from "@/shared/lib/formatters";
import { QrCode, CheckCircle2, Copy } from "lucide-react";
import { Button } from "@/shared/ui/button";

interface VietQRCardProps {
  bankName: string;
  accountNumber: string;
  accountName: string;
  amount: number;
  transferContent: string;
  qrImageUrl?: string;
  className?: string;
  onCopySuccess?: () => void;
}

export function VietQRCard({
  bankName,
  accountNumber,
  accountName,
  amount,
  transferContent,
  className,
  onCopySuccess,
}: VietQRCardProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(transferContent);
    setCopied(true);
    onCopySuccess?.();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col md:flex-row items-center gap-5 ${className || ""}`}>
      {/* Visual QR Code Representation */}
      <div className="flex flex-col items-center justify-center p-3 bg-white border border-slate-200 rounded-xl shadow-sm">
        <div className="w-32 h-32 bg-slate-900 rounded-lg p-2 flex flex-col items-center justify-center text-white text-center">
          <QrCode className="w-16 h-16 text-white mb-1" />
          <span className="text-[10px] font-mono tracking-wider font-bold">VIETQR NAPAS247</span>
          <span className="text-[8px] opacity-75">{amount > 0 ? formatCurrencyVND(amount) : "DYNAMIC QR"}</span>
        </div>
        <span className="text-[10px] text-slate-500 font-bold mt-2">Quét app mọi ngân hàng</span>
      </div>

      {/* Payment Details */}
      <div className="flex-1 space-y-2 text-xs w-full">
        <div>
          <span className="text-slate-500 font-medium">Ngân hàng thụ hưởng:</span>
          <div className="font-bold text-slate-800">{bankName}</div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="text-slate-500 font-medium">Số tài khoản:</span>
            <div className="font-mono font-bold text-slate-900 text-sm">{accountNumber}</div>
          </div>
          <div>
            <span className="text-slate-500 font-medium">Số tiền nộp:</span>
            <div className="font-bold text-clinic-blue text-sm">{formatCurrencyVND(amount)}</div>
          </div>
        </div>
        <div>
          <span className="text-slate-500 font-medium">Chủ tài khoản:</span>
          <div className="font-bold text-slate-800">{accountName}</div>
        </div>
        <div>
          <span className="text-slate-500 font-medium">Nội dung chuyển khoản (bắt buộc):</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="px-2 py-1 bg-amber-100 border border-amber-300 font-mono font-bold text-amber-900 rounded text-xs">
              {transferContent}
            </span>
            <Button size="sm" variant="outline" className="h-7 text-xs" onClick={handleCopy}>
              {copied ? <CheckCircle2 className="w-3 h-3 text-emerald-600 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
              {copied ? "Đã chép" : "Sao chép"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
