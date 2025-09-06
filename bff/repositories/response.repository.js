const database = require('../config/database');

async function insert(data) {
  return database.table('paper_valuation_response').insert({ data });
}

async function insertProgress(data) {
  return database.table('paper_valuation_progress').insert({ data });
}

async function watchChanges(callback) {
  const cursor = await database.table('paper_valuation_response').changes().run();
  cursor.each((err, change) => {
    if (err) {
      console.error('Error in changefeed', err);
      return;
    }
    if (change.new_val) callback(change.new_val.data);
  });
  return cursor;
}

async function watchProgress(callback) {
  const cursor = await database.table('paper_valuation_progress').changes().run();
  cursor.each((err, change) => {
    if (err) {
      console.error('Error in changefeed', err);
      return;
    }
    if (change.new_val) callback(change.new_val);
  });
  return cursor;
}

async function updateProgress(field) {
  const column = String(field).toLowerCase();
  await database.table('paper_valuation_progress')
    .get('main')
    .update(row => ({
      [column]: row(column).default(0).add(1)
    }));
}

module.exports = { insert, insertProgress, updateProgress, watchChanges, watchProgress };
