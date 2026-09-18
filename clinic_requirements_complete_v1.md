# YÊU CẦU HỆ THỐNG HOÀN CHỈNH
## Hệ thống hỗ trợ chuyển đổi số quy trình khám chữa bệnh tại phòng khám đa khoa

**Phiên bản:** 1.0  
**Ngày baseline:** 17/09/2026  
**Phạm vi:** Phòng khám đa khoa ngoại trú  
**Định hướng triển khai:** Web-first, role-based, patient-journey-centric  

---

# 1. Cơ sở hình thành yêu cầu

Tài liệu này tổng hợp và hợp nhất yêu cầu từ ba nguồn khảo sát chính:

1. `Tổng hợp khảo sát nghiệp vụ chuyển đổi số phòng khám đa khoa.docx`.
2. `New Recording.m4a` — trao đổi bổ sung về quy trình cận lâm sàng, xét nghiệm, siêu âm, dược và ranh giới ngoại trú/nội trú.
3. `New Recording 5.m4a` — trao đổi bổ sung về luồng tiếp nhận → khám → chỉ định → thanh toán → cận lâm sàng → trả kết quả → kê đơn; QR, web-first, phân quyền theo phòng và patient app/web.

Các yêu cầu trong tài liệu được chia thành:
- **Yêu cầu đã được khảo sát/xác nhận**: xuất phát trực tiếp từ tài liệu hoặc bản ghi.
- **Quyết định thiết kế đề xuất**: được thêm để biến yêu cầu nghiệp vụ thành hệ thống nhất quán; cần được khách hàng xác nhận khi chốt SRS chính thức.

---

# 2. Mục tiêu hệ thống

Hệ thống mới phải giải quyết các vấn đề chính của phần mềm hiện tại:

- Dữ liệu phân tán giữa nhiều phân hệ/phần mềm.
- Bác sĩ khó xem ngay lịch sử khám và các kết quả cũ của bệnh nhân.
- Định danh bệnh nhân chưa ổn định, dễ trùng hồ sơ.
- Nhiều bước vẫn phụ thuộc giấy và gọi điện giữa các phòng.
- Chỉ định cận lâm sàng chưa khép kín từ bác sĩ đến phòng thực hiện.
- Thanh toán chưa đóng vai trò xác nhận/ủy quyền dịch vụ một cách tự động.
- Kết quả một số dịch vụ phải nhập lại thủ công hoặc nằm trong phần mềm hãng.
- Bệnh nhân còn phải đợi bản in hoặc nhận kết quả qua cách thức thủ công.
- Quản lý hẹn khám, tái khám và chăm sóc sau khám còn thiếu.
- Phân quyền theo vị trí/phòng làm việc chưa thể hiện tốt trên giao diện.

Mục tiêu cuối cùng là tạo một quy trình ngoại trú khép kín:

```text
TIẾP NHẬN
→ KHÁM
→ CHỈ ĐỊNH
→ THANH TOÁN
→ THỰC HIỆN CẬN LÂM SÀNG
→ TRẢ KẾT QUẢ TỰ ĐỘNG
→ BÁC SĨ KẾT LUẬN
→ KÊ ĐƠN
→ QUẦY THUỐC (NẾU CÓ)
→ HOÀN TẤT
→ TÁI KHÁM / PATIENT PORTAL
```

---

# 3. Phạm vi hệ thống

## 3.1. Trong phạm vi

Hệ thống bao gồm:

1. Quản lý bệnh nhân, định danh, và tra cứu nhanh hồ sơ qua Side Drawer (Quick-View).
2. Tiếp nhận và tạo lượt khám ngoại trú.
3. Xếp hàng và theo dõi hành trình bệnh nhân.
4. Khám lâm sàng.
5. Timeline lịch sử khám.
6. Chỉ định dịch vụ/cận lâm sàng; xuất Giấy chỉ định CLS kèm số phòng/hướng dẫn di chuyển và Hóa đơn tạm thu kèm mã VietQR động.
7. Thanh toán và trạng thái thanh toán (Payment Gate).
8. Xét nghiệm.
9. Siêu âm.
10. X-quang.
11. Điện tim và các dịch vụ chức năng tương tự.
12. Trả kết quả tự động về lượt khám (không cần chờ lấy giấy tại phòng CLS).
13. Kết luận và kê đơn.
14. Chuyển đơn xuống quầy thuốc bằng mã/QR.
15. Hẹn khám, tái khám và nhắc lịch.
16. Patient Portal dạng web responsive.
17. Báo cáo vận hành.
18. Quản trị, phân quyền, audit, template và integration.
19. Tích hợp với phần mềm/máy xét nghiệm, phần mềm siêu âm, hệ thống X-quang và các hệ thống bên ngoài khi có khả năng kết nối.
20. Hỗ trợ in phiếu y tế chuẩn hóa (phiếu tiếp nhận QR, phiếu chỉ định CLS kèm hướng dẫn lộ trình phòng, hóa đơn tạm thu VietQR, đơn thuốc QR) như phương án chuyển tiếp/hybrid.

## 3.2. Ngoài phạm vi hiện tại

Các nghiệp vụ sau **không thuộc scope của phiên bản này**:

- Nhập viện.
- Quản lý giường bệnh.
- Điều trị nội trú theo khoa.
- Diễn biến bệnh hàng ngày của bệnh nhân nội trú.
- Y lệnh nội trú.
- Theo dõi sinh hiệu theo ngày trong nội trú.
- Đơn thuốc ra viện.
- Giấy ra viện.
- Quản lý kho dược đầy đủ nhiều kho/nhập hàng/chuyển kho/đấu thầu.
- Native mobile app iOS/Android trong MVP.
- CT nếu cơ sở hiện không có dịch vụ CT.
- AI chẩn đoán như chức năng bắt buộc của MVP.

