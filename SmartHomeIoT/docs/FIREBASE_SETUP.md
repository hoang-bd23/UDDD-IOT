# Firebase Setup Guide

Hướng dẫn thiết lập Firebase cho SmartHome IoT App.

## Bước 1: Tạo Firebase Project

1. Truy cập [Firebase Console](https://console.firebase.google.com)
2. Nhấn **Add Project** (hoặc Tạo dự án)
3. Đặt tên: `SmartHome-IoT`
4. Bỏ chọn Google Analytics (tùy chọn)
5. Nhấn **Create Project**

## Bước 2: Thêm Android App

1. Trong Project Overview, nhấn biểu tượng **Android**
2. Nhập thông tin:
   - **Android package name**: `com.smarthomeiot`
   - **App nickname**: SmartHome IoT
   - **Debug signing certificate SHA-1**: (tùy chọn)
3. Nhấn **Register app**
4. **Tải file `google-services.json`**
5. Đặt file vào: `android/app/google-services.json`

## Bước 3: Enable Authentication

1. Trong Firebase Console, chọn **Authentication** từ menu trái
2. Nhấn **Get Started**
3. Tab **Sign-in method**, enable **Email/Password**
4. Nhấn **Save**

## Bước 4: Setup Realtime Database

1. Chọn **Realtime Database** từ menu trái
2. Nhấn **Create Database**
3. Chọn location gần nhất (e.g., Singapore)
4. Chọn **Start in test mode** (tạm thời)
5. Nhấn **Enable**

### Cập nhật Database Rules

Vào **Rules** tab và paste rules sau:

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
    "rooms": {
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
    "deviceHistory": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid",
        ".indexOn": ["timestamp"]
      }
    }
  }
}
```

Nhấn **Publish**.

## Bước 5: Enable Cloud Messaging (FCM)

1. Chọn **Cloud Messaging** từ menu trái
2. FCM được enable tự động cho project mới
3. (Tùy chọn) Tạo **Server Key** nếu cần gửi thông báo từ server

## Bước 6: Verify Configuration

### File Structure
```
android/
└── app/
    ├── build.gradle          ✅ Đã thêm google-services plugin
    ├── google-services.json  📌 BẠN CẦN THÊM FILE NÀY
    └── ...
```

### Check google-services.json
File phải chứa:
```json
{
  "project_info": {
    "project_id": "your-project-id",
    ...
  },
  "client": [
    {
      "client_info": {
        "android_client_info": {
          "package_name": "com.smarthomeiot"  // PHẢI MATCH
        }
      },
      ...
    }
  ]
}
```

## Bước 7: Build và Test

```bash
# Clean build
cd android
./gradlew clean
cd ..

# Run app
npx react-native run-android
```

### Test Authentication
1. Mở app
2. Đăng ký tài khoản mới
3. Kiểm tra Firebase Console > Authentication > Users

### Test Realtime Database
1. Đăng nhập vào app
2. Toggle một device
3. Kiểm tra Firebase Console > Realtime Database

## Troubleshooting

### Error: "No Firebase App"
- Đảm bảo `google-services.json` đúng vị trí
- Đảm bảo package name trong file khớp `com.smarthomeiot`

### Error: "Firebase Auth Exception"
- Kiểm tra Email/Password đã enable trong Authentication
- Kiểm tra luật Realtime Database

### Error: "Network Error"
- Kiểm tra kết nối internet
- Kiểm tra Firebase project không bị disable

### Build Error: "google-services plugin"
- Đảm bảo đã thêm classpath trong `android/build.gradle`
- Đảm bảo đã apply plugin trong `android/app/build.gradle`

## Test Data Structure

Sau khi đăng nhập, data trong Realtime Database sẽ có structure:

```
smarthome-iot
├── users/
│   └── {userId}/
│       ├── email: "user@example.com"
│       ├── displayName: "User Name"
│       └── lastLogin: 1234567890
├── devices/
│   └── {userId}/
│       └── {deviceId}/
│           ├── name: "Đèn LED"
│           ├── type: "light"
│           ├── room: "living-room"
│           ├── isOn: false
│           └── lastUpdated: 1234567890
├── rooms/
│   └── {userId}/
│       └── {roomId}/
│           ├── name: "Phòng khách"
│           ├── icon: "home-outline"
│           └── color: "#2563EB"
├── schedules/
│   └── {userId}/
│       └── {scheduleId}/
│           ├── deviceId: "led-1"
│           ├── time: "07:00"
│           ├── action: "ON"
│           └── isEnabled: true
└── deviceHistory/
    └── {userId}/
        └── {historyId}/
            ├── deviceId: "led-1"
            ├── action: "ON"
            └── timestamp: 1234567890
```

## Security Best Practices

⚠️ **Quan trọng cho Production:**

1. **Không commit `google-services.json`** vào git
   - Thêm vào `.gitignore`: `android/app/google-services.json`
   
2. **Update Database Rules** cho production:
   ```json
   {
     "rules": {
       ".read": false,
       ".write": false,
       "users": { ... }  // Keep user-specific rules
     }
   }
   ```

3. **Enable App Check** để bảo vệ API

4. **Setup Backup** cho Realtime Database
