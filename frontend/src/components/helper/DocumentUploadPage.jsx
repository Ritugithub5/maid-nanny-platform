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
  
  const [documents, setDocuments] = useState({
    idProof: null,
    addressProof: null,
    backgroundCheck: null
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
      // No documents yet
      console.log('No documents uploaded yet');
      setDocStatus(null);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        setError('Only JPG, PNG, and PDF files are allowed');
        return;
      }

      setDocuments({
        ...documents,
        [type]: file
      });
      setError(null);
    }
  };

  const removeFile = (type) => {
    setDocuments({
      ...documents,
      [type]: null
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if any document is selected
    const hasDocument = Object.values(documents).some(doc => doc !== null);
    if (!hasDocument) {
      setError('Please select at least one document to upload');
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem('token');
      
      // Upload each document individually
      const uploadPromises = [];
      const documentTypes = ['idProof', 'addressProof', 'backgroundCheck'];
      
      for (const type of documentTypes) {
        if (documents[type]) {
          // In production, you would use FormData with multer
          // For now, we'll simulate the upload and update status
          const payload = {
            documentType: type,
            documentUrl: 'uploaded' // In production, this would be the file URL
          };
          
          uploadPromises.push(
            axios.post(
              'http://localhost:5000/api/helpers/documents',
              payload,
              { headers: { Authorization: `Bearer ${token}` } }
            )
          );
        }
      }

      // Wait for all uploads to complete
      await Promise.all(uploadPromises);

      // Refresh document status
      await fetchDocumentStatus();
      
      setSuccess('✅ Documents uploaded successfully! Waiting for admin verification.');
      setDocuments({
        idProof: null,
        addressProof: null,
        backgroundCheck: null
      });
      
      setUploading(false);
      
      // Navigate back to profile after 2 seconds
      setTimeout(() => {
        navigate('/helper/profile');
      }, 2000);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload documents');
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
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/helper/profile')}
                className="text-white hover:text-blue-200 transition"
              >
                <FaArrowLeft className="text-xl" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  <FaUpload /> Upload Documents
                </h1>
                <p className="text-blue-100 mt-1">
                  Upload your verification documents for admin approval
                </p>
              </div>
            </div>
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

            {/* Current Document Status */}
            {docStatus && (
              <div className="border border-gray-200 rounded-xl p-4">
                <h3 className="font-semibold text-gray-700 mb-3">📋 Current Status</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">🪪 Identity Proof</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(docStatus.idProof?.status)}`}>
                      {getStatusIcon(docStatus.idProof?.status)} {docStatus.idProof?.status || 'pending'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">🏠 Address Proof</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(docStatus.addressProof?.status)}`}>
                      {getStatusIcon(docStatus.addressProof?.status)} {docStatus.addressProof?.status || 'pending'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">🔍 Background Check</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(docStatus.backgroundCheck?.status)}`}>
                      {getStatusIcon(docStatus.backgroundCheck?.status)} {docStatus.backgroundCheck?.status || 'pending'}
                    </span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mt-3">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Overall Progress</span>
                      <span>{docStatus.overallProgress || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary rounded-full h-2 transition-all duration-500"
                        style={{ width: `${docStatus.overallProgress || 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* If no documents uploaded yet */}
            {!docStatus && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                <p className="text-yellow-700">📌 No documents uploaded yet</p>
                <p className="text-sm text-yellow-600 mt-1">
                  Upload your documents for verification below
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Identity Proof */}
              <div className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <label className="font-medium text-gray-700">
                    🪪 Identity Proof (Aadhar, PAN, etc.)
                  </label>
                  {documents.idProof && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      ✅ Selected
                    </span>
                  )}
                </div>

                {documents.idProof ? (
                  <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <FaFile className="text-primary text-xl" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          {documents.idProof.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(documents.idProof.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile('idProof')}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <input
                      type="file"
                      id="idProof"
                      onChange={(e) => handleFileChange(e, 'idProof')}
                      accept=".jpg,.jpeg,.png,.pdf"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition">
                      <FaUpload className="text-3xl text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Click to upload Identity Proof</p>
                      <p className="text-xs text-gray-400">JPG, PNG, PDF (Max 5MB)</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Address Proof */}
              <div className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <label className="font-medium text-gray-700">
                    🏠 Address Proof (Electricity Bill, Rent Agreement, etc.)
                  </label>
                  {documents.addressProof && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      ✅ Selected
                    </span>
                  )}
                </div>

                {documents.addressProof ? (
                  <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <FaFile className="text-primary text-xl" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          {documents.addressProof.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(documents.addressProof.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile('addressProof')}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <input
                      type="file"
                      id="addressProof"
                      onChange={(e) => handleFileChange(e, 'addressProof')}
                      accept=".jpg,.jpeg,.png,.pdf"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition">
                      <FaUpload className="text-3xl text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Click to upload Address Proof</p>
                      <p className="text-xs text-gray-400">JPG, PNG, PDF (Max 5MB)</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Background Check */}
              <div className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <label className="font-medium text-gray-700">
                    🔍 Background Check (Police Clearance, etc.)
                  </label>
                  {documents.backgroundCheck && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      ✅ Selected
                    </span>
                  )}
                </div>

                {documents.backgroundCheck ? (
                  <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <FaFile className="text-primary text-xl" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          {documents.backgroundCheck.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(documents.backgroundCheck.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile('backgroundCheck')}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <input
                      type="file"
                      id="backgroundCheck"
                      onChange={(e) => handleFileChange(e, 'backgroundCheck')}
                      accept=".jpg,.jpeg,.png,.pdf"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition">
                      <FaUpload className="text-3xl text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Click to upload Background Check</p>
                      <p className="text-xs text-gray-400">JPG, PNG, PDF (Max 5MB)</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 bg-primary text-white py-3 rounded-lg hover:bg-secondary transition font-semibold disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <FaUpload /> Upload Documents
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/helper/profile')}
                  className="px-6 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentUploadPage;