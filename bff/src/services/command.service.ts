import { sendMessage } from '../config/kafka';
const { v4: uuidv4 } = require('uuid');

const COMMAND_TOPIC = 'asset.management.consumer.paper.valuation.command';

async function send({ initialEntity, finalEntity, referenceDate }:any) {
  const command:any = { commandId: uuidv4(), initialEntity, finalEntity, referenceDate };
  await sendMessage(COMMAND_TOPIC, command);
  return command.commandId;
}

module.exports = { send };
