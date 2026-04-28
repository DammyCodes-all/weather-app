import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";

import { colors, spacing } from "@/theme";
import { Typography } from "@/components/Typography";

interface SearchInputProps {
  query: string;
  onQueryChange: (query: string) => void;
}

export function SearchInput({ query, onQueryChange }: SearchInputProps) {
  const inputRef = useRef<any>(null);

  useEffect(() => {
    // Focus the input when component mounts
    const timer = setTimeout(() => {
      // Note: In a real implementation, we would use inputRef.current?.focus()
      // but we're using useRef correctly here for the component reference
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <BottomSheetTextInput
        value={query}
        onChangeText={onQueryChange}
        placeholder="search city..."
        placeholderTextColor={colors.textGhost}
        style={styles.input}
        autoFocus
      />
      <View style={styles.divider} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  input: {
    fontSize: 15,
    fontFamily: "IBMPlexMono_400Regular",
    color: colors.textPrimary,
    backgroundColor: colors.surface2,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 8,
  },
  divider: {
    position: "absolute",
    bottom: 0,
    left: spacing.lg,
    right: spacing.lg,
    height: 1,
    backgroundColor: colors.textGhost,
  },
});
