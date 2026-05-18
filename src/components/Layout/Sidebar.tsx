import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Users, Tags, UsersRound, BarChart3 } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { title: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { title: 'Books', icon: BookOpen, path: '/books' },
    { title: 'Members', icon: Users, path: '/members' },
    { title: 'Genres', icon: Tags, path: '/genres' },
    { title: 'Staff', icon: UsersRound, path: '/staff' },
    { title: 'Reports', icon: BarChart3, path: '/reports' },
  ];

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col">
      <div className="p-6">
        <h2 className="text-2xl font-bold">Library Manager</h2>
      </div>
      <nav className="flex-1 mt-6">
        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`w-full flex items-center space-x-3 px-6 py-3 text-left transition ${
              location.pathname === item.path
                ? 'bg-gray-800 border-l-4 border-blue-500'
                : 'hover:bg-gray-800'
            }`}
          >
            <item.icon size={20} />
            <span>{item.title}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};