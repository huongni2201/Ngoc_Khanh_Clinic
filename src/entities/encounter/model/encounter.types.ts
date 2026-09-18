export type EncounterStatus =
  | "WAITING_FOR_EXAM"
  | "IN_EXAM"
  | "ORDERED"
  | "WAITING_FOR_PAYMENT"
  | "PAID_AUTHORIZED"
  | "DIAGNOSTIC_IN_PROGRESS"
  | "PARTIAL_RESULTS"
  | "RESULTS_COMPLETE"
  | "WAITING_FOR_CONCLUSION"
  | "PRESCRIPTION_READY"
  | "COMPLETED";

export interface EncounterOrder {
  round: number;
  serviceCode: string;
  serviceName: string;
  roomCode: string;
  roomName: string;
  price: number;
  status: "ORDERED" | "UNPAID" | "PAID_AUTHORIZED" | "IN_PROGRESS" | "COMPLETED";
}

export interface Encounter {
  id: string;
  encounterCode: string;
  queueNumber: string;
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
