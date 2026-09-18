"use client";

import * as React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "@/shared/api/query-client";
import { useUIStore } from "@/shared/stores/ui.store";
import { CheckCircle2 } from "lucide-react";

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  const { toastMessage, clearToast } = useUIStore();

  return (
    <QueryClientProvider client={queryClient}>
      {children}

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 animate-in slide-in-from-bottom-5 fade-in">
          <div className="bg-slate-900 text-white text-xs font-semibold py-3 px-4 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
            <button
              onClick={clearToast}
              className="ml-2 text-slate-400 hover:text-white text-xs p-1"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </QueryClientProvider>
  );
}
