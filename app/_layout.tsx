import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { UserProfileProvider } from '@/contexts/UserProfileContext';
import { GamificationProvider } from '@/contexts/GamificationContext';
import { FavoritesProvider } from '@/contexts/FavoritesContext';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <FavoritesProvider>
      <GamificationProvider>
        <UserProfileProvider>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
                <Stack.Screen name="explore" options={{ headerShown: false }} />
                <Stack.Screen name="favorites" options={{ headerShown: false }} />
              </Stack>
              <StatusBar style="auto" />
            </ThemeProvider>
        </UserProfileProvider>
      </GamificationProvider>
    </FavoritesProvider>
  );
}