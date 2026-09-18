import { create } from "zustand";
import { MockServiceItem } from "../constants/mock-data";

export type WorkspaceTab = "SUMMARY" | "VITALS" | "ORDERS" | "RESULTS" | "PRESCRIPTION";

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
  status: "WAITING_FOR_PAYMENT" | "PAID_AUTHORIZED" | "IN_PROGRESS" | "COMPLETED";
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
  toggleOrderStatus: (orderId: string) => void;

  // Computeds / Helpers
  getTotalCLSAmount: () => number;
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
    status: "PAID_AUTHORIZED",
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
    status: "PAID_AUTHORIZED",
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
    status: "PAID_AUTHORIZED",
    preparationInstructions: "Nằm nghỉ ngơi thả lỏng 5 phút, tháo bỏ đồng hồ, điện thoại và trang sức kim loại",
    addedAt: "08:35",
  },
];

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  activeTab: "SUMMARY",
  setActiveTab: (tab) => set({ activeTab: tab }),
  orderRound: 1,
  orders: INITIAL_ORDERS,
  isServicePickerOpen: false,
  targetRoundForAdd: 1,

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
      status: targetRound === 1 ? "PAID_AUTHORIZED" : "WAITING_FOR_PAYMENT",
      preparationInstructions: service.preparationInstructions,
      sampleType: service.sampleType,
      addedAt: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
    };

    set({
      orders: [...state.orders, newOrder],
      orderRound: Math.max(state.orderRound, targetRound),
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
      };
    });
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
  },

  toggleOrderStatus: (orderId) => {
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: o.status === "PAID_AUTHORIZED" ? "WAITING_FOR_PAYMENT" : "PAID_AUTHORIZED",
            }
          : o
      ),
    }));
  },

  getTotalCLSAmount: () => {
    return get().orders.reduce((sum, ord) => sum + ord.price, 0);
  },

  getTotalEncounterAmount: () => {
    return 150000 + get().getTotalCLSAmount();
  },
}));
