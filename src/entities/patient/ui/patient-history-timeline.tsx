"use client";

import * as React from "react";
import { Calendar, Stethoscope, FlaskConical, Pill } from "lucide-react";

interface PatientHistoryTimelineProps {
  encounters: Array<{
    id?: string;
    date: string;
    department: string;
    doctor: string;
    diagnosis: string;
    keyResults: string;
    prescription: string;
  }>;
  className?: string;
}

export function PatientHistoryTimeline({ encounters, className = "" }: PatientHistoryTimelineProps) {
  if (!encounters || encounters.length === 0) {
    return (
      <div className={`p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 italic ${className}`}>
        Chưa có lịch sử các đợt khám trước đó.
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-slate-800 font-bold text-xs uppercase tracking-wider">
          <Calendar className="w-3.5 h-3.5 text-clinic-blue" />
          Lịch sử các đợt khám trước ({encounters.length})
        </div>
      </div>

      <div className="space-y-3">
        {encounters.map((enc, idx) => (
          <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-clinic-blue">{enc.date} • {enc.department}</span>
              <span className="text-[11px] text-slate-600 font-medium">{enc.doctor}</span>
            </div>

            <div className="p-2 bg-blue-50/70 border border-blue-100 rounded-lg text-slate-900 font-semibold flex items-start gap-1.5">
              <span className="text-[10px] font-black uppercase text-blue-700 bg-blue-100 px-1 rounded shrink-0">
                Chẩn đoán:
              </span>
              <span>{enc.diagnosis}</span>
            </div>

            {enc.keyResults && (
              <div className="text-[11px] text-slate-700 flex items-start gap-1">
                <FlaskConical className="w-3 h-3 text-purple-600 shrink-0 mt-0.5" />
                <span><b>Kết quả CLS: </b>{enc.keyResults}</span>
              </div>
            )}

            {enc.prescription && (
              <div className="text-[11px] text-slate-700 flex items-start gap-1">
                <Pill className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                <span><b>Đơn thuốc: </b>{enc.prescription}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
