## 1. Mục tiêu dự án

Sinh viên phải xây dựng **một ứng dụng di động đa nền tảng bằng React Native** đóng vai trò **điều khiển và giám sát hệ thống IoT trong môi trường thực tế**.

Ứng dụng không chỉ cần chạy được mà phải thể hiện đầy đủ quy trình phát triển phần mềm hiện đại:

### Yêu cầu tổng quát

* Hoạt động như **một sản phẩm hoàn chỉnh**, không phải bản demo rời rạc
* Cài đặt và chạy ổn định trên **thiết bị di động thật**
* Có **tài liệu hướng dẫn sử dụng** và **báo cáo kỹ thuật**

### Yêu cầu kỹ thuật chính

Sinh viên phải vận dụng kiến thức của học phần để:

* Thiết kế **UI/UX hướng người dùng**
* Tổ chức mã nguồn theo **kiến trúc rõ ràng**
* Tạo và sử dụng **components tái sử dụng**
* Tạo và sử dụng **custom hooks**
* Giao tiếp **thời gian thực với thiết bị phần cứng (IoT)**
* Sử dụng **API phần cứng điện thoại** (camera, GPS, mic…)
* Lưu trữ dữ liệu:

  * Cục bộ trên thiết bị
  * Trên máy chủ
* Xây dựng:

  * Cơ chế **bảo mật**
  * **Xử lý lỗi**
  * **Kiểm thử**

---

## 2. Tiêu chí đánh giá chi tiết

Tổng điểm được chia theo các nhóm tiêu chí sau:

---

### 1️⃣ Cấu trúc dự án & kỹ thuật lập trình (0.75 điểm)

Đánh giá khả năng tổ chức mã nguồn chuyên nghiệp:

| Nội dung                 | Mô tả                                                               | Điểm |
| ------------------------ | ------------------------------------------------------------------- | ---- |
| Cấu trúc thư mục rõ ràng | Ví dụ: `components/`, `screens/`, `assets/`, `services/`            | 0.25 |
| Tách biệt màn hình       | Mỗi screen một file riêng, có điều hướng đúng, không lỗi navigation | 0.25 |
| Đặt tên chuẩn            | Tên biến, hàm, component theo coding convention                     | 0.25 |

---

### 2️⃣ Giao diện người dùng – UI (1.5 điểm)

Đánh giá tính trực quan và chuyên nghiệp của giao diện:

| Nội dung            | Mô tả                                         | Điểm |
| ------------------- | --------------------------------------------- | ---- |
| Bố cục rõ ràng      | Không chồng lấn, không cắt chữ, icon dễ hiểu  | 0.5  |
| Hiển thị trạng thái | Có loading, error, pending rõ ràng            | 0.25 |
| Responsive          | Tương thích nhiều kích thước màn hình         | 0.25 |
| Component tự tạo    | Có component tái sử dụng do sinh viên tự viết | 0.25 |
| Logo ứng dụng       | Có nhận diện thương hiệu riêng                | 0.25 |

---

### 3️⃣ Quản lý trạng thái (0.5 điểm)

| Nội dung                | Mô tả                                      | Điểm |
| ----------------------- | ------------------------------------------ | ---- |
| Dùng Hook quản lý state | Không mất dữ liệu khi re-render            | 0.25 |
| Custom Hooks            | Có tự viết hook riêng và sử dụng trong app | 0.25 |

---

### 4️⃣ Kết nối mạng & IoT (1.5 điểm)

| Nội dung                 | Mô tả                                   | Điểm | Phạt            |
| ------------------------ | --------------------------------------- | ---- | --------------- |
| Kết nối thiết bị         | Tối thiểu 1 thiết bị thật hoặc mô phỏng | 0.25 | -1 nếu không có |
| Thông báo lỗi kết nối    | Hiển thị rõ khi mất kết nối             | 0.25 |                 |
| Cập nhật thời gian thực  | Trạng thái thiết bị cập nhật nhanh      | 0.5  |                 |
| Tự nhận diện mạng        | Biết khi có/không có internet           | 0.25 |                 |
| Hiển thị chất lượng mạng | Ví dụ: Tốt / Kém                        | 0.25 |                 |

---

### 5️⃣ Chức năng ứng dụng (1.75 điểm)

| Nội dung                  | Mô tả                                    | Điểm | Phạt            |
| ------------------------- | ---------------------------------------- | ---- | --------------- |
| Điều khiển thiết bị       | Tối thiểu 1 chức năng IoT hoạt động thật | 0.5  | -1 nếu không có |
| Tự động hóa theo ngữ cảnh | Hẹn giờ, cảnh báo, điều kiện môi trường  | 0.25 |                 |
| Gửi thông báo khẩn cấp    | Khi app mở (0.25) + khi app tắt (0.25)   | 0.5  |                 |
| Dùng phần cứng điện thoại | Camera, GPS, Micro…                      | 0.5  |                 |

---

### 6️⃣ Lưu trữ dữ liệu (1 điểm)

| Nội dung        | Mô tả                                  | Điểm | Phạt                   |
| --------------- | -------------------------------------- | ---- | ---------------------- |
| Lưu cục bộ      | AsyncStorage, SQLite…                  | 0.5  |                        |
| Lưu trên server | Firebase, MySQL… + đồng bộ khi có mạng | 0.5  | -0.5 nếu không đồng bộ |

---

### 7️⃣ Bảo mật (0.75 điểm)

| Nội dung            | Mô tả                     | Điểm |
| ------------------- | ------------------------- | ---- |
| Xác thực người dùng | Đăng nhập, lưu phiên      | 0.25 |
| Mã hóa dữ liệu      | Có cơ chế encrypt/decrypt | 0.5  |

---

### 8️⃣ Chạy và kiểm thử (1.5 điểm)

| Nội dung                | Mô tả                | Điểm | Phạt          |
| ----------------------- | -------------------- | ---- | ------------- |
| Chạy trên máy ảo        | Không crash          | 0.5  | -0.25 nếu lỗi |
| Chạy trên máy thật      | Không crash          | 0.5  | -0.75 nếu lỗi |
| Test case & test report | Có tài liệu kiểm thử | 0.5  |               |

---

### 9️⃣ Tài liệu & trình bày (0.75 điểm)

| Nội dung                 | Mô tả                        | Điểm | Phạt            |
| ------------------------ | ---------------------------- | ---- | --------------- |
| Mô tả mã nguồn & cài đặt | Hướng dẫn setup project      | 0.25 | -0.25 nếu thiếu |
| Hướng dẫn sử dụng        | User guide rõ ràng           | 0.25 | -0.5 nếu thiếu  |
| Báo cáo & thuyết trình   | Trình bày đầy đủ về hệ thống | 0.25 | -3 nếu không có |

---

## Tóm tắt yêu cầu cốt lõi

Để đạt điểm cao, ứng dụng cần:

* Kiến trúc rõ ràng, code chuẩn
* UI đẹp, dễ dùng, responsive
* Quản lý state bằng hooks chuẩn
* Kết nối IoT thời gian thực ổn định
* Có tự động hóa và push notification
* Lưu trữ cả local và cloud
* Có xác thực + mã hóa dữ liệu
* Chạy ổn định trên thiết bị thật
* Có test, tài liệu, và báo cáo đầy đủ

