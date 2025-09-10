import { Request, Response } from 'express';
import { watchChanges, watchProgress } from '../repositories/response.repository';
import { Progress } from '../model/progress.model';

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
    
    cursor = await watchChanges((data:any) => {
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
      let pending = data.pending-data.running;
      let running = data.running-data.processed-data.failed;
      if(running < 0) running=0;
      let processed = data.processed;
      let failed = data.failed;
      let progress:Progress = {pending, running, processed, failed, start: data.start, end: data.end}
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
