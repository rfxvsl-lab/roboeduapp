import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();// Di dalam handleLogin:
const handleLogin = () => {
  if (username === 'admin' && password === 'ridho2026') {
    login(); // Set state global jadi true
    router.replace('/(tabs)'); // Balik ke home
  } else {
    Alert.alert('Error', 'Username atau Password salah!');
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>ROBOEDU<Text style={{color:'#f59e0b'}}> STUDIO</Text></Text>
      <View style={styles.inputCard}>
        <Text style={styles.label}>Admin Access</Text>
        <TextInput 
          placeholder="Username" 
          placeholderTextColor="#94a3b8"
          style={styles.input}
          onChangeText={setUsername}
        />
        <TextInput 
          placeholder="Password" 
          placeholderTextColor="#94a3b8"
          secureTextEntry
          style={styles.input}
          onChangeText={setPassword}
        />
        <TouchableOpacity style={styles.btnLogin} onPress={handleLogin}>
          <Text style={styles.btnText}>MASUK KE DASHBOARD</Text>
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