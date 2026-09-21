"use client";

import * as React from "react";
import { HealthCheckBatch } from "@/entities/health-check/model/health-check.types";
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
import { PlusCircle, Calendar, FileText, CheckCircle2, Clock } from "lucide-react";

interface CompanyBatchesTabProps {
  companyId: string;
  createModalOpen: boolean;
  onCreateModalOpenChange: (open: boolean) => void;
}

export function CompanyBatchesTab({
  companyId,
  createModalOpen,
  onCreateModalOpenChange,
}: CompanyBatchesTabProps) {
  const { showToast } = useUIStore();
  const { getBatchesByCompanyId, addBatch, getCompanyById } = useCorporateHealthCheckStore();
  const company = getCompanyById(companyId);
  const batches = getBatchesByCompanyId(companyId);

  // Form states for creating new batch
  const [batchCode, setBatchCode] = React.useState(`BATCH-${company?.code || "COMP"}-${new Date().getFullYear()}-02`);
  const [batchName, setBatchName] = React.useState("Khám sức khỏe định kỳ đợt bổ sung");
  const [examDate, setExamDate] = React.useState("2026-10-15");
  const [startDate, setStartDate] = React.useState("2026-10-10");
  const [endDate, setEndDate] = React.useState("2026-10-25");
  const [reason, setReason] = React.useState("Khám sức khỏe định kỳ theo Thông tư BYT 2026");

  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchCode.trim() || !batchName.trim()) {
      showToast("Vui lòng nhập đầy đủ mã và tên đợt khám");
      return;
    }

    addBatch({
      companyId,
      code: batchCode.trim(),
      name: batchName.trim(),
      examinationDate: examDate,
      startDate,
      endDate,
      reasonForHealthCheck: reason,
      defaultPayerSource: company?.defaultPayerSource || `${company?.name} chi trả`,
      templateCode: "BYT_2026_M03",
      status: "READY",
    });

    showToast(`Đã tạo đợt khám mới: ${batchName}`);
    onCreateModalOpenChange(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Các đợt khám sức khỏe ({batches.length})
          </h3>
          <p className="text-xs text-slate-500">
            Một doanh nghiệp có thể triển khai nhiều đợt khám theo thời gian hoặc theo phân loại đối tượng nhân sự.
          </p>
        </div>

        <Button
          type="button"
          size="sm"
          onClick={() => onCreateModalOpenChange(true)}
          className="text-xs font-bold bg-clinic-blue hover:bg-blue-700 text-white"
        >
          <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
          + Tạo đợt khám mới
        </Button>
      </div>

      <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3">Mã đợt</th>
                <th className="p-3">Tên đợt khám</th>
                <th className="p-3">Ngày khám thực tế</th>
                <th className="p-3">Thời gian hợp đồng</th>
                <th className="p-3">Biểu mẫu áp dụng</th>
                <th className="p-3 text-center">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {batches.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/50">
                  <td className="p-3 font-mono font-bold text-clinic-blue">
                    {b.code}
                  </td>
                  <td className="p-3">
                    <div className="font-bold text-slate-900">{b.name}</div>
                    <div className="text-[11px] text-slate-500">{b.reasonForHealthCheck}</div>
                  </td>
                  <td className="p-3 font-mono text-slate-800 font-bold">
                    {b.examinationDate || "Chưa ấn định"}
                  </td>
                  <td className="p-3 text-slate-600 font-mono text-[11px]">
                    {b.startDate} — {b.endDate}
                  </td>
                  <td className="p-3">
                    <Badge variant="outline" className="text-[10px] font-mono border-blue-300 text-clinic-blue bg-blue-50">
                      Mẫu số 03 (≥18T)
                    </Badge>
                  </td>
                  <td className="p-3 text-center">
                    <Badge
                      variant={b.status === "COMPLETED" ? "success" : b.status === "IN_PROGRESS" ? "purple" : "outline"}
                      className="text-[10px] font-bold"
                    >
                      {b.status === "COMPLETED"
                        ? "Đã hoàn thành"
                        : b.status === "IN_PROGRESS"
                        ? "Đang khám"
                        : b.status === "READY"
                        ? "Sẵn sàng"
                        : "Bản nháp"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* CREATE BATCH MODAL */}
      <Dialog open={createModalOpen} onOpenChange={onCreateModalOpenChange}>
        <DialogContent className="max-w-lg bg-white p-6">
          <DialogHeader className="border-b border-slate-200 pb-3">
            <span className="text-[10px] font-black uppercase text-clinic-blue tracking-wider">
              {company?.name}
            </span>
            <DialogTitle className="text-base font-bold text-slate-900 mt-0.5">
              Tạo Đợt Khám Sức Khỏe Mới
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateBatch} className="space-y-4 py-3 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-800 block">
                Mã đợt khám: <span className="text-red-500">*</span>
              </label>
              <Input
                value={batchCode}
                onChange={(e) => setBatchCode(e.target.value)}
                required
                className="font-mono text-xs font-semibold"
                placeholder="VD: BATCH-FPT-2026-02"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-800 block">
                Tên đợt khám: <span className="text-red-500">*</span>
              </label>
              <Input
                value={batchName}
                onChange={(e) => setBatchName(e.target.value)}
                required
                className="text-xs font-semibold"
                placeholder="VD: Khám sức khỏe định kỳ đợt 2"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-800 block">
                  Ngày khám thực tế: <span className="text-red-500">*</span>
                </label>
                <Input
                  type="date"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  required
                  className="text-xs font-mono"
                />
                <span className="text-[10px] text-slate-500">Dùng để xác định độ tuổi ≥ 18</span>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800 block">Biểu mẫu y tế:</label>
                <Input
                  value="Mẫu số 03 (BYT 2026)"
                  disabled
                  className="text-xs bg-slate-100 font-bold text-clinic-blue"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-800 block">Ngày bắt đầu hợp đồng:</label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="text-xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800 block">Ngày kết thúc hợp đồng:</label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="text-xs font-mono"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-800 block">Lý do khám sức khỏe:</label>
              <Input
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="text-xs font-semibold"
              />
            </div>

            <DialogFooter className="pt-2 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onCreateModalOpenChange(false)}
                className="text-xs"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                size="sm"
                className="text-xs font-bold bg-clinic-blue text-white px-5"
              >
                Lưu đợt khám
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
