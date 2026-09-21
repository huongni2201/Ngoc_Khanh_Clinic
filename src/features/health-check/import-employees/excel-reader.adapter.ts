import * as XLSX from "xlsx";
import {
  calculateAgeAtDate,
  parseFlexibleDate,
} from "@/entities/company-employee/model/company-employee.schema";
import {
  CompanyEmployee,
  EmployeeValidationStatus,
} from "@/entities/company-employee/model/company-employee.types";

export interface HeaderMapping {
  excelColumn: string;
  systemField: keyof RawEmployeeRow | "ignore";
  label: string;
  required: boolean;
}

export interface RawEmployeeRow {
  employeeCode?: string;
  fullName: string;
  gender: string;
  dateOfBirth: string;
  identityNumber: string;
  identityIssueDate?: string;
  identityIssuePlace?: string;
  ethnicity?: string;
  subjectType?: string;
  payerSource?: string;
  bloodGroup?: string;
  currentAddress?: string;
  occupation?: string;
  department?: string;
  phone?: string;
  email?: string;
}

export interface RowValidationResult {
  rowNumber: number;
  rawData: Record<string, string>;
  normalizedEmployee: Partial<CompanyEmployee>;
  isValid: boolean;
  status: EmployeeValidationStatus;
  blockingErrors: string[];
  warnings: string[];
}

export interface ExcelParseResult {
  fileName: string;
  totalRows: number;
  headers: string[];
  rawRows: Array<Record<string, string>>;
}

export const SYSTEM_FIELDS: Array<{
  key: keyof RawEmployeeRow;
  label: string;
  required: boolean;
  aliases: string[];
}> = [
  {
    key: "employeeCode",
    label: "Mã nhân viên",
    required: false,
    aliases: ["mã nv", "mã nhân viên", "manv", "mã cbnv", "employee code", "staff id"],
  },
  {
    key: "fullName",
    label: "Họ và tên",
    required: true,
    aliases: ["họ và tên", "họ tên", "tên nhân viên", "full name", "họ và tên cbnv", "hoten"],
  },
  {
    key: "gender",
    label: "Giới tính",
    required: true,
    aliases: ["giới tính", "gender", "phái", "nam/nữ"],
  },
  {
    key: "dateOfBirth",
    label: "Ngày sinh",
    required: true,
    aliases: ["ngày sinh", "ngaysinh", "ngày tháng năm sinh", "dob", "date of birth", "năm sinh"],
  },
  {
    key: "identityNumber",
    label: "Số CCCD/Hộ chiếu",
    required: true,
    aliases: [
      "số cccd",
      "cccd",
      "số cmnd",
      "cmnd",
      "cccd/hộ chiếu",
      "mã định danh",
      "số định danh",
      "số cmnd/cccd",
      "identity card",
      "so cccd",
    ],
  },
  {
    key: "identityIssueDate",
    label: "Ngày cấp CCCD",
    required: false,
    aliases: ["ngày cấp", "ngày cấp cccd", "ngay cap", "issue date"],
  },
  {
    key: "identityIssuePlace",
    label: "Nơi cấp CCCD",
    required: false,
    aliases: ["nơi cấp", "nơi cấp cccd", "noi cap", "issue place"],
  },
  {
    key: "ethnicity",
    label: "Dân tộc",
    required: false,
    aliases: ["dân tộc", "dan toc", "ethnicity"],
  },
  {
    key: "subjectType",
    label: "Đối tượng",
    required: false,
    aliases: ["đối tượng", "doi tuong", "subject type"],
  },
  {
    key: "payerSource",
    label: "Nguồn chi trả",
    required: false,
    aliases: ["nguồn chi trả", "nguon chi tra", "payer source", "nguồn thanh toán"],
  },
  {
    key: "bloodGroup",
    label: "Nhóm máu",
    required: false,
    aliases: ["nhóm máu", "nhom mau", "blood group"],
  },
  {
    key: "currentAddress",
    label: "Nơi ở hiện tại",
    required: false,
    aliases: ["nơi ở hiện tại", "địa chỉ", "địa chỉ hiện tại", "dia chi", "current address", "address"],
  },
  {
    key: "occupation",
    label: "Nghề nghiệp / Chức danh",
    required: false,
    aliases: ["nghề nghiệp", "chức danh", "chức vụ", "vị trí", "nghe nghiep", "occupation", "job title"],
  },
  {
    key: "department",
    label: "Phòng/Ban",
    required: false,
    aliases: ["phòng ban", "phòng/ban", "bộ phận", "khoa phòng", "phong ban", "department"],
  },
  {
    key: "phone",
    label: "Số điện thoại",
    required: false,
    aliases: ["số điện thoại", "điện thoại", "sđt", "sdt", "phone", "mobile"],
  },
  {
    key: "email",
    label: "Email",
    required: false,
    aliases: ["email", "thư điện tử", "e-mail"],
  },
];

