import {
  PatientResultPackage,
  PatientResultAccessLink,
  AccessLinkStatus,
  PatientResultAccessEvent,
} from "../model/patient-result.types";
import {
  sha256,
  generateSecureToken,
  generatePatientPin,
  SECURITY_CONFIG,
  saveResultSession,
  verifyResultSession,
} from "../lib/security";

let storedPackages: Record<string, PatientResultPackage> = {};
let storedLinks: Record<string, PatientResultAccessLink> = {};
let storedEvents: PatientResultAccessEvent[] = [];

const LINKS_STORAGE_KEY = "nk_patient_result_links";
const PACKAGES_STORAGE_KEY = "nk_patient_result_packages";

function getStoredLinks(): Record<string, PatientResultAccessLink> {
  if (typeof window === "undefined" || !window.localStorage) return storedLinks;
  try {
    const raw = window.localStorage.getItem(LINKS_STORAGE_KEY);
    if (raw) {
      storedLinks = { ...JSON.parse(raw), ...storedLinks };
    }
  } catch {}
  return storedLinks;
}

function persistStoredLinks() {
  if (typeof window === "undefined" || !window.localStorage) return;
  try {
    window.localStorage.setItem(LINKS_STORAGE_KEY, JSON.stringify(storedLinks));
  } catch {}
}

/**
 * Standard Demo Result Package Generator for Nguyễn Văn An (ENC-260919-041)
 * Strips all internal notes and keeps strictly patient-facing FINAL items.
 */
