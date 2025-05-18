import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Package, Key, Mail, AlertTriangle } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, user, error, clearError, loading } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  
  // Redirigir si ya hay una sesión iniciada
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };
  
  return (
    <div className={`flex min-h-screen items-center justify-center ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
      <div className={`w-full max-w-md p-8 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-600 mb-4">
            <Package size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold">InvSys</h1>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Sistema de Gestión de Inventario
          </p>
        </div>
        
        {error && (
          <div className="mb-4 p-3 rounded bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 flex items-center">
            <AlertTriangle size={18} className="mr-2" />
            <span>{error}</span>
            <button 
              onClick={clearError} 
              className="ml-auto text-red-600 dark:text-red-400"
            >
              &times;
            </button>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium">Correo electrónico</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Mail size={18} className="text-gray-400" />
              </div>
              <input
                type="email"
                className={`
                  block w-full pl-10 py-2.5 px-3 border rounded-lg
                  ${darkMode 
                    ? 'bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500' 
                    : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-600 focus:border-blue-600'}
                `}
                placeholder="ejemplo@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium">Contraseña</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Key size={18} className="text-gray-400" />
              </div>
              <input
                type="password"
                className={`
                  block w-full pl-10 py-2.5 px-3 border rounded-lg
                  ${darkMode 
                    ? 'bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500' 
                    : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-600 focus:border-blue-600'}
                `}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className={`
              w-full flex items-center justify-center
              px-5 py-2.5 text-white bg-blue-600 
              hover:bg-blue-700 focus:ring-4 focus:ring-blue-300
              font-medium rounded-lg text-sm
              ${loading ? 'opacity-70 cursor-not-allowed' : ''}
              transition-colors duration-150
            `}
          >
            {loading ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-l-transparent rounded-full mr-2"></div>
                Iniciando sesión...
              </>
            ) : (
              'Iniciar sesión'
            )}
          </button>
          
          <div className="mt-4 text-center text-sm">
            <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
              Demo: admin@ejemplo.com / admin123
            </p>
            <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
              O: ventas@ejemplo.com / ventas123
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;