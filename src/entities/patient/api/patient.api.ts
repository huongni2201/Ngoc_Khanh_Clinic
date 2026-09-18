import { MOCK_PATIENTS, MockPatient } from "@/shared/constants/mock-data";
import { Patient } from "../model/patient.types";

export async function getPatients(): Promise<Patient[]> {
  // Simulated server latency
  await new Promise((r) => setTimeout(r, 50));
  return MOCK_PATIENTS as unknown as Patient[];
}

export async function getPatientById(id: string): Promise<Patient | null> {
  await new Promise((r) => setTimeout(r, 30));
  const found = MOCK_PATIENTS.find((p) => p.id === id || p.patientCode === id);
  return (found as unknown as Patient) || null;
}
