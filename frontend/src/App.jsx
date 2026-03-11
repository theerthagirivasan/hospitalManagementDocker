import { AuthProvider } from './context/AuthContext';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/login" replace />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            
            <Route path="patient" element={
              <ProtectedRoute allowedRoles={['ROLE_PATIENT']}>
                <PatientDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="doctor" element={
              <ProtectedRoute allowedRoles={['ROLE_DOCTOR']}>
                <DoctorDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="admin" element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
