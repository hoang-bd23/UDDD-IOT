/**
 * Firebase Configuration
 * Central configuration for Firebase services
 * 
 * SETUP INSTRUCTIONS:
 * 1. Go to https://console.firebase.google.com
 * 2. Create a new project or use existing
 * 3. Add Android app with package name: com.smarthomeiot
 * 4. Download google-services.json and place in android/app/
 * 5. Add iOS app (optional) and download GoogleService-Info.plist
 * 6. Enable Authentication > Email/Password in Firebase Console
 * 7. Enable Realtime Database and set rules
 */

// Firebase is auto-initialized by @react-native-firebase/app
// when google-services.json is properly configured

export const FIREBASE_CONFIG = {
    // Database paths
    paths: {
        users: 'users',
        devices: 'devices',
        rooms: 'rooms',
        schedules: 'schedules',
        deviceHistory: 'deviceHistory',
    },

    // Realtime Database rules (for reference)
    // Copy these to Firebase Console > Realtime Database > Rules
    databaseRules: `
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
  `,
};

export default FIREBASE_CONFIG;
