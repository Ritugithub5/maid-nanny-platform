import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { FaArrowLeft, FaUpload, FaFile, FaCheck, FaTimes, FaTrash, FaClock } from 'react-icons/fa';

const DocumentUploadPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [docStatus, setDocStatus] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const [selectedDoc, setSelectedDoc] = useState({
    type: '',
    file: null
  });

  useEffect(() => {
    fetchDocumentStatus();
  }, []);

  const fetchDocumentStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'http://localhost:5000/api/helpers/documents/status',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDocStatus(response.data.data);
    } catch (err) {
      console.error('Error fetching document status:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (type, file) => {
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }

      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        setError('Only JPG, PNG, and PDF files are allowed');
        return;
      }

      setSelectedDoc({ type, file });
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedDoc.file) {
      setError('Please select a file');
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('documentType', selectedDoc.type);
      formData.append('document', selectedDoc.file);

      // Simulate upload - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Update local status
      const updatedStatus = { ...docStatus };
      updatedStatus[selectedDoc.type] = {
        ...updatedStatus[selectedDoc.type],
        status: 'uploaded',
        uploadedAt: new Date()
      };
      setDocStatus(updatedStatus);
      
      setSuccess(`✅ ${selectedDoc.type} uploaded successfully! Waiting for admin verification.`);
      setSelectedDoc({ type: '', file: null });
      
      // Refresh status after 2 seconds
      setTimeout(() => {
        fetchDocumentStatus();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-700',
      uploaded: 'bg-blue-100 text-blue-700',
      verified: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700'
    };
    return badges[status] || 'bg-gray-100 text-gray-700';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: '⏳',
      uploaded: '📤',
      verified: '✅',
      rejected: '❌'
    };
    return icons[status] || '📌';
  };

  const documentTypes = [
    { key: 'idProof', label: '🪪 Identity Proof', description: 'Aadhar, PAN, Voter ID, etc.' },
    { key: 'addressProof', label: '🏠 Address Proof', description: 'Electricity Bill, Rent Agreement, etc.' },
    { key: 'backgroundCheck', label: '🔍 Background Check', description: 'Police Clearance Certificate, etc.' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto"></div>
          <p className="mt-6 text-gray-600 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/helper/profile')}
          className="mb-6 flex items-center text-gray-600 hover:text-primary transition"
        >
          <FaArrowLeft className="mr-2" /> Back to Profile
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-6">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              📁 Document Verification
            </h1>
            <p className="text-blue-100 mt-1">
              Upload your documents for verification
            </p>
          </div>

          <div className="p-8 space-y-6">
            {/* Instructions */}
            <div className="bg-blue-50 rounded-xl p-4">
              <p className="text-sm text-blue-700">
                📌 Please upload clear copies of your documents. 
                Accepted formats: <strong>JPG, PNG, PDF</strong> (Max 5MB each)
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                ❌ {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                {success}
              </div>
            )}

            {/* Document Status */}
            <div className="border border-gray-200 rounded-xl p-4">
              <h3 className="font-semibold text-gray-700 mb-3">📋 Current Status</h3>
              <div className="space-y-3">
                {documentTypes.map((doc) => {
                  const status = docStatus?.[doc.key]?.status || 'pending';
                  return (
                    <div key={doc.key} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-700">{doc.label}</p>
                        <p className="text-xs text-gray-500">{doc.description}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(status)}`}>
                        {getStatusIcon(status)} {status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Progress */}
              <div className="mt-3">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Overall Progress</span>
                  <span>{docStatus?.overallProgress || 0}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary rounded-full h-2 transition-all duration-500"
                    style={{ width: `${docStatus?.overallProgress || 0}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Upload Section */}
            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-semibold text-gray-700 mb-3">📤 Upload Document</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                {documentTypes.map((doc) => (
                  <button
                    key={doc.key}
                    onClick={() => {
                      document.getElementById(`file-${doc.key}`).click();
                    }}
                    className={`p-3 rounded-lg border-2 text-center transition ${
                      selectedDoc.type === doc.key
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-primary'
                    }`}
                  >
                    <div className="text-2xl mb-1">{doc.label.split(' ')[0]}</div>
                    <p className="text-xs text-gray-500">{doc.label.split(' ').slice(1).join(' ')}</p>
                    <input
                      type="file"
                      id={`file-${doc.key}`}
                      className="hidden"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={(e) => {
                        if (e.target.files[0]) {
                          handleFileSelect(doc.key, e.target.files[0]);
                        }
                      }}
                    />
                  </button>
                ))}
              </div>

              {selectedDoc.file && (
                <div className="bg-gray-50 rounded-lg p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FaFile className="text-primary text-xl" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">{selectedDoc.file.name}</p>
                      <p className="text-xs text-gray-500">
                        {(selectedDoc.file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedDoc({ type: '', file: null })}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                </div>
              )}

              <button
                onClick={handleUpload}
                disabled={!selectedDoc.file || uploading}
                className="w-full mt-3 bg-primary text-white py-3 rounded-lg hover:bg-secondary transition font-semibold disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <FaUpload /> Upload Document
                  </>
                )}
              </button>
            </div>

            {/* Info */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-700">
                ⚠️ After uploading, documents will be reviewed by admin. 
                You'll be notified once verified.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentUploadPage;