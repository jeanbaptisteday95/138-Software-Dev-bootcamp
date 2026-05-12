const express = require('express');
const termData = require('./terms.json');

const PORT = 3001;

const app = express();


// GET route to get all of the terms
app.get('/api/terms/', (req, res) => res.json(termData));

// GET route that returns any specific term 
// http://localhost:3001/api/terms/JOHN. req.params = {term:JOHN}

app.get('/api/terms/:term', (req, res) => {
  // Coerce the specific search term to lowercase
  console.log(req.params);
  const requestedTerm = req.params.term.toLowerCase();

  // Iterate through the terms name to check if it matches `req.params.term`
  for (let i = 0; i < termData.length; i++) {
    if (requestedTerm === termData[i].term.toLowerCase()) {
      return res.json(termData[i]);
    }
  }

  // Return a message if the term doesn't exist in our DB
  return res.json('No match found');
});

// Fallback route for when a user attempts to visit routes that don't exist catch-all-route
app.get('*', (req, res) =>
  res.send(
    `Make a GET request using Insomnia to <a href="http://localhost:${PORT}/api/terms">http://localhost:${PORT}/api/terms</a>`
  )
);

// Listen for connections
app.listen(PORT, () =>
  console.info(`Example app listening at http://localhost:${PORT}`)
);
