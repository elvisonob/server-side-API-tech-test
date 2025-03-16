import express from 'express';
import { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import getGithubDetails from './routes/githubRoutes.js';
import cors from 'cors';

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());

app.use('/api/github', getGithubDetails);

app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `The requested URL ${req.originalUrl} was not found on this server.`,
  });
});

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(error);
  }
  res.status(error.code || 500).json({
    error: 'Internal Server Error',
    message: error.message || 'An unknown error occurred',
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
