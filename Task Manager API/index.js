import express, { json } from 'express';

const app = express();
const port = 3000;

app.use(express.json());
app.set('json spaces', 2); // Enables 2-space indentation for all res.json()


let tasks = [
  {
    id: 1,
    title: "Learn Express",
    completed: false,
  },
  {
    id: 2,
    title: "Learn React",
    completed: false,
  },
  {
    id: 3,
    title: "Learn Tailwind",
    completed: false,
  },
];

app.get('/', (req, res) => {
  res.send(`<a href = "/tasks">Press here to view tasks</a>`);
});

app.get('/tasks', (req, res) => {
  res.send(tasks);
});

app.get('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find(task => task.id === id);

  if (!task) {
    return res.status(404).send("Task not found"); // Error handling
  };

  res.json(task);
});


app.post('/tasks', (req, res) => {
  const title = req.body.title;
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


