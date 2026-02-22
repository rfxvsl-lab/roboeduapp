import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Linking, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import RoboLogo from '../../components/RoboLogo'; // <-- Import Logo SVG kita
import { fetchHighlights, fetchNews, getRandomSpotlightUser } from '../../lib/studioApi';
import { getAllCourses } from '../../lib/supabase';

export default function HomeScreen() {
  const router = useRouter();
  const [greeting, setGreeting] = useState('Selamat Datang,');
  const [profile, setProfile] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  const [news, setNews] = useState<any[]>([]);

  const [spotlightUser, setSpotlightUser] = useState<any>(null);

  // Muat profil setiap kali halaman difokuskan agar foto selalu update
  useFocusEffect(
    useCallback(() => {
      const loadProfile = async () => {
        const saved = await AsyncStorage.getItem('@user_profile');
        if (saved) setProfile(JSON.parse(saved));
      };
      const loadCourses = async () => {
        setLoadingCourses(true);
        try {
          setCourses(await getAllCourses());
        } catch (error: any) {
          Alert.alert("Error", "Gagal memuat kursus: " + error.message);
        } finally {
          setLoadingCourses(false);
        }
      };
      loadProfile();
      loadCourses();
    }, [])
  );

  // Efek Sapaan Dinamis berdasarkan waktu perangkat
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Selamat Pagi,');
    else if (hour < 15) setGreeting('Selamat Siang,');
    else if (hour < 18) setGreeting('Selamat Sore,');
    else setGreeting('Selamat Malam,');
  }, []);

  useEffect(() => {
    const fetchSpotlight = async () => {
      const user = await getRandomSpotlightUser();
      setSpotlightUser(user);
    };
    fetchSpotlight();
  }, []);

  const [carouselImages, setCarouselImages] = useState<any[]>([]); // Ubah tipe data untuk menyimpan objek penuh jika diperlukan

  useFocusEffect(
    useCallback(() => {
      const loadHighlightsAndNews = async () => {
        // Load Highlights
        const { data: highlightsData, error: highlightsError } = await fetchHighlights();
        if (highlightsError) console.error("Error fetching highlights:", highlightsError);
        else setCarouselImages(highlightsData || []);

        // Load News
        const { data: newsData, error: newsError } = await fetchNews();
        if (newsError) console.error("Error fetching news:", newsError);
        else setNews(newsData || []);
      };
      loadHighlightsAndNews();
    }, [])
  );



  // Fungsi interaktif untuk Tools
  const handleToolPress = (toolName: string) => {
    Alert.alert(
      "Fitur Segera Hadir",
      `Modul ${toolName} sedang dalam tahap pengembangan. Pantau terus update RoboEdu Studio!`,
      [{ text: "Mengerti", style: "default" }]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* HEADER BARU DENGAN LOGO SVG */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcome}>{greeting}</Text>
          <RoboLogo size={40} showText={true} />
        </View>
        <TouchableOpacity style={styles.profileBtn} onPress={() => router.push('/(tabs)/profile')}>
          <Image 
            source={{ uri: profile?.avatar_url || `https://ui-avatars.com/api/?name=${(profile?.name || 'Admin').replace(/\s/g, '+')}&background=f59e0b&color=fff` }} 
            style={styles.avatar} 
          />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {/* Banner Progress Dinamis */}
        <View style={styles.progressCard}>
          <Text style={styles.cardTag}>PROGRES BELAJAR</Text>
          <Text style={styles.cardTitle}>Robotic ARM Level 1</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '65%' }]} />
          </View>
          <Text style={styles.progressText}>65% Selesai • Lanjutkan Modul 4</Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Modul Robotika</Text>
          <TouchableOpacity><Text style={styles.seeAll}>Lihat Semua</Text></TouchableOpacity>
        </View>
        
        {loadingCourses ? (
          <ActivityIndicator size="large" color="#f59e0b" style={{ marginVertical: 20 }} />
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizScroll}>
            {courses.map((course) => (
              <TouchableOpacity 
                key={course.id} 
                style={styles.modulCard}
                activeOpacity={0.8}
                onPress={() => router.push({ pathname: '/details/[id]', params: { id: course.id } })}
              >
                <Image source={{ uri: course.image_url }} style={styles.modulImg} />
                <View style={styles.modulInfo}>
                  <Text style={styles.modulCat}>{course.category}</Text>
                  <Text style={styles.modulTitle}>{course.title}</Text>
                  <View style={styles.modulMeta}>
                    <Ionicons name="bar-chart-outline" size={12} color="#94a3b8" />
                    <Text style={styles.metaText}>{course.level}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        <Text style={styles.sectionTitle}>Tools & Utilitas</Text>
        <View style={styles.toolsGrid}>
          <ToolItem 
            icon="bluetooth" 
            label="BT Connect" 
            color="#3b82f6" 
            onPress={() => router.push('/(tabs)/studio')} 
          />
          <ToolItem 
            icon="terminal" 
            label="Serial Monitor" 
            color="#10b981" 
            onPress={() => router.push('/(tabs)/studio')} 
          />
          <ToolItem 
            icon="chatbubbles" 
            label="Tanya AI" 
            color="#f59e0b" 
            onPress={() => router.push('/chat')} 
          />
          <ToolItem 
            icon="code-slash" 
            label="Code Snippets" 
            color="#8b5cf6" 
            onPress={() => handleToolPress('Code Snippets')} 
          />
        </View>
        
        {/* 1. CAROUSEL BANNER */}
        <View style={[styles.sectionHeader, { marginTop: 30 }]}>
          <Text style={styles.sectionTitle}>Weekly Highlights</Text>          
        </View>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.carouselScroll}
          contentContainerStyle={styles.carouselContainer}
        >
          {carouselImages.map((img, index) => (
            <Image key={index} source={{ uri: img.image_url }} style={styles.carouselImage} />
          ))}
        </ScrollView>

        {/* 2. SPOTLIGHT TIM */}
        <Text style={[styles.sectionTitle, { marginTop: 30, marginBottom: 15 }]}>Mengenal Tim Kami</Text>
        {spotlightUser ? (
          <View style={styles.spotlightCard}>
            <Image 
              source={{ uri: spotlightUser.avatar_url || `https://ui-avatars.com/api/?name=${(spotlightUser.name || 'User').replace(/\s/g, '+')}&background=f59e0b&color=fff` }} 
              style={styles.spotlightAvatar} 
            />
            <View style={styles.spotlightInfo}>
              <Text style={styles.spotlightName}>{spotlightUser.name}</Text>
              <Text style={styles.spotlightRole}>{spotlightUser.role || 'Team Member'}</Text>
              <Text style={styles.spotlightBio}>{spotlightUser.bio || "Anggota tim luar biasa RoboEdu!"}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Belum ada tim yang disorot hari ini.</Text>
          </View>
        )}

        {/* 3. NEWS FEED & BOT */}
        <View style={[styles.sectionHeader, { marginTop: 30 }]}>
          <Text style={styles.sectionTitle}>Berita Teknologi Terkini</Text>          
        </View>

        <View style={styles.newsContainer}>
          {news.length > 0 ? (
            news.map((item, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.newsCard}
                onPress={() => Linking.openURL(item.link)}
              >
                <Image source={{ uri: item.image_url }} style={styles.newsImage} />
                <View style={styles.newsInfo}>
                  <Text style={styles.newsTitle} numberOfLines={2}>{item.title}</Text>
                  <Text style={styles.newsDate}>{new Date(item.published_date).toLocaleDateString('id-ID')}</Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="newspaper-outline" size={40} color="#1e293b" />
              <Text style={styles.emptyText}>Belum ada berita hari ini.</Text>
            </View>
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

// Komponen ToolItem yang sudah dibuat dinamis
const ToolItem = ({ icon, label, color, onPress }: any) => (
  <TouchableOpacity style={styles.toolItem} onPress={onPress} activeOpacity={0.7}>
    <View style={[styles.toolIcon, { backgroundColor: color + '20', borderColor: color + '40', borderWidth: 1 }]}>
      <Ionicons name={icon} size={28} color={color} />
    </View>
    <Text style={styles.toolLabel}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0f172a', borderBottomWidth: 1, borderBottomColor: '#1e293b' },
  welcome: { color: '#94a3b8', fontSize: 12, fontWeight: '500', marginBottom: 5 },
  profileBtn: { borderWidth: 2, borderColor: '#f59e0b', borderRadius: 16 },
  avatar: { width: 45, height: 45, borderRadius: 14 },
  content: { padding: 20 },
  progressCard: { 
    backgroundColor: '#1e293b', 
    padding: 22, 
    borderRadius: 24, 
    marginBottom: 30, 
    borderWidth: 1, 
    borderColor: '#334155',
    // Use elevation for Android and boxShadow for Web/iOS to avoid deprecation warnings
    elevation: 4,
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.3)',
  },
  cardTag: { color: '#f59e0b', fontSize: 11, fontWeight: 'bold', marginBottom: 8, letterSpacing: 1 },
  cardTitle: { color: 'white', fontSize: 20, fontFamily: 'Orbitron_700Bold', marginBottom: 18 }, // <-- Font Baru
  progressBar: { height: 8, backgroundColor: '#0f172a', borderRadius: 10, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#f59e0b', borderRadius: 10 },
  progressText: { color: '#94a3b8', fontSize: 12, marginTop: 10, fontWeight: '500' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 15 },
  sectionTitle: { color: 'white', fontSize: 18, fontFamily: 'Orbitron_700Bold' }, // <-- Font Baru
  seeAll: { color: '#f59e0b', fontSize: 12, fontWeight: 'bold' },
  horizScroll: { marginBottom: 35 },
  modulCard: { width: 240, backgroundColor: '#0f172a', borderRadius: 20, marginRight: 18, overflow: 'hidden', borderWidth: 1, borderColor: '#1e293b' },
  modulImg: { width: '100%', height: 140 },
  modulInfo: { padding: 18 },
  modulCat: { color: '#f59e0b', fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },
  modulTitle: { color: 'white', fontSize: 15, fontWeight: 'bold', marginTop: 6, lineHeight: 22 },
  modulMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  metaText: { color: '#94a3b8', fontSize: 11, marginLeft: 5 },
  toolsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  toolItem: { width: '30%', alignItems: 'center' },
  toolIcon: { padding: 18, borderRadius: 22, marginBottom: 10 },
  toolLabel: { color: '#94a3b8', fontSize: 12, textAlign: 'center', fontWeight: '500' },
  adminActionText: { color: '#f59e0b', fontSize: 12, fontWeight: 'bold' },
  carouselScroll: { marginBottom: 10, paddingLeft: 20 }, // Added paddingLeft for consistency
  carouselContainer: { paddingRight: 10 },
  carouselImage: { 
    width: 300, 
    height: 150, 
    borderRadius: 16, 
    marginRight: 15,
    backgroundColor: '#0f172a', // Placeholder background
  },
  spotlightCard: {
    flexDirection: 'row',
    backgroundColor: '#0f172a',
    padding: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#f59e0b', // Accent border
    alignItems: 'center',
    marginBottom: 10
  },
  spotlightAvatar: { width: 70, height: 70, borderRadius: 35, borderWidth: 2, borderColor: '#f59e0b' }, // Accent border for avatar
  spotlightInfo: { flex: 1, marginLeft: 15 },
  spotlightName: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  spotlightRole: { color: '#f59e0b', fontSize: 12, fontWeight: 'bold', marginTop: 2 },
  spotlightBio: { color: '#94a3b8', fontSize: 11, marginTop: 5, lineHeight: 16 },
  botBtn: { backgroundColor: '#f59e0b', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 }, // Accent button
  botBtnText: { color: '#020617', fontSize: 10, fontWeight: 'bold' },
  newsContainer: { marginTop: 10 },
  newsCard: { 
    flexDirection: 'row', 
    backgroundColor: '#0f172a', 
    padding: 12, // Consistent padding
    borderRadius: 16, 
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1e293b'
  },
  newsImage: { width: 80, height: 60, borderRadius: 8 }, // Image thumbnail
  newsInfo: { flex: 1, marginLeft: 12, justifyContent: 'center' },
  newsTitle: { color: 'white', fontSize: 13, fontWeight: 'bold', lineHeight: 18 },
  newsDate: { color: '#64748b', fontSize: 10, marginTop: 5 },
  emptyState: { alignItems: 'center', marginTop: 20, padding: 30 },
  emptyText: { color: '#475569', fontSize: 12, marginTop: 10 }
});