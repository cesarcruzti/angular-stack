const express = require('express');
const bodyParser = require('body-parser');
const commandRoutes = require('./routes/command.routes');
const responseRoutes = require('./routes/response.routes');

const app = express();

app.use(bodyParser.json());
app.use('/send', commandRoutes);
app.use('/stream', responseRoutes);

module.exports = app;