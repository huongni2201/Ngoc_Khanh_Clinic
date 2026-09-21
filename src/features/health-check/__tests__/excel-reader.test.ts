import { describe, it, expect } from "vitest";
import {
  autoDetectMapping,
  formatIdentityNumber,
  normalizeGender,
  formatExcelDate,
  validateMappedRows,
} from "../import-employees/excel-reader.adapter";

describe("Excel Reader Adapter & Normalization", () => {
  it("auto-detects standard Vietnamese headers to system keys", () => {
    expect(autoDetectMapping("Họ và tên")).toBe("fullName");
    expect(autoDetectMapping("Họ tên CBNV")).toBe("fullName");
    expect(autoDetectMapping("Số CCCD")).toBe("identityNumber");
    expect(autoDetectMapping("CCCD/Hộ chiếu")).toBe("identityNumber");
    expect(autoDetectMapping("Ngày sinh")).toBe("dateOfBirth");
    expect(autoDetectMapping("Giới tính")).toBe("gender");
    expect(autoDetectMapping("Phòng/Ban")).toBe("department");
    expect(autoDetectMapping("Nghề nghiệp / Chức danh")).toBe("occupation");
    expect(autoDetectMapping("Cột không liên quan")).toBe("ignore");
  });

  it("normalizes gender strings correctly", () => {
    expect(normalizeGender("Nam")).toBe("MALE");
    expect(normalizeGender("nam")).toBe("MALE");
    expect(normalizeGender("Male")).toBe("MALE");
    expect(normalizeGender("Nữ")).toBe("FEMALE");
    expect(normalizeGender("nu")).toBe("FEMALE");
    expect(normalizeGender("Female")).toBe("FEMALE");
    expect(normalizeGender("unknown")).toBeNull();
  });

  it("preserves leading zeroes for CCCD / identity numbers", () => {
    // If Excel truncated 001081008892 to 1081008892 (10 digits instead of 12)
    expect(formatIdentityNumber(1081008892)).toBe("001081008892");
    expect(formatIdentityNumber("001090012345")).toBe("001090012345");
  });

  it("formats Excel dates properly from strings and formats", () => {
    expect(formatExcelDate("15/05/1990")).toBe("1990-05-15");
    expect(formatExcelDate("1990-05-15")).toBe("1990-05-15");
  });

  it("validates mapped rows and flags blocking errors and warnings", () => {
    const rawRows = [
      // Row 1: Valid adult
      {
        colName: "Nguyễn Văn Tuấn",
        colGender: "Nam",
        colDob: "15/05/1990",
        colCccd: "001090012345",
      },
      // Row 2: Under 18 candidate
      {
        colName: "Trần Bé Con",
        colGender: "Nữ",
        colDob: "10/10/2012",
        colCccd: "001112009876",
      },
      // Row 3: Missing full name and gender
      {
        colName: "",
        colGender: "",
        colDob: "20/01/1985",
        colCccd: "001085001122",
      },
      // Row 4: Duplicate CCCD 1
      {
        colName: "Lê Văn Trùng 1",
        colGender: "Nam",
        colDob: "01/01/1988",
        colCccd: "001088009999",
      },
      // Row 5: Duplicate CCCD 2
      {
        colName: "Lê Văn Trùng 2",
        colGender: "Nam",
        colDob: "01/01/1989",
        colCccd: "001088009999", // duplicate
      },
    ];

    const mapping = {
      colName: "fullName" as const,
      colGender: "gender" as const,
      colDob: "dateOfBirth" as const,
      colCccd: "identityNumber" as const,
    };

    const results = validateMappedRows(rawRows, mapping, "comp-test", "batch-test", "2026-09-25");

    expect(results).toHaveLength(5);

    // Row 1 should be valid
    expect(results[0].isValid).toBe(true);
    expect(results[0].status).toBe("INCOMPLETE"); // warning for missing address/ethnicity is incomplete status
    expect(results[0].normalizedEmployee.age).toBe(36);

    // Row 2 should be rejected: UNDER_18
    expect(results[1].isValid).toBe(false);
    expect(results[1].status).toBe("UNDER_18");
    expect(results[1].blockingErrors.some((e) => e.includes("chưa đủ 18 tuổi"))).toBe(true);

    // Row 3 should be rejected: missing required fields
    expect(results[2].isValid).toBe(false);
    expect(results[2].blockingErrors.some((e) => e.includes("Họ và tên"))).toBe(true);

    // Rows 4 & 5 should be rejected: DUPLICATE_IDENTITY
    expect(results[3].isValid).toBe(false);
    expect(results[3].status).toBe("DUPLICATE_IDENTITY");
    expect(results[3].blockingErrors.some((e) => e.includes("Trùng số CCCD"))).toBe(true);

    expect(results[4].isValid).toBe(false);
    expect(results[4].status).toBe("DUPLICATE_IDENTITY");
    expect(results[4].blockingErrors.some((e) => e.includes("Trùng số CCCD"))).toBe(true);
  });
});
