# 🔌 Hướng dẫn Setup Raspberry Pi cho SmartHome IoT

## Phần 1: Chuẩn bị phần cứng

### Thiết bị cần có:
- Raspberry Pi 4 (hoặc 3B+)
- Thẻ microSD 16GB+ 
- LED (hoặc đèn LED strip)
- Điện trở 220Ω
- Dây jumper
- Breadboard (tùy chọn)
- Camera Module (tùy chọn)

### Sơ đồ kết nối LED:

```
Raspberry Pi                    LED
┌─────────────┐                ┌────┐
│  GPIO 18 ───┼────────────────┤ + │ (Anode - chân dài)
│  (Pin 12)   │                │    │
│             │                └────┘
│             │                   │
│   GND    ───┼───[ 220Ω ]────────┘ (Cathode - chân ngắn)
│  (Pin 6)    │    
└─────────────┘

📍 GPIO 18 = Pin vật lý số 12
📍 GND = Pin vật lý số 6
```

### Pinout Raspberry Pi:
```
   3.3V (1) (2) 5V
  GPIO2 (3) (4) 5V
  GPIO3 (5) (6) GND  ← GND cho LED
  GPIO4 (7) (8) GPIO14
    GND (9) (10) GPIO15
 GPIO17 (11) (12) GPIO18 ← LED dương (+)
 GPIO27 (13) (14) GND
 GPIO22 (15) ...
```

---

## Phần 2: Cài đặt Raspberry Pi OS

