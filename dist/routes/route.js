import express from 'express';
import userName from '../controllers/controller.js';
const router = express.Router();
router.get('/repositories', userName);
export default router;
