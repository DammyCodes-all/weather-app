import { View } from "react-native";

import { ScreenWrapper } from "@/components/ScreenWrapper";
import { Typography } from "@/components/Typography";
import { colors, typography } from "@/theme";

const swatches = [
  { key: "void", value: colors.void },
  { key: "surface", value: colors.surface },
  { key: "surface-2", value: colors.surface2 },
  { key: "accent", value: colors.accent },
  { key: "warm", value: colors.warm },
  { key: "text-primary", value: colors.textPrimary },
  { key: "text-muted", value: colors.textMuted },
  { key: "text-ghost", value: colors.textGhost },
] as const;

export default function HomeScreen() {
  return (
    <ScreenWrapper scrollable>
      <View className="flex-1 gap-8 px-6 py-8">
        <View className="gap-3">
          <Typography variant="label" size="xs" color={colors.textMuted}>
            PHASE 1 TYPOGRAPHY PREVIEW
          </Typography>
          <Typography variant="display" size="4xl">
            24
          </Typography>
          <Typography
            variant="mono"
            size="sm"
            color={colors.textMuted}
            style={{ letterSpacing: 2 }}
          >
            CLEAR SKY / WEATHER STATION
          </Typography>
          <Typography variant="label" size="base" color={colors.accent}>
            Unit label sample in IBM Plex Mono Medium
          </Typography>
        </View>

        <View className="gap-3">
          <Typography variant="label" size="xs" color={colors.textMuted}>
            SIZE SCALE
          </Typography>
          {(Object.keys(typography.size) as any).map((sizeKey: any) => (
            <Typography key={sizeKey} variant="mono" size={sizeKey}>
              {sizeKey} /{" "}
              {typography.size[sizeKey as keyof typeof typography.size]}px
            </Typography>
          ))}
        </View>

        <View className="gap-3 pb-8">
          <Typography variant="label" size="xs" color={colors.textMuted}>
            COLOR TOKENS
          </Typography>
          {swatches.map((swatch) => (
            <View key={swatch.key} className="flex-row items-center gap-3">
              <View
                className="h-10 w-10 rounded-md border border-text-ghost"
                style={{ backgroundColor: swatch.value }}
              />
              <Typography variant="mono" size="sm" color={colors.textPrimary}>
                {swatch.key} - {swatch.value}
              </Typography>
            </View>
          ))}
        </View>
      </View>
    </ScreenWrapper>
  );
}
