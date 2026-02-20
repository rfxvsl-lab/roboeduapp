import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { COURSES } from '../../constants/CoursesData'; // Memanggil data manual

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.brand}>ROBOEDU<Text style={{color:'#f59e0b'}}> STUDIO</Text></Text>
      </View>

      <ScrollView style={{padding: 20}}>
        <Text style={styles.sectionLabel}>Kursus Portofolio</Text>
        
        {COURSES.map((item) => (
          <TouchableOpacity 
            key={item.id} 
            style={styles.courseCard}
            onPress={() => router.push({ pathname: '/details/[id]', params: { id: item.id } })}
          >
            <Image source={{ uri: item.image }} style={styles.thumb} />
            <View style={styles.cardInfo}>
              <Text style={styles.cCategory}>{item.category}</Text>
              <Text style={styles.cTitle}>{item.title}</Text>
              <Text style={styles.cPrice}>{item.price}</Text>
            </View>
          </TouchableOpacity>
        ))}
        <View style={{height: 100}} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  header: { padding: 20, paddingTop: 50, backgroundColor: '#0f172a', borderBottomWidth: 1, borderBottomColor: '#1e293b' },
  brand: { color: 'white', fontSize: 20, fontWeight: '900' },
  sectionLabel: { color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
  courseCard: { backgroundColor: '#0f172a', borderRadius: 24, marginBottom: 20, overflow: 'hidden', borderWidth: 1, borderColor: '#1e293b' },
  thumb: { width: '100%', height: 180 },
  cardInfo: { padding: 15 },
  cCategory: { color: '#f59e0b', fontSize: 10, fontWeight: 'bold', marginBottom: 5 },
  cTitle: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  cPrice: { color: '#10b981', marginTop: 10, fontWeight: 'bold' }
});