import { Stack } from 'expo-router';

export default function StudioLayout() {
  return (
    <Stack screenOptions={{
      headerStyle: { backgroundColor: '#020617' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold' },
    }}>
      <Stack.Screen name="index" options={{ title: 'RoboEdu Studio' }} />
      <Stack.Screen name="project/[id]" options={{ title: 'Detail Project' }} />
    </Stack>
  );
}