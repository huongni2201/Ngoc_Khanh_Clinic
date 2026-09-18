"use client";

import * as React from "react";
import Link from "next/link";
import { PageHeader } from "@/shared/components/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Input } from "@/shared/ui/input";
import { StatusBadge } from "@/shared/components/status-badge";
import { UserPlus, ArrowRight, Clock, CheckCircle2, QrCode } from "lucide-react";

interface KanbanCard {
  stt: string;
  name: string;
  room: string;
  wait: string;
  code: string;
  active?: boolean;
  complete?: boolean;
}

interface KanbanColumn {
  title: string;
  count: number;
  cards: KanbanCard[];
}

export default function ReceptionPage() {
  const kanbanColumns: KanbanColumn[] = [
    {
      title: "1. CHỜ KHÁM LÂM SÀNG",
      count: 2,
      cards: [
        { stt: "#035", name: "Trần Thị Bích", room: "P.203 — BS. Lê Minh", wait: "12 phút", code: "PT-003194" },
        { stt: "#038", name: "Lê Hoàng Nam", room: "P.203 — BS. Lê Minh", wait: "7 phút", code: "PT-007812" },
      ],
    },
    {
      title: "2. ĐANG KHÁM TẠI PHÒNG",
      count: 1,
      cards: [
        { stt: "#032", name: "Nguyễn Văn An", room: "P.203 — BS. Lê Minh", wait: "Đang xử lý", code: "PT-001842", active: true },
      ],
    },
    {
      title: "3. CHỜ NỘP PHÍ (GATE)",
      count: 1,
      cards: [
        { stt: "#030", name: "Vũ Đình Trọng", room: "Quầy Thu ngân T1", wait: "5 phút", code: "PT-002241" },
      ],
    },
    {
      title: "4. ĐANG LÀM CẬN LÂM SÀNG",
      count: 2,
      cards: [
        { stt: "#031", name: "Phạm Hồng Phúc", room: "P.202 Xét nghiệm", wait: "18 phút", code: "PT-008910" },
        { stt: "#029", name: "Đỗ Kim Oanh", room: "P.105 Siêu âm", wait: "22 phút", code: "PT-005112" },
      ],
    },
    {
      title: "5. ĐÃ ĐỦ KQ (AUTO-RETURN)",
      count: 1,
      cards: [
        { stt: "#032", name: "Nguyễn Văn An", room: "Quay lại P.203 kết luận", wait: "Đã đủ 3/3 KQ", code: "PT-001842", complete: true },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="TIẾP NHẬN & HÀNH TRÌNH BỆNH NHÂN (UC-REC-01 → 06 / UC-JRN)"
        title="07. Tiếp nhận & Patient Journey Board"
        description="Phân luồng phòng khám, cấp số thứ tự #032 và theo dõi bảng Kanban hành trình bệnh nhân thời gian thực"
        action={
          <Link href="/encounters/ENC-260917-032">
            <Button className="font-bold">
              Xem ca khám đang mở (#032) →
            </Button>
          </Link>
        }
      />

      {/* Quick Intake Summary Bar */}
      <Card className="border-slate-200 shadow-sm bg-gradient-to-r from-blue-900 to-slate-900 text-white">
        <CardContent className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-black text-lg">
              #
            </div>
            <div>
              <div className="font-black text-sm text-white">CẤP SỐ THỨ TỰ TỰ ĐỘNG THEO CHUYÊN KHOA</div>
              <span className="text-slate-300">
                Lượt khám gần nhất: <b>ENC-260917-032</b> • Nguyễn Văn An • P.203 (Khoa Nội tổng quát)
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded bg-slate-800 text-emerald-400 font-mono font-bold">
              STT TIẾP THEO: #039
            </span>
          </div>
        </CardContent>
      </Card>

      {/* 5-Column Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3.5 items-start">
        {kanbanColumns.map((col, idx) => (
          <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-[10px] font-black text-slate-700 tracking-wider uppercase">
                {col.title}
              </span>
              <span className="px-1.5 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold">
                {col.count}
              </span>
            </div>

            <div className="space-y-2">
              {col.cards.map((c, cIdx) => (
                <div
                  key={cIdx}
                  className={`p-3 rounded-xl border text-xs space-y-1.5 shadow-sm transition-all hover:shadow ${
                    c.active
                      ? "bg-blue-50/90 border-blue-300 ring-2 ring-blue-400/20"
                      : c.complete
                      ? "bg-emerald-50/90 border-emerald-300"
                      : "bg-white border-slate-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black font-mono text-clinic-blue">{c.stt}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{c.code}</span>
                  </div>
                  <div className="font-bold text-slate-900">{c.name}</div>
                  <div className="text-[11px] text-slate-600">{c.room}</div>
                  <div className="pt-1 flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-100">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {c.wait}
                    </span>
                    {c.complete && (
                      <span className="font-bold text-emerald-700">Đã đủ KQ</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
