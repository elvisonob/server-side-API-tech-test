import express from 'express';
import getGitHubName from '../controller/controller.js';

const router = express.Router();

router.get('/repositories', getGitHubName.userName);

export default router;
