"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCorporateHealthCheckStore } from "@/shared/stores/corporate-health-check.store";
import { useUIStore } from "@/shared/stores/ui.store";
import { MOCK_PATIENTS } from "@/shared/constants/mock-data";
import {
  mapEmployeeToPrintData,
  mapPatientToPrintData,
} from "@/features/health-check/print-health-check-form/health-check-form.mapper";
import { AdultHealthCheckPrintData } from "@/entities/health-check/model/health-check.types";
import {
  SingleHealthCheckFormPrint,
  BatchHealthCheckFormPrint,
} from "@/features/health-check/print-health-check-form/health-check-form-print";
import { Button } from "@/shared/ui/button";
import {
  Printer,
  ArrowLeft,
  FileText,
  ChevronLeft,
  ChevronRight,
  Eye,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

function PrintPreviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useUIStore();

  const companyId = searchParams.get("companyId");
  const patientId = searchParams.get("patientId");
  const singleEmployeeId = searchParams.get("employeeId");

  const {
    companies,
    employees,
    batches,
    selectedEmployeeIds,
    markEmployeesAsPrinted,
  } = useCorporateHealthCheckStore();

  // Mode: "ALL_SELECTED" (show all in scrollable stream) or single index
  const [viewMode, setViewMode] = React.useState<"ALL" | "SINGLE">("ALL");
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isPrintedNotification, setIsPrintedNotification] = React.useState(false);

  // Compute print records
  const printRecords: AdultHealthCheckPrintData[] = React.useMemo(() => {
    // 1. Single Patient from Reception
    if (patientId) {
      const patient = MOCK_PATIENTS.find((p) => p.id === patientId || p.patientCode === patientId);
      if (patient) {
        return [mapPatientToPrintData(patient)];
      }
    }

    // 2. Single Employee directly requested
    if (singleEmployeeId) {
      const emp = employees.find((e) => e.id === singleEmployeeId);
      if (emp) {
        const comp = companies.find((c) => c.id === emp.companyId);
        const batch = batches.find((b) => b.id === emp.batchId);
        return [mapEmployeeToPrintData(emp, comp, batch)];
      }
    }

    // 3. Batch from selected employees in company
    if (companyId) {
      const comp = companies.find((c) => c.id === companyId);
      const compEmployees = employees.filter((e) => e.companyId === companyId);

      // If specific employees selected, use them; otherwise if none selected, warn or use all valid
      const targetEmployees =
        selectedEmployeeIds.length > 0
          ? compEmployees.filter((e) => selectedEmployeeIds.includes(e.id))
          : compEmployees.filter((e) => e.validationStatus !== "UNDER_18" && e.age >= 18);

      return targetEmployees.map((emp) => {
        const batch = batches.find((b) => b.id === emp.batchId);
        return mapEmployeeToPrintData(emp, comp, batch);
      });
    }

    // 4. Default fallback: any selected employees across companies
    if (selectedEmployeeIds.length > 0) {
      return employees
        .filter((e) => selectedEmployeeIds.includes(e.id))
        .map((emp) => {
          const comp = companies.find((c) => c.id === emp.companyId);
          const batch = batches.find((b) => b.id === emp.batchId);
          return mapEmployeeToPrintData(emp, comp, batch);
        });
    }

    return [];
  }, [patientId, singleEmployeeId, companyId, selectedEmployeeIds, employees, companies, batches]);

  const handlePrint = () => {
    if (printRecords.length === 0) {
      showToast("Không có hồ sơ nào để in.");
      return;
    }

    // Mark employees as printed
    if (singleEmployeeId) {
      markEmployeesAsPrinted([singleEmployeeId]);
    } else if (selectedEmployeeIds.length > 0) {
      markEmployeesAsPrinted(selectedEmployeeIds);
    }

    setIsPrintedNotification(true);
    showToast(`Đang mở hộp thoại in ${printRecords.length} phiếu khám sức khỏe...`);

    // Trigger browser print
    window.print();
  };

  const currentRecord = printRecords[currentIndex] || printRecords[0];

  return (
    <div className="min-h-screen bg-slate-700 text-slate-100 flex flex-col">
      {/* Top Floating Control Bar (Hidden on print) */}
      <div className="no-print sticky top-0 z-50 bg-slate-900 border-b border-slate-800 px-6 py-3 shadow-xl flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="text-xs font-bold border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Quay lại
          </Button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white uppercase tracking-wide">
                Xem trước bản in: Mẫu số 03
              </span>
              <span className="text-[10px] font-bold bg-blue-900/80 text-blue-300 border border-blue-700 px-2 py-0.5 rounded-full">
                Từ đủ 18 tuổi trở lên
              </span>
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              Số hồ sơ: <b className="text-white">{printRecords.length} phiếu</b> • Tổng số trang dự kiến:{" "}
              <b className="text-emerald-400">{printRecords.length * 5} trang A4</b> (5 trang/người)
            </div>
          </div>
        </div>

        {/* View mode & Pagination Controls */}
        <div className="flex items-center gap-3">
          {printRecords.length > 1 && (
            <div className="flex items-center gap-1.5 bg-slate-800 p-1 rounded-lg border border-slate-700 text-xs">
              <button
                type="button"
                onClick={() => setViewMode("ALL")}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                  viewMode === "ALL" ? "bg-clinic-blue text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                Tất cả ({printRecords.length})
              </button>
              <button
                type="button"
                onClick={() => setViewMode("SINGLE")}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                  viewMode === "SINGLE" ? "bg-clinic-blue text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                Từng người
              </button>
            </div>
          )}

          {viewMode === "SINGLE" && printRecords.length > 1 && (
            <div className="flex items-center gap-2 bg-slate-800 px-3 py-1 rounded-lg border border-slate-700 text-xs">
              <button
                type="button"
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-mono font-bold text-white text-xs">
                {currentIndex + 1} / {printRecords.length}
              </span>
              <button
                type="button"
                disabled={currentIndex === printRecords.length - 1}
                onClick={() => setCurrentIndex((prev) => Math.min(printRecords.length - 1, prev + 1))}
                className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <span className="text-slate-400 font-medium ml-1">
                ({currentRecord?.fullName})
              </span>
            </div>
          )}

          <Button
            type="button"
            onClick={handlePrint}
            disabled={printRecords.length === 0}
            className="font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 px-5 h-9"
          >
            <Printer className="w-4 h-4 mr-2" />
            In {printRecords.length} phiếu khám (Ctrl + P)
          </Button>
        </div>
      </div>

      {/* Printed Status Feedback Banner */}
      {isPrintedNotification && (
        <div className="no-print mx-auto my-3 max-w-4xl p-3 bg-emerald-950/80 border border-emerald-500 rounded-xl text-emerald-200 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Đã tạo lệnh in cho <b>{printRecords.length} nhân sự</b>. Trạng thái phiếu khám đã được chuyển thành <b>&quot;Đã tạo phiếu&quot;</b>.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsPrintedNotification(false)}
            className="text-xs text-emerald-400 hover:underline"
          >
            Đóng
          </button>
        </div>
      )}

      {/* Main Preview Pane */}
      <div className="print-preview-wrapper flex-1 overflow-y-auto">
        {printRecords.length === 0 ? (
          <div className="max-w-md mx-auto my-20 p-8 bg-slate-800 rounded-2xl border border-slate-700 text-center space-y-4">
            <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto" />
            <h3 className="text-base font-bold text-white">Chưa chọn nhân sự hợp lệ để in</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Vui lòng quay lại danh sách nhân sự của doanh nghiệp và chọn ít nhất một nhân sự đủ điều kiện (từ đủ 18 tuổi và đầy đủ thông tin bắt buộc).
            </p>
            <Button
              type="button"
              onClick={() => router.back()}
              className="text-xs font-bold bg-clinic-blue text-white"
            >
              ← Quay lại danh sách nhân sự
            </Button>
          </div>
        ) : viewMode === "SINGLE" && currentRecord ? (
          <SingleHealthCheckFormPrint data={currentRecord} />
        ) : (
          <BatchHealthCheckFormPrint records={printRecords} />
        )}
      </div>
    </div>
  );
}

export default function HealthCheckPrintPreviewPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center text-sm font-semibold">
          Đang tải chế độ xem trước bản in...
        </div>
      }
    >
      <PrintPreviewContent />
    </React.Suspense>
  );
}
