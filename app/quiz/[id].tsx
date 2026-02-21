import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { COURSES } from '../../constants/CoursesData';

// Bank Soal Dummy
const QUIZ_DATA = [
  { 
    question: 'Apa fungsi utama dari komponen Mikrokontroler (seperti Arduino) pada sebuah robot?', 
    options: ['Sebagai sumber tenaga', 'Sebagai otak pemroses logika & perintah', 'Sebagai sensor pembaca lingkungan', 'Sebagai penggerak fisik'], 
    answer: 1 
  },
  { 
    question: 'Komponen apa yang memancarkan gelombang suara untuk mengukur jarak?', 
    options: ['Motor Servo', 'LED', 'Ultrasonic HC-SR04', 'Buzzer'], 
    answer: 2 
  },
  { 
    question: 'Berapa tegangan operasi standar dari Arduino Uno?', 
    options: ['3.3V', '5V', '12V', '220V'], 
    answer: 1 
  }
];

export default function QuizScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { completeCourse } = useAuth();
  
  const course = COURSES.find(c => c.id === id);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (selectedIndex: number) => {
    // Tambah skor jika benar
    if (selectedIndex === QUIZ_DATA[currentQ].answer) {
      setScore(prev => prev + (100 / QUIZ_DATA.length));
    }
    
    // Lanjut atau Selesai
    if (currentQ < QUIZ_DATA.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      completeCourse(id as string); // Tandai kursus selesai di AuthContext
      setShowResult(true);
    }
  };

  if (showResult) {
    return (
      <View style={styles.containerCenter}>
        <Ionicons name="trophy" size={100} color="#f59e0b" />
        <Text style={styles.resultTitle}>Ujian Selesai!</Text>
        <Text style={styles.resultSub}>Modul: {course?.title}</Text>
        
        <View style={styles.scoreBox}>
          <Text style={styles.scoreLabel}>SKOR AKHIR</Text>
          <Text style={styles.scoreText}>{Math.round(score)}</Text>
        </View>

        <TouchableOpacity style={styles.btnHome} onPress={() => router.replace('/(tabs)/profile')}>
          <Text style={styles.btnHomeText}>Kembali ke Profil</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <Ionicons name="close" size={24} color="#94a3b8" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ujian Modul</Text>
        <Text style={styles.progressText}>{currentQ + 1} / {QUIZ_DATA.length}</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.questionCard}>
          <Text style={styles.questionText}>{QUIZ_DATA[currentQ].question}</Text>
        </View>

        <View style={styles.optionsContainer}>
          {QUIZ_DATA[currentQ].options.map((option, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.optionBtn} 
              activeOpacity={0.7}
              onPress={() => handleAnswer(index)}
            >
              <View style={styles.optionLetterBox}>
                <Text style={styles.optionLetter}>{String.fromCharCode(65 + index)}</Text>
              </View>
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  containerCenter: { flex: 1, backgroundColor: '#020617', justifyContent: 'center', alignItems: 'center', padding: 30 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, paddingTop: 40, backgroundColor: '#0f172a', borderBottomWidth: 1, borderBottomColor: '#1e293b' },
  closeBtn: { padding: 5 },
  headerTitle: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  progressText: { color: '#f59e0b', fontWeight: 'bold' },
  content: { padding: 20 },
  questionCard: { backgroundColor: '#1e293b', padding: 25, borderRadius: 20, borderWidth: 1, borderColor: '#334155', marginBottom: 30 },
  questionText: { color: 'white', fontSize: 18, lineHeight: 28, fontWeight: '600', textAlign: 'center' },
  optionsContainer: { gap: 15 },
  optionBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0f172a', padding: 15, borderRadius: 16, borderWidth: 1, borderColor: '#1e293b' },
  optionLetterBox: { width: 35, height: 35, borderRadius: 10, backgroundColor: '#1e293b', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  optionLetter: { color: '#f59e0b', fontWeight: 'bold', fontSize: 16 },
  optionText: { color: 'white', fontSize: 15, flex: 1, lineHeight: 22 },
  
  resultTitle: { color: 'white', fontSize: 28, fontWeight: '900', marginTop: 20 },
  resultSub: { color: '#94a3b8', fontSize: 14, marginTop: 5, textAlign: 'center' },
  scoreBox: { backgroundColor: '#1e293b', padding: 30, borderRadius: 25, alignItems: 'center', width: '100%', marginVertical: 40, borderWidth: 1, borderColor: '#334155' },
  scoreLabel: { color: '#f59e0b', fontWeight: 'bold', letterSpacing: 2, marginBottom: 10 },
  scoreText: { color: 'white', fontSize: 60, fontWeight: '900' },
  btnHome: { backgroundColor: '#f59e0b', padding: 18, borderRadius: 16, width: '100%', alignItems: 'center' },
  btnHomeText: { color: '#020617', fontWeight: 'bold', fontSize: 16 }
});