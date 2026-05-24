import React, { useState } from 'react';
import { 
  Users, Building, Calendar, UsersRound, LogOut, Plus, 
  Music, Palette, Theater, UserPlus, Trash2, Edit
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { useAuth } from '../context/AuthContext';
import { Administrator, Discipline, SpaceType } from '../types';
import { mockSpaces, mockSessions, mockCourses, mockAssociations } from '../data/mockData';
import { toast } from 'sonner';

export function AdminDashboard() {
  const { user, logout, users } = useAuth();
  const admin = user as Administrator;
  const [activeTab, setActiveTab] = useState('overview');
  const [showNewInstructorDialog, setShowNewInstructorDialog] = useState(false);
  const [showNewSpaceDialog, setShowNewSpaceDialog] = useState(false);
  const [showNewSessionDialog, setShowNewSessionDialog] = useState(false);
  const [showNewAssociationDialog, setShowNewAssociationDialog] = useState(false);

  const participants = users.filter(u => u.role === 'participant');
  const instructors  = users.filter(u => u.role === 'instructor');
  const upmMembers   = participants.filter(p => p.role === 'participant' && (p.type === 'student' || p.type === 'staff'));

  const getDisciplineIcon = (discipline: string) => {
    switch (discipline) {
      case 'music': return <Music className="h-4 w-4" />;
      case 'painting': return <Palette className="h-4 w-4" />;
      case 'theater': return <Theater className="h-4 w-4" />;
      default: return null;
    }
  };

  const handleCreateInstructor = () => {
    toast.success('Instructor creado exitosamente');
    setShowNewInstructorDialog(false);
  };

  const handleCreateSpace = () => {
    toast.success('Espacio creado exitosamente');
    setShowNewSpaceDialog(false);
  };

  const handleCreateSession = () => {
    toast.success('Sesión creada exitosamente');
    setShowNewSessionDialog(false);
  };

  const handleCreateAssociation = () => {
    toast.success('Asociación creada exitosamente');
    setShowNewAssociationDialog(false);
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    if (confirm(`¿Estás seguro de que quieres eliminar a ${userName}?`)) {
      toast.success('Usuario eliminado');
    }
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
                <h2 className="text-lg">Panel de Administración</h2>
                <p className="text-sm text-primary-foreground/80">Centro de Creación Cultural</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden md:block">
                <p className="text-sm">{admin.fullName}</p>
                <p className="text-xs text-primary-foreground/70">Administrador</p>
              </div>
              <Button variant="secondary" size="sm" onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="overview">
              <Users className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Resumen</span>
            </TabsTrigger>
            <TabsTrigger value="users">
              <Users className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Usuarios</span>
            </TabsTrigger>
            <TabsTrigger value="spaces">
              <Building className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Espacios</span>
            </TabsTrigger>
            <TabsTrigger value="activities">
              <Calendar className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Actividades</span>
            </TabsTrigger>
            <TabsTrigger value="associations">
              <UsersRound className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Asociaciones</span>
            </TabsTrigger>
          </TabsList>

          {/* Resumen */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm">Total Usuarios</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl">{users.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {participants.length} participantes, {instructors.length} instructores
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm">Espacios</CardTitle>
                  <Building className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl">{mockSpaces.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Aforo total: {mockSpaces.reduce((sum, s) => sum + s.maxCapacity, 0)}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm">Sesiones</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl">{mockSessions.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {mockCourses.length} cursos activos
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm">Asociaciones</CardTitle>
                  <UsersRound className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl">{mockAssociations.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {mockAssociations.reduce((sum, a) => sum + a.members.length, 0)} miembros totales
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Estadísticas por Disciplina</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(['music', 'painting', 'theater'] as Discipline[]).map((discipline) => {
                    const sessions = mockSessions.filter(s => s.discipline === discipline);
                    const courses = mockCourses.filter(c => c.discipline === discipline);
                    
                    return (
                      <div key={discipline} className="flex items-center gap-3 p-4 bg-secondary/50 rounded-lg">
                        {getDisciplineIcon(discipline)}
                        <div className="flex-1">
                          <p className="font-medium capitalize">{discipline}</p>
                          <p className="text-sm text-muted-foreground">
                            {sessions.length} sesiones, {courses.length} cursos
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Usuarios */}
          <TabsContent value="users" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Gestión de Usuarios</h3>
              <Dialog open={showNewInstructorDialog} onOpenChange={setShowNewInstructorDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Nuevo Instructor
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Crear Instructor</DialogTitle>
                    <DialogDescription>
                      Añade un nuevo instructor al sistema
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="instructor-name">Nombre completo</Label>
                      <Input id="instructor-name" placeholder="Nombre del instructor" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="instructor-email">Email</Label>
                      <Input id="instructor-email" type="email" placeholder="email@upm.es" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="instructor-dni">DNI</Label>
                      <Input id="instructor-dni" placeholder="12345678A" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="instructor-iban">IBAN</Label>
                      <Input id="instructor-iban" placeholder="ES91 2100 0418 4502 0005 1332" />
                    </div>
                    <Button onClick={handleCreateInstructor} className="w-full">
                      Crear Instructor
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Participantes ({participants.length})</CardTitle>
                  <CardDescription>
                    {upmMembers.length} miembros UPM, {participants.length - upmMembers.length} externos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {participants.slice(0, 10).map((participant) => (
                      <div key={participant.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{participant.fullName}</p>
                          <p className="text-sm text-muted-foreground">{participant.email}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={participant.type === 'external' ? 'secondary' : 'default'}>
                            {participant.type}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteUser(participant.id, participant.fullName)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Instructores ({instructors.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {instructors.map((instructor) => (
                      <div key={instructor.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{instructor.fullName}</p>
                          <p className="text-sm text-muted-foreground">{instructor.email}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteUser(instructor.id, instructor.fullName)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Espacios */}
          <TabsContent value="spaces" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Gestión de Espacios</h3>
              <Dialog open={showNewSpaceDialog} onOpenChange={setShowNewSpaceDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Nuevo Espacio
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Crear Espacio</DialogTitle>
                    <DialogDescription>
                      Añade un nuevo espacio al Centro Cultural
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="space-name">Nombre del espacio</Label>
                      <Input id="space-name" placeholder="Aula de Música 3" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="space-type">Tipo</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona el tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="music_room">Aula de Música</SelectItem>
                          <SelectItem value="painting_workshop">Taller de Pintura</SelectItem>
                          <SelectItem value="theater_auditorium">Auditorio de Teatro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="space-surface">Superficie (m²)</Label>
                        <Input id="space-surface" type="number" placeholder="50" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="space-capacity">Aforo máximo</Label>
                        <Input id="space-capacity" type="number" placeholder="20" />
                      </div>
                    </div>
                    <Button onClick={handleCreateSpace} className="w-full">
                      Crear Espacio
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockSpaces.map((space) => (
                <Card key={space.id}>
                  <CardHeader>
                    <CardTitle className="text-base">{space.name}</CardTitle>
                    <CardDescription className="capitalize">
                      {space.type.replace('_', ' ')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-1 text-sm">
                      <p><strong>Superficie:</strong> {space.surface} m²</p>
                      <p><strong>Aforo:</strong> {space.maxCapacity} personas</p>
                      <p><strong>Equipamiento:</strong> {space.equipment.length} items</p>
                    </div>
                    {space.equipment.length > 0 && (
                      <div className="pt-2 border-t">
                        <p className="text-xs text-muted-foreground mb-1">Equipamiento:</p>
                        {space.equipment.map((eq) => (
                          <p key={eq.id} className="text-xs">• {eq.description}</p>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="h-3 w-3 mr-1" />
                        Editar
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Actividades */}
          <TabsContent value="activities" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Gestión de Actividades</h3>
              <Dialog open={showNewSessionDialog} onOpenChange={setShowNewSessionDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Nueva Sesión/Curso
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Crear Sesión o Curso</DialogTitle>
                    <DialogDescription>
                      Programa una nueva actividad cultural
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Tipo de actividad</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona el tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="free">Sesión de trabajo libre</SelectItem>
                          <SelectItem value="course">Curso (mínimo 3 sesiones)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Disciplina</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="music">Música</SelectItem>
                            <SelectItem value="painting">Pintura</SelectItem>
                            <SelectItem value="theater">Teatro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Espacio</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockSpaces.map((space) => (
                              <SelectItem key={space.id} value={space.id}>
                                {space.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button onClick={handleCreateSession} className="w-full">
                      Crear Actividad
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Sesiones de Trabajo Libre</CardTitle>
                  <CardDescription>{mockSessions.filter(s => s.type === 'free').length} sesiones</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {mockSessions.filter(s => s.type === 'free').map((session) => {
                      const space = mockSpaces.find(s => s.id === session.spaceId);
                      return (
                        <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-2">
                            {getDisciplineIcon(session.discipline)}
                            <div>
                              <p className="font-medium capitalize">{session.discipline}</p>
                              <p className="text-xs text-muted-foreground">{space?.name}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm">{session.date.toLocaleDateString('es-ES')}</p>
                            <p className="text-xs text-muted-foreground">
                              {session.participants.length}/{session.capacity}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cursos</CardTitle>
                  <CardDescription>{mockCourses.length} cursos activos</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {mockCourses.map((course) => {
                      const instructor = instructors.find(i => i.id === course.instructorId);
                      return (
                        <div key={course.id} className="p-3 border rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            {getDisciplineIcon(course.discipline)}
                            <p className="font-medium">{course.name}</p>
                          </div>
                          <p className="text-xs text-muted-foreground mb-1">{course.description}</p>
                          <div className="flex items-center justify-between text-xs">
                            <span>Instructor: {instructor?.fullName}</span>
                            <span>{course.price}€</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Asociaciones */}
          <TabsContent value="associations" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Gestión de Asociaciones</h3>
              <Dialog open={showNewAssociationDialog} onOpenChange={setShowNewAssociationDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Nueva Asociación
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Crear Asociación Cultural</DialogTitle>
                    <DialogDescription>
                      Requiere al menos 2 miembros UPM
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Nombre de la asociación</Label>
                      <Input placeholder="Club de Teatro" />
                    </div>
                    <div className="space-y-2">
                      <Label>Disciplina principal</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="music">Música</SelectItem>
                          <SelectItem value="painting">Pintura</SelectItem>
                          <SelectItem value="theater">Teatro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={handleCreateAssociation} className="w-full">
                      Crear Asociación
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockAssociations.map((association) => (
                <Card key={association.id}>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      {getDisciplineIcon(association.mainDiscipline)}
                      <CardTitle className="text-base">{association.name}</CardTitle>
                    </div>
                    <CardDescription className="capitalize">
                      {association.mainDiscipline}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm"><strong>Miembros:</strong> {association.members.length}</p>
                    <p className="text-sm">
                      <strong>Creada:</strong> {association.createdDate.toLocaleDateString('es-ES')}
                    </p>
                    <p className="text-sm">
                      <strong>Reservas activas:</strong> {association.reservations.length}/6
                    </p>
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        Ver detalles
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}