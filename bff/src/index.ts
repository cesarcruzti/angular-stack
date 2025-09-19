import api from './api';
import { connectKafka, registerSchemas } from './config/kafka';
import { consumeResponses } from './services/response.service';
import { startWatchingCommands } from './services/command-watcher.service';
import {info, error}  from './utils/logger';

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await connectKafka();
    await registerSchemas();
    await consumeResponses();
    await startWatchingCommands();
    api.listen(PORT, () => info(`Server running at http://localhost:${PORT}`));
  } catch (err) {
    error('Failed to start app', err);
    process.exit(1);
  }
}

start();