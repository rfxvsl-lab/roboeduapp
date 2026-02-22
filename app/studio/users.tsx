import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function UserManagement() {
  const { role } = useAuth();

  // 1. Dummy Data State
  const [pendingUsers, setPendingUsers] = useState([
    { id: 'P01', name: 'Ahmad Fauzi', email: 'ahmad@roboedu.com' },
    { id: 'P02', name: 'Siti Aminah', email: 'siti@roboedu.com' },
  ]);

  const [registeredUsers, setRegisteredUsers] = useState([
    { id: 'U01', name: 'Hilal Alhamdi', email: 'hilal@roboedu.com', role: 'Supervisor' },
    { id: 'U02', name: 'Budi Santoso', email: 'budi@roboedu.com', role: 'Creator' },
  ]);

  // 3. State Modal & Form
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [approvalForm, setApprovalForm] = useState({
    role: 'Creator',
    team: 'Tim 1'
  });

  // 5. Peringatan Akses
  if (role !== 'super_admin') {
    return (
      <View style={styles.deniedContainer}>
        <MaterialIcons name="lock" size={80} color="#ef4444" />
        <Text style={styles.deniedText}>Akses Ditolak.</Text>
        <Text style={styles.deniedSub}>Halaman ini khusus Super Admin.</Text>
      </View>
    );
  }

  const handleApproveClick = (user: any) => {
    setSelectedUser(user);
    setIsApprovalModalOpen(true);
  };

  const handleConfirmApproval = () => {
    const newUser = {
      ...selectedUser,
      role: approvalForm.role
    };
    setRegisteredUsers([...registeredUsers, newUser]);
    setPendingUsers(pendingUsers.filter(u => u.id !== selectedUser.id));
    setIsApprovalModalOpen(false);
    Alert.alert("Sukses", `${selectedUser.name} telah aktif sebagai ${approvalForm.role}`);
  };

  const handleReject = (id: string) => {
    Alert.alert("Tolak Pendaftaran", "Yakin ingin menolak user ini?", [
      { text: "Batal", style: "cancel" },
      { text: "Tolak", style: "destructive", onPress: () => setPendingUsers(pendingUsers.filter(u => u.id !== id)) }
    ]);
  };

  const handleDelete = (id: string) => {
    Alert.alert("Hapus User", "Yakin ingin menghapus akses user ini?", [
      { text: "Batal", style: "cancel" },
      { text: "Hapus", style: "destructive", onPress: () => setRegisteredUsers(registeredUsers.filter(u => u.id !== id)) }
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      <Text style={styles.headerTitle}>Manajemen Akses</Text>

      {/* Bagian 1: Menunggu Persetujuan */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialIcons name="hourglass-empty" size={20} color="#f59e0b" />
          <Text style={[styles.sectionTitle, { color: '#f59e0b' }]}>Menunggu Persetujuan</Text>
        </View>
        {pendingUsers.map(user => (
          <View key={user.id} style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
            </View>
            <View style={styles.actionRow}>
              <TouchableOpacity onPress={() => handleReject(user.id)} style={styles.iconBtnReject}>
                <MaterialIcons name="close" size={20} color="#ef4444" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleApproveClick(user)} style={styles.iconBtnApprove}>
                <MaterialIcons name="check" size={20} color="#10b981" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      {/* Bagian 2: User Terdaftar */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialIcons name="verified-user" size={20} color="#3b82f6" />
          <Text style={[styles.sectionTitle, { color: '#3b82f6' }]}>User Terdaftar</Text>
        </View>
        {registeredUsers.map(user => (
          <View key={user.id} style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.userName}>{user.name}</Text>
              <View style={styles.roleBadge}>
                <Text style={styles.roleText}>{user.role}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => handleDelete(user.id)}>
              <MaterialIcons name="delete-outline" size={22} color="#ef4444" />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Modal Persetujuan */}
      <Modal visible={isApprovalModalOpen} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Tentukan Role & Tim</Text>
            <Text style={styles.modalSub}>User: {selectedUser?.name}</Text>

            <Text style={styles.label}>Pilih Role</Text>
            <View style={styles.pickerRow}>
              {['Creator', 'Tim Khusus', 'Supervisor'].map(r => (
                <TouchableOpacity 
                  key={r} 
                  style={[styles.pickerItem, approvalForm.role === r && styles.pickerActive]}
                  onPress={() => setApprovalForm({ ...approvalForm, role: r })}
                >
                  <Text style={[styles.pickerText, approvalForm.role === r && styles.pickerTextActive]}>{r}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Tempatkan di Tim</Text>
            <View style={styles.pickerRow}>
              {['Tim 1', 'Tim 2', 'Tim 3', 'Tim 5'].map(t => (
                <TouchableOpacity 
                  key={t} 
                  style={[styles.pickerItem, approvalForm.team === t && styles.pickerActive]}
                  onPress={() => setApprovalForm({ ...approvalForm, team: t })}
                >
                  <Text style={[styles.pickerText, approvalForm.team === t && styles.pickerTextActive]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.btnCancel} onPress={() => setIsApprovalModalOpen(false)}>
                <Text style={{ color: '#94a3b8' }}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnConfirm} onPress={handleConfirmApproval}>
                <Text style={styles.btnConfirmText}>Aktifkan User</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  headerTitle: { color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 30, marginTop: 20 },
  section: { marginBottom: 35 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', marginLeft: 10, textTransform: 'uppercase' },
  card: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#0f172a', 
    padding: 15, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: '#1e293b' 
  },
  userName: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  userEmail: { color: '#64748b', fontSize: 12, marginTop: 2 },
  actionRow: { flexDirection: 'row', gap: 10 },
  iconBtnReject: { padding: 8, borderRadius: 10, backgroundColor: 'rgba(239, 68, 68, 0.1)' },
  iconBtnApprove: { padding: 8, borderRadius: 10, backgroundColor: 'rgba(16, 185, 129, 0.1)' },
  roleBadge: { 
    alignSelf: 'flex-start', backgroundColor: 'rgba(59, 130, 246, 0.1)', 
    paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, marginTop: 5 
  },
  roleText: { color: '#3b82f6', fontSize: 10, fontWeight: 'bold' },
  
  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#0f172a', padding: 25, borderRadius: 24, borderWidth: 1, borderColor: '#1e293b' },
  modalTitle: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  modalSub: { color: '#94a3b8', fontSize: 13, marginTop: 5, marginBottom: 25 },
  label: { color: '#64748b', fontSize: 11, fontWeight: 'bold', marginBottom: 10, textTransform: 'uppercase' },
  pickerRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  pickerItem: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, backgroundColor: '#1e293b', borderWidth: 1, borderColor: '#334155' },
  pickerActive: { backgroundColor: '#f59e0b', borderColor: '#f59e0b' },
  pickerText: { color: '#94a3b8', fontSize: 12, fontWeight: 'bold' },
  pickerTextActive: { color: '#020617' },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 15, marginTop: 10 },
  btnCancel: { padding: 12 },
  btnConfirm: { backgroundColor: '#f59e0b', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12 },
  btnConfirmText: { color: '#020617', fontWeight: 'bold' },

  // Denied Screen
  deniedContainer: { flex: 1, backgroundColor: '#020617', justifyContent: 'center', alignItems: 'center', padding: 40 },
  deniedText: { color: 'white', fontSize: 20, fontWeight: 'bold', marginTop: 20 },
  deniedSub: { color: '#64748b', fontSize: 14, marginTop: 5, textAlign: 'center' }
});