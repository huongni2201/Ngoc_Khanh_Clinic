import * as React from "react";
import Link from "next/link";
import { PageHeader } from "@/shared/components/page-header";
import { PatientHeader } from "@/widgets/patient-header/patient-header";
import { PatientTimeline } from "@/widgets/patient-timeline/patient-timeline";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { MOCK_PATIENTS } from "@/shared/constants/mock-data";
import { ArrowLeft, UserPlus, FileText, Calendar, Activity } from "lucide-react";

export default async function PatientProfilePage({
  params,
}: {
  params: Promise<{ patientId: string }>;
}) {
  const resolvedParams = await params;
  const patient = MOCK_PATIENTS.find((p) => p.id === resolvedParams.patientId || p.patientCode === resolvedParams.patientId) || MOCK_PATIENTS[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <Link href="/patients" className="text-xs text-slate-500 hover:text-clinic-blue flex items-center gap-1 font-semibold">
          <ArrowLeft className="w-3.5 h-3.5" />
          Quay lại danh sách bệnh nhân
        </Link>
      </div>

      <PageHeader
        eyebrow="HỒ SƠ BỆNH ÁN TỔNG QUAN"
        title={`Hồ sơ bệnh nhân: ${patient.fullName} (${patient.patientCode})`}
        description="Patient Profile Cockpit — Tổng quan thông tin y tế, cảnh báo an toàn và dòng thời gian các đợt khám"
        action={
          <Link href={`/reception?patient=${patient.patientCode}`}>
            <Button className="font-bold text-xs bg-clinic-blue text-white">
              <UserPlus className="w-4 h-4 mr-1.5" />
              + Tiếp nhận đợt khám mới
            </Button>
          </Link>
        }
      />

      {/* Patient Safety Header */}
      <PatientHeader
        patientName={patient.fullName}
        gender={patient.gender}
        age={patient.age}
        dob={patient.dateOfBirth}
        patientCode={patient.patientCode}
        encounterCode="ENC-260919-041"
      />

      {/* Grid Content: Info on left, Timeline on right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Demographics & Clinical Summary */}
        <div className="space-y-6">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="bg-slate-50/70 p-4 border-b border-slate-200">
              <CardTitle className="text-sm font-bold text-slate-800">Thông tin hành chính</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Số CCCD:</span>
                <span className="font-mono font-bold text-slate-800">{patient.identityCard}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Số điện thoại:</span>
                <span className="font-mono font-bold text-slate-800">{patient.phone}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Giới tính / Tuổi:</span>
                <span className="font-bold text-slate-800">{patient.gender === "MALE" ? "Nam" : "Nữ"} ({patient.age}T)</span>
              </div>
              <div className="py-1">
                <span className="text-slate-500 block mb-0.5">Địa chỉ thường trú:</span>
                <span className="font-semibold text-slate-800">{patient.address}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="bg-slate-50/70 p-4 border-b border-slate-200">
              <CardTitle className="text-sm font-bold text-slate-800">Tiền sử bệnh lý & Dị ứng</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3 text-xs">
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-900">
                <b className="block text-red-700 font-bold mb-1">DỊ ỨNG THUỐC: PENICILLIN</b>
                {patient.allergies[0]?.note || "Chống chỉ định nhóm Beta-lactam"}
              </div>
              <div>
                <b className="text-slate-700 block mb-1">Bệnh lý nền:</b>
                <ul className="list-disc pl-4 space-y-0.5 text-slate-600">
                  {patient.chronicConditions.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
              <div>
                <b className="text-slate-700 block mb-1">Thuốc đang điều trị:</b>
                <ul className="list-disc pl-4 space-y-0.5 text-slate-600">
                  {patient.regularMedications.map((m, i) => (
                    <li key={i}>{m}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Longitudinal Timeline */}
        <div className="lg:col-span-2">
          <PatientTimeline />
        </div>
      </div>
    </div>
  );
}
