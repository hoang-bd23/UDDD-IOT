# SmartHome IoT - React Native App

> **Project Type:** MOBILE (React Native)  
> **Primary Agent:** `mobile-developer`  
> **Skills:** `mobile-design`, `clean-code`, `testing-patterns`

---

## 📋 Tổng quan dự án

Xây dựng ứng dụng điều khiển thiết bị IoT thông minh bằng React Native, kết nối với Raspberry Pi 4 qua local WiFi và Firebase để điều khiển từ xa. Tích hợp **camera giám sát** qua Raspberry Pi Camera Module.

### Mục tiêu chính

| Mục tiêu | Mô tả |
|----------|-------|
| **Điều khiển thiết bị** | Bật/tắt đèn LED nhỏ (test phase) |
| **Camera giám sát** | Stream video từ Raspberry Pi Camera Module |
| **Giao diện hiện đại** | UI/UX tốt hơn example SmartLight, dark/light mode, responsive |
| **Tính năng đầy đủ** | Schedule, dimmer, RGB, rooms, notifications, login |
| **Kết nối đa dạng** | Local WiFi (Raspberry Pi) + Firebase (remote control) |
| **Đáp ứng tiêu chí** | 10 điểm theo 9 nhóm tiêu chí đánh giá |

---

## ✅ Success Criteria (Tiêu chí đánh giá - 10 điểm)

### 1️⃣ Cấu trúc dự án & Kỹ thuật (0.75 điểm)

- [ ] Cấu trúc thư mục: `components/`, `screens/`, `hooks/`, `services/`, `assets/` (0.25)
- [ ] Mỗi screen một file riêng, navigation đúng (0.25)
- [ ] Naming convention chuẩn: camelCase, PascalCase (0.25)

### 2️⃣ Giao diện UI (1.5 điểm)

- [ ] Bố cục rõ ràng, không chồng lấn (0.5)
- [ ] Loading, error, pending states (0.25)
- [ ] Responsive nhiều kích thước (0.25)
- [ ] Component tái sử dụng tự viết (0.25)
- [ ] Logo ứng dụng riêng (0.25)

### 3️⃣ Quản lý trạng thái (0.5 điểm)

- [ ] Hooks quản lý state (0.25)
- [ ] Custom hooks tự viết (0.25)

### 4️⃣ Kết nối mạng & IoT (1.5 điểm)

- [ ] Kết nối thiết bị thật/mô phỏng (0.25) - **CRITICAL: -1 nếu không có**
- [ ] Thông báo lỗi kết nối (0.25)
- [ ] Cập nhật thời gian thực (0.5)
- [ ] Tự nhận diện mạng online/offline (0.25)
- [ ] Hiển thị chất lượng mạng (0.25)

### 5️⃣ Chức năng ứng dụng (1.75 điểm)

- [ ] Điều khiển thiết bị IoT thật (0.5) - **CRITICAL: -1 nếu không có**
- [ ] Tự động hóa: hẹn giờ, cảnh báo (0.25)
- [ ] Push notification: app mở (0.25) + app tắt (0.25)
- [ ] Dùng phần cứng điện thoại (camera/GPS/mic) (0.5)

### 6️⃣ Lưu trữ dữ liệu (1 điểm)

- [ ] Lưu cục bộ: AsyncStorage (0.5)
- [ ] Lưu server: Firebase + đồng bộ khi có mạng (0.5)

### 7️⃣ Bảo mật (0.75 điểm)

- [ ] Xác thực người dùng: đăng nhập, session (0.25)
- [ ] Mã hóa dữ liệu: encrypt/decrypt (0.5)

### 8️⃣ Chạy và kiểm thử (1.5 điểm)

- [ ] Chạy trên máy ảo không crash (0.5)
- [ ] Chạy trên máy thật không crash (0.5)
- [ ] Test case & test report (0.5)

