import React, { createContext, useContext, useState } from 'react';
import { registerForPushNotificationsAsync } from '../lib/notifications';
import { supabase } from '../lib/supabase';

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

  const login = (userRole: string = 'user', userTeamId: string | null = null) => {
    setIsLoggedIn(true);
    setRole(userRole);
    setTeamId(userTeamId);
    // Panggil setupPushNotifications setelah login dan user ID tersedia
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setupPushNotifications(user.id);
      }
    });
  };
  
  const logout = () => {
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