import { z } from "zod";

/**
 * Parse various date formats (YYYY-MM-DD, DD/MM/YYYY, DD-MM-YYYY) into a Date object.
 * Returns null if invalid.
 */
export function parseFlexibleDate(dateStr: string): Date | null {
  if (!dateStr || typeof dateStr !== "string") return null;
  const trimmed = dateStr.trim();

  // Format DD/MM/YYYY or DD-MM-YYYY
  const dmyMatch = trimmed.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (dmyMatch) {
    const day = parseInt(dmyMatch[1], 10);
    const month = parseInt(dmyMatch[2], 10) - 1;
    const year = parseInt(dmyMatch[3], 10);
    const date = new Date(year, month, day);
    if (
      date.getFullYear() === year &&
      date.getMonth() === month &&
      date.getDate() === day
    ) {
      return date;
    }
    return null;
  }

  // Format YYYY-MM-DD or YYYY/MM/DD
  const ymdMatch = trimmed.match(/^(\d{4})[/-](\d{1,2})[/-](\d{1,2})$/);
  if (ymdMatch) {
    const year = parseInt(ymdMatch[1], 10);
    const month = parseInt(ymdMatch[2], 10) - 1;
    const day = parseInt(ymdMatch[3], 10);
    const date = new Date(year, month, day);
    if (
      date.getFullYear() === year &&
      date.getMonth() === month &&
      date.getDate() === day
    ) {
      return date;
    }
    return null;
  }

  // Fallback Date.parse
  const parsed = new Date(trimmed);
  if (!isNaN(parsed.getTime())) {
    return parsed;
  }

  return null;
}

/**
 * Calculate age on a specific examination date.
 * Exactly 18 on exam date -> 18
 * 1 day before 18th birthday -> 17
 * Returns -1 if invalid DOB.
 */
export function calculateAgeAtDate(
  dobInput: string | Date,
  examDateInput?: string | Date
): number {
  const dob = typeof dobInput === "string" ? parseFlexibleDate(dobInput) : dobInput;
  if (!dob || isNaN(dob.getTime())) return -1;

  let examDate: Date;
  if (!examDateInput) {
    examDate = new Date();
  } else if (typeof examDateInput === "string") {
    examDate = parseFlexibleDate(examDateInput) || new Date();
  } else {
    examDate = examDateInput;
  }

  let age = examDate.getFullYear() - dob.getFullYear();
  const m = examDate.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && examDate.getDate() < dob.getDate())) {
    age--;
  }

  return age;
}

export const employeeValidationStatusEnum = z.enum([
  "VALID",
  "INCOMPLETE",
  "UNDER_18",
  "DUPLICATE_IDENTITY",
]);

export const employeePatientStatusEnum = z.enum(["LINKED", "NOT_LINKED"]);
export const employeePrintStatusEnum = z.enum(["NOT_PRINTED", "PRINTED"]);
export const employeeExamStatusEnum = z.enum([
  "NOT_ARRIVED",
  "CHECKED_IN",
  "IN_EXAM",
  "PENDING_CONCLUSION",
  "COMPLETED",
]);

export const companyEmployeeSchema = z.object({
  id: z.string(),
  companyId: z.string(),
  batchId: z.string().optional(),
  employeeCode: z.string().optional(),
  fullName: z.string().min(1, "Họ và tên không được để trống"),
  gender: z.enum(["MALE", "FEMALE"]),
  dateOfBirth: z.string().min(1, "Ngày sinh không được để trống"),
  age: z.number().int(),
  identityNumber: z.string().min(1, "CCCD/Hộ chiếu không được để trống"),
  identityIssueDate: z.string().optional(),
  identityIssuePlace: z.string().optional(),
  ethnicity: z.string().optional(),
  subjectType: z.string().optional(),
  payerSource: z.string().optional(),
  bloodGroup: z.string().optional(),
  currentAddress: z.string().optional(),
  occupation: z.string().optional(),
  department: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Email không hợp lệ").optional().or(z.literal("")),
  linkedPatientId: z.string().optional(),

  validationStatus: employeeValidationStatusEnum,
  validationIssues: z.array(z.string()).optional(),
  patientProfileStatus: employeePatientStatusEnum,
  printStatus: employeePrintStatusEnum,
  examStatus: employeeExamStatusEnum,
  createdAt: z.string().optional(),
});

export type CompanyEmployeeSchema = z.infer<typeof companyEmployeeSchema>;
