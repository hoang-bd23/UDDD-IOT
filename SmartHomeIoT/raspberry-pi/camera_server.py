#!/usr/bin/env python3
"""
Raspberry Pi Camera Streaming Server
Provides MJPEG video stream and snapshot API

Endpoints:
- GET  /               : Camera web interface
- GET  /camera/stream  : MJPEG video stream
- GET  /camera/snapshot: Single JPEG frame
- POST /camera/start   : Start camera
- POST /camera/stop    : Stop camera
- GET  /camera/status  : Camera status

Hardware:
- Raspberry Pi Camera Module v2 or compatible
- Or USB webcam
"""

from flask import Flask, Response, jsonify
from flask_cors import CORS
import time
import logging
import io
import threading

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Try to import camera libraries
CAMERA_TYPE = None
camera = None

try:
    from picamera2 import Picamera2
    CAMERA_TYPE = 'picamera2'
    logger.info("Using Picamera2 (Raspberry Pi Camera)")
except ImportError:
    try:
        import cv2
        CAMERA_TYPE = 'opencv'
        logger.info("Using OpenCV (USB webcam)")
    except ImportError:
        logger.warning("No camera library available, running in mock mode")

app = Flask(__name__)
CORS(app)

# Camera state
camera_active = False
frame_count = 0
last_frame = None
lock = threading.Lock()

def init_camera():
    """Initialize camera"""
    global camera, camera_active
    
    if CAMERA_TYPE == 'picamera2':
        camera = Picamera2()
        config = camera.create_still_configuration(main={"size": (640, 480)})
        camera.configure(config)
        camera.start()
        camera_active = True
        logger.info("Picamera2 initialized")
        
    elif CAMERA_TYPE == 'opencv':
        camera = cv2.VideoCapture(0)
        camera.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
        camera.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
        if camera.isOpened():
            camera_active = True
            logger.info("OpenCV camera initialized")
        else:
            logger.error("Failed to open camera")
    else:
        camera_active = True  # Mock mode
        logger.info("Running in mock mode (no camera)")

def get_frame():
    """Capture a single frame"""
    global frame_count, last_frame
    
    if CAMERA_TYPE == 'picamera2':
        stream = io.BytesIO()
        camera.capture_file(stream, format='jpeg')
        frame = stream.getvalue()
        
    elif CAMERA_TYPE == 'opencv':
        ret, img = camera.read()
        if ret:
            _, frame = cv2.imencode('.jpg', img)
            frame = frame.tobytes()
        else:
            frame = None
            
    else:
        # Mock: generate placeholder image
        frame = generate_mock_frame()
    
    if frame:
        with lock:
            frame_count += 1
            last_frame = frame
    
    return frame

def generate_mock_frame():
    """Generate a mock JPEG frame for testing"""
    # Create a simple colored rectangle as mock frame
    try:
        from PIL import Image, ImageDraw, ImageFont
        
        img = Image.new('RGB', (640, 480), color=(50, 50, 50))
        draw = ImageDraw.Draw(img)
        
        # Draw camera icon
        draw.rectangle([270, 190, 370, 290], outline=(100, 100, 100), width=3)
        draw.ellipse([295, 210, 345, 260], outline=(100, 100, 100), width=2)
        
        # Add text
        draw.text((200, 320), "Camera Preview", fill=(150, 150, 150))
        draw.text((220, 350), f"Frame: {frame_count}", fill=(100, 100, 100))
        draw.text((200, 380), time.strftime("%H:%M:%S"), fill=(100, 100, 100))
        
        buffer = io.BytesIO()
        img.save(buffer, format='JPEG', quality=70)
        return buffer.getvalue()
        
    except ImportError:
        # Minimal 1x1 pixel JPEG
        return b'\xff\xd8\xff\xe0\x00\x10JFIF\x00\x01\x01\x00\x00\x01\x00\x01\x00\x00\xff\xdb\x00C\x00\x08\x06\x06\x07\x06\x05\x08\x07\x07\x07\t\t\x08\n\x0c\x14\r\x0c\x0b\x0b\x0c\x19\x12\x13\x0f\x14\x1d\x1a\x1f\x1e\x1d\x1a\x1c\x1c $.\' ",#\x1c\x1c(7),01444\x1f\'9telecom/telecom//444444444444\xff\xc0\x00\x0b\x08\x00\x01\x00\x01\x01\x01\x11\x00\xff\xc4\x00\x1f\x00\x00\x01\x05\x01\x01\x01\x01\x01\x01\x00\x00\x00\x00\x00\x00\x00\x00\x01\x02\x03\x04\x05\x06\x07\x08\t\n\x0b\xff\xc4\x00\xb5\x10\x00\x02\x01\x03\x03\x02\x04\x03\x05\x05\x04\x04\x00\x00\x01}\x01\x02\x03\x00\x04\x11\x05\x12!1A\x06\x13Qa\x07"q\x142\x81\x91\xa1\x08#B\xb1\xc1\x15R\xd1\xf0$3br\x82\t\n\x16\x17\x18\x19\x1a%&\'()*456789:CDEFGHIJSTUVWXYZcdefghijstuvwxyz\x83\x84\x85\x86\x87\x88\x89\x8a\x92\x93\x94\x95\x96\x97\x98\x99\x9a\xa2\xa3\xa4\xa5\xa6\xa7\xa8\xa9\xaa\xb2\xb3\xb4\xb5\xb6\xb7\xb8\xb9\xba\xc2\xc3\xc4\xc5\xc6\xc7\xc8\xc9\xca\xd2\xd3\xd4\xd5\xd6\xd7\xd8\xd9\xda\xe1\xe2\xe3\xe4\xe5\xe6\xe7\xe8\xe9\xea\xf1\xf2\xf3\xf4\xf5\xf6\xf7\xf8\xf9\xfa\xff\xda\x00\x08\x01\x01\x00\x00?\x00\xfb\xd7\xff\xd9'

