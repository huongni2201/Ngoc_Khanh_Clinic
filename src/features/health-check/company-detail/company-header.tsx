"use client";

import * as React from "react";
import Link from "next/link";
import { Company } from "@/entities/company/model/company.types";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import {
  Building2,
  FileText,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CreditCard,
  Edit,
  UploadCloud,
  PlusCircle,
  ArrowLeft,
} from "lucide-react";

interface CompanyHeaderProps {
  company: Company;
  onOpenImport: () => void;
  onOpenCreateBatch: () => void;
}

export function CompanyHeader({
  company,
  onOpenImport,
  onOpenCreateBatch,
}: CompanyHeaderProps) {
  return (
    <div className="space-y-4">
      {/* Back Link */}
      <Link
        href="/health-check"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-clinic-blue transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Quay lại Danh sách Doanh nghiệp
      </Link>

      {/* Main Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-blue-500/20 shrink-0">
              <Building2 className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl font-black text-slate-900 leading-tight">
                  {company.name}
                </h1>
                <Badge variant="purple" className="font-mono text-xs font-bold">
                  {company.code}
                </Badge>
                {company.status === "ACTIVE" ? (
                  <Badge variant="success" className="text-[10px]">Đang hoạt động</Badge>
                ) : (
                  <Badge variant="danger" className="text-[10px]">Tạm dừng</Badge>
                )}
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                {company.taxCode && (
                  <div>
                    Mã số thuế: <b className="text-slate-700 font-mono">{company.taxCode}</b>
                  </div>
                )}
                {company.contractCode && (
                  <div>
                    Hợp đồng: <b className="text-clinic-blue font-mono">{company.contractCode}</b>
                  </div>
                )}
                {company.defaultPayerSource && (
                  <div>
                    Nguồn chi trả: <b className="text-slate-700">{company.defaultPayerSource}</b>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onOpenImport}
              className="text-xs font-bold border-slate-300 bg-white hover:bg-slate-50"
            >
              <UploadCloud className="w-3.5 h-3.5 mr-1.5 text-clinic-blue" />
              Import nhân sự
            </Button>

            <Button
              type="button"
              size="sm"
              onClick={onOpenCreateBatch}
              className="text-xs font-bold bg-clinic-blue hover:bg-blue-700 text-white shadow-sm"
            >
              <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
              + Tạo đợt khám
            </Button>
          </div>
        </div>

        {/* Extended Details Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-100 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="truncate">{company.address || "Chưa cập nhật địa chỉ"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-slate-400 shrink-0" />
            <span>
              {company.contactName || "Đại diện"}: <b>{company.contactPhone || "Chưa có SĐT"}</b>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-clinic-blue shrink-0" />
            <span>
              Đợt khám hiện tại: <b className="text-slate-900">{company.latestBatchName || "Chưa tạo đợt khám"}</b>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
