import * as React from "react";
import { AdultHealthCheckPrintData } from "@/entities/health-check/model/health-check.types";

interface PageProps {
  data: AdultHealthCheckPrintData;
}

export function HealthCheckFormPage4({ data }: PageProps) {
  return (
    <div className="print-page-sheet flex flex-col justify-between">
      <div>
        {/* 6. TAI - MŨI - HỌNG & 7. RĂNG - HÀM - MẶT */}
        <div className="font-bold text-[11pt] uppercase border-b border-black pb-1 mb-2">
          II. KHÁM LÂM SÀNG (TIẾP THEO)
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          {/* Tai Mũi Họng */}
          <div className="border border-black p-2">
            <div className="font-bold text-[10pt] mb-1">6. Tai - Mũi - Họng:</div>
            <div className="text-[9.5pt] space-y-1 mb-2">
              <div>
                <b>Thính lực: </b>Tai phải: ...... m • Tai trái: ...... m
              </div>
              <div>Mũi, vòm họng: Bình thường, thông thoáng.</div>
              <div>Họng, thanh quản: Niêm mạc hồng, không viêm hạt.</div>
            </div>
            <div className="flex justify-between items-center text-[9.5pt] pt-1 border-t border-slate-200">
              <span>Phân loại: Loại [  ]</span>
              <span className="italic text-[9pt]">BS TMH ký: ...............</span>
            </div>
          </div>

          {/* Răng Hàm Mặt */}
          <div className="border border-black p-2">
            <div className="font-bold text-[10pt] mb-1">7. Răng - Hàm - Mặt:</div>
            <div className="text-[9.5pt] space-y-1 mb-2">
              <div>Hàm trên: Đủ răng, không sâu răng hoạt tính.</div>
              <div>Hàm dưới: Khớp cắn chuẩn, không viêm lợi.</div>
              <div>Bệnh răng miệng khác: Không.</div>
            </div>
            <div className="flex justify-between items-center text-[9.5pt] pt-1 border-t border-slate-200">
              <span>Phân loại: Loại [  ]</span>
              <span className="italic text-[9pt]">BS RHM ký: ...............</span>
            </div>
          </div>
        </div>

        {/* SECTION III: CẬN LÂM SÀNG */}
        <div>
          <div className="font-bold text-[11pt] uppercase border-t-2 border-black pt-1.5 mb-2">
            III. KHÁM CẬN LÂM SÀNG
          </div>

          {/* 1. XÉT NGHIỆM MÁU */}
          <div className="mb-2">
            <div className="font-bold text-[10.5pt] mb-1">
              1. Xét nghiệm máu:
            </div>
            <table className="form-table">
              <thead>
                <tr>
                  <th className="w-10">STT</th>
                  <th className="w-48">Tên chỉ số / Xét nghiệm</th>
                  <th>Kết quả xét nghiệm</th>
                  <th className="w-36">Chỉ số bình thường</th>
                  <th className="w-28">Đánh giá</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="text-center">a</td>
                  <td className="font-semibold">Tổng phân tích tế bào máu (CTM)</td>
                  <td>WBC: ............ RBC: ............ HGB: ............ PLT: ............</td>
                  <td className="text-[9pt]">Trong giới hạn chuẩn</td>
                  <td className="text-center">Bình thường</td>
                </tr>
                <tr>
                  <td className="text-center">b</td>
                  <td className="font-semibold">Đường máu (Glucose)</td>
                  <td>................................................ mmol/L</td>
                  <td className="text-[9pt]">3.9 - 6.4 mmol/L</td>
                  <td className="text-center"></td>
                </tr>
                <tr>
                  <td className="text-center">c</td>
                  <td className="font-semibold">Chức năng thận (Ure, Creatinin)</td>
                  <td>Ure: ............ mmol/L • Creatinin: ............ µmol/L</td>
                  <td className="text-[9pt]">Ure: 2.5-7.5 • Cre: 53-106</td>
                  <td className="text-center"></td>
                </tr>
                <tr>
                  <td className="text-center">d</td>
                  <td className="font-semibold">Men gan (AST / ALT)</td>
                  <td>AST (GOT): ............ U/L • ALT (GPT): ............ U/L</td>
                  <td className="text-[9pt]">AST &lt; 40 U/L • ALT &lt; 40 U/L</td>
                  <td className="text-center"></td>
                </tr>
                <tr>
                  <td className="text-center">e</td>
                  <td className="font-semibold">Bộ mỡ máu (Lipid toàn phần)</td>
                  <td>Cholesterol: ............ • Triglycerid: ............ mmol/L</td>
                  <td className="text-[9pt]">Chol &lt; 5.2 • Tri &lt; 1.88</td>
                  <td className="text-center"></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 2. XÉT NGHIỆM NƯỚC TIỂU */}
          <div className="mb-2">
            <div className="font-bold text-[10.5pt] mb-1">
              2. Xét nghiệm nước tiểu:
            </div>
            <table className="form-table">
              <tbody>
                <tr>
                  <td className="w-56 font-semibold">Tổng phân tích nước tiểu 10 thông số:</td>
                  <td>
                    Đường (GLU): Âm tính (-) • Đạm (PRO): Âm tính (-) • Bạch cầu (LEU): Âm tính (-)
                  </td>
                  <td className="w-32 text-center text-[9.5pt]">
                    [  ] Bình thường
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 3. CHẨN ĐOÁN HÌNH ẢNH & THĂM DÒ CHỨC NĂNG */}
          <div>
            <div className="font-bold text-[10.5pt] mb-1">
              3. Chẩn đoán hình ảnh & Thăm dò chức năng:
            </div>
            <table className="form-table">
              <thead>
                <tr>
                  <th className="w-10">STT</th>
                  <th className="w-48">Phương pháp thực hiện</th>
                  <th>Mô tả kết luận hình ảnh</th>
                  <th className="w-40">Bác sĩ chuyên khoa ký</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="text-center">a</td>
                  <td className="font-semibold">X-quang tim phổi thẳng KTS</td>
                  <td>Bóng tim không to. Hai phế trường sáng đều, không thấy tổn thương thâm nhiễm khu trú.</td>
                  <td className="h-12"></td>
                </tr>
                <tr>
                  <td className="text-center">b</td>
                  <td className="font-semibold">Siêu âm ổ bụng tổng quát</td>
                  <td>Các tạng trong ổ bụng: Gan, mật, tụy, lách, thận 2 bên cấu trúc âm đồng nhất, trong giới hạn bình thường.</td>
                  <td className="h-12"></td>
                </tr>
                <tr>
                  <td className="text-center">c</td>
                  <td className="font-semibold">Điện tâm đồ thông thường (ECG)</td>
                  <td>Nhịp xoang đều, tần số ...... ck/phút. Chưa thấy hình ảnh thiếu máu cục bộ cơ tim.</td>
                  <td className="h-12"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Page Footer */}
      <div className="text-right text-[9pt] italic pt-2 border-t border-slate-300">
        Trang 4/5 — Mẫu số 03 (Ban hành kèm Thông tư BYT)
      </div>
    </div>
  );
}
