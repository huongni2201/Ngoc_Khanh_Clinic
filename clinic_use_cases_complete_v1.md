# USE CASE SPECIFICATION HOÀN CHỈNH
## Hệ thống hỗ trợ chuyển đổi số phòng khám đa khoa ngoại trú

**Phiên bản:** 1.0  
**Baseline:** 17/09/2026  
**Liên kết Requirement:** `clinic_requirements_complete_v1.md`

---

# 1. Mục tiêu

Tài liệu này mô tả toàn bộ Use Case của hệ thống theo requirement mới nhất, bao gồm các thay đổi quan trọng:

- Payment gate trước khi thực hiện dịch vụ.
- Multiple Order Round trong một Encounter.
- Quick-view Side Drawer (Popup trượt bên phải xem nhanh hồ sơ bệnh nhân từ màn tra cứu).
- Xuất Giấy chỉ định CLS kèm địa điểm phòng chuyên môn và hướng dẫn lộ trình di chuyển (kết quả trả tự động về máy bác sĩ, không chờ bản in tại phòng CLS).
- Xuất Hóa đơn tạm thu & Bảng kê viện phí kèm mã VietQR động hỗ trợ nộp tiền nhanh.
- Lab chuyên biệt theo panel/analyte.
- Ultrasound Workspace có image/metadata.
- Result auto-return.
- Pharmacy handoff bằng QR.
- Web-first Patient Portal.
- Role-aware UI.
- Ngoại trú, không bao gồm inpatient.

---

# 2. Actors

- Patient
- Receptionist
- Doctor
- Cashier
- Lab Technician
- Ultrasound Doctor/Technician
- X-ray Technician
- ECG Technician
- Pharmacy Staff
- Manager
- Administrator
- LIS/Lab Middleware
- Lab Analyzer
- Ultrasound Device/System
- PACS/RIS/X-ray System
- Payment Gateway
- Notification Provider

---

# 3. Use Case Inventory

