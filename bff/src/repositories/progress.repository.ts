import database from '../config/database';
import { Progress } from '../model/progress.model';

async function insertProgress(data:any) {
  return database.table('paper_valuation_progress').insert({ data });
}

async function watchProgress(callback:any) {
  const cursor = await database.table('paper_valuation_progress').changes().run();
  cursor.each((err:any, change:any) => {
    if (err) {
      console.error('Error in changefeed', err);
      return;
    }
    if (change.new_val) callback(change.new_val);
  });
  return cursor;
}

async function updateFieldProgress(field:string) {
  const column = String(field).toLowerCase();
  await database.table('paper_valuation_progress')
    .get('main')
    .update((row:any)  => ({
      [column]: row(column).default(0).add(1),
      end: Date.now()
    }));
}

async function updateProgress(progress:Progress) {
  await database.table('paper_valuation_progress')
    .get('main')
    .update(progress);
}

async function insertPerformanceHistory(commandCount: number, time: number) {
  const table = database.table('performance_history');

  const updateResult = await table.get(commandCount).update((row:any) => ({
    values: row('values').append(time)
  })).run();

  if (updateResult.replaced === 0 && updateResult.unchanged === 0) {
    await table.insert({
      id: commandCount,
      values: [time]
    }).run();
  }
}


async function getPerformanceHistory() {
  return database.table('performance_history').orderBy('id').run();
}

export { insertProgress, updateFieldProgress, updateProgress, watchProgress, insertPerformanceHistory, getPerformanceHistory };
