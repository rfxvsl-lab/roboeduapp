import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

// DUMMY DATA PROJECT (Mengambil konsep dari web)
const DUMMY_PROJECTS = [
  { id: '1', title: 'Video IoT Pemula', status: 'In Progress', progress: 60 },
  { id: '2', title: 'Modul AI Basic', status: 'Revision', progress: 40 },
  { id: '3', title: 'Arduino Sensor', status: 'Completed', progress: 100 },
];

export default function StudioDashboard() {
  const router = useRouter();

  // Komponen Kartu Project
  const renderProjectCard = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => router.push(`/studio/project/${item.id}`)}
    >
      <View style={styles.cardHeader}>
        <Text style={[
          styles.badge, 
          item.status === 'Completed' ? styles.badgeSuccess : 
          item.status === 'Revision' ? styles.badgeDanger : styles.badgeWarning
        ]}>{item.status}</Text>
        <Text style={styles.progressText}>{item.progress}%</Text>
      </View>
      
      <Text style={styles.projectTitle}>{item.title}</Text>
      
      {/* Progress Bar Custom */}
      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, { width: `${item.progress}%` }]} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* UI Statistik Mingguan Simpel */}
      <View style={styles.statsContainer}>
        <MaterialIcons name="bar-chart" size={24} color="#f59e0b" />
        <View style={styles.statsTextContainer}>
          <Text style={styles.statsTitle}>Performa Minggu Ini</Text>
          <Text style={styles.statsSub}>3 Project Selesai (Naik 12%)</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Project Aktif</Text>
      
      <FlatList
        data={DUMMY_PROJECTS}
        keyExtractor={(item) => item.id}
        renderItem={renderProjectCard}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  statsContainer: { 
    flexDirection: 'row', alignItems: 'center', 
    backgroundColor: '#0f172a', margin: 20, padding: 20, 
    borderRadius: 20, borderWidth: 1, borderColor: '#1e293b' 
  },
  statsTextContainer: { marginLeft: 15 },
  statsTitle: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  statsSub: { color: '#94a3b8', fontSize: 12, marginTop: 5 },
  sectionTitle: { color: 'white', fontSize: 18, fontWeight: 'bold', marginHorizontal: 20, marginBottom: 10 },
  listContainer: { paddingHorizontal: 20, paddingBottom: 20 },
  card: { 
    backgroundColor: '#0f172a', padding: 20, borderRadius: 20, 
    borderWidth: 1, borderColor: '#1e293b', marginBottom: 15 
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  badge: { 
    fontSize: 10, fontWeight: 'bold', paddingHorizontal: 10, 
    paddingVertical: 4, borderRadius: 8, overflow: 'hidden' 
  },
  badgeWarning: { backgroundColor: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b' },
  badgeDanger: { backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' },
  badgeSuccess: { backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#10b981' },
  progressText: { color: '#94a3b8', fontSize: 12, fontWeight: 'bold' },
  projectTitle: { color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  progressBarBg: { height: 6, backgroundColor: '#1e293b', borderRadius: 3, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#f59e0b', borderRadius: 3 }
});