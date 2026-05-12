// Practice Exercise: Create a Basic Express App with GET Routes

// 1. TODO: Import the 'express' module to create a server.
const express = require("express");
const app = express();

// 2. TODO: Create a basic route '/' that sends a simple JSON response with a message like 'Hello, Express!'
app.get("/", (req, res) => {
  res.json({ message: "Hello, Express!" });
});

// 3. TODO: Create a new route '/user' that sends a JSON response with the user's name and age (use sample data)
app.get("/user", (req, res) => {
  res.json({ name: "John Doe", age: 25 });
});

// 4. TODO: Set the server to listen on a port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
