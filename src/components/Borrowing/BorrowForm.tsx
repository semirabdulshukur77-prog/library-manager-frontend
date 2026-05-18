import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Book, Member } from '../../types';
import { BookOpen, User, Calendar, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export const BorrowForm: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedBook, setSelectedBook] = useState('');
  const [selectedMember, setSelectedMember] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (showForm) {
      fetchBooks();
      fetchMembers();
    }
  }, [showForm]);

  const fetchBooks = async () => {
    try {
      const response = await api.get('/books');
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const fetchMembers = async () => {
    try {
      const response = await api.get('/members');
      setMembers(response.data);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedBook || !selectedMember || !dueDate) {
      toast.error('Please fill all fields');
      return;
    }

    const selectedBookData = books.find(b => b.id.toString() === selectedBook);
    if (selectedBookData && selectedBookData.availableCopies < 1) {
      toast.error('No available copies of this book');
      return;
    }

    setLoading(true);
    try {
      await api.post('/borrow-records/borrow', {
        bookId: parseInt(selectedBook),
        memberId: parseInt(selectedMember),
        dueDate: dueDate,
      });
      toast.success('Book borrowed successfully!');
      resetForm();
      setShowForm(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error borrowing book');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedBook('');
    setSelectedMember('');
    setDueDate('');
  };

  const getMinDueDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    return date.toISOString().split('T')[0];
  };

  return (
    <>
      <button
        onClick={() => setShowForm(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
      >
        <BookOpen size={20} /> Borrow Book
      </button>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Borrow a Book</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2 flex items-center gap-2">
                  <User size={18} /> Select Member
                </label>
                <select
                  value={selectedMember}
                  onChange={(e) => setSelectedMember(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  required
                >
                  <option value="">Choose a member...</option>
                  {members.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name} - {member.email}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2 flex items-center gap-2">
                  <BookOpen size={18} /> Select Book
                </label>
                <select
                  value={selectedBook}
                  onChange={(e) => setSelectedBook(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  required
                >
                  <option value="">Choose a book...</option>
                  {books.map((book) => (
                    <option key={book.id} value={book.id}>
                      {book.title} - Available: {book.availableCopies}/{book.totalCopies}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2 flex items-center gap-2">
                  <Calendar size={18} /> Due Date
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  min={getMinDueDate()}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>

              {selectedBook && books.find(b => b.id.toString() === selectedBook)?.availableCopies === 0 && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
                  <AlertCircle size={18} />
                  No copies available for this book!
                </div>
              )}

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading || (selectedBook ? books.find(b => b.id.toString() === selectedBook)?.availableCopies === 0 : false)}
                  className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {loading ? 'Processing...' : 'Borrow Book'}
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