/**
 * Automatically find the best match for an Excel header based on predefined aliases.
 */
export function autoDetectMapping(excelHeader: string): keyof RawEmployeeRow | "ignore" {
  const normalized = excelHeader.toLowerCase().trim();
  for (const field of SYSTEM_FIELDS) {
    if (field.aliases.some((alias) => normalized === alias || normalized.includes(alias))) {
      return field.key;
    }
  }
  return "ignore";
}

/**
 * Format date value from Excel into YYYY-MM-DD string.
 * Excel sometimes stores dates as serial numbers (e.g. 33340).
 */
export function formatExcelDate(value: unknown): string {
  if (value === null || value === undefined || value === "") return "";

  // If numeric (Excel serial date)
  if (typeof value === "number") {
    // SheetJS date parse
    const dateObj = XLSX.SSF.parse_date_code(value);
    if (dateObj) {
      const y = String(dateObj.y).padStart(4, "0");
      const m = String(dateObj.m).padStart(2, "0");
      const d = String(dateObj.d).padStart(2, "0");
      return `${y}-${m}-${d}`;
    }
  }

  const str = String(value).trim();
  const parsed = parseFlexibleDate(str);
  if (parsed) {
    const y = parsed.getFullYear();
    const m = String(parsed.getMonth() + 1).padStart(2, "0");
    const d = String(parsed.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  return str;
}

/**
 * Format CCCD/Identity number: trim whitespace, ensure string,
 * if pure digits and length < 12 but > 8, might have lost leading zeros.
 */
export function formatIdentityNumber(value: unknown): string {
  if (value === null || value === undefined) return "";
  let str = String(value).trim();
  // If Excel parsed 001081008892 as number 1081008892 (10 digits instead of 12 for CCCD)
  if (/^\d+$/.test(str)) {
    if (str.length === 11) {
      str = "0" + str;
    } else if (str.length === 10) {
      str = "00" + str;
    } else if (str.length === 8) {
      // 9-digit old CMND lost 1 leading zero
      str = "0" + str;
    }
  }
  return str;
}

/**
 * Normalize gender string: Nam/Male -> "MALE", Nữ/Female -> "FEMALE".
 */
export function normalizeGender(val: string): "MALE" | "FEMALE" | null {
  if (!val) return null;
  const s = val.toLowerCase().trim();
  if (s === "nam" || s === "male" || s === "m" || s === "1") return "MALE";
  if (s === "nữ" || s === "nu" || s === "female" || s === "f" || s === "0" || s === "2") return "FEMALE";
  return null;
}

/**
 * Parse an Excel File object into raw rows and extracted headers.
 */
export async function readExcelFile(file: File): Promise<ExcelParseResult> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array", cellDates: false });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];

  if (!worksheet) {
    throw new Error("File Excel không có dữ liệu hoặc không thể đọc được.");
  }

  // Read as raw json 2D array
  const jsonData = XLSX.utils.sheet_to_json<unknown[]>(worksheet, {
    header: 1,
    defval: "",
    blankrows: false,
  });

  if (jsonData.length === 0) {
    return {
      fileName: file.name,
      totalRows: 0,
      headers: [],
      rawRows: [],
    };
  }

  // Header row is first row
  const headerRow = jsonData[0] || [];
  const headers = headerRow.map((cell) => String(cell || "").trim()).filter(Boolean);

  // Remaining rows
  const rawRows: Array<Record<string, string>> = [];
  for (let i = 1; i < jsonData.length; i++) {
    const rowArray = jsonData[i] || [];
    const hasData = rowArray.some((val) => val !== "" && val !== null && val !== undefined);
    if (!hasData) continue;

    const rowObj: Record<string, string> = {};
    headers.forEach((h, colIdx) => {
      const cellVal = rowArray[colIdx];
      rowObj[h] = cellVal !== undefined && cellVal !== null ? String(cellVal).trim() : "";
    });
    rawRows.push(rowObj);
  }

  return {
    fileName: file.name,
    totalRows: rawRows.length,
    headers,
    rawRows,
  };
}

/**
 * Validate and normalize mapped rows against Business Rules.
 * - Age >= 18 on examination date
 * - Required: fullName, gender, dateOfBirth, identityNumber
 * - Duplicate identityNumber in file
 */
export function validateMappedRows(
  rawRows: Array<Record<string, string>>,
  mapping: Record<string, keyof RawEmployeeRow | "ignore">,
  companyId: string,
  batchId?: string,
  examinationDate?: string
): RowValidationResult[] {
  const identityCountMap = new Map<string, number>();

  // Pre-pass: count identity numbers to flag duplicates within file
  rawRows.forEach((row) => {
    let idNum = "";
    for (const [colName, fieldKey] of Object.entries(mapping)) {
      if (fieldKey === "identityNumber" && row[colName]) {
        idNum = formatIdentityNumber(row[colName]);
        break;
      }
    }
    if (idNum) {
      identityCountMap.set(idNum, (identityCountMap.get(idNum) || 0) + 1);
    }
  });

  const results: RowValidationResult[] = [];

  rawRows.forEach((row, index) => {
    const rowNumber = index + 2; // Row 1 is header, so row 2 is first data row
    const extracted: Partial<RawEmployeeRow> = {};

    for (const [colName, fieldKey] of Object.entries(mapping)) {
      if (fieldKey !== "ignore" && row[colName] !== undefined) {
        extracted[fieldKey] = row[colName];
      }
    }

    const blockingErrors: string[] = [];
    const warnings: string[] = [];

    // 1. Full name validation
    const fullName = (extracted.fullName || "").trim();
    if (!fullName) {
      blockingErrors.push("Họ và tên không được để trống");
    }

    // 2. Gender validation
    const rawGender = (extracted.gender || "").trim();
    const normalizedGender = normalizeGender(rawGender);
    if (!normalizedGender) {
      blockingErrors.push("Giới tính không hợp lệ hoặc để trống (yêu cầu Nam/Nữ)");
    }

    // 3. Date of birth & Age validation
    const rawDob = (extracted.dateOfBirth || "").trim();
    const formattedDob = formatExcelDate(rawDob);
    let calculatedAge = -1;

    if (!formattedDob) {
      blockingErrors.push("Ngày sinh không được để trống");
    } else {
      calculatedAge = calculateAgeAtDate(formattedDob, examinationDate);
      if (calculatedAge < 0) {
        blockingErrors.push(`Định dạng ngày sinh không hợp lệ: "${rawDob}"`);
      } else if (calculatedAge < 18) {
        blockingErrors.push(
          `Nhân sự chưa đủ 18 tuổi (${calculatedAge} tuổi tại ngày khám). Ngọc Khánh Clinic chỉ áp dụng Mẫu số 03 cho người từ đủ 18 tuổi.`
        );
      }
    }

    // 4. Identity number validation
    const rawId = (extracted.identityNumber || "").trim();
    const formattedId = formatIdentityNumber(rawId);
    if (!formattedId) {
      blockingErrors.push("Số CCCD/Hộ chiếu không được để trống");
    } else {
      if (formattedId.length < 9 || formattedId.length > 15) {
        warnings.push(`Số CCCD có độ dài bất thường (${formattedId.length} ký tự)`);
      }
      if ((identityCountMap.get(formattedId) || 0) > 1) {
        blockingErrors.push(`Trùng số CCCD "${formattedId}" với dòng khác trong danh sách tải lên`);
      }
    }

    // 5. Warnings for incomplete administrative info
    if (!extracted.identityIssuePlace) {
      warnings.push("Thiếu nơi cấp CCCD");
    }
    if (!extracted.ethnicity) {
      warnings.push("Thiếu thông tin dân tộc (mặc định để trống)");
    }
    if (!extracted.currentAddress) {
      warnings.push("Thiếu địa chỉ nơi ở hiện tại");
    }
    if (!extracted.occupation) {
      warnings.push("Thiếu chức danh/nghề nghiệp");
    }

    // Determine Status
    let status: EmployeeValidationStatus = "VALID";
    if (blockingErrors.some((e) => e.includes("chưa đủ 18 tuổi"))) {
      status = "UNDER_18";
    } else if (blockingErrors.some((e) => e.includes("Trùng số CCCD"))) {
      status = "DUPLICATE_IDENTITY";
    } else if (blockingErrors.length > 0) {
      status = "INCOMPLETE";
    } else if (warnings.length > 0) {
      status = "INCOMPLETE";
    }

    const isValid = blockingErrors.length === 0;

    const normalizedEmployee: Partial<CompanyEmployee> = {
      id: `emp-${Date.now()}-${index}`,
      companyId,
      batchId,
      employeeCode: extracted.employeeCode || `NV-${String(index + 1).padStart(3, "0")}`,
      fullName,
      gender: normalizedGender || "MALE",
      dateOfBirth: formattedDob || rawDob,
      age: calculatedAge >= 0 ? calculatedAge : 0,
      identityNumber: formattedId,
      identityIssueDate: extracted.identityIssueDate ? formatExcelDate(extracted.identityIssueDate) : undefined,
      identityIssuePlace: extracted.identityIssuePlace || undefined,
      ethnicity: extracted.ethnicity || "Kinh",
      subjectType: extracted.subjectType || "Cán bộ nhân viên",
      payerSource: extracted.payerSource || undefined,
      bloodGroup: extracted.bloodGroup || undefined,
      currentAddress: extracted.currentAddress || undefined,
      occupation: extracted.occupation || undefined,
      department: extracted.department || undefined,
      phone: extracted.phone || undefined,
      email: extracted.email || undefined,
      validationStatus: status,
      validationIssues: [...blockingErrors, ...warnings],
      patientProfileStatus: "NOT_LINKED",
      printStatus: "NOT_PRINTED",
      examStatus: "NOT_ARRIVED",
    };

    results.push({
      rowNumber,
      rawData: row,
      normalizedEmployee,
      isValid,
      status,
      blockingErrors,
      warnings,
    });
  });

  return results;
}

/**
 * Generate a downloadable sample Excel workbook with standard headers and sample data.
 */
export function generateSampleExcelFile(): Uint8Array {
  const wb = XLSX.utils.book_new();

  const sampleHeaders = [
    "Mã nhân viên",
    "Họ và tên",
    "Giới tính",
    "Ngày sinh",
    "Số CCCD",
    "Ngày cấp",
    "Nơi cấp",
    "Dân tộc",
    "Đối tượng",
    "Nguồn chi trả",
    "Nhóm máu",
    "Nơi ở hiện tại",
    "Nghề nghiệp / Chức danh",
    "Phòng/Ban",
    "Số điện thoại",
    "Email",
  ];

  const sampleData = [
    [
      "FPT-001",
      "Nguyễn Văn Tuấn",
      "Nam",
      "15/05/1990",
      "001090012345",
      "10/06/2021",
      "Cục CSQLHC về TTXH",
      "Kinh",
      "Cán bộ nhân viên",
      "Công ty chi trả",
      "O+",
      "123 Cầu Giấy, Hà Nội",
      "Kỹ sư phần mềm",
      "Ban Công nghệ FPT",
      "0912345678",
      "tuan.nv@fpt.com",
    ],
    [
      "FPT-002",
      "Trần Thị Mai",
      "Nữ",
      "22/08/1995",
      "001195009876",
      "15/09/2022",
      "Cục CSQLHC về TTXH",
      "Kinh",
      "Cán bộ nhân viên",
      "Công ty chi trả",
      "A+",
      "45 Kim Mã, Ba Đình, Hà Nội",
      "Chuyên viên nhân sự",
      "Khối Nhân sự",
      "0987654321",
      "mai.tt@fpt.com",
    ],
    [
      "FPT-003",
      "Lê Hoàng Long",
      "Nam",
      "01/12/1985",
      "001085004321",
      "05/04/2020",
      "Cục CSQLHC về TTXH",
      "Kinh",
      "Cán bộ nhân viên",
      "Công ty chi trả",
      "B+",
      "88 Láng Hạ, Đống Đa, Hà Nội",
      "Trưởng phòng kinh doanh",
      "Khối Doanh nghiệp",
      "0903112233",
      "long.lh@fpt.com",
    ],
    [
      "FPT-004",
      "Phạm Thị Hương",
      "Nữ",
      "10/10/2000",
      "001100007890",
      "20/01/2023",
      "Cục CSQLHC về TTXH",
      "Kinh",
      "Thực tập sinh",
      "Công ty chi trả",
      "",
      "25 Trần Thái Tông, Cầu Giấy, Hà Nội",
      "Chuyên viên Marketing",
      "Ban Truyền thông",
      "0934567890",
      "huong.pt@fpt.com",
    ],
  ];

  const ws = XLSX.utils.aoa_to_sheet([sampleHeaders, ...sampleData]);

  // Set column widths
  ws["!cols"] = [
    { wch: 15 },
    { wch: 22 },
    { wch: 10 },
    { wch: 14 },
    { wch: 18 },
    { wch: 14 },
    { wch: 24 },
    { wch: 10 },
    { wch: 18 },
    { wch: 18 },
    { wch: 12 },
    { wch: 32 },
    { wch: 25 },
    { wch: 20 },
    { wch: 15 },
    { wch: 24 },
  ];

  XLSX.utils.book_append_sheet(wb, ws, "DanhSachNhanSu");

  // Output as array of bytes
  return XLSX.write(wb, { bookType: "xlsx", type: "array" });
}
