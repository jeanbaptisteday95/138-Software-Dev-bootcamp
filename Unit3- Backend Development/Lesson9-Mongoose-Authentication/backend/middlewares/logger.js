
function requestLogger(req, res, next) {
  const now = new Date().toISOString();
  console.log(`[${now}] ${req.method} ${req.originalUrl}`);
  next(); // pass the control to the next operation in line
};

module.exports = requestLogger;


// middleware -> function that runs in the middle (req, middleware, res)
// next 