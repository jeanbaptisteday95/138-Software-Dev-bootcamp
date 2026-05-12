---
marp: true
theme: default
paginate: true
---

![](../../resources/images/circuitstream_logo.png)

# Software Development Bootcamp  
## Unit 3: Backend Development  
### Lesson 5: Introduction to MongoDB & Basic Operations  
### Gurneesh Singh

---

# Agenda

- Recap (Servers & APIs)
- **Section 1**: Introduction to MongoDB
- **Section 2**: Installing MongoDB & Shell
- **Section 3**: Basic CRUD Operations in MongoDB Shell
- Summary & Questions

---

# Learning Objectives

By the end of the session you can …

1. Explain the role of databases in web applications.
2. Compare SQL and NoSQL databases.
3. Install MongoDB and the MongoDB Shell.
4. Perform basic CRUD operations using the MongoDB Shell.

---

# Recap: Servers & APIs

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem">

<div>

![width:600px](./resources/client-server-db.png)

</div>

<div>

*Client → Server → Database*  

- Browser sends HTTP request to server.  
- Server queries database, builds response, returns JSON/HTML.

</div>

---

# Section 1  
## Introduction to MongoDB

---

### What is MongoDB?

- A NoSQL database for storing data in JSON-like format.
- Flexible schema, document-oriented.
- Pairs well with JavaScript.

---

# SQL vs NoSQL

## 1. SQL Databases (Relational Databases)
SQL databases use a structured, table-based format to store data, with relationships between the tables. They are often referred to as relational databases.

---
### Features:
- **Structured Schema**: SQL databases have a predefined schema that defines how the data is stored.
- **Data Relationships**: Uses relationships (foreign keys) between tables to establish connections.
- **Transactions**: Supports ACID (Atomicity, Consistency, Isolation, Durability) properties to ensure reliable transactions.
- **Query Language**: SQL (Structured Query Language) is used for defining and manipulating data.

### Sql table explanation : https://lh3.googleusercontent.com/_j-DAQG6tx5MwOwhdNFkHMou4fWHRuEbzYr3wEaRClkCnC3W2TR8CnMsAvmVX-rgOICpWX-wrBPc=s1000-w1000

---
### Examples:
- MySQL
- PostgreSQL
- SQLite
- Microsoft SQL Server

---

## 2. NoSQL Databases
NoSQL databases store data in a flexible, schema-less format. They are often referred to as non-relational databases.

### Features:
- **Schema-less**: No strict schema; supports dynamic data models.
- **Data Formats**: Stores data in formats like key-value pairs, documents, wide-columns, or graphs.
- **Horizontal Scaling**: Designed to scale out by adding more servers.
- **Eventual Consistency**: Often prioritizes availability over strict consistency.

---
### Examples:
- MongoDB (Document-based)
- Cassandra (Wide-column)
- Redis (Key-value)

---

### SQL vs NoSQL

| Feature            | SQL (Relational)            | NoSQL (e.g., MongoDB)            |
|--------------------|-----------------------------|----------------------------------|
| Schema             | Fixed, table‑based          | Flexible or schema‑less          |
| Query Language     | SQL                         | Varies (JSON‑like for MongoDB)   |
| Joins              | Native support              | Manual / application‑level       |
| Scaling            | Vertical (bigger server)    | Horizontal (sharding)            |
| ACID Transactions  | Built‑in                    | Limited / optional               |

---

### Understanding Jargon

<div style="display: grid; font-size: 20px; grid-template-columns: 1fr 1fr; gap: 2rem">

<div>

- **Database**: A collection of data.
- **Collection**: A group of documents.
- **Document**: A record in the database.
- **Schema**: A structure for the data in the database.
- **Query Language**: A language for querying the data in the database.
- **SQL**: A language for querying relational databases. aka "Structured Query Language"
- **NoSQL**: A type of database that does not use SQL. aka "not only SQL"

</div>

---
<div>

- **CRUD**: Create, Read, Update, Delete.
- **Join**: A way to combine data from two or more tables.
- **ACID**: Atomicity, Consistency, Isolation, Durability.
- **Atomicity**: All-or-nothing rule. Like a bank transfer - both withdrawal and deposit must happen together, or it is not done at all.

- **Consistency**: Database stays in valid state. Like a library - books must be either on shelf or checked out.

- **Isolation**: Multiple transactions don't interfere. Like multiple people checking out different books.

- **Durability**: Completed transactions are permanent. Like writing in pen - data stays even if power fails.


</div>

---

# Section 2  
## Installing MongoDB & Shell

---

### Installation Steps

<div style="font-size: 20px;">

1. Download MongoDB Community Edition:
   1. https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-windows/
   2. https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x/
2. Note: You need Mac OS 14+ and/or Windows 11 to install the latest version of MongoDB. (Version 8)
   1. If you are on a different OS version, you can either upgrade, or install a previous version of MongoDB.
3. Verify with:

```bash
mongosh --version
```
---
4. Connect to local server (defaults to `mongodb://localhost:27017`). Enter `mongosh` to connect to the MongoDB shell.

5. Install the MongoDB VS Code Extension and connect to your local server.

6. During installation, include installation for mongoDB compass, if you don't see that option, install it from here : [https://www.mongodb.com/try/download/compass](https://www.mongodb.com/try/download/compass)


### Tip: MongoDB installation could be a bit tricky, use this page for instructions: [Steps](https://www.geeksforgeeks.org/mongodb/how-to-install-mongodb-on-windows/)

</div>

---

# Section 3  
## Basic CRUD Operations in MongoDB Shell

Please use the cheatsheet provided!
[Cheetsheet](./mongo.md)

---

### CRUD Command Cheatsheet

| Action | Shell Example |
|--------|---------------|
| **Create** | `db.posts.insertOne({ title: "Hello" })` |
| **Read**   | `db.posts.find({ published: true })` |
| **Update** | `db.posts.updateOne({ _id: id }, { $set: { title: "New" }})` |
| **Delete** | `db.posts.deleteOne({ _id: id })` |

Reference: <https://www.mongodb.com/basics/crud>

---

### Hands-On Exercises

<div style="font-size: 20px;">

1. Student Practice — create a `company` database and `employees` collection.  
2. Individual practice:  
   * Insert three employees docs.
     * `db.employees.insertOne({ name: "John", email: "john@abc.com" })`
   * Query by cohort.  
     * `db.employees.find({ email: "john@abc.com" })`
   * Update a record's `email`.  
     * `db.employees.updateOne({ name: "John" }, { $set: { email: "john@example.com" } })`
   * Delete one record.  
     * `db.employees.deleteOne({ name: "John" })`

</div>

---

# Summary

- MongoDB is a flexible, document-oriented NoSQL database.
- Basic CRUD operations can be performed using the MongoDB Shell.
- Understanding these operations is foundational for building applications with MongoDB.

