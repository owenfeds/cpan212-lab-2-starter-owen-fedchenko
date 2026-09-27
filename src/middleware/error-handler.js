// Express knows this is an error handler because it has four parameters.
// Keep all four, even though next is never used.
export function errorHandler(err, req, res, next) {
  // express.json() throws an error with this type when the body is not valid JSON.
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: { message: 'Request body must be valid JSON' } });
  }

  // Anything else is a bug. Print the details in your terminal, and send the
  // client a plain message, never the stack trace.
  console.error(err);
  res.status(500).json({ error: { message: 'Internal server error' } });
}
