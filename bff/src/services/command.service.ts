import { sendMessage } from '../config/kafka';
import { Command } from '../model/command.model';
import { updateProgress } from '../repositories/response.repository';
import { daysSinceEpoch } from '../utils/datetime';
import { v4 as uuidv4 } from 'uuid';

const COMMAND_TOPIC = 'asset.management.consumer.paper.valuation.command';

async function send(commands:Command[]) {
  let start = Date.now();
  updateProgress({pending: commands.length, running: 0, processed: 0, failed: 0, start, end: start, expected: commands.length });
  let referenceDate = daysSinceEpoch();

  const sendPromises = commands.map(c => {
    const command:any = { 
        commandId: uuidv4(),
        initialEntity:  c.initialEntity, 
        finalEntity: c.finalEntity, 
        referenceDate
    };
    return sendMessage(COMMAND_TOPIC, command);
  });

  await Promise.all(sendPromises);
}

export { send };
