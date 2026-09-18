"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRoleStore } from "@/shared/stores/role.store";
import { useUIStore } from "@/shared/stores/ui.store";
import { ROLES, UserRole } from "@/shared/constants/roles";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import {
  Printer,
  Bell,
  Check,
  ChevronRight,
  User,
  ShieldCheck,
  Search,
  Sparkles,
  Layers,
} from "lucide-react";

export function TopNavigation() {
  const pathname = usePathname();
  const { currentRole, setRole, activeRoom } = useRoleStore();
  const { openPrintModal, showToast } = useUIStore();

  const flowSteps = [
    { num: 1, label: "Tìm BN", href: "/patients" },
    { num: 2, label: "Tạo BN", href: "/patients/new" },
    { num: 3, label: "Tiếp nhận", href: "/reception" },
    { num: 4, label: "Worklist BS", href: "/clinical" },
    { num: 5, label: "Khám LS (#032)", href: "/encounters/ENC-260917-032" },
    { num: 6, label: "Thu ngân (Gate)", href: "/billing" },
    { num: 7, label: "Lab (P.202)", href: "/laboratory" },
    { num: 8, label: "Siêu âm/ECG", href: "/imaging" },
    { num: 9, label: "Quầy thuốc", href: "/pharmacy" },
    { num: 10, label: "Portal BN", href: "/portal" },
    { num: 11, label: "Báo cáo SLA", href: "/reports" },
  ];

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const role = e.target.value as UserRole;
    setRole(role);
    showToast(`Đã chuyển góc nhìn làm việc sang: ${ROLES[role]?.label}`);
  };

  // Find active step index based on pathname
  const activeStepIndex = flowSteps.findIndex((s) => pathname === s.href);

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm print:hidden select-none">
      {/* Upper Bar: Utility & Roles */}
      <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between gap-3">
        {/* Left: Quick search hint or breadcrumb */}
        <div className="flex items-center gap-2 text-xs min-w-0 shrink-0">
          <span className="font-black text-slate-900 tracking-tight flex items-center gap-1.5 whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            ClinicOne HIS
          </span>
          <span className="text-slate-300 hidden xl:inline">/</span>
          <span className="hidden xl:inline font-medium text-slate-500 whitespace-nowrap truncate">
            Phòng khám Đa khoa Quốc tế Ngọc Khánh
          </span>
        </div>

        {/* Right Controls: Print + Role Switcher + Room + Profile */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Quick Print Modal trigger button */}
          <Button
            size="sm"
            variant="outline"
            onClick={() => openPrintModal("routing")}
            className="h-8 text-xs font-bold text-slate-700 border-slate-300 hover:bg-slate-50 active:scale-[0.98] transition-all"
            title="Xem nhanh phiếu chỉ định CLS & hóa đơn VietQR"
            aria-label="Xem phiếu in y tế"
          >
            <Printer className="w-3.5 h-3.5 mr-1.5 text-clinic-blue" />
            Xem phiếu in
          </Button>

          {/* Role Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-lg border border-slate-200">
            <span className="text-[10px] font-bold text-slate-700 uppercase">VAI TRÒ:</span>
            <select
              id="topNavRoleSelect"
              name="topNavRole"
              value={currentRole}
              onChange={handleRoleChange}
              className="bg-transparent text-xs font-bold text-slate-900 outline-none cursor-pointer focus:ring-1 focus:ring-clinic-blue rounded"
              aria-label="Chọn góc nhìn vai trò nhân viên"
            >
              {Object.values(ROLES).map((r) => (
                <option key={r.id} value={r.id}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          {/* Active Room Pill */}
          <span className="text-xs font-mono font-bold px-2 py-1 bg-blue-50 text-clinic-blue rounded-md border border-blue-200 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-clinic-blue" />
            {activeRoom}
          </span>

          {/* Notification Icon */}
          <button
            type="button"
            onClick={() => showToast("Hệ thống: Có 3 mẫu xét nghiệm sắp chạm ngưỡng SLA 45 phút.")}
            className="relative p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Thông báo hệ thống (3 cảnh báo SLA)"
            aria-label="Xem 3 thông báo hệ thống"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
          </button>

          {/* User profile avatar */}
          <div className="hidden md:flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shadow-sm">
              LM
            </div>
            <div className="text-[11px] leading-tight">
              <span className="font-bold text-slate-900 block">BS. Lê Minh</span>
              <span className="text-[10px] text-slate-600 font-semibold">Bác sĩ khám</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lower Bar: Interactive Standard Clinical Flow Navigator (11 Steps) */}
      <div className="px-4 py-1.5 bg-gradient-to-r from-blue-50/70 via-slate-50 to-indigo-50/70 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        <span className="text-[10px] font-black uppercase text-clinic-blue tracking-wider mr-2 shrink-0 flex items-center gap-1">
          <Layers className="w-3 h-3" />
          LUỒNG KHÁM:
        </span>

        {flowSteps.map((step, idx) => {
          const isActive = pathname === step.href;
          const isPassed = activeStepIndex > -1 && idx < activeStepIndex;

          return (
            <React.Fragment key={step.num}>
              <Link
                href={step.href}
                className={`text-[11px] px-2.5 py-1 rounded-lg flex items-center gap-1.5 font-bold transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? "bg-clinic-blue text-white shadow-sm shadow-blue-500/30 scale-[1.02]"
                    : isPassed
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100/70"
                    : "bg-white text-slate-800 border border-slate-200 hover:bg-slate-100 hover:border-slate-300"
                }`}
                title={`Bước ${step.num}: ${step.label}`}
              >
                {isPassed ? (
                  <Check className="w-3 h-3 text-emerald-700" />
                ) : (
                  <span
                    className={`w-3.5 h-3.5 rounded-full text-[9px] flex items-center justify-center font-mono font-black ${
                      isActive
                        ? "bg-white text-clinic-blue shadow-xs"
                        : "bg-slate-200 text-slate-900"
                    }`}
                  >
                    {step.num}
                  </span>
                )}
                <span>{step.label}</span>
              </Link>

              {idx < flowSteps.length - 1 && (
                <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </header>
  );
}
