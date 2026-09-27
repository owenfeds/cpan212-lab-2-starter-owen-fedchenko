// Prints one line per request once the response has been sent, for example:
// GET /api/tools?category=garden 200 2ms
export function requestLogger(req, res, next) {
  const started = performance.now();
  res.on('finish', () => {
    const ms = Math.round(performance.now() - started);
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${ms}ms`);
  });
  next();
}
