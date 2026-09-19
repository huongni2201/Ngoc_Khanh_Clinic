"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SearchInput } from "@/shared/components/search-input";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/table";
import { useUIStore } from "@/shared/stores/ui.store";
import { MOCK_PATIENTS, MockPatient } from "@/shared/constants/mock-data";
import { FileText, Sparkles, Search, UserCheck } from "lucide-react";

export function PatientSearchTable() {
  const router = useRouter();
  const { openPatientDrawer } = useUIStore();
  const [searchTerm, setSearchTerm] = React.useState("Nguyễn Văn An");

  const filteredPatients = React.useMemo(() => {
    if (!searchTerm.trim()) return MOCK_PATIENTS;
    const term = searchTerm.toLowerCase();
    return MOCK_PATIENTS.filter(
      (p) =>
        p.fullName.toLowerCase().includes(term) ||
        p.patientCode.toLowerCase().includes(term) ||
        p.phone.replace(/\s+/g, "").includes(term.replace(/\s+/g, "")) ||
        p.identityCard.includes(term)
    );
  }, [searchTerm]);

  return (
    <div className="space-y-6">
      {/* Search Filter Box */}
      <Card className="shadow-sm border-slate-200 bg-white">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider text-clinic-blue uppercase">
              TÌM KIẾM ĐA TIÊU CHÍ BỆNH NHÂN
            </span>
            <span className="text-xs text-slate-600 font-medium hidden sm:inline">
              Hỗ trợ tiếng Việt có dấu, không dấu & CCCD 12 số
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <SearchInput
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClear={() => setSearchTerm("")}
              placeholder="Nhập họ tên (Nguyễn Văn An), SĐT (0912...), CCCD hoặc PT-001842..."
              className="flex-1"
            />
            <Button
              onClick={() => setSearchTerm(searchTerm)}
              className="bg-clinic-blue text-white font-bold h-10 px-5 shadow-xs"
            >
              <Search className="w-4 h-4 mr-1.5" />
              Tìm kiếm
            </Button>
          </div>

          {/* Quick Filters Toolbar */}
          <div className="flex items-center justify-between gap-3 pt-1 text-xs flex-wrap border-t border-slate-100">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-slate-600 font-bold">Bộ lọc:</span>
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                  searchTerm === ""
                    ? "bg-clinic-blue text-white shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Tất cả ({MOCK_PATIENTS.length})
              </button>
            </div>

            <div className="flex items-center gap-1.5 text-slate-600 text-[11px]">
              <span className="font-semibold">Từ khóa mẫu:</span>
              <button
                type="button"
                onClick={() => setSearchTerm("Nguyễn Văn An")}
                className="underline hover:text-clinic-blue"
              >
                Nguyễn Văn An
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => setSearchTerm("PT-001842")}
                className="underline hover:text-clinic-blue"
              >
                PT-001842
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => setSearchTerm("0912 345 678")}
                className="underline hover:text-clinic-blue"
              >
                0912 345 678
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Table Card */}
      <Card className="shadow-sm border-slate-200 overflow-hidden bg-white">
        <CardHeader className="bg-slate-50/80 border-b border-slate-200 p-4 flex flex-row items-center justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase text-clinic-blue tracking-wider">
              DANH SÁCH BỆNH NHÂN
            </div>
            <CardTitle className="text-sm font-bold text-slate-800">
              Tìm thấy {filteredPatients.length} hồ sơ bệnh nhân
            </CardTitle>
          </div>
          <span className="text-xs text-slate-600 hidden md:flex items-center gap-1.5 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-clinic-blue shrink-0" />
            Nhấp vào dòng hoặc bấm <b>"Mở hồ sơ"</b> để xem tiền sử bệnh, dị ứng & các lần khám trước
          </span>
        </CardHeader>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-[11px]">
              <TableRow>
                <TableHead className="w-28 pl-4 whitespace-nowrap">Mã BN</TableHead>
                <TableHead className="min-w-[200px]">Họ và tên</TableHead>
                <TableHead className="whitespace-nowrap">Ngày sinh</TableHead>
                <TableHead className="whitespace-nowrap">Số điện thoại</TableHead>
                <TableHead className="whitespace-nowrap">CCCD / Định danh</TableHead>
                <TableHead className="whitespace-nowrap">Lần khám gần nhất</TableHead>
                <TableHead className="text-right pr-4 whitespace-nowrap">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-slate-100">
              {filteredPatients.map((p) => {
                const isTarget = p.patientCode === "PT-001842";

                return (
                  <TableRow
                    key={p.id}
                    className={`cursor-pointer transition-colors ${
                      isTarget ? "bg-blue-50/30 hover:bg-blue-50/60 font-medium" : "hover:bg-slate-50/80"
                    }`}
                    onClick={() => openPatientDrawer(p.id)}
                  >
                    <TableCell className="font-mono font-bold text-clinic-blue pl-4 whitespace-nowrap">
                      {p.patientCode}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-bold text-slate-900 text-sm">
                          {p.fullName}
                        </div>
                        <div className="text-[11px] text-slate-600">
                          {p.gender === "MALE" ? "Nam" : "Nữ"} • {p.address}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-700 text-xs font-mono whitespace-nowrap">
                      {p.dateOfBirth}
                    </TableCell>
                    <TableCell className="font-mono text-slate-800 text-xs whitespace-nowrap">{p.phone}</TableCell>
                    <TableCell className="font-mono text-slate-700 text-xs whitespace-nowrap">{p.identityCard}</TableCell>
                    <TableCell className="text-xs text-slate-600 whitespace-nowrap">
                      {p.recentEncounters[0]?.date ? (
                        <span>{p.recentEncounters[0].date} • {p.recentEncounters[0].department}</span>
                      ) : (
                        <span className="text-slate-400">Khám mới</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right pr-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant={isTarget ? "default" : "outline"}
                          onClick={() => openPatientDrawer(p.id)}
                          className="font-bold text-xs h-8 shadow-xs"
                          title="Mở hồ sơ để xem tiền sử bệnh, dị ứng và các lần khám trước"
                        >
                          <FileText className="w-3.5 h-3.5 mr-1" />
                          Mở hồ sơ
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => router.push("/reception")}
                          className="text-xs h-8 text-slate-700 hover:text-clinic-blue font-semibold"
                        >
                          + Tiếp nhận
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
