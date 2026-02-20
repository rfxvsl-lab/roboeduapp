import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const { isLoggedIn, logout } = useAuth();
  const router = useRouter();

  if (!isLoggedIn) {
    return (
      <View style={styles.containerCenter}>
        <Ionicons name="lock-closed" size={80} color="#1e293b" />
        <Text style={styles.textLocked}>Akses Terbatas</Text>
        <Text style={styles.subTextLocked}>Silakan login untuk melihat profil robotika kamu.</Text>
        
        <TouchableOpacity 
          style={styles.btnLogin} 
          onPress={() => router.push('/login')}
        >
          <Text style={styles.btnText}>LOGIN SEKARANG</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Tampilan Profile asli jika sudah login */}
      <Text style={styles.title}>Profil Saya</Text>
      <TouchableOpacity onPress={logout} style={styles.btnLogout}>
        <Text style={{color: 'white'}}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  containerCenter: { flex: 1, backgroundColor: '#020617', justifyContent: 'center', alignItems: 'center', padding: 40 },
  textLocked: { color: 'white', fontSize: 22, fontWeight: 'bold', marginTop: 20 },
  subTextLocked: { color: '#94a3b8', textAlign: 'center', marginTop: 10, lineHeight: 20 },
  btnLogin: { backgroundColor: '#f59e0b', padding: 15, borderRadius: 12, width: '100%', alignItems: 'center', marginTop: 30 },
  btnText: { color: '#020617', fontWeight: 'bold' },
  // ... style lainnya
});