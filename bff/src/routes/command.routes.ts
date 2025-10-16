import express from 'express';
import { sendCommand, getPerformanceHistory } from '../controllers/command.controller';

const router = express.Router();
router.post('/command', sendCommand);
router.get('/performance-history', getPerformanceHistory);

export default router;