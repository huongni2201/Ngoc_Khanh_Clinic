import { create } from "zustand";
import { MOCK_PATIENTS, MockPatient, MockServiceItem } from "../constants/mock-data";

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

export interface DemoOrderItem {
  id: string;
  round: number;
  serviceCode: string;
  serviceName: string;
  category: "LAB" | "ECG" | "ULTRASOUND" | "XRAY" | "ENDOSCOPY" | "EXAM";
  roomCode: string;
  roomName: string;
  floor: string;
  price: number;
  serviceRequestStatus: ServiceRequestStatus;
  paymentAuthorizationStatus: PaymentAuthorizationStatus;
  preparationInstructions: string;
  sampleType?: string;
  addedAt: string;
}

export interface DemoClinicFlowState {
  // Demo Patient Context
  activePatientId: string;
  patientCode: string;
  patientName: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  age: number;
  dob: string;
  phone: string;
  identityCard: string;
  hasPenicillinAllergy: boolean;
  chronicConditions: string[];

  // Active Encounter & Stage
  activeEncounterId: string;
  encounterCode: string;
  encounterStatus: "IN_PROGRESS" | "COMPLETED" | "CANCELED";
  journeyStage: JourneyStage;

  // Front Desk / Doctor Assignment
  department: string;
  roomCode: string;
  doctorName: string;
  chiefComplaint: string;

  // Initial Consultation Fee (at Front Desk)
  initialExamFee: number;
  initialExamFeePaid: boolean;
  initialExamPaymentMethod: "CASH" | "VIETQR" | "POS" | null;

  // Diagnostic Orders & Rounds
  orderRound: number;
  orders: DemoOrderItem[];
  diagnosticInvoiceStatus: "NONE" | "OPEN" | "PAID" | "CANCELED";
  diagnosticPaymentMethod: "CASH" | "VIETQR" | "POS" | "COMPANY_CREDIT" | null;

  // Diagnostics Progress
  labStatus: "PENDING" | "SAMPLE_COLLECTED" | "IN_PROGRESS" | "FINAL";
  imagingStatus: "PENDING" | "IN_PROGRESS" | "FINAL";

  // Clinical Conclusion & Prescription
  prescriptionIssued: boolean;
  rxCode: string;
  appointmentCreated: boolean;
  appointmentCode: string;
  finalDiagnosis: string;
  finalConclusion: string;

  // Actions
  selectPatient: (patientId: string) => void;
  createEncounter: (params?: {
    patientId?: string;
    department?: string;
    roomCode?: string;
    doctorName?: string;
    chiefComplaint?: string;
  }) => void;
  confirmInitialExamPayment: (method?: "CASH" | "VIETQR" | "POS") => void;

  startDoctorExam: () => void;

  createOrderRound: () => void;
  addOrder: (service: MockServiceItem, round?: number) => boolean;
  removeOrder: (orderId: string) => void;
  submitOrderRound: (round?: number) => void;

  confirmDiagnosticPayment: (method?: "CASH" | "VIETQR" | "POS" | "COMPANY_CREDIT") => void;
  startDiagnostic: (serviceRequestId?: string) => void;

  collectLabSample: () => void;
  finalizeLab: () => void;
  finalizeImaging: () => void;

  moveToConclusion: () => void;
  startConclusion: () => void;

  issuePrescription: () => void;
  createFollowUpAppointment: (date?: string) => void;

  completeEncounter: () => void;
  resetDemo: () => void;

  // Computeds
  getTotalCLSAmount: (round?: number) => number;
  getTotalEncounterAmount: () => number;
  isDiagnosticAuthorized: (round?: number) => boolean;
  areAllResultsFinal: () => boolean;
}

