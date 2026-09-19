"use client";

import * as React from "react";
import { ShieldAlert, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Badge } from "@/shared/ui/badge";

interface PatientAllergyListProps {
  allergies: Array<{ substance: string; severity: "LOW" | "MODERATE" | "SEVERE"; note: string }>;
  className?: string;
}

export function PatientAllergyList({ allergies, className = "" }: PatientAllergyListProps) {
  if (!allergies || allergies.length === 0) {
    return (
      <div className={`p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs flex items-center gap-2 text-emerald-800 ${className}`}>
        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
        <span className="font-medium">Chưa ghi nhận tiền sử dị ứng thuốc</span>
      </div>
    );
  }

  const hasSevere = allergies.some((a) => a.severity === "SEVERE");

  return (
    <div className={`p-3.5 bg-red-50 border-2 border-red-300 rounded-xl space-y-2.5 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-black text-red-700 text-xs uppercase tracking-wide">
          <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
          CẢNH BÁO DỊ ỨNG NGUY HIỂM ({allergies.length} DỊ NGUYÊN)
        </div>
        {hasSevere && (
          <Badge variant="danger" className="text-[10px] font-black uppercase">
            CHỐNG CHỈ ĐỊNH TUYỆT ĐỐI
          </Badge>
        )}
      </div>

      <div className="space-y-2">
        {allergies.map((item, idx) => (
          <div key={idx} className="p-2.5 bg-white/90 border border-red-200 rounded-lg text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-black text-red-900 uppercase text-xs">
                {item.substance}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                item.severity === "SEVERE"
                  ? "bg-red-100 text-red-800 border border-red-300 font-black"
                  : "bg-amber-100 text-amber-800"
              }`}>
                {item.severity === "SEVERE" ? "NGUY CƠ CAO (PHẢN VỆ)" : item.severity}
              </span>
            </div>
            <p className="text-[11px] text-red-800 leading-snug">
              {item.note}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
