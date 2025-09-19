import database from '../config/database';
import { Command } from '../model/command.model';

async function truncateCommands() {
  return database.table('paper_valuation_command').delete().run();
}

async function insertCommands(data:Command[]) {
  return database.table('paper_valuation_command').insert(data);
}

async function watchChangesCommand(callback:any) {
  const cursor = await database.table('paper_valuation_command').changes().run();
  cursor.each((err:any, change:any) => {
    if (err) {
      console.error('Error in changefeed', err);
      return;
    }
    if (change.new_val) callback(change.new_val);
  });
  return cursor;
}


export { insertCommands, watchChangesCommand, truncateCommands };
