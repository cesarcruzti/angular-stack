const express = require('express');
const { sendCommand } = require('../controllers/command.controller');

const router = express.Router();
router.post('/command', sendCommand);

module.exports = router;
