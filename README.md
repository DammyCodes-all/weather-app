# Cosmic Weather App

A sleek, modern weather application built with React Native and Expo, featuring a dark cosmic brutalism aesthetic, real-time weather data, and comprehensive offline capabilities.

[Link to the web app]("https://aluminate-weather-app.expo.app/")

[Link to desktop build and video]("https://drive.google.com/drive/folders/1wOvA8W3Dev_cCDIkAFj63lMm-NP1rvEM?usp=drive_link")

[Link to appetize]("https://appetize.io/app/b_bwtsmlpqg2svypa4abdesa6yie")

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Data Management](#data-management)
- [Styling System](#styling-system)
- [API Integrations](#api-integrations)
- [Offline Support](#offline-support)
- [Setup & Installation](#setup--installation)
- [Development](#development)
- [Building](#building)
- [Desktop Availability](#desktop-availability)
- [Environment Variables](#environment-variables)

## 🌟 Overview

The Cosmic Weather App is a React Native application built with Expo that provides a beautiful, functional weather experience with a unique dark cosmic brutalism design aesthetic. The app features real-time weather data, detailed forecasts, hourly predictions, and a carefully crafted UI that works seamlessly both online and offline.

The application follows modern React patterns with a focus on:
- **Performance**: Optimized data fetching with React Query and intelligent caching
- **Accessibility**: Thoughtful UI/UX patterns with haptic feedback and animations
- **Reliability**: Graceful error handling and offline-first architecture
- **Beautiful Design**: Cosmic brutalism aesthetic with smooth animations powered by Reanimated

## ✨ Key Features

### Weather Information
- **Real-time Current Weather**: Get immediate conditions with temperature, humidity, wind speed, and "feels like" temperature
- **Hourly Forecast**: Detailed 24-hour forecast with temperature, precipitation chance, and weather conditions
- **Extended Forecast**: 5-day daily forecast with min/max temperatures and conditions
- **Weather Icons**: Beautiful, contextual weather icons that adapt to conditions (sunny, cloudy, rainy, snowy, etc.)

### Location & Search
- **Automatic Geolocation**: Seamless location detection on app launch with permission handling
- **Manual City Search**: Search for any city worldwide with instant geocoding results
- **Recent Searches**: Quick access to previously searched locations with persistent storage
- **Return to Current Location**: One-tap return to device's current location

### Unit Conversion
- **Celsius/Fahrenheit Toggle**: Animated unit switcher in the header
- **Persistent Preference**: User's temperature unit preference is saved locally
- **Real-time Conversion**: All temperature values update instantly when unit changes

### Offline Support
- **Automatic Caching**: All fetched weather data is automatically cached via React Query
- **Persistent Storage**: Data survives app restarts using AsyncStorage
- **Offline Indicator**: Clear banner showing connection status
- **Graceful Degradation**: App shows cached data when offline; refreshing attempts to sync

### User Experience
- **Smooth Animations**: Reanimated-powered transitions and micro-interactions
- **Pull-to-Refresh**: Native refresh control with loading states
- **Loading Skeletons**: Beautiful skeleton screens during data loading
- **Haptic Feedback**: Light haptic feedback on unit toggle
- **Error States**: Comprehensive error handling with user-friendly messages
- **Responsive Design**: Adapts beautifully to all screen sizes and orientations

## 🏗️ Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────┐
│  Presentation Layer (React Native Components)      │
│  ├── Screen: Home (Current weather + forecast)     │
│  ├── Screen: Search (City search & results)        │
│  └── Components: UI, Weather-specific, Animations  │
└────────────────┬────────────────────────────────────┘
                 │
┌─────────────────▼────────────────────────────────────┐
│  State Management Layer                             │
│  ├── WeatherContext (Redux pattern)                 │
│  ├── React Query (Server state)                     │
│  └── AsyncStorage (Persistence)                    │
└────────────────┬────────────────────────────────────┘
                 │
┌─────────────────▼────────────────────────────────────┐
│  Data Layer                                          │
│  ├── Weather API (OpenWeatherMap)                   │
│  ├── Geocoding API (Location search)                │
│  └── Device Location Services (Expo Location)      │
└──────────────────────────────────────────────────────┘
```

### Key Architectural Patterns

#### 1. **Context-based State Management**
Uses React Context API with a reducer pattern for global state:
- Temperature unit preference
- Current user coordinates
- Location permission status
- Current location tracking state

#### 2. **Server State Management with React Query**
Handles all API interactions and caching:
- Automatic cache invalidation when stale (10 minutes)
- Persistent cache storage in AsyncStorage (24-hour max age)
- Automatic retry on failure (2 attempts)
- Background refresh when app returns to foreground
- Garbage collection of old data (1-hour default)

#### 3. **Feature-based File Organization**
Weather-specific code is isolated in `src/features/weather`:
- API layer: OpenWeatherMap integration
- Custom hooks: Data fetching with React Query
- Components: Weather-specific UI elements

#### 4. **Responsive Animations**
Uses React Native Reanimated for performant animations:
- Parallax scroll effects on the header
- Smooth unit toggle indicator transitions
- Spring-based animations for natural motion

## 📁 Project Structure

```
weather-app/
├── app/                              # Expo Router navigation
│   ├── _layout.tsx                  # Root layout with providers
│   ├── index.tsx                    # Home screen (main weather view)
│   ├── search.tsx                   # Location search screen
│   ├── +not-found.tsx               # 404 screen
│   └── (tabs)/                      # Tab navigation (if used)
│
├── src/
│   ├── components/                  # Shared UI components
│   │   ├── ScreenWrapper.tsx        # Screen container with safe area
│   │   ├── Typography.tsx           # Flexible text component
│   │   └── Skeleton.tsx             # Loading skeleton
│   │
│   ├── features/
│   │   └── weather/                 # Weather feature module
│   │       ├── api/
│   │       │   └── weatherApi.ts    # OpenWeatherMap API client
│   │       ├── hooks/
│   │       │   ├── useCurrentWeather.ts
│   │       │   └── useForecast.ts
│   │       └── components/
│   │           ├── ConditionBackground.tsx      # Dynamic bg gradient
│   │           ├── TempDisplay.tsx              # Large temp display
│   │           ├── WeatherIcon.tsx              # Weather icon renderer
│   │           ├── HourlyStrip.tsx              # Horizontal hourly forecast
│   │           ├── ForecastSection.tsx          # 5-day forecast list
│   │           ├── ForecastRow.tsx              # Individual forecast row
│   │           ├── DataStrip.tsx                # Humidity, wind, feels-like
│   │           ├── SearchInput.tsx              # Search input field
│   │           ├── SearchResults.tsx            # Geocoding results list
│   │           ├── RecentSearches.tsx           # Saved location history
│   │           ├── OfflineBanner.tsx            # Offline indicator
│   │           └── HomeScreenSkeleton.tsx       # Loading state
│   │
│   ├── hooks/
│   │   └── useNetworkStatus.ts      # Network connectivity detector
│   │
│   ├── store/
│   │   ├── WeatherContext.tsx       # Global weather state
│   │   └── queryClient.ts           # React Query config & persister
│   │
│   ├── utils/
│   │   ├── location.ts              # Geolocation & permissions
│   │   ├── geocoding.ts             # Address searching (deprecated)
│   │   ├── formatters.ts            # Date/time formatting
│   │   ├── conditionMap.ts          # Weather code → label & icon mapping
│   │   └── forecastProcessor.ts     # Forecast data grouping & filtering
│   │
│   ├── theme/
│   │   └── index.ts                 # Color, typography, spacing tokens
│   │
│   └── icons/                       # Custom SVG icons (if any)
│
├── components/
│   └── ui/                          # Additional UI components
│
├── assets/
│   └── images/                      # App icons, splash screens
│
├── Configuration Files
│   ├── app.json                     # Expo app config
│   ├── eas.json                     # EAS Build config
│   ├── package.json                 # Dependencies
│   ├── tsconfig.json                # TypeScript config
│   ├── tailwind.config.js           # NativeWind/Tailwind config
│   ├── metro.config.js              # Metro bundler config
│   ├── babel.config.js              # Babel config
│   ├── eslint.config.js             # ESLint rules
│   └── global.css                   # Global Tailwind styles
│
└── Scripts
    └── scripts/
        └── reset-project.js         # Project reset utility
```

## 🛠 Tech Stack

### Core Framework
- **React Native 0.81.5**: Cross-platform mobile development
- **Expo SDK 54**: Managed React Native platform with pre-built APIs
- **Expo Router 6**: File-based routing for navigation
- **TypeScript 5.9**: Full type safety

### State Management
- **@tanstack/react-query 5.100**: Server state management, caching, synchronization
- **@tanstack/react-query-persist-client**: Persistent query cache in AsyncStorage
- **React Context API**: Global client state (unit, coordinates, permissions)
- **@react-native-async-storage/async-storage 2.2**: Persistent local storage

### UI & Styling
- **NativeWind 4.2**: Tailwind CSS for React Native
- **Reanimated 4.1**: High-performance animations
- **Moti 0.30**: Animation library built on Reanimated
- **expo-linear-gradient**: Gradient backgrounds
- **@expo/vector-icons**: Icon library

### Location & Network
- **expo-location**: Device geolocation and permissions
- **@react-native-community/netinfo 11.4**: Network connectivity detection
- **axios 1.15**: HTTP client for API requests

### Utilities
- **dayjs 1.11**: Lightweight date manipulation
- **expo-haptics**: Haptic feedback
- **expo-blur**: Blur effects
- **expo-font**: Custom font loading

## 💾 Data Management

### React Query Configuration

The app uses React Query with the following defaults:

```typescript
{
  staleTime: 10 * 60 * 1000,        // Data fresh for 10 minutes
  gcTime: 60 * 60 * 1000,            // Keep cache for 1 hour
  retry: 2,                          // Retry failed requests twice
}
```

### Caching Strategy

1. **Memory Cache**: React Query keeps recent data in memory
2. **Persistent Cache**: AsyncStorage stores data with 24-hour max age
3. **Stale-While-Revalidate**: 
   - Serves cached data immediately while refreshing in background
   - If data is older than 10 minutes, it's considered stale
   - When app comes to foreground, stale data is automatically refreshed

### Data Flow

```
User Action
    ↓
Component Hook (useCurrentWeather)
    ↓
React Query
    ├→ Memory Cache (instant)
    ├→ AsyncStorage (if memory miss)
    └→ API (if cache miss or stale)
         ↓
    OpenWeatherMap API
         ↓
    Response → Normalize → Cache → UI Update
```

## 🎨 Styling System

### Design Philosophy: Cosmic Brutalism

A dark, minimalist aesthetic inspired by brutalist architecture with cosmic elements. The design emphasizes:
- Deep space blacks and blues
- Minimal UI chrome
- Elegant typography
- Subtle geometric accents
- Smooth, purposeful animations

### Color Palette

| Token | Hex Value | Usage |
|-------|-----------|-------|
| `void` | `#080810` | Primary background (deep space black) |
| `surface` | `#0F0F1A` | Secondary background (dark cosmic blue) |
| `surface2` | `#161626` | Tertiary background (slightly lighter) |
| `accent` | `#4169FF` | Primary action color (electric blue) |
| `warm` | `#C9873A` | Secondary accent (warm golden) |
| `textPrimary` | `#F0EDE8` | Primary text (off-white) |
| `textMuted` | `#5A5A72` | Secondary text (muted blue) |
| `textGhost` | `#2E2E45` | Tertiary text (ghost text) |

### Typography

| Font | Family | Use Case |
|------|--------|----------|
| **Display** | DM Serif Display | Headings (city name, temperature) |
| **Mono** | IBM Plex Mono 400 | Body text, data values |
| **Label** | IBM Plex Mono 500 | Small labels, UI controls |

### Font Sizes

- `xs`: 11px - Smallest text
- `sm`: 13px - Small text, labels
- `base`: 15px - Body text
- `lg`: 18px - Large body
- `xl`: 22px - Large headings
- `2xl`: 28px - XL headings
- `4xl`: 42px - Extra large headings
- `6xl`: 72px - Hero text

### Spacing System

- `xs`: 4px
- `sm`: 8px
- `md`: 16px
- `lg`: 24px
- `xl`: 32px
- `2xl`: 48px

### Styling Approach

The app uses a combination of:
- **NativeWind classes**: For quick layout and responsive sizing
- **Inline styles**: For dynamic values and animations
- **Theme tokens**: Centralized in `src/theme/index.ts`
- **StyleSheet**: For StyleSheet.create() performance optimization

Example:
```tsx
<View className="flex-1 items-center justify-center px-8">
  <Typography 
    variant="display" 
    size="2xl" 
    color={colors.textPrimary}
  >
    Heading
  </Typography>
</View>
```

## 🌐 API Integrations

### OpenWeatherMap API

The app integrates with three OpenWeatherMap endpoints:

#### 1. **Current Weather**
- **Endpoint**: `/weather`
- **Parameters**: `lat`, `lon`
- **Response**: Current conditions, temperature, humidity, wind, sunrise/sunset
- **Hook**: `useCurrentWeather(coords)`
- **Cache**: 10-minute stale time

```typescript
interface CurrentWeatherResponse {
  name: string;
  coord: { lon: number; lat: number };
  weather: WeatherCondition[];
  main: { temp, feels_like, humidity, temp_min, temp_max };
  wind: { speed };
  sys: { sunrise, sunset, country };
  dt: number;  // Unix timestamp
}
```

#### 2. **5-Day Forecast**
- **Endpoint**: `/forecast`
- **Parameters**: `lat`, `lon`
- **Response**: 40 3-hour forecast entries (5 days)
- **Hook**: `useForecast(coords)`
- **Cache**: 10-minute stale time

```typescript
interface ForecastResponse {
  list: ForecastItem[];
  city: { name, country };
}

interface ForecastItem {
  dt: number;
  main: { temp, feels_like, humidity, temp_min, temp_max };
  weather: WeatherCondition[];
  wind: { speed };
  pop: number;  // Probability of precipitation
}
```

#### 3. **Geocoding**
- **Endpoint**: `/geo/1.0/direct`
- **Parameters**: `q` (query), `limit` (5 max results)
- **Response**: Location matches with coordinates
- **Function**: `fetchGeocodingResults(query)`

```typescript
interface GeocodingResult {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
}
```

### API Error Handling

The app implements custom error handling with user-friendly messages:

```typescript
class WeatherApiError extends Error {
  code: number;
  userMessage: string;
}
```

**Error Messages**:
- **401**: "Invalid weather API key."
- **404**: "Weather data was not found for this location."
- **429**: "Rate limit reached. Try again in a minute."
- **500+**: "Weather service is temporarily unavailable."
- **Network**: "Unable to load weather data right now."

### API Configuration

- **Base URL**: `https://api.openweathermap.org/data/2.5`
- **Timeout**: 10 seconds
- **Auth**: API key via `EXPO_PUBLIC_OWM_KEY` environment variable
- **Response Interceptor**: Logs API calls in development, transforms errors

## 🔌 Offline Support

### Architecture

The app uses a layered offline-first approach:

```
Request Flow:
  Memory Cache (instant) → Async Storage (10ms) → API (network call)

Write Flow:
  UI State → React Query → Async Storage → API (background)
```

### Features

1. **Automatic Caching**
   - All API responses are automatically cached by React Query
   - Cache persisted to AsyncStorage with `@tanstack/query-async-storage-persister`
   - 24-hour maximum age for persisted data

2. **Offline Indicator**
   - Banner shows "YOU'RE OFFLINE" when internet is disconnected
   - Uses `@react-native-community/netinfo` to detect connection status
   - Updates in real-time when network changes

3. **Background Refresh**
   - When app returns to foreground (after 10+ minute absence), stale data is refreshed
   - Handled in `app/_layout.tsx` via `AppState` listener
   - Only refetches if data is stale (older than 10 minutes)

4. **Graceful Degradation**
   - Shows cached data even when offline
   - Disables refresh control when offline
   - Shows offline-specific error messages

### User Experience

- **Online with cached data**: Normal experience with background refresh
- **Online without cache**: Shows loading skeleton, then data
- **Offline with cache**: Shows cached data with offline banner
- **Offline without cache**: Shows offline error message
- **Connection lost during fetch**: Fails over to cached data gracefully

## 🚀 Setup & Installation

### Prerequisites

- Node.js 16+ and npm/pnpm
- Expo CLI (`npm install -g eas-cli`)
- iOS Simulator (Mac) or Android Emulator for testing
- OpenWeatherMap API key (free tier available at openweathermap.org)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd weather-app
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Set up environment variables**
   Create `.env.local` or set in `.env`:
   ```
   EXPO_PUBLIC_OWM_KEY=your_openweathermap_api_key
   ```

4. **Start the development server**
   ```bash
   pnpm start
   # or
   npm start
   ```

5. **Run on device/emulator**
   - **iOS**: Press `i` in terminal, or `pnpm ios`
   - **Android**: Press `a` in terminal, or `pnpm android`
   - **Web**: Press `w` in terminal, or `pnpm web`

## 🔧 Development

### Available Scripts

```bash
# Start development server
pnpm start

# Run on specific platform
pnpm ios          # iOS Simulator
pnpm android      # Android Emulator
pnpm web          # Web browser

# Linting
pnpm lint         # Run ESLint

# Project utilities
pnpm reset-project  # Reset to clean state
```

### Code Style

- **Language**: TypeScript (strict mode)
- **Formatting**: ESLint with Expo config
- **CSS**: Tailwind/NativeWind with custom theme
- **Naming**: camelCase for functions/variables, PascalCase for components

### Key Development Patterns

1. **Creating New Components**
   ```tsx
   import { View } from 'react-native';
   import { colors, spacing } from '@/theme';
   
   interface Props {
    // ...
   }
   
   export function MyComponent({ }: Props) {
     return (
       <View className="flex-1">
         {/* ... */}
       </View>
     );
   }
   ```

2. **Using Weather Data**
   ```tsx
   const { useCurrentWeather } = require('@/features/weather/hooks');
   
   function MyWeatherComponent() {
     const { data, isLoading, error } = useCurrentWeather(coords);
     
     if (isLoading) return <LoadingSkeleton />;
     if (error) return <ErrorState />;
     
     return <WeatherDisplay weather={data} />;
   }
   ```

3. **Accessing Global State**
   ```tsx
   import { useWeatherStore } from '@/store/WeatherContext';
   
   function MyComponent() {
     const { unit, setUnit, coords } = useWeatherStore();
     // ...
   }
   ```

## 🏗️ Building

### Development Build

```bash
pnpm start
# Then select platform in terminal
```

### Production Build (EAS Build)

1. **Configure EAS** (first time only)
   ```bash
   eas build:configure
   ```

2. **Build for iOS**
   ```bash
   eas build --platform ios
   ```

3. **Build for Android**
   ```bash
   eas build --platform android
   ```

4. **Submit to App Store/Play Store**
   ```bash
   eas submit --platform ios
   eas submit --platform android
   ```

### Local Build (Advanced)

```bash
# iOS (requires Mac)
cd ios && pod install && cd ..
xcodebuild -workspace ios/weatherapp.xcworkspace -scheme weatherapp

# Android
cd android && ./gradlew build && cd ..
```

## 🖥️ Desktop Availability

The app is also available as a Linux desktop application through Electron.

### Supported Desktop Packages

- **Debian package (`.deb`)**: Recommended for Ubuntu, Debian, and compatible distributions.
- **AppImage (`.AppImage`)**: Portable Linux build. It may require additional system configuration on some newer distributions.
- **ZIP archive**: Portable extracted Linux build for manual use.

### Build Desktop Packages

```bash
# Export the Expo web build and create Linux desktop installers
pnpm run make
```

Generated desktop artifacts are written to:

```text
out/make/
```

### Linux AppImage Sandbox Note

Some newer Linux distributions, especially Ubuntu 24.04 and related AppArmor-based systems, can block Electron AppImages from starting with an error like:

```text
The SUID sandbox helper binary was found, but is not configured correctly.
You need to make sure that .../chrome-sandbox is owned by root and has mode 4755.
```

This is a known Electron AppImage sandbox/user-namespace issue, not a weather app runtime error. The `.deb` package is the recommended install method for Ubuntu/Debian users because it avoids this AppImage-specific launch problem.

Possible AppImage workarounds:

- Run the AppImage from a terminal with `--no-sandbox`.
- Create an AppArmor profile that allows the AppImage to use unprivileged user namespaces.
- Use a distribution/version that allows Electron AppImage sandboxing by default.

Use `--no-sandbox` only when you understand the security tradeoff. Electron documents this flag as disabling Chromium sandboxing.

## 🔑 Environment Variables

### Required Variables

| Variable | Description | Where to Get |
|----------|-------------|--------------|
| `EXPO_PUBLIC_OWM_KEY` | OpenWeatherMap API Key | [openweathermap.org](https://openweathermap.org/api) |

### Setup Methods

1. **Local Development** (`.env.local`):
   ```
   EXPO_PUBLIC_OWM_KEY=sk_test_xxxxx
   ```

2. **Secrets Management**:
   - Use Expo Secrets for EAS builds
   - Use GitHub Secrets for CI/CD

3. **App Signing** (`app.json`):
   ```json
   {
     "extra": {
       "eas": {
         "projectId": "your-project-id"
       }
     }
   }
   ```

## 📊 Performance Optimizations

- **React Query**: Deduplication, caching, background refresh
- **Reanimated**: Native thread animations (60/120 fps)
- **Moti**: Optimized micro-interactions
- **Images**: Expo Image for fast image loading
- **Lazy Loading**: Components load with Suspense where applicable
- **Memoization**: useMemo/useCallback for expensive computations

## 🐛 Troubleshooting

### Weather Data Not Loading
- Check API key in `.env.local`
- Verify OpenWeatherMap account is active
- Check network connectivity
- Review device location permissions

### Location Not Working
- On iOS: Ensure location permission is granted in Settings
- On Android: Ensure fine location permission is granted
- Check device GPS is enabled
- Restart app after permission grant

### Cache Issues
- Clear AsyncStorage: `AsyncStorage.clear()`
- Clear React Query cache: `queryClient.clear()`
- Reset app state: `pnpm reset-project`

### Styling Issues
- Rebuild Tailwind: `pnpm start -- --clear`
- Clear NativeWind cache: `rm -rf node_modules/.cache`
- Restart Metro bundler

### AppImage Does Not Start
- Prefer the generated `.deb` package on Ubuntu/Debian.
- If the terminal error mentions `chrome-sandbox` and mode `4755`, see [Linux AppImage Sandbox Note](#linux-appimage-sandbox-note).
- If the error mentions FUSE, install the distro's FUSE compatibility package, such as `libfuse2` or `libfuse2t64`.

## 👥 Contributors

Built by with love by aluminate

---

**Happy weather tracking! 🌤️**
