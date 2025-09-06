const express = require('express');
const { streamResponses, streamProgress } = require('../controllers/response.controller');

const router = express.Router();
router.get('/response', streamResponses);
router.get('/progress', streamProgress);

module.exports = router;
