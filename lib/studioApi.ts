import { supabase } from './supabase';

/**
 * Mengambil daftar project berdasarkan role dan tim
 */
export const fetchStudioProjects = async (teamId?: string | null, role?: string) => {
  try {
    let query = supabase.from('studio_projects').select('*').order('created_at', { ascending: false });

    // Filter berdasarkan tim jika bukan admin/supervisor
    if (teamId && role !== 'super_admin' && role !== 'supervisor' && role !== 'admin') {
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