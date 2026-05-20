// controllers/todoController.js
const Todo = require('../models/Todo');

// Create Todo
const createTodo = async (req, res) => {
  try {
    const { title, description } = req.body;
    const newTodo = new Todo({
      title,
      description,
      completed: false,
    });
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (err) {
    if (err.name === 'ValidationError') {
      // Validation error handling
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all Todos
const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find(); // Fetch all todos from database
    res.status(200).json(todos);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get a specific Todo by ID
const getTodoById = async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findById(id);
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.status(200).json(todo);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Update Todo
const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;
    const todo = await Todo.findByIdAndUpdate(
      id,
      { title, description, completed },
      { new: true, runValidators: true } // runValidators ensures validation during update
    );
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.status(200).json(todo);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete Todo
const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findByIdAndDelete(id);
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.status(200).json({ message: 'Todo deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  createTodo,
  getTodos,
  getTodoById,
  updateTodo,
  deleteTodo,
};
