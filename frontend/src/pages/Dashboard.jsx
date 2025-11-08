import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const modules = [
  { key: 'daily', label: "Today's Tasks" },
  { key: 'weekly', label: 'Weekly Planner' },
  { key: 'goals', label: 'Goals' },
  { key: 'journal', label: 'Journal' },
  { key: 'habits', label: 'Habits' },
  { key: 'trips', label: 'Journey Planner' },
];

export default function Dashboard(){
  const [counts, setCounts] = useState({});

  useEffect(()=> {
    const fetch = async () => {
      try {
        const res = await Promise.all(modules.map(m => axios.get('/'+m.key)));
        const obj = {};
        modules.forEach((m,i)=> obj[m.key] = res[i].data.length);
        setCounts(obj);
      } catch (err) {
        console.error(err);
      }
    }
    fetch();
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      <div className="grid">
        {modules.map(m => (
          <div className="card" key={m.key}>
            <h3>{m.label}</h3>
            <p className="small">Count: {counts[m.key] ?? '...'}</p>
            <Link className="link" to={'/module/' + m.key}>Open</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
