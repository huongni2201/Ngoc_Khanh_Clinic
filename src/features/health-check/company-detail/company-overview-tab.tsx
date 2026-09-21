"use client";

import * as React from "react";
import { Company } from "@/entities/company/model/company.types";
import { HealthCheckBatch } from "@/entities/health-check/model/health-check.types";
import { CompanyEmployee } from "@/entities/company-employee/model/company-employee.types";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import {
  Users,
  CheckCircle2,
  FileText,
  AlertTriangle,
  Clock,
  Printer,
  Calendar,
  Building2,
  ArrowRight,
} from "lucide-react";

interface CompanyOverviewTabProps {
  company: Company;
  employees: CompanyEmployee[];
  batches: HealthCheckBatch[];
  onSwitchToRoster: () => void;
  onSwitchToBatches: () => void;
}

export function CompanyOverviewTab({
  company,
  employees,
  batches,
  onSwitchToRoster,
  onSwitchToBatches,
}: CompanyOverviewTabProps) {
  const totalEmployees = employees.length;
  const eligibleAdults = employees.filter(
    (e) => e.validationStatus !== "UNDER_18" && e.validationStatus !== "DUPLICATE_IDENTITY" && e.age >= 18
  ).length;
  const printedForms = employees.filter((e) => e.printStatus === "PRINTED").length;
  const checkedIn = employees.filter(
    (e) => e.examStatus === "CHECKED_IN" || e.examStatus === "IN_EXAM" || e.examStatus === "COMPLETED"
  ).length;
  const completed = employees.filter((e) => e.examStatus === "COMPLETED").length;
  const issuesCount = employees.filter(
    (e) => e.validationStatus === "INCOMPLETE" || e.validationStatus === "UNDER_18" || e.validationStatus === "DUPLICATE_IDENTITY"
  ).length;

  const currentBatch = batches[0];

  return (
    <div className="space-y-6">
      {/* 6 Operation Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Total Roster */}
        <Card className="p-3.5 border-slate-200 bg-white">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Tổng nhân sự
          </span>
          <div className="text-xl font-black text-slate-900 mt-1">{totalEmployees}</div>
          <span className="text-[11px] text-slate-400">Hồ sơ trong danh sách</span>
        </Card>

        {/* Eligible Adults */}
        <Card className="p-3.5 border-emerald-200 bg-emerald-50/50">
          <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
            Đủ tuổi khám (≥18)
          </span>
          <div className="text-xl font-black text-emerald-700 mt-1">{eligibleAdults}</div>
          <span className="text-[11px] text-emerald-600">Đủ điều kiện Mẫu 03</span>
        </Card>

        {/* Forms Printed */}
        <Card className="p-3.5 border-blue-200 bg-blue-50/50">
          <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider block">
            Phiếu đã in / tạo
          </span>
          <div className="text-xl font-black text-clinic-blue mt-1">{printedForms}</div>
          <span className="text-[11px] text-blue-600">
            {totalEmployees > 0 ? `${Math.round((printedForms / totalEmployees) * 100)}% danh sách` : "0%"}
          </span>
        </Card>

        {/* Checked in */}
        <Card className="p-3.5 border-slate-200 bg-white">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Đã tiếp nhận
          </span>
          <div className="text-xl font-black text-indigo-600 mt-1">{checkedIn}</div>
          <span className="text-[11px] text-slate-400">Đã có mặt tại PK</span>
        </Card>

        {/* Completed */}
        <Card className="p-3.5 border-slate-200 bg-white">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Hoàn thành khám
          </span>
          <div className="text-xl font-black text-emerald-700 mt-1">{completed}</div>
          <span className="text-[11px] text-slate-400">Đã kết luận chuyên môn</span>
        </Card>

        {/* Issues / Incomplete */}
        <Card className={`p-3.5 border-slate-200 ${issuesCount > 0 ? "bg-amber-50/60 border-amber-300" : "bg-white"}`}>
          <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
            Hồ sơ có lưu ý
          </span>
          <div className={`text-xl font-black mt-1 ${issuesCount > 0 ? "text-amber-700" : "text-slate-900"}`}>
            {issuesCount}
          </div>
          <span className="text-[11px] text-amber-700">Thiếu tin hoặc &lt;18</span>
        </Card>
      </div>

      {/* Current Batch & Workflow status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Current Active Batch (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="border-slate-200 shadow-sm bg-white">
            <CardHeader className="p-4 bg-slate-50/80 border-b border-slate-200 flex flex-row items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-clinic-blue tracking-wider">
                  ĐỢT KHÁM SỨC KHỎE HIỆN TẠI
                </span>
                <CardTitle className="text-sm font-bold text-slate-900 mt-0.5">
                  {currentBatch?.name || "Chưa có đợt khám nào"}
                </CardTitle>
              </div>

              {currentBatch && (
                <Badge
                  variant={currentBatch.status === "COMPLETED" ? "success" : "purple"}
                  className="text-[10px] font-bold"
                >
                  {currentBatch.status === "IN_PROGRESS"
                    ? "Đang triển khai"
                    : currentBatch.status === "READY"
                    ? "Sẵn sàng khám"
                    : currentBatch.status === "COMPLETED"
                    ? "Đã hoàn thành"
                    : "Bản nháp"}
                </Badge>
              )}
            </CardHeader>

            <CardContent className="p-4 space-y-4 text-xs">
              {currentBatch ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-slate-500 block font-medium">Mã đợt khám:</span>
                      <span className="font-mono font-bold text-slate-800 text-sm">{currentBatch.code}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block font-medium">Ngày khám thực tế:</span>
                      <span className="font-mono font-bold text-clinic-blue text-sm">
                        {currentBatch.examinationDate || "Chưa ấn định"}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block font-medium">Thời gian hợp đồng:</span>
                      <span className="text-slate-800 font-semibold">
                        {currentBatch.startDate} — {currentBatch.endDate}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block font-medium">Biểu mẫu y tế:</span>
                      <span className="font-bold text-slate-900">Mẫu số 03 (Thông tư BYT)</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-800 block">Lý do khám sức khỏe:</span>
                    <span className="text-slate-600">{currentBatch.reasonForHealthCheck}</span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="text-slate-500 text-[11px]">
                      Xem và quản lý tất cả các đợt khám của doanh nghiệp này
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={onSwitchToBatches}
                      className="text-xs font-bold text-clinic-blue"
                    >
                      Xem danh sách đợt khám ({batches.length}) →
                    </Button>
                  </div>
                </>
              ) : (
                <div className="py-6 text-center text-slate-500">
                  Chưa có đợt khám nào được khởi tạo cho doanh nghiệp này.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right: Quick Action Guidance (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="border-slate-200 shadow-sm bg-white p-5 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Quy trình khám đoàn tại Ngọc Khánh Clinic
            </h4>

            <div className="space-y-3 text-xs">
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-clinic-blue flex items-center justify-center font-bold text-[11px] shrink-0">
                  1
                </div>
                <div>
                  <div className="font-bold text-slate-900">Import danh sách nhân sự</div>
                  <div className="text-slate-500 text-[11px]">
                    Tải file Excel CBNV, khớp cột và kiểm tra điều kiện từ đủ 18 tuổi.
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-clinic-blue flex items-center justify-center font-bold text-[11px] shrink-0">
                  2
                </div>
                <div>
                  <div className="font-bold text-slate-900">In phiếu Mẫu số 03 hàng loạt</div>
                  <div className="text-slate-500 text-[11px]">
                    Chọn các nhân sự hợp lệ, hệ thống điền sẵn thông tin hành chính vào 5 trang A4.
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-clinic-blue flex items-center justify-center font-bold text-[11px] shrink-0">
                  3
                </div>
                <div>
                  <div className="font-bold text-slate-900">Khám lâm sàng & Cận lâm sàng</div>
                  <div className="text-slate-500 text-[11px]">
                    Nhân viên mang phiếu đi khám qua các phòng chuyên khoa theo quy trình.
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[11px] shrink-0">
                  4
                </div>
                <div>
                  <div className="font-bold text-slate-900">Kết luận & Nghiệm thu</div>
                  <div className="text-slate-500 text-[11px]">
                    Bác sĩ kết luận phân loại sức khỏe (Loại I - V) và đóng dấu phòng khám.
                  </div>
                </div>
              </div>
            </div>

            <Button
              type="button"
              onClick={onSwitchToRoster}
              className="w-full text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white mt-2"
            >
              Mở danh sách nhân sự ({totalEmployees}) →
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
