import { z } from "zod";

export const allergySchema = z.object({
  substance: z.string().min(1, "Vui lòng nhập tên dị nguyên"),
  severity: z.enum(["LOW", "MODERATE", "SEVERE"]),
  note: z.string(),
});

export const patientSchema = z.object({
  id: z.string(),
  patientCode: z.string(),
  fullName: z.string().min(1, "Họ và tên không được để trống"),
  dateOfBirth: z.string().min(1, "Ngày sinh không được để trống"),
  age: z.number().int().positive(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  phone: z.string().optional(),
  identityCard: z.string().optional(),
  address: z.string().optional(),
  allergies: z.array(allergySchema).default([]),
  chronicConditions: z.array(z.string()).default([]),
  regularMedications: z.array(z.string()).default([]),
});

export type PatientSchema = z.infer<typeof patientSchema>;
