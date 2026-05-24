import React, { useState } from 'react';
import { ArrowLeft, UserPlus, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { useAuth, detectParticipantType } from '../context/AuthContext';
import { toast } from 'sonner';
import { Discipline } from '../types';

interface RegisterProps {
  onBackToLogin: () => void;
}

const DISCIPLINE_LABELS: Record<Discipline, string> = {
  music: '🎵 Música',
  painting: '🎨 Pintura',
  theater: '🎭 Teatro',
};

export function Register({ onBackToLogin }: RegisterProps) {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    fullName: '',
    dni: '',
    creditCard: '',
    studentId: '',
    yearsOfService: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [preferences, setPreferences] = useState<{ discipline: Discipline; level: number }[]>([]);
  const [loading, setLoading] = useState(false);

  // ─── Detección automática de tipo por dominio ───────────────────────────────
  const detectedType = formData.email ? detectParticipantType(formData.email) : null;
  const isStudentEmail = detectedType === 'student';
  const isStaffEmail   = detectedType === 'staff';
  const isUPMEmail     = isStudentEmail || isStaffEmail;

  // ─── Descuento estimado para personal ───────────────────────────────────────
  const estimatedStaffDiscount = isStaffEmail && formData.yearsOfService
    ? Math.min(25 + parseInt(formData.yearsOfService) * 3, 50)
    : 25;

  // ─── Validaciones ───────────────────────────────────────────────────────────
  const validateUsername = (username: string): boolean => {
    if (username.length < 4 || username.length > 12) {
      toast.error('El nombre de usuario debe tener entre 4 y 12 caracteres');
      return false;
    }
    if (!/^[a-zA-Z0-9]+$/.test(username)) {
      toast.error('El nombre de usuario solo puede contener caracteres alfanuméricos');
      return false;
    }
    return true;
  };

  const validatePassword = (password: string): boolean => {
    if (password.length < 12) {
      toast.error('La contraseña debe tener al menos 12 caracteres');
      return false;
    }
    if (!/[A-Z]/.test(password)) {
      toast.error('La contraseña debe contener al menos una mayúscula');
      return false;
    }
    if (!/[a-z]/.test(password)) {
      toast.error('La contraseña debe contener al menos una minúscula');
      return false;
    }
    if (!/[0-9]/.test(password)) {
      toast.error('La contraseña debe contener al menos un número');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateUsername(formData.username)) return;
    if (!validatePassword(formData.password)) return;

    if (formData.password !== formData.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    try {
      await register({
        ...formData,
        role: 'participant',
        preferences,
        yearsOfService: formData.yearsOfService ? parseInt(formData.yearsOfService) : undefined,
      });
      toast.success('¡Registro completado! Bienvenido/a a UPM-Arts');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  // ─── Preferencias ───────────────────────────────────────────────────────────
  const togglePreference = (discipline: Discipline) => {
    const exists = preferences.find(p => p.discipline === discipline);
    if (exists) {
      setPreferences(preferences.filter(p => p.discipline !== discipline));
    } else {
      setPreferences([...preferences, { discipline, level: 5 }]);
    }
  };

  const updateLevel = (discipline: Discipline, level: number) => {
    setPreferences(preferences.map(p => p.discipline === discipline ? { ...p, level } : p));
  };

  return (
    <div className="min-h-screen bg-secondary/30 p-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Button variant="ghost" onClick={onBackToLogin} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al inicio de sesión
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-1">
              <div className="bg-primary p-2 rounded">
                <span className="text-primary-foreground text-sm">UPM</span>
              </div>
              <div>
                <CardTitle>Registro de Participante</CardTitle>
                <CardDescription>
                  Únete a la comunidad cultural de la UPM.
                  Los instructores solo pueden ser registrados por administradores.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* ── Datos básicos ── */}
              <section className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Datos básicos
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Nombre completo *</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Nombre de usuario (4–12 car.) *</Label>
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={e => setFormData({ ...formData, username: e.target.value })}
                      minLength={4}
                      maxLength={12}
                      placeholder="ej. juanl2024"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Correo electrónico *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="tu.email@upm.es"
                      required
                    />
                    {/* Indicador de tipo detectado */}
                    {isStudentEmail && (
                      <p className="text-xs text-emerald-600 flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Email de <strong>estudiante UPM</strong> detectado — 25 % de descuento automático
                      </p>
                    )}
                    {isStaffEmail && (
                      <p className="text-xs text-emerald-600 flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Email de <strong>personal UPM</strong> detectado — descuento desde 25 %
                      </p>
                    )}
                    {formData.email && !isUPMEmail && (
                      <p className="text-xs text-muted-foreground">
                        Email externo — sin descuento UPM
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dni">DNI *</Label>
                    <Input
                      id="dni"
                      value={formData.dni}
                      onChange={e => setFormData({ ...formData, dni: e.target.value })}
                      placeholder="12345678A"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña (mín. 12 caracteres) *</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={e => setFormData({ ...formData, password: e.target.value })}
                      minLength={12}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Debe incluir mayúscula, minúscula y número
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar contraseña *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="creditCard">Tarjeta de crédito/débito *</Label>
                  <Input
                    id="creditCard"
                    value={formData.creditCard}
                    onChange={e => setFormData({ ...formData, creditCard: e.target.value })}
                    placeholder="4532 1234 5678 9012"
                    required
                  />
                </div>
              </section>

              {/* ── Perfil de estudiante UPM (@alumnos.upm.es) ── */}
              {isStudentEmail && (
                <section className="space-y-4">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Perfil de Estudiante UPM
                  </h3>
                  <div className="bg-emerald-50 border border-emerald-200 rounded-md p-3">
                    <p className="text-sm text-emerald-800">
                      ✓ Se ha detectado tu correo de estudiante UPM. Obtendrás automáticamente
                      un <strong>25 % de descuento</strong> en todas las actividades.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="studentId">Número de matrícula *</Label>
                    <Input
                      id="studentId"
                      value={formData.studentId}
                      onChange={e => setFormData({ ...formData, studentId: e.target.value })}
                      placeholder="A201234567"
                      required
                    />
                  </div>
                </section>
              )}

              {/* ── Perfil de personal UPM (@upm.es / subdominios) ── */}
              {isStaffEmail && (
                <section className="space-y-4">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Perfil de Personal UPM
                  </h3>
                  <div className="bg-emerald-50 border border-emerald-200 rounded-md p-3">
                    <p className="text-sm text-emerald-800">
                      ✓ Correo de <strong>personal UPM</strong> detectado. Tu descuento base es 25 %
                      y aumenta un 3 % por cada año de antigüedad (máximo 50 %).
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="yearsOfService">Años de antigüedad en la UPM</Label>
                    <Input
                      id="yearsOfService"
                      type="number"
                      min="0"
                      max="40"
                      value={formData.yearsOfService}
                      onChange={e => setFormData({ ...formData, yearsOfService: e.target.value })}
                      placeholder="0"
                    />
                    {formData.yearsOfService !== '' && (
                      <p className="text-xs text-emerald-700">
                        Descuento estimado: <strong>{estimatedStaffDiscount}%</strong>
                      </p>
                    )}
                  </div>
                </section>
              )}

              {/* ── Preferencias artísticas ── */}
              <section className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Preferencias artísticas <span className="normal-case font-normal">(opcional)</span>
                </h3>

                <div className="space-y-2">
                  <Label>Selecciona tus disciplinas de interés</Label>
                  <div className="flex flex-wrap gap-2">
                    {(Object.keys(DISCIPLINE_LABELS) as Discipline[]).map(discipline => {
                      const active = preferences.find(p => p.discipline === discipline);
                      return (
                        <Button
                          key={discipline}
                          type="button"
                          variant={active ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => togglePreference(discipline)}
                        >
                          {DISCIPLINE_LABELS[discipline]}
                        </Button>
                      );
                    })}
                  </div>
                </div>

                {preferences.map(pref => (
                  <div key={pref.discipline} className="space-y-1">
                    <Label>
                      Nivel en {DISCIPLINE_LABELS[pref.discipline].split(' ')[1]}: {pref.level}/10
                    </Label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={pref.level}
                      onChange={e => updateLevel(pref.discipline, parseInt(e.target.value))}
                      className="w-full accent-primary"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Principiante</span>
                      <span>Experto</span>
                    </div>
                  </div>
                ))}
              </section>

              <Button type="submit" className="w-full" disabled={loading}>
                <UserPlus className="mr-2 h-4 w-4" />
                {loading ? 'Registrando...' : 'Crear cuenta'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
