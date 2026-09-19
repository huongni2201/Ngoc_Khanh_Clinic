"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Sheet, SheetContent, SheetFooter } from "@/shared/ui/sheet";
import { Button } from "@/shared/ui/button";
import { useUIStore } from "@/shared/stores/ui.store";
import { MOCK_PATIENTS } from "@/shared/constants/mock-data";
import { PatientAvatar } from "@/entities/patient/ui/patient-avatar";
import { PatientAllergyList } from "@/entities/patient/ui/patient-allergy-list";
import { PatientConditionList } from "@/entities/patient/ui/patient-condition-list";
import { PatientMedicationList } from "@/entities/patient/ui/patient-medication-list";
import { PatientVitalsCard } from "@/entities/patient/ui/patient-vitals-card";
import { PatientHistoryTimeline } from "@/entities/patient/ui/patient-history-timeline";
import { ArrowRight, ExternalLink, X, Phone, MapPin } from "lucide-react";

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

      {/* Body Content composed of reusable entity components */}
      <SheetContent className="p-5 space-y-5 bg-slate-50/50 overflow-y-auto">
        {/* Contact info bar */}
        <div className="p-3 bg-white border border-slate-200 rounded-xl text-xs space-y-1.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              Số điện thoại:
            </span>
            <span className="font-bold text-slate-800 font-mono">{patient.phone}</span>
          </div>
          <div className="flex items-start justify-between gap-2">
            <span className="text-slate-500 flex items-center gap-1.5 shrink-0">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              Địa chỉ:
            </span>
            <span className="font-semibold text-slate-800 text-right">{patient.address}</span>
          </div>
        </div>

        {/* 1. CRITICAL ALLERGIES */}
        <PatientAllergyList allergies={patient.allergies} />

        {/* 2. CHRONIC CONDITIONS & MEDICATIONS */}
        <div className="grid grid-cols-1 gap-3">
          <PatientConditionList conditions={patient.chronicConditions} />
          <PatientMedicationList medications={patient.regularMedications} />
        </div>

        {/* 3. LATEST VITALS */}
        {patient.latestVitals && (
          <PatientVitalsCard vitals={patient.latestVitals} />
        )}

        {/* 4. RECENT ENCOUNTERS */}
        <PatientHistoryTimeline encounters={patient.recentEncounters} />
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
