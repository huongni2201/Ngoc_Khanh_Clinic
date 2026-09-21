export interface PreviousResultItem {
  id: string;
  category: "LAB" | "ULTRASOUND" | "XRAY" | "ECG";
  testName: string;
  date: string;
  doctor: string;
  summary: string;
  isAbnormal: boolean;
  flag?: string;
  details?: string;
}

export interface PreviousPrescriptionItem {
  id: string;
  rxCode: string;
  date: string;
  doctor: string;
  diagnosis: string;
  medications: Array<{
    name: string;
    dosage: string;
    quantity: string;
    usage: string;
  }>;
}

export interface PatientDocumentItem {
  id: string;
  title: string;
  type: "PDF" | "SCAN" | "IMAGE";
  uploadedAt: string;
  size: string;
  source: string;
}

export interface MockPatient {
  id: string;
  patientCode: string;
  fullName: string;
  dateOfBirth: string;
  age: number;
  gender: "MALE" | "FEMALE" | "OTHER";
  phone: string;
  identityCard: string;
  address: string;
  allergies: Array<{ substance: string; severity: "LOW" | "MODERATE" | "SEVERE"; note: string }>;
  chronicConditions: string[];
  regularMedications: string[];
  latestVitals: {
    bloodPressure: string;
    heartRate: number;
    glucose: number;
    cholesterol: number;
    bmi: number;
    spo2: number;
    temperature?: number;
    recordedAt: string;
  };
  recentEncounters: Array<{
    id?: string;
    date: string;
    department: string;
    doctor: string;
    diagnosis: string;
    keyResults: string;
    prescription: string;
  }>;
  previousDiagnoses: string[];
  previousResults: PreviousResultItem[];
  previousPrescriptions: PreviousPrescriptionItem[];
  documents: PatientDocumentItem[];
}

