import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface WeeklyBotReportProps {
  projects: any[];
}

export default function WeeklyBotReport({ projects }: WeeklyBotReportProps) {
  const stats = useMemo(() => {
    const completed = projects.filter(p => p.status === 'Completed');
    let late = 0;
    let onTime = 0;

    completed.forEach(p => {
      if (p.isBigProject && p.deadline) {
        const deadlineDate = new Date(p.deadline);
        const now = new Date();
        if (now > deadlineDate) late++;
        else onTime++;
      } else {
        onTime++;
      }
    });

    return {
      completedCount: completed.length,
      lateCount: late,
      onTimeCount: onTime
    };
  }, [projects]);

  const getMessage = () => {
    if (stats.completedCount === 0) {
      return "Sistem mendeteksi nol aktivitas penyelesaian project minggu ini. Ayo pacu semangat tim!";
    }
    if (stats.lateCount > 0) {
      return `Laporan diterima. ${stats.completedCount} project selesai, namun ${stats.lateCount} diantaranya terlambat. Perlu optimasi manajemen waktu.`;
    }
    return `Analisis selesai. Semua ${stats.completedCount} project diselesaikan tepat waktu. Performa tim sangat optimal!`;
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.botHeader}>
          <MaterialIcons name="smart-toy" size={20} color="#f59e0b" />
          <Text style={styles.botLabel}>Bot Report</Text>
        </View>
        <Text style={styles.title}>Laporan Performa Tim</Text>
      </View>

      <Text style={styles.message}>{getMessage()}</Text>

      <View style={styles.footer}>
        <View style={styles.statItem}>
          <MaterialIcons name="check-circle" size={16} color="#10b981" />
          <Text style={[styles.statText, { color: '#10b981' }]}>{stats.onTimeCount} Tepat Waktu</Text>
        </View>
        <View style={styles.statItem}>
          <MaterialIcons name="warning" size={16} color="#ef4444" />
          <Text style={[styles.statText, { color: '#ef4444' }]}>{stats.lateCount} Terlambat</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1e1b4b',
    padding: 20,
    borderRadius: 24,
    marginHorizontal: 20,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#312e81',
  },
  header: { marginBottom: 12 },
  botHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  botLabel: { color: '#f59e0b', fontSize: 10, fontWeight: 'bold', marginLeft: 8, textTransform: 'uppercase', letterSpacing: 1 },
  title: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  message: { color: 'rgba(255, 255, 255, 0.8)', fontSize: 13, lineHeight: 20, marginBottom: 20 },
  footer: { flexDirection: 'row', gap: 20, borderTopWidth: 1, borderTopColor: 'rgba(255, 255, 255, 0.1)', paddingTop: 15 },
  statItem: { flexDirection: 'row', alignItems: 'center' },
  statText: { fontSize: 12, fontWeight: 'bold', marginLeft: 6 },
});