"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Company } from "@/entities/company/model/company.types";
import { useCorporateHealthCheckStore } from "@/shared/stores/corporate-health-check.store";
import { useUIStore } from "@/shared/stores/ui.store";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Input } from "@/shared/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/ui/dialog";
import { generateSampleExcelFile } from "../import-employees/excel-reader.adapter";
import {
  Building2,
  Users,
  Search,
  PlusCircle,
  Download,
  Phone,
  FileSpreadsheet,
  ArrowRight,
  CheckCircle2,
  Calendar,
} from "lucide-react";

export function CompanyList() {
  const router = useRouter();
  const { showToast } = useUIStore();
  const { companies, addCompany, employees } = useCorporateHealthCheckStore();

  const [searchQuery, setSearchQuery] = React.useState("");
  const [filterStatus, setFilterStatus] = React.useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");
  const [createModalOpen, setCreateModalOpen] = React.useState(false);

  // New Company form states
  const [newCode, setNewCode] = React.useState("");
  const [newName, setNewName] = React.useState("");
  const [newTaxCode, setNewTaxCode] = React.useState("");
  const [newAddress, setNewAddress] = React.useState("");
  const [newContactName, setNewContactName] = React.useState("");
  const [newContactPhone, setNewContactPhone] = React.useState("");
  const [newContactEmail, setNewContactEmail] = React.useState("");
  const [newContractCode, setNewContractCode] = React.useState("");
  const [newPayerSource, setNewPayerSource] = React.useState("");

  // Filtered companies
  const filteredCompanies = React.useMemo(() => {
    return companies.filter((c) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        (c.taxCode && c.taxCode.includes(q)) ||
        (c.contactName && c.contactName.toLowerCase().includes(q)) ||
        (c.contractCode && c.contractCode.toLowerCase().includes(q));

      const matchesStatus = filterStatus === "ALL" || c.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [companies, searchQuery, filterStatus]);

  const handleDownloadSample = () => {
    const bytes = generateSampleExcelFile();
    const blob = new Blob([bytes.buffer as ArrayBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Mau_Danh_Sach_Nhan_Su_KSK_NgocKhanhClinic.xlsx";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast("Đã tải file Excel mẫu về máy.");
  };

  const handleCreateCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim() || !newName.trim()) {
      showToast("Vui lòng nhập đầy đủ Mã và Tên doanh nghiệp");
      return;
    }

    const created = addCompany({
      code: newCode.trim().toUpperCase(),
      name: newName.trim(),
      taxCode: newTaxCode.trim() || undefined,
      address: newAddress.trim() || undefined,
      contactName: newContactName.trim() || undefined,
      contactPhone: newContactPhone.trim() || undefined,
      contactEmail: newContactEmail.trim() || undefined,
      contractCode: newContractCode.trim() || undefined,
      defaultPayerSource: newPayerSource.trim() || `${newName.trim()} chi trả`,
      status: "ACTIVE",
    });

    showToast(`Đã thêm doanh nghiệp mới: ${created.name}`);
    setCreateModalOpen(false);

    // Reset form
    setNewCode("");
    setNewName("");
    setNewTaxCode("");
    setNewAddress("");
    setNewContactName("");
    setNewContactPhone("");
    setNewContactEmail("");
    setNewContractCode("");
    setNewPayerSource("");

    // Navigate to new company detail
    router.push(`/health-check/companies/${created.id}`);
  };

  return (
    <div className="space-y-4">
      {/* Search & Actions Bar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tên, mã DN, MST, người liên hệ, số HĐ..."
              className="pl-9 h-9 text-xs"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as "ALL" | "ACTIVE" | "INACTIVE")}
            className="h-9 px-3 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-700 outline-none"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="ACTIVE">Đang hoạt động</option>
            <option value="INACTIVE">Tạm dừng</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleDownloadSample}
            className="text-xs font-bold border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
          >
            <Download className="w-3.5 h-3.5 mr-1.5 text-clinic-blue" />
            Tải file Excel mẫu
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={() => setCreateModalOpen(true)}
            className="text-xs font-bold bg-clinic-blue hover:bg-blue-700 text-white shadow-sm"
          >
            <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
            + Thêm doanh nghiệp
          </Button>
        </div>
      </div>

      {/* Table of Companies */}
      <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
        {filteredCompanies.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Building2 className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="text-sm font-bold text-slate-800">
              {searchQuery ? "Không tìm thấy doanh nghiệp phù hợp" : "Chưa có doanh nghiệp khám sức khỏe"}
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {searchQuery
                ? "Thử tìm với từ khóa khác hoặc xóa bộ lọc."
                : "Thêm doanh nghiệp đầu tiên để bắt đầu quản lý danh sách nhân sự và đợt khám định kỳ."}
            </p>
            {!searchQuery && (
              <Button
                type="button"
                size="sm"
                onClick={() => setCreateModalOpen(true)}
                className="text-xs font-bold bg-clinic-blue text-white mt-2"
              >
                + Thêm doanh nghiệp
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3">Mã DN</th>
                  <th className="p-3">Doanh nghiệp</th>
                  <th className="p-3">Mã số thuế</th>
                  <th className="p-3">Người liên hệ</th>
                  <th className="p-3 text-center">Số nhân sự</th>
                  <th className="p-3 text-center">Đã tạo phiếu</th>
                  <th className="p-3 text-center">Đã khám</th>
                  <th className="p-3">Đợt khám gần nhất</th>
                  <th className="p-3 text-center">Trạng thái</th>
                  <th className="p-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCompanies.map((c) => {
                  const compEmployees = employees.filter((e) => e.companyId === c.id);
                  const count = compEmployees.length || c.employeeCount || 0;
                  const printed =
                    compEmployees.filter((e) => e.printStatus === "PRINTED").length ||
                    c.printedCount ||
                    0;
                  const completed =
                    compEmployees.filter((e) => e.examStatus === "COMPLETED").length ||
                    c.completedCount ||
                    0;

                  return (
                    <tr
                      key={c.id}
                      onClick={() => router.push(`/health-check/companies/${c.id}`)}
                      className="hover:bg-blue-50/50 cursor-pointer transition-colors"
                    >
                      <td className="p-3 font-mono font-bold text-clinic-blue">
                        {c.code}
                      </td>

                      <td className="p-3">
                        <div className="font-bold text-slate-900 text-xs hover:text-clinic-blue">
                          {c.name}
                        </div>
                        {c.contractCode && (
                          <div className="text-[10px] text-slate-400 font-mono">
                            HĐ: {c.contractCode}
                          </div>
                        )}
                      </td>

                      <td className="p-3 font-mono text-slate-700">
                        {c.taxCode || "-"}
                      </td>

                      <td className="p-3">
                        <div className="font-medium text-slate-800">{c.contactName || "-"}</div>
                        {c.contactPhone && (
                          <div className="text-[11px] text-slate-500 font-mono">{c.contactPhone}</div>
                        )}
                      </td>

                      <td className="p-3 text-center font-mono font-bold text-slate-900">
                        {count}
                      </td>

                      <td className="p-3 text-center">
                        <span className="font-mono font-bold text-clinic-blue">
                          {printed}
                        </span>
                        {count > 0 && (
                          <span className="text-[10px] text-slate-400 block font-normal">
                            ({Math.round((printed / count) * 100)}%)
                          </span>
                        )}
                      </td>

                      <td className="p-3 text-center font-mono font-bold text-emerald-700">
                        {completed}
                      </td>

                      <td className="p-3 text-slate-600">
                        <div className="truncate max-w-xs">{c.latestBatchName || "Chưa tạo"}</div>
                      </td>

                      <td className="p-3 text-center">
                        {c.status === "ACTIVE" ? (
                          <Badge variant="success" className="text-[10px]">Hoạt động</Badge>
                        ) : (
                          <Badge variant="danger" className="text-[10px]">Tạm dừng</Badge>
                        )}
                      </td>

                      <td className="p-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <Link href={`/health-check/companies/${c.id}`}>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 text-xs font-semibold text-clinic-blue hover:bg-blue-50 border-slate-300"
                          >
                            Xem chi tiết
                            <ArrowRight className="w-3 h-3 ml-1" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* CREATE COMPANY MODAL */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="max-w-xl bg-white p-6">
          <DialogHeader className="border-b border-slate-200 pb-3">
            <span className="text-[10px] font-black uppercase text-clinic-blue tracking-wider">
              KHÁM SỨC KHỎE DOANH NGHIỆP
            </span>
            <DialogTitle className="text-base font-bold text-slate-900 mt-0.5">
              Thêm Doanh Nghiệp Mới
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateCompany} className="space-y-4 py-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-800 block">
                  Mã doanh nghiệp: <span className="text-red-500">*</span>
                </label>
                <Input
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  required
                  className="font-mono text-xs uppercase"
                  placeholder="VD: FPT, VIB, VNPT"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800 block">Mã số thuế:</label>
                <Input
                  value={newTaxCode}
                  onChange={(e) => setNewTaxCode(e.target.value)}
                  className="font-mono text-xs"
                  placeholder="VD: 0101778163"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-800 block">
                Tên doanh nghiệp đầy đủ: <span className="text-red-500">*</span>
              </label>
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                required
                className="text-xs font-semibold"
                placeholder="VD: Công ty Cổ phần Viễn thông FPT"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-800 block">Địa chỉ trụ sở / Chi nhánh:</label>
              <Input
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                className="text-xs"
                placeholder="VD: Phố Duy Tân, Dịch Vọng Hậu, Cầu Giấy, Hà Nội"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-800 block">Người liên hệ / HR:</label>
                <Input
                  value={newContactName}
                  onChange={(e) => setNewContactName(e.target.value)}
                  className="text-xs"
                  placeholder="VD: Trần Mai Anh"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800 block">Số điện thoại:</label>
                <Input
                  value={newContactPhone}
                  onChange={(e) => setNewContactPhone(e.target.value)}
                  className="text-xs font-mono"
                  placeholder="VD: 0912 345 678"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800 block">Email liên hệ:</label>
                <Input
                  type="email"
                  value={newContactEmail}
                  onChange={(e) => setNewContactEmail(e.target.value)}
                  className="text-xs"
                  placeholder="VD: hr@fpt.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-800 block">Mã hợp đồng dịch vụ:</label>
                <Input
                  value={newContractCode}
                  onChange={(e) => setNewContractCode(e.target.value)}
                  className="font-mono text-xs"
                  placeholder="VD: HĐ-2026/FPT-NKC"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800 block">Nguồn chi trả mặc định:</label>
                <Input
                  value={newPayerSource}
                  onChange={(e) => setNewPayerSource(e.target.value)}
                  className="text-xs"
                  placeholder="VD: Công ty chi trả 100%"
                />
              </div>
            </div>

            <DialogFooter className="pt-2 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setCreateModalOpen(false)}
                className="text-xs"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                size="sm"
                className="text-xs font-bold bg-clinic-blue text-white px-5"
              >
                Lưu doanh nghiệp & Khởi tạo
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
