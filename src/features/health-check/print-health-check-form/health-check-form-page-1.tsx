import * as React from "react";
import { AdultHealthCheckPrintData } from "@/entities/health-check/model/health-check.types";

interface PageProps {
  data: AdultHealthCheckPrintData;
}

export function HealthCheckFormPage1({ data }: PageProps) {
  return (
    <div className="print-page-sheet flex flex-col justify-between">
      <div>
        {/* Top Header */}
        <div className="flex justify-between items-start border-b border-black pb-2 mb-3">
          <div className="text-left leading-tight">
            <div className="font-bold text-[10pt] uppercase">SỞ Y TẾ TP. HÀ NỘI</div>
            <div className="font-bold text-[10.5pt] uppercase text-slate-900">
              PHÒNG KHÁM ĐA KHOA NGỌC KHÁNH
            </div>
            <div className="text-[9pt] italic">Số: {data.formNumber || "......./GKSK-NKC"}</div>
          </div>
          <div className="text-center leading-tight">
            <div className="font-bold text-[10pt] uppercase">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
            <div className="font-bold text-[10pt]">Độc lập - Tự do - Hạnh phúc</div>
            <div className="text-[9.5pt] text-slate-600">-------------------</div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center my-3">
          <div className="font-bold text-[10pt] text-slate-700 uppercase tracking-wider mb-0.5">
            MẪU SỐ 03
          </div>
          <h1 className="font-bold text-[13pt] uppercase text-black leading-snug">
            GIẤY KHÁM SỨC KHỎE VÀ KHÁM SỨC KHỎE ĐỊNH KỲ
          </h1>
          <div className="font-bold text-[11pt] italic text-black">
            (Dùng cho người từ đủ 18 tuổi trở lên)
          </div>
        </div>

        {/* Layout with Photo box on Left and Administrative info on Right */}
        <div className="flex gap-4 items-start mb-3">
          {/* Photo frame 4x6 */}
          <div className="w-[110px] h-[150px] border border-dashed border-black flex flex-col items-center justify-center p-2 text-center shrink-0 text-[9pt] text-slate-700 bg-slate-50/50">
            <span className="font-bold">ẢNH 4x6 cm</span>
            <span className="text-[8pt] italic mt-1 leading-tight text-slate-500">
              (Đóng dấu giáp lai của cơ sở y tế)
            </span>
          </div>

          {/* Administrative items 1-8 */}
          <div className="flex-1 space-y-1.5 text-[10.5pt] leading-tight">
            <div>
              <span className="font-bold">1. Họ và tên (chữ in hoa): </span>
              <span className="font-bold uppercase tracking-wide text-black text-[11pt]">
                {data.fullName}
              </span>
            </div>

            <div className="flex items-center gap-6">
              <div>
                <span className="font-bold">2. Giới tính: </span>
                <span className="font-semibold">
                  {data.gender === "MALE" ? "[X] Nam   [  ] Nữ" : "[  ] Nam   [X] Nữ"}
                </span>
              </div>
              <div>
                <span className="font-bold">3. Ngày sinh: </span>
                <span className="font-semibold">{data.dateOfBirth}</span>
                <span className="ml-3 font-bold">Tuổi: </span>
                <span className="font-semibold">{data.age}</span>
              </div>
            </div>

            <div>
              <span className="font-bold">4. Số CCCD/Hộ chiếu: </span>
              <span className="font-mono font-bold tracking-wider">{data.identityNumber}</span>
            </div>

            <div className="flex items-center gap-4">
              <div>
                <span className="font-bold">5. Ngày cấp: </span>
                <span>{data.identityIssueDate || "...................."}</span>
              </div>
              <div className="flex-1">
                <span className="font-bold">Nơi cấp: </span>
                <span>{data.identityIssuePlace || "Cục CSQLHC về TTXH"}</span>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div>
                <span className="font-bold">6. Dân tộc: </span>
                <span>{data.ethnicity || "Kinh"}</span>
              </div>
              <div className="flex-1">
                <span className="font-bold">7. Đối tượng: </span>
                <span>{data.subjectType || "Cán bộ nhân viên"}</span>
              </div>
            </div>

            <div>
              <span className="font-bold">8. Nguồn chi trả: </span>
              <span>{data.payerSource || "Doanh nghiệp / Cá nhân chi trả"}</span>
            </div>
          </div>
        </div>

        {/* Administrative items 9-13 */}
        <div className="space-y-1.5 text-[10.5pt] leading-tight mb-4">
          <div className="flex items-center gap-6">
            <div className="w-1/3">
              <span className="font-bold">9. Nhóm máu (nếu biết): </span>
              <span className="font-semibold">{data.bloodGroup || "................"}</span>
            </div>
            <div className="flex-1">
              <span className="font-bold">10. Nơi ở hiện tại: </span>
              <span>{data.currentAddress || "........................................................................"}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-1/2">
              <span className="font-bold">11. Nghề nghiệp / Chức vụ: </span>
              <span>{data.occupation || "............................................"}</span>
            </div>
            <div className="w-1/2">
              <span className="font-bold">12. Nơi làm việc / Học tập: </span>
              <span className="font-semibold">{data.workplace || "............................................"}</span>
            </div>
          </div>

          <div>
            <span className="font-bold">13. Lý do khám sức khỏe: </span>
            <span className="italic">{data.reasonForHealthCheck || "Khám sức khỏe định kỳ"}</span>
          </div>
        </div>

        {/* SECTION: TIỀN SỬ BỆNH TẬT */}
        <div>
          <div className="font-bold text-[11pt] uppercase border-t-2 border-black pt-1.5 mb-1">
            TIỀN SỬ BỆNH TẬT
          </div>

          {/* 1. Tiền sử gia đình */}
          <div className="mb-2">
            <div className="font-bold text-[10.5pt]">
              1. Tiền sử gia đình:
            </div>
            <div className="text-[10pt] italic mb-1">
              (Có ai trong gia đình mắc một trong các bệnh: Bệnh truyền nhiễm, Tim mạch, Đái tháo đường, Lao, Hen phế quản, Ung thư, Động kinh, Rối loạn tâm thần, khác)
            </div>
            <table className="form-table">
              <thead>
                <tr>
                  <th className="w-12">STT</th>
                  <th>Tên bệnh tật</th>
                  <th className="w-20">Có</th>
                  <th className="w-20">Không</th>
                  <th>Ghi rõ tên bệnh / Mối quan hệ thân nhân</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="text-center">1</td>
                  <td>Bệnh truyền nhiễm (Lao, Viêm gan B, C, HIV...)</td>
                  <td className="text-center">[  ]</td>
                  <td className="text-center">[  ]</td>
                  <td></td>
                </tr>
                <tr>
                  <td className="text-center">2</td>
                  <td>Bệnh tim mạch, Tăng huyết áp, Đột quỵ</td>
                  <td className="text-center">[  ]</td>
                  <td className="text-center">[  ]</td>
                  <td></td>
                </tr>
                <tr>
                  <td className="text-center">3</td>
                  <td>Đái tháo đường, Rối loạn chuyển hóa</td>
                  <td className="text-center">[  ]</td>
                  <td className="text-center">[  ]</td>
                  <td></td>
                </tr>
                <tr>
                  <td className="text-center">4</td>
                  <td>Hen phế quản, Bệnh phổi phế quản mạn tính</td>
                  <td className="text-center">[  ]</td>
                  <td className="text-center">[  ]</td>
                  <td></td>
                </tr>
                <tr>
                  <td className="text-center">5</td>
                  <td>Ung thư, Khối u ác tính</td>
                  <td className="text-center">[  ]</td>
                  <td className="text-center">[  ]</td>
                  <td></td>
                </tr>
                <tr>
                  <td className="text-center">6</td>
                  <td>Động kinh, Rối loạn tâm thần</td>
                  <td className="text-center">[  ]</td>
                  <td className="text-center">[  ]</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 2. Tiền sử bản thân (Part 1) */}
          <div>
            <div className="font-bold text-[10.5pt]">
              2. Tiền sử bản thân:
            </div>
            <div className="text-[10pt] italic mb-1">
              (Đã hoặc đang mắc bệnh nào trong các bệnh sau đây)
            </div>
            <table className="form-table">
              <thead>
                <tr>
                  <th className="w-12">STT</th>
                  <th>Tên bệnh</th>
                  <th className="w-20">Có</th>
                  <th className="w-20">Không</th>
                  <th>Năm phát hiện / Ghi chú điều trị</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="text-center">1</td>
                  <td>Bệnh truyền nhiễm</td>
                  <td className="text-center">[  ]</td>
                  <td className="text-center">[  ]</td>
                  <td></td>
                </tr>
                <tr>
                  <td className="text-center">2</td>
                  <td>Bệnh tim mạch, Huyết áp</td>
                  <td className="text-center">[  ]</td>
                  <td className="text-center">[  ]</td>
                  <td></td>
                </tr>
                <tr>
                  <td className="text-center">3</td>
                  <td>Đái tháo đường</td>
                  <td className="text-center">[  ]</td>
                  <td className="text-center">[  ]</td>
                  <td></td>
                </tr>
                <tr>
                  <td className="text-center">4</td>
                  <td>Bệnh thận, Tiết niệu</td>
                  <td className="text-center">[  ]</td>
                  <td className="text-center">[  ]</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Page Footer */}
      <div className="text-right text-[9pt] italic pt-2 border-t border-slate-300">
        Trang 1/5 — Mẫu số 03 (Ban hành kèm Thông tư BYT)
      </div>
    </div>
  );
}
