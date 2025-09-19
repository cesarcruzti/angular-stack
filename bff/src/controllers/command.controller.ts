import { Request, Response } from "express";

import { saveCommands } from '../services/command.service';

async function sendCommandController(req:Request, res:Response) {
  try {
    await saveCommands(req.body,
      getHeader(req, 'Traceparent'),
      getHeader(req, 'Correlationid'));
    res.status(200).json({ status: 'Commands sent successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send commands' });
  }
}

function getHeader(req: Request, name: string): string | undefined {
  const value = req.headers[name.toLocaleLowerCase()];
  return Array.isArray(value) ? value[0] : value;
}

export { sendCommandController as sendCommand };