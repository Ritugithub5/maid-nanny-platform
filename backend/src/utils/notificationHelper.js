const Notification = require('../models/Notification');
const User = require('../models/User');

// Create notification for a user
const createNotification = async (userId, type, title, message, data = {}, link = '') => {
  try {
    const notification = await Notification.create({
      userId,
      type,
      title,
      message,
      data,
      link
    });

    // Send email if user has email notifications enabled
    await sendEmailNotification(userId, title, message);

    return notification;
  } catch (error) {
    console.error('Create Notification Error:', error);
    return null;
  }
};

// Send email notification (simplified - use nodemailer for production)
const sendEmailNotification = async (userId, title, message) => {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    // In production, use nodemailer to send actual emails
    console.log(`📧 Email would be sent to ${user.email}`);
    console.log(`Subject: ${title}`);
    console.log(`Message: ${message}`);
    
    // For demo, we'll just log it
    return true;
  } catch (error) {
    console.error('Send Email Error:', error);
    return false;
  }
};

// Create booking notifications
const createBookingNotifications = async (booking) => {
  try {
    // Notify helper
    await createNotification(
      booking.helperId.userId?._id || booking.helperId,
      'booking',
      '📅 New Booking Request!',
      `${booking.householdUserId?.name || 'A household'} has booked you for ${booking.serviceType} on ${new Date(booking.serviceDate).toLocaleDateString()}`,
      { bookingId: booking._id },
      '/dashboard'
    );

    // Notify household
    await createNotification(
      booking.householdUserId,
      'booking',
      '✅ Booking Confirmed!',
      `Your booking with ${booking.helperId?.fullName || 'helper'} for ${booking.serviceType} has been sent. Waiting for confirmation.`,
      { bookingId: booking._id },
      '/dashboard'
    );

    return true;
  } catch (error) {
    console.error('Create Booking Notifications Error:', error);
    return false;
  }
};

// Create booking status update notifications
const createBookingStatusNotification = async (booking, status) => {
  try {
    const messages = {
      accepted: {
        title: '✅ Booking Accepted!',
        message: `${booking.helperId?.fullName} has accepted your booking for ${booking.serviceType}`,
        userType: 'householdUserId'
      },
      rejected: {
        title: '❌ Booking Rejected',
        message: `${booking.helperId?.fullName} has rejected your booking for ${booking.serviceType}`,
        userType: 'householdUserId'
      },
      completed: {
        title: '🎉 Booking Completed!',
        message: `Your booking with ${booking.helperId?.fullName} for ${booking.serviceType} has been completed. Please leave a review!`,
        userType: 'householdUserId'
      },
      cancelled: {
        title: '📅 Booking Cancelled',
        message: `Your booking with ${booking.helperId?.fullName} for ${booking.serviceType} has been cancelled.`,
        userType: 'householdUserId'
      }
    };

    const msg = messages[status];
    if (!msg) return;

    // Notify household
    await createNotification(
      booking[msg.userType],
      'booking',
      msg.title,
      msg.message,
      { bookingId: booking._id },
      '/dashboard'
    );

    return true;
  } catch (error) {
    console.error('Create Status Notification Error:', error);
    return false;
  }
};

module.exports = {
  createNotification,
  sendEmailNotification,
  createBookingNotifications,
  createBookingStatusNotification
};