def generate_mjpeg():
    """Generate MJPEG stream"""
    while camera_active:
        frame = get_frame()
        if frame:
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
        time.sleep(0.033)  # ~30 FPS

def stop_camera():
    """Stop camera"""
    global camera, camera_active
    camera_active = False
    
    if CAMERA_TYPE == 'picamera2' and camera:
        camera.stop()
    elif CAMERA_TYPE == 'opencv' and camera:
        camera.release()
    
    logger.info("Camera stopped")

# Routes
@app.route('/')
def index():
    """Camera web interface"""
    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>SmartHome Camera</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
            body {{
                font-family: -apple-system, sans-serif;
                background: #1a1a2e;
                color: white;
                margin: 0;
                padding: 20px;
            }}
            h1 {{
                text-align: center;
                color: #4CAF50;
            }}
            .container {{
                max-width: 800px;
                margin: 0 auto;
            }}
            .video-container {{
                background: #000;
                border-radius: 10px;
                overflow: hidden;
                margin-bottom: 20px;
            }}
            img {{
                width: 100%;
                display: block;
            }}
            .controls {{
                display: flex;
                gap: 10px;
                justify-content: center;
            }}
            button {{
                padding: 15px 30px;
                border: none;
                border-radius: 25px;
                cursor: pointer;
                font-size: 16px;
                transition: transform 0.2s;
            }}
            button:hover {{
                transform: scale(1.05);
            }}
            .btn-start {{
                background: #4CAF50;
                color: white;
            }}
            .btn-stop {{
                background: #f44336;
                color: white;
            }}
            .btn-snapshot {{
                background: #2196F3;
                color: white;
            }}
            .info {{
                text-align: center;
                color: #888;
                margin-top: 20px;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <h1>📷 Camera Stream</h1>
            <div class="video-container">
                <img id="stream" src="/camera/stream" alt="Camera Stream">
            </div>
            <div class="controls">
                <button class="btn-snapshot" onclick="snapshot()">📸 Snapshot</button>
            </div>
            <p class="info">
                Camera Type: {CAMERA_TYPE or 'Mock'} | 
                Status: {'Active' if camera_active else 'Inactive'}
            </p>
        </div>
        <script>
            function snapshot() {{
                window.open('/camera/snapshot', '_blank');
            }}
        </script>
    </body>
    </html>
    """
    return html

@app.route('/camera/stream')
def video_stream():
    """MJPEG video stream"""
    if not camera_active:
        init_camera()
    return Response(
        generate_mjpeg(),
        mimetype='multipart/x-mixed-replace; boundary=frame'
    )

@app.route('/camera/snapshot')
def snapshot():
    """Single JPEG frame"""
    frame = get_frame()
    if frame:
        return Response(frame, mimetype='image/jpeg')
    return jsonify({'error': 'Failed to capture frame'}), 500

@app.route('/camera/start', methods=['POST'])
def start_camera():
    """Start camera"""
    if not camera_active:
        init_camera()
    return jsonify({
        'success': True,
        'status': 'active',
        'camera_type': CAMERA_TYPE or 'mock'
    })

@app.route('/camera/stop', methods=['POST'])
def stop_camera_route():
    """Stop camera"""
    stop_camera()
    return jsonify({
        'success': True,
        'status': 'stopped'
    })

@app.route('/camera/status')
def camera_status():
    """Get camera status"""
    return jsonify({
        'active': camera_active,
        'camera_type': CAMERA_TYPE or 'mock',
        'frame_count': frame_count
    })

@app.route('/health')
def health():
    """Health check"""
    return jsonify({
        'status': 'ok',
        'server': 'SmartHome Camera Server',
        'camera_type': CAMERA_TYPE or 'mock',
        'camera_active': camera_active
    })

if __name__ == '__main__':
    try:
        init_camera()
        logger.info("Starting SmartHome Camera Server on port 8081...")
        app.run(host='0.0.0.0', port=8081, threaded=True)
    except KeyboardInterrupt:
        logger.info("Shutting down...")
    finally:
        stop_camera()
