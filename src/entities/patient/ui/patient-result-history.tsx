"use client";

import * as React from "react";
import { PreviousResultItem } from "@/shared/constants/mock-data";
import { Badge } from "@/shared/ui/badge";
import { FlaskConical, Activity, Camera, FileText, CheckCircle2 } from "lucide-react";

interface PatientResultHistoryProps {
  results: PreviousResultItem[];
  className?: string;
}

export function PatientResultHistory({ results, className = "" }: PatientResultHistoryProps) {
  const [filter, setFilter] = React.useState<"ALL" | "LAB" | "ULTRASOUND" | "XRAY" | "ECG">("ALL");

  const filtered = React.useMemo(() => {
    if (filter === "ALL") return results;
    return results.filter((r) => r.category === filter);
  }, [results, filter]);

  if (!results || results.length === 0) {
    return (
      <div className={`p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 italic ${className}`}>
        Chưa có dữ liệu kết quả cận lâm sàng cũ.
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <button
          type="button"
          onClick={() => setFilter("ALL")}
          className={`px-2.5 py-1 rounded-lg font-bold transition-all text-[11px] whitespace-nowrap ${
            filter === "ALL"
              ? "bg-clinic-blue text-white shadow-xs"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          Tất cả ({results.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter("LAB")}
          className={`px-2.5 py-1 rounded-lg font-bold transition-all text-[11px] whitespace-nowrap ${
            filter === "LAB"
              ? "bg-purple-600 text-white shadow-xs"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          Xét nghiệm
        </button>
        <button
          type="button"
          onClick={() => setFilter("ECG")}
          className={`px-2.5 py-1 rounded-lg font-bold transition-all text-[11px] whitespace-nowrap ${
            filter === "ECG"
              ? "bg-emerald-600 text-white shadow-xs"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          Điện tim
        </button>
        <button
          type="button"
          onClick={() => setFilter("ULTRASOUND")}
          className={`px-2.5 py-1 rounded-lg font-bold transition-all text-[11px] whitespace-nowrap ${
            filter === "ULTRASOUND"
              ? "bg-blue-600 text-white shadow-xs"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          Siêu âm
        </button>
        <button
          type="button"
          onClick={() => setFilter("XRAY")}
          className={`px-2.5 py-1 rounded-lg font-bold transition-all text-[11px] whitespace-nowrap ${
            filter === "XRAY"
              ? "bg-slate-800 text-white shadow-xs"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          X-Quang
        </button>
      </div>

      {/* Results List */}
      <div className="space-y-2.5">
        {filtered.length === 0 ? (
          <div className="text-center py-4 text-xs text-slate-400 italic">
            Không có kết quả trong phân mục này.
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className={`p-3 rounded-xl border text-xs space-y-1.5 transition-all ${
                item.isAbnormal ? "bg-red-50/40 border-red-200" : "bg-white border-slate-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-900">{item.testName}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {item.isAbnormal ? (
                    <Badge variant="danger" className="text-[10px] font-black">
                      {item.flag || "Bất thường"}
                    </Badge>
                  ) : (
                    <Badge variant="success" className="text-[10px] font-bold">
                      Bình thường
                    </Badge>
                  )}
                </div>
              </div>

              <div className="text-[11px] text-slate-500 flex items-center gap-2">
                <span>Ngày: <b className="text-slate-700">{item.date}</b></span>
                <span>•</span>
                <span>Bác sĩ: <b>{item.doctor}</b></span>
              </div>

              <div className="p-2 bg-slate-50 rounded-lg text-slate-800 font-medium leading-relaxed">
                {item.summary}
              </div>

              {item.details && (
                <div className="text-[11px] text-slate-600 italic">
                  {item.details}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
