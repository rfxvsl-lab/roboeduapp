import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ 
      tabBarStyle: { backgroundColor: '#0f172a', borderTopColor: '#1e293b', height: 65, paddingBottom: 10 },
      tabBarActiveTintColor: '#f59e0b',
      tabBarInactiveTintColor: '#64748b',
      headerShown: false 
    }}>
      <Tabs.Screen name="index" options={{ 
        title: 'Home',
        tabBarIcon: ({color}) => <Ionicons name="home" size={24} color={color} />
      }} />
      <Tabs.Screen name="explore" options={{ 
        title: 'Hardware',
        tabBarIcon: ({color}) => <Ionicons name="hardware-chip" size={24} color={color} />
      }} />
      <Tabs.Screen name="studio" options={{ 
        title: 'Studio',
        tabBarIcon: ({color}) => <Ionicons name="game-controller" size={24} color={color} />
      }} />
      <Tabs.Screen name="profile" options={{ 
        title: 'Profil',
        tabBarIcon: ({color}) => <Ionicons name="person" size={24} color={color} />
      }} />
    </Tabs>
  );
}