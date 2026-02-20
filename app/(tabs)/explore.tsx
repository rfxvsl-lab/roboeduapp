import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TextInput, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const HARDWARE_DATA = [
  { id: '1', name: 'Arduino Uno R3', category: 'Controller', desc: 'Otak utama robotika.', image: 'https://cdn.shopify.com/s/files/1/0506/1601/products/A000066_03.front_600x600.jpg' },
  { id: '2', name: 'Ultrasonic HC-SR04', category: 'Sensor', desc: 'Sensor pengukur jarak.', image: 'https://vct.co.id/wp-content/uploads/2020/06/HC-SR04.jpg' },
  { id: '3', name: 'Servo MG996R', category: 'Actuator', desc: 'Motor penggerak torsi tinggi.', image: 'https://arduino.com.pk/wp-content/uploads/2018/10/MG996R.jpg' },
];

export default function HardwareScreen() {
  const [search, setSearch] = useState('');
  
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
      </View>

      <FlatList 
        data={HARDWARE_DATA.filter(i => i.name.toLowerCase().includes(search.toLowerCase()))}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 20 }}
        renderItem={({item}) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.img} />
            <View style={styles.info}>
              <Text style={styles.cat}>{item.category}</Text>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.desc}>{item.desc}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  header: { padding: 25, paddingTop: 60, backgroundColor: '#0f172a' },
  title: { color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  searchBar: { flexDirection: 'row', backgroundColor: '#1e293b', padding: 12, borderRadius: 15, alignItems: 'center' },
  input: { color: 'white', marginLeft: 10, flex: 1 },
  card: { flexDirection: 'row', backgroundColor: '#0f172a', borderRadius: 20, marginBottom: 15, padding: 12, borderWidth: 1, borderColor: '#1e293b' },
  img: { width: 80, height: 80, borderRadius: 12 },
  info: { marginLeft: 15, flex: 1, justifyContent: 'center' },
  cat: { color: '#f59e0b', fontSize: 10, fontWeight: 'bold' },
  name: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  desc: { color: '#94a3b8', fontSize: 12, marginTop: 4 }
});