import { useEffect } from "react";
import { useRouter } from "expo-router";
import { Platform } from "react-native";

interface KeyboardShortcutsHandlerProps {
  onRefresh?: () => void;
}

export function useKeyboardShortcuts({ onRefresh }: KeyboardShortcutsHandlerProps) {
  const router = useRouter();

  useEffect(() => {
    if (Platform.OS !== "web") {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!event.ctrlKey) return;

      if (event.key === "r" || event.key === "R") {
        event.preventDefault();
        if (onRefresh) {
          onRefresh();
        }
      }

      if (event.key === "s" || event.key === "S") {
        event.preventDefault();
        router.push("/search");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onRefresh, router]);

  return null;
}
