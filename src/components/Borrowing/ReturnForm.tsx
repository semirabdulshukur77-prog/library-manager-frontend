import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Book, Member } from '../../types';
import { BookOpen, User, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';

export const ReturnForm: React.FC = () => {
  const [activeBorrows, setActiveBorrows] = useState<any[]>([]);
  const [selectedBorrow, setSelectedBorrow] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (showForm) {
      fetchActiveBorrows();
    }
  }, [showForm]);

  const fetchActiveBorrows = async () => {
    try {
      const response = await api.get('/borrow-records');
      const active = response.data.filter((b: any) => b.status === 'active');
      setActiveBorrows(active);
    } catch (error) {
      console.error('Error fetching borrows:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedBorrow) {
      toast.error('Please select a borrow record');
      return;
    }

    setLoading(true);
    try {
      await api.post('/borrow-records/return', {
        borrowId: parseInt(selectedBorrow),
      });
      toast.success('Book returned successfully!');
      resetForm();
      setShowForm(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error returning book');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedBorrow('');
    fetchActiveBorrows();
  };

  return (
    <>
      <button
        onClick={() => setShowForm(true)}
        className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700"
      >
        <RotateCcw size={20} /> Return Book
      </button>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Return a Book</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2 flex items-center gap-2">
                  <BookOpen size={18} /> Select Borrowed Book
                </label>
                <select
                  value={selectedBorrow}
                  onChange={(e) => setSelectedBorrow(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  required
                >
                  <option value="">Choose a borrow record...</option>
                  {activeBorrows.map((borrow) => (
                    <option key={borrow.id} value={borrow.id}>
                      {borrow.book?.title} - Borrowed by: {borrow.member?.name} - Due: {new Date(borrow.dueDate).toLocaleDateString()}
                    </option>
                  ))}
                </select>
              </div>

              {activeBorrows.length === 0 && (
                <div className="mb-4 p-3 bg-yellow-50 text-yellow-700 rounded-lg">
                  No active borrows to return
                </div>
              )}

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading || activeBorrows.length === 0}
                  className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
                >
                  {loading ? 'Processing...' : 'Return Book'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowForm(false); resetForm(); }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};