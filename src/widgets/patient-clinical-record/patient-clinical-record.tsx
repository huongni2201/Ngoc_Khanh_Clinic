"use client";

import * as React from "react";
import { MockPatient, MOCK_PATIENTS } from "@/shared/constants/mock-data";
import { useDemoClinicFlowStore } from "@/shared/stores/demo-clinic-flow.store";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { PatientSummary } from "@/entities/patient/ui/patient-summary";
import { PatientAllergyList } from "@/entities/patient/ui/patient-allergy-list";
import { PatientConditionList } from "@/entities/patient/ui/patient-condition-list";
import { PatientMedicationList } from "@/entities/patient/ui/patient-medication-list";
import { PatientVitalsCard } from "@/entities/patient/ui/patient-vitals-card";
import { PatientHistoryTimeline } from "@/entities/patient/ui/patient-history-timeline";
import { PatientResultHistory } from "@/entities/patient/ui/patient-result-history";
import { PatientPrescriptionHistory } from "@/entities/patient/ui/patient-prescription-history";
import { PatientDocumentsCard } from "@/entities/patient/ui/patient-documents-card";
import {
  FileText,
  User,
  ShieldAlert,
  Activity,
  History,
  FlaskConical,
  Pill,
  Paperclip,
  CheckCircle2,
  ChevronDown,
  Layers,
} from "lucide-react";

type RecordSection =
  | "OVERVIEW"
  | "ALLERGIES"
  | "CONDITIONS"
  | "VITALS"
  | "HISTORY"
  | "OLD_RESULTS"
  | "OLD_PRESCRIPTIONS"
  | "DOCUMENTS";

interface PatientClinicalRecordProps {
  patientId?: string;
  className?: string;
}

export function PatientClinicalRecord({ patientId, className = "" }: PatientClinicalRecordProps) {
  const { activePatientId } = useDemoClinicFlowStore();

  const targetId = patientId || activePatientId || "p1";
  const patient = React.useMemo(() => {
    return MOCK_PATIENTS.find((p) => p.id === targetId || p.patientCode === targetId) || MOCK_PATIENTS[0];
  }, [targetId]);

  const [activeTab, setActiveTab] = React.useState<"SUMMARY" | "RESULTS" | "PRESCRIPTIONS" | "DOCS">("SUMMARY");

  return (
    <Card className={`border-slate-200 shadow-sm bg-white overflow-hidden flex flex-col ${className}`}>
      {/* Header */}
      <CardHeader className="p-3.5 bg-slate-900 text-white border-b border-slate-800 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-400" />
          <div>
            <CardTitle className="text-xs font-black uppercase tracking-wider text-white">
              HỒ SƠ BỆNH NHÂN (PATIENT RECORD)
            </CardTitle>
            <span className="text-[10px] text-slate-400">
              Truy cập dữ liệu lâm sàng liên tục trong ca khám
            </span>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded bg-blue-600/60 font-mono text-[10px] font-bold text-white">
          {patient.patientCode}
        </span>
      </CardHeader>

      {/* Quick Navigation Tabs inside Record Panel */}
      <div className="flex items-center bg-slate-100 p-1 border-b border-slate-200 text-xs overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab("SUMMARY")}
          className={`flex-1 min-w-[90px] py-1.5 px-2 rounded-lg font-bold text-[11px] flex items-center justify-center gap-1 transition-all ${
            activeTab === "SUMMARY"
              ? "bg-white text-clinic-blue shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <User className="w-3 h-3" />
          <span>Tổng quan</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("RESULTS")}
          className={`flex-1 min-w-[90px] py-1.5 px-2 rounded-lg font-bold text-[11px] flex items-center justify-center gap-1 transition-all ${
            activeTab === "RESULTS"
              ? "bg-white text-clinic-blue shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <FlaskConical className="w-3 h-3" />
          <span>Kết quả cũ ({patient.previousResults?.length || 0})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("PRESCRIPTIONS")}
          className={`flex-1 min-w-[90px] py-1.5 px-2 rounded-lg font-bold text-[11px] flex items-center justify-center gap-1 transition-all ${
            activeTab === "PRESCRIPTIONS"
              ? "bg-white text-clinic-blue shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Pill className="w-3 h-3" />
          <span>Đơn cũ ({patient.previousPrescriptions?.length || 0})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("DOCS")}
          className={`flex-1 min-w-[90px] py-1.5 px-2 rounded-lg font-bold text-[11px] flex items-center justify-center gap-1 transition-all ${
            activeTab === "DOCS"
              ? "bg-white text-clinic-blue shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Paperclip className="w-3 h-3" />
          <span>Tài liệu ({patient.documents?.length || 0})</span>
        </button>
      </div>

      {/* Record Content Area */}
      <CardContent className="p-4 space-y-4 max-h-[calc(100vh-280px)] overflow-y-auto">
        {/* TAB 1: SUMMARY (DEMOGRAPHICS, ALLERGIES, CHRONIC, MEDS, VITALS, TIMELINE) */}
        {activeTab === "SUMMARY" && (
          <div className="space-y-4">
            {/* Demographics Summary */}
            <PatientSummary patient={patient} compact />

            {/* Critical Allergies */}
            <PatientAllergyList allergies={patient.allergies} />

            {/* Chronic conditions & Regular Meds */}
            <PatientConditionList conditions={patient.chronicConditions} />
            <PatientMedicationList medications={patient.regularMedications} />

            {/* Recent Vitals */}
            {patient.latestVitals && (
              <PatientVitalsCard vitals={patient.latestVitals} />
            )}

            {/* Previous Diagnoses List */}
            {patient.previousDiagnoses && patient.previousDiagnoses.length > 0 && (
              <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-2 text-xs">
                <div className="flex items-center gap-1.5 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                  <Activity className="w-3.5 h-3.5 text-clinic-blue" />
                  Chẩn đoán các lần khám trước ({patient.previousDiagnoses.length})
                </div>
                <div className="space-y-1">
                  {patient.previousDiagnoses.map((d, i) => (
                    <div key={i} className="p-2 bg-slate-50 rounded-lg text-slate-800 font-medium">
                      • {d}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Previous Encounters Timeline */}
            <PatientHistoryTimeline encounters={patient.recentEncounters} />
          </div>
        )}

        {/* TAB 2: PREVIOUS LAB / IMAGING / ECG RESULTS */}
        {activeTab === "RESULTS" && (
          <PatientResultHistory results={patient.previousResults || []} />
        )}

        {/* TAB 3: PREVIOUS PRESCRIPTIONS */}
        {activeTab === "PRESCRIPTIONS" && (
          <PatientPrescriptionHistory prescriptions={patient.previousPrescriptions || []} />
        )}

        {/* TAB 4: ATTACHED DOCUMENTS & SCANS */}
        {activeTab === "DOCS" && (
          <PatientDocumentsCard documents={patient.documents || []} />
        )}
      </CardContent>
    </Card>
  );
}
