import express, { json } from 'express';
import fs from 'fs';

const app = express();
const port = 3000;

app.use(express.json());
app.set('json spaces', 2); // Enables 2-space indentation for all res.json()
app.set("view engine", "ejs");
app.set("views", "./views");

let tasks = [];

if (fs.existsSync("tasks.json")) {
  const data = fs.readFileSync('tasks.json', 'utf-8');
  tasks = JSON.parse(data);
  console.log("✅ Tasks loaded from file");
}

app.get('/', (req, res) => {
  res.send(`<a href = "/tasks">Press here to view tasks</a>`);
});

app.get("/tasks", (req, res) => {
  res.render("tasks", { tasks });
});

app.get("/api/tasks", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;

  const start = (page - 1) * limit;
  const end = start + limit;

  const paginatedTasks = tasks.slice(start, end);

  res.json({
    page,
    limit,
    total: tasks.length,
    tasks: paginatedTasks,
  });

  const { completed, sort } = req.query;

  let result = [...tasks];

  if (completed === "true") {
    result = result.filter((task) => task.completed === true);
  } else if (completed === "false") {
    result = result.filter((task) => task.completed === false);
  }

  if (sort === "asc") {
    result.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sort === "desc") {
    result.sort((a, b) => b.title.localeCompare(a.title));
  }

  res.json(result);
});


app.get('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find(task => task.id === id);

  if (!task) {
    return res.status(404).send("Task not found"); // Error handling
  };

  res.json(task);
});

app.get('/save', (req, res) => {
  try {
    fs.writeFileSync("tasks.json", JSON.stringify(tasks, null, 2));
  res.send("✅ Tasks saved to tasks.json");
  } catch {
    res.status(500).send("Error saving tasks");
  }
});

app.post('/tasks', (req, res) => {
  const title = req.body.title;
  
  if (!title || title.trim() === "") {
    return res.status(400).json({
      error: "Title is required"
    });
  }

  const newTask = {
    id: tasks.length + 1,
    title,
    completed: false 
  }
  tasks.push(newTask);

  res.status(201).json(newTask);
});

app.put('/tasks/:id' , (req, res) => {
  const id = parseInt(req.params.id);
  const { title, completed} = req.body;

  const task = tasks.find(task => task.id === id);

  if (!task) {
    return res.status(404).json({
      error: "Task not found"
    });
  }

  task.title = title;
  task.completed = completed;
  
  res.json(task);
});

// Dynamic PATCH
app.patch('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find(task => task.id === id);

  if (!task) {
    return res.status(404).json({
      error: "Task not found",
    });
  }

  Object.assign(task, req.body);

  res.json(task);
});

// Specific PATCH route
app.patch('/tasks/:id/complete', (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find(task => task.id === id);

  if (!task) {
    return res.status(404).json({
      error: "Task not found"
    });
  }

  task.completed = true; // forced to be true

  res.json(task);
});

app.delete('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.findIndex((task) => task.id === id);

  if (!task === -1) {
    return res.status(404).send("Task not found");
  };

  const deletedTask = tasks.splice(task, 1);
  
  res.json({
    message: "Task deleted successfully",
    deleted: deletedTask[0]
  });
});

app.listen(port, () => {
  console.log(`You are now online at http://localhost:${port}`);
});


