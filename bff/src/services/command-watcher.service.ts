import { watchChangesCommand } from '../repositories/command.repository';
import { sendMessage } from '../config/kafka';
import { Command } from '../model/command.model';
import { info, error } from '../utils/logger';

async function startWatchingCommands() {
  info('Starting to watch for command changes...');
  try {
    await watchChangesCommand((command: Command) => {
      sendMessage(command);
    });
    info('Successfully watching for command changes.');
  } catch (err) {
    error('Failed to start watching for command changes', err);
    throw err;
  }
}

export { startWatchingCommands };
