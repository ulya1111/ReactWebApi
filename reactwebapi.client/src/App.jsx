import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

export default function App() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ id: "", name: "", value: "" });
  const API = "/items";

  useEffect(() => {
    axios.get(API).then(r => setItems(r.data)).catch(console.error);
  }, []);

    const save = async () => {
        try {
            if (form.id) {
                
                await axios.put(`${API}/${form.id}`, {
                    id: form.id,
                    name: form.name,
                    value: form.value,
                });
            } else {
                
                await axios.post(API, {
                    name: form.name,
                    value: form.value,
                });
            }

            setForm({ id: "", name: "", value: "" });

            const r = await axios.get(API);
            setItems(r.data);
        } catch (e) {
            console.error(e);
        }
    };


  const remove = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      const r = await axios.get(API);
      setItems(r.data);
    } catch (e) { console.error(e); }
  };

  return (
    <div className="app-wrapper centered-layout">
      <h1 className="title">CRUD Таблица</h1>

      <div className="form-card">
        <input
          className="input"
          placeholder="Название"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="input"
          placeholder="Значение"
          value={form.value}
          onChange={(e) => setForm({ ...form, value: e.target.value })}
        />
        <button type="button" className="btn" onClick={save}>
            {form.id ? "Обновить" : "Добавить"}
        </button>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Value</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.value}</td>
              <td>
                      <button className="btn edit" onClick={() => setForm({ id: item.id, name: item.name, value: item.value })}>E</button>
                      <button className="btn delete" onClick={() => remove(item.id)}>X</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