### 9️⃣ Tài liệu & Trình bày (0.75 điểm)

- [ ] Mô tả mã nguồn & cài đặt (0.25)
- [ ] Hướng dẫn sử dụng (0.25)
- [ ] Báo cáo & thuyết trình (0.25)

---

## 🛠️ Tech Stack

| Layer | Technology | Lý do |
|-------|------------|-------|
| **Framework** | React Native CLI | Cross-platform, yêu cầu đề bài |
| **Language** | JavaScript | Yêu cầu của project |
| **State** | React Context + Hooks | Built-in, không cần thêm library |
| **Navigation** | React Navigation | Standard, Tab + Stack pattern |
| **Storage** | AsyncStorage + SecureStore | Local + Secure token storage |
| **Cloud** | Firebase Realtime DB + Auth | Real-time sync, authentication |
| **HTTP** | Axios / Fetch | HTTP client to Raspberry Pi |
| **Push** | Firebase Cloud Messaging | Background notifications |
| **Hardware** | Raspberry Pi 4 + GPIO + Camera | LED control + Video streaming |

---

## 📁 Cấu trúc thư mục

```
SmartHomeIoT/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── Button/
│   │   ├── Card/
│   │   ├── DeviceCard/
│   │   ├── RoomCard/
│   │   ├── ScheduleItem/
│   │   ├── NetworkStatus/
│   │   └── LoadingSpinner/
│   │
│   ├── screens/              # Application screens
│   │   ├── Auth/
│   │   │   ├── LoginScreen.js
│   │   │   └── RegisterScreen.js
│   │   ├── Home/
│   │   │   └── HomeScreen.js
│   │   ├── Rooms/
│   │   │   ├── RoomsScreen.js
│   │   │   └── RoomDetailScreen.js
│   │   ├── Devices/
│   │   │   ├── DevicesScreen.js
│   │   │   └── DeviceDetailScreen.js
│   │   ├── Schedule/
│   │   │   ├── ScheduleScreen.js
│   │   │   └── AddScheduleScreen.js
│   │   ├── Settings/
│   │   │   └── SettingsScreen.js
│   │   └── Camera/
│   │       ├── CameraScreen.js
│   │       └── LiveStreamScreen.js
│   │
│   ├── hooks/                # Custom hooks
│   │   ├── useAuth.js
│   │   ├── useDevice.js
│   │   ├── useNetwork.js
│   │   ├── useSchedule.js
│   │   ├── useFirebase.js
│   │   ├── useCamera.js
│   │   └── useEncryption.js
│   │
│   ├── services/             # Business logic
│   │   ├── api/
│   │   │   ├── raspberryPi.js
│   │   │   ├── cameraStream.js
│   │   │   └── firebase.js
│   │   ├── storage/
│   │   │   ├── asyncStorage.js
│   │   │   └── secureStorage.js
│   │   ├── notification/
│   │   │   └── pushNotification.js
│   │   └── encryption/
│   │       └── cryptoService.js
│   │
│   ├── context/              # React Context for state
│   │   ├── AuthContext.js
│   │   ├── DeviceContext.js
│   │   ├── RoomContext.js
│   │   └── ScheduleContext.js
│   │
│   ├── navigation/           # Navigation config
│   │   ├── AppNavigator.js
│   │   ├── AuthNavigator.js
│   │   └── MainNavigator.js
│   │
│   ├── utils/                # Utility functions
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   └── validators.js
│   │
│   ├── assets/               # Static assets
│   │   ├── images/
│   │   ├── icons/
│   │   └── fonts/
│   │
│   └── styles/               # CSS/StyleSheet files
│       ├── colors.js
│       ├── typography.js
│       ├── spacing.js
│       ├── globalStyles.js
│       └── index.js
│
├── raspberry-pi/             # Raspberry Pi server code
│   ├── led_server.py         # LED control API
│   ├── camera_server.py      # Camera streaming server
│   ├── requirements.txt
│   └── README.md
│
├── docs/                     # Documentation
│   ├── USER_GUIDE.md
│   ├── SETUP_GUIDE.md
│   ├── API_DOCS.md
│   └── TEST_REPORT.md
│
├── __tests__/                # Tests
│   ├── components/
│   ├── hooks/
│   ├── services/
│   └── e2e/
│
├── android/
├── ios/
├── App.js
├── package.json
└── README.md
```

