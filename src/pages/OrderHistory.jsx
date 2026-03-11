import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Alert, Spinner, Modal } from 'react-bootstrap';
import { useOrder } from '../contexts/OrderContext';
import { useAuth } from '../AuthContext';
import { Eye, Truck, CheckCircle, Clock, XCircle, ArrowLeft, Trash } from 'react-bootstrap-icons';

const statusConfig = {
  pending: { color: 'warning', icon: Clock, text: 'Chờ xử lý' },
  processing: { color: 'info', icon: Truck, text: 'Đang xử lý' },
  shipped: { color: 'primary', icon: Truck, text: 'Đang giao hàng' },
  delivered: { color: 'success', icon: CheckCircle, text: 'Đã giao hàng' },
  cancelled: { color: 'danger', icon: XCircle, text: 'Đã hủy' },
  awaiting_payment: { color: 'secondary', icon: Clock, text: 'Chờ thanh toán' }
};

export default function OrderHistory() {
  const { user } = useAuth();
  const { orders, loading, error, fetchUserOrders, deleteOrder, setLoading } = useOrder();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);

  useEffect(() => {
    if (user) {
      fetchUserOrders(user.id);
    }
  }, [user, fetchUserOrders]);

  // Auto-refresh disabled to prevent flickering
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (user && !loading) {
  //       fetchUserOrders(user.id);
  //     }
  //   }, 10000);

  //   return () => clearInterval(interval);
  // }, [user, fetchUserOrders, loading]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Ngày không hợp lệ';
      }
      return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Ngày không hợp lệ';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Chờ xử lý';
      case 'processing': return 'Đang xử lý';
      case 'shipped': return 'Đang giao hàng';
      case 'delivered': return 'Đã giao hàng';
      case 'cancelled': return 'Đã hủy';
      case 'awaiting_payment': return 'Chờ thanh toán';
      default: return status || 'Không xác định';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'processing': return 'info';
      case 'shipped': return 'primary';
      case 'delivered': return 'success';
      case 'cancelled': return 'danger';
      case 'awaiting_payment': return 'secondary';
      default: return 'secondary';
    }
  };

  const handleRefresh = () => {
    if (user && !loading) {
      fetchUserOrders(user.id);
    }
  };

  const handleDeleteClick = (order) => {
    setOrderToDelete(order);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (orderToDelete) {
      try {
        await deleteOrder(orderToDelete.id);
        setShowDeleteModal(false);
        setOrderToDelete(null);
        // Refresh orders after deletion
        fetchUserOrders(user.id);
      } catch (error) {
        alert('Không thể xóa đơn hàng: ' + error.message);
      }
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setOrderToDelete(null);
  };

  // Check if order can be deleted (only pending orders can be deleted)
  const canDeleteOrder = (order) => {
    return order.status === 'pending' || order.status === 'awaiting_payment';
  };

  // Add timeout to clear loading state if it gets stuck
  useEffect(() => {
    let timeout;
    if (loading) {
      timeout = setTimeout(() => {
        setLoading(false);
      }, 3000); // Clear loading after 3 seconds max
    }
    return () => clearTimeout(timeout);
  }, [loading, setLoading]);

  const getPaymentMethodText = (method) => {
    switch (method) {
      case 'cod': return 'Thanh toán khi nhận hàng';
      case 'momo': return 'Ví MoMo';
      case 'banking': return 'Chuyển khoản ngân hàng';
      case 'transfer': return 'Chuyển khoản';
      default: return 'Không xác định';
    }
  };

  if (loading && orders.length === 0) {
    return (
      <Container className="mt-5">
        <div className="text-center">
          <Spinner animation="border" className="me-2" />
          Đang tải lịch sử đơn hàng...
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container className="mt-5">
        <Alert variant="warning">
          Vui lòng đăng nhập để xem lịch sử đơn hàng
        </Alert>
      </Container>
    );
  }

  if (orders.length === 0) {
    return (
      <Container className="mt-5">
        <div className="text-center">
          <h3>Lịch sử đơn hàng</h3>
          <div className="mt-4">
            <div className="alert alert-info">
              <h5 className="alert-heading">
                <i className="bi bi-clipboard-data me-2"></i>
                Chưa có đơn hàng nào
              </h5>
              <p className="mb-3">Bạn chưa có đơn hàng nào trong hệ thống.</p>
              <hr />
              <div className="d-flex gap-2 justify-content-center">
                <Button variant="primary" href="/shop">
                  <i className="bi bi-cart me-2"></i>
                  Bắt đầu mua sắm
                </Button>
                <Button variant="outline-primary" href="/cart">
                  <i className="bi bi-basket me-2"></i>
                  Xem giỏ hàng
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Lịch sử đơn hàng</h2>
        <Button variant="outline-secondary" size="sm" onClick={handleRefresh} disabled={loading}>
          {loading ? (
            <>
              <Spinner as="span" animation="border" size="sm" className="me-2" />
              Đang tải...
            </>
          ) : (
            <>
              <i className="bi bi-arrow-clockwise me-2"></i>
              Làm mới
            </>
          )}
        </Button>
      </div>

      {loading && orders.length > 0 && (
        <div className="text-center mb-3">
          <Spinner as="span" animation="border" size="sm" className="me-2" />
          <small className="text-muted">Đang cập nhật...</small>
        </div>
      )}

      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      <Row>
        <Col lg={selectedOrder ? 8 : 12}>
          {orders && orders.length > 0 ? (
            orders.map(order => (
              <Card key={order.id || Math.random()} className="mb-3 shadow-sm">
                <Card.Body>
                  <Row className="align-items-center">
                    <Col md={6}>
                      <div className="d-flex align-items-center mb-2">
                        <h6 className="mb-0 me-3">Mã đơn: #{order.id ? order.id.slice(-8) : 'N/A'}</h6>
                        <Badge bg={getStatusColor(order.status)}>
                          <Clock size={12} className="me-1" />
                          {getStatusText(order.status)}
                        </Badge>
                      </div>
                      <small className="text-muted">
                        Ngày đặt: {formatDate(order.createdAt)}
                      </small>
                    </Col>
                    <Col md={3} className="text-end">
                      <strong className="text-primary">{formatCurrency(order.totalAmount || 0)}</strong>
                    </Col>
                    <Col md={3} className="text-end">
                      <div className="btn-group" role="group">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                        >
                          <Eye className="me-1" />
                          {selectedOrder?.id === order.id ? 'Ẩn' : 'Xem'}
                        </Button>
                        {canDeleteOrder(order) && (
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDeleteClick(order)}
                            disabled={loading}
                          >
                            <Trash className="me-1" />
                            Xóa
                          </Button>
                        )}
                      </div>
                    </Col>
                  </Row>

                  {selectedOrder?.id === order.id && (
                    <div className="mt-3 pt-3 border-top">
                      <Row>
                        <Col md={6}>
                          <h6 className="mb-3">
                            <i className="bi bi-truck me-2"></i>
                            Thông tin giao hàng
                          </h6>
                          <div className="bg-light p-3 rounded">
                            <p className="mb-2"><strong>Người nhận:</strong> {order.shippingInfo?.fullName || 'N/A'}</p>
                            <p className="mb-2"><strong>SĐT:</strong> {order.shippingInfo?.phone || 'N/A'}</p>
                            <p className="mb-2"><strong>Email:</strong> {order.shippingInfo?.email || 'N/A'}</p>
                            <p className="mb-2"><strong>Địa chỉ:</strong> {order.shippingInfo?.address || 'N/A'}</p>
                            <p className="mb-2"><strong>Thành phố:</strong> {order.shippingInfo?.city || 'N/A'}</p>
                            <p className="mb-0"><strong>Quận/Huyện:</strong> {order.shippingInfo?.district || 'N/A'}</p>
                          </div>
                        </Col>
                        <Col md={6}>
                          <h6 className="mb-3">
                            <i className="bi bi-cart3 me-2"></i>
                            Chi tiết đơn hàng
                          </h6>
                          {order.items && order.items.length > 0 ? (
                            <>
                              {order.items.map((item, index) => (
                                <div key={item.id || index} className="d-flex justify-content-between align-items-center mb-3 p-2 bg-light rounded">
                                  <div className="d-flex align-items-center">
                                    <img
                                      src={item.image || '/placeholder.png'}
                                      alt={item.name || 'Sản phẩm'}
                                      style={{
                                        width: '50px',
                                        height: '50px',
                                        objectFit: 'cover',
                                        borderRadius: '8px',
                                        marginRight: '12px'
                                      }}
                                      onError={(e) => {
                                        e.target.src = '/placeholder.png';
                                      }}
                                    />
                                    <div>
                                      <div className="fw-bold">{item.name || 'Sản phẩm không tên'}</div>
                                      <small className="text-muted">SL: {item.quantity || 1} x {formatCurrency(item.price || 0)}</small>
                                    </div>
                                  </div>
                                  <div className="text-end">
                                    <strong>{formatCurrency((item.price || 0) * (item.quantity || 1))}</strong>
                                  </div>
                                </div>
                              ))}
                              <hr />
                              <div className="d-flex justify-content-between align-items-center">
                                <span className="h6 mb-0">Tổng cộng:</span>
                                <h5 className="mb-0 text-primary">{formatCurrency(order.totalAmount || 0)}</h5>
                              </div>
                              <div className="mt-3 pt-2 border-top">
                                <small className="text-muted">
                                  <strong>Phương thức thanh toán:</strong> {getPaymentMethodText(order.paymentMethod)}
                                </small>
                              </div>
                              {order.note && (
                                <div className="mt-2">
                                  <small className="text-muted">
                                    <strong>Ghi chú:</strong> {order.note}
                                  </small>
                                </div>
                              )}
                            </>
                          ) : (
                            <Alert variant="info">
                              Không có thông tin sản phẩm
                            </Alert>
                          )}
                        </Col>
                      </Row>
                    </div>
                  )}
                </Card.Body>
              </Card>
            ))
          ) : (
            <div className="text-center py-5">
              <div className="mb-4">
                <i className="bi bi-clipboard-data" style={{ fontSize: '4rem', color: '#6c757d' }}></i>
              </div>
              <h4 className="mb-3">Chưa có đơn hàng nào</h4>
              <p className="text-muted mb-4">Bạn chưa có đơn hàng nào trong hệ thống.</p>
              <div className="d-flex gap-2 justify-content-center">
                <Button variant="primary" href="/shop">
                  <i className="bi bi-cart me-2"></i>
                  Bắt đầu mua sắm
                </Button>
                <Button variant="outline-primary" href="/cart">
                  <i className="bi bi-basket me-2"></i>
                  Xem giỏ hàng
                </Button>
              </div>
            </div>
          )}
        </Col>
      </Row>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={handleDeleteCancel} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <Trash className="me-2 text-danger" />
            Xác nhận xóa đơn hàng
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Bạn có chắc chắn muốn xóa đơn hàng này?</p>
          {orderToDelete && (
            <div className="alert alert-warning">
              <strong>Mã đơn:</strong> #{orderToDelete.id?.slice(-8)}<br />
              <strong>Tổng tiền:</strong> {formatCurrency(orderToDelete.totalAmount)}<br />
              <strong>Ngày đặt:</strong> {formatDate(orderToDelete.createdAt)}<br />
              <strong>Trạng thái:</strong> {getStatusText(orderToDelete.status)}
            </div>
          )}
          <p className="text-muted mb-0">
            <small>Lưu ý: Hành động này không thể hoàn tác. Chỉ có thể xóa các đơn hàng đang ở trạng thái "Chờ xử lý" hoặc "Chờ thanh toán".</small>
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDeleteCancel}>
            Hủy
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm} disabled={loading}>
            {loading ? (
              <>
                <Spinner as="span" animation="border" size="sm" className="me-2" />
                Đang xóa...
              </>
            ) : (
              <>
                <Trash className="me-2" />
                Xóa đơn hàng
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
