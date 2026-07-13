const Helper = require('../models/Helper');
const User = require('../models/User');
exports.createHelperProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Allow if user is helper OR admin
    if (user.role !== 'helper' && user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only helpers or admins can create helper profiles'
      });
    }

    // Check if profile already exists
    let helper = await Helper.findOne({ userId: req.user.id });
    if (helper) {
      return res.status(400).json({
        success: false,
        message: 'You already have a helper profile'
      });
    }

    // ✅ FIX: Ensure availability.workingHours is an object
    let availabilityData = req.body.availability || {
      isAvailable: true,
      workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      workingHours: { start: '09:00', end: '18:00' }
    };

    // If workingHours is a string, convert to object
    if (typeof availabilityData.workingHours === 'string') {
      availabilityData.workingHours = {
        start: availabilityData.workingHours,
        end: '18:00' // Default end time
      };
    }

    // If workingHours is missing or invalid, set default
    if (!availabilityData.workingHours || 
        typeof availabilityData.workingHours !== 'object' ||
        !availabilityData.workingHours.start) {
      availabilityData.workingHours = {
        start: '09:00',
        end: '18:00'
      };
    }

    // Create helper profile
    helper = await Helper.create({
      userId: req.user.id,
      fullName: req.body.fullName || user.name,
      profilePic: req.body.profilePic || '',
      bio: req.body.bio || '',
      serviceType: req.body.serviceType || [],
      yearsOfExperience: req.body.yearsOfExperience || 0,
      skills: req.body.skills || [],
      languages: req.body.languages || [],
      availability: availabilityData,
      preferredCities: req.body.preferredCities || [],
      verificationStatus: req.body.verificationStatus || 'pending',
      isActive: true
    });

    res.status(201).json({
      success: true,
      message: 'Helper profile created successfully! Waiting for admin verification.',
      data: helper
    });
  } catch (error) {
    console.error('Create Helper Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
exports.updateHelperProfile = async (req, res) => {
  try {
    let helper = await Helper.findOne({ userId: req.user.id });
    
    if (!helper) {
      return res.status(404).json({
        success: false,
        message: 'Helper profile not found'
      });
    }

    // ✅ FIX: Ensure availability.workingHours is an object
    if (req.body.availability) {
      // If workingHours is a string, convert to object
      if (typeof req.body.availability.workingHours === 'string') {
        const timeStr = req.body.availability.workingHours;
        req.body.availability.workingHours = {
          start: timeStr,
          end: '18:00' // Default end time if not specified
        };
      }
      
      // If workingHours is missing or invalid, set default
      if (!req.body.availability.workingHours || 
          typeof req.body.availability.workingHours !== 'object' ||
          !req.body.availability.workingHours.start) {
        req.body.availability.workingHours = {
          start: '09:00',
          end: '18:00'
        };
      }
    }

    helper = await Helper.findOneAndUpdate(
      { userId: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: helper
    });
  } catch (error) {
    console.error('Update Helper Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
exports.getMyHelperProfile = async (req, res) => {
  try {
    const helper = await Helper.findOne({ userId: req.user.id })
      .populate('userId', 'name email phone profilePicture');

    if (!helper) {
      return res.status(404).json({
        success: false,
        message: 'Helper profile not found. Please create one first.'
      });
    }

    res.json({
      success: true,
      data: helper
    });
  } catch (error) {
    console.error('Get My Helper Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
exports.getHelpers = async (req, res) => {
  try {
    const { serviceType, experience, city, minRating, search } = req.query;

    const filter = {};
    filter.verificationStatus = 'verified';
    filter.isActive = true;

    if (serviceType) {
      filter.serviceType = { $in: [serviceType] };
    }

    if (experience) {
      if (experience === '0-2') {
        filter.yearsOfExperience = { $gte: 0, $lte: 2 };
      } else if (experience === '3-5') {
        filter.yearsOfExperience = { $gte: 3, $lte: 5 };
      } else if (experience === '5+') {
        filter.yearsOfExperience = { $gte: 5 };
      }
    }

    if (city) {
      filter.preferredCities = { $in: [city] };
    }

    if (minRating) {
      filter['rating.average'] = { $gte: parseFloat(minRating) };
    }

    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { skills: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } }
      ];
    }

    const helpers = await Helper.find(filter)
      .populate('userId', 'name email phone profilePicture')
      .sort({ 'rating.average': -1 });

    res.json({
      success: true,
      count: helpers.length,
      data: helpers
    });
  } catch (error) {
    console.error('Get Helpers Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
exports.getHelperById = async (req, res) => {
  try {
    const helper = await Helper.findById(req.params.id)
      .populate('userId', 'name email phone profilePicture');

    if (!helper) {
      return res.status(404).json({
        success: false,
        message: 'Helper not found'
      });
    }

    res.json({
      success: true,
      data: helper
    });
  } catch (error) {
    console.error('Get Helper By ID Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getAllHelpersAdmin = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can access this'
      });
    }

    const helpers = await Helper.find()
      .populate('userId', 'name email phone profilePicture')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: helpers.length,
      data: helpers
    });
  } catch (error) {
    console.error('Get All Helpers Admin Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
exports.getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can access this'
      });
    }

    const users = await User.find({}, 'name email role phone')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Get All Users Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
exports.createHelperForUser = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can create helpers for other users'
      });
    }

    const { 
      userId, 
      fullName, 
      bio, 
      serviceType, 
      yearsOfExperience, 
      skills, 
      languages,
      availability,
      preferredCities,
      verificationStatus 
    } = req.body;

    // Check if userId is provided
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if profile already exists for this user
    const existingHelper = await Helper.findOne({ userId });
    if (existingHelper) {
      return res.status(400).json({
        success: false,
        message: `User ${user.name} already has a helper profile`
      });
    }

    // ✅ FIX: Ensure availability.workingHours is an object
    let availabilityData = availability || {
      isAvailable: true,
      workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      workingHours: { start: '09:00', end: '18:00' }
    };

    if (typeof availabilityData.workingHours === 'string') {
      availabilityData.workingHours = {
        start: availabilityData.workingHours,
        end: '18:00'
      };
    }

    // Create helper profile for the user
    const helper = await Helper.create({
      userId: userId,
      fullName: fullName || user.name,
      profilePic: '',
      bio: bio || '',
      serviceType: serviceType || [],
      yearsOfExperience: yearsOfExperience || 0,
      skills: skills || [],
      languages: languages || [],
      availability: availabilityData,
      preferredCities: preferredCities || [],
      verificationStatus: verificationStatus || 'pending',
      isActive: true
    });

    // Update user role to helper
    await User.findByIdAndUpdate(userId, { role: 'helper' });

    res.status(201).json({
      success: true,
      message: `Helper profile created for ${user.name} successfully!`,
      data: helper
    });
  } catch (error) {
    console.error('Admin Create Helper Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
exports.verifyHelper = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can verify helpers'
      });
    }

    const { id } = req.params;
    const { verificationStatus } = req.body;

    const helper = await Helper.findByIdAndUpdate(
      id,
      { verificationStatus },
      { new: true }
    ).populate('userId', 'name email');

    if (!helper) {
      return res.status(404).json({
        success: false,
        message: 'Helper not found'
      });
    }

    res.json({
      success: true,
      message: `Helper ${helper.fullName} ${verificationStatus === 'verified' ? 'verified' : 'rejected'} successfully`,
      data: helper
    });
  } catch (error) {
    console.error('Verify Helper Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
exports.updateHelperById = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can update helpers'
      });
    }

    // ✅ FIX: Ensure availability.workingHours is an object
    if (req.body.availability) {
      if (typeof req.body.availability.workingHours === 'string') {
        const timeStr = req.body.availability.workingHours;
        req.body.availability.workingHours = {
          start: timeStr,
          end: '18:00'
        };
      }
      
      if (!req.body.availability.workingHours || 
          typeof req.body.availability.workingHours !== 'object' ||
          !req.body.availability.workingHours.start) {
        req.body.availability.workingHours = {
          start: '09:00',
          end: '18:00'
        };
      }
    }

    const helper = await Helper.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('userId', 'name email phone profilePicture');

    if (!helper) {
      return res.status(404).json({
        success: false,
        message: 'Helper not found'
      });
    }

    res.json({
      success: true,
      data: helper
    });
  } catch (error) {
    console.error('Update Helper By ID Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
exports.deleteHelper = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can delete helpers'
      });
    }

    const helper = await Helper.findByIdAndDelete(req.params.id);

    if (!helper) {
      return res.status(404).json({
        success: false,
        message: 'Helper not found'
      });
    }

    res.json({
      success: true,
      message: 'Helper deleted successfully'
    });
  } catch (error) {
    console.error('Delete Helper Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};