export const MOCK_PATIENTS: MockPatient[] = [
  {
    id: "p1",
    patientCode: "PT-001842",
    fullName: "Nguyễn Văn An",
    dateOfBirth: "1981-04-12",
    age: 45,
    gender: "MALE",
    phone: "0912 345 678",
    identityCard: "001081008892",
    address: "Số 18, Ngõ 42, Cầu Giấy, Hà Nội",
    allergies: [
      {
        substance: "Penicillin",
        severity: "SEVERE",
        note: "Phản vệ độ 2 năm 2021 (mề đay toàn thân, khó thở thanh quản). Chống chỉ định tuyệt đối nhóm Beta-lactam!",
      },
    ],
    chronicConditions: [
      "Tăng huyết áp nguyên phát (I10) - 3 năm",
      "Rối loạn lipid máu hỗn hợp (E78.2) - 1 năm",
    ],
    regularMedications: [
      "Amlodipine 5mg (1 viên sáng sau ăn)",
      "Atorvastatin 10mg (1 viên tối sau ăn)",
    ],
    latestVitals: {
      bloodPressure: "148/92 mmHg",
      heartRate: 84,
      glucose: 5.8,
      cholesterol: 6.2,
      bmi: 24.3,
      spo2: 98,
      temperature: 36.8,
      recordedAt: "19/09/2026 08:35",
    },
    recentEncounters: [
      {
        id: "enc-prev-01",
        date: "04/09/2026",
        department: "Khoa Tim Mạch",
        doctor: "BS. Hoàng Ngọc",
        diagnosis: "I10 — Tăng huyết áp nguyên phát giai đoạn 2",
        keyResults: "ECG: Nhịp xoang 78ck/p, dày thất trái nhẹ. Cholesterol: 6.2 mmol/L.",
        prescription: "Amlodipine 5mg x 30v, Micardis 40mg x 30v",
      },
      {
        id: "enc-prev-02",
        date: "02/06/2026",
        department: "Khám Sức Khỏe Tổng Quát",
        doctor: "BS. Lê Minh",
        diagnosis: "Z00.0 — Khám sức khỏe định kỳ doanh nghiệp",
        keyResults: "WBC 7.2 G/L, Glucose 5.4 mmol/L, Men gan AST/ALT bình thường.",
        prescription: "Vitamin tổng hợp 3B x 30v",
      },
    ],
    previousDiagnoses: [
      "I10 — Tăng huyết áp nguyên phát (04/09/2026)",
      "E78.2 — Rối loạn chuyển hóa lipid hỗn hợp (04/09/2026)",
      "Z00.0 — Khám sức khỏe định kỳ doanh nghiệp (02/06/2026)",
      "K29.0 — Viêm dạ dày trợt nông cấp tính (15/12/2025)",
    ],
    previousResults: [
      {
        id: "res-01",
        category: "ECG",
        testName: "Điện tâm đồ thông thường 12 chuyển đạo",
        date: "04/09/2026",
        doctor: "BS. Hoàng Ngọc (P.208)",
        summary: "Nhịp xoang đều 78 ck/p. Dày thất trái nhẹ Sokolow-Lyon 36mm.",
        isAbnormal: true,
        flag: "Bất thường nhẹ",
        details: "Trục tim trung gian +55 độ, chưa thấy thiếu máu cơ tim cục bộ.",
      },
      {
        id: "res-02",
        category: "LAB",
        testName: "Bộ mỡ máu Lipid toàn phần (Cholesterol, TG, HDL, LDL)",
        date: "04/09/2026",
        doctor: "KTV. Trần Thu Hà (P.202)",
        summary: "Cholesterol toàn phần: 6.2 mmol/L (↑), Triglyceride: 2.4 mmol/L (↑)",
        isAbnormal: true,
        flag: "↑ Cao",
        details: "HDL-C 1.1 mmol/L, LDL-C 4.1 mmol/L. Nguy cơ tim mạch trung bình.",
      },
      {
        id: "res-03",
        category: "ULTRASOUND",
        testName: "Siêu âm màu Doppler ổ bụng tổng quát",
        date: "02/06/2026",
        doctor: "BS. Nguyễn Văn Hùng (P.105)",
        summary: "Gan nhiễm mỡ độ 1 nhẹ. Nhu mô đồng nhất, không sỏi mật hay sỏi thận.",
        isAbnormal: true,
        flag: "Độ 1",
        details: "Tụy lách bình thường. Tuyến tiền liệt kích thước bình thường.",
      },
      {
        id: "res-04",
        category: "XRAY",
        testName: "Chụp X-quang tim phổi thẳng kỹ thuật số (KTS)",
        date: "02/06/2026",
        doctor: "KTV. Lê Quốc Bảo (P.102)",
        summary: "Bóng tim không to. Trường phổi sáng đều, góc sườn hoành sáng rõ.",
        isAbnormal: false,
        flag: "Bình thường",
      },
    ],
    previousPrescriptions: [
      {
        id: "rx-prev-01",
        rxCode: "RX-260904-009",
        date: "04/09/2026",
        doctor: "BS. Hoàng Ngọc",
        diagnosis: "I10 - Tăng huyết áp nguyên phát / Rối loạn lipid máu",
        medications: [
          { name: "Amlodipine 5mg", dosage: "5mg", quantity: "30 viên", usage: "Uống 1 viên vào lúc 08h00 sáng sau ăn" },
          { name: "Micardis 40mg (Telmisartan)", dosage: "40mg", quantity: "30 viên", usage: "Uống 1 viên vào lúc 08h00 sáng sau ăn" },
          { name: "Atorvastatin 10mg", dosage: "10mg", quantity: "30 viên", usage: "Uống 1 viên vào lúc 20h00 tối sau ăn" },
        ],
      },
      {
        id: "rx-prev-02",
        rxCode: "RX-260602-044",
        date: "02/06/2026",
        doctor: "BS. Lê Minh",
        diagnosis: "Z00.0 - Khám sức khỏe định kỳ",
        medications: [
          { name: "Vitamin tổng hợp 3B (B1, B6, B12)", dosage: "Viên nén", quantity: "60 viên", usage: "Uống 2 viên/ngày chia 2 lần" },
        ],
      },
    ],
    documents: [
      {
        id: "doc-01",
        title: "Bản sao Bệnh án đợt cấp Tăng huyết áp 2024 (BV Tim Hà Nội)",
        type: "PDF",
        uploadedAt: "10/01/2025",
        size: "2.4 MB",
        source: "Bệnh nhân cung cấp",
      },
      {
        id: "doc-02",
        title: "Phiếu ghi nhận phản vệ thuốc Penicillin độ 2 (Trung tâm Dị ứng Bạch Mai)",
        type: "SCAN",
        uploadedAt: "14/05/2021",
        size: "1.1 MB",
        source: "Hồ sơ y tế lịch sử",
      },
      {
        id: "doc-03",
        title: "Phim chụp MRI sọ não không tiêm thuốc đối quang (Chưa phát hiện u mạch)",
        type: "IMAGE",
        uploadedAt: "15/12/2025",
        size: "14.8 MB",
        source: "BV Đại học Y Hà Nội",
      },
    ],
  },
  {
    id: "p2",
    patientCode: "PT-004910",
    fullName: "Nguyễn Văn Ân",
    dateOfBirth: "1980-04-12",
    age: 46,
    gender: "MALE",
    phone: "0988 234 111",
    identityCard: "001080004512",
    address: "Tổ dân phố 5, Dịch Vọng Hậu, Cầu Giấy, Hà Nội",
    allergies: [],
    chronicConditions: ["Viêm mũi xoang dị ứng"],
    regularMedications: [],
    latestVitals: {
      bloodPressure: "125/80 mmHg",
      heartRate: 76,
      glucose: 5.1,
      cholesterol: 4.8,
      bmi: 22.8,
      spo2: 99,
      temperature: 36.6,
      recordedAt: "20/08/2026 10:15",
    },
    recentEncounters: [
      {
        id: "enc-prev-p2-01",
        date: "20/08/2026",
        department: "Tai Mũi Họng",
        doctor: "BS. Mai Hoa",
        diagnosis: "J30 — Viêm mũi dị ứng cấp",
        keyResults: "Nội soi mũi xoang: niêm mạc phù nề",
        prescription: "Telfast 180mg x 10v",
      },
    ],
    previousDiagnoses: ["J30 — Viêm mũi dị ứng cấp (20/08/2026)"],
    previousResults: [
      {
        id: "res-p2-01",
        category: "LAB",
        testName: "Tổng phân tích máu CTM",
        date: "20/08/2026",
        doctor: "KTV. Trần Thu Hà",
        summary: "Bạch cầu ái toan Eos 8.2% (↑). CTM bình thường.",
        isAbnormal: true,
        flag: "Eos ↑",
      },
    ],
    previousPrescriptions: [
      {
        id: "rx-p2-01",
        rxCode: "RX-260820-019",
        date: "20/08/2026",
        doctor: "BS. Mai Hoa",
        diagnosis: "J30 - Viêm mũi dị ứng",
        medications: [
          { name: "Telfast 180mg (Fexofenadine)", dosage: "180mg", quantity: "10 viên", usage: "Uống 1 viên tối" },
        ],
      },
    ],
    documents: [],
  },
  {
    id: "p3",
    patientCode: "PT-006201",
    fullName: "Nguyễn Văn An",
    dateOfBirth: "1991-11-02",
    age: 35,
    gender: "MALE",
    phone: "0904 011 552",
    identityCard: "001091007731",
    address: "Xuân Thủy, Cầu Giấy, Hà Nội",
    allergies: [{ substance: "Aspirin", severity: "MODERATE", note: "Đau dạ dày, kích ứng niêm mạc tiêu hóa" }],
    chronicConditions: ["Viêm da cơ địa"],
    regularMedications: [],
    latestVitals: {
      bloodPressure: "118/75 mmHg",
      heartRate: 72,
      glucose: 4.9,
      cholesterol: 4.2,
      bmi: 21.5,
      spo2: 99,
      temperature: 36.7,
      recordedAt: "11/06/2026 14:20",
    },
    recentEncounters: [
      {
        id: "enc-prev-p3-01",
        date: "11/06/2026",
        department: "Da Liễu",
        doctor: "BS. Trần Mai",
        diagnosis: "L20 — Viêm da dị ứng",
        keyResults: "Không chỉ định CLS",
        prescription: "Fucidin cream bôi ngày 2 lần",
      },
    ],
    previousDiagnoses: ["L20 — Viêm da dị ứng (11/06/2026)"],
    previousResults: [],
    previousPrescriptions: [],
    documents: [],
  },
  {
    id: "p4",
    patientCode: "PT-008912",
    fullName: "Trần Gia Huy",
    dateOfBirth: "2010-04-12",
    age: 16,
    gender: "MALE",
    phone: "0918 889 900",
    identityCard: "001210001928",
    address: "Số 12, Hoàng Hoa Thám, Ba Đình, Hà Nội",
    allergies: [],
    chronicConditions: [],
    regularMedications: [],
    latestVitals: {
      bloodPressure: "110/70 mmHg",
      heartRate: 78,
      glucose: 4.8,
      cholesterol: 4.0,
      bmi: 19.2,
      spo2: 99,
      temperature: 36.5,
      recordedAt: "15/09/2026 09:00",
    },
    recentEncounters: [],
    previousDiagnoses: [],
    previousResults: [],
    previousPrescriptions: [],
    documents: [],
  },
];

