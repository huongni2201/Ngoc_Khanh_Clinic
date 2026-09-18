"use client";

import * as React from "react";
import { PageHeader } from "@/shared/components/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/table";
import { Calendar, Clock, PlusCircle, CheckCircle2, MessageSquare } from "lucide-react";

export default function AppointmentsPage() {
  const appointments = [
    {
      code: "APT-260924-001",
      patient: "Nguyễn Văn An (PT-001842)",
      phone: "0912 345 678",
      date: "24/09/2026 (Thứ Năm)",
      time: "08:30",
      room: "P.203 — BS. Lê Minh",
      type: "Tái khám Tăng huyết áp (Định kỳ 1 tuần)",
      zaloStatus: "Đã gửi nhắc hẹn qua Zalo OA",
      status: "CONFIRMED",
    },
    {
      code: "APT-260924-004",
      patient: "Phạm Thị Lan (PT-009123)",
      phone: "0903 112 445",
      date: "24/09/2026 (Thứ Năm)",
      time: "09:00",
      room: "P.203 — BS. Lê Minh",
      type: "Tái khám đái tháo đường Type 2",
      zaloStatus: "Đã gửi SMS nhắc hẹn",
      status: "CONFIRMED",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="QUẢN LÝ LỊCH HẸN & TÁI KHÁM (UC-APT-01 → 04 / UC-NOT-01)"
        title="22. Lịch Hẹn & Tái Khám Bệnh Nhân"
        description="Quản lý lịch khám theo ca bác sĩ, liên kết Encounter gốc và tự động xếp lịch nhắc qua Zalo OA / SMS"
        action={
          <Button className="font-bold">
            <PlusCircle className="w-4 h-4 mr-1.5" />
            + Đặt lịch hẹn mới
          </Button>
        }
      />

      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="bg-slate-50/70 p-4 border-b border-slate-200 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-bold text-slate-800">
            Danh sách lịch hẹn tuần này (Phòng P.203 — BS. Lê Minh)
          </CardTitle>
          <span className="text-xs text-slate-500 font-medium">Khung giờ: 08:00 - 17:00</span>
        </CardHeader>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã hẹn</TableHead>
              <TableHead>Bệnh nhân</TableHead>
              <TableHead>Ngày & Giờ</TableHead>
              <TableHead>Chuyên khoa / Bác sĩ</TableHead>
              <TableHead>Mục đích khám</TableHead>
              <TableHead>Nhắc hẹn tự động</TableHead>
              <TableHead className="text-right">Trạng thái</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments.map((a, i) => (
              <TableRow key={i}>
                <td className="p-3 font-mono font-bold text-clinic-blue text-xs">{a.code}</td>
                <td className="p-3">
                  <div className="font-bold text-slate-900 text-xs">{a.patient}</div>
                  <div className="text-[11px] text-slate-500 font-mono">{a.phone}</div>
                </td>
                <td className="p-3 text-xs">
                  <div className="font-bold text-slate-800">{a.date}</div>
                  <div className="text-slate-500 font-mono">{a.time}</div>
                </td>
                <td className="p-3 text-xs font-semibold text-slate-700">{a.room}</td>
                <td className="p-3 text-xs text-slate-600">{a.type}</td>
                <td className="p-3 text-xs">
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                    {a.zaloStatus}
                  </span>
                </td>
                <td className="p-3 text-right">
                  <Badge variant="success" className="text-[10px] font-bold">
                    {a.status}
                  </Badge>
                </td>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
