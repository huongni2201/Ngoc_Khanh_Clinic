"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import {
  readExcelFile,
  autoDetectMapping,
  validateMappedRows,
  generateSampleExcelFile,
  SYSTEM_FIELDS,
  HeaderMapping,
  RawEmployeeRow,
  RowValidationResult,
  ExcelParseResult,
} from "./excel-reader.adapter";
import { useCorporateHealthCheckStore } from "@/shared/stores/corporate-health-check.store";
import { useUIStore } from "@/shared/stores/ui.store";
import { CompanyEmployee } from "@/entities/company-employee/model/company-employee.types";
import {
  UploadCloud,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowRight,
  ArrowLeft,
  Filter,
} from "lucide-react";

interface ImportEmployeesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companyId: string;
  batchId?: string;
  examinationDate?: string;
}

export function ImportEmployeesDialog({
  open,
  onOpenChange,
  companyId,
  batchId,
  examinationDate,
}: ImportEmployeesDialogProps) {
  const { showToast } = useUIStore();
  const { getCompanyById, importEmployees } = useCorporateHealthCheckStore();
  const company = getCompanyById(companyId);

  // Wizard state: 1 (Upload), 2 (Mapping), 3 (Validation Preview), 4 (Confirm)
  const [step, setStep] = React.useState<1 | 2 | 3 | 4>(1);

  // File & parse data
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [parseResult, setParseResult] = React.useState<ExcelParseResult | null>(null);
  const [columnMapping, setColumnMapping] = React.useState<Record<string, keyof RawEmployeeRow | "ignore">>({});
  const [validationResults, setValidationResults] = React.useState<RowValidationResult[]>([]);
  const [previewFilter, setPreviewFilter] = React.useState<"ALL" | "VALID" | "ERROR">("ALL");
  const [importValidOnly, setImportValidOnly] = React.useState(true);
  const [isProcessing, setIsProcessing] = React.useState(false);

  // Reset state when dialog opens/closes
  React.useEffect(() => {
    if (!open) {
      setStep(1);
      setSelectedFile(null);
      setParseResult(null);
      setColumnMapping({});
      setValidationResults([]);
      setPreviewFilter("ALL");
      setImportValidOnly(true);
    }
  }, [open]);

  // Handle Download Sample Excel
  const handleDownloadSample = () => {
    const bytes = generateSampleExcelFile();
    const blob = new Blob([bytes.buffer as ArrayBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Mau_Danh_Sach_Nhan_Su_KSK_${company?.code || "NKC"}.xlsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast("Đã tải file Excel mẫu về máy.");
  };

  // Handle File Input Change
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      showToast("Chỉ hỗ trợ file định dạng Excel (.xlsx, .xls)");
      return;
    }

    try {
      setIsProcessing(true);
      setSelectedFile(file);
      const result = await readExcelFile(file);
      setParseResult(result);

      // Auto-detect mappings for headers
      const initialMapping: Record<string, keyof RawEmployeeRow | "ignore"> = {};
      result.headers.forEach((h) => {
        initialMapping[h] = autoDetectMapping(h);
      });
      setColumnMapping(initialMapping);

      setStep(2); // move to Step 2: Mapping
    } catch (err) {
      console.error(err);
      showToast("Không thể đọc file Excel. Vui lòng kiểm tra lại cấu trúc file.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Proceed to Step 3: Validation Preview
  const handleProceedToValidation = () => {
    if (!parseResult) return;

    // Check if required fields are mapped
    const mappedValues = Object.values(columnMapping);
    const missingRequired = SYSTEM_FIELDS.filter((f) => f.required && !mappedValues.includes(f.key));

    if (missingRequired.length > 0) {
      showToast(
        `Vui lòng ánh xạ các cột bắt buộc: ${missingRequired.map((f) => f.label).join(", ")}`
      );
      return;
    }

    const results = validateMappedRows(
      parseResult.rawRows,
      columnMapping,
      companyId,
      batchId,
      examinationDate
    );
    setValidationResults(results);
    setStep(3);
  };

  // Summary counts
  const totalCount = validationResults.length;
  const validCount = validationResults.filter((r) => r.isValid).length;
  const warningCount = validationResults.filter((r) => r.isValid && r.warnings.length > 0).length;
  const errorCount = validationResults.filter((r) => !r.isValid).length;

  // Filtered rows for Step 3 Preview
  const filteredRows = React.useMemo(() => {
    if (previewFilter === "VALID") return validationResults.filter((r) => r.isValid);
    if (previewFilter === "ERROR") return validationResults.filter((r) => !r.isValid);
    return validationResults;
  }, [validationResults, previewFilter]);

  // Proceed to Step 4: Confirm
  const handleProceedToConfirm = () => {
    const importableCount = importValidOnly ? validCount : totalCount;
    if (importableCount === 0) {
      showToast("Không có nhân sự hợp lệ nào để import.");
      return;
    }
    setStep(4);
  };

  // Final Action: Complete Import
  const handleConfirmImport = () => {
    const rowsToImport = importValidOnly
      ? validationResults.filter((r) => r.isValid)
      : validationResults;

    const employeesToSave: CompanyEmployee[] = rowsToImport.map((r) => r.normalizedEmployee as CompanyEmployee);

    importEmployees(companyId, employeesToSave);
    showToast(`Đã import thành công ${employeesToSave.length} nhân sự vào công ty ${company?.name}.`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-6 overflow-hidden bg-white">
        <DialogHeader className="border-b border-slate-200 pb-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black uppercase text-clinic-blue tracking-wider block">
                QUY TRÌNH 4 BƯỚC • KHÁM SỨC KHỎE DOANH NGHIỆP
              </span>
              <DialogTitle className="text-base font-bold text-slate-900 mt-0.5">
                Import Danh Sách Nhân Sự Từ Excel
              </DialogTitle>
              <div className="text-xs text-slate-500">
                Doanh nghiệp: <b className="text-slate-800">{company?.name}</b>
              </div>
            </div>

            {/* Step Wizard Indicator */}
            <div className="flex items-center gap-2">
              {[
                { s: 1, label: "Tải file" },
                { s: 2, label: "Khớp cột" },
                { s: 3, label: "Kiểm tra" },
                { s: 4, label: "Xác nhận" },
              ].map(({ s, label }) => (
                <div key={s} className="flex items-center gap-1">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      step === s
                        ? "bg-clinic-blue text-white ring-2 ring-blue-300"
                        : step > s
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {step > s ? "✓" : s}
                  </div>
                  <span className={`text-[11px] font-semibold hidden sm:inline ${step === s ? "text-clinic-blue" : "text-slate-500"}`}>
                    {label}
                  </span>
                  {s < 4 && <div className="w-3 h-0.5 bg-slate-200 mx-0.5" />}
                </div>
              ))}
            </div>
          </div>
        </DialogHeader>

        {/* STEP 1: UPLOAD EXCEL */}
        {step === 1 && (
          <div className="py-6 space-y-6 flex-1 overflow-y-auto">
            {/* Download Template Banner */}
            <div className="p-4 bg-blue-50/80 border border-blue-200 rounded-xl flex items-center justify-between">
              <div>
                <div className="font-bold text-xs text-blue-950 flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-clinic-blue" />
                  Bạn chưa có file mẫu chuẩn của Phòng khám?
                </div>
                <div className="text-[11px] text-blue-800 mt-0.5">
                  Tải file Excel mẫu gồm đầy đủ 16 cột thông tin hành chính cần thiết cho Mẫu số 03.
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleDownloadSample}
                className="text-xs font-bold border-blue-300 text-blue-900 bg-white hover:bg-blue-100"
              >
                <Download className="w-3.5 h-3.5 mr-1 text-clinic-blue" />
                Tải file Excel mẫu (.xlsx)
              </Button>
            </div>

            {/* Dropzone */}
            <div className="border-2 border-dashed border-slate-300 hover:border-clinic-blue rounded-2xl p-8 text-center transition-all bg-slate-50/50 flex flex-col items-center justify-center cursor-pointer relative">
              <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div className="w-14 h-14 rounded-2xl bg-blue-100 text-clinic-blue flex items-center justify-center mb-3">
                <UploadCloud className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-sm text-slate-800">
                Kéo thả file Excel vào đây hoặc click để chọn file
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Hỗ trợ định dạng Microsoft Excel (.xlsx, .xls), tối đa 20MB.
              </p>
            </div>

            {/* Rules Note */}
            <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
              <div className="font-bold text-amber-950 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                Lưu ý quan trọng về quy tắc dữ liệu:
              </div>
              <ul className="list-disc pl-5 space-y-0.5 text-[11px] text-amber-800">
                <li>Mỗi dòng tương ứng với 01 nhân sự; dòng 1 là tiêu đề cột.</li>
                <li>
                  <b>Độ tuổi: </b>Chỉ chấp nhận nhân sự <b>từ đủ 18 tuổi trở lên</b> tính tại ngày khám. Nhân sự dưới 18 tuổi sẽ bị chặn tự động.
                </li>
                <li>
                  <b>Số CCCD: </b>Nên định dạng ô dạng Text để không bị mất số 0 ở đầu.
                </li>
                <li>
                  <b>Ngày sinh: </b>Hỗ trợ định dạng <code>DD/MM/YYYY</code> hoặc ngày chuẩn Excel.
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* STEP 2: COLUMN MAPPING */}
        {step === 2 && parseResult && (
          <div className="py-4 space-y-4 flex-1 overflow-y-auto">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs flex items-center justify-between">
              <div>
                File đang đọc: <b className="text-slate-900">{parseResult.fileName}</b>
                <span className="text-slate-500 ml-2">({parseResult.totalRows} dòng dữ liệu)</span>
              </div>
              <span className="text-slate-500 text-[11px]">
                Kiểm tra và ghép các cột trong file Excel với các trường thông tin hệ thống.
              </span>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden max-h-96 overflow-y-auto">
              <table className="w-full text-xs">
                <thead className="bg-slate-100 sticky top-0 border-b border-slate-200 text-slate-700 font-bold">
                  <tr>
                    <th className="p-2.5 text-left w-1/3">Cột trong file Excel của bạn</th>
                    <th className="p-2.5 text-center w-12">→</th>
                    <th className="p-2.5 text-left">Trường hệ thống tương ứng (Mẫu 03)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {parseResult.headers.map((excelCol) => {
                    const currentMapping = columnMapping[excelCol] || "ignore";
                    const isRequired = SYSTEM_FIELDS.find((f) => f.key === currentMapping)?.required;

                    return (
                      <tr key={excelCol} className="hover:bg-slate-50/60">
                        <td className="p-2.5 font-semibold text-slate-800">
                          {excelCol}
                        </td>
                        <td className="p-2.5 text-center text-slate-400 font-bold">→</td>
                        <td className="p-2.5">
                          <select
                            value={currentMapping}
                            onChange={(e) => {
                              const val = e.target.value as keyof RawEmployeeRow | "ignore";
                              setColumnMapping((prev) => ({
                                ...prev,
                                [excelCol]: val,
                              }));
                            }}
                            className={`w-full h-8 px-2 rounded-lg border text-xs font-medium outline-none ${
                              isRequired
                                ? "border-emerald-500 bg-emerald-50/40 text-emerald-950 font-bold"
                                : currentMapping !== "ignore"
                                ? "border-slate-300 text-slate-800"
                                : "border-slate-200 text-slate-400 bg-slate-50"
                            }`}
                          >
                            <option value="ignore">-- Bỏ qua cột này --</option>
                            <optgroup label="Trường bắt buộc">
                              {SYSTEM_FIELDS.filter((f) => f.required).map((f) => (
                                <option key={f.key} value={f.key}>
                                  ★ {f.label} (Bắt buộc)
                                </option>
                              ))}
                            </optgroup>
                            <optgroup label="Trường bổ sung (Mẫu 03)">
                              {SYSTEM_FIELDS.filter((f) => !f.required).map((f) => (
                                <option key={f.key} value={f.key}>
                                  {f.label}
                                </option>
                              ))}
                            </optgroup>
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* STEP 3: VALIDATION PREVIEW */}
        {step === 3 && (
          <div className="py-4 space-y-4 flex-1 overflow-y-auto">
            {/* Summary Cards */}
            <div className="grid grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-slate-500 font-bold block text-[10px] uppercase">Tổng số dòng</span>
                <span className="text-xl font-black text-slate-900">{totalCount}</span>
              </div>
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                <span className="text-emerald-700 font-bold block text-[10px] uppercase">Hợp lệ</span>
                <span className="text-xl font-black text-emerald-800">{validCount}</span>
              </div>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                <span className="text-amber-700 font-bold block text-[10px] uppercase">Cảnh báo thiếu tin</span>
                <span className="text-xl font-black text-amber-800">{warningCount}</span>
              </div>
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                <span className="text-red-700 font-bold block text-[10px] uppercase">Lỗi chặn (Blocking)</span>
                <span className="text-xl font-black text-red-800">{errorCount}</span>
              </div>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-500 font-semibold flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5" /> Lọc hiển thị:
                </span>
                <button
                  type="button"
                  onClick={() => setPreviewFilter("ALL")}
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    previewFilter === "ALL" ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-700"
                  }`}
                >
                  Tất cả ({totalCount})
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewFilter("VALID")}
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    previewFilter === "VALID" ? "bg-emerald-700 text-white" : "bg-emerald-50 text-emerald-800"
                  }`}
                >
                  Hợp lệ ({validCount})
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewFilter("ERROR")}
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    previewFilter === "ERROR" ? "bg-red-700 text-white" : "bg-red-50 text-red-800"
                  }`}
                >
                  Có lỗi ({errorCount})
                </button>
              </div>

              {errorCount > 0 && (
                <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={importValidOnly}
                    onChange={(e) => setImportValidOnly(e.target.checked)}
                    className="w-4 h-4 rounded text-clinic-blue"
                  />
                  <span>Chỉ import các dòng hợp lệ ({validCount} nhân sự)</span>
                </label>
              )}
            </div>

            {/* Rows Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden max-h-80 overflow-y-auto">
              <table className="w-full text-xs">
                <thead className="bg-slate-100 sticky top-0 border-b border-slate-200 text-slate-700 font-bold">
                  <tr>
                    <th className="p-2 w-12 text-center">Dòng</th>
                    <th className="p-2 text-left">Họ và tên</th>
                    <th className="p-2 text-center w-14">Tuổi</th>
                    <th className="p-2 text-left">Số CCCD</th>
                    <th className="p-2 text-left">Phòng ban / Chức danh</th>
                    <th className="p-2 text-center w-28">Trạng thái</th>
                    <th className="p-2 text-left">Chi tiết lỗi / Cảnh báo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRows.map((r) => {
                    const emp = r.normalizedEmployee;
                    return (
                      <tr
                        key={r.rowNumber}
                        className={!r.isValid ? "bg-red-50/40" : r.warnings.length > 0 ? "bg-amber-50/30" : ""}
                      >
                        <td className="p-2 text-center font-mono font-bold text-slate-500">
                          {r.rowNumber}
                        </td>
                        <td className="p-2 font-bold text-slate-900">
                          {emp.fullName || <span className="text-red-500 italic">Trống</span>}
                        </td>
                        <td className="p-2 text-center font-semibold">
                          {emp.age !== undefined && emp.age >= 0 ? (
                            <span className={emp.age < 18 ? "text-red-600 font-bold" : "text-slate-800"}>
                              {emp.age}
                            </span>
                          ) : (
                            <span className="text-red-500">Lỗi</span>
                          )}
                        </td>
                        <td className="p-2 font-mono">
                          {emp.identityNumber || <span className="text-red-500 italic">Trống</span>}
                        </td>
                        <td className="p-2 text-slate-600">
                          {emp.department || emp.occupation || "-"}
                        </td>
                        <td className="p-2 text-center">
                          {r.status === "VALID" ? (
                            <Badge variant="success" className="text-[10px]">Hợp lệ</Badge>
                          ) : r.status === "UNDER_18" ? (
                            <Badge variant="danger" className="text-[10px]">Không đủ tuổi (&lt;18)</Badge>
                          ) : r.status === "DUPLICATE_IDENTITY" ? (
                            <Badge variant="danger" className="text-[10px]">Trùng CCCD</Badge>
                          ) : (
                            <Badge variant="warn" className="text-[10px]">Thiếu thông tin</Badge>
                          )}
                        </td>
                        <td className="p-2 text-[11px] leading-tight">
                          {r.blockingErrors.map((err, i) => (
                            <div key={i} className="text-red-700 font-medium">
                              • {err}
                            </div>
                          ))}
                          {r.warnings.map((warn, i) => (
                            <div key={i} className="text-amber-800">
                              ⚠ {warn}
                            </div>
                          ))}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* STEP 4: CONFIRMATION */}
        {step === 4 && (
          <div className="py-8 space-y-6 flex-1 overflow-y-auto text-center max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-900">
                Sẵn sàng import {importValidOnly ? validCount : totalCount} nhân sự
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Hồ sơ nhân sự sẽ được nạp vào danh sách khám sức khỏe của doanh nghiệp <b>{company?.name}</b> để sẵn sàng xem trước và in phiếu Mẫu số 03 hàng loạt.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-left space-y-2">
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-500">Doanh nghiệp:</span>
                <span className="font-bold text-slate-900">{company?.name}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-500">Số nhân sự hợp lệ:</span>
                <span className="font-mono font-bold text-emerald-700">{validCount}</span>
              </div>
              {errorCount > 0 && (
                <div className="flex justify-between border-b border-slate-200 pb-1.5 text-red-600">
                  <span>Số dòng bị loại trừ (lỗi/dưới 18 tuổi):</span>
                  <span className="font-mono font-bold">{errorCount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-500">Mẫu biểu áp dụng:</span>
                <span className="font-bold text-clinic-blue">Mẫu số 03 (Từ đủ 18 tuổi)</span>
              </div>
            </div>
          </div>
        )}

        {/* FOOTER ACTIONS */}
        <DialogFooter className="border-t border-slate-200 pt-3 flex items-center justify-between">
          <div>
            {step > 1 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setStep((prev) => (prev - 1) as 1 | 2 | 3 | 4)}
                className="text-xs font-semibold"
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                Quay lại bước trước
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-xs text-slate-500"
            >
              Hủy
            </Button>

            {step === 2 && (
              <Button
                type="button"
                size="sm"
                onClick={handleProceedToValidation}
                className="text-xs font-bold bg-clinic-blue text-white"
              >
                Tiếp tục: Kiểm tra dữ liệu
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            )}

            {step === 3 && (
              <Button
                type="button"
                size="sm"
                onClick={handleProceedToConfirm}
                disabled={importValidOnly && validCount === 0}
                className="text-xs font-bold bg-clinic-blue text-white"
              >
                Tiếp tục: Xác nhận import ({importValidOnly ? validCount : totalCount})
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            )}

            {step === 4 && (
              <Button
                type="button"
                size="sm"
                onClick={handleConfirmImport}
                className="text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20 px-6"
              >
                Xác nhận import vào hệ thống
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