export interface MockServiceItem {
  code: string;
  name: string;
  category: "LAB" | "ECG" | "ULTRASOUND" | "XRAY" | "ENDOSCOPY" | "EXAM";
  roomCode: string;
  roomName: string;
  floor: string;
  price: number;
  preparationInstructions: string;
  sampleType?: string;
}

export const MOCK_SERVICES: MockServiceItem[] = [
  {
    code: "EXAM-001",
    name: "Khám lâm sàng Nội tổng quát (Chuyên gia)",
    category: "EXAM",
    roomCode: "P.203",
    roomName: "Phòng Khám Nội Tổng Quát",
    floor: "Tầng 2",
    price: 150000,
    preparationInstructions: "Đến đúng giờ hẹn theo số thứ tự",
  },
  {
    code: "LAB-001",
    name: "Tổng phân tích tế bào máu ngoại vi bằng máy đếm laser (CTM 18 chỉ số)",
    category: "LAB",
    roomCode: "P.202",
    roomName: "Phòng Xét Nghiệm Trung Tâm",
    floor: "Tầng 2",
    price: 85000,
    preparationInstructions: "Nhịn ăn sáng tối thiểu 6-8 tiếng, ngồi nghỉ 5 phút trước khi lấy mẫu máu",
    sampleType: "Máu toàn phần EDTA (Ống nắp tím)",
  },
  {
    code: "LAB-008",
    name: "Định lượng Glucose máu tĩnh mạch (Hóa sinh máu)",
    category: "LAB",
    roomCode: "P.202",
    roomName: "Phòng Xét Nghiệm Trung Tâm",
    floor: "Tầng 2",
    price: 45000,
    preparationInstructions: "Nhịn ăn từ 22h00 tối hôm trước, có thể uống một ít nước lọc",
    sampleType: "Huyết tương chống đông Fluoride (Ống nắp xám)",
  },
  {
    code: "ECG-001",
    name: "Điện tâm đồ thông thường (ECG 12 chuyển đạo tiêu chuẩn)",
    category: "ECG",
    roomCode: "P.208",
    roomName: "Phòng Thăm Dò Chức Năng & Điện Tim",
    floor: "Tầng 2",
    price: 120000,
    preparationInstructions: "Nằm nghỉ ngơi thả lỏng 5 phút, tháo bỏ đồng hồ, điện thoại và trang sức kim loại",
  },
  {
    code: "US-001",
    name: "Siêu âm màu Doppler ổ bụng tổng quát (Gan, Mật, Tụy, Lách, Thận, Tiền liệt tuyến)",
    category: "ULTRASOUND",
    roomCode: "P.105",
    roomName: "Phòng Siêu Âm 01",
    floor: "Tầng 1",
    price: 220000,
    preparationInstructions: "Nhịn ăn 4 tiếng trước khi khám, uống nước và nhịn tiểu để bàng quang căng",
  },
  {
    code: "US-002",
    name: "Siêu âm tim và Doppler mạch máu qua thành ngực",
    category: "ULTRASOUND",
    roomCode: "P.205",
    roomName: "Phòng Siêu Âm Tim Mạch",
    floor: "Tầng 2",
    price: 350000,
    preparationInstructions: "Nằm nghiêng trái, thư giãn tinh thần, cởi áo ngực khi thực hiện",
  },
  {
    code: "XRAY-001",
    name: "Chụp X-Quang tim phổi thẳng kỹ thuật số (KTS)",
    category: "XRAY",
    roomCode: "P.102",
    roomName: "Phòng X-Quang Kỹ Thuật Số",
    floor: "Tầng 1",
    price: 150000,
    preparationInstructions: "Cởi áo trên, tháo vòng cổ kim loại, hít sâu nín thở theo hiệu lệnh của kỹ thuật viên",
  },
  {
    code: "LAB-015",
    name: "Định lượng Men gan AST & ALT (Đánh giá tổn thương tế bào gan)",
    category: "LAB",
    roomCode: "P.202",
    roomName: "Phòng Xét Nghiệm Trung Tâm",
    floor: "Tầng 2",
    price: 70000,
    preparationInstructions: "Nhịn ăn sáng tối thiểu 6-8 tiếng, lấy máu tĩnh mạch",
    sampleType: "Huyết thanh (Ống nắp vàng/đỏ)",
  },
  {
    code: "LAB-022",
    name: "Định lượng Ure & Creatinine máu (Đánh giá chức năng lọc cầu thận)",
    category: "LAB",
    roomCode: "P.202",
    roomName: "Phòng Xét Nghiệm Trung Tâm",
    floor: "Tầng 2",
    price: 70000,
    preparationInstructions: "Lấy máu buổi sáng, không vận động thể lực mạnh trước khi lấy mẫu",
    sampleType: "Huyết thanh (Ống nắp vàng/đỏ)",
  },
  {
    code: "LAB-030",
    name: "Bộ mỡ máu Lipid toàn phần (Cholesterol, Triglycerid, HDL-C, LDL-C)",
    category: "LAB",
    roomCode: "P.202",
    roomName: "Phòng Xét Nghiệm Trung Tâm",
    floor: "Tầng 2",
    price: 140000,
    preparationInstructions: "Nhịn ăn tối thiểu 10-12 tiếng trước khi lấy mẫu máu",
    sampleType: "Huyết thanh (Ống nắp vàng/đỏ)",
  },
  {
    code: "ENDO-001",
    name: "Nội soi Tai Mũi Họng ống mềm độ phân giải cao",
    category: "ENDOSCOPY",
    roomCode: "P.206",
    roomName: "Phòng Nội Soi Tai Mũi Họng",
    floor: "Tầng 2",
    price: 200000,
    preparationInstructions: "Hợp tác theo hiệu lệnh của bác sĩ chuyên khoa",
  },
];