---

## 📋 Task Breakdown

### Phase 1: Foundation (Nền tảng) - Agent: `mobile-developer`

#### Task 1.1: Project Setup
**Priority:** P0 | **Dependencies:** None

| INPUT | OUTPUT | VERIFY |
|-------|--------|--------|
| Requirements | React Native project với JavaScript | `npx react-native run-android` chạy không lỗi |

- [ ] Khởi tạo React Native CLI project (không TypeScript)
- [ ] Cài đặt dependencies cơ bản
- [ ] Tạo cấu trúc thư mục theo plan

#### Task 1.2: Theme & Design System
**Priority:** P0 | **Dependencies:** Task 1.1

| INPUT | OUTPUT | VERIFY |
|-------|--------|--------|
| UI requirements | Theme files hoàn chỉnh | Import theme và sử dụng được |

- [ ] Tạo color palette (dark/light mode)
- [ ] Tạo typography scale
- [ ] Tạo spacing system
- [ ] Tạo base components (Button, Card, Input)

#### Task 1.3: Navigation Structure
**Priority:** P0 | **Dependencies:** Task 1.1

| INPUT | OUTPUT | VERIFY |
|-------|--------|--------|
| Screen wireframes | Navigation hoạt động | Điều hướng giữa các tab không lỗi |

- [ ] Cài đặt React Navigation
- [ ] Tạo AuthNavigator (Login, Register)
- [ ] Tạo MainNavigator (Tabs + Stack)
- [ ] Cấu hình deep linking

---

### Phase 2: Authentication & Storage - Agent: `mobile-developer`

#### Task 2.1: Firebase Setup
**Priority:** P0 | **Dependencies:** Task 1.1

| INPUT | OUTPUT | VERIFY |
|-------|--------|--------|
| Firebase project | Firebase configured | Login với email thành công |

- [ ] Tạo Firebase project
- [ ] Cấu hình Firebase Auth
- [ ] Cấu hình Firebase Realtime Database
- [ ] Cấu hình Firebase Cloud Messaging

#### Task 2.2: Authentication Flow
**Priority:** P1 | **Dependencies:** Task 2.1

| INPUT | OUTPUT | VERIFY |
|-------|--------|--------|
| Firebase Auth | Login/Register screens | User có thể đăng ký và đăng nhập |

- [ ] Tạo LoginScreen với form validation
- [ ] Tạo RegisterScreen
- [ ] Implement useAuth hook
- [ ] Lưu session với SecureStore
- [ ] Implement logout

#### Task 2.3: Data Encryption
**Priority:** P1 | **Dependencies:** Task 2.2

| INPUT | OUTPUT | VERIFY |
|-------|--------|--------|
| Sensitive data | Encrypted storage | Decrypt và verify data đúng |

- [ ] Implement cryptoService với AES-256
- [ ] Encrypt sensitive data trước khi lưu
- [ ] Tạo useEncryption hook

---

### Phase 3: IoT Core - Agent: `mobile-developer`

#### Task 3.1: Raspberry Pi Connection
**Priority:** P0 | **Dependencies:** Task 1.1

| INPUT | OUTPUT | VERIFY |
|-------|--------|--------|
| Raspberry Pi server | HTTP connection working | POST `/led` bật/tắt LED |

- [ ] Copy và cải tiến led_server.py từ example
- [ ] Tạo raspberryPi service
- [ ] Implement connection health check
- [ ] Handle connection errors gracefully

