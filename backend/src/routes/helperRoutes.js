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

const validateAvailability = (req, res, next) => {
  if (req.body.availability) {
    // If workingHours is a string, convert to object
    if (typeof req.body.availability.workingHours === 'string') {
      const timeStr = req.body.availability.workingHours;
      req.body.availability.workingHours = {
        start: timeStr,
        end: '18:00'
      };
    }
    
    if (!req.body.availability.workingHours || 
        typeof req.body.availability.workingHours !== 'object') {
      req.body.availability.workingHours = {
        start: '09:00',
        end: '18:00'
      };
    }
    
    if (!req.body.availability.workingHours.start) {
      req.body.availability.workingHours.start = '09:00';
    }
    if (!req.body.availability.workingHours.end) {
      req.body.availability.workingHours.end = '18:00';
    }
  }
  next();
};

router.get('/', getHelpers);
router.get('/:id', getHelperById);

router.post('/profile', protect, validateAvailability, createHelperProfile);
router.put('/profile', protect, validateAvailability, updateHelperProfile);
router.get('/me/profile', protect, getMyHelperProfile);

router.post('/documents', protect, uploadDocument);
router.get('/documents/status', protect, getDocumentStatus);
router.put('/documents/verify/:helperId', protect, verifyDocument);

router.get('/admin/all', protect, getAllHelpersAdmin);
router.get('/admin/users', protect, getAllUsers);
router.post('/admin/create', protect, validateAvailability, createHelperForUser);
router.put('/admin/verify/:id', protect, verifyHelper);
router.put('/:id', protect, validateAvailability, updateHelperById);
router.delete('/:id', protect, deleteHelper);

module.exports = router;