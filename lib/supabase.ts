import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage as any,
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