import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

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
  const [lastFetch, setLastFetch] = useState(0);

  // Fetch all orders (for admin)
  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/orders');
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
      // Prevent duplicate calls within 1 second
      const now = Date.now();
      if (now - lastFetch < 1000) {
        return;
      }
      setLastFetch(now);
      
      setLoading(true);
      
      if (!userId) {
        throw new Error('User ID is required');
      }

      const response = await axios.get(`http://localhost:5000/orders?userId=${userId}`);
      
      // Sort orders by creation date (newest first)
      const sortedOrders = response.data.sort((a, b) => 
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

      const response = await axios.post('http://localhost:5000/orders', {
        ...orderData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        status: 'pending'
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
      await axios.patch(`http://localhost:5000/orders/${orderId}`, { status });
      
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
      const response = await axios.get(`http://localhost:5000/orders/${orderId}`);
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
      await axios.delete(`http://localhost:5000/orders/${orderId}`);
      
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
