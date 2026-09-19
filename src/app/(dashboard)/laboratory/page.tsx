"use client";

import * as React from "react";
import { PageHeader } from "@/shared/components/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { useUIStore } from "@/shared/stores/ui.store";
import { useDemoJourneyStore } from "@/shared/stores/demo-journey.store";
import { MOCK_LAB_RESULTS } from "@/shared/constants/mock-data";
import { FlaskConical, CheckCircle2, QrCode, ShieldCheck, AlertCircle, Sparkles } from "lucide-react";

export default function LaboratoryPage() {
  const { showToast } = useUIStore();
  const {
    patientName,
    patientCode,
    encounterCode,
    labStatus,
    collectLabSample,
    finalizeLab,
  } = useDemoJourneyStore();

  const [results, setResults] = React.useState(MOCK_LAB_RESULTS);

  const handleCollectSample = () => {
    collectLabSample();
    showToast("Đã xác nhận lấy mẫu máu EDTA và dán mã vạch LAB26091900041.");
  };

  const handleVerifyFinal = () => {
    finalizeLab();
    showToast("Đã ký duyệt Final kết quả xét nghiệm! Hệ thống đã tự động trả kết quả về máy tính BS. Lê Minh.");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="KHU VỰC XÉT NGHIỆM TRUNG TÂM"
        title="Phòng Xét Nghiệm Trung Tâm (P.202 Tầng 2)"
        description="Quản lý ống nghiệm, đối soát 2 định danh an toàn, kết nối LIS hai chiều và duyệt kết quả theo cấu trúc Nhóm -> Panel -> Analyte"
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCollectSample}
              className="font-bold text-xs border-slate-300"
            >
              <QrCode className="w-3.5 h-3.5 mr-1 text-purple-600" />
              1. Lấy mẫu & Dán Barcode
            </Button>
            <Button
              variant="success"
              size="sm"
              onClick={handleVerifyFinal}
              className="font-bold text-xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
              2. Ký duyệt Final & Auto-Return
            </Button>
          </div>
        }
      />

      {/* Specimen Banner */}
      <Card className="border-slate-800 shadow-sm bg-slate-900 text-white">
        <CardContent className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center font-bold shadow-md">
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
            <span className="px-3 py-1 rounded bg-purple-950 border border-purple-800 text-purple-300 font-mono font-bold">
              LIS CONNECTED
            </span>
            <Badge variant={labStatus === "FINAL" ? "success" : "warn"} className="font-bold">
              {labStatus === "FINAL" ? "FINAL (ĐÃ DUYỆT)" : "ĐANG CHẠY MÁY"}
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
