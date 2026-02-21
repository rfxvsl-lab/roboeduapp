import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Komponen Tombol Animasi Khusus Gaming
const GameButton = ({ icon, color = '#1e293b', onPress }: any) => {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, { toValue: 0.8, useNativeDriver: true }).start();
    if (onPress) onPress();
  };
  
  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();
  };

  return (
    <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View style={[styles.btnFrame, { backgroundColor: color, transform: [{ scale }] }]}>
        <Ionicons name={icon} size={45} color="white" />
      </Animated.View>
    </Pressable>
  );
};

export default function StudioScreen() {
  const [isConnected, setIsConnected] = useState(false);
  const [logs, setLogs] = useState<string[]>(['[SYS] System initialized...', '[SYS] Standby mode.']);
  const [speed, setSpeed] = useState('Med');
  const scrollViewRef = useRef<ScrollView>(null);

  // Simulasi data masuk dari Robot (misal sensor ultrasonic)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isConnected) {
      interval = setInterval(() => {
        const data = ['Ping: 12ms', 'Sensor Depan: 15cm', 'Suhu: 32°C', 'Baterai: 7.4V'];
        const randomLog = data[Math.floor(Math.random() * data.length)];
        setLogs(prev => [...prev, `[DATA] ${randomLog}`]);
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isConnected]);

  // Fungsi untuk mencatat aktivitas tombol ke Terminal
  const addLog = (action: string) => {
    if (!isConnected) {
      setLogs(prev => [...prev, `[WARN] Connect Bluetooth dulu! (Gagal: ${action})`]);
      return;
    }
    setLogs(prev => [...prev, `[CMD] ${action}`]);
  };

  // Fungsi Toggle Bluetooth
  const toggleConnection = () => {
    if (!isConnected) {
      setLogs(prev => [...prev, '[SYS] Mencari perangkat HC-05...']);
      setTimeout(() => {
        setIsConnected(true);
        setLogs(prev => [...prev, '[SYS] Berhasil terhubung ke ROBO-01!']);
      }, 1500);
    } else {
      setIsConnected(false);
      setLogs(prev => [...prev, '[SYS] Koneksi terputus.']);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header & Bluetooth */}
      <View style={styles.header}>
        <Text style={styles.title}>RoboControl <Text style={{color:'#f59e0b'}}>Pro</Text></Text>
        <TouchableOpacity 
          style={[styles.connectBtn, isConnected ? styles.connected : styles.disconnected]}
          onPress={toggleConnection}
        >
          <Ionicons name={isConnected ? "bluetooth" : "bluetooth-outline"} size={18} color="white" />
          <Text style={styles.connectText}>{isConnected ? "Connected" : "Connect"}</Text>
        </TouchableOpacity>
      </View>

      {/* Terminal / Serial Monitor */}
      <View style={styles.terminal}>
        <View style={styles.terminalHeader}>
          <Ionicons name="terminal" size={16} color="#10b981" />
          <Text style={styles.terminalTitle}>Serial Monitor</Text>
        </View>
        <ScrollView 
          style={styles.logContainer} 
          ref={scrollViewRef}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
          showsVerticalScrollIndicator={false}
        >
          {logs.map((log, index) => (
            <Text key={index} style={[
              styles.logText, 
              log.includes('[WARN]') && {color: '#ef4444'},
              log.includes('[CMD]') && {color: '#f59e0b'},
              log.includes('[DATA]') && {color: '#3b82f6'}
            ]}>{log}</Text>
          ))}
        </ScrollView>
      </View>

      {/* Speed Control */}
      <View style={styles.speedControl}>
        <Text style={styles.speedLabel}>Motor Speed (PWM):</Text>
        <View style={styles.speedOptions}>
          {['Low', 'Med', 'High'].map(s => (
            <TouchableOpacity 
              key={s} 
              onPress={() => { setSpeed(s); addLog(`Set Speed to ${s}`); }} 
              style={[styles.speedBtn, speed === s && styles.speedBtnActive]}
            >
              <Text style={[styles.speedBtnText, speed === s && {color:'#020617'}]}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Controller Pad (Fix Error Bebas Komentar Liar) */}
      <View style={styles.controllerContainer}>
        <View style={styles.dPad}>
          <GameButton icon="caret-up" onPress={() => addLog('Move FORWARD')} />
          <View style={styles.row}>
            <GameButton icon="caret-back" onPress={() => addLog('Turn LEFT')} />
            <View style={{width: 70}}></View>
            <GameButton icon="caret-forward" onPress={() => addLog('Turn RIGHT')} />
          </View>
          <GameButton icon="caret-down" onPress={() => addLog('Move BACKWARD')} />
        </View>

        {/* Action Buttons */}
        <View style={styles.actionGrid}>
          <TouchableOpacity style={styles.circleBtnRed} onPress={() => addLog('EMERGENCY STOP')} activeOpacity={0.7}>
            <Text style={styles.btnText}>B</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.circleBtnYellow} onPress={() => addLog('ACTION / GRAB')} activeOpacity={0.7}>
            <Text style={styles.btnText}>A</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617', padding: 20, paddingTop: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { color: 'white', fontSize: 22, fontWeight: '900' },
  connectBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20 },
  disconnected: { backgroundColor: '#ef4444' },
  connected: { backgroundColor: '#10b981' },
  connectText: { color: 'white', fontWeight: 'bold', marginLeft: 8, fontSize: 12 },
  
  terminal: { backgroundColor: '#0f172a', borderRadius: 15, height: 120, padding: 10, borderWidth: 1, borderColor: '#1e293b', marginBottom: 20 },
  terminalHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 5, borderBottomWidth: 1, borderBottomColor: '#1e293b', paddingBottom: 5 },
  terminalTitle: { color: '#10b981', fontSize: 12, fontWeight: 'bold', marginLeft: 8, fontFamily: 'monospace' },
  logContainer: { flex: 1 },
  logText: { color: '#94a3b8', fontSize: 11, fontFamily: 'monospace', marginBottom: 2 },
  
  speedControl: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 30, backgroundColor: '#0f172a', padding: 15, borderRadius: 15, borderWidth: 1, borderColor: '#1e293b' },
  speedLabel: { color: '#94a3b8', fontSize: 12, fontWeight: 'bold' },
  speedOptions: { flexDirection: 'row', gap: 10 },
  speedBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: '#334155' },
  speedBtnActive: { backgroundColor: '#f59e0b', borderColor: '#f59e0b' },
  speedBtnText: { color: '#94a3b8', fontSize: 12, fontWeight: 'bold' },

  controllerContainer: { flex: 1, justifyContent: 'center' },
  dPad: { alignItems: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', marginVertical: 10 },
  btnFrame: { padding: 15, borderRadius: 20, borderWidth: 2, borderColor: '#334155', elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3 },
  actionGrid: { flexDirection: 'row', justifyContent: 'center', gap: 30, marginTop: 40 },
  circleBtnRed: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#ef4444', justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#7f1d1d' },
  circleBtnYellow: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#f59e0b', justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#92400e', marginTop: -30 },
  btnText: { color: 'white', fontWeight: '900', fontSize: 24 }
});