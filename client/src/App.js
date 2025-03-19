import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Auth Context
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { SubscriptionProvider } from './contexts/SubscriptionContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Layout Components
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import ErrorBoundary from './components/common/ErrorBoundary';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ChatPage from './pages/ChatPage';
import NotesPage from './pages/NotesPage';
import TasksPage from './pages/TasksPage';
import IdeasPage from './pages/IdeasPage';
import ProfilePage from './pages/ProfilePage';
import PricingPage from './pages/PricingPage';

// Styles
import './styles/theme.css';
import './styles/empty-states.css';
import './styles/loading.css';
import './App.css';

const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <SubscriptionProvider>
          <BrowserRouter>
            <Routes>
              {/* Auth Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Pricing Page (public) */}
              <Route path="/pricing" element={<PricingPage />} />
              
              {/* Protected App Routes */}
              <Route 
                path="/" 
                element={
                  <ProtectedRoute>
                    <div className="app">
                      <Sidebar />
                      <div className="main-content">
                        <Header />
                        <ErrorBoundary>
                          <Routes>
                            <Route path="/" element={<ChatPage />} />
                            <Route path="/notes" element={<NotesPage />} />
                            <Route path="/tasks" element={<TasksPage />} />
                            <Route path="/ideas" element={<IdeasPage />} />
                            <Route path="/profile" element={<ProfilePage />} />
                          </Routes>
                        </ErrorBoundary>
                      </div>
                    </div>
                  </ProtectedRoute>
                } 
              />
              
              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </SubscriptionProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App; 