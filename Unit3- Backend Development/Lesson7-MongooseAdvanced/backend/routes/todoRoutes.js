// routes/todoRoutes.js
const express = require('express');
const router = express.Router();
const {
  createTodo,
  getTodos,
  getTodoById,
  updateTodo,
  deleteTodo,
} = require('../controllers/todoController');

// Define routes for CRUD operations
router.post('/', createTodo); // Create a new todo
router.get('/', getTodos); // Get all todos
router.get('/:id', getTodoById); // Get a todo by ID
router.put('/:id', updateTodo); // Update a todo by ID
router.delete('/:id', deleteTodo); // Delete a todo by ID

module.exports = router;
