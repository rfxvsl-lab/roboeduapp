import { Ionicons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

export default function TabLayout() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        // Cek apakah email adalah email admin
        setIsAdmin(user?.email === 'hilal.alhamdi22@gmail.com');
      } catch (e) {
        setIsAdmin(false);
      }
    };

    if (isLoggedIn) checkAdminStatus();
    else setIsAdmin(false);
  }, [isLoggedIn]);

  return (
    <Tabs screenOptions={{ 
      headerShown: false,
      tabBarStyle: { backgroundColor: '#0f172a', borderTopColor: '#1e293b', height: 60, paddingBottom: 10 },
      tabBarActiveTintColor: '#f59e0b',
      tabBarInactiveTintColor: '#64748b'
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
      <Tabs.Screen 
        name="admin" 
        options={{ 
          title: 'Admin', 
          href: isAdmin ? '/admin' : null,
          tabBarIcon: ({color}) => <Ionicons name="shield-checkmark" size={24} color={color} /> 
        }} 
      />
      <Tabs.Screen name="profile" options={{ 
        title: 'Profile', 
        tabBarIcon: ({color}) => <Ionicons name="person" size={24} color={color} /> 
      }} />
    </Tabs>
  );
}