| ID | Use Case | Actor chính | Priority |
|---|---|---|---|
| UC-PAT-01 | Tìm bệnh nhân & Xem nhanh Quick-View Drawer | Lễ tân/Bác sĩ/Thu ngân | Must |
| UC-PAT-02 | Tạo hồ sơ bệnh nhân | Lễ tân | Must |
| UC-PAT-03 | Kiểm tra hồ sơ trùng | Lễ tân | Must |
| UC-PAT-04 | Hợp nhất hồ sơ trùng | Admin/Người có quyền | Should |
| UC-PAT-05 | Cập nhật thông tin hành chính | Lễ tân | Must |
| UC-PAT-06 | Quản lý lịch sử liên hệ | Lễ tân | Should |
| UC-PAT-07 | Xem Patient Profile | Nhân viên có quyền | Must |
| UC-PAT-08 | Xem Timeline | Bác sĩ | Must |
| UC-PAT-09 | Xem tài liệu/hình ảnh lịch sử | Bác sĩ | Should |
| UC-REC-01 | Tạo Encounter | Lễ tân | Must |
| UC-REC-02 | Chọn phòng/bác sĩ | Lễ tân | Must |
| UC-REC-03 | Cấp số hàng đợi | Hệ thống | Must |
| UC-REC-04 | Tạo QR Encounter | Hệ thống | Must |
| UC-REC-05 | In phiếu có QR | Lễ tân | Should |
| UC-REC-06 | Chuyển phòng/bác sĩ | Lễ tân | Should |
| UC-JRN-01 | Xem Journey Board | Lễ tân/Quản lý | Must |
| UC-JRN-02 | Xem vị trí/trạng thái bệnh nhân | Nhân viên | Must |
| UC-JRN-03 | Theo dõi thời gian chờ | Quản lý | Should |
| UC-JRN-04 | Nhận cảnh báo SLA | Quản lý | Should |
| UC-CLN-01 | Xem Doctor Worklist | Bác sĩ | Must |
| UC-CLN-02 | Bắt đầu khám | Bác sĩ | Must |
| UC-CLN-03 | Ghi lý do khám/bệnh sử | Bác sĩ | Must |
| UC-CLN-04 | Ghi sinh hiệu/khám lâm sàng | Bác sĩ | Must |
| UC-CLN-05 | Ghi chẩn đoán sơ bộ | Bác sĩ | Must |
| UC-CLN-06 | Xem dị ứng/bệnh nền | Bác sĩ | Must |
| UC-CLN-07 | Xem timeline trong lúc khám | Bác sĩ | Must |
| UC-CLN-08 | Nhận thông báo kết quả mới | Bác sĩ | Must |
| UC-CLN-09 | Xem kết quả bất thường | Bác sĩ | Must |
| UC-CLN-10 | Tạo chỉ định bổ sung | Bác sĩ | Must |
| UC-CLN-11 | Kết luận cuối | Bác sĩ | Must |
| UC-CLN-12 | Hoàn tất Encounter | Bác sĩ | Must |
| UC-ORD-01 | Tạo Order Round | Bác sĩ | Must |
| UC-ORD-02 | Tìm dịch vụ | Bác sĩ | Must |
| UC-ORD-03 | Dùng favorite/order set | Bác sĩ | Should |
| UC-ORD-04 | Gửi order | Bác sĩ/Hệ thống | Must |
| UC-ORD-05 | Hủy order | Bác sĩ/Người có quyền | Should |
| UC-ORD-06 | Xuất/in Giấy chỉ định CLS & Lộ trình phòng | Bác sĩ/Lễ tân | Must |
| UC-ORD-07 | Xuất Hóa đơn tạm thu & Hướng dẫn nộp tiền (VietQR) | Bác sĩ/Thu ngân | Must |
| UC-BIL-01 | Xem dịch vụ phải thu | Thu ngân | Must |
| UC-BIL-02 | Tính tổng tiền | Hệ thống | Must |
| UC-BIL-03 | Thanh toán tiền mặt | Thu ngân | Must |
| UC-BIL-04 | Thanh toán QR | Thu ngân/Payment Gateway | Should |
| UC-BIL-05 | Xác nhận payment webhook | Hệ thống | Should |
| UC-BIL-06 | Authorize order sau thanh toán | Hệ thống | Must |
| UC-BIL-07 | Thu thêm order bổ sung | Thu ngân | Must |
| UC-BIL-08 | Hoàn/hủy dịch vụ | Thu ngân/Quản lý | Should |
| UC-LAB-01 | Xem Lab Worklist | Lab | Must |
| UC-LAB-02 | Quét QR xác nhận BN | Lab | Must |
| UC-LAB-03 | Tạo/ghi nhận specimen | Lab | Must |
| UC-LAB-04 | In/scan barcode specimen | Lab | Should |
| UC-LAB-05 | Nhận result từ máy/LIS | Hệ thống | Must |
| UC-LAB-06 | Nhập result thủ công fallback | Lab | Should |
| UC-LAB-07 | Xem panel/analyte | Lab | Must |
| UC-LAB-08 | Đánh dấu abnormal | Hệ thống/Lab | Must |
| UC-LAB-09 | Verify result | Lab | Must |
| UC-LAB-10 | Final result | Lab | Must |
| UC-LAB-11 | Correct final result | Lab có quyền | Should |
| UC-LAB-12 | Quản lý lab catalog | Admin | Should |
| UC-US-01 | Xem Ultrasound Worklist | Siêu âm | Must |
| UC-US-02 | Mở Ultrasound Workspace | Siêu âm | Must |
| UC-US-03 | Chọn/chuyển template | Siêu âm | Must |
| UC-US-04 | Nhận ảnh từ thiết bị | Hệ thống | Should |
| UC-US-05 | Xem ảnh/metadata | Siêu âm | Should |
| UC-US-06 | Nhập mô tả | Siêu âm | Must |
| UC-US-07 | Nhập kết luận | Siêu âm | Must |
| UC-US-08 | Final report | Siêu âm | Must |
| UC-IMG-01 | Xem X-ray Worklist | X-quang | Must |
| UC-IMG-02 | Nhận study/report reference | Hệ thống | Should |
| UC-IMG-03 | Trả report X-quang | X-quang | Must |
| UC-ECG-01 | Xem ECG Worklist | ECG | Must |
| UC-ECG-02 | Trả kết quả ECG | ECG | Must |
| UC-RES-01 | Tự động trả result về Encounter | Hệ thống | Must |
| UC-RES-02 | Đánh dấu partial/all results | Hệ thống | Must |
| UC-RES-03 | Thông báo bác sĩ | Hệ thống | Must |
| UC-RX-01 | Tạo prescription | Bác sĩ | Must |
| UC-RX-02 | Thêm/sửa thuốc | Bác sĩ | Must |
| UC-RX-03 | Cảnh báo dị ứng/tương tác | Hệ thống | Should |
| UC-RX-04 | Phát hành RX QR | Hệ thống | Must |
| UC-RX-05 | Sửa prescription có version | Bác sĩ | Should |
| UC-PHM-01 | Quét RX QR | Quầy thuốc | Must |
| UC-PHM-02 | Lấy đơn bác sĩ | Quầy thuốc | Must |
| UC-PHM-03 | Xác nhận cấp phát | Quầy thuốc | Should |
| UC-APT-01 | Tạo lịch hẹn | Lễ tân/Bác sĩ | Should |
| UC-APT-02 | Tạo lịch tái khám | Bác sĩ | Should |
| UC-APT-03 | Xác nhận lịch | Lễ tân/Bệnh nhân | Should |
| UC-APT-04 | Đánh dấu no-show | Hệ thống/Lễ tân | Should |
| UC-NOT-01 | Gửi nhắc lịch | Hệ thống | Should |
| UC-NOT-02 | Thông báo có kết quả | Hệ thống | Should |
| UC-PORT-01 | Patient đăng nhập portal | Bệnh nhân | Should |
| UC-PORT-02 | Xem lịch sử khám | Bệnh nhân | Should |
| UC-PORT-03 | Xem/tải kết quả | Bệnh nhân | Should |
| UC-PORT-04 | Xem prescription | Bệnh nhân | Should |
| UC-PORT-05 | Xem lịch hẹn | Bệnh nhân | Should |
| UC-PORT-06 | Cập nhật liên hệ | Bệnh nhân | Could |
| UC-RPT-01 | Xem dashboard vận hành | Quản lý | Should |
| UC-RPT-02 | Xem TAT/SLA | Quản lý | Should |
| UC-RPT-03 | Xem báo cáo doanh thu | Quản lý | Should |
| UC-RPT-04 | Xuất báo cáo | Quản lý | Should |
| UC-ADM-01 | Quản lý user | Admin | Must |
| UC-ADM-02 | Quản lý role | Admin | Must |
| UC-ADM-03 | Quản lý permission theo module/phòng | Admin | Must |
| UC-ADM-04 | Quản lý dịch vụ/bảng giá | Admin | Should |
| UC-ADM-05 | Quản lý template | Admin | Must |
| UC-ADM-06 | Quản lý integration | Admin | Should |
| UC-ADM-07 | Xem audit log | Admin | Must |
| UC-ADM-08 | Cấu hình notification | Admin | Should |

