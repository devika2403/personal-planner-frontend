import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ModulePage from './pages/ModulePage';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

axios.defaults.baseURL = API;

function App(){
  const [user, setUser] = useState(()=> {
    const raw = localStorage.getItem('pp_user');
    return raw ? JSON.parse(raw) : null;
  });
  const navigate = useNavigate();

  useEffect(()=> {
    const token = user?.token;
    if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    else delete axios.defaults.headers.common['Authorization'];
  }, [user]);

  const handleLogout = ()=> {
    localStorage.removeItem('pp_user');
    setUser(null);
    navigate('/login');
  }

  return (
    <div className="container">
      <header className="header">
        <h1>Personal Planner</h1>
        <nav className="nav">
          {user ? (
            <>
              <span className="small">Hello, {user.user.name}</span>
              <Link className="link" to="/dashboard">Dashboard</Link>
              <button className="btn" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link className="link" to="/login">Login</Link>
              <Link className="link" to="/register">Register</Link>
            </>
          )}
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={ user ? <Navigate to='/dashboard'/> : <Navigate to='/login'/> } />
          <Route path="/login" element={<Login onAuth={(u)=>{ setUser(u); localStorage.setItem('pp_user', JSON.stringify(u)); }} />} />
          <Route path="/register" element={<Register onAuth={(u)=>{ setUser(u); localStorage.setItem('pp_user', JSON.stringify(u)); }} />} />
          <Route path="/dashboard" element={ user ? <Dashboard /> : <Navigate to="/login" /> } />
          <Route path="/module/:name" element={ user ? <ModulePage /> : <Navigate to="/login" /> } />
        </Routes>
      </main>
    </div>
  );
}

export default App;
