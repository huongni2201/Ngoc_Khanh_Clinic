export type UserRole =
  | "ALL"
  | "FRONT_DESK"
  | "DOCTOR"
  | "LAB_TECH"
  | "IMAGING_TECH"
  | "MANAGER"
  | "ADMIN";

export type Permission =
  // Patient
  | "patient.read_basic"
  | "patient.read_clinical"
  | "patient.read_history"
  | "patient.create"
  | "patient.update_demographic"
  | "patient.duplicate_check"
  // Encounter
  | "encounter.create"
  | "encounter.read"
  | "encounter.read_basic"
  | "encounter.assign"
  | "encounter.transfer"
  | "encounter.start_exam"
  // Worklist & Summary
  | "doctor_waitlist.read_summary"
  | "doctor_worklist.read"
  // Clinical
  | "clinical.read"
  | "clinical.write"
  | "clinical.read_full"
  | "vital_sign.read"
  | "diagnosis.read"
  | "diagnosis.write"
  | "conclusion.write"
  // Orders
  | "order.read"
  | "order.create"
  | "order.cancel"
  // Payments
  | "payment.initial_exam.collect"
  | "payment.diagnostic.collect"
  | "payment.diagnostic.refund_if_allowed"
  | "payment.reconciliation.read"
  | "payment.reconciliation.manage"
  // Diagnostics & Results
  | "diagnostic.perform"
  | "result.read"
  | "result.read_detail"
  | "result.review"
  | "result.verify"
  // Prescriptions
  | "prescription.read"
  | "prescription.write"
  | "prescription.issue"
  // Appointments & Journey
  | "appointment.read"
  | "appointment.create"
  | "appointment.update"
  | "appointment.create_follow_up"
  | "journey.read"
  // Admin & Reports
  | "reports.read"
  | "settings.manage";

export interface RoleConfig {
  id: UserRole;
  label: string;
  badgeLabel: string;
  defaultRoute: string;
  description: string;
  permissions: Permission[];
}

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  ALL: [
    "patient.read_basic",
    "patient.read_clinical",
    "patient.read_history",
    "patient.create",
    "patient.update_demographic",
    "patient.duplicate_check",
    "encounter.create",
    "encounter.read",
    "encounter.read_basic",
    "encounter.assign",
    "encounter.transfer",
    "encounter.start_exam",
    "doctor_waitlist.read_summary",
    "doctor_worklist.read",
    "clinical.read",
    "clinical.write",
    "clinical.read_full",
    "vital_sign.read",
    "diagnosis.read",
    "diagnosis.write",
    "conclusion.write",
    "order.read",
    "order.create",
    "order.cancel",
    "payment.initial_exam.collect",
    "payment.diagnostic.collect",
    "payment.diagnostic.refund_if_allowed",
    "payment.reconciliation.read",
    "payment.reconciliation.manage",
    "diagnostic.perform",
    "result.read",
    "result.read_detail",
    "result.review",
    "result.verify",
    "prescription.read",
    "prescription.write",
    "prescription.issue",
    "appointment.read",
    "appointment.create",
    "appointment.update",
    "appointment.create_follow_up",
    "journey.read",
    "reports.read",
    "settings.manage",
  ],
  FRONT_DESK: [
    "patient.read_basic",
    "patient.create",
    "patient.update_demographic",
    "patient.duplicate_check",
    "encounter.create",
    "encounter.read_basic",
    "encounter.assign",
    "encounter.transfer",
    "payment.initial_exam.collect",
    "appointment.read",
    "appointment.create",
    "appointment.update",
    "journey.read",
    "doctor_waitlist.read_summary",
  ],
  DOCTOR: [
    "patient.read_clinical",
    "patient.read_history",
    "doctor_worklist.read",
    "encounter.read",
    "encounter.start_exam",
    "clinical.read",
    "clinical.write",
    "vital_sign.read",
    "diagnosis.read",
    "diagnosis.write",
    "order.read",
    "order.create",
    "order.cancel",
    "payment.diagnostic.collect",
    "payment.diagnostic.refund_if_allowed",
    "result.read",
    "result.review",
    "conclusion.write",
    "prescription.read",
    "prescription.write",
    "prescription.issue",
    "appointment.create_follow_up",
    "journey.read",
  ],
  LAB_TECH: [
    "patient.read_basic",
    "encounter.read_basic",
    "diagnostic.perform",
    "result.read",
    "result.verify",
    "journey.read",
  ],
  IMAGING_TECH: [
    "patient.read_basic",
    "encounter.read_basic",
    "diagnostic.perform",
    "result.read",
    "result.verify",
    "journey.read",
  ],
  MANAGER: [
    "patient.read_basic",
    "encounter.read_basic",
    "doctor_waitlist.read_summary",
    "doctor_worklist.read",
    "payment.reconciliation.read",
    "payment.reconciliation.manage",
    "reports.read",
    "journey.read",
  ],
  ADMIN: [
    "patient.read_basic",
    "encounter.read_basic",
    "reports.read",
    "settings.manage",
    "journey.read",
  ],
};

