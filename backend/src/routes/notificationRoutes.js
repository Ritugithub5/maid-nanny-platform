const express = require('express');
const router = express.Router();
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  createNotification,
  getUnreadCount
} = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');

// Protected routes
router.get('/', protect, getNotifications);
router.get('/unread-count', protect, getUnreadCount);
router.put('/read-all', protect, markAllAsRead);
router.put('/:id/read', protect, markAsRead);
router.delete('/:id', protect, deleteNotification);

// Internal route (for creating notifications from other services)
router.post('/create', protect, createNotification);

module.exports = router;