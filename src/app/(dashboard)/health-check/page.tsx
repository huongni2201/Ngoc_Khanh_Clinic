"use client";

import * as React from "react";
import { PageHeader } from "@/shared/components/page-header";
import { Card } from "@/shared/ui/card";
import { CompanyList } from "@/features/health-check/company-list/company-list";
import { useCorporateHealthCheckStore } from "@/shared/stores/corporate-health-check.store";
import { Building2, Users, FileCheck, CheckCircle2 } from "lucide-react";

export default function HealthCheckPage() {
  const { companies, employees } = useCorporateHealthCheckStore();

  const totalCompanies = companies.length;
  const totalEmployees = employees.length;
  const totalPrinted = employees.filter((e) => e.printStatus === "PRINTED").length;
  const totalCompleted = employees.filter((e) => e.examStatus === "COMPLETED").length;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="PHÂN HỆ KHÁM SỨC KHỎE DOANH NGHIỆP"
        title="Quản Lý Khám Sức Khỏe Doanh Nghiệp"
        description="Quản lý hồ sơ doanh nghiệp, danh sách nhân sự, đợt khám định kỳ và chuẩn bị phiếu khám sức khỏe (Mẫu số 03 — Từ đủ 18 tuổi trở lên)"
      />

      {/* Operational Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-slate-200 shadow-sm p-4 bg-white flex items-center justify-between">
          <div>
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              Doanh nghiệp quản lý
            </div>
            <div className="text-2xl font-black text-slate-900 mt-1">{totalCompanies} đơn vị</div>
            <span className="text-[11px] text-slate-500">Hợp đồng KSK định kỳ</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-clinic-blue flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
        </Card>

        <Card className="border-slate-200 shadow-sm p-4 bg-white flex items-center justify-between">
          <div>
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              Nhân sự cần khám
            </div>
            <div className="text-2xl font-black text-slate-900 mt-1">{totalEmployees} CBNV</div>
            <span className="text-[11px] text-slate-500">Theo danh sách đã import</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </Card>

        <Card className="border-slate-200 shadow-sm p-4 bg-white flex items-center justify-between">
          <div>
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              Phiếu KSK đã tạo
            </div>
            <div className="text-2xl font-black text-clinic-blue mt-1">{totalPrinted} hồ sơ</div>
            <span className="text-[11px] text-slate-500">Mẫu số 03 (5 trang A4)</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-clinic-blue flex items-center justify-center">
            <FileCheck className="w-5 h-5" />
          </div>
        </Card>

        <Card className="border-slate-200 shadow-sm p-4 bg-white flex items-center justify-between">
          <div>
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              Đã hoàn thành khám
            </div>
            <div className="text-2xl font-black text-emerald-600 mt-1">{totalCompleted} CBNV</div>
            <span className="text-[11px] text-emerald-700 font-semibold">Đã kết luận chuyên môn</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </Card>
      </div>

      {/* Main Company List Feature */}
      <CompanyList />
    </div>
  );
}
