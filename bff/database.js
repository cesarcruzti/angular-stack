const tableName = 'paper_valuation_response';
const indexName = 'commandId';
const databasename = 'bff';

const database = require('rethinkdbdash')({
    host: 'localhost',
    port: 28015,
    db: databasename
});

async function setupDatabase() {
    try {
        const dbList = await database.dbList().run();
        if (!dbList.includes(databasename)) {
            await database.dbCreate(databasename).run();
            console.log(`Database '${databasename}' created.`);
        }

        const tableList = await database.tableList().run();
        if (!tableList.includes(tableName)) {
            await database.tableCreate(tableName).run();
            console.log(`Table '${tableName}' created.`);
        }

        const indexList = await database.table(tableName).indexList().run();
        if (!indexList.includes(indexName)) {
            await database.table(tableName).indexCreate(indexName).run();
            console.log(`Index '${indexName}' created.`);
        }
        
    } catch (error) {
        console.error('Error during database setup:', error);
    }
}

setupDatabase();

module.exports = database;