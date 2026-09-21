export type EmployeeValidationStatus =
  | "VALID"
  | "INCOMPLETE"
  | "UNDER_18"
  | "DUPLICATE_IDENTITY";

export type EmployeePatientStatus = "LINKED" | "NOT_LINKED";

export type EmployeePrintStatus = "NOT_PRINTED" | "PRINTED";

export type EmployeeExamStatus =
  | "NOT_ARRIVED"
  | "CHECKED_IN"
  | "IN_EXAM"
  | "PENDING_CONCLUSION"
  | "COMPLETED";

export interface CompanyEmployee {
  id: string;
  companyId: string;
  batchId?: string;
  employeeCode?: string;
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
  department?: string;
  phone?: string;
  email?: string;
  linkedPatientId?: string;

  // Status indicators
  validationStatus: EmployeeValidationStatus;
  validationIssues?: string[];
  patientProfileStatus: EmployeePatientStatus;
  printStatus: EmployeePrintStatus;
  examStatus: EmployeeExamStatus;

  createdAt?: string;
}
