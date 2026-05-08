---
marp: true
theme: default
paginate: true
---

![](../../resources/images/circuitstream_logo.png)
# Software Development Bootcamp

## Unit 3: Backend Development

### Lesson 4: Express.js Routing and Request Handling

### Gurneesh Singh

---

# Agenda

<div style="font-size: 20px;">

- Recap (HTTP Methods Review)
- Section 1: Routing in Express (What, Why, How)
    - Basic Routing (`app.METHOD(PATH, HANDLER)`)
    - The `req` and `res` Objects revisited
    - Activity: Simple Routing

---    
- Section 2: Query Strings and Parameters
    - What are Query Strings? (`?key=value&key2=value2`)
    - What are Route Parameters? (`/users/:userId`)
    - Accessing them in Express (`req.query`, `req.params`)
    - Activity: Extracting Data
- Section 3: RESTful Routes (Conceptual Introduction & Mock API)
    - Brief review of REST concepts
    - Applying HTTP methods (GET, POST, PUT, DELETE) with Express routes
    - Activity: Bookstore Mock API (CRUD operations using routes, params, queries)
- Summary & Key Takeaways

</div>

---

# Learning Objectives

At the end of this class, you will be able to:

*   Handle HTTP requests using Express route handlers.
*   Create different routes for various URL paths and HTTP methods.
*   Extract data from query strings (`req.query`).
*   Extract data from route parameters (`req.params`).
*   Structure API endpoints following basic RESTful principles (using a mock setup).

---

# **Recap: HTTP Methods**

*   Quick review of HTTP methods learned in Unit 2:
    *   **GET:** Retrieve data (e.g., view a webpage, get a list of items).
    *   **POST:** Send data to create a new resource (e.g., submit a form, add a new item).
    *   **PUT:** Send data to update an existing resource completely.
    *   **DELETE:** Remove a resource.
*   **Connection:** Express provides an elegant way to define how our server responds to each of these methods for specific URL paths.

---

# **Section 1: Routing in Express**

---

# **Why Routing?**

*   When a browser sends a request to your server (e.g., `http://yourserver.com/products` or `http://yourserver.com/users/123`), how does the server know what code to execute?
*   **Routing** is the process of determining how an application responds to a client request to a particular endpoint, which is a URI (or path) and a specific HTTP request method (GET, POST, etc.).
*   Express helps us define these "routes" easily.
    *   Example: A request to `GET /home` might show the homepage.
    *   A request to `POST /submit-form` might process form data.

---

# **Basic Routing Syntax**

The basic structure for defining routes in Express is:

```javascript
app.METHOD(PATH, HANDLER)
```

Where:
*   `app` is an instance of Express.
*   `METHOD` is an HTTP request method, in lowercase (e.g., `get`, `post`, `put`, `delete`).
*   `PATH` is a path on the server (e.g., `'/'`, `'/about'`, `'/api/users'`).
*   `HANDLER` is the function executed when the route is matched. This function typically takes two arguments: `request` (`req`) and `response` (`res`).

---

# **The Request (`req`) and Response (`res`) Objects (Brief Review)**

<div style="font-size: 20px;">

When a route handler function is executed, it receives two important objects:

*   **`req` (Request Object):**
    *   Represents the incoming HTTP request.
    *   Contains information about the request, such as:
        *   URL path (`req.path`)
        *   HTTP method (`req.method`)
        *   Headers (`req.headers`)
        *   Query strings (`req.query`) - *We'll cover this soon!*
        *   Route parameters (`req.params`) - *And this too!*
        *   Request body (`req.body`) - *For POST/PUT requests, covered later with middleware.*
---

*   **`res` (Response Object):**
    *   Represents the HTTP response that the Express app sends when it gets an HTTP request.
    *   Used to send data back to the client (browser).
    *   Common methods: `res.send()`, `res.json()`, `res.status()`, `res.render()`.

</div>

---

# **Simple Routing Example**

<div style="font-size: 20px;">

Let's see a basic Express server with a couple of simple routes:

