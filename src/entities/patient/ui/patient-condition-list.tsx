"use client";

import * as React from "react";
import { Activity } from "lucide-react";

interface PatientConditionListProps {
  conditions: string[];
  className?: string;
}

export function PatientConditionList({ conditions, className = "" }: PatientConditionListProps) {
  if (!conditions || conditions.length === 0) {
    return (
      <div className={`p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 italic ${className}`}>
        Chưa ghi nhận bệnh nền mãn tính
      </div>
    );
  }

  return (
    <div className={`p-3.5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-2 ${className}`}>
      <div className="flex items-center gap-1.5 text-slate-700 font-bold text-xs uppercase tracking-wider">
        <Activity className="w-3.5 h-3.5 text-clinic-blue" />
        Bệnh nền mãn tính ({conditions.length})
      </div>
      <ul className="space-y-1.5 text-xs text-slate-800">
        {conditions.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
            <span className="font-semibold">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
