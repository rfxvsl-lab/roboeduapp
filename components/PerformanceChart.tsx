import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface PerformanceChartProps {
  data: number[];
  title?: string;
}

export default function PerformanceChart({ data, title }: PerformanceChartProps) {
  const days = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
  const total = data.reduce((acc, val) => acc + val, 0);
  const maxValue = Math.max(...data, 5); // Default max 5 jika data kosong

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{title || "Performa Mingguan"}</Text>
          <Text style={styles.totalText}>{total} Konten Diproduksi</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Live Stats</Text>
        </View>
      </View>

      <View style={styles.chartContainer}>
        {data.map((val, index) => {
          const heightPercent = (val / maxValue) * 100;
          return (
            <View key={index} style={styles.barWrapper}>
              <View style={styles.track}>
                <View 
                  style={[
                    styles.fill, 
                    { height: `${heightPercent}%` }
                  ]} 
                />
              </View>
              <Text style={styles.label}>{days[index]}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#0f172a',
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#1e293b',
    marginHorizontal: 20,
    marginVertical: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 25,
  },
  title: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  totalText: { color: '#64748b', fontSize: 12, marginTop: 4 },
  badge: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: { color: '#6366f1', fontSize: 10, fontWeight: 'bold' },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
  },
  barWrapper: {
    alignItems: 'center',
    flex: 1,
  },
  track: {
    width: 10,
    height: 100,
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    borderRadius: 5,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  fill: {
    backgroundColor: '#f59e0b',
    borderRadius: 5,
  },
  label: {
    color: '#475569',
    fontSize: 10,
    marginTop: 10,
    fontWeight: 'bold',
  },
});