export interface MockEncounter {
  id: string;
  encounterCode: string;
  queueNumber?: string;
  patientId: string;
  patientCode: string;
  patientName: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  age: number;
  dob: string;
  registeredAt: string;
  status:
    | "IN_PROGRESS"
    | "WAITING_FOR_EXAM"
    | "IN_EXAM"
    | "ORDERED"
    | "DIAGNOSTIC_IN_PROGRESS"
    | "PARTIAL_RESULTS"
    | "RESULTS_COMPLETE"
    | "WAITING_FOR_CONCLUSION"
    | "IN_CONCLUSION"
    | "PRESCRIPTION_READY"
    | "COMPLETED";
  chiefComplaint: string;
  clinicalNotes: string;
  icdCode: string;
  icdName: string;
  roomCode: string;
  doctorName: string;
  orders: Array<{
    round: number;
    serviceCode: string;
    serviceName: string;
    roomCode: string;
    roomName: string;
    price: number;
    serviceRequestStatus: "ORDERED" | "IN_PROGRESS" | "COMPLETED" | "CANCELED";
    paymentAuthorizationStatus: "NOT_REQUIRED" | "PENDING" | "AUTHORIZED" | "WAIVED" | "REVOKED";
  }>;
  invoice: {
    invoiceCode: string;
    totalAmount: number;
    status: "UNPAID" | "PAID";
    paymentMethod?: "CASH" | "VIETQR" | "CARD";
    vietQR: {
      bankName: string;
      accountNumber: string;
      accountName: string;
      amount: number;
      transferContent: string;
      qrImageUrl: string;
    };
  };
}

