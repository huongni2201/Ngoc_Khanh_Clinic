import { Company } from "@/entities/company/model/company.types";
import { CompanyEmployee } from "@/entities/company-employee/model/company-employee.types";
import { HealthCheckBatch, AdultHealthCheckPrintData } from "@/entities/health-check/model/health-check.types";
import { calculateAgeAtDate } from "@/entities/company-employee/model/company-employee.schema";
import { MockPatient } from "@/shared/constants/mock-data";

/**
 * Maps a CompanyEmployee and their Company/Batch context to the standard
 * AdultHealthCheckPrintData projection for Mẫu số 03.
 *
 * NOTE: Never fake clinical findings, lab results, or doctor conclusions!
 * Only prefill known administrative fields (1 to 13).
 */
export function mapEmployeeToPrintData(
  employee: CompanyEmployee,
  company?: Company,
  batch?: HealthCheckBatch,
  examinationDateOverride?: string
): AdultHealthCheckPrintData {
  const examDate = examinationDateOverride || batch?.examinationDate || new Date().toISOString().split("T")[0];
  const age = employee.age > 0 ? employee.age : calculateAgeAtDate(employee.dateOfBirth, examDate);

  return {
    formNumber: `KSK-${company?.code || "CORP"}-${employee.employeeCode || employee.identityNumber.slice(-4)}`,
    fullName: employee.fullName.toUpperCase(),
    gender: employee.gender,
    dateOfBirth: employee.dateOfBirth,
    age: age >= 0 ? age : 0,
    identityNumber: employee.identityNumber,
    identityIssueDate: employee.identityIssueDate || "",
    identityIssuePlace: employee.identityIssuePlace || "",
    ethnicity: employee.ethnicity || "Kinh",
    subjectType: employee.subjectType || "Cán bộ nhân viên",
    payerSource: employee.payerSource || batch?.defaultPayerSource || company?.defaultPayerSource || (company ? `${company.name} chi trả` : "Tự túc"),
    bloodGroup: employee.bloodGroup || "",
    currentAddress: employee.currentAddress || "",
    occupation: employee.occupation || "",
    workplace: company?.name || "",
    reasonForHealthCheck: batch?.reasonForHealthCheck || "Khám sức khỏe định kỳ doanh nghiệp",
    examinationDate: examDate,

    // Metadata
    sourceType: "COMPANY_EMPLOYEE",
    companyName: company?.name,
    employeeCode: employee.employeeCode,
    departmentName: employee.department,
  };
}

/**
 * Maps a clinic Patient (e.g. from Reception front desk) to AdultHealthCheckPrintData for Mẫu số 03.
 */
export function mapPatientToPrintData(
  patient: MockPatient,
  additionalData?: {
    identityIssueDate?: string;
    identityIssuePlace?: string;
    ethnicity?: string;
    subjectType?: string;
    payerSource?: string;
    bloodGroup?: string;
    occupation?: string;
    workplace?: string;
    reasonForHealthCheck?: string;
    examinationDate?: string;
  }
): AdultHealthCheckPrintData {
  const examDate = additionalData?.examinationDate || new Date().toISOString().split("T")[0];
  const age = calculateAgeAtDate(patient.dateOfBirth, examDate);

  return {
    formNumber: `KSK-${patient.patientCode}`,
    fullName: patient.fullName.toUpperCase(),
    gender: patient.gender === "FEMALE" ? "FEMALE" : "MALE",
    dateOfBirth: patient.dateOfBirth,
    age: age >= 0 ? age : patient.age,
    identityNumber: patient.identityCard,
    identityIssueDate: additionalData?.identityIssueDate || "",
    identityIssuePlace: additionalData?.identityIssuePlace || "",
    ethnicity: additionalData?.ethnicity || "Kinh",
    subjectType: additionalData?.subjectType || "Người lao động / Cá nhân",
    payerSource: additionalData?.payerSource || "Cá nhân tự chi trả",
    bloodGroup: additionalData?.bloodGroup || "",
    currentAddress: patient.address || "",
    occupation: additionalData?.occupation || "",
    workplace: additionalData?.workplace || "",
    reasonForHealthCheck: additionalData?.reasonForHealthCheck || "Khám sức khỏe định kỳ cá nhân",
    examinationDate: examDate,

    // Metadata
    sourceType: "RECEPTION_PATIENT",
    patientCode: patient.patientCode,
  };
}
