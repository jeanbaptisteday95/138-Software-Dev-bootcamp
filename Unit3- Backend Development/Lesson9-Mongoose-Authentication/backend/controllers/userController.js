const User = require("../models/User");

// Create a new user and hash the password before saving.
// The User model's pre-save hook handles password hashing automatically.
const createUser = async (req, res) => {
  try {
    const { name, email, age, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "Name, email, and password are required." });
    }

    const user = new User({ name, email, age });
    user.password = password;
    await user.save();

    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      age: user.age,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: "Email already exists." });
    }
    res.status(400).json({ error: error.message });
  }
};

// Get all users with filtering, sorting, and pagination.
// For security, we exclude the password hash from the response.
const getUsers = async (req, res) => {
  try {
    const {
      name,
      age,
      sortBy = "name",
      order = "asc",
      page = 2,
      limit = 2,
    } = req.query;

    const filter = {};
    if (name) filter.name = new RegExp(name, "i");
    if (age) filter.age = age;

    const sortDirection = order === "asc" ? 1 : -1;
    const sortOption = {};
    sortOption[sortBy] = sortDirection;

    const query = User.find(filter)
      .select("-passwordHash")
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    if (req.query.includePosts === "true") {
      query.populate("posts");
    }

    const users = await query.exec();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createUser, getUsers };
