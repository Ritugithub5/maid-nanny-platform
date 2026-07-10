const Attendance = require('../models/Attendance');
const Leave = require('../models/Leave');
const Helper = require('../models/Helper');
const User = require('../models/User');

// =============================================
// ATTENDANCE FUNCTIONS
// =============================================

// @desc    Mark attendance (Check-in)
// @route   POST /api/attendance/check-in
// @access  Private (Helper only)
exports.checkIn = async (req, res) => {
  try {
    const helper = await Helper.findOne({ userId: req.user.id });
    if (!helper) {
      return res.status(404).json({
        success: false,
        message: 'Helper profile not found'
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Check if already checked in today
    const existing = await Attendance.findOne({
      helperId: helper._id,
      date: { $gte: today, $lt: tomorrow }
    });

    if (existing && existing.checkInTime) {
      return res.status(400).json({
        success: false,
        message: 'Already checked in today'
      });
    }

    const now = new Date();
    const time = now.toTimeString().slice(0, 5);

    // Create new attendance
    const attendance = await Attendance.create({
      helperId: helper._id,
      userId: req.user.id,
      date: today,
      checkInTime: time,
      status: 'present',
      location: req.body.location || {}
    });

    res.json({
      success: true,
      message: '✅ Checked in successfully at ' + time,
      data: attendance
    });
  } catch (error) {
    console.error('Check In Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Mark attendance (Check-out)
// @route   PUT /api/attendance/check-out
// @access  Private (Helper only)
exports.checkOut = async (req, res) => {
  try {
    const helper = await Helper.findOne({ userId: req.user.id });
    if (!helper) {
      return res.status(404).json({
        success: false,
        message: 'Helper profile not found'
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const attendance = await Attendance.findOne({
      helperId: helper._id,
      date: { $gte: today, $lt: tomorrow }
    });

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'No check-in found for today. Please check in first.'
      });
    }

    if (attendance.checkOutTime) {
      return res.status(400).json({
        success: false,
        message: 'Already checked out today'
      });
    }

    const now = new Date();
    const time = now.toTimeString().slice(0, 5);
    attendance.checkOutTime = time;

    // Calculate hours
    const inTime = attendance.checkInTime.split(':');
    const outTime = time.split(':');
    let inMinutes = parseInt(inTime[0]) * 60 + parseInt(inTime[1]);
    let outMinutes = parseInt(outTime[0]) * 60 + parseInt(outTime[1]);
    
    if (outMinutes < inMinutes) {
      outMinutes += 24 * 60;
    }
    
    const totalMinutes = outMinutes - inMinutes;
    attendance.workingHours = Math.round((totalMinutes / 60) * 100) / 100;

    if (attendance.workingHours > 8) {
      attendance.overtime = Math.round((attendance.workingHours - 8) * 100) / 100;
    }

    await attendance.save();

    res.json({
      success: true,
      message: '✅ Checked out successfully! Hours: ' + attendance.workingHours.toFixed(1) + 'h',
      data: attendance
    });
  } catch (error) {
    console.error('Check Out Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get my attendance
// @route   GET /api/attendance/me
// @access  Private (Helper only)
exports.getMyAttendance = async (req, res) => {
  try {
    const helper = await Helper.findOne({ userId: req.user.id });
    if (!helper) {
      return res.status(404).json({
        success: false,
        message: 'Helper profile not found'
      });
    }

    const attendance = await Attendance.find({
      helperId: helper._id
    }).sort({ date: -1 });

    const summary = {
      present: attendance.filter(a => a.status === 'present').length,
      absent: attendance.filter(a => a.status === 'absent').length,
      halfDay: attendance.filter(a => a.status === 'half-day').length,
      leave: attendance.filter(a => a.status === 'leave').length,
      totalWorkingHours: attendance.reduce((sum, a) => sum + (a.workingHours || 0), 0),
      totalOvertime: attendance.reduce((sum, a) => sum + (a.overtime || 0), 0)
    };

    res.json({
      success: true,
      data: {
        attendance,
        summary
      }
    });
  } catch (error) {
    console.error('Get My Attendance Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// =============================================
// LEAVE FUNCTIONS
// =============================================

// @desc    Apply for leave
// @route   POST /api/attendance/leave
// @access  Private (Helper only)
exports.applyLeave = async (req, res) => {
  try {
    const { type, startDate, endDate, reason, notes } = req.body;

    const helper = await Helper.findOne({ userId: req.user.id });
    if (!helper) {
      return res.status(404).json({
        success: false,
        message: 'Helper profile not found'
      });
    }

    const overlapping = await Leave.findOne({
      helperId: helper._id,
      status: { $in: ['pending', 'approved'] },
      $or: [
        { startDate: { $lte: new Date(endDate) }, endDate: { $gte: new Date(startDate) } }
      ]
    });

    if (overlapping) {
      return res.status(400).json({
        success: false,
        message: 'You already have a leave request for this period'
      });
    }

    const leave = await Leave.create({
      helperId: helper._id,
      userId: req.user.id,
      type,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      reason,
      notes: notes || '',
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      message: 'Leave application submitted successfully',
      data: leave
    });
  } catch (error) {
    console.error('Apply Leave Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get my leaves
// @route   GET /api/attendance/leaves/me
// @access  Private (Helper only)
exports.getMyLeaves = async (req, res) => {
  try {
    const helper = await Helper.findOne({ userId: req.user.id });
    if (!helper) {
      return res.status(404).json({
        success: false,
        message: 'Helper profile not found'
      });
    }

    const leaves = await Leave.find({ helperId: helper._id }).sort({ createdAt: -1 });

    const summary = {
      total: leaves.length,
      pending: leaves.filter(l => l.status === 'pending').length,
      approved: leaves.filter(l => l.status === 'approved').length,
      rejected: leaves.filter(l => l.status === 'rejected').length
    };

    res.json({
      success: true,
      data: {
        leaves,
        summary
      }
    });
  } catch (error) {
    console.error('Get My Leaves Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// =============================================
// ADMIN FUNCTIONS
// =============================================

// @desc    Admin: Get all attendance
// @route   GET /api/attendance/admin/all
// @access  Private (Admin only)
exports.getAllAttendanceAdmin = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can access this'
      });
    }

    const attendance = await Attendance.find()
      .populate('helperId', 'fullName serviceType')
      .populate('userId', 'name email')
      .sort({ date: -1 });

    res.json({
      success: true,
      count: attendance.length,
      data: attendance
    });
  } catch (error) {
    console.error('Get All Attendance Admin Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Admin: Get all leaves
// @route   GET /api/attendance/leaves/admin/all
// @access  Private (Admin only)
exports.getAllLeavesAdmin = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can access this'
      });
    }

    const leaves = await Leave.find()
      .populate('helperId', 'fullName serviceType')
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: leaves.length,
      data: leaves
    });
  } catch (error) {
    console.error('Get All Leaves Admin Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Admin: Approve/Reject leave
// @route   PUT /api/attendance/leaves/:id/status
// @access  Private (Admin only)
exports.updateLeaveStatus = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can update leave status'
      });
    }

    const { id } = req.params;
    const { status, rejectionReason } = req.body;

    const leave = await Leave.findById(id);
    if (!leave) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found'
      });
    }

    leave.status = status;
    leave.approvedBy = req.user.id;
    leave.approvedAt = status === 'approved' ? new Date() : null;
    leave.rejectionReason = status === 'rejected' ? rejectionReason || '' : '';

    await leave.save();

    res.json({
      success: true,
      message: `Leave ${status} successfully`,
      data: leave
    });
  } catch (error) {
    console.error('Update Leave Status Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};