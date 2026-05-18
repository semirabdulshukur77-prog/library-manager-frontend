import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { AlertCircle, BarChart3, BookOpen } from 'lucide-react';

export const Reports: React.FC = () => {
  const [overdueBooks, setOverdueBooks] = useState<any[]>([]);
  const [popularGenres, setPopularGenres] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>({});

  useEffect(() => {
    fetchOverdueBooks();
    fetchPopularGenres();
    fetchSummary();
  }, []);

  const fetchOverdueBooks = async () => {
    try {
      const response = await api.get('/borrow-records/reports/overdue');
      setOverdueBooks(response.data);
    } catch (error) {
      console.error('Error fetching overdue books:', error);
    }
  };

  const fetchPopularGenres = async () => {
    try {
      const response = await api.get('/borrow-records/reports/popular-genres');
      setPopularGenres(response.data);
    } catch (error) {
      console.error('Error fetching popular genres:', error);
    }
  };

  const fetchSummary = async () => {
    try {
      const response = await api.get('/borrow-records/reports/summary');
      setSummary(response.data);
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Reports Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <AlertCircle className="text-red-500" /> Overdue Books
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">Book Title</th>
                  <th className="px-4 py-2 text-left">Member</th>
                  <th className="px-4 py-2 text-left">Due Date</th>
                </tr>
              </thead>
              <tbody>
                {overdueBooks.map((book) => (
                  <tr key={book.id}>
                    <td className="px-4 py-2">{book.book?.title}</td>
                    <td className="px-4 py-2">{book.member?.name}</td>
                    <td className="px-4 py-2 text-red-600">{new Date(book.dueDate).toLocaleDateString()}</td>
                  </tr>
                ))}
                {overdueBooks.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-4 py-4 text-center text-gray-500">No overdue books</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="text-green-500" /> Popular Genres
          </h2>
          <div className="space-y-3">
            {popularGenres.map((genre) => (
              <div key={genre.genreId} className="flex items-center justify-between">
                <span className="font-medium">{genre.genreName}</span>
                <div className="flex items-center gap-2">
                  <div className="w-48 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${(genre.count / Math.max(...popularGenres.map(g => g.count), 1)) * 100}%` }}></div>
                  </div>
                  <span className="text-sm text-gray-600">{genre.count} borrows</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <BookOpen className="text-purple-500" /> Library Summary
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-gray-500 text-sm">Total Books</p>
            <p className="text-2xl font-bold">{summary.totalBooks || 0}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Members</p>
            <p className="text-2xl font-bold">{summary.totalMembers || 0}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Active Borrows</p>
            <p className="text-2xl font-bold">{summary.activeBorrows || 0}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Overdue Books</p>
            <p className="text-2xl font-bold text-red-600">{summary.overdueBooks || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
};