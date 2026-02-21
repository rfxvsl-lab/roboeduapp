import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function AdminCoursesScreen() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Ionicons name="book" size={50} color="#3b82f6" />
        <Text style={styles.title}>Manajemen Modul</Text>
        <Text style={styles.subtitle}>Daftar semua modul kursus. (Fitur tambah/edit/hapus akan datang)</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617', justifyContent: 'center', alignItems: 'center' },
  content: { justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { color: 'white', fontSize: 20, fontWeight: 'bold', marginTop: 15 },
  subtitle: { color: '#94a3b8', fontSize: 14, textAlign: 'center', marginTop: 10 }
});