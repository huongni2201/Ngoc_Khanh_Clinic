"use client";

import * as React from "react";
import { PageHeader } from "@/shared/components/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/table";
import { Building2, Users, FileSpreadsheet, PlusCircle, CheckCircle2 } from "lucide-react";

export default function HealthCheckPage() {
  const campaigns = [
    {
      code: "HC-2026-FPT",
      company: "Công ty Cổ phần Viễn thông FPT (FPT Telecom)",
      package: "Gói Khám Tiêu Chuẩn Doanh Nghiệp (Loại 2)",
      totalEmployees: 450,
      completed: 312,
      startDate: "10/09/2026",
      endDate: "25/09/2026",
      status: "IN_PROGRESS",
    },
    {
      code: "HC-2026-VIB",
      company: "Ngân hàng TMCP Quốc Tế Việt Nam (VIB Bank)",
      package: "Gói Khám Chuyên Sâu Cấp Quản Lý",
      totalEmployees: 120,
      completed: 120,
      startDate: "01/08/2026",
      endDate: "15/08/2026",
      status: "COMPLETED",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="KHÁM SỨC KHỎE DOANH NGHIỆP (UC-HC / ENTITIES: COMPANY)"
        title="Khám Sức Khỏe Doanh Nghiệp & Đoàn Thể"
        description="Quản lý chiến dịch khám đoàn theo hợp đồng doanh nghiệp, phân bổ danh mục dịch vụ và xuất sổ sức khỏe"
        action={
          <Button className="font-bold">
            <PlusCircle className="w-4 h-4 mr-1.5" />
            + Tạo chiến dịch khám đoàn mới
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-slate-200 shadow-sm p-4">
          <div className="text-xs text-slate-500 font-bold uppercase">Tổng nhân sự theo hợp đồng</div>
          <div className="text-2xl font-black text-slate-900 mt-1">570 CBNV</div>
          <span className="text-[11px] text-slate-500">2 hợp đồng đang triển khai</span>
        </Card>
        <Card className="border-slate-200 shadow-sm p-4">
          <div className="text-xs text-slate-500 font-bold uppercase">Đã hoàn thành khám & kết luận</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">432 CBNV</div>
          <span className="text-[11px] text-emerald-700 font-semibold">Tỷ lệ hoàn thành: 75.8%</span>
        </Card>
        <Card className="border-slate-200 shadow-sm p-4">
          <div className="text-xs text-slate-500 font-bold uppercase">Sổ sức khỏe đã ký số</div>
          <div className="text-2xl font-black text-clinic-blue mt-1">312 hồ sơ</div>
          <span className="text-[11px] text-slate-500">Sẵn sàng xuất file PDF / Excel</span>
        </Card>
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="bg-slate-50/70 p-4 border-b border-slate-200">
          <CardTitle className="text-sm font-bold text-slate-800">
            Danh sách chiến dịch khám sức khỏe định kỳ
          </CardTitle>
        </CardHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã HĐ</TableHead>
              <TableHead>Đơn vị / Doanh nghiệp</TableHead>
              <TableHead>Gói khám áp dụng</TableHead>
              <TableHead className="text-center">Tiến độ</TableHead>
              <TableHead>Thời gian</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campaigns.map((c, i) => (
              <TableRow key={i}>
                <td className="p-3 font-mono font-bold text-clinic-blue text-xs">{c.code}</td>
                <td className="p-3">
                  <div className="font-bold text-slate-900 text-xs">{c.company}</div>
                </td>
                <td className="p-3 text-xs text-slate-600">{c.package}</td>
                <td className="p-3 text-center text-xs">
                  <span className="font-bold text-slate-800">{c.completed}/{c.totalEmployees}</span>
                  <div className="w-24 h-1.5 bg-slate-200 rounded-full mx-auto mt-1 overflow-hidden">
                    <div
                      className="h-full bg-clinic-blue rounded-full"
                      style={{ width: `${(c.completed / c.totalEmployees) * 100}%` }}
                    />
                  </div>
                </td>
                <td className="p-3 text-xs text-slate-500 font-mono">{c.startDate} — {c.endDate}</td>
                <td className="p-3">
                  <Badge variant={c.status === "COMPLETED" ? "success" : "purple"} className="text-[10px] font-bold">
                    {c.status === "COMPLETED" ? "Đã nghiệm thu" : "Đang khám"}
                  </Badge>
                </td>
                <td className="p-3 text-right">
                  <Button size="sm" variant="outline" className="text-xs h-8 font-semibold">
                    <FileSpreadsheet className="w-3.5 h-3.5 mr-1" />
                    Xem danh sách
                  </Button>
                </td>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
