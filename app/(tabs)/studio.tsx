import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function StudioScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>RoboControl <Text style={{color:'#f59e0b'}}>Direct</Text></Text>
      <View style={styles.statusBox}>
        <View style={styles.dot} />
        <Text style={styles.statusText}>Hardware Disconnected</Text>
      </View>

      <View style={styles.controllerContainer}>
        <View style={styles.dPad}>
          <TouchableOpacity style={styles.btnUp}><Ionicons name="caret-up" size={40} color="white" /></TouchableOpacity>
          <View style={styles.row}>
            <TouchableOpacity><Ionicons name="caret-back" size={40} color="white" /></TouchableOpacity>
            <View style={{width: 60}} />
            <TouchableOpacity><Ionicons name="caret-forward" size={40} color="white" /></TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.btnDown}><Ionicons name="caret-down" size={40} color="white" /></TouchableOpacity>
        </View>

        <View style={styles.actionGrid}>
          <TouchableOpacity style={[styles.actionBtn, {backgroundColor:'#ef4444'}]}><Text style={styles.btnText}>STOP</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, {backgroundColor:'#f59e0b'}]}><Text style={styles.btnText}>AUTO</Text></TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617', padding: 25, paddingTop: 60 },
  title: { color: 'white', fontSize: 24, fontWeight: '900', textAlign: 'center' },
  statusBox: { flexDirection: 'row', alignItems: 'center', alignSelf: 'center', backgroundColor: '#1e293b', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, marginTop: 15 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#ef4444', marginRight: 10 },
  statusText: { color: '#94a3b8', fontSize: 12 },
  controllerContainer: { flex: 1, justifyContent: 'center' },
  dPad: { alignItems: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
  actionGrid: { flexDirection: 'row', justifyContent: 'center', gap: 20, marginTop: 50 },
  actionBtn: { paddingHorizontal: 30, paddingVertical: 15, borderRadius: 15 },
  btnText: { color: 'white', fontWeight: 'bold' }
});