import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Statistics } from '../../types';
import { BookOpen, Users, BookMarked, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const StatisticsCards: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<Statistics>({
    totalBooks: 0,
    totalMembers: 0,
    activeBorrows: 0,
    overdueBooks: 0,
  });

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const [booksResponse, membersResponse, borrowsResponse] = await Promise.all([
        api.get('/books'),
        api.get('/members'),
        api.get('/borrow-records'),
      ]);

      const today = new Date().toISOString().split('T')[0];
      
      let activeCount = 0;
      let overdueCount = 0;

      for (const record of borrowsResponse.data) {
        if (record.return_date) continue;
        
        if (record.due_date < today) {
          overdueCount++;
        } else {
          activeCount++;
        }
      }

      setStats({
        totalBooks: booksResponse.data.length,
        totalMembers: membersResponse.data.length,
        activeBorrows: activeCount,
        overdueBooks: overdueCount,
      });
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const cards = [
    { title: 'Total Books', value: stats.totalBooks, icon: BookOpen, color: 'bg-blue-500', path: '/books' },
    { title: 'Total Members', value: stats.totalMembers, icon: Users, color: 'bg-green-500', path: '/members' },
    { title: 'Active Borrows', value: stats.activeBorrows, icon: BookMarked, color: 'bg-yellow-500', path: '/borrow-records' },
    { title: 'Overdue Books', value: stats.overdueBooks, icon: AlertCircle, color: 'bg-red-500', path: '/reports' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card) => (
        <div 
          key={card.title} 
          onClick={() => navigate(card.path)}
          className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">{card.title}</p>
              <p className="text-2xl font-bold mt-2">{card.value}</p>
            </div>
            <div className={`${card.color} p-3 rounded-full`}>
              <card.icon className="text-white" size={24} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};