# Lab 3: Backend API Exercise

## Overview

This lab is a full technical exercise designed to give you a thorough practice of Unit 3 Backend Development skills. Build a REST API using Node.js, Express, and Mongoose. The lab is expected

## Goal

Create an API for a small content management system for an online study group portal. The portal stores information about study sessions, student notes, and optional resources. Your API should allow clients to perform CRUD operations, search for sessions, and manage related notes.

## What to build

You will create a backend service with the following responsibilities:

- Define Mongoose models for `Session`, `Note`, and `Resource`
- Build Express routes for creating, reading, updating, and deleting sessions
- Add nested routes for notes attached to a session
  - A nested route means the note routes include the parent session ID in the path, for example `/sessions/:sessionId/notes`
- Add support for searching and filtering session data
- Implement validation, error handling, and basic request logging
- Research and implement one advanced Mongoose or API pattern not shown in the main lessons

## Requirements

### 1. Project setup

- Initialize a new Node.js project with `npm init -y`
- Install required dependencies: `express`, `mongoose`, `dotenv`, and any other helpers you choose
- Create an entrypoint file such as `server.js` or `app.js`
- Use `.env` to store database URI and port settings

### 2. MongoDB schema design

Create these schemas:

#### `Session`

- `title` (string, required)
- `date` (Date, required)
- `topic` (string, required)
- `duration` (number, minutes)
- `level` (string, one of `beginner`, `intermediate`, `advanced`)
- `resources` (array of subdocuments or ObjectIds referencing `Resource`)
- `createdAt` (Date, default now)

#### `Note`

- `sessionId` (ObjectId, required, references `Session`)
- `author` (string, required)
- `text` (string, required)
- `type` (string, one of `tip`, `question`, `summary`)
- `createdAt` (Date, default now)

#### `Resource`

- `name` (string, required)
- `url` (string, required)
- `category` (string, e.g. `article`, `video`, `tool`)
- `session` (ObjectId, optional reference to `Session`)

### 3. API routes

Build the following routes using Express:

#### Sessions

- `GET /sessions` — return all sessions
- `GET /sessions/:id` — return one session by id
- `POST /sessions` — create a new session
- `PUT /sessions/:id` — update a session
- `DELETE /sessions/:id` — delete a session

#### Notes

- `GET /sessions/:sessionId/notes` — list notes for a session
- `POST /sessions/:sessionId/notes` — add a new note to a session
- `DELETE /sessions/:sessionId/notes/:noteId` — delete a note

#### Resources

- `GET /resources` — list all resources
- `POST /resources` — add a resource
- `GET /resources?category=video` — filter resources by category

### 4. Search and filtering

Add at least one query feature:

- Search sessions by `topic` or `title` using query string parameters
- Filter sessions by `level`

Example: `/sessions?search=security&level=advanced`

### 5. Validation and error handling

- Validate request payloads before saving to MongoDB
- Return meaningful HTTP status codes: `400`, `404`, `500`, etc.
- Report validation errors from Mongoose in the response body

### 6. Extra Challenge

- Enable CORS so a frontend can call the API. Search for `express cors` and the `cors` package.
- Add a `GET /sessions/stats` endpoint that returns summary statistics such as total sessions, average duration, and sessions per level. Search for `mongoose aggregate`.
- Implement `GET /sessions/:id/summary` that returns notes count and resources count.
- Add a `DELETE /resources/:id` route and ensure session relationships are updated correctly. This means when a resource is removed, any session that referenced it should be updated so it no longer includes the deleted resource. Search for `mongoose pull from array`, `findByIdAndDelete`, and updating related documents after deletion`.

### 7. Example behavior

Example request and response flows:

#### Create a session

Request:

```
POST /sessions
Content-Type: application/json

{
  "title": "API Design Lab",
  "date": "2026-05-20",
  "topic": "Node.js REST APIs",
  "duration": 110,
  "level": "intermediate"
}
```

Response:

```
201 Created
{
  "_id": "642d4f9f4c3f8b6a2e9e7b2c",
  "title": "API Design Lab",
  "date": "2026-05-20T00:00:00.000Z",
  "topic": "Node.js REST APIs",
  "duration": 110,
  "level": "intermediate"
}
```

#### Search sessions

Request:

```
GET /sessions?search=APIs&level=intermediate
```

Response:

```
200 OK
[
  {
    "_id": "642d4f9f4c3f8b6a2e9e7b2c",
    "title": "API Design Lab",
    "topic": "Node.js REST APIs",
    "level": "intermediate"
  }
]
```

#### Get session notes

Request:

```
GET /sessions/642d4f9f4c3f8b6a2e9e7b2c/notes
```

Response:

```
200 OK
[
  {
    "_id": "643b6a33c5f4d1d28a002c71",
    "author": "Amina",
    "text": "Remember to validate request data before saving.",
    "type": "tip"
  }
]
```

## Notes

- You do not need to build a frontend for this lab.
- Focus on clear API design, maintainable code, and good error responses.
- Write code as if this API will be used by a frontend app
