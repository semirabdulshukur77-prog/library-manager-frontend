import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Member } from '../../types';
import { Plus, Edit, Trash2, Search, History } from 'lucide-react';
import toast from 'react-hot-toast';

export const MemberList: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [showHistory, setShowHistory] = useState<number | null>(null);
  const [borrowingHistory, setBorrowingHistory] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    membershipDate: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await api.get('/members');
      setMembers(response.data);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const fetchBorrowingHistory = async (memberId: number) => {
    try {
      const response = await api.get(`/members/${memberId}/borrowing-history`);
      setBorrowingHistory(response.data);
      setShowHistory(memberId);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingMember) {
        await api.patch(`/members/${editingMember.id}`, formData);
        toast.success('Member updated successfully');
      } else {
        await api.post('/members', formData);
        toast.success('Member registered successfully');
      }
      fetchMembers();
      setShowForm(false);
      setEditingMember(null);
      resetForm();
    } catch (error) {
      toast.error('Error saving member');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      try {
        await api.delete(`/members/${id}`);
        toast.success('Member deleted successfully');
        fetchMembers();
      } catch (error) {
        toast.error('Error deleting member');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      membershipDate: new Date().toISOString().split('T')[0],
    });
  };

  const editMember = (member: Member) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      email: member.email,
      phone: member.phone,
      address: member.address,
      membershipDate: member.membershipDate.split('T')[0],
    });
    setShowForm(true);
  };

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(search.toLowerCase()) ||
    member.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Members Management</h1>
        <button
          onClick={() => {
            setEditingMember(null);
            resetForm();
            setShowForm(true);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700"
        >
          <Plus size={20} /> Register New Member
        </button>
      </div>

      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search members by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-lg"
        />
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">{editingMember ? 'Edit Member' : 'Register New Member'}</h2>
            <form onSubmit={handleSubmit}>
              <input type="text" placeholder="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full p-2 border rounded mb-3" required />
              <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full p-2 border rounded mb-3" required />
              <input type="tel" placeholder="Phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full p-2 border rounded mb-3" required />
              <textarea placeholder="Address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full p-2 border rounded mb-3" required />
              <input type="date" placeholder="Membership Date" value={formData.membershipDate} onChange={(e) => setFormData({ ...formData, membershipDate: e.target.value })} className="w-full p-2 border rounded mb-3" required />
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700">Save</button>
                <button type="button" onClick={() => { setShowForm(false); setEditingMember(null); }} className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-2xl font-bold mb-4">Borrowing History</h2>
            <div className="max-h-96 overflow-y-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">Book</th>
                    <th className="px-4 py-2 text-left">Borrow Date</th>
                    <th className="px-4 py-2 text-left">Due Date</th>
                    <th className="px-4 py-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {borrowingHistory.map((record: any) => (
                    <tr key={record.id}>
                      <td className="px-4 py-2">{record.book?.title}</td>
                      <td className="px-4 py-2">{new Date(record.borrowDate).toLocaleDateString()}</td>
                      <td className="px-4 py-2">{new Date(record.dueDate).toLocaleDateString()}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded text-xs ${record.status === 'active' ? 'bg-yellow-200 text-yellow-800' : record.status === 'overdue' ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button onClick={() => setShowHistory(null)} className="mt-4 w-full bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400">Close</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Membership Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredMembers.map((member) => (
              <tr key={member.id}>
                <td className="px-6 py-4">{member.name}</td>
                <td className="px-6 py-4">{member.email}</td>
                <td className="px-6 py-4">{member.phone}</td>
                <td className="px-6 py-4">{new Date(member.membershipDate).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <button onClick={() => fetchBorrowingHistory(member.id)} className="text-blue-600 hover:text-blue-800 mr-3" title="View History">
                    <History size={18} />
                  </button>
                  <button onClick={() => editMember(member)} className="text-green-600 hover:text-green-800 mr-3">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDelete(member.id)} className="text-red-600 hover:text-red-800">
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