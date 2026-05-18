import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface Staff {
  id: number;
  email: string;
  role: string;
  createdAt: string;
}

export const StaffManager: React.FC = () => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'librarian',
  });

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const response = await api.get('/staff');
      setStaff(response.data);
    } catch (error) {
      console.error('Error fetching staff:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/staff', formData);
      toast.success('Staff account created successfully');
      fetchStaff();
      setShowForm(false);
      setFormData({ email: '', password: '', role: 'librarian' });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error creating staff account');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this staff account?')) {
      try {
        await api.delete(`/staff/${id}`);
        toast.success('Staff account deleted successfully');
        fetchStaff();
      } catch (error) {
        toast.error('Error deleting staff account');
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Staff Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700"
        >
          <Plus size={20} /> Add New Staff
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Register New Staff</h2>
            <form onSubmit={handleSubmit}>
              <input 
                type="email" 
                placeholder="Email" 
                value={formData.email} 
                onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                className="w-full p-2 border rounded mb-3" 
                required 
              />
              <input 
                type="password" 
                placeholder="Password" 
                value={formData.password} 
                onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
                className="w-full p-2 border rounded mb-3" 
                required 
              />
              <select 
                value={formData.role} 
                onChange={(e) => setFormData({ ...formData, role: e.target.value })} 
                className="w-full p-2 border rounded mb-3"
              >
                <option value="librarian">Librarian</option>
                <option value="admin">Admin</option>
              </select>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">Register</button>
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created At</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {staff.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4">{user.id}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs ${user.role === 'admin' ? 'bg-purple-200 text-purple-800' : 'bg-blue-200 text-blue-800'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}</td>
                <td className="px-6 py-4">
                  <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-800">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};