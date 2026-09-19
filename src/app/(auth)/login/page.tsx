"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useRoleStore } from "@/shared/stores/role.store";
import { ROLES, UserRole } from "@/shared/constants/roles";
import { Button } from "@/shared/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/card";
import { Lock, Stethoscope, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { currentRole, setRole, activeRoom, setActiveRoom } = useRoleStore();

  const handleLogin = (role: UserRole, room = "P.203") => {
    setRole(role);
    setActiveRoom(room);
    router.push(ROLES[role]?.defaultRoute || "/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-900 text-slate-100">
      <Card className="w-full max-w-md bg-slate-950 border-slate-800 text-white shadow-2xl">
        <CardHeader className="text-center p-6 pb-2 border-b border-slate-800/80">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-2xl mx-auto mb-3 shadow-lg shadow-blue-500/30">
            +
          </div>
          <CardTitle className="text-xl font-black tracking-tight text-white">ClinicOne — Ngọc Khánh Clinic</CardTitle>
          <p className="text-xs text-slate-400 mt-1">Đăng nhập phân hệ khám chữa bệnh ngoại trú</p>
        </CardHeader>

        <CardContent className="p-6 space-y-4">
          <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
            Chọn vai trò đăng nhập nhanh:
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            <Button
              variant="outline"
              onClick={() => handleLogin("DOCTOR", "P.203")}
              className="justify-start h-12 bg-slate-900 border-slate-800 hover:bg-blue-900/40 hover:border-blue-700 text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold mr-3 shrink-0">
                BS
              </div>
              <div>
                <div className="font-bold text-xs text-white">Bác sĩ khám bệnh (P.203)</div>
                <div className="text-[10px] text-slate-400">Danh sách chờ, Khám lâm sàng, Chỉ định CLS, Kết luận</div>
              </div>
            </Button>

            <Button
              variant="outline"
              onClick={() => handleLogin("FRONT_DESK", "QUẦY LỄ TÂN")}
              className="justify-start h-12 bg-slate-900 border-slate-800 hover:bg-emerald-900/40 hover:border-emerald-700 text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold mr-3 shrink-0">
                FD
              </div>
              <div>
                <div className="font-bold text-xs text-white">Lễ tân & Thu phí khám (Front Desk)</div>
                <div className="text-[10px] text-slate-400">Tìm kiếm BN, Tạo lượt khám, Thu phí khám ban đầu</div>
              </div>
            </Button>

            <Button
              variant="outline"
              onClick={() => handleLogin("LAB_TECH", "P.202")}
              className="justify-start h-12 bg-slate-900 border-slate-800 hover:bg-purple-900/40 hover:border-purple-700 text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-purple-600/20 text-purple-400 flex items-center justify-center font-bold mr-3 shrink-0">
                XN
              </div>
              <div>
                <div className="font-bold text-xs text-white">KTV Xét nghiệm (P.202)</div>
                <div className="text-[10px] text-slate-400">Barcode mẫu, duyệt kết quả Panel/Analyte & Auto-return</div>
              </div>
            </Button>

            <Button
              variant="outline"
              onClick={() => handleLogin("IMAGING_TECH", "P.105")}
              className="justify-start h-12 bg-slate-900 border-slate-800 hover:bg-amber-900/40 hover:border-amber-700 text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-600/20 text-amber-400 flex items-center justify-center font-bold mr-3 shrink-0">
                CD
              </div>
              <div>
                <div className="font-bold text-xs text-white">KTV Chẩn đoán hình ảnh & ECG</div>
                <div className="text-[10px] text-slate-400">Siêu âm, ECG, X-quang kỹ thuật số</div>
              </div>
            </Button>

            <Button
              variant="default"
              onClick={() => handleLogin("ALL", "TOÀN VIỆN")}
              className="w-full font-black text-xs h-11 bg-clinic-blue mt-2"
            >
              Vào hệ thống với quyền đầy đủ (Full View) →
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
