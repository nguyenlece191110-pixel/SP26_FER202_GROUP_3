import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';


import { AuthProvider } from './AuthContext';
import { CartProvider } from './contexts/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';


const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Shop = lazy(() => import('./pages/Shop')); 
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Admin = lazy(() => import('./pages/Admin'));

function App() {
  return (
    <Router>
      <CartProvider>
        <AuthProvider>
          <Header />
          

          <Container className="mt-4" style={{ minHeight: '80vh' }}>
           
            
              <Suspense fallback={<div className="text-center mt-5 font-italic">Đang tải dữ liệu TechHub...</div>}>
                <Routes>
               
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  
                 
                  <Route path="/admin" element={<Admin />} />
                  
        
                  <Route path="*" element={<div className="text-center mt-5"><h3>404 - Không tìm thấy trang này!</h3></div>} />
                </Routes>
              </Suspense>
              
            </Container>

            <Footer />
          </AuthProvider>
        </CartProvider>
      </Router>
    );
}

export default App;