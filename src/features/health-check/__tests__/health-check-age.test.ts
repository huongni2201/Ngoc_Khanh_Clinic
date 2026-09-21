import { describe, it, expect } from "vitest";
import {
  calculateAgeAtDate,
  parseFlexibleDate,
} from "@/entities/company-employee/model/company-employee.schema";

describe("Age Validation for Mẫu số 03 (Adult Health Check)", () => {
  const examDate = "2026-09-25";

  it("allows candidate who is exactly 18 years old on the exam date", () => {
    // Born 2008-09-25, exam on 2026-09-25 -> exactly 18
    const dob = "2008-09-25";
    const age = calculateAgeAtDate(dob, examDate);
    expect(age).toBe(18);
    expect(age >= 18).toBe(true);
  });

  it("rejects candidate who is one day before their 18th birthday", () => {
    // Born 2008-09-26, exam on 2026-09-25 -> 17 years old
    const dob = "2008-09-26";
    const age = calculateAgeAtDate(dob, examDate);
    expect(age).toBe(17);
    expect(age >= 18).toBe(false);
  });

  it("accepts candidate who is an adult (e.g. 35 years old)", () => {
    const dob = "1991-05-15";
    const age = calculateAgeAtDate(dob, examDate);
    expect(age).toBe(35);
    expect(age >= 18).toBe(true);
  });

  it("handles Vietnamese date format DD/MM/YYYY correctly", () => {
    const dob = "25/09/2008";
    const age = calculateAgeAtDate(dob, examDate);
    expect(age).toBe(18);
  });

  it("handles leap year date format correctly", () => {
    const dob = "2004-02-29";
    const age = calculateAgeAtDate(dob, "2026-02-28");
    expect(age).toBe(21);
    const ageAfter = calculateAgeAtDate(dob, "2026-03-01");
    expect(ageAfter).toBe(22);
  });

  it("returns -1 for invalid or malformed date of birth", () => {
    expect(calculateAgeAtDate("invalid-date", examDate)).toBe(-1);
    expect(calculateAgeAtDate("", examDate)).toBe(-1);
    expect(calculateAgeAtDate("32/13/2000", examDate)).toBe(-1);
  });
});
