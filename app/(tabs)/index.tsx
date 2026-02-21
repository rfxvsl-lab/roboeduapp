import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, StatusBar, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; 
import { COURSES } from '../../constants/CoursesData';

export default function HomeScreen() {
  const router = useRouter();
  const [greeting, setGreeting] = useState('Selamat Datang,');

  // Efek Sapaan Dinamis berdasarkan waktu perangkat
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Selamat Pagi,');
    else if (hour < 15) setGreeting('Selamat Siang,');
    else if (hour < 18) setGreeting('Selamat Sore,');
    else setGreeting('Selamat Malam,');
  }, []);

  // Fungsi interaktif untuk Tools
  const handleToolPress = (toolName: string) => {
    Alert.alert(
      "Fitur Segera Hadir",
      `Modul ${toolName} sedang dalam tahap pengembangan. Pantau terus update RoboEdu Studio!`,
      [{ text: "Mengerti", style: "default" }]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <View>
          <Text style={styles.welcome}>{greeting}</Text>
          <Text style={styles.brand}>RoboEdu <Text style={{color: '#f59e0b'}}>Studio</Text></Text>
        </View>
        <TouchableOpacity style={styles.profileBtn} onPress={() => router.push('/(tabs)/profile')}>
          <Image source={{ uri: 'https://ui-avatars.com/api/?name=Admin&background=f59e0b&color=fff' }} style={styles.avatar} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {/* Banner Progress Dinamis */}
        <View style={styles.progressCard}>
          <Text style={styles.cardTag}>PROGRES BELAJAR</Text>
          <Text style={styles.cardTitle}>Robotic ARM Level 1</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '65%' }]} />
          </View>
          <Text style={styles.progressText}>65% Selesai • Lanjutkan Modul 4</Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Modul Robotika</Text>
          <TouchableOpacity><Text style={styles.seeAll}>Lihat Semua</Text></TouchableOpacity>
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizScroll}>
          {COURSES.map((course) => (
            <TouchableOpacity 
              key={course.id} 
              style={styles.modulCard}
              activeOpacity={0.8}
              onPress={() => router.push({ pathname: '/details/[id]', params: { id: course.id } })}
            >
              <Image source={{ uri: course.image }} style={styles.modulImg} />
              <View style={styles.modulInfo}>
                <Text style={styles.modulCat}>{course.category}</Text>
                <Text style={styles.modulTitle}>{course.title}</Text>
                <View style={styles.modulMeta}>
                  <Ionicons name="bar-chart-outline" size={12} color="#94a3b8" />
                  <Text style={styles.metaText}>{course.level}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>Tools & Utilitas</Text>
        <View style={styles.toolsGrid}>
          <ToolItem 
            icon="bluetooth" 
            label="BT Connect" 
            color="#3b82f6" 
            onPress={() => router.push('/(tabs)/studio')} 
          />
          <ToolItem 
            icon="terminal" 
            label="Serial Monitor" 
            color="#10b981" 
            onPress={() => router.push('/(tabs)/studio')} 
          />
          <ToolItem 
            icon="code-slash" 
            label="Code Snippets" 
            color="#8b5cf6" 
            onPress={() => handleToolPress('Code Snippets')} 
          />
        </View>
        
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

// Komponen ToolItem yang sudah dibuat dinamis
const ToolItem = ({ icon, label, color, onPress }: any) => (
  <TouchableOpacity style={styles.toolItem} onPress={onPress} activeOpacity={0.7}>
    <View style={[styles.toolIcon, { backgroundColor: color + '20', borderColor: color + '40', borderWidth: 1 }]}>
      <Ionicons name={icon} size={28} color={color} />
    </View>
    <Text style={styles.toolLabel}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0f172a' },
  welcome: { color: '#94a3b8', fontSize: 14, fontWeight: '500' },
  brand: { color: 'white', fontSize: 24, fontWeight: '900' },
  profileBtn: { borderWidth: 2, borderColor: '#f59e0b', borderRadius: 16 },
  avatar: { width: 45, height: 45, borderRadius: 14 },
  content: { padding: 20 },
  progressCard: { backgroundColor: '#1e293b', padding: 22, borderRadius: 24, marginBottom: 30, borderWidth: 1, borderColor: '#334155', elevation: 4 },
  cardTag: { color: '#f59e0b', fontSize: 11, fontWeight: 'bold', marginBottom: 8, letterSpacing: 1 },
  cardTitle: { color: 'white', fontSize: 20, fontWeight: 'bold', marginBottom: 18 },
  progressBar: { height: 8, backgroundColor: '#0f172a', borderRadius: 10, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#f59e0b', borderRadius: 10 },
  progressText: { color: '#94a3b8', fontSize: 12, marginTop: 10, fontWeight: '500' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 15 },
  sectionTitle: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  seeAll: { color: '#f59e0b', fontSize: 12, fontWeight: 'bold' },
  horizScroll: { marginBottom: 35 },
  modulCard: { width: 240, backgroundColor: '#0f172a', borderRadius: 20, marginRight: 18, overflow: 'hidden', borderWidth: 1, borderColor: '#1e293b' },
  modulImg: { width: '100%', height: 140 },
  modulInfo: { padding: 18 },
  modulCat: { color: '#f59e0b', fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },
  modulTitle: { color: 'white', fontSize: 15, fontWeight: 'bold', marginTop: 6, lineHeight: 22 },
  modulMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  metaText: { color: '#94a3b8', fontSize: 11, marginLeft: 5 },
  toolsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  toolItem: { width: '30%', alignItems: 'center' },
  toolIcon: { padding: 18, borderRadius: 22, marginBottom: 10 },
  toolLabel: { color: '#94a3b8', fontSize: 12, textAlign: 'center', fontWeight: '500' },
});