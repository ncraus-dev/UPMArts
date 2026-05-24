import React, { useState } from 'react';
import {
  Calendar, Music, Palette, Theater, Users, LogOut,
  User, CreditCard, Settings, CheckCircle, Pencil, Save, X,
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useAuth } from '../context/AuthContext';
import { Participant, Discipline } from '../types';
import { mockSessions, mockCourses, mockAssociations, mockSpaces, calculateDiscount, calculatePrice } from '../data/mockData';
import { toast } from 'sonner';

const DISCIPLINE_LABELS: Record<Discipline, string> = {
  music: '🎵 Música',
  painting: '🎨 Pintura',
  theater: '🎭 Teatro',
};

export function ParticipantDashboard() {
  const { user, logout, updateUser } = useAuth();
  const participant = user as Participant;
  const [activeTab, setActiveTab] = useState('sessions');

  // ─── Estado de edición de preferencias ──────────────────────────────────────
  const [editingPrefs, setEditingPrefs] = useState(false);
  const [draftPrefs, setDraftPrefs] = useState(participant.preferences);

  const discount = calculateDiscount(participant);
  const isUPMMember = participant.type !== 'external';

  // ─── Datos ─────────────────────────────────────────────────────────────────
  const availableSessions = mockSessions.filter(s => s.type === 'free');
  const enrolledSessions  = mockSessions.filter(s =>
    s.participants.some(p => p.userId === participant.id),
  );

  const availableCourses = isUPMMember ? mockCourses : [];
  const enrolledCourses  = availableCourses.filter(c =>
    c.sessions.some(sid =>
      mockSessions.find(s => s.id === sid)?.participants.some(p => p.userId === participant.id),
    ),
  );

  const myAssociations = mockAssociations.filter(a => a.members.includes(participant.id));

  // ─── Handlers generales ────────────────────────────────────────────────────
  const handleEnrollSession = () => toast.success('Te has inscrito a la sesión de trabajo libre');

  const handleEnrollCourse = (courseId: string) => {
    const course = mockCourses.find(c => c.id === courseId);
    if (course) {
      const finalPrice = calculatePrice(course.price, participant);
      toast.success(`Inscrito al curso. Precio con descuento: ${finalPrice.toFixed(2)} €`);
    }
  };

  // ─── Handlers de preferencias ──────────────────────────────────────────────
  const startEditPrefs = () => {
    setDraftPrefs([...participant.preferences]);
    setEditingPrefs(true);
  };

  const cancelEditPrefs = () => {
    setDraftPrefs([...participant.preferences]);
    setEditingPrefs(false);
  };

  const savePrefs = () => {
    updateUser({ preferences: draftPrefs } as Partial<Participant>);
    setEditingPrefs(false);
    toast.success('Preferencias actualizadas');
  };

  const toggleDraftDiscipline = (discipline: Discipline) => {
    const exists = draftPrefs.find(p => p.discipline === discipline);
    if (exists) {
      setDraftPrefs(draftPrefs.filter(p => p.discipline !== discipline));
    } else {
      setDraftPrefs([...draftPrefs, { discipline, level: 5 }]);
    }
  };

  const updateDraftLevel = (discipline: Discipline, level: number) => {
    setDraftPrefs(draftPrefs.map(p => p.discipline === discipline ? { ...p, level } : p));
  };

  const getDisciplineIcon = (discipline: string) => {
    switch (discipline) {
      case 'music':   return <Music   className="h-4 w-4" />;
      case 'painting':return <Palette className="h-4 w-4" />;
      case 'theater': return <Theater className="h-4 w-4" />;
      default: return null;
    }
  };

  const typeLabel: Record<string, string> = {
    student: 'Estudiante UPM',
    staff:   'Personal UPM',
    external:'Usuario Externo',
  };

  return (
    <div className="min-h-screen bg-secondary/30">

      {/* ── Header ── */}
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 px-3 py-1 rounded">
                <span className="font-semibold">UPM</span>
              </div>
              <div>
                <h2 className="text-lg">Centro de Creación Cultural</h2>
                <p className="text-sm text-primary-foreground/80">Ars longa, vita brevis</p>
              </div>
            </div>
            <Button variant="secondary" size="sm" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar sesión
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">

        {/* ── Tarjeta resumen del usuario ── */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>{participant.fullName}</CardTitle>
                  <CardDescription>@{participant.username} · {participant.email}</CardDescription>
                </div>
              </div>
              <div className="text-right shrink-0">
                <Badge variant={isUPMMember ? 'default' : 'secondary'}>
                  {typeLabel[participant.type]}
                </Badge>
                {discount > 0 && (
                  <p className="text-sm text-muted-foreground mt-2">
                    <CreditCard className="inline h-4 w-4 mr-1" />
                    Descuento: {discount}%
                  </p>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              {participant.studentId && (
                <div>
                  <p className="text-muted-foreground">Matrícula</p>
                  <p className="font-medium">{participant.studentId}</p>
                </div>
              )}
              {participant.yearsOfService !== undefined && (
                <div>
                  <p className="text-muted-foreground">Antigüedad</p>
                  <p className="font-medium">{participant.yearsOfService} años</p>
                </div>
              )}
              <div>
                <p className="text-muted-foreground">Asociaciones</p>
                <p className="font-medium">{myAssociations.length}/3</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── Tabs principales ── */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className={`grid w-full mb-6 ${isUPMMember ? 'grid-cols-5' : 'grid-cols-4'}`}>
            <TabsTrigger value="sessions">
              <Calendar className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Sesiones</span>
            </TabsTrigger>
            {isUPMMember && (
              <TabsTrigger value="courses">
                <Theater className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Cursos</span>
              </TabsTrigger>
            )}
            <TabsTrigger value="associations">
              <Users className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Asociaciones</span>
            </TabsTrigger>
            <TabsTrigger value="enrolled">
              <CheckCircle className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Inscritos</span>
            </TabsTrigger>
            <TabsTrigger value="profile">
              <Settings className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Mi Perfil</span>
            </TabsTrigger>
          </TabsList>

          {/* ── Sesiones de trabajo libre ── */}
          <TabsContent value="sessions" className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Sesiones de trabajo libre disponibles</h3>
              <p className="text-sm text-muted-foreground">
                Sesiones abiertas para todos los usuarios. No requieren instructor.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableSessions.map(session => {
                const space      = mockSpaces.find(s => s.id === session.spaceId);
                const isEnrolled = session.participants.some(p => p.userId === participant.id);
                const isFull     = session.participants.length >= session.capacity;
                return (
                  <Card key={session.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getDisciplineIcon(session.discipline)}
                          <CardTitle className="text-base capitalize">{session.discipline}</CardTitle>
                        </div>
                        {isEnrolled && <Badge>Inscrito</Badge>}
                      </div>
                      <CardDescription>{space?.name}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-1 text-sm">
                        <p><strong>Fecha:</strong> {new Date(session.date).toLocaleDateString('es-ES')}</p>
                        <p><strong>Horario:</strong> {session.startTime} – {session.endTime}</p>
                        <p><strong>Plazas:</strong> {session.participants.length}/{session.capacity}</p>
                      </div>
                      {!isEnrolled && (
                        <Button className="w-full" size="sm" disabled={isFull} onClick={handleEnrollSession}>
                          {isFull ? 'Completo' : 'Inscribirse'}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* ── Cursos (solo UPM) ── */}
          {isUPMMember && (
            <TabsContent value="courses" className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Cursos disponibles</h3>
                <p className="text-sm text-muted-foreground">
                  Cursos exclusivos para la comunidad UPM con instructor asignado.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableCourses.map(course => {
                  const isEnrolled = enrolledCourses.some(c => c.id === course.id);
                  const finalPrice = calculatePrice(course.price, participant);
                  return (
                    <Card key={course.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getDisciplineIcon(course.discipline)}
                            <CardTitle className="text-base">{course.name}</CardTitle>
                          </div>
                          {isEnrolled && <Badge>Inscrito</Badge>}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-muted-foreground">{course.description}</p>
                        <div className="space-y-1 text-sm">
                          <p><strong>Sesiones:</strong> {course.sessions.length}</p>
                          <p><strong>Precio original:</strong> {course.price} €</p>
                          {discount > 0 && (
                            <p className="text-emerald-600">
                              <strong>Precio con descuento ({discount}%):</strong> {finalPrice.toFixed(2)} €
                            </p>
                          )}
                        </div>
                        {!isEnrolled && (
                          <Button className="w-full" size="sm" onClick={() => handleEnrollCourse(course.id)}>
                            Inscribirse
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          )}

          {/* ── Asociaciones ── */}
          <TabsContent value="associations" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Mis asociaciones</h3>
                <p className="text-sm text-muted-foreground">Puedes pertenecer a un máximo de 3 asociaciones</p>
              </div>
              <Badge variant="outline">{myAssociations.length}/3</Badge>
            </div>

            {myAssociations.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No perteneces a ninguna asociación todavía
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myAssociations.map(association => (
                  <Card key={association.id}>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        {getDisciplineIcon(association.mainDiscipline)}
                        <CardTitle className="text-base">{association.name}</CardTitle>
                      </div>
                      <CardDescription className="capitalize">{association.mainDiscipline}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <p><strong>Miembros:</strong> {association.members.length}</p>
                      <p><strong>Creada:</strong> {new Date(association.createdDate).toLocaleDateString('es-ES')}</p>
                      <p><strong>Reservas activas:</strong> {association.reservations.length}/6</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* ── Mis inscripciones ── */}
          <TabsContent value="enrolled" className="space-y-4">
            <h3 className="text-lg font-medium">Mis inscripciones</h3>

            {enrolledSessions.length === 0 && enrolledCourses.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No tienes inscripciones activas
                </CardContent>
              </Card>
            ) : (
              <>
                {enrolledSessions.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-3">Sesiones de trabajo libre</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {enrolledSessions.map(session => {
                        const space      = mockSpaces.find(s => s.id === session.spaceId);
                        const enrollment = session.participants.find(p => p.userId === participant.id);
                        return (
                          <Card key={session.id}>
                            <CardHeader>
                              <div className="flex items-center gap-2">
                                {getDisciplineIcon(session.discipline)}
                                <CardTitle className="text-base capitalize">{session.discipline}</CardTitle>
                              </div>
                              <CardDescription>{space?.name}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                              <p><strong>Fecha:</strong> {new Date(session.date).toLocaleDateString('es-ES')}</p>
                              <p><strong>Horario:</strong> {session.startTime} – {session.endTime}</p>
                              <p className="text-muted-foreground text-xs">
                                Inscrito el {enrollment?.enrollmentDate
                                  ? new Date(enrollment.enrollmentDate).toLocaleDateString('es-ES')
                                  : '—'}
                              </p>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                )}

                {enrolledCourses.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium mb-3">Cursos</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {enrolledCourses.map(course => (
                        <Card key={course.id}>
                          <CardHeader>
                            <div className="flex items-center gap-2">
                              {getDisciplineIcon(course.discipline)}
                              <CardTitle className="text-base">{course.name}</CardTitle>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-2 text-sm">
                            <p>{course.description}</p>
                            <p><strong>Sesiones:</strong> {course.sessions.length}</p>
                            <p className="text-emerald-600">
                              <strong>Precio pagado:</strong> {calculatePrice(course.price, participant).toFixed(2)} €
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </TabsContent>

          {/* ── Mi Perfil ── */}
          <TabsContent value="profile" className="space-y-6">
            <h3 className="text-lg font-medium">Mi Perfil</h3>

            {/* Info personal (solo lectura) */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Información personal</CardTitle>
                <CardDescription>Datos registrados en el sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Nombre completo</p>
                    <p className="font-medium">{participant.fullName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Usuario</p>
                    <p className="font-medium">@{participant.username}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Correo electrónico</p>
                    <p className="font-medium">{participant.email}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Tipo de cuenta</p>
                    <Badge variant={isUPMMember ? 'default' : 'secondary'} className="mt-1">
                      {typeLabel[participant.type]}
                    </Badge>
                  </div>
                  {participant.studentId && (
                    <div>
                      <p className="text-muted-foreground">Nº de matrícula</p>
                      <p className="font-medium">{participant.studentId}</p>
                    </div>
                  )}
                  {participant.yearsOfService !== undefined && (
                    <div>
                      <p className="text-muted-foreground">Antigüedad</p>
                      <p className="font-medium">{participant.yearsOfService} años</p>
                    </div>
                  )}
                  {discount > 0 && (
                    <div>
                      <p className="text-muted-foreground">Descuento aplicado</p>
                      <p className="font-medium text-emerald-600">{discount}%</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Preferencias artísticas — editables */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">Preferencias artísticas</CardTitle>
                    <CardDescription>
                      Gestiona tus disciplinas e indica tu nivel de experiencia
                    </CardDescription>
                  </div>
                  {!editingPrefs ? (
                    <Button variant="outline" size="sm" onClick={startEditPrefs}>
                      <Pencil className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={savePrefs}>
                        <Save className="h-4 w-4 mr-1" />
                        Guardar
                      </Button>
                      <Button variant="ghost" size="sm" onClick={cancelEditPrefs}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Modo edición */}
                {editingPrefs ? (
                  <>
                    <div className="space-y-2">
                      <Label>Disciplinas activas</Label>
                      <div className="flex flex-wrap gap-2">
                        {(Object.keys(DISCIPLINE_LABELS) as Discipline[]).map(discipline => {
                          const active = draftPrefs.find(p => p.discipline === discipline);
                          return (
                            <Button
                              key={discipline}
                              type="button"
                              variant={active ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => toggleDraftDiscipline(discipline)}
                            >
                              {DISCIPLINE_LABELS[discipline]}
                            </Button>
                          );
                        })}
                      </div>
                      {draftPrefs.length === 0 && (
                        <p className="text-xs text-muted-foreground">
                          Sin preferencias seleccionadas
                        </p>
                      )}
                    </div>

                    {draftPrefs.map(pref => (
                      <div key={pref.discipline} className="space-y-1">
                        <Label>
                          Nivel en {DISCIPLINE_LABELS[pref.discipline].split(' ')[1]}: {pref.level}/10
                        </Label>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={pref.level}
                          onChange={e => updateDraftLevel(pref.discipline, parseInt(e.target.value))}
                          className="w-full accent-primary"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Principiante (1)</span>
                          <span>Experto (10)</span>
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  /* Modo lectura */
                  <>
                    {participant.preferences.length === 0 ? (
                      <div className="py-4 text-center text-muted-foreground text-sm">
                        Aún no has añadido preferencias artísticas.{' '}
                        <button
                          onClick={startEditPrefs}
                          className="text-primary underline-offset-2 hover:underline"
                        >
                          Añadir ahora
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-3">
                        {participant.preferences.map(pref => (
                          <div
                            key={pref.discipline}
                            className="flex items-center gap-2 bg-secondary px-3 py-2 rounded-lg text-sm"
                          >
                            {getDisciplineIcon(pref.discipline)}
                            <span>{DISCIPLINE_LABELS[pref.discipline]}</span>
                            <Badge variant="outline">Nivel {pref.level}</Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
