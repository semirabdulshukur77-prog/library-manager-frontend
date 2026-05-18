import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Book, Genre, Member } from '../../types';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import toast from 'react-hot-toast';

export const BookList: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [selectedBookForBorrow, setSelectedBookForBorrow] = useState<Book | null>(null);
  const [borrowMemberId, setBorrowMemberId] = useState('');
  const [borrowDueDate, setBorrowDueDate] = useState('');
  const [borrowing, setBorrowing] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    publisher: '',
    publicationYear: new Date().getFullYear(),
    totalCopies: 1,
    availableCopies: 1,
    genreId: 0,
  });

  useEffect(() => {
    fetchBooks();
    fetchGenres();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await api.get('/books');
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const fetchGenres = async () => {
    try {
      const response = await api.get('/genres');
      setGenres(response.data);
    } catch (error) {
      console.error('Error fetching genres:', error);
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
    try {
      if (editingBook) {
        await api.patch(`/books/${editingBook.id}`, formData);
        toast.success('Book updated successfully');
      } else {
        await api.post('/books', formData);
        toast.success('Book created successfully');
      }
      fetchBooks();
      setShowForm(false);
      setEditingBook(null);
      resetForm();
    } catch (error) {
      toast.error('Error saving book');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await api.delete(`/books/${id}`);
        toast.success('Book deleted successfully');
        fetchBooks();
      } catch (error) {
        toast.error('Error deleting book');
      }
    }
  };

  const handleBorrow = (book: Book) => {
    if (book.availableCopies === 0) {
      toast.error('No copies available for borrowing');
      return;
    }
    setSelectedBookForBorrow(book);
    fetchMembers();
    setShowBorrowModal(true);
  };

  const handleConfirmBorrow = async () => {
    if (!borrowMemberId || !borrowDueDate) {
      toast.error('Please select member and due date');
      return;
    }

    setBorrowing(true);
    try {
      await api.post('/borrow-records/borrow', {
        book_id: selectedBookForBorrow?.id,
        member_id: parseInt(borrowMemberId),
        due_date: borrowDueDate
      });
      toast.success('Book borrowed successfully!');
      setShowBorrowModal(false);
      setBorrowMemberId('');
      setBorrowDueDate('');
      fetchBooks();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error borrowing book');
    } finally {
      setBorrowing(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      author: '',
      isbn: '',
      publisher: '',
      publicationYear: new Date().getFullYear(),
      totalCopies: 1,
      availableCopies: 1,
      genreId: 0,
    });
  };

  const editBook = (book: Book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      publisher: book.publisher,
      publicationYear: book.publicationYear,
      totalCopies: book.totalCopies,
      availableCopies: book.availableCopies,
      genreId: book.genreId,
    });
    setShowForm(true);
  };

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(search.toLowerCase()) ||
    book.author.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Books Management</h1>
        <button
          onClick={() => {
            setEditingBook(null);
            resetForm();
            setShowForm(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus size={20} /> Add New Book
        </button>
      </div>

      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search books by title or author..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-lg"
        />
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">{editingBook ? 'Edit Book' : 'Add New Book'}</h2>
            <form onSubmit={handleSubmit}>
              <input type="text" placeholder="Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full p-2 border rounded mb-3" required />
              <input type="text" placeholder="Author" value={formData.author} onChange={(e) => setFormData({ ...formData, author: e.target.value })} className="w-full p-2 border rounded mb-3" required />
              <input type="text" placeholder="ISBN" value={formData.isbn} onChange={(e) => setFormData({ ...formData, isbn: e.target.value })} className="w-full p-2 border rounded mb-3" required />
              <input type="text" placeholder="Publisher" value={formData.publisher} onChange={(e) => setFormData({ ...formData, publisher: e.target.value })} className="w-full p-2 border rounded mb-3" required />
              <input type="number" placeholder="Publication Year" value={formData.publicationYear} onChange={(e) => setFormData({ ...formData, publicationYear: parseInt(e.target.value) })} className="w-full p-2 border rounded mb-3" required />
              <input type="number" placeholder="Total Copies" value={formData.totalCopies} onChange={(e) => setFormData({ ...formData, totalCopies: parseInt(e.target.value), availableCopies: parseInt(e.target.value) })} className="w-full p-2 border rounded mb-3" required />
              <select value={formData.genreId} onChange={(e) => setFormData({ ...formData, genreId: parseInt(e.target.value) })} className="w-full p-2 border rounded mb-3" required>
                <option value={0}>Select Genre</option>
                {genres.map(genre => (
                  <option key={genre.id} value={genre.id}>{genre.name}</option>
                ))}
              </select>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Save</button>
                <button type="button" onClick={() => { setShowForm(false); setEditingBook(null); }} className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showBorrowModal && selectedBookForBorrow && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Borrow Book</h2>
            <div className="mb-4">
              <p className="text-gray-700"><strong>Book:</strong> {selectedBookForBorrow.title}</p>
              <p className="text-gray-700"><strong>Available Copies:</strong> {selectedBookForBorrow.availableCopies}</p>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Select Member</label>
              <select
                value={borrowMemberId}
                onChange={(e) => setBorrowMemberId(e.target.value)}
                className="w-full p-2 border rounded"
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
              <label className="block text-gray-700 mb-2">Due Date</label>
              <input
                type="date"
                value={borrowDueDate}
                onChange={(e) => setBorrowDueDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleConfirmBorrow}
                disabled={borrowing}
                className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
              >
                {borrowing ? 'Processing...' : 'Confirm Borrow'}
              </button>
              <button
                onClick={() => {
                  setShowBorrowModal(false);
                  setBorrowMemberId('');
                  setBorrowDueDate('');
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Author</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Genre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Available/Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredBooks.map((book) => (
              <tr key={book.id}>
                <td className="px-6 py-4">{book.title}</td>
                <td className="px-6 py-4">{book.author}</td>
                <td className="px-6 py-4">{book.genre?.name}</td>
                <td className="px-6 py-4">{book.availableCopies}/{book.totalCopies}</td>
                <td className="px-6 py-4">
                  <button 
                    onClick={() => handleBorrow(book)} 
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 mr-2 text-sm"
                    disabled={book.availableCopies === 0}
                  >
                    Borrow
                  </button>
                  <button onClick={() => editBook(book)} className="text-blue-600 hover:text-blue-800 mr-3">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDelete(book.id)} className="text-red-600 hover:text-red-800">
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