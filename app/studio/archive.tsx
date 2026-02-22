import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Alert, FlatList, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { DUMMY_PROJECTS, TEAMS } from '../../constants/StudioData';
import { useAuth } from '../../context/AuthContext';

export default function ProjectArchive() {
  const { role } = useAuth();

  // Filter project yang sudah selesai (Completed)
  const archivedProjects = DUMMY_PROJECTS.filter(project => project.status === 'Completed');

  const getTeamName = (teamId: string) => {
    const team = TEAMS.find(t => t.id === teamId);
    return team ? team.name : 'Unknown Team';
  };

  const renderArchiveCard = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>COMPLETED</Text>
        </View>
        <Text style={styles.projectId}>ID: {item.id}</Text>
      </View>

      <Text style={styles.projectTitle}>{item.title}</Text>
      <View style={styles.teamInfo}>
        <MaterialIcons name="groups" size={16} color="#94a3b8" />
        <Text style={styles.teamName}>{getTeamName(item.teamId)}</Text>
      </View>

      <TouchableOpacity 
        style={styles.finalLinkBtn}
        onPress={() => item.finalLink ? Linking.openURL(item.finalLink) : Alert.alert("Error", "Link hasil final tidak tersedia")}
      >
        <MaterialIcons name="link" size={20} color="white" />
        <Text style={styles.finalLinkText}>Buka Hasil Final</Text>
      </TouchableOpacity>

      {(role === 'supervisor' || role === 'super_admin') && (
        <TouchableOpacity 
          style={styles.deleteBtn}
          onPress={() => Alert.alert("Hapus Permanen", "Yakin ingin menghapus arsip ini secara permanen?", [
            { text: "Batal", style: "cancel" },
            { text: "Hapus", style: "destructive", onPress: () => console.log("Deleted", item.id) }
          ])}
        >
          <MaterialIcons name="delete-outline" size={18} color="#ef4444" />
          <Text style={styles.deleteBtnText}>Hapus Permanen</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons name="folder-zip" size={80} color="#1e293b" />
      <Text style={styles.emptyTitle}>Belum ada project yang selesai</Text>
      <Text style={styles.emptySub}>Project yang sudah mencapai progress 100% akan muncul di sini secara otomatis.</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Arsip Project</Text>
        <Text style={styles.headerSub}>History project yang telah diselesaikan</Text>
      </View>

      <FlatList
        data={archivedProjects}
        keyExtractor={(item) => item.id}
        renderItem={renderArchiveCard}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  header: { padding: 20, paddingTop: 40 },
  headerTitle: { color: 'white', fontSize: 24, fontWeight: 'bold' },
  headerSub: { color: '#94a3b8', fontSize: 14, marginTop: 5 },
  listContent: { padding: 20, paddingBottom: 40 },
  card: { 
    backgroundColor: '#0f172a', padding: 20, borderRadius: 20, 
    borderWidth: 1, borderColor: '#1e293b', marginBottom: 20 
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  badge: { backgroundColor: 'rgba(16, 185, 129, 0.1)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(16, 185, 129, 0.3)' },
  badgeText: { color: '#10b981', fontSize: 10, fontWeight: 'bold' },
  projectId: { color: '#475569', fontSize: 10, fontWeight: 'bold' },
  projectTitle: { color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  teamInfo: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  teamName: { color: '#94a3b8', fontSize: 13, marginLeft: 8 },
  finalLinkBtn: { flexDirection: 'row', backgroundColor: '#1e293b', padding: 15, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  finalLinkText: { color: 'white', fontWeight: 'bold', marginLeft: 10 },
  deleteBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 15, paddingVertical: 5 },
  deleteBtnText: { color: '#ef4444', fontSize: 12, fontWeight: 'bold', marginLeft: 8 },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 100 },
  emptyTitle: { color: 'white', fontSize: 16, fontWeight: 'bold', marginTop: 20 },
  emptySub: { color: '#475569', fontSize: 13, marginTop: 8, textAlign: 'center', paddingHorizontal: 40 }
});