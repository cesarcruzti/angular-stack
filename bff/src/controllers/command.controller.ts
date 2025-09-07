import { Request, Response } from "express";

import  { send }  from '../services/command.service';

async function sendCommand(req:Request, res:Response) {
  try {
    const commandId = await send(req.body);
    res.status(200).json({ status: 'Command sent successfully', commandId });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send command' });
  }
}

export { sendCommand };
