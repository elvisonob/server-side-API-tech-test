import express from 'express';
import bodyParser from 'body-parser';
import getGithubDetails from './routes/route.js';
import cors from 'cors';

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());

app.use('/api/github', getGithubDetails);

const PORT = process.env.PORT || 8080;
app.listen(PORT);
