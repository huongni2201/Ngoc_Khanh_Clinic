import * as React from "react";
import { PatientAvatar } from "@/entities/patient/ui/patient-avatar";
import { Badge } from "@/shared/ui/badge";
import { ShieldAlert, Activity, AlertTriangle, Stethoscope } from "lucide-react";

interface PatientHeaderProps {
  patientName: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  age: number;
  dob: string;
  patientCode: string;
  encounterCode: string;
  queueNumber?: string;
  department?: string;
  roomCode?: string;
  allergies?: Array<{ substance: string; severity: string; note: string }>;
  chronicConditions?: string[];
  bloodPressure?: string;
}

export function PatientHeader({
  patientName,
  gender,
  age,
  dob,
  patientCode,
  encounterCode,
  department = "Nội tổng quát",
  roomCode = "P.203",
  allergies = [{ substance: "Penicillin", severity: "SEVERE", note: "Phản vệ độ 2 năm 2021 — Cấm dùng Beta-lactam" }],
  chronicConditions = ["Tăng huyết áp nguyên phát (I10)", "Rối loạn lipid máu (E78.2)"],
  bloodPressure = "148/92 mmHg",
}: PatientHeaderProps) {
  return (
    <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-lg border border-slate-800 space-y-3 mb-6">
      {/* Top row: demographics and identifiers */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <PatientAvatar name={patientName} gender={gender} size="lg" />
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-lg md:text-xl font-black uppercase tracking-tight text-white">{patientName}</h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-600/80 font-mono font-bold text-white">
                {patientCode}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono font-bold border border-slate-700">
                {encounterCode}
              </span>
            </div>
            <div className="text-xs text-slate-400 mt-1 flex items-center gap-3 flex-wrap">
              <span>{gender === "MALE" ? "Nam" : "Nữ"}</span>
              <span>•</span>
              <span>{dob} ({age} tuổi)</span>
              <span>•</span>
              <span>Phòng: <b className="text-blue-400">{roomCode} — {department}</b></span>
            </div>
          </div>
        </div>

        {/* Vital sign quick pill */}
        <div className="flex items-center gap-2 self-start md:self-auto bg-slate-800/90 px-3 py-1.5 rounded-xl border border-slate-700">
          <Activity className="w-4 h-4 text-red-400" />
          <div className="text-xs">
            <span className="text-slate-400">Huyết áp tại chỗ: </span>
            <b className="text-red-400 font-bold">{bloodPressure}</b>
          </div>
        </div>
      </div>

      {/* Safety Alert Row */}
      <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 text-red-300 bg-red-950/60 px-3 py-1.5 rounded-lg border border-red-800/70">
          <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
          <span className="font-medium">
            <b className="text-red-400 uppercase font-black">CẢNH BÁO NGUY HIỂM: </b>
            Dị ứng <b className="text-white underline">Penicillin</b> (Phản vệ độ 2) — Tuyệt đối không chỉ định hoặc kê đơn nhóm Beta-lactam!
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-slate-400 shrink-0">
          <span className="font-bold text-slate-300">Bệnh nền: </span>
          {chronicConditions.join(" • ")}
        </div>
      </div>
    </div>
  );
}
