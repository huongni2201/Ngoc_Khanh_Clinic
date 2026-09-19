"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRoleStore } from "@/shared/stores/role.store";
import { useUIStore } from "@/shared/stores/ui.store";
import { ROLES, UserRole } from "@/shared/constants/roles";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Stethoscope,
  FlaskConical,
  Activity,
  CreditCard,
  Building2,
  Calendar,
  Settings,
  Menu,
  Pill,
  Smartphone,
  BarChart3,
  Eye,
  Ticket,
  ClipboardList,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  roles?: UserRole[];
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export function AppSidebar() {
  const pathname = usePathname();
  const { currentRole, setRole, activeRoom } = useRoleStore();
  const { isSidebarCollapsed, toggleSidebar } = useUIStore();
  const roleConfig = ROLES[currentRole] || ROLES.ALL;

  const rawSections: NavSection[] = [
    {
      title: "TỔNG QUAN",
      items: [
        {
          label: "Dashboard điều hành",
          href: "/dashboard",
          icon: LayoutDashboard,
          roles: ["ALL", "RECEPTIONIST", "MANAGER", "ADMIN"],
        },
      ],
    },
    {
      title: "TIẾP ĐÓN",
      items: [
        {
          label: "Lấy số Kiosk",
          href: "/check-in",
          icon: Ticket,
          badge: "Kiosk",
          roles: ["ALL", "RECEPTIONIST", "MANAGER"],
        },
        {
          label: "Tiếp nhận & Lượt khám",
          href: "/reception",
          icon: UserPlus,
          roles: ["ALL", "RECEPTIONIST", "MANAGER"],
        },
        {
          label: "Tra cứu bệnh nhân",
          href: "/patients",
          icon: Users,
          roles: ["ALL", "RECEPTIONIST", "DOCTOR", "CASHIER", "MANAGER"],
        },
        {
          label: "Tạo mới hồ sơ",
          href: "/patients/new",
          icon: UserPlus,
          badge: "Mới",
          roles: ["ALL", "RECEPTIONIST"],
        },
        {
          label: "Lịch hẹn & Tái khám",
          href: "/appointments",
          icon: Calendar,
          roles: ["ALL", "RECEPTIONIST", "DOCTOR", "MANAGER"],
        },
      ],
    },
    {
      title: "KHÁM BỆNH",
      items: [
        {
          label: "Hàng đợi bác sĩ",
          href: "/clinical",
          icon: Stethoscope,
          roles: ["ALL", "DOCTOR"],
        },
        {
          label: "Khám lâm sàng",
          href: "/encounters/ENC-260917-032",
          icon: Activity,
          roles: ["ALL", "DOCTOR"],
        },
      ],
    },
    {
      title: "CẬN LÂM SÀNG",
      items: [
        {
          label: "Xét nghiệm",
          href: "/laboratory",
          icon: FlaskConical,
          roles: ["ALL", "LAB_TECH"],
        },
        {
          label: "Chẩn đoán hình ảnh & ECG",
          href: "/imaging",
          icon: Activity,
          roles: ["ALL", "IMAGING_TECH", "DOCTOR"],
        },
      ],
    },
    {
      title: "THANH TOÁN & DƯỢC",
      items: [
        {
          label: "Thu ngân & Viện phí",
          href: "/billing",
          icon: CreditCard,
          roles: ["ALL", "CASHIER", "MANAGER"],
        },
        {
          label: "Quầy thuốc & Cấp phát",
          href: "/pharmacy",
          icon: Pill,
          badge: "Rx",
          roles: ["ALL", "PHARMACIST"],
        },
        {
          label: "Khám SK Doanh nghiệp",
          href: "/health-check",
          icon: Building2,
          badge: "Đề xuất",
          roles: ["ALL", "RECEPTIONIST", "CASHIER", "MANAGER"],
        },
      ],
    },
    {
      title: "NGƯỜI BỆNH",
      items: [
        {
          label: "Cổng thông tin bệnh nhân",
          href: "/portal",
          icon: Smartphone,
          badge: "Portal",
          roles: ["ALL", "RECEPTIONIST", "DOCTOR"],
        },
      ],
    },
    {
      title: "QUẢN TRỊ",
      items: [
        {
          label: "Báo cáo vận hành & SLA",
          href: "/reports",
          icon: BarChart3,
          roles: ["ALL", "MANAGER", "ADMIN"],
        },
        {
          label: "Cài đặt hệ thống",
          href: "/settings",
          icon: Settings,
          roles: ["ALL", "ADMIN"],
        },
      ],
    },
  ];

  // Filter sections based on active role
  const navSections = rawSections
    .map((sec) => ({
      ...sec,
      items: sec.items.filter(
        (item) =>
          currentRole === "ALL" ||
          !item.roles ||
          item.roles.includes(currentRole)
      ),
    }))
    .filter((sec) => sec.items.length > 0);

  return (
    <aside
      className={`bg-slate-950 text-slate-300 flex flex-col border-r border-slate-800 transition-all duration-300 shrink-0 ${
        isSidebarCollapsed ? "w-20" : "w-72"
      } min-h-screen print:hidden select-none`}
    >
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-lg shadow-lg shadow-blue-500/20 shrink-0">
            +
          </div>
          {!isSidebarCollapsed && (
            <div>
              <div className="font-black text-white text-base tracking-tight leading-none">ClinicOne</div>
              <div className="text-[10px] text-slate-400 font-medium tracking-wide mt-1">
                Phòng khám Đa khoa Ngọc Khánh
              </div>
            </div>
          )}
        </Link>
        <button
          type="button"
          onClick={toggleSidebar}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Thu gọn thanh điều hướng"
        >
          <Menu className="w-4 h-4" />
        </button>
      </div>

      {/* Role Badge in Sidebar */}
      {!isSidebarCollapsed && (
        <div className="p-3 mx-3 my-3 rounded-xl bg-slate-900 border border-slate-800/80 text-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-blue-400 block tracking-wider">
              VAI TRÒ LÀM VIỆC
            </span>
            <span className="font-bold text-white text-xs">{roleConfig.badgeLabel}</span>
          </div>
          <span className="px-2 py-0.5 rounded bg-blue-900/60 border border-blue-700 text-blue-300 font-mono font-bold text-[10px]">
            {activeRoom}
          </span>
        </div>
      )}

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-4">
        {navSections.map((sec, idx) => (
          <div key={idx} className="space-y-1">
            {!isSidebarCollapsed && (
              <div className="px-3 text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-1">
                {sec.title}
              </div>
            )}
            {sec.items.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-clinic-blue text-white shadow-md shadow-blue-500/20 font-bold"
                      : "text-slate-400 hover:text-white hover:bg-slate-900"
                  }`}
                  title={item.label}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-slate-400"}`} />
                  {!isSidebarCollapsed && (
                    <span className="flex-1 truncate">{item.label}</span>
                  )}
                  {!isSidebarCollapsed && item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-black ${
                        isActive
                          ? "bg-white text-clinic-blue shadow-xs"
                          : item.badge === "Đề xuất"
                          ? "bg-amber-950 text-amber-300 border border-amber-700"
                          : "bg-blue-950 text-blue-300 border border-blue-800"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Sidebar Footer: System Status */}
      {!isSidebarCollapsed && (
        <div className="p-3 m-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 space-y-1.5">
          {currentRole !== "ALL" ? (
            <button
              type="button"
              onClick={() => setRole("ALL")}
              className="w-full py-1.5 px-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              Xem toàn bộ các phân hệ
            </button>
          ) : (
            <div className="text-center">
              <div className="font-bold text-slate-300">Phòng khám Đa khoa Ngọc Khánh</div>
              <div className="text-[10px] text-slate-400">Chuyển đổi số Quy trình Ngoại trú</div>
            </div>
          )}
        </div>
      )}
    </aside>
  );
}
