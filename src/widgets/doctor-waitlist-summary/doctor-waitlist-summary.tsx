"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { useDemoClinicFlowStore, JourneyStage } from "@/shared/stores/demo-clinic-flow.store";
import { useUIStore } from "@/shared/stores/ui.store";
import { DoctorWaitlistSummaryItem } from "@/entities/encounter/model/encounter.types";
import {
  Users,
  Clock,
  CheckCircle2,
  Stethoscope,
  Activity,
  ArrowRightLeft,
  AlertCircle,
  Eye,
} from "lucide-react";

const STAGE_SUMMARY_LABELS: Record<string, { label: string; variant: "default" | "success" | "warn" | "secondary" | "purple" }> = {
  WAITING_FOR_DOCTOR: { label: "Chờ bác sĩ khám", variant: "default" },
  IN_EXAM: { label: "Đang khám", variant: "purple" },
  WAITING_FOR_DIAGNOSTIC_PAYMENT: { label: "Chờ thanh toán CLS", variant: "warn" },
  WAITING_FOR_DIAGNOSTIC: { label: "Chờ làm CLS", variant: "warn" },
  DIAGNOSTIC_IN_PROGRESS: { label: "Đang làm CLS", variant: "warn" },
  WAITING_FOR_RESULTS: { label: "Chờ kết quả CLS", variant: "warn" },
  WAITING_FOR_CONCLUSION: { label: "Chờ bác sĩ kết luận", variant: "success" },
};

