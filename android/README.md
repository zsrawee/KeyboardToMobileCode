# Compact Keyboard – Android IME

A custom Android keyboard that replaces your system keyboard.
All letters in a **52px single row** — 3 input modes, Arabic & English.

## 📱 Install the APK (easiest)

Download the pre-built APK from the **Releases** tab, or build it yourself.

### Enable the keyboard
1. Install the APK
2. Open **Settings → System → Languages & input → Virtual keyboard → Manage keyboards**
3. Enable **Compact KB**
4. When typing, tap the keyboard icon (bottom nav bar) and select Compact KB

## 🔧 Build from source

### Option 1: Using Android Studio (easiest)
1. Open the `android/` folder in Android Studio
2. Wait for Gradle sync
3. Click **Build → Build Bundle(s) / APK(s) → Build APK(s)**
4. Find the APK in `app/build/outputs/apk/debug/`

### Option 2: Command-line (Linux/Mac)
```bash
# Install Java 17+ and Android SDK
# Set ANDROID_HOME to your SDK path

cd android
./gradlew assembleDebug
# APK at: app/build/outputs/apk/debug/app-debug.apk
```

### Option 3: Using Acode + Termux (build on phone)
```bash
# In Termux (not Acode terminal):
pkg update && pkg upgrade
pkg install wget openjdk-17 gradle android-sdk

# Set ANDROID_HOME
export ANDROID_HOME=/data/data/com.termux/files/usr/lib/android-sdk

# Build
cd /path/to/android
gradle assembleDebug
```

## 🎨 Customize the keyboard

Edit the keyboard layout in **`app/src/main/assets/keyboard.html`**:

- **Letter groups**: Change the `L.en.r1` and `L.ar.r1` arrays
- **Symbols**: Edit `SYM` array
- **Colors**: Edit the CSS at the top
- **Add language**: Add a new entry to `L` object

## 📁 Project structure

```
android/
├── app/
│   ├── build.gradle.kts          # App build config
│   ├── proguard-rules.pro        # ProGuard rules
│   └── src/main/
│       ├── AndroidManifest.xml   # IME service declaration
│       ├── assets/
│       │   └── keyboard.html     # ★ The keyboard UI (HTML/JS)
│       ├── java/com/compactkb/
│       │   ├── CompactKeyboardIME.kt  # IME service (main)
│       │   └── SettingsActivity.kt    # Settings screen
│       └── res/
│           ├── layout/activity_settings.xml
│           ├── xml/method.xml
│           ├── values/strings.xml
│           ├── values/themes.xml
│           ├── values/colors.xml
│           └── drawable/ic_keyboard.xml
├── build.gradle.kts              # Root build config
├── settings.gradle.kts           # Gradle settings
├── gradle.properties             # Gradle properties
└── README.md
```
