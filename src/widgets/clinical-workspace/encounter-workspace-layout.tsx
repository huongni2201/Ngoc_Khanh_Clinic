"use client";

import * as React from "react";
import { PatientHeader } from "@/widgets/patient-header/patient-header";
import { PatientTimeline } from "@/widgets/patient-timeline/patient-timeline";
import { ClinicalWorkspace } from "@/widgets/clinical-workspace/clinical-workspace";
import { Encounter } from "@/entities/encounter/model/encounter.types";
import { Stethoscope, History } from "lucide-react";

interface EncounterWorkspaceLayoutProps {
  encounter: Encounter;
}

export function EncounterWorkspaceLayout({ encounter }: EncounterWorkspaceLayoutProps) {
  const [mobileTab, setMobileTab] = React.useState<"workspace" | "timeline">("workspace");

  return (
    <div className="space-y-6">
      {/* Patient Safety Header */}
      <PatientHeader
        patientName={encounter.patientName}
        gender={encounter.gender}
        age={encounter.age}
        dob={encounter.dob}
        patientCode={encounter.patientCode}
        encounterCode={encounter.encounterCode}
        queueNumber={encounter.queueNumber}
      />

      {/* Mobile / Tablet Tab Switcher (Visible only below lg) */}
      <div className="lg:hidden flex items-center bg-slate-200/70 p-1 rounded-xl border border-slate-300/80">
        <button
          type="button"
          onClick={() => setMobileTab("workspace")}
          className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            mobileTab === "workspace"
              ? "bg-white text-clinic-blue shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Stethoscope className="w-4 h-4" />
          Khám lâm sàng & Y lệnh (Chính)
        </button>
        <button
          type="button"
          onClick={() => setMobileTab("timeline")}
          className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            mobileTab === "timeline"
              ? "bg-white text-clinic-blue shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <History className="w-4 h-4" />
          Lịch sử đợt khám (Timeline)
        </button>
      </div>

      {/* Two-Column Clinical Layout (Desktop lg+) / Tabbed View (Mobile < lg) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Timeline and Medical History (4 cols on lg+) */}
        <div
          className={`lg:col-span-4 space-y-6 ${
            mobileTab === "workspace" ? "hidden lg:block" : "block"
          }`}
        >
          <PatientTimeline />
        </div>

        {/* Right Column: Active Clinical Workspace (8 cols on lg+) */}
        <div
          className={`lg:col-span-8 ${
            mobileTab === "timeline" ? "hidden lg:block" : "block"
          }`}
        >
          <ClinicalWorkspace />
        </div>
      </div>
    </div>
  );
}
