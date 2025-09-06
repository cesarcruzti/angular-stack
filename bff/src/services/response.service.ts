import { consumeMessages } from '../config/kafka';
import {insert, updateFieldProgress} from '../repositories/response.repository';

const RESPONSE_TOPIC = 'asset.management.producer.paper.valuation.response';

async function consumeResponses() {
  await consumeMessages(RESPONSE_TOPIC, async (message:any) => {
    await updateFieldProgress(message.status);
    const data = JSON.stringify(message);
    await insert(data);
  });
}

export { consumeResponses };
