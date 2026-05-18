import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginForm } from './components/Auth/LoginForm';
import { Dashboard } from './components/Dashboard/Dashboard';
import { BookList } from './components/Books/BookList';
import { MemberList } from './components/Members/MemberList';
import { GenreManager } from './components/Genres/GenreManager';
import { StaffManager } from './components/Staff/StaffManager';
import { Reports } from './components/Reports/Reports';
import { Navbar } from './components/Layout/Navbar';
import { Sidebar } from './components/Layout/Sidebar';
import { BorrowRecords } from './components/Borrowing/BorrowRecords';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route path="/" element={
        <ProtectedRoute>
          <AppLayout>
            <Dashboard />
          </AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/books" element={
        <ProtectedRoute>
          <AppLayout>
            <BookList />
          </AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/members" element={
        <ProtectedRoute>
          <AppLayout>
            <MemberList />
          </AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/genres" element={
        <ProtectedRoute>
          <AppLayout>
            <GenreManager />
          </AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/staff" element={
        <ProtectedRoute>
          <AppLayout>
            <StaffManager />
          </AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/reports" element={
        <ProtectedRoute>
          <AppLayout>
            <Reports />
          </AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/borrow-records" element={
        <ProtectedRoute>
          <AppLayout>
            <BorrowRecords />
          </AppLayout>
        </ProtectedRoute>
      } />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-right" />
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;