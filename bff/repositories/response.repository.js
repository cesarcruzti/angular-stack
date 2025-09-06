const database = require('../config/database');

async function insert(data) {
  return database.table('paper_valuation_response').insert({ data });
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

module.exports = { insert, watchChanges };
