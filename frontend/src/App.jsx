import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Chatbot from './pages/Chatbot';
import Courses from './pages/Courses';
import Admissions from './pages/Admissions';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ChatProvider>
          <Router>
            <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100 font-sans">
              
              {/* Global Navigation Header */}
              <Navbar />

              {/* Main Content Viewport */}
              <div className="flex-1">
                <Routes>
                  {/* Public Pages */}
                  <Route path="/" element={<Home />} />
                  <Route path="/chat" element={<Chatbot />} />
                  <Route path="/courses" element={<Courses />} />
                  <Route path="/admissions" element={<Admissions />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  {/* Protected Student Dashboard */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute roleRequired="student">
                        <StudentDashboard />
                      </ProtectedRoute>
                    }
                  />

                  {/* Protected Admin Control Center */}
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute roleRequired="admin">
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />

                  {/* Catch-all 404 redirect */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </div>

              {/* Global Footer */}
              <Footer />

            </div>
          </Router>
        </ChatProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
