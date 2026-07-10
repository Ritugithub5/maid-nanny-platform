const express = require('express');
const router = express.Router();
const {
  addContact,
  getContacts,
  updateContact,
  deleteContact,
  triggerSOS
} = require('../controllers/sosController');
const { protect } = require('../middleware/auth');

router.post('/contacts', protect, addContact);
router.get('/contacts', protect, getContacts);
router.put('/contacts/:id', protect, updateContact);
router.delete('/contacts/:id', protect, deleteContact);
router.post('/alert', protect, triggerSOS);

module.exports = router;