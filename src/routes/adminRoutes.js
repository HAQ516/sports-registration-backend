const express = require('express');
const { adminDashboard, listSports, manageRegistrations } = require('../controllers/adminController');
const protect = require('../middleware/protect');
const isAdmin = require('../middleware/isAdmin');

const router = express.Router();

router.get('/dashboard', protect, isAdmin('admin'), adminDashboard);
router.get('/sports', protect, isAdmin('admin'), listSports);
router.get('/registrations', protect, isAdmin('admin'), manageRegistrations);

module.exports = router;
