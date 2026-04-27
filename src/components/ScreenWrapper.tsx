import { ReactNode } from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ScreenWrapperProps {
  children: ReactNode;
  scrollable?: boolean;
}

export function ScreenWrapper({ children, scrollable = false }: ScreenWrapperProps) {
  return (
    <SafeAreaView className="flex-1 bg-void">
      {scrollable ? (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
          {children}
        </ScrollView>
      ) : (
        children
      )}
    </SafeAreaView>
  );
}
