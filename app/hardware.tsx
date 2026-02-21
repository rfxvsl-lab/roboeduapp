import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AdminHardwareScreen() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Ionicons name="hardware-chip" size={50} color="#10b981" />
        <Text style={styles.title}>Manajemen Hardware</Text>
        <Text style={styles.subtitle}>Daftar semua komponen hardware. (Fitur tambah/edit/hapus akan datang)</Text>
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