const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  cancelBooking,
  getHelperBookings,
  acceptBooking,
  rejectBooking,
  completeBooking,
  getAllBookingsAdmin
} = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');

// ============ HOUSEHOLD ROUTES ============
router.post('/', protect, createBooking);
router.get('/me', protect, getMyBookings);
router.put('/:id/cancel', protect, cancelBooking);

// ============ HELPER ROUTES ============
router.get('/helper', protect, getHelperBookings);
router.put('/:id/accept', protect, acceptBooking);
router.put('/:id/reject', protect, rejectBooking);
router.put('/:id/complete', protect, completeBooking);

// ============ ADMIN ROUTES ============
router.get('/admin/all', protect, getAllBookingsAdmin);

module.exports = router;