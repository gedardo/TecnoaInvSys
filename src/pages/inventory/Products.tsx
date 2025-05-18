import React, { useState, useEffect } from 'react';
import { useInventory, Product } from '../../context/InventoryContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  Package, 
  Search, 
  Plus, 
  Edit, 
  Trash, 
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  X,
  Filter
} from 'lucide-react';

// Componente ProductModal para añadir/editar productos
interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product;
  onSave: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, product, onSave }) => {
  const { darkMode } = useTheme();
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    description: '',
    category: '',
    price: 0,
    stock: 0,
    minStock: 0,
    image: ''
  });
  
  // Cargar datos del producto si se está editando
  useEffect(() => {
    if (product) {
      setFormData({
        sku: product.sku,
        name: product.name,
        description: product.description,
        category: product.category,
        price: product.price,
        stock: product.stock,
        minStock: product.minStock,
        image: product.image || ''
      });
    } else {
      // Resetear el formulario si es un nuevo producto
      setFormData({
        sku: '',
        name: '',
        description: '',
        category: '',
        price: 0,
        stock: 0,
        minStock: 0,
        image: ''
      });
    }
  }, [product]);
  
  if (!isOpen) return null;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' || name === 'minStock'
        ? parseFloat(value)
        : value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>
        
        <div className={`
          relative rounded-lg shadow-xl w-full max-w-2xl 
          ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}
          transform transition-all
        `}>
          <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold flex items-center">
              <Package size={20} className="mr-2 text-blue-500" />
              {product ? 'Editar Producto' : 'Nuevo Producto'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <X size={20} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  SKU / Código
                </label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
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
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Nombre del Producto
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
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
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Descripción
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className={`
                    block w-full rounded-md border px-3 py-2
                    ${darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'}
                    focus:ring-blue-500 focus:border-blue-500
                  `}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Categoría
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
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
                  Precio Unitario
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
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
                  Stock Actual
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  min="0"
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
                  Stock Mínimo
                </label>
                <input
                  type="number"
                  name="minStock"
                  value={formData.minStock}
                  onChange={handleChange}
                  min="0"
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
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  URL de Imagen (opcional)
                </label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className={`
                    block w-full rounded-md border px-3 py-2
                    ${darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'}
                    focus:ring-blue-500 focus:border-blue-500
                  `}
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

// Componente principal de Products
const Products: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useInventory();
  const { darkMode } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  
  const itemsPerPage = 10;
  
  // Obtener categorías únicas
  const categories = Array.from(new Set(products.map(p => p.category)));
  
  // Filtrar productos
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter 
      ? product.category === categoryFilter 
      : true;
    
    return matchesSearch && matchesCategory;
  });
  
  // Paginación
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  
  // Manejar acciones de productos
  const handleAddProduct = () => {
    setSelectedProduct(undefined);
    setIsModalOpen(true);
  };
  
  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };
  
  const handleDeleteConfirm = (productId: string) => {
    setShowDeleteConfirm(productId);
  };
  
  const handleDeleteProduct = (productId: string) => {
    deleteProduct(productId);
    setShowDeleteConfirm(null);
  };
  
  const handleSaveProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (selectedProduct) {
      updateProduct(selectedProduct.id, productData);
    } else {
      addProduct(productData);
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Productos</h1>
        <button
          onClick={handleAddProduct}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Plus size={18} className="mr-1" />
          Nuevo Producto
        </button>
      </div>
      
      <div className={`rounded-lg shadow-sm mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="p-4 flex flex-col md:flex-row items-stretch gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar por nombre, SKU o descripción..."
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
          <div className="w-full md:w-64 flex items-center">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Filter size={18} className="text-gray-400" />
              </div>
              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className={`
                  block w-full rounded-md border pl-10 pr-3 py-2 appearance-none
                  ${darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'}
                  focus:ring-blue-500 focus:border-blue-500
                `}
              >
                <option value="">Todas las categorías</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
      
      <div className={`rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Producto
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Categoría
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Precio
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Stock
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map(product => (
                  <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {product.image ? (
                            <img 
                              src={product.image} 
                              alt={product.name} 
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                              <Package size={20} className="text-gray-500" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium">{product.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            SKU: {product.sku}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className={`
                          ${product.stock <= product.minStock 
                            ? 'text-red-600 dark:text-red-400' 
                            : 'text-gray-900 dark:text-gray-200'
                          }
                          text-sm font-medium
                        `}>
                          {product.stock}
                        </span>
                        
                        {product.stock <= product.minStock && (
                          <AlertTriangle 
                            size={16} 
                            className="ml-1 text-amber-500"
                            aria-label="Stock bajo"
                          />
                        )}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Mín: {product.minStock}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                        >
                          <Edit size={18} />
                        </button>
                        
                        <div className="relative">
                          {showDeleteConfirm === product.id ? (
                            <div className={`
                              absolute right-0 bottom-8 w-48 p-2 rounded-md shadow-lg z-10
                              ${darkMode ? 'bg-gray-700' : 'bg-white'}
                              border border-gray-200 dark:border-gray-600
                            `}>
                              <p className="text-xs mb-2">¿Eliminar este producto?</p>
                              <div className="flex justify-end space-x-2">
                                <button
                                  onClick={() => setShowDeleteConfirm(null)}
                                  className="px-2 py-1 text-xs font-medium rounded bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-300"
                                >
                                  Cancelar
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(product.id)}
                                  className="px-2 py-1 text-xs font-medium rounded bg-red-600 text-white"
                                >
                                  Eliminar
                                </button>
                              </div>
                            </div>
                          ) : null}
                          
                          <button
                            onClick={() => handleDeleteConfirm(product.id)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <Trash size={18} />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    No se encontraron productos
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
                    {Math.min(startIndex + itemsPerPage, filteredProducts.length)}
                  </span>{' '}
                  de <span className="font-medium">{filteredProducts.length}</span> resultados
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
      
      {/* Modal para edición/creación de productos */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
        onSave={handleSaveProduct}
      />
    </div>
  );
};

export default Products;