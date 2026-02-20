import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';

export default function HomeScreen() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // FUNGSI UNTUK AMBIL DATA DARI SERVER
  const fetchData = async () => {
    try {
      // GANTI LINK INI DENGAN LINK WEB PYTHONANYWHERE KAMU
      const response = await fetch('https://usernamekamu.pythonanywhere.com/api/projects');
      const json = await response.json();
      setProjects(json);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, {justifyContent:'center'}]}>
        <ActivityIndicator size="large" color="#f59e0b" />
        <Text style={{color:'white', textAlign:'center', marginTop:10}}>Menarik data dari server...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.brand}>ROBOEDU STUDIO</Text>
      </View>

      <ScrollView style={{padding: 20}}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>Project Portofolio</Text>
          <TouchableOpacity onPress={fetchData}>
             <Text style={{color: '#f59e0b'}}>Refresh ↻</Text>
          </TouchableOpacity>
        </View>
        
        {projects.map((item) => (
          <TouchableOpacity key={item.id} style={styles.courseCard} activeOpacity={0.8}>
            <Image source={{ uri: item.icon }} style={styles.thumb} />
            <View style={styles.cardInfo}>
              <View style={styles.tagRow}>
                <Text style={[styles.cCategory, {color: '#fbbf24'}]}>{item.category}</Text>
              </View>
              <Text style={styles.cTitle}>{item.title}</Text>
              <Text style={styles.cDesc} numberOfLines={2}>{item.description}</Text>
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
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  sectionLabel: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  courseCard: { backgroundColor: '#0f172a', borderRadius: 24, marginBottom: 20, overflow: 'hidden', borderWidth: 1, borderColor: '#1e293b' },
  thumb: { width: '100%', height: 180 },
  cardInfo: { padding: 15 },
  tagRow: { flexDirection: 'row', marginBottom: 5 },
  cCategory: { fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
  cTitle: { color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  cDesc: { color: '#94a3b8', fontSize: 12, lineHeight: 18 }
});