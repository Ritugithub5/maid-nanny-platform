import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const AttendancePage = () => {
  const navigate = useNavigate();
  const [attendance, setAttendance] = useState([]);
  const [summary, setSummary] = useState({ present: 0, absent: 0, leave: 0, totalWorkingHours: 0 });
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [todayStatus, setTodayStatus] = useState(null);

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'http://localhost:5000/api/attendance/me',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = response.data.data;
      setAttendance(data.attendance || []);
      setSummary(data.summary || {});
      
      // Find today's record
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const todayRecord = data.attendance?.find(a => {
        const recordDate = new Date(a.date);
        recordDate.setHours(0, 0, 0, 0);
        return recordDate.getTime() === today.getTime();
      });
      
      setTodayStatus(todayRecord || null);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    setChecking(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/attendance/check-in',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('✅ Checked in at ' + response.data.data.checkInTime);
      fetchAttendance();
    } catch (error) {
      alert('❌ Error: ' + (error.response?.data?.message || 'Already checked in today'));
    } finally {
      setChecking(false);
    }
  };

  const handleCheckOut = async () => {
    setChecking(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        'http://localhost:5000/api/attendance/check-out',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('✅ Checked out! Hours: ' + response.data.data.workingHours.toFixed(1) + 'h');
      fetchAttendance();
    } catch (error) {
      alert('❌ Error: ' + (error.response?.data?.message || 'Please check in first'));
    } finally {
      setChecking(false);
    }
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
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate('/dashboard')} className="text-gray-600 hover:text-primary transition">
            <FaArrowLeft className="text-xl" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">📋 Attendance</h1>
        </div>

        {/* Check-in/out Buttons */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-wrap gap-4">
            {/* If checked in AND NOT checked out -> Show Check Out */}
            {todayStatus?.checkInTime && !todayStatus?.checkOutTime ? (
              <button
                onClick={handleCheckOut}
                disabled={checking}
                className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition font-semibold disabled:opacity-50"
              >
                <FaTimesCircle className="inline mr-2" /> {checking ? 'Processing...' : '❌ Check Out'}
              </button>
            ) : todayStatus?.checkInTime && todayStatus?.checkOutTime ? (
              /* If both exist -> Completed */
              <div className="text-green-600 font-semibold">
                ✅ Completed for today ({todayStatus.workingHours.toFixed(1)}h)
              </div>
            ) : (
              /* If no check-in -> Show Check In */
              <button
                onClick={handleCheckIn}
                disabled={checking}
                className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition font-semibold disabled:opacity-50"
              >
                <FaCheckCircle className="inline mr-2" /> {checking ? 'Processing...' : '✅ Check In'}
              </button>
            )}
            
            <button
              onClick={() => navigate('/helper/leaves')}
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-secondary transition font-semibold"
            >
              📅 Apply Leave
            </button>
          </div>
          
          {/* Today's Status */}
          {todayStatus && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Date</p>
                  <p className="font-semibold">{new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Check In</p>
                  <p className="font-semibold text-green-600">{todayStatus.checkInTime || 'Not checked in'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Check Out</p>
                  <p className="font-semibold text-red-600">{todayStatus.checkOutTime || 'Not checked out'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total Hours</p>
                  <p className="font-semibold text-blue-600">{todayStatus.workingHours?.toFixed(1) || '0.0'}h</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-md p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{summary.present || 0}</p>
            <p className="text-sm text-gray-500">Present</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 text-center">
            <p className="text-2xl font-bold text-red-600">{summary.absent || 0}</p>
            <p className="text-sm text-gray-500">Absent</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 text-center">
            <p className="text-2xl font-bold text-yellow-600">{summary.leave || 0}</p>
            <p className="text-sm text-gray-500">Leave</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{summary.totalWorkingHours?.toFixed(1) || 0}h</p>
            <p className="text-sm text-gray-500">Total Hours</p>
          </div>
        </div>

        {/* History */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">History</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check In</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check Out</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hours</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {attendance.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No records found</td>
                  </tr>
                ) : (
                  attendance.map(record => (
                    <tr key={record._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm">
                        {new Date(record.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          record.status === 'present' ? 'bg-green-100 text-green-700' :
                          record.status === 'absent' ? 'bg-red-100 text-red-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {record.status?.toUpperCase() || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">{record.checkInTime || '-'}</td>
                      <td className="px-6 py-4 text-sm">{record.checkOutTime || '-'}</td>
                      <td className="px-6 py-4 text-sm font-medium text-blue-600">
                        {record.workingHours?.toFixed(1) || 0}h
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;