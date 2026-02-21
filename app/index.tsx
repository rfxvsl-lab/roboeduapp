import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import RoboLogo from '../components/RoboLogo'; // Pastikan path-nya benar
import { Ionicons } from '@expo/vector-icons';

export default function BootScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    // 1. Simulasi Terminal Cyberpunk (Teks Muncul Satu-satu)
    const bootSequence = [
      "ROBO_OS: INITIALIZING KERNEL...",
      "SYS: MOUNTING VIRTUAL DRIVES... [OK]",
      "MOD: LOADING HARDWARE LIBRARY... [OK]",
      "AI_CORE: NEURAL NET ONLINE...",
      "ACCESS GRANTED. WELCOME USER."
    ];

    let delay = 0;
    bootSequence.forEach((log) => {
      delay += 400; // Jeda 400ms per baris
      setTimeout(() => {
        setLogs(prev => [...prev, log]);
      }, delay);
    });

    // 2. Animasi Muncul Logo RoboEdu
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, friction: 4, useNativeDriver: true })
      ]).start();
    }, delay + 500);

    // 3. Pindah Otomatis ke Dashboard setelah selesai
    setTimeout(() => {
      router.replace('/(tabs)');
    }, delay + 3000); // Tahan sebentar agar logonya bisa dinikmati

  }, []);

  return (
    <View style={styles.container}>
      {/* Tampilan Terminal System Boot */}
      <View style={styles.terminalBox}>
        <Ionicons name="terminal" size={24} color="#10b981" style={{marginBottom: 10}} />
        {logs.map((log, i) => (
          <Text key={i} style={[
            styles.logText, 
            log.includes('GRANTED') && {color: '#f59e0b', fontWeight: 'bold'}
          ]}>
            {'> ' + log}
          </Text>
        ))}
        {logs.length < 5 && (
          <Text style={styles.blinkingCursor}>_</Text>
        )}
      </View>
      
      {/* Tampilan Logo Tengah */}
      <Animated.View style={[styles.logoWrapper, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <RoboLogo size={80} showText={false} />
        <Text style={styles.brandTitle}>ROBOEDU</Text>
        <Text style={styles.brandSub}>STUDIO</Text>
        <View style={styles.readyBadge}>
          <Text style={styles.readyText}>SYSTEM READY</Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617', justifyContent: 'center', padding: 30 },
  terminalBox: { position: 'absolute', top: 60, left: 30, right: 30 },
  logText: { color: '#10b981', fontFamily: 'monospace', fontSize: 12, marginBottom: 8 },
  blinkingCursor: { color: '#10b981', fontSize: 16, fontFamily: 'monospace', marginTop: -5 },
  logoWrapper: { alignItems: 'center', justifyContent: 'center', marginTop: 100 },
  brandTitle: { color: 'white', fontSize: 32, fontFamily: 'Orbitron_900Black', marginTop: 20 },
  brandSub: { color: '#f59e0b', fontSize: 18, fontFamily: 'Orbitron_700Bold', letterSpacing: 6, marginTop: -5 },
  readyBadge: { backgroundColor: '#10b98120', paddingHorizontal: 15, paddingVertical: 5, borderRadius: 20, borderWidth: 1, borderColor: '#10b981', marginTop: 20 },
  readyText: { color: '#10b981', fontSize: 12, fontWeight: 'bold', letterSpacing: 2 }
});