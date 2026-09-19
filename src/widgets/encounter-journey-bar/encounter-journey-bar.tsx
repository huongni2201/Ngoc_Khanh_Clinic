"use client";

import * as React from "react";
import Link from "next/link";
import { useDemoJourneyStore, JourneyStage } from "@/shared/stores/demo-journey.store";
import { useUIStore } from "@/shared/stores/ui.store";
import {
  Check,
  ChevronRight,
  RotateCcw,
  Activity,
  User,
  Clock,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

interface StepItem {
  id: string;
  label: string;
  href: string;
  isPassed: boolean;
  isActive: boolean;
}

export function EncounterJourneyBar() {
  const {
    patientName,
    patientCode,
    encounterCode,
    currentStage,
    isPaid,
    labStatus,
    imagingStatus,
    initialExamTicket,
    returnExamTicket,
    resetDemo,
  } = useDemoJourneyStore();

  const { showToast } = useUIStore();

  const isDiagnosticsDone = labStatus === "FINAL" && imagingStatus === "FINAL";
  const isConclusionStage = currentStage === "WAITING_FOR_CONCLUSION" || currentStage === "IN_CONCLUSION";
  const isCompleted = currentStage === "COMPLETED";

  const steps: StepItem[] = [
    {
      id: "reception",
      label: "1. Tiếp nhận",
      href: "/reception",
      isPassed: currentStage !== "WAITING_FOR_RECEPTION" && currentStage !== "IN_RECEPTION",
      isActive: currentStage === "WAITING_FOR_RECEPTION" || currentStage === "IN_RECEPTION",
    },
    {
      id: "exam",
      label: "2. Khám ban đầu",
      href: "/encounters/ENC-260917-032",
      isPassed:
        currentStage !== "WAITING_FOR_RECEPTION" &&
        currentStage !== "IN_RECEPTION" &&
        currentStage !== "WAITING_FOR_EXAM" &&
        currentStage !== "IN_EXAM",
      isActive: currentStage === "WAITING_FOR_EXAM" || currentStage === "IN_EXAM",
    },
    {
      id: "billing",
      label: "3. Thanh toán",
      href: "/billing",
      isPassed: isPaid || currentStage === "DIAGNOSTIC_IN_PROGRESS" || currentStage === "WAITING_FOR_RESULTS" || isConclusionStage || isCompleted,
      isActive: currentStage === "WAITING_FOR_PAYMENT",
    },
    {
      id: "diagnostics",
      label: "4. Đang làm CLS",
      href: "/laboratory",
      isPassed: isDiagnosticsDone || isConclusionStage || isCompleted,
      isActive:
        currentStage === "WAITING_FOR_DIAGNOSTIC" ||
        currentStage === "DIAGNOSTIC_IN_PROGRESS" ||
        currentStage === "WAITING_FOR_RESULTS",
    },
    {
      id: "conclusion",
      label: "5. Chờ kết luận",
      href: "/clinical",
      isPassed: isCompleted,
      isActive: isConclusionStage,
    },
    {
      id: "completed",
      label: "6. Hoàn tất",
      href: "/portal",
      isPassed: isCompleted,
      isActive: isCompleted,
    },
  ];

  const handleReset = () => {
    resetDemo();
    showToast("Đã Reset toàn bộ dữ liệu Demo về trạng thái khởi đầu!");
  };

  return (
    <div className="px-4 py-2 bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-950 text-white flex items-center justify-between gap-3 overflow-x-auto select-none border-b border-blue-950 shadow-inner">
      {/* Left: Active Demo Patient Pill */}
      <div className="flex items-center gap-2.5 shrink-0">
        <div className="w-6 h-6 rounded-full bg-blue-500/30 border border-blue-400/50 text-blue-300 flex items-center justify-center font-bold text-xs">
          <User className="w-3.5 h-3.5" />
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="font-extrabold uppercase text-white tracking-tight whitespace-nowrap">
            {patientName}
          </span>
          <span className="font-mono text-[10px] text-blue-300 bg-blue-950 px-1.5 py-0.5 rounded border border-blue-800">
            {patientCode}
          </span>
          <span className="text-slate-400 text-[11px] hidden lg:inline font-mono">
            {encounterCode}
          </span>
          {returnExamTicket?.number ? (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono font-bold">
              Vé kết luận: {returnExamTicket.number}
            </span>
          ) : initialExamTicket?.number ? (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 font-mono font-bold">
              Số khám: {initialExamTicket.number}
            </span>
          ) : null}
        </div>
      </div>

      {/* Middle: Interactive Encounter Stage Navigator */}
      <div className="flex items-center gap-1 shrink-0 overflow-x-auto scrollbar-none py-0.5">
        {steps.map((step, idx) => {
          return (
            <React.Fragment key={step.id}>
              <Link
                href={step.href}
                className={`text-[11px] px-2.5 py-1 rounded-lg flex items-center gap-1.5 font-bold transition-all whitespace-nowrap ${
                  step.isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/40 ring-1 ring-blue-400"
                    : step.isPassed
                    ? "bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 hover:bg-emerald-900/80"
                    : "bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-slate-200"
                }`}
                title={`Chuyển tới phân hệ: ${step.label}`}
              >
                {step.isPassed ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : step.isActive ? (
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                )}
                <span>{step.label}</span>
              </Link>

              {idx < steps.length - 1 && (
                <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Right: Reset Demo Button */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={handleReset}
          className="px-2.5 py-1 rounded-lg bg-red-950/70 hover:bg-red-900 border border-red-800/80 text-red-300 text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-xs"
          title="Reset trạng thái Demo về ban đầu (Kiosk A023)"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo</span>
        </button>
      </div>
    </div>
  );
}
