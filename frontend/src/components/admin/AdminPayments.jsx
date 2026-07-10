import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { 
  FaArrowLeft, 
  FaRupeeSign, 
  FaCheckCircle, 
  FaClock, 
  FaTimesCircle, 
  FaUser, 
  FaCalendar,
  FaCreditCard,
  FaMobile,
  FaUniversity,
  FaPlus
} from 'react-icons/fa';

const AdminPayments = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [salaries, setSalaries] = useState([]);
  const [payments, setPayments] = useState([]);
  const [paymentSummary, setPaymentSummary] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    totalAmount: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('payments');
  const [showSalaryModal, setShowSalaryModal] = useState(false);
  const [salaryForm, setSalaryForm] = useState({
    helperId: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  });
  const [helpers, setHelpers] = useState([]);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchData();
    fetchHelpers();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const paymentsRes = await axios.get(
        'http://localhost:5000/api/payments/admin/all',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setPayments(paymentsRes.data.data || []);
      setPaymentSummary(paymentsRes.data.summary || {
        total: 0,
        completed: 0,
        pending: 0,
        totalAmount: 0
      });
      
      const salaryRes = await axios.get(
        'http://localhost:5000/api/payments/salary/all',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSalaries(salaryRes.data.data || []);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const fetchHelpers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'http://localhost:5000/api/helpers/admin/all',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHelpers(response.data.data || []);
    } catch (error) {
      console.error('Error fetching helpers:', error);
    }
  };

  const handleCalculateSalary = async (e) => {
    e.preventDefault();
    setProcessing(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/payments/salary/calculate',
        salaryForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('✅ Salary calculated successfully!');
      setShowSalaryModal(false);
      fetchData();
    } catch (error) {
      alert('❌ Error calculating salary: ' + (error.response?.data?.message || 'Unknown error'));
    } finally {
      setProcessing(false);
    }
  };

  const handlePaySalary = async (id) => {
    if (!window.confirm('Pay this salary?')) return;
    setProcessing(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:5000/api/payments/salary/${id}/pay`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('✅ Salary paid successfully!');
      fetchData();
    } catch (error) {
      alert('❌ Error paying salary: ' + (error.response?.data?.message || 'Unknown error'));
      console.error('Pay Salary Error:', error);
    } finally {
      setProcessing(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      completed: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      processing: 'bg-blue-100 text-blue-700',
      failed: 'bg-red-100 text-red-700',
      refunded: 'bg-gray-100 text-gray-700',
      paid: 'bg-green-100 text-green-700'
    };
    return badges[status] || 'bg-gray-100 text-gray-700';
  };

  const getStatusIcon = (status) => {
    const icons = {
      completed: <FaCheckCircle className="text-green-500" />,
      pending: <FaClock className="text-yellow-500" />,
      processing: <FaClock className="text-blue-500" />,
      failed: <FaTimesCircle className="text-red-500" />,
      refunded: <FaTimesCircle className="text-gray-500" />,
      paid: <FaCheckCircle className="text-green-500" />
    };
    return icons[status] || <FaClock className="text-gray-500" />;
  };

  const getPaymentMethodIcon = (method) => {
    const icons = {
      card: <FaCreditCard className="text-blue-500" />,
      upi: <FaMobile className="text-green-500" />,
      netbanking: <FaUniversity className="text-purple-500" />,
      cash: <FaRupeeSign className="text-yellow-500" />
    };
    return icons[method] || <FaCreditCard className="text-gray-500" />;
  };

  const salarySummary = {
    total: salaries.length,
    paid: salaries.filter(s => s.status === 'paid').length,
    pending: salaries.filter(s => s.status === 'pending').length,
    amount: salaries.reduce((sum, s) => sum + s.netPayable, 0)
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
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/admin')} className="text-gray-500 hover:text-primary transition">
              <FaArrowLeft />
            </button>
            <div className="text-2xl">💳</div>
            <h1 className="text-xl font-bold text-gray-800">Admin - Payments</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Welcome, <span className="font-semibold">{user?.name}</span></span>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('payments')}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              activeTab === 'payments' ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            💳 Payments ({payments.length})
          </button>
          <button
            onClick={() => setActiveTab('salaries')}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              activeTab === 'salaries' ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            💰 Salaries ({salaries.length})
          </button>
        </div>

        {/* Payments Tab */}
        {activeTab === 'payments' && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-xl shadow-md p-4 text-center">
                <p className="text-2xl font-bold text-primary">{paymentSummary.total}</p>
                <p className="text-sm text-gray-500">Total Payments</p>
              </div>
              <div className="bg-white rounded-xl shadow-md p-4 text-center">
                <p className="text-2xl font-bold text-green-600">{paymentSummary.completed}</p>
                <p className="text-sm text-gray-500">Completed</p>
              </div>
              <div className="bg-white rounded-xl shadow-md p-4 text-center">
                <p className="text-2xl font-bold text-yellow-600">{paymentSummary.pending}</p>
                <p className="text-sm text-gray-500">Pending</p>
              </div>
              <div className="bg-white rounded-xl shadow-md p-4 text-center">
                <p className="text-2xl font-bold text-blue-600">₹{paymentSummary.totalAmount.toFixed(0)}</p>
                <p className="text-sm text-gray-500">Total Amount</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">Payment History</h2>
              </div>

              {payments.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="text-6xl mb-4">💳</div>
                  <h3 className="text-xl font-semibold text-gray-700">No payments yet</h3>
                  <p className="text-gray-500 mt-2">Payments will appear here once households make payments</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {payments.map(payment => (
                    <div key={payment._id} className="p-4 hover:bg-gray-50 transition">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                            {getPaymentMethodIcon(payment.paymentMethod)}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {payment.householdUserId?.name || 'Unknown'} → {payment.helperId?.fullName || 'Unknown Helper'}
                            </p>
                            <p className="text-sm text-gray-500">
                              {payment.bookingId?.serviceType || 'Service'} • 
                              {payment.bookingId?.serviceDate && new Date(payment.bookingId.serviceDate).toLocaleDateString('en-IN', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </p>
                            <p className="text-xs text-gray-400">
                              {payment.paymentMethod?.toUpperCase() || 'Unknown'} • 
                              {new Date(payment.createdAt).toLocaleDateString('en-IN', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-primary">₹{payment.amount}</p>
                          <div className="flex items-center gap-1 justify-end">
                            {getStatusIcon(payment.paymentStatus)}
                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(payment.paymentStatus)}`}>
                              {payment.paymentStatus.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Salaries Tab */}
        {activeTab === 'salaries' && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-xl shadow-md p-4 text-center">
                <p className="text-2xl font-bold text-primary">{salarySummary.total}</p>
                <p className="text-sm text-gray-500">Total Salary Records</p>
              </div>
              <div className="bg-white rounded-xl shadow-md p-4 text-center">
                <p className="text-2xl font-bold text-yellow-600">{salarySummary.pending}</p>
                <p className="text-sm text-gray-500">Pending</p>
              </div>
              <div className="bg-white rounded-xl shadow-md p-4 text-center">
                <p className="text-2xl font-bold text-green-600">{salarySummary.paid}</p>
                <p className="text-sm text-gray-500">Paid</p>
              </div>
              <div className="bg-white rounded-xl shadow-md p-4 text-center">
                <p className="text-2xl font-bold text-blue-600">₹{salarySummary.amount.toFixed(0)}</p>
                <p className="text-sm text-gray-500">Total Amount</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800">Salary Records</h2>
                <button
                  onClick={() => setShowSalaryModal(true)}
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary transition text-sm flex items-center gap-2"
                >
                  <FaPlus /> Calculate Salary
                </button>
              </div>

              {salaries.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="text-6xl mb-4">💰</div>
                  <h3 className="text-xl font-semibold text-gray-700">No salary records</h3>
                  <p className="text-gray-500 mt-2">Click "Calculate Salary" to generate salary records for helpers</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {salaries.map(salary => (
                    <div key={salary._id} className="p-4 hover:bg-gray-50 transition">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {salary.helperId?.fullName || 'Unknown Helper'}
                          </p>
                          <p className="text-sm text-gray-500">
                            <FaCalendar className="inline mr-1 text-gray-400" />
                            {salary.month} {salary.year} • {salary.bookings?.length || 0} bookings
                          </p>
                          <p className="text-sm text-gray-500">
                            Total Earnings: ₹{salary.totalEarnings?.toFixed(0) || 0} • 
                            Platform Fee: ₹{salary.platformFee?.toFixed(0) || 0}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-primary">₹{salary.netPayable?.toFixed(0) || 0}</p>
                          <div className="flex items-center gap-2 justify-end mt-1">
                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(salary.status)}`}>
                              {salary.status.toUpperCase()}
                            </span>
                            {salary.status === 'pending' && (
                              <button
                                onClick={() => handlePaySalary(salary._id)}
                                disabled={processing}
                                className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition text-sm disabled:opacity-50"
                              >
                                {processing ? 'Processing...' : 'Pay Now'}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Calculate Salary Modal */}
      {showSalaryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">💰 Calculate Salary</h2>
              <button onClick={() => setShowSalaryModal(false)} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleCalculateSalary} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Helper</label>
                <select
                  value={salaryForm.helperId}
                  onChange={(e) => setSalaryForm({...salaryForm, helperId: e.target.value})}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select a helper</option>
                  {helpers.map(helper => (
                    <option key={helper._id} value={helper._id}>
                      {helper.fullName} ({helper.serviceType?.join(', ')})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
                  <select
                    value={salaryForm.month}
                    onChange={(e) => setSalaryForm({...salaryForm, month: parseInt(e.target.value)})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  >
                    {[1,2,3,4,5,6,7,8,9,10,11,12].map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                  <input
                    type="number"
                    value={salaryForm.year}
                    onChange={(e) => setSalaryForm({...salaryForm, year: parseInt(e.target.value)})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={processing}
                className="w-full bg-primary text-white py-2 rounded-lg hover:bg-secondary transition font-semibold disabled:opacity-50"
              >
                {processing ? 'Calculating...' : 'Calculate Salary'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPayments;