"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Sheet, SheetHeader, SheetTitle, SheetContent, SheetFooter } from "@/shared/ui/sheet";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { useUIStore } from "@/shared/stores/ui.store";
import { MOCK_PATIENTS } from "@/shared/constants/mock-data";
import { PatientAvatar } from "@/entities/patient/ui/patient-avatar";
import { AlertCircle, ArrowRight, ExternalLink, Calendar, Activity, Pill, ShieldAlert, X } from "lucide-react";

export function PatientQuickViewDrawer() {
  const router = useRouter();
  const { drawerPatientId, closePatientDrawer } = useUIStore();
  const isOpen = !!drawerPatientId;

  const patient = React.useMemo(() => {
    if (!drawerPatientId) return null;
    return MOCK_PATIENTS.find((p) => p.id === drawerPatientId || p.patientCode === drawerPatientId) || MOCK_PATIENTS[0];
  }, [drawerPatientId]);

  if (!patient) return null;

  const handleStartEncounter = () => {
    closePatientDrawer();
    router.push(`/reception?patient=${patient.patientCode}`);
  };

  const handleOpenFullProfile = () => {
    closePatientDrawer();
    router.push(`/patients/${patient.id}`);
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closePatientDrawer()} widthClass="w-full max-w-[540px]">
      {/* Header */}
      <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <PatientAvatar name={patient.fullName} gender={patient.gender} size="lg" />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black uppercase tracking-tight">{patient.fullName}</h2>
              <span className="text-xs px-2 py-0.5 rounded bg-blue-600/60 font-mono font-bold">{patient.patientCode}</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {patient.age} tuổi • {patient.gender === "MALE" ? "Nam" : "Nữ"} • CCCD: {patient.identityCard}
            </p>
          </div>
        </div>
        <button
          onClick={closePatientDrawer}
          className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          title="Đóng cửa sổ"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Body Content */}
      <SheetContent className="p-5 space-y-5 bg-slate-50/50">
        {/* Contact info bar */}
        <div className="p-3 bg-white border border-slate-200 rounded-xl text-xs space-y-1 shadow-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">Số điện thoại:</span>
            <span className="font-bold text-slate-800 font-mono">{patient.phone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Địa chỉ:</span>
            <span className="font-semibold text-slate-800">{patient.address}</span>
          </div>
        </div>

        {/* 1. CRITICAL SAFETY ALERT */}
        <div className="p-4 bg-red-50 border-2 border-red-300 rounded-xl shadow-sm">
          <div className="flex items-center gap-2 text-red-700 font-black text-xs uppercase tracking-wider mb-2">
            <ShieldAlert className="w-4 h-4 text-red-600" />
            CẢNH BÁO AN TOÀN NGƯỜI BỆNH (PATIENT SAFETY)
          </div>
          {patient.allergies.length > 0 ? (
            <div className="space-y-1.5 text-xs text-red-900">
              {patient.allergies.map((a, i) => (
                <div key={i} className="p-2 bg-white/80 rounded-lg border border-red-200 font-medium">
                  <span className="font-bold text-red-700">DỊ ỨNG THUỐC: {a.substance.toUpperCase()} ({a.severity})</span>
                  <div className="text-[11px] text-red-800 mt-0.5">{a.note}</div>
                </div>
              ))}
            </div>
          ) : (
            <span className="text-xs text-emerald-700 font-semibold">Chưa ghi nhận tiền sử dị ứng thuốc</span>
          )}
        </div>

        {/* 2. CHRONIC CONDITIONS & MEDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-sm">
            <div className="flex items-center gap-1.5 text-slate-600 font-bold text-xs uppercase tracking-wider mb-2">
              <Activity className="w-3.5 h-3.5 text-clinic-blue" />
              Bệnh nền mãn tính
            </div>
            <ul className="space-y-1 text-xs text-slate-700">
              {patient.chronicConditions.map((c, i) => (
                <li key={i} className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                  {c}
                </li>
              ))}
            </ul>
          </div>

          <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-sm">
            <div className="flex items-center gap-1.5 text-slate-600 font-bold text-xs uppercase tracking-wider mb-2">
              <Pill className="w-3.5 h-3.5 text-purple-600" />
              Thuốc thường xuyên
            </div>
            <ul className="space-y-1 text-xs text-slate-700">
              {patient.regularMedications.map((m, i) => (
                <li key={i} className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
                  {m}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 3. LATEST VITALS */}
        {patient.latestVitals && (
          <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5 text-slate-700 font-bold text-xs uppercase tracking-wider">
                <Activity className="w-3.5 h-3.5 text-emerald-600" />
                Sinh hiệu đo gần nhất ({patient.latestVitals.recordedAt})
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-500 font-bold uppercase">Huyết áp</span>
                <div className="font-bold text-xs text-red-600 mt-0.5">{patient.latestVitals.bloodPressure}</div>
              </div>
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-500 font-bold uppercase">Nhịp tim</span>
                <div className="font-bold text-xs text-slate-800 mt-0.5">{patient.latestVitals.heartRate} ck/p</div>
              </div>
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-500 font-bold uppercase">Glucose</span>
                <div className="font-bold text-xs text-slate-800 mt-0.5">{patient.latestVitals.glucose} mmol/L</div>
              </div>
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-500 font-bold uppercase">BMI</span>
                <div className="font-bold text-xs text-slate-800 mt-0.5">{patient.latestVitals.bmi}</div>
              </div>
            </div>
          </div>
        )}

        {/* 4. RECENT ENCOUNTERS TIMELINE */}
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-slate-700 font-bold text-xs uppercase tracking-wider">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              Bệnh & Lịch sử các lần khám trước
            </div>
            <span className="text-[10px] text-slate-500 font-semibold">
              {patient.recentEncounters.length} đợt khám
            </span>
          </div>
          <div className="space-y-2.5">
            {patient.recentEncounters.map((enc, i) => (
              <div key={i} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-clinic-blue">{enc.date} • {enc.department}</span>
                  <span className="text-[11px] text-slate-600 font-medium">{enc.doctor}</span>
                </div>
                <div className="text-slate-900 font-bold flex items-start gap-1.5 bg-blue-50/50 p-1.5 rounded border border-blue-100">
                  <span className="text-[10px] uppercase font-black text-blue-700 bg-blue-100 px-1.5 py-0.2 rounded shrink-0">Chẩn đoán:</span>
                  <span>{enc.diagnosis}</span>
                </div>
                <div className="text-[11px] text-slate-600 bg-white p-1.5 rounded border border-slate-200/60">
                  <span className="font-bold text-slate-700">KQ CLS: </span>{enc.keyResults}
                </div>
                <div className="text-[11px] text-slate-600">
                  <span className="font-bold text-slate-700">Đơn thuốc: </span>{enc.prescription}
                </div>
              </div>
            ))}
          </div>
        </div>
      </SheetContent>

      {/* Footer Navigation Buttons */}
      <SheetFooter className="p-4 bg-white border-t border-slate-200 flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={closePatientDrawer}>
          Đóng
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleOpenFullProfile}>
            <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
            Mở hồ sơ đầy đủ
          </Button>
          <Button size="sm" onClick={handleStartEncounter} className="font-bold">
            + Tiếp nhận khám ngay
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Button>
        </div>
      </SheetFooter>
    </Sheet>
  );
}
