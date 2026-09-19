"use client";

import * as React from "react";
import Link from "next/link";
import { PageHeader } from "@/shared/components/page-header";
import { EncounterWorkspaceLayout } from "@/widgets/clinical-workspace/encounter-workspace-layout";
import { MOCK_ACTIVE_ENCOUNTER } from "@/shared/constants/mock-data";
import { useDemoClinicFlowStore } from "@/shared/stores/demo-clinic-flow.store";
import { ArrowLeft } from "lucide-react";

export default function EncounterWorkspacePage({
  params,
}: {
  params: Promise<{ encounterId: string }>;
}) {
  const resolvedParams = React.use(params);
  const { patientName, patientCode, encounterCode, roomCode, department } = useDemoClinicFlowStore();
  const encounter = MOCK_ACTIVE_ENCOUNTER;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-1">
        <Link
          href="/clinical"
          className="text-xs text-slate-700 hover:text-clinic-blue flex items-center gap-1 font-bold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Quay lại Danh sách chờ Bác sĩ (P.203)
        </Link>
        <span className="text-xs text-slate-700 font-mono">
          Mã lượt khám: <b>{encounterCode}</b> • {roomCode} ({department})
        </span>
      </div>

      <PageHeader
        eyebrow="BÀN KHÁM CHUYÊN KHOA NGOẠI TRÚ"
        title="Khám Lâm Sàng & Y Lệnh — Phòng Khám 203 (Nội Tổng Quát)"
        description="Giao diện làm việc trung tâm của bác sĩ: khám lâm sàng, chỉ định cận lâm sàng đa đợt, theo dõi kết quả tự động trả về và kê đơn thuốc điện tử"
      />

      <EncounterWorkspaceLayout encounter={encounter} />
    </div>
  );
}