export function buildStandardResultPackage(encounterCode = "ENC-260919-041"): PatientResultPackage {
  return {
    id: `pkg_${encounterCode}`,
    encounterCode,
    patientName: "Nguyễn Văn An",
    patientCode: "PT-001842",
    patientBirthYear: 1981,
    patientGender: "Nam",
    encounterDate: "19/09/2026",
    doctorName: "BS. CKI Lê Minh",
    roomCode: "P.203",
    departmentName: "Khoa Nội Tổng Quát",

    finalDiagnosis: {
      code: "I10 - E78.2",
      name: "Tăng huyết áp vô căn (giai đoạn 2) / Rối loạn lipid máu hỗn hợp",
    },
    conclusion:
      "Bệnh nhân có tăng huyết áp độ 2 chưa kiểm soát tối ưu bằng phác đồ đơn trị trước đây, kèm rối loạn lipid máu và có triệu chứng chóng mặt, đau đầu vùng chẩm. Đã chỉ định cận lâm sàng đánh giá toàn diện, chức năng gan thận bình thường, điện tâm đồ có dấu hiệu phì đại thất trái nhẹ. Điều chỉnh bổ sung thuốc phối hợp hạ áp và statin kiểm soát mỡ máu.",
    doctorAdvice:
      "- Uống thuốc đúng giờ mỗi sáng sau ăn, không tự ý ngưng thuốc đột ngột.\n- Chế độ ăn giảm muối (< 5g muối/ngày), kiêng rượu bia, hạn chế mỡ động vật.\n- Tập thể dục đi bộ nhẹ nhàng 30 phút mỗi ngày.\n- Tự đo huyết áp tại nhà 2 lần/ngày (sáng, tối) và ghi vào sổ theo dõi.\n- Tái khám đúng hẹn hoặc khám lại ngay nếu huyết áp > 160/100 mmHg kèm đau ngực, khó thở.",

    labResults: [
      {
        serviceCode: "LAB-CTM",
        serviceName: "Tổng phân tích tế bào máu ngoại vi (24 thông số - Máy Sysmex XN-550)",
        department: "Khoa Xét nghiệm - P.202",
        verifiedAt: "19/09/2026 09:15",
        verifiedBy: "CNXN. Trần Thu Hà (Trưởng Lab)",
        status: "FINAL",
        items: [
          { name: "Số lượng bạch cầu (WBC)", value: "12.8", unit: "G/L", referenceRange: "4.0 - 10.0", isAbnormal: true },
          { name: "Số lượng hồng cầu (RBC)", value: "4.65", unit: "T/L", referenceRange: "3.8 - 5.8", isAbnormal: false },
          { name: "Huyết sắc tố (Hemoglobin)", value: "145", unit: "g/L", referenceRange: "120 - 165", isAbnormal: false },
          { name: "Thể tích khối hồng cầu (HCT)", value: "43.2", unit: "%", referenceRange: "35.0 - 50.0", isAbnormal: false },
          { name: "Số lượng tiểu cầu (PLT)", value: "245", unit: "G/L", referenceRange: "150 - 450", isAbnormal: false },
          { name: "Đoạn trung tính (NEUT%)", value: "72.5", unit: "%", referenceRange: "43.0 - 75.0", isAbnormal: false },
        ],
      },
      {
        serviceCode: "LAB-BIO-01",
        serviceName: "Sinh hóa máu: Định lượng Glucose & Bộ mỡ máu (Lipid Panel)",
        department: "Khoa Xét nghiệm - P.202",
        verifiedAt: "19/09/2026 09:20",
        verifiedBy: "CNXN. Trần Thu Hà (Trưởng Lab)",
        status: "FINAL",
        items: [
          { name: "Đường huyết đói (Glucose)", value: "5.4", unit: "mmol/L", referenceRange: "3.9 - 6.4", isAbnormal: false },
          { name: "Cholesterol toàn phần", value: "6.2", unit: "mmol/L", referenceRange: "3.9 - 5.2", isAbnormal: true },
          { name: "Triglyceride", value: "2.8", unit: "mmol/L", referenceRange: "0.4 - 1.88", isAbnormal: true },
          { name: "HDL-Cholesterol", value: "1.1", unit: "mmol/L", referenceRange: "0.9 - 1.6", isAbnormal: false },
          { name: "LDL-Cholesterol", value: "4.1", unit: "mmol/L", referenceRange: "< 3.4", isAbnormal: true },
          { name: "Creatinine máu", value: "78", unit: "µmol/L", referenceRange: "62 - 106", isAbnormal: false },
        ],
      },
    ],

    imagingReports: [
      {
        serviceCode: "US-ABD-01",
        serviceName: "Siêu âm màu ổ bụng tổng quát (Máy GE Logiq P9)",
        technique: "Siêu âm đầu dò Convex đa tần số 3.5 - 5.0 MHz",
        roomLocation: "Phòng Siêu âm P.105 (Tầng 1)",
        findings:
          "Gan: Kích thước không to, nhu mô tăng âm lan tỏa mức độ nhẹ, bờ đều, không thấy tổn thương khu trú. Tĩnh mạch cửa không giãn. Túi mật: Thành mỏng, lòng sạch không có sỏi. Đường mật trong và ngoài gan không giãn. Tụy, lách: Hình ảnh bình thường. Hai thận: Kích thước bình thường, nhu mô dày đều, ranh giới vỏ tủy rõ, không có sỏi, không ứ nước. Bàng quang: Thành đều, lòng sạch.",
        conclusion: "Hình ảnh Gan thoái hóa mỡ mức độ nhẹ (Độ 1). Hiện tại chưa thấy bất thường khu trú khác trong ổ bụng.",
        imageUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80",
        verifiedAt: "19/09/2026 09:30",
        verifiedBy: "BS. CKI Phạm Thị Mai (Bác sĩ CĐHA)",
        status: "FINAL",
      },
      {
        serviceCode: "ECG-12L",
        serviceName: "Điện tâm đồ 12 chuyển đạo thông thường (Máy Fukuda Denshi)",
        technique: "Ghi 12 chuyển đạo tiêu chuẩn ở tư thế nằm nghỉ",
        roomLocation: "Phòng Điện tim P.208 (Tầng 2)",
        findings:
          "Nhịp xoang đều, tần số 78 chu kỳ/phút. Trục điện tim: Trục trung gian. Sóng P bình thường. Khoảng PR 0.16s. Phức bộ QRS: Biên độ RV5 + SV1 = 36 mm (chỉ số Sokolow-Lyon > 35 mm). Sóng T dương ở các chuyển đạo trước tim.",
        conclusion: "Nhịp xoang đều 78 ck/phút. Dấu hiệu phì đại thất trái theo tiêu chuẩn điện thế Sokolow-Lyon nhẹ, phù hợp với tiền sử tăng huyết áp.",
        verifiedAt: "19/09/2026 09:10",
        verifiedBy: "BS. CKI Phạm Thị Mai",
        status: "FINAL",
      },
    ],

    prescription: {
      prescriptionCode: "RX-260919-088",
      issuedAt: "19/09/2026 09:45",
      doctorName: "BS. CKI Lê Minh",
      licenseNumber: "CCHN-001928/BYT",
      advice: "Uống thuốc sau ăn sáng, duy trì liên tục trong 30 ngày. Không tự ý ngưng thuốc.",
      status: "ISSUED",
      items: [
        {
          medicationName: "Amlodipine 5mg (Amlor)",
          dosage: "1 viên / ngày",
          frequency: "Uống 1 viên vào lúc 08h00 sáng sau ăn",
          duration: "30 ngày (Số lượng: 30 viên)",
          instructions: "Hạ huyết áp chẹn kênh canxi",
        },
        {
          medicationName: "Atorvastatin 20mg (Lipitor)",
          dosage: "1 viên / ngày",
          frequency: "Uống 1 viên vào buổi tối trước khi đi ngủ",
          duration: "30 ngày (Số lượng: 30 viên)",
          instructions: "Hạ mỡ máu, ổn định mảng xơ vữa",
        },
      ],
    },

    followUpAppointment: {
      appointmentCode: "APT-261017-005",
      scheduledDate: "17/10/2026 (Thứ Bảy)",
      scheduledTime: "08:30 Sáng",
      doctorName: "BS. CKI Lê Minh",
      roomCode: "P.203",
      note: "Khám lại đánh giá đáp ứng hạ áp và xét nghiệm lại mỡ máu sau 4 tuần.",
    },

    attachments: [
      {
        id: "att-01",
        title: "Bản PDF Phiếu Kết Quả Khám Tổng Quát (Ký số Chuyên viên)",
        fileType: "PDF",
        fileSize: "1.4 MB",
        downloadUrl: "#",
      },
      {
        id: "att-02",
        title: "Phiếu Điện Tâm Đồ 12 Chuyển Đạo Scan Bản Gốc",
        fileType: "PDF",
        fileSize: "850 KB",
        downloadUrl: "#",
      },
    ],

    generatedAt: "19/09/2026 09:50",
  };
}

