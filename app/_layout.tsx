import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { AuthProvider } from '../context/AuthContext';

// Import Font Orbitron dari Google Fonts
import { Orbitron_700Bold, Orbitron_900Black } from '@expo-google-fonts/orbitron';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...Ionicons.font,
    Orbitron_700Bold,
    Orbitron_900Black,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) return null;

  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen 
          name="login" 
          options={{ 
            presentation: 'modal', 
            headerShown: true, 
            title: 'Admin Access',
            headerStyle: { backgroundColor: '#0f172a' },
            headerTintColor: '#f59e0b',
            headerTitleStyle: { fontFamily: 'Orbitron_700Bold' }
          }} 
        />
      </Stack>
    </AuthProvider>
  );
}