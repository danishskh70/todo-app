const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// MongoDB connection URI from environment variable
const uri = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Increase timeout to 5 seconds
    });
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
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
  try {
    const todos = await TodoModel.find();
    res.send(todos);
  } catch (err) {
    console.error('Error fetching todos:', err.message);
    res.status(500).send('Server Error');
  }
});

app.post("/todos", async (req, res) => {
  try {
    const newTodo = new TodoModel({
      text: req.body.text,  // Changed from task to text
      completed: false
    });
    const todo = await newTodo.save();
    res.json(todo);
  } catch (err) {
    console.error('Error creating todo:', err.message);
    res.status(500).send('Server Error');
  }
});

app.put("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await TodoModel.findById(id);
    todo.completed = !todo.completed;
    await todo.save();
    res.json(todo);
  } catch (err) {
    console.error('Error updating todo:', err.message);
    res.status(500).send('Server Error');
  }
});

app.delete("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await TodoModel.findByIdAndDelete(id);
    res.json(todo);
  } catch (err) {
    console.error('Error deleting todo:', err.message);
    res.status(500).send('Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});
