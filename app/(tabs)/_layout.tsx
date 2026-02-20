import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ 
      tabBarStyle: { backgroundColor: '#0f172a', borderTopColor: '#1e293b' },
      tabBarActiveTintColor: '#f59e0b',
      headerShown: false 
    }}>
      <Tabs.Screen name="index" options={{ 
        title: 'Home',
        tabBarIcon: ({color}) => <Ionicons name="home" size={24} color={color} />
      }} />
      <Tabs.Screen name="explore" options={{ 
        title: 'Kursus',
        tabBarIcon: ({color}) => <Ionicons name="book" size={24} color={color} />
      }} />
    </Tabs>
  );
}