---

# 4. Tác nhân

| Actor | Trách nhiệm chính |
|---|---|
| Bệnh nhân | Đăng ký, thực hiện dịch vụ, xem kết quả, lịch hẹn |
| Lễ tân / Tiếp nhận | Tìm/tạo BN, tạo Encounter, chọn phòng, xếp hàng |
| Bác sĩ khám | Khám, xem lịch sử, chỉ định, xem kết quả, kết luận, kê đơn |
| Thu ngân | Xác nhận các dịch vụ phải thu, thanh toán, hoàn/hủy |
| Kỹ thuật viên xét nghiệm | Nhận order, lấy mẫu, theo dõi, xác nhận kết quả |
| Bác sĩ/KTV siêu âm | Nhận order, nhận ảnh, nhập mô tả/kết luận, duyệt |
| KTV X-quang | Nhận order, thực hiện, trả ảnh/report |
| Nhân viên điện tim | Nhận order, thực hiện, trả kết quả |
| Nhân viên quầy thuốc | Quét mã đơn, lấy đơn, cấp phát |
| Quản lý | Theo dõi dashboard, SLA/TAT, báo cáo |
| Quản trị hệ thống | User, role, danh mục, template, integration, audit |
| LIS / Lab Middleware | Trả kết quả xét nghiệm |
| Máy xét nghiệm | Nguồn dữ liệu analyte/result |
| Ultrasound system/device | Nguồn ảnh + metadata |
| PACS/RIS/X-ray system | Nguồn ảnh/report chẩn đoán hình ảnh |
| Payment Gateway | QR/payment confirmation |
| Notification Provider | SMS/Zalo/Email |
| Patient Portal | Kênh cho bệnh nhân xem dữ liệu được phép |

---

# 5. Thuật ngữ

| Thuật ngữ | Ý nghĩa |
|---|---|
| Patient | Hồ sơ bệnh nhân duy nhất |
| Patient ID | Mã bệnh nhân nội bộ, không phụ thuộc SĐT |
| Encounter | Một lượt khám ngoại trú |
| Service Request | Một chỉ định dịch vụ |
| Order Round | Một đợt chỉ định trong cùng Encounter |
| Diagnostic Result | Kết quả dịch vụ cận lâm sàng |
| Lab Panel | Nhóm xét nghiệm gồm nhiều chỉ số |
| Analyte | Một chỉ số xét nghiệm cụ thể |
| Imaging Study | Một lần thực hiện chẩn đoán hình ảnh |
| Journey State | Trạng thái hiện tại của bệnh nhân trong quy trình |
| Payment Gate | Điều kiện thanh toán/ủy quyền trước khi thực hiện dịch vụ |
| TAT | Turnaround Time |
| Final Result | Kết quả đã duyệt cuối cùng |

---

# 6. Nguyên tắc thiết kế nghiệp vụ

1. **Patient là hồ sơ gốc**.
2. **Encounter là trung tâm của một lần khám**.
3. Mọi chỉ định phải gắn với `Encounter`.
4. Một Encounter có thể có **nhiều Order Round**.
5. Dịch vụ có thu phí chỉ được chuyển sang trạng thái được phép thực hiện khi thanh toán/ủy quyền hợp lệ.
6. Kết quả cận lâm sàng phải tự động gắn ngược về Encounter.
7. Bác sĩ phải nhìn thấy ngay:
   - dị ứng,
   - bệnh nền,
   - thuốc đang dùng,
   - lịch sử gần đây,
   - kết quả bất thường,
   - kết quả mới.
8. Phòng chuyên môn chỉ nhìn các chức năng phù hợp role/phòng.
9. Không bắt người dùng nhập lại dữ liệu đã tồn tại trong hệ thống khác nếu có thể tích hợp.
10. Không xóa lịch sử y tế tùy tiện; sửa kết quả/đơn thuốc cần version/audit.

---

# 7. Quy trình TO-BE tổng thể

## 7.1. Luồng chuẩn

```text
REGISTERED (Tiếp nhận & Cấp STT #032)
→ WAITING_FOR_EXAM (Chờ tại sảnh phòng khám)
→ IN_EXAM (Bác sĩ bắt đầu khám lâm sàng)
→ ORDERED (Bác sĩ tạo Order Round; xuất Phiếu chỉ định CLS + Hóa đơn tạm thu VietQR)
→ WAITING_FOR_PAYMENT (Bệnh nhân cầm hóa đơn nộp tiền tại Quầy hoặc quét VietQR)
→ PAID_AUTHORIZED (Hệ thống tự động kích hoạt dịch vụ sau thanh toán)
→ WAITING_FOR_DIAGNOSTIC (Bệnh nhân di chuyển đến các phòng CLS P.202, P.208... theo hướng dẫn)
→ DIAGNOSTIC_IN_PROGRESS (Thực hiện lấy mẫu xét nghiệm, đo ECG, siêu âm)
→ PARTIAL_RESULTS (Kết quả từng phần hoàn tất)
→ RESULTS_COMPLETE (Đầy đủ kết quả CLS; tự động đẩy về máy bác sĩ)
→ RETURNED_TO_EXAM_AREA (Bệnh nhân quay lại ngồi chờ trước phòng bác sĩ ban đầu)
→ WAITING_FOR_CONCLUSION (Bác sĩ gọi vào hội chẩn/kết luận dựa trên kết quả auto-return)
→ PRESCRIPTION_READY (Bác sĩ kê đơn & phát hành mã QR đơn thuốc)
→ COMPLETED (Quầy thuốc quét QR cấp phát / Bệnh nhân tra cứu trên Patient Portal)
```

