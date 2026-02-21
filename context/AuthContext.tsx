import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext({
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
  enrolledCourses: [] as string[],
  completedCourses: [] as string[],
  enrollCourse: (id: string) => {},
  completeCourse: (id: string) => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([]);
  const [completedCourses, setCompletedCourses] = useState<string[]>([]);

  const login = () => setIsLoggedIn(true);
  
  const logout = () => {
    setIsLoggedIn(false);
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
    <AuthContext.Provider value={{ isLoggedIn, login, logout, enrolledCourses, completedCourses, enrollCourse, completeCourse }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);