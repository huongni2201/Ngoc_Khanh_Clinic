import * as React from "react";
import { AlertCircle } from "lucide-react";
import { Badge } from "@/shared/ui/badge";

interface AllergyBadgeProps {
  substance: string;
  severity?: "LOW" | "MODERATE" | "SEVERE";
  className?: string;
}

export function AllergyBadge({ substance, severity = "SEVERE", className }: AllergyBadgeProps) {
  return (
    <Badge variant="danger" className={`inline-flex items-center gap-1 font-bold ${className || ""}`}>
      <AlertCircle className="w-3 h-3" />
      Dị ứng: {substance}
    </Badge>
  );
}