## 7.2. Luồng chỉ định bổ sung

Sau khi xem kết quả, bác sĩ có thể:

```text
RESULTS_COMPLETE
→ DOCTOR_REVIEW
→ NEED_MORE_TESTS
→ ORDER_ROUND_2 (Chỉ định bổ sung Đợt 2)
→ WAITING_FOR_PAYMENT (Xuất hóa đơn bổ sung)
→ ...
```

Quy trình có thể lặp nhiều lần cho đến khi bác sĩ đủ thông tin để kết luận.

## 7.3. Bệnh nhân sau cận lâm sàng & Quy định trả kết quả không dùng giấy

Bệnh nhân **tuyệt đối không cần chờ lấy bản in kết quả tại phòng dịch vụ (xét nghiệm, siêu âm, ECG, X-quang)**:
- Ngay khi kỹ thuật viên duyệt kết quả cuối cùng (`FINAL`), hệ thống tự động đẩy dữ liệu có cấu trúc và hình ảnh/báo cáo về màn hình Clinical Workspace của Bác sĩ chỉ định (`auto-return`).
- Bệnh nhân sau khi lấy mẫu máu hoặc hoàn tất thăm dò chức năng chỉ cần **quay trở lại khu vực chờ trước phòng khám bác sĩ ban đầu (ví dụ: Phòng 203 gặp BS. Lê Minh)** theo đúng hướng dẫn Bước 4 đã in trên Phiếu chỉ định.
- Quy định này giải quyết triệt để tình trạng người bệnh đứng chờ đông đúc gây ùn tắc tại hành lang các phòng xét nghiệm và đảm bảo tính liên tục của quy trình khám chữa bệnh.

---

# 8. Yêu cầu chức năng chi tiết

## FR-PAT — Quản lý bệnh nhân

### FR-PAT-001 — Tìm bệnh nhân & Xem nhanh Quick-View Drawer
- Cho phép tìm kiếm đa tiêu chí:
  - Patient ID.
  - Họ tên tiếng Việt có dấu và không dấu.
  - Số điện thoại hiện tại và số điện thoại lịch sử.
  - Ngày sinh (DOB).
  - CCCD / Số định danh cá nhân.
  - Lần khám gần nhất và chuyên khoa khám.
- **Hỗ trợ Patient Quick-View Side Drawer (Popup bên phải):**
  - Khi người dùng bấm nút "Mở hồ sơ" hoặc nhấp vào hàng bệnh nhân trong danh sách tìm kiếm, hệ thống mở một Drawer trượt từ cạnh phải màn hình (độ rộng tối thiểu 480-520px) với lớp phủ mờ nền (backdrop blur) mà không điều hướng rời khỏi trang tra cứu.
  - Nội dung trên Drawer gồm:
    * **Định danh & Hành chính:** Avatar, Mã BN, Họ tên, Tuổi, Giới tính, SĐT, CCCD, Địa chỉ cư trú.
    * **Cảnh báo an toàn người bệnh:** Bảng cảnh báo dị ứng thuốc (ví dụ: *Dị ứng Penicillin phản vệ độ 2*), bệnh nền mãn tính, thuốc đang điều trị định kỳ.
    * **Chỉ số sinh hiệu gần nhất:** Huyết áp, mạch, đường huyết mao mạch, BMI, SpO2.
    * **Tóm tắt lịch sử khám:** Danh sách các lần khám gần nhất, kết quả cận lâm sàng bất thường (`WBC ↑`, `Glucose ↑`), đơn thuốc cũ.
    * **Hành động nhanh tại chân Drawer:** Nút `+ Tiếp nhận khám ngay` (chuyển thẳng sang Screen 07 tạo Encounter), Nút `Mở hồ sơ đầy đủ` (chuyển sang Screen 05 xem chi tiết), và nút đóng.
    * **Cơ chế đóng linh hoạt:** Bấm nút ✕, nhấp chuột vào backdrop bên ngoài, hoặc nhấn phím `Escape` để đóng panel, giữ nguyên từ khóa tìm kiếm và bảng kết quả.

### FR-PAT-002 — Tạo hồ sơ bệnh nhân
Hệ thống cấp Patient ID duy nhất.

### FR-PAT-003 — Phát hiện trùng
Trước khi tạo hồ sơ mới, hệ thống cảnh báo hồ sơ gần giống dựa trên:
- tên,
- ngày sinh,
- giới tính,
- CCCD,
- SĐT.

### FR-PAT-004 — Hợp nhất hồ sơ
Chỉ user có quyền mới được merge; phải lưu lịch sử merge.

### FR-PAT-005 — Hồ sơ sức khỏe thống nhất
Hồ sơ chứa:
- hành chính,
- định danh,
- liên hệ,
- lịch sử liên hệ,
- tiền sử,
- dị ứng,
- bệnh nền,
- Encounter,
- chỉ định,
- kết quả,
- đơn thuốc,
- lịch hẹn,
- tài liệu/hình ảnh.

### FR-PAT-006 — Timeline
Hiển thị theo thời gian:
- ngày khám,
- phòng/khoa,
- bác sĩ,
- chẩn đoán,
- dịch vụ,
- kết quả bất thường,
- đơn thuốc,
- tài liệu.

