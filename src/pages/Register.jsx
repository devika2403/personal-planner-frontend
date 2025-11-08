import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Register({ onAuth }){
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/auth/register', { name, email, password });
      onAuth(res.data);
      nav('/dashboard');
    } catch (err) {
      setErr(err.response?.data?.message || 'Error');
    }
  }

  return (
    <div className="form card">
      <h2>Register</h2>
      <form onSubmit={submit}>
        <input className="input" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
        <br/><br/>
        <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <br/><br/>
        <input type="password" className="input" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        <br/><br/>
        <button className="btn" type="submit">Register</button>
        {err && <p className="small">{err}</p>}
      </form>
    </div>
  );
}
