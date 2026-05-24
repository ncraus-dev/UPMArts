import { User, Space, Session, Course, Association, Participant, Instructor, Administrator, Equipment } from '../types';

// Usuarios de ejemplo
export const mockUsers: User[] = [
  {
    id: 'admin-1',
    email: 'admin@upm.es',
    password: 'Admin123456!',
    username: 'adminupm',
    fullName: 'María García López',
    role: 'admin',
    phone: '+34 910 671 000',
  } as Administrator,
  {
    id: 'instructor-1',
    email: 'carlos.music@upm.es',
    password: 'Music123456!',
    username: 'carlosmusic',
    fullName: 'Carlos Martínez Sanz',
    role: 'instructor',
    dni: '12345678A',
    iban: 'ES91 2100 0418 4502 0005 1332',
  } as Instructor,
  {
    id: 'instructor-2',
    email: 'laura.painting@upm.es',
    password: 'Paint123456!',
    username: 'laurapainting',
    fullName: 'Laura Rodríguez Pérez',
    role: 'instructor',
    dni: '87654321B',
    iban: 'ES79 2100 0813 6101 2345 6789',
  } as Instructor,
  {
    id: 'participant-1',
    email: 'juan.lopez@alumnos.upm.es',
    password: 'Student123456!',
    username: 'juanlopez',
    fullName: 'Juan López García',
    role: 'participant',
    type: 'student',
    dni: '11111111C',
    creditCard: '4532 **** **** 1234',
    studentId: 'A201234567',
    preferences: [
      { discipline: 'music', level: 7 },
      { discipline: 'theater', level: 5 },
    ],
  } as Participant,
  {
    id: 'participant-2',
    email: 'ana.fernandez@upm.es',
    password: 'Staff123456!',
    username: 'anafernandez',
    fullName: 'Ana Fernández Ruiz',
    role: 'participant',
    type: 'staff',
    dni: '22222222D',
    creditCard: '5425 **** **** 5678',
    yearsOfService: 10,
    preferences: [
      { discipline: 'painting', level: 8 },
    ],
  } as Participant,
  {
    id: 'participant-3',
    email: 'pedro.sanchez@gmail.com',
    password: 'External123456!',
    username: 'pedrosanchez',
    fullName: 'Pedro Sánchez Gómez',
    role: 'participant',
    type: 'external',
    dni: '33333333E',
    creditCard: '4916 **** **** 9012',
    preferences: [
      { discipline: 'theater', level: 6 },
    ],
  } as Participant,
];

// Equipamiento
const mockEquipment: Equipment[] = [
  {
    id: 'eq-1',
    serialNumber: 'PIANO-2020-001',
    acquisitionYear: 2020,
    description: 'Piano de cola Yamaha C3X',
  },
  {
    id: 'eq-2',
    serialNumber: 'PROJ-2021-002',
    acquisitionYear: 2021,
    description: 'Proyector 4K Epson',
  },
  {
    id: 'eq-3',
    serialNumber: 'CAB-2019-003',
    acquisitionYear: 2019,
    description: 'Set de 20 caballetes profesionales',
  },
];

// Espacios
export const mockSpaces: Space[] = [
  {
    id: 'space-1',
    name: 'Aula de Música 1',
    type: 'music_room',
    surface: 50,
    maxCapacity: 20,
    equipment: [mockEquipment[0]],
  },
  {
    id: 'space-2',
    name: 'Taller de Pintura',
    type: 'painting_workshop',
    surface: 80,
    maxCapacity: 30,
    equipment: [mockEquipment[2]],
  },
  {
    id: 'space-3',
    name: 'Auditorio Principal',
    type: 'theater_auditorium',
    surface: 200,
    maxCapacity: 100,
    equipment: [mockEquipment[1]],
  },
  {
    id: 'space-4',
    name: 'Aula de Música 2',
    type: 'music_room',
    surface: 45,
    maxCapacity: 15,
    equipment: [],
  },
];

// Sesiones
export const mockSessions: Session[] = [
  {
    id: 'session-1',
    date: new Date('2026-03-01'),
    startTime: '10:00',
    endTime: '12:00',
    spaceId: 'space-1',
    capacity: 20,
    discipline: 'music',
    type: 'free',
    participants: [
      { userId: 'participant-1', enrollmentDate: new Date('2026-02-20') },
    ],
  },
  {
    id: 'session-2',
    date: new Date('2026-03-05'),
    startTime: '16:00',
    endTime: '18:00',
    spaceId: 'space-2',
    capacity: 25,
    discipline: 'painting',
    type: 'course',
    courseId: 'course-1',
    participants: [
      { userId: 'participant-2', enrollmentDate: new Date('2026-02-15') },
    ],
  },
  {
    id: 'session-3',
    date: new Date('2026-03-08'),
    startTime: '18:00',
    endTime: '20:00',
    spaceId: 'space-3',
    capacity: 30,
    discipline: 'theater',
    type: 'free',
    participants: [
      { userId: 'participant-3', enrollmentDate: new Date('2026-02-25') },
    ],
  },
];

// Cursos
export const mockCourses: Course[] = [
  {
    id: 'course-1',
    name: 'Introducción a la Pintura al Óleo',
    discipline: 'painting',
    instructorId: 'instructor-2',
    sessions: ['session-2'],
    description: 'Curso básico de técnicas de pintura al óleo para principiantes',
    price: 120,
  },
  {
    id: 'course-2',
    name: 'Interpretación Teatral',
    discipline: 'theater',
    instructorId: 'instructor-1',
    sessions: [],
    description: 'Desarrollo de habilidades de actuación y expresión escénica',
    price: 150,
  },
];

// Asociaciones
export const mockAssociations: Association[] = [
  {
    id: 'assoc-1',
    name: 'Club de Teatro UPM',
    mainDiscipline: 'theater',
    members: ['participant-1', 'participant-3'],
    createdBy: 'admin-1',
    createdDate: new Date('2026-01-15'),
    reservations: [],
  },
  {
    id: 'assoc-2',
    name: 'Banda de Rock Politécnica',
    mainDiscipline: 'music',
    members: ['participant-1', 'participant-2'],
    createdBy: 'admin-1',
    createdDate: new Date('2026-01-20'),
    reservations: [],
  },
];

// Funciones de utilidad para cálculo de descuentos
export function calculateDiscount(participant: Participant): number {
  if (participant.type === 'external') {
    return 0;
  }
  
  if (participant.type === 'student') {
    return 25;
  }
  
  if (participant.type === 'staff') {
    const baseDiscount = 25;
    const yearsDiscount = (participant.yearsOfService || 0) * 3;
    return Math.min(baseDiscount + yearsDiscount, 50);
  }
  
  return 0;
}

export function calculatePrice(basePrice: number, participant: Participant): number {
  const discount = calculateDiscount(participant);
  return basePrice * (1 - discount / 100);
}
