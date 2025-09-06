const rethinkdbdash = require('rethinkdbdash');
import config from './index';
import {info, error} from '../utils/logger';

const database = rethinkdbdash({
    host: config.db.host,
    port: config.db.port,
    db: config.db.name,
});

const tableProgress = 'paper_valuation_progress';
const keyProgress = "main";
const tableResponse = 'paper_valuation_response';
const indexResponse = 'commandId';

async function setupDatabase() {
    try {
        const dbList = await database.dbList().run();
        if (!dbList.includes(config.db.name)) {
            await database.dbCreate(config.db.name).run();
            info(`Database '${config.db.name}' created.`);
        }

        const tableList = await database.tableList().run();

        if (!tableList.includes(tableProgress)) {
            await database.tableCreate(tableProgress).run();
            info(`Table '${tableProgress}' created.`);
        }

        await defaultProgress();

        if (!tableList.includes(tableResponse)) {
            await database.tableCreate(tableResponse).run();
            info(`Table '${tableResponse}' created.`);
        }

        const indexList = await database.table(tableResponse).indexList().run();
        if (!indexList.includes(indexResponse)) {
            await database.table(tableResponse).indexCreate(indexResponse).run();
            info(`Index '${indexResponse}' created.`);
        }

    } catch (e) {
        error('Error during database setup:', e);
    }
}

async function defaultProgress() {
    const existing = await database.table(tableProgress).get(keyProgress);
    if (!existing) {
        await database.table(tableProgress).insert({
            id: keyProgress,
            pending: 0,
            running: 0,
            processed: 0,
            failed: 0
        });
        info(`Default register '${tableProgress}' insert.`);
    }
}

setupDatabase();

export default database;