export interface Analyte {
  name: string;
  value: string;
  unit: string;
  refRange: string;
  isAbnormal: boolean;
  flag: string;
}

export interface LabPanelResult {
  testGroup: string;
  panel: string;
  specimenCode: string;
  specimenType: string;
  collectedAt: string;
  analyzer: string;
  analytes: Analyte[];
  status: "DRAFT" | "VERIFIED" | "FINAL" | "CORRECTED";
  verifiedBy?: string;
  verifiedAt?: string;
}
