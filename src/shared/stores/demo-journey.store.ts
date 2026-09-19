import { create } from "zustand";

export type JourneyStage =
  | "WAITING_FOR_RECEPTION"
  | "IN_RECEPTION"
  | "WAITING_FOR_EXAM"
  | "IN_EXAM"
  | "WAITING_FOR_PAYMENT"
  | "WAITING_FOR_DIAGNOSTIC"
  | "DIAGNOSTIC_IN_PROGRESS"
  | "WAITING_FOR_RESULTS"
  | "WAITING_FOR_CONCLUSION"
  | "IN_CONCLUSION"
  | "COMPLETED";

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
  // Demo Patient Context
  patientId: string;
  patientCode: string;
  patientName: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  age: number;
  dob: string;
  phone: string;
  identityCard: string;
  hasPenicillinAllergy: boolean;

  // Active Encounter & Stage
  encounterCode: string;
  isEncounterCreated: boolean;
  currentStage: JourneyStage;

  // Queues
  receptionTicket: ReceptionTicket | null;
  receptionQueueList: ReceptionTicket[];
  initialExamTicket: ExamTicket | null;
  returnExamTicket: ExamTicket | null;

  // Diagnostics Progress
  labStatus: "PENDING" | "SAMPLE_COLLECTED" | "VERIFIED" | "FINAL";
  imagingStatus: "PENDING" | "IN_PROGRESS" | "FINAL";

  // Billing & Payment Gate
  isPaid: boolean;
  paymentMethod: "CASH" | "VIETQR" | "COMPANY_CREDIT" | null;
  authorizationStatus: "NOT_REQUIRED" | "PENDING" | "AUTHORIZED" | "WAIVED";

  // Clinical & Pharmacy
  isPrescriptionIssued: boolean;
  rxCode: string;
  isDispensed: boolean;
  isAppointmentBooked: boolean;
  appointmentCode: string;

  // Actions
  issueReceptionTicket: (source?: "KIOSK" | "RECEPTION" | "APPOINTMENT", customNum?: string) => void;
  callReceptionTicket: () => void;
  startServingReception: () => void;
  confirmReception: (roomCode?: string, doctorName?: string) => void;

  callInitialExam: () => void;
  startInitialExam: () => void;

  submitOrders: () => void;
  confirmPayment: (method: "CASH" | "VIETQR" | "COMPANY_CREDIT") => void;

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

const INITIAL_RECEPTION_QUEUE: ReceptionTicket[] = [
  {
    id: "rec-022",
    number: "A022",
    purpose: "RECEPTION",
    status: "SERVING",
    patientName: "Phạm Hồng Phúc",
    patientCode: "PT-008910",
    source: "KIOSK",
    issuedAt: "08:10",
  },
  {
    id: "rec-023",
    number: "A023",
    purpose: "RECEPTION",
    status: "WAITING",
    patientName: "Nguyễn Văn An",
    patientCode: "PT-001842",
    source: "KIOSK",
    issuedAt: "08:15",
  },
  {
    id: "rec-024",
    number: "A024",
    purpose: "RECEPTION",
    status: "WAITING",
    patientName: "Trần Thị Bích",
    patientCode: "PT-003194",
    source: "APPOINTMENT",
    issuedAt: "08:18",
  },
  {
    id: "rec-025",
    number: "A025",
    purpose: "RECEPTION",
    status: "WAITING",
    patientName: "Lê Hoàng Nam",
    patientCode: "PT-007812",
    source: "KIOSK",
    issuedAt: "08:22",
  },
];

