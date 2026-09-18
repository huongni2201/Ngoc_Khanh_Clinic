export type UserRole =
  | "ALL"
  | "RECEPTIONIST"
  | "DOCTOR"
  | "CASHIER"
  | "LAB_TECH"
  | "IMAGING_TECH"
  | "PHARMACIST"
  | "MANAGER"
  | "ADMIN";

export interface RoleConfig {
  id: UserRole;
  label: string;
  badgeLabel: string;
  defaultRoute: string;
  description: string;
}

export const ROLES: Record<UserRole, RoleConfig> = {
  ALL: {
    id: "ALL",
    label: "Tất cả màn hình (Full)",
    badgeLabel: "Full View",
    defaultRoute: "/dashboard",
    description: "Xem toàn bộ 25 phân hệ hệ thống",
  },
  RECEPTIONIST: {
    id: "RECEPTIONIST",
    label: "Lễ tân & Tiếp nhận",
    badgeLabel: "Lễ tân",
    defaultRoute: "/reception",
    description: "Tìm kiếm, Đăng ký, Cấp số tiếp nhận & Journey Board",
  },
  DOCTOR: {
    id: "DOCTOR",
    label: "Bác sĩ khám (P.203)",
    badgeLabel: "BS. Lê Minh",
    defaultRoute: "/clinical",
    description: "Doctor Worklist, Clinical Workspace, Y lệnh & Kê đơn",
  },
  CASHIER: {
    id: "CASHIER",
    label: "Thu ngân (Payment Gate)",
    badgeLabel: "Thu ngân T1",
    defaultRoute: "/billing",
    description: "Thanh toán viện phí, VietQR, ủy quyền dịch vụ PAID_AUTHORIZED",
  },
  LAB_TECH: {
    id: "LAB_TECH",
    label: "KTV Xét nghiệm (P.202)",
    badgeLabel: "KTV Lab",
    defaultRoute: "/laboratory",
    description: "Lab Worklist, Barcode mẫu, Duyệt kết quả theo Panel/Analyte",
  },
  IMAGING_TECH: {
    id: "IMAGING_TECH",
    label: "Bác sĩ/KTV CĐHA & ECG",
    badgeLabel: "Siêu âm / ECG",
    defaultRoute: "/imaging",
    description: "Siêu âm P.105, Điện tim P.208 & X-quang kỹ thuật số",
  },
  PHARMACIST: {
    id: "PHARMACIST",
    label: "Dược sĩ quầy thuốc",
    badgeLabel: "Nhà thuốc",
    defaultRoute: "/pharmacy",
    description: "Quét QR đơn thuốc, đối soát lô HSD và cấp phát",
  },
  MANAGER: {
    id: "MANAGER",
    label: "Quản lý phòng khám",
    badgeLabel: "Giám đốc y khoa",
    defaultRoute: "/reports",
    description: "Dashboard KPIs, cảnh báo SLA, TAT chuyên khoa",
  },
  ADMIN: {
    id: "ADMIN",
    label: "Quản trị hệ thống",
    badgeLabel: "Admin IT",
    defaultRoute: "/settings",
    description: "Adapter LIS/PACS/Zalo, Phân quyền phòng ban, Audit trail",
  },
};
