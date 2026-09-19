"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/shared/components/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/table";
import { useDemoClinicFlowStore } from "@/shared/stores/demo-clinic-flow.store";
import { useWorkspaceStore } from "@/shared/stores/workspace.store";
import { useUIStore } from "@/shared/stores/ui.store";
import {
  Stethoscope,
  ArrowRight,
  Clock,
  CheckCircle2,
  Activity,
  FileCheck,
  AlertCircle,
  FlaskConical,
  Users,
} from "lucide-react";

export default function ClinicalWorklistPage() {
  const router = useRouter();
  const { showToast } = useUIStore();
  const { setActiveTab } = useWorkspaceStore();

  const {
    patientName,
    patientCode,
    encounterCode,
    journeyStage,
    labStatus,
    imagingStatus,
    initialExamFeePaid,
    startDoctorExam,
    startConclusion,
  } = useDemoClinicFlowStore();

  const isConclusionReady =
    journeyStage === "WAITING_FOR_CONCLUSION" ||
    journeyStage === "IN_CONCLUSION" ||
    (labStatus === "FINAL" && imagingStatus === "FINAL");

  const isInitialExamReady =
    journeyStage === "WAITING_FOR_DOCTOR" ||
    journeyStage === "IN_EXAM" ||
    journeyStage === "REGISTERED";

  const handleStartExam = () => {
    startDoctorExam();
    setActiveTab("EXAM");
    showToast(`Bác sĩ bắt đầu khám cho bệnh nhân ${patientName}`);
    router.push(`/encounters/${encounterCode}`);
  };

  const handleOpenConclusion = () => {
    startConclusion();
    setActiveTab("RESULTS");
    showToast(`Bác sĩ mở xem kết quả & kết luận cho bệnh nhân ${patientName}`);
    router.push(`/encounters/${encounterCode}`);
  };

  // Additional mock patients in waiting list
  const otherInitialPatients = [
    {
      code: "PT-003194",
      name: "Trần Thị Bích",
      age: 52,
      gender: "Nữ",
      reason: "Đau tức thượng vị sau ăn 2 tuần, ợ chua nhiều",
      arrivedAt: "08:45",
      waitTime: "12 phút",
    },
    {
      code: "PT-007812",
      name: "Lê Hoàng Nam",
      age: 29,
      gender: "Nam",
      reason: "Ho khan kéo dài, tức ngực nhẹ khi gắng sức",
      arrivedAt: "08:50",
      waitTime: "7 phút",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="DANH SÁCH BỆNH NHÂN CHỜ KHÁM"
        title="Danh sách chờ Bác sĩ — Phòng Khám 203 (BS. Lê Minh)"
        description="Phân luồng 2 nhóm: Ưu tiên số 1 cho bệnh nhân đã có đủ kết quả cận lâm sàng (Auto-return) và nhóm bệnh nhân chờ khám lần đầu"
        action={
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-full text-xs font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Kết quả CLS tự động trả về máy tính (Auto-return)
            </span>
          </div>
        }
      />

      {/* SECTION 1: WAITING FOR CONCLUSION (CHỜ BÁC SĨ KẾT LUẬN - PRIORITY 1) */}
      <Card className="border-emerald-300 shadow-md bg-emerald-50/20 overflow-hidden">
        <CardHeader className="bg-emerald-100/60 p-4 border-b border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black">
              1
            </div>
            <div>
              <CardTitle className="text-sm font-black text-emerald-950 flex items-center gap-2">
                <span>1. Bệnh nhân chờ bác sĩ kết luận (Đã có đủ kết quả CLS)</span>
                <span className="px-2 py-0.2 rounded-full bg-emerald-700 text-white text-[11px] font-mono font-bold">
                  {isConclusionReady ? "1 ca" : "0 ca"}
                </span>
              </CardTitle>
              <span className="text-[11px] text-emerald-900 font-medium">
                Kết quả từ phòng Xét nghiệm và CĐHA đã tự động trả về máy bác sĩ. Bệnh nhân không cần mang kết quả giấy.
              </span>
            </div>
          </div>
          <Badge variant="success" className="font-bold text-xs uppercase self-start sm:self-auto py-1 px-2.5">
            ƯU TIÊN GỌI KHÁM SỐ 1
          </Badge>
        </CardHeader>

        {isConclusionReady ? (
          <Table>
            <TableHeader className="bg-emerald-50/70 border-b border-emerald-200">
              <TableRow>
                <TableHead className="font-bold text-emerald-950">Mã BN</TableHead>
                <TableHead className="font-bold text-emerald-950">Họ và tên người bệnh</TableHead>
                <TableHead className="font-bold text-emerald-950">Lý do khám ban đầu</TableHead>
                <TableHead className="font-bold text-emerald-950">Kết quả CLS tự động trả về</TableHead>
                <TableHead className="font-bold text-emerald-950 text-center">Trạng thái</TableHead>
                <TableHead className="text-right font-bold text-emerald-950">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <tr className="bg-emerald-50/70 hover:bg-emerald-100/50 transition-colors font-medium">
                <td className="p-3 font-mono font-bold text-slate-800">{patientCode}</td>
                <td className="p-3">
                  <div className="font-extrabold text-slate-900 text-xs">{patientName}</div>
                  <div className="text-[11px] text-slate-600">Nam, 45 tuổi • CCCD: 001081008892</div>
                  <div className="text-[10px] text-red-600 font-bold">⚠ Dị ứng Penicillin</div>
                </td>
                <td className="p-3 text-slate-800 max-w-xs text-xs">
                  Chóng mặt, đau đầu từng cơn vùng chẩm, THA
                </td>
                <td className="p-3">
                  <div className="p-2.5 bg-white rounded-xl border border-emerald-300 text-xs space-y-1">
                    <div className="font-bold text-emerald-900 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      3/3 kết quả hoàn tất (Auto-returned)
                    </div>
                    <div className="text-[11px] text-slate-700 space-y-0.5">
                      <div>• <b>CTM: </b>Bạch cầu <span className="text-red-600 font-bold">WBC 12.8 G/L ↑</span></div>
                      <div>• <b>Glucose máu: </b>5.8 mmol/L (Bình thường)</div>
                      <div>• <b>ECG: </b>Nhịp xoang 82 ck/p, dày thất trái nhẹ</div>
                    </div>
                    <div className="text-[10px] text-slate-400">Kết quả mới nhất: 10:14</div>
                  </div>
                </td>
                <td className="p-3 text-center">
                  <Badge variant="success" className="text-[11px] font-bold py-1">
                    ĐỦ 3/3 KẾT QUẢ
                  </Badge>
                </td>
                <td className="p-3 text-right">
                  <Button
                    size="sm"
                    onClick={handleOpenConclusion}
                    className="font-bold text-xs h-9 bg-emerald-700 hover:bg-emerald-800 text-white shadow-md shadow-emerald-700/20"
                  >
                    <span>Mở hồ sơ & Kết luận</span>
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </td>
              </tr>
            </TableBody>
          </Table>
        ) : (
          <div className="p-6 text-center text-xs text-slate-500 italic bg-white">
            Hiện tại chưa có bệnh nhân nào có đủ kết quả CLS chờ kết luận.
          </div>
        )}
      </Card>

      {/* SECTION 2: WAITING FOR DOCTOR (CHỜ KHÁM LẦN ĐẦU) */}
      <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
        <CardHeader className="bg-slate-50/80 p-4 border-b border-slate-200 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black">
              2
            </div>
            <div>
              <CardTitle className="text-sm font-bold text-slate-900">
                2. Bệnh nhân chờ khám lần đầu (Đã tiếp nhận & Nộp phí khám)
              </CardTitle>
              <span className="text-[11px] text-slate-500">
                Bệnh nhân đã được Lễ tân phân luồng vào phòng P.203 và đã thanh toán phí khám ban đầu (150.000 đ)
              </span>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-slate-600">
            {isInitialExamReady ? otherInitialPatients.length + 1 : otherInitialPatients.length} ca chờ
          </span>
        </CardHeader>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold text-slate-700">Mã BN</TableHead>
              <TableHead className="font-bold text-slate-700">Họ và tên người bệnh</TableHead>
              <TableHead className="font-bold text-slate-700">Lý do vào khám</TableHead>
              <TableHead className="font-bold text-slate-700">Đến lúc / Thời gian chờ</TableHead>
              <TableHead className="font-bold text-slate-700 text-center">Phí khám</TableHead>
              <TableHead className="text-right font-bold text-slate-700">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Active Demo Patient if in waiting state */}
            {isInitialExamReady && (
              <tr className="bg-blue-50/50 hover:bg-blue-50 transition-colors border-l-4 border-l-clinic-blue">
                <td className="p-3 font-mono font-bold text-clinic-blue text-xs">{patientCode}</td>
                <td className="p-3">
                  <div className="font-extrabold text-slate-900 text-xs">{patientName}</div>
                  <div className="text-[11px] text-slate-500">Nam, 45 tuổi (1981)</div>
                  <div className="text-[10px] text-red-600 font-bold">⚠ Dị ứng Penicillin</div>
                </td>
                <td className="p-3 text-slate-800 text-xs font-medium">
                  Chóng mặt, đau đầu từng cơn khi đổi tư thế
                </td>
                <td className="p-3 text-slate-600 font-mono text-xs">
                  <div className="flex items-center gap-1 font-semibold text-slate-800">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    Đến lúc: 08:32
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Chờ: 08 phút</div>
                </td>
                <td className="p-3 text-center">
                  <Badge variant="success" className="text-[10px] font-bold">
                    ✓ Đã thanh toán 150k
                  </Badge>
                </td>
                <td className="p-3 text-right">
                  <Button
                    size="sm"
                    onClick={handleStartExam}
                    className="font-bold text-xs h-9 bg-clinic-blue hover:bg-blue-700 text-white shadow-md shadow-blue-500/20"
                  >
                    <span>Mở hồ sơ & Khám</span>
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </td>
              </tr>
            )}

            {/* Other Waiting Patients */}
            {otherInitialPatients.map((p, idx) => (
              <tr key={idx} className="hover:bg-slate-50 transition-colors">
                <td className="p-3 font-mono text-slate-700 text-xs">{p.code}</td>
                <td className="p-3">
                  <div className="font-bold text-slate-900 text-xs">{p.name}</div>
                  <div className="text-[11px] text-slate-500">{p.gender}, {p.age} tuổi</div>
                </td>
                <td className="p-3 text-slate-700 text-xs">{p.reason}</td>
                <td className="p-3 text-slate-600 font-mono text-xs">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    Đến lúc: {p.arrivedAt}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Chờ: {p.waitTime}</div>
                </td>
                <td className="p-3 text-center">
                  <Badge variant="success" className="text-[10px] font-bold">
                    ✓ Đã thanh toán 150k
                  </Badge>
                </td>
                <td className="p-3 text-right">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      handleStartExam();
                    }}
                    className="text-xs h-8 font-bold text-slate-700 hover:text-clinic-blue hover:border-clinic-blue"
                  >
                    Mở hồ sơ & Khám →
                  </Button>
                </td>
              </tr>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