export const MOCK_ACTIVE_ENCOUNTER: MockEncounter = {
  id: "enc-041",
  encounterCode: "ENC-260919-041",
  queueNumber: "",
  patientId: "p1",
  patientCode: "PT-001842",
  patientName: "Nguyễn Văn An",
  gender: "MALE",
  age: 45,
  dob: "12/04/1981",
  registeredAt: "19/09/2026 08:32",
  status: "IN_EXAM",
  chiefComplaint: "Đau đầu từng cơn vùng chẩm, chóng mặt khi đổi tư thế 3 ngày nay, đo huyết áp tại nhà 150/95 mmHg.",
  clinicalNotes: "Bệnh nhân tỉnh táo, tiếp xúc tốt. Tim đều, T1 T2 rõ, không tiếng thổi bệnh lý. Phổi thông khí đều 2 bên không rale. Bụng mềm, không điểm đau khu trú. Tiền sử tăng huyết áp đang uống Amlodipine 5mg.",
  icdCode: "R42",
  icdName: "Chóng mặt và choáng váng / TD Cơn tăng huyết áp nguyên phát (I10)",
  roomCode: "P.203",
  doctorName: "BS. Lê Minh",
  orders: [
    {
      round: 1,
      serviceCode: "LAB-001",
      serviceName: "Tổng phân tích tế bào máu ngoại vi (CTM 18 chỉ số)",
      roomCode: "P.202",
      roomName: "Phòng Xét nghiệm Tầng 2",
      price: 85000,
      serviceRequestStatus: "COMPLETED",
      paymentAuthorizationStatus: "AUTHORIZED",
    },
    {
      round: 1,
      serviceCode: "LAB-008",
      serviceName: "Định lượng Glucose máu tĩnh mạch",
      roomCode: "P.202",
      roomName: "Phòng Xét nghiệm Tầng 2",
      price: 45000,
      serviceRequestStatus: "COMPLETED",
      paymentAuthorizationStatus: "AUTHORIZED",
    },
    {
      round: 1,
      serviceCode: "ECG-001",
      serviceName: "Điện tâm đồ thông thường (ECG 12 chuyển đạo)",
      roomCode: "P.208",
      roomName: "Phòng Điện tim Tầng 2",
      price: 120000,
      serviceRequestStatus: "COMPLETED",
      paymentAuthorizationStatus: "AUTHORIZED",
    },
  ],
  invoice: {
    invoiceCode: "INV-260919-041",
    totalAmount: 250000, // 250k CLS Đợt 1
    status: "PAID",
    paymentMethod: "VIETQR",
    vietQR: {
      bankName: "MB Bank (Ngân Hàng Quân Đội)",
      accountNumber: "09123456789",
      accountName: "PHONG KHAM DA KHOA NGOC KHANH CLINICONE",
      amount: 250000,
      transferContent: "ENC-041 NGUYEN VAN AN 250000",
      qrImageUrl: "https://api.vietqr.io/image/970422-09123456789-Q41vFfP.jpg?accountName=PHONG%20KHAM%20NGOC%20KHANH&amount=250000&addInfo=ENC-041%20NGUYEN%20VAN%20AN",
    },
  },
};

