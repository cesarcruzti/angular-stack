import { sendMessage } from '../config/kafka';
import { Command } from '../model/command.model';
import { updateProgress } from '../repositories/response.repository';
import { daysSinceEpoch } from '../utils/datetime';
const { v4: uuidv4 } = require('uuid');

const COMMAND_TOPIC = 'asset.management.consumer.paper.valuation.command';

async function send(commands:Command[]) {
  updateProgress({pending: commands.length, running: 0, processed: 0, failed: 0});
  let referenceDate = daysSinceEpoch();
  commands.forEach(async c=>{
    let key = uuidv4();
    const command:any = { 
        commandId: key,
        initialEntity:  c.initialEntity, 
        finalEntity: c.finalEntity, 
        referenceDate
    };
    await sendMessage(COMMAND_TOPIC, key, command);
  })
}

export { send };
