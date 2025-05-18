import React, { useState } from 'react';
import { useInventory, Supplier } from '../../context/InventoryContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  Truck, 
  Search, 
  Plus, 
  Edit, 
  Trash, 
  User, 
  Mail, 
  Phone, 
  MapPin,
  X
} from 'lucide-react';

// Componente para el modal de proveedores
interface SupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  supplier?: Supplier;
  onSave: (supplier: Omit<Supplier, 'id'>) => void;
}

const SupplierModal: React.FC<SupplierModalProps> = ({ isOpen, onClose, supplier, onSave }) => {
  const { darkMode } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    email: '',
    phone: '',
    address: ''
  });
  
  // Cargar datos del proveedor si se está editando
  React.useEffect(() => {
    if (supplier) {
      setFormData({
        name: supplier.name,
        contact: supplier.contact,
        email: supplier.email,
        phone: supplier.phone,
        address: supplier.address
      });
    } else {
      // Resetear el formulario si es un nuevo proveedor
      setFormData({
        name: '',
        contact: '',
        email: '',
        phone: '',
        address: ''
      });
    }
  }, [supplier]);
  
  if (!isOpen) return null;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
          relative rounded-lg shadow-xl w-full max-w-md
          ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}
          transform transition-all
        `}>
          <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold flex items-center">
              <Truck size={20} className="mr-2 text-blue-500" />
              {supplier ? 'Editar Proveedor' : 'Nuevo Proveedor'}
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
                  Nombre de la Empresa
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
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Persona de Contacto
                </label>
                <input
                  type="text"
                  name="contact"
                  value={formData.contact}
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
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
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
                  Teléfono
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
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
                  Dirección
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
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
const Suppliers: React.FC = () => {
  const { suppliers } = useInventory();
  const { darkMode } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | undefined>(undefined);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  
  // Función ficticia para agregar/modificar proveedores (debería conectarse al context real)
  const handleSaveSupplier = (supplierData: Omit<Supplier, 'id'>) => {
    console.log('Guardar proveedor:', supplierData);
    // En un caso real, llamaríamos a la función correspondiente del contexto
  };
  
  // Filtrar proveedores
  const filteredSuppliers = suppliers.filter(supplier => {
    if (!searchTerm) return true;
    
    return (
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.phone.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  
  // Manejar agregar/editar proveedor
  const handleAddSupplier = () => {
    setSelectedSupplier(undefined);
    setIsModalOpen(true);
  };
  
  const handleEditSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsModalOpen(true);
  };
  
  // Manejar eliminar proveedor
  const handleDeleteConfirm = (supplierId: string) => {
    setShowDeleteConfirm(supplierId);
  };
  
  const handleDeleteSupplier = (supplierId: string) => {
    console.log('Eliminar proveedor:', supplierId);
    // En un caso real, llamaríamos a la función correspondiente del contexto
    setShowDeleteConfirm(null);
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Proveedores</h1>
        <button
          onClick={handleAddSupplier}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Plus size={18} className="mr-1" />
          Nuevo Proveedor
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
              placeholder="Buscar por nombre, contacto, email..."
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
      
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredSuppliers.length > 0 ? (
          filteredSuppliers.map(supplier => (
            <div 
              key={supplier.id}
              className={`
                rounded-lg shadow-sm overflow-hidden
                ${darkMode ? 'bg-gray-800' : 'bg-white'}
              `}
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h3 className="font-medium text-lg">{supplier.name}</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditSupplier(supplier)}
                    className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                  >
                    <Edit size={18} />
                  </button>
                  
                  <div className="relative">
                    {showDeleteConfirm === supplier.id ? (
                      <div className={`
                        absolute right-0 top-0 w-48 p-2 rounded-md shadow-lg z-10
                        ${darkMode ? 'bg-gray-700' : 'bg-white'}
                        border border-gray-200 dark:border-gray-600
                      `}>
                        <p className="text-xs mb-2">¿Eliminar este proveedor?</p>
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => setShowDeleteConfirm(null)}
                            className="px-2 py-1 text-xs font-medium rounded bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-300"
                          >
                            Cancelar
                          </button>
                          <button
                            onClick={() => handleDeleteSupplier(supplier.id)}
                            className="px-2 py-1 text-xs font-medium rounded bg-red-600 text-white"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    ) : null}
                    
                    <button
                      onClick={() => handleDeleteConfirm(supplier.id)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <Trash size={18} />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="p-4 space-y-3">
                <div className="flex items-start">
                  <User size={18} className="flex-shrink-0 mt-0.5 mr-3 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">Contacto</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{supplier.contact}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Mail size={18} className="flex-shrink-0 mt-0.5 mr-3 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{supplier.email}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone size={18} className="flex-shrink-0 mt-0.5 mr-3 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">Teléfono</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{supplier.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin size={18} className="flex-shrink-0 mt-0.5 mr-3 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">Dirección</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{supplier.address}</p>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              No se encontraron proveedores
            </p>
          </div>
        )}
      </div>
      
      {/* Modal para crear/editar proveedores */}
      <SupplierModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        supplier={selectedSupplier}
        onSave={handleSaveSupplier}
      />
    </div>
  );
};

export default Suppliers;