---

## FR-REC — Tiếp nhận và Encounter

### FR-REC-001
Lễ tân tạo Encounter cho bệnh nhân.

### FR-REC-002
Encounter tối thiểu gồm:
- mã Encounter,
- thời gian tiếp nhận,
- lý do khám,
- loại khám,
- phòng,
- bác sĩ,
- ưu tiên,
- trạng thái.

### FR-REC-003
Hệ thống cấp queue number và QR/mã định danh lượt khám.

### FR-REC-004
Cho phép in phiếu có QR nếu cơ sở vẫn dùng giấy trong giai đoạn chuyển tiếp.

### FR-REC-005
Cho phép chuyển phòng/bác sĩ có lưu audit.

---

## FR-JOURNEY — Theo dõi hành trình

### FR-JOURNEY-001
Hiển thị trạng thái bệnh nhân theo thời gian thực.

### FR-JOURNEY-002
Mỗi transition lưu:
- thời gian,
- actor,
- trạng thái cũ,
- trạng thái mới,
- phòng,
- lý do.

### FR-JOURNEY-003
Hiển thị thời gian chờ tại từng bước.

### FR-JOURNEY-004
Cảnh báo khi vượt SLA/TAT.

### FR-JOURNEY-005
Cho phép lọc theo:
- chuyên khoa,
- phòng,
- trạng thái,
- bác sĩ,
- thời gian.

---

## FR-CLN — Khám lâm sàng

### FR-CLN-001
Bác sĩ có worklist riêng theo phòng/ca.

### FR-CLN-002
Clinical Workspace phải hiển thị Patient Safety Header.

### FR-CLN-003
Cho phép nhập:
- lý do khám,
- bệnh sử,
- tiền sử,
- sinh hiệu,
- khám lâm sàng,
- chẩn đoán sơ bộ,
- ghi chú.

### FR-CLN-004
Bác sĩ xem timeline mà không rời khỏi màn hình khám.

### FR-CLN-005
Bác sĩ nhận thông báo:
- kết quả mới,
- bất thường,
- đã đủ kết quả.

### FR-CLN-006
Bác sĩ có thể tạo thêm Order Round khi cần.

### FR-CLN-007
Không cho hoàn tất Encounter nếu còn order bắt buộc chưa xử lý, trừ user có quyền override và ghi lý do.

### FR-CLN-008 — Xuất in phiếu y tế từ Clinical Workspace
Tại màn hình khám bệnh (Clinical Workspace / Electronic Order), bác sĩ có thể trực tiếp kích hoạt công cụ xuất in 2 biểu mẫu y tế cho bệnh nhân:
- Phiếu chỉ định CLS & Hướng dẫn lộ trình di chuyển phòng khám (giao bệnh nhân cầm đi các phòng CLS).
- Hóa đơn tạm thu viện phí kèm mã VietQR động (để bệnh nhân nộp tiền tại quầy hoặc chuyển khoản ngân hàng).

---

## FR-ORD — Chỉ định điện tử

### FR-ORD-001
Bác sĩ tạo chỉ định trực tiếp trên hệ thống.

### FR-ORD-002
Mỗi chỉ định gồm:
- mã order,
- Patient ID,
- Encounter ID,
- Order Round,
- bác sĩ chỉ định,
- dịch vụ,
- phòng thực hiện,
- mức ưu tiên,
- thời gian,
- trạng thái.

### FR-ORD-003
Hỗ trợ tìm dịch vụ, favorite và order set.

### FR-ORD-004
Order được gửi đến:
- Billing,
- Lab,
- Ultrasound,
- X-ray,
- ECG,
- phòng chức năng tương ứng.

### FR-ORD-005
Hệ thống phải phân biệt:
- ORDERED,
- UNPAID,
- PAID_AUTHORIZED,
- IN_PROGRESS,
- COMPLETED,
- CANCELED.

### FR-ORD-006
Cho phép hủy/chỉnh order theo quyền và trạng thái.

