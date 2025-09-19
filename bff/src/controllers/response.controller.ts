import { Request, Response } from 'express';
import { Progress } from '../model/progress.model';
import { watchChangesResponse } from '../repositories/response.repository';
import { watchProgress } from '../repositories/progress.repository';

async function streamResponses(req:Request, res:Response) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const interval = setInterval(() => {
    res.write(`: ping\n\n`);
  }, 15000);

  let cursor:any;
  try {
    
    cursor = await watchChangesResponse((data:any) => {
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    });
  } catch (err) {
    res.write(`data: ${JSON.stringify({ error: 'Failed to init stream' })}\n\n`);
    res.end();
  }

  req.on('close', () => {
    clearInterval(interval);
    if (cursor) cursor.close();
    res.end();
  });
}

async function streamProgress(req:Request, res:Response) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const interval = setInterval(() => {
    res.write(`: ping\n\n`);
  }, 15000);

  let cursor:any;
  try {
    cursor = await watchProgress((data:any) => {
      const progress: Progress = {
        pending: data.pending - data.running,
        running: Math.max(0, data.running - data.processed - data.failed),
        processed: data.processed,
        failed: data.failed,
        start: data.start,
        end: data.end,
        expected: data.expected,
      };
      res.write(`data: ${JSON.stringify(progress)}\n\n`);
    });
  } catch (err) {
    res.write(`data: ${JSON.stringify({ error: 'Failed to init stream' })}\n\n`);
    res.end();
  }
  
  req.on('close', () => {
    clearInterval(interval);
    if (cursor) cursor.close();
    res.end();
  });
}

export { streamResponses, streamProgress };
