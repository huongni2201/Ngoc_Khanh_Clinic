export interface UltrasoundResult {
  serviceName: string;
  roomCode: string;
  probeModel: string;
  frequency: string;
  templateType: "ABDOMEN" | "THYROID" | "BREAST" | "CAROTID";
  description: string;
  conclusion: string;
  images: Array<{ id: string; title: string; url: string }>;
  doctorName: string;
  status: "DRAFT" | "FINAL";
  recordedAt: string;
}

export interface ECGResult {
  serviceName: string;
  device: string;
  technician: string;
  heartRate: number;
  prInterval: string;
  qrsDuration: string;
  qtQtc: string;
  axis: string;
  conclusion: string;
  status: "FINAL";
  recordedAt: string;
}
