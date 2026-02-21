import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import 'react-native-url-polyfill/auto';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

// Create a custom storage object that is safe for Server-Side Rendering (SSR)
// This prevents "ReferenceError: window is not defined" when running in Node.js environments
const supabaseStorage = {
  getItem: (key: string) => {
    if (Platform.OS === 'web' && typeof window === 'undefined') {
      return null;
    }
    return AsyncStorage.getItem(key);
  },
  setItem: (key: string, value: string) => {
    if (Platform.OS === 'web' && typeof window === 'undefined') {
      return;
    }
    return AsyncStorage.setItem(key, value);
  },
  removeItem: (key: string) => {
    if (Platform.OS === 'web' && typeof window === 'undefined') {
      return;
    }
    return AsyncStorage.removeItem(key);
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: supabaseStorage as any,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Fungsi untuk mendaftarkan user baru
export const createUser = async (email: string, password: string, name: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
      },
    },
  });
  if (error) throw error;
  return data.user;
};

// Fungsi untuk login
export const loginUser = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data.session;
};

// Membuat dokumen profil baru di tabel user_profiles
export const createUserProfile = async (userId: string, name: string, email: string) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .insert([
      { 
        user_id: userId, 
        name, 
        email,
        bio: 'Robotic Enthusiast',
        institution: 'RoboEdu Academy',
        role: email === 'hilal.alhamdi22@gmail.com' ? 'admin' : 'user'
      },
    ])
    .select();
  if (error) throw error;
  return data[0];
};

// Mengambil profil berdasarkan userId
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();
  if (error) throw error;
  return data;
};

// --- COURSES FUNCTIONS ---

// Mengambil semua kursus
export const getAllCourses = async () => {
  const { data, error } = await supabase
    .from('courses')
    .select('*');
  if (error) throw error;
  return data;
};

// Mengambil kursus berdasarkan ID
export const getCourseById = async (courseId: string) => {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('id', courseId)
    .single();
  if (error) throw error;
  return data;
};

// Tambah atau Update Kursus
export const upsertCourse = async (course: any) => {
  const { data, error } = await supabase
    .from('courses')
    .upsert([course])
    .select();
  if (error) throw error;
  return data[0];
};

// Hapus Kursus
export const deleteCourse = async (id: string) => {
  const { error } = await supabase.from('courses').delete().eq('id', id);
  if (error) throw error;
};

// --- HARDWARE FUNCTIONS ---

// Mengambil semua hardware
export const getAllHardware = async () => {
  const { data, error } = await supabase
    .from('hardware')
    .select('*');
  if (error) throw error;
  return data;
};

// Mengambil hardware berdasarkan ID
export const getHardwareById = async (hardwareId: string) => {
  const { data, error } = await supabase
    .from('hardware')
    .select('*')
    .eq('id', hardwareId)
    .single();
  if (error) throw error;
  return data;
};

// Tambah atau Update Hardware
export const upsertHardware = async (item: any) => {
  const { data, error } = await supabase
    .from('hardware')
    .upsert([item])
    .select();
  if (error) throw error;
  return data[0];
};

// Hapus Hardware
export const deleteHardware = async (id: string) => {
  const { error } = await supabase.from('hardware').delete().eq('id', id);
  if (error) throw error;
};

// --- ADMIN PANEL FUNCTIONS ---

// Mengambil jumlah total user
export const getUsersCount = async () => {
  const { count, error } = await supabase
    .from('user_profiles')
    .select('*', { count: 'exact', head: true });
  if (error) throw error;
  return count;
};

// Mengambil semua user profiles
export const getAllUsers = async () => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

// Update Role User
export const updateUserRole = async (userId: string, role: string) => {
  const { error } = await supabase.from('user_profiles').update({ role }).eq('user_id', userId);
  if (error) throw error;
};

// Mengambil jumlah total kursus
export const getCoursesCount = async () => {
  const { count, error } = await supabase
    .from('courses')
    .select('*', { count: 'exact', head: true });
  if (error) throw error;
  return count;
};

// Mengambil jumlah total hardware
export const getHardwareCount = async () => {
  const { count, error } = await supabase
    .from('hardware')
    .select('*', { count: 'exact', head: true });
  if (error) throw error;
  return count;
};