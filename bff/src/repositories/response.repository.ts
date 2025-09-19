import database from '../config/database';

async function insertResponse(data:any) {
  return database.table('paper_valuation_response').insert({ data });
}

async function watchChangesResponse(callback:any) {
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


export { insertResponse, watchChangesResponse };
