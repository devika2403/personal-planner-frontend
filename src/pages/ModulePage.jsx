import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const labels = {
  daily: "Today's Tasks",
  weekly: 'Weekly Planner',
  goals: 'Goals',
  journal: 'Journal',
  habits: 'Habits',
  trips: 'Journey Planner'
};

export default function ModulePage(){
  const { name } = useParams();
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({});
  const [editing, setEditing] = useState(null);

  useEffect(()=> { fetchItems(); }, [name]);

  const fetchItems = async ()=> {
    try {
      const res = await axios.get('/' + name);
      setItems(res.data);
    } catch (err) { console.error(err); }
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await axios.put(`/${name}/${editing._id}`, form);
      } else {
        await axios.post(`/${name}`, form);
      }
      setForm({}); setEditing(null); fetchItems();
    } catch (err) { console.error(err); }
  };

  const startEdit = (it) => { setEditing(it); setForm(it); };
  const remove = async (id) => { if (!confirm('Delete?')) return; await axios.delete(`/${name}/${id}`); fetchItems(); };

  return (
    <div>
      <h2>{labels[name] || name}</h2>
      <div className="card">
        <form onSubmit={submit}>
          <input className="input" placeholder="Title / Name" value={form.title || form.name || ''} onChange={e=> setForm({...form, title: e.target.value, name: e.target.value})} />
          <br/><br/>
          <textarea className="input" placeholder="Details / Notes" value={form.description||form.details||form.content||form.notes||''} onChange={e=> setForm({...form, description: e.target.value, details: e.target.value, content: e.target.value, notes: e.target.value})} />
          <br/><br/>
          <button className="btn" type="submit">{editing ? 'Update' : 'Add'}</button>
          {editing && <button type="button" className="btn" onClick={()=>{ setEditing(null); setForm({}); }}>Cancel</button>}
        </form>
      </div>

      <ul className="list card">
        {items.map(it => (
          <li key={it._id}>
            <div>
              <strong>{it.title || it.name}</strong>
              <div className="small">{it.description || it.details || it.content || it.notes || ''}</div>
            </div>
            <div>
              <button className="btn" onClick={()=> startEdit(it)}>Edit</button>
              <button className="btn" onClick={()=> remove(it._id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
