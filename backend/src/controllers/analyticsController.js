const User = require('../models/User');
const Helper = require('../models/Helper');
const Booking = require('../models/Booking');
const Review = require('../models/Review');

// @desc    Get platform analytics
// @route   GET /api/analytics
// @access  Private (Admin only)
exports.getAnalytics = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can access analytics'
      });
    }

    // Get all data
    const [users, helpers, bookings, reviews] = await Promise.all([
      User.find(),
      Helper.find(),
      Booking.find(),
      Review.find()
    ]);

    // User stats
    const totalUsers = users.length;
    const householdUsers = users.filter(u => u.role === 'household').length;
    const helperUsers = users.filter(u => u.role === 'helper').length;
    const adminUsers = users.filter(u => u.role === 'admin').length;

    // Helper stats
    const totalHelpers = helpers.length;
    const verifiedHelpers = helpers.filter(h => h.verificationStatus === 'verified').length;
    const pendingHelpers = helpers.filter(h => h.verificationStatus === 'pending').length;
    const rejectedHelpers = helpers.filter(h => h.verificationStatus === 'rejected').length;
    const availableHelpers = helpers.filter(h => h.availability?.isAvailable !== false).length;

    // Booking stats
    const totalBookings = bookings.length;
    const pendingBookings = bookings.filter(b => b.status === 'pending').length;
    const acceptedBookings = bookings.filter(b => b.status === 'accepted').length;
    const inProgressBookings = bookings.filter(b => b.status === 'in_progress').length;
    const completedBookings = bookings.filter(b => b.status === 'completed').length;
    const cancelledBookings = bookings.filter(b => b.status === 'cancelled').length;
    const rejectedBookings = bookings.filter(b => b.status === 'rejected').length;

    // Revenue stats
    const totalRevenue = bookings
      .filter(b => b.status === 'completed')
      .reduce((sum, b) => sum + (b.totalPrice || 0), 0);
    const averageBookingValue = completedBookings > 0 
      ? totalRevenue / completedBookings 
      : 0;

    // Rating stats
    const reviewsWithRating = reviews.filter(r => r.rating > 0);
    const averageRating = reviewsWithRating.length > 0
      ? reviewsWithRating.reduce((sum, r) => sum + r.rating, 0) / reviewsWithRating.length
      : 0;

    // Category ratings
    const categoryAverages = {
      punctuality: 0,
      professionalism: 0,
      skills: 0,
      communication: 0
    };
    const reviewsWithCategories = reviews.filter(r => r.categories);
    if (reviewsWithCategories.length > 0) {
      const catKeys = ['punctuality', 'professionalism', 'skills', 'communication'];
      catKeys.forEach(key => {
        const sum = reviewsWithCategories.reduce((s, r) => s + (r.categories?.[key] || 0), 0);
        categoryAverages[key] = sum / reviewsWithCategories.length;
      });
    }

    // Monthly stats (last 6 months)
    const months = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = month.toLocaleString('default', { month: 'short' });
      const year = month.getFullYear();
      
      const monthStart = new Date(month.getFullYear(), month.getMonth(), 1);
      const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0);
      
      const monthBookings = bookings.filter(b => 
        b.createdAt >= monthStart && b.createdAt <= monthEnd
      );
      
      months.push({
        month: `${monthName} ${year}`,
        bookings: monthBookings.length,
        revenue: monthBookings
          .filter(b => b.status === 'completed')
          .reduce((sum, b) => sum + (b.totalPrice || 0), 0),
        users: users.filter(u => 
          u.createdAt >= monthStart && u.createdAt <= monthEnd
        ).length
      });
    }

    // Helper distribution by service type
    const serviceDistribution = {
      maid: helpers.filter(h => h.serviceType?.includes('maid')).length,
      babysitter: helpers.filter(h => h.serviceType?.includes('babysitter')).length,
      nanny: helpers.filter(h => h.serviceType?.includes('nanny')).length
    };

    // City distribution
    const cityDistribution = {};
    helpers.forEach(h => {
      (h.preferredCities || []).forEach(city => {
        cityDistribution[city] = (cityDistribution[city] || 0) + 1;
      });
    });

    res.json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          household: householdUsers,
          helper: helperUsers,
          admin: adminUsers
        },
        helpers: {
          total: totalHelpers,
          verified: verifiedHelpers,
          pending: pendingHelpers,
          rejected: rejectedHelpers,
          available: availableHelpers,
          serviceDistribution,
          cityDistribution
        },
        bookings: {
          total: totalBookings,
          pending: pendingBookings,
          accepted: acceptedBookings,
          inProgress: inProgressBookings,
          completed: completedBookings,
          cancelled: cancelledBookings,
          rejected: rejectedBookings,
          completionRate: totalBookings > 0 
            ? (completedBookings / totalBookings) * 100 
            : 0
        },
        revenue: {
          total: totalRevenue,
          averageBookingValue,
          monthly: months
        },
        ratings: {
          average: averageRating,
          count: reviewsWithRating.length,
          categories: categoryAverages
        },
        monthlyStats: months
      }
    });
  } catch (error) {
    console.error('Get Analytics Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};