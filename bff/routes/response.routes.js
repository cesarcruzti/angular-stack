const express = require('express');
const { streamResponses } = require('../controllers/response.controller');

const router = express.Router();
router.get('/response', streamResponses);

module.exports = router;
