import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { COURSES } from '../../constants/CoursesData';
import { Ionicons } from '@expo/vector-icons';

export default function DetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  
  // Cari data kursus berdasarkan ID
  const course = COURSES.find(item => item.id === id);

  if (!course) {
    return (
      <View style={styles.containerNotFound}>
        <Text style={styles.textNotFound}>Kursus tidak ditemukan</Text>
      </View>
    );
  }

  const handleEnroll = () => {
    setShowModal(true);
  };

  return (
    <View style={styles.mainWrapper}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Image source={{ uri: course.image }} style={styles.banner} />
        
        <View style={styles.content}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={20} color="#f59e0b" />
            <Text style={styles.backText}>Kembali</Text>
          </TouchableOpacity>

          <View style={styles.badgeContainer}>
            <Text style={styles.category}>{course.category}</Text>
            <View style={styles.badgeRow}>
              <Ionicons name="time-outline" size={14} color="#94a3b8" />
              <Text style={styles.badgeText}>{course.duration}</Text>
              <View style={styles.dot} />
              <Ionicons name="bar-chart-outline" size={14} color="#94a3b8" />
              <Text style={styles.badgeText}>{course.level}</Text>
            </View>
          </View>

          <Text style={styles.title}>{course.title}</Text>
          <Text style={styles.price}>{course.price}</Text>
          
          <View style={styles.divider} />
          
          <Text style={styles.subTitle}>Deskripsi Kursus</Text>
          <Text style={styles.desc}>{course.description}</Text>

          <View style={styles.divider} />

          <Text style={styles.subTitle}>Kurikulum Pembelajaran</Text>
          {course.curriculum.map((materi, index) => (
            <View key={index} style={styles.curriculumItem}>
              <View style={styles.curriculumNumber}>
                <Text style={styles.curriculumNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.curriculumText}>{materi}</Text>
              <Ionicons name="play-circle-outline" size={24} color="#f59e0b" />
            </View>
          ))}

          {/* Spacer agar tidak tertutup sticky button */}
          <View style={{height: 100}} /> 
        </View>
      </ScrollView>

      {/* Sticky Bottom Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.btnEnroll} onPress={handleEnroll} activeOpacity={0.8}>
          <Text style={styles.btnText}>Daftar Sekarang</Text>
          <Ionicons name="chevron-forward" size={20} color="#020617" />
        </TouchableOpacity>
      </View>

      {/* Modal Sukses Pendaftaran */}
      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modalBg}>
          <View style={styles.modalCard}>
            <Ionicons name="checkmark-circle" size={60} color="#10b981" />
            <Text style={styles.modalTitle}>Berhasil Mendaftar!</Text>
            <Text style={styles.modalDesc}>Kamu telah terdaftar di kelas "{course.title}". Silakan cek menu Profil untuk mulai belajar.</Text>
            <TouchableOpacity 
              style={styles.btnModal} 
              onPress={() => { 
                setShowModal(false); 
                router.replace('/(tabs)/profile'); 
              }}
            >
              <Text style={styles.btnText}>Lihat Kelas Saya</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  mainWrapper: { flex: 1, backgroundColor: '#020617' },
  containerNotFound: { flex: 1, backgroundColor: '#020617', justifyContent: 'center', alignItems: 'center' },
  textNotFound: { color: 'white', fontSize: 18 },
  container: { flex: 1 },
  banner: { width: '100%', height: 280, resizeMode: 'cover' },
  content: { padding: 25, marginTop: -40, backgroundColor: '#020617', borderTopLeftRadius: 35, borderTopRightRadius: 35 },
  backBtn: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, backgroundColor: '#0f172a', alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, borderWidth: 1, borderColor: '#1e293b' },
  backText: { color: '#f59e0b', marginLeft: 6, fontWeight: 'bold', fontSize: 12 },
  badgeContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  badgeRow: { flexDirection: 'row', alignItems: 'center' },
  badgeText: { color: '#94a3b8', fontSize: 12, marginLeft: 5, fontWeight: '500' },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#334155', marginHorizontal: 8 },
  category: { color: '#f59e0b', fontWeight: 'bold', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 },
  title: { color: 'white', fontSize: 26, fontWeight: '900', marginVertical: 12, lineHeight: 34 },
  price: { color: '#10b981', fontSize: 20, fontWeight: 'bold' },
  divider: { height: 1, backgroundColor: '#1e293b', marginVertical: 25 },
  subTitle: { color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  desc: { color: '#94a3b8', lineHeight: 24, fontSize: 14, textAlign: 'justify' },
  curriculumItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0f172a', padding: 15, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: '#1e293b' },
  curriculumNumber: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#1e293b', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  curriculumNumberText: { color: '#f59e0b', fontWeight: 'bold', fontSize: 14 },
  curriculumText: { color: 'white', flex: 1, fontSize: 14, fontWeight: '500' },
  
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#0f172a', padding: 20, borderTopWidth: 1, borderTopColor: '#1e293b' },
  btnEnroll: { backgroundColor: '#f59e0b', padding: 18, borderRadius: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  btnText: { color: '#020617', fontWeight: 'bold', fontSize: 16, marginRight: 10 },
  
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalCard: { backgroundColor: '#0f172a', padding: 30, borderRadius: 30, borderWidth: 1, borderColor: '#1e293b', width: '100%', alignItems: 'center' },
  modalTitle: { color: 'white', fontSize: 22, fontWeight: 'bold', marginVertical: 15 },
  modalDesc: { color: '#94a3b8', textAlign: 'center', lineHeight: 22, marginBottom: 25 },
  btnModal: { backgroundColor: '#f59e0b', padding: 15, borderRadius: 12, width: '100%', alignItems: 'center' }
});