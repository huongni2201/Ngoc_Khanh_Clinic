"use client";

import * as React from "react";
import { Activity, Heart, Thermometer, Droplets } from "lucide-react";

interface PatientVitalsCardProps {
  vitals: {
    bloodPressure: string;
    heartRate: number;
    glucose: number;
    cholesterol?: number;
    bmi: number;
    spo2: number;
    temperature?: number;
    recordedAt: string;
  };
  className?: string;
}

export function PatientVitalsCard({ vitals, className = "" }: PatientVitalsCardProps) {
  if (!vitals) return null;

  return (
    <div className={`p-4 bg-white border border-slate-200 rounded-xl shadow-xs space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-slate-800 font-bold text-xs uppercase tracking-wider">
          <Activity className="w-3.5 h-3.5 text-emerald-600" />
          Sinh hiệu gần nhất ({vitals.recordedAt})
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-500 font-bold uppercase block">Huyết áp</span>
          <div className="font-mono font-black text-sm text-red-600 mt-0.5">
            {vitals.bloodPressure}
          </div>
          <span className="text-[10px] text-red-500 block">Tăng độ 2</span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-500 font-bold uppercase block">Nhịp tim</span>
          <div className="font-mono font-bold text-sm text-slate-900 mt-0.5">
            {vitals.heartRate} ck/p
          </div>
          <span className="text-[10px] text-emerald-600 block">Đều</span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-500 font-bold uppercase block">SpO2 / Nhiệt độ</span>
          <div className="font-mono font-bold text-sm text-slate-900 mt-0.5">
            {vitals.spo2}% • {vitals.temperature || 36.8}°C
          </div>
          <span className="text-[10px] text-emerald-600 block">Ổn định</span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-500 font-bold uppercase block">BMI / Glucose</span>
          <div className="font-mono font-bold text-sm text-slate-900 mt-0.5">
            {vitals.bmi} • {vitals.glucose} mmol/L
          </div>
          <span className="text-[10px] text-slate-500 block">Bình thường</span>
        </div>
      </div>
    </div>
  );
}
