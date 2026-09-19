/**
 * Patient-Facing Result Package & Access Link Domain Models
 * Designed strictly according to NGOC_KHANH_ROLE_RESULT_LINK_UPDATE_PLAN_V4
 */

export interface PatientFacingLabItem {
  name: string;
  value: string;
  unit: string;
  referenceRange: string;
  isAbnormal: boolean;
}

export interface PatientFacingLabPanel {
  serviceCode: string;
  serviceName: string;
  department: string;
  verifiedAt: string;
  verifiedBy: string;
  items: PatientFacingLabItem[];
  status: "FINAL";
}

export interface PatientFacingImagingReport {
  serviceCode: string;
  serviceName: string;
  technique: string;
  roomLocation: string;
  findings: string;
  conclusion: string;
  imageUrl?: string;
  verifiedAt: string;
  verifiedBy: string;
  status: "FINAL";
}

export interface PatientFacingPrescriptionItem {
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export interface PatientFacingPrescription {
  prescriptionCode: string;
  issuedAt: string;
  doctorName: string;
  licenseNumber: string;
  items: PatientFacingPrescriptionItem[];
  advice: string;
  status: "ISSUED";
}

export interface PatientFacingAttachment {
  id: string;
  title: string;
  fileType: "PDF" | "DICOM" | "IMAGE";
  fileSize: string;
  downloadUrl: string;
}

/**
 * Clean, patient-facing Result Package.
 * Strictly excludes: DRAFT results, internal clinical notes, staff notes,
 * audit logs, integration errors, and internal payment notes.
 */
export interface PatientResultPackage {
  id: string; // Internal PK (not exposed in URL)
  encounterCode: string;
  patientName: string;
  patientCode: string;
  patientBirthYear: number;
  patientGender: "Nam" | "Nữ";
  encounterDate: string;
  doctorName: string;
  roomCode: string;
  departmentName: string;

  // Final Clinical Synthesis
  finalDiagnosis: {
    code: string;
    name: string;
  };
  conclusion: string;
  doctorAdvice: string;

  // Cận lâm sàng - ONLY FINAL results
  labResults: PatientFacingLabPanel[];
  imagingReports: PatientFacingImagingReport[];

  // Đơn thuốc - ONLY ISSUED prescription
  prescription?: PatientFacingPrescription;

  // Lịch tái khám
  followUpAppointment?: {
    appointmentCode: string;
    scheduledDate: string;
    scheduledTime: string;
    doctorName: string;
    roomCode: string;
    note: string;
  };

  // Tài liệu đính kèm dành cho bệnh nhân
  attachments: PatientFacingAttachment[];

  generatedAt: string;
}

export type AccessLinkStatus = "ACTIVE" | "EXPIRED" | "REVOKED" | "LOCKED";

export interface PatientResultAccessLink {
  id: string;
  resultPackageId: string;
  encounterCode: string;
  token: string; // Random URL token, e.g. res_3k9f0a2x8b1c4e7
  tokenHash: string; // SHA-256 hash of token
  passwordHash: string; // SHA-256 hash of plain PIN/password
  recipientPhone: string;
  recipientEmail?: string;
  channel: "SMS" | "ZALO" | "EMAIL";
  createdAt: string;
  expiresAt: string; // Default: +30 days
  revokedAt?: string;
  failedAttempts: number; // Max 5
  lastAccessedAt?: string;
  status: AccessLinkStatus;
}

export type AccessEventType =
  | "LINK_ISSUED"
  | "LINK_RESENT"
  | "LINK_ACCESSED"
  | "PASSWORD_SUCCESS"
  | "PASSWORD_FAILED"
  | "LINK_LOCKED"
  | "LINK_REVOKED"
  | "PASSWORD_RESET";

export interface PatientResultAccessEvent {
  id: string;
  accessLinkId: string;
  eventType: AccessEventType;
  channel?: "SMS" | "ZALO" | "EMAIL";
  recipientMasked?: string;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
}
