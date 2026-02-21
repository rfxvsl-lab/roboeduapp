import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { COURSES } from '../../constants/CoursesData';
import { useAuth } from '../../context/AuthContext';
import { getUserProfile, supabase } from '../../lib/supabase';

interface UserProfile {
  name: string;
  bio: string;
  institution: string;
  email: string;
  phone: string;
  github: string;
  avatar_url?: string;
  role?: string;
}

export default function ProfileScreen() {
  const { isLoggedIn, logout, enrolledCourses, completedCourses } = useAuth();
  const router = useRouter();
  const { firstLogin } = useLocalSearchParams();
  
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    bio: '',
    institution: '',
    email: '',
    phone: '',
    github: '',
    avatar_url: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [tempProfile, setTempProfile] = useState<UserProfile>(profile);
  const [showWelcome, setShowWelcome] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      loadProfile();
      
      // Cek jika ini pendaftaran baru
      if (firstLogin === 'true') {
        setShowWelcome(true);
      }
    }
  }, [isLoggedIn, firstLogin]);

  // Pastikan data edit (tempProfile) terupdate saat profile berhasil dimuat
  useEffect(() => {
    setTempProfile(profile);
  }, [profile]);

  const loadProfile = async () => {
    try {
      // 1. Muat data dari penyimpanan lokal dulu (agar UI cepat muncul)
      const savedProfile = await AsyncStorage.getItem('@user_profile');
      let currentData = savedProfile ? JSON.parse(savedProfile) : profile;
      setProfile(currentData);

      // 2. Sinkronkan dengan data asli dari Appwrite (Nama & Email)
      // Ini memastikan jika user baru daftar, data dari Register langsung masuk sini
      try {
        const { data: { user } } = await supabase.auth.getUser();
        const dbProfile = await getUserProfile(user!.id);
        
        if (dbProfile) {
          const updatedProfile = dbProfile as unknown as UserProfile;
          setProfile(updatedProfile);
          await AsyncStorage.setItem('@user_profile', JSON.stringify(updatedProfile));
        }
      } catch (err) {
        console.log("Supabase sync skipped (offline or no session)");
      }
    } catch (e) {
      console.error('Failed to load profile', e);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Izin Ditolak", "Kami butuh izin galeri untuk mengganti foto.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      // Validasi ukuran 2MB (2 * 1024 * 1024 bytes)
      if (asset.fileSize && asset.fileSize > 2097152) {
        Alert.alert("Ukuran Terlalu Besar", "Maksimal ukuran foto adalah 2MB.");
        return;
      }
      uploadAvatar(asset.uri);
    }
  };

  const uploadAvatar = async (uri: string) => {
    try {
      setUploading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const fileExt = uri.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      
      const response = await fetch(uri);
      const blob = await response.blob();

      const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, blob);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(fileName);

      const { error: updateError } = await supabase.from('user_profiles').update({ avatar_url: publicUrl }).eq('user_id', user.id);
      if (updateError) throw updateError;

      const updatedProfile = { ...profile, avatar_url: publicUrl };
      setProfile(updatedProfile);
      await AsyncStorage.setItem('@user_profile', JSON.stringify(updatedProfile));
      Alert.alert("Sukses", "Foto profil berhasil diperbarui!");
    } catch (error: any) {
      Alert.alert("Gagal Upload", error.message);
    } finally {
      setUploading(false);
    }
  };

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

  const handleSaveProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Update di Supabase Database
      const { error } = await supabase
        .from('user_profiles')
        .update(tempProfile)
        .eq('user_id', user!.id);
      if (error) throw error;
      
      setProfile(tempProfile);
      await AsyncStorage.setItem('@user_profile', JSON.stringify(tempProfile));
      setIsEditing(false);
    } catch (e) {
      console.error('Failed to save profile', e);
    }
  };

  const myCourses = COURSES.filter(course => enrolledCourses.includes(course.id));
  const totalXP = completedCourses.length * 100;
  const currentLevel = Math.floor(totalXP / 300) + 1;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={pickImage} disabled={uploading}>
            <Image source={{ uri: profile.avatar_url || `https://ui-avatars.com/api/?name=${(profile.name || 'User').replace(/\s/g, '+')}&background=f59e0b&color=fff` }} style={styles.avatar} />
            {uploading && <ActivityIndicator style={StyleSheet.absoluteFill} color="#f59e0b" />}
            <View style={styles.editBadge}><Ionicons name="camera" size={12} color="#020617" /></View>
          </TouchableOpacity>
          <Text style={styles.name}>{profile.name || 'User'}</Text>
          <View style={styles.levelBadge}><Text style={styles.levelText}>LVL {currentLevel}</Text></View>
          <Text style={styles.role}>{profile.bio || 'Robotic Enthusiast'}</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{enrolledCourses.length}</Text>
            <Text style={styles.statLabel}>Kursus</Text>
          </View>
          <View style={[styles.statItem, { borderLeftWidth: 1, borderRightWidth: 1, borderColor: '#1e293b' }]}>
            <Text style={styles.statValue}>{completedCourses.length}</Text>
            <Text style={styles.statLabel}>Selesai</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{totalXP}</Text>
            <Text style={styles.statLabel}>XP</Text>
          </View>
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

        {completedCourses.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sertifikat Kelulusan</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {completedCourses.map(courseId => {
                const course = COURSES.find(c => c.id === courseId);
                return (
                  <TouchableOpacity key={courseId} style={styles.certCard}>
                    <Ionicons name="ribbon" size={30} color="#f59e0b" />
                    <Text style={styles.certText} numberOfLines={1}>{course?.title}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pencapaian (Badges)</Text>
          <View style={styles.badgeContainer}>
            <View style={[styles.badge, enrolledCourses.length > 0 && styles.badgeActive]}>
              <Ionicons name="rocket" size={24} color={enrolledCourses.length > 0 ? "#f59e0b" : "#334155"} />
              <Text style={styles.badgeText}>Pemula</Text>
            </View>
            <View style={[styles.badge, completedCourses.length > 0 && styles.badgeActive]}>
              <Ionicons name="ribbon" size={24} color={completedCourses.length > 0 ? "#f59e0b" : "#334155"} />
              <Text style={styles.badgeText}>Lulusan</Text>
            </View>
            <View style={[styles.badge, completedCourses.length >= 3 && styles.badgeActive]}>
              <Ionicons name="trophy" size={24} color={completedCourses.length >= 3 ? "#f59e0b" : "#334155"} />
              <Text style={styles.badgeText}>Master</Text>
            </View>
          </View>
        </View>

        <View style={styles.menu}>
          <Text style={styles.sectionTitle}>Pengaturan Akun</Text>
          
          {profile.email === 'hilal.alhamdi22@gmail.com' && (
            <TouchableOpacity style={[styles.menuItem, {borderColor: '#f59e0b50'}]} onPress={() => router.push('/admin')}>
              <Ionicons name="shield-checkmark" size={24} color="#f59e0b" />
              <Text style={[styles.menuLabel, {color: '#f59e0b'}]}>Panel Kontrol Admin</Text>
              <Ionicons name="chevron-forward" size={20} color="#f59e0b" />
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.menuItem} onPress={() => { setTempProfile(profile); setIsEditing(true); }}>
            <Ionicons name="pencil" size={24} color="#f59e0b" />
            <Text style={styles.menuLabel}>Edit Profil Lengkap</Text>
            <Ionicons name="chevron-forward" size={20} color="#334155" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} activeOpacity={1}>
            <Ionicons name="business" size={24} color="#3b82f6" />
            <Text style={styles.menuLabel}>{profile.institution || 'Belum diatur'}</Text>
            <Text style={{color: '#475569', fontSize: 10}}>INSTITUSI</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} activeOpacity={1}>
            <Ionicons name="mail" size={24} color="#10b981" />
            <Text style={styles.menuLabel}>{profile.email || 'Belum diatur'}</Text>
            <Text style={{color: '#475569', fontSize: 10}}>EMAIL</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} activeOpacity={1}>
            <Ionicons name="call" size={24} color="#8b5cf6" />
            <Text style={styles.menuLabel}>{profile.phone || 'Belum diatur'}</Text>
            <Text style={{color: '#475569', fontSize: 10}}>TELEPON</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} activeOpacity={1}>
            <Ionicons name="logo-github" size={24} color="white" />
            <Text style={styles.menuLabel}>{profile.github || 'Belum diatur'}</Text>
            <Text style={{color: '#475569', fontSize: 10}}>GITHUB</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.logout} onPress={logout}>
            <Ionicons name="log-out-outline" size={24} color="#ef4444" />
            <Text style={styles.logoutText}>Keluar Akun</Text>
          </TouchableOpacity>
        </View>
        <View style={{height: 50}} />
      </ScrollView>

      {/* MODAL EDIT NAMA */}
      <Modal 
        visible={isEditing} 
        transparent 
        animationType="slide"
        aria-modal={true}
      >
        <View style={styles.modalBg}>
          <ScrollView contentContainerStyle={styles.modalScroll} bounces={false}>
            <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Lengkapi Profil</Text>
            
            <Text style={styles.inputLabel}>Nama Lengkap</Text>
            <TextInput 
              style={styles.modalInput}
              value={tempProfile.name}
              onChangeText={(val) => setTempProfile({...tempProfile, name: val})}
              placeholder="Nama Lengkap"
              placeholderTextColor="#94a3b8"
            />

            <Text style={styles.inputLabel}>Bio / Motto</Text>
            <TextInput 
              style={styles.modalInput}
              value={tempProfile.bio}
              onChangeText={(val) => setTempProfile({...tempProfile, bio: val})}
              placeholder="Contoh: Robotic Enthusiast"
              placeholderTextColor="#94a3b8"
            />

            <Text style={styles.inputLabel}>Institusi / Sekolah</Text>
            <TextInput 
              style={styles.modalInput}
              value={tempProfile.institution}
              onChangeText={(val) => setTempProfile({...tempProfile, institution: val})}
              placeholder="Nama Sekolah atau Kampus"
              placeholderTextColor="#94a3b8"
            />

            <Text style={styles.inputLabel}>Email</Text>
            <TextInput 
              style={styles.modalInput}
              value={tempProfile.email}
              onChangeText={(val) => setTempProfile({...tempProfile, email: val})}
              placeholder="email@contoh.com"
              placeholderTextColor="#94a3b8"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.inputLabel}>Nomor Telepon</Text>
            <TextInput 
              style={styles.modalInput}
              value={tempProfile.phone}
              onChangeText={(val) => setTempProfile({...tempProfile, phone: val})}
              placeholder="0812..."
              placeholderTextColor="#94a3b8"
              keyboardType="phone-pad"
            />

            <Text style={styles.inputLabel}>Username Github</Text>
            <TextInput 
              style={styles.modalInput}
              value={tempProfile.github}
              onChangeText={(val) => setTempProfile({...tempProfile, github: val})}
              placeholder="github.com/username"
              placeholderTextColor="#94a3b8"
              autoCapitalize="none"
            />

            <View style={styles.modalBtns}>
              <TouchableOpacity onPress={() => setIsEditing(false)} style={styles.btnCancel}><Text style={{color:'white'}}>Batal</Text></TouchableOpacity>
              <TouchableOpacity onPress={handleSaveProfile} style={styles.btnSave}><Text style={{color:'#020617', fontWeight:'bold'}}>Simpan Perubahan</Text></TouchableOpacity>
            </View>
          </View>
          </ScrollView>
        </View>
      </Modal>

      {/* MODAL WELCOME / LENGKAPI PROFIL */}
      <Modal 
        visible={showWelcome} 
        transparent 
        animationType="fade"
        aria-modal={true}
      >
        <View style={styles.modalBg}>
          <View style={styles.modalCard}>
            <View style={{ backgroundColor: '#f59e0b20', padding: 20, borderRadius: 50, marginBottom: 20 }}>
              <Ionicons name="sparkles" size={40} color="#f59e0b" />
            </View>
            <Text style={styles.modalTitle}>Selamat Datang!</Text>
            <Text style={[styles.descLocked, { marginBottom: 25 }]}>
              Akunmu berhasil dibuat. Yuk, lengkapi profilmu agar instruktur bisa mengenalmu lebih baik!
            </Text>
            <TouchableOpacity 
              style={styles.btnSave} 
              onPress={() => { setShowWelcome(false); setIsEditing(true); }}
            >
              <Text style={{ color: '#020617', fontWeight: 'bold', paddingHorizontal: 20 }}>LENGKAPI SEKARANG</Text>
            </TouchableOpacity>
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
  editBadge: { position: 'absolute', bottom: 15, right: 5, backgroundColor: '#f59e0b', padding: 6, borderRadius: 12, borderWidth: 2, borderColor: '#0f172a' },
  name: { color: 'white', fontSize: 22, fontWeight: 'bold' },
  role: { color: '#94a3b8', fontSize: 14, marginTop: 5 },
  levelBadge: { backgroundColor: '#f59e0b', paddingHorizontal: 10, paddingVertical: 2, borderRadius: 5, marginTop: 5 },
  levelText: { color: '#020617', fontSize: 10, fontWeight: 'bold' },
  statsRow: { flexDirection: 'row', backgroundColor: '#0f172a', paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: '#1e293b' },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  statLabel: { color: '#64748b', fontSize: 12, marginTop: 4 },
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
  badgeContainer: { flexDirection: 'row', gap: 15 },
  badge: { flex: 1, backgroundColor: '#0f172a', padding: 15, borderRadius: 20, alignItems: 'center', borderWidth: 1, borderColor: '#1e293b' },
  badgeActive: { borderColor: '#f59e0b30', backgroundColor: '#f59e0b05' },
  badgeText: { color: '#64748b', fontSize: 10, marginTop: 8, fontWeight: 'bold' },
  menu: { paddingHorizontal: 20 },
  menuItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0f172a', padding: 18, borderRadius: 20, marginBottom: 15, borderWidth: 1, borderColor: '#1e293b' },
  menuLabel: { color: 'white', flex: 1, marginLeft: 15, fontWeight: '500' },
  logout: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 10, padding: 15 },
  logoutText: { color: '#ef4444', marginLeft: 10, fontWeight: 'bold' },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', padding: 20 },
  modalScroll: { flexGrow: 1, justifyContent: 'center' },
  modalCard: { backgroundColor: '#0f172a', padding: 25, borderRadius: 25, borderWidth: 1, borderColor: '#1e293b' },
  modalTitle: { color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
  inputLabel: { color: '#f59e0b', fontSize: 11, fontWeight: 'bold', marginBottom: 8, marginLeft: 4 },
  modalInput: { backgroundColor: '#1e293b', color: 'white', padding: 15, borderRadius: 12, marginBottom: 15 },
  modalBtns: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10 },
  btnCancel: { padding: 12, paddingHorizontal: 20 },
  btnSave: { backgroundColor: '#f59e0b', padding: 12, paddingHorizontal: 25, borderRadius: 10 },
  certCard: { backgroundColor: '#1e293b', padding: 15, borderRadius: 15, marginRight: 10, alignItems: 'center', width: 120, borderWidth: 1, borderColor: '#f59e0b40' },
  certText: { color: 'white', fontSize: 10, marginTop: 8, textAlign: 'center', fontWeight: 'bold' }
});