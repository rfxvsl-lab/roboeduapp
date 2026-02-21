import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { createUser, loginUser } from '../lib/appwrite';
import { useAuth } from '../context/AuthContext';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleRegister = async () => {
    // Validasi input
    if (!email || !password || !name) {
      Alert.alert("Error", "Semua kolom harus diisi!");
      return;
    }

    if (password.length < 8) {
      Alert.alert("Error", "Password minimal harus 8 karakter!");
      return;
    }

    setIsLoading(true);
    try {
      await createUser(email, password, name);
      // Auto login setelah daftar
      await loginUser(email, password);
      login(); // Update state global
      
      router.replace({ pathname: '/(tabs)/profile', params: { firstLogin: 'true' } });
    } catch (error: any) {
      Alert.alert("Gagal", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.logo}>ROBOEDU<Text style={{color:'#f59e0b'}}> STUDIO</Text></Text>
        
        <View style={styles.inputCard}>
          <Text style={styles.label}>Daftar Akun Baru</Text>
          
          <TextInput 
            placeholder="Nama Lengkap" 
            placeholderTextColor="#94a3b8"
            style={styles.input}
            value={name}
            onChangeText={setName}
          />
          
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
            placeholder="Password (minimal 8 karakter)" 
            placeholderTextColor="#94a3b8"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />
          
          <TouchableOpacity 
            style={[styles.btnRegister, isLoading && { opacity: 0.7 }]} 
            onPress={handleRegister}
            disabled={isLoading}
          >
            <Text style={styles.btnText}>
              {isLoading ? "MEMPROSES..." : "DAFTAR SEKARANG"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkBtn} onPress={() => router.push('/login')}>
            <Text style={styles.linkText}>Sudah punya akun? <Text style={{color: '#f59e0b'}}>Login</Text></Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  scrollContainer: { flexGrow: 1, justifyContent: 'center', padding: 30 },
  logo: { color: 'white', fontSize: 32, fontWeight: '900', textAlign: 'center', marginBottom: 40, fontFamily: 'Orbitron_700Bold' },
  label: { color: '#94a3b8', fontSize: 12, marginBottom: 15, textAlign: 'center', fontWeight: 'bold', letterSpacing: 1 },
  inputCard: { backgroundColor: '#0f172a', padding: 25, borderRadius: 25, borderWidth: 1, borderColor: '#1e293b' },
  input: { backgroundColor: '#1e293b', color: 'white', padding: 15, borderRadius: 12, marginBottom: 15 },
  btnRegister: { backgroundColor: '#f59e0b', padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  btnText: { color: '#020617', fontWeight: 'bold', fontSize: 14 },
  linkBtn: { marginTop: 20, alignItems: 'center' },
  linkText: { color: '#94a3b8', fontSize: 13 }
});