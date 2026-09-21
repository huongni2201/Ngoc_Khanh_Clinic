import { create } from "zustand";
import { Company } from "@/entities/company/model/company.types";
import { HealthCheckBatch } from "@/entities/health-check/model/health-check.types";
import { CompanyEmployee } from "@/entities/company-employee/model/company-employee.types";

interface CorporateHealthCheckState {
  companies: Company[];
  batches: HealthCheckBatch[];
  employees: CompanyEmployee[];
  selectedEmployeeIds: string[];

  // Actions
  addCompany: (company: Omit<Company, "id" | "createdAt" | "updatedAt">) => Company;
  updateCompany: (id: string, updates: Partial<Company>) => void;
  getCompanyById: (id: string) => Company | undefined;

  addBatch: (batch: Omit<HealthCheckBatch, "id" | "createdAt">) => HealthCheckBatch;
  getBatchesByCompanyId: (companyId: string) => HealthCheckBatch[];

  getEmployeesByCompanyId: (companyId: string) => CompanyEmployee[];
  importEmployees: (companyId: string, newEmployees: CompanyEmployee[]) => void;
  deleteEmployee: (id: string) => void;

  toggleSelectEmployee: (id: string) => void;
  selectAllValidEmployees: (companyId: string) => void;
  clearSelection: () => void;
  markEmployeesAsPrinted: (ids: string[]) => void;
}

const INITIAL_COMPANIES: Company[] = [
  {
    id: "comp-fpt",
    code: "FPT-TEL",
    name: "Công ty Cổ phần Viễn thông FPT (FPT Telecom)",
    taxCode: "0101778163",
    address: "Tòa nhà FPT, Phố Duy Tân, P. Dịch Vọng Hậu, Q. Cầu Giấy, Hà Nội",
    contactName: "Trần Mai Anh (HR Manager)",
    contactPhone: "0912 345 678",
    contactEmail: "anh.tm@fpt.com.vn",
    contractCode: "HĐ-2026/FPT-NKC",
    defaultPayerSource: "FPT Telecom chi trả 100%",
    status: "ACTIVE",
    employeeCount: 4,
    printedCount: 2,
    completedCount: 1,
    latestBatchName: "Khám sức khỏe định kỳ 2026 - Đợt 1",
    createdAt: "2026-08-01",
  },
  {
    id: "comp-vib",
    code: "VIB-BANK",
    name: "Ngân hàng TMCP Quốc Tế Việt Nam (VIB)",
    taxCode: "0100233488",
    address: "Tòa nhà CornerStone, 16 Phan Chu Trinh, Hoàn Kiếm, Hà Nội",
    contactName: "Nguyễn Thu Thủy (Trưởng phòng C&B)",
    contactPhone: "0988 765 432",
    contactEmail: "thuy.nt@vib.com.vn",
    contractCode: "HĐ-2026/VIB-NKC",
    defaultPayerSource: "VIB chi trả",
    status: "ACTIVE",
    employeeCount: 3,
    printedCount: 0,
    completedCount: 0,
    latestBatchName: "Khám chuyên sâu cấp quản lý Q3/2026",
    createdAt: "2026-08-15",
  },
  {
    id: "comp-dht",
    code: "DHT-PHARMA",
    name: "Công ty Cổ phần Dược phẩm Hà Tây (Hataphar)",
    taxCode: "0500202999",
    address: "Số 10A, Phố Quang Trung, Hà Đông, Hà Nội",
    contactName: "Lê Văn Hùng (Phó phòng Nhân sự)",
    contactPhone: "0904 556 789",
    contactEmail: "hung.lv@hataphar.com.vn",
    contractCode: "HĐ-2026/DHT-NKC",
    defaultPayerSource: "Công ty chi trả",
    status: "ACTIVE",
    employeeCount: 0,
    printedCount: 0,
    completedCount: 0,
    latestBatchName: "Khám sức khỏe định kỳ toàn thể CBNV 2026",
    createdAt: "2026-09-01",
  },
];

