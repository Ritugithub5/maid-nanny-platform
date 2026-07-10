const express = require('express');
const router = express.Router();
const {
  checkIn,
  checkOut,
  getMyAttendance,
  applyLeave,
  getMyLeaves,
  getAllAttendanceAdmin,
  getAllLeavesAdmin,
  updateLeaveStatus
} = require('../controllers/attendanceController');
const { protect } = require('../middleware/auth');

// ============ HELPER ROUTES ============
router.post('/check-in', protect, checkIn);
router.put('/check-out', protect, checkOut);
router.get('/me', protect, getMyAttendance);
router.post('/leave', protect, applyLeave);
router.get('/leaves/me', protect, getMyLeaves);

// ============ ADMIN ROUTES ============
router.get('/admin/all', protect, getAllAttendanceAdmin);
router.get('/leaves/admin/all', protect, getAllLeavesAdmin);
router.put('/leaves/:id/status', protect, updateLeaveStatus);

module.exports = router;