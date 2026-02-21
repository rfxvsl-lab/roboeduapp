import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { AuthProvider } from '../context/AuthContext';

// Tahan Splash Screen agar font sempat dimuat
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...Ionicons.font, // Memuat font Ionicons
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
        {/* Landing Page utama */}
        <Stack.Screen name="(tabs)" />
        {/* Halaman Login sebagai Modal */}
        <Stack.Screen 
          name="login" 
          options={{ 
            presentation: 'modal', 
            headerShown: true, 
            title: 'Login Admin',
            headerStyle: { backgroundColor: '#0f172a' },
            headerTintColor: '#fff'
          }} 
        />
      </Stack>
    </AuthProvider>
  );
}