const INITIAL_BATCHES: HealthCheckBatch[] = [
  {
    id: "batch-fpt-01",
    companyId: "comp-fpt",
    code: "BATCH-FPT-2026-01",
    name: "Khám sức khỏe định kỳ 2026 - Đợt 1",
    examinationDate: "2026-09-25",
    startDate: "2026-09-20",
    endDate: "2026-09-30",
    reasonForHealthCheck: "Khám sức khỏe định kỳ doanh nghiệp",
    defaultPayerSource: "Công ty Cổ phần Viễn thông FPT chi trả",
    templateCode: "BYT_2026_M03",
    status: "IN_PROGRESS",
    employeeCount: 4,
    printedCount: 2,
    completedCount: 1,
    createdAt: "2026-08-10",
  },
  {
    id: "batch-vib-01",
    companyId: "comp-vib",
    code: "BATCH-VIB-2026-01",
    name: "Khám chuyên sâu cấp quản lý Q3/2026",
    examinationDate: "2026-10-05",
    startDate: "2026-10-01",
    endDate: "2026-10-10",
    reasonForHealthCheck: "Khám sức khỏe định kỳ doanh nghiệp",
    defaultPayerSource: "VIB chi trả",
    templateCode: "BYT_2026_M03",
    status: "READY",
    employeeCount: 3,
    printedCount: 0,
    completedCount: 0,
    createdAt: "2026-08-20",
  },
  {
    id: "batch-dht-01",
    companyId: "comp-dht",
    code: "BATCH-DHT-2026-01",
    name: "Khám sức khỏe định kỳ toàn thể CBNV 2026",
    examinationDate: "2026-10-15",
    startDate: "2026-10-10",
    endDate: "2026-10-25",
    reasonForHealthCheck: "Khám sức khỏe định kỳ theo Thông tư 2026",
    defaultPayerSource: "Công ty chi trả",
    templateCode: "BYT_2026_M03",
    status: "DRAFT",
    employeeCount: 0,
    printedCount: 0,
    completedCount: 0,
    createdAt: "2026-09-05",
  },
];

