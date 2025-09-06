const app = require('./app');
const { connectKafka } = require('./config/kafka');
const { consumeResponses } = require('./services/response.service');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await connectKafka();
    await consumeResponses(); // inicia consumer Kafka
    app.listen(PORT, () => logger.info(`Server running at http://localhost:${PORT}`));
  } catch (err) {
    logger.error('Failed to start app', err);
    process.exit(1);
  }
}

start();