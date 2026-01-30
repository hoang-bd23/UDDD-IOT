# SmartHome IoT - React Native App

<p align="center">
  <strong>🏠 Điều khiển thiết bị thông minh qua Raspberry Pi</strong>
</p>

## 📱 Tổng quan

SmartHome IoT là ứng dụng React Native cho phép điều khiển các thiết bị điện tử trong nhà thông qua Raspberry Pi. Ứng dụng hỗ trợ:

- ✅ Điều khiển đèn LED (bật/tắt)
- ✅ Xem camera giám sát trực tiếp
- ✅ Quản lý thiết bị theo phòng
- ✅ Hẹn giờ tự động
- ✅ Thông báo đẩy
- ✅ Dark/Light mode
- ✅ Hoạt động cả online và offline

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | React Native CLI |
| Language | JavaScript |
| State Management | React Context + Hooks |
| Navigation | React Navigation 6 |
| Storage | AsyncStorage + Firebase |
| Backend Auth | Firebase Authentication |
| Database | Firebase Realtime Database |
| Push Notifications | Firebase Cloud Messaging |
| Icons | react-native-vector-icons |
| Hardware Backend | Flask (Python) on Raspberry Pi |

## 📁 Cấu trúc dự án

```
SmartHomeIoT/
├── src/
│   ├── components/       # Reusable UI components
│   ├── screens/          # Application screens
│   │   ├── Auth/         # Login, Register, ForgotPassword
│   │   ├── Home/         # Dashboard
│   │   ├── Devices/      # Device management
│   │   ├── Rooms/        # Room organization
│   │   ├── Schedule/     # Automation schedules
│   │   ├── Camera/       # Live stream
│   │   └── Settings/     # App settings
│   ├── context/          # React Context providers
│   ├── navigation/       # Navigation config
│   ├── services/         # Firebase & API services
│   ├── styles/           # Design system
│   └── utils/            # Utility functions
├── raspberry-pi/         # Raspberry Pi server code
│   ├── led_server.py     # LED control API
│   ├── camera_server.py  # Camera streaming API
│   └── requirements.txt  # Python dependencies
├── docs/                 # Documentation
│   ├── FIREBASE_SETUP.md # Hướng dẫn Firebase
│   └── RASPBERRY_PI_SETUP.md # Hướng dẫn Pi
└── android/app/
    └── google-services.json  # 📌 CẦN TẠO (xem bên dưới)
```

## 🚀 Cài đặt

### Yêu cầu

- Node.js 18+
- React Native CLI
- Android Studio (Android) / Xcode (iOS)
- Raspberry Pi 4 với LED và Camera Module
- Tài khoản Firebase (miễn phí)

### Bước 1: Clone và cài đặt dependencies

```bash
cd SmartHomeIoT
npm install
```

### Bước 2: Cấu hình Firebase (BẮT BUỘC)

1. Truy cập [Firebase Console](https://console.firebase.google.com)
2. Tạo project mới tên `SmartHome-IoT`
3. Thêm Android app với package name: `com.smarthomeiot`
4. Tải file `google-services.json`
5. Đặt vào thư mục: `android/app/google-services.json`
6. Enable các services:
   - **Authentication** → Email/Password
   - **Realtime Database**
   - **Cloud Messaging**

> 📖 Chi tiết: Xem [docs/FIREBASE_SETUP.md](docs/FIREBASE_SETUP.md)

⚠️ **LƯU Ý BẢO MẬT:**
- File `google-services.json` đã được thêm vào `.gitignore`
- **KHÔNG bao giờ commit file này lên git**
- Mỗi developer cần tự tạo Firebase project riêng

### Bước 3: Setup Raspberry Pi

```bash
# SSH vào Raspberry Pi
ssh pi@<raspberry-pi-ip>

# Tạo thư mục và cài đặt
mkdir -p ~/SmartHomeIoT
cd ~/SmartHomeIoT
python3 -m venv venv --system-site-packages
source venv/bin/activate
pip install flask flask-cors pillow

# Copy files từ máy tính (chạy trên máy tính)
scp raspberry-pi/*.py pi@<raspberry-pi-ip>:~/SmartHomeIoT/

# Chạy servers (trên Raspberry Pi)
python led_server.py &
python camera_server.py &
```

> 📖 Chi tiết: Xem [docs/RASPBERRY_PI_SETUP.md](docs/RASPBERRY_PI_SETUP.md)

### Bước 4: Chạy app

```bash
# Android (điện thoại thật khuyến nghị)
npx react-native run-android

# iOS (cần macOS)
cd ios && pod install && cd ..
npx react-native run-ios
```

### Bước 5: Cấu hình trong app

1. Mở app → **Đăng ký tài khoản mới**
2. Vào **Settings** (Cài đặt)
3. Nhập địa chỉ IP của Raspberry Pi:
   - LED Server: `http://<raspberry-pi-ip>:8080`
   - Camera Server: `http://<raspberry-pi-ip>:8081`
4. Nhấn **Lưu** và **Kiểm tra kết nối**


## 📡 API Endpoints

### LED Server (Port 8080)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Web interface |
| GET | `/health` | Health check |
| GET | `/led` | Get LED state |
| POST | `/led` | Set LED state |

### Camera Server (Port 8081)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/camera/stream` | MJPEG video stream |
| GET | `/camera/snapshot` | Single JPEG frame |
| POST | `/camera/start` | Start camera |
| POST | `/camera/stop` | Stop camera |

## 🔌 Kết nối phần cứng

### LED

```
Raspberry Pi GPIO 18 (Pin 12) ──► LED (+)
Raspberry Pi GND (Pin 6)      ──► 220Ω resistor ──► LED (-)
```

### Camera

Kết nối Raspberry Pi Camera Module vào cổng CSI hoặc dùng USB webcam.

## 📸 Screenshots

| Home | Devices | Camera |
|------|---------|--------|
| Dashboard với quick controls | Grid view thiết bị | Live stream từ Pi |

## 🧪 Testing

```bash
# Unit tests
npm test

# Lint
npm run lint
```

## 📋 Tiêu chí đánh giá (10 điểm)

- [x] Cấu trúc dự án rõ ràng
- [x] UI hiện đại, responsive
- [x] State management với React Context
- [x] Kết nối thiết bị thật
- [x] Thông báo push
- [x] Lưu trữ local và cloud
- [x] Xác thực người dùng
- [x] Chạy ổn định trên emulator và thiết bị thật
- [x] Tài liệu đầy đủ

## 📝 License

MIT License - Free to use for educational purposes.

## 👤 Author

SmartHome IoT Team
