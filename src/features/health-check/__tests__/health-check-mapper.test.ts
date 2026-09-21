import { describe, it, expect } from "vitest";
import {
  mapEmployeeToPrintData,
  mapPatientToPrintData,
} from "../print-health-check-form/health-check-form.mapper";
import { CompanyEmployee } from "@/entities/company-employee/model/company-employee.types";
import { Company } from "@/entities/company/model/company.types";
import { HealthCheckBatch } from "@/entities/health-check/model/health-check.types";
import { MockPatient } from "@/shared/constants/mock-data";

describe("Mẫu số 03 Print Data Mapper", () => {
  const mockCompany: Company = {
    id: "comp-fpt",
    code: "FPT-TEL",
    name: "Công ty Cổ phần Viễn thông FPT",
    status: "ACTIVE",
    defaultPayerSource: "FPT chi trả",
  };

  const mockBatch: HealthCheckBatch = {
    id: "batch-01",
    companyId: "comp-fpt",
    code: "BATCH-2026",
    name: "KSK Định kỳ 2026",
    examinationDate: "2026-09-25",
    reasonForHealthCheck: "Khám sức khỏe định kỳ doanh nghiệp",
    templateCode: "BYT_2026_M03",
    status: "READY",
  };

  const mockEmployee: CompanyEmployee = {
    id: "emp-01",
    companyId: "comp-fpt",
    batchId: "batch-01",
    employeeCode: "FPT-001",
    fullName: "Nguyễn Văn Tuấn",
    gender: "MALE",
    dateOfBirth: "1990-05-15",
    age: 36,
    identityNumber: "001090012345",
    identityIssueDate: "2021-06-10",
    identityIssuePlace: "Cục CSQLHC về TTXH",
    ethnicity: "Kinh",
    subjectType: "Cán bộ nhân viên",
    payerSource: "FPT chi trả",
    bloodGroup: "O+",
    currentAddress: "123 Cầu Giấy, Hà Nội",
    occupation: "Kỹ sư",
    department: "Ban Công nghệ",
    validationStatus: "VALID",
    patientProfileStatus: "LINKED",
    printStatus: "NOT_PRINTED",
    examStatus: "NOT_ARRIVED",
  };

  it("maps employee and company context correctly to AdultHealthCheckPrintData", () => {
    const printData = mapEmployeeToPrintData(mockEmployee, mockCompany, mockBatch);

    expect(printData.fullName).toBe("NGUYỄN VĂN TUẤN");
    expect(printData.gender).toBe("MALE");
    expect(printData.dateOfBirth).toBe("1990-05-15");
    expect(printData.age).toBe(36);
    expect(printData.identityNumber).toBe("001090012345");
    expect(printData.workplace).toBe("Công ty Cổ phần Viễn thông FPT");
    expect(printData.reasonForHealthCheck).toBe("Khám sức khỏe định kỳ doanh nghiệp");
    expect(printData.sourceType).toBe("COMPANY_EMPLOYEE");
    expect(printData.employeeCode).toBe("FPT-001");
  });

  it("maps clinic patient at Reception correctly to AdultHealthCheckPrintData", () => {
    const mockPatient: MockPatient = {
      id: "p1",
      patientCode: "PT-001842",
      fullName: "Nguyễn Văn An",
      dateOfBirth: "1981-04-12",
      age: 45,
      gender: "MALE",
      phone: "0912 345 678",
      identityCard: "001081008892",
      address: "Số 18, Ngõ 42, Cầu Giấy, Hà Nội",
      allergies: [],
      chronicConditions: [],
      regularMedications: [],
      latestVitals: {
        bloodPressure: "120/80 mmHg",
        heartRate: 75,
        glucose: 5.2,
        cholesterol: 4.8,
        bmi: 22.0,
        spo2: 98,
        recordedAt: "19/09/2026",
      },
      recentEncounters: [],
      previousDiagnoses: [],
      previousResults: [],
      previousPrescriptions: [],
      documents: [],
    };

    const printData = mapPatientToPrintData(mockPatient, {
      ethnicity: "Kinh",
      payerSource: "Cá nhân tự chi trả",
      workplace: "Kinh doanh tự do",
      reasonForHealthCheck: "Khám sức khỏe xin việc",
    });

    expect(printData.fullName).toBe("NGUYỄN VĂN AN");
    expect(printData.gender).toBe("MALE");
    expect(printData.identityNumber).toBe("001081008892");
    expect(printData.currentAddress).toBe("Số 18, Ngõ 42, Cầu Giấy, Hà Nội");
    expect(printData.workplace).toBe("Kinh doanh tự do");
    expect(printData.sourceType).toBe("RECEPTION_PATIENT");
  });
});
