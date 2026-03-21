import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const OrderContext = createContext();

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all orders (for admin)
  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/orders`);
      setOrders(response.data);
      setError(null);
    } catch (err) {
      setError('Không thể tải danh sách đơn hàng');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user orders
  const fetchUserOrders = async (userId) => {
    try {
      setLoading(true);
      
      if (!userId) {
        throw new Error('User ID is required');
      }

      // Fetch all then filter with normalized string ID to avoid type mismatch (number vs string).
      const response = await axios.get(`${API_BASE_URL}/orders`);
      const userOrders = (response.data || []).filter(
        order => String(order.userId) === String(userId)
      );
      
      // Sort orders by creation date (newest first)
      const sortedOrders = userOrders.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      
      setOrders(sortedOrders);
      setError(null);
      
      console.log(`Fetched ${sortedOrders.length} orders for user ${userId}`);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Không thể tải lịch sử đơn hàng';
      setError(errorMessage);
      console.error('Error fetching user orders:', err);
    } finally {
      setLoading(false);
    }
  };

  // Create new order
  const createOrder = async (orderData) => {
    try {
      setLoading(true);
      
      // Validate order data before sending
      if (!orderData.userId || !orderData.items || orderData.items.length === 0) {
        throw new Error('Dữ liệu đơn hàng không hợp lệ');
      }

      if (!orderData.totalAmount || orderData.totalAmount <= 0) {
        throw new Error('Tổng số tiền không hợp lệ');
      }

      if (!orderData.shippingInfo || !orderData.shippingInfo.fullName) {
        throw new Error('Thông tin giao hàng không đầy đủ');
      }

      // Check and update product quantities
      for (const item of orderData.items) {
        try {
          // Get current product data
          const productResponse = await axios.get(`${API_BASE_URL}/products/${item.id}`);
          const product = productResponse.data;
          
          // Check if product exists
          if (!product) {
            throw new Error(`Sản phẩm với ID ${item.id} không tồn tại`);
          }
          
          // Check if enough quantity is available
          if (product.quantity < item.quantity) {
            throw new Error(`Sản phẩm ${product.name} chỉ còn ${product.quantity} sản phẩm trong kho`);
          }
          
          // Update product quantity
          const newQuantity = product.quantity - item.quantity;
          await axios.patch(`${API_BASE_URL}/products/${item.id}`, { 
            quantity: newQuantity,
            inStock: newQuantity > 0
          });
          
          console.log(`Updated quantity for product ${product.name}: ${product.quantity} -> ${newQuantity}`);
        } catch (error) {
          if (error.response?.status === 404) {
            throw new Error(`Sản phẩm với ID ${item.id} không tồn tại`);
          }
          throw error;
        }
      }

      const response = await axios.post(`${API_BASE_URL}/orders`, {
        ...orderData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        status: orderData.status || 'pending'
      });
      
      setOrders(prev => [...prev, response.data]);
      setError(null);
      
      console.log('Order created successfully:', response.data);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Không thể tạo đơn hàng';
      setError(errorMessage);
      console.error('Error creating order:', err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId, status) => {
    try {
      setLoading(true);
      
      // If order is being cancelled, restore product quantities
      if (status === 'cancelled') {
        // Get order details to restore quantities
        const orderResponse = await axios.get(`${API_BASE_URL}/orders/${orderId}`);
        const order = orderResponse.data;
        
        // Restore product quantities
        for (const item of order.items) {
          try {
            // Get current product data
            const productResponse = await axios.get(`${API_BASE_URL}/products/${item.id}`);
            const product = productResponse.data;
            
            if (product) {
              // Restore quantity
              const newQuantity = product.quantity + item.quantity;
              await axios.patch(`${API_BASE_URL}/products/${item.id}`, { 
                quantity: newQuantity,
                inStock: newQuantity > 0
              });
              
              console.log(`Restored quantity for product ${product.name}: ${product.quantity} -> ${newQuantity}`);
            }
          } catch (error) {
            console.error(`Error restoring quantity for product ${item.id}:`, error);
          }
        }
      }
      
      await axios.patch(`${API_BASE_URL}/orders/${orderId}`, { status });
      
      setOrders(prev => 
        prev.map(order => 
          order.id === orderId ? { ...order, status } : order
        )
      );
      setError(null);
    } catch (err) {
      setError('Không thể cập nhật trạng thái đơn hàng');
      console.error('Error updating order status:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get order by ID
  const getOrderById = async (orderId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/orders/${orderId}`);
      return response.data;
    } catch (err) {
      setError('Không thể tìm thấy đơn hàng');
      console.error('Error fetching order:', err);
      throw err;
    }
  };

  // Delete order
  const deleteOrder = async (orderId) => {
    try {
      setLoading(true);
      await axios.delete(`${API_BASE_URL}/orders/${orderId}`);
      
      setOrders(prev => prev.filter(order => order.id !== orderId));
      setError(null);
    } catch (err) {
      setError('Không thể xóa đơn hàng');
      console.error('Error deleting order:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    orders,
    loading,
    error,
    fetchAllOrders,
    fetchUserOrders,
    createOrder,
    updateOrderStatus,
    getOrderById,
    deleteOrder,
    setLoading
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};
