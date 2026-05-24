import React, { useState } from 'react';
import { Calendar, Music, Palette, Theater, LogOut, User, Users, BookOpen } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useAuth } from '../context/AuthContext';
import { Instructor } from '../types';
import { mockCourses, mockSessions, mockSpaces, mockUsers } from '../data/mockData';

export function InstructorDashboard() {
  const { user, logout } = useAuth();
  const instructor = user as Instructor;
  const [activeTab, setActiveTab] = useState('courses');

  // Cursos asignados al instructor
  const myCourses = mockCourses.filter(c => c.instructorId === instructor.id);
  
  // Sesiones de los cursos del instructor
  const mySessions = mockSessions.filter(s => 
    s.type === 'course' && 
    myCourses.some(c => c.id === s.courseId)
  );

  const getDisciplineIcon = (discipline: string) => {
    switch (discipline) {
      case 'music': return <Music className="h-4 w-4" />;
      case 'painting': return <Palette className="h-4 w-4" />;
      case 'theater': return <Theater className="h-4 w-4" />;
      default: return null;
    }
  };

  const getTotalStudents = () => {
    const uniqueStudents = new Set<string>();
    mySessions.forEach(session => {
      session.participants.forEach(p => uniqueStudents.add(p.userId));
    });
    return uniqueStudents.size;
  };

  const getTotalHours = () => {
    return mySessions.reduce((total, session) => {
      const start = parseInt(session.startTime.split(':')[0]);
      const end = parseInt(session.endTime.split(':')[0]);
      return total + (end - start);
    }, 0);
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded">
                <h1 className="text-xl">UPM</h1>
              </div>
              <div>
                <h2 className="text-lg">Portal del Instructor</h2>
                <p className="text-sm text-primary-foreground/80">Centro de Creación Cultural</p>
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
        {/* Información del instructor */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-accent/10 p-3 rounded-full">
                  <User className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <CardTitle>{instructor.fullName}</CardTitle>
                  <CardDescription>@{instructor.username}</CardDescription>
                </div>
              </div>
              <Badge variant="default">Instructor</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{instructor.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">DNI</p>
                <p className="font-medium">{instructor.dni}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">IBAN</p>
                <p className="font-medium">{instructor.iban}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Cursos Activos</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{myCourses.length}</div>
              <p className="text-xs text-muted-foreground">Cursos asignados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Sesiones</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{mySessions.length}</div>
              <p className="text-xs text-muted-foreground">Total de sesiones</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Estudiantes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{getTotalStudents()}</div>
              <p className="text-xs text-muted-foreground">Estudiantes únicos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Horas Totales</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{getTotalHours()}h</div>
              <p className="text-xs text-muted-foreground">Horas impartidas</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="courses">
              <BookOpen className="h-4 w-4 mr-2" />
              Mis Cursos
            </TabsTrigger>
            <TabsTrigger value="sessions">
              <Calendar className="h-4 w-4 mr-2" />
              Próximas Sesiones
            </TabsTrigger>
          </TabsList>

          {/* Mis Cursos */}
          <TabsContent value="courses" className="space-y-4">
            <h3 className="text-lg font-medium">Cursos que imparto</h3>
            
            {myCourses.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No tienes cursos asignados actualmente
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myCourses.map((course) => {
                  const courseSessions = mockSessions.filter(s => s.courseId === course.id);
                  const totalStudents = new Set(
                    courseSessions.flatMap(s => s.participants.map(p => p.userId))
                  ).size;

                  return (
                    <Card key={course.id}>
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          {getDisciplineIcon(course.discipline)}
                          <CardTitle className="text-base">{course.name}</CardTitle>
                        </div>
                        <CardDescription className="capitalize">{course.discipline}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-muted-foreground">{course.description}</p>
                        
                        <div className="space-y-1 text-sm">
                          <p><strong>Precio:</strong> {course.price}€</p>
                          <p><strong>Sesiones:</strong> {courseSessions.length}</p>
                          <p><strong>Estudiantes inscritos:</strong> {totalStudents}</p>
                        </div>

                        {courseSessions.length > 0 && (
                          <div className="pt-3 border-t">
                            <p className="text-xs text-muted-foreground mb-2">Próximas sesiones:</p>
                            <div className="space-y-1">
                              {courseSessions.slice(0, 3).map((session) => {
                                const space = mockSpaces.find(s => s.id === session.spaceId);
                                return (
                                  <div key={session.id} className="text-xs flex items-center justify-between">
                                    <span>{session.date.toLocaleDateString('es-ES')}</span>
                                    <span className="text-muted-foreground">
                                      {session.startTime} - {session.endTime} • {space?.name}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        <Button variant="outline" className="w-full" size="sm">
                          Ver detalles del curso
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Próximas Sesiones */}
          <TabsContent value="sessions" className="space-y-4">
            <h3 className="text-lg font-medium">Calendario de sesiones</h3>
            
            {mySessions.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No tienes sesiones programadas
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {mySessions
                  .sort((a, b) => a.date.getTime() - b.date.getTime())
                  .map((session) => {
                    const course = mockCourses.find(c => c.id === session.courseId);
                    const space = mockSpaces.find(s => s.id === session.spaceId);

                    return (
                      <Card key={session.id}>
                        <CardContent className="py-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                {getDisciplineIcon(session.discipline)}
                                <h4 className="font-medium">{course?.name || 'Sesión'}</h4>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div>
                                  <p className="text-muted-foreground">Fecha y hora</p>
                                  <p className="font-medium">
                                    {session.date.toLocaleDateString('es-ES', { 
                                      weekday: 'long', 
                                      year: 'numeric', 
                                      month: 'long', 
                                      day: 'numeric' 
                                    })}
                                  </p>
                                  <p className="text-muted-foreground text-xs">
                                    {session.startTime} - {session.endTime}
                                  </p>
                                </div>
                                
                                <div>
                                  <p className="text-muted-foreground">Espacio</p>
                                  <p className="font-medium">{space?.name}</p>
                                  <p className="text-muted-foreground text-xs">
                                    Aforo: {session.capacity}
                                  </p>
                                </div>
                                
                                <div>
                                  <p className="text-muted-foreground">Asistentes</p>
                                  <p className="font-medium">
                                    {session.participants.length} estudiantes
                                  </p>
                                  <p className="text-muted-foreground text-xs">
                                    {session.participants.length}/{session.capacity} plazas
                                  </p>
                                </div>
                              </div>
                            </div>

                            <Badge 
                              variant={session.date > new Date() ? 'default' : 'secondary'}
                            >
                              {session.date > new Date() ? 'Próxima' : 'Pasada'}
                            </Badge>
                          </div>

                          {session.participants.length > 0 && (
                            <div className="mt-4 pt-4 border-t">
                              <p className="text-xs text-muted-foreground mb-2">Lista de asistentes:</p>
                              <div className="flex flex-wrap gap-2">
                                {session.participants.map((participant) => {
                                  const studentInfo = mockUsers.find(u => u.id === participant.userId);
                                  return (
                                    <Badge key={participant.userId} variant="outline" className="text-xs">
                                      {studentInfo?.fullName || 'Estudiante'}
                                    </Badge>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