export const useDemoJourneyStore = create<DemoJourneyState>((set, get) => ({
  // Demo Patient Default
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
  currentStage: "IN_EXAM",

  receptionTicket: INITIAL_RECEPTION_QUEUE[1], // A023
  receptionQueueList: INITIAL_RECEPTION_QUEUE,

  initialExamTicket: {
    id: "exm-032",
    number: "P203-032",
    purpose: "INITIAL_EXAM",
    status: "SERVING",
    roomCode: "P.203",
    doctorName: "BS. Lê Minh",
    patientName: "Nguyễn Văn An",
    patientCode: "PT-001842",
    issuedAt: "08:20",
  },

  returnExamTicket: null,

  labStatus: "VERIFIED",
  imagingStatus: "FINAL",

  isPaid: true,
  paymentMethod: "CASH",
  authorizationStatus: "AUTHORIZED",

  isPrescriptionIssued: false,
  rxCode: "RX-260919-018",
  isDispensed: false,
  isAppointmentBooked: false,
  appointmentCode: "APT-261017-001",

  issueReceptionTicket: (source = "KIOSK", customNum) => {
    const num = customNum || "A023";
    const newTicket: ReceptionTicket = {
      id: `rec-${Date.now().toString().slice(-4)}`,
      number: num,
      purpose: "RECEPTION",
      status: "WAITING",
      patientName: "Nguyễn Văn An",
      patientCode: "PT-001842",
      source,
      issuedAt: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
    };

    set((state) => ({
      receptionTicket: newTicket,
      receptionQueueList: [
        ...state.receptionQueueList.filter((t) => t.number !== num),
        newTicket,
      ],
      currentStage: "WAITING_FOR_RECEPTION",
    }));
  },

  callReceptionTicket: () => {
    set((state) => {
      const ticket = state.receptionTicket
        ? { ...state.receptionTicket, status: "CALLED" as TicketStatus }
        : null;
      return {
        receptionTicket: ticket,
        receptionQueueList: state.receptionQueueList.map((t) =>
          t.number === "A023" ? { ...t, status: "CALLED" } : t
        ),
      };
    });
  },

  startServingReception: () => {
    set((state) => {
      const ticket = state.receptionTicket
        ? { ...state.receptionTicket, status: "SERVING" as TicketStatus }
        : null;
      return {
        receptionTicket: ticket,
        currentStage: "IN_RECEPTION",
        receptionQueueList: state.receptionQueueList.map((t) =>
          t.number === "A023" ? { ...t, status: "SERVING" } : t
        ),
      };
    });
  },

  confirmReception: (roomCode = "P.203", doctorName = "BS. Lê Minh") => {
    const initialExam: ExamTicket = {
      id: "exm-032",
      number: "P203-032",
      purpose: "INITIAL_EXAM",
      status: "WAITING",
      roomCode,
      doctorName,
      patientName: "Nguyễn Văn An",
      patientCode: "PT-001842",
      issuedAt: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
    };

    set((state) => ({
      isEncounterCreated: true,
      currentStage: "WAITING_FOR_EXAM",
      receptionTicket: state.receptionTicket
        ? { ...state.receptionTicket, status: "COMPLETED" }
        : null,
      receptionQueueList: state.receptionQueueList.map((t) =>
        t.number === "A023" ? { ...t, status: "COMPLETED" } : t
      ),
      initialExamTicket: initialExam,
    }));
  },

  callInitialExam: () => {
    set((state) => ({
      initialExamTicket: state.initialExamTicket
        ? { ...state.initialExamTicket, status: "CALLED" }
        : null,
    }));
  },

  startInitialExam: () => {
    set((state) => ({
      currentStage: "IN_EXAM",
      initialExamTicket: state.initialExamTicket
        ? { ...state.initialExamTicket, status: "SERVING" }
        : null,
    }));
  },

  submitOrders: () => {
    set({
      currentStage: "WAITING_FOR_PAYMENT",
      isPaid: false,
      authorizationStatus: "PENDING",
    });
  },

  confirmPayment: (method) => {
    const isWaiver = method === "COMPANY_CREDIT";
    set({
      isPaid: !isWaiver,
      paymentMethod: method,
      authorizationStatus: isWaiver ? "WAIVED" : "AUTHORIZED",
      currentStage: "WAITING_FOR_DIAGNOSTIC",
    });
  },

  collectLabSample: () => {
    set({
      labStatus: "SAMPLE_COLLECTED",
      currentStage: "DIAGNOSTIC_IN_PROGRESS",
    });
  },

  finalizeLab: () => {
    set((state) => {
      const nextLabStatus = "FINAL";
      const bothDone = state.imagingStatus === "FINAL";

      if (bothDone) {
        const returnTicket: ExamTicket = {
          id: "exm-r015",
          number: "P203-R015",
          purpose: "RETURN_FOR_CONCLUSION",
          status: "WAITING",
          roomCode: "P.203",
          doctorName: "BS. Lê Minh",
          patientName: state.patientName,
          patientCode: state.patientCode,
          issuedAt: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
          resultSummary: "Đã đủ 3/3 kết quả (CTM WBC 12.8 ↑, Glucose 5.8, ECG dày thất trái nhẹ)",
        };

        return {
          labStatus: nextLabStatus,
          currentStage: "WAITING_FOR_CONCLUSION",
          returnExamTicket: returnTicket,
        };
      }

      return {
        labStatus: nextLabStatus,
        currentStage: "WAITING_FOR_RESULTS",
      };
    });
  },

  finalizeImaging: () => {
    set((state) => {
      const nextImagingStatus = "FINAL";
      const bothDone = state.labStatus === "FINAL";

      if (bothDone) {
        const returnTicket: ExamTicket = {
          id: "exm-r015",
          number: "P203-R015",
          purpose: "RETURN_FOR_CONCLUSION",
          status: "WAITING",
          roomCode: "P.203",
          doctorName: "BS. Lê Minh",
          patientName: state.patientName,
          patientCode: state.patientCode,
          issuedAt: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
          resultSummary: "Đã đủ 3/3 kết quả (CTM WBC 12.8 ↑, Glucose 5.8, ECG dày thất trái nhẹ)",
        };

        return {
          imagingStatus: nextImagingStatus,
          currentStage: "WAITING_FOR_CONCLUSION",
          returnExamTicket: returnTicket,
        };
      }

      return {
        imagingStatus: nextImagingStatus,
        currentStage: "WAITING_FOR_RESULTS",
      };
    });
  },

  callReturnExam: () => {
    set((state) => ({
      returnExamTicket: state.returnExamTicket
        ? { ...state.returnExamTicket, status: "CALLED" }
        : null,
    }));
  },

  startConclusion: () => {
    set((state) => ({
      currentStage: "IN_CONCLUSION",
      returnExamTicket: state.returnExamTicket
        ? { ...state.returnExamTicket, status: "SERVING" }
        : null,
    }));
  },

  issuePrescription: () => {
    set({
      isPrescriptionIssued: true,
    });
  },

  dispensePrescription: () => {
    set({
      isDispensed: true,
    });
  },

  bookAppointment: () => {
    set({
      isAppointmentBooked: true,
    });
  },

  completeEncounter: () => {
    set((state) => ({
      currentStage: "COMPLETED",
      initialExamTicket: state.initialExamTicket
        ? { ...state.initialExamTicket, status: "COMPLETED" }
        : null,
      returnExamTicket: state.returnExamTicket
        ? { ...state.returnExamTicket, status: "COMPLETED" }
        : null,
    }));
  },

  resetDemo: () => {
    set({
      patientId: "p1",
      patientCode: "PT-001842",
      patientName: "Nguyễn Văn An",
      encounterCode: "ENC-260919-041",
      isEncounterCreated: false,
      currentStage: "WAITING_FOR_RECEPTION",

      receptionTicket: {
        id: "rec-023",
        number: "A023",
        purpose: "RECEPTION",
        status: "WAITING",
        patientName: "Nguyễn Văn An",
        patientCode: "PT-001842",
        source: "KIOSK",
        issuedAt: "08:15",
      },
      receptionQueueList: INITIAL_RECEPTION_QUEUE,

      initialExamTicket: null,
      returnExamTicket: null,

      labStatus: "PENDING",
      imagingStatus: "PENDING",

      isPaid: false,
      paymentMethod: null,
      authorizationStatus: "PENDING",

      isPrescriptionIssued: false,
      isDispensed: false,
      isAppointmentBooked: false,
    });
  },
}));
