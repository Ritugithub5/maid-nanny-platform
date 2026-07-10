const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  updateUserRole,
  deleteUser,
  updateProfile,
  getProfile,
  getUserById,
  updateUserById,
  toggleUserStatus,
  getUserStats
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

// ============ USER SELF-MANAGEMENT ============
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

// ============ ADMIN ROUTES ============
router.get('/', protect, getAllUsers);
router.get('/stats', protect, getUserStats);
router.get('/:id', protect, getUserById);
router.put('/:id', protect, updateUserById);
router.put('/:id/role', protect, updateUserRole);
router.put('/:id/toggle', protect, toggleUserStatus);
router.delete('/:id', protect, deleteUser);

module.exports = router;