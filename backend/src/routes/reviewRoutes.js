const express = require('express');
const router = express.Router();
const {
  createReview,
  getHelperReviews,
  getMyReviews,
  toggleReviewVisibility
} = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

// Public routes
router.get('/helper/:helperId', getHelperReviews);

// Protected routes
router.post('/', protect, createReview);
router.get('/me', protect, getMyReviews);

// Admin routes
router.put('/:id/visibility', protect, toggleReviewVisibility);

module.exports = router;