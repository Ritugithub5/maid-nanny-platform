import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { FaArrowLeft, FaPlus, FaEdit, FaTrash, FaPhone, FaEnvelope, FaUser, FaTimes } from 'react-icons/fa';

const SOSContactsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    relationship: '',
    isPrimary: false
  });

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'http://localhost:5000/api/sos/contacts',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setContacts(response.data.data || []);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const url = editingContact 
        ? `http://localhost:5000/api/sos/contacts/${editingContact._id}`
        : 'http://localhost:5000/api/sos/contacts';
      const method = editingContact ? 'put' : 'post';

      await axios[method](url, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert(editingContact ? '✅ Contact updated!' : '✅ Contact added!');
      setShowModal(false);
      setEditingContact(null);
      setFormData({ name: '', phone: '', email: '', relationship: '', isPrimary: false });
      fetchContacts();
    } catch (error) {
      alert('❌ Error: ' + (error.response?.data?.message || 'Unknown error'));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this contact?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/sos/contacts/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('✅ Contact deleted!');
      fetchContacts();
    } catch (error) {
      alert('❌ Error deleting contact');
    }
  };

  const handleEdit = (contact) => {
    setEditingContact(contact);
    setFormData({
      name: contact.name,
      phone: contact.phone,
      email: contact.email || '',
      relationship: contact.relationship || '',
      isPrimary: contact.isPrimary || false
    });
    setShowModal(true);
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="text-gray-600 hover:text-primary transition">
              <FaArrowLeft className="text-xl" />
            </button>
            <h1 className="text-2xl font-bold text-gray-800">🆘 Emergency Contacts</h1>
          </div>
          <button
            onClick={() => { setEditingContact(null); setFormData({ name: '', phone: '', email: '', relationship: '', isPrimary: false }); setShowModal(true); }}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary transition flex items-center gap-2"
          >
            <FaPlus /> Add Contact
          </button>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
          <p className="text-sm text-yellow-700">
            ⚠️ These contacts will be notified when you trigger the SOS alert.
            Make sure to add at least one contact.
          </p>
          <p className="text-xs text-yellow-600 mt-1">
            💡 The red SOS button will appear on the bottom right of every page once you add a contact.
          </p>
        </div>

        {contacts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="text-6xl mb-4">🆘</div>
            <h3 className="text-xl font-semibold text-gray-700">No emergency contacts</h3>
            <p className="text-gray-500 mt-2">Add contacts to enable SOS feature</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contacts.map(contact => (
              <div key={contact._id} className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <FaUser className="text-primary" />
                      <p className="font-semibold text-gray-900">{contact.name}</p>
                      {contact.isPrimary && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Primary</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                      <FaPhone className="text-gray-400" /> {contact.phone}
                    </div>
                    {contact.email && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FaEnvelope className="text-gray-400" /> {contact.email}
                      </div>
                    )}
                    {contact.relationship && (
                      <p className="text-xs text-gray-500 mt-1">{contact.relationship}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(contact)} className="text-blue-500 hover:text-blue-700">
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDelete(contact._id)} className="text-red-500 hover:text-red-700">
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingContact ? '✏️ Edit Contact' : '➕ Add Emergency Contact'}
                </h2>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                  <FaTimes />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
                  <input
                    type="text"
                    value={formData.relationship}
                    onChange={(e) => setFormData({...formData, relationship: e.target.value})}
                    placeholder="e.g. Spouse, Parent, Friend"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isPrimary}
                    onChange={(e) => setFormData({...formData, isPrimary: e.target.checked})}
                    className="w-4 h-4 text-primary"
                  />
                  <label className="text-sm font-medium text-gray-700">Set as Primary Contact</label>
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary text-white py-2 rounded-lg hover:bg-secondary transition font-semibold"
                >
                  {editingContact ? 'Update Contact' : 'Add Contact'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SOSContactsPage;