import React from 'react';
import { StatisticsCards } from './StatisticsCards';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, BookOpen, Users, BarChart3, RotateCcw } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleBorrowBook = () => {
    navigate('/books');
    setTimeout(() => {
      alert('Please go to Books page and click Borrow button');
    }, 100);
  };

  const handleReturnBook = () => {
    navigate('/borrow-records');
    alert('Go to Borrow Records section to return books');
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <StatisticsCards />
      
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => navigate('/books')}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition text-left"
          >
            <div className="bg-blue-500 inline-block p-3 rounded-full mb-4">
              <PlusCircle className="text-white" size={24} />
            </div>
            <h3 className="font-semibold text-lg">Add New Book</h3>
            <p className="text-gray-500 text-sm mt-2">Create a new book entry</p>
          </button>
          
          <button
            onClick={() => navigate('/members')}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition text-left"
          >
            <div className="bg-green-500 inline-block p-3 rounded-full mb-4">
              <Users className="text-white" size={24} />
            </div>
            <h3 className="font-semibold text-lg">Register Member</h3>
            <p className="text-gray-500 text-sm mt-2">Add new library member</p>
          </button>
          
          <button
            onClick={() => navigate('/books')}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition text-left"
          >
            <div className="bg-purple-500 inline-block p-3 rounded-full mb-4">
              <BookOpen className="text-white" size={24} />
            </div>
            <h3 className="font-semibold text-lg">Borrow Book</h3>
            <p className="text-gray-500 text-sm mt-2">Issue a book to member</p>
          </button>
          
          <button
            onClick={() => navigate('/borrow-records')}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition text-left"
          >
            <div className="bg-orange-500 inline-block p-3 rounded-full mb-4">
              <RotateCcw className="text-white" size={24} />
            </div>
            <h3 className="font-semibold text-lg">Return Book</h3>
            <p className="text-gray-500 text-sm mt-2">Process book return</p>
          </button>
        </div>
      </div>
    </div>
  );
};