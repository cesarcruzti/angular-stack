import { consumeMessages } from '../config/kafka';
import { updateFieldProgress } from '../repositories/progress.repository';
import {insertResponse} from '../repositories/response.repository';

const RESPONSE_TOPIC = 'asset.management.producer.paper.valuation.response';

async function consumeResponses() {
  await consumeMessages(RESPONSE_TOPIC, async (message:any) => {
    await updateFieldProgress(message.status);
    const data = JSON.stringify(message);
    await insertResponse(data);
  });
}

export { consumeResponses };
