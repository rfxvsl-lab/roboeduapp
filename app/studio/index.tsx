import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, FlatList, Modal, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';

// DUMMY DATA PROJECT (Mengambil konsep dari web)
const DUMMY_PROJECTS = [
  { id: '1', title: 'Video IoT Pemula', status: 'In Progress', progress: 60 },
  { id: '2', title: 'Modul AI Basic', status: 'Revision', progress: 40 },
  { id: '3', title: 'Arduino Sensor', status: 'Completed', progress: 100 },
];

export default function StudioDashboard() {
  const router = useRouter();
  const userRole = 'supervisor'; // Dummy role untuk testing UI

  // State untuk daftar project (dipindahkan ke state agar dinamis)
  const [projects, setProjects] = useState(DUMMY_PROJECTS);

  // State untuk Modal dan Form
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProjectForm, setNewProjectForm] = useState({
    title: '',
    isBigProject: false,
    deadline: ''
  });

  const handleCreateProject = () => {
    if (!newProjectForm.title) {
      Alert.alert("Error", "Judul project wajib diisi.");
      return;
    }

    const newProject = {
      id: (projects.length + 1).toString(),
      title: newProjectForm.title,
      status: 'In Progress',
      progress: 0
    };

    setProjects([newProject, ...projects]);
    setIsAddModalOpen(false);
    setNewProjectForm({ title: '', isBigProject: false, deadline: '' });
    Alert.alert("Sukses", "Project baru berhasil dibuat!");
  };

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

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Project Aktif</Text>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <TouchableOpacity 
            style={[styles.addProjectBtn, { backgroundColor: '#1e293b' }]} 
            onPress={() => router.push('/studio/assets')}
          >
            <MaterialIcons name="folder" size={18} color="#f59e0b" />
            <Text style={[styles.addProjectText, { color: '#f59e0b' }]}>Aset</Text>
          </TouchableOpacity>
          
          {userRole === 'supervisor' && (
            <TouchableOpacity 
              style={styles.addProjectBtn} 
              onPress={() => setIsAddModalOpen(true)}
            >
              <MaterialIcons name="add" size={20} color="#020617" />
              <Text style={styles.addProjectText}>Project Baru</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      <FlatList
        data={projects}
        keyExtractor={(item) => item.id}
        renderItem={renderProjectCard}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Modal Tambah Project */}
      <Modal
        visible={isAddModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsAddModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Buat Project Baru</Text>
            
            <Text style={styles.inputLabel}>Judul Project</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Masukkan judul..."
              placeholderTextColor="#64748b"
              value={newProjectForm.title}
              onChangeText={(text) => setNewProjectForm({ ...newProjectForm, title: text })}
            />

            <View style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>Project Besar / Tim Khusus?</Text>
              <Switch
                value={newProjectForm.isBigProject}
                onValueChange={(val) => setNewProjectForm({ ...newProjectForm, isBigProject: val })}
                trackColor={{ false: '#1e293b', true: '#f59e0b' }}
              />
            </View>

            {newProjectForm.isBigProject && (
              <>
                <Text style={styles.inputLabel}>Deadline (YYYY-MM-DD)</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="2024-12-31"
                  placeholderTextColor="#64748b"
                  value={newProjectForm.deadline}
                  onChangeText={(text) => setNewProjectForm({ ...newProjectForm, deadline: text })}
                />
              </>
            )}

            <View style={styles.modalBtnRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setIsAddModalOpen(false)}>
                <Text style={styles.cancelBtnText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.createBtn} onPress={handleCreateProject}>
                <Text style={styles.createBtnText}>Buat Project</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  sectionHeader: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', 
    marginHorizontal: 20, marginBottom: 15 
  },
  sectionTitle: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  addProjectBtn: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#f59e0b', 
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 
  },
  addProjectText: { color: '#020617', fontSize: 12, fontWeight: 'bold', marginLeft: 4 },
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
  progressBarFill: { height: '100%', backgroundColor: '#f59e0b', borderRadius: 3 },

  // Modal Styles
  modalOverlay: { 
    flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', 
    justifyContent: 'center', padding: 20 
  },
  modalContent: { 
    backgroundColor: '#0f172a', padding: 25, borderRadius: 25, 
    borderWidth: 1, borderColor: '#1e293b' 
  },
  modalTitle: { color: 'white', fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  inputLabel: { color: '#94a3b8', fontSize: 12, fontWeight: 'bold', marginBottom: 8, textTransform: 'uppercase' },
  textInput: { 
    backgroundColor: '#1e293b', color: 'white', padding: 15, borderRadius: 12, 
    borderWidth: 1, borderColor: '#334155', marginBottom: 20 
  },
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  toggleLabel: { color: '#cbd5e1', fontSize: 14 },
  modalBtnRow: { flexDirection: 'row', gap: 12, marginTop: 10 },
  cancelBtn: { flex: 1, padding: 15, borderRadius: 12, alignItems: 'center' },
  cancelBtnText: { color: '#94a3b8', fontWeight: 'bold' },
  createBtn: { 
    flex: 1, backgroundColor: '#f59e0b', padding: 15, 
    borderRadius: 12, alignItems: 'center' 
  },
  createBtnText: { color: '#020617', fontWeight: 'bold' },
});