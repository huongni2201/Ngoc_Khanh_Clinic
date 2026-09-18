"use client";

import * as React from "react";
import Link from "next/link";
import { PageHeader } from "@/shared/components/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/table";
import { Stethoscope, ArrowRight, Clock, CheckCircle2, AlertCircle } from "lucide-react";

export default function ClinicalWorklistPage() {
  const returnPatients = [
    {
      stt: "#032",
      name: "Nguyễn Văn An",
      code: "PT-001842",
      age: 45,
      gender: "Nam",
      reason: "Chóng mặt, đau đầu, THA",
      orderSummary: "CTM (WBC 12.8 ↑), Glucose 5.8, ECG dày thất trái",
      status: "RESULTS_COMPLETE",
      time: "08:15 (Đã đủ 3/3 KQ)",
      href: "/encounters/ENC-260917-032",
    },
  ];

  const newPatients = [
    {
      stt: "#035",
      name: "Trần Thị Bích",
      code: "PT-003194",
      age: 52,
      gender: "Nữ",
      reason: "Đau tức thượng vị sau ăn 2 tuần",
      status: "WAITING_FOR_EXAM",
      time: "08:45 (Đang chờ)",
      href: "/encounters/ENC-260917-032",
    },
    {
      stt: "#038",
      name: "Lê Hoàng Nam",
      code: "PT-007812",
      age: 29,
      gender: "Nam",
      reason: "Ho khan kéo dài, tức ngực khi gắng sức",
      status: "WAITING_FOR_EXAM",
      time: "08:50 (Đang chờ)",
      href: "/encounters/ENC-260917-032",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="HÀNG ĐỢI PHÒNG KHÁM (UC-CLN-01 / FR-CLN-001)"
        title="Doctor Worklist — Phòng Khám 203 (BS. Lê Minh)"
        description="Phân loại hàng đợi thông minh: ưu tiên các ca đã đủ kết quả CLS quay lại kết luận và các ca mới tiếp nhận"
      />

      {/* Section 1: Returned Patients with Auto-Returned Results */}
      <Card className="border-emerald-200 shadow-sm bg-emerald-50/20">
        <CardHeader className="bg-emerald-100/50 p-4 border-b border-emerald-200 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <div>
              <CardTitle className="text-sm font-black text-emerald-950">
                1. Bệnh nhân quay lại sau khi đã đủ kết quả cận lâm sàng ({returnPatients.length} ca)
              </CardTitle>
              <span className="text-[11px] text-emerald-800">
                Kết quả đã tự động trả về máy tính (Auto-return). Không cần bệnh nhân mang bản in giấy.
              </span>
            </div>
          </div>
          <Badge variant="success" className="font-bold">ƯU TIÊN GỌI KHÁM</Badge>
        </CardHeader>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16 text-center">STT</TableHead>
              <TableHead>Mã BN</TableHead>
              <TableHead>Họ và tên</TableHead>
              <TableHead>Lý do khám</TableHead>
              <TableHead>Tóm tắt kết quả trả về</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {returnPatients.map((p, idx) => (
              <tr key={idx} className="bg-emerald-50/60 font-medium">
                <td className="p-3 text-center font-black text-emerald-700 font-mono text-sm">{p.stt}</td>
                <td className="p-3 font-mono font-bold text-slate-700">{p.code}</td>
                <td className="p-3">
                  <div className="font-bold text-slate-900">{p.name}</div>
                  <div className="text-[11px] text-slate-500">{p.gender}, {p.age}T</div>
                </td>
                <td className="p-3 text-slate-700">{p.reason}</td>
                <td className="p-3">
                  <span className="px-2 py-1 rounded bg-white border border-emerald-300 text-[11px] text-emerald-950 font-bold block">
                    {p.orderSummary}
                  </span>
                </td>
                <td className="p-3">
                  <Badge variant="success" className="font-bold text-[10px]">RESULTS_COMPLETE</Badge>
                </td>
                <td className="p-3 text-right">
                  <Link href={p.href}>
                    <Button size="sm" variant="success" className="font-bold text-xs h-8">
                      Mời vào kết luận →
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Section 2: Waiting for First Exam */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="bg-slate-50/70 p-4 border-b border-slate-200">
          <CardTitle className="text-sm font-bold text-slate-800">
            2. Hàng đợi bệnh nhân chờ khám lần đầu ({newPatients.length} ca)
          </CardTitle>
        </CardHeader>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16 text-center">STT</TableHead>
              <TableHead>Mã BN</TableHead>
              <TableHead>Họ và tên</TableHead>
              <TableHead>Lý do khám</TableHead>
              <TableHead>Thời gian chờ</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {newPatients.map((p, idx) => (
              <tr key={idx} className="hover:bg-slate-50">
                <td className="p-3 text-center font-bold text-clinic-blue font-mono">{p.stt}</td>
                <td className="p-3 font-mono text-slate-700">{p.code}</td>
                <td className="p-3 font-bold text-slate-900">{p.name}</td>
                <td className="p-3 text-slate-700">{p.reason}</td>
                <td className="p-3 text-slate-500 font-mono text-xs">{p.time}</td>
                <td className="p-3">
                  <Badge variant="warn" className="text-[10px] font-bold">Chờ khám</Badge>
                </td>
                <td className="p-3 text-right">
                  <Link href={p.href}>
                    <Button size="sm" variant="outline" className="text-xs h-8 font-semibold">
                      Gọi khám
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
