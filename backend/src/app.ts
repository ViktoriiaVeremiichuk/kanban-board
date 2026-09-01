import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { notFoundHandler } from './middleware/notFoundHandler.ts';
import { errorHandler } from './middleware/errorHandler.ts';
import boardsRoutes from './routes/boardsRoutes.ts';
import cardsRoutes from './routes/cardsRoutes.ts';

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'https://kanban-board-rouge-tau.vercel.app',
    ],
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  }),
);
app.use(helmet());

app.use('/api/boards', boardsRoutes);
app.use('/api/boards', cardsRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;

// 'https://kanban-board-rouge-tau.vercel.app'
