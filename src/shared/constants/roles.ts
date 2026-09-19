export type UserRole =
  | "ALL"
  | "CLINIC_ADMIN"
  | "FRONT_DESK"
  | "DOCTOR"
  | "LAB_TECH"
  | "IMAGING_TECH";

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
  | "payment.reconcile"
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
  // Pricing
  | "pricing.read"
  | "pricing.manage"
  // User & Role Admin
  | "user.manage"
  | "role.manage"
  // Secure Patient Result Link Delivery
  | "patient_result_link.issue"
  | "patient_result_link.resend"
  | "patient_result_link.revoke"
  // Admin & Reports
  | "reports.read"
  | "report.read"
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
    "payment.reconcile",
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
    "pricing.read",
    "pricing.manage",
    "user.manage",
    "role.manage",
    "patient_result_link.issue",
    "patient_result_link.resend",
    "patient_result_link.revoke",
    "reports.read",
    "report.read",
    "settings.manage",
  ],
  CLINIC_ADMIN: [
    "patient.read_basic",
    "patient.read_clinical",
    "patient.read_history",
    "encounter.read",
    "encounter.read_basic",
    "doctor_waitlist.read_summary",
    "doctor_worklist.read",
    "clinical.read",
    "clinical.read_full",
    "payment.reconciliation.read",
    "payment.reconciliation.manage",
    "payment.reconcile",
    "pricing.read",
    "pricing.manage",
    "user.manage",
    "role.manage",
    "patient_result_link.issue",
    "patient_result_link.resend",
    "patient_result_link.revoke",
    "reports.read",
    "report.read",
    "settings.manage",
    "journey.read",
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
    "pricing.read",
    "appointment.read",
    "appointment.create",
    "appointment.update",
    "journey.read",
    "doctor_waitlist.read_summary",
    "patient_result_link.resend",
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
    "pricing.read",
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
    "report.read",
    "patient_result_link.issue",
    "patient_result_link.resend",
    "patient_result_link.revoke",
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
};

export const ROLES: Record<UserRole, RoleConfig> = {
  ALL: {
    id: "ALL",
    label: "Tất cả màn hình (Full Preview)",
    badgeLabel: "Full View",
    defaultRoute: "/dashboard",
    description: "Xem toàn bộ phân hệ hệ thống không giới hạn",
    permissions: ROLE_PERMISSIONS.ALL,
  },
  CLINIC_ADMIN: {
    id: "CLINIC_ADMIN",
    label: "Ban Giám đốc & Quản trị phòng khám",
    badgeLabel: "Clinic Admin",
    defaultRoute: "/dashboard",
    description: "Dashboard KPIs, Đối soát viện phí, Quản lý bảng giá, Phân quyền nhân viên, Cài đặt hệ thống & LIS/PACS",
    permissions: ROLE_PERMISSIONS.CLINIC_ADMIN,
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
    description: "Khám lâm sàng, Hồ sơ bệnh nhân, Chỉ định CLS, Thu phí CLS tại phòng, Kết luận, Kê đơn & Gửi kết quả",
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
};

export function hasPermission(role: UserRole, permission: Permission): boolean {
  if (role === "ALL") return true;
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}
