import React from 'react';
import { Menu, ShieldAlert as BellAlert, Sun, Moon, LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  
  return (
    <header className={`
      ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} 
      border-b border-gray-200 dark:border-gray-700 shadow-sm z-10
    `}>
      <div className="px-4 py-3 flex items-center justify-between">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <Menu size={24} />
        </button>
        
        <div className="flex items-center ml-auto space-x-3">
          <div className="relative">
            <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
              <BellAlert size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
          
          <button 
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <div className="relative group">
            <button className="flex items-center space-x-2 p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
              <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
                <User size={18} />
              </div>
              <span className="font-medium hidden md:inline">{user?.name || 'Usuario'}</span>
            </button>
            
            <div className={`
              absolute right-0 mt-2 w-48 rounded-md shadow-lg 
              ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} 
              border border-gray-200 dark:border-gray-700
              opacity-0 invisible group-hover:opacity-100 group-hover:visible
              transition-all duration-150 ease-in-out z-50
            `}>
              <div className="py-1">
                <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium">{user?.name || 'Usuario'}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email || 'usuario@ejemplo.com'}</p>
                </div>
                <button 
                  onClick={logout}
                  className="w-full text-left px-4 py-2 text-sm flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <LogOut size={16} />
                  <span>Cerrar sesión</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;