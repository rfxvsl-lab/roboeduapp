import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { COURSES } from '../../constants/CoursesData';

export default function DetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  // Mencari data kursus yang sesuai dengan ID yang diklik
  const course = COURSES.find(item => item.id === id);

  if (!course) return <View style={styles.container}><Text style={{color:'white'}}>Kursus tidak ditemukan</Text></View>;

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: course.image }} style={styles.banner} />
      
      <View style={styles.content}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={{color: '#f59e0b'}}>← Kembali</Text>
        </TouchableOpacity>

        <Text style={styles.category}>{course.category}</Text>
        <Text style={styles.title}>{course.title}</Text>
        <Text style={styles.price}>{course.price}</Text>
        
        <View style={styles.divider} />
        
        <Text style={styles.subTitle}>Tentang Kursus</Text>
        <Text style={styles.desc}>{course.desc}</Text>

        <TouchableOpacity style={styles.btnEnroll}>
          <Text style={styles.btnText}>Pelajari Sekarang</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  banner: { width: '100%', height: 250 },
  content: { padding: 25, marginTop: -30, backgroundColor: '#020617', borderTopLeftRadius: 30, borderTopRightRadius: 30 },
  backBtn: { marginBottom: 20 },
  category: { color: '#f59e0b', fontWeight: 'bold', fontSize: 12 },
  title: { color: 'white', fontSize: 24, fontWeight: 'bold', marginVertical: 10 },
  price: { color: '#10b981', fontSize: 18, fontWeight: 'bold' },
  divider: { height: 1, backgroundColor: '#1e293b', marginVertical: 20 },
  subTitle: { color: 'white', fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  desc: { color: '#94a3b8', lineHeight: 22, fontSize: 14 },
  btnEnroll: { backgroundColor: '#f59e0b', padding: 18, borderRadius: 15, alignItems: 'center', marginTop: 30 },
  btnText: { color: '#020617', fontWeight: 'bold', fontSize: 16 }
});