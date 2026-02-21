import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { TEAMS, DUMMY_PROJECTS } from '../../constants/StudioData';
import WeeklyBotReport from '../../components/WeeklyBotReport';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

export default function TeamsListScreen() {
  const router = useRouter();

  const generateMonthlyReport = async (teamId: string, teamName: string) => {
    const completedProjects = DUMMY_PROJECTS.filter(
      p => p.status === 'Completed' && (p.teamId === teamId || p.teamId === `team-${teamId.replace('T', '')}`)
    );

    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: 'Helvetica', sans-serif; padding: 40px; color: #333; }
            h1 { color: #1e1b4b; border-bottom: 3px solid #f59e0b; padding-bottom: 10px; }
            .project-card { border: 1px solid #eee; padding: 15px; margin-bottom: 10px; border-radius: 8px; }
            .label { font-weight: bold; color: #64748b; font-size: 12px; }
            .status { color: #10b981; font-weight: bold; }
          </style>
        </head>
        <body>
          <h1>Laporan Kinerja - ${teamName}</h1>
          <p>Ringkasan performa produksi bulanan.</p>
          <hr/>
          ${completedProjects.map(p => `
            <div class="project-card">
              <div class="label">JUDUL PROJECT</div>
              <div style="font-size: 18px; font-weight: bold; margin-bottom: 10px;">${p.title}</div>
              <div class="label">STATUS: <span class="status">COMPLETED</span></div>
            </div>
          `).join('')}
          ${completedProjects.length === 0 ? '<p>Tidak ada project yang diselesaikan periode ini.</p>' : ''}
        </body>
      </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
    } catch (error) {
      Alert.alert("Error", "Gagal menggenerate laporan PDF.");
    }
  };

  const renderTeamCard = ({ item }: { item: any }) => {
    const isSpecial = item.isSpecial;
    const accentColor = isSpecial ? '#f59e0b' : '#3b82f6';

    return (
      <TouchableOpacity 
        style={[
          styles.card, 
          isSpecial && { borderColor: accentColor, borderWidth: 1.5 }
        ]}
        onPress={() => router.push({ pathname: '/studio', params: { teamId: item.id } })}
      >
        <View style={styles.cardContent}>
          <View style={[styles.iconContainer, { backgroundColor: `${accentColor}20` }]}>
            <MaterialIcons 
              name={isSpecial ? "stars" : "groups"} 
              size={32} 
              color={accentColor} 
            />
          </View>
          
          <View style={styles.textContainer}>
            <Text style={styles.teamName}>{item.name}</Text>
            <Text style={styles.projectCount}>3 Project Aktif</Text>
          </View>

          <View style={styles.cardActions}>
            <TouchableOpacity 
              style={styles.downloadBtn}
              onPress={() => generateMonthlyReport(item.id, item.name)}
            >
              <MaterialIcons name="file-download" size={22} color="#f59e0b" />
            </TouchableOpacity>
            <MaterialIcons name="chevron-right" size={24} color="#475569" />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Pilih Tim Produksi</Text>
        <Text style={styles.subtitle}>Masuk ke dashboard spesifik tim untuk mengelola workflow.</Text>
      </View>

      <FlatList
        data={TEAMS}
        keyExtractor={(item) => item.id}
        renderItem={renderTeamCard}
        ListHeaderComponent={<WeeklyBotReport projects={DUMMY_PROJECTS} />}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 14,
    marginTop: 5,
  },
  listContainer: {
    padding: 20,
    paddingTop: 10,
  },
  card: {
    backgroundColor: '#0f172a',
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    marginLeft: 15,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  downloadBtn: {
    backgroundColor: '#1e293b',
    padding: 8,
    borderRadius: 10,
  },
  teamName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  projectCount: {
    color: '#64748b',
    fontSize: 13,
    marginTop: 4,
  },
});