import api from './api';
import { connectKafka } from './config/kafka';
import { consumeResponses } from './services/response.service';
import {info, error}  from './utils/logger';

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await connectKafka();
    await consumeResponses();
    api.listen(PORT, () => info(`Server running at http://localhost:${PORT}`));
  } catch (err) {
    error('Failed to start app', err);
    process.exit(1);
  }
}

start();