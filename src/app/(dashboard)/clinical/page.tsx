"use client";

import * as React from "react";
import Link from "next/link";
import { PageHeader } from "@/shared/components/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/table";
import { useDemoJourneyStore } from "@/shared/stores/demo-journey.store";
import { useUIStore } from "@/shared/stores/ui.store";
import {
  Stethoscope,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Activity,
  FileCheck,
  Volume2,
  Sparkles,
} from "lucide-react";

export default function ClinicalWorklistPage() {
  const { showToast } = useUIStore();
  const {
    patientName,
    patientCode,
    encounterCode,
    initialExamTicket,
    returnExamTicket,
    labStatus,
    imagingStatus,
    currentStage,
    callReturnExam,
    startConclusion,
    callInitialExam,
    startInitialExam,
  } = useDemoJourneyStore();

  const isDiagnosticsDone = labStatus === "FINAL" && imagingStatus === "FINAL";

  const handleCallReturn = () => {
    callReturnExam();
    showToast(`Hệ thống phát âm thanh: "Xin mời số thứ tự P203-R015 - Bệnh nhân ${patientName} vào phòng 203 kết luận"`);
  };

  const handleStartConclusion = () => {
    startConclusion();
    showToast(`Bác sĩ bắt đầu buổi kết luận cho bệnh nhân ${patientName}`);
  };

  const initialExamWaitingList = [
    {
      stt: "P203-035",
      name: "Trần Thị Bích",
      code: "PT-003194",
      age: 52,
      gender: "Nữ",
      reason: "Đau tức thượng vị sau ăn 2 tuần, ợ chua nhiều",
      time: "12 phút chờ",
      href: "/encounters/ENC-260917-032",
    },
    {
      stt: "P203-038",
      name: "Lê Hoàng Nam",
      code: "PT-007812",
      age: 29,
      gender: "Nam",
      reason: "Ho khan kéo dài, tức ngực nhẹ khi gắng sức",
      time: "7 phút chờ",
      href: "/encounters/ENC-260917-032",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="HÀNG ĐỢI PHÒNG KHÁM CHUYÊN KHOA"
        title="Hàng đợi Bác sĩ — Phòng Khám 203 (BS. Lê Minh)"
        description="Phân luồng thông minh: Ưu tiên hàng đầu cho bệnh nhân quay lại sau cận lâm sàng (Auto-returned results) và bệnh nhân chờ khám ban đầu"
        action={
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-full text-xs font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Kết quả CLS tự động trả về máy tính (Paperless)
            </span>
          </div>
        }
      />

      {/* SECTION 1: RETURN FOR CONCLUSION PATIENTS (PRIORITY) */}
      <Card className="border-emerald-300 shadow-md bg-emerald-50/20 overflow-hidden">
        <CardHeader className="bg-emerald-100/60 p-4 border-b border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black">
              1
            </div>
            <div>
              <CardTitle className="text-sm font-black text-emerald-950 flex items-center gap-2">
                <span>1. Bệnh nhân quay lại sau khi đã đủ kết quả cận lâm sàng</span>
                <span className="px-2 py-0.2 rounded-full bg-emerald-700 text-white text-[11px] font-mono">
                  1 ca
                </span>
              </CardTitle>
              <span className="text-[11px] text-emerald-900 font-medium">
                Kết quả đã tự động trả về máy tính (Auto-return). Bệnh nhân không cần chờ lấy bản in giấy tại phòng CLS.
              </span>
            </div>
          </div>
          <Badge variant="success" className="font-bold text-xs uppercase self-start sm:self-auto py-1 px-2.5">
            ƯU TIÊN GỌI KHÁM SỐ 1
          </Badge>
        </CardHeader>

        <Table>
          <TableHeader className="bg-emerald-50/70 border-b border-emerald-200">
            <TableRow>
              <TableHead className="w-24 text-center font-bold text-emerald-950">Số thứ tự</TableHead>
              <TableHead className="font-bold text-emerald-950">Mã BN</TableHead>
              <TableHead className="font-bold text-emerald-950">Họ và tên người bệnh</TableHead>
              <TableHead className="font-bold text-emerald-950">Lý do khám ban đầu</TableHead>
              <TableHead className="font-bold text-emerald-950">Tóm tắt kết quả trả về</TableHead>
              <TableHead className="font-bold text-emerald-950 text-center">Trạng thái</TableHead>
              <TableHead className="text-right font-bold text-emerald-950">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <tr className="bg-emerald-50/70 hover:bg-emerald-100/50 transition-colors font-medium">
              <td className="p-3 text-center">
                <span className="font-mono text-sm font-black text-emerald-800 bg-white px-2 py-1 rounded-lg border border-emerald-300 shadow-xs block">
                  {returnExamTicket?.number || "P203-R015"}
                </span>
              </td>
              <td className="p-3 font-mono font-bold text-slate-800">{patientCode}</td>
              <td className="p-3">
                <div className="font-extrabold text-slate-900">{patientName}</div>
                <div className="text-[11px] text-slate-600">Nam, 45 tuổi • CCCD: 001081008892</div>
                <div className="text-[10px] text-red-600 font-bold">⚠ Dị ứng Penicillin</div>
              </td>
              <td className="p-3 text-slate-800 max-w-xs text-xs">
                Chóng mặt, đau đầu từng cơn vùng chẩm, THA
              </td>
              <td className="p-3">
                <div className="p-2 bg-white rounded-lg border border-emerald-300 text-xs space-y-0.5">
                  <div className="font-bold text-emerald-900 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Đã đủ 3/3 kết quả y lệnh
                  </div>
                  <div className="text-[11px] text-slate-700">
                    • <b>CTM: </b>Bạch cầu <span className="text-red-600 font-black">WBC 12.8 G/L ↑</span><br />
                    • <b>Sinh hóa: </b>Glucose 5.8 mmol/L<br />
                    • <b>ECG: </b>Dày thất trái nhẹ, nhịp xoang đều
                  </div>
                </div>
              </td>
              <td className="p-3 text-center">
                <Badge variant="success" className="text-[11px] font-bold py-1">
                  ĐÃ ĐỦ KẾT QUẢ
                </Badge>
              </td>
              <td className="p-3 text-right">
                <div className="flex items-center justify-end gap-1.5">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCallReturn}
                    className="h-8 text-xs font-bold border-emerald-400 text-emerald-900 hover:bg-emerald-100"
                    title="Phát loa gọi bệnh nhân vào phòng kết luận"
                  >
                    <Volume2 className="w-3.5 h-3.5 mr-1" />
                    Gọi loa
                  </Button>
                  <Link href="/encounters/ENC-260917-032">
                    <Button
                      size="sm"
                      onClick={handleStartConclusion}
                      className="font-bold text-xs h-8 bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm"
                    >
                      <span>Mời vào kết luận</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </Link>
                </div>
              </td>
            </tr>
          </TableBody>
        </Table>
      </Card>

      {/* SECTION 2: INITIAL EXAM PATIENTS */}
      <Card className="border-slate-200 shadow-sm bg-white">
        <CardHeader className="bg-slate-50/80 p-4 border-b border-slate-200 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black">
              2
            </div>
            <div>
              <CardTitle className="text-sm font-bold text-slate-900">
                2. Hàng đợi bệnh nhân chờ khám lần đầu (Initial Examination)
              </CardTitle>
              <span className="text-[11px] text-slate-500">
                Bệnh nhân vừa tiếp nhận từ quầy lễ tân đang ngồi chờ trước cửa phòng 203
              </span>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-slate-600">
            {initialExamWaitingList.length} ca chờ
          </span>
        </CardHeader>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24 text-center">Số thứ tự</TableHead>
              <TableHead>Mã BN</TableHead>
              <TableHead>Họ và tên</TableHead>
              <TableHead>Lý do vào khám</TableHead>
              <TableHead>Thời gian chờ</TableHead>
              <TableHead className="text-center">Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialExamWaitingList.map((p, idx) => (
              <tr key={idx} className="hover:bg-slate-50 transition-colors">
                <td className="p-3 text-center font-mono font-bold text-clinic-blue text-sm">
                  {p.stt}
                </td>
                <td className="p-3 font-mono text-slate-700 text-xs">{p.code}</td>
                <td className="p-3">
                  <div className="font-bold text-slate-900 text-xs">{p.name}</div>
                  <div className="text-[11px] text-slate-500">{p.gender}, {p.age} tuổi</div>
                </td>
                <td className="p-3 text-slate-700 text-xs">{p.reason}</td>
                <td className="p-3 text-slate-500 font-mono text-xs flex items-center gap-1 mt-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {p.time}
                </td>
                <td className="p-3 text-center">
                  <Badge variant="warn" className="text-[10px] font-bold">
                    Chờ khám
                  </Badge>
                </td>
                <td className="p-3 text-right">
                  <Link href={p.href}>
                    <Button size="sm" variant="outline" className="text-xs h-8 font-bold text-slate-700 hover:text-clinic-blue">
                      Gọi vào khám →
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
