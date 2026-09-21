import { z } from "zod";

export const companySchema = z.object({
  id: z.string(),
  code: z.string().min(1, "Mã doanh nghiệp không được để trống"),
  name: z.string().min(1, "Tên doanh nghiệp không được để trống"),
  taxCode: z.string().optional(),
  address: z.string().optional(),
  contactName: z.string().optional(),
  contactPhone: z.string().optional(),
  contactEmail: z.string().email("Email không hợp lệ").optional().or(z.literal("")),
  defaultPayerSource: z.string().optional(),
  contractCode: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
  employeeCount: z.number().int().nonnegative().optional(),
  printedCount: z.number().int().nonnegative().optional(),
  completedCount: z.number().int().nonnegative().optional(),
  latestBatchName: z.string().optional(),
});

export const createCompanySchema = companySchema.omit({ id: true });

export type CompanySchema = z.infer<typeof companySchema>;
export type CreateCompanySchema = z.infer<typeof createCompanySchema>;
