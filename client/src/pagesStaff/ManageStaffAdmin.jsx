import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaTrash } from 'react-icons/fa';

const ManageStaffAdmin = () => {
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [staffList, setStaffList] = useState([]);
  const [adminList, setAdminList] = useState([]);

  const [staffFormData, setStaffFormData] = useState({
    name: '',
    email: '',
    emp_id: '',
    password: ''
  });

  const [adminFormData, setAdminFormData] = useState({
    name: '',
    email: '',
    emp_id: '',
    password: '',
    ssn: ''
  });

  // Fetch staff and admin lists
  useEffect(() => {
    fetchStaffList();
    fetchAdminList();
  }, []);

  const fetchStaffList = async () => {
    try {
      const res = await fetch('/api/staff/get-all-staff');
      const data = await res.json();
      if (data.success) {
        setStaffList(data.data);
      }
    } catch (error) {
      toast.error('Error fetching staff list', {
        position: 'top-right',
        autoClose: 3000
      });
    }
  };

  const fetchAdminList = async () => {
    try {
      const res = await fetch('/api/staff/get-all-admins');
      const data = await res.json();
      if (data.success) {
        setAdminList(data.data);
      }
    } catch (error) {
      toast.error('Error fetching admin list', {
        position: 'top-right',
        autoClose: 3000
      });
    }
  };

  const handleStaffSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch('/api/staff/create-staff', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(staffFormData),
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      toast.success('Staff member added successfully!', {
        position: 'top-right',
        autoClose: 3000
      });
      setShowStaffModal(false);
      setStaffFormData({ name: '', email: '', emp_id: '', password: '' });
      fetchStaffList(); // Refresh the list
    } catch (error) {
      toast.error(error.message || 'Error adding staff member', {
        position: 'top-right',
        autoClose: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch('/api/staff/create-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(adminFormData),
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      toast.success('Admin added successfully!', {
        position: 'top-right',
        autoClose: 3000
      });
      setShowAdminModal(false);
      setAdminFormData({ name: '', email: '', emp_id: '', password: '', ssn: '' });
      fetchAdminList(); // Refresh the list
    } catch (error) {
      toast.error(error.message || 'Error adding admin', {
        position: 'top-right',
        autoClose: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStaff = async (id) => {
    if (!window.confirm('Are you sure you want to delete this staff member?')) return;
    
    try {
      const res = await fetch(`/api/staff/delete-staff/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Staff member deleted successfully', {
          position: 'top-right',
          autoClose: 3000
        });
        fetchStaffList(); // Refresh the list
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast.error(error.message || 'Error deleting staff member', {
        position: 'top-right',
        autoClose: 3000
      });
    }
  };

  const handleDeleteAdmin = async (id) => {
    if (!window.confirm('Are you sure you want to delete this admin?')) return;
    
    try {
      const res = await fetch(`/api/staff/delete-admin/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Admin deleted successfully', {
          position: 'top-right',
          autoClose: 3000
        });
        fetchAdminList(); // Refresh the list
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast.error(error.message || 'Error deleting admin', {
        position: 'top-right',
        autoClose: 3000
      });
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Manage Staff & Admin</h2>
      
      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <button
          onClick={() => setShowStaffModal(true)}
          className="bg-blue-600 text-white p-6 rounded-lg hover:bg-blue-700 transition duration-200 flex flex-col items-center justify-center space-y-2"
        >
          <span className="text-2xl font-semibold">Add Staff</span>
          <span className="text-sm opacity-90">Create new staff account</span>
        </button>

        <button
          onClick={() => setShowAdminModal(true)}
          className="bg-blue-800 text-white p-6 rounded-lg hover:bg-blue-900 transition duration-200 flex flex-col items-center justify-center space-y-2"
        >
          <span className="text-2xl font-semibold">Add Admin</span>
          <span className="text-sm opacity-90">Create new admin account</span>
        </button>
      </div>


      {/* Admin List */}
      <div className="mb-8">
        <h3 className="text-2xl font-semibold mb-4">Admins</h3>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {adminList.map((admin) => (
                <tr key={admin._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{admin.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{admin.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{admin.emp_id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleDeleteAdmin(admin._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>



      {/* Staff List */}
      <div className="mb-8">
        <h3 className="text-2xl font-semibold mb-4">Staff Members</h3>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {staffList.map((staff) => (
                <tr key={staff._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{staff.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{staff.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{staff.emp_id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleDeleteStaff(staff._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Staff Modal */}
      {showStaffModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold mb-6">Add New Staff</h3>
            <form onSubmit={handleStaffSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={staffFormData.name}
                  onChange={(e) => setStaffFormData({...staffFormData, name: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={staffFormData.email}
                  onChange={(e) => setStaffFormData({...staffFormData, email: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
                <input
                  type="text"
                  value={staffFormData.emp_id}
                  onChange={(e) => setStaffFormData({...staffFormData, emp_id: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={staffFormData.password}
                  onChange={(e) => setStaffFormData({...staffFormData, password: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowStaffModal(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400"
                >
                  {loading ? 'Adding...' : 'Add Staff'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Modal */}
      {showAdminModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold mb-6">Add New Admin</h3>
            <form onSubmit={handleAdminSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={adminFormData.name}
                  onChange={(e) => setAdminFormData({...adminFormData, name: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={adminFormData.email}
                  onChange={(e) => setAdminFormData({...adminFormData, email: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
                <input
                  type="text"
                  value={adminFormData.emp_id}
                  onChange={(e) => setAdminFormData({...adminFormData, emp_id: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={adminFormData.password}
                  onChange={(e) => setAdminFormData({...adminFormData, password: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SSN</label>
                <input
                  type="text"
                  value={adminFormData.ssn}
                  onChange={(e) => setAdminFormData({...adminFormData, ssn: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  placeholder="XXX-XX-XXXX"
                  pattern="^\d{3}-\d{2}-\d{4}$"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAdminModal(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-800 text-white rounded hover:bg-blue-900 disabled:bg-blue-600"
                >
                  {loading ? 'Adding...' : 'Add Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageStaffAdmin; 