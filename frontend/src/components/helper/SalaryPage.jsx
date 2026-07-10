import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { FaArrowLeft, FaRupeeSign, FaCheckCircle, FaClock, FaCalendar, FaMoneyBillWave } from 'react-icons/fa';

const SalaryPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [salaries, setSalaries] = useState([]);
  const [summary, setSummary] = useState({
    totalEarnings: 0,
    totalPaid: 0,
    totalPending: 0,
    monthsWorked: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSalary();
  }, []);

  const fetchSalary = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'http://localhost:5000/api/payments/salary/me',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const data = response.data.data || {};
      setSalaries(data.salaries || []);
      setSummary(data.summary || {
        totalEarnings: 0,
        totalPaid: 0,
        totalPending: 0,
        monthsWorked: 0
      });
    } catch (error) {
      console.error('Error fetching salary:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMonthName = (month) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[parseInt(month) - 1] || month;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto"></div>
          <p className="mt-6 text-gray-600 text-lg">Loading salary...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-gray-600 hover:text-primary transition"
          >
            <FaArrowLeft className="text-xl" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaMoneyBillWave /> My Salary
          </h1>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-md p-4 text-center">
            <p className="text-2xl font-bold text-primary">₹{summary.totalEarnings.toFixed(0)}</p>
            <p className="text-sm text-gray-500">Total Earnings</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 text-center">
            <p className="text-2xl font-bold text-green-600">₹{summary.totalPaid.toFixed(0)}</p>
            <p className="text-sm text-gray-500">Paid</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 text-center">
            <p className="text-2xl font-bold text-yellow-600">₹{summary.totalPending.toFixed(0)}</p>
            <p className="text-sm text-gray-500">Pending</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{summary.monthsWorked}</p>
            <p className="text-sm text-gray-500">Months Worked</p>
          </div>
        </div>

        {/* Salary History */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Salary History</h2>
          </div>

          {salaries.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">💰</div>
              <h3 className="text-xl font-semibold text-gray-700">No salary records</h3>
              <p className="text-gray-500 mt-2">Complete bookings to earn salary</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {salaries.map(salary => (
                <div key={salary._id} className="p-4 hover:bg-gray-50 transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900 flex items-center gap-2">
                        <FaCalendar className="text-primary" />
                        {getMonthName(salary.month)} {salary.year}
                      </p>
                      <p className="text-sm text-gray-500">
                        {salary.bookings?.length || 0} bookings • 
                        {salary.status === 'paid' ? '✅ Paid' : '⏳ Pending'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">₹{salary.netPayable?.toFixed(0) || 0}</p>
                      <div className="flex items-center gap-1 justify-end">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          salary.status === 'paid' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {salary.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalaryPage;