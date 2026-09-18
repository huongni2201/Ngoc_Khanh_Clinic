export interface ClinicRoom {
  code: string;
  name: string;
  department: string;
  floor: string;
  doctorInCharge?: string;
  description: string;
}

export const CLINIC_ROOMS: Record<string, ClinicRoom> = {
  "P-203": {
    code: "P.203",
    name: "Phòng Khám Nội Tổng Quát",
    department: "Khoa Nội",
    floor: "Tầng 2",
    doctorInCharge: "BS. Lê Minh (CKI)",
    description: "Khám lâm sàng, chẩn đoán ban đầu và kết luận đợt khám",
  },
  "P-202": {
    code: "P.202",
    name: "Phòng Xét Nghiệm Trung Tâm",
    department: "Khoa Xét nghiệm",
    floor: "Tầng 2",
    doctorInCharge: "CNXN. Trần Thu Hà",
    description: "Huyết học, Hóa sinh, Miễn dịch, Nước tiểu (máy Sysmex XN-550 / AU480)",
  },
  "P-208": {
    code: "P.208",
    name: "Phòng Thăm Dò Chức Năng & Điện Tim",
    department: "Khoa Thăm dò chức năng",
    floor: "Tầng 2",
    doctorInCharge: "KTV. Vũ Tuấn",
    description: "Đo điện tâm đồ thông thường ECG 12 cần, lưu huyết não",
  },
  "P-105": {
    code: "P.105",
    name: "Phòng Siêu Âm 01",
    department: "Khoa Chẩn đoán hình ảnh",
    floor: "Tầng 1",
    doctorInCharge: "BS. Hoàng Ngọc (CK CĐHA)",
    description: "Siêu âm màu Doppler tim mạch, ổ bụng tổng quát, tuyến giáp",
  },
  "CASHIER-T1": {
    code: "QUẦY THU NGÂN",
    name: "Quầy Thu Ngân & Tiếp Đón Trung Tâm",
    department: "Phòng Tài chính Kế toán",
    floor: "Tầng 1 (Sảnh chính)",
    doctorInCharge: "Thu ngân viên: Nguyễn Thị Mai",
    description: "Thanh toán viện phí, quét mã VietQR động, đóng mộc hóa đơn",
  },
};
