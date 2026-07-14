import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import NotFound from './pages/NotFound';

// Pages Import
import Home from './pages/Home/Home';
import Login from './pages/Auth/Login';
import DoctorLogin from './pages/Auth/DoctorLogin';
import ForgotPassword from './pages/Auth/ForgotPassword';
import Dashboard from './pages/Dashboard/Dashboard';
import Profile from './pages/Profile/Profile';
import DietTracker from './pages/Diet/DietTracker';
import Reminders from './pages/Reminders/Reminders';
import Stats from './pages/Stats/Stats';
import SymptomTracker from './pages/Symptoms/SymptomTracker';
import HealthTrends from './pages/Trends/HealthTrends';
import AICoach from './pages/AICoach/AICoach';
import DrugChecker from './pages/DrugChecker/DrugChecker';

// Doctor booking & admin pages
import DoctorList from './pages/Doctors/DoctorList';
import DoctorDetails from './pages/Doctors/DoctorDetails';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminLogin from './pages/Admin/AdminLogin';

// Doctor pages
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import DoctorStats from './pages/Doctor/DoctorStats';
import DoctorRecords from './pages/Doctor/DoctorRecords';
import DoctorAnalyzer from './pages/Doctor/DoctorAnalyzer';

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <AuthProvider>
          <NotificationProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/doctor-login" element={<DoctorLogin />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/admin-login" element={<AdminLogin />} />

              {/* Doctor browsing — PUBLIC (no login required) */}
              <Route path="/doctors" element={<DoctorList />} />
              <Route path="/doctor/:id" element={<DoctorDetails />} />

              {/* Patient Protected Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/diet" element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <DietTracker />
                </ProtectedRoute>
              } />
              <Route path="/reminders" element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <Reminders />
                </ProtectedRoute>
              } />
              <Route path="/stats" element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <Stats />
                </ProtectedRoute>
              } />
              <Route path="/symptoms" element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <SymptomTracker />
                </ProtectedRoute>
              } />
              <Route path="/trends" element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <HealthTrends />
                </ProtectedRoute>
              } />
              <Route path="/ai-coach" element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <AICoach />
                </ProtectedRoute>
              } />
              <Route path="/drug-checker" element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <DrugChecker />
                </ProtectedRoute>
              } />

              {/* Doctor Portal Routes */}
              <Route path="/doctor-dashboard" element={
                <ProtectedRoute allowedRoles={['doctor']}>
                  <DoctorDashboard />
                </ProtectedRoute>
              } />
              <Route path="/doctor-stats" element={
                <ProtectedRoute allowedRoles={['doctor']}>
                  <DoctorStats />
                </ProtectedRoute>
              } />
              <Route path="/doctor-records" element={
                <ProtectedRoute allowedRoles={['doctor']}>
                  <DoctorRecords />
                </ProtectedRoute>
              } />
              <Route path="/doctor-analyzer" element={
                <ProtectedRoute allowedRoles={['doctor']}>
                  <DoctorAnalyzer />
                </ProtectedRoute>
              } />

              {/* Admin Portal Routes */}
              <Route path="/admin-dashboard" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />

              {/* 404 — catch all unmatched routes */}
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </NotificationProvider>
        </AuthProvider>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
