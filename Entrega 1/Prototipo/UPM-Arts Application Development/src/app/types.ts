// Tipos de usuarios
export type UserRole = 'participant' | 'instructor' | 'admin';
export type ParticipantType = 'student' | 'staff' | 'external';
export type Discipline = 'music' | 'painting' | 'theater';

// Usuario base
export interface BaseUser {
  id: string;
  email: string;
  password: string; // Cifrada
  username: string;
  fullName: string;
  role: UserRole;
}

// Participante
export interface Participant extends BaseUser {
  role: 'participant';
  type: ParticipantType;
  dni: string;
  creditCard: string;
  studentId?: string; // Solo para estudiantes
  yearsOfService?: number; // Solo para personal
  preferences: {
    discipline: Discipline;
    level: number; // 1-10
  }[];
}

// Instructor
export interface Instructor extends BaseUser {
  role: 'instructor';
  dni: string;
  iban: string;
}

// Administrador
export interface Administrator extends BaseUser {
  role: 'admin';
  phone: string;
}

export type User = Participant | Instructor | Administrator;

// Espacios
export type SpaceType = 'music_room' | 'painting_workshop' | 'theater_auditorium';

export interface Equipment {
  id: string;
  serialNumber: string;
  acquisitionYear: number;
  description: string;
}

export interface Space {
  id: string;
  name: string;
  type: SpaceType;
  surface: number; // m²
  maxCapacity: number;
  equipment: Equipment[];
}

// Actividades
export interface Session {
  id: string;
  date: Date;
  startTime: string;
  endTime: string;
  spaceId: string;
  capacity: number;
  discipline: Discipline;
  type: 'free' | 'course';
  courseId?: string;
  participants: {
    userId: string;
    enrollmentDate: Date;
  }[];
}

export interface Course {
  id: string;
  name: string;
  discipline: Discipline;
  instructorId: string;
  sessions: string[]; // IDs de sesiones
  description: string;
  price: number;
}

// Asociaciones
export interface Association {
  id: string;
  name: string;
  mainDiscipline: Discipline;
  members: string[]; // IDs de participantes
  createdBy: string; // ID del administrador
  createdDate: Date;
  reservations: Reservation[];
}

export interface Reservation {
  id: string;
  associationId: string;
  spaceId: string;
  date: Date;
  startTime: string;
  endTime: string;
  createdBy: string; // ID del miembro que hizo la reserva
}

// Contexto de autenticación
export interface AuthContextType {
  user: User | null;
  users: User[];
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}