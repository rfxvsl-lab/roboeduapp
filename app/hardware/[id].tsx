import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { HARDWARE_DATA } from '../../constants/HardwareData';

export default function HardwareDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const item = HARDWARE_DATA.find(i => i.id === id);

  if (!item) return <View style={styles.container}><Text style={{color:'white'}}>Komponen tidak ditemukan</Text></View>;

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: item.image }} style={styles.banner} />
      <View style={styles.content}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={{color: '#f59e0b'}}>← Kembali ke Library</Text>
        </TouchableOpacity>
        <Text style={styles.category}>{item.category}</Text>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.price}>{item.price}</Text>
        <View style={styles.divider} />
        <Text style={styles.subTitle}>Spesifikasi & Fungsi</Text>
        <Text style={styles.desc}>{item.desc}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  banner: { width: '100%', height: 300, backgroundColor: 'white' },
  content: { padding: 25, marginTop: -30, backgroundColor: '#020617', borderTopLeftRadius: 30, borderTopRightRadius: 30 },
  backBtn: { marginBottom: 20 },
  category: { color: '#f59e0b', fontWeight: 'bold', fontSize: 12 },
  title: { color: 'white', fontSize: 26, fontWeight: 'bold', marginVertical: 10 },
  price: { color: '#10b981', fontSize: 20, fontWeight: 'bold' },
  divider: { height: 1, backgroundColor: '#1e293b', marginVertical: 20 },
  subTitle: { color: 'white', fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  desc: { color: '#94a3b8', lineHeight: 22, fontSize: 14 }
});