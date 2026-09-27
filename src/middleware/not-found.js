// Runs only when no route above it in app.js matched the request.
export function notFound(req, res) {
  res.status(404).json({ error: { message: `No route for ${req.method} ${req.path}` } });
}