#### Task 3.2: Device Control UI
**Priority:** P0 | **Dependencies:** Task 3.1

| INPUT | OUTPUT | VERIFY |
|-------|--------|--------|
| Connection working | DeviceCard component | UI bật/tắt và LED phản hồi |

- [ ] Tạo DeviceCard component (toggle, status)
- [ ] Tạo HomeScreen với device list
- [ ] Real-time status update
- [ ] Loading và error states

#### Task 3.3: Room Management
**Priority:** P1 | **Dependencies:** Task 3.2

| INPUT | OUTPUT | VERIFY |
|-------|--------|--------|
| Devices working | Room grouping | Devices grouped by room |

- [ ] Tạo RoomCard component
- [ ] Tạo RoomsScreen
- [ ] Tạo RoomDetailScreen
- [ ] Room CRUD operations

---

### Phase 4: Advanced Features - Agent: `mobile-developer`

#### Task 4.1: Schedule & Automation
**Priority:** P1 | **Dependencies:** Task 3.2

| INPUT | OUTPUT | VERIFY |
|-------|--------|--------|
| Device control | Scheduled on/off | Đèn tự động bật/tắt đúng giờ |

- [ ] Tạo ScheduleScreen
- [ ] Tạo AddScheduleScreen với time picker
- [ ] Implement background task scheduler
- [ ] Lưu schedules to AsyncStorage + Firebase

#### Task 4.2: Dimmer & RGB (Future-ready)
**Priority:** P2 | **Dependencies:** Task 3.2

| INPUT | OUTPUT | VERIFY |
|-------|--------|--------|
| LED control | Brightness/color control | Slider thay đổi brightness |

- [ ] Tạo brightness slider component
- [ ] Tạo color picker component (for RGB)
- [ ] Extend API for PWM control
- [ ] UI cho dimmer mode

#### Task 4.3: Push Notifications
**Priority:** P1 | **Dependencies:** Task 2.1

| INPUT | OUTPUT | VERIFY |
|-------|--------|--------|
| FCM configured | Notifications working | Nhận thông báo khi app đóng |

**Triggers đã xác nhận:**
- ✅ Khi schedule thực thi (hẹn giờ bật/tắt đèn)
- ✅ Khi thiết bị/Raspberry Pi mất kết nối

- [ ] Implement foreground notifications
- [ ] Implement background notifications
- [ ] **Schedule execution alerts** (khi đèn tự động bật/tắt)
- [ ] **Connection lost alerts** (khi mất kết nối Raspberry Pi)

#### Task 4.4: Phone Hardware Integration
**Priority:** P1 | **Dependencies:** Task 1.1

| INPUT | OUTPUT | VERIFY |
|-------|--------|--------|
| Device permissions | Phone camera/GPS working | Chụp ảnh và lấy vị trí |

- [ ] Implement phone CameraScreen (QR scan for device pairing)
- [ ] Implement GPS location (optional: show devices nearby)
- [ ] Request permissions properly
- [ ] Graceful degradation if denied

---

### Phase 4B: Camera Surveillance (Raspberry Pi) - Agent: `mobile-developer`

#### Task 4.5: Raspberry Pi Camera Server
**Priority:** P1 | **Dependencies:** Task 3.1

| INPUT | OUTPUT | VERIFY |
|-------|--------|--------|
| Pi Camera Module | Streaming server running | Video stream accessible via HTTP |

- [ ] Tạo `camera_server.py` trên Raspberry Pi
- [ ] Sử dụng MJPEG streaming (đơn giản, tương thích cao)
- [ ] Endpoint: `GET /camera/stream` → MJPEG stream
- [ ] Endpoint: `GET /camera/snapshot` → Single JPEG frame
- [ ] Control: `POST /camera/start`, `POST /camera/stop`

#### Task 4.6: Live Stream Screen (Mobile)
**Priority:** P1 | **Dependencies:** Task 4.5

