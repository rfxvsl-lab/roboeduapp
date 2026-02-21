import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';

export default function ProfileScreen() {
  const { isLoggedIn, logout } = useAuth();
  const router = useRouter();
  
  // State untuk Profil Dinamis
  const [name, setName] = useState('Admin RoboEdu');
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState('');

  if (!isLoggedIn) {
    return (
      <View style={styles.containerCenter}>
        <Ionicons name="lock-closed" size={60} color="#f59e0b" />
        <Text style={styles.titleLocked}>Akses Terkunci</Text>
        <TouchableOpacity style={styles.btnLogin} onPress={() => router.push('/login')}>
          <Text style={styles.btnText}>LOGIN</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleSaveName = () => {
    if(tempName.trim().length > 0) setName(tempName);
    setIsEditing(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: `https://ui-avatars.com/api/?name=${name.replace(' ', '+')}&background=f59e0b&color=fff` }} style={styles.avatar} />
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.role}>Robotic Instructor</Text>
      </View>

      <View style={styles.menu}>
        <TouchableOpacity style={styles.menuItem} onPress={() => { setTempName(name); setIsEditing(true); }}>
          <Ionicons name="pencil" size={24} color="#f59e0b" />
          <Text style={styles.menuLabel}>Edit Nama Profil</Text>
          <Ionicons name="chevron-forward" size={20} color="#334155" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.logout} onPress={logout}>
          <Ionicons name="log-out-outline" size={24} color="#ef4444" />
          <Text style={styles.logoutText}>Keluar Akun</Text>
        </TouchableOpacity>
      </View>

      {/* MODAL EDIT NAMA */}
      <Modal visible={isEditing} transparent animationType="slide">
        <View style={styles.modalBg}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Ubah Nama</Text>
            <TextInput 
              style={styles.modalInput}
              value={tempName}
              onChangeText={setTempName}
              placeholder="Masukkan nama baru..."
              placeholderTextColor="#94a3b8"
            />
            <View style={styles.modalBtns}>
              <TouchableOpacity onPress={() => setIsEditing(false)} style={styles.btnCancel}><Text style={{color:'white'}}>Batal</Text></TouchableOpacity>
              <TouchableOpacity onPress={handleSaveName} style={styles.btnSave}><Text style={{color:'#020617', fontWeight:'bold'}}>Simpan</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  containerCenter: { flex: 1, backgroundColor: '#020617', justifyContent: 'center', alignItems: 'center', padding: 30 },
  titleLocked: { color: 'white', fontSize: 20, fontWeight: 'bold', marginTop: 15 },
  btnLogin: { backgroundColor: '#f59e0b', padding: 15, borderRadius: 12, width: '100%', alignItems: 'center', marginTop: 25 },
  btnText: { fontWeight: 'bold' },
  header: { alignItems: 'center', paddingTop: 40, paddingBottom: 40, backgroundColor: '#0f172a' },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 15, borderWidth: 3, borderColor: '#f59e0b' },
  name: { color: 'white', fontSize: 22, fontWeight: 'bold' },
  role: { color: '#94a3b8', fontSize: 14, marginTop: 5 },
  menu: { padding: 25 },
  menuItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0f172a', padding: 18, borderRadius: 20, marginBottom: 15, borderWidth: 1, borderColor: '#1e293b' },
  menuLabel: { color: 'white', flex: 1, marginLeft: 15, fontWeight: '500' },
  logout: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 20, padding: 15 },
  logoutText: { color: '#ef4444', marginLeft: 10, fontWeight: 'bold' },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', padding: 20 },
  modalCard: { backgroundColor: '#0f172a', padding: 25, borderRadius: 25, borderWidth: 1, borderColor: '#1e293b' },
  modalTitle: { color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  modalInput: { backgroundColor: '#1e293b', color: 'white', padding: 15, borderRadius: 12, marginBottom: 20 },
  modalBtns: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10 },
  btnCancel: { padding: 12, paddingHorizontal: 20 },
  btnSave: { backgroundColor: '#f59e0b', padding: 12, paddingHorizontal: 25, borderRadius: 10 }
});