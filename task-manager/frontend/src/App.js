import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    isDone: false,
  });
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchTasks = () => {
    let url = 'http://localhost:3001/tasks';

    if (statusFilter !== 'all') {
      url += `?status=${statusFilter === 'done'}`;
    }

    if (search) {
      url = `http://localhost:3001/tasks/search?query=${encodeURIComponent(search)}`;
    }

    axios
      .get(url)
      .then((res) => setTasks(res.data))
      .catch((err) => console.error('Ошибка при получении задач:', err));
  };

  useEffect(() => {
    fetchTasks();
  }, [statusFilter, search]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editId) {
      axios
        .put(`http://localhost:3001/tasks/${editId}`, form)
        .then(() => {
          setEditId(null);
          setForm({ title: '', description: '', isDone: false });
          fetchTasks();
        })
        .catch((err) => console.error('Ошибка при обновлении задачи:', err));
    } else {
      axios
        .post('http://localhost:3001/tasks', form)
        .then(() => {
          setForm({ title: '', description: '', isDone: false });
          fetchTasks();
        })
        .catch((err) => console.error('Ошибка при создании задачи:', err));
    }
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:3001/tasks/${id}`)
      .then(() => fetchTasks())
      .catch((err) => console.error('Ошибка при удалении задачи:', err));
  };

  return (
    <div className="app-container">
      <h1 className="app-header">📋 Task Manager</h1>

      <div className="filter-search">
        <input
          type="text"
          placeholder="Поиск по заголовку или описанию"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input-field"
        >
          <option value="all">Все задачи</option>
          <option value="done">Выполненные</option>
          <option value="not-done">Невыполненные</option>
        </select>
      </div>

      <form onSubmit={handleSubmit} className="task-form">
        <input
          type="text"
          placeholder="Заголовок"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
          className="input-field"
        />
        <textarea
          placeholder="Описание"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="input-field"
        />
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={form.isDone}
            onChange={(e) => setForm({ ...form, isDone: e.target.checked })}
          />{' '}
          Задача выполнена
        </label>
        <button type="submit" className="submit-btn">
          {editId ? 'Сохранить изменения' : 'Создать задачу'}
        </button>
      </form>

      {tasks.length === 0 ? (
        <p>Задач пока нет.</p>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task.id} className="task-item">
              <div style={{ flex: 1 }}>
                <strong>{task.title}</strong> – {task.description}{' '}
                ({task.isDone ? '✅ выполнена' : '❌ не выполнена'})
              </div>
              <div className="task-actions">
                <button
                  className="edit-btn"
                  onClick={() => {
                    setForm({
                      title: task.title,
                      description: task.description,
                      isDone: task.isDone,
                    });
                    setEditId(task.id);
                  }}
                >
                  ✏
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(task.id)}
                >
                  🗑
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
