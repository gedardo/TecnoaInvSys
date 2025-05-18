import React, { useMemo } from 'react';
import { useInventory } from '../../context/InventoryContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  BarChart3, 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  DollarSign,
  Truck
} from 'lucide-react';

// Componente de tarjeta para métricas
interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  change?: string;
  isPositive?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, color, change, isPositive }) => {
  const { darkMode } = useTheme();
  
  return (
    <div className={`rounded-lg shadow-sm p-5 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {title}
          </p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          
          {change && (
            <div className="flex items-center mt-2">
              <span className={`text-xs font-medium flex items-center ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {isPositive ? <TrendingUp size={14} className="mr-1" /> : <TrendingUp size={14} className="mr-1 transform rotate-180" />}
                {change}
              </span>
            </div>
          )}
        </div>
        
        <div className={`p-3 rounded-full ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

// Componente para la lista de productos con bajo stock
const LowStockProducts: React.FC = () => {
  const { products } = useInventory();
  const { darkMode } = useTheme();
  
  const lowStockProducts = useMemo(() => {
    return products
      .filter(product => product.stock <= product.minStock)
      .sort((a, b) => (a.stock / a.minStock) - (b.stock / b.minStock));
  }, [products]);
  
  return (
    <div className={`rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="p-5 border-b border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold flex items-center">
          <AlertTriangle size={18} className="mr-2 text-amber-500" />
          Productos con Bajo Stock
        </h3>
      </div>
      
      <div className="p-0">
        {lowStockProducts.length > 0 ? (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {lowStockProducts.map(product => (
              <div key={product.id} className="p-4 flex items-center justify-between">
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
                    <h4 className="text-sm font-medium">{product.name}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      SKU: {product.sku}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`
                    text-sm font-medium
                    ${product.stock === 0 
                      ? 'text-red-500' 
                      : product.stock < product.minStock * 0.5 
                        ? 'text-orange-500' 
                        : 'text-amber-500'
                    }
                  `}>
                    {product.stock} / {product.minStock}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Stock / Mínimo
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              No hay productos con bajo stock
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Componente principal del Dashboard
const Dashboard: React.FC = () => {
  const { products, stockMovements } = useInventory();
  const { darkMode } = useTheme();
  
  // Cálculo de métricas
  const totalProducts = products.length;
  
  const totalStock = useMemo(() => {
    return products.reduce((sum, product) => sum + product.stock, 0);
  }, [products]);
  
  const totalValue = useMemo(() => {
    return products.reduce((sum, product) => sum + (product.price * product.stock), 0);
  }, [products]);
  
  const lowStockCount = useMemo(() => {
    return products.filter(product => product.stock <= product.minStock).length;
  }, [products]);
  
  const recentMovements = useMemo(() => {
    return [...stockMovements]
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 5);
  }, [stockMovements]);
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-6">Panel de Control</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <MetricCard 
            title="Total de Productos" 
            value={totalProducts} 
            icon={<Package size={22} className="text-white" />} 
            color="bg-blue-600"
            change="+5% vs. mes anterior"
            isPositive={true}
          />
          
          <MetricCard 
            title="Unidades en Inventario" 
            value={totalStock} 
            icon={<BarChart3 size={22} className="text-white" />} 
            color="bg-emerald-600"
            change="+12% vs. mes anterior"
            isPositive={true}
          />
          
          <MetricCard 
            title="Valor del Inventario" 
            value={`$${totalValue.toLocaleString('es')}`} 
            icon={<DollarSign size={22} className="text-white" />} 
            color="bg-indigo-600"
            change="+8% vs. mes anterior"
            isPositive={true}
          />
          
          <MetricCard 
            title="Productos con Bajo Stock" 
            value={lowStockCount} 
            icon={<AlertTriangle size={22} className="text-white" />} 
            color="bg-amber-600"
            change="-2% vs. mes anterior"
            isPositive={false}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico de Columnas (Mock) */}
        <div className={`lg:col-span-2 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="p-5 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold flex items-center">
              <BarChart3 size={18} className="mr-2 text-blue-500" />
              Ventas Diarias (Última Semana)
            </h3>
          </div>
          <div className="p-5">
            {/* Aquí iría un componente de gráfico real */}
            <div className={`
              h-64 flex items-end justify-between gap-2 pb-6 pt-10 px-4
              border-b border-gray-200 dark:border-gray-700 relative
            `}>
              {/* Eje Y */}
              <div className="absolute left-0 top-0 h-full flex flex-col justify-between py-6">
                {[5000, 4000, 3000, 2000, 1000, 0].map((value, i) => (
                  <div key={i} className="flex items-center">
                    <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      ${value}
                    </span>
                    <span className={`w-2 h-px block ml-1 ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></span>
                  </div>
                ))}
              </div>
              
              {/* Barras del gráfico */}
              {[2800, 3600, 2900, 4100, 3400, 2600, 3900].map((value, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div 
                    className="w-12 bg-blue-500 rounded-t"
                    style={{ height: `${(value / 5000) * 100}%` }}
                  ></div>
                  <span className={`text-xs mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Lista de productos con bajo stock */}
        <div className="lg:col-span-1">
          <LowStockProducts />
        </div>
      </div>
      
      {/* Movimientos recientes */}
      <div className={`rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="p-5 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold flex items-center">
            <Truck size={18} className="mr-2 text-indigo-500" />
            Movimientos Recientes
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
              <tr>
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
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Fecha
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {recentMovements.map((movement) => {
                const product = products.find(p => p.id === movement.productId);
                return (
                  <tr key={movement.id}>
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {movement.date.toLocaleDateString('es-ES')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;