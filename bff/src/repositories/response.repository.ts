import database from '../config/database';

async function insert(data:any) {
  return database.table('paper_valuation_response').insert({ data });
}

async function insertProgress(data:any) {
  return database.table('paper_valuation_progress').insert({ data });
}

async function watchChanges(callback:any) {
  const cursor = await database.table('paper_valuation_response').changes().run();
  cursor.each((err:any, change:any) => {
    if (err) {
      console.error('Error in changefeed', err);
      return;
    }
    if (change.new_val) callback(change.new_val.data);
  });
  return cursor;
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

async function updateProgress(field:string) {
  const column = String(field).toLowerCase();
  await database.table('paper_valuation_progress')
    .get('main')
    .update((row:any)  => ({
      [column]: row(column).default(0).add(1)
    }));
}

export { insert, insertProgress, updateProgress, watchChanges, watchProgress };
