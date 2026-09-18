import * as React from "react";
import Link from "next/link";
import { PageHeader } from "@/shared/components/page-header";
import { PatientSearchTable } from "@/features/patient/search-patient/patient-search-table";
import { Button } from "@/shared/ui/button";
import { UserPlus } from "lucide-react";

export default function PatientsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="ĐỊNH DANH BỆNH NHÂN (UC-PAT-01 / FR-PAT-001)"
        title="03. Tra cứu & Tìm kiếm bệnh nhân"
        description="Tra cứu đa tiêu chí theo Họ tên, SĐT, CCCD, Mã BN; tích hợp Panel xem nhanh (Side Drawer) bên phải"
        action={
          <Link href="/patients/new">
            <Button className="font-bold bg-clinic-blue text-white">
              <UserPlus className="w-4 h-4 mr-1.5" />
              + Tạo hồ sơ bệnh nhân mới
            </Button>
          </Link>
        }
      />

      <PatientSearchTable />
    </div>
  );
}
