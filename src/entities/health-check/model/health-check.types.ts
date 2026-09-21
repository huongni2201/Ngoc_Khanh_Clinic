export type BatchStatus = "DRAFT" | "READY" | "IN_PROGRESS" | "COMPLETED";

export interface HealthCheckBatch {
  id: string;
  companyId: string;
  code: string;
  name: string;
  examinationDate?: string;
  startDate?: string;
  endDate?: string;
  reasonForHealthCheck: string;
  defaultPayerSource?: string;
  templateCode: "BYT_2026_M03";
  status: BatchStatus;
  employeeCount?: number;
  printedCount?: number;
  completedCount?: number;
  createdAt?: string;
}

export interface AdultHealthCheckPrintData {
  formNumber?: string;
  fullName: string;
  gender: "MALE" | "FEMALE";
  dateOfBirth: string;
  age: number;
  identityNumber: string;
  identityIssueDate?: string;
  identityIssuePlace?: string;
  ethnicity?: string;
  subjectType?: string;
  payerSource?: string;
  bloodGroup?: string;
  currentAddress?: string;
  occupation?: string;
  workplace?: string;
  reasonForHealthCheck?: string;
  examinationDate?: string;

  // Metadata
  sourceType: "COMPANY_EMPLOYEE" | "RECEPTION_PATIENT";
  companyName?: string;
  employeeCode?: string;
  patientCode?: string;
  departmentName?: string;
}
