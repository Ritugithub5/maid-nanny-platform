const Review = require('../models/Review');
const Booking = require('../models/Booking');
const Helper = require('../models/Helper');

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private (Household only)
exports.createReview = async (req, res) => {
  try {
    const { bookingId, rating, comment, categories } = req.body;

    // Check if booking exists
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user owns this booking
    if (booking.householdUserId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to review this booking'
      });
    }

    // Check if booking is completed
    if (booking.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Can only review completed bookings'
      });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({ bookingId });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'Review already exists for this booking'
      });
    }

    // Create review
    const review = await Review.create({
      bookingId,
      householdUserId: req.user.id,
      helperId: booking.helperId,
      rating,
      comment,
      categories: categories || {}
    });

    // Update helper rating
    const helper = await Helper.findById(booking.helperId);
    const allReviews = await Review.find({ helperId: booking.helperId, isVisible: true });
    
    const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = allReviews.length > 0 ? totalRating / allReviews.length : 0;

    await Helper.findByIdAndUpdate(booking.helperId, {
      'rating.average': averageRating,
      'rating.count': allReviews.length
    });

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully!',
      data: review
    });
  } catch (error) {
    console.error('Create Review Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get reviews for a helper
// @route   GET /api/reviews/helper/:helperId
// @access  Public
exports.getHelperReviews = async (req, res) => {
  try {
    const { helperId } = req.params;
    
    const reviews = await Review.find({ 
      helperId, 
      isVisible: true 
    })
      .populate('householdUserId', 'name profilePicture')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    console.error('Get Helper Reviews Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get my reviews (for household)
// @route   GET /api/reviews/me
// @access  Private (Household only)
exports.getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ householdUserId: req.user.id })
      .populate('helperId', 'fullName serviceType profilePic')
      .populate('bookingId', 'serviceDate serviceType')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    console.error('Get My Reviews Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Admin: Hide/Show review
// @route   PUT /api/reviews/:id/visibility
// @access  Private (Admin only)
exports.toggleReviewVisibility = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can manage review visibility'
      });
    }

    const { id } = req.params;
    const { isVisible } = req.body;

    const review = await Review.findByIdAndUpdate(
      id,
      { isVisible },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    res.json({
      success: true,
      message: `Review ${isVisible ? 'shown' : 'hidden'} successfully`,
      data: review
    });
  } catch (error) {
    console.error('Toggle Review Visibility Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};