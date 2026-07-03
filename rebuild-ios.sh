#!/bin/bash

# Clean rebuild script for iOS with react-native-openalpr
# This script ensures New Architecture is disabled and performs a complete clean rebuild

echo "🧹 Step 1: Cleaning iOS build..."
cd ios
rm -rf build Pods Podfile.lock
rm -rf ~/Library/Developer/Xcode/DerivedData/LCParkGuard-*

echo "📦 Step 2: Reinstalling pods..."
pod install

echo "🔍 Step 3: Verifying New Architecture is disabled..."
if grep -q "RCTNewArchEnabled.*true" LCParkGuard/Info.plist; then
  echo "⚠️  WARNING: New Architecture is still enabled in Info.plist!"
  echo "   This will cause issues with react-native-openalpr"
  echo "   Please set RCTNewArchEnabled to false in Info.plist"
else
  echo "✅ New Architecture is disabled (required for react-native-openalpr)"
fi

cd ..

echo ""
echo "✅ Clean complete!"
echo ""
echo "📱 Next steps:"
echo "   1. Open ios/LCParkGuard.xcworkspace in Xcode (NOT .xcodeproj)"
echo "   2. Product → Clean Build Folder (Shift+Cmd+K)"
echo "   3. Select your physical device"
echo "   4. Product → Build (Cmd+B)"
echo "   5. Product → Run (Cmd+R)"
echo ""
echo "   OR run: npm run ios -- --device"