**Tổng số Use Case:** 106

---

# 4. Mapping theo module

| Module | UC Prefix |
|---|---|
| Patient | UC-PAT |
| Reception | UC-REC |
| Journey | UC-JRN |
| Clinical | UC-CLN |
| Order | UC-ORD |
| Billing | UC-BIL |
| Laboratory | UC-LAB |
| Ultrasound | UC-US |
| Imaging/X-ray | UC-IMG |
| ECG | UC-ECG |
| Result | UC-RES |
| Prescription | UC-RX |
| Pharmacy handoff | UC-PHM |
| Appointment | UC-APT |
| Notification | UC-NOT |
| Patient Portal | UC-PORT |
| Reports | UC-RPT |
| Administration | UC-ADM |


# 5. Use Case chi tiết các luồng lõi

## UC-PAT-01 — Tìm bệnh nhân & Xem nhanh Quick-View Drawer

**Actor:** Lễ tân/Bác sĩ/Thu ngân  
**Tiền điều kiện:** User đã đăng nhập và có quyền tra cứu.  
**Trigger:** User cần tìm và kiểm tra thông tin hồ sơ bệnh nhân.

### Main flow
1. User nhập một hoặc nhiều tiêu chí (Patient ID, Họ tên có dấu/không dấu, SĐT hiện tại/lịch sử, DOB, CCCD).
2. Hệ thống thực hiện tìm kiếm và trả về danh sách hồ sơ trùng khớp kèm thông tin phân biệt (DOB, SĐT, Patient ID, lần khám gần nhất, cảnh báo nguy cơ trùng).
3. User bấm nút **"Mở hồ sơ"** hoặc click vào hàng bệnh nhân trong danh sách.
4. Hệ thống mở một **Off-canvas Side Drawer (Popup trượt từ mép phải màn hình)** hiển thị tức thì tóm tắt hồ sơ (Quick-View) mà không điều hướng rời khỏi trang tra cứu:
   - **Định danh & Hành chính:** Mã BN, Họ tên, Tuổi/Giới, SĐT, CCCD, Địa chỉ.
   - **Cảnh báo an toàn người bệnh:** Cảnh báo nổi bật dị ứng thuốc (ví dụ: *Dị ứng Penicillin*), bệnh lý nền mãn tính, thuốc đang điều trị thường xuyên.
   - **Sinh hiệu gần nhất:** Huyết áp, mạch, đường huyết, BMI, SpO2.
   - **Lịch sử khám gần đây:** Dòng thời gian các lần khám trước, các chỉ định và kết quả CLS bất thường (`WBC 12.8 ↑`), toa thuốc cũ.
