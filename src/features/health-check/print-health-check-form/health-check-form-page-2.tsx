import * as React from "react";
import { AdultHealthCheckPrintData } from "@/entities/health-check/model/health-check.types";

interface PageProps {
  data: AdultHealthCheckPrintData;
}

export function HealthCheckFormPage2({ data }: PageProps) {
  const isFemale = data.gender === "FEMALE";

  return (
    <div className="print-page-sheet flex flex-col justify-between">
      <div>
        {/* Continue Tiền sử bản thân */}
        <div className="mb-3">
          <div className="font-bold text-[10.5pt] mb-1">
            2. Tiền sử bản thân (tiếp theo):
          </div>
          <table className="form-table">
            <thead>
              <tr>
                <th className="w-12">STT</th>
                <th>Tên bệnh / Vấn đề sức khỏe</th>
                <th className="w-20">Có</th>
                <th className="w-20">Không</th>
                <th>Năm phát hiện / Ghi chú điều trị</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="text-center">5</td>
                <td>Hen phế quản, Bệnh phổi mạn tính</td>
                <td className="text-center">[  ]</td>
                <td className="text-center">[  ]</td>
                <td></td>
              </tr>
              <tr>
                <td className="text-center">6</td>
                <td>Động kinh, Bệnh lý thần kinh - tâm thần</td>
                <td className="text-center">[  ]</td>
                <td className="text-center">[  ]</td>
                <td></td>
              </tr>
              <tr>
                <td className="text-center">7</td>
                <td>Dị ứng (Thuốc, Kháng sinh, Hóa chất, Dị nguyên khác)</td>
                <td className="text-center">[  ]</td>
                <td className="text-center">[  ]</td>
                <td></td>
              </tr>
              <tr>
                <td className="text-center">8</td>
                <td>Tiền sử phẫu thuật ngoại khoa, chấn thương</td>
                <td className="text-center">[  ]</td>
                <td className="text-center">[  ]</td>
                <td></td>
              </tr>
            </tbody>
          </table>

          {/* Current medications */}
          <div className="mt-2 text-[10pt] leading-relaxed">
            <span className="font-bold">- Hiện tại có đang điều trị bệnh gì không? </span>
            <span>[  ] Không    [  ] Có (ghi rõ bệnh và thuốc đang dùng): ............................................................................................................</span>
          </div>

          {/* Pregnancy history for female */}
          {isFemale ? (
            <div className="mt-2 p-2 border border-slate-300 rounded text-[10pt] bg-slate-50/50">
              <span className="font-bold text-[10pt] block mb-1">
                - Tiền sử thai sản (dành riêng cho phụ nữ):
              </span>
              <div className="grid grid-cols-4 gap-2">
                <div>Số lần mang thai (Para): ...........</div>
                <div>Số lần sinh đẻ: ...........</div>
                <div>Số lần sảy/phá thai: ...........</div>
                <div>Sinh mổ: [  ] Có   [  ] Không</div>
              </div>
              <div className="mt-1">Hiện có đang mang thai hoặc cho con bú không: [  ] Không   [  ] Có</div>
            </div>
          ) : (
            <div className="mt-2 text-[10pt] text-slate-500 italic">
              - Tiền sử thai sản (chỉ áp dụng đối với người khám là nữ): Không áp dụng.
            </div>
          )}
        </div>

        {/* Declaration and Signature */}
        <div className="my-4 border border-black p-3 bg-slate-50/30 avoid-break">
          <p className="text-[10pt] italic text-justify leading-snug">
            Tôi xin cam đoan những điều tôi khai trên đây hoàn toàn đúng với sự thật và chịu trách nhiệm trước pháp luật về lời khai của mình. Nếu có điều gì gian dối làm ảnh hưởng đến kết quả khám sức khỏe, tôi hoàn toàn chịu trách nhiệm.
          </p>
          <div className="flex justify-between items-start mt-3">
            <div className="text-[10pt] italic text-slate-600">
              (Người khám ký và ghi rõ họ tên)
            </div>
            <div className="text-center leading-tight">
              <div className="text-[10pt] italic">
                Hà Nội, ngày ...... tháng ...... năm 202...
              </div>
              <div className="font-bold text-[10.5pt] uppercase mt-1">NGƯỜI KHÁM SỨC KHỎE</div>
              <div className="text-[9pt] italic mb-12 text-slate-500">(Ký và ghi rõ họ tên)</div>
              <div className="font-bold text-[10.5pt] uppercase">{data.fullName}</div>
            </div>
          </div>
        </div>

        {/* SECTION I: KHÁM THỂ LỰC */}
        <div className="avoid-break mt-3">
          <div className="font-bold text-[11pt] uppercase border-t-2 border-black pt-1.5 mb-2">
            PHẦN KHÁM LÂM SÀNG & CẬN LÂM SÀNG
          </div>
          <div className="font-bold text-[11pt] text-slate-900 mb-1">
            I. KHÁM THỂ LỰC
          </div>
          <table className="form-table">
            <tbody>
              <tr>
                <td className="w-1/3 font-semibold">
                  Chiều cao: <span className="dotted-line w-16"></span> cm
                </td>
                <td className="w-1/3 font-semibold">
                  Cân nặng: <span className="dotted-line w-16"></span> kg
                </td>
                <td className="w-1/3 font-semibold">
                  Chỉ số BMI: <span className="dotted-line w-16"></span> kg/m²
                </td>
              </tr>
              <tr>
                <td className="font-semibold">
                  Huyết áp: <span className="dotted-line w-16"></span> / <span className="dotted-line w-16"></span> mmHg
                </td>
                <td className="font-semibold">
                  Mạch: <span className="dotted-line w-16"></span> lần/phút
                </td>
                <td className="font-semibold">
                  Phân loại thể lực: Loại [  ] I   [  ] II   [  ] III
                </td>
              </tr>
            </tbody>
          </table>

          {/* Doctor Signature for Vitals */}
          <div className="flex justify-end mt-2">
            <div className="text-center leading-tight w-64">
              <div className="font-bold text-[10pt] uppercase">BÁC SĨ KHÁM THỂ LỰC</div>
              <div className="text-[9pt] italic mb-12 text-slate-500">(Ký và ghi rõ họ tên)</div>
              <div className="text-[10pt] font-semibold">...................................................</div>
            </div>
          </div>
        </div>
      </div>

      {/* Page Footer */}
      <div className="text-right text-[9pt] italic pt-2 border-t border-slate-300">
        Trang 2/5 — Mẫu số 03 (Ban hành kèm Thông tư BYT)
      </div>
    </div>
  );
}
