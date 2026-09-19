"use client";

import * as React from "react";
import { Pill } from "lucide-react";

interface PatientMedicationListProps {
  medications: string[];
  className?: string;
}

export function PatientMedicationList({ medications, className = "" }: PatientMedicationListProps) {
  if (!medications || medications.length === 0) {
    return (
      <div className={`p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 italic ${className}`}>
        Không có thuốc đang sử dụng thường xuyên
      </div>
    );
  }

  return (
    <div className={`p-3.5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-2 ${className}`}>
      <div className="flex items-center gap-1.5 text-slate-700 font-bold text-xs uppercase tracking-wider">
        <Pill className="w-3.5 h-3.5 text-purple-600" />
        Thuốc đang sử dụng thường quy ({medications.length})
      </div>
      <ul className="space-y-1.5 text-xs text-slate-800">
        {medications.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2 bg-purple-50/60 p-2 rounded-lg border border-purple-100">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-600 shrink-0 mt-1.5" />
            <span className="font-semibold text-purple-950">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