export function DoctorWaitlistSummary() {
  const { showToast } = useUIStore();
  const {
    patientName,
    patientCode,
    encounterCode,
    journeyStage,
    initialExamFeePaid,
    roomCode,
    doctorName,
    department,
  } = useDemoClinicFlowStore();

  const [selectedRoom, setSelectedRoom] = React.useState<string>("P.203");

  // Map active demo patient into operational summary item (strictly NO clinical data)
  const activeSummaryItem: DoctorWaitlistSummaryItem = React.useMemo(() => {
    let stage: DoctorWaitlistSummaryItem["stage"] = "WAITING_FOR_DOCTOR";
    if (journeyStage === "IN_EXAM") stage = "IN_EXAM";
    else if (journeyStage === "WAITING_FOR_DIAGNOSTIC_PAYMENT") stage = "WAITING_FOR_DIAGNOSTIC_PAYMENT";
    else if (journeyStage === "WAITING_FOR_DIAGNOSTIC") stage = "WAITING_FOR_DIAGNOSTIC";
    else if (journeyStage === "DIAGNOSTIC_IN_PROGRESS") stage = "DIAGNOSTIC_IN_PROGRESS";
    else if (journeyStage === "WAITING_FOR_RESULTS") stage = "WAITING_FOR_RESULTS";
    else if (journeyStage === "WAITING_FOR_CONCLUSION" || journeyStage === "IN_CONCLUSION") stage = "WAITING_FOR_CONCLUSION";

    return {
      encounterId: encounterCode,
      patientCode,
      patientName,
      doctorName,
      roomCode,
      department,
      stage,
      waitingMinutes: 8,
      initialExamFeePaid,
    };
  }, [encounterCode, patientCode, patientName, doctorName, roomCode, department, journeyStage, initialExamFeePaid]);

  // Operational mock queue for P.203 & P.204
  const mockQueue: Record<string, DoctorWaitlistSummaryItem[]> = React.useMemo(() => {
    return {
      "P.203": [
        activeSummaryItem,
        {
          encounterId: "ENC-260919-038",
          patientCode: "PT-001855",
          patientName: "Lê Văn Hùng",
          doctorName: "BS. Lê Minh",
          roomCode: "P.203",
          department: "Nội tổng quát",
          stage: "WAITING_FOR_CONCLUSION",
          waitingMinutes: 14,
          initialExamFeePaid: true,
        },
        {
          encounterId: "ENC-260919-042",
          patientCode: "PT-001913",
          patientName: "Trần Thu Hà",
          doctorName: "BS. Lê Minh",
          roomCode: "P.203",
          department: "Nội tổng quát",
          stage: "WAITING_FOR_DOCTOR",
          waitingMinutes: 5,
          initialExamFeePaid: true,
        },
        {
          encounterId: "ENC-260919-043",
          patientCode: "PT-002104",
          patientName: "Phạm Quốc Tuấn",
          doctorName: "BS. Lê Minh",
          roomCode: "P.203",
          department: "Nội tổng quát",
          stage: "WAITING_FOR_DOCTOR",
          waitingMinutes: 3,
          initialExamFeePaid: true,
        },
      ],
      "P.204": [
        {
          encounterId: "ENC-260919-035",
          patientCode: "PT-002231",
          patientName: "Đỗ Bích Thủy",
          doctorName: "BS. Trần Thu Hà",
          roomCode: "P.204",
          department: "Tim mạch",
          stage: "IN_EXAM",
          waitingMinutes: 0,
          initialExamFeePaid: true,
        },
        {
          encounterId: "ENC-260919-040",
          patientCode: "PT-002450",
          patientName: "Hoàng Minh Đức",
          doctorName: "BS. Trần Thu Hà",
          roomCode: "P.204",
          department: "Tim mạch",
          stage: "WAITING_FOR_DOCTOR",
          waitingMinutes: 11,
          initialExamFeePaid: true,
        },
      ],
    };
  }, [activeSummaryItem]);

  const currentItems = mockQueue[selectedRoom] || [];

  const waitingCount = currentItems.filter((i) => i.stage === "WAITING_FOR_DOCTOR").length;
  const inExamCount = currentItems.filter((i) => i.stage === "IN_EXAM").length;
  const conclusionCount = currentItems.filter((i) => i.stage === "WAITING_FOR_CONCLUSION").length;
  const inDiagnosticCount = currentItems.filter((i) =>
    i.stage === "WAITING_FOR_DIAGNOSTIC_PAYMENT" ||
    i.stage === "WAITING_FOR_DIAGNOSTIC" ||
    i.stage === "DIAGNOSTIC_IN_PROGRESS" ||
    i.stage === "WAITING_FOR_RESULTS"
  ).length;

  return (
    <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
      <CardHeader className="p-4 bg-slate-50/90 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-clinic-blue" />
            <CardTitle className="text-sm font-bold text-slate-900 uppercase tracking-tight">
              Tình trạng các phòng khám (Bàn Lễ tân)
            </CardTitle>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Theo dõi tải phòng khám & thời gian chờ của người bệnh (Chế độ xem vận hành - Không hiển thị bệnh án)
          </p>
        </div>

        {/* Room Switcher Tabs */}
        <div className="flex items-center gap-1 bg-slate-200/80 p-1 rounded-xl self-start sm:self-auto text-xs">
          <button
            type="button"
            onClick={() => setSelectedRoom("P.203")}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all text-xs ${
              selectedRoom === "P.203"
                ? "bg-white text-clinic-blue shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            P.203 — BS. Lê Minh
          </button>
          <button
            type="button"
            onClick={() => setSelectedRoom("P.204")}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all text-xs ${
              selectedRoom === "P.204"
                ? "bg-white text-clinic-blue shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            P.204 — BS. Trần Thu Hà
          </button>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        {/* Room Load KPI Summary Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-blue-50/80 border border-blue-200">
            <span className="text-[10px] uppercase font-bold text-blue-700 block">Đang chờ khám:</span>
            <span className="font-mono text-base font-black text-blue-900">{waitingCount} bệnh nhân</span>
          </div>

          <div className="p-2.5 rounded-xl bg-purple-50/80 border border-purple-200">
            <span className="text-[10px] uppercase font-bold text-purple-700 block">Đang khám:</span>
            <span className="font-mono text-base font-black text-purple-900">{inExamCount} bệnh nhân</span>
          </div>

          <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200">
            <span className="text-[10px] uppercase font-bold text-amber-700 block">Đang làm CLS:</span>
            <span className="font-mono text-base font-black text-amber-900">{inDiagnosticCount} bệnh nhân</span>
          </div>

          <div className="p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200">
            <span className="text-[10px] uppercase font-bold text-emerald-700 block">Chờ kết luận:</span>
            <span className="font-mono text-base font-black text-emerald-900">{conclusionCount} bệnh nhân</span>
          </div>
        </div>

        {/* Patient Summary Queue */}
        <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
          {currentItems.map((item, idx) => {
            const stageConfig = STAGE_SUMMARY_LABELS[item.stage] || {
              label: item.stage,
              variant: "secondary" as const,
            };
            const isHighlighted = item.patientCode === patientCode;

            return (
              <div
                key={idx}
                className={`p-3 flex items-center justify-between gap-3 text-xs transition-colors ${
                  isHighlighted ? "bg-blue-50/60 border-l-4 border-l-clinic-blue" : "hover:bg-slate-50"
                }`}
              >
                <div className="space-y-0.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-900 uppercase">{item.patientName}</span>
                    <span className="font-mono text-[10px] text-blue-700 bg-blue-100/70 px-1.5 py-0.2 rounded font-bold">
                      {item.patientCode}
                    </span>
                    <span className="font-mono text-[10px] text-slate-500">
                      {item.encounterId}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-3 flex-wrap">
                    <span className="flex items-center gap-1 font-medium">
                      <Clock className="w-3 h-3 text-slate-400" />
                      Chờ {item.waitingMinutes} phút
                    </span>
                    <span>•</span>
                    <span>Phòng: <b className="text-slate-700">{item.roomCode}</b> ({item.doctorName})</span>
                    <span>•</span>
                    <span className="text-emerald-700 font-semibold">
                      ✓ Phí khám: Đã thu
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant={stageConfig.variant} className="text-[10px] font-bold">
                    {stageConfig.label}
                  </Badge>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => showToast(`Bàn tiếp đón: Bệnh nhân ${item.patientName} (${item.patientCode}) hiện đang ở trạng thái: ${stageConfig.label}`)}
                    className="h-7 px-2 text-[11px] font-bold text-slate-600 hover:text-clinic-blue"
                    title="Xem tình trạng"
                  >
                    <Eye className="w-3.5 h-3.5 mr-1" />
                    Tình trạng
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
