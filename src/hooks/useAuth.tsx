import { useState, useEffect, createContext, useContext, type ReactNode } from 'react';
import type { Student, AuthState } from '@/types';

interface AuthContextType extends AuthState {
  isLoading: boolean;
  login: (matricNumber: string, password: string) => Promise<boolean>;
  signup: (studentData: Partial<Student>, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (user: Student) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    role: 'student'
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('lcu_user');
    const storedAuth = localStorage.getItem('lcu_auth');
    if (storedUser && storedAuth) {
      setAuthState({
        isAuthenticated: true,
        user: JSON.parse(storedUser),
        role: 'student'
      });
    }
    setIsLoading(false);
  }, []);

  const login = async (matricNumber: string, password: string): Promise<boolean> => {
    const storedUsers = JSON.parse(localStorage.getItem('lcu_users') || '[]');
    const user = storedUsers.find((u: Student & { password: string }) => 
      u.matricNumber.toLowerCase() === matricNumber.toLowerCase()
    );
    
    if (user && user.password === password) {
      const { password: _, ...userWithoutPassword } = user;
      setAuthState({
        isAuthenticated: true,
        user: userWithoutPassword,
        role: 'student'
      });
      localStorage.setItem('lcu_user', JSON.stringify(userWithoutPassword));
      localStorage.setItem('lcu_auth', 'true');
      return true;
    }
    return false;
  };

  const signup = async (studentData: Partial<Student>, password: string): Promise<boolean> => {
    const storedUsers = JSON.parse(localStorage.getItem('lcu_users') || '[]');
    
    const exists = storedUsers.some((u: Student) => 
      u.matricNumber.toLowerCase() === studentData.matricNumber?.toLowerCase()
    );
    
    if (exists) {
      return false;
    }

    const newUser: Student & { password: string } = {
      id: Date.now().toString(),
      matricNumber: studentData.matricNumber || '',
      firstName: studentData.firstName || '',
      lastName: studentData.lastName || '',
      email: studentData.email || '',
      department: studentData.department || '',
      faculty: studentData.faculty || '',
      yearOfAdmission: studentData.yearOfAdmission || 0,
      phoneNumber: studentData.phoneNumber || '',
      password,
    };

    storedUsers.push(newUser);
    localStorage.setItem('lcu_users', JSON.stringify(storedUsers));

    const { password: _, ...userWithoutPassword } = newUser;
    setAuthState({
      isAuthenticated: true,
      user: userWithoutPassword,
      role: 'student'
    });
    localStorage.setItem('lcu_user', JSON.stringify(userWithoutPassword));
    localStorage.setItem('lcu_auth', 'true');

    const clearances = JSON.parse(localStorage.getItem('lcu_clearances') || '[]');
    clearances.push({
      id: Date.now().toString(),
      studentId: newUser.id,
      library: { status: 'not_started' },
      bursary: { status: 'not_started' },
      studentAffairs: { status: 'not_started' },
      department: { status: 'not_started' },
      faculty: { status: 'not_started' },
      alumni: { status: 'not_started' },
      overallStatus: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    localStorage.setItem('lcu_clearances', JSON.stringify(clearances));

    return true;
  };

  const logout = () => {
    setAuthState({
      isAuthenticated: false,
      user: null,
      role: 'student'
    });
    localStorage.removeItem('lcu_user');
    localStorage.removeItem('lcu_auth');
  };

  const updateUser = (user: Student) => {
    setAuthState(prev => ({ ...prev, user }));
    localStorage.setItem('lcu_user', JSON.stringify(user));
  };

  return (
    <AuthContext.Provider value={{ ...authState, isLoading, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
