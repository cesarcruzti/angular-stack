import express from 'express';
import bodyParser from 'body-parser';
import commandRoutes from './routes/command.routes';
import responseRoutes from './routes/response.routes';

const api = express();

api.use(bodyParser.json({ limit: '50mb' }));
api.use('/send', commandRoutes);
api.use('/stream', responseRoutes);

export default api;