const DEFAULT_ORDERS: DemoOrderItem[] = [
  {
    id: "ord-001",
    round: 1,
    serviceCode: "LAB-001",
    serviceName: "Tổng phân tích tế bào máu ngoại vi bằng máy đếm laser (CTM 18 chỉ số)",
    category: "LAB",
    roomCode: "P.202",
    roomName: "Phòng Xét Nghiệm Trung Tâm",
    floor: "Tầng 2",
    price: 85000,
    serviceRequestStatus: "COMPLETED",
    paymentAuthorizationStatus: "AUTHORIZED",
    preparationInstructions: "Nhịn ăn sáng tối thiểu 6-8 tiếng, ngồi nghỉ 5 phút trước khi lấy mẫu máu",
    sampleType: "Máu toàn phần EDTA (Ống nắp tím)",
    addedAt: "08:35",
  },
  {
    id: "ord-002",
    round: 1,
    serviceCode: "LAB-008",
    serviceName: "Định lượng Glucose máu tĩnh mạch (Hóa sinh máu)",
    category: "LAB",
    roomCode: "P.202",
    roomName: "Phòng Xét Nghiệm Trung Tâm",
    floor: "Tầng 2",
    price: 45000,
    serviceRequestStatus: "COMPLETED",
    paymentAuthorizationStatus: "AUTHORIZED",
    preparationInstructions: "Nhịn ăn từ 22h00 tối hôm trước, có thể uống một ít nước lọc",
    sampleType: "Huyết tương chống đông Fluoride (Ống nắp xám)",
    addedAt: "08:35",
  },
  {
    id: "ord-003",
    round: 1,
    serviceCode: "ECG-001",
    serviceName: "Điện tâm đồ thông thường (ECG 12 chuyển đạo tiêu chuẩn)",
    category: "ECG",
    roomCode: "P.208",
    roomName: "Phòng Thăm Dò Chức Năng & Điện Tim",
    floor: "Tầng 2",
    price: 120000,
    serviceRequestStatus: "COMPLETED",
    paymentAuthorizationStatus: "AUTHORIZED",
    preparationInstructions: "Nằm nghỉ ngơi thả lỏng 5 phút, tháo bỏ đồng hồ, điện thoại và trang sức kim loại",
    addedAt: "08:35",
  },
];

