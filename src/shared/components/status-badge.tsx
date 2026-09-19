import * as React from "react";
import { Badge } from "@/shared/ui/badge";

export type ClinicStatus =
  | "REGISTERED"
  | "WAITING"
  | "WAITING_FOR_DOCTOR"
  | "WAITING_FOR_EXAM"
  | "IN_EXAM"
  | "ORDERED"
  | "WAITING_FOR_PAYMENT"
  | "WAITING_FOR_DIAGNOSTIC_PAYMENT"
  | "WAITING_FOR_DIAGNOSTIC"
  | "AUTHORIZED"
  | "PENDING"
  | "WAIVED"
  | "REVOKED"
  | "NOT_REQUIRED"
  | "PAID_AUTHORIZED"
  | "DIAGNOSTIC_IN_PROGRESS"
  | "PARTIAL_RESULTS"
  | "RESULTS_COMPLETE"
  | "WAITING_FOR_RESULTS"
  | "WAITING_FOR_CONCLUSION"
  | "IN_CONCLUSION"
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
    case "REGISTERED":
      return <Badge variant="outline" className={className}>Đã tiếp nhận</Badge>;
    case "WAITING":
    case "WAITING_FOR_EXAM":
    case "WAITING_FOR_DOCTOR":
      return <Badge variant="warn" className={className}>Chờ bác sĩ khám</Badge>;
    case "IN_EXAM":
      return <Badge variant="default" className={className}>Đang khám</Badge>;
    case "ORDERED":
      return <Badge variant="purple" className={className}>Đã chỉ định CLS</Badge>;
    case "WAITING_FOR_PAYMENT":
    case "WAITING_FOR_DIAGNOSTIC_PAYMENT":
    case "PENDING":
      return <Badge variant="danger" className={className}>Chờ thanh toán CLS</Badge>;
    case "AUTHORIZED":
    case "PAID_AUTHORIZED":
      return <Badge variant="success" className={className}>Đã thanh toán • Được phép thực hiện</Badge>;
    case "WAIVED":
      return <Badge variant="success" className={className}>Bảo lãnh • Được phép thực hiện</Badge>;
    case "NOT_REQUIRED":
      return <Badge variant="secondary" className={className}>Không yêu cầu thu phí</Badge>;
    case "REVOKED":
      return <Badge variant="danger" className={className}>Đã thu hồi quyền</Badge>;
    case "WAITING_FOR_DIAGNOSTIC":
      return <Badge variant="default" className={className}>Chờ thực hiện CLS</Badge>;
    case "DIAGNOSTIC_IN_PROGRESS":
      return <Badge variant="purple" className={className}>Đang thực hiện CLS</Badge>;
    case "WAITING_FOR_RESULTS":
      return <Badge variant="warn" className={className}>Chờ kết quả</Badge>;
    case "PARTIAL_RESULTS":
      return <Badge variant="warn" className={className}>Có một phần kết quả</Badge>;
    case "RESULTS_COMPLETE":
    case "FINAL":
      return <Badge variant="success" className={className}>Kết quả hoàn tất</Badge>;
    case "WAITING_FOR_CONCLUSION":
      return <Badge variant="warn" className={className}>Chờ bác sĩ kết luận</Badge>;
    case "IN_CONCLUSION":
      return <Badge variant="default" className={className}>Đang kết luận</Badge>;
    case "PRESCRIPTION_READY":
      return <Badge variant="purple" className={className}>Đã phát hành đơn thuốc</Badge>;
    case "COMPLETED":
      return <Badge variant="secondary" className={className}>Hoàn tất</Badge>;
    case "DRAFT":
      return <Badge variant="outline" className={className}>Bản nháp</Badge>;
    default:
      return <Badge variant="outline" className={className}>{status}</Badge>;
  }
}
