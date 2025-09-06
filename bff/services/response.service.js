const { consumeMessages } = require('../config/kafka');
const {insert, updateProgress} = require('../repositories/response.repository');
const logger = require('../utils/logger');

const RESPONSE_TOPIC = 'asset.management.producer.paper.valuation.response';

async function consumeResponses() {
  await consumeMessages(RESPONSE_TOPIC, async (message) => {
    await updateProgress(message.status);
    const data = JSON.stringify(message);
    await insert(data);
    logger.info(`Response saved: ${data}`);
  });
}

module.exports = { consumeResponses };
