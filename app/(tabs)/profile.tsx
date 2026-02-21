import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, TextInput, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { COURSES } from '../../constants/CoursesData';

export default function ProfileScreen() {
  const { isLoggedIn, logout, enrolledCourses, completedCourses } = useAuth();
  const router = useRouter();
  
  const [name, setName] = useState('Admin RoboEdu');
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState('');

  if (!isLoggedIn) {
    return (
      <View style={styles.containerCenter}>
        <Ionicons name="lock-closed" size={60} color="#f59e0b" />
        <Text style={styles.titleLocked}>Akses Terkunci</Text>
        <Text style={styles.descLocked}>Silakan login untuk melihat kelas robotika kamu.</Text>
        <TouchableOpacity style={styles.btnLogin} onPress={() => router.push('/login')}>
          <Text style={styles.btnText}>LOGIN SEKARANG</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleSaveName = () => {
    if(tempName.trim().length > 0) setName(tempName);
    setIsEditing(false);
  };

  const myCourses = COURSES.filter(course => enrolledCourses.includes(course.id));

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Image source={{ uri: `https://ui-avatars.com/api/?name=${name.replace(' ', '+')}&background=f59e0b&color=fff` }} style={styles.avatar} />
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.role}>Robotic Enthusiast</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kursus Aktif Saya</Text>
          
          {myCourses.length === 0 ? (
            <View style={styles.emptyBox}>
              <Ionicons name="folder-open-outline" size={40} color="#334155" />
              <Text style={styles.emptyText}>Belum ada kursus yang diambil.</Text>
            </View>
          ) : (
            myCourses.map((course) => {
              // Cek apakah kursus ini sudah diselesaikan (kuis beres)
              const isCompleted = completedCourses.includes(course.id);

              return (
                <TouchableOpacity 
                  key={course.id} 
                  style={styles.courseCard}
                  onPress={() => router.push({ pathname: '/details/[id]', params: { id: course.id } })}
                >
                  <Image source={{ uri: course.image }} style={styles.courseImg} />
                  <View style={styles.courseInfo}>
                    <Text style={styles.courseCat}>{course.category}</Text>
                    <Text style={styles.courseTitle}>{course.title}</Text>
                    
                    {/* Status Progress Dinamis */}
                    <Text style={[styles.courseProgress, isCompleted && {color: '#f59e0b'}]}>
                      {isCompleted ? '⭐ LULUS 100%' : '▶ Sedang Belajar'}
                    </Text>
                  </View>
                  <Ionicons name={isCompleted ? "checkmark-circle" : "play-circle"} size={30} color={isCompleted ? "#f59e0b" : "#10b981"} />
                </TouchableOpacity>
              );
            })
          )}
        </View>

        <View style={styles.menu}>
          <Text style={styles.sectionTitle}>Pengaturan Akun</Text>
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
        <View style={{height: 50}} />
      </ScrollView>

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
  descLocked: { color: '#94a3b8', textAlign: 'center', marginTop: 10, lineHeight: 20 },
  btnLogin: { backgroundColor: '#f59e0b', padding: 15, borderRadius: 12, width: '100%', alignItems: 'center', marginTop: 25 },
  btnText: { fontWeight: 'bold', color: '#020617' },
  header: { alignItems: 'center', paddingTop: 40, paddingBottom: 30, backgroundColor: '#0f172a', borderBottomWidth: 1, borderBottomColor: '#1e293b' },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 15, borderWidth: 3, borderColor: '#f59e0b' },
  name: { color: 'white', fontSize: 22, fontWeight: 'bold' },
  role: { color: '#94a3b8', fontSize: 14, marginTop: 5 },
  section: { padding: 20 },
  sectionTitle: { color: 'white', fontSize: 16, fontWeight: 'bold', marginBottom: 15 },
  emptyBox: { alignItems: 'center', padding: 30, backgroundColor: '#0f172a', borderRadius: 20, borderWidth: 1, borderColor: '#1e293b', borderStyle: 'dashed' },
  emptyText: { color: '#94a3b8', marginTop: 10, fontSize: 12 },
  courseCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0f172a', padding: 15, borderRadius: 20, marginBottom: 15, borderWidth: 1, borderColor: '#1e293b' },
  courseImg: { width: 60, height: 60, borderRadius: 12 },
  courseInfo: { flex: 1, marginLeft: 15 },
  courseCat: { color: '#f59e0b', fontSize: 10, fontWeight: 'bold' },
  courseTitle: { color: 'white', fontSize: 14, fontWeight: 'bold', marginTop: 4 },
  courseProgress: { color: '#10b981', fontSize: 11, marginTop: 4 },
  menu: { paddingHorizontal: 20 },
  menuItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0f172a', padding: 18, borderRadius: 20, marginBottom: 15, borderWidth: 1, borderColor: '#1e293b' },
  menuLabel: { color: 'white', flex: 1, marginLeft: 15, fontWeight: '500' },
  logout: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 10, padding: 15 },
  logoutText: { color: '#ef4444', marginLeft: 10, fontWeight: 'bold' },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', padding: 20 },
  modalCard: { backgroundColor: '#0f172a', padding: 25, borderRadius: 25, borderWidth: 1, borderColor: '#1e293b' },
  modalTitle: { color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  modalInput: { backgroundColor: '#1e293b', color: 'white', padding: 15, borderRadius: 12, marginBottom: 20 },
  modalBtns: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10 },
  btnCancel: { padding: 12, paddingHorizontal: 20 },
  btnSave: { backgroundColor: '#f59e0b', padding: 12, paddingHorizontal: 25, borderRadius: 10 }
});