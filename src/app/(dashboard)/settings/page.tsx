"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { PageHeader } from "@/shared/components/page-header";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/table";
import { useUIStore } from "@/shared/stores/ui.store";
import { useRoleStore } from "@/shared/stores/role.store";
import { hasPermission, ROLES, ROLE_PERMISSIONS, UserRole } from "@/shared/constants/roles";
import { formatCurrencyVND } from "@/shared/lib/formatters";
import {
  Server,
  Activity,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Tag,
  Users,
  Building2,
  Shield,
  FileText,
  History,
  Lock,
  Edit,
  Plus,
  Search,
  Check,
  X,
  AlertTriangle,
  Info,
} from "lucide-react";

type SettingsTab = "pricing" | "roles" | "staff" | "departments" | "templates" | "audit" | "system";

function SettingsContent() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams?.get("tab") as SettingsTab) || "pricing";

  const [activeTab, setActiveTab] = React.useState<SettingsTab>(initialTab);
  const { currentRole } = useRoleStore();
  const { showToast } = useUIStore();

  React.useEffect(() => {
    const tabParam = searchParams?.get("tab") as SettingsTab;
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Permissions
  const canManagePricing = hasPermission(currentRole, "pricing.manage");
  const canReadPricing = hasPermission(currentRole, "pricing.read");
  const canManageUsers = hasPermission(currentRole, "user.manage");

  // Mock Pricing Catalog with edit state
  const [pricingCatalog, setPricingCatalog] = React.useState([
    { code: "KHAM-01", name: "Khám chuyên khoa ban đầu (Nội tổng quát)", dept: "Phòng khám", price: 150000, insurance: "Không áp dụng", active: true },
    { code: "LAB-CTM", name: "Tổng phân tích tế bào máu ngoại vi (24 thông số - Sysmex XN-550)", dept: "Xét nghiệm", price: 85000, insurance: "BH đồng chi trả", active: true },
    { code: "LAB-GLU", name: "Định lượng Glucose máu đói", dept: "Xét nghiệm", price: 45000, insurance: "BH đồng chi trả", active: true },
    { code: "LAB-LIPID", name: "Bộ mỡ máu toàn phần (Cholesterol, Triglyceride, HDL, LDL)", dept: "Xét nghiệm", price: 180000, insurance: "BH đồng chi trả", active: true },
    { code: "US-ABD-01", name: "Siêu âm màu ổ bụng tổng quát (GE Logiq P9)", dept: "CĐHA", price: 180000, insurance: "BH đồng chi trả", active: true },
    { code: "ECG-12L", name: "Điện tâm đồ 12 chuyển đạo tiêu chuẩn (Fukuda Denshi)", dept: "Thăm dò CN", price: 120000, insurance: "BH đồng chi trả", active: true },
    { code: "XR-CHEST", name: "Chụp X-quang ngực thẳng kỹ thuật số (DR)", dept: "CĐHA", price: 130000, insurance: "BH đồng chi trả", active: true },
    { code: "US-THYROID", name: "Siêu âm tuyến giáp Doppler màu", dept: "CĐHA", price: 160000, insurance: "BH đồng chi trả", active: true },
  ]);

  const [editingCode, setEditingCode] = React.useState<string | null>(null);
  const [editPriceValue, setEditPriceValue] = React.useState<number>(0);

  const handleStartEdit = (code: string, currentPrice: number) => {
    if (!canManagePricing) {
      showToast("Từ chối truy cập: Chỉ Ban Giám đốc (CLINIC_ADMIN) mới có quyền chỉnh sửa bảng giá niêm yết!");
      return;
    }
    setEditingCode(code);
    setEditPriceValue(currentPrice);
  };

  const handleSavePrice = (code: string) => {
    if (!canManagePricing) return;
    setPricingCatalog((prev) =>
      prev.map((item) => (item.code === code ? { ...item, price: editPriceValue } : item))
    );
    setEditingCode(null);
    showToast(`Đã cập nhật đơn giá dịch vụ ${code} thành ${formatCurrencyVND(editPriceValue)}!`);
  };

  const adapters = [
    {
      name: "LIS / Lab Middleware Adapter",
      protocol: "HL7 v2.5 / ASTM E1381",
      endpoint: "tcp://192.168.1.120:5000 (Sysmex XN-550 & AU480)",
      lastSync: "Vừa xong (19/09/2026 09:15:22)",
      status: "CONNECTED",
    },
    {
      name: "PACS / DICOM Image Adapter",
      protocol: "DICOMweb (WADO-RS / STOW-RS)",
      endpoint: "https://pacs.ngockhanhclinic.vn/dcm4chee-arc",
      lastSync: "3 phút trước",
      status: "CONNECTED",
    },
    {
      name: "Payment Gateway & VietQR Webhook",
      protocol: "REST API / Webhook HMAC-SHA256",
      endpoint: "https://api.vietqr.io/v2/webhooks/payment-gate",
      lastSync: "1 phút trước",
      status: "ACTIVE",
    },
    {
      name: "Zalo OA & SMS Notification Adapter",
      protocol: "Zalo Open API v3",
      endpoint: "https://openapi.zalo.me/v3.0/oa/message/transaction",
      lastSync: "12 phút trước",
      status: "ACTIVE",
    },
  ];

  const auditLogs = [
    { time: "09:50:14", user: "BS. Lê Minh", role: "DOCTOR", action: "Phát hành liên kết trả kết quả bảo mật (res_xxx) kèm mã PIN cho BN Nguyễn Văn An", ip: "192.168.1.28" },
    { time: "09:45:00", user: "BS. Lê Minh", role: "DOCTOR", action: "Ký duyệt phát hành Đơn thuốc điện tử RX-260919-088", ip: "192.168.1.28" },
    { time: "09:30:15", user: "BS. CKI Phạm Thị Mai", role: "IMAGING_TECH", action: "Duyệt FINAL kết quả Siêu âm ổ bụng (Gan nhiễm mỡ độ 1)", ip: "192.168.1.55" },
    { time: "09:15:22", user: "CNXN. Trần Thu Hà", role: "LAB_TECH", action: "Duyệt FINAL kết quả CTM 24 thông số (WBC 12.8 ↑)", ip: "192.168.1.45" },
    { time: "08:42:10", user: "BS. Lê Minh (P.203)", role: "DOCTOR", action: "Thu phí CLS 740.000đ trực tiếp tại phòng bác sĩ (Ủy quyền AUTHORIZED)", ip: "192.168.1.28" },
    { time: "08:15:50", user: "Lễ tân: Hoàng Anh", role: "FRONT_DESK", action: "Tiếp nhận Lượt khám ENC-260919-041 & Thu phí khám 150.000đ", ip: "192.168.1.10" },
  ];

  const staffList = [
    { name: "BS. CKI Lê Minh", role: "Bác sĩ khám (Nội khoa)", room: "Phòng 203", phone: "0912 345 678", email: "leminh.md@ngockhanhclinic.vn", status: "ĐANG KHÁM" },
    { name: "BS. CKI Phạm Thị Mai", role: "Bác sĩ CĐHA & Siêu âm", room: "Phòng 105", phone: "0983 112 233", email: "phamthimai@ngockhanhclinic.vn", status: "HOẠT ĐỘNG" },
    { name: "CNXN. Trần Thu Hà", role: "Trưởng phòng Xét nghiệm", room: "Phòng 202", phone: "0974 556 677", email: "tranthuha@ngockhanhclinic.vn", status: "HOẠT ĐỘNG" },
    { name: "KTV. Nguyễn Tuấn Kiệt", role: "KTV Điện tim & X-quang", room: "Phòng 208", phone: "0905 443 322", email: "tuankiet@ngockhanhclinic.vn", status: "HOẠT ĐỘNG" },
    { name: "Lễ tân Hoàng Anh", role: "Trưởng nhóm Tiếp đón", room: "Quầy Tiếp Nhận", phone: "0918 998 877", email: "hoanganh@ngockhanhclinic.vn", status: "HOẠT ĐỘNG" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="QUẢN TRỊ TOÀN DIỆN PHÒNG KHÁM (CLINIC ADMIN)"
        title="Quản Trị Hệ Thống, Bảng Giá & Phân Quyền"
        description="Trung tâm điều hành danh mục dịch vụ & bảng giá, ma trận phân quyền, quản lý nhân sự y tế và giám sát adapter ngoại vi"
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => showToast("Đã làm mới dữ liệu cấu hình hệ thống!")}
              className="font-bold text-xs"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
              Làm mới cấu hình
            </Button>
          </div>
        }
      />

      {/* Modern Navigation Tabs */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 overflow-x-auto pb-1 text-xs">
        {[
          { id: "pricing", label: "Dịch vụ & Bảng giá", icon: Tag },
          { id: "roles", label: "Người dùng & Phân quyền", icon: Shield },
          { id: "staff", label: "Nhân viên & Bác sĩ", icon: Users },
          { id: "departments", label: "Phòng & Khoa", icon: Building2 },
          { id: "templates", label: "Templates & Mẫu in", icon: FileText },
          { id: "audit", label: "Nhật ký kiểm toán (Audit)", icon: History },
          { id: "system", label: "Adapter LIS/PACS", icon: Server },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as SettingsTab)}
              className={`px-3.5 py-2 rounded-t-xl font-bold flex items-center gap-1.5 transition-all whitespace-nowrap border-b-2 ${
                isActive
                  ? "border-clinic-blue text-clinic-blue bg-blue-50/60 font-black"
                  : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: DỊCH VỤ & BẢNG GIÁ (PRICING & SERVICES) */}
      {activeTab === "pricing" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div>
              <div className="text-sm font-black text-slate-900 flex items-center gap-2">
                <span>Bảng Giá Niêm Yết Kỹ Thuật Y Tế (Năm 2026)</span>
                {canManagePricing ? (
                  <Badge variant="success" className="text-[10px] font-bold">
                    Có quyền chỉnh sửa (pricing.manage)
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-[10px] font-bold text-slate-600 border-slate-300">
                    <Lock className="w-3 h-3 mr-1 text-slate-500" />
                    Chỉ xem (Read-only)
                  </Badge>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {canManagePricing
                  ? "Bạn đang đăng nhập với vai trò CLINIC_ADMIN. Có toàn quyền cập nhật đơn giá và danh mục dịch vụ."
                  : "Vai trò hiện tại chỉ có quyền xem giá niêm yết (pricing.read). Chỉ Ban Giám đốc mới có quyền điều chỉnh đơn giá."}
              </p>
            </div>

            {canManagePricing && (
              <Button
                size="sm"
                onClick={() => showToast("Mở form thêm kỹ thuật cận lâm sàng mới vào bảng giá")}
                className="font-bold text-xs bg-clinic-blue hover:bg-blue-700 text-white shrink-0"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Thêm dịch vụ mới
              </Button>
            )}
          </div>

          <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="font-bold text-xs">Mã dịch vụ</TableHead>
                  <TableHead className="font-bold text-xs">Tên dịch vụ kỹ thuật y tế</TableHead>
                  <TableHead className="font-bold text-xs text-center">Khoa / Phòng</TableHead>
                  <TableHead className="font-bold text-xs text-right">Đơn giá niêm yết</TableHead>
                  <TableHead className="font-bold text-xs text-center">Bảo hiểm / Chế độ</TableHead>
                  <TableHead className="font-bold text-xs text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pricingCatalog.map((item) => (
                  <TableRow key={item.code} className="hover:bg-slate-50/70">
                    <TableCell className="font-mono font-bold text-xs text-slate-800">
                      {item.code}
                    </TableCell>
                    <TableCell className="text-xs font-bold text-slate-900">
                      {item.name}
                    </TableCell>
                    <TableCell className="text-xs text-center text-slate-600">
                      {item.dept}
                    </TableCell>
                    <TableCell className="text-right font-mono font-black text-xs text-slate-900">
                      {editingCode === item.code ? (
                        <div className="flex items-center justify-end gap-1">
                          <Input
                            type="number"
                            value={editPriceValue}
                            onChange={(e) => setEditPriceValue(Number(e.target.value))}
                            className="w-28 text-right font-mono font-bold text-xs h-8"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={() => handleSavePrice(item.code)}
                            className="p-1 rounded text-emerald-600 hover:bg-emerald-50"
                            title="Lưu giá mới"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingCode(null)}
                            className="p-1 rounded text-slate-400 hover:bg-slate-100"
                            title="Hủy"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        formatCurrencyVND(item.price)
                      )}
                    </TableCell>
                    <TableCell className="text-center text-[11px] text-slate-500">
                      {item.insurance}
                    </TableCell>
                    <TableCell className="text-right">
                      {canManagePricing ? (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleStartEdit(item.code, item.price)}
                          className="h-7 text-xs text-clinic-blue hover:bg-blue-50 font-bold"
                        >
                          <Edit className="w-3.5 h-3.5 mr-1" />
                          Sửa giá
                        </Button>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-mono italic">Chỉ xem</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      )}

      {/* TAB 2: NGƯỜI DÙNG & PHÂN QUYỀN (ROLES & PERMISSIONS) */}
      {activeTab === "roles" && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-900 space-y-1">
            <div className="font-black text-sm flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-clinic-blue" />
              Mô Hình Phân Quyền Hạt Mịn 5 Vai Trò MVP (Đã Gộp CLINIC_ADMIN)
            </div>
            <p className="leading-relaxed">
              Theo quy chuẩn V4, vai trò <b>Quản lý phòng khám (MANAGER)</b> và <b>Quản trị hệ thống (ADMIN)</b> đã được hợp nhất thành <b>CLINIC_ADMIN</b>. Các vai trò phân định ranh giới chặt chẽ: Bác sĩ chỉ thu phí tại phòng và gửi kết quả; Lễ tân chỉ thu phí khám 150k và gửi lại mã; chỉ có CLINIC_ADMIN mới có quyền thay đổi bảng giá y tế.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(Object.keys(ROLES) as UserRole[])
              .filter((r) => r !== "ALL")
              .map((roleKey) => {
                const config = ROLES[roleKey];
                const perms = ROLE_PERMISSIONS[roleKey] || [];
                const isCurrent = currentRole === roleKey;

                return (
                  <Card key={roleKey} className={`border rounded-2xl shadow-xs overflow-hidden ${isCurrent ? "ring-2 ring-clinic-blue" : "border-slate-200"}`}>
                    <CardHeader className="p-4 bg-slate-50/80 border-b border-slate-100 flex flex-row items-center justify-between">
                      <div>
                        <Badge variant="outline" className="font-mono text-[10px] font-bold text-clinic-blue bg-white">
                          {config.badgeLabel}
                        </Badge>
                        <CardTitle className="text-xs font-black text-slate-900 mt-1">
                          {config.label}
                        </CardTitle>
                      </div>
                      {isCurrent && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                          Đang kích hoạt
                        </span>
                      )}
                    </CardHeader>
                    <CardContent className="p-4 space-y-2 text-xs">
                      <p className="text-slate-500 text-[11px] leading-relaxed">{config.description}</p>
                      <div className="pt-2 border-t border-slate-100">
                        <span className="text-[10px] font-black uppercase text-slate-600 block mb-1">
                          Các quyền hạt mịn ({perms.length} permissions):
                        </span>
                        <div className="flex flex-wrap gap-1 max-h-36 overflow-y-auto pr-1">
                          {perms.slice(0, 10).map((p) => (
                            <span key={p} className="text-[9px] font-mono font-bold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                              {p}
                            </span>
                          ))}
                          {perms.length > 10 && (
                            <span className="text-[9px] font-mono text-slate-500 px-1 py-0.5">
                              +{perms.length - 10} quyền khác...
                            </span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </div>
      )}

      {/* TAB 3: NHÂN VIÊN & BÁC SĨ (STAFF) */}
      {activeTab === "staff" && (
        <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
          <CardHeader className="p-4 bg-slate-50 border-b border-slate-200 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-bold text-slate-900">Danh Sách Bác Sĩ & Nhân Sự Phòng Khám</CardTitle>
            <Button size="sm" onClick={() => showToast("Thêm nhân viên mới")} className="text-xs font-bold bg-clinic-blue text-white">
              <Plus className="w-3.5 h-3.5 mr-1" /> Thêm nhân viên
            </Button>
          </CardHeader>
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="text-xs font-bold">Họ và tên nhân sự</TableHead>
                <TableHead className="text-xs font-bold">Chức danh / Vai trò</TableHead>
                <TableHead className="text-xs font-bold text-center">Phòng làm việc</TableHead>
                <TableHead className="text-xs font-bold">Số điện thoại</TableHead>
                <TableHead className="text-xs font-bold">Email</TableHead>
                <TableHead className="text-xs font-bold text-right">Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staffList.map((s, idx) => (
                <TableRow key={idx}>
                  <TableCell className="text-xs font-bold text-slate-900">{s.name}</TableCell>
                  <TableCell className="text-xs text-slate-700">{s.role}</TableCell>
                  <TableCell className="text-xs text-center font-mono font-bold text-clinic-blue">{s.room}</TableCell>
                  <TableCell className="text-xs font-mono text-slate-600">{s.phone}</TableCell>
                  <TableCell className="text-xs font-mono text-slate-600">{s.email}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="success" className="text-[10px] font-bold">
                      ● {s.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* TAB 4: PHÒNG & KHOA (DEPARTMENTS) */}
      {activeTab === "departments" && (
        <Card className="border-slate-200 shadow-sm bg-white p-5 space-y-3">
          <CardTitle className="text-sm font-bold text-slate-900">Cấu Trúc Phòng Ban & Vị Trí Tầng</CardTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="font-mono font-bold text-clinic-blue text-sm">P.203 — Tầng 2</div>
              <div className="font-bold text-slate-900 mt-1">Phòng Khám Nội Tổng Quát</div>
              <div className="text-[11px] text-slate-500">BS. Lê Minh phụ trách</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="font-mono font-bold text-purple-700 text-sm">P.202 — Tầng 2</div>
              <div className="font-bold text-slate-900 mt-1">Khoa Xét Nghiệm Y Khoa</div>
              <div className="text-[11px] text-slate-500">Sysmex XN-550 & Hóa sinh</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="font-mono font-bold text-amber-700 text-sm">P.105 — Tầng 1</div>
              <div className="font-bold text-slate-900 mt-1">Phòng Siêu Âm Màu 4D/Doppler</div>
              <div className="text-[11px] text-slate-500">Máy GE Logiq P9</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="font-mono font-bold text-emerald-700 text-sm">P.208 — Tầng 2</div>
              <div className="font-bold text-slate-900 mt-1">Phòng Điện Tâm Đồ (ECG)</div>
              <div className="text-[11px] text-slate-500">Máy Fukuda Denshi 12L</div>
            </div>
          </div>
        </Card>
      )}

      {/* TAB 5: TEMPLATES & BIỂU MẪU (TEMPLATES) */}
      {activeTab === "templates" && (
        <Card className="border-slate-200 shadow-sm bg-white p-5 space-y-4">
          <CardTitle className="text-sm font-bold text-slate-900">Mẫu Phiếu Y Tế & Bản In Chuẩn Hóa</CardTitle>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <span className="font-black text-slate-900 block">1. Phiếu Chỉ Định CLS & Lộ Trình</span>
              <p className="text-[11px] text-slate-500">Bao gồm sơ đồ 4 bước di chuyển phòng, mã QR xác thực và danh mục kỹ thuật.</p>
              <Badge variant="outline" className="text-[10px]">Đang sử dụng</Badge>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <span className="font-black text-slate-900 block">2. Đơn Thuốc Điện Tử Chuẩn BYT</span>
              <p className="text-[11px] text-slate-500">Có mã đơn thuốc quốc gia, chữ ký số bác sĩ và mã QR mua thuốc.</p>
              <Badge variant="outline" className="text-[10px]">Đang sử dụng</Badge>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <span className="font-black text-slate-900 block">3. Hóa Đơn Thu Viện Phí VietQR</span>
              <p className="text-[11px] text-slate-500">Tích hợp mã VietQR Napas247 động, tự động đối soát webhook.</p>
              <Badge variant="outline" className="text-[10px]">Đang sử dụng</Badge>
            </div>
          </div>
        </Card>
      )}

      {/* TAB 6: NHẬT KÝ KIỂM TOÁN (AUDIT TRAIL) */}
      {activeTab === "audit" && (
        <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
          <CardHeader className="bg-slate-50/70 p-4 border-b border-slate-200 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xs font-bold text-slate-900">
                Nhật Ký Kiểm Toán Hoạt Động Y Tế & An Ninh Dữ Liệu
              </CardTitle>
              <p className="text-[11px] text-slate-500">Ghi vết toàn bộ hành vi phát hành link, duyệt kết quả và thu phí (Tuân thủ ISO 27001 & Nghị định 13/2023/NĐ-CP)</p>
            </div>
            <Badge variant="outline" className="text-[10px] font-mono text-emerald-700 bg-emerald-50">
              Audit Active
            </Badge>
          </CardHeader>
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="text-xs font-bold">Thời gian</TableHead>
                <TableHead className="text-xs font-bold">Người thực hiện</TableHead>
                <TableHead className="text-xs font-bold">Vai trò</TableHead>
                <TableHead className="text-xs font-bold">Hành động y tế / An ninh</TableHead>
                <TableHead className="text-xs font-bold text-right">Địa chỉ IP</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditLogs.map((log, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-mono text-xs text-slate-500">{log.time}</TableCell>
                  <TableCell className="font-bold text-xs text-slate-900">{log.user}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono text-[9px] font-bold">
                      {log.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-slate-700">{log.action}</TableCell>
                  <TableCell className="text-right font-mono text-xs text-slate-400">{log.ip}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* TAB 7: ADAPTER LIS/PACS */}
      {activeTab === "system" && (
        <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
          <CardHeader className="bg-slate-50/70 p-4 border-b border-slate-200">
            <CardTitle className="text-xs font-bold text-slate-900">
              Trạng thái 4 Adapter Tích Hợp Ngoại Vi (LIS, PACS, VietQR, Zalo OA)
            </CardTitle>
          </CardHeader>
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="text-xs font-bold">Tên Adapter</TableHead>
                <TableHead className="text-xs font-bold">Giao thức</TableHead>
                <TableHead className="text-xs font-bold">Endpoint máy chủ</TableHead>
                <TableHead className="text-xs font-bold">Lần đồng bộ cuối</TableHead>
                <TableHead className="text-xs font-bold text-right">Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {adapters.map((ad, idx) => (
                <TableRow key={idx}>
                  <TableCell className="p-3 font-bold text-slate-900 text-xs flex items-center gap-2">
                    <Server className="w-4 h-4 text-clinic-blue shrink-0" />
                    {ad.name}
                  </TableCell>
                  <TableCell className="p-3 font-mono text-xs text-slate-600">{ad.protocol}</TableCell>
                  <TableCell className="p-3 font-mono text-xs text-slate-600">{ad.endpoint}</TableCell>
                  <TableCell className="p-3 text-xs text-slate-500 font-mono">{ad.lastSync}</TableCell>
                  <TableCell className="p-3 text-right">
                    <Badge variant="success" className="font-mono text-[10px] font-bold">
                      ● {ad.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}

export default function SettingsPage() {
  return (
    <React.Suspense fallback={<div className="p-6 text-xs text-slate-500">Đang tải trung tâm quản trị...</div>}>
      <SettingsContent />
    </React.Suspense>
  );
}
