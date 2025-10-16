import express from 'express';
import { sendCommand, getPerformanceHistory, getBestPerformance } from '../controllers/command.controller';

const router = express.Router();
router.post('/command', sendCommand);
router.get('/performance-history', getPerformanceHistory);
router.get('/best-performance', getBestPerformance);

export default router;