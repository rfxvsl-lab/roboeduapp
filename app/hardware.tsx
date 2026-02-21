import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { deleteHardware, getAllHardware, upsertHardware } from '../lib/supabase';

export default function AdminHardwareScreen() {
  const [hardware, setHardware] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getAllHardware();
      setHardware(data);
    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (item: any = null) => {
    if (item) {
      setEditingItem(item);
      setName(item.name);
      setCategory(item.category);
      setPrice(item.price);
      setDescription(item.description || '');
      setImageUrl(item.image_url);
    } else {
      setEditingItem(null);
      setName('');
      setCategory('');
      setPrice('');
      setDescription('');
      setImageUrl('');
    }
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!name || !category || !price) return Alert.alert("Error", "Nama, Kategori, dan Harga wajib diisi");
    
    try {
      const payload = {
        ...(editingItem && { id: editingItem.id }),
        name,
        category,
        price,
        description,
        image_url: imageUrl || 'https://via.placeholder.com/400',
      };
      
      await upsertHardware(payload);
      setModalVisible(false);
      loadData();
      Alert.alert("Sukses", "Data hardware berhasil disimpan");
    } catch (e: any) {
      Alert.alert("Gagal menyimpan", e.message);
    }
  };

  const confirmDelete = (id: string) => {
    Alert.alert("Hapus Hardware", "Yakin ingin menghapus komponen ini dari katalog?", [
      { text: "Batal", style: "cancel" },
      { text: "Hapus", style: "destructive", onPress: async () => {
        try {
          await deleteHardware(id);
          loadData();
        } catch (e: any) {
          Alert.alert("Error", e.message);
        }
      }}
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Katalog Hardware</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => openModal()}>
          <Ionicons name="add" size={24} color="#020617" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator color="#10b981" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={hardware}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 20 }}
          renderItem={({ item }) => (
            <View style={styles.itemCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemTitle}>{item.name}</Text>
                <Text style={styles.itemSub}>{item.category} • <Text style={{color: '#10b981'}}>{item.price}</Text></Text>
              </View>
              <View style={styles.actions}>
                <TouchableOpacity onPress={() => openModal(item)} style={{marginRight: 15}}>
                  <Ionicons name="pencil" size={20} color="#3b82f6" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => confirmDelete(item.id)}>
                  <Ionicons name="trash" size={20} color="#ef4444" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalBg}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{editingItem ? 'Edit Hardware' : 'Tambah Hardware'}</Text>
            <TextInput placeholder="Nama Komponen" placeholderTextColor="#64748b" style={styles.input} value={name} onChangeText={setName} />
            <TextInput placeholder="Kategori (Sensor/Controller/dll)" placeholderTextColor="#64748b" style={styles.input} value={category} onChangeText={setCategory} />
            <TextInput placeholder="Harga (Contoh: Rp 50.000)" placeholderTextColor="#64748b" style={styles.input} value={price} onChangeText={setPrice} />
            <TextInput placeholder="URL Gambar" placeholderTextColor="#64748b" style={styles.input} value={imageUrl} onChangeText={setImageUrl} />
            <TextInput 
              placeholder="Deskripsi Singkat" 
              placeholderTextColor="#64748b" 
              style={[styles.input, {height: 80, textAlignVertical: 'top'}]} 
              value={description} 
              onChangeText={setDescription}
              multiline
            />
            
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
  addBtn: { backgroundColor: '#10b981', padding: 8, borderRadius: 10 },
  itemCard: { flexDirection: 'row', backgroundColor: '#0f172a', padding: 15, borderRadius: 15, marginBottom: 10, alignItems: 'center', borderWidth: 1, borderColor: '#1e293b' },
  itemTitle: { color: 'white', fontWeight: 'bold', fontSize: 14 },
  itemSub: { color: '#64748b', fontSize: 12, marginTop: 4 },
  actions: { flexDirection: 'row' },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', padding: 20 },
  modalCard: { backgroundColor: '#0f172a', padding: 25, borderRadius: 25, borderWidth: 1, borderColor: '#1e293b' },
  modalTitle: { color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
  input: { backgroundColor: '#1e293b', color: 'white', padding: 12, borderRadius: 10, marginBottom: 12 },
  modalBtns: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 10 },
  btnCancel: { padding: 12 },
  btnSave: { backgroundColor: '#10b981', padding: 12, paddingHorizontal: 25, borderRadius: 10 }
});