# Raspberry Pi Server Setup

This folder contains Python servers for controlling hardware via Raspberry Pi.

## Prerequisites

- Raspberry Pi 4 (or compatible)
- Python 3.9+
- LED connected to GPIO 18
- Raspberry Pi Camera Module (optional)

## Hardware Wiring

### LED Connection
```
GPIO 18 (Pin 12) ─────► LED (+) anode
GND (Pin 6)      ─────► 220Ω resistor ─────► LED (-) cathode
```

### Camera
- Connect Raspberry Pi Camera Module to CSI port
- Or use USB webcam

## Installation

1. **SSH into Raspberry Pi:**
```bash
ssh pi@<raspberry-pi-ip>
```

2. **Clone or copy this folder to Raspberry Pi**

3. **Create virtual environment:**
```bash
python3 -m venv venv
source venv/bin/activate
```

4. **Install dependencies:**
```bash
pip install -r requirements.txt
```

## Running Servers

### LED Server (Port 8080)
```bash
python led_server.py
```

### Camera Server (Port 8081)
```bash
python camera_server.py
```

### Run Both (background)
```bash
nohup python led_server.py > led.log 2>&1 &
nohup python camera_server.py > camera.log 2>&1 &
```

## API Endpoints

### LED Server (http://<pi-ip>:8080)

| Method | Endpoint  | Description           |
|--------|-----------|----------------------|
| GET    | /         | Web interface         |
| GET    | /health   | Health check          |
| GET    | /led      | Get LED state         |
| POST   | /led      | Set LED state         |

**POST /led body:**
```json
{
  "state": "ON"  // or "OFF"
}
```

### Camera Server (http://<pi-ip>:8081)

| Method | Endpoint          | Description          |
|--------|-------------------|---------------------|
| GET    | /                 | Web interface        |
| GET    | /camera/stream    | MJPEG video stream   |
| GET    | /camera/snapshot  | Single JPEG frame    |
| POST   | /camera/start     | Start camera         |
| POST   | /camera/stop      | Stop camera          |
| GET    | /camera/status    | Camera status        |
| GET    | /health           | Health check         |

## Testing

### Test LED
```bash
# Check status
curl http://<pi-ip>:8080/led

# Turn ON
curl -X POST http://<pi-ip>:8080/led \
  -H "Content-Type: application/json" \
  -d '{"state": "ON"}'

# Turn OFF
curl -X POST http://<pi-ip>:8080/led \
  -H "Content-Type: application/json" \
  -d '{"state": "OFF"}'
```

### Test Camera
```bash
# Check status
curl http://<pi-ip>:8081/camera/status

# Take snapshot
curl http://<pi-ip>:8081/camera/snapshot > snapshot.jpg
```

## Troubleshooting

### GPIO Permission Error
```bash
sudo usermod -a -G gpio pi
# Logout and login again
```

### Camera Not Detected
```bash
# Enable camera in raspi-config
sudo raspi-config
# Navigate: Interface Options > Camera > Enable

# For Picamera2, install:
sudo apt install -y python3-picamera2
```

### Port Already in Use
```bash
# Find process using port
sudo lsof -i :8080
# Kill process
sudo kill -9 <PID>
```

## Auto-start on Boot

Create systemd services:

### /etc/systemd/system/smarthome-led.service
```ini
[Unit]
Description=SmartHome LED Server
After=network.target

[Service]
ExecStart=/home/pi/SmartHomeIoT/raspberry-pi/venv/bin/python /home/pi/SmartHomeIoT/raspberry-pi/led_server.py
WorkingDirectory=/home/pi/SmartHomeIoT/raspberry-pi
Restart=always
User=pi

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl daemon-reload
sudo systemctl enable smarthome-led
sudo systemctl start smarthome-led
```

## Security Notes

⚠️ These servers are for local network use only.
- Do not expose ports 8080/8081 to the internet directly
- Use Firebase for remote control via the mobile app
- Consider adding authentication for production use
