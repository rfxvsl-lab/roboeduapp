import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

const WORKFLOW_STEPS = [
  { id: '1', title: 'Konsep (Pre-Pro)', tasks: ['Pahami Brief', 'Download Aset'] },
  { id: '2', title: 'Produksi (Shooting)', tasks: ['Cam 1080p', 'Audio Jernih'] },
  { id: '3', title: 'Final Submission', tasks: ['Submit Link G-Drive'] },
];

export default function ProjectDetail() {
  const { id } = useLocalSearchParams();
  
  // DUMMY STATE: Ganti menjadi 'creator' atau 'supervisor' untuk mengetes perubahan UI
  const userRole = 'supervisor'; 
  const [completedTasks, setCompletedTasks] = useState<string[]>(['Pahami Brief']);

  const toggleTask = (task: string) => {
    if (userRole !== 'creator') {
      Alert.alert("Akses Ditolak", "Hanya Creator yang bisa mencentang tugas.");
      return;
    }
    
    setCompletedTasks(prev => 
      prev.includes(task) ? prev.filter(t => t !== task) : [...prev, task]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      
      {/* Header Info */}
      <View style={styles.header}>
        <Text style={styles.badge}>ID Project: {id}</Text>
        <Text style={styles.title}>Pembuatan Video IoT</Text>
      </View>

      {/* Workflow Tracker (Checklist) */}
      <Text style={styles.sectionTitle}>Workflow Produksi</Text>
      
      {WORKFLOW_STEPS.map((step, index) => (
        <View key={step.id} style={styles.stepContainer}>
          <Text style={styles.stepTitle}>{index + 1}. {step.title}</Text>
          
          {step.tasks.map(task => {
            const isDone = completedTasks.includes(task);
            return (
              <TouchableOpacity 
                key={task} 
                style={[styles.taskItem, isDone && styles.taskItemDone]}
                onPress={() => toggleTask(task)}
                activeOpacity={userRole === 'creator' ? 0.7 : 1}
              >
                <MaterialIcons 
                  name={isDone ? "check-circle" : "radio-button-unchecked"} 
                  size={24} 
                  color={isDone ? "#10b981" : "#64748b"} 
                />
                <Text style={[styles.taskText, isDone && styles.taskTextDone]}>{task}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}

      {/* Area Khusus Supervisor / Admin */}
      {userRole === 'supervisor' && (
        <View style={styles.adminArea}>
          <Text style={styles.adminTitle}>Menu Supervisor</Text>
          <View style={styles.btnRow}>
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#10b981' }]} onPress={() => Alert.alert("Sukses", "Preview di-Approve!")}>
              <Text style={styles.actionBtnText}>Approve Final</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#ef4444' }]} onPress={() => Alert.alert("Revisi", "Revisi dikirim ke tim!")}>
              <Text style={styles.actionBtnText}>Kirim Revisi</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  header: { marginBottom: 30 },
  badge: { color: '#f59e0b', fontSize: 12, fontWeight: 'bold', marginBottom: 10 },
  title: { color: 'white', fontSize: 24, fontWeight: 'bold' },
  sectionTitle: { color: '#94a3b8', fontSize: 14, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 15 },
  
  stepContainer: { 
    backgroundColor: '#0f172a', padding: 20, borderRadius: 20, 
    borderWidth: 1, borderColor: '#1e293b', marginBottom: 20 
  },
  stepTitle: { color: 'white', fontSize: 16, fontWeight: 'bold', marginBottom: 15 },
  taskItem: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e293b', 
    padding: 15, borderRadius: 12, marginBottom: 10 
  },
  taskItemDone: { backgroundColor: 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.3)', borderWidth: 1 },
  taskText: { color: '#cbd5e1', fontSize: 14, marginLeft: 15, fontWeight: '500' },
  taskTextDone: { color: '#10b981', textDecorationLine: 'line-through' },

  adminArea: { 
    marginTop: 10, padding: 20, backgroundColor: 'rgba(139, 92, 246, 0.1)', 
    borderRadius: 20, borderWidth: 1, borderColor: 'rgba(139, 92, 246, 0.3)' 
  },
  adminTitle: { color: '#a78bfa', fontSize: 14, fontWeight: 'bold', marginBottom: 15 },
  btnRow: { flexDirection: 'row', gap: 10 },
  actionBtn: { flex: 1, padding: 15, borderRadius: 12, alignItems: 'center' },
  actionBtnText: { color: 'white', fontWeight: 'bold' }
});