export class PatientResultService {
  /**
   * Generates or fetches the patient result package for an encounter
   */
  static getOrCreatePackage(encounterCode: string): PatientResultPackage {
    if (!storedPackages[encounterCode]) {
      storedPackages[encounterCode] = buildStandardResultPackage(encounterCode);
    }
    return storedPackages[encounterCode];
  }

  /**
   * Issues a new secure access link for an encounter
   */
  static async issueAccessLink(
    encounterCode: string,
    options: {
      recipientPhone: string;
      recipientEmail?: string;
      channel: "SMS" | "ZALO" | "EMAIL";
    }
  ): Promise<{
    accessLink: PatientResultAccessLink;
    plainPin: string;
    rawToken: string;
    accessUrl: string;
  }> {
    const pkg = this.getOrCreatePackage(encounterCode);
    const rawToken = generateSecureToken();
    const plainPin = generatePatientPin();

    const [tokenHash, passwordHash] = await Promise.all([
      sha256(rawToken),
      sha256(plainPin),
    ]);

    const expiresDate = new Date();
    expiresDate.setDate(expiresDate.getDate() + SECURITY_CONFIG.EXPIRATION_DAYS);

    const accessLink: PatientResultAccessLink = {
      id: `link_${Date.now()}`,
      resultPackageId: pkg.id,
      encounterCode,
      token: rawToken,
      tokenHash,
      passwordHash,
      recipientPhone: options.recipientPhone,
      recipientEmail: options.recipientEmail,
      channel: options.channel,
      createdAt: new Date().toISOString(),
      expiresAt: expiresDate.toISOString(),
      failedAttempts: 0,
      status: "ACTIVE",
    };

    storedLinks[rawToken] = accessLink;
    persistStoredLinks();

    // Log access event (no plain PIN in logs!)
    storedEvents.push({
      id: `evt_${Date.now()}`,
      accessLinkId: accessLink.id,
      eventType: "LINK_ISSUED",
      channel: options.channel,
      recipientMasked: options.recipientPhone.slice(0, 3) + "****" + options.recipientPhone.slice(-3),
      timestamp: new Date().toISOString(),
    });

    const accessUrl = typeof window !== "undefined"
      ? `${window.location.origin}/r/${rawToken}`
      : `/r/${rawToken}`;

    return {
      accessLink,
      plainPin,
      rawToken,
      accessUrl,
    };
  }

