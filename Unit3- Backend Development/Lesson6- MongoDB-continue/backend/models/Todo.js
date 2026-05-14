const mongoose = require('mongoose');

// Todo Schema definition
const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true, // Removes leading and trailing spaces
  },
  description: {
    type: String,
    trim: true, // Removes leading and trailing spaces
  },
  completed: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true }); // Automatically add createdAt and updatedAt timestamps

// Create a Mongoose model for the Todo schema
const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;
