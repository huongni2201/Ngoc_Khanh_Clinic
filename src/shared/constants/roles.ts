export type UserRole =
  | "ALL"
  | "FRONT_DESK"
  | "DOCTOR"
  | "LAB_TECH"
  | "IMAGING_TECH"
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
    description: "Xem toàn bộ phân hệ hệ thống",
  },
  FRONT_DESK: {
    id: "FRONT_DESK",
    label: "Lễ tân & Thu phí khám (Front Desk)",
    badgeLabel: "Front Desk",
    defaultRoute: "/reception",
    description: "Tìm kiếm, Tạo hồ sơ, Tạo lượt khám, Thu phí khám ban đầu & Lịch hẹn",
  },
  DOCTOR: {
    id: "DOCTOR",
    label: "Bác sĩ khám (P.203)",
    badgeLabel: "BS. Lê Minh",
    defaultRoute: "/clinical",
    description: "Danh sách chờ khám, Khám lâm sàng, Chỉ định CLS, In phiếu thanh toán, Kết luận & Kê đơn",
  },
  LAB_TECH: {
    id: "LAB_TECH",
    label: "KTV Xét nghiệm (P.202)",
    badgeLabel: "KTV Lab",
    defaultRoute: "/laboratory",
    description: "Lab Worklist, Barcode mẫu, Duyệt kết quả theo Panel/Analyte & Auto-return",
  },
  IMAGING_TECH: {
    id: "IMAGING_TECH",
    label: "Bác sĩ / KTV CĐHA & ECG",
    badgeLabel: "Siêu âm / ECG",
    defaultRoute: "/imaging",
    description: "Siêu âm P.105, Điện tim P.208, X-quang KTS & Auto-return",
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
