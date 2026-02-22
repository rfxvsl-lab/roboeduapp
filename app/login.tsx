import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
// app/index.tsx
import { useAuth } from '../context/AuthContext';
import { loginUser, supabase, getUserProfile } from '../lib/supabase';


export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();// Di dalam handleLogin:
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Email dan Password harus diisi');
      return;
    }

    setIsLoading(true);
    try {
      await loginUser(email, password);
      
      // Ambil data user lengkap untuk cek email admin
      const { data: { user } } = await supabase.auth.getUser();
      const dbProfile = await getUserProfile(user!.id).catch(() => null);

      const profileData = {
        name: dbProfile?.name || user?.user_metadata.full_name || '',
        email: dbProfile?.email || user?.email || '',
        bio: dbProfile?.bio || 'Robotic Enthusiast',
        institution: dbProfile?.institution || 'RoboEdu Academy',
        phone: dbProfile?.phone || '',
        github: dbProfile?.github || '',
        avatar_url: dbProfile?.avatar_url || ''
      };
      await AsyncStorage.setItem('@user_profile', JSON.stringify(profileData));

      login(); // Panggil fungsi login di AuthContext
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Login Gagal', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Tombol Silang untuk menutup modal */}
      <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
        <Ionicons name="close" size={28} color="white" />
      </TouchableOpacity>
      <Text style={styles.logo}>ROBOEDU<Text style={{color:'#f59e0b'}}> STUDIO</Text></Text>
      <View style={styles.inputCard}>
        <Text style={styles.label}>Masuk ke Akun Anda</Text>
        <TextInput 
          placeholder="Email" 
          placeholderTextColor="#94a3b8"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput 
          placeholder="Password" 
          placeholderTextColor="#94a3b8"
          secureTextEntry
          style={styles.input}
          onChangeText={setPassword}
          value={password}
        />
        <TouchableOpacity 
          style={[styles.btnLogin, isLoading && { opacity: 0.7 }]} 
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#020617" />
          ) : (
            <Text style={styles.btnText}>MASUK KE DASHBOARD</Text>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity style={{ marginTop: 20, alignItems: 'center' }} onPress={() => router.push('/register')}>
          <Text style={{ color: '#94a3b8', fontSize: 13 }}>Belum punya akun? <Text style={{ color: '#f59e0b' }}>Daftar</Text></Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617', justifyContent: 'center', padding: 30 },
  closeBtn: { position: 'absolute', top: 50, right: 20, zIndex: 10, padding: 10 },
  logo: { color: 'white', fontSize: 32, fontWeight: '900', textAlign: 'center', marginBottom: 40 },
  label: { color: '#94a3b8', fontSize: 12, marginBottom: 15, textAlign: 'center', fontWeight: 'bold' },
  inputCard: { backgroundColor: '#0f172a', padding: 25, borderRadius: 25, borderWidth: 1, borderColor: '#1e293b' },
  input: { backgroundColor: '#1e293b', color: 'white', padding: 15, borderRadius: 12, marginBottom: 15 },
  btnLogin: { backgroundColor: '#f59e0b', padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  btnText: { color: '#020617', fontWeight: 'bold', fontSize: 14 }
});