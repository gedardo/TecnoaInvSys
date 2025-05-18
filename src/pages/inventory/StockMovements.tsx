import React, { useState } from 'react';
import { useInventory, StockMovement } from '../../context/InventoryContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  MoveHorizontal, 
  Plus, 
  Search, 
  ChevronLeft, 
  ChevronRight,
  ArrowUp,
  ArrowDown,
  Calendar,
  X
} from 'lucide-react';

// Interfaz para el modal de creación de movimientos
interface StockMovementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (movement: Omit<StockMovement, 'id' | 'date'>) => void;
}

const StockMovementModal: React.FC<StockMovementModalProps> = ({ isOpen, onClose, onSave }) => {
  const { darkMode } = useTheme();
  const { products } = useInventory();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    productId: '',
    type: 'entrada' as 'entrada' | 'salida',
    quantity: 1,
    reason: ''
  });
  
  if (!isOpen) return null;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value) : value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    onSave({
      ...formData,
      userId: user.id
    });
    
    onClose();
  };
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>
        
        <div className={`
          relative rounded-lg shadow-xl w-full max-w-md
          ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}
          transform transition-all
        `}>
          <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold flex items-center">
              <MoveHorizontal size={20} className="mr-2 text-blue-500" />
              Nuevo Movimiento de Stock
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <X size={20} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Producto
                </label>
                <select
                  name="productId"
                  value={formData.productId}
                  onChange={handleChange}
                  className={`
                    block w-full rounded-md border px-3 py-2
                    ${darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'}
                    focus:ring-blue-500 focus:border-blue-500
                  `}
                  required
                >
                  <option value="">Seleccione un producto</option>
                  {products.map(product => (
                    <option key={product.id} value={product.id}>
                      {product.name} (SKU: {product.sku})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Tipo de Movimiento
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div 
                    className={`
                      flex items-center justify-center p-3 rounded-md cursor-pointer
                      ${formData.type === 'entrada'
                        ? 'bg-green-600 text-white'
                        : darkMode
                          ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }
                    `}
                    onClick={() => setFormData(prev => ({ ...prev, type: 'entrada' }))}
                  >
                    <ArrowDown size={20} className="mr-2" />
                    Entrada
                  </div>
                  <div 
                    className={`
                      flex items-center justify-center p-3 rounded-md cursor-pointer
                      ${formData.type === 'salida'
                        ? 'bg-red-600 text-white'
                        : darkMode
                          ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }
                    `}
                    onClick={() => setFormData(prev => ({ ...prev, type: 'salida' }))}
                  >
                    <ArrowUp size={20} className="mr-2" />
                    Salida
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Cantidad
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  min="1"
                  className={`
                    block w-full rounded-md border px-3 py-2
                    ${darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'}
                    focus:ring-blue-500 focus:border-blue-500
                  `}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Motivo
                </label>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  rows={3}
                  className={`
                    block w-full rounded-md border px-3 py-2
                    ${darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'}
                    focus:ring-blue-500 focus:border-blue-500
                  `}
                  placeholder="Motivo del movimiento..."
                  required
                />
              </div>
            </div>
            
            <div className="px-5 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className={`
                  px-4 py-2 text-sm font-medium rounded-md
                  ${darkMode 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
                `}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Guardar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Componente principal
const StockMovements: React.FC = () => {
  const { stockMovements, products, addStockMovement } = useInventory();
  const { darkMode } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  const itemsPerPage = 10;
  
  // Filtrar movimientos
  const filteredMovements = stockMovements
    .filter(movement => {
      if (!searchTerm) return true;
      
      const product = products.find(p => p.id === movement.productId);
      if (!product) return false;
      
      return (
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movement.reason.toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
    .sort((a, b) => b.date.getTime() - a.date.getTime()); // Ordenar por fecha descendente
  
  // Paginación
  const totalPages = Math.ceil(filteredMovements.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMovements = filteredMovements.slice(startIndex, startIndex + itemsPerPage);
  
  // Manejar la creación de un nuevo movimiento
  const handleSaveMovement = (movementData: Omit<StockMovement, 'id' | 'date'>) => {
    addStockMovement(movementData);
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Movimientos de Stock</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Plus size={18} className="mr-1" />
          Nuevo Movimiento
        </button>
      </div>
      
      <div className={`rounded-lg shadow-sm mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="p-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar por producto o motivo..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className={`
                block w-full rounded-md border pl-10 pr-3 py-2
                ${darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}
                focus:ring-blue-500 focus:border-blue-500
              `}
            />
          </div>
        </div>
      </div>
      
      <div className={`rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Fecha
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Producto
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Tipo
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Cantidad
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Motivo
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {paginatedMovements.length > 0 ? (
                paginatedMovements.map(movement => {
                  const product = products.find(p => p.id === movement.productId);
                  return (
                    <tr key={movement.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Calendar size={16} className="mr-2 text-gray-400" />
                          <span className="text-sm">
                            {movement.date.toLocaleDateString('es-ES')}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {movement.date.toLocaleTimeString('es-ES')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium">
                          {product?.name || 'Producto desconocido'}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          SKU: {product?.sku || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`
                          px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${movement.type === 'entrada' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                          }
                        `}>
                          {movement.type.charAt(0).toUpperCase() + movement.type.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {movement.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {movement.reason}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    No se encontraron movimientos
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Paginación */}
        {totalPages > 1 && (
          <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`
                  relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md
                  ${currentPage === 1 
                    ? 'text-gray-400 bg-gray-100 dark:text-gray-500 dark:bg-gray-700 cursor-not-allowed' 
                    : 'text-gray-700 bg-white hover:bg-gray-50 dark:text-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700'}
                `}
              >
                Anterior
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`
                  ml-3 relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md
                  ${currentPage === totalPages 
                    ? 'text-gray-400 bg-gray-100 dark:text-gray-500 dark:bg-gray-700 cursor-not-allowed' 
                    : 'text-gray-700 bg-white hover:bg-gray-50 dark:text-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700'}
                `}
              >
                Siguiente
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Mostrando <span className="font-medium">{startIndex + 1}</span> a{' '}
                  <span className="font-medium">
                    {Math.min(startIndex + itemsPerPage, filteredMovements.length)}
                  </span>{' '}
                  de <span className="font-medium">{filteredMovements.length}</span> resultados
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`
                      relative inline-flex items-center px-2 py-2 rounded-l-md border
                      ${currentPage === 1 
                        ? 'text-gray-400 bg-gray-100 dark:text-gray-500 dark:bg-gray-700 cursor-not-allowed' 
                        : 'text-gray-500 bg-white hover:bg-gray-50 dark:text-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700'}
                      ${darkMode ? 'border-gray-700' : 'border-gray-300'}
                    `}
                  >
                    <ChevronLeft size={18} />
                  </button>
                  
                  {Array.from({ length: totalPages }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPage(index + 1)}
                      className={`
                        relative inline-flex items-center px-4 py-2 border text-sm font-medium
                        ${currentPage === index + 1 
                          ? 'bg-blue-600 text-white' 
                          : `${darkMode 
                              ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border-gray-700' 
                              : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                            }`
                        }
                      `}
                    >
                      {index + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`
                      relative inline-flex items-center px-2 py-2 rounded-r-md border
                      ${currentPage === totalPages 
                        ? 'text-gray-400 bg-gray-100 dark:text-gray-500 dark:bg-gray-700 cursor-not-allowed' 
                        : 'text-gray-500 bg-white hover:bg-gray-50 dark:text-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700'}
                      ${darkMode ? 'border-gray-700' : 'border-gray-300'}
                    `}
                  >
                    <ChevronRight size={18} />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Modal para crear movimientos */}
      <StockMovementModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveMovement}
      />
    </div>
  );
};

export default StockMovements;