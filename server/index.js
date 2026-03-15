import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// In-memory data (resets when server restarts)
let todos = [
  { id: 1, text: "Do Homework for CS565 FullStack", done: false },
  { id: 2, text: "Get mail from mailbox", done: true },
];
let nextId = 3;

// POST create
app.post("/api/todos", (req, res) => {
  const text = (req.body?.text ?? "").trim();
  if (!text) return res.status(400).json({ error: "Text is required" });

  const todo = { id: nextId++, text, done: false };
  todos.unshift(todo);
  res.status(201).json(todo);
});

// GET all
app.get("/api/todos", (req, res) => {
  res.json(todos);
});

// PATCH toggle/update
app.patch("/api/todos/:id", (req, res) => {
  const id = Number(req.params.id);
  const todo = todos.find((t) => t.id === id);
  if (!todo) return res.status(404).json({ error: "Not found" });

  if (typeof req.body.done === "boolean") todo.done = req.body.done;

  if (typeof req.body.text === "string") {
    const newText = req.body.text.trim();
    if (!newText)
      return res.status(400).json({ error: "Text cannot be empty" });
    todo.text = newText;
  }

  res.json(todo);
});

// DELETE
app.delete("/api/todos/:id", (req, res) => {
  const id = Number(req.params.id);
  const before = todos.length;
  todos = todos.filter((t) => t.id !== id);
  if (todos.length === before)
    return res.status(404).json({ error: "Not found" });
  res.status(204).send();
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