| INPUT | OUTPUT | VERIFY |
|-------|--------|--------|
| Camera server running | LiveStreamScreen | Video hiển thị trên app |

- [ ] Tạo `LiveStreamScreen.js`
- [ ] Tạo `useCamera` hook
- [ ] Display MJPEG stream trong app
- [ ] Controls: Play/Pause, Snapshot, Fullscreen
- [ ] Loading và error states
- [ ] Handle reconnection khi mất kết nối

---

### Phase 5: Network & Sync - Agent: `mobile-developer`

#### Task 5.1: Network Status Detection
**Priority:** P0 | **Dependencies:** Task 1.1

| INPUT | OUTPUT | VERIFY |
|-------|--------|--------|
| NetInfo library | Network status displayed | UI thay đổi theo online/offline |

- [ ] Implement useNetwork hook
- [ ] NetworkStatus component (badge/indicator)
- [ ] Network quality measurement
- [ ] Auto-switch local/remote mode

#### Task 5.2: Offline Support
**Priority:** P1 | **Dependencies:** Task 5.1, Task 3.1

| INPUT | OUTPUT | VERIFY |
|-------|--------|--------|
| Network detection | Offline mode working | App hoạt động khi mất mạng |

- [ ] Queue commands when offline
- [ ] Sync to Firebase when online
- [ ] Cached data display
- [ ] Conflict resolution

#### Task 5.3: Firebase Real-time Sync
**Priority:** P1 | **Dependencies:** Task 2.1, Task 3.2

| INPUT | OUTPUT | VERIFY |
|-------|--------|--------|
| Firebase configured | Real-time updates | Change từ Firebase hiện trên app |

- [ ] Setup Firebase listeners
- [ ] Real-time device status sync
- [ ] Multi-device support (control from multiple phones)
- [ ] Handle disconnection gracefully

---

### Phase 6: Testing & Verification - Agent: `mobile-developer`

#### Task 6.1: Unit Tests
**Priority:** P1 | **Dependencies:** All Phase 1-5

| INPUT | OUTPUT | VERIFY |
|-------|--------|--------|
| Components, hooks | Test files | `npm test` passes |

- [ ] Test custom hooks (useAuth, useDevice, useNetwork)
- [ ] Test services (encryption, API)
- [ ] Test utility functions
- [ ] Minimum 70% coverage

#### Task 6.2: Integration Tests
**Priority:** P1 | **Dependencies:** Task 6.1

| INPUT | OUTPUT | VERIFY |
|-------|--------|--------|
| Unit tests passing | Integration tests | Full flow tests pass |

- [ ] Test auth flow (register → login → logout)
- [ ] Test device control flow
- [ ] Test offline → online sync

#### Task 6.3: E2E Tests
**Priority:** P2 | **Dependencies:** Task 6.2

| INPUT | OUTPUT | VERIFY |
|-------|--------|--------|
| Integration tests | Detox E2E tests | E2E tests pass on emulator |

- [ ] Setup Detox
- [ ] Test critical user flows
- [ ] Generate test report

#### Task 6.4: Device Testing
**Priority:** P0 | **Dependencies:** All

| INPUT | OUTPUT | VERIFY |
|-------|--------|--------|
| App built | APK/IPA tested | No crash on real device |

- [ ] Build debug APK
- [ ] Test on Android emulator
- [ ] Test on real Android device
- [ ] Test on iOS simulator (if available)

---

### Phase 7: Documentation - Agent: `mobile-developer`

#### Task 7.1: Setup Guide
**Priority:** P1 | **Dependencies:** All

| INPUT | OUTPUT | VERIFY |
|-------|--------|--------|
| Working project | SETUP_GUIDE.md | New dev can setup following guide |

- [ ] Environment setup instructions
- [ ] Raspberry Pi setup steps
- [ ] Firebase configuration guide
- [ ] Troubleshooting section

