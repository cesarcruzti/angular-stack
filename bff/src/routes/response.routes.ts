import express from 'express';
import { streamResponses, streamProgress } from '../controllers/response.controller';

const router = express.Router();
router.get('/response', streamResponses);
router.get('/progress', streamProgress);

export default router;
