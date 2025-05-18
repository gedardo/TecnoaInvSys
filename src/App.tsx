import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { InventoryProvider } from './context/InventoryContext';

// Pages
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
import Products from './pages/inventory/Products';
import StockMovements from './pages/inventory/StockMovements';
import POS from './pages/pos/POS';
import Suppliers from './pages/purchases/Suppliers';
import PurchaseOrders from './pages/purchases/PurchaseOrders';
import UserManagement from './pages/admin/UserManagement';

// Components
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <InventoryProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="inventario">
                  <Route path="productos" element={<Products />} />
                  <Route path="movimientos" element={<StockMovements />} />
                </Route>
                <Route path="pos" element={<POS />} />
                <Route path="compras">
                  <Route path="proveedores" element={<Suppliers />} />
                  <Route path="ordenes" element={<PurchaseOrders />} />
                </Route>
                <Route path="admin/usuarios" element={<UserManagement />} />
              </Route>
            </Routes>
          </InventoryProvider>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;