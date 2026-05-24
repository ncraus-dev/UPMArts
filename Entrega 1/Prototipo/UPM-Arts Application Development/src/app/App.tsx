import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { ParticipantDashboard } from './components/ParticipantDashboard';
import { InstructorDashboard } from './components/InstructorDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { Toaster } from './components/ui/sonner';

function AppContent() {
  const { user } = useAuth();
  const [showRegister, setShowRegister] = useState(false);

  // Si el usuario no está autenticado, mostrar login o registro
  if (!user) {
    if (showRegister) {
      return <Register onBackToLogin={() => setShowRegister(false)} />;
    }
    return <Login onRegisterClick={() => setShowRegister(true)} />;
  }

  // Mostrar el dashboard correspondiente según el rol
  switch (user.role) {
    case 'participant':
      return <ParticipantDashboard />;
    case 'instructor':
      return <InstructorDashboard />;
    case 'admin':
      return <AdminDashboard />;
    default:
      return <Login onRegisterClick={() => setShowRegister(true)} />;
  }
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
      <Toaster position="top-right" />
    </AuthProvider>
  );
}