  /**
   * Finds an access link by its raw URL token
   */
  static getLinkByToken(token: string): PatientResultAccessLink | null {
    const allLinks = getStoredLinks();
    if (!allLinks[token]) {
      // Seed default demo link if user accesses demo token or test token
      if (token === "res_demo_pt001842" || token.startsWith("res_")) {
        const pkg = this.getOrCreatePackage("ENC-260919-041");
        const expiresDate = new Date();
        expiresDate.setDate(expiresDate.getDate() + SECURITY_CONFIG.EXPIRATION_DAYS);

        storedLinks[token] = {
          id: `link_demo_${token}`,
          resultPackageId: pkg.id,
          encounterCode: "ENC-260919-041",
          token,
          tokenHash: "demo_hash",
          passwordHash: "demo_pin_184201",
          recipientPhone: "0912345678",
          recipientEmail: "nguyenvanan.hn@gmail.com",
          channel: "ZALO",
          createdAt: new Date().toISOString(),
          expiresAt: expiresDate.toISOString(),
          failedAttempts: 0,
          status: "ACTIVE",
        };
        persistStoredLinks();
      } else {
        return null;
      }
    }
    return storedLinks[token];
  }

  /**
   * Gets any active link for an encounter code
   */
  static getLinkForEncounter(encounterCode: string): PatientResultAccessLink | null {
    const allLinks = getStoredLinks();
    const found = Object.values(allLinks).find(
      (l) => l.encounterCode === encounterCode && l.status === "ACTIVE"
    );
    return found || null;
  }