export const useDemoClinicFlowStore = create<DemoClinicFlowState>((set, get) => ({
  // Core Demo Patient: Nguyễn Văn An (PT-001842)
  activePatientId: "p1",
  patientCode: "PT-001842",
  patientName: "Nguyễn Văn An",
  gender: "MALE",
  age: 45,
  dob: "12/04/1981",
  phone: "0912 345 678",
  identityCard: "001081008892",
  hasPenicillinAllergy: true,
  chronicConditions: [
    "Tăng huyết áp nguyên phát (I10) - 3 năm",
    "Rối loạn lipid máu hỗn hợp (E78.2) - 1 năm",
  ],

  // Encounter Defaults
  activeEncounterId: "enc-041",
  encounterCode: "ENC-260919-041",
  encounterStatus: "IN_PROGRESS",
  journeyStage: "WAITING_FOR_DOCTOR",

  department: "Nội tổng quát",
  roomCode: "P.203",
  doctorName: "BS. Lê Minh",
  chiefComplaint: "Đau đầu từng cơn vùng chẩm, chóng mặt khi đổi tư thế 3 ngày nay",

  // Initial Consultation Fee (Collected at Front Desk)
  initialExamFee: 150000,
  initialExamFeePaid: true,
  initialExamPaymentMethod: "CASH",

  // Diagnostic Orders
  orderRound: 1,
  orders: DEFAULT_ORDERS,
  diagnosticInvoiceStatus: "PAID",
  diagnosticPaymentMethod: "VIETQR",

  // Diagnostic Status
  labStatus: "FINAL",
  imagingStatus: "FINAL",

  // Conclusion & Prescription
  prescriptionIssued: false,
  rxCode: "RX-260919-018",
  appointmentCreated: false,
  appointmentCode: "APT-261017-001",
  finalDiagnosis: "I10 - Tăng huyết áp nguyên phát / Rối loạn lipid máu",
  finalConclusion: "Huyết áp kiểm soát ổn định, ECG dày thất trái nhẹ. Duy trì điều trị Amlodipine + Atorvastatin. Hẹn tái khám sau 4 tuần.",

  selectPatient: (patientId) => {
    const found = MOCK_PATIENTS.find((p) => p.id === patientId || p.patientCode === patientId);
    if (!found) return;
    set({
      activePatientId: found.id,
      patientCode: found.patientCode,
      patientName: found.fullName,
      gender: found.gender,
      age: found.age,
      dob: found.dateOfBirth,
      phone: found.phone,
      identityCard: found.identityCard,
      hasPenicillinAllergy: found.allergies.some((a) => a.substance.toLowerCase().includes("penicillin")),
      chronicConditions: found.chronicConditions,
    });
  },

  createEncounter: (params) => {
    const state = get();
    if (params?.patientId && params.patientId !== state.activePatientId) {
      state.selectPatient(params.patientId);
    }
    const newCode = `ENC-260919-${Math.floor(100 + Math.random() * 900)}`;
    set({
      encounterCode: newCode,
      encounterStatus: "IN_PROGRESS",
      journeyStage: "REGISTERED",
      department: params?.department || "Nội tổng quát",
      roomCode: params?.roomCode || "P.203",
      doctorName: params?.doctorName || "BS. Lê Minh",
      chiefComplaint: params?.chiefComplaint || "Chóng mặt, đau đầu khi thay đổi tư thế",
      initialExamFeePaid: false,
      initialExamPaymentMethod: null,
      orders: [],
      orderRound: 1,
      diagnosticInvoiceStatus: "NONE",
      diagnosticPaymentMethod: null,
      labStatus: "PENDING",
      imagingStatus: "PENDING",
      prescriptionIssued: false,
      appointmentCreated: false,
    });
  },

  confirmInitialExamPayment: (method = "CASH") => {
    set({
      initialExamFeePaid: true,
      initialExamPaymentMethod: method,
      journeyStage: "WAITING_FOR_DOCTOR",
    });
  },

  startDoctorExam: () => {
    set({
      journeyStage: "IN_EXAM",
    });
  },

  createOrderRound: () => {
    set((state) => ({
      orderRound: Math.max(state.orderRound, 1) + 1,
    }));
  },

  addOrder: (service, round) => {
    const state = get();
    const targetRound = round ?? state.orderRound;
    const exists = state.orders.some(
      (o) => o.serviceCode === service.code && o.round === targetRound
    );
    if (exists) return false;

    const newOrder: DemoOrderItem = {
      id: `ord-${Date.now().toString().slice(-4)}`,
      round: targetRound,
      serviceCode: service.code,
      serviceName: service.name,
      category: service.category,
      roomCode: service.roomCode,
      roomName: service.roomName,
      floor: service.floor,
      price: service.price,
      serviceRequestStatus: "ORDERED",
      paymentAuthorizationStatus: "PENDING",
      preparationInstructions: service.preparationInstructions,
      sampleType: service.sampleType,
      addedAt: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
    };

    set({
      orders: [...state.orders, newOrder],
      orderRound: Math.max(state.orderRound, targetRound),
      diagnosticInvoiceStatus: "OPEN",
    });
    return true;
  },

  removeOrder: (orderId) => {
    set((state) => {
      const remainingOrders = state.orders.filter((o) => o.id !== orderId);
      const remainingRounds = remainingOrders.map((o) => o.round);
      const maxRemainingRound = remainingRounds.length > 0 ? Math.max(...remainingRounds) : 1;
      return {
        orders: remainingOrders,
        orderRound: Math.max(1, maxRemainingRound),
        diagnosticInvoiceStatus: remainingOrders.length > 0 ? state.diagnosticInvoiceStatus : "NONE",
      };
    });
  },

  submitOrderRound: (round) => {
    set({
      journeyStage: "WAITING_FOR_DIAGNOSTIC_PAYMENT",
      diagnosticInvoiceStatus: "OPEN",
    });
  },

  confirmDiagnosticPayment: (method = "VIETQR") => {
    const isWaiver = method === "COMPANY_CREDIT";
    const authStatus: PaymentAuthorizationStatus = isWaiver ? "WAIVED" : "AUTHORIZED";

    set((state) => ({
      diagnosticInvoiceStatus: "PAID",
      diagnosticPaymentMethod: method,
      journeyStage: "WAITING_FOR_DIAGNOSTIC",
      orders: state.orders.map((o) => ({
        ...o,
        paymentAuthorizationStatus: authStatus,
      })),
    }));
  },

  startDiagnostic: (serviceRequestId) => {
    set((state) => ({
      journeyStage: "DIAGNOSTIC_IN_PROGRESS",
      orders: state.orders.map((o) =>
        serviceRequestId && o.id !== serviceRequestId
          ? o
          : { ...o, serviceRequestStatus: "IN_PROGRESS" }
      ),
    }));
  },

  collectLabSample: () => {
    set({
      labStatus: "SAMPLE_COLLECTED",
      journeyStage: "DIAGNOSTIC_IN_PROGRESS",
    });
  },

  finalizeLab: () => {
    const state = get();
    const nextLabStatus = "FINAL";
    const bothFinal = state.imagingStatus === "FINAL";

    set({
      labStatus: nextLabStatus,
      journeyStage: bothFinal ? "WAITING_FOR_CONCLUSION" : "WAITING_FOR_RESULTS",
      orders: state.orders.map((o) =>
        o.category === "LAB" ? { ...o, serviceRequestStatus: "COMPLETED" } : o
      ),
    });
  },

  finalizeImaging: () => {
    const state = get();
    const nextImagingStatus = "FINAL";
    const bothFinal = state.labStatus === "FINAL";

    set({
      imagingStatus: nextImagingStatus,
      journeyStage: bothFinal ? "WAITING_FOR_CONCLUSION" : "WAITING_FOR_RESULTS",
      orders: state.orders.map((o) =>
        o.category !== "LAB" && o.category !== "EXAM" ? { ...o, serviceRequestStatus: "COMPLETED" } : o
      ),
    });
  },

  moveToConclusion: () => {
    set({
      journeyStage: "WAITING_FOR_CONCLUSION",
    });
  },

  startConclusion: () => {
    set({
      journeyStage: "IN_CONCLUSION",
    });
  },

  issuePrescription: () => {
    set({
      prescriptionIssued: true,
    });
  },

  createFollowUpAppointment: () => {
    set({
      appointmentCreated: true,
    });
  },

  completeEncounter: () => {
    set({
      encounterStatus: "COMPLETED",
      journeyStage: "COMPLETED",
    });
  },

  resetDemo: () => {
    set({
      activePatientId: "p1",
      patientCode: "PT-001842",
      patientName: "Nguyễn Văn An",
      gender: "MALE",
      age: 45,
      dob: "12/04/1981",
      phone: "0912 345 678",
      identityCard: "001081008892",
      hasPenicillinAllergy: true,
      chronicConditions: [
        "Tăng huyết áp nguyên phát (I10) - 3 năm",
        "Rối loạn lipid máu hỗn hợp (E78.2) - 1 năm",
      ],

      activeEncounterId: "enc-041",
      encounterCode: "ENC-260919-041",
      encounterStatus: "IN_PROGRESS",
      journeyStage: "WAITING_FOR_DOCTOR",

      department: "Nội tổng quát",
      roomCode: "P.203",
      doctorName: "BS. Lê Minh",
      chiefComplaint: "Đau đầu từng cơn vùng chẩm, chóng mặt khi đổi tư thế 3 ngày nay",

      initialExamFee: 150000,
      initialExamFeePaid: true,
      initialExamPaymentMethod: "CASH",

      orderRound: 1,
      orders: DEFAULT_ORDERS,
      diagnosticInvoiceStatus: "PAID",
      diagnosticPaymentMethod: "VIETQR",

      labStatus: "FINAL",
      imagingStatus: "FINAL",

      prescriptionIssued: false,
      rxCode: "RX-260919-018",
      appointmentCreated: false,
      appointmentCode: "APT-261017-001",
      finalDiagnosis: "I10 - Tăng huyết áp nguyên phát / Rối loạn lipid máu",
      finalConclusion: "Huyết áp kiểm soát ổn định, ECG dày thất trái nhẹ. Duy trì điều trị Amlodipine + Atorvastatin. Hẹn tái khám sau 4 tuần.",
    });
  },

  getTotalCLSAmount: (round) => {
    const orders = get().orders;
    const targetOrders = round !== undefined ? orders.filter((o) => o.round === round) : orders;
    return targetOrders.reduce((sum, ord) => sum + ord.price, 0);
  },

  getTotalEncounterAmount: () => {
    const initial = get().initialExamFee;
    return initial + get().getTotalCLSAmount();
  },

  isDiagnosticAuthorized: (round) => {
    const orders = get().orders;
    const targetOrders = round !== undefined ? orders.filter((o) => o.round === round) : orders;
    if (targetOrders.length === 0) return true;
    return targetOrders.every(
      (o) => o.paymentAuthorizationStatus === "AUTHORIZED" || o.paymentAuthorizationStatus === "WAIVED"
    );
  },

  areAllResultsFinal: () => {
    const { labStatus, imagingStatus } = get();
    return labStatus === "FINAL" && imagingStatus === "FINAL";
  },
}));
