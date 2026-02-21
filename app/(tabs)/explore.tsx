import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TextInput, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { HARDWARE_DATA } from '../../constants/HardwareData';

export default function HardwareScreen() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');
  const router = useRouter();

  const categories = ['Semua', 'Controller', 'Sensor', 'Actuator'];

  // Logika Filter Data
  const filteredData = HARDWARE_DATA.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = activeCategory === 'Semua' || item.category === activeCategory;
    return matchSearch && matchCategory;
  });
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Hardware <Text style={{color: '#f59e0b'}}>Library</Text></Text>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#94a3b8" />
          <TextInput 
            placeholder="Cari komponen..." 
            placeholderTextColor="#94a3b8"
            style={styles.input}
            onChangeText={setSearch}
          />
        </View>

        {/* Filter Kategori */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          {categories.map((cat, index) => (
            <TouchableOpacity 
              key={index} 
              style={[styles.filterChip, activeCategory === cat && styles.filterChipActive]}
              onPress={() => setActiveCategory(cat)}
            >
              <Text style={[styles.filterText, activeCategory === cat && styles.filterTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList 
        data={filteredData}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 20 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text style={{color:'#94a3b8', textAlign:'center', marginTop:20}}>Komponen tidak ditemukan.</Text>}
        renderItem={({item}) => (
          <TouchableOpacity 
            style={styles.card}
            activeOpacity={0.7}
            onPress={() => router.push({ pathname: '/hardware/[id]', params: { id: item.id } })}
          >
            <Image source={{ uri: item.image }} style={styles.img} />
            <View style={styles.info}>
              <Text style={styles.cat}>{item.category}</Text>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.desc} numberOfLines={2}>{item.desc}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  header: { padding: 25, paddingTop: 20, backgroundColor: '#0f172a', borderBottomWidth: 1, borderBottomColor: '#1e293b' },
  title: { color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  searchBar: { flexDirection: 'row', backgroundColor: '#1e293b', padding: 12, borderRadius: 15, alignItems: 'center', marginBottom: 15 },
  input: { color: 'white', marginLeft: 10, flex: 1 },
  filterScroll: { flexDirection: 'row' },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#1e293b', borderRadius: 20, marginRight: 10, borderWidth: 1, borderColor: '#334155' },
  filterChipActive: { backgroundColor: '#f59e0b', borderColor: '#f59e0b' },
  filterText: { color: '#94a3b8', fontSize: 12, fontWeight: 'bold' },
  filterTextActive: { color: '#020617' },
  card: { flexDirection: 'row', backgroundColor: '#0f172a', borderRadius: 20, marginBottom: 15, padding: 12, borderWidth: 1, borderColor: '#1e293b' },
  img: { width: 80, height: 80, borderRadius: 12, backgroundColor: 'white' },
  info: { marginLeft: 15, flex: 1, justifyContent: 'center' },
  cat: { color: '#f59e0b', fontSize: 10, fontWeight: 'bold', marginBottom: 4 },
  name: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  desc: { color: '#94a3b8', fontSize: 12, marginTop: 4, lineHeight: 18 }
});