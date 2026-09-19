"use client";

import * as React from "react";
import Link from "next/link";
import { PageHeader } from "@/shared/components/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { useUIStore } from "@/shared/stores/ui.store";
import { useDemoClinicFlowStore } from "@/shared/stores/demo-clinic-flow.store";
import { MOCK_LAB_RESULTS } from "@/shared/constants/mock-data";
import {
  FlaskConical,
  CheckCircle2,
  QrCode,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  Lock,
  ArrowRight,
  Clock,
} from "lucide-react";

export default function LaboratoryPage() {
  const { showToast } = useUIStore();
  const {
    patientName,
    patientCode,
    encounterCode,
    labStatus,
    imagingStatus,
    diagnosticInvoiceStatus,
    isDiagnosticAuthorized,
    collectLabSample,
    finalizeLab,
  } = useDemoClinicFlowStore();

  const [results, setResults] = React.useState(MOCK_LAB_RESULTS);

  const isAuthorized = isDiagnosticAuthorized(1) || diagnosticInvoiceStatus === "PAID";

  const handleCollectSample = () => {
    if (!isAuthorized) {
      showToast("Chưa thể lấy mẫu: Bệnh nhân chưa nộp phí CLS tại Quầy thu ngân!");
      return;
    }
    collectLabSample();
    showToast("Đã xác nhận lấy mẫu máu EDTA và dán mã vạch SPEC-260919-0881.");
  };

  const handleVerifyFinal = () => {
    if (!isAuthorized) {
      showToast("Chưa được phép thực hiện: Bệnh nhân chưa thanh toán CLS!");
      return;
    }
    finalizeLab();
    if (imagingStatus === "FINAL") {
      showToast("Đã ký duyệt Final! Đủ 3/3 kết quả CLS → Bệnh nhân đã tự động chuyển sang Chờ Bác sĩ kết luận.");
    } else {
      showToast("Đã ký duyệt Final kết quả xét nghiệm! Đã tự động gửi kết quả về máy tính BS. Lê Minh.");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="KHU VỰC XÉT NGHIỆM TRUNG TÂM"
        title="Phòng Xét Nghiệm Trung Tâm (P.202 Tầng 2)"
        description="Đối soát quyền thực hiện (Payment Authorization), quản lý mẫu bệnh phẩm và duyệt kết quả theo cấu trúc Nhóm -> Panel -> Analyte"
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!isAuthorized}
              onClick={handleCollectSample}
              className="font-bold text-xs border-slate-300"
            >
              <QrCode className="w-3.5 h-3.5 mr-1 text-purple-600" />
              1. Tiếp nhận & Lấy mẫu
            </Button>
            <Button
              variant="success"
              size="sm"
              disabled={!isAuthorized}
              onClick={handleVerifyFinal}
              className="font-bold text-xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
              2. Ký duyệt Final & Auto-Return
            </Button>
          </div>
        }
      />

      {/* Lock Gate Warning if Not Authorized */}
      {!isAuthorized && (
        <Card className="border-amber-300 bg-amber-50/90 text-amber-950 p-4 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
            <Lock className="w-5 h-5 text-amber-700" />
            <span>KHÓA CỔNG THỰC HIỆN — CHƯA THANH TOÁN PHÍ DỊCH VỤ (PAYMENT GATE LOCKED)</span>
          </div>
          <p className="text-xs text-amber-800 leading-relaxed">
            Chỉ định xét nghiệm máu của người bệnh <b>{patientName} ({patientCode})</b> chưa được kích hoạt quyền thực hiện (Payment Authorization Status: PENDING). Người bệnh cần hoàn tất thủ tục thanh toán viện phí tại Quầy thanh toán trước khi lấy mẫu.
          </p>
          <div className="pt-1">
            <Link href="/billing">
              <Button size="sm" className="bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs h-8">
                Mở màn hình Thanh toán CLS →
              </Button>
            </Link>
          </div>
        </Card>
      )}

      {/* Specimen Banner */}
      <Card className="border-slate-800 shadow-sm bg-slate-900 text-white">
        <CardContent className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center font-bold shadow-md shrink-0">
              <FlaskConical className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-black text-sm text-white">
                MẪU BỆNH PHẨM: SPEC-260919-0881 (MÁU TOÀN PHẦN EDTA)
              </div>
              <span className="text-slate-400">
                Bệnh nhân: <b>{patientName} ({patientCode})</b> • Lượt khám: <b>{encounterCode}</b> • Thiết bị: Sysmex XN-550
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded font-bold text-[10px] ${
              isAuthorized ? "bg-emerald-950 border border-emerald-700 text-emerald-300" : "bg-red-950 border border-red-800 text-red-300"
            }`}>
              {isAuthorized ? "✓ AUTHORIZED (ĐÃ THANH TOÁN)" : "GATE LOCKED (CHỜ NỘP PHÍ)"}
            </span>
            <Badge variant={labStatus === "FINAL" ? "success" : "warn"} className="font-bold">
              {labStatus === "FINAL" ? "FINAL (ĐÃ DUYỆT)" : labStatus === "SAMPLE_COLLECTED" ? "ĐÃ LẤY MẪU" : "CHỜ LẤY MẪU"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Results Tables */}
      <div className="space-y-6">
        {results.map((panel, pIdx) => (
          <Card key={pIdx} className="border-slate-200 shadow-sm overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/80 p-4 border-b border-slate-200 flex flex-row items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-purple-700 tracking-wider block">
                  {panel.testGroup}
                </span>
                <CardTitle className="text-sm font-bold text-slate-900">{panel.panel}</CardTitle>
              </div>
              <Badge variant="success" className="font-bold">
                {labStatus === "FINAL" ? "FINAL" : "VERIFIED"}
              </Badge>
            </CardHeader>

            <table className="w-full text-xs">
              <thead className="bg-slate-100/70 border-b border-slate-200 text-slate-700 font-bold">
                <tr>
                  <th className="p-3 text-left">Chỉ số xét nghiệm</th>
                  <th className="p-3 text-center">Kết quả</th>
                  <th className="p-3 text-center">Đơn vị</th>
                  <th className="p-3 text-center">Khoảng tham chiếu</th>
                  <th className="p-3 text-right">Cảnh báo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {panel.analytes.map((a, aIdx) => (
                  <tr key={aIdx} className={a.isAbnormal ? "bg-red-50/70 font-medium" : "hover:bg-slate-50"}>
                    <td className="p-3 font-semibold text-slate-800">{a.name}</td>
                    <td className={`p-3 text-center font-bold font-mono text-sm ${a.isAbnormal ? "text-red-600" : "text-slate-900"}`}>
                      {a.value}
                    </td>
                    <td className="p-3 text-center text-slate-500">{a.unit}</td>
                    <td className="p-3 text-center font-mono text-slate-600">{a.refRange}</td>
                    <td className="p-3 text-right">
                      {a.isAbnormal ? (
                        <Badge variant="danger" className="font-black text-[10px]">
                          {a.flag}
                        </Badge>
                      ) : (
                        <span className="text-emerald-700 font-semibold text-[11px]">Bình thường</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        ))}
      </div>
    </div>
  );
}