  /**
   * Verifies PIN attempt with failed attempt counting & lockout
   */
  static async verifyPin(
    token: string,
    pinAttempt: string
  ): Promise<{
    success: boolean;
    sessionToken?: string;
    error?: string;
    remainingAttempts?: number;
    status: AccessLinkStatus;
  }> {
    const link = storedLinks[token];

    if (!link) {
      return {
        success: false,
        error: "Liên kết truy cập kết quả không tồn tại hoặc đã bị hủy.",
        status: "REVOKED",
      };
    }

    if (link.status === "REVOKED") {
      return {
        success: false,
        error: "Liên kết này đã bị thu hồi bởi phòng khám vì lý do an toàn bảo mật.",
        status: "REVOKED",
      };
    }

    // Check expiration
    if (link.status === "EXPIRED" || new Date(link.expiresAt).getTime() < Date.now()) {
      link.status = "EXPIRED";
      return {
        success: false,
        error: "Liên kết truy cập đã hết hạn (thời hạn 30 ngày kể từ ngày cấp).",
        status: "EXPIRED",
      };
    }

    // Check lockout
    if (link.failedAttempts >= SECURITY_CONFIG.MAX_FAILED_ATTEMPTS || link.status === "LOCKED") {
      link.status = "LOCKED";
      return {
        success: false,
        error: "Liên kết đã bị tạm khóa do nhập sai mã PIN quá 5 lần. Vui lòng liên hệ phòng khám để cấp lại.",
        remainingAttempts: 0,
        status: "LOCKED",
      };
    }

    const hashedAttempt = await sha256(pinAttempt.trim());
    const isMatch =
      hashedAttempt === link.passwordHash ||
      (link.passwordHash === "demo_pin_184201" && pinAttempt.trim() === "184201");

    if (isMatch) {
      // Success: Reset failed count & create short-lived session
      link.failedAttempts = 0;
      link.lastAccessedAt = new Date().toISOString();
      persistStoredLinks();

      const sessionToken = saveResultSession(token, link.resultPackageId);

      storedEvents.push({
        id: `evt_${Date.now()}`,
        accessLinkId: link.id,
        eventType: "PASSWORD_SUCCESS",
        timestamp: new Date().toISOString(),
      });

      return {
        success: true,
        sessionToken,
        status: "ACTIVE",
      };
    }

    // Failure: Increment failed attempts
    link.failedAttempts += 1;
    const remaining = Math.max(0, SECURITY_CONFIG.MAX_FAILED_ATTEMPTS - link.failedAttempts);

    if (link.failedAttempts >= SECURITY_CONFIG.MAX_FAILED_ATTEMPTS) {
      link.status = "LOCKED";
      persistStoredLinks();
      storedEvents.push({
        id: `evt_${Date.now()}`,
        accessLinkId: link.id,
        eventType: "LINK_LOCKED",
        timestamp: new Date().toISOString(),
      });
      return {
        success: false,
        error: "Bạn đã nhập sai mã PIN 5 lần. Liên kết đã bị khóa để bảo vệ hồ sơ bệnh án.",
        remainingAttempts: 0,
        status: "LOCKED",
      };
    }

    persistStoredLinks();
    storedEvents.push({
      id: `evt_${Date.now()}`,
      accessLinkId: link.id,
      eventType: "PASSWORD_FAILED",
      timestamp: new Date().toISOString(),
    });

    return {
      success: false,
      error: `Mã PIN bảo vệ không chính xác. Bạn còn ${remaining} lần thử lại.`,
      remainingAttempts: remaining,
      status: "ACTIVE",
    };
  }

  /**
   * Retrieves result package if session is verified
   */
  static getPackageWithSession(token: string): PatientResultPackage | null {
    const isSessionValid = verifyResultSession(token);
    if (!isSessionValid) return null;

    const link = storedLinks[token];
    if (!link) return null;

    return this.getOrCreatePackage(link.encounterCode);
  }

  /**
   * Doctor / Staff action: Revoke access link
   */
  static revokeLink(token: string): boolean {
    const link = storedLinks[token];
    if (!link) return false;

    link.status = "REVOKED";
    link.revokedAt = new Date().toISOString();
    persistStoredLinks();

    storedEvents.push({
      id: `evt_${Date.now()}`,
      accessLinkId: link.id,
      eventType: "LINK_REVOKED",
      timestamp: new Date().toISOString(),
    });

    return true;
  }

  /**
   * Doctor / Staff action: Reset PIN password
   */
  static async resetPassword(token: string): Promise<{ success: boolean; newPin?: string }> {
    const link = storedLinks[token];
    if (!link) return { success: false };

    const newPin = generatePatientPin();
    link.passwordHash = await sha256(newPin);
    link.failedAttempts = 0;
    if (link.status === "LOCKED") {
      link.status = "ACTIVE";
    }
    persistStoredLinks();

    storedEvents.push({
      id: `evt_${Date.now()}`,
      accessLinkId: link.id,
      eventType: "PASSWORD_RESET",
      timestamp: new Date().toISOString(),
    });

    return {
      success: true,
      newPin,
    };
  }
}
