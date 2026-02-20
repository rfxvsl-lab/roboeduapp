import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: 'https://ui-avatars.com/api/?name=Admin&background=f59e0b&color=fff' }} style={styles.avatar} />
        <Text style={styles.name}>Admin RoboEdu</Text>
        <Text style={styles.role}>Robotic Instructor</Text>
      </View>

      <View style={styles.menu}>
        <MenuItem icon="person-outline" label="Edit Profil" />
        <MenuItem icon="bookmark-outline" label="Kursus Saya" />
        <MenuItem icon="settings-outline" label="Pengaturan" />
        <TouchableOpacity style={styles.logout} onPress={() => router.replace('/')}>
          <Ionicons name="log-out-outline" size={24} color="#ef4444" />
          <Text style={styles.logoutText}>Keluar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const MenuItem = ({ icon, label }: any) => (
  <TouchableOpacity style={styles.menuItem}>
    <Ionicons name={icon} size={24} color="#94a3b8" />
    <Text style={styles.menuLabel}>{label}</Text>
    <Ionicons name="chevron-forward" size={20} color="#334155" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  header: { alignItems: 'center', paddingTop: 80, paddingBottom: 40, backgroundColor: '#0f172a' },
  avatar: { width: 100, height: 100, borderRadius: 30, marginBottom: 15 },
  name: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  role: { color: '#f59e0b', fontSize: 14 },
  menu: { padding: 25 },
  menuItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0f172a', padding: 18, borderRadius: 20, marginBottom: 15 },
  menuLabel: { color: 'white', flex: 1, marginLeft: 15, fontWeight: '500' },
  logout: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 20, padding: 15 },
  logoutText: { color: '#ef4444', marginLeft: 10, fontWeight: 'bold' }
});