5. Từ Side Drawer, User có thể chọn:
   - Nhấp **"+ Tiếp nhận khám ngay"** $\rightarrow$ Hệ thống đóng drawer và chuyển thẳng sang màn hình **Tiếp nhận & Tạo Encounter (UC-REC-01)** với thông tin bệnh nhân đã được điền sẵn.
   - Nhấp **"Mở hồ sơ đầy đủ"** $\rightarrow$ Chuyển sang màn hình **Patient Profile Cockpit (UC-PAT-07)** để xem toàn diện mọi phân hệ.
   - Bấm **"Đóng"** (hoặc click ra ngoài backdrop, bấm phím `Esc`) $\rightarrow$ Drawer đóng lại, giữ nguyên từ khóa tìm kiếm và bảng kết quả tra cứu hiện tại.

### Alternative
- Không có kết quả $\rightarrow$ User có thể bấm nút tạo bệnh nhân mới (UC-PAT-02).
- Có match gần giống $\rightarrow$ Hệ thống hiển thị huy hiệu cảnh báo nguy cơ trùng lặp để nhân viên đối soát CCCD/SĐT trước khi tiếp nhận.

### Postcondition
Xác định chính xác Patient ID và thông tin lâm sàng cốt lõi phục vụ tiếp nhận hoặc khám chữa bệnh mà không mất ngữ cảnh tra cứu.

---

## UC-PAT-02 — Tạo hồ sơ bệnh nhân

1. User chọn tạo mới.
2. Nhập thông tin hành chính/định danh.
3. Hệ thống chạy duplicate check.
4. Nếu không có trùng nguy cơ cao, user xác nhận.
5. Hệ thống cấp Patient ID.
6. Lưu audit.

---

## UC-REC-01 — Tạo Encounter

**Actor:** Lễ tân  
**Tiền điều kiện:** Patient đã tồn tại.

1. Mở Patient Profile.
2. Chọn “Tạo lượt khám”.
3. Nhập lý do khám.
4. Chọn chuyên khoa/phòng/bác sĩ.
5. Chọn priority.
6. Hệ thống tạo Encounter ID.
7. Tạo queue number.
8. Tạo QR.
9. State = `WAITING_FOR_EXAM`.

---

## UC-JRN-01 — Theo dõi Journey Board

