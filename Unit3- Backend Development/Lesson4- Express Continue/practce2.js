const express = require("express");
const app = express();
const PORT = process.env.PORT || 3001;

// TODO: Middleware to parse JSON
app.use(express.json());

// TODO: Create a mock database (use an array of objects to represent data)
// Example: let items = [{ id: 1, name: 'Item1', description: 'A sample item' }];
let items = [
  { id: 1, name: "Item1", description: "A sample item" },
  { id: 2, name: "Item2", description: "Another sample item" },
];

// GET route to retrieve all items
app.get("/items", (req, res) => {
  // TODO: Return the list of items from the mock database
  res.json(items);
});

// GET route to retrieve a single item by ID
app.get("/items/:id", (req, res) => {
  // TODO: Extract the ID from the request parameters
  // TODO: Find the item in the database with the given ID
  // TODO: If the item is found, return it; otherwise, send a 404 response
  const id = parseInt(req.params.id);
  const item = items.find((item) => item.id === id);
  if (item) {
    res.json(item);
  } else {
    res.status(404).json({ message: "Item not found" });
  }
});

// POST route to create a new item
app.post("/items", (req, res) => {
  // TODO: Extract data from the request body
  // TODO: Generate a unique ID for the new item
  // TODO: Add the new item to the mock database
  // TODO: Return the newly created item with a 201 status
  const newItem = {
    id: items.length + 1,
    name: req.body.name,
    description: req.body.description,
  };
  items.push(newItem);
  res.status(201).json(newItem);
});

// PUT route to update an existing item by ID
app.put("/items/:id", (req, res) => {
  // TODO: Extract the ID from the request parameters
  // TODO: Find the item in the database with the given ID
  // TODO: Update the item's properties with data from the request body
  // TODO: If the item is found and updated, return the updated item
  // TODO: If the item is not found, send a 404 response
  const id = parseInt(req.params.id);
  const item = items.find((item) => item.id === id);
  if (item) {
    item.name = req.body.name || item.name;
    item.description = req.body.description || item.description;
    res.json(item);
  } else {
    res.status(404).json({ message: "Item not found" });
  }
});

// DELETE route to delete an item by ID
app.delete("/items/:id", (req, res) => {
  // TODO: Extract the ID from the request parameters
  // TODO: Find and remove the item with the given ID from the database
  // TODO: If the item is found and deleted, return a success message
  // TODO: If the item is not found, send a 404 response
  const id = parseInt(req.params.id);
  const itemIndex = items.findIndex((item) => item.id === id);
  if (itemIndex !== -1) {
    const deletedItem = items.splice(itemIndex, 1);
    res.json({ message: "Item deleted", item: deletedItem[0] });
  } else {
    res.status(404).json({ message: "Item not found" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`CRUD app is running at http://localhost:${PORT}`);
});
