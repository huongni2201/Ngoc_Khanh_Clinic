import { create } from "zustand";
import {
  useDemoClinicFlowStore,
  JourneyStage,
  ServiceRequestStatus,
  PaymentAuthorizationStatus,
} from "./demo-clinic-flow.store";

export type { JourneyStage, ServiceRequestStatus, PaymentAuthorizationStatus };

export type TicketStatus = "WAITING" | "CALLED" | "SERVING" | "SKIPPED" | "COMPLETED" | "CANCELED";

export interface ReceptionTicket {
  id: string;
  number: string;
  purpose: "RECEPTION";
  status: TicketStatus;
  patientName?: string;
  patientCode?: string;
  source: "KIOSK" | "RECEPTION" | "APPOINTMENT";
  issuedAt: string;
}

export interface ExamTicket {
  id: string;
  number: string;
  purpose: "INITIAL_EXAM" | "RETURN_FOR_CONCLUSION";
  status: TicketStatus;
  roomCode: string;
  doctorName: string;
  patientName: string;
  patientCode: string;
  issuedAt: string;
  resultSummary?: string;
}

export interface DemoJourneyState {
  patientId: string;
  patientCode: string;
  patientName: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  age: number;
  dob: string;
  phone: string;
  identityCard: string;
  hasPenicillinAllergy: boolean;

  encounterCode: string;
  isEncounterCreated: boolean;
  currentStage: JourneyStage;

  receptionTicket: ReceptionTicket | null;
  receptionQueueList: ReceptionTicket[];
  initialExamTicket: ExamTicket | null;
  returnExamTicket: ExamTicket | null;

  labStatus: "PENDING" | "SAMPLE_COLLECTED" | "IN_PROGRESS" | "FINAL";
  imagingStatus: "PENDING" | "IN_PROGRESS" | "FINAL";

  isPaid: boolean;
  paymentMethod: "CASH" | "VIETQR" | "COMPANY_CREDIT" | "POS" | null;
  authorizationStatus: PaymentAuthorizationStatus;

  isPrescriptionIssued: boolean;
  rxCode: string;
  isDispensed: boolean;
  isAppointmentBooked: boolean;
  appointmentCode: string;

  issueReceptionTicket: (source?: "KIOSK" | "RECEPTION" | "APPOINTMENT", customNum?: string) => void;
  callReceptionTicket: () => void;
  startServingReception: () => void;
  confirmReception: (roomCode?: string, doctorName?: string) => void;

  callInitialExam: () => void;
  startInitialExam: () => void;

  submitOrders: () => void;
  confirmPayment: (method: "CASH" | "VIETQR" | "COMPANY_CREDIT" | "POS") => void;

  collectLabSample: () => void;
  finalizeLab: () => void;
  finalizeImaging: () => void;

  callReturnExam: () => void;
  startConclusion: () => void;

  issuePrescription: () => void;
  dispensePrescription: () => void;
  bookAppointment: () => void;
  completeEncounter: () => void;

  resetDemo: () => void;
}

export const useDemoJourneyStore = create<DemoJourneyState>((set, get) => {
  // Sync with useDemoClinicFlowStore whenever possible
  return {
    patientId: "p1",
    patientCode: "PT-001842",
    patientName: "Nguyễn Văn An",
    gender: "MALE",
    age: 45,
    dob: "12/04/1981",
    phone: "0912 345 678",
    identityCard: "001081008892",
    hasPenicillinAllergy: true,

    encounterCode: "ENC-260919-041",
    isEncounterCreated: true,
    currentStage: "WAITING_FOR_DOCTOR",

    receptionTicket: null,
    receptionQueueList: [],
    initialExamTicket: null,
    returnExamTicket: null,

    labStatus: "FINAL",
    imagingStatus: "FINAL",

    isPaid: true,
    paymentMethod: "VIETQR",
    authorizationStatus: "AUTHORIZED",

    isPrescriptionIssued: false,
    rxCode: "RX-260919-018",
    isDispensed: false,
    isAppointmentBooked: false,
    appointmentCode: "APT-261017-001",

    issueReceptionTicket: () => {},
    callReceptionTicket: () => {},
    startServingReception: () => {},
    confirmReception: () => {
      useDemoClinicFlowStore.getState().confirmInitialExamPayment();
      set({ currentStage: "WAITING_FOR_DOCTOR" });
    },

    callInitialExam: () => {},
    startInitialExam: () => {
      useDemoClinicFlowStore.getState().startDoctorExam();
      set({ currentStage: "IN_EXAM" });
    },

    submitOrders: () => {
      useDemoClinicFlowStore.getState().submitOrderRound();
      set({
        currentStage: "WAITING_FOR_DIAGNOSTIC_PAYMENT",
        isPaid: false,
        authorizationStatus: "PENDING",
      });
    },

    confirmPayment: (method) => {
      useDemoClinicFlowStore.getState().confirmDiagnosticPayment(method);
      set({
        isPaid: true,
        paymentMethod: method,
        authorizationStatus: method === "COMPANY_CREDIT" ? "WAIVED" : "AUTHORIZED",
        currentStage: "WAITING_FOR_DIAGNOSTIC",
      });
    },

    collectLabSample: () => {
      useDemoClinicFlowStore.getState().collectLabSample();
      set({
        labStatus: "SAMPLE_COLLECTED",
        currentStage: "DIAGNOSTIC_IN_PROGRESS",
      });
    },

    finalizeLab: () => {
      useDemoClinicFlowStore.getState().finalizeLab();
      const nextStage = useDemoClinicFlowStore.getState().journeyStage;
      set({
        labStatus: "FINAL",
        currentStage: nextStage,
      });
    },

    finalizeImaging: () => {
      useDemoClinicFlowStore.getState().finalizeImaging();
      const nextStage = useDemoClinicFlowStore.getState().journeyStage;
      set({
        imagingStatus: "FINAL",
        currentStage: nextStage,
      });
    },

    callReturnExam: () => {},
    startConclusion: () => {
      useDemoClinicFlowStore.getState().startConclusion();
      set({ currentStage: "IN_CONCLUSION" });
    },

    issuePrescription: () => {
      useDemoClinicFlowStore.getState().issuePrescription();
      set({ isPrescriptionIssued: true });
    },

    dispensePrescription: () => {
      set({ isDispensed: true });
    },

    bookAppointment: () => {
      useDemoClinicFlowStore.getState().createFollowUpAppointment();
      set({ isAppointmentBooked: true });
    },

    completeEncounter: () => {
      useDemoClinicFlowStore.getState().completeEncounter();
      set({ currentStage: "COMPLETED" });
    },

    resetDemo: () => {
      useDemoClinicFlowStore.getState().resetDemo();
      set({
        patientId: "p1",
        patientCode: "PT-001842",
        patientName: "Nguyễn Văn An",
        encounterCode: "ENC-260919-041",
        isEncounterCreated: true,
        currentStage: "WAITING_FOR_DOCTOR",
        labStatus: "FINAL",
        imagingStatus: "FINAL",
        isPaid: true,
        paymentMethod: "VIETQR",
        authorizationStatus: "AUTHORIZED",
        isPrescriptionIssued: false,
        isDispensed: false,
        isAppointmentBooked: false,
      });
    },
  };
});
