import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';

export const BorrowRecords: React.FC = () => {
  const [borrows, setBorrows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBorrows();
  }, []);

  const fetchBorrows = async () => {
    try {
      const response = await api.get('/borrow-records');
      setBorrows(response.data);
    } catch (error) {
      console.error('Error fetching borrows:', error);
    }
  };

  const handleReturn = async (borrowId: number) => {
    setLoading(true);
    try {
      await api.post('/borrow-records/return', { borrow_id: borrowId });
      toast.success('Book returned successfully!');
      fetchBorrows();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error returning book');
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Borrow & Return Management</h1>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Book</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Member</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Borrow Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {borrows.map((record) => {
              const isOverdue = !record.return_date && record.due_date < today;
              const status = record.return_date ? 'Returned' : (isOverdue ? 'Overdue' : 'Active');
              
              return (
                <tr key={record.id}>
                  <td className="px-6 py-4">{record.book?.title}</td>
                  <td className="px-6 py-4">{record.member?.name}</td>
                  <td className="px-6 py-4">{record.borrow_date}</td>
                  <td className="px-6 py-4">{record.due_date}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      status === 'Returned' ? 'bg-green-200 text-green-800' :
                      status === 'Overdue' ? 'bg-red-200 text-red-800' :
                      'bg-yellow-200 text-yellow-800'
                    }`}>
                      {status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {!record.return_date && (
                      <button
                        onClick={() => handleReturn(record.id)}
                        disabled={loading}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm flex items-center gap-1"
                      >
                        <RotateCcw size={14} /> Return
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};