const rethinkdbdash = require('rethinkdbdash');
import config from './index';
import {info, error} from '../utils/logger';

const database = rethinkdbdash({
    host: config.db.host,
    port: config.db.port,
    db: config.db.name,
    password: config.db.password,
    timeout: 60
});

database.getPoolMaster().on('healthy', (healthy: boolean) => {
  if (healthy) {
    info('RethinkDB connection pool is healthy.');
  } else {
    error('RethinkDB connection pool is not healthy.', healthy);
  }
});

database.getPoolMaster().on('error', (err: Error) => {
  error('RethinkDB connection pool error:', err);
});

const tableProgress = 'paper_valuation_progress';
const keyProgress = "main";
const tableResponse = 'paper_valuation_response';
const indexResponse = 'commandId';
const tableCommand = 'paper_valuation_command';
const tablePerformanceHistroy = 'performance_history';

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

        if (!tableList.includes(tableCommand)) {
            await database.tableCreate(tableCommand).run();
            info(`Table '${tableCommand}' created.`);
        }

        if (!tableList.includes(tablePerformanceHistroy)) {
            await database.tableCreate(tablePerformanceHistroy).run();
            info(`Table '${tablePerformanceHistroy}' created.`);
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