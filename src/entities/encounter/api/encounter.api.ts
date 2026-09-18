import { MOCK_ACTIVE_ENCOUNTER } from "@/shared/constants/mock-data";
import { Encounter } from "../model/encounter.types";

export async function getActiveEncounter(): Promise<Encounter> {
  await new Promise((r) => setTimeout(r, 40));
  return MOCK_ACTIVE_ENCOUNTER as unknown as Encounter;
}

export async function getEncounterById(id: string): Promise<Encounter | null> {
  await new Promise((r) => setTimeout(r, 30));
  if (id === MOCK_ACTIVE_ENCOUNTER.id || id === MOCK_ACTIVE_ENCOUNTER.encounterCode) {
    return MOCK_ACTIVE_ENCOUNTER as unknown as Encounter;
  }
  return MOCK_ACTIVE_ENCOUNTER as unknown as Encounter;
}
