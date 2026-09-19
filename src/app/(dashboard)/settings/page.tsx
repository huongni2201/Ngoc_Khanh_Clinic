"use client";

import * as React from "react";
import { PageHeader } from "@/shared/components/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/table";
import { useUIStore } from "@/shared/stores/ui.store";
import { Server, Activity, ShieldCheck, CheckCircle2, RefreshCw } from "lucide-react";

export default function SettingsPage() {
  const { showToast } = useUIStore();

  const adapters = [
    {
      name: "LIS / Lab Middleware Adapter",
      protocol: "HL7 v2.5 / ASTM E1381",
      endpoint: "tcp://192.168.1.120:5000 (Sysmex XN-550 & AU480)",
      lastSync: "Vừa xong (17/09/2026 09:15:22)",
      status: "CONNECTED",
    },
    {
      name: "PACS / DICOM Image Adapter",
      protocol: "DICOMweb (WADO-RS / STOW-RS)",
      endpoint: "https://pacs.ngockhanhclinic.vn/dcm4chee-arc",
      lastSync: "3 phút trước",
      status: "CONNECTED",
    },
    {
      name: "Payment Gateway & VietQR Webhook",
      protocol: "REST API / Webhook HMAC-SHA256",
      endpoint: "https://api.vietqr.io/v2/webhooks/payment-gate",
      lastSync: "1 phút trước",
      status: "ACTIVE",
    },
    {
      name: "Zalo OA & SMS Notification Adapter",
      protocol: "Zalo Open API v3",
      endpoint: "https://openapi.zalo.me/v3.0/oa/message/transaction",
      lastSync: "12 phút trước",
      status: "ACTIVE",
    },
  ];

  const auditLogs = [
    { time: "09:15:22", user: "CNXN. Trần Thu Hà", role: "LAB_TECH", action: "Duyệt Final kết quả CTM (WBC 12.8 ↑)", ip: "192.168.1.45" },
    { time: "08:42:10", user: "Nguyễn Thị Mai", role: "CASHIER", action: "Xác nhận thanh toán 400.000đ (INV-260917-088) qua VietQR", ip: "192.168.1.12" },
    { time: "08:35:04", user: "BS. Lê Minh", role: "DOCTOR", action: "Khởi tạo Order Round 1 (CTM, Glucose, ECG) cho BN Nguyễn Văn An", ip: "192.168.1.28" },
    { time: "08:15:50", user: "Lễ tân: Hoàng Anh", role: "RECEPTIONIST", action: "Tạo Encounter ENC-260917-032 (STT #032) - Khoa Nội P.203", ip: "192.168.1.10" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="QUẢN TRỊ HỆ THỐNG & KẾT NỐI TÍCH HỢP"
        title="Cài Đặt Hệ Thống & Adapter Tích Hợp LIS/PACS"
        description="Giám sát trạng thái 4 kết nối ngoại vi theo thời gian thực và ghi nhận vết kiểm toán (Audit Trail)"
        action={
          <Button variant="outline" onClick={() => showToast("Đang kiểm tra kết nối 4 adapter...")} className="font-bold text-xs">
            <RefreshCw className="w-4 h-4 mr-1.5" />
            Kiểm tra kết nối
          </Button>
        }
      />

      {/* 4 External Integration Adapters */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="bg-slate-50/70 p-4 border-b border-slate-200">
          <CardTitle className="text-sm font-bold text-slate-800">
            Trạng thái 4 Adapter tích hợp ngoại vi (LIS, PACS, VietQR, Zalo OA)
          </CardTitle>
        </CardHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên Adapter</TableHead>
              <TableHead>Giao thức</TableHead>
              <TableHead>Endpoint máy chủ</TableHead>
              <TableHead>Lần đồng bộ cuối</TableHead>
              <TableHead className="text-right">Trạng thái</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {adapters.map((ad, idx) => (
              <TableRow key={idx}>
                <td className="p-3 font-bold text-slate-900 text-xs flex items-center gap-2">
                  <Server className="w-4 h-4 text-clinic-blue shrink-0" />
                  {ad.name}
                </td>
                <td className="p-3 font-mono text-xs text-slate-600">{ad.protocol}</td>
                <td className="p-3 font-mono text-xs text-slate-600">{ad.endpoint}</td>
                <td className="p-3 text-xs text-slate-500 font-mono">{ad.lastSync}</td>
                <td className="p-3 text-right">
                  <Badge variant="success" className="font-mono text-[10px] font-bold">
                    ● {ad.status}
                  </Badge>
                </td>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Audit Trail Table */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="bg-slate-50/70 p-4 border-b border-slate-200">
          <CardTitle className="text-sm font-bold text-slate-800">
            Nhật ký kiểm toán hệ thống (Audit Trail)
          </CardTitle>
        </CardHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24">Thời gian</TableHead>
              <TableHead>Người thực hiện</TableHead>
              <TableHead>Vai trò</TableHead>
              <TableHead>Hành động nghiệp vụ</TableHead>
              <TableHead className="text-right">Địa chỉ IP</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {auditLogs.map((log, idx) => (
              <TableRow key={idx}>
                <td className="p-3 font-mono font-bold text-xs text-slate-800">{log.time}</td>
                <td className="p-3 font-bold text-xs text-slate-900">{log.user}</td>
                <td className="p-3 text-xs">
                  <Badge variant="outline" className="text-[10px] font-mono">
                    {log.role}
                  </Badge>
                </td>
                <td className="p-3 text-xs text-slate-700 font-medium">{log.action}</td>
                <td className="p-3 text-right font-mono text-xs text-slate-400">{log.ip}</td>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
