## What is MongoDB Shell?

- The MongoDB Shell, often referred to as mongosh, is an interactive JavaScript-based interface for interacting with MongoDB databases. It allows users to execute queries, manage databases, and perform administrative tasks in real time.

The MongoDB Shell is particularly useful for:

- Database Management: Create, read, update, and delete data (CRUD operations).
- Administrative Tasks: Manage collections, indexes, and user roles.
- Scripting and Automation: Write and execute scripts for repetitive tasks.
- Troubleshooting: Debug and analyze database performance or issues.

# MongoDB Shell Commands and CRUD Operations

## Installation Verification
```bash
mongod --version
mongosh --version
```

## Starting and Stopping MongoDB

### Windows
```bash
net start mongodb
net stop mongodb
```

### macOS (Homebrew)
```bash
brew services start mongodb-community
brew services stop mongodb-community
```

### Basic Command to Start mongosh
```bash
mongosh
```

### Connecting to a Specific Database
```bash
mongosh "mongodb://<hostname>:<port>/<database_name>"
```

### Connecting with Authentication
```bash
mongosh "mongodb://<username>:<password>@<hostname>:<port>/<database_name>"
```

### Disconnecting from mongosh
To exit the MongoDB Shell:
```bash
exit
```

## Basic Commands

### Database Operations
- **Show Current Database**
  ```javascript
  db
  ```
- **Switch to a Database**
  ```javascript
  use <database_name>
  ```
- **Show All Databases**
  ```javascript
  show dbs
  ```
- **Drop a Database**
  ```javascript
  db.dropDatabase()
  ```

### Collection Operations
- **Show All Collections**
  ```javascript
  show collections
  ```
- **Create a Collection**
  ```javascript
  db.createCollection("collection_name")
  ```
- **Drop a Collection**
  ```javascript
  db.collection_name.drop()
  ```

## CRUD Operations

### Create
- **Insert a Single Document**
  ```javascript
  db.collection_name.insertOne({ key: "value" })
  ```
- **Insert Multiple Documents**
  ```javascript
  db.collection_name.insertMany([
    { key1: "value1" },
    { key2: "value2" }
  ])
  ```

### Read
- **Find All Documents**
  ```javascript
  db.collection_name.find()
  ```
- **Find Documents with a Query**
  ```javascript
  db.collection_name.find({ key: "value" })
  ```
- **Find One Document**
  ```javascript
  db.collection_name.findOne({ key: "value" })
  ```

### Update
- **Update a Single Document**
  ```javascript
  db.collection_name.updateOne(
    { key: "value" },
    { $set: { key: "new_value" } }
  )
  ```
- **Update Multiple Documents**
  ```javascript
  db.collection_name.updateMany(
    { key: "value" },
    { $set: { key: "new_value" } }
  )
  ```
- **Replace a Document**
  ```javascript
  db.collection_name.replaceOne(
    { key: "value" },
    { key: "replacement_value" }
  )
  ```

### Delete
- **Delete a Single Document**
  ```javascript
  db.collection_name.deleteOne({ key: "value" })
  ```
- **Delete Multiple Documents**
  ```javascript
  db.collection_name.deleteMany({ key: "value" })
  ```

## Dropping Collections and Databases
```javascript
db.collection.drop()        // Drop a collection
db.dropDatabase()           // Drop the current database
```


## Aggregation Example
- **Aggregation Query**
  ```javascript
  db.collection_name.aggregate([
    { $match: { key: "value" } },
    { $group: { _id: "$key", total: { $sum: 1 } } }
  ])
  ```

## Administrative Commands
- **Check Server Status**
  ```javascript
  db.serverStatus()
  ```
- **Show Current Users**
  ```javascript
  db.getUsers()
  ```
- **Create a User**
  ```javascript
  db.createUser({
    user: "username",
    pwd: "password",
    roles: [{ role: "readWrite", db: "database_name" }]
  })
  ```
