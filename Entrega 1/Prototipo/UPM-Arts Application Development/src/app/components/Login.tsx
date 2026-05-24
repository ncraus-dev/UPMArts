import React, { useState } from 'react';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

interface LoginProps {
  onRegisterClick: () => void;
}

export function Login({ onRegisterClick }: LoginProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      toast.success('¡Bienvenido a UPM-Arts!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary text-primary-foreground p-4 rounded-lg">
              <h1 className="text-2xl">UPM</h1>
            </div>
          </div>
          <CardTitle>Centro de Creación Cultural</CardTitle>
          <CardDescription>
            "Ars longa, vita brevis" - Accede a UPM-Arts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu.email@upm.es"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              <LogIn className="mr-2 h-4 w-4" />
              {loading ? 'Accediendo...' : 'Iniciar sesión'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              ¿No tienes cuenta?{' '}
              <button
                onClick={onRegisterClick}
                className="text-primary hover:underline font-medium"
              >
                Regístrate aquí
              </button>
            </p>
          </div>

          <div className="mt-6 p-4 bg-secondary/50 rounded-lg">
            <p className="text-xs text-muted-foreground mb-2">Usuarios de prueba:</p>
            <div className="space-y-1 text-xs">
              <p><strong>Admin:</strong> admin@upm.es / Admin123456!</p>
              <p><strong>Estudiante:</strong> juan.lopez@alumnos.upm.es / Student123456!</p>
              <p><strong>Personal:</strong> ana.fernandez@upm.es / Staff123456!</p>
              <p><strong>Externo:</strong> pedro.sanchez@gmail.com / External123456!</p>
              <p><strong>Instructor:</strong> carlos.music@upm.es / Music123456!</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
