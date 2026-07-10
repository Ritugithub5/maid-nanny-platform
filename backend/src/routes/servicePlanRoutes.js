const express = require('express');
const router = express.Router();
const {
  createServicePlan,
  getHelperPlans,
  updateServicePlan,
  deleteServicePlan
} = require('../controllers/servicePlanController');
const { protect } = require('../middleware/auth');

// Public routes
router.get('/helper/:helperId', getHelperPlans);

// Protected routes
router.post('/', protect, createServicePlan);
router.put('/:id', protect, updateServicePlan);
router.delete('/:id', protect, deleteServicePlan);

module.exports = router;