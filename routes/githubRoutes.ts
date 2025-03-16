import express from 'express';
import searchRepositories from '../controllers/githubController.js';

const router = express.Router();

router.get('/repositories', searchRepositories);

export default router;
