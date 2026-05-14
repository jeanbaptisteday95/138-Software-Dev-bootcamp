---
marp: true
theme: default
paginate: true
---

![](../../resources/images/circuitstream_logo.png)
# Software Development Bootcamp

## Unit 3: Backend Development

### Lesson 6: Interacting with MongoDB using Mongoose

### Gurneesh Singh

---

# Agenda

<div style="font-size: 20px;">

- Recap (MongoDB Basics)
- Section 1: Introduction to Mongoose
    - What is Mongoose?
    - Why use an ODM?
- Section 2: Setting Up Mongoose
    - Installation
    - Connecting to MongoDB
- Section 3: Schemas and Models
    - Defining Schemas
    - Creating Models
- Section 4: CRUD Operations with Mongoose
    - Create, Read, Update, Delete

</div>

---

# Learning Objectives

At the end of this class, you will be able to:

* Explain what Mongoose is and why it's used.
* Install and set up Mongoose in a Node.js application.
* Define schemas and models using Mongoose.
* Perform CRUD operations using Mongoose models.

---

# Recap: MongoDB Basics

* Quick review of MongoDB concepts:
    * **MongoDB:** NoSQL database for storing data in JSON-like format.
    * **CRUD Operations:** Create, Read, Update, Delete data in the database.

---

# Section 1: Introduction to Mongoose

---

## What is Mongoose?

- Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js.
- Provides a schema-based solution to model your data.
- Manages relationships between data, provides schema validation, and is used to translate between objects in code and the representation of those objects in MongoDB.

---

## Why Use an ODM?

- Simplifies data interaction by providing a higher-level abstraction over MongoDB.
- Enforces data structure through schemas.
- Provides built-in type casting, validation, query building, and business logic hooks.

---

# Section 2: Setting Up Mongoose

---

## Installation

```bash
npm install mongoose
```

- Ensure MongoDB is running locally or remotely.

---

## Connecting to MongoDB

```javascript
import mongoose from 'mongoose';

// connection URL is connecting to the local server, and the database is `mydatabase`
// if it does not exist, it will be created automatically
const connectDB = async () => {
  try {
    await mongoose.connect(connectionString)
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit process with failure
  }
};
```

---

# Section 3: Schemas and Models

---

## Defining Schemas

- Schemas define the structure of documents within a collection.
- Example:

```javascript
const { Schema } = mongoose;

const taskSchema = new Schema({
  title: String,
  completed: Boolean,
  createdAt: { type: Date, default: Date.now }
});
```

---

## Creating Models

- Models are constructors compiled from Schema definitions.
- Example:

```javascript
const Task = mongoose.model('Task', taskSchema);
```

---

# Section 4: CRUD Operations with Mongoose

---

## Create

```javascript

// using save

const newTask = new Task({ title: 'Learn Mongoose', completed: false });
newTask.save().then(() => console.log('Task saved'));

// using create

const newTask = await Task.create({ title: 'Learn Mongoose', completed: false });
console.log(newTask);

```

---

## Read

```javascript
// using find

const tasks = await Task.find({ completed: false });
console.log(tasks);

// using findById

const task = await Task.findById(taskId);
console.log(task);
```
---

## Update

```javascript
// using findByIdAndUpdate - returns the updated document

const updatedTask = await Task.findByIdAndUpdate(taskId, { completed: true }, { new: true });
console.log(updatedTask);

// using updateOne - returns the number of documents updated
const updatedTask = await Task.updateOne({ _id: taskId }, { completed: true });
console.log(updatedTask);
```

---

## Delete

```javascript
// using findByIdAndDelete - returns the deleted document

const deletedTask = await Task.findByIdAndDelete(taskId);
console.log(deletedTask);

// using deleteOne - returns the number of documents deleted
Task.deleteOne({ _id: taskId }).then(() => console.log('Task deleted'));

// findByIdAndDelete - returns the deleted document
const deletedTask = await Task.findByIdAndDelete(taskId);
console.log(deletedTask);

```

---

# Activity: Student API

- Create a simple API for a student database.
- Use Mongoose to interact with MongoDB.
- Use Express to create the API.
- Use Mongoose to create the schema and models.
- Use Thunderclient to test the API.


