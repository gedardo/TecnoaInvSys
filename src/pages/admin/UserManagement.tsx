
import React from 'react';
import UserManagementComponent from '../../components/UserManagement/UserManagement.jsx';
import { useTheme } from '../../context/ThemeContext';

function UserManagement() {
  const { darkMode } = useTheme();
  
  return (
    <div className={`p-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
      <div className={`rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <UserManagementComponent />
      </div>
    </div>
  );
}

export default UserManagement;