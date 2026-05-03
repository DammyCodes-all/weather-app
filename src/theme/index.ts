import { Platform } from "react-native";

export const colors = {
  void: "#080810",
  surface: "#0F0F1A",
  surface2: "#161626",
  accent: "#4169FF",
  warm: "#C9873A",
  textPrimary: "#F0EDE8",
  textMuted: Platform.OS === "web" ? "#8E8EA3" : "#5A5A72",
  textGhost: "#2E2E45",
} as const;

export const typography = {
  fontFamily: {
    display: "DMSerifDisplay_400Regular",
    mono: "IBMPlexMono_400Regular",
    label: "IBMPlexMono_500Medium",
  },
  size: {
    xs: 11,
    sm: 13,
    base: 15,
    lg: 18,
    xl: 22,
    "2xl": 28,
    "4xl": 42,
    "6xl": 72,
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  "2xl": 48,
} as const;

export const radius = {
  sm: 4,
  md: 8,
  lg: 16,
  full: 9999,
} as const;
