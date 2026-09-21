import { z } from "zod";

export const healthCheckBatchSchema = z.object({
  id: z.string(),
  companyId: z.string(),
  code: z.string().min(1, "Mã đợt khám không được để trống"),
  name: z.string().min(1, "Tên đợt khám không được để trống"),
  examinationDate: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  reasonForHealthCheck: z.string().default("Khám sức khỏe định kỳ"),
  defaultPayerSource: z.string().optional(),
  templateCode: z.literal("BYT_2026_M03").default("BYT_2026_M03"),
  status: z.enum(["DRAFT", "READY", "IN_PROGRESS", "COMPLETED"]).default("DRAFT"),
  employeeCount: z.number().int().nonnegative().optional(),
  printedCount: z.number().int().nonnegative().optional(),
  completedCount: z.number().int().nonnegative().optional(),
  createdAt: z.string().optional(),
});

export const adultHealthCheckPrintDataSchema = z.object({
  formNumber: z.string().optional(),
  fullName: z.string().min(1, "Họ và tên không được để trống"),
  gender: z.enum(["MALE", "FEMALE"]),
  dateOfBirth: z.string().min(1, "Ngày sinh không được để trống"),
  age: z.number().int().min(18, "Phải từ đủ 18 tuổi trở lên"),
  identityNumber: z.string().min(1, "CCCD/Hộ chiếu không được để trống"),
  identityIssueDate: z.string().optional(),
  identityIssuePlace: z.string().optional(),
  ethnicity: z.string().optional(),
  subjectType: z.string().optional(),
  payerSource: z.string().optional(),
  bloodGroup: z.string().optional(),
  currentAddress: z.string().optional(),
  occupation: z.string().optional(),
  workplace: z.string().optional(),
  reasonForHealthCheck: z.string().optional(),
  examinationDate: z.string().optional(),
  sourceType: z.enum(["COMPANY_EMPLOYEE", "RECEPTION_PATIENT"]),
  companyName: z.string().optional(),
  employeeCode: z.string().optional(),
  patientCode: z.string().optional(),
  departmentName: z.string().optional(),
});

export type HealthCheckBatchSchema = z.infer<typeof healthCheckBatchSchema>;
export type AdultHealthCheckPrintDataSchema = z.infer<typeof adultHealthCheckPrintDataSchema>;
