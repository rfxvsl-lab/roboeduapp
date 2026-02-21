import React, { useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Komponen Tombol Animasi Khusus Gaming
const GameButton = ({ icon, color = '#1e293b' }: any) => {
  const scale = useRef(new Animated.Value(1)).current;

  // Animasi saat ditekan (Mengecil)
  const handlePressIn = () => Animated.spring(scale, { toValue: 0.8, useNativeDriver: true }).start();
  // Animasi saat dilepas (Kembali semula)
  const handlePressOut = () => Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();

  return (
    <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View style={[styles.btnFrame, { backgroundColor: color, transform: [{ scale }] }]}>
        <Ionicons name={icon} size={45} color="white" />
      </Animated.View>
    </Pressable>
  );
};

export default function StudioScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>RoboControl <Text style={{color:'#f59e0b'}}>Pro</Text></Text>
      <View style={styles.statusBox}>
        <View style={styles.dot} />
        <Text style={styles.statusText}>Hardware Standby</Text>
      </View>

      <View style={styles.controllerContainer}>
        {/* D-Pad Layout */}
        <View style={styles.dPad}>
          <GameButton icon="caret-up" />
          <View style={styles.row}>
            <GameButton icon="caret-back" />
            <View style={{width: 70}} /> {/* Jarak Tengah */}
            <GameButton icon="caret-forward" />
          </View>
          <GameButton icon="caret-down" />
        </View>

        {/* Action Buttons */}
        <View style={styles.actionGrid}>
          <View style={styles.circleBtnRed}><Text style={styles.btnText}>B</Text></View>
          <View style={styles.circleBtnYellow}><Text style={styles.btnText}>A</Text></View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617', padding: 25, paddingTop: 40 },
  title: { color: 'white', fontSize: 24, fontWeight: '900', textAlign: 'center' },
  statusBox: { flexDirection: 'row', alignItems: 'center', alignSelf: 'center', backgroundColor: '#0f172a', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, marginTop: 15, borderWidth: 1, borderColor: '#1e293b' },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#10b981', marginRight: 10 },
  statusText: { color: '#94a3b8', fontSize: 12 },
  controllerContainer: { flex: 1, justifyContent: 'center' },
  dPad: { alignItems: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', marginVertical: 10 },
  btnFrame: { padding: 15, borderRadius: 20, borderWidth: 2, borderColor: '#334155', elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3 },
  actionGrid: { flexDirection: 'row', justifyContent: 'center', gap: 30, marginTop: 60 },
  circleBtnRed: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#ef4444', justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#7f1d1d' },
  circleBtnYellow: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#f59e0b', justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#92400e', marginTop: -30 },
  btnText: { color: 'white', fontWeight: '900', fontSize: 24 }
});