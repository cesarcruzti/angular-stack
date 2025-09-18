import { Request, Response } from "express";

import { sendCommand } from '../services/command.service';

async function sendCommandController(req:Request, res:Response) {
  try {
    await sendCommand(req.body, req.headers);
    res.status(200).json({ status: 'Commands sent successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send commands' });
  }
}

export { sendCommandController as sendCommand };