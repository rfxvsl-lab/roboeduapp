import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Alert,
    FlatList,
    Linking,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface Asset {
  id: string;
  title: string;
  type: 'folder' | 'video' | 'audio';
  link: string;
  size: string;
}

const INITIAL_ASSETS: Asset[] = [
  { id: '1', title: 'Folder Aset 3D Robot', type: 'folder', link: 'https://drive.google.com', size: '120 MB' },
  { id: '2', title: 'BGM Cinematic Tech', type: 'audio', link: 'https://spotify.com', size: '4.5 MB' },
  { id: '3', title: 'Referensi Gerak Servo', type: 'video', link: 'https://youtube.com', size: '15 MB' },
];

export default function AssetsScreen() {
  const [assets, setAssets] = useState<Asset[]>(INITIAL_ASSETS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAsset, setNewAsset] = useState({
    title: '',
    link: '',
    type: 'folder' as 'folder' | 'video' | 'audio',
    size: '',
  });

  const handleOpenLink = (url: string) => {
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Tidak dapat membuka URL');
    });
  };

  const handleAddAsset = () => {
    if (!newAsset.title || !newAsset.link) {
      Alert.alert('Error', 'Nama dan Link wajib diisi');
      return;
    }

    const assetToAdd: Asset = {
      id: Date.now().toString(),
      title: newAsset.title,
      link: newAsset.link,
      type: newAsset.type,
      size: newAsset.size || '0 MB',
    };

    setAssets([assetToAdd, ...assets]);
    setIsModalOpen(false);
    setNewAsset({ title: '', link: '', type: 'folder', size: '' });
    Alert.alert('Sukses', 'Aset berhasil ditambahkan');
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'video': return { name: 'play-circle' as const, color: '#ef4444' };
      case 'audio': return { name: 'music-note' as const, color: '#10b981' };
      default: return { name: 'folder' as const, color: '#3b82f6' };
    }
  };

  const renderAssetItem = ({ item }: { item: Asset }) => {
    const icon = getIcon(item.type);
    return (
      <TouchableOpacity style={styles.assetCard} onPress={() => handleOpenLink(item.link)}>
        <View style={[styles.iconWrapper, { backgroundColor: `${icon.color}20` }]}>
          <MaterialIcons name={icon.name} size={28} color={icon.color} />
        </View>
        <View style={styles.assetInfo}>
          <Text style={styles.assetTitle} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.assetMeta}>{item.type.toUpperCase()} • {item.size}</Text>
        </View>
        <MaterialIcons name="open-in-new" size={20} color="#475569" />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Gudang Aset</Text>
          <Text style={styles.headerSub}>Penyimpanan link & referensi produksi</Text>
        </View>
        <TouchableOpacity style={styles.uploadBtn} onPress={() => setIsModalOpen(true)}>
          <MaterialIcons name="cloud-upload" size={20} color="#020617" />
          <Text style={styles.uploadBtnText}>Upload</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={assets}
        keyExtractor={(item) => item.id}
        renderItem={renderAssetItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <Modal visible={isModalOpen} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Tambah Aset Baru</Text>

            <Text style={styles.label}>Nama File / Folder</Text>
            <TextInput
              style={styles.input}
              placeholder="Contoh: Footage Drone"
              placeholderTextColor="#64748b"
              value={newAsset.title}
              onChangeText={(text) => setNewAsset({ ...newAsset, title: text })}
            />

            <Text style={styles.label}>Link URL (Drive/YouTube/dll)</Text>
            <TextInput
              style={styles.input}
              placeholder="https://..."
              placeholderTextColor="#64748b"
              value={newAsset.link}
              onChangeText={(text) => setNewAsset({ ...newAsset, link: text })}
            />

            <Text style={styles.label}>Tipe Aset</Text>
            <View style={styles.typeRow}>
              {(['folder', 'video', 'audio'] as const).map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[styles.typeBtn, newAsset.type === t && styles.typeBtnActive]}
                  onPress={() => setNewAsset({ ...newAsset, type: t })}
                >
                  <Text style={[styles.typeBtnText, newAsset.type === t && styles.typeBtnTextActive]}>
                    {t.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Ukuran (MB/GB)</Text>
            <TextInput
              style={styles.input}
              placeholder="Contoh: 15 MB"
              placeholderTextColor="#64748b"
              value={newAsset.size}
              onChangeText={(text) => setNewAsset({ ...newAsset, size: text })}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.btnCancel} onPress={() => setIsModalOpen(false)}>
                <Text style={styles.btnCancelText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnSubmit} onPress={handleAddAsset}>
                <Text style={styles.btnSubmitText}>Simpan Aset</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 40 },
  headerTitle: { color: 'white', fontSize: 24, fontWeight: 'bold' },
  headerSub: { color: '#94a3b8', fontSize: 12, marginTop: 4 },
  uploadBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f59e0b', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 12 },
  uploadBtnText: { color: '#020617', fontWeight: 'bold', marginLeft: 8 },
  listContent: { padding: 20 },
  assetCard: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#0f172a', 
    padding: 15, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: '#1e293b' 
  },
  iconWrapper: { width: 50, height: 50, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  assetInfo: { flex: 1, marginLeft: 15 },
  assetTitle: { color: 'white', fontSize: 15, fontWeight: 'bold' },
  assetMeta: { color: '#64748b', fontSize: 11, marginTop: 4, fontWeight: 'bold' },
  
  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#0f172a', padding: 25, borderRadius: 24, borderWidth: 1, borderColor: '#1e293b' },
  modalTitle: { color: 'white', fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  label: { color: '#94a3b8', fontSize: 11, fontWeight: 'bold', marginBottom: 8, textTransform: 'uppercase' },
  input: { 
    backgroundColor: '#1e293b', color: 'white', padding: 15, borderRadius: 12, 
    borderWidth: 1, borderColor: '#334155', marginBottom: 20 
  },
  typeRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  typeBtn: { 
    flex: 1, paddingVertical: 10, borderRadius: 10, backgroundColor: '#1e293b', 
    alignItems: 'center', borderWidth: 1, borderColor: '#334155' 
  },
  typeBtnActive: { backgroundColor: '#f59e0b', borderColor: '#f59e0b' },
  typeBtnText: { color: '#94a3b8', fontSize: 10, fontWeight: 'bold' },
  typeBtnTextActive: { color: '#020617' },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 10 },
  btnCancel: { flex: 1, padding: 15, alignItems: 'center' },
  btnCancelText: { color: '#94a3b8', fontWeight: 'bold' },
  btnSubmit: { flex: 2, backgroundColor: '#f59e0b', padding: 15, borderRadius: 12, alignItems: 'center' },
  btnSubmitText: { color: '#020617', fontWeight: 'bold' },
});