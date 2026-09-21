"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { useCorporateHealthCheckStore } from "@/shared/stores/corporate-health-check.store";
import { CompanyHeader } from "@/features/health-check/company-detail/company-header";
import { CompanyOverviewTab } from "@/features/health-check/company-detail/company-overview-tab";
import { CompanyBatchesTab } from "@/features/health-check/company-detail/company-batches-tab";
import { EmployeeRoster } from "@/features/health-check/employee-roster/employee-roster";
import { ImportEmployeesDialog } from "@/features/health-check/import-employees/import-employees-dialog";
import { Button } from "@/shared/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/ui/tabs";
import { Building2, Users, Calendar, LayoutDashboard, AlertCircle } from "lucide-react";

export default function CompanyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const companyId = params.companyId as string;

  const {
    getCompanyById,
    getEmployeesByCompanyId,
    getBatchesByCompanyId,
  } = useCorporateHealthCheckStore();

  const company = getCompanyById(companyId);
  const employees = getEmployeesByCompanyId(companyId);
  const batches = getBatchesByCompanyId(companyId);

  const [activeTab, setActiveTab] = React.useState<"overview" | "roster" | "batches">("overview");
  const [importDialogOpen, setImportDialogOpen] = React.useState(false);
  const [createBatchModalOpen, setCreateBatchModalOpen] = React.useState(false);

  if (!company) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
        <h2 className="text-base font-bold text-slate-900">Không tìm thấy doanh nghiệp</h2>
        <p className="text-xs text-slate-500">
          Mã doanh nghiệp <code>{companyId}</code> không tồn tại trong hệ thống.
        </p>
        <Button
          type="button"
          onClick={() => router.push("/health-check")}
          className="text-xs font-bold bg-clinic-blue text-white"
        >
          ← Quay lại danh sách doanh nghiệp
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Company Header */}
      <CompanyHeader
        company={company}
        onOpenImport={() => setImportDialogOpen(true)}
        onOpenCreateBatch={() => setCreateBatchModalOpen(true)}
      />

      {/* Tabs Navigation */}
      <div className="space-y-4">
        <div className="flex border-b border-slate-200 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={`flex items-center gap-2 pb-3 px-4 text-xs font-bold border-b-2 transition-all ${
              activeTab === "overview"
                ? "border-clinic-blue text-clinic-blue"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Tổng quan
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("roster")}
            className={`flex items-center gap-2 pb-3 px-4 text-xs font-bold border-b-2 transition-all ${
              activeTab === "roster"
                ? "border-clinic-blue text-clinic-blue"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <Users className="w-4 h-4" />
            Danh sách nhân sự ({employees.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("batches")}
            className={`flex items-center gap-2 pb-3 px-4 text-xs font-bold border-b-2 transition-all ${
              activeTab === "batches"
                ? "border-clinic-blue text-clinic-blue"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <Calendar className="w-4 h-4" />
            Đợt khám ({batches.length})
          </button>
        </div>

        {/* Tab Contents */}
        {activeTab === "overview" && (
          <CompanyOverviewTab
            company={company}
            employees={employees}
            batches={batches}
            onSwitchToRoster={() => setActiveTab("roster")}
            onSwitchToBatches={() => setActiveTab("batches")}
          />
        )}

        {activeTab === "roster" && <EmployeeRoster companyId={companyId} />}

        {activeTab === "batches" && (
          <CompanyBatchesTab
            companyId={companyId}
            createModalOpen={createBatchModalOpen}
            onCreateModalOpenChange={setCreateBatchModalOpen}
          />
        )}
      </div>

      {/* Global Import Wizard for Header Button */}
      <ImportEmployeesDialog
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
        companyId={companyId}
      />
    </div>
  );
}
