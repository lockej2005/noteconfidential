import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Front End/login';
import SignUp from './Front End/SignUp';
import Dashboard from './Front End/Dashboard';
import CreatePage from './Front End/Create';
import Note from './Front End/Note';
import { AuthProvider } from './Front End/AuthContext.js';
import ProtectedRoute from './Front End/ProtectedRoute.js';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/create" element={
            <ProtectedRoute>
              <CreatePage />
            </ProtectedRoute>
          } />
          {/* Update the path for the Note component to include the note ID */}
          <Route path="/note/:id" element={
            <ProtectedRoute>
              <Note />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
