export type EncounterLifecycleStatus =
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELED";

export type EncounterStatus =
  | "IN_PROGRESS"
  | "WAITING_FOR_EXAM"
  | "IN_EXAM"
  | "ORDERED"
  | "DIAGNOSTIC_IN_PROGRESS"
  | "PARTIAL_RESULTS"
  | "RESULTS_COMPLETE"
  | "WAITING_FOR_CONCLUSION"
  | "IN_CONCLUSION"
  | "PRESCRIPTION_READY"
  | "COMPLETED"
  | "CANCELED";

export type JourneyStage =
  | "REGISTERED"
  | "WAITING_FOR_DOCTOR"
  | "IN_EXAM"
  | "WAITING_FOR_DIAGNOSTIC_PAYMENT"
  | "WAITING_FOR_DIAGNOSTIC"
  | "DIAGNOSTIC_IN_PROGRESS"
  | "WAITING_FOR_RESULTS"
  | "WAITING_FOR_CONCLUSION"
  | "IN_CONCLUSION"
  | "COMPLETED"
  | "CANCELED";

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

export interface EncounterOrder {
  round: number;
  serviceCode: string;
  serviceName: string;
  roomCode: string;
  roomName: string;
  price: number;
  serviceRequestStatus: ServiceRequestStatus;
  paymentAuthorizationStatus: PaymentAuthorizationStatus;
}

export interface Encounter {
  id: string;
  encounterCode: string;
  queueNumber?: string;
  patientId: string;
  patientCode: string;
  patientName: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  age: number;
  dob: string;
  registeredAt: string;
  status: EncounterStatus;
  chiefComplaint: string;
  clinicalNotes: string;
  icdCode: string;
  icdName: string;
  roomCode: string;
  doctorName: string;
  orders: EncounterOrder[];
  invoice: {
    invoiceCode: string;
    totalAmount: number;
    status: "UNPAID" | "PAID";
    paymentMethod?: "CASH" | "VIETQR" | "CARD";
    vietQR: {
      bankName: string;
      accountNumber: string;
      accountName: string;
      amount: number;
      transferContent: string;
      qrImageUrl: string;
    };
  };
}

/** Read model for Doctor Worklist (includes clinical info) */
export interface DoctorWorklistItem {
  encounterId: string;
  patientId: string;
  patientCode: string;
  patientName: string;
  age: number;
  sex: "MALE" | "FEMALE" | "OTHER";
  reasonForVisit: string;
  roomCode: string;
  doctorId: string;
  doctorName: string;
  journeyStage: JourneyStage;
  initialConsultationPaymentStatus: "CONFIRMED" | "PENDING";
  activeOrderRound?: number;
  diagnosticProgress?: {
    completed: number;
    total: number;
  };
  waitingSince: string;
  arrivedAt?: string;
  hasPenicillinAllergy?: boolean;
  isConclusionReady?: boolean;
}

/** Read model for Front Desk Doctor Waitlist Summary (Strictly operational, NO clinical notes/detailed results) */
export interface DoctorWaitlistSummaryItem {
  encounterId: string;
  patientCode: string;
  patientName: string;
  doctorName: string;
  roomCode: string;
  department: string;
  stage:
    | "WAITING_FOR_DOCTOR"
    | "IN_EXAM"
    | "WAITING_FOR_DIAGNOSTIC_PAYMENT"
    | "WAITING_FOR_DIAGNOSTIC"
    | "DIAGNOSTIC_IN_PROGRESS"
    | "WAITING_FOR_RESULTS"
    | "WAITING_FOR_CONCLUSION";
  waitingMinutes: number;
  initialExamFeePaid: boolean;
}
