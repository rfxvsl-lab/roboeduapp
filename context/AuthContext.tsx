import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext({
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
  enrolledCourses: [] as string[],
  enrollCourse: (id: string) => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([]);

  const login = () => setIsLoggedIn(true);
  
  const logout = () => {
    setIsLoggedIn(false);
    setEnrolledCourses([]); // Reset kursus saat logout
  };

  const enrollCourse = (id: string) => {
    if (!enrolledCourses.includes(id)) {
      setEnrolledCourses([...enrolledCourses, id]);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, enrolledCourses, enrollCourse }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);