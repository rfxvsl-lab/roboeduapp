import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect, Circle } from 'react-native-svg';

export default function RoboLogo({ size = 40, showText = true }) {
  return (
    <View style={styles.container}>
      {/* SVG Gambar Robot */}
      <Svg width={size} height={size} viewBox="0 0 100 100">
        {/* Antena */}
        <Rect x="47" y="5" width="6" height="20" fill="#f59e0b" />
        <Circle cx="50" cy="5" r="5" fill="#ef4444" />
        
        {/* Telinga */}
        <Rect x="10" y="45" width="15" height="25" rx="4" fill="#f59e0b" />
        <Rect x="75" y="45" width="15" height="25" rx="4" fill="#f59e0b" />
        
        {/* Kepala */}
        <Rect x="20" y="25" width="60" height="60" rx="15" fill="white" />
        
        {/* Mata (Kacamata Visor) */}
        <Rect x="30" y="40" width="40" height="15" rx="5" fill="#0f172a" />
        <Rect x="35" y="43" width="8" height="5" rx="2" fill="#10b981" />
        <Rect x="57" y="43" width="8" height="5" rx="2" fill="#10b981" />
        
        {/* Mulut */}
        <Rect x="35" y="65" width="30" height="6" rx="3" fill="#94a3b8" />
        <Rect x="40" y="65" width="5" height="6" fill="#0f172a" />
        <Rect x="55" y="65" width="5" height="6" fill="#0f172a" />
      </Svg>

      {/* Teks Custom Font */}
      {showText && (
        <View style={styles.textContainer}>
          <Text style={styles.brandText}>ROBOEDU</Text>
          <Text style={styles.studioText}>STUDIO</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center' },
  textContainer: { marginLeft: 10 },
  brandText: { color: 'white', fontSize: 20, fontFamily: 'Orbitron_900Black', lineHeight: 22 },
  studioText: { color: '#f59e0b', fontSize: 14, fontFamily: 'Orbitron_700Bold', letterSpacing: 2, marginTop: -2 }
});