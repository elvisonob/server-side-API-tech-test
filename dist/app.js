import express from 'express';
import cors from 'cors';
const app = express();
app.use(cors());
app.use('/api/github', getGithubDetails);
const PORT = process.env.PORT || 8080;
app.listen(PORT);
