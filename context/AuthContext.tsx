import React, { createContext, useContext, useEffect, useState } from 'react'; // Import useEffect
import { registerForPushNotificationsAsync } from '../lib/notifications';
import { supabase, getUserProfile } from '../lib/supabase'; // Import getUserProfile

const AuthContext = createContext({
  isLoggedIn: false,
  role: 'user',
  teamId: null as string | null,
  login: (role?: string, teamId?: string | null) => {},
  logout: () => {},
  enrolledCourses: [] as string[],
  completedCourses: [] as string[],
  enrollCourse: (id: string) => {},
  completeCourse: (id: string) => {},
  expoPushToken: null as string | null,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState('user');
  const [teamId, setTeamId] = useState<string | null>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([]);
  const [completedCourses, setCompletedCourses] = useState<string[]>([]);
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);

  const setupPushNotifications = async (userId: string) => {
    const token = await registerForPushNotificationsAsync();
    if (token) {
      setExpoPushToken(token);
      // Simpan token ke Supabase
      const { error } = await supabase
        .from('user_profiles')
        .update({ push_token: token })
        .eq('user_id', userId);
      if (error) console.error('Failed to save push token to Supabase:', error);
    }
  };

  // Fungsi untuk memuat sesi pengguna dan profilnya
  const loadUserSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const { user } = session;
      // Ambil profil lengkap dari tabel user_profiles
      const dbProfile = await getUserProfile(user.id).catch(() => null);

      if (dbProfile) {
        setIsLoggedIn(true);
        setRole(dbProfile.role || 'user');
        setTeamId(dbProfile.team_id || null);
        // Anda bisa memuat enrolledCourses/completedCourses dari dbProfile di sini jika ada
        // setEnrolledCourses(dbProfile.enrolled_courses || []);
        // setCompletedCourses(dbProfile.completed_courses || []);
        setupPushNotifications(user.id);
      } else {
        // Sesi ada tapi profil belum lengkap (misal: baru daftar tapi belum buat profil)
        setIsLoggedIn(true);
        setRole('user'); // Default role jika profil tidak ditemukan
        setTeamId(null);
        setupPushNotifications(user.id);
      }
    } else {
      // Tidak ada sesi yang tersimpan
      setIsLoggedIn(false);
      setRole('user');
      setTeamId(null);
      setEnrolledCourses([]);
      setCompletedCourses([]);
      setExpoPushToken(null);
    }
  };

  // Effect untuk memeriksa sesi saat aplikasi dimulai
  useEffect(() => {
    loadUserSession();

    // Listener untuk perubahan status autentikasi (misal: logout dari tab lain, token refresh)
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (_event === 'SIGNED_IN' || _event === 'SIGNED_OUT' || _event === 'TOKEN_REFRESHED') {
        loadUserSession(); // Muat ulang sesi jika ada perubahan
      }
    });

    return () => {
      authListener?.unsubscribe(); // Bersihkan listener saat komponen unmount
    };
  }, []); // Hanya dijalankan sekali saat mount

  const login = () => { // Fungsi login sekarang hanya memicu pemuatan sesi
    setIsLoggedIn(true);
    loadUserSession(); // Panggil untuk memuat data sesi dan profil terbaru
  };
  
  const logout = async () => { // Jadikan async untuk memanggil signOut Supabase
    await supabase.auth.signOut(); // Hapus sesi dari Supabase
    setIsLoggedIn(false);
    setRole('user');
    setTeamId(null);
    setEnrolledCourses([]); // Reset kursus saat logout
    setCompletedCourses([]); // Reset status lulus
    setExpoPushToken(null);
  };

  const enrollCourse = (id: string) => {
    if (!enrolledCourses.includes(id)) {
      setEnrolledCourses([...enrolledCourses, id]);
    }
  };

  const completeCourse = (id: string) => {
    if (!completedCourses.includes(id)) {
      setCompletedCourses([...completedCourses, id]);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, role, teamId, login, logout, enrolledCourses, completedCourses, enrollCourse, completeCourse, expoPushToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);