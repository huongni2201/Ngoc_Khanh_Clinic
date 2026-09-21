"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useCorporateHealthCheckStore } from "@/shared/stores/corporate-health-check.store";
import { Button } from "@/shared/ui/button";
import { Printer, Eye, CheckSquare, X } from "lucide-react";

interface BulkPrintToolbarProps {
  companyId: string;
}

export function BulkPrintToolbar({ companyId }: BulkPrintToolbarProps) {
  const router = useRouter();
  const {
    selectedEmployeeIds,
    clearSelection,
    selectAllValidEmployees,
    employees,
  } = useCorporateHealthCheckStore();

  const selectedCount = selectedEmployeeIds.length;
  const companyEmployees = employees.filter((e) => e.companyId === companyId);
  const eligibleEmployees = companyEmployees.filter(
    (e) => e.validationStatus !== "UNDER_18" && e.validationStatus !== "DUPLICATE_IDENTITY" && e.age >= 18
  );

  if (selectedCount === 0) return null;

  const totalPages = selectedCount * 5;

  const handlePreview = () => {
    router.push(`/health-check/print/preview?companyId=${companyId}`);
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900 text-white px-6 py-3.5 rounded-2xl shadow-2xl border border-slate-700/80 flex items-center gap-6 animate-in slide-in-from-bottom-5">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-clinic-blue text-white flex items-center justify-center font-bold text-xs">
          {selectedCount}
        </div>
        <div>
          <div className="text-xs font-bold text-white">
            Đã chọn: <span className="text-emerald-400">{selectedCount} nhân sự</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Dự kiến: <b className="text-white">{totalPages} trang A4</b> (Mẫu số 03 — 5 trang/người)
          </div>
        </div>
      </div>

      <div className="h-6 w-px bg-slate-700" />

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => selectAllValidEmployees(companyId)}
          className="text-xs font-semibold border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 h-9"
          title="Chọn tất cả nhân sự hợp lệ (>= 18 tuổi)"
        >
          <CheckSquare className="w-3.5 h-3.5 mr-1 text-emerald-400" />
          Chọn tất cả hợp lệ ({eligibleEmployees.length})
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handlePreview}
          className="text-xs font-bold border-blue-500/50 bg-blue-950/60 text-blue-300 hover:bg-blue-900/80 h-9"
        >
          <Eye className="w-3.5 h-3.5 mr-1.5" />
          Xem trước phiếu
        </Button>

        <Button
          type="button"
          size="sm"
          onClick={handlePreview}
          className="text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/30 px-5 h-9"
        >
          <Printer className="w-3.5 h-3.5 mr-1.5" />
          In {selectedCount} phiếu đã chọn
        </Button>

        <button
          type="button"
          onClick={clearSelection}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-1"
          title="Bỏ chọn tất cả"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