1. User mở board.
2. Hệ thống nhóm bệnh nhân theo state.
3. Mỗi card hiển thị:
   - tên/Patient ID,
   - Encounter,
   - elapsed time,
   - phòng,
   - payment,
   - order/result status.
4. State thay đổi gần real-time.
5. Nếu vượt SLA, card được cảnh báo.

---

## UC-CLN-02 — Bắt đầu khám

1. Bác sĩ mở Doctor Worklist.
2. Chọn patient.
3. Xác minh Patient Safety Header.
4. Chọn “Bắt đầu khám”.
5. State = `IN_EXAM`.
6. Clinical Workspace mở Encounter hiện tại.

---

## UC-CLN-07 — Xem timeline trong lúc khám

1. Clinical Workspace tự load timeline gần nhất.
2. Bác sĩ thấy:
   - diagnosis,
   - orders,
   - results,
   - prescription,
   - abnormal history.
3. Bác sĩ mở chi tiết một encounter cũ nếu cần.
4. Không rời khỏi current Encounter context.

---

## UC-ORD-01 — Tạo Order Round & Chỉ định Cận lâm sàng

**Actor:** Bác sĩ khám  
**Tiền điều kiện:** Encounter đang ở trạng thái `IN_EXAM`.

### Main flow
1. Bác sĩ chọn “Chỉ định CLS” (Order Round 1 hoặc Order Round bổ sung).
2. Bác sĩ chọn dịch vụ lẻ hoặc theo Order Set / Bệnh lý (ví dụ: Gói Tim mạch gồm CTM, Glucose máu, Điện tim ECG).
3. Hệ thống hiển thị thông tin chi tiết từng dịch vụ: Đơn giá, **Phòng thực hiện & Vị trí** (P.202 Xét nghiệm Tầng 2, P.208 ECG Tầng 2...), Hướng dẫn chuẩn bị bệnh nhân.
4. Bác sĩ xác nhận gửi chỉ định.
5. Order state chuyển sang `ORDERED`.
6. Encounter state chuyển sang `WAITING_FOR_PAYMENT` (do có dịch vụ cần thu viện phí).
7. Hệ thống kích hoạt công cụ xuất in y tế:
   - **UC-ORD-06**: Xuất/in Giấy chỉ định CLS kèm hướng dẫn lộ trình phòng chuyên môn giao cho bệnh nhân.
   - **UC-ORD-07**: Xuất/in Hóa đơn tạm thu kèm mã VietQR động để bệnh nhân nộp tiền.

---

## UC-ORD-06 — Xuất/in Giấy chỉ định CLS & Hướng dẫn lộ trình phòng

**Actor:** Bác sĩ khám / Lễ tân  
**Tiền điều kiện:** Order Round đã được khởi tạo và gửi lên hệ thống.

