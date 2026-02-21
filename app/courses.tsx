import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, FlatList, Modal, TextInput, Alert, ActivityIndicator } from 'react-native';
import { getAllCourses, upsertCourse, deleteCourse } from '../lib/supabase';

export default function AdminCoursesScreen() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [level, setLevel] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getAllCourses();
      setCourses(data);
    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (course: any = null) => {
    if (course) {
      setEditingCourse(course);
      setTitle(course.title);
      setCategory(course.category);
      setLevel(course.level);
      setImageUrl(course.image_url);
    } else {
      setEditingCourse(null);
      setTitle('');
      setCategory('');
      setLevel('');
      setImageUrl('');
    }
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!title || !category) return Alert.alert("Error", "Isi data dengan lengkap");
    try {
      const payload = {
        ...(editingCourse && { id: editingCourse.id }),
        title,
        category,
        level,
        image_url: imageUrl || 'https://via.placeholder.com/400',
        price: 'GRATIS', // Default
        description: 'Deskripsi modul baru...',
        duration: '4 Minggu',
        curriculum: []
      };
      await upsertCourse(payload);
      setModalVisible(false);
      loadData();
    } catch (e: any) {
      Alert.alert("Gagal menyimpan", e.message);
    }
  };

  const confirmDelete = (id: string) => {
    Alert.alert("Hapus Modul", "Yakin ingin menghapus modul ini?", [
      { text: "Batal", style: "cancel" },
      { text: "Hapus", style: "destructive", onPress: async () => {
        await deleteCourse(id);
        loadData();
      }}
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Daftar Modul</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => openModal()}>
          <Ionicons name="add" size={24} color="#020617" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator color="#f59e0b" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={courses}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 20 }}
          renderItem={({ item }) => (
            <View style={styles.itemCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemSub}>{item.category} • {item.level}</Text>
              </View>
              <View style={styles.actions}>
                <TouchableOpacity onPress={() => openModal(item)}><Ionicons name="pencil" size={20} color="#3b82f6" /></TouchableOpacity>
                <TouchableOpacity onPress={() => confirmDelete(item.id)}><Ionicons name="trash" size={20} color="#ef4444" /></TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalBg}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{editingCourse ? 'Edit Modul' : 'Tambah Modul'}</Text>
            <TextInput placeholder="Judul Modul" placeholderTextColor="#64748b" style={styles.input} value={title} onChangeText={setTitle} />
            <TextInput placeholder="Kategori (ROBOTIK/IOT/AI)" placeholderTextColor="#64748b" style={styles.input} value={category} onChangeText={setCategory} />
            <TextInput placeholder="Level (Pemula/Menengah)" placeholderTextColor="#64748b" style={styles.input} value={level} onChangeText={setLevel} />
            <TextInput placeholder="URL Gambar" placeholderTextColor="#64748b" style={styles.input} value={imageUrl} onChangeText={setImageUrl} />
            
            <View style={styles.modalBtns}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.btnCancel}><Text style={{color:'white'}}>Batal</Text></TouchableOpacity>
              <TouchableOpacity onPress={handleSave} style={styles.btnSave}><Text style={{color:'#020617', fontWeight:'bold'}}>Simpan</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 10 },
  title: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  addBtn: { backgroundColor: '#f59e0b', padding: 8, borderRadius: 10 },
  itemCard: { flexDirection: 'row', backgroundColor: '#0f172a', padding: 15, borderRadius: 15, marginBottom: 10, alignItems: 'center', borderWidth: 1, borderColor: '#1e293b' },
  itemTitle: { color: 'white', fontWeight: 'bold', fontSize: 14 },
  itemSub: { color: '#64748b', fontSize: 12, marginTop: 4 },
  actions: { flexDirection: 'row', gap: 15 },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', padding: 20 },
  modalCard: { backgroundColor: '#0f172a', padding: 25, borderRadius: 25, borderWidth: 1, borderColor: '#1e293b' },
  modalTitle: { color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
  input: { backgroundColor: '#1e293b', color: 'white', padding: 12, borderRadius: 10, marginBottom: 12 },
  modalBtns: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 10 },
  btnCancel: { padding: 12 },
  btnSave: { backgroundColor: '#f59e0b', padding: 12, paddingHorizontal: 25, borderRadius: 10 }
});