const Payment = require('../models/Payment');
const Salary = require('../models/Salary');
const Booking = require('../models/Booking');
const Helper = require('../models/Helper');
const User = require('../models/User');

// =============================================
// PAYMENT FUNCTIONS
// =============================================

// @desc    Create a payment for booking
// @route   POST /api/payments
// @access  Private (Household only)
exports.createPayment = async (req, res) => {
  try {
    const { bookingId, paymentMethod, amount } = req.body;

    const booking = await Booking.findById(bookingId)
      .populate('householdUserId', 'name email')
      .populate('helperId', 'fullName');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.householdUserId._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to pay for this booking'
      });
    }

    const existingPayment = await Payment.findOne({ bookingId });
    if (existingPayment && existingPayment.paymentStatus === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Payment already completed for this booking'
      });
    }

    const platformFee = amount * 0.10;
    const helperAmount = amount - platformFee;

    const payment = await Payment.create({
      bookingId,
      householdUserId: req.user.id,
      helperId: booking.helperId._id,
      amount,
      paymentMethod,
      paymentStatus: 'pending',
      helperEarnings: {
        amount: helperAmount,
        platformFee: platformFee,
        netAmount: helperAmount
      },
      paidAt: new Date()
    });

    res.status(201).json({
      success: true,
      message: 'Payment initiated successfully',
      data: payment
    });
  } catch (error) {
    console.error('Create Payment Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Complete payment (Webhook or callback)
// @route   PUT /api/payments/:id/complete
// @access  Private (Admin or system)
exports.completePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { transactionId, paymentId, signature } = req.body;

    const payment = await Payment.findById(id);
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    payment.paymentStatus = 'completed';
    payment.transactionId = transactionId || payment.transactionId;
    payment.paymentId = paymentId || payment.paymentId;
    payment.signature = signature || payment.signature;
    payment.paidAt = new Date();

    await Booking.findByIdAndUpdate(payment.bookingId, {
      paymentStatus: 'paid'
    });

    const helper = await Helper.findById(payment.helperId);
    if (helper) {
      helper.totalEarnings = (helper.totalEarnings || 0) + payment.helperEarnings.netAmount;
      await helper.save();
    }

    await payment.save();

    res.json({
      success: true,
      message: 'Payment completed successfully',
      data: payment
    });
  } catch (error) {
    console.error('Complete Payment Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get payment by booking
// @route   GET /api/payments/booking/:bookingId
// @access  Private
exports.getPaymentByBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const payment = await Payment.findOne({ bookingId })
      .populate('householdUserId', 'name email')
      .populate('helperId', 'fullName');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found for this booking'
      });
    }

    res.json({
      success: true,
      data: payment
    });
  } catch (error) {
    console.error('Get Payment By Booking Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get my payments (Household)
// @route   GET /api/payments/me
// @access  Private (Household only)
exports.getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ householdUserId: req.user.id })
      .populate('bookingId', 'serviceType serviceDate')
      .populate('helperId', 'fullName')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error) {
    console.error('Get My Payments Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// =============================================
// ADMIN PAYMENT FUNCTIONS
// =============================================

// @desc    Admin: Get all payments
// @route   GET /api/payments/admin/all
// @access  Private (Admin only)
exports.getAllPaymentsAdmin = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can access this'
      });
    }

    const payments = await Payment.find()
      .populate('householdUserId', 'name email phone')
      .populate('helperId', 'fullName serviceType')
      .populate('bookingId', 'serviceType serviceDate totalPrice')
      .sort({ createdAt: -1 });

    const summary = {
      total: payments.length,
      completed: payments.filter(p => p.paymentStatus === 'completed').length,
      pending: payments.filter(p => p.paymentStatus === 'pending').length,
      failed: payments.filter(p => p.paymentStatus === 'failed').length,
      refunded: payments.filter(p => p.paymentStatus === 'refunded').length,
      totalAmount: payments
        .filter(p => p.paymentStatus === 'completed')
        .reduce((sum, p) => sum + p.amount, 0)
    };

    res.json({
      success: true,
      count: payments.length,
      summary,
      data: payments
    });
  } catch (error) {
    console.error('Get All Payments Admin Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// =============================================
// SALARY FUNCTIONS
// =============================================

// @desc    Calculate helper salary
// @route   POST /api/payments/salary/calculate
// @access  Private (Admin only)
exports.calculateSalary = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can calculate salaries'
      });
    }

    const { helperId, month, year } = req.body;

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const bookings = await Booking.find({
      helperId,
      status: 'completed',
      serviceDate: { $gte: startDate, $lte: endDate }
    });

    const totalEarnings = bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
    const platformFee = totalEarnings * 0.10;
    const netPayable = totalEarnings - platformFee;

    const existingSalary = await Salary.findOne({
      helperId,
      month: month.toString(),
      year: year.toString()
    });

    if (existingSalary) {
      return res.status(400).json({
        success: false,
        message: 'Salary already calculated for this period'
      });
    }

    const helper = await Helper.findById(helperId);
    if (!helper) {
      return res.status(404).json({
        success: false,
        message: 'Helper not found'
      });
    }

    const salary = await Salary.create({
      helperId,
      userId: helper.userId,
      period: 'monthly',
      month: month.toString(),
      year: year.toString(),
      bookings: bookings.map(b => ({
        bookingId: b._id,
        amount: b.totalPrice,
        date: b.serviceDate,
        serviceType: b.serviceType
      })),
      totalEarnings,
      platformFee,
      netPayable,
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      message: 'Salary calculated successfully',
      data: salary
    });
  } catch (error) {
    console.error('Calculate Salary Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get helper salary history
// @route   GET /api/payments/salary/me
// @access  Private (Helper only)
exports.getMySalary = async (req, res) => {
  try {
    const helper = await Helper.findOne({ userId: req.user.id });
    if (!helper) {
      return res.status(404).json({
        success: false,
        message: 'Helper profile not found'
      });
    }

    const salaries = await Salary.find({ helperId: helper._id })
      .sort({ year: -1, month: -1 });

    const summary = {
      totalEarnings: salaries.reduce((sum, s) => sum + s.totalEarnings, 0),
      totalPaid: salaries.filter(s => s.status === 'paid').reduce((sum, s) => sum + s.netPayable, 0),
      totalPending: salaries.filter(s => s.status === 'pending').reduce((sum, s) => sum + s.netPayable, 0),
      monthsWorked: salaries.length
    };

    res.json({
      success: true,
      data: {
        salaries,
        summary
      }
    });
  } catch (error) {
    console.error('Get My Salary Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Pay salary (Admin) - FIXED
// @route   PUT /api/payments/salary/:id/pay
// @access  Private (Admin only)
exports.paySalary = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can pay salaries'
      });
    }

    const { id } = req.params;

    const salary = await Salary.findById(id);
    if (!salary) {
      return res.status(404).json({
        success: false,
        message: 'Salary record not found'
      });
    }

    if (salary.status === 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Salary already paid'
      });
    }

    // Get the helper
    const helper = await Helper.findById(salary.helperId);
    if (!helper) {
      return res.status(404).json({
        success: false,
        message: 'Helper not found'
      });
    }

    // Create payment record with proper fields
    const payment = await Payment.create({
      bookingId: null,
      householdUserId: null,
      helperId: salary.helperId,
      amount: salary.netPayable,
      paymentMethod: 'bank_transfer',
      paymentStatus: 'completed',
      isSalaryPayment: true,
      salaryPeriod: salary.period,
      salaryMonth: salary.month,
      salaryYear: salary.year,
      helperEarnings: {
        amount: salary.totalEarnings,
        platformFee: salary.platformFee,
        netAmount: salary.netPayable
      },
      paidAt: new Date(),
      transactionId: 'SALARY-' + Date.now(),
      paymentId: 'PAY-' + Date.now(),
      signature: 'SIG-' + Date.now()
    });

    salary.status = 'paid';
    salary.paidAt = new Date();
    salary.paymentId = payment._id;
    await salary.save();

    // Update helper total earnings
    helper.totalEarnings = (helper.totalEarnings || 0) + salary.netPayable;
    await helper.save();

    res.json({
      success: true,
      message: 'Salary paid successfully',
      data: {
        salary,
        payment
      }
    });
  } catch (error) {
    console.error('Pay Salary Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all salaries (Admin)
// @route   GET /api/payments/salary/all
// @access  Private (Admin only)
exports.getAllSalaries = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can access this'
      });
    }

    const { status, month, year } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (month) filter.month = month;
    if (year) filter.year = year;

    const salaries = await Salary.find(filter)
      .populate('helperId', 'fullName serviceType')
      .populate('userId', 'name email')
      .sort({ year: -1, month: -1 });

    const summary = {
      total: salaries.length,
      pending: salaries.filter(s => s.status === 'pending').length,
      paid: salaries.filter(s => s.status === 'paid').length,
      totalAmount: salaries.reduce((sum, s) => sum + s.netPayable, 0)
    };

    res.json({
      success: true,
      count: salaries.length,
      summary,
      data: salaries
    });
  } catch (error) {
    console.error('Get All Salaries Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};