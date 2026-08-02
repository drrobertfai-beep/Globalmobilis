#!/bin/bash
# Global Mobilis — Capacitor Mobile App Setup
# Run this script from the site directory to wrap the web app into iOS/Android

set -e

cd /home/team/shared/site

echo "=== Installing Capacitor ==="
npm install @capacitor/core @capacitor/cli @capacitor/ios @capacitor/android

echo "=== Initializing Capacitor ==="
npx cap init "Global Mobilis" "com.globalmobilis.app" --web-dir=dist/client

echo "=== Adding iOS Platform ==="
npx cap add ios

echo "=== Adding Android Platform ==="
npx cap add android

echo "=== Configuring capacitor.config.ts ==="
cat > capacitor.config.ts << 'EOF'
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.globalmobilis.app',
  appName: 'Global Mobilis',
  webDir: 'dist/client',
  server: {
    // Use the production Vercel URL for live app, or localhost for dev
    url: process.env.CAPACITOR_URL || 'https://global-mobilis.vercel.app',
    cleartext: true,
    androidScheme: 'https',
  },
  ios: {
    contentInset: 'always',
    scheme: 'GlobalMobilis',
  },
  android: {
    allowMixedContent: true,
  },
};

export default config;
EOF

echo "=== Syncing web code ==="
npx cap sync

echo ""
echo "=== Done! ==="
echo "iOS project: ios/App/"
echo "Android project: android/"
echo ""
echo "To build and run:"
echo "  iOS (macOS only):     npx cap open ios"
echo "  Android:              npx cap open android"
echo ""
echo "Requirements for store submission:"
echo "  - Apple Developer account ($99/yr)"
echo "  - Google Play Developer account ($25 one-time)"
echo "  - Xcode (macOS only)"
echo "  - Android Studio"
