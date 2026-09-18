import * as React from "react";
import { Badge } from "@/shared/ui/badge";

export type ClinicStatus =
  | "REGISTERED"
  | "WAITING"
  | "WAITING_FOR_EXAM"
  | "IN_EXAM"
  | "ORDERED"
  | "WAITING_FOR_PAYMENT"
  | "PAID_AUTHORIZED"
  | "DIAGNOSTIC_IN_PROGRESS"
  | "PARTIAL_RESULTS"
  | "RESULTS_COMPLETE"
  | "WAITING_FOR_CONCLUSION"
  | "PRESCRIPTION_READY"
  | "COMPLETED"
  | "FINAL"
  | "DRAFT";

interface StatusBadgeProps {
  status: ClinicStatus | string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  switch (status) {
    case "WAITING":
    case "WAITING_FOR_EXAM":
      return <Badge variant="warn" className={className}>Chờ khám</Badge>;
    case "IN_EXAM":
      return <Badge variant="default" className={className}>Đang khám</Badge>;
    case "ORDERED":
      return <Badge variant="purple" className={className}>Đã chỉ định CLS</Badge>;
    case "WAITING_FOR_PAYMENT":
      return <Badge variant="danger" className={className}>Chờ nộp tiền (Gate)</Badge>;
    case "PAID_AUTHORIZED":
      return <Badge variant="success" className={className}>Đã nộp tiền • Được thực hiện</Badge>;
    case "DIAGNOSTIC_IN_PROGRESS":
      return <Badge variant="purple" className={className}>Đang làm CLS</Badge>;
    case "PARTIAL_RESULTS":
      return <Badge variant="warn" className={className}>Có 1 phần kết quả</Badge>;
    case "RESULTS_COMPLETE":
    case "FINAL":
      return <Badge variant="success" className={className}>Đã đủ KQ (Auto-return)</Badge>;
    case "WAITING_FOR_CONCLUSION":
      return <Badge variant="warn" className={className}>Chờ BS kết luận</Badge>;
    case "PRESCRIPTION_READY":
      return <Badge variant="purple" className={className}>Đã kê đơn (QR)</Badge>;
    case "COMPLETED":
      return <Badge variant="secondary" className={className}>Hoàn tất</Badge>;
    case "DRAFT":
      return <Badge variant="outline" className={className}>Bản nháp</Badge>;
    default:
      return <Badge variant="outline" className={className}>{status}</Badge>;
  }
}
