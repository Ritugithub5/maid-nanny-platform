const SOSContact = require('../models/SOSContact');
const User = require('../models/User');
const Helper = require('../models/Helper');

// =============================================
// SOS CONTACT FUNCTIONS
// =============================================

// @desc    Add emergency contact
// @route   POST /api/sos/contacts
// @access  Private
exports.addContact = async (req, res) => {
  try {
    const { name, phone, email, relationship, isPrimary } = req.body;

    // If this is primary, unset other primary contacts
    if (isPrimary) {
      await SOSContact.updateMany(
        { userId: req.user.id, isPrimary: true },
        { isPrimary: false }
      );
    }

    const contact = await SOSContact.create({
      userId: req.user.id,
      name,
      phone,
      email: email || '',
      relationship: relationship || 'Other',
      isPrimary: isPrimary || false
    });

    res.status(201).json({
      success: true,
      message: 'Emergency contact added successfully',
      data: contact
    });
  } catch (error) {
    console.error('Add Contact Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get my emergency contacts
// @route   GET /api/sos/contacts
// @access  Private
exports.getContacts = async (req, res) => {
  try {
    const contacts = await SOSContact.find({ userId: req.user.id, isActive: true })
      .sort({ isPrimary: -1, createdAt: -1 });

    res.json({
      success: true,
      count: contacts.length,
      data: contacts
    });
  } catch (error) {
    console.error('Get Contacts Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update emergency contact
// @route   PUT /api/sos/contacts/:id
// @access  Private
exports.updateContact = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, email, relationship, isPrimary, isActive } = req.body;

    const contact = await SOSContact.findOne({ _id: id, userId: req.user.id });
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    // If this is primary, unset other primary contacts
    if (isPrimary) {
      await SOSContact.updateMany(
        { userId: req.user.id, isPrimary: true, _id: { $ne: id } },
        { isPrimary: false }
      );
    }

    contact.name = name || contact.name;
    contact.phone = phone || contact.phone;
    contact.email = email !== undefined ? email : contact.email;
    contact.relationship = relationship || contact.relationship;
    contact.isPrimary = isPrimary !== undefined ? isPrimary : contact.isPrimary;
    contact.isActive = isActive !== undefined ? isActive : contact.isActive;

    await contact.save();

    res.json({
      success: true,
      message: 'Contact updated successfully',
      data: contact
    });
  } catch (error) {
    console.error('Update Contact Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete emergency contact
// @route   DELETE /api/sos/contacts/:id
// @access  Private
exports.deleteContact = async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await SOSContact.findOneAndDelete({
      _id: id,
      userId: req.user.id
    });

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.json({
      success: true,
      message: 'Contact deleted successfully'
    });
  } catch (error) {
    console.error('Delete Contact Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Trigger SOS alert
// @route   POST /api/sos/alert
// @access  Private
exports.triggerSOS = async (req, res) => {
  try {
    const { location, message } = req.body;

    const contacts = await SOSContact.find({
      userId: req.user.id,
      isActive: true
    }).sort({ isPrimary: -1 });

    if (contacts.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No emergency contacts found. Please add contacts first.'
      });
    }

    const user = await User.findById(req.user.id);
    const helper = await Helper.findOne({ userId: req.user.id });

    const alertData = {
      userName: user.name,
      userEmail: user.email,
      userPhone: user.phone,
      helperName: helper?.fullName || '',
      timestamp: new Date().toISOString(),
      location: location || 'Location not available',
      message: message || 'Emergency! Please contact me immediately.',
      contacts: contacts.map(c => ({ name: c.name, phone: c.phone, email: c.email }))
    };

    // In production, send SMS/Email to all contacts
    // For demo, we'll log it
    console.log('🚨 SOS ALERT TRIGGERED! 🚨');
    console.log('User:', alertData.userName);
    console.log('Contacts:', alertData.contacts);
    console.log('Message:', alertData.message);
    console.log('Location:', alertData.location);

    // Simulate sending alerts
    const sentTo = contacts.map(c => ({
      name: c.name,
      phone: c.phone,
      status: 'sent'
    }));

    res.json({
      success: true,
      message: 'SOS alert sent successfully!',
      data: {
        sentTo,
        alertData
      }
    });
  } catch (error) {
    console.error('Trigger SOS Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};