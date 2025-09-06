const responseRepo = require('../repositories/response.repository');

async function streamResponses(req, res) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  let cursor;
  try {
    cursor = await responseRepo.watchChanges((data) => {
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    });
  } catch (err) {
    res.write(`data: ${JSON.stringify({ error: 'Failed to init stream' })}\n\n`);
    res.end();
  }

  req.on('close', () => {
    if (cursor) cursor.close();
    res.end();
  });
}

async function streamProgress(req, res) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  let cursor;
  try {
    cursor = await responseRepo.watchProgress((data) => {
      pending = data.pending-data.running;
      running = data.running-data.processed-data.failed;
      if(running < 0) running=0;
      processed = data.processed;
      failed = data.failed;
      progress = {pending, running, processed, failed}
      res.write(`data: ${JSON.stringify(progress)}\n\n`);
    });
  } catch (err) {
    res.write(`data: ${JSON.stringify({ error: 'Failed to init stream' })}\n\n`);
    res.end();
  }

  req.on('close', () => {
    if (cursor) cursor.close();
    res.end();
  });
}

module.exports = { streamResponses, streamProgress };
