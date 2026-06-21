const express = require('express');
const router = express.Router();
const { submitFeedback, getFeedback } = require('../controllers/feedbackController');

router.get('/', getFeedback);
router.post('/', submitFeedback);

module.exports = router;