```javascript
// server.js
import express from 'express';
const app = express();
const PORT = 3000;

// Route for the homepage
app.get('/', (req, res) => {
  res.send('<h1>Welcome to our Homepage!</h1>');
});

// Route for an about page
app.get('/about', (req, res) => {
  res.send('This is the About Us page.');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

</div>

---

# **Activity: Implementing Basic Routes**

<div style="font-size: 20px;">

1.  **Goal:** Add a few simple `GET` routes to a basic Express server.
2.  **Setup:**
    *   Create a new project folder (e.g., `lesson5-routing`).
    *   Initialize npm: `npm init -y`
    *   Install packages: `npm install express` and `npm install --save-dev nodemon`
    *   Add `"type": "module"` to your `package.json`, and a script to run nodemon: `"dev": "nodemon server.js"`
    *   Create a `server.js` file.

---

3.  **Task:**
    *   In `server.js`, set up a basic Express app (import express, create app instance, listen on a port).
    *   Add three `GET` routes:
        *   `/`: Sends back "Welcome to the Main Page!"
        *   `/profile`: Sends back "This is your user profile."
        *   `/contact`: Sends back "Contact us at contact@example.com."
    *   Run your server (e.g., `node server.js` or with `nodemon`).
    *   Test each route in your web browser.

</div>

---

# **Section 2: Query Strings & Parameters**

---

# **Passing Data in URLs: Two Common Ways**

Often, you need to pass specific data or parameters to your server through the URL itself. Two common ways to do this are:

1.  **Query Strings:** For optional parameters, filtering, sorting, or searching.
    *   Example: `/search?keyword=express&category=frameworks`
2.  **Route Parameters:** For identifying specific resources.
    *   Example: `/users/123` (to get user with ID 123)

Express provides easy ways to access data from both.

---

# **Query Strings**

<div style="font-size: 20px;">

*   **Format:** Appended to the URL after a `?` (question mark). Multiple query parameters are separated by `&` (ampersand).
    *   `URL_PATH?key1=value1&key2=value2`
*   **Use Cases:**
    *   Filtering data: `/products?category=electronics&price_max=500`
    *   Sorting results: `/articles?sortBy=date&order=desc`
    *   Search queries: `/search?q=node.js+tutorial`
    *   Pagination: `/items?page=2&limit=10`
*   **Accessing in Express:**
    *   Express parses query strings into an object available at `req.query`.
    *   For `/test?name=Alice&age=30`, `req.query` would be `{ name: 'Alice', age: '30' }`.

---
```javascript
// Example: /greet?name=Bob
app.get('/greet', (req, res) => {
  const name = req.query.name || 'Guest'; // Default to 'Guest' if no name
  res.send(`Hello, ${name}!`);
});
```

</div>

---

# **Route Parameters**

<div style="font-size: 20px;">

*   **Format:** Segments of the URL path that act as placeholders for values. Defined using a colon (`:`) in the route path string.
    *   Example Route Path: `/users/:userId/books/:bookId`
*   **Use Cases:**
    *   Identifying a specific resource: `/products/:productId`
    *   Hierarchical data: `/customers/:customerId/orders/:orderId`
*   **Accessing in Express:**
    *   Express captures the values from these segments and stores them in `req.params` as an object.
    *   For a route `/items/:category/:itemId` and URL `/items/electronics/543`, `req.params` would be `{ category: 'electronics', itemId: '543' }`.
---
```javascript
// Example: /users/123 or /users/jane
app.get('/users/:username', (req, res) => {
  const username = req.params.username;
  res.send(`Profile page for user: ${username}`);
});
```

</div>

---

# **Activity: Extracting Query Strings & Route Parameters**

<div style="font-size: 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">

<div>

**Part 1: Query Strings**
1.  **Goal:** Create a route that uses query string parameters.
2.  **Task:** In your `server.js`:
    *   Add a new `GET` route `/search`.
    *   This route should expect two query parameters: `q` (for the search query) and `sort` (e.g., 'newest', 'oldest').
    *   In the handler, access `req.query.q` and `req.query.sort`.
    *   Send back a response like: "Searching for: [q_value], Sorted by: [sort_value]". If a parameter is missing, provide a default.
    
---
    *   Test with URLs like:
        *   `http://localhost:3000/search?q=express tutorials&sort=newest`
        *   `http://localhost:3000/search?q=javascript` (sort should use default)
</div>

<div>

**Part 2: Route Parameters**
1.  **Goal:** Create a route that uses route parameters.
2.  **Task:** In your `server.js`:
    *   Add a new `GET` route `/posts/:year/:month`.
    *   This route expects `year` and `month` as parameters.
    *   In the handler, access `req.params.year` and `req.params.month`.
    *   Send back a response like: "Displaying posts from [month_value]/[year_value]".
    *   Test with URLs like: `http://localhost:3000/posts/2024/03`
</div>

---

# **Section 3: RESTful Routes (Mock API)**


---

# **What is REST? (Quick Recap)**


<div style="font-size: 20px;">


*   **REST** stands for **RE**presentational **S**tate **T**ransfer.
*   It's an architectural style for designing networked applications (like APIs).
*   **Key Principles for Routes:**
    *   **Resources:** Data is organized into "resources" (e.g., users, products, books). Identified by URIs (like `/books`, `/users/123`).
    *   **HTTP Methods:** Use standard HTTP verbs semantically to perform operations on these resources:
        *   `GET`: Retrieve a resource.
        *   `POST`: Create a new resource.
        *   `PUT`: Update an existing resource (replace entirely).
        *   `DELETE`: Delete a resource.


</div>

---

# **Mapping REST to Express Routes**

<div style="font-size: 20px;">
Here's how common RESTful operations for a "books" resource map to Express:

---

