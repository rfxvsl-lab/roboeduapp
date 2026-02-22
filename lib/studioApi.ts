import { supabase } from './supabase';

/**
 * Mengambil daftar project berdasarkan role dan tim
 */
export const fetchStudioProjects = async (teamId?: string | null, role?: string) => {
  try {
    let query = supabase.from('studio_projects').select('*').order('created_at', { ascending: false });

    // Filter berdasarkan tim jika bukan admin/supervisor
    if (teamId && role !== 'super_admin' && role !== 'supervisor') {
      query = query.eq('team_id', teamId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

/**
 * Mengambil satu project spesifik berdasarkan ID
 */
export const fetchProjectById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('studio_projects')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

/**
 * Membuat project baru
 */
export const createProject = async (projectData: any) => {
  try {
    const { data, error } = await supabase.from('studio_projects').insert([projectData]).select();
    if (error) throw error;
    return { data: data[0], error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

/**
 * Memperbarui data project (progress, tasks, approval, dll)
 */
export const updateProject = async (id: string, updateData: any) => {
  try {
    const { data, error } = await supabase.from('studio_projects').update(updateData).eq('id', id).select();
    if (error) throw error;
    return { data: data[0], error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

/**
 * Mengambil satu anggota tim secara acak untuk Spotlight di halaman Home
 */
export const getRandomSpotlightUser = async () => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .neq('role', 'user');

    if (error) throw error;
    if (!data || data.length === 0) return null;

    const randomUser = data[Math.floor(Math.random() * data.length)];
    return randomUser;
  } catch (error: any) {
    console.error('Error fetching spotlight user:', error.message);
    return null;
  }
};

/**
 * Mengambil semua highlight (banner)
 */
export const fetchHighlights = async () => {
  try {
    const { data, error } = await supabase
      .from('highlights')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

/**
 * Menambahkan highlight baru
 */
export const addHighlight = async (imageUrl: string) => {
  try {
    const { data, error } = await supabase
      .from('highlights')
      .insert([{ image_url: imageUrl }])
      .select();
    if (error) throw error;
    return { data: data[0], error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

/**
 * Mengambil semua berita
 */
export const fetchNews = async () => {
  try {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .order('published_date', { ascending: false });
    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

/**
 * Menambahkan batch berita baru
 */
export const addNewsBatch = async (newsItems: any[]) => {
  try {
    const { data, error } = await supabase.from('news').insert(newsItems).select();
    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};