#### Task 7.2: User Guide
**Priority:** P1 | **Dependencies:** All

| INPUT | OUTPUT | VERIFY |
|-------|--------|--------|
| Complete app | USER_GUIDE.md | User understands all features |

- [ ] App screenshots
- [ ] Feature descriptions
- [ ] FAQ section

#### Task 7.3: API Documentation
**Priority:** P2 | **Dependencies:** Task 3.1

| INPUT | OUTPUT | VERIFY |
|-------|--------|--------|
| API endpoints | API_DOCS.md | All endpoints documented |

- [ ] Raspberry Pi API endpoints
- [ ] Firebase data structure
- [ ] Request/Response examples

#### Task 7.4: Test Report
**Priority:** P1 | **Dependencies:** Phase 6

| INPUT | OUTPUT | VERIFY |
|-------|--------|--------|
| Test results | TEST_REPORT.md | Đầy đủ theo yêu cầu |

- [ ] Test cases list
- [ ] Test results summary
- [ ] Known issues
- [ ] Coverage report

---

## 🔴 Phase X: Final Verification (MANDATORY)

### Pre-completion Checklist

#### Build Verification
- [ ] `cd android && ./gradlew assembleDebug` → SUCCESS
- [ ] App launches on emulator without crash
- [ ] App launches on real device without crash

#### Security Verification
```bash
python .agent/skills/vulnerability-scanner/scripts/security_scan.py .
```
- [ ] No critical vulnerabilities
- [ ] Tokens stored in SecureStore
- [ ] No hardcoded secrets

#### UX Verification
```bash
python .agent/skills/mobile-design/scripts/mobile_audit.py .
```
- [ ] Touch targets ≥ 44px
- [ ] Loading/error states present
- [ ] Offline handling works

#### Code Quality
- [ ] `npm run lint` → No errors
- [ ] `npx tsc --noEmit` → No TypeScript errors

#### Functional Verification
- [ ] Login/Register works
- [ ] Device on/off works (with Raspberry Pi)
- [ ] Schedule saves and executes
- [ ] Push notification received
- [ ] Camera/GPS works
- [ ] Offline mode works
- [ ] Firebase sync works

---

## ✅ Quyết định đã xác nhận

| Câu hỏi | Đáp án |
|---------|--------|
| **Tech Stack** | JavaScript (không TypeScript), React Context + Hooks (không Zustand) |
| **Thiết bị test** | Đèn LED nhỏ 2 chân kết nối GPIO Raspberry Pi |
| **Push Notification** | ✅ Khi schedule thực thi + ✅ Khi mất kết nối |
| **Camera** | Raspberry Pi Camera Module → Giám sát video stream trực tiếp |

---

## 🔢 Estimated Timeline

| Phase | Tasks | Estimated Time |
|-------|-------|----------------|
| Phase 1 | Foundation | 2-3 ngày |
| Phase 2 | Auth & Storage | 2 ngày |
| Phase 3 | IoT Core | 3-4 ngày |
| Phase 4 | Advanced Features | 4-5 ngày |
| Phase 4B | **Camera Surveillance** | 2-3 ngày |
| Phase 5 | Network & Sync | 2-3 ngày |
| Phase 6 | Testing | 2-3 ngày |
| Phase 7 | Documentation | 1-2 ngày |
| Phase X | Verification | 1 ngày |
| **Total** | | **19-26 ngày** |

---

## 📎 References

- [Example SmartLight](file:///f:/Projects/example) - Tham khảo UI và API structure
- [Yêu cầu chi tiết](file:///f:/Projects/iot%20pj/yêu%20cầu.md) - Tiêu chí đánh giá
- [Raspberry Pi LED Server](file:///f:/Projects/example/raspberry-pi/led_server.py) - Base server code

---

> **Next Steps:**
> 1. ✅ Review plan này
> 2. Chạy `/create` để bắt đầu implementation