export const MOCK_LAB_RESULTS = [
  {
    testGroup: "HUYẾT HỌC (HEMATOLOGY)",
    panel: "Tổng phân tích tế bào máu ngoại vi (CBC 18 Parameters)",
    specimenCode: "SPEC-260917-0881",
    specimenType: "Máu toàn phần EDTA",
    collectedAt: "17/09/2026 08:45",
    analyzer: "Sysmex XN-550 (Kết nối tự động LIS)",
    analytes: [
      { name: "Số lượng bạch cầu (WBC)", value: "12.8", unit: "G/L", refRange: "4.0 - 10.0", isAbnormal: true, flag: "↑ Cao" },
      { name: "Tỷ lệ bạch cầu trung tính (NEUT%)", value: "74.5", unit: "%", refRange: "40.0 - 70.0", isAbnormal: true, flag: "↑ Cao" },
      { name: "Số lượng hồng cầu (RBC)", value: "4.62", unit: "T/L", refRange: "4.0 - 5.5", isAbnormal: false, flag: "Bình thường" },
      { name: "Lượng huyết sắc tố (HGB)", value: "138", unit: "g/L", refRange: "120 - 165", isAbnormal: false, flag: "Bình thường" },
      { name: "Thể tích khối hồng cầu (HCT)", value: "0.41", unit: "L/L", refRange: "0.35 - 0.48", isAbnormal: false, flag: "Bình thường" },
      { name: "Số lượng tiểu cầu (PLT)", value: "245", unit: "G/L", refRange: "150 - 400", isAbnormal: false, flag: "Bình thường" },
    ],
    status: "FINAL",
    verifiedBy: "CNXN. Trần Thu Hà",
    verifiedAt: "17/09/2026 09:12",
  },
  {
    testGroup: "HÓA SINH MÁU (BIOCHEMISTRY)",
    panel: "Định lượng Glucose máu mao mạch/tĩnh mạch",
    specimenCode: "SPEC-260917-0882",
    specimenType: "Huyết tương Fluoride",
    collectedAt: "17/09/2026 08:46",
    analyzer: "Beckman Coulter AU480",
    analytes: [
      { name: "Glucose máu đói (Fasting Glucose)", value: "5.8", unit: "mmol/L", refRange: "3.9 - 6.4", isAbnormal: false, flag: "Bình thường" },
    ],
    status: "FINAL",
    verifiedBy: "CNXN. Trần Thu Hà",
    verifiedAt: "17/09/2026 09:15",
  },
];

export const MOCK_ECG_RESULT = {
  serviceName: "Điện tâm đồ thông thường (ECG 12 chuyển đạo)",
  device: "Nihon Kohden Cardiofax M (Phòng P.208)",
  technician: "KTV. Vũ Tuấn",
  heartRate: 82,
  prInterval: "160 ms",
  qrsDuration: "88 ms",
  qtQtc: "380 / 420 ms",
  axis: "+55 độ (Trục trung gian)",
  conclusion: "Nhịp xoang đều, tần số 82 chu kỳ/phút. Dày thất trái nhẹ theo chỉ số Sokolow-Lyon (36mm). Chưa thấy biến đổi đoạn ST-T thiếu máu cơ tim cục bộ cấp.",
  status: "FINAL",
  recordedAt: "17/09/2026 09:05",
};
