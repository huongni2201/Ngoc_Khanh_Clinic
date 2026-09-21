import { AdultHealthCheckPrintData } from "@/entities/health-check/model/health-check.types";

export interface PrintFormOptions {
  showWatermark?: boolean;
  clinicName?: string;
  clinicAddress?: string;
  clinicHotline?: string;
  doctorSeal?: boolean;
}

export interface HealthCheckFormPrintProps {
  data: AdultHealthCheckPrintData;
  pageNumber?: number; // if rendering single page
  options?: PrintFormOptions;
}

export interface BatchHealthCheckPrintProps {
  records: AdultHealthCheckPrintData[];
  options?: PrintFormOptions;
}
