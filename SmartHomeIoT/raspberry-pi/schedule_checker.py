#!/usr/bin/env python3
"""
Schedule Checker for SmartHome IoT
Checks Firebase for schedules and automatically controls LED

This script runs continuously and checks Firebase every minute
for any schedules that need to be executed.

Requirements:
    pip install firebase-admin requests

Usage:
    python schedule_checker.py

Setup:
    1. Download Firebase Admin SDK credentials from Firebase Console
    2. Save as 'firebase-credentials.json' in the same directory
    3. Update FIREBASE_DATABASE_URL below
    4. Run the script
"""

import time
import json
import os
from datetime import datetime
import requests

# Try to import Firebase Admin SDK
try:
    import firebase_admin
    from firebase_admin import credentials, db
    FIREBASE_AVAILABLE = True
except ImportError:
    print("⚠️  firebase-admin not installed. Using REST API fallback.")
    FIREBASE_AVAILABLE = False

# Configuration
FIREBASE_DATABASE_URL = "https://iot-project-4b70e-default-rtdb.asia-southeast1.firebasedatabase.app"
LED_SERVER_URL = "http://localhost:8080"
CHECK_INTERVAL = 60  # seconds

# Firebase credentials file path
CREDENTIALS_FILE = os.path.join(os.path.dirname(__file__), "firebase-credentials.json")

# Track executed schedules to avoid re-execution
executed_schedules = {}


def init_firebase():
    """Initialize Firebase Admin SDK if available"""
    if not FIREBASE_AVAILABLE:
        return False
    
    if not os.path.exists(CREDENTIALS_FILE):
        print(f"⚠️  Credentials file not found: {CREDENTIALS_FILE}")
        print("   Using REST API fallback (read-only, public rules required)")
        return False
    
    try:
        cred = credentials.Certificate(CREDENTIALS_FILE)
        firebase_admin.initialize_app(cred, {
            'databaseURL': FIREBASE_DATABASE_URL
        })
        print("✅ Firebase Admin SDK initialized")
        return True
    except Exception as e:
        print(f"❌ Failed to initialize Firebase: {e}")
        return False


def get_schedules_rest():
    """Fetch schedules using REST API (requires public read rules)"""
    try:
        # This only works with public rules or with auth token
        url = f"{FIREBASE_DATABASE_URL}/schedules.json"
        response = requests.get(url, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data:
                # Flatten nested structure
                all_schedules = []
                for uid, schedules in data.items():
                    if schedules:
                        for schedule_id, schedule in schedules.items():
                            schedule['id'] = schedule_id
                            schedule['uid'] = uid
                            all_schedules.append(schedule)
                return all_schedules
        return []
    except Exception as e:
        print(f"❌ REST API error: {e}")
        return []


def get_schedules_sdk():
    """Fetch schedules using Firebase Admin SDK"""
    try:
        ref = db.reference('schedules')
        data = ref.get()
        
        if data:
            all_schedules = []
            for uid, schedules in data.items():
                if schedules:
                    for schedule_id, schedule in schedules.items():
                        schedule['id'] = schedule_id
                        schedule['uid'] = uid
                        all_schedules.append(schedule)
            return all_schedules
        return []
    except Exception as e:
        print(f"❌ Firebase SDK error: {e}")
        return []


def control_led(action):
    """Send command to LED server"""
    try:
        response = requests.post(
            f"{LED_SERVER_URL}/led",
            json={"state": action},
            timeout=5
        )
        return response.status_code == 200
    except Exception as e:
        print(f"❌ LED control error: {e}")
        return False


def get_current_time():
    """Get current time as HH:MM string"""
    return datetime.now().strftime("%H:%M")


def get_current_day():
    """Get current day as short name (Mon, Tue, etc.)"""
    days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    return days[datetime.now().weekday()]


def should_execute(schedule, current_time, current_day):
    """Check if schedule should be executed now"""
    if not schedule.get('enabled', True):
        return False
    
    if schedule.get('time') != current_time:
        return False
    
    repeat = schedule.get('repeat', [])
    
    # If no repeat days, it's a one-time schedule
    if not repeat:
        # Check if already executed today
        schedule_id = schedule.get('id')
        today = datetime.now().strftime("%Y-%m-%d")
        if executed_schedules.get(schedule_id) == today:
            return False
        return True
    
    # Check if current day is in repeat list
    return current_day in repeat


def mark_executed(schedule_id):
    """Mark schedule as executed today"""
    today = datetime.now().strftime("%Y-%m-%d")
    executed_schedules[schedule_id] = today


def main():
    print("=" * 50)
    print("🏠 SmartHome IoT Schedule Checker")
    print("=" * 50)
    print(f"📍 Firebase: {FIREBASE_DATABASE_URL}")
    print(f"💡 LED Server: {LED_SERVER_URL}")
    print(f"⏰ Check interval: {CHECK_INTERVAL}s")
    print()
    
    # Initialize Firebase
    use_sdk = init_firebase()
    get_schedules = get_schedules_sdk if use_sdk else get_schedules_rest
    
    print()
    print("🔄 Starting schedule checker loop...")
    print("-" * 50)
    
    while True:
        try:
            current_time = get_current_time()
            current_day = get_current_day()
            
            # Fetch schedules
            schedules = get_schedules()
            
            # Check each schedule
            for schedule in schedules:
                if should_execute(schedule, current_time, current_day):
                    action = schedule.get('action', 'OFF')
                    schedule_id = schedule.get('id')
                    
                    print(f"⏰ [{current_time}] Executing schedule: {action}")
                    
                    if control_led(action):
                        print(f"   ✅ LED turned {action}")
                        mark_executed(schedule_id)
                    else:
                        print(f"   ❌ Failed to control LED")
            
            # Wait for next check
            time.sleep(CHECK_INTERVAL)
            
        except KeyboardInterrupt:
            print("\n👋 Schedule checker stopped")
            break
        except Exception as e:
            print(f"❌ Error in main loop: {e}")
            time.sleep(CHECK_INTERVAL)


if __name__ == "__main__":
    main()
