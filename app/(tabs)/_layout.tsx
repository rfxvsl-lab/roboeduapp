import { Tabs, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, Text } from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function TabLayout() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  return (
    <Tabs screenOptions={{ 
      tabBarStyle: { backgroundColor: '#0f172a', borderTopColor: '#1e293b' },
      tabBarActiveTintColor: '#f59e0b',
      headerShown: true, // Nyalakan header untuk navbar atas
      headerStyle: { backgroundColor: '#0f172a' },
      headerTitleStyle: { color: 'white', fontWeight: 'bold' },
      headerRight: () => !isLoggedIn ? (
        <TouchableOpacity 
          onPress={() => router.push('/login')}
          style={{ marginRight: 15, backgroundColor: '#f59e0b', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 }}
        >
          <Text style={{ color: '#020617', fontWeight: 'bold', fontSize: 12 }}>LOGIN</Text>
        </TouchableOpacity>
      ) : null
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
        title: 'Profile', 
        tabBarIcon: ({color}) => <Ionicons name="person" size={24} color={color} /> 
      }} />
    </Tabs>
  );
}