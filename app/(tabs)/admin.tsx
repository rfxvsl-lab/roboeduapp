import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, Viewas

export default function AdminPanel() {
  const router = useRouter();
  const [userCount, setUserCount] = useState<number | null>(null);
  const [courseCount, setCourseCount] = useState<number | null>(null);
  const [hardwareCount, setHardwareCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // State Manajemen Penempatan Tim
  const [usersList, setUsersList] = useState([
    { id: '1', name: 'Andi Creator', email: 'andi@example.com', role: 'user', teamId: null },
    { id: '2', name: 'Budi Supervisor', email: 'budi@example.com', role: 'supervisor', teamId: 'all' },
    { id: '3', name: 'Cici Editor', email: 'cici@example.com', role: 'creator', teamId: 'T1' },
    { id: '4', name: 'Dedi Newbie', email: 'dedi@example.com', role: 'user', teamId: null },
  ]);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedRole, setSelectedRole] = useState('creator');
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);

  const handleOpenAssignModal = (user: any) => {
    setSelectedUser(user);
    setSelectedRole(user.role === 'user' ? 'creator' : user.role);
    setSelectedTeam(user.teamId);
    setIsAssignModalOpen(true);
  };

  const handleSaveAssignment = () => {
    if (selectedRole === 'creator' && !selectedTeam) {
      Alert.alert("Error", "Creator wajib memilih tim creative (1-4).");
      return;
    }

    let finalTeamId = selectedTeam;
    if (selectedRole === 'tim_khusus') finalTeamId = 'T5';
    if (selectedRole === 'supervisor') finalTeamId = 'all';

    setUsersList(prev => prev.map(u => 
      u.id === selectedUser.id 
        ? { ...u, role: selectedRole, teamId: finalTeamId } 
        : u
    ));

    setIsAssignModalOpen(false);
    Alert.alert("Sukses", `Penempatan ${selectedUser.name} berhasil diperbarui.`);
  };

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
              <AdminCard icon="book" title="Kelola Modul" count={courseCount} color="#3b82f6" onPress={() => router.push('/courses')} />
              <AdminCard icon="hardware-chip" title="Hardware" count={hardwareCount} color="#10b981" onPress={() => router.push('/hardware')} />
              <AdminCard icon="people" title="Siswa Aktif" count={userCount} color="#8b5cf6" onPress={() => router.push('/users')} />
              <AdminCard icon="chatbubble-ellipses" title="Tiket Bantuan" count="5" color="#ef4444" onPress={() => Alert.alert("Fitur", "Manajemen tiket bantuan belum diimplementasikan.")} />
            </>
          )}
        </View>

        <TouchableOpacity style={styles.mainAction} onPress={() => Alert.alert("Fitur", "Halaman tambah modul belum dibuat.")}>
          <Ionicons name="add-circle" size={24} color="#020617" />
          <Text style={styles.mainActionText}>TAMBAH MODUL BARU</Text>
        </TouchableOpacity>

        {/* Manajemen Penempatan Tim */}
        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>Manajemen Penempatan Tim</Text>
          
          <Text style={styles.subHeader}>Menunggu Penempatan</Text>
          {usersList.filter(u => u.role === 'user').map(user => (
            <View key={user.id} style={styles.userItem}>
              <View style={{ flex: 1 }}>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
              </View>
              <TouchableOpacity style={styles.assignBtn} onPress={() => handleOpenAssignModal(user)}>
                <Text style={styles.assignBtnText}>Atur Tim</Text>
              </TouchableOpacity>
            </View>
          ))}

          <Text style={[styles.subHeader, { marginTop: 20 }]}>User Studio Terdaftar</Text>
          {usersList.filter(u => u.role !== 'user').map(user => (
            <View key={user.id} style={styles.userItem}>
              <View style={{ flex: 1 }}>
                <Text style={styles.userName}>{user.name}</Text>
                <View style={{ flexDirection: 'row', gap: 5, marginTop: 4 }}>
                  <View style={styles.roleBadge}><Text style={styles.badgeText}>{user.role.toUpperCase()}</Text></View>
                  <View style={[styles.roleBadge, { backgroundColor: '#1e293b' }]}><Text style={styles.badgeText}>TIM: {user.teamId}</Text></View>
                </View>
              </View>
              <TouchableOpacity onPress={() => handleOpenAssignModal(user)}>
                <Ionicons name="create-outline" size={20} color="#3b82f6" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>Aktivitas Terbaru</Text>
          {/* TODO: Implement dynamic activity logs from Supabase */}
          {loading ? (
            <ActivityIndicator color="#f59e0b" />
          ) : (
            <>
              <Text style={styles.logText}>• User 'Budi' menyelesaikan kuis Arduino</Text>
              <Text style={styles.logText}>• Stok Servo MG996R diperbarui</Text>
              <Text style={styles.logText}>• Modul IoT Smart Home dipublikasikan</Text>
            </>
          )}
        </View>
      </ScrollView>

      {/* Modal Penempatan Studio */}
      <Modal visible={isAssignModalOpen} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Atur Penempatan Studio</Text>
            <Text style={styles.modalUser}>User: {selectedUser?.name}</Text>

            <Text style={styles.inputLabel}>Pilih Role</Text>
            <View style={styles.roleRow}>
              {['creator', 'tim_khusus', 'supervisor'].map(r => (
                <TouchableOpacity 
                  key={r} 
                  style={[styles.roleOption, selectedRole === r && styles.roleOptionActive]}
                  onPress={() => setSelectedRole(r)}
                >
                  <Text style={[styles.roleOptionText, selectedRole === r && { color: '#020617' }]}>{r.replace('_', ' ').toUpperCase()}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {selectedRole === 'creator' && (
              <View>
                <Text style={styles.inputLabel}>Pilih Tim Creative</Text>
                <View style={styles.roleRow}>
                  {['T1', 'T2', 'T3', 'T4'].map(t => (
                    <TouchableOpacity 
                      key={t} 
                      style={[styles.teamOption, selectedTeam === t && styles.teamOptionActive]}
                      onPress={() => setSelectedTeam(t)}
                    >
                      <Text style={[styles.roleOptionText, selectedTeam === t && { color: '#020617' }]}>{t}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {selectedRole === 'tim_khusus' && (
              <Text style={styles.infoTextAmber}>User ini akan otomatis ditempatkan di Tim 5 (Big Project).</Text>
            )}

            {selectedRole === 'supervisor' && (
              <Text style={styles.infoTextPurple}>User ini akan menjadi Admin Studio (Bisa melihat semua tim).</Text>
            )}

            <View style={styles.modalBtnRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setIsAssignModalOpen(false)}>
                <Text style={{ color: '#94a3b8' }}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSaveAssignment}>
                <Text style={styles.saveBtnText}>Simpan Penempatan</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  logText: { color: '#64748b', fontSize: 12, marginBottom: 10, fontFamil1case', marginBottom: 10 },
  userItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#1e293b' },
  userName: { color: 'white', fontSize: 14, fontWeight: 'bold' },
  userEmail: { color: '#64748b', fontSize: 12 },
  assignBtn: { backgroundColor: '#f59e0b20', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: '#f59e0b40' },
  assignBtnText: { color: '#f59e0b', fontSize: 12, fontWeight: 'bold' },
  roleBadge: { backgroundColor: '#3b82f620', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  badgeText: { color: '#3b82f6', fontSize: 9, fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#0f172a', padding: 25, borderRadius: 25, borderWidth: 1, borderColor: '#1e293b' },
  modalTitle: { color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  modalUser: { color: '#94a3b8', fontSize: 13, marginBottom: 20 },
  inputLabel: { color: '#64748b', fontSize: 11, fontWeight: 'bold', marginBottom: 10, textTransform: 'uppercase' },
  roleRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  roleOption: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, backgroundColor: '#1e293b', borderWidth: 1, borderColor: '#334155' },
  roleOptionActive: { backgroundColor: '#f59e0b', borderColor: '#f59e0b' },
  teamOption: { width: '22%', alignItems: 'center', paddingVertical: 10, borderRadius: 10, backgroundColor: '#1e293b', borderWidth: 1, borderColor: '#334155' },
  teamOptionActive: { backgroundColor: '#3b82f6', borderColor: '#3b82f6' },
  roleOptionText: { color: '#94a3b8', fontSize: 11, fontWeight: 'bold' },
  infoTextAmber: { color: '#f59e0b', fontSize: 12, marginBottom: 20, fontStyle: 'italic' },
  infoTextPurple: { color: '#a78bfa', fontSize: 12, marginBottom: 20, fontStyle: 'italic' },
  modalBtnRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 15, marginTop: 10 },
  cancelBtn: { padding: 12 },
  saveBtn: { backgroundColor: '#f59e0b', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12 },
  saveBtnText: { color: '#020617', fontWeight: 'bold' },
});