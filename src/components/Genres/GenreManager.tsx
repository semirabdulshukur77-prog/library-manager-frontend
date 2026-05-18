import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Genre } from '../../types';
import { Plus, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export const GenreManager: React.FC = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingGenre, setEditingGenre] = useState<Genre | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    fetchGenres();
  }, []);

  const fetchGenres = async () => {
    try {
      const response = await api.get('/genres');
      setGenres(response.data);
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingGenre) {
        await api.patch(`/genres/${editingGenre.id}`, formData);
        toast.success('Genre updated successfully');
      } else {
        await api.post('/genres', formData);
        toast.success('Genre created successfully');
      }
      fetchGenres();
      setShowForm(false);
      setEditingGenre(null);
      resetForm();
    } catch (error) {
      toast.error('Error saving genre');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this genre?')) {
      try {
        await api.delete(`/genres/${id}`);
        toast.success('Genre deleted successfully');
        fetchGenres();
      } catch (error) {
        toast.error('Error deleting genre');
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '' });
  };

  const editGenre = (genre: Genre) => {
    setEditingGenre(genre);
    setFormData({ name: genre.name, description: genre.description || '' });
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Genres Management</h1>
        <button
          onClick={() => {
            setEditingGenre(null);
            resetForm();
            setShowForm(true);
          }}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700"
        >
          <Plus size={20} /> Add New Genre
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">{editingGenre ? 'Edit Genre' : 'Add New Genre'}</h2>
            <form onSubmit={handleSubmit}>
              <input type="text" placeholder="Genre Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full p-2 border rounded mb-3" required />
              <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full p-2 border rounded mb-3" />
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-purple-600 text-white py-2 rounded hover:bg-purple-700">Save</button>
                <button type="button" onClick={() => { setShowForm(false); setEditingGenre(null); }} className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {genres.map((genre) => (
              <tr key={genre.id}>
                <td className="px-6 py-4">{genre.name}</td>
                <td className="px-6 py-4">{genre.description || '-'}</td>
                <td className="px-6 py-4">
                  <button onClick={() => editGenre(genre)} className="text-blue-600 hover:text-blue-800 mr-3">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDelete(genre.id)} className="text-red-600 hover:text-red-800">
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