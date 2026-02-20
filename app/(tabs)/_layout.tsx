import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ 
      tabBarStyle: { backgroundColor: '#0f172a', borderTopColor: '#1e293b', height: 60 },
      tabBarActiveTintColor: '#f59e0b',
      tabBarInactiveTintColor: '#94a3b8',
      headerShown: false 
    }}>
      <Tabs.Screen name="index" options={{ 
        title: 'Home',
        tabBarIcon: ({color}) => <Ionicons name="grid-outline" size={24} color={color} />
      }} />
      <Tabs.Screen name="explore" options={{ 
        title: 'Hardware',
        tabBarIcon: ({color}) => <Ionicons name="hardware-chip-outline" size={24} color={color} />
      }} />
      <Tabs.Screen name="studio" options={{ 
        title: 'Studio',
        tabBarIcon: ({color}) => <Ionicons name="game-controller-outline" size={24} color={color} />
      }} />
    </Tabs>
  );
}