"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CompanyEmployee } from "@/entities/company-employee/model/company-employee.types";
import { useCorporateHealthCheckStore } from "@/shared/stores/corporate-health-check.store";
import { useUIStore } from "@/shared/stores/ui.store";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Input } from "@/shared/ui/input";
import { ImportEmployeesDialog } from "../import-employees/import-employees-dialog";
import { BulkPrintToolbar } from "../bulk-print/bulk-print-toolbar";
import { generateSampleExcelFile } from "../import-employees/excel-reader.adapter";
import {
  UploadCloud,
  FileSpreadsheet,
  Download,
  Printer,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  UserCheck,
  Building2,
  Trash2,
  Plus,
} from "lucide-react";

interface EmployeeRosterProps {
  companyId: string;
}

export function EmployeeRoster({ companyId }: EmployeeRosterProps) {
  const router = useRouter();
  const { showToast } = useUIStore();
  const {
    getCompanyById,
    getEmployeesByCompanyId,
    selectedEmployeeIds,
    toggleSelectEmployee,
    selectAllValidEmployees,
    clearSelection,
    deleteEmployee,
  } = useCorporateHealthCheckStore();

  const company = getCompanyById(companyId);
  const employees = getEmployeesByCompanyId(companyId);

  const [importDialogOpen, setImportDialogOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filterStatus, setFilterStatus] = React.useState<string>("ALL");

  // Filtered employees
  const filteredEmployees = React.useMemo(() => {
    return employees.filter((emp) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        emp.fullName.toLowerCase().includes(q) ||
        emp.identityNumber.includes(q) ||
        (emp.employeeCode && emp.employeeCode.toLowerCase().includes(q)) ||
        (emp.department && emp.department.toLowerCase().includes(q));

      const matchesStatus =
        filterStatus === "ALL" ||
        (filterStatus === "VALID" && emp.validationStatus === "VALID") ||
        (filterStatus === "INCOMPLETE" && emp.validationStatus === "INCOMPLETE") ||
        (filterStatus === "UNDER_18" && emp.validationStatus === "UNDER_18") ||
        (filterStatus === "PRINTED" && emp.printStatus === "PRINTED") ||
        (filterStatus === "NOT_PRINTED" && emp.printStatus === "NOT_PRINTED");

      return matchesSearch && matchesStatus;
    });
  }, [employees, searchQuery, filterStatus]);

  // Check if all selectable eligible rows are selected
  const eligibleEmployees = employees.filter(
    (e) => e.validationStatus !== "UNDER_18" && e.validationStatus !== "DUPLICATE_IDENTITY" && e.age >= 18
  );
  const isAllEligibleSelected =
    eligibleEmployees.length > 0 &&
    eligibleEmployees.every((e) => selectedEmployeeIds.includes(e.id));

  const handleToggleSelectAll = () => {
    if (isAllEligibleSelected) {
      clearSelection();
    } else {
      selectAllValidEmployees(companyId);
    }
  };

  const handleDownloadSample = () => {
    const bytes = generateSampleExcelFile();
    const blob = new Blob([bytes.buffer as ArrayBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Mau_Danh_Sach_Nhan_Su_KSK_${company?.code || "NKC"}.xlsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast("Đã tải file Excel mẫu về máy.");
  };

  return (
    <div className="space-y-4">
      {/* Top Header & Quick Actions */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Danh sách nhân sự khám sức khỏe ({employees.length} người)
          </h3>
          <p className="text-xs text-slate-500">
            Quản lý hồ sơ nhân viên, trạng thái hợp lệ theo Mẫu 03 và chuẩn bị phiếu in ấn hàng loạt.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleDownloadSample}
            className="text-xs font-bold border-slate-300 bg-white text-slate-700"
          >
            <Download className="w-3.5 h-3.5 mr-1 text-clinic-blue" />
            Tải file Excel mẫu
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={() => setImportDialogOpen(true)}
            className="text-xs font-bold bg-clinic-blue hover:bg-blue-700 text-white shadow-sm"
          >
            <UploadCloud className="w-4 h-4 mr-1.5" />
            Import nhân sự từ Excel
          </Button>
        </div>
      </div>

      {/* EMPTY STATE IF NO EMPLOYEES */}
      {employees.length === 0 ? (
        <Card className="border-2 border-dashed border-slate-200 bg-slate-50/50 p-12 text-center shadow-none">
          <div className="max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-blue-100 text-clinic-blue flex items-center justify-center mx-auto shadow-inner">
              <FileSpreadsheet className="w-8 h-8" />
            </div>

            <div>
              <h4 className="text-base font-bold text-slate-900">
                Chưa có danh sách nhân sự cần khám
              </h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Bạn có thể nhập danh sách từ file Excel của doanh nghiệp để hệ thống tự động kiểm tra tính hợp lệ và chuẩn bị phiếu khám sức khỏe (Mẫu số 03) hàng loạt.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleDownloadSample}
                className="text-xs font-bold border-slate-300 bg-white"
              >
                <Download className="w-3.5 h-3.5 mr-1.5 text-clinic-blue" />
                Tải file Excel mẫu
              </Button>

              <Button
                type="button"
                size="sm"
                onClick={() => setImportDialogOpen(true)}
                className="text-xs font-bold bg-clinic-blue text-white shadow-md shadow-blue-500/20"
              >
                <UploadCloud className="w-4 h-4 mr-1.5" />
                Import danh sách nhân sự
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        /* TABLE OF EMPLOYEES */
        <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
          {/* Filter / Search Bar */}
          <div className="p-3 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3 flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm theo họ tên, CCCD, mã NV, phòng ban..."
                  className="pl-9 h-9 text-xs"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="h-9 px-3 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-700 outline-none"
              >
                <option value="ALL">Tất cả trạng thái ({employees.length})</option>
                <option value="VALID">Chỉ hợp lệ</option>
                <option value="INCOMPLETE">Thiếu thông tin</option>
                <option value="UNDER_18">Không đủ tuổi (&lt;18)</option>
                <option value="NOT_PRINTED">Chưa tạo phiếu</option>
                <option value="PRINTED">Đã tạo phiếu</option>
              </select>
            </div>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={isAllEligibleSelected}
                      onChange={handleToggleSelectAll}
                      className="w-4 h-4 rounded text-clinic-blue cursor-pointer"
                      title="Chọn tất cả nhân sự hợp lệ (>= 18 tuổi)"
                    />
                  </th>
                  <th className="p-3">Mã NV</th>
                  <th className="p-3">Họ và tên</th>
                  <th className="p-3">Ngày sinh</th>
                  <th className="p-3 text-center">Tuổi</th>
                  <th className="p-3">Giới tính</th>
                  <th className="p-3">CCCD / Hộ chiếu</th>
                  <th className="p-3">Phòng / Ban</th>
                  <th className="p-3">Nghề nghiệp / Chức danh</th>
                  <th className="p-3 text-center">Hồ sơ BN</th>
                  <th className="p-3 text-center">Phiếu khám</th>
                  <th className="p-3 text-center">Trạng thái khám</th>
                  <th className="p-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEmployees.map((emp) => {
                  const isUnder18 = emp.validationStatus === "UNDER_18" || emp.age < 18;
                  const isBlocked =
                    isUnder18 || emp.validationStatus === "DUPLICATE_IDENTITY";
                  const isSelected = selectedEmployeeIds.includes(emp.id);

                  return (
                    <tr
                      key={emp.id}
                      className={`hover:bg-blue-50/40 transition-colors ${
                        isSelected ? "bg-blue-50/60" : isUnder18 ? "bg-red-50/30" : ""
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          disabled={isBlocked}
                          checked={isSelected}
                          onChange={() => toggleSelectEmployee(emp.id)}
                          className="w-4 h-4 rounded text-clinic-blue cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                          title={
                            isUnder18
                              ? "Nhân sự dưới 18 tuổi không được phép in phiếu theo Mẫu số 03"
                              : isBlocked
                              ? "Hồ sơ lỗi không thể chọn để in"
                              : "Chọn để in"
                          }
                        />
                      </td>

                      {/* Employee Code */}
                      <td className="p-3 font-mono font-bold text-slate-700 text-[11px]">
                        {emp.employeeCode || "-"}
                      </td>

                      {/* Full Name & Validation Badge */}
                      <td className="p-3">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <span>{emp.fullName}</span>
                          {emp.validationStatus === "UNDER_18" ? (
                            <span className="text-[10px] font-bold text-red-700 bg-red-100 px-1.5 py-0.5 rounded border border-red-300">
                              Dưới 18 tuổi
                            </span>
                          ) : emp.validationStatus === "DUPLICATE_IDENTITY" ? (
                            <span className="text-[10px] font-bold text-red-700 bg-red-100 px-1.5 py-0.5 rounded border border-red-300">
                              Trùng CCCD
                            </span>
                          ) : emp.validationStatus === "INCOMPLETE" ? (
                            <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded border border-amber-300">
                              Thiếu tin
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-300">
                              Hợp lệ
                            </span>
                          )}
                        </div>
                        {emp.validationIssues && emp.validationIssues.length > 0 && (
                          <div className="text-[10px] text-red-600 mt-0.5">
                            {emp.validationIssues.join(", ")}
                          </div>
                        )}
                      </td>

                      {/* DOB */}
                      <td className="p-3 text-slate-600 font-mono text-[11px]">
                        {emp.dateOfBirth}
                      </td>

                      {/* Age */}
                      <td className="p-3 text-center">
                        <span
                          className={`font-mono font-bold ${
                            emp.age < 18 ? "text-red-600" : "text-slate-800"
                          }`}
                        >
                          {emp.age}
                        </span>
                      </td>

                      {/* Gender */}
                      <td className="p-3 text-slate-700">
                        {emp.gender === "MALE" ? "Nam" : "Nữ"}
                      </td>

                      {/* Identity Number */}
                      <td className="p-3 font-mono font-semibold text-slate-800 text-[11px]">
                        {emp.identityNumber}
                      </td>

                      {/* Department */}
                      <td className="p-3 text-slate-600">
                        {emp.department || "-"}
                      </td>

                      {/* Occupation */}
                      <td className="p-3 text-slate-600">
                        {emp.occupation || "-"}
                      </td>

                      {/* Patient Profile Link Status */}
                      <td className="p-3 text-center">
                        {emp.patientProfileStatus === "LINKED" ? (
                          <Badge variant="success" className="text-[10px]">
                            Đã có hồ sơ
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px] text-slate-500 border-slate-300">
                            Chưa có hồ sơ
                          </Badge>
                        )}
                      </td>

                      {/* Print Status */}
                      <td className="p-3 text-center">
                        {emp.printStatus === "PRINTED" ? (
                          <Badge variant="purple" className="text-[10px]">
                            Đã tạo phiếu
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px] text-slate-400 border-slate-200">
                            Chưa tạo phiếu
                          </Badge>
                        )}
                      </td>

                      {/* Exam Progress Status */}
                      <td className="p-3 text-center">
                        {emp.examStatus === "COMPLETED" ? (
                          <Badge variant="success" className="text-[10px]">Hoàn thành</Badge>
                        ) : emp.examStatus === "IN_EXAM" ? (
                          <Badge variant="purple" className="text-[10px]">Đang khám</Badge>
                        ) : emp.examStatus === "CHECKED_IN" ? (
                          <Badge variant="default" className="text-[10px]">Đã tiếp nhận</Badge>
                        ) : emp.examStatus === "PENDING_CONCLUSION" ? (
                          <Badge variant="warn" className="text-[10px]">Chờ kết luận</Badge>
                        ) : (
                          <span className="text-[11px] text-slate-400">Chưa đến</span>
                        )}
                      </td>

                      {/* Row Actions */}
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/health-check/print/preview?employeeId=${emp.id}`}
                            className={isUnder18 ? "pointer-events-none opacity-40" : ""}
                          >
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              disabled={isUnder18}
                              className="h-7 px-2 text-[11px] font-semibold text-clinic-blue border-slate-300 hover:bg-blue-50"
                              title={
                                isUnder18
                                  ? "Không thể in phiếu cho người dưới 18 tuổi"
                                  : "Xem trước & In phiếu Mẫu số 03"
                              }
                            >
                              <Printer className="w-3 h-3 mr-1" />
                              In phiếu
                            </Button>
                          </Link>

                          <button
                            type="button"
                            onClick={() => {
                              deleteEmployee(emp.id);
                              showToast(`Đã xóa nhân sự ${emp.fullName}`);
                            }}
                            className="p-1 rounded text-slate-400 hover:text-red-600 transition-colors"
                            title="Xóa nhân sự khỏi danh sách"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Bulk Print Floating Toolbar */}
      <BulkPrintToolbar companyId={companyId} />

      {/* Import Wizard Dialog */}
      <ImportEmployeesDialog
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
        companyId={companyId}
      />
    </div>
  );
}
