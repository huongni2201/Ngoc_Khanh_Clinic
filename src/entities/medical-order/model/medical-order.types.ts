export type OrderType = "LABORATORY" | "IMAGING" | "ULTRASOUND" | "ECG" | "EXAM";

export type ServiceRequestStatus =
  | "ORDERED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELED";

export type PaymentAuthorizationStatus =
  | "NOT_REQUIRED"
  | "PENDING"
  | "AUTHORIZED"
  | "WAIVED"
  | "REVOKED";

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
  serviceRequestStatus: ServiceRequestStatus;
  paymentAuthorizationStatus: PaymentAuthorizationStatus;
  status?: "ORDERED" | "UNPAID" | "PAID_AUTHORIZED" | "IN_PROGRESS" | "COMPLETED" | "CANCELED";
  orderedAt: string;
}