### Bước 1: Flash OS
1. Tải [Raspberry Pi Imager](https://www.raspberrypi.com/software/)
2. Chọn: **Raspberry Pi OS Lite (64-bit)** 
3. Cài đặt SSH và WiFi trong settings
4. Flash vào thẻ SD

### Bước 2: Kết nối SSH
```bash
# Tìm IP của Raspberry Pi
# Cách 1: Xem router
# Cách 2: Dùng nmap
nmap -sn 192.168.1.0/24

# SSH vào Pi
ssh pi@<IP-CUA-PI>
# Mật khẩu mặc định: raspberry
```

### Bước 3: Cập nhật hệ thống
```bash
sudo apt update && sudo apt upgrade -y
```

---

## Phần 3: Cài đặt LED Server

### Bước 1: Cài đặt Python packages
```bash
# Cài pip nếu chưa có
sudo apt install python3-pip python3-venv -y

# Tạo thư mục project
mkdir -p ~/SmartHomeIoT
cd ~/SmartHomeIoT

# Tạo virtual environment
python3 -m venv venv
source venv/bin/activate

# Cài đặt dependencies
pip install flask flask-cors RPi.GPIO
```

### Bước 2: Tạo file LED Server

Tạo file `led_server.py`:

```bash
nano led_server.py
```

Paste nội dung sau (hoặc copy từ project):

```python
#!/usr/bin/env python3
"""Raspberry Pi LED Control Server"""

from flask import Flask, jsonify, request
from flask_cors import CORS
import RPi.GPIO as GPIO
import time

app = Flask(__name__)
CORS(app)

LED_PIN = 18
led_state = False
last_updated = None

def setup_gpio():
    GPIO.setmode(GPIO.BCM)
    GPIO.setwarnings(False)
    GPIO.setup(LED_PIN, GPIO.OUT)
    GPIO.output(LED_PIN, GPIO.LOW)
    print(f"GPIO initialized, LED on pin {LED_PIN}")

def set_led(state):
    global led_state, last_updated
    led_state = state
    last_updated = time.strftime("%Y-%m-%d %H:%M:%S")
    GPIO.output(LED_PIN, GPIO.HIGH if state else GPIO.LOW)
    print(f"LED set to {'ON' if state else 'OFF'}")

@app.route('/')
def index():
    return f'''
    <html>
    <head><title>SmartHome LED</title></head>
    <body style="font-family:sans-serif;text-align:center;padding:50px;">
        <h1>💡 LED Control</h1>
        <p>Status: <b>{'🟢 ON' if led_state else '⚫ OFF'}</b></p>
        <button onclick="fetch('/led',{{method:'POST',headers:{{'Content-Type':'application/json'}},body:JSON.stringify({{state:'ON'}})}}).then(()=>location.reload())">Turn ON</button>
        <button onclick="fetch('/led',{{method:'POST',headers:{{'Content-Type':'application/json'}},body:JSON.stringify({{state:'OFF'}})}}).then(()=>location.reload())">Turn OFF</button>
    </body>
    </html>
    '''

@app.route('/health')
def health():
    return jsonify({'status': 'ok', 'led_pin': LED_PIN})

@app.route('/led', methods=['GET'])
def get_led():
    return jsonify({'state': 'ON' if led_state else 'OFF', 'is_on': led_state})

@app.route('/led', methods=['POST'])
def post_led():
    data = request.get_json()
    if not data or 'state' not in data:
        return jsonify({'error': 'Missing state'}), 400
    
    new_state = data['state'].upper() == 'ON'
    set_led(new_state)
    return jsonify({'success': True, 'state': 'ON' if led_state else 'OFF'})

if __name__ == '__main__':
    try:
        setup_gpio()
        print("Starting LED Server on port 8080...")
        app.run(host='0.0.0.0', port=8080)
    finally:
        GPIO.cleanup()
```

Lưu file: `Ctrl+O`, Enter, `Ctrl+X`

### Bước 3: Test LED Server

```bash
# Chạy server
python led_server.py
```

Mở trình duyệt web: `http://<IP-CUA-PI>:8080`

Bạn sẽ thấy giao diện web để bật/tắt LED!

### Bước 4: Test từ terminal khác

```bash
# Kiểm tra status
curl http://<IP-CUA-PI>:8080/led

# Bật LED
curl -X POST http://<IP-CUA-PI>:8080/led \
  -H "Content-Type: application/json" \
  -d '{"state": "ON"}'

# Tắt LED
curl -X POST http://<IP-CUA-PI>:8080/led \
  -H "Content-Type: application/json" \
  -d '{"state": "OFF"}'
```

---

## Phần 4: Cấu hình App

### Bước 1: Tìm IP của Raspberry Pi
```bash
# Trên Raspberry Pi:
hostname -I
# Ví dụ: 192.168.1.100
```

### Bước 2: Cấu hình trong App

1. Mở app SmartHome IoT
2. Vào **Settings** (tab cuối)
3. Trong phần "Kết nối Raspberry Pi":
   - Nhập: `http://192.168.1.100:8080` (thay bằng IP thực của bạn)
   - Nhấn **Kiểm tra** để test kết nối
   - Nhấn **Lưu**

### Bước 3: Test điều khiển

1. Quay lại **Home** hoặc **Devices**
2. Nhấn vào thiết bị "Đèn LED"
3. LED trên Raspberry Pi sẽ bật/tắt!

---

## Phần 5: Chạy Server tự động khi boot

### Tạo systemd service

```bash
sudo nano /etc/systemd/system/smarthome-led.service
```

Nội dung:
```ini
[Unit]
Description=SmartHome LED Server
After=network.target

[Service]
ExecStart=/home/pi/SmartHomeIoT/venv/bin/python /home/pi/SmartHomeIoT/led_server.py
WorkingDirectory=/home/pi/SmartHomeIoT
Restart=always
User=pi

[Install]
WantedBy=multi-user.target
```

Enable service:
```bash
sudo systemctl daemon-reload
sudo systemctl enable smarthome-led
sudo systemctl start smarthome-led

# Kiểm tra status
sudo systemctl status smarthome-led
```

---

## Troubleshooting

### ❌ LED không sáng
- Kiểm tra kết nối dây
- Đảm bảo chân + của LED nối vào GPIO 18
- Thử đổi hướng LED (+ -)

### ❌ App không kết nối được
- Đảm bảo Pi và điện thoại cùng mạng WiFi
- Kiểm tra firewall: `sudo ufw allow 8080`
- Thử ping từ điện thoại

### ❌ Permission denied GPIO
```bash
sudo usermod -a -G gpio pi
# Logout rồi login lại
```

### ❌ Port 8080 đang bị dùng
```bash
sudo lsof -i :8080
sudo kill -9 <PID>
```

---

## Camera (Tùy chọn)

Nếu bạn muốn sử dụng camera:

```bash
# Cài đặt thêm
pip install picamera2 opencv-python Pillow

# Chạy camera server (port 8081)
python camera_server.py
```

Trong app Settings, cập nhật Camera URL: `http://<IP>:8081`
