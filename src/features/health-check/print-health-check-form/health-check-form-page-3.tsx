import * as React from "react";
import { AdultHealthCheckPrintData } from "@/entities/health-check/model/health-check.types";

interface PageProps {
  data: AdultHealthCheckPrintData;
}

export function HealthCheckFormPage3({ data }: PageProps) {
  const isFemale = data.gender === "FEMALE";

  return (
    <div className="print-page-sheet flex flex-col justify-between">
      <div>
        <div className="font-bold text-[11pt] uppercase border-b border-black pb-1 mb-2">
          II. KHÁM LÂM SÀNG
        </div>

        {/* 1. NỘI KHOA */}
        <div className="mb-3">
          <div className="font-bold text-[10.5pt] mb-1">
            1. Nội khoa:
          </div>
          <table className="form-table">
            <thead>
              <tr>
                <th className="w-10">STT</th>
                <th className="w-36">Chuyên khoa</th>
                <th>Mô tả kết quả khám lâm sàng</th>
                <th className="w-24">Phân loại</th>
                <th className="w-40">Bác sĩ khám (Ký, họ tên)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="text-center font-bold">a</td>
                <td className="font-semibold">Tuần hoàn</td>
                <td>Tiếng tim đều, rõ, chưa phát hiện tiếng thổi bệnh lý.</td>
                <td className="text-center">Loại [  ]</td>
                <td className="h-10"></td>
              </tr>
              <tr>
                <td className="text-center font-bold">b</td>
                <td className="font-semibold">Hô hấp</td>
                <td>Rì rào phế nang êm dịu 2 phế trường, không rale.</td>
                <td className="text-center">Loại [  ]</td>
                <td className="h-10"></td>
              </tr>
              <tr>
                <td className="text-center font-bold">c</td>
                <td className="font-semibold">Tiêu hóa</td>
                <td>Bụng mềm, gan lách không sờ thấy, không điểm đau khu trú.</td>
                <td className="text-center">Loại [  ]</td>
                <td className="h-10"></td>
              </tr>
              <tr>
                <td className="text-center font-bold">d</td>
                <td className="font-semibold">Thận - Tiết niệu</td>
                <td>Chạm thận (-), bập bềnh thận (-), không có cầu bàng quang.</td>
                <td className="text-center">Loại [  ]</td>
                <td className="h-10"></td>
              </tr>
              <tr>
                <td className="text-center font-bold">e</td>
                <td className="font-semibold">Nội tiết</td>
                <td>Tuyến giáp không to, không có hội chứng cường/suy giáp.</td>
                <td className="text-center">Loại [  ]</td>
                <td className="h-10"></td>
              </tr>
              <tr>
                <td className="text-center font-bold">f</td>
                <td className="font-semibold">Cơ - Xương - Khớp</td>
                <td>Vận động các khớp trong giới hạn bình thường, không biến dạng.</td>
                <td className="text-center">Loại [  ]</td>
                <td className="h-10"></td>
              </tr>
              <tr>
                <td className="text-center font-bold">g</td>
                <td className="font-semibold">Thần kinh</td>
                <td>Phản xạ gân xương bình thường, không có dấu thần kinh khu trú.</td>
                <td className="text-center">Loại [  ]</td>
                <td className="h-10"></td>
              </tr>
              <tr>
                <td className="text-center font-bold">h</td>
                <td className="font-semibold">Tâm thần</td>
                <td>Tiếp xúc tốt, định hướng không gian/thời gian chuẩn xác.</td>
                <td className="text-center">Loại [  ]</td>
                <td className="h-10"></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 2. NGOẠI KHOA & 3. DA LIỄU */}
        <div className="grid grid-cols-2 gap-3 mb-2">
          <div className="border border-black p-2">
            <div className="font-bold text-[10pt] mb-1">2. Ngoại khoa:</div>
            <div className="text-[9.5pt] mb-2 min-h-7">
              Không trĩ, không thoát vị, vận động chi tốt.
            </div>
            <div className="flex justify-between items-center text-[9.5pt] pt-1 border-t border-slate-200">
              <span>Phân loại: Loại [  ]</span>
              <span className="italic text-[9pt]">BS ngoại khoa ký: ...............</span>
            </div>
          </div>

          <div className="border border-black p-2">
            <div className="font-bold text-[10pt] mb-1">3. Da liễu:</div>
            <div className="text-[9.5pt] mb-2 min-h-7">
              Da niêm mạc bình thường, không tổn thương mụn mủ/nấm.
            </div>
            <div className="flex justify-between items-center text-[9.5pt] pt-1 border-t border-slate-200">
              <span>Phân loại: Loại [  ]</span>
              <span className="italic text-[9pt]">BS da liễu ký: ...............</span>
            </div>
          </div>
        </div>

        {/* 4. SẢN PHỤ KHOA */}
        <div className="border border-black p-2 mb-2">
          <div className="font-bold text-[10pt] mb-1">
            4. Sản phụ khoa (áp dụng cho nữ):
          </div>
          {isFemale ? (
            <div>
              <div className="text-[9.5pt] mb-2 min-h-7">
                Khám phụ khoa / cổ tử cung: ............................................................................................................
              </div>
              <div className="flex justify-between items-center text-[9.5pt] pt-1 border-t border-slate-200">
                <span>Phân loại: Loại [  ]</span>
                <span className="italic text-[9pt]">Bác sĩ Sản phụ khoa (Ký, họ tên): ............................................</span>
              </div>
            </div>
          ) : (
            <div className="text-[9.5pt] text-slate-500 italic py-1">
              Không áp dụng (Khách hàng Nam).
            </div>
          )}
        </div>

        {/* 5. MẮT */}
        <div className="border border-black p-2">
          <div className="font-bold text-[10pt] mb-1">5. Mắt:</div>
          <div className="grid grid-cols-2 gap-4 text-[9.5pt] mb-1">
            <div>
              <b>Thị lực không kính: </b>
              Mắt phải: ....../10 • Mắt trái: ....../10
            </div>
            <div>
              <b>Thị lực có kính: </b>
              Mắt phải: ....../10 • Mắt trái: ....../10
            </div>
          </div>
          <div className="text-[9.5pt] mb-2">
            Sắc giác: [  ] Bình thường   [  ] Mù màu | Bệnh mắt khác: ....................................................................
          </div>
          <div className="flex justify-between items-center text-[9.5pt] pt-1 border-t border-slate-200">
            <span>Phân loại: Loại [  ]</span>
            <span className="italic text-[9pt]">Bác sĩ Chuyên khoa Mắt (Ký, họ tên): ............................................</span>
          </div>
        </div>
      </div>

      {/* Page Footer */}
      <div className="text-right text-[9pt] italic pt-2 border-t border-slate-300">
        Trang 3/5 — Mẫu số 03 (Ban hành kèm Thông tư BYT)
      </div>
    </div>
  );
}
