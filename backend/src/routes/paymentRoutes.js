const express = require('express');
const router = express.Router();
const {
  createPayment,
  completePayment,
  getPaymentByBooking,
  getMyPayments,
  calculateSalary,
  getMySalary,
  paySalary,
  getAllSalaries,
  getAllPaymentsAdmin  // Add this import
} = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

// ============ PAYMENT ROUTES ============
router.post('/', protect, createPayment);
router.put('/:id/complete', protect, completePayment);
router.get('/booking/:bookingId', protect, getPaymentByBooking);
router.get('/me', protect, getMyPayments);

// ============ ADMIN PAYMENT ROUTES ============
router.get('/admin/all', protect, getAllPaymentsAdmin);

// ============ SALARY ROUTES ============
router.post('/salary/calculate', protect, calculateSalary);
router.get('/salary/me', protect, getMySalary);
router.put('/salary/:id/pay', protect, paySalary);
router.get('/salary/all', protect, getAllSalaries);

module.exports = router;