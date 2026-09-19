"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/shared/components/page-header";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Badge } from "@/shared/ui/badge";
import { useUIStore } from "@/shared/stores/ui.store";
import { MOCK_PATIENTS, MockPatient } from "@/shared/constants/mock-data";
import {
  UserPlus,
  ArrowLeft,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  Calendar,
  Phone,
  Sparkles,
  RotateCcw,
  User,
  MapPin,
  FileCheck,
  AlertCircle,
  AlertTriangle,
  Copy,
  Loader2,
  Server,
  ExternalLink,
} from "lucide-react";

export default function NewPatientPage() {
  const router = useRouter();
  const { showToast } = useUIStore();

  const [formData, setFormData] = React.useState({
    fullName: "VŨ THỊ HƯƠNG",
    dob: "1993-06-15",
    gender: "FEMALE" as "MALE" | "FEMALE" | "OTHER",
    phone: "0936 888 777",
    nationalId: "001093005541",
    address: "Số 88 Trần Duy Hưng, Trung Hòa, Cầu Giấy, Hà Nội",
    emergencyName: "Vũ Văn Minh",
    emergencyRelationship: "Anh trai",
    emergencyPhone: "0982 333 444",
    hasAllergy: false,
    allergySubstance: "",
    allergySeverity: "LOW" as "LOW" | "MODERATE" | "SEVERE",
    allergyNote: "",
    chronicConditions: "Không ghi nhận bệnh mãn tính",
    specialNotes: "Đăng ký khám mới lần đầu tại phòng khám",
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [backendConflictError, setBackendConflictError] = React.useState<{
    title: string;
    message: string;
    existingId: string;
    existingName: string;
  } | null>(null);

  // Calculate age dynamically
  const calculatedAge = React.useMemo(() => {
    if (!formData.dob) return null;
    const birthYear = new Date(formData.dob).getFullYear();
    const currentYear = new Date().getFullYear();
    if (isNaN(birthYear) || birthYear > currentYear) return null;
    return currentYear - birthYear;
  }, [formData.dob]);

  // Generated Patient Code for Preview
  const generatedPatientCode = React.useMemo(() => {
    return "PT-2609-0891";
  }, []);

  const [duplicateWarning, setDuplicateWarning] = React.useState<MockPatient | null>(null);
  const [pendingRedirect, setPendingRedirect] = React.useState<"reception" | "patients">("reception");

  // Quick Preset Handlers
  const handleLoadPresetNormal = () => {
    setDuplicateWarning(null);
    setFormData({
      fullName: "TRẦN THỊ MAI",
      dob: "1995-08-20",
      gender: "FEMALE",
      phone: "0988 765 432",
      nationalId: "001195003412",
      address: "125 Hoàng Hoa Thám, Ba Đình, Hà Nội",
      emergencyName: "Trần Văn Cường",
      emergencyRelationship: "Bố",
      emergencyPhone: "0912 999 888",
      hasAllergy: false,
      allergySubstance: "",
      allergySeverity: "LOW",
      allergyNote: "",
      chronicConditions: "Không ghi nhận bệnh mãn tính",
      specialNotes: "Khám sức khỏe tổng quát định kỳ",
    });
    showToast("Đã tải mẫu bệnh nhân 1 (Khám thông thường)");
  };

  const handleLoadPresetAllergy = () => {
    setDuplicateWarning(null);
    setFormData({
      fullName: "NGUYỄN MINH TUẤN",
      dob: "1986-12-05",
      gender: "MALE",
      phone: "0912 345 678",
      nationalId: "001086009988",
      address: "Số 18, Ngõ 42, Phố Cầu Giấy, Hà Nội",
      emergencyName: "Trần Thị Bích",
      emergencyRelationship: "Vợ",
      emergencyPhone: "0989 111 222",
      hasAllergy: true,
      allergySubstance: "Penicillin",
      allergySeverity: "SEVERE",
      allergyNote: "Sốc phản vệ độ 2 năm 2021 (khó thở thanh quản, nổi mề đay toàn thân)",
      chronicConditions: "Tăng huyết áp nguyên phát (I10), Rối loạn lipid máu",
      specialNotes: "Bệnh nhân có nguyện vọng khám BS. Lê Minh",
    });
    showToast("Đã tải mẫu bệnh nhân 2 (Cảnh báo dị ứng Penicillin)");
  };

  const handleLoadPresetDuplicateTest = () => {
    setDuplicateWarning(null);
    setFormData({
      fullName: "NGUYỄN VĂN AN",
      dob: "1981-04-12",
      gender: "MALE",
      phone: "0912 345 678",
      nationalId: "001081008892", // Existing CCCD in database
      address: "Số 18, Ngõ 42, Phố Cầu Giấy, Hà Nội",
      emergencyName: "Trần Thị Bích",
      emergencyRelationship: "Vợ",
      emergencyPhone: "0989 111 222",
      hasAllergy: true,
      allergySubstance: "Aspirin",
      allergySeverity: "MODERATE",
      allergyNote: "Phù mi mắt, mẩn ngứa khi dùng NSAID",
      chronicConditions: "Tăng huyết áp",
      specialNotes: "Thử nghiệm kiểm tra trùng lặp tại Backend",
    });
    showToast("Đã tải mẫu thử trùng lặp Backend (CCCD: 001081008892)");
  };

  const handleClearForm = () => {
    setDuplicateWarning(null);
    setFormData({
      fullName: "",
      dob: "",
      gender: "MALE",
      phone: "",
      nationalId: "",
      address: "",
      emergencyName: "",
      emergencyRelationship: "",
      emergencyPhone: "",
      hasAllergy: false,
      allergySubstance: "",
      allergySeverity: "LOW",
      allergyNote: "",
      chronicConditions: "",
      specialNotes: "",
    });
    showToast("Đã làm trống biểu mẫu nhập liệu");
  };

  const handleSubmitAndCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    handleBackendSubmit("reception");
  };

  const handleSubmitSaveOnly = (e: React.FormEvent) => {
    e.preventDefault();
    handleBackendSubmit("patients");
  };

  const executeCreatePatient = (redirectTarget: "reception" | "patients") => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      if (redirectTarget === "reception") {
        showToast(`Đã tạo hồ sơ ${generatedPatientCode} — Đang chuyển sang Tiếp nhận & Thu phí khám...`);
        setTimeout(() => {
          router.push(`/reception?patient=${generatedPatientCode}`);
        }, 400);
      } else {
        showToast(`Đã lưu thành công hồ sơ ${generatedPatientCode}`);
        setTimeout(() => {
          router.push("/patients");
        }, 400);
      }
    }, 400);
  };

  const handleBackendSubmit = (redirectTarget: "reception" | "patients") => {
    if (!formData.fullName.trim() || !formData.phone.trim()) {
      showToast("Vui lòng điền đầy đủ Họ tên và Số điện thoại bệnh nhân");
      return;
    }

    setDuplicateWarning(null);

    // Section 12 rule: same CCCD OR same phone OR same full name + DOB
    const cleanNationalId = formData.nationalId.replace(/\s+/g, "");
    const cleanPhone = formData.phone.replace(/\s+/g, "");
    const cleanName = formData.fullName.trim().toLowerCase();

    const match = MOCK_PATIENTS.find((p) => {
      const matchCCCD = cleanNationalId && p.identityCard.replace(/\s+/g, "") === cleanNationalId;
      const matchPhone = cleanPhone && p.phone.replace(/\s+/g, "") === cleanPhone;
      const matchNameDob = cleanName && formData.dob && p.fullName.toLowerCase() === cleanName && p.dateOfBirth === formData.dob;
      return matchCCCD || matchPhone || matchNameDob;
    });

    if (match) {
      setDuplicateWarning(match);
      setPendingRedirect(redirectTarget);
      showToast("⚠ Phát hiện hồ sơ có thể trùng lặp!");
      return;
    }

    executeCreatePatient(redirectTarget);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        eyebrow="ĐĂNG KÝ HỒ SƠ NGƯỜI BỆNH"
        title="Tạo mới hồ sơ bệnh nhân"
        description="Đăng ký hồ sơ định danh gốc vào hệ thống ClinicOne; cấp mã định danh người bệnh (Patient ID) và lưu trữ cảnh báo an toàn lâm sàng"
        action={
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleLoadPresetNormal}
              className="text-xs font-semibold"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1 text-slate-500" />
              Mẫu BN 1: Thông thường
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleLoadPresetAllergy}
              className="text-xs font-semibold text-red-700 border-red-200 bg-red-50/50 hover:bg-red-50"
            >
              <ShieldAlert className="w-3.5 h-3.5 mr-1 text-red-600" />
              Mẫu BN 2: Dị ứng Penicillin
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleLoadPresetDuplicateTest}
              className="text-xs font-semibold text-amber-700 border-amber-200 bg-amber-50/50 hover:bg-amber-50"
            >
              <Server className="w-3.5 h-3.5 mr-1 text-amber-600" />
              Mẫu BN 3: Thử Backend báo trùng
            </Button>
            <Link href="/patients">
              <Button variant="outline" size="sm" className="text-xs font-bold text-slate-700">
                <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                Quay lại danh sách
              </Button>
            </Link>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Comprehensive Registration Form (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          <form onSubmit={handleSubmitAndCheckIn} className="space-y-6">
            {/* Section 12: Duplicate Warning UI */}
            {duplicateWarning && (
              <div
                role="alert"
                aria-live="assertive"
                className="p-5 rounded-xl bg-amber-50 border-2 border-amber-300 text-amber-950 space-y-3 animate-in fade-in duration-200 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black text-amber-900 uppercase tracking-wide flex items-center gap-1.5">
                        ⚠ PHÁT HIỆN HỒ SƠ CÓ THỂ TRÙNG
                      </span>
                      <button
                        type="button"
                        onClick={() => setDuplicateWarning(null)}
                        className="text-xs text-amber-700 hover:text-amber-900 font-bold px-1.5 py-0.5 rounded hover:bg-amber-100"
                        aria-label="Đóng thông báo cảnh báo trùng"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="p-3 bg-white/90 rounded-lg border border-amber-200 text-xs space-y-1">
                      <div className="font-bold text-slate-900 text-sm">{duplicateWarning.fullName}</div>
                      <div className="text-slate-600 flex items-center gap-2 flex-wrap">
                        <span>{duplicateWarning.dateOfBirth}</span>
                        <span>•</span>
                        <span>{duplicateWarning.phone}</span>
                        {duplicateWarning.identityCard && (
                          <>
                            <span>•</span>
                            <span>CCCD: {duplicateWarning.identityCard}</span>
                          </>
                        )}
                      </div>
                      <div className="text-slate-500 text-[11px] pt-0.5">
                        Mã định danh: <b className="text-clinic-blue font-mono">{duplicateWarning.id}</b>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-amber-800">
                        Mức tương đồng: <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-amber-200 text-amber-900">Cao</span>
                      </span>
                    </div>

                    <div className="pt-2 flex items-center gap-3 flex-wrap">
                      <Link href={`/reception?patient=${duplicateWarning.id}`}>
                        <Button
                          type="button"
                          size="sm"
                          className="text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-sm"
                        >
                          <ExternalLink className="w-3.5 h-3.5 mr-1" />
                          MỞ HỒ SƠ HIỆN CÓ
                        </Button>
                      </Link>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => executeCreatePatient(pendingRedirect)}
                        className="text-xs font-semibold border-amber-300 text-amber-900 hover:bg-amber-100"
                      >
                        VẪN TẠO HỒ SƠ MỚI
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Backend Conflict Alert Banner (Fallback when Backend returns 409 Conflict) */}
            {backendConflictError && (
              <div
                role="alert"
                aria-live="assertive"
                className="p-4 rounded-xl bg-red-50 border-2 border-red-300 text-red-900 space-y-2 animate-in fade-in duration-200 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <Server className="w-4 h-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-red-900 uppercase tracking-wide">
                        {backendConflictError.title}
                      </span>
                      <button
                        type="button"
                        onClick={() => setBackendConflictError(null)}
                        className="text-xs text-red-600 hover:text-red-800 font-bold px-1"
                        aria-label="Đóng thông báo lỗi backend"
                      >
                        ✕
                      </button>
                    </div>
                    <p className="text-xs text-red-800 leading-relaxed">
                      {backendConflictError.message}
                    </p>
                    <div className="pt-2 flex items-center gap-3 flex-wrap">
                      <span className="text-xs font-medium text-red-700">
                        Hồ sơ gốc trùng khớp: <b>{backendConflictError.existingName}</b> (Mã BN: {backendConflictError.existingId})
                      </span>
                      <Link href={`/patients?search=${backendConflictError.existingId}`}>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="text-xs font-bold border-red-300 text-red-800 hover:bg-red-100 h-7"
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Mở hồ sơ tại Bảng tra cứu
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Section 1: Administrative Identity */}
            <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
              <CardHeader className="bg-slate-50/80 border-b border-slate-200 p-4 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-clinic-blue flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-clinic-blue tracking-wider block">
                      PHẦN 1 • ĐỊNH DANH HÀNH CHÍNH GỐC
                    </span>
                    <CardTitle className="text-sm font-bold text-slate-800">
                      Thông tin cá nhân & Giấy tờ tùy thân
                    </CardTitle>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500 font-medium block">
                    Trường có dấu <span className="text-red-500 font-bold">*</span> là bắt buộc
                  </span>
                  <span className="text-[10px] text-blue-700 font-medium block">
                    Đối soát trùng lặp do Backend API xử lý
                  </span>
                </div>
              </CardHeader>

              <CardContent className="p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label htmlFor="fullNameInput" className="text-xs font-bold text-slate-700 flex items-center justify-between">
                      <span>
                        Họ và tên bệnh nhân (IN HOA) <span className="text-red-500">*</span>
                      </span>
                      <span className="text-[11px] text-slate-500 font-normal">Tự động chuẩn hóa chữ hoa</span>
                    </label>
                    <Input
                      id="fullNameInput"
                      value={formData.fullName}
                      onChange={(e) => {
                        if (backendConflictError) setBackendConflictError(null);
                        setFormData({ ...formData, fullName: e.target.value.toUpperCase() });
                      }}
                      required
                      placeholder="VŨ THỊ HƯƠNG"
                      className="font-bold uppercase text-sm tracking-wide"
                      autoComplete="name"
                    />
                  </div>

                  {/* DOB */}
                  <div className="space-y-1.5">
                    <label htmlFor="dobInput" className="text-xs font-bold text-slate-700 flex items-center justify-between">
                      <span>
                        Ngày sinh <span className="text-red-500">*</span>
                      </span>
                      {calculatedAge !== null && (
                        <span className="text-[11px] font-bold text-clinic-blue">
                          Tính tuổi: {calculatedAge} tuổi
                        </span>
                      )}
                    </label>
                    <Input
                      id="dobInput"
                      type="date"
                      value={formData.dob}
                      onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                      required
                      className="text-xs font-medium"
                    />
                  </div>

                  {/* Gender */}
                  <div className="space-y-1.5">
                    <label htmlFor="genderSelect" className="text-xs font-bold text-slate-700 block">
                      Giới tính <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="genderSelect"
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value as "MALE" | "FEMALE" | "OTHER" })}
                      className="w-full h-10 px-3 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-clinic-blue"
                    >
                      <option value="MALE">Nam</option>
                      <option value="FEMALE">Nữ</option>
                      <option value="OTHER">Khác</option>
                    </select>
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label htmlFor="phoneInput" className="text-xs font-bold text-slate-700 flex items-center justify-between">
                      <span>
                        Số điện thoại chính <span className="text-red-500">*</span>
                      </span>
                      <span className="text-[11px] text-slate-500 font-normal">Nhận SMS & Tra cứu Portal</span>
                    </label>
                    <Input
                      id="phoneInput"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => {
                        if (backendConflictError) setBackendConflictError(null);
                        setFormData({ ...formData, phone: e.target.value });
                      }}
                      required
                      placeholder="0936 888 777"
                      className="font-mono text-xs font-bold"
                      autoComplete="tel"
                    />
                  </div>

                  {/* National ID / CCCD */}
                  <div className="space-y-1.5">
                    <label htmlFor="nationalIdInput" className="text-xs font-bold text-slate-700 flex items-center justify-between">
                      <span>Số CCCD / Định danh 12 số</span>
                      <span className="text-[11px] text-slate-500 font-mono">
                        {formData.nationalId.replace(/\s+/g, "").length}/12
                      </span>
                    </label>
                    <Input
                      id="nationalIdInput"
                      value={formData.nationalId}
                      onChange={(e) => {
                        if (backendConflictError) setBackendConflictError(null);
                        setFormData({ ...formData, nationalId: e.target.value });
                      }}
                      placeholder="001093005541"
                      className="font-mono text-xs"
                    />
                  </div>

                  {/* Address */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label htmlFor="addressInput" className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      Địa chỉ cư trú thường trú
                    </label>
                    <Input
                      id="addressInput"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Số 88 Trần Duy Hưng, Trung Hòa, Cầu Giấy, TP. Hà Nội"
                      className="text-xs"
                      autoComplete="street-address"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section 2: Emergency Contact */}
            <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
              <CardHeader className="bg-slate-50/80 border-b border-slate-200 p-4 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider block">
                      PHẦN 2 • LIÊN HỆ KHẨN CẤP
                    </span>
                    <CardTitle className="text-sm font-bold text-slate-800">
                      Người thân & Liên hệ khi cần hỗ trợ khẩn cấp
                    </CardTitle>
                  </div>
                </div>
                <span className="text-xs text-slate-500 font-medium">
                  Phòng khám dịch vụ y tế tư nhân (Thu phí trực tiếp)
                </span>
              </CardHeader>

              <CardContent className="p-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5 sm:col-span-1">
                    <label htmlFor="emergencyNameInput" className="text-xs font-bold text-slate-700 block">
                      Họ tên người liên hệ khẩn
                    </label>
                    <Input
                      id="emergencyNameInput"
                      value={formData.emergencyName}
                      onChange={(e) => setFormData({ ...formData, emergencyName: e.target.value })}
                      placeholder="Trần Thị Bích"
                      className="text-xs font-semibold"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-1">
                    <label htmlFor="emergencyRelInput" className="text-xs font-bold text-slate-700 block">
                      Mối quan hệ
                    </label>
                    <Input
                      id="emergencyRelInput"
                      value={formData.emergencyRelationship}
                      onChange={(e) => setFormData({ ...formData, emergencyRelationship: e.target.value })}
                      placeholder="Vợ, Chồng, Bố mẹ, Con..."
                      className="text-xs"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-1">
                    <label htmlFor="emergencyPhoneInput" className="text-xs font-bold text-slate-700 block">
                      SĐT người liên hệ
                    </label>
                    <Input
                      id="emergencyPhoneInput"
                      type="tel"
                      value={formData.emergencyPhone}
                      onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                      placeholder="0989 111 222"
                      className="font-mono text-xs"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section 3: Safety Warnings & Medical History */}
            <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
              <CardHeader className="bg-slate-50/80 border-b border-slate-200 p-4 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-red-100 text-red-700 flex items-center justify-center">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-red-700 tracking-wider block">
                      PHẦN 3 • AN TOÀN NGƯỜI BỆNH & TIỀN SỬ LÂM SÀNG
                    </span>
                    <CardTitle className="text-sm font-bold text-slate-800">
                      Cảnh báo dị ứng thuốc & Bệnh mãn tính ban đầu
                    </CardTitle>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="hasAllergyToggle"
                    checked={formData.hasAllergy}
                    onChange={(e) => setFormData({ ...formData, hasAllergy: e.target.checked })}
                    className="w-4 h-4 text-red-600 rounded border-slate-300 focus:ring-red-500 cursor-pointer"
                  />
                  <label htmlFor="hasAllergyToggle" className="text-xs font-bold text-slate-700 cursor-pointer">
                    Có tiền sử dị ứng
                  </label>
                </div>
              </CardHeader>

              <CardContent className="p-5 space-y-4">
                {formData.hasAllergy ? (
                  <div className="p-4 rounded-xl bg-red-50/80 border border-red-200 space-y-3 animate-in fade-in duration-200">
                    <div className="flex items-center gap-1.5 text-xs font-black text-red-700 uppercase tracking-wide">
                      <ShieldAlert className="w-4 h-4 text-red-600" />
                      Ghi nhận cảnh báo an toàn dị ứng thuốc
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1 sm:col-span-2">
                        <label htmlFor="allergySubstanceInput" className="text-xs font-bold text-red-900 block">
                          Tên thuốc / Hoạt chất / Thực phẩm dị ứng <span className="text-red-600">*</span>
                        </label>
                        <Input
                          id="allergySubstanceInput"
                          value={formData.allergySubstance}
                          onChange={(e) => setFormData({ ...formData, allergySubstance: e.target.value })}
                          placeholder="Ví dụ: Penicillin, Aspirin, NSAIDs, Paracetamol..."
                          className="bg-white border-red-300 text-xs font-bold text-red-700 focus:ring-red-500"
                        />
                      </div>

                      <div className="space-y-1 sm:col-span-1">
                        <label htmlFor="allergySeveritySelect" className="text-xs font-bold text-red-900 block">
                          Mức độ nghiêm trọng
                        </label>
                        <select
                          id="allergySeveritySelect"
                          value={formData.allergySeverity}
                          onChange={(e) => setFormData({ ...formData, allergySeverity: e.target.value as "LOW" | "MODERATE" | "SEVERE" })}
                          className="w-full h-10 px-3 rounded-lg border border-red-300 bg-white text-xs font-bold text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                          <option value="LOW">Nhẹ (Mẩn ngứa nhẹ)</option>
                          <option value="MODERATE">Trung bình (Phù mi, mày đay)</option>
                          <option value="SEVERE">Nặng / Nguy kịch (Sốc phản vệ)</option>
                        </select>
                      </div>

                      <div className="space-y-1 sm:col-span-3">
                        <label htmlFor="allergyNoteInput" className="text-xs font-bold text-red-900 block">
                          Mô tả chi tiết biểu hiện lâm sàng & Năm ghi nhận
                        </label>
                        <Input
                          id="allergyNoteInput"
                          value={formData.allergyNote}
                          onChange={(e) => setFormData({ ...formData, allergyNote: e.target.value })}
                          placeholder="Phản vệ độ 2 năm 2021 (khó thở, nổi mề đay toàn thân). Chống chỉ định nhóm Beta-lactam..."
                          className="bg-white border-red-300 text-xs text-slate-800"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Chưa ghi nhận tiền sử dị ứng thuốc hoặc thực phẩm.
                    </span>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, hasAllergy: true, allergySubstance: "Penicillin", allergySeverity: "SEVERE" })}
                      className="text-xs font-bold text-clinic-blue hover:underline"
                    >
                      + Bật cảnh báo dị ứng
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-4 pt-1">
                  <div className="space-y-1.5">
                    <label htmlFor="chronicInput" className="text-xs font-bold text-slate-700 block">
                      Bệnh nền mãn tính đang điều trị / Theo dõi
                    </label>
                    <Input
                      id="chronicInput"
                      value={formData.chronicConditions}
                      onChange={(e) => setFormData({ ...formData, chronicConditions: e.target.value })}
                      placeholder="Tăng huyết áp nguyên phát (I10), Đái tháo đường type 2, Hen phế quản..."
                      className="text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="specialNotesInput" className="text-xs font-bold text-slate-700 block">
                      Ghi chú đặc biệt của nhân viên tiếp đón
                    </label>
                    <Input
                      id="specialNotesInput"
                      value={formData.specialNotes}
                      onChange={(e) => setFormData({ ...formData, specialNotes: e.target.value })}
                      placeholder="Yêu cầu bác sĩ quen, hỗ trợ xe lăn, khám ưu tiên người cao tuổi..."
                      className="text-xs"
                    />
                  </div>
                </div>
              </CardContent>

              <CardFooter className="bg-slate-50 p-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleClearForm}
                  disabled={isSubmitting}
                  className="text-xs text-slate-600 hover:text-red-700"
                >
                  <RotateCcw className="w-3.5 h-3.5 mr-1" />
                  Làm mới biểu mẫu
                </Button>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSubmitSaveOnly}
                    disabled={isSubmitting}
                    className="flex-1 sm:flex-none text-xs font-bold text-slate-700"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
                    ) : (
                      <FileCheck className="w-3.5 h-3.5 mr-1 text-slate-500" />
                    )}
                    {isSubmitting ? "Đang gửi Backend..." : "Lưu hồ sơ bệnh nhân"}
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 sm:flex-none font-bold text-xs bg-clinic-blue text-white shadow-sm hover:bg-blue-700"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                    ) : (
                      <UserPlus className="w-3.5 h-3.5 mr-1.5" />
                    )}
                    {isSubmitting ? "Đang xác thực Backend..." : "Lưu & Tiếp nhận khám ngay →"}
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </form>
        </div>

        {/* Right Column: Live Patient Intake Summary & Clinic Steps (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Patient Profile Summary Card */}
          <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
            <CardHeader className="bg-slate-50/80 border-b border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-clinic-blue tracking-wider">
                  TÓM TẮT TIẾP ĐÓN NGƯỜI BỆNH
                </span>
                <Badge variant="outline" className="text-[10px] font-bold text-slate-600 bg-white">
                  Hồ sơ số hóa
                </Badge>
              </div>
              <CardTitle className="text-sm font-bold text-slate-800">
                Thông tin định danh tiếp nhận
              </CardTitle>
            </CardHeader>

            <CardContent className="p-4 space-y-4 text-xs">
              {/* Patient ID box */}
              <div className="p-3 rounded-xl bg-slate-900 text-white space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-blue-300 tracking-wider">
                    MÃ ĐỊNH DANH DỰ KIẾN CẤP
                  </span>
                  <Badge variant="success" className="text-[10px] py-0">
                    Sẵn sàng tiếp đón
                  </Badge>
                </div>
                <div className="font-mono text-xl font-black text-blue-400 tracking-wider">
                  {generatedPatientCode}
                </div>
                <div className="text-[11px] text-slate-400">
                  Hồ sơ lưu trữ CSDL trung tâm • Không sử dụng thẻ bệnh nhân
                </div>
              </div>

              {/* Patient Demographics Summary */}
              <div className="space-y-1.5 border-b border-slate-100 pb-3">
                <div className="text-sm font-extrabold uppercase text-slate-900">
                  {formData.fullName || "CHƯA NHẬP HỌ TÊN"}
                </div>
                <div className="text-slate-600">
                  {formData.gender === "MALE" ? "Nam" : formData.gender === "FEMALE" ? "Nữ" : "Khác"} •{" "}
                  {formData.dob ? `${formData.dob} ${calculatedAge !== null ? `(${calculatedAge} tuổi)` : ""}` : "Chưa có ngày sinh"}
                </div>
                <div className="text-slate-600 font-mono">
                  SĐT: <b className="text-slate-900">{formData.phone || "—"}</b>
                </div>
                <div className="text-slate-700 font-mono">
                  CCCD: <b className="text-slate-900">{formData.nationalId || "—"}</b>
                </div>
                {formData.address && (
                  <div className="text-slate-600 text-[11px] leading-relaxed pt-0.5">
                    Đ/c: {formData.address}
                  </div>
                )}
              </div>

              {/* Emergency Contact Summary */}
              <div className="space-y-1 border-b border-slate-100 pb-3 text-slate-700">
                <span className="text-[10px] uppercase font-bold text-slate-600 block tracking-wider">
                  LIÊN HỆ KHẨN CẤP
                </span>
                {formData.emergencyName ? (
                  <div>
                    <span className="font-semibold text-slate-800">{formData.emergencyName}</span>
                    {formData.emergencyRelationship && ` (${formData.emergencyRelationship})`}
                    {formData.emergencyPhone && ` • ${formData.emergencyPhone}`}
                  </div>
                ) : (
                  <span className="text-slate-500 italic">Chưa có người liên hệ khẩn</span>
                )}
              </div>

              {/* Clinical Safety & Allergy Summary */}
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-600 block tracking-wider">
                  AN TOÀN LÂM SÀNG
                </span>
                {formData.hasAllergy && formData.allergySubstance ? (
                  <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-900 text-xs space-y-0.5">
                    <div className="flex items-center gap-1.5 font-bold text-red-700">
                      <ShieldAlert className="w-3.5 h-3.5 text-red-600 shrink-0" />
                      Dị ứng {formData.allergySubstance} ({formData.allergySeverity})
                    </div>
                    {formData.allergyNote && (
                      <p className="text-[11px] text-red-800 leading-snug">{formData.allergyNote}</p>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-slate-700 text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    Chưa ghi nhận tiền sử dị ứng thuốc
                  </div>
                )}

                {formData.chronicConditions && (
                  <div className="text-[11px] text-slate-700 pt-1">
                    Bệnh nền: <span className="font-medium text-slate-800">{formData.chronicConditions}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 3-Step Clinic Workflow Instruction */}
          <Card className="border-slate-200 shadow-sm bg-white">
            <CardHeader className="pb-3 border-b border-slate-100">
              <span className="text-[11px] uppercase font-bold text-clinic-blue tracking-wider">
                QUY TRÌNH TIẾP ĐÓN TIẾP THEO (CLINICAL STEPS)
              </span>
              <CardTitle className="text-sm font-bold text-slate-800">
                Sau khi tạo hồ sơ thành công
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3 text-xs">
              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-blue-50/50 border border-blue-100">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                  1
                </div>
                <div>
                  <b className="text-slate-900 block">Cấp mã định danh người bệnh (Patient ID)</b>
                  <span className="text-slate-600 text-[11px]">
                    Hệ thống tự động đồng bộ mã định danh duy nhất vào CSDL trung tâm phòng khám (không phát hành thẻ).
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-black text-xs flex items-center justify-center shrink-0">
                  2
                </div>
                <div>
                  <b className="text-slate-900 block">Chuyển sang Tiếp nhận & Cấp STT</b>
                  <span className="text-slate-600 text-[11px]">
                    Bấm nút <b>"Lưu & Tiếp nhận khám ngay"</b> để chọn chuyên khoa khám (Nội P.203, Tai Mũi Họng...).
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-black text-xs flex items-center justify-center shrink-0">
                  3
                </div>
                <div>
                  <b className="text-slate-900 block">Đồng bộ cảnh báo lâm sàng</b>
                  <span className="text-slate-600 text-[11px]">
                    Thông tin dị ứng thuốc sẽ lập tức hiển thị màu đỏ trên màn hình của Bác sĩ và Dược sĩ.
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
