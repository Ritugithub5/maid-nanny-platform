const Booking = require('../models/Booking');
const Helper = require('../models/Helper');
const User = require('../models/User');
const {
  createBookingNotifications,
  createBookingStatusNotification
} = require('../utils/notificationHelper');

// =============================================
// HOUSEHOLD FUNCTIONS
// =============================================

// @desc    Create a booking
// @route   POST /api/bookings
// @access  Private (Household only)
exports.createBooking = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (user.role !== 'household') {
      return res.status(403).json({
        success: false,
        message: 'Only households can create bookings'
      });
    }

    const {
      helperId,
      serviceType,
      serviceDate,
      startTime,
      endTime,
      specialInstructions,
      address
    } = req.body;

    // Check if helper exists and is verified
    const helper = await Helper.findById(helperId);
    if (!helper) {
      return res.status(404).json({
        success: false,
        message: 'Helper not found'
      });
    }

    if (helper.verificationStatus !== 'verified') {
      return res.status(400).json({
        success: false,
        message: 'Helper is not verified yet'
      });
    }

    if (!helper.availability.isAvailable) {
      return res.status(400).json({
        success: false,
        message: 'Helper is not available for work'
      });
    }

    // Calculate price
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    const hours = (end - start) / (1000 * 60 * 60);
    const ratePerHour = 200;
    const totalPrice = hours * ratePerHour;

    const booking = await Booking.create({
      householdUserId: req.user.id,
      helperId,
      serviceType,
      serviceDate,
      startTime,
      endTime,
      totalPrice,
      specialInstructions: specialInstructions || '',
      address: address || {},
      status: 'pending'
    });

    // ===== CREATE NOTIFICATIONS =====
    await createBookingNotifications(booking);
    // ================================

    // Populate the response
    const populatedBooking = await Booking.findById(booking._id)
      .populate('householdUserId', 'name email phone')
      .populate('helperId', 'fullName serviceType');

    res.status(201).json({
      success: true,
      message: 'Booking created successfully! Waiting for helper to accept.',
      data: populatedBooking
    });
  } catch (error) {
    console.error('Create Booking Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get my bookings (Household)
// @route   GET /api/bookings/me
// @access  Private (Household only)
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ householdUserId: req.user.id })
      .populate('helperId', 'fullName serviceType profilePic yearsOfExperience rating')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    console.error('Get My Bookings Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Cancel booking (Household)
// @route   PUT /api/bookings/:id/cancel
// @access  Private (Household only)
exports.cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const booking = await Booking.findById(id);

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
        message: 'You are not authorized to cancel this booking'
      });
    }

    // Can only cancel pending or accepted bookings
    if (booking.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel a completed booking'
      });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Booking is already cancelled'
      });
    }

    booking.status = 'cancelled';
    booking.cancellationReason = reason || 'Cancelled by household';
    booking.cancelledBy = 'household';
    await booking.save();

    // ===== CREATE NOTIFICATION =====
    await createBookingStatusNotification(booking._id, 'cancelled');
    // ==============================

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking
    });
  } catch (error) {
    console.error('Cancel Booking Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// =============================================
// HELPER FUNCTIONS
// =============================================

// @desc    Get helper's bookings
// @route   GET /api/bookings/helper
// @access  Private (Helper only)
exports.getHelperBookings = async (req, res) => {
  try {
    // Get helper profile
    const helper = await Helper.findOne({ userId: req.user.id });
    if (!helper) {
      return res.status(404).json({
        success: false,
        message: 'Helper profile not found'
      });
    }

    const bookings = await Booking.find({ helperId: helper._id })
      .populate('householdUserId', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    console.error('Get Helper Bookings Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Accept booking
// @route   PUT /api/bookings/:id/accept
// @access  Private (Helper only)
exports.acceptBooking = async (req, res) => {
  try {
    const { id } = req.params;

    // Get helper profile
    const helper = await Helper.findOne({ userId: req.user.id });
    if (!helper) {
      return res.status(404).json({
        success: false,
        message: 'Helper profile not found'
      });
    }

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if this booking belongs to this helper
    if (booking.helperId.toString() !== helper._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to accept this booking'
      });
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Cannot accept booking with status: ${booking.status}`
      });
    }

    booking.status = 'accepted';
    await booking.save();

    // ===== CREATE NOTIFICATION =====
    await createBookingStatusNotification(booking._id, 'accepted');
    // ==============================

    const populatedBooking = await Booking.findById(booking._id)
      .populate('householdUserId', 'name email phone')
      .populate('helperId', 'fullName serviceType');

    res.json({
      success: true,
      message: 'Booking accepted successfully',
      data: populatedBooking
    });
  } catch (error) {
    console.error('Accept Booking Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Reject booking
// @route   PUT /api/bookings/:id/reject
// @access  Private (Helper only)
exports.rejectBooking = async (req, res) => {
  try {
    const { id } = req.params;

    // Get helper profile
    const helper = await Helper.findOne({ userId: req.user.id });
    if (!helper) {
      return res.status(404).json({
        success: false,
        message: 'Helper profile not found'
      });
    }

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if this booking belongs to this helper
    if (booking.helperId.toString() !== helper._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to reject this booking'
      });
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Cannot reject booking with status: ${booking.status}`
      });
    }

    booking.status = 'rejected';
    await booking.save();

    // ===== CREATE NOTIFICATION =====
    await createBookingStatusNotification(booking._id, 'rejected');
    // ==============================

    res.json({
      success: true,
      message: 'Booking rejected',
      data: booking
    });
  } catch (error) {
    console.error('Reject Booking Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Complete booking
// @route   PUT /api/bookings/:id/complete
// @access  Private (Helper only)
exports.completeBooking = async (req, res) => {
  try {
    const { id } = req.params;

    // Get helper profile
    const helper = await Helper.findOne({ userId: req.user.id });
    if (!helper) {
      return res.status(404).json({
        success: false,
        message: 'Helper profile not found'
      });
    }

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if this booking belongs to this helper
    if (booking.helperId.toString() !== helper._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to complete this booking'
      });
    }

    if (booking.status !== 'accepted' && booking.status !== 'in_progress') {
      return res.status(400).json({
        success: false,
        message: `Cannot complete booking with status: ${booking.status}`
      });
    }

    booking.status = 'completed';
    await booking.save();

    // Update helper stats
    await Helper.findByIdAndUpdate(helper._id, {
      $inc: { totalJobsCompleted: 1 }
    });

    // ===== CREATE NOTIFICATION =====
    await createBookingStatusNotification(booking._id, 'completed');
    // ==============================

    res.json({
      success: true,
      message: 'Booking completed successfully',
      data: booking
    });
  } catch (error) {
    console.error('Complete Booking Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// =============================================
// ADMIN FUNCTIONS
// =============================================

// @desc    Admin: Get all bookings
// @route   GET /api/bookings/admin/all
// @access  Private (Admin only)
exports.getAllBookingsAdmin = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can access this'
      });
    }

    const bookings = await Booking.find()
      .populate('householdUserId', 'name email phone')
      .populate('helperId', 'fullName serviceType')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    console.error('Get All Bookings Admin Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};