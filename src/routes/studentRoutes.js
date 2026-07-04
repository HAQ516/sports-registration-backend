const express = require('express');
const { homePage, dashboard, browseSports, myRegistrations } = require('../controllers/studentController');
const protect = require('../middleware/protect');

const router = express.Router();

router.get('/', homePage);
router.get('/dashboard', protect, dashboard);
router.get('/sports', protect, browseSports);
router.get('/my-registrations', protect, myRegistrations);

module.exports = router;
