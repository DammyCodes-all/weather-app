import { View, StyleSheet, Pressable } from "react-native";
import { useEffect, useRef, useState } from "react";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetTextInput,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";

import { ScreenWrapper } from "@/components/ScreenWrapper";
import { Typography } from "@/components/Typography";
import { colors, spacing } from "@/theme";
import { SearchInput } from "@/features/weather/components/SearchInput";
import { SearchResults } from "@/features/weather/components/SearchResults";
import { RecentSearches } from "@/features/weather/components/RecentSearches";
import { fetchGeocodingResults