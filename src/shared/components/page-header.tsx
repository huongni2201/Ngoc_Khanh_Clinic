import * as React from "react";
import { cn } from "@/shared/lib/utils";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function PageHeader({ eyebrow, title, description, action, className }: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6", className)}>
      <div>
        {eyebrow && (
          <div className="text-[11px] font-bold tracking-wider text-clinic-blue uppercase mb-1">
            {eyebrow}
          </div>
        )}
        <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">{title}</h1>
        {description && <p className="text-xs md:text-sm text-slate-600 mt-1 leading-relaxed">{description}</p>}
      </div>
      {action && <div className="flex items-center gap-2 shrink-0">{action}</div>}
    </div>
  );
}
