#!/usr/bin/env python3
"""
Raspberry Pi LED Control Server (Optimized)
Provides REST API for controlling LED via GPIO

Endpoints:
- GET  /         : Health check and web interface
- GET  /health   : Health check (JSON)
- GET  /led      : Get current LED state
- POST /led      : Set LED state (body: {"state": "ON" or "OFF"})

Hardware:
- LED connected to GPIO 18 (BCM numbering)
- LED anode (+) -> GPIO 18
- LED cathode (-) -> 220Ω resistor -> GND
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
import time
import logging
import threading

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Try to import GPIO, fallback to mock mode
try:
    import RPi.GPIO as GPIO
    GPIO_AVAILABLE = True
    logger.info("Running on Raspberry Pi with GPIO support")
except ImportError:
    GPIO_AVAILABLE = False
    logger.warning("GPIO not available, running in mock mode")

app = Flask(__name__)
# Enable CORS for mobile app with better configuration
CORS(app, resources={
    r"/*": {
        "origins": "*",
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

# Configuration
LED_PIN = 18
led_state = False
last_updated = None
gpio_lock = threading.Lock()

def setup_gpio():
    """Initialize GPIO pins"""
    if GPIO_AVAILABLE:
        with gpio_lock:
            GPIO.setmode(GPIO.BCM)
            GPIO.setwarnings(False)
            GPIO.setup(LED_PIN, GPIO.OUT)
            GPIO.output(LED_PIN, GPIO.LOW)
        logger.info(f"GPIO initialized, LED on pin {LED_PIN}")

def set_led(state):
    """Set LED state (thread-safe)"""
    global led_state, last_updated
    
    with gpio_lock:
        led_state = state
        last_updated = time.strftime("%Y-%m-%d %H:%M:%S")
        
        if GPIO_AVAILABLE:
            GPIO.output(LED_PIN, GPIO.HIGH if state else GPIO.LOW)
    
    logger.info(f"LED set to {'ON' if state else 'OFF'}")

def cleanup_gpio():
    """Cleanup GPIO on exit"""
    if GPIO_AVAILABLE:
        with gpio_lock:
            GPIO.cleanup()
        logger.info("GPIO cleaned up")

# Routes
@app.route('/')
def index():
    """Web interface"""
    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>SmartHome LED Control</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
            body {{
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                margin: 0;
                display: flex;
                justify-content: center;
                align-items: center;
            }}
            .card {{
                background: white;
                border-radius: 20px;
                padding: 40px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.2);
                text-align: center;
                max-width: 300px;
            }}
            h1 {{
                color: #333;
                margin-bottom: 10px;
            }}
            .status {{
                font-size: 24px;
                font-weight: bold;
                margin: 20px 0;
                padding: 15px 30px;
                border-radius: 50px;
            }}
            .on {{
                background: #4CAF50;
                color: white;
            }}
            .off {{
                background: #9E9E9E;
                color: white;
            }}
            button {{
                font-size: 18px;
                padding: 15px 40px;
                border: none;
                border-radius: 50px;
                cursor: pointer;
                margin: 5px;
                transition: transform 0.2s;
            }}
            button:hover {{
                transform: scale(1.05);
            }}
            .btn-on {{
                background: #4CAF50;
                color: white;
            }}
            .btn-off {{
                background: #f44336;
                color: white;
            }}
            .time {{
                color: #666;
                font-size: 12px;
                margin-top: 20px;
            }}
            .mode {{
                color: #999;
                font-size: 11px;
                margin-top: 10px;
            }}
        </style>
    </head>
    <body>
        <div class="card">
            <h1>💡 LED Control</h1>
            <p>SmartHome IoT Server</p>
            <div class="status {'on' if led_state else 'off'}">
                {'🌟 ON' if led_state else '⚫ OFF'}
            </div>
            <div>
                <button class="btn-on" onclick="setLed(true)">Turn ON</button>
                <button class="btn-off" onclick="setLed(false)">Turn OFF</button>
            </div>
            <p class="time">Last updated: {last_updated or 'Never'}</p>
            <p class="mode">Mode: {'GPIO' if GPIO_AVAILABLE else 'Mock (no GPIO)'}</p>
        </div>
        <script>
            async function setLed(state) {{
                try {{
                    const response = await fetch('/led', {{
                        method: 'POST',
                        headers: {{ 'Content-Type': 'application/json' }},
                        body: JSON.stringify({{ state: state ? 'ON' : 'OFF' }})
                    }});
                    if (response.ok) {{
                        location.reload();
                    }}
                }} catch (err) {{
                    alert('Error: ' + err.message);
                }}
            }}
        </script>
    </body>
    </html>
    """
    return html

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint (quick response)"""
    return jsonify({
        'status': 'ok',
        'gpio_available': GPIO_AVAILABLE,
        'led_pin': LED_PIN,
        'server': 'SmartHome IoT LED Server',
        'version': '1.1.0'
    })

@app.route('/led', methods=['GET'])
def get_led():
    """Get current LED state"""
    return jsonify({
        'state': 'ON' if led_state else 'OFF',
        'is_on': led_state,
        'last_updated': last_updated,
        'gpio_available': GPIO_AVAILABLE
    })

@app.route('/led', methods=['POST'])
def post_led():
    """Set LED state"""
    try:
        data = request.get_json(force=True)
    except Exception:
        return jsonify({'error': 'Invalid JSON'}), 400
    
    if not data or 'state' not in data:
        return jsonify({'error': 'Missing "state" field'}), 400
    
    state_str = str(data['state']).upper()
    
    if state_str not in ['ON', 'OFF']:
        return jsonify({'error': 'State must be "ON" or "OFF"'}), 400
    
    new_state = state_str == 'ON'
    set_led(new_state)
    
    return jsonify({
        'success': True,
        'state': 'ON' if led_state else 'OFF',
        'is_on': led_state,
        'last_updated': last_updated
    })

# Handle OPTIONS preflight requests
@app.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        response = app.make_default_options_response()
        return response

if __name__ == '__main__':
    try:
        setup_gpio()
        logger.info("Starting SmartHome LED Server on port 8080...")
        logger.info("Server is multi-threaded for better performance")
        
        # Run with threading enabled for better concurrent handling
        app.run(
            host='0.0.0.0', 
            port=8080, 
            debug=False,
            threaded=True,  # Enable multi-threading!
            use_reloader=False
        )
    except KeyboardInterrupt:
        logger.info("Shutting down...")
    finally:
        cleanup_gpio()
