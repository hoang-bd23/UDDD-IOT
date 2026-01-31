# SmartHome IoT - React Native App

Điều khiển thiết bị thông minh qua Raspberry Pi

##  Tổng quan

SmartHome IoT là ứng dụng React Native cho phép điều khiển các thiết bị điện tử trong nhà thông qua Raspberry Pi. Ứng dụng hỗ trợ:

- ✅ Điều khiển đèn LED (bật/tắt)
- ✅ Xem camera giám sát trực tiếp (MJPEG Stream)
- ✅ Quản lý thiết bị theo phòng
- ✅ Hẹn giờ tự động bật/tắt đèn
- ✅ Thông báo đẩy (khi mất kết nối)
- ✅ Lịch sử hoạt động thiết bị
- ✅ Dark/Light mode
- ✅ Hoạt động cả online và offline

---

##  Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | React Native CLI 0.73+ |
| Language | JavaScript (ES6+) |
| State Management | React Context + Hooks |
| Navigation | React Navigation 6 |
| Storage | AsyncStorage + Firebase Realtime Database |
| Authentication | Firebase Auth (Email/Password) |
| Push Notifications | Notifee (Local) + Firebase Cloud Messaging |
| Icons | react-native-vector-icons (Ionicons) |
| Hardware Backend | Flask (Python 3) on Raspberry Pi 4 |

---

##  Yêu cầu hệ thống

### Máy tính phát triển
- **Node.js** 18+ (LTS khuyến nghị)
- **npm** 9+ hoặc **yarn** 1.22+
- **JDK** 17 (cho Android)
- **Android Studio** với SDK 34 + Build Tools
- **React Native CLI** (không dùng Expo)

### Thiết bị test
- Điện thoại Android 8.0+ (khuyến nghị dùng thiết bị thật)
- Hoặc Android Emulator với API 30+

### Phần cứng IoT
- **Raspberry Pi 4** (Model B, 2GB+ RAM)
- **LED** + điện trở 220Ω
- **Raspberry Pi Camera Module** hoặc USB Webcam
- Nguồn 5V/3A cho Pi

---

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
│   │   ├── History/      # Activity history
│   │   ├── Camera/       # Live stream
│   │   └── Settings/     # App settings
│   ├── context/          # React Context providers
│   │   ├── AuthContext.js
│   │   ├── DeviceContext.js
│   │   ├── ThemeContext.js
│   │   ├── ScheduleContext.js
│   │   └── NotificationContext.js
│   ├── navigation/       # Navigation config
│   ├── services/         # Firebase & API services
│   │   ├── firebase/
│   │   └── localNotifications.js
│   └── styles/           # Design system
├── raspberry-pi/         # Raspberry Pi server code
│   ├── led_server.py     # LED control API (port 8080)
│   ├── camera_server.py  # Camera streaming (port 8081)
│   ├── schedule_checker.py # Auto schedule executor
│   └── requirements.txt  # Python dependencies
├── docs/                 # Documentation
│   ├── FIREBASE_SETUP.md
│   └── RASPBERRY_PI_SETUP.md
└── android/app/
    └── google-services.json  # ⚠️ PHẢI TẠO (xem hướng dẫn)
```

---

##  Hướng dẫn cài đặt

### Bước 1: Clone repository

```bash
git clone <repository-url>
cd SmartHomeIoT
```

### Bước 2: Cài đặt dependencies

```bash
# Cài đặt Node modules
npm install

