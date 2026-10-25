import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './styles.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import TripDetails from './pages/TripDetails';

function Protected() {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen">Loading TripNest...</div>;
  return user ? <Layout /> : <Navigate to="/login" replace />;
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/register" element={<Auth register />} />
          {/* Authenticated */}
          <Route element={<Protected />}>
            <Route path="/trips" element={<Dashboard />} />
            <Route path="/trips/:id" element={<TripDetails />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
