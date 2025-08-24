import express, { json } from 'express';

const app = express();
const port = 3000;

app.use(express.json());

let tasks = [
  {
    id: 1,
    title: "Learn Express",
    completed: false
  }
];

app.get('/', (req, res) => {
  res.send(`<a href = "/tasks">Press here to view tasks</a>`);
});

app.get('/tasks', (req, res) => {
  res.send(tasks);
});

app.get('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find(n => n.id === id);

  if (!task) {
    return res.status(404).send("Task not found");
  };

  res.json(task);
});


app.post('/tasks', (req, res) => {
  const {title, completed} = req.body;
  const newTask = {
    id: tasks.length + 1,
    title,
    completed
  }
  tasks.push(newTask);

  res.status(201).json(newTask);
});

app.listen(port, () => {
  console.log(`You are now online at http://localhost:${port}`);
});


