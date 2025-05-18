import React, { useState, useMemo } from 'react';
import { useInventory, Product } from '../../context/InventoryContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  ShoppingCart, 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  CreditCard, 
  Banknote, 
  Receipt, 
  Check, 
  XCircle,
  Barcode
} from 'lucide-react';

// Interfaces
interface CartItem {
  product: Product;
  quantity: number;
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  onComplete: (method: string) => void;
}

// Componente para el modal de pago
const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, total, onComplete }) => {
  const { darkMode } = useTheme();
  const [paymentMethod, setPaymentMethod] = useState<string>('efectivo');
  const [cashReceived, setCashReceived] = useState<number>(0);
  
  if (!isOpen) return null;
  
  const change = cashReceived - total;
  
  const handleComplete = () => {
    onComplete(paymentMethod);
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
          <div className="p-6">
            <h3 className="text-xl font-bold mb-4 text-center">Procesar Pago</h3>
            
            <div className="mb-6">
              <p className="text-lg font-medium mb-1">Total a pagar:</p>
              <p className="text-3xl font-bold text-blue-600">${total.toFixed(2)}</p>
            </div>
            
            <div className="mb-6">
              <p className="text-sm font-medium mb-2">Método de pago:</p>
              <div className="grid grid-cols-2 gap-3">
                <div
                  className={`
                    p-4 rounded-lg border flex items-center justify-center cursor-pointer
                    ${paymentMethod === 'efectivo' 
                      ? 'bg-blue-100 border-blue-500 dark:bg-blue-900 dark:border-blue-700' 
                      : `${darkMode 
                          ? 'border-gray-700 hover:bg-gray-700' 
                          : 'border-gray-300 hover:bg-gray-100'
                        }`
                    }
                  `}
                  onClick={() => setPaymentMethod('efectivo')}
                >
                  <Banknote size={20} className="mr-2" />
                  <span>Efectivo</span>
                </div>
                <div
                  className={`
                    p-4 rounded-lg border flex items-center justify-center cursor-pointer
                    ${paymentMethod === 'tarjeta' 
                      ? 'bg-blue-100 border-blue-500 dark:bg-blue-900 dark:border-blue-700' 
                      : `${darkMode 
                          ? 'border-gray-700 hover:bg-gray-700' 
                          : 'border-gray-300 hover:bg-gray-100'
                        }`
                    }
                  `}
                  onClick={() => setPaymentMethod('tarjeta')}
                >
                  <CreditCard size={20} className="mr-2" />
                  <span>Tarjeta</span>
                </div>
              </div>
            </div>
            
            {paymentMethod === 'efectivo' && (
              <div className="mb-6">
                <label className="block text-sm font-medium mb-1">
                  Efectivo recibido:
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
                    $
                  </span>
                  <input
                    type="number"
                    value={cashReceived || ''}
                    onChange={(e) => setCashReceived(parseFloat(e.target.value) || 0)}
                    min={total}
                    step="0.01"
                    className={`
                      block w-full pl-7 pr-3 py-2 rounded-md border
                      ${darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'}
                      focus:ring-blue-500 focus:border-blue-500
                    `}
                  />
                </div>
                
                {cashReceived >= total && (
                  <div className="mt-2">
                    <p className="text-sm font-medium">Cambio a entregar:</p>
                    <p className="text-lg font-bold text-green-600">${change.toFixed(2)}</p>
                  </div>
                )}
              </div>
            )}
            
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className={`
                  flex-1 py-2 px-4 rounded-md flex items-center justify-center
                  ${darkMode 
                    ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
                `}
              >
                <XCircle size={18} className="mr-1" />
                Cancelar
              </button>
              <button
                onClick={handleComplete}
                disabled={paymentMethod === 'efectivo' && cashReceived < total}
                className={`
                  flex-1 py-2 px-4 rounded-md flex items-center justify-center
                  bg-blue-600 text-white hover:bg-blue-700
                  ${(paymentMethod === 'efectivo' && cashReceived < total) 
                    ? 'opacity-50 cursor-not-allowed' 
                    : ''}
                `}
              >
                <Check size={18} className="mr-1" />
                Completar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente principal del POS
const POS: React.FC = () => {
  const { products, addStockMovement } = useInventory();
  const { user } = useAuth();
  const { darkMode } = useTheme();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [saleComplete, setSaleComplete] = useState(false);
  
  // Obtener categorías únicas
  const categories = Array.from(new Set(products.map(p => p.category)));
  
  // Filtrar productos
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = categoryFilter 
        ? product.category === categoryFilter 
        : true;
      
      // Solo mostrar productos con stock > 0
      const hasStock = product.stock > 0;
      
      return matchesSearch && matchesCategory && hasStock;
    });
  }, [products, searchTerm, categoryFilter]);
  
  // Calcular total del carrito
  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  }, [cart]);
  
  // Manejar la adición de productos al carrito
  const addToCart = (product: Product) => {
    setCart(prevCart => {
      // Verificar si el producto ya está en el carrito
      const existingItemIndex = prevCart.findIndex(item => item.product.id === product.id);
      
      if (existingItemIndex >= 0) {
        // Si existe, aumentar la cantidad
        const updatedCart = [...prevCart];
        const currentQty = updatedCart[existingItemIndex].quantity;
        
        // Verificar si hay suficiente stock
        if (currentQty < product.stock) {
          updatedCart[existingItemIndex].quantity += 1;
        }
        
        return updatedCart;
      } else {
        // Si no existe, agregar como nuevo item
        return [...prevCart, { product, quantity: 1 }];
      }
    });
  };
  
  // Modificar la cantidad de un producto en el carrito
  const updateCartItemQuantity = (productId: string, newQuantity: number) => {
    setCart(prevCart => 
      prevCart.map(item => 
        item.product.id === productId 
          ? { 
              ...item, 
              quantity: Math.min(Math.max(newQuantity, 0), item.product.stock) 
            } 
          : item
      ).filter(item => item.quantity > 0) // Eliminar items con cantidad 0
    );
  };
  
  // Eliminar un producto del carrito
  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };
  
  // Limpiar el carrito
  const clearCart = () => {
    setCart([]);
  };
  
  // Procesar la venta
  const processSale = (paymentMethod: string) => {
    if (!user) return;
    
    // Para cada producto en el carrito, crear un movimiento de salida
    cart.forEach(item => {
      addStockMovement({
        productId: item.product.id,
        type: 'salida',
        quantity: item.quantity,
        reason: `Venta POS - Pago con ${paymentMethod}`,
        userId: user.id
      });
    });
    
    // Mostrar confirmación de venta
    setSaleComplete(true);
    setIsPaymentModalOpen(false);
    
    // Resetear después de 3 segundos
    setTimeout(() => {
      setSaleComplete(false);
      clearCart();
    }, 3000);
  };
  
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Punto de Venta</h1>
      </div>
      
      {saleComplete && (
        <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 p-4 mb-4 rounded-lg flex items-center">
          <Check size={20} className="mr-2" />
          <span className="font-medium">¡Venta completada con éxito!</span>
        </div>
      )}
      
      <div className="flex flex-col lg:flex-row gap-6 h-full">
        {/* Panel izquierdo: Lista de productos */}
        <div className="lg:w-3/5 flex flex-col">
          <div className={`rounded-lg shadow-sm mb-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar producto o escanear código..."
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
              <div className="relative">
                <select
                  value={categoryFilter}
                  onChange={e => setCategoryFilter(e.target.value)}
                  className={`
                    block w-full rounded-md border pl-3 pr-10 py-2 appearance-none
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
          
          <div className={`rounded-lg shadow-sm flex-1 overflow-hidden flex flex-col ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-medium flex items-center">
                <Barcode size={18} className="mr-2 text-blue-500" />
                Productos disponibles
              </h3>
            </div>
            
            <div className="flex-1 overflow-auto p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map(product => (
                    <div 
                      key={product.id} 
                      className={`
                        rounded-lg border p-3 cursor-pointer transition-all
                        ${darkMode 
                          ? 'bg-gray-700 border-gray-600 hover:border-blue-500' 
                          : 'bg-white border-gray-200 hover:border-blue-500 hover:shadow'}
                      `}
                      onClick={() => addToCart(product)}
                    >
                      <div className="flex items-center mb-2">
                        <div className="flex-shrink-0 h-10 w-10">
                          {product.image ? (
                            <img 
                              src={product.image} 
                              alt={product.name} 
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                              {/*<Package size={20} className="text-gray-500" />*/}
                            </div>
                          )}
                        </div>
                        <div className="ml-3 flex-1">
                          <h4 className="text-sm font-medium line-clamp-1">{product.name}</h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {product.sku}
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-blue-600 font-bold">
                          ${product.price.toFixed(2)}
                        </p>
                        <p className={`text-xs ${product.stock <= product.minStock ? 'text-amber-500' : 'text-gray-500 dark:text-gray-400'}`}>
                          Stock: {product.stock}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8">
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      No se encontraron productos
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Panel derecho: Carrito */}
        <div className="lg:w-2/5 flex flex-col">
          <div className={`rounded-lg shadow-sm flex-1 flex flex-col ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="font-medium flex items-center">
                <ShoppingCart size={18} className="mr-2 text-blue-500" />
                Carrito de compra
              </h3>
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-sm text-red-500 hover:text-red-700"
                >
                  Vaciar carrito
                </button>
              )}
            </div>
            
            <div className="flex-1 overflow-auto p-4">
              {cart.length > 0 ? (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div 
                      key={item.product.id}
                      className={`
                        rounded-lg border p-3
                        ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}
                      `}
                    >
                      <div className="flex items-center mb-2">
                        <div className="flex-shrink-0 h-10 w-10">
                          {item.product.image ? (
                            <img 
                              src={item.product.image} 
                              alt={item.product.name} 
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                              {/*<Package size={20} className="text-gray-500" />*/}
                            </div>
                          )}
                        </div>
                        <div className="ml-3 flex-1">
                          <h4 className="text-sm font-medium line-clamp-1">{item.product.name}</h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            ${item.product.price.toFixed(2)} cada uno
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center border rounded-md">
                          <button
                            onClick={() => updateCartItemQuantity(item.product.id, item.quantity - 1)}
                            className={`
                              p-1
                              ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'}
                            `}
                          >
                            <Minus size={16} />
                          </button>
                          <span className="px-3 py-1 border-l border-r text-center min-w-[40px]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartItemQuantity(item.product.id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock}
                            className={`
                              p-1
                              ${item.quantity >= item.product.stock ? 'opacity-50 cursor-not-allowed' : ''}
                              ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'}
                            `}
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <p className="font-bold text-blue-600">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  <ShoppingCart size={40} className={`mb-3 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
                  <p className={`text-sm mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    El carrito está vacío
                  </p>
                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    Haga clic en un producto para agregarlo
                  </p>
                </div>
              )}
            </div>
            
            <div className={`
              p-4 border-t border-gray-200 dark:border-gray-700
              ${cart.length === 0 ? 'opacity-50' : ''}
            `}>
              <div className="flex justify-between mb-4">
                <span className="font-medium">Subtotal:</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-4">
                <span className="font-medium">IVA (21%):</span>
                <span>${(cartTotal * 0.21).toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-4">
                <span className="font-bold text-lg">Total:</span>
                <span className="font-bold text-lg">${(cartTotal * 1.21).toFixed(2)}</span>
              </div>
              
              <button
                onClick={() => setIsPaymentModalOpen(true)}
                disabled={cart.length === 0}
                className={`
                  w-full py-3 rounded-lg flex items-center justify-center
                  bg-blue-600 text-white text-sm font-medium
                  ${cart.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}
                `}
              >
                <Receipt size={18} className="mr-2" />
                Procesar Venta
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal de pago */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        total={cartTotal * 1.21}
        onComplete={processSale}
      />
    </div>
  );
};

export default POS;