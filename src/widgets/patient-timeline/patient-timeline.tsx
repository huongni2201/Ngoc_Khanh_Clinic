import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Calendar, Stethoscope, Pill, FlaskConical, Activity, CheckCircle2 } from "lucide-react";

interface PatientTimelineProps {
  className?: string;
}

export function PatientTimeline({ className }: PatientTimelineProps) {
  const history = [
    {
      date: "17/09/2026 (Hôm nay)",
      time: "08:15",
      department: "Khoa Nội Tổng Quát (P.203)",
      doctor: "BS. Lê Minh",
      status: "Đang khám",
      isCurrent: true,
      diagnosis: "R42 — Chóng mặt và choáng váng / TD Cơn tăng huyết áp (I10)",
      orders: ["Tổng phân tích máu CTM", "Glucose máu", "ECG 12 chuyển đạo"],
      resultsSummary: "WBC 12.8 G/L (↑ Cao), Glucose 5.8 mmol/L, ECG dày thất trái nhẹ",
    },
    {
      date: "04/09/2026",
      time: "09:30",
      department: "Khoa Tim Mạch",
      doctor: "BS. Hoàng Ngọc",
      status: "Đã hoàn tất",
      isCurrent: false,
      diagnosis: "I10 — Tăng huyết áp nguyên phát giai đoạn 2",
      orders: ["ECG thông thường", "Cholesterol toàn phần", "Triglyceride"],
      prescription: "Amlodipine 5mg (30 viên), Micardis 40mg (30 viên)",
      resultsSummary: "Cholesterol 6.2 mmol/L (↑), Triglyceride 2.4 mmol/L",
    },
    {
      date: "02/06/2026",
      time: "08:00",
      department: "Khám Sức Khỏe Tổng Quát",
      doctor: "BS. Lê Minh",
      status: "Đã hoàn tất",
      isCurrent: false,
      diagnosis: "Z00.0 — Khám sức khỏe định kỳ doanh nghiệp",
      orders: ["CTM 18 chỉ số", "Sinh hóa gan thận", "X-quang ngực thẳng"],
      prescription: "Vitamin 3B (60 viên)",
      resultsSummary: "X-quang tim phổi bình thường, Men gan AST/ALT trong giới hạn",
    },
  ];

  return (
    <Card className={`border-slate-200 shadow-sm ${className || ""}`}>
      <CardHeader className="bg-slate-50/70 p-4 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-clinic-blue" />
            <CardTitle className="text-sm font-bold text-slate-800">
              Dòng thời gian lịch sử khám (Patient Timeline)
            </CardTitle>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">3 đợt khám gần nhất</span>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        {history.map((item, idx) => (
          <div key={idx} className="relative pl-6 pb-4 border-l-2 border-slate-200 last:border-l-0 last:pb-0">
            {/* Dot icon */}
            <div
              className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                item.isCurrent
                  ? "bg-clinic-blue border-white ring-2 ring-blue-400"
                  : "bg-slate-100 border-slate-400"
              }`}
            >
              {item.isCurrent && <div className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />}
            </div>

            {/* Content card */}
            <div className={`p-3 rounded-xl border text-xs space-y-2 ${item.isCurrent ? "bg-blue-50/50 border-blue-200" : "bg-white border-slate-200"}`}>
              <div className="flex items-center justify-between">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <span>{item.date}</span>
                  <span className="text-slate-600 font-normal">({item.time})</span>
                </div>
                <Badge variant={item.isCurrent ? "default" : "secondary"} className="text-[10px] py-0 font-bold">
                  {item.status}
                </Badge>
              </div>

              <div className="text-slate-600 font-medium">
                Khoa khám: <b className="text-slate-800">{item.department}</b> • {item.doctor}
              </div>

              <div className="p-2 bg-white/80 rounded-lg border border-slate-200/80 space-y-1">
                <div className="font-bold text-slate-800 flex items-center gap-1">
                  <Stethoscope className="w-3.5 h-3.5 text-clinic-blue shrink-0" />
                  <span>Chẩn đoán: {item.diagnosis}</span>
                </div>
                {item.resultsSummary && (
                  <div className="text-[11px] text-slate-600 flex items-start gap-1">
                    <FlaskConical className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                    <span><b>Kết quả CLS: </b>{item.resultsSummary}</span>
                  </div>
                )}
                {item.prescription && (
                  <div className="text-[11px] text-slate-600 flex items-start gap-1">
                    <Pill className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span><b>Đơn thuốc: </b>{item.prescription}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
