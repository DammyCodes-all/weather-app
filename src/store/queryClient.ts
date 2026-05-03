import AsyncStorage from "@react-native-async-storage/async-storage";
import { QueryClient } from "@tanstack/react-query";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { persistQueryClient } from "@tanstack/react-query-persist-client";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000,
      gcTime: 60 * 60 * 1000,
      retry: 2,
    },
  },
});

const canUseWindow = typeof window !== "undefined";

if (canUseWindow) {
  const asyncStoragePersister = createAsyncStoragePersister({
    storage: AsyncStorage,
    key: "@weather/query-cache",
  });

  persistQueryClient({
    queryClient,
    persister: asyncStoragePersister,
    maxAge: 24 * 60 * 60 * 1000,
  });
}