# Nếu gặp lỗi peer dependencies
npm install --legacy-peer-deps
```

### Bước 3: Cấu hình Firebase (BẮT BUỘC)

> ⚠️ **QUAN TRỌNG**: App không thể chạy nếu thiếu file `google-services.json`

#### 3.1. Tạo Firebase Project

1. Truy cập [Firebase Console](https://console.firebase.google.com)
2. Click **"Add project"** → Đặt tên: `SmartHome-IoT`
3. Tắt Google Analytics (không cần thiết) → **Create project**

#### 3.2. Thêm Android App

1. Trong Firebase Console, click icon **Android** (Add app)
2. Nhập thông tin:
   - **Package name**: `com.smarthomeiot`
   - **App nickname**: SmartHome IoT
   - **Debug signing certificate SHA-1**: (bỏ qua)
3. Click **Register app**
4. **Download `google-services.json`**
5. Copy file vào: `android/app/google-services.json`

#### 3.3. Bật Authentication

1. Firebase Console → **Build** → **Authentication**
2. Click **Get started**
3. Tab **Sign-in method** → Enable **Email/Password**

#### 3.4. Tạo Realtime Database

1. Firebase Console → **Build** → **Realtime Database**
2. Click **Create Database**
3. Chọn location: `asia-southeast1` (Singapore)
4. Chọn **Start in test mode** → **Enable**
5. **QUAN TRỌNG**: Sau khi tạo xong, copy **Database URL** từ trang Realtime Database
6. Mở file `google-services.json`, thêm dòng sau vào `project_info`:

```json
{
  "project_info": {
    "project_number": "...",
    "firebase_url": "https://YOUR-PROJECT-ID-default-rtdb.asia-southeast1.firebasedatabase.app",
    ...
  }
}
```

#### 3.5. Thiết lập Database Rules

Trong **Realtime Database** → Tab **Rules**, thay toàn bộ bằng:

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    },
    "devices": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    },
    "deviceHistory": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    },
    "schedules": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    },
    "rooms": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    }
  }
}
```

Click **Publish**.

---

### Bước 4: Setup Raspberry Pi

#### 4.1. Chuẩn bị Raspberry Pi

```bash
# SSH vào Raspberry Pi
ssh pi@<raspberry-pi-ip>

# Cập nhật hệ thống
sudo apt update && sudo apt upgrade -y

# Cài đặt Python dependencies
sudo apt install python3-pip python3-venv python3-picamera2 -y
```

#### 4.2. Tạo môi trường và cài đặt

```bash
# Tạo thư mục project
mkdir -p ~/SmartHomeIoT
cd ~/SmartHomeIoT

# Tạo virtual environment (giữ system packages cho picamera2)
python3 -m venv venv --system-site-packages
source venv/bin/activate

# Cài đặt Flask
pip install flask flask-cors pillow
```

#### 4.3. Copy code từ máy tính

**Trên máy tính (không phải Pi):**

```bash
# Copy tất cả files trong thư mục raspberry-pi
scp raspberry-pi/*.py pi@<raspberry-pi-ip>:~/SmartHomeIoT/
```

#### 4.4. Kết nối phần cứng LED

```
Raspberry Pi GPIO 18 (Pin 12) ───► LED Anode (+)
                                        │
                                   220Ω Resistor
                                        │
Raspberry Pi GND (Pin 6)      ◄─────────┘ LED Cathode (-)
```

#### 4.5. Chạy LED Server

```bash
cd ~/SmartHomeIoT
source venv/bin/activate

# Chạy LED server (terminal 1)
python led_server.py
```

Server sẽ chạy tại `http://<raspberry-pi-ip>:8080`

#### 4.6. Chạy Camera Server

```bash
# Terminal 2 (SSH mới)
cd ~/SmartHomeIoT
source venv/bin/activate

# Chạy Camera server
python camera_server.py
```

Server sẽ chạy tại `http://<raspberry-pi-ip>:8081`

---

### Bước 5: Build và chạy app

#### 5.1. Kết nối điện thoại

- Bật **USB Debugging** trong Developer Options
- Kết nối điện thoại qua USB
- Cho phép USB Debugging khi được hỏi

```bash
# Kiểm tra thiết bị đã kết nối
adb devices
```

#### 5.2. Chạy app

```bash
# Build và cài đặt app
npx react-native run-android
```

> ⏱️ Lần đầu build có thể mất 5-10 phút

#### 5.3. Xử lý lỗi thường gặp

