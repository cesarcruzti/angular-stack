import { Request, Response } from "express";

import { getPerformanceHistory, saveCommands } from '../services/command.service';

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

async function getPerformanceHistoryController(req: Request, res: Response) {
  try {
    const history = await getPerformanceHistory();
    res.status(200).json(history);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get performance history' });
  }
}

function getHeader(req: Request, name: string): string | undefined {
  const value = req.headers[name.toLocaleLowerCase()];
  return Array.isArray(value) ? value[0] : value;
}

export { sendCommandController as sendCommand, getPerformanceHistoryController as getPerformanceHistory };