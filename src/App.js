import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';

import { AuthProvider } from './AuthContext';
import { CartProvider } from './contexts/CartContext';
import { OrderProvider } from './contexts/OrderContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Zalo from './pages/Zalo';

import ScrollToTop from './components/ScrollToTop';
import { ThemeProvider } from './contexts/ThemeContext';
import DarkModeToggle from './components/DarkModeToggle';

const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const Register = lazy(() => import('./pages/Register'));
const Shop = lazy(() => import('./pages/Shop'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));

const PolicyDetail = lazy(() => import('./pages/PolicyDetail'));

const Admin = lazy(() => import('./pages/Admin'));
const ManageProductsPage = lazy(() => import('./pages/ManageProductsPage'));
const OrderHistory = lazy(() => import('./pages/OrderHistory'));
const OrderManagement = lazy(() => import('./pages/OrderManagement'));
const PaymentInfo = lazy(() => import('./pages/PaymentInfo'));

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <CartProvider>
            <OrderProvider>
              <Header />

              <Container className="mt-4" style={{ minHeight: '80vh' }}>
                <Suspense fallback={<div className="text-center mt-5 font-italic">Đang tải dữ liệu TechHub...</div>}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/payment-info" element={<PaymentInfo />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/orders" element={<OrderHistory />} />
                    <Route path="/policy/:type" element={<PolicyDetail />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/admin/products" element={<ManageProductsPage />} />
                    <Route path="/admin/orders" element={<OrderManagement />} />

                    <Route path="*" element={
                      <div className="text-center mt-5">
                        <h3>404 - Không tìm thấy trang này!</h3>
                      </div>
                    } />
                  </Routes>
                </Suspense>
              </Container>

              <Footer />
              <Zalo />
              <ScrollToTop />
              <DarkModeToggle />
            </OrderProvider>
          </CartProvider>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;