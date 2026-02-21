import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
// app/index.tsx
import { Redirect } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../lib/appwrite';


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
      login(); 
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Login Gagal', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>ROBOEDU<Text style={{color:'#f59e0b'}}> STUDIO</Text></Text>
      <View style={styles.inputCard}>
        <Text style={styles.label}>Admin Access</Text>
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
  logo: { color: 'white', fontSize: 32, fontWeight: '900', textAlign: 'center', marginBottom: 40 },
  label: { color: '#94a3b8', fontSize: 12, marginBottom: 15, textAlign: 'center', fontWeight: 'bold' },
  inputCard: { backgroundColor: '#0f172a', padding: 25, borderRadius: 25, borderWidth: 1, borderColor: '#1e293b' },
  input: { backgroundColor: '#1e293b', color: 'white', padding: 15, borderRadius: 12, marginBottom: 15 },
  btnLogin: { backgroundColor: '#f59e0b', padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  btnText: { color: '#020617', fontWeight: 'bold', fontSize: 14 }
});