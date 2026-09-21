import * as React from "react";
import { AdultHealthCheckPrintData } from "@/entities/health-check/model/health-check.types";

interface PageProps {
  data: AdultHealthCheckPrintData;
}

export function HealthCheckFormPage5({ data }: PageProps) {
  return (
    <div className="print-page-sheet flex flex-col justify-between">
      <div>
        {/* Paraclinical notes for corporate health check */}
        <div className="p-2.5 bg-slate-50 border border-slate-300 rounded mb-4 text-[10pt] leading-relaxed">
          <span className="font-bold text-slate-800">GHI CHÚ ĐỢT KHÁM SỨC KHỎE ĐỊNH KỲ:</span>
          <div className="text-[9.5pt] text-slate-700 italic mt-0.5">
            Các chỉ định cận lâm sàng chuyên sâu hoặc mở rộng được thực hiện căn cứ theo hợp đồng cung cấp dịch vụ y tế giữa <b>{data.workplace || "Đơn vị công tác"}</b> và <b>Phòng khám Đa khoa Ngọc Khánh</b>, kết hợp cùng đánh giá sàng lọc lâm sàng thực tế của bác sĩ.
          </div>
        </div>

        {/* SECTION IV: KẾT LUẬN */}
        <div className="border-t-2 border-black pt-2 mb-4">
          <div className="font-bold text-[12pt] uppercase mb-2">
            IV. KẾT LUẬN
          </div>

          {/* 1. Health Classification */}
          <div className="mb-3 space-y-1.5">
            <div className="font-bold text-[10.5pt]">
              1. Phân loại sức khỏe:
            </div>
            <div className="grid grid-cols-5 gap-2 text-[10pt] border border-black p-2.5 bg-slate-50/50">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <span className="font-bold">[  ] Loại I</span>
                <span className="text-[9pt] text-slate-500">(Rất khỏe)</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <span className="font-bold">[  ] Loại II</span>
                <span className="text-[9pt] text-slate-500">(Khỏe)</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <span className="font-bold">[  ] Loại III</span>
                <span className="text-[9pt] text-slate-500">(T.Bình)</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <span className="font-bold">[  ] Loại IV</span>
                <span className="text-[9pt] text-slate-500">(Yếu)</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <span className="font-bold">[  ] Loại V</span>
                <span className="text-[9pt] text-slate-500">(Rất yếu)</span>
              </label>
            </div>
          </div>

          {/* 2. Diagnosed Diseases / Conditions */}
          <div className="mb-3 space-y-1">
            <div className="font-bold text-[10.5pt]">
              2. Các bệnh, tật (nếu có):
            </div>
            <div className="border border-black p-3 min-h-20 text-[10pt] text-slate-700 leading-relaxed">
              ........................................................................................................................................................................................................................................
              <br />
              ........................................................................................................................................................................................................................................
            </div>
          </div>

          {/* 3. Advisory and Follow-up */}
          <div className="mb-4 space-y-1">
            <div className="font-bold text-[10.5pt]">
              3. Tư vấn của Bác sĩ / Hướng điều trị & Theo dõi sức khỏe:
            </div>
            <div className="border border-black p-3 min-h-20 text-[10pt] text-slate-700 leading-relaxed">
              - Duy trì chế độ dinh dưỡng lành mạnh, hạn chế rượu bia, tăng cường hoạt động thể lực.
              <br />
              - Khám chuyên khoa định kỳ hoặc kiểm tra lại các chỉ số cận lâm sàng theo khuyến nghị.
              <br />
              ........................................................................................................................................................................................................................................
            </div>
          </div>
        </div>

        {/* SIGNATURES SECTION */}
        <div className="grid grid-cols-2 gap-4 mt-6 pt-2 avoid-break">
          {/* Concluding Doctor */}
          <div className="text-center leading-tight">
            <div className="text-[10pt] italic">Hà Nội, ngày ...... tháng ...... năm 202...</div>
            <div className="font-bold text-[10.5pt] uppercase mt-1">BÁC SĨ KẾT LUẬN</div>
            <div className="text-[9pt] italic text-slate-500 mb-16">(Ký, ghi rõ họ tên và chức danh)</div>
            <div className="font-bold text-[10.5pt] text-slate-800">
              BSCKI. NGUYỄN VĂN HÙNG
            </div>
          </div>

          {/* Clinic Director & Seal */}
          <div className="text-center leading-tight">
            <div className="text-[10pt] italic">Hà Nội, ngày ...... tháng ...... năm 202...</div>
            <div className="font-bold text-[10.5pt] uppercase mt-1">
              NGƯỜI ĐẠI DIỆN CƠ SỞ KCB
            </div>
            <div className="text-[9pt] italic text-slate-500 mb-16">
              (Ký tên, đóng dấu của Phòng khám)
            </div>
            <div className="font-bold text-[10.5pt] text-slate-900 uppercase">
              PHÒNG KHÁM ĐA KHOA NGỌC KHÁNH
            </div>
          </div>
        </div>
      </div>

      {/* Page Footer */}
      <div className="text-right text-[9pt] italic pt-2 border-t border-slate-300">
        Trang 5/5 — Mẫu số 03 (Ban hành kèm Thông tư BYT)
      </div>
    </div>
  );
}
