"use client";

import * as React from "react";
import { PatientDocumentItem } from "@/shared/constants/mock-data";
import { FileText, FileImage, Download, ExternalLink } from "lucide-react";
import { Button } from "@/shared/ui/button";

interface PatientDocumentsCardProps {
  documents: PatientDocumentItem[];
  className?: string;
}

export function PatientDocumentsCard({ documents, className = "" }: PatientDocumentsCardProps) {
  if (!documents || documents.length === 0) {
    return (
      <div className={`p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 italic ${className}`}>
        Không có hồ sơ tài liệu đính kèm.
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-slate-800 font-bold text-xs uppercase tracking-wider">
          <FileText className="w-3.5 h-3.5 text-clinic-blue" />
          Hồ sơ & Tài liệu đính kèm ({documents.length})
        </div>
      </div>

      <div className="space-y-2">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="p-3 bg-white border border-slate-200 rounded-xl shadow-xs flex items-center justify-between gap-3 text-xs"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-clinic-blue shrink-0">
                {doc.type === "IMAGE" ? (
                  <FileImage className="w-4 h-4" />
                ) : (
                  <FileText className="w-4 h-4" />
                )}
              </div>
              <div className="min-w-0">
                <span className="font-bold text-slate-900 block truncate" title={doc.title}>
                  {doc.title}
                </span>
                <span className="text-[10px] text-slate-500">
                  {doc.type} • {doc.size} • {doc.source} ({doc.uploadedAt})
                </span>
              </div>
            </div>

            <Button
              size="sm"
              variant="outline"
              className="h-7 px-2 text-[11px] font-bold text-slate-600 hover:text-clinic-blue shrink-0"
              onClick={() => alert(`Xem tài liệu: ${doc.title}`)}
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              Xem
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
