"use client";

import * as React from "react";
import { MockPatient } from "@/shared/constants/mock-data";
import { PatientAvatar } from "./patient-avatar";
import { Phone, MapPin, CreditCard, Calendar, User } from "lucide-react";

interface PatientSummaryProps {
  patient: MockPatient;
  className?: string;
  compact?: boolean;
}

export function PatientSummary({ patient, className = "", compact = false }: PatientSummaryProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center gap-3">
        <PatientAvatar name={patient.fullName} gender={patient.gender} size={compact ? "md" : "lg"} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-black text-sm md:text-base text-slate-900 uppercase truncate">
              {patient.fullName}
            </h3>
            <span className="font-mono text-xs font-bold text-clinic-blue bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              {patient.patientCode}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {patient.gender === "MALE" ? "Nam" : patient.gender === "FEMALE" ? "Nữ" : "Khác"} • {patient.age} tuổi ({patient.dateOfBirth})
          </p>
        </div>
      </div>

      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1.5 text-slate-700">
        <div className="flex items-center justify-between">
          <span className="text-slate-500 flex items-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5 text-slate-400" />
            CCCD / Định danh:
          </span>
          <span className="font-mono font-bold text-slate-800">{patient.identityCard}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-500 flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-slate-400" />
            Số điện thoại:
          </span>
          <span className="font-mono font-bold text-slate-800">{patient.phone}</span>
        </div>
        <div className="flex items-start justify-between gap-2">
          <span className="text-slate-500 flex items-center gap-1.5 shrink-0">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            Địa chỉ:
          </span>
          <span className="font-medium text-slate-800 text-right">{patient.address}</span>
        </div>
      </div>
    </div>
  );
}
