const express = require('express');
const router = express.Router();
const {
  createHelperProfile,
  createHelperForUser,
  getHelpers,
  getHelperById,
  updateHelperProfile,
  getMyHelperProfile,
  getAllHelpersAdmin,
  getAllUsers,
  verifyHelper,
  deleteHelper,
  updateHelperById
} = require('../controllers/helperController');
const {
  uploadDocument,
  getDocumentStatus,
  verifyDocument
} = require('../controllers/documentController');
const { protect } = require('../middleware/auth');

// ============ PUBLIC ROUTES ============
router.get('/', getHelpers);
router.get('/:id', getHelperById);

// ============ AUTHENTICATED ROUTES ============
// Helper self-management
router.post('/profile', protect, createHelperProfile);
router.put('/profile', protect, updateHelperProfile);
router.get('/me/profile', protect, getMyHelperProfile);

// Document routes
router.post('/documents', protect, uploadDocument);
router.get('/documents/status', protect, getDocumentStatus);
router.put('/documents/verify/:helperId', protect, verifyDocument);

// ============ ADMIN ONLY ROUTES ============
router.get('/admin/all', protect, getAllHelpersAdmin);
router.get('/admin/users', protect, getAllUsers);
router.post('/admin/create', protect, createHelperForUser);
router.put('/admin/verify/:id', protect, verifyHelper);
router.put('/:id', protect, updateHelperById);
router.delete('/:id', protect, deleteHelper);

module.exports = router;