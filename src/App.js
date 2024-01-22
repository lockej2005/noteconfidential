import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Front End/login';
import SignUp from './Front End/SignUp';
import Dashboard from './Front End/Dashboard';
import CreatePage from './Front End/Create';
import Note from './Front End/Note';

import './App.css';
require('dotenv').config()

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="/Note" element={<Note />} />
      </Routes>
    </Router>
  );
}

export default App;
