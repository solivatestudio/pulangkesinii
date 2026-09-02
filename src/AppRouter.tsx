import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import { AdminLogin } from './admin/AdminLogin';
import { AdminDashboard } from './admin/AdminDashboard';

export const AppRouter: React.FC = () => {
  const [adminUser, setAdminUser] = useState<any>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setAdminUser(data);
        } else {
          setAdminUser(null);
        }
      } catch (err) {
        setAdminUser(null);
      } finally {
        setCheckingAuth(false);
      }
    };
    checkSession();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Homepage */}
        <Route path="/" element={<App />} />

        {/* Admin Login */}
        <Route
          path="/admin/login"
          element={
            adminUser ? (
              <Navigate to="/admin" replace />
            ) : (
              <AdminLogin onLoginSuccess={(user) => setAdminUser(user)} />
            )
          }
        />

        {/* Admin Dashboard (Protected) */}
        <Route
          path="/admin"
          element={
            checkingAuth ? (
              <div className="min-h-screen bg-[#F0F7F7] flex items-center justify-center text-xs text-[#0EADAD] font-bold">
                Memeriksa otentikasi admin...
              </div>
            ) : adminUser ? (
              <AdminDashboard user={adminUser} onLogout={() => setAdminUser(null)} />
            ) : (
              <Navigate to="/admin/login" replace />
            )
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
