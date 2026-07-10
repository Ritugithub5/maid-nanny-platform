const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// Submit contact form
router.post('/submit', async (req, res) => {
  try {
    const { name, phone, email, subject, address, message } = req.body;
    
    if (!name || !phone || !email || !subject || !address || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }
    
    const newContact = new Contact({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      address: address.trim(),
      message: message.trim(),
      submittedAt: new Date(),
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.headers['user-agent'] || ''
    });
    
    await newContact.save();
    
    res.status(201).json({
      success: true,
      message: 'Contact form submitted successfully',
      data: newContact
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting form'
    });
  }
});

// Get all contacts
router.get('/all', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ submittedAt: -1 }).lean();
    res.status(200).json({
      success: true,
      data: contacts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching contacts'
    });
  }
});

// Get the LATEST contact for footer
router.get('/latest', async (req, res) => {
  try {
    const latest = await Contact.findOne().sort({ submittedAt: -1 }).lean();
    
    if (latest) {
      // Return contact info from latest submission
      const contactInfo = {
        phone: latest.phone || '+1 (737) 703-3620',
        email: latest.email || 'support@maidnanny.com',
        officeAddress: latest.address || '123 Care Street',
        officeCity: 'New York, NY 10001'
      };
      res.status(200).json({
        success: true,
        data: contactInfo
      });
    } else {
      // No contacts yet, return defaults
      res.status(200).json({
        success: true,
        data: {
          phone: '+1 (737) 703-3620',
          email: 'support@maidnanny.com',
          officeAddress: '123 Care Street',
          officeCity: 'New York, NY 10001'
        }
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching latest contact'
    });
  }
});

module.exports = router;