| Action              | HTTP Method | Path             | Express Route                     | Purpose                                  |
|---------------------|-------------|------------------|-----------------------------------|------------------------------------------|
| **Index**           | `GET`       | `/books`         | `app.get('/books', ...)`          | Get a list of all books.                 |
| **Show**            | `GET`       | `/books/:id`     | `app.get('/books/:id', ...)`      | Get a specific book by its ID.         |
| **Create**          | `POST`      | `/books`         | `app.post('/books', ...)`         | Add a new book. (Data in request body) |
| **Update**          | `PUT`       | `/books/:id`     | `app.put('/books/:id', ...)`      | Update a specific book. (Data in body) |
| **Destroy (Delete)**| `DELETE`    | `/books/:id`     | `app.delete('/books/:id', ...)`   | Delete a specific book.                |

*Note: For `POST` and `PUT`, data is typically sent in the *request body*. We'll learn how to parse request bodies with Express middleware in a future lesson. For today's mock API, we might simplify and use query parameters for `POST`/`PUT` data if needed.*

---

# **Activity: Bookstore Mock API**

<div style="font-size: 16px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">

<div>

**Goal:** Create a simple Express app that simulates a bookstore inventory API using RESTful principles.
**Data Storage:** We'll use a simple JavaScript array in memory to store our books (no database for now).

**Resource:** `books` (each book object should have at least `id`, `title`, `author`).

**Initial Data (in `server.js`):**
```javascript
let books = [
  { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald" },
  { id: 2, title: "To Kill a Mockingbird", author: "Harper Lee" },
  { id: 3, title: "1984", author: "George Orwell" }
];
let nextId = 4; // To generate unique IDs for new books
```

---
**Implement the following routes:**

1.  **`GET /books`**:
    *   Responds with JSON of all books in the `books` array.
2.  **`GET /books/:id`**:
    *   Responds with JSON of the single book matching `req.params.id`.
    *   If no book is found, send a 404 status with a "Book not found" message.

</div>

<div>

1.  **`POST /books`**:
    *   *Simulate data intake*: For this exercise, expect `title` and `author` as query parameters (e.g., `/books?title=New Book&author=New Author`).
    *   Create a new book object with a unique `id` (use `nextId++`).
    *   Add it to the `books` array.
    *   Respond with JSON of the newly created book and a 201 status code (Created).
2.  **`PUT /books/:id`**:
    *   *Simulate data intake*: Expect `title` and `author` as query parameters for the updated details.
    *   Find the book by `req.params.id`.
    *   If found, update its `title` and `author`. Respond with JSON of the updated book.
    *   If not found, send a 404 status.
3.  **`DELETE /books/:id`**:
    *   Find the book by `req.params.id`.
    *   If found, remove it from the `books` array. Respond with a success message (e.g., "Book deleted") or a 204 status (No Content).
    *   If not found, send a 404 status.

</div>

---

# **Bookstore Mock API - Code Snippets / Hints**

<div style="font-size: 13px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">

<div>

**Basic Setup (`server.js`):**
```javascript
import express from 'express';
const app = express();
const PORT = 3000;

// (Initial books array and nextId variable here)

// GET /books
app.get('/books', (req, res) => {
  // Your code here
});

// GET /books/:id
app.get('/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id); // Remember IDs might be numbers
  // Find book...
});

// POST /books (using query params for simplicity today)
app.post('/books', (req, res) => {
  const { title, author } = req.query;
  // Create new book, add to array...
  // res.status(201).json(newBook);
});

// PUT /books/:id (using query params for simplicity today)
app.put('/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id);
  const { title, author } = req.query;
  // Find book, update...
});

// DELETE /books/:id
app.delete('/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id);
  // Find book, remove...
  // res.send('Book deleted'); or res.status(204).send();
});

```

</div>

<div>

```javascript

app.listen(PORT, () => {
  console.log(`Bookstore API server running on http://localhost:${PORT}`);
});
```
**Array Methods:**
*   Find: `books.find(book => book.id === bookId)`
*   Find Index: `books.findIndex(book => book.id === bookId)`
*   Remove (if you have index): `books.splice(index, 1)`
*   Filter (to "remove"): `books = books.filter(book => book.id !== bookId)`

</div>

---

# **Summary**

<div style="font-size: 20px;">

Key concepts covered today:

*   **Routing in Express:** Defining how your application responds to requests using `app.METHOD(PATH, HANDLER)`.
*   **HTTP Methods:** Handling `GET`, `POST`, `PUT`, `DELETE` to perform actions.
*   **Request (`req`) & Response (`res`) Objects:** Core to handling incoming data and sending back responses.
*   **Query Strings (`req.query`):** Accessing optional data passed in the URL (e.g., `?key=value`).
*   **Route Parameters (`req.params`):** Accessing values from named segments in the URL path (e.g., `/users/:id`).
*   **RESTful Routes:** Structuring API endpoints by using HTTP methods semantically with resource paths.

</div>

---