export const ROLES: Record<UserRole, RoleConfig> = {
  ALL: {
    id: "ALL",
    label: "Tất cả màn hình (Full)",
    badgeLabel: "Full View",
    defaultRoute: "/dashboard",
    description: "Xem toàn bộ phân hệ hệ thống",
    permissions: ROLE_PERMISSIONS.ALL,
  },
  FRONT_DESK: {
    id: "FRONT_DESK",
    label: "Lễ tân & Tiếp nhận (Front Desk)",
    badgeLabel: "Lễ tân",
    defaultRoute: "/reception",
    description: "Tiếp đón, Tạo hồ sơ, Thu phí khám ban đầu & Theo dõi tình trạng phòng khám",
    permissions: ROLE_PERMISSIONS.FRONT_DESK,
  },
  DOCTOR: {
    id: "DOCTOR",
    label: "Bác sĩ khám (P.203)",
    badgeLabel: "BS. Lê Minh",
    defaultRoute: "/clinical",
    description: "Khám lâm sàng, Hồ sơ bệnh nhân, Chỉ định CLS, Thu phí CLS tại phòng, Kết luận & Kê đơn",
    permissions: ROLE_PERMISSIONS.DOCTOR,
  },
  LAB_TECH: {
    id: "LAB_TECH",
    label: "KTV Xét nghiệm (P.202)",
    badgeLabel: "KTV Lab",
    defaultRoute: "/laboratory",
    description: "Lab Worklist, Barcode mẫu, Duyệt kết quả theo Panel/Analyte & Auto-return",
    permissions: ROLE_PERMISSIONS.LAB_TECH,
  },
  IMAGING_TECH: {
    id: "IMAGING_TECH",
    label: "Bác sĩ / KTV CĐHA & ECG",
    badgeLabel: "Siêu âm / ECG",
    defaultRoute: "/imaging",
    description: "Siêu âm P.105, Điện tim P.208, X-quang KTS & Auto-return",
    permissions: ROLE_PERMISSIONS.IMAGING_TECH,
  },
  MANAGER: {
    id: "MANAGER",
    label: "Quản lý phòng khám",
    badgeLabel: "Giám đốc y khoa",
    defaultRoute: "/reports",
    description: "Dashboard KPIs, cảnh báo SLA, TAT chuyên khoa, Đối soát viện phí",
    permissions: ROLE_PERMISSIONS.MANAGER,
  },
  ADMIN: {
    id: "ADMIN",
    label: "Quản trị hệ thống",
    badgeLabel: "Admin IT",
    defaultRoute: "/settings",
    description: "Adapter LIS/PACS/Zalo, Phân quyền phòng ban, Audit trail",
    permissions: ROLE_PERMISSIONS.ADMIN,
  },
};

export function hasPermission(role: UserRole, permission: Permission): boolean {
  if (role === "ALL") return true;
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}
