const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

// Serve images, css files, js files from the public directory
// Allows us to reference files with their relative path
// Example: http://localhost:3001/images/gh.png

// Add a static middleware for serving assets in the public folder
app.use(express.static('public'));

app.get('/images/google', (req, res) => {
  return res.sendFile(path.join(__dirname, 'public/images/google.png'))
})


app.listen(PORT, () =>
  console.log(`Serving static asset routes at http://localhost:${PORT}`)
);
