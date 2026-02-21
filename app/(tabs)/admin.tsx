import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getCoursesCount, getHardwareCount, getUsersCount } from '../../lib/supabase';

export default function AdminPanel() {
  const router = useRouter();
  const [userCount, setUserCount] = useState<number | null>(null);
  const [courseCount, setCourseCount] = useState<number | null>(null);
  const [hardwareCount, setHardwareCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          setUserCount(await getUsersCount());
          setCourseCount(await getCoursesCount());
          setHardwareCount(await getHardwareCount());
        } catch (error: any) {
          Alert.alert("Error", "Gagal memuat data admin: " + error.message);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }, [])
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerCard}>
          <Ionicons name="settings" size={40} color="#f59e0b" />
          <Text style={styles.title}>Admin <Text style={{color:'#f59e0b'}}>Control Center</Text></Text>
          <Text style={styles.subtitle}>Kelola konten dan ekosistem RoboEdu Studio</Text>
        </View>

        <View style={styles.grid}>
          {loading ? (
            <ActivityIndicator size="large" color="#f59e0b" style={{ flex: 1 }} />
          ) : (
            <>
              <AdminCard icon="book" title="Kelola Modul" count={courseCount} color="#3b82f6" onPress={() => router.push('/admin/courses')} />
              <AdminCard icon="hardware-chip" title="Hardware" count={hardwareCount} color="#10b981" onPress={() => router.push('/admin/hardware')} />
              <AdminCard icon="people" title="Siswa Aktif" count={userCount} color="#8b5cf6" onPress={() => router.push('/admin/users')} />
              <AdminCard icon="chatbubble-ellipses" title="Tiket Bantuan" count="5" color="#ef4444" onPress={() => Alert.alert("Fitur", "Manajemen tiket bantuan belum diimplementasikan.")} />
            </>
          )}
        </View>

        <TouchableOpacity style={styles.mainAction} onPress={() => router.push('/admin/courses/new')}>
          <Ionicons name="add-circle" size={24} color="#020617" />
          <Text style={styles.mainActionText}>TAMBAH MODUL BARU</Text>
        </TouchableOpacity>

        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>Aktivitas Terbaru</Text>
          {/* TODO: Implement dynamic activity logs from Supabase */}
          {loading ? <ActivityIndicator color="#f59e0b" /> : (
          <Text style={styles.logText}>• User 'Budi' menyelesaikan kuis Arduino</Text>
          <Text style={styles.logText}>• Stok Servo MG996R diperbarui</Text>
          <Text style={styles.logText}>• Modul IoT Smart Home dipublikasikan</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const AdminCard = ({ icon, title, count, color, onPress }: { icon: any; title: string; count: number | string | null; color: string; onPress: () => void }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <View style={[styles.iconBox, { backgroundColor: color + '20' }]}>
      <Ionicons name={icon} size={24} color={color} />
    </View>
    <Text style={styles.cardCount}>{count !== null ? count : '-'}</Text>
    <Text style={styles.cardTitle}>{title}</Text>
  </TouchableOpacity>
);


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  content: { padding: 20 },
  headerCard: { backgroundColor: '#0f172a', padding: 30, borderRadius: 25, alignItems: 'center', marginBottom: 25, borderWidth: 1, borderColor: '#1e293b' },
  title: { color: 'white', fontSize: 22, fontWeight: '900', marginTop: 15, fontFamily: 'Orbitron_700Bold' },
  subtitle: { color: '#94a3b8', fontSize: 12, marginTop: 5, textAlign: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 15 },
  card: { backgroundColor: '#0f172a', width: '47%', padding: 20, borderRadius: 20, borderWidth: 1, borderColor: '#1e293b' },
  iconBox: { width: 45, height: 45, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  cardCount: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  cardTitle: { color: '#94a3b8', fontSize: 12, marginTop: 4 },
  mainAction: { backgroundColor: '#f59e0b', flexDirection: 'row', padding: 18, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginTop: 25 },
  mainActionText: { color: '#020617', fontWeight: 'bold', marginLeft: 10, letterSpacing: 1 },
  recentSection: { marginTop: 30, backgroundColor: '#0f172a', padding: 20, borderRadius: 20 },
  sectionTitle: { color: 'white', fontWeight: 'bold', marginBottom: 15 },
  logText: { color: '#64748b', fontSize: 12, marginBottom: 10, fontFamily: 'monospace' }
});