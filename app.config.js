import 'dotenv/config';

export default {
  expo: {
    name: "anyel",
    slug: "anyel",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "anyel",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    extra: {
      // Supabase configuration - These are PUBLIC keys safe for client-side
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL || "https://kavwytklydmgkleejoxn.supabase.co",
      supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imthdnd5dGtseWRtZ2tsZWVqb3huIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2MTY2MzUsImV4cCI6MjA2NDE5MjYzNX0.VzkW0w7pDDefwuQspdrqzyTgAdjX8wHNjMsIveJjYzM",
    },
    ios: {
      supportsTablet: true,
      infoPlist: {
        NSCameraUsageDescription: "Esta aplicación necesita acceso a la cámara para realizar videollamadas médicas.",
        NSMicrophoneUsageDescription: "Esta aplicación necesita acceso al micrófono para realizar videollamadas médicas.",
        NSLocationWhenInUseUsageDescription: "MediGo necesita acceso a tu ubicación para servicios de emergencia, encontrar farmacias cercanas y proporcionar servicios médicos a domicilio con precisión.",
        NSLocationAlwaysAndWhenInUseUsageDescription: "MediGo necesita acceso a tu ubicación para servicios de emergencia en tiempo real y seguimiento de paramédicos."
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      edgeToEdgeEnabled: true,
      permissions: [
        "android.permission.CAMERA",
        "android.permission.RECORD_AUDIO",
        "android.permission.MODIFY_AUDIO_SETTINGS",
        "android.permission.WRITE_EXTERNAL_STORAGE",
        "android.permission.READ_EXTERNAL_STORAGE",
        "android.permission.ACCESS_FINE_LOCATION",
        "android.permission.ACCESS_COARSE_LOCATION",
        "android.permission.FOREGROUND_SERVICE",
        "android.permission.ACCESS_BACKGROUND_LOCATION"
      ],
      package: "com.anonymous.anyel"
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff"
        }
      ],
      "expo-secure-store",
      [
        "expo-camera",
        {
          cameraPermission: "Permitir a $(PRODUCT_NAME) acceder a tu cámara para videollamadas médicas.",
          microphonePermission: "Permitir a $(PRODUCT_NAME) acceder a tu micrófono para videollamadas médicas.",
          recordAudioAndroid: true
        }
      ],
      [
        "expo-location",
        {
          locationAlwaysAndWhenInUsePermission: "MediGo necesita acceso a tu ubicación para servicios de emergencia, encontrar farmacias cercanas y proporcionar servicios médicos a domicilio con precisión.",
          locationAlwaysPermission: "MediGo necesita acceso continuo a tu ubicación para el seguimiento en tiempo real durante emergencias médicas.",
          locationWhenInUsePermission: "MediGo necesita acceso a tu ubicación para servicios de emergencia y encontrar proveedores médicos cercanos.",
          isIosBackgroundLocationEnabled: true,
          isAndroidBackgroundLocationEnabled: true,
          isAndroidForegroundServiceEnabled: true
        }
      ],
      [
        "@rnmapbox/maps",
        {
          RNMapboxMapsImpl: "mapbox",
          RNMapboxMapsDownloadToken: "pk.eyJ1IjoibWVkaWdvYXBwIiwiYSI6ImNtNWI5bnRrYTB3YjMya3NldGFjOGNwZ2oifQ.1YvQZLO-G7oPEZ3yxVQI7A"
        }
      ]
    ],
    experiments: {
      typedRoutes: true
    }
  }
}; 