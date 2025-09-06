import express from 'express';
import { sendCommand } from '../controllers/command.controller';

const router = express.Router();
router.post('/command', sendCommand);

export default router;
