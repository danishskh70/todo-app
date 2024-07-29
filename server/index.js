// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 5000;

// mongoose.connect("mongodb://localhost:27017/todo", { useNewUrlParser: true, useUnifiedTopology: true });
const uri = "mongodb+srv://Dannyskh70:Danny7871@todo.pmtygbr.mongodb.net/?retryWrites=true&w=majority&appName=Todo";

const connectDB = async () => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Increase timeout to 5 seconds
    });
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};
connectDB();

const TodoSchema = new mongoose.Schema({
  text: String,  // Changed from task to text
  completed: Boolean
});

const TodoModel = mongoose.model("Todo", TodoSchema);

app.use(cors());
app.use(express.json());

app.get("/todos", async (req, res) => {
  const todos = await TodoModel.find();
  res.send(todos);
});

app.post("/todos", async (req, res) => {
  const newTodo = new TodoModel({
    text: req.body.text,  // Changed from task to text
    completed: false
  });
  const todo = await newTodo.save();
  res.json(todo);
});

app.put("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const todo = await TodoModel.findById(id);
  todo.completed = !todo.completed;
  await todo.save();
  res.json(todo);
});

app.delete("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const todo = await TodoModel.findByIdAndDelete(id);
  res.json(todo);
});

app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});
