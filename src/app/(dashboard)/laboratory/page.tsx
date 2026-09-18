"use client";

import * as React from "react";
import { PageHeader } from "@/shared/components/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Input } from "@/shared/ui/input";
import { useUIStore } from "@/shared/stores/ui.store";
import { MOCK_LAB_RESULTS } from "@/shared/constants/mock-data";
import { FlaskConical, CheckCircle2, QrCode, ShieldCheck, AlertCircle } from "lucide-react";

export default function LaboratoryPage() {
  const { showToast } = useUIStore();
  const [results, setResults] = React.useState(MOCK_LAB_RESULTS);

  const handleVerifyFinal = () => {
    showToast("Đã duyệt Final kết quả xét nghiệm! Hệ thống đã tự động đẩy KQ về máy tính BS. Lê Minh.");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="KHU VỰC XÉT NGHIỆM TRUNG TÂM (UC-LAB-01 → 11 / FR-LAB)"
        title="15. Lab Result Workspace — Phòng P.202 Tầng 2"
        description="Quản lý ống nghiệm, đối soát 2 định danh an toàn và duyệt kết quả theo cấu trúc Test Group -> Panel -> Analyte"
        action={
          <Button variant="success" onClick={handleVerifyFinal} className="font-bold">
            <CheckCircle2 className="w-4 h-4 mr-1.5" />
            Duyệt Final & Trả kết quả về Bác sĩ
          </Button>
        }
      />

      {/* Specimen Banner */}
      <Card className="border-slate-200 shadow-sm bg-slate-900 text-white">
        <CardContent className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center font-bold">
              <FlaskConical className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-black text-sm text-white">
                MẪU XÉT NGHIỆM: SPEC-260917-0881 (MÁU TOÀN PHẦN EDTA)
              </div>
              <span className="text-slate-400">
                Bệnh nhân: <b>Nguyễn Văn An (PT-001842)</b> • Lượt khám: <b>ENC-032</b> • Máy: Sysmex XN-550
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded bg-purple-900 text-purple-200 font-mono font-bold">
              LIS CONNECTED
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Results Tables */}
      <div className="space-y-6">
        {results.map((panel, pIdx) => (
          <Card key={pIdx} className="border-slate-200 shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50/80 p-4 border-b border-slate-200 flex flex-row items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-purple-700 tracking-wider block">
                  {panel.testGroup}
                </span>
                <CardTitle className="text-sm font-bold text-slate-900">{panel.panel}</CardTitle>
              </div>
              <Badge variant="success" className="font-bold">
                {panel.status}
              </Badge>
            </CardHeader>

            <table className="w-full text-xs">
              <thead className="bg-slate-100/60 border-b border-slate-200 text-slate-700 font-bold">
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
                  <tr key={aIdx} className={a.isAbnormal ? "bg-red-50/60 font-medium" : "hover:bg-slate-50"}>
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
