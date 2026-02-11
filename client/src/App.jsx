import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import CaseListing from './pages/CaseListing';
import CaseDetail from './pages/CaseDetail';
import PatientDashboard from './pages/PatientDashboard';
import HospitalDashboard from './pages/HospitalDashboard';
import DonorDashboard from './pages/DonorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ForgotPassword from './pages/ForgotPassword';
import HowItWorks from './pages/HowItWorks';
import ManageHospitals from './pages/ManageHospitals';
import SubmitCase from './pages/SubmitCase';
import HospitalCaseDetail from './pages/HospitalCaseDetail';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
       

        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <AuthProvider>
                <div className="min-h-screen bg-slate-50">
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/cases" element={<CaseListing />} />
                        <Route path="/cases/:id" element={<CaseDetail />} />

                        <Route path="/patient-dashboard" element={
                            <ProtectedRoute allowedRoles={['patient']}>
                                <PatientDashboard />
                            </ProtectedRoute>
                        } />

                        <Route path="/submit-case" element={
                            <ProtectedRoute allowedRoles={['patient']}>
                                <SubmitCase />
                            </ProtectedRoute>
                        } />

                        <Route path="/hospital-dashboard" element={
                            <ProtectedRoute allowedRoles={['hospital']}>
                                <HospitalDashboard />
                            </ProtectedRoute>
                        } />

                        <Route path="/hospital-dashboard/case/:id" element={
                            <ProtectedRoute allowedRoles={['hospital']}>
                                <HospitalCaseDetail />
                            </ProtectedRoute>
                        } />

                        <Route path="/admin-dashboard" element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                <AdminDashboard />
                            </ProtectedRoute>
                        } />

                        <Route path="/manage-hospitals" element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                <ManageHospitals />
                            </ProtectedRoute>
                        } />

                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/how-it-works" element={<HowItWorks />} />
                    </Routes>
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;
