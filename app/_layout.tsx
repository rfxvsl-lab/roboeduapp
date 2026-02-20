import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Ini akan mastiin index.tsx (Login) yang muncul pertama */}
      <Stack.Screen name="index" /> 
      {/* Ini folder menu utama kamu */}
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}