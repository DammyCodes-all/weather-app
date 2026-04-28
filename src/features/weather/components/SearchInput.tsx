import { View, StyleSheet, TextInput } from "react-native";
import { useEffect, useRef } from "react";

import { colors, spacing } from "@/theme";

interface SearchInputProps {
  query: string;
  onQueryChange: (query: string) => void;
}

export function SearchInput({ query, onQueryChange }: SearchInputProps) {
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    // Focus the input when component mounts
    const timer = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <TextInput
        ref={inputRef}
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
