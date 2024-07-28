const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 5000;

mongoose.connect('mongodb://localhost:27017/todo', { useNewUrlParser: true, useUnifiedTopology: true });

const TodoSchema = new mongoose.Schema({
  task: String,
  completed: Boolean
});

const TodoModel = mongoose.model('Todo', TodoSchema);

app.use(cors());
app.use(express.json());

app.get('/todos', async (req, res) => {
  const todos = await TodoModel.find();
  res.send(todos);
});

app.post('/todos', async (req, res) => {
  const newTodo = new TodoModel({
    task: req.body.text,
    completed: false
  });
  const todo = await newTodo.save();
  res.json(todo);
});

app.put('/todos/:id', async (req, res) => {
  const { id } = req.params;
  const todo = await TodoModel.findById(id);
  todo.completed = !todo.completed;
  await todo.save();
  res.json(todo);
});

app.delete('/todos/:id', async (req, res) => {
  const { id } = req.params;
  const todo = await TodoModel.findByIdAndDelete(id);
  res.json(todo);
});

app.listen(port, () => {
  console.log(`The server is listening on http://localhost:${port}`);
});
