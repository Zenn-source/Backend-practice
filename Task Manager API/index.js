import express, { json } from 'express';
import fs from 'fs';

const app = express();
const port = 3000;

app.use(express.json());
app.set('json spaces', 2); // Enables 2-space indentation for all res.json()


let tasks = [];

if (fs.existsSync("tasks.json")) {
  const data = fs.readFileSync('tasks.json', 'utf-8');
  tasks = JSON.parse(data);
  console.log("✅ Tasks loaded from file");
}

app.get('/', (req, res) => {
  res.send(`<a href = "/tasks">Press here to view tasks</a>`);
});

app.get('/tasks', (req, res) => {
  const filter = req.query.completed;
  
  if(!filter) {
    return res.json(tasks);
  }
  
  const filteredTasks = tasks.filter(task => {
    if (filter === 'true') return task.completed === true;
    if (filter === "false") return task.completed === false;
  });

  res.json(filteredTasks);
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


