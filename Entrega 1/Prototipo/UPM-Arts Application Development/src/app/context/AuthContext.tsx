import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, AuthContextType, Participant, Instructor, Administrator, ParticipantType } from '../types';
import { mockUsers } from '../data/mockData';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_KEY = 'upm_arts_users';
const SESSION_KEY = 'upm_arts_session';

// ─── Utilidades de persistencia ────────────────────────────────────────────────

function loadUsers(): User[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (raw) return JSON.parse(raw) as User[];
  } catch {}
  // Primera carga: persiste los usuarios de ejemplo
  const initial = [...mockUsers];
  localStorage.setItem(USERS_KEY, JSON.stringify(initial));
  return initial;
}

function saveUsers(users: User[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function loadSession(): User | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw) return JSON.parse(raw) as User;
  } catch {}
  return null;
}

// ─── Detección de tipo de usuario por dominio de email ────────────────────────
// @alumnos.upm.es → estudiante UPM (25 % descuento)
// @upm.es o *.upm.es (otros subdominios: @fi.upm.es, @etsii.upm.es…) → personal UPM (25 %+)
// Cualquier otro → externo (sin descuento)

export function detectParticipantType(email: string): ParticipantType {
  const lower = email.toLowerCase();
  if (lower.endsWith('@alumnos.upm.es') || lower.includes('@alumnos.')) {
    // e.g. @alumnos.upm.es
    if (lower.includes('upm.es')) return 'student';
  }
  // Resto de dominios UPM (incluye @upm.es, @fi.upm.es, @etsii.upm.es, …)
  if (lower.endsWith('@upm.es') || lower.includes('.upm.es')) return 'staff';
  return 'external';
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => loadSession());
  const [users, setUsers] = useState<User[]>(() => loadUsers());

  const login = async (email: string, password: string) => {
    const currentUsers = loadUsers();
    const foundUser = currentUsers.find(u => u.email === email);

    if (!foundUser) {
      throw new Error('Usuario no encontrado');
    }
    if (foundUser.password !== password) {
      throw new Error('Contraseña incorrecta');
    }

    localStorage.setItem(SESSION_KEY, JSON.stringify(foundUser));
    setUser(foundUser);
  };

  const register = async (data: any) => {
    const currentUsers = loadUsers();

    // Comprobar duplicados
    if (currentUsers.find(u => u.email === data.email)) {
      throw new Error('Ya existe una cuenta con ese correo electrónico');
    }
    if (currentUsers.find(u => u.username === data.username)) {
      throw new Error('El nombre de usuario ya está en uso');
    }

    const participantType = detectParticipantType(data.email);

    const newParticipant: Participant = {
      id: `user-${Date.now()}`,
      email: data.email,
      password: data.password, // En producción, cifrar
      username: data.username,
      fullName: data.fullName,
      role: 'participant',
      type: participantType,
      dni: data.dni,
      creditCard: data.creditCard,
      studentId: participantType === 'student' ? data.studentId : undefined,
      yearsOfService: participantType === 'staff' && data.yearsOfService
        ? parseInt(data.yearsOfService)
        : undefined,
      preferences: data.preferences || [],
    };

    const updatedUsers = [...currentUsers, newParticipant];
    saveUsers(updatedUsers);
    setUsers(updatedUsers);
    localStorage.setItem(SESSION_KEY, JSON.stringify(newParticipant));
    setUser(newParticipant);
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  const updateUser = (updatedData: Partial<User>) => {
    if (!user) return;
    const merged = { ...user, ...updatedData } as User;

    // Actualizar sesión activa
    localStorage.setItem(SESSION_KEY, JSON.stringify(merged));
    setUser(merged);

    // Actualizar en la lista de usuarios
    const currentUsers = loadUsers();
    const idx = currentUsers.findIndex(u => u.id === user.id);
    if (idx !== -1) {
      currentUsers[idx] = merged;
      saveUsers(currentUsers);
      setUsers([...currentUsers]);
    }
  };

  return (
    <AuthContext.Provider value={{ user, users, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}