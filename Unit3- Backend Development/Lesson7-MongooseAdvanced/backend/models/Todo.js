const mongoose = require('mongoose');

// Todo Schema definition
const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true, // Validation: Title must be provided
    trim: true, // Removes leading and trailing spaces
  },
  description: {
    type: String,
    required: [true, 'Description is required'], // Validation: Description must be provided
    minlength: [5, 'Description must be at least 5 characters long'], // Validation: Minimum length
    maxlength: [500, 'Description must be less than 500 characters'], // Validation: Maximum length
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
