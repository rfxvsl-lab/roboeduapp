import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { COURSES } from '../../constants/CoursesData';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <View>
          <Text style={styles.welcome}>Selamat Datang,</Text>
          <Text style={styles.brand}>RoboEdu <Text style={{color: '#f59e0b'}}>Studio</Text></Text>
        </View>
        <TouchableOpacity style={styles.profileBtn}>
          <Image source={{ uri: 'https://ui-avatars.com/api/?name=Admin&background=f59e0b&color=fff' }} style={styles.avatar} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {/* Banner Progress */}
        <View style={styles.progressCard}>
          <Text style={styles.cardTag}>PROGRES BELAJAR</Text>
          <Text style={styles.cardTitle}>Robotic ARM Level 1</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '65%' }]} />
          </View>
          <Text style={styles.progressText}>65% Selesai</Text>
        </View>

        <Text style={styles.sectionTitle}>Modul Robotika</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizScroll}>
          {COURSES.map((course) => (
            <TouchableOpacity 
              key={course.id} 
              style={styles.modulCard}
              onPress={() => router.push({ pathname: '/details/[id]', params: { id: course.id } })}
            >
              <Image source={{ uri: course.image }} style={styles.modulImg} />
              <View style={styles.modulInfo}>
                <Text style={styles.modulCat}>{course.category}</Text>
                <Text style={styles.modulTitle}>{course.title}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>Tools & Utilitas</Text>
        <View style={styles.toolsGrid}>
          <ToolItem icon="bluetooth" label="Bluetooth Connect" color="#3b82f6" />
          <ToolItem icon="terminal" label="Serial Monitor" color="#10b981" />
          <ToolItem icon="code-slash" label="Code Snippets" color="#8b5cf6" />
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const ToolItem = ({ icon, label, color }: any) => (
  <TouchableOpacity style={styles.toolItem}>
    <View style={[styles.toolIcon, { backgroundColor: color + '20' }]}>
      <Ionicons name={icon} size={24} color={color} />
    </View>
    <Text style={styles.toolLabel}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  header: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0f172a' },
  welcome: { color: '#94a3b8', fontSize: 14 },
  brand: { color: 'white', fontSize: 24, fontWeight: '900' },
  avatar: { width: 45, height: 45, borderRadius: 15 },
  content: { padding: 20 },
  progressCard: { backgroundColor: '#1e293b', padding: 20, borderRadius: 25, marginBottom: 25, borderWidth: 1, borderColor: '#334155' },
  cardTag: { color: '#f59e0b', fontSize: 10, fontWeight: 'bold', marginBottom: 5 },
  cardTitle: { color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  progressBar: { height: 8, backgroundColor: '#0f172a', borderRadius: 10, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#f59e0b' },
  progressText: { color: '#94a3b8', fontSize: 12, marginTop: 8 },
  sectionTitle: { color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  horizScroll: { marginBottom: 30 },
  modulCard: { width: 220, backgroundColor: '#0f172a', borderRadius: 20, marginRight: 15, overflow: 'hidden', borderWidth: 1, borderColor: '#1e293b' },
  modulImg: { width: '100%', height: 130 },
  modulInfo: { padding: 15 },
  modulCat: { color: '#f59e0b', fontSize: 10, fontWeight: 'bold' },
  modulTitle: { color: 'white', fontSize: 14, fontWeight: 'bold', marginTop: 5 },
  toolsGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  toolItem: { width: '30%', alignItems: 'center' },
  toolIcon: { padding: 15, borderRadius: 20, marginBottom: 8 },
  toolLabel: { color: '#94a3b8', fontSize: 11, textAlign: 'center' },
});