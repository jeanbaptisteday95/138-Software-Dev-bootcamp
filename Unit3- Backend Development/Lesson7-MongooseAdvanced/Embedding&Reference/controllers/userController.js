const User = require('../models/User');

// Create a new user
const createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all users with filtering, sorting, and pagination
const getUsers = async (req, res) => {
  try {
    const { name, age, sortBy = 'name', order = 'asc', page = 1, limit = 2 } = req.query;
    const filter = {};
    if (name) filter.name = new RegExp(name, 'i'); // Case-insensitive filtering
    if (age) filter.age = age;
    const sortDirection = order === 'asc' ?  1 : -1 ;
    const sortOption = {};
    sortOption[sortBy] = sortDirection;

    const users = await User.find(filter)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {createUser, getUsers};
