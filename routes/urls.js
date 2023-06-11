const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const urlController = require('../controllers/urlController');

// Apply rate limiting middleware
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // Maximum 10 requests allowed per minute
});

router
  .get('/:urlCode', limiter, urlController.show)
  .post('/shorten', limiter, urlController.store);

module.exports = router;