### FR-ORD-007 — Xuất Giấy chỉ định CLS & Hướng dẫn lộ trình phòng khám
Hệ thống cho phép xuất/in mẫu phiếu chỉ định y tế chuẩn hóa dành cho bệnh nhân ngoại trú:
- **Thông tin hành chính & đợt khám:** Tên cơ sở y tế, Mã Encounter, STT khám bệnh (#032), Mã BN, Họ tên, Tuổi/Giới, SĐT, CCCD, Phòng khám ban đầu, Chẩn đoán sơ bộ (ICD-10).
- **Cảnh báo an toàn người bệnh:** Cảnh báo nổi bật dị ứng thuốc (ví dụ: *Dị ứng Penicillin*) và các lưu ý lâm sàng đặc biệt.
- **Bảng danh mục dịch vụ cận lâm sàng:**
  - Tên kỹ thuật chỉ định và mã dịch vụ.
  - **Phòng thực hiện cụ thể (kèm số phòng & tầng)**: ví dụ *Phòng Xét nghiệm P.202 Tầng 2*, *Phòng Điện tim P.208 Tầng 2*, *Phòng Siêu âm P.105 Tầng 1*...
  - Hướng dẫn chuẩn bị chuyên môn: nhịn ăn sáng, ngưng dùng thuốc, nghỉ ngơi thả lỏng trước khi đo...
  - Đơn giá từng dịch vụ và tổng tiền tạm tính.
- **Khung hướng dẫn lộ trình di chuyển 4 bước cho người bệnh:**
  - *Bước 1 (Nộp tiền):* Mang phiếu xuống Quầy Thu ngân Tầng 1 thanh toán (tiền mặt hoặc VietQR) để hệ thống tự động authorize dịch vụ (`PAID_AUTHORIZED`).
  - *Bước 2 (Lấy mẫu):* Lên Phòng Xét nghiệm P.202 Tầng 2 xuất trình phiếu lấy máu/nước tiểu.
  - *Bước 3 (Thực hiện CĐHA/Thăm dò):* Sang Phòng Điện tim P.208 Tầng 2 đo ECG hoặc phòng Siêu âm.
  - *Bước 4 (Kết luận):* Bệnh nhân **quay trở lại ngồi chờ trước phòng khám bác sĩ ban đầu (P.203 gặp BS. Lê Minh)**; kết quả cận lâm sàng sẽ **tự động trả về máy tính của bác sĩ (auto-return)**, bệnh nhân **KHÔNG CẦN CHỜ LẤY BẢN IN KẾT QUẢ TẠI CÁC PHÒNG XÉT NGHIỆM**.
- **Mã vạch / QR Encounter:** Cho phép kỹ thuật viên tại các phòng CLS quét nhận diện bệnh nhân và đối soát 2 định danh an toàn.
- **Chữ ký bác sĩ chỉ định:** Họ tên, chữ ký và số chứng chỉ hành nghề của bác sĩ.

### FR-ORD-008 — Xuất Hóa đơn tạm thu & Hướng dẫn nộp tiền (VietQR)
- Bác sĩ tại phòng khám hoặc Thu ngân tại quầy có thể xuất phiếu "Hóa đơn tạm thu & Hướng dẫn nộp tiền" ngay khi phát sinh y lệnh chỉ định dịch vụ.
- Phiếu hiển thị bảng kê chi phí:
  - Mã hóa đơn tạm thu (`INV-...`), ngày giờ lập phiếu.
  - Từng khoản mục: Tiền khám chuyên khoa, từng xét nghiệm/thủ thuật, tổng số tiền viện phí phải nộp.
  - Hướng dẫn thanh toán tại Quầy thu ngân Tầng 1 (tiền mặt / POS).
  - **Mã VietQR động:** Chuẩn Napas 247, tự động nạp Số tài khoản phòng khám, Số tiền chính xác, và Nội dung chuyển khoản chuẩn hóa (chứa Mã Encounter + Họ tên BN).
  - Hệ thống tự động kích hoạt trạng thái `PAID_AUTHORIZED` qua Webhook ngân hàng khi giao dịch thành công.

---

## FR-BIL — Billing & Payment

### FR-BIL-001
Thu ngân xem danh sách dịch vụ theo Encounter.

### FR-BIL-002
Tính tổng tiền theo bảng giá.

### FR-BIL-003
Hỗ trợ:
- tiền mặt,
- thẻ,
- QR động (VietQR).

### FR-BIL-004
Nếu dùng QR/payment gateway, hệ thống nhận trạng thái thanh toán qua webhook/API.

### FR-BIL-005
Khi thanh toán thành công:
- Payment = CONFIRMED.
- Các order đủ điều kiện = PAID_AUTHORIZED.
- Phòng CLS nhận order actionable.

### FR-BIL-006
Hỗ trợ thu thêm khi bác sĩ chỉ định bổ sung.

### FR-BIL-007
Hỗ trợ hoàn/hủy theo quyền.

### FR-BIL-008 — Hóa đơn, chứng từ và Phiếu thu tạm tính
- Hỗ trợ xuất hóa đơn điện tử / phiếu thu viện phí chính thức sau khi thanh toán.
- Đồng bộ dữ liệu và đối soát tự động với phiếu Hóa đơn tạm thu và mã VietQR được phát hành từ phòng khám bác sĩ.

---

## FR-LAB — Xét nghiệm

### FR-LAB-001
Có Lab Worklist riêng.

### FR-LAB-002
Chỉ hiển thị order đủ điều kiện thực hiện.

### FR-LAB-003
Xác nhận bệnh nhân bằng tối thiểu hai định danh; QR/barcode là phương án hỗ trợ.

### FR-LAB-004
Hỗ trợ specimen:
- mã mẫu,
- loại mẫu,
- thời gian lấy,
- người lấy,
- trạng thái.

### FR-LAB-005
Danh mục xét nghiệm phải hỗ trợ cấu trúc:
- Test Group,
- Panel,
- Analyte.

### FR-LAB-006
Analyte gồm:
- code,
- name,
- value type,
- unit,
- reference range,
- abnormal flag,
- machine mapping code.

### FR-LAB-007
Nhận kết quả tự động từ LIS/middleware/máy khi có integration.

### FR-LAB-008
Cho phép nhập tay khi integration unavailable và phải audit nguồn nhập.

### FR-LAB-009
Hỗ trợ result lifecycle:
- Draft,
- Verified,
- Final,
- Corrected.

### FR-LAB-010
Kết quả Final tự động trả về bác sĩ.

---

## FR-US — Siêu âm

### FR-US-001
Có Ultrasound Worklist riêng.

### FR-US-002
Cho phép chọn/chuyển report template phù hợp dịch vụ.

### FR-US-003
Template được version hóa.

### FR-US-004
Hệ thống có thể đề xuất template theo loại siêu âm/tuổi thai nếu đủ dữ liệu.

### FR-US-005
Hỗ trợ nhận hình ảnh từ máy/phần mềm siêu âm khi tích hợp được.

### FR-US-006
Lưu:
- image/study reference,
- metadata,
- thời gian,
- thiết bị,
- người thực hiện,
- mô tả,
- kết luận.

### FR-US-007
Kết quả Final tự động trả về Clinical Workspace.

---

## FR-IMG — X-quang / Imaging

### FR-IMG-001
Có worklist theo modality/phòng.

### FR-IMG-002
Hỗ trợ image/report reference.

### FR-IMG-003
Có thể tích hợp PACS/RIS/DICOMweb nếu hệ thống bên ngoài hỗ trợ.

### FR-IMG-004
Không bắt buộc CT trong scope hiện tại.

---

## FR-ECG — Điện tim

### FR-ECG-001
Nhận order đủ điều kiện.

### FR-ECG-002
Lưu kết quả dạng structured data hoặc report/file tùy thiết bị.

### FR-ECG-003
Trả kết quả tự động về Encounter khi hoàn tất.

---

## FR-RES — Kết quả

### FR-RES-001
Mọi kết quả phải gắn Patient + Encounter + Service Request.

### FR-RES-002
Bác sĩ phải thấy trạng thái partial/all results.

### FR-RES-003
Kết quả bất thường phải được đánh dấu.

### FR-RES-004
Sửa kết quả đã Final tạo phiên bản Corrected, không ghi đè lịch sử.

### FR-RES-005
Lưu ai duyệt, thời gian duyệt, nguồn dữ liệu.

---

## FR-RX — Kê đơn

### FR-RX-001
Bác sĩ kê đơn trên hệ thống.

### FR-RX-002
Mỗi prescription gồm:
- mã RX,
- thuốc,
- hàm lượng,
- liều,
- đường dùng,
- số ngày,
- hướng dẫn,
- bác sĩ,
- thời gian.

### FR-RX-003
Hệ thống tạo mã/QR đơn thuốc.

### FR-RX-004
Có thể cảnh báo:
- dị ứng,
- trùng hoạt chất,
- tương tác thuốc,
- liều bất thường.

### FR-RX-005
Cảnh báo chỉ mang tính hỗ trợ; bác sĩ quyết định cuối cùng.

### FR-RX-006
Sửa đơn đã phát hành phải version.

---

## FR-PHM — Handoff sang quầy thuốc

### FR-PHM-001
Quầy thuốc quét QR/mã RX để lấy đúng đơn.

### FR-PHM-002
Không yêu cầu nhân viên nhập lại toàn bộ đơn thuốc.

### FR-PHM-003
Cho phép xác nhận cấp phát.

### FR-PHM-004
MVP không bắt buộc quản lý đầy đủ procurement/multi-store warehouse.

---

## FR-APT — Lịch hẹn/tái khám

### FR-APT-001
Đặt lịch theo bác sĩ/chuyên khoa.

### FR-APT-002
Tạo lịch tái khám từ Encounter.

### FR-APT-003
Tránh trùng khung giờ theo rule cấu hình.

### FR-APT-004
Theo dõi:
- Confirmed,
- Unconfirmed,
- Arrived,
- No-show,
- Canceled.

### FR-APT-005
Nhắc lịch qua kênh cấu hình.

---

## FR-PORTAL — Patient Portal

### FR-PORTAL-001
Portal là web responsive trong MVP.

### FR-PORTAL-002
Bệnh nhân xem:
- lịch sử,
- kết quả,
- prescription,
- appointment,
- hóa đơn/chứng từ được phép.

### FR-PORTAL-003
Cho phép tải tài liệu điện tử.

### FR-PORTAL-004
Cho phép truy cập kết quả bằng đường dẫn bảo mật/QR nếu được cấu hình.

### FR-PORTAL-005
Không gửi tài liệu y tế nhạy cảm trực tiếp qua kênh chat cá nhân như workflow chính.

### FR-PORTAL-006
Cho phép cập nhật liên hệ theo quy trình xác minh.

---

## FR-NOT — Notification

### FR-NOT-001
Thông báo khi:
- có kết quả mới,
- có kết quả bất thường,
- đủ kết quả,
- tới lịch hẹn,
- có thay đổi lịch.

### FR-NOT-002
Hỗ trợ adapter cho SMS/Zalo/Email.

---

## FR-RPT — Báo cáo

### FR-RPT-001
Dashboard vận hành:
- số bệnh nhân chờ,
- đang khám,
- đang làm CLS,
- đủ kết quả,
- completed.

### FR-RPT-002
Báo cáo TAT/SLA.

### FR-RPT-003
Báo cáo doanh thu/dịch vụ.

### FR-RPT-004
Báo cáo lịch hẹn/no-show.

### FR-RPT-005
Xuất dữ liệu phục vụ yêu cầu quản lý khi cần.

---

## FR-ADM — Quản trị

### FR-ADM-001
Quản lý user.

### FR-ADM-002
Quản lý role và permission.

### FR-ADM-003
Role/phòng quyết định menu và chức năng hiển thị.

### FR-ADM-004
Quản lý:
- phòng,
- chuyên khoa,
- dịch vụ,
- bảng giá,
- thuốc/danh mục dùng cho kê đơn,
- lab catalog,
- template.

### FR-ADM-005
Quản lý integration endpoint/mapping.

### FR-ADM-006
Audit log.

### FR-ADM-007
Backup/restore configuration.

---

# 9. Business Rules

## BR-001 — Unique patient
Một người bệnh chỉ nên có một Patient record chính.

## BR-002 — Encounter isolation
Mọi nghiệp vụ của một lần khám phải trace được qua Encounter ID.

## BR-003 — Payment gate
Dịch vụ có thu phí không được chuyển sang actionable state nếu chưa được thanh toán/ủy quyền, trừ rule miễn/ghi nợ/đối tượng đặc biệt được cấu hình.

## BR-004 — Multiple order rounds
Một Encounter có thể có nhiều Order Round.

## BR-005 — Result immutability
Final result không được sửa trực tiếp; phải tạo corrected version.

## BR-006 — Prescription handoff
Quầy thuốc lấy đơn từ RX ID/QR thay vì nhập lại.

## BR-007 — Role visibility
User không thấy module ngoài phạm vi được cấp quyền.

## BR-008 — Outpatient only
Encounter trong scope là outpatient; không tự động mở flow nội trú.

## BR-009 — Safe patient identification
Tại CLS cần đối chiếu tối thiểu hai thông tin nhận diện.

## BR-010 — Hybrid print
In giấy có QR được phép như phương án song hành/fallback (phiếu tiếp nhận STT, giấy chỉ định CLS kèm sơ đồ phòng, hóa đơn tạm thu VietQR, đơn thuốc), nhưng dữ liệu nguồn luôn là dữ liệu điện tử đồng bộ tức thì trên hệ thống.

## BR-011 — Diagnostic Routing & Paperless Result Return
Phiếu chỉ định cận lâm sàng cấp cho người bệnh bắt buộc phải ghi rõ vị trí/số phòng thực hiện (P.202, P.208...) và hướng dẫn lộ trình 4 bước. Các phòng cận lâm sàng (Xét nghiệm, Siêu âm, X-quang, Điện tim) tuyệt đối không in trả kết quả giấy cho bệnh nhân tại chỗ; kết quả bắt buộc trả tự động (`auto-return`) qua hệ thống về Clinical Workspace của Bác sĩ chỉ định, và người bệnh quay lại ngồi chờ tại phòng khám ban đầu.

## BR-012 — Patient Quick-view Safety Verification
Chức năng xem nhanh hồ sơ bệnh nhân (Side Drawer) tại màn hình tra cứu phải hiển thị nổi bật thông tin an toàn (dị ứng thuốc, bệnh lý nền mãn tính) và sinh hiệu gần nhất trước khi người dùng thực hiện tiếp nhận lượt khám mới.

---

# 10. Data Model cấp cao

```text
Patient
 ├─ PatientIdentifier
 ├─ PatientContactHistory
 ├─ Allergy (Mức độ phản vệ, hoạt chất dị ứng)
 ├─ Condition (Bệnh lý nền mãn tính)
 ├─ Encounter [1..N]
 │   ├─ EncounterStatusHistory
 │   ├─ ClinicalNote
 │   ├─ Diagnosis
 │   ├─ OrderRound [1..N]
 │   │   ├─ ProvisionalInvoice (VietQR Code, Bảng kê chi phí)
 │   │   └─ ServiceRequest [1..N]
 │   │       ├─ RoomLocation (Phòng thực hiện & Vị trí tầng)
 │   │       ├─ PreparationInstructions (Hướng dẫn bệnh nhân)
 │   │       ├─ PaymentAuthorization
 │   │       ├─ Specimen
 │   │       ├─ LabResult
 │   │       ├─ ImagingStudy
 │   │       └─ DiagnosticReport
 │   ├─ Prescription
 │   ├─ Invoice
 │   └─ Payment
 ├─ Appointment
 ├─ Document
 └─ Notification
```

Lab catalog:

```text
LabTestGroup
 └─ LabPanel
     └─ AnalyteDefinition
         ├─ code
         ├─ unit
         ├─ valueType
         ├─ referenceRule
         └─ machineMapping
```

Imaging:

```text
ImagingStudy
 ├─ modality
 ├─ device
 ├─ metadata
 ├─ imageReferences[]
 └─ DiagnosticReport
```

---

# 11. Integration Requirements

## INT-001
Tất cả integration đi qua adapter/integration layer, không nhúng logic vendor vào core domain.

## INT-002
Lab:
- LIS,
- middleware,
- analyzer/device.

## INT-003
Imaging:
- Ultrasound system,
- X-ray/PACS/RIS khi có.

## INT-004
Payment:
- dynamic QR/payment gateway,
- webhook confirmation.

## INT-005
Notification:
- SMS,
- Zalo OA,
- Email.

## INT-006
Patient Portal sử dụng API cùng backend, nhưng authorization tách rõ patient/staff.

## INT-007
Mọi integration phải có:
- request log,
- response log an toàn,
- retry,
- status,
- error monitoring,
- idempotency nếu cần.

---

# 12. Yêu cầu phi chức năng

## NFR-SEC — Bảo mật

- RBAC theo role và phòng ban.
- Least privilege.
- Audit ai xem/sửa hồ sơ.
- Không xóa tùy tiện lịch sử y tế.
- Encrypt in transit.
- Bảo vệ dữ liệu nhạy cảm khi lưu.
- Session timeout.
- MFA có thể bổ sung cho nhóm quyền cao.
- Patient consent khi chia sẻ dữ liệu nếu nghiệp vụ yêu cầu.

## NFR-PERF — Hiệu năng

Mục tiêu đề xuất:
- Search bệnh nhân < 2 giây trong điều kiện bình thường.
- Mở Clinical Workspace < 3 giây với lịch sử gần.
- State update trên Journey Board gần real-time.
- Integration result ingestion có cơ chế queue/retry.

## NFR-AVAIL — Khả dụng

- Backup định kỳ.
- Có restore test.
- Không mất order/result khi integration tạm mất kết nối.
- Có retry/idempotency cho webhook.

## NFR-USAB — UX

- Desktop-first 1440px cho staff.
- Patient Portal responsive.
- Không dùng màu là tín hiệu duy nhất.
- Tác vụ thường dùng không nên nằm sâu quá nhiều bước.
- Patient safety information luôn nổi bật.

## NFR-AUD — Audit

Audit tối thiểu:
- login/logout,
- xem hồ sơ nhạy cảm,
- merge patient,
- sửa clinical note,
- create/cancel order,
- payment,
- result verify/final/correct,
- prescription issue/correct,
- permission change.

---

# 13. Screen Scope sau baseline mới

1. Login
2. Role-based Dashboard
3. Patient Search (Kèm Quick-View Side Drawer xem nhanh hồ sơ & tiếp nhận nhanh)
4. New Patient / Duplicate Check
5. Patient Profile
6. Patient Timeline
7. Reception / New Encounter
8. Patient Journey Board
9. Doctor Worklist
10. Clinical Workspace (Kèm Modal xuất/in Giấy khám & Chỉ định CLS, Hóa đơn nộp tiền VietQR)
11. Electronic Order / Order Round (Kèm tính viện phí tạm tính, in Giấy chỉ định phòng CLS & Hóa đơn QR)
12. Billing & Payment
13. Lab Worklist
14. Lab Specimen
15. Lab Result Workspace
16. Ultrasound Worklist
17. Ultrasound Workspace
18. X-ray / ECG Worklist
19. Generic Diagnostic Result / Report
20. Prescription & Finish Visit
21. Pharmacy Handoff / Dispensing
22. Appointments
23. Patient Portal
24. Reports
25. Admin / Templates / Integration / Audit

---

# 14. Phân quyền UI đề xuất

## Lễ tân
- Patient Search
- New Patient
- Reception
- Journey
- Appointments

## Bác sĩ
- Dashboard
- Doctor Worklist
- Patient Profile
- Timeline
- Clinical Workspace
- Order
- Results
- Prescription

## Lab
- Lab Worklist
- Specimen
- Lab Result

## Siêu âm
- Ultrasound Worklist
- Ultrasound Workspace

## X-quang/ECG
- Worklist tương ứng
- Result/Report

## Thu ngân
- Billing
- Payment

## Quầy thuốc
- Prescription Lookup
- Dispensing Confirmation

## Quản lý
- Dashboard
- Reports
- Journey

## Admin
- Users
- Roles
- Catalog
- Templates
- Integrations
- Audit

---

# 15. MVP khuyến nghị

## MVP Core

- Patient unified record.
- Duplicate detection.
- Timeline.
- Encounter.
- Doctor Worklist.
- Clinical Workspace.
- Electronic Order.
- Payment status/gate.
- Patient Journey.
- Lab model + Lab result ingestion.
- Ultrasound result + image attachment/reference.
- Automatic result return.
- Prescription + QR.
- Responsive Patient Portal.
- RBAC.

## Phase 2

- Full payment gateway integration.
- PACS/DICOMweb integration.
- Appointment automation.
- Advanced reports.
- Notification automation.
- E-invoice integration.
- External reporting integrations.

## Phase 3

- Advanced pharmacy.
- Native mobile app.
- AI clinical decision support.
- AI imaging assistance.

---

# 16. Open Questions cần chốt với khách hàng

1. Danh sách CLS đang thực hiện **tại chỗ** chính xác gồm những gì?
2. Nội soi, EEG, đo loãng xương, HP test còn đang sử dụng hay không?
3. Dịch vụ nào gửi ngoài?
4. Payment gate có ngoại lệ cho công ty/bảo hiểm/công nợ không?
5. Bệnh nhân phải quay về đúng phòng bác sĩ ban đầu hay về một waiting area chung?
6. Xét nghiệm hiện dùng LIS/middleware/hãng máy nào?
7. Máy siêu âm hỗ trợ chuẩn/giao thức nào?
8. X-quang hiện có PACS/RIS hay chỉ phần mềm hãng?
9. Quầy thuốc có cần tích hợp với hệ thống dược hiện hữu hay xây mới phần cấp phát?
10. Patient Portal cần tài khoản/password, OTP hay secure-link?
11. Có yêu cầu chữ ký số cho result/prescription không?
12. QR trên phiếu là QR Patient, Encounter, Order hay kết hợp?
13. Dữ liệu cũ cần migrate bao nhiêu năm?
14. Có cần xử lý khám sức khỏe doanh nghiệp trong MVP hay phase sau?

---

# 17. Acceptance Criteria cấp hệ thống

Hệ thống được xem là đáp ứng luồng lõi khi có thể demo trọn vẹn:

```text
Tìm đúng bệnh nhân
→ Tạo Encounter
→ Bác sĩ khám
→ Tạo Order Round
→ Thu ngân thanh toán
→ Lab/Siêu âm nhận order
→ Trả kết quả
→ Bác sĩ nhận kết quả
→ Tạo order bổ sung nếu cần
→ Kết luận
→ Kê đơn
→ Quầy thuốc quét mã đơn
→ Hoàn tất
→ Bệnh nhân xem kết quả trên web
```

Không có bước bắt buộc nào trong flow trên yêu cầu nhập lại toàn bộ dữ liệu đã được sinh ra ở bước trước.
