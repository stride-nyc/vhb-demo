import express, { Request, Response } from 'express';
import cors from 'cors';
import { COLLISIONS } from './data/collision-store';

const app = express();

app.use(cors({ origin: 'http://localhost:4200' }));
app.use(express.json());

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/hello', (_req: Request, res: Response) => {
  res.json({ message: 'Hello from the Node.js backend!' });
});

app.get('/api/collision/:id', (req: Request, res: Response) => {
  const collision = COLLISIONS[req.params.id as string];
  if (!collision) {
    res.status(404).json({ error: 'Collision not found' });
    return;
  }
  res.json(collision);
});

app.patch('/api/collision/:id/coding-comment', (req: Request, res: Response) => {
  const collision = COLLISIONS[req.params.id as string];
  if (!collision) {
    res.status(404).json({ error: 'Collision not found' });
    return;
  }
  const { codingComment } = req.body as { codingComment: unknown };
  if (typeof codingComment !== 'string') {
    res.status(400).json({ error: 'codingComment must be a string' });
    return;
  }
  collision.codingComment = codingComment;
  res.json({ codingComment });
});

export default app;
