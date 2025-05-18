import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  MoveHorizontal, 
  ShoppingCart, 
  Truck, 
  ClipboardList, 
  Users, 
  BarChart 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  
  const navLinkClass = ({ isActive }: { isActive: boolean }) => 
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
      isActive 
        ? 'bg-blue-600 text-white' 
        : `${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-200'}`
    }`;

  const renderNavItems = () => {
    const navItems = [
      { 
        to: '/dashboard', 
        icon: <LayoutDashboard size={20} />, 
        text: 'Dashboard', 
        roles: ['admin', 'sales', 'inventory'] 
      },
      { 
        to: '/inventario/productos', 
        icon: <Package size={20} />, 
        text: 'Productos', 
        roles: ['admin', 'inventory'] 
      },
      { 
        to: '/inventario/movimientos', 
        icon: <MoveHorizontal size={20} />, 
        text: 'Movimientos', 
        roles: ['admin', 'inventory'] 
      },
      { 
        to: '/pos', 
        icon: <ShoppingCart size={20} />, 
        text: 'Punto de Venta', 
        roles: ['admin', 'sales'] 
      },
      { 
        to: '/compras/proveedores', 
        icon: <Truck size={20} />, 
        text: 'Proveedores', 
        roles: ['admin', 'inventory'] 
      },
      { 
        to: '/compras/ordenes', 
        icon: <ClipboardList size={20} />, 
        text: 'Órdenes de Compra', 
        roles: ['admin', 'inventory'] 
      },
      { 
        to: '/admin/usuarios', 
        icon: <Users size={20} />, 
        text: 'Usuarios', 
        roles: ['admin'] 
      },
      { 
        to: '/reportes', 
        icon: <BarChart size={20} />, 
        text: 'Reportes', 
        roles: ['admin', 'sales'] 
      }
    ];
    
    return navItems
      .filter(item => user && item.roles.includes(user.role))
      .map(item => (
        <NavLink 
          key={item.to} 
          to={item.to} 
          className={navLinkClass}
          onClick={() => setIsOpen(false)}
        >
          {item.icon}
          <span>{item.text}</span>
        </NavLink>
      ));
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={`
          fixed top-0 left-0 z-30 h-full w-64 transition-transform transform 
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:relative lg:translate-x-0
          ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg
        `}
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-bold text-blue-600">InvSys</h1>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Sistema de Inventario
          </p>
        </div>
        
        <nav className="mt-6 px-2 space-y-1">
          {renderNavItems()}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;