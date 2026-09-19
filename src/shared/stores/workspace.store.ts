import { create } from "zustand";
import { MockServiceItem } from "../constants/mock-data";
import { useDemoClinicFlowStore } from "./demo-clinic-flow.store";

export type WorkspaceTab = "EXAM" | "ORDERS" | "RESULTS" | "CONCLUSION";

export type ServiceRequestStatus = "ORDERED" | "IN_PROGRESS" | "COMPLETED" | "CANCELED";
export type PaymentAuthorizationStatus = "NOT_REQUIRED" | "PENDING" | "AUTHORIZED" | "WAIVED" | "REVOKED";

export interface WorkspaceOrderItem {
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

interface WorkspaceState {
  activeTab: WorkspaceTab;
  setActiveTab: (tab: WorkspaceTab) => void;
  orderRound: number;
  orders: WorkspaceOrderItem[];
  isServicePickerOpen: boolean;
  targetRoundForAdd: number;

  // Actions
  openServicePicker: (round?: number) => void;
  closeServicePicker: () => void;
  addOrder: (service: MockServiceItem, round?: number) => boolean;
  removeOrder: (orderId: string) => void;
  createNewRound: () => void;
  authorizeAllRound: (round?: number) => void;
  setOrders: (orders: WorkspaceOrderItem[]) => void;

  // Computeds / Helpers
  getTotalCLSAmount: (round?: number) => number;
  getTotalEncounterAmount: () => number;
}

const INITIAL_ORDERS: WorkspaceOrderItem[] = [
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

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  activeTab: "EXAM",
  setActiveTab: (tab) => set({ activeTab: tab }),
  orderRound: 1,
  orders: INITIAL_ORDERS,
  isServicePickerOpen: false,
  targetRoundForAdd: 1,

  setOrders: (orders) => set({ orders }),

  openServicePicker: (round) =>
    set((state) => ({
      isServicePickerOpen: true,
      targetRoundForAdd: round ?? state.orderRound,
    })),

  closeServicePicker: () => set({ isServicePickerOpen: false }),

  addOrder: (service, round) => {
    const state = get();
    const targetRound = round ?? state.targetRoundForAdd;
    const exists = state.orders.some(
      (o) => o.serviceCode === service.code && o.round === targetRound
    );
    if (exists) {
      return false;
    }

    const newOrder: WorkspaceOrderItem = {
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

    const nextOrders = [...state.orders, newOrder];
    const nextRound = Math.max(state.orderRound, targetRound);
    set({
      orders: nextOrders,
      orderRound: nextRound,
    });

    // Sync to demo flow store
    try {
      useDemoClinicFlowStore.getState().addOrder(service, targetRound);
    } catch {}

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
      };
    });

    try {
      useDemoClinicFlowStore.getState().removeOrder(orderId);
    } catch {}
  },

  createNewRound: () => {
    set((state) => {
      const nextRound = Math.max(state.orderRound, 1) + 1;
      return {
        orderRound: nextRound,
        targetRoundForAdd: nextRound,
        isServicePickerOpen: true,
      };
    });

    try {
      useDemoClinicFlowStore.getState().createOrderRound();
    } catch {}
  },

  authorizeAllRound: (round) => {
    set((state) => ({
      orders: state.orders.map((o) =>
        round === undefined || o.round === round
          ? {
              ...o,
              paymentAuthorizationStatus: "AUTHORIZED",
            }
          : o
      ),
    }));
  },

  getTotalCLSAmount: (round) => {
    const orders = get().orders;
    const target = round !== undefined ? orders.filter((o) => o.round === round) : orders;
    return target.reduce((sum, ord) => sum + ord.price, 0);
  },

  getTotalEncounterAmount: () => {
    return 150000 + get().getTotalCLSAmount();
  },
}));
