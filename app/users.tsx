import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { getAllUsers, updateUserRole } from '../lib/supabase';

export default function AdminUsersScreen() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    Alert.alert("Ubah Role", `Ubah user ini menjadi ${newRole}?`, [
      { text: "Batal", style: "cancel" },
      { text: "Ya, Ubah", onPress: async () => {
        try {
          await updateUserRole(userId, newRole);
          loadUsers();
        } catch (e: any) {
          Alert.alert("Gagal", e.message);
        }
      }}
    ]);
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator color="#f59e0b" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.user_id}
          contentContainerStyle={{ padding: 20 }}
          renderItem={({ item }) => (
            <View style={styles.userCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.userName}>{item.name}</Text>
                <Text style={styles.userEmail}>{item.email}</Text>
                <View style={[styles.roleBadge, { backgroundColor: item.role === 'admin' ? '#f59e0b20' : '#334155' }]}>
                  <Text style={[styles.roleText, { color: item.role === 'admin' ? '#f59e0b' : '#94a3b8' }]}>{item.role.toUpperCase()}</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => toggleRole(item.user_id, item.role)} style={styles.actionBtn}>
                <Ionicons name="swap-horizontal" size={20} color="#f59e0b" />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  userCard: { flexDirection: 'row', backgroundColor: '#0f172a', padding: 15, borderRadius: 15, marginBottom: 10, alignItems: 'center', borderWidth: 1, borderColor: '#1e293b' },
  userName: { color: 'white', fontWeight: 'bold', fontSize: 15 },
  userEmail: { color: '#64748b', fontSize: 12, marginTop: 2 },
  roleBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, marginTop: 8 },
  roleText: { fontSize: 10, fontWeight: 'bold' },
  actionBtn: { padding: 10, backgroundColor: '#1e293b', borderRadius: 10 }
});