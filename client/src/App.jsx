import { useEffect, useState } from "react";
import "./App.css";

const API = "http://localhost:5001/api/todos";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadTodos() {
    setLoading(true);
    const res = await fetch(API);
    const data = await res.json();
    setTodos(data);
    setLoading(false);
  }

  useEffect(() => {
    loadTodos();
  }, []);

  async function addTodo(e) {
    e.preventDefault();
    const value = text.trim();
    if (!value) return;

    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: value }),
    });

    if (!res.ok) return;

    const newTodo = await res.json();
    setTodos([newTodo, ...todos]);
    setText("");
  }

  async function toggleTodo(todo) {
    const res = await fetch(`${API}/${todo.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done: !todo.done }),
    });

    if (!res.ok) return;

    const updated = await res.json();
    setTodos(todos.map((t) => (t.id === updated.id ? updated : t)));
  }

  async function deleteTodo(id) {
    const res = await fetch(`${API}/${id}`, { method: "DELETE" });
    if (!res.ok && res.status !== 204) return;
    setTodos(todos.filter((t) => t.id !== id));
  }

  return (
    <div className="page">
      <h1 className="page-title">
        CS565 Full Stack Web Development ToDo Application
      </h1>
      <div className="card">
        <form onSubmit={addTodo} className="row">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a todo..."
          />
          <button type="submit">Add</button>
        </form>

        {loading ? (
          <p>Loading...</p>
        ) : todos.length === 0 ? (
          <p>No todos yet.</p>
        ) : (
          <ul className="list">
            {todos.map((t) => (
              <li key={t.id} className="item">
                <label className="todo">
                  <input
                    type="checkbox"
                    checked={t.done}
                    onChange={() => toggleTodo(t)}
                  />
                  <span className={t.done ? "done" : ""}>{t.text}</span>
                </label>

                <button className="danger" onClick={() => deleteTodo(t.id)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
