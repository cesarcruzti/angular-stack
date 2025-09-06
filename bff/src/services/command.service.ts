import { sendMessage } from '../config/kafka';
import { Command } from '../model/command.model';
import { daysSinceEpoch } from '../utils/datetime';
const { v4: uuidv4 } = require('uuid');

const COMMAND_TOPIC = 'asset.management.consumer.paper.valuation.command';

async function send(commands:Command[]) {
  let referenceDate = daysSinceEpoch();
  commands.forEach(async c=>{
    const command:any = { commandId: uuidv4(), initialEntity:c.initialEntity, finalEntity:c.finalEntity, referenceDate };
    await sendMessage(COMMAND_TOPIC, command);
  })
}

export { send };
