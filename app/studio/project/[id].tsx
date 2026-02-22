import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Linking, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ALL_TASK_IDS, WORKFLOW_STEPS } from '../../../constants/StudioData';
import { useAuth } from '../../../context/AuthContext';
import { fetchProjectById, updateProject } from '../../../lib/studioApi';

export default function ProjectDetail() {
  const { id } = useLocalSearchParams();
  const { role } = useAuth();
  
  // State simulasi data project aktif
  const [activeProject, setActiveProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [isApproved, setIsApproved] = useState(false);
  const [previewLink, setPreviewLink] = useState('');
  const [deadline, setDeadline] = useState('2024-12-25');
  const [script, setScript] = useState('');
  const [equipment, setEquipment] = useState('');
  const [proposalStatus, setProposalStatus] = useState('None'); 
  const [finalGDriveLink, setFinalGDriveLink] = useState('');
  const [finalLink, setFinalLink] = useState('');
  const [projectStatus, setProjectStatus] = useState('In Progress');
  const [feedback, setFeedback] = useState('');
  const [feedbackInput, setFeedbackInput] = useState('');

  useEffect(() => {
    loadProject();
  }, [id]);

  const loadProject = async () => {
    setIsLoading(true);
    const { data, error } = await fetchProjectById(id as string);
    if (data) {
      setActiveProject(data);
      setCompletedTasks(data.completed_tasks || []);
      setIsApproved(data.is_approved || false);
      setPreviewLink(data.preview_link || '');
      setScript(data.script || '');
      setEquipment(data.equipment || '');
      setProposalStatus(data.proposal_status || 'None');
      setFinalLink(data.final_link || '');
      setProjectStatus(data.status || 'In Progress');
      setFeedback(data.feedback || '');
    }
    setIsLoading(false);
  };

  const handleApproval = async (approved: boolean) => {
    const updateData = {
      is_approved: approved,
      feedback: approved ? '' : feedbackInput
    };
    
    const { error } = await updateProject(id as string, updateData);
    if (!error) {
      setIsApproved(approved);
      if (approved) {
        setFeedback('');
        Alert.alert("Sukses", "Preview di-Approve! Step 5 sekarang terbuka.");
      } else {
        setFeedback(feedbackInput);
        Alert.alert("Revisi", "Catatan revisi telah dikirim ke tim!");
      }
    }
  };

  const handleSubmitPreview = async () => {
    const { error } = await updateProject(id as string, { preview_link: previewLink });
    if (!error) {
      Alert.alert("Sukses", "Link Preview berhasil dikirim ke Supervisor.");
    }
  };

  const handleFinalSubmit = async () => {
    if (!finalLink) {
      Alert.alert("Error", "Masukkan link final terlebih dahulu.");
      return;
    }
    Alert.alert(
      "Konfirmasi Selesai",
      "Yakin project ini selesai? Data tidak dapat diubah setelah disubmit.",
      [
        { text: "Batal", style: "cancel" },
        { 
          text: "Ya, Selesai", 
          onPress: async () => {
            const { error } = await updateProject(id as string, {
              status: 'Completed',
              final_link: finalLink,
              progress: 100
            });
            if (!error) {
              setProjectStatus('Completed');
              setCompletedTasks([...ALL_TASK_IDS]);
              Alert.alert("Sukses", "Project telah diselesaikan!");
            }
          } 
        }
      ]
    );
  };

  const isTaskLocked = (taskName: string) => {
    const taskIndex = ALL_TASK_IDS.indexOf(taskName);
    
    // Aturan 1: Sequential Lock (Task sebelumnya harus selesai)
    if (taskIndex > 0) {
      const prevTask = ALL_TASK_IDS[taskIndex - 1];
      if (!completedTasks.includes(prevTask)) return true;
    }

    // Aturan 2: Gatekeeper Lock (Step 5 terkunci jika belum Approved)
    const finalStepTasks = WORKFLOW_STEPS[4].tasks;
    if (finalStepTasks.includes(taskName) && !isApproved) return true;

    return false;
  };

  const toggleTask = async (task: string) => {
    if (role !== 'creator') {
      Alert.alert("Akses Ditolak", "Hanya Creator yang bisa mencentang tugas.");
      return;
    }

    if (isTaskLocked(task)) {
      Alert.alert("Tugas Terkunci!", "Selesaikan tugas sebelumnya atau tunggu Approval.");
      return;
    }
    
    const newCompletedTasks = completedTasks.includes(task) 
      ? completedTasks.filter(t => t !== task) 
      : [...completedTasks, task];
    
    const newProgress = Math.round((newCompletedTasks.length / ALL_TASK_IDS.length) * 100);

    const { error } = await updateProject(id as string, {
      completed_tasks: newCompletedTasks,
      progress: newProgress
    });

    if (!error) {
      setCompletedTasks(newCompletedTasks);
    }
  };

  if (isLoading) return <View style={styles.containerCenter}><ActivityIndicator size="large" color="#f59e0b" /></View>;
  if (!activeProject) return <View style={styles.containerCenter}><Text style={{color: 'white'}}>Project tidak ditemukan</Text></View>;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      
      {/* Header Info */}
      <View style={styles.header}>
        <Text style={styles.badge}>ID Project: {activeProject.id}</Text>
        <Text style={styles.title}>{activeProject.title}</Text>
      </View>

      {activeProject.isBigProject ? (
        /* TAMPILAN ADVANCED UI (PROJECT BESAR) */
        <View>
          <Text style={styles.deadlineText}>Deadline: {deadline}</Text>
          
          <Text style={styles.inputLabel}>Script & Naskah</Text>
          <TextInput 
            style={[styles.textInput, styles.advancedInput]}
            multiline
            numberOfLines={6}
            value={script}
            onChangeText={setScript}
            editable={role === 'creator'}
            placeholder="Tulis naskah video di sini..."
            placeholderTextColor="#64748b"
          />

          <Text style={styles.inputLabel}>List Alat & Equipment</Text>
          <TextInput 
            style={[styles.textInput, styles.advancedInput]}
            multiline
            numberOfLines={6}
            value={equipment}
            onChangeText={setEquipment}
            editable={role === 'creator'}
            placeholder="Contoh: Tripod, Mic Wireless, Sony A6400..."
            placeholderTextColor="#64748b"
          />

          <Text style={styles.sectionTitle}>Preview Komposisi (Max 20)</Text>
          <View style={styles.compositionGrid}>
            {[...Array(20)].map((_, i) => (
              <TouchableOpacity key={i} style={styles.compositionBox}>
                <MaterialIcons name="add" size={20} color="#334155" />
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.approvalCard}>
            <Text style={styles.approvalTitle}>Final Submission & Proposal</Text>
            <Text style={styles.inputLabel}>Link GDrive Project</Text>
            <TextInput 
              style={styles.textInput}
              value={finalGDriveLink}
              onChangeText={setFinalGDriveLink}
              placeholder="https://drive.google.com/..."
              placeholderTextColor="#64748b"
            />
            <TouchableOpacity style={styles.submitBtn}>
              <Text style={styles.submitBtnText}>
                {proposalStatus === 'None' ? "Ajukan Konsep" : 
                 proposalStatus === 'Revision' ? "Ajukan Ulang" : "Submit Final"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        /* TAMPILAN WORKFLOW STANDAR */
        <>
          <Text style={styles.sectionTitle}>Workflow Produksi</Text>
          
          {WORKFLOW_STEPS.map((step, index) => (
            <React.Fragment key={step.id}>
              <View 
                style={[
                  styles.stepContainer, 
                  step.id === '5' && !isApproved && { opacity: 0.5 }
                ]}
                pointerEvents={step.id === '5' && !isApproved ? 'none' : 'auto'}
              >
                <Text style={styles.stepTitle}>{index + 1}. {step.title}</Text>
                
                {step.id === '5' && !isApproved && (
                  <View style={styles.lockedStepOverlay}>
                    <MaterialIcons name="lock" size={20} color="#94a3b8" />
                    <Text style={styles.lockedStepText}>Menunggu Approval Preview dari Supervisor</Text>
                  </View>
                )}

                {step.tasks.map(task => {
                  const isDone = completedTasks.includes(task);
                  const locked = isTaskLocked(task);

                  return (
                    <TouchableOpacity 
                      key={task} 
                      style={[styles.taskItem, isDone && styles.taskItemDone, locked && styles.taskItemLocked]}
                      onPress={() => toggleTask(task)}
                      activeOpacity={role === 'creator' && !locked ? 0.7 : 1}
                    >
                      <MaterialIcons 
                        name={locked ? "lock" : (isDone ? "check-circle" : "radio-button-unchecked")} 
                        size={24} 
                        color={locked ? "#475569" : (isDone ? "#10b981" : "#64748b")} 
                      />
                      <Text style={[styles.taskText, isDone && styles.taskTextDone, locked && styles.taskTextLocked]}>{task}</Text>
                      {locked && <MaterialIcons name="lock-outline" size={16} color="#475569" style={{ marginLeft: 'auto' }} />}
                    </TouchableOpacity>
                  );
                })}

                {/* Input Final Link & Submit (Hanya di Step 5 dan jika Approved) */}
                {step.id === '5' && isApproved && (
                  <View style={styles.finalActionArea}>
                    {projectStatus === 'Completed' ? (
                      <TouchableOpacity 
                        style={styles.linkBox} 
                        onPress={() => Linking.openURL(finalLink)}
                      >
                        <MaterialIcons name="cloud-done" size={20} color="#10b981" />
                        <Text style={styles.linkText}>Buka Link Final (1080p)</Text>
                      </TouchableOpacity>
                    ) : (
                      role === 'creator' && (
                        <>
                          <Text style={styles.inputLabel}>Link Final G-Drive (1080p)</Text>
                          <TextInput
                            style={styles.textInput}
                            value={finalLink}
                            onChangeText={setFinalLink}
                            placeholder="https://drive.google.com/..."
                            placeholderTextColor="#64748b"
                          />
                          <TouchableOpacity 
                            style={styles.submitBtn} 
                            onPress={handleFinalSubmit}
                          >
                            <Text style={styles.submitBtnText}>Submit Final & Selesai</Text>
                          </TouchableOpacity>
                        </>
                      )
                    )}
                  </View>
                )}
              </View>

              {/* Area Preview & Approval (Muncul setelah Step 4) */}
              {step.id === '4' && projectStatus !== 'Completed' && (
                <View style={styles.approvalCard}>
                  <Text style={styles.approvalTitle}>Area Preview & Approval</Text>
                  
                  {role === 'creator' ? (
                    <>
                      {feedback && !isApproved && (
                        <View style={styles.feedbackBox}>
                          <MaterialIcons name="error-outline" size={20} color="#ef4444" />
                          <Text style={styles.feedbackText}>Revisi: {feedback}</Text>
                        </View>
                      )}
                      <Text style={styles.inputLabel}>Link G-Drive Preview</Text>
                      <TextInput
                        style={styles.textInput}
                        value={previewLink}
                        onChangeText={setPreviewLink}
                        placeholder="https://drive.google.com/..."
                        placeholderTextColor="#64748b"
                        editable={!isApproved}
                      />
                      <TouchableOpacity 
                        style={[styles.submitBtn, isApproved && styles.disabledBtn]} 
                        onPress={handleSubmitPreview}
                        disabled={isApproved}
                      >
                        <Text style={styles.submitBtnText}>
                          {isApproved ? "Preview Disetujui" : "Submit Preview"}
                        </Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <>
                      <TouchableOpacity style={styles.linkBox} onPress={() => Linking.openURL(previewLink)}>
                        <MaterialIcons name="link" size={20} color="#3b82f6" />
                        <Text style={styles.linkText} numberOfLines={1}>{previewLink}</Text>
                      </TouchableOpacity>
                      <Text style={styles.inputLabel}>Catatan Revisi</Text>
                      <TextInput
                        style={[styles.textInput, { height: 80, textAlignVertical: 'top' }]}
                        value={feedbackInput}
                        onChangeText={setFeedbackInput}
                        placeholder="Tulis catatan revisi di sini..."
                        placeholderTextColor="#64748b"
                        multiline
                      />
                      <View style={styles.btnRow}>
                        <TouchableOpacity 
                          style={[styles.actionBtn, { backgroundColor: '#10b981' }]} 
                          onPress={() => handleApproval(true)}
                        >
                          <Text style={styles.actionBtnText}>Approve Preview</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={[styles.actionBtn, { backgroundColor: '#ef4444' }]} 
                          onPress={() => handleApproval(false)}
                        >
                          <Text style={styles.actionBtnText}>Kirim Revisi</Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  )}
                </View>
              )}
            </React.Fragment>
          ))}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  containerCenter: { flex: 1, backgroundColor: '#020617', justifyContent: 'center', alignItems: 'center' },
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
  taskItemLocked: { opacity: 0.5 },
  taskText: { color: '#cbd5e1', fontSize: 14, marginLeft: 15, fontWeight: '500' },
  taskTextDone: { color: '#10b981', textDecorationLine: 'line-through' },
  taskTextLocked: { color: '#475569' },

  approvalCard: {
    backgroundColor: '#0f172a', padding: 20, borderRadius: 20, 
    borderWidth: 1, borderColor: '#334155', marginBottom: 20, borderStyle: 'dashed'
  },
  approvalTitle: { color: '#f59e0b', fontSize: 16, fontWeight: 'bold', marginBottom: 15 },
  feedbackBox: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(239, 68, 68, 0.1)', 
    padding: 15, borderRadius: 12, marginBottom: 15, borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.3)' 
  },
  feedbackText: { color: '#ef4444', fontSize: 13, marginLeft: 10, flex: 1 },
  inputLabel: { color: '#94a3b8', fontSize: 12, fontWeight: 'bold', marginBottom: 8, textTransform: 'uppercase' },
  textInput: { 
    backgroundColor: '#1e293b', color: 'white', padding: 12, borderRadius: 12, 
    borderWidth: 1, borderColor: '#334155', marginBottom: 15 
  },
  submitBtn: { backgroundColor: '#10b981', padding: 15, borderRadius: 12, alignItems: 'center' },
  submitBtnText: { color: 'white', fontWeight: 'bold' },
  disabledBtn: { backgroundColor: '#334155', opacity: 0.7 },
  linkBox: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e293b', 
    padding: 12, borderRadius: 12, marginBottom: 15, borderWidth: 1, borderColor: '#334155' 
  },
  linkText: { color: '#3b82f6', fontSize: 13, marginLeft: 10, textDecorationLine: 'underline' },
  btnRow: { flexDirection: 'row', gap: 10 },
  actionBtn: { flex: 1, padding: 15, borderRadius: 12, alignItems: 'center' },
  actionBtnText: { color: 'white', fontWeight: 'bold' },
  lockedStepOverlay: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, backgroundColor: 'rgba(0,0,0,0.3)', padding: 10, borderRadius: 10 },
  lockedStepText: { color: '#94a3b8', fontSize: 12, marginLeft: 10, fontWeight: 'bold' },
  finalActionArea: { marginTop: 10, borderTopWidth: 1, borderTopColor: '#1e293b', paddingTop: 20 },

  /* STYLES UNTUK PROJECT BESAR */
  deadlineText: { color: '#f59e0b', fontWeight: 'bold', fontSize: 16, marginBottom: 20 },
  advancedInput: { height: 150, textAlignVertical: 'top', borderColor: '#f59e0b' },
  compositionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 30 },
  compositionBox: { 
    width: '22%', 
    aspectRatio: 1, 
    borderWidth: 1, 
    borderColor: '#334155', 
    borderStyle: 'dashed', 
    borderRadius: 10, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
});