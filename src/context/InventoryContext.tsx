import React, { createContext, useContext, useState, useEffect } from 'react';

// Definición de tipos
export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  minStock: number;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  address: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  type: 'entrada' | 'salida';
  quantity: number;
  reason: string;
  date: Date;
  userId: string;
}

interface InventoryContextType {
  products: Product[];
  suppliers: Supplier[];
  stockMovements: StockMovement[];
  loading: boolean;
  error: string | null;
  getProductById: (id: string) => Product | undefined;
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addStockMovement: (movement: Omit<StockMovement, 'id' | 'date'>) => void;
}

// Datos de muestra
const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    sku: 'PRD-001',
    name: 'Laptop HP Pavilion',
    description: 'Laptop HP Pavilion 15.6" Core i5, 8GB RAM, 512GB SSD',
    category: 'Computadoras',
    price: 899.99,
    stock: 15,
    minStock: 5,
    image: 'https://images.pexels.com/photos/306763/pexels-photo-306763.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-05-20')
  },
  {
    id: '2',
    sku: 'PRD-002',
    name: 'Monitor LG UltraWide',
    description: 'Monitor LG UltraWide 34" 3440x1440',
    category: 'Periféricos',
    price: 399.99,
    stock: 8,
    minStock: 3,
    image: 'https://images.pexels.com/photos/1714208/pexels-photo-1714208.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    createdAt: new Date('2023-02-10'),
    updatedAt: new Date('2023-06-15')
  },
  {
    id: '3',
    sku: 'PRD-003',
    name: 'Teclado Mecánico RGB',
    description: 'Teclado mecánico gaming con retroiluminación RGB',
    category: 'Periféricos',
    price: 89.99,
    stock: 25,
    minStock: 10,
    image: 'https://images.pexels.com/photos/3568520/pexels-photo-3568520.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    createdAt: new Date('2023-03-05'),
    updatedAt: new Date('2023-07-10')
  },
  {
    id: '4',
    sku: 'PRD-004',
    name: 'Mouse Inalámbrico',
    description: 'Mouse inalámbrico ergonómico con sensor láser',
    category: 'Periféricos',
    price: 49.99,
    stock: 30,
    minStock: 8,
    image: 'https://images.pexels.com/photos/399159/pexels-photo-399159.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    createdAt: new Date('2023-04-20'),
    updatedAt: new Date('2023-08-05')
  },
  {
    id: '5',
    sku: 'PRD-005',
    name: 'SSD Samsung 1TB',
    description: 'Disco de estado sólido Samsung 1TB NVME',
    category: 'Componentes',
    price: 129.99,
    stock: 12,
    minStock: 5,
    image: 'https://images.pexels.com/photos/4195325/pexels-photo-4195325.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    createdAt: new Date('2023-05-15'),
    updatedAt: new Date('2023-09-01')
  }
];

const MOCK_SUPPLIERS: Supplier[] = [
  {
    id: '1',
    name: 'TechSupply S.A.',
    contact: 'María López',
    email: 'contacto@techsupply.com',
    phone: '+34 91 123 4567',
    address: 'Calle Tecnología 123, Madrid'
  },
  {
    id: '2',
    name: 'ComponentesPC',
    contact: 'Juan Martínez',
    email: 'info@componentespc.com',
    phone: '+34 93 987 6543',
    address: 'Avenida Digital 456, Barcelona'
  },
  {
    id: '3',
    name: 'Distribuidora InforMatic',
    contact: 'Carlos Ruiz',
    email: 'ventas@informatic.com',
    phone: '+34 96 555 2233',
    address: 'Plaza Informática 78, Valencia'
  }
];

const MOCK_STOCK_MOVEMENTS: StockMovement[] = [
  {
    id: '1',
    productId: '1',
    type: 'entrada',
    quantity: 10,
    reason: 'Compra inicial',
    date: new Date('2023-01-15'),
    userId: '1'
  },
  {
    id: '2',
    productId: '1',
    type: 'salida',
    quantity: 2,
    reason: 'Venta',
    date: new Date('2023-02-10'),
    userId: '2'
  },
  {
    id: '3',
    productId: '2',
    type: 'entrada',
    quantity: 15,
    reason: 'Reposición',
    date: new Date('2023-03-05'),
    userId: '3'
  }
];

// Crear el contexto
const InventoryContext = createContext<InventoryContextType>({
  products: [],
  suppliers: [],
  stockMovements: [],
  loading: false,
  error: null,
  getProductById: () => undefined,
  addProduct: () => {},
  updateProduct: () => {},
  deleteProduct: () => {},
  addStockMovement: () => {}
});

export const useInventory = () => useContext(InventoryContext);

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos iniciales
  useEffect(() => {
    const loadData = async () => {
      try {
        // Simular carga de datos de una API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // En un caso real, aquí cargaríamos los datos de una API
        setProducts(MOCK_PRODUCTS);
        setSuppliers(MOCK_SUPPLIERS);
        setStockMovements(MOCK_STOCK_MOVEMENTS);
      } catch (err) {
        setError('Error al cargar los datos del inventario');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Obtener producto por ID
  const getProductById = (id: string): Product | undefined => {
    return products.find(product => product.id === id);
  };

  // Agregar un nuevo producto
  const addProduct = (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setProducts(prev => [...prev, newProduct]);
  };

  // Actualizar un producto existente
  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => 
      prev.map(product => 
        product.id === id 
          ? { 
              ...product, 
              ...updates, 
              updatedAt: new Date() 
            } 
          : product
      )
    );
  };

  // Eliminar un producto
  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(product => product.id !== id));
  };

  // Agregar un movimiento de stock
  const addStockMovement = (movement: Omit<StockMovement, 'id' | 'date'>) => {
    const newMovement: StockMovement = {
      ...movement,
      id: Date.now().toString(),
      date: new Date()
    };
    
    setStockMovements(prev => [...prev, newMovement]);
    
    // Actualizar el stock del producto
    const product = products.find(p => p.id === movement.productId);
    if (product) {
      const stockChange = movement.type === 'entrada' 
        ? movement.quantity 
        : -movement.quantity;
      
      updateProduct(movement.productId, {
        stock: product.stock + stockChange
      });
    }
  };

  return (
    <InventoryContext.Provider
      value={{
        products,
        suppliers,
        stockMovements,
        loading,
        error,
        getProductById,
        addProduct,
        updateProduct,
        deleteProduct,
        addStockMovement
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};