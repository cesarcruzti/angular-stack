const { consumeMessages } = require('../config/kafka');
const responseRepo = require('../repositories/response.repository');
const logger = require('../utils/logger');

const RESPONSE_TOPIC = 'asset.management.producer.paper.valuation.response';

async function consumeResponses() {
  await consumeMessages(RESPONSE_TOPIC, async (message) => {
    const data = JSON.stringify(message);
    await responseRepo.insert(data);
    logger.info(`Response saved: ${data}`);
  });
}

module.exports = { consumeResponses };
