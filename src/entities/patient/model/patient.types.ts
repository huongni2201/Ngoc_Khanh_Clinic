export type Gender = "MALE" | "FEMALE" | "OTHER";

export interface Allergy {
  substance: string;
  severity: "LOW" | "MODERATE" | "SEVERE";
  note: string;
}

export interface VitalSigns {
  bloodPressure: string;
  heartRate: number;
  glucose?: number;
  cholesterol?: number;
  bmi: number;
  spo2: number;
  temperature?: number;
  weight?: number;
  height?: number;
  recordedAt: string;
}

export interface Patient {
  id: string;
  patientCode: string;
  fullName: string;
  dateOfBirth: string;
  age: number;
  gender: Gender;
  phone?: string;
  identityCard?: string;
  address?: string;
  allergies: Allergy[];
  chronicConditions: string[];
  regularMedications: string[];
  latestVitals?: VitalSigns;
  createdAt?: string;
}
