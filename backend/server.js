const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const PORT = 5000;
const filePath = './tasks.json';
const cors = require('cors');
app.use(cors());


app.use(bodyParser.json());

// Helper function to read tasks
const readTasks = () => {
  const data = fs.readFileSync(filePath);
  return JSON.parse(data);
};

// Helper function to write tasks
const writeTasks = (tasks) => {
  fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));
};

// Get all tasks
app.get('/tasks', (req, res) => {
  const tasks = readTasks();
  res.json(tasks);
});

// Add a new task
app.post('/tasks', (req, res) => {
  const tasks = readTasks();
  const newTask = {
    id: Date.now(),
    text: req.body.text,
    completed: false,
  };
  tasks.push(newTask);
  writeTasks(tasks);
  res.status(201).json(newTask);
});

// Update a task (toggle complete)
app.put('/tasks/:id', (req, res) => {
  let tasks = readTasks();
  tasks = tasks.map(task =>
    task.id === parseInt(req.params.id) ? { ...task, ...req.body } : task
  );
  writeTasks(tasks);
  res.json(tasks.find(task => task.id === parseInt(req.params.id)));
});

// Delete a task
app.delete('/tasks/:id', (req, res) => {
  let tasks = readTasks();
  tasks = tasks.filter(task => task.id !== parseInt(req.params.id));
  writeTasks(tasks);
  res.sendStatus(204);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
