import express from 'express';
import { toolsRouter } from './routes/tools.routes.js';
import { requestLogger } from './middleware/request-logger.js';
import { notFound } from './middleware/not-found.js';
import { errorHandler } from './middleware/error-handler.js';

export const app = express();

// Express runs these from top to bottom, for every request.
// express.json() has to come before the router, or req.body is undefined in your routes.
app.use(requestLogger);
app.use(express.json());

app.use('/api/tools', toolsRouter);

// These two stay last. notFound runs when no route above matched,
// and errorHandler runs when something above threw an error.
app.use(notFound);
app.use(errorHandler);
