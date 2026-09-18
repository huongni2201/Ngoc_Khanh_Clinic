export type OrderType = "LABORATORY" | "IMAGING" | "ULTRASOUND" | "ECG" | "EXAM";

export interface ServiceItem {
  code: string;
  name: string;
  category: "LAB" | "ECG" | "ULTRASOUND" | "XRAY" | "EXAM";
  roomCode: string;
  roomName: string;
  floor: string;
  price: number;
  preparationInstructions: string;
  sampleType?: string;
}

export interface ServiceRequest {
  id: string;
  serviceCode: string;
  serviceName: string;
  orderRound: number;
  roomCode: string;
  roomName: string;
  floor: string;
  price: number;
  preparationInstructions: string;
  status: "ORDERED" | "UNPAID" | "PAID_AUTHORIZED" | "IN_PROGRESS" | "COMPLETED" | "CANCELED";
  orderedAt: string;
}
