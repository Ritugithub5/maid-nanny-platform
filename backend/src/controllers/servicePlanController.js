const ServicePlan = require('../models/ServicePlan');
const Helper = require('../models/Helper');

// @desc    Create service plan
// @route   POST /api/service-plans
// @access  Private (Helper or Admin)
exports.createServicePlan = async (req, res) => {
  try {
    const { helperId, planType, price, description, features, city } = req.body;

    // Check if helper exists
    const helper = await Helper.findById(helperId);
    if (!helper) {
      return res.status(404).json({
        success: false,
        message: 'Helper not found'
      });
    }

    // Check if user owns this helper profile or is admin
    if (helper.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to create plans for this helper'
      });
    }

    const plan = await ServicePlan.create({
      helperId,
      planType,
      price,
      description,
      features: features || [],
      city: city || ''
    });

    res.status(201).json({
      success: true,
      data: plan
    });
  } catch (error) {
    console.error('Create Service Plan Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get plans for a helper
// @route   GET /api/service-plans/helper/:helperId
// @access  Public
exports.getHelperPlans = async (req, res) => {
  try {
    const { helperId } = req.params;
    
    const plans = await ServicePlan.find({ 
      helperId, 
      isActive: true 
    }).sort({ planType: 1 });

    res.json({
      success: true,
      count: plans.length,
      data: plans
    });
  } catch (error) {
    console.error('Get Helper Plans Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update service plan
// @route   PUT /api/service-plans/:id
// @access  Private (Helper or Admin)
exports.updateServicePlan = async (req, res) => {
  try {
    const { id } = req.params;
    
    const plan = await ServicePlan.findById(id);
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Plan not found'
      });
    }

    // Check ownership
    const helper = await Helper.findById(plan.helperId);
    if (helper.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this plan'
      });
    }

    const updatedPlan = await ServicePlan.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: updatedPlan
    });
  } catch (error) {
    console.error('Update Service Plan Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete service plan
// @route   DELETE /api/service-plans/:id
// @access  Private (Helper or Admin)
exports.deleteServicePlan = async (req, res) => {
  try {
    const { id } = req.params;
    
    const plan = await ServicePlan.findById(id);
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Plan not found'
      });
    }

    // Check ownership
    const helper = await Helper.findById(plan.helperId);
    if (helper.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this plan'
      });
    }

    await plan.deleteOne();

    res.json({
      success: true,
      message: 'Plan deleted successfully'
    });
  } catch (error) {
    console.error('Delete Service Plan Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};