import { consumeMessages } from '../config/kafka';
import { Progress } from '../model/progress.model';
import { updateFieldProgress, watchProgress, insertPerformanceHistory } from '../repositories/progress.repository';
import {insertResponse} from '../repositories/response.repository';
import { error, info } from '../utils/logger';

const RESPONSE_TOPIC = 'asset.management.producer.paper.valuation.response';

async function consumeResponses() {
  await consumeMessages(RESPONSE_TOPIC, async (message:any) => {
    await updateFieldProgress(message.status);
    const data = JSON.stringify(message);
    await insertResponse(data);
  });
}

async function startWatchingProgress() {
  info('Starting to watch for progress changes...');
  try {
    await watchProgress(async (progress: Progress) => {
      if(progress.expected > 0 && progress.processed == progress.expected){
          insertPerformanceHistory(progress.expected, progress.end - progress.start);
      }
    });
    info('Successfully watching for progress changes.');
  } catch (err) {
    error('Failed to start watching for progress changes', err);
    throw err;
  }
}

export { consumeResponses, startWatchingProgress };