const INITIAL_EMPLOYEES: CompanyEmployee[] = [
  // FPT Employees
  {
    id: "emp-fpt-01",
    companyId: "comp-fpt",
    batchId: "batch-fpt-01",
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
    payerSource: "FPT Telecom chi trả",
    bloodGroup: "O+",
    currentAddress: "123 Cầu Giấy, P. Quan Hoa, Q. Cầu Giấy, Hà Nội",
    occupation: "Kỹ sư phần mềm",
    department: "Ban Công nghệ FPT",
    phone: "0912 345 678",
    email: "tuan.nv@fpt.com",
    validationStatus: "VALID",
    patientProfileStatus: "LINKED",
    printStatus: "PRINTED",
    examStatus: "IN_EXAM",
  },
  {
    id: "emp-fpt-02",
    companyId: "comp-fpt",
    batchId: "batch-fpt-01",
    employeeCode: "FPT-002",
    fullName: "Trần Thị Mai",
    gender: "FEMALE",
    dateOfBirth: "1995-08-22",
    age: 31,
    identityNumber: "001195009876",
    identityIssueDate: "2022-09-15",
    identityIssuePlace: "Cục CSQLHC về TTXH",
    ethnicity: "Kinh",
    subjectType: "Cán bộ nhân viên",
    payerSource: "FPT Telecom chi trả",
    bloodGroup: "A+",
    currentAddress: "45 Kim Mã, Ba Đình, Hà Nội",
    occupation: "Chuyên viên nhân sự",
    department: "Khối Nhân sự",
    phone: "0987 654 321",
    email: "mai.tt@fpt.com",
    validationStatus: "VALID",
    patientProfileStatus: "NOT_LINKED",
    printStatus: "PRINTED",
    examStatus: "CHECKED_IN",
  },
  {
    id: "emp-fpt-03",
    companyId: "comp-fpt",
    batchId: "batch-fpt-01",
    employeeCode: "FPT-003",
    fullName: "Lê Hoàng Long",
    gender: "MALE",
    dateOfBirth: "1985-12-01",
    age: 40,
    identityNumber: "001085004321",
    identityIssueDate: "2020-04-05",
    identityIssuePlace: "Cục CSQLHC về TTXH",
    ethnicity: "Kinh",
    subjectType: "Cán bộ nhân viên",
    payerSource: "FPT Telecom chi trả",
    bloodGroup: "B+",
    currentAddress: "88 Láng Hạ, Đống Đa, Hà Nội",
    occupation: "Trưởng phòng kinh doanh",
    department: "Khối Doanh nghiệp",
    phone: "0903 112 233",
    email: "long.lh@fpt.com",
    validationStatus: "VALID",
    patientProfileStatus: "NOT_LINKED",
    printStatus: "NOT_PRINTED",
    examStatus: "NOT_ARRIVED",
  },
  {
    id: "emp-fpt-04",
    companyId: "comp-fpt",
    batchId: "batch-fpt-01",
    employeeCode: "FPT-004",
    fullName: "Phạm Thị Hương",
    gender: "FEMALE",
    dateOfBirth: "2000-10-10",
    age: 25,
    identityNumber: "001100007890",
    identityIssueDate: "2023-01-20",
    identityIssuePlace: "", // missing warning
    ethnicity: "Kinh",
    subjectType: "Thực tập sinh",
    payerSource: "FPT Telecom chi trả",
    bloodGroup: "",
    currentAddress: "25 Trần Thái Tông, Cầu Giấy, Hà Nội",
    occupation: "Chuyên viên Marketing",
    department: "Ban Truyền thông",
    phone: "0934 567 890",
    email: "huong.pt@fpt.com",
    validationStatus: "INCOMPLETE",
    validationIssues: ["Thiếu nơi cấp CCCD"],
    patientProfileStatus: "NOT_LINKED",
    printStatus: "NOT_PRINTED",
    examStatus: "NOT_ARRIVED",
  },

  // VIB Employees
  {
    id: "emp-vib-01",
    companyId: "comp-vib",
    batchId: "batch-vib-01",
    employeeCode: "VIB-101",
    fullName: "Vũ Đình Trọng",
    gender: "MALE",
    dateOfBirth: "1978-03-14",
    age: 48,
    identityNumber: "001078005432",
    identityIssueDate: "2021-08-10",
    identityIssuePlace: "Cục CSQLHC về TTXH",
    ethnicity: "Kinh",
    subjectType: "Quản lý cấp cao",
    payerSource: "VIB chi trả",
    bloodGroup: "O+",
    currentAddress: "Biệt thự BT2, KĐT Ngoại Giao Đoàn, Bắc Từ Liêm, Hà Nội",
    occupation: "Giám đốc Khối Khách hàng Cá nhân",
    department: "Khối RB",
    phone: "0915 223 344",
    email: "trong.vd@vib.com.vn",
    validationStatus: "VALID",
    patientProfileStatus: "NOT_LINKED",
    printStatus: "NOT_PRINTED",
    examStatus: "NOT_ARRIVED",
  },
  {
    id: "emp-vib-02",
    companyId: "comp-vib",
    batchId: "batch-vib-01",
    employeeCode: "VIB-102",
    fullName: "Đỗ Bích Phương",
    gender: "FEMALE",
    dateOfBirth: "1983-11-20",
    age: 42,
    identityNumber: "001183002468",
    identityIssueDate: "2020-11-05",
    identityIssuePlace: "Cục CSQLHC về TTXH",
    ethnicity: "Kinh",
    subjectType: "Quản lý",
    payerSource: "VIB chi trả",
    bloodGroup: "AB+",
    currentAddress: "16 Phan Chu Trinh, Hoàn Kiếm, Hà Nội",
    occupation: "Giám đốc Quản trị rủi ro",
    department: "Khối Rủi ro",
    phone: "0982 998 877",
    email: "phuong.db@vib.com.vn",
    validationStatus: "VALID",
    patientProfileStatus: "NOT_LINKED",
    printStatus: "NOT_PRINTED",
    examStatus: "NOT_ARRIVED",
  },
  {
    id: "emp-vib-03",
    companyId: "comp-vib",
    batchId: "batch-vib-01",
    employeeCode: "VIB-103",
    fullName: "Hoàng Minh Khoa",
    gender: "MALE",
    dateOfBirth: "2009-05-10", // Under 18 (17 years old) for testing
    age: 17,
    identityNumber: "001009001122",
    identityIssueDate: "2024-06-01",
    identityIssuePlace: "Cục CSQLHC về TTXH",
    ethnicity: "Kinh",
    subjectType: "Học việc",
    payerSource: "VIB chi trả",
    currentAddress: "55 Hai Bà Trưng, Hoàn Kiếm, Hà Nội",
    occupation: "Thực tập sinh Quản lý",
    department: "Khối Vận hành",
    phone: "0971 002 003",
    validationStatus: "UNDER_18",
    validationIssues: [
      "Nhân sự chưa đủ 18 tuổi (17 tuổi tại ngày khám). Ngọc Khánh Clinic chỉ áp dụng Mẫu số 03 cho người từ đủ 18 tuổi.",
    ],
    patientProfileStatus: "NOT_LINKED",
    printStatus: "NOT_PRINTED",
    examStatus: "NOT_ARRIVED",
  },
];

