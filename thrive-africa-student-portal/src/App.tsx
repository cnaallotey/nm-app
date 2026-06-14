/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './lib/AuthContext';
import { Layout } from './components/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Classes from './pages/Classes';
import Materials from './pages/Materials';
import Assignments from './pages/Assignments';
import CareerHub from './pages/CareerHub';
import Certificates from './pages/Certificates';
import Profile from './pages/Profile';
import Admin from './pages/Admin';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/classes" element={<Classes />} />
            <Route path="/materials" element={<Materials />} />
            <Route path="/assignments" element={<Assignments />} />
            <Route path="/career" element={<CareerHub />} />
            <Route path="/certificates" element={<Certificates />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<Admin />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
