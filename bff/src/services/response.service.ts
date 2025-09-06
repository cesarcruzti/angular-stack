import { consumeMessages } from '../config/kafka';
import {insert, updateProgress} from '../repositories/response.repository';
import {info} from '../utils/logger';

const RESPONSE_TOPIC = 'asset.management.producer.paper.valuation.response';

async function consumeResponses() {
  await consumeMessages(RESPONSE_TOPIC, async (message:any) => {
    await updateProgress(message.status);
    const data = JSON.stringify(message);
    await insert(data);
    info(`Response saved: ${data}`);
  });
}

export { consumeResponses };