export const useCorporateHealthCheckStore = create<CorporateHealthCheckState>((set, get) => ({
  companies: INITIAL_COMPANIES,
  batches: INITIAL_BATCHES,
  employees: INITIAL_EMPLOYEES,
  selectedEmployeeIds: [],

  addCompany: (newCompData) => {
    const newCompany: Company = {
      ...newCompData,
      id: `comp-${Date.now()}`,
      employeeCount: 0,
      printedCount: 0,
      completedCount: 0,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    };
    set((state) => ({
      companies: [newCompany, ...state.companies],
    }));
    return newCompany;
  },

  updateCompany: (id, updates) => {
    set((state) => ({
      companies: state.companies.map((c) =>
        c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString().split("T")[0] } : c
      ),
    }));
  },

  getCompanyById: (id) => {
    return get().companies.find((c) => c.id === id);
  },

  addBatch: (batchData) => {
    const newBatch: HealthCheckBatch = {
      ...batchData,
      id: `batch-${Date.now()}`,
      employeeCount: 0,
      printedCount: 0,
      completedCount: 0,
      createdAt: new Date().toISOString().split("T")[0],
    };
    set((state) => ({
      batches: [newBatch, ...state.batches],
      companies: state.companies.map((c) =>
        c.id === batchData.companyId ? { ...c, latestBatchName: newBatch.name } : c
      ),
    }));
    return newBatch;
  },

  getBatchesByCompanyId: (companyId) => {
    return get().batches.filter((b) => b.companyId === companyId);
  },

  getEmployeesByCompanyId: (companyId) => {
    return get().employees.filter((e) => e.companyId === companyId);
  },

  importEmployees: (companyId, newEmployees) => {
    set((state) => {
      const filteredExisting = state.employees.filter((e) => e.companyId !== companyId);
      const updatedEmployees = [...filteredExisting, ...newEmployees];

      const validCount = newEmployees.filter(
        (e) => e.validationStatus === "VALID" || e.validationStatus === "INCOMPLETE"
      ).length;

      const updatedCompanies = state.companies.map((c) =>
        c.id === companyId
          ? {
              ...c,
              employeeCount: validCount,
            }
          : c
      );

      return {
        employees: updatedEmployees,
        companies: updatedCompanies,
      };
    });
  },

  deleteEmployee: (id) => {
    set((state) => {
      const target = state.employees.find((e) => e.id === id);
      const updatedEmployees = state.employees.filter((e) => e.id !== id);
      let updatedCompanies = state.companies;

      if (target) {
        const remainingForComp = updatedEmployees.filter((e) => e.companyId === target.companyId);
        updatedCompanies = state.companies.map((c) =>
          c.id === target.companyId
            ? {
                ...c,
                employeeCount: remainingForComp.length,
              }
            : c
        );
      }

      return {
        employees: updatedEmployees,
        selectedEmployeeIds: state.selectedEmployeeIds.filter((selId) => selId !== id),
        companies: updatedCompanies,
      };
    });
  },

  toggleSelectEmployee: (id) => {
    set((state) => {
      const isSelected = state.selectedEmployeeIds.includes(id);
      return {
        selectedEmployeeIds: isSelected
          ? state.selectedEmployeeIds.filter((selId) => selId !== id)
          : [...state.selectedEmployeeIds, id],
      };
    });
  },

  selectAllValidEmployees: (companyId) => {
    set((state) => {
      // Must NOT select employees who are under 18, have duplicate identity, or have blocking errors!
      const validEmpIds = state.employees
        .filter(
          (e) =>
            e.companyId === companyId &&
            e.validationStatus !== "UNDER_18" &&
            e.validationStatus !== "DUPLICATE_IDENTITY" &&
            e.age >= 18
        )
        .map((e) => e.id);

      return {
        selectedEmployeeIds: validEmpIds,
      };
    });
  },

  clearSelection: () => {
    set({ selectedEmployeeIds: [] });
  },

  markEmployeesAsPrinted: (ids) => {
    set((state) => {
      const updatedEmployees = state.employees.map((e) =>
        ids.includes(e.id) ? { ...e, printStatus: "PRINTED" as const } : e
      );

      // Recalculate printed counts for affected companies
      const companyIds = new Set(
        state.employees.filter((e) => ids.includes(e.id)).map((e) => e.companyId)
      );

      const updatedCompanies = state.companies.map((c) => {
        if (companyIds.has(c.id)) {
          const compEmployees = updatedEmployees.filter((e) => e.companyId === c.id);
          const printedCount = compEmployees.filter((e) => e.printStatus === "PRINTED").length;
          return { ...c, printedCount };
        }
        return c;
      });

      return {
        employees: updatedEmployees,
        companies: updatedCompanies,
      };
    });
  },
}));
