import { Stack } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Sekarang Landing Page adalah (tabs) secara default */}
        <Stack.Screen name="(tabs)" />
        {/* Login dibikin sebagai Modal atau Screen terpisah */}
        <Stack.Screen name="login" options={{ presentation: 'modal', headerShown: true, title: 'Login Admin' }} />
      </Stack>
    </AuthProvider>
  );
}