const dashboardService = require('../services/dashboardService');

// @desc    Get dashboard summary cards stats
// @route   GET /api/dashboard/stats
// @access  Public
const getDashboardStats = async (req, res, next) => {
    try {
        const stats = await dashboardService.computeStats();
        res.status(200).json(stats);
    } catch (error) {
        next(error);
    }
};

// @desc    Get recent activity feed
// @route   GET /api/dashboard/activity
// @access  Public
const getRecentActivity = async (req, res, next) => {
    try {
        const activity = await dashboardService.fetchActivityLog();
        res.status(200).json(activity);
    } catch (error) {
        next(error);
    }
};

// @desc    Get analytics trends and aggregate data
// @route   GET /api/dashboard/analytics
// @access  Public
const getAnalytics = async (req, res, next) => {
    try {
        const data = await dashboardService.calculateAnalytics();
        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getDashboardStats,
    getRecentActivity,
    getAnalytics
};
