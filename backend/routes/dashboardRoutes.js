const express = require('express');
const router = express.Router();
const {
    getDashboardStats,
    getRecentActivity,
    getAnalytics
} = require('../controllers/dashboardController');

// @desc    Get dashboard summary cards stats
// @route   GET /api/dashboard/stats
// @access  Public
router.get('/stats', getDashboardStats);

// @desc    Get analytics and trends
// @route   GET /api/dashboard/analytics
// @access  Public
router.get('/analytics', getAnalytics);

// @desc    Get recent activity feed (alerts/logs)
// @route   GET /api/dashboard/activity
// @access  Public
router.get('/activity', getRecentActivity);

module.exports = router;
