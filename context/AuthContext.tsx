import React, { createContext, useContext, useState } from 'react';

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
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState('user');
  const [teamId, setTeamId] = useState<string | null>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([]);
  const [completedCourses, setCompletedCourses] = useState<string[]>([]);

  const login = (userRole: string = 'user', userTeamId: string | null = null) => {
    setIsLoggedIn(true);
    setRole(userRole);
    setTeamId(userTeamId);
  };
  
  const logout = () => {
    setIsLoggedIn(false);
    setRole('user');
    setTeamId(null);
    setEnrolledCourses([]); // Reset kursus saat logout
    setCompletedCourses([]); // Reset status lulus
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
    <AuthContext.Provider value={{ isLoggedIn, role, teamId, login, logout, enrolledCourses, completedCourses, enrollCourse, completeCourse }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);