### Main flow
1. Bác sĩ hoặc nhân viên y tế chọn thao tác **"Xuất Giấy khám & Chỉ định CLS"** từ Clinical Workspace hoặc Electronic Order.
2. Hệ thống sinh biểu mẫu y tế chuẩn ngoại trú gồm:
   - **Header hành chính:** Tên phòng khám, Thông tin đợt khám (Mã Encounter, STT #032, Mã BN).
   - **Định danh & An toàn:** Họ tên BN, Năm sinh, Giới tính, CCCD, SĐT, Khoa/Phòng khám ban đầu, Chẩn đoán sơ bộ (ICD-10).
   - **Cảnh báo dị ứng nổi bật:** Nhắc nhở toàn bộ các phòng CLS về tiền sử phản vệ/dị ứng của người bệnh (ví dụ: *Dị ứng Penicillin*).
   - **Danh mục dịch vụ chỉ định:** Từng dịch vụ kỹ thuật kèm mã, đơn giá, **số phòng & tầng thực hiện cụ thể** (ví dụ: *P.202 Tầng 2 - Xét nghiệm*, *P.208 Tầng 2 - Điện tim*), và lưu ý chuyên môn (nhịn ăn sáng, nằm nghỉ 5p...).
   - **Hướng dẫn lộ trình 4 bước cho bệnh nhân:**
     * *Bước 1 (Nộp tiền):* Xuống Quầy Thu ngân Tầng 1 thanh toán tiền mặt hoặc quét VietQR để kích hoạt trạng thái dịch vụ (`PAID_AUTHORIZED`).
     * *Bước 2 (Lấy mẫu xét nghiệm):* Lên Phòng Xét nghiệm P.202 Tầng 2.
     * *Bước 3 (Thực hiện CĐHA/Thăm dò):* Sang Phòng Điện tim P.208 Tầng 2.
     * *Bước 4 (Kết luận):* Bệnh nhân **quay trở lại ngồi chờ trước phòng khám bác sĩ ban đầu (P.203)**. Kết quả xét nghiệm và thăm dò chức năng sẽ **tự động gửi về máy tính bác sĩ (Auto-return)**, bệnh nhân **KHÔNG CẦN CHỜ LẤY BẢN IN GIẤY TẠI PHÒNG XÉT NGHIỆM**.
   - **Mã vạch / QR Encounter:** Cho phép các phòng CLS quét mã đối soát 2 yếu tố định danh nhanh chóng.
   - **Chữ ký bác sĩ chỉ định:** Tên bác sĩ, số chứng chỉ hành nghề.
3. Bác sĩ bấm in giấy hoặc phát hành bản điện tử để giao cho người bệnh.

---

## UC-ORD-07 — Xuất Hóa đơn tạm thu & Hướng dẫn nộp tiền (VietQR)

**Actor:** Bác sĩ khám / Thu ngân / Bệnh nhân  
**Tiền điều kiện:** Có dịch vụ phát sinh viện phí ở trạng thái `WAITING_FOR_PAYMENT`.

### Main flow
1. Hệ thống tự động tổng hợp chi phí tạm thu của đợt khám (tiền công khám chuyên khoa + danh mục CLS chỉ định).
2. Bác sĩ (tại phòng khám) hoặc Thu ngân (tại quầy) có thể xuất phiếu **"Hóa đơn tạm thu & Hướng dẫn nộp tiền"**.
3. Phiếu hiển thị:
   - Mã hóa đơn tạm thu (ví dụ: `INV-260917-088`), ngày giờ phát hành.
   - Bảng kê chi tiết từng dòng dịch vụ kèm đơn giá và thành tiền, tổng số tiền phải nộp (ví dụ: *400.000 đ*).
   - Hướng dẫn nộp tiền: Nộp tiền mặt trực tiếp tại Quầy Thu ngân Tầng 1 hoặc chuyển khoản ngân hàng.
   - **Mã VietQR động:** Tạo tự động theo chuẩn Napas 247, chứa thông tin tài khoản ngân hàng phòng khám, số tiền chính xác, và nội dung chuyển khoản chuẩn hóa (ví dụ: `ENC-032 NGUYEN VAN AN`).
4. Khi bệnh nhân thanh toán tại quầy hoặc qua chuyển khoản VietQR thành công:
   - Hệ thống chuyển trạng thái sang `PAID_AUTHORIZED` (UC-BIL-06).
   - Lệnh chỉ định lập tức xuất hiện trên Worklist của các phòng CLS tương ứng (P.202, P.208...).

---

## UC-BIL-01/06 — Thanh toán và authorize dịch vụ

1. Thu ngân mở Encounter.
2. Hệ thống hiển thị toàn bộ order chưa thanh toán.
3. Thu ngân chọn payment method.
4. Payment được xác nhận.
5. Hệ thống cập nhật Invoice/Payment.
6. Các order đủ điều kiện chuyển `PAID_AUTHORIZED`.
7. Order xuất hiện actionable trên worklist phòng dịch vụ.
8. Journey chuyển sang `WAITING_FOR_DIAGNOSTIC`.

### Alternative
- QR chưa xác nhận → giữ `WAITING_FOR_PAYMENT`.
- Miễn/ghi nợ → áp dụng rule được cấu hình.

---

## UC-LAB-02 — Xác nhận bệnh nhân tại Lab

1. Lab mở order.
2. Quét QR hoặc tìm Encounter.
3. Hệ thống hiển thị hai định danh tối thiểu.
4. KTV xác nhận.
5. Nếu không khớp → không cho tiếp tục.
6. Nếu khớp → tạo specimen/lấy mẫu.

---

## UC-LAB-05 — Nhận result từ LIS/máy

1. Máy/LIS phát result.
2. Integration adapter nhận message.
3. Mapping external code → Analyte.
4. Tìm đúng Service Request/Specimen.
5. Lưu raw source reference.
6. Lưu structured result.
7. Tính abnormal flag nếu rule có.
8. Result state = Draft/Imported.
9. KTV verify.

### Failure
- Không map được code → đưa vào integration error queue.
- Không tìm thấy order → quarantine, không gán nhầm.

---

## UC-LAB-10 — Final lab result

1. KTV/Người có quyền review.
2. Verify Patient/Specimen.
3. Finalize.
4. Result state = `FINAL`.
5. Hệ thống trả result về Encounter.
6. Clinical Workspace nhận notification.
7. Journey cập nhật `PARTIAL_RESULTS` hoặc `RESULTS_COMPLETE`.

---

## UC-US-02 — Ultrasound Workspace

1. Bác sĩ/KTV mở ultrasound order.
2. Hệ thống load Patient/Encounter/Service.
3. Chọn template.
4. Nếu integration có ảnh, load study/image references.
5. Hiển thị metadata.
6. Nhập mô tả.
7. Nhập kết luận.
8. Save Draft hoặc Final.
9. Final report trả về Clinical Workspace.

---

## UC-RES-02 — Xác định partial/all results

1. Hệ thống lấy toàn bộ active Service Request trong Order Round/Encounter.
2. Kiểm tra trạng thái final của từng result.
3. Nếu một phần hoàn tất → `PARTIAL_RESULTS`.
4. Nếu tất cả required results final → `RESULTS_COMPLETE`.
5. Gửi notification cho bác sĩ.

---

## UC-CLN-10 — Tạo chỉ định bổ sung

1. Bác sĩ review result.
2. Chọn “Chỉ định thêm”.
3. Hệ thống tạo Order Round mới.
4. Luồng order → payment → diagnostic chạy lại.
5. Encounter chưa được Completed.

---

## UC-RX-01 — Kê đơn

1. Bác sĩ nhập final diagnosis.
2. Thêm thuốc.
3. Nhập dose/route/duration/instruction.
4. Hệ thống chạy safety checks nếu có.
5. Bác sĩ xác nhận.
6. Hệ thống tạo RX ID.
7. Tạo QR.
8. State = `PRESCRIPTION_READY`.

---

## UC-PHM-01 — Quét RX QR

1. Quầy thuốc quét mã.
2. Hệ thống lấy prescription đã phát hành.
3. Nhân viên không nhập lại thuốc.
4. Hiển thị medication/instruction.
5. Xác nhận cấp phát.
6. Lưu dispensing audit.

---

## UC-CLN-12 — Hoàn tất Encounter

1. Bác sĩ kiểm tra final diagnosis.
2. Kiểm tra required result đã đủ hoặc override có lý do.
3. Prescription được phát hành nếu cần.
4. Follow-up được tạo nếu cần.
5. Encounter = `COMPLETED`.
6. Patient Portal được cập nhật theo quyền chia sẻ.

---

## UC-APT-02 — Tạo lịch tái khám

1. Bác sĩ chọn ngày/khung giờ/chuyên khoa.
2. Hệ thống kiểm tra availability.
3. Tạo appointment.
4. Liên kết Appointment với Encounter nguồn.
5. Schedule notification.

---

## UC-PORT-03 — Bệnh nhân xem/tải kết quả

1. Patient authenticate hoặc dùng secure access mechanism.
2. Chọn visit.
3. Xem Final results được phép.
4. Tải PDF/document nếu có.
5. Hệ thống audit access.

---

## UC-ADM-03 — Quản lý permission theo module/phòng

1. Admin chọn Role.
2. Chọn permission.
3. Có thể giới hạn theo department/room.
4. Lưu.
5. Menu/action của user thay đổi sau khi policy có hiệu lực.
6. Ghi audit.

---

## UC-ADM-06 — Quản lý integration

1. Admin xem integration list.
2. Xem status/last success/last error.
3. Cấu hình endpoint/credential reference/mapping.
4. Test connection.
5. Enable/disable.
6. Error không làm mất dữ liệu core.


# 6. State-based Use Case dependencies

```text
UC-REC-01 Create Encounter
    ↓
UC-CLN-02 Start Examination (Clinical Workspace)
    ↓
UC-ORD-01 Create Order Round (Order Sets / Chỉ định CLS)
    │
    ├─► UC-ORD-06 In Phiếu chỉ định CLS & Lộ trình phòng (P.202, P.208...)
    └─► UC-ORD-07 In Hóa đơn tạm thu & Hướng dẫn nộp tiền VietQR
    ↓
UC-BIL-01 / UC-BIL-04 Nộp tiền tại Quầy hoặc Quét mã VietQR động
    ↓
UC-BIL-06 Authorize Order (Chuyển trạng thái PAID_AUTHORIZED)
    ↓
┌───────────────────────────────────────────────────────────┐
│ UC-LAB / UC-US / UC-IMG / UC-ECG                         │
│ (Bệnh nhân di chuyển đến các phòng P.202, P.208...       │
│  theo bảng hướng dẫn lộ trình 4 bước in trên phiếu)       │
└───────────────────────────────────────────────────────────┘
    ↓
UC-RES-01 Tự động trả kết quả (Auto-return) về máy Bác sĩ
(Bệnh nhân quay lại trước phòng BS ban đầu, KHÔNG chờ giấy)
    ↓
UC-CLN-10 Cần chỉ định bổ sung? ── CÓ ──► UC-ORD-01 (Order Round 2)
    ↓ KHÔNG
UC-RX-01 Kê đơn thuốc & Sinh mã QR đơn thuốc
    ↓
UC-PHM-01 Quét mã QR tại Quầy thuốc (Handoff không gõ lại)
    ↓
UC-CLN-12 Hoàn tất Encounter
    ↓
UC-PORT-03 Bệnh nhân xem kết quả / đơn thuốc trên Patient Portal
```

---

# 7. Priority Definition

- **Must**: cần có để demo/triển khai flow lõi.
- **Should**: quan trọng nhưng có thể triển khai ngay sau core flow.
- **Could**: nâng cao, không block MVP.

---

# 8. Use Case ngoài phạm vi

Không tạo Use Case cho:
- Admission.
- Inpatient bed.
- Ward round.
- Daily inpatient medical order.
- Inpatient discharge.
- Full pharmaceutical procurement/multi-store management.
- Native mobile app.
- Mandatory AI diagnosis.

---

# 9. Traceability quan trọng

| Requirement | Use Cases |
|---|---|
| Unified Patient & Quick-View Drawer | UC-PAT-01 → 09 |
| Encounter | UC-REC-01 → 06 |
| Journey | UC-JRN-01 → 04 |
| Doctor workflow | UC-CLN-01 → 12 |
| Multiple order rounds | UC-ORD-01, UC-CLN-10 |
| Order & Room Routing Slip | UC-ORD-06 |
| Provisional Invoice (VietQR) | UC-ORD-07, UC-BIL-02, UC-BIL-04 |
| Payment gate | UC-BIL-01 → 08 |
| Lab automation | UC-LAB-01 → 12 |
| Ultrasound image/report | UC-US-01 → 08 |
| Auto result return | UC-RES-01 → 03 |
| Prescription QR | UC-RX-01 → 05 |
| Pharmacy handoff | UC-PHM-01 → 03 |
| Patient Portal | UC-PORT-01 → 06 |
| RBAC | UC-ADM-01 → 03 |
| Audit | UC-ADM-07 |

---

# 10. Definition of Done cho core Use Case

Một core UC chỉ được coi là hoàn thành khi:
- Có UI.
- Có authorization.
- Có validation.
- Có audit cần thiết.
- Có state transition.
- Có error path.
- Có API/domain behavior.
- Có test nghiệp vụ cho happy path + ít nhất một failure path.
