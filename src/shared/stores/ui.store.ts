import { create } from "zustand";

interface UIState {
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;

  // Patient Quick-View Side Drawer state
  drawerPatientId: string | null;
  openPatientDrawer: (patientId: string) => void;
  closePatientDrawer: () => void;

  // Medical Print Modal state
  isPrintModalOpen: boolean;
  printModalTab: "routing" | "invoice";
  printModalRound: number;
  openPrintModal: (tab?: "routing" | "invoice", round?: number) => void;
  closePrintModal: () => void;
  setPrintModalTab: (tab: "routing" | "invoice") => void;
  setPrintModalRound: (round: number) => void;

  // Global Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;
  clearToast: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ isSidebarCollapsed: !s.isSidebarCollapsed })),

  drawerPatientId: null,
  openPatientDrawer: (patientId) => set({ drawerPatientId: patientId }),
  closePatientDrawer: () => set({ drawerPatientId: null }),

  isPrintModalOpen: false,
  printModalTab: "routing",
  printModalRound: 1,
  openPrintModal: (tab = "routing", round = 1) =>
    set({ isPrintModalOpen: true, printModalTab: tab, printModalRound: round }),
  closePrintModal: () => set({ isPrintModalOpen: false }),
  setPrintModalTab: (tab) => set({ printModalTab: tab }),
  setPrintModalRound: (round) => set({ printModalRound: round }),

  toastMessage: null,
  showToast: (msg) => {
    set({ toastMessage: msg });
    setTimeout(() => {
      set((s) => (s.toastMessage === msg ? { toastMessage: null } : s));
    }, 3000);
  },
  clearToast: () => set({ toastMessage: null }),
}));
