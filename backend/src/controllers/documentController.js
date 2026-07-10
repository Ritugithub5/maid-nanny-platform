const Helper = require('../models/Helper');

// @desc    Upload document (Helper)
// @route   POST /api/helpers/documents
// @access  Private (Helper only)
exports.uploadDocument = async (req, res) => {
  try {
    const helper = await Helper.findOne({ userId: req.user.id });
    if (!helper) {
      return res.status(404).json({
        success: false,
        message: 'Helper profile not found'
      });
    }

    const { documentType, documentUrl } = req.body;

    const validTypes = ['idProof', 'addressProof', 'backgroundCheck'];
    if (!validTypes.includes(documentType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid document type'
      });
    }

    const statusField = `${documentType}Status`;
    const uploadedField = `${documentType}UploadedAt`;
    
    helper.verificationDocuments[documentType] = documentUrl || 'uploaded';
    helper.verificationDocuments[statusField] = 'uploaded';
    helper.verificationDocuments[uploadedField] = new Date();

    await helper.save();

    res.json({
      success: true,
      message: 'Document uploaded successfully!',
      data: {
        documentType,
        status: 'uploaded'
      }
    });
  } catch (error) {
    console.error('Upload Document Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get document status (Helper)
// @route   GET /api/helpers/documents/status
// @access  Private (Helper only)
exports.getDocumentStatus = async (req, res) => {
  try {
    const helper = await Helper.findOne({ userId: req.user.id });
    if (!helper) {
      return res.status(404).json({
        success: false,
        message: 'Helper profile not found'
      });
    }

    const docStatus = {
      idProof: {
        status: helper.verificationDocuments.idProofStatus || 'pending',
        uploadedAt: helper.verificationDocuments.idProofUploadedAt,
        verifiedAt: helper.verificationDocuments.idProofVerifiedAt,
        rejectionReason: helper.verificationDocuments.idProofRejectionReason
      },
      addressProof: {
        status: helper.verificationDocuments.addressProofStatus || 'pending',
        uploadedAt: helper.verificationDocuments.addressProofUploadedAt,
        verifiedAt: helper.verificationDocuments.addressProofVerifiedAt,
        rejectionReason: helper.verificationDocuments.addressProofRejectionReason
      },
      backgroundCheck: {
        status: helper.verificationDocuments.backgroundCheckStatus || 'pending',
        uploadedAt: helper.verificationDocuments.backgroundCheckUploadedAt,
        verifiedAt: helper.verificationDocuments.backgroundCheckVerifiedAt,
        rejectionReason: helper.verificationDocuments.backgroundCheckRejectionReason
      }
    };

    const total = 3;
    let completed = 0;
    if (docStatus.idProof.status === 'verified') completed++;
    if (docStatus.addressProof.status === 'verified') completed++;
    if (docStatus.backgroundCheck.status === 'verified') completed++;
    const overallProgress = Math.round((completed / total) * 100);

    res.json({
      success: true,
      data: {
        ...docStatus,
        overallProgress,
        isComplete: completed === total
      }
    });
  } catch (error) {
    console.error('Get Document Status Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Admin: Verify document
// @route   PUT /api/helpers/documents/verify/:helperId
// @access  Private (Admin only)
exports.verifyDocument = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can verify documents'
      });
    }

    const { helperId } = req.params;
    const { documentType, status, rejectionReason } = req.body;

    const helper = await Helper.findById(helperId);
    if (!helper) {
      return res.status(404).json({
        success: false,
        message: 'Helper not found'
      });
    }

    const validTypes = ['idProof', 'addressProof', 'backgroundCheck'];
    if (!validTypes.includes(documentType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid document type'
      });
    }

    const statusField = `${documentType}Status`;
    const verifiedField = `${documentType}VerifiedAt`;
    const rejectionField = `${documentType}RejectionReason`;

    helper.verificationDocuments[statusField] = status;
    
    if (status === 'verified') {
      helper.verificationDocuments[verifiedField] = new Date();
      helper.verificationDocuments[rejectionField] = '';
    } else if (status === 'rejected') {
      helper.verificationDocuments[rejectionField] = rejectionReason || 'Document rejected';
    }

    await helper.save();

    const allVerified = 
      helper.verificationDocuments.idProofStatus === 'verified' &&
      helper.verificationDocuments.addressProofStatus === 'verified' &&
      helper.verificationDocuments.backgroundCheckStatus === 'verified';

    if (allVerified) {
      helper.verificationStatus = 'verified';
      await helper.save();
    }

    res.json({
      success: true,
      message: `Document ${status} successfully`,
      data: {
        documentType,
        status,
        allVerified
      }
    });
  } catch (error) {
    console.error('Verify Document Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};