**Lỗi: SDK location not found**
```bash
# Tạo file local.properties trong thư mục android
echo "sdk.dir=C:\\Users\\<username>\\AppData\\Local\\Android\\Sdk" > android/local.properties
```

**Lỗi: Metro bundler không chạy**
```bash
# Mở terminal mới, chạy Metro
npx react-native start --reset-cache
```

**Lỗi: Build failed - JDK version**
```bash
# Đảm bảo JAVA_HOME trỏ đến JDK 17
set JAVA_HOME=C:\Program Files\Java\jdk-17
```

---

### Bước 6: Cấu hình trong app

1. **Mở app** → **Đăng ký tài khoản mới**
2. **Đăng nhập** với tài khoản vừa tạo
3. Vào tab **Cài đặt** (Settings)
4. Nhập địa chỉ IP của Raspberry Pi:
   - **LED Server**: `http://<raspberry-pi-ip>:8080`
   - **Camera Server**: `http://<raspberry-pi-ip>:8081`
5. Nhấn **Kiểm tra** để test kết nối
6. Nhấn **Lưu** nếu kết nối thành công

---

## 📡 API Endpoints

### LED Server (Port 8080)

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| GET | `/` | - | Web interface |
| GET | `/health` | - | Health check |
| GET | `/led` | - | Get LED state |
| POST | `/led` | `{"state": "ON"}` | Set LED ON |
| POST | `/led` | `{"state": "OFF"}` | Set LED OFF |

### Camera Server (Port 8081)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/camera/stream` | MJPEG video stream |
| GET | `/camera/snapshot` | Single JPEG frame |
| POST | `/camera/start` | Start camera |
| POST | `/camera/stop` | Stop camera |
| GET | `/camera/status` | Camera status |

---

##  Troubleshooting

### App không kết nối được với Raspberry Pi

1. **Kiểm tra cùng mạng WiFi**: Điện thoại và Pi phải cùng mạng
2. **Kiểm tra IP đúng**: `hostname -I` trên Pi để lấy IP
3. **Kiểm tra server đang chạy**: 
   ```bash
   curl http://<raspberry-pi-ip>:8080/health
   ```
4. **Kiểm tra firewall**: Tắt firewall trên Pi nếu có

### Firebase không hoạt động

1. Kiểm tra file `google-services.json` đúng vị trí
2. Đảm bảo có `firebase_url` trong file
3. Kiểm tra Database Rules đã publish
4. Rebuild app: `npx react-native run-android`

### Camera không hiển thị

1. Kiểm tra camera đã được bật: `vcgencmd get_camera`
2. Kiểm tra server chạy: `curl http://<pi-ip>:8081/camera/status`
3. Với USB webcam, kiểm tra: `ls /dev/video*`

---

##  Chạy tự động khi Pi khởi động

### Tạo systemd service cho LED Server

```bash
sudo nano /etc/systemd/system/led-server.service
```

Nội dung:

```ini
[Unit]
Description=SmartHome LED Server
After=network.target

[Service]
ExecStart=/home/pi/SmartHomeIoT/venv/bin/python /home/pi/SmartHomeIoT/led_server.py
WorkingDirectory=/home/pi/SmartHomeIoT
User=pi
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable led-server
sudo systemctl start led-server
```

---

##  Screenshots

| Trang chủ | Thiết bị | Lịch hẹn | Cài đặt |
|-----------|----------|----------|---------|
| Dashboard với quick controls | Grid view điều khiển | Hẹn giờ bật/tắt | Cấu hình server |

---

##  Testing

```bash
# Chạy tests
npm test

# Lint code
npm run lint

# Type check
npm run typecheck
```

---

## ⚠️ Lưu ý bảo mật

- ❌ **KHÔNG** commit file `google-services.json` lên Git
- ❌ **KHÔNG** chia sẻ API keys công khai
- ✅ Mỗi developer tự tạo Firebase project riêng
- ✅ Sử dụng Database Rules để bảo vệ dữ liệu


