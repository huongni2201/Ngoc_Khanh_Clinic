"use client";

import * as React from "react";
import { PreviousPrescriptionItem } from "@/shared/constants/mock-data";
import { Pill, FileText, Calendar } from "lucide-react";

interface PatientPrescriptionHistoryProps {
  prescriptions: PreviousPrescriptionItem[];
  className?: string;
}

export function PatientPrescriptionHistory({ prescriptions, className = "" }: PatientPrescriptionHistoryProps) {
  if (!prescriptions || prescriptions.length === 0) {
    return (
      <div className={`p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 italic ${className}`}>
        Chưa có đơn thuốc cũ được ghi nhận.
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-slate-800 font-bold text-xs uppercase tracking-wider">
          <Pill className="w-3.5 h-3.5 text-emerald-600" />
          Đơn thuốc các lần khám trước ({prescriptions.length})
        </div>
      </div>

      <div className="space-y-3">
        {prescriptions.map((rx) => (
          <div key={rx.id} className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-2 text-xs">
            <div className="flex items-center justify-between flex-wrap gap-1">
              <div className="flex items-center gap-1.5">
                <span className="font-mono font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200 text-[11px]">
                  {rx.rxCode}
                </span>
                <span className="text-slate-500">• {rx.date}</span>
              </div>
              <span className="text-slate-600 font-medium">Bác sĩ: <b>{rx.doctor}</b></span>
            </div>

            <div className="font-bold text-slate-900 bg-slate-50 p-2 rounded-lg">
              Chẩn đoán: {rx.diagnosis}
            </div>

            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wide block">
                Thuốc điều trị:
              </span>
              {rx.medications.map((m, mIdx) => (
                <div key={mIdx} className="p-2 bg-slate-50/80 rounded-lg flex items-center justify-between gap-2 border border-slate-100">
                  <div>
                    <span className="font-bold text-slate-900">{m.name}</span>
                    <span className="text-[11px] text-slate-500 block">{m.usage}</span>
                  </div>
                  <span className="font-mono font-bold text-clinic-blue text-[11px] shrink-0">
                    {m.quantity}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
