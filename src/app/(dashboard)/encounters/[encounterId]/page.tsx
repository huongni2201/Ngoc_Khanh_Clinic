"use client";

import * as React from "react";
import Link from "next/link";
import { PageHeader } from "@/shared/components/page-header";
import { EncounterWorkspaceLayout } from "@/widgets/clinical-workspace/encounter-workspace-layout";
import { MOCK_ACTIVE_ENCOUNTER } from "@/shared/constants/mock-data";
import { ArrowLeft } from "lucide-react";

export default function EncounterWorkspacePage({
  params,
}: {
  params: Promise<{ encounterId: string }>;
}) {
  const resolvedParams = React.use(params);
  const encounter = MOCK_ACTIVE_ENCOUNTER;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <Link
          href="/clinical"
          className="text-xs text-slate-700 hover:text-clinic-blue flex items-center gap-1 font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Quay lại Doctor Worklist (P.203)
        </Link>
        <span className="text-xs text-slate-700 font-mono">
          Lượt khám: <b>{encounter.encounterCode}</b> • STT <b>{encounter.queueNumber}</b>
        </span>
      </div>

      <PageHeader
        eyebrow="TRUNG TÂM KHÁM CHỮA BỆNH (UC-CLN-02 → 12 / FR-CLN)"
        title="Clinical Workspace — Phòng Khám 203 (Nội Tổng Quát)"
        description="Màn hình khám bệnh trung tâm: xem bệnh sử, chỉ định cận lâm sàng đa đợt, nhận kết quả tự động và kê đơn điện tử"
      />

      <EncounterWorkspaceLayout encounter={encounter} />
    </div>
  );
}
