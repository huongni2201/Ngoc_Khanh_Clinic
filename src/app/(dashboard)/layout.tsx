"use client";

import * as React from "react";
import { AppSidebar } from "@/widgets/app-sidebar/app-sidebar";
import { TopNavigation } from "@/widgets/top-navigation/top-navigation";
import { PatientQuickViewDrawer } from "@/features/patient/patient-drawer/patient-quick-view-drawer";
import { PrintOrderModal } from "@/features/medical-order/print-order-modal/print-order-modal";
import { ServicePickerModal } from "@/features/medical-order/service-picker-modal/service-picker-modal";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Sidebar */}
      <AppSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopNavigation />

        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Global Modals & Drawers */}
      <PatientQuickViewDrawer />
      <PrintOrderModal />
      <ServicePickerModal />
    </div>
  );
}
