import { create } from "zustand";
import { UserRole, ROLES } from "@/shared/constants/roles";

interface RoleState {
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
  activeRoom: string;
  setActiveRoom: (room: string) => void;
}

export const useRoleStore = create<RoleState>((set) => ({
  currentRole: "ALL",
  setRole: (role) => set({ currentRole: role }),
  activeRoom: "P.203",
  setActiveRoom: (room) => set({ activeRoom: room }),
}));
