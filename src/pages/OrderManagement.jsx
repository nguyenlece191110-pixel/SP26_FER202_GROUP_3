import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Alert, Spinner, Form, Modal } from 'react-bootstrap';
import { useOrder } from '../contexts/OrderContext';
import { Eye, Truck, CheckCircle, Clock, XCircle, PencilSquare, Trash, Search } from 'react-bootstrap-icons';

const statusConfig = {
  pending: { color: 'warning', icon: Clock, text: 'Chờ xử lý' },
  processing: { color: 'info', icon: Truck, text: 'Đang xử lý' },
  shipped: { color: 'primary', icon: Truck, text: 'Đang giao hàng' },
  delivered: { color: 'success', icon: CheckCircle, text: 'Đã giao hàng' },
  cancelled: { color: 'danger', icon: XCircle, text: 'Đã hủy' }
};

const statusOptions = [
  { value: 'pending', label: 'Chờ xử lý' },
  { value: 'processing', label: 'Đang xử lý' },
  { value: 'shipped', label: 'Đang giao hàng' },
  { value: 'delivered', label: 'Đã giao hàng' },
  { value: 'cancelled', label: 'Đã hủy' }
];

export default function OrderManagement() {
  const { orders, loading, error, fetchAllOrders, updateOrderStatus, deleteOrder } = useOrder();
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchAllOrders();
  }, [fetchAllOrders]);

  useEffect(() => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.shippingInfo.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.shippingInfo.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleStatusUpdate = async () => {
    if (selectedOrder && newStatus) {
      try {
        await updateOrderStatus(selectedOrder.id, newStatus);
        setShowStatusModal(false);
        setSelectedOrder(null);
        setNewStatus('');
      } catch (err) {
        alert('Không thể cập nhật trạng thái đơn hàng');
      }
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa đơn hàng này?')) {
      try {
        await deleteOrder(orderId);
      } catch (err) {
        alert('Không thể xóa đơn hàng');
      }
    }
  };

  const openStatusModal = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setShowStatusModal(true);
  };

  if (loading && orders.length === 0) {
    return (
      <Container className="mt-5">
        <div className="text-center">
          <Spinner animation="border" className="me-2" />
          Đang tải danh sách đơn hàng...
        </div>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Quản lý Đơn hàng</h2>
        <Button variant="outline-primary" onClick={fetchAllOrders}>
          <Search className="me-2" />
          Làm mới
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {/* Filters */}
      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Tìm kiếm đơn hàng</Form.Label>
                <div className="input-group">
                  <Form.Control
                    type="text"
                    placeholder="Tìm theo mã đơn, tên, email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <span className="input-group-text">
                    <Search />
                  </span>
                </div>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Lọc theo trạng thái</Form.Label>
                <Form.Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">Tất cả trạng thái</option>
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group>
                <Form.Label>&nbsp;</Form.Label>
                <div>
                  <Badge bg="primary" className="p-2">
                    {filteredOrders.length} đơn hàng
                  </Badge>
                </div>
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <Alert variant="info">
          {searchTerm || statusFilter ? 'Không tìm thấy đơn hàng phù hợp' : 'Chưa có đơn hàng nào'}
        </Alert>
      ) : (
        filteredOrders.map(order => (
          <Card key={order.id} className="mb-3">
            <Card.Body>
              <Row className="align-items-center">
                <Col md={4}>
                  <div className="d-flex align-items-center mb-2">
                    <h6 className="mb-0 me-3">#{order.id.slice(-8)}</h6>
                    <Badge bg={statusConfig[order.status]?.color || 'secondary'}>
                      {React.createElement(statusConfig[order.status]?.icon, { 
                        size: 12, 
                        className: 'me-1' 
                      })}
                      {statusConfig[order.status]?.text || order.status}
                    </Badge>
                  </div>
                  <small className="text-muted">
                    {order.shippingInfo.fullName} - {order.shippingInfo.email}
                  </small>
                  <br />
                  <small className="text-muted">
                    {formatDate(order.createdAt)}
                  </small>
                </Col>
                <Col md={2}>
                  <strong>{formatCurrency(order.totalAmount)}</strong>
                  <br />
                  <small className="text-muted">{order.items.length} sản phẩm</small>
                </Col>
                <Col md={2}>
                  <small className="text-muted">
                    {order.paymentMethod === 'cod' ? 'COD' :
                     order.paymentMethod === 'transfer' ? 'CK' : 'Thẻ'}
                  </small>
                </Col>
                <Col md={4} className="text-end">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="me-1"
                    onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                  >
                    <Eye className="me-1" />
                    Xem
                  </Button>
                  <Button
                    variant="outline-warning"
                    size="sm"
                    className="me-1"
                    onClick={() => openStatusModal(order)}
                  >
                    <PencilSquare className="me-1" />
                    Trạng thái
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDeleteOrder(order.id)}
                  >
                    <Trash className="me-1" />
                    Xóa
                  </Button>
                </Col>
              </Row>

              {selectedOrder?.id === order.id && (
                <div className="mt-3 pt-3 border-top">
                  <Row>
                    <Col md={6}>
                      <h6>Thông tin giao hàng</h6>
                      <p className="mb-1"><strong>Người nhận:</strong> {order.shippingInfo.fullName}</p>
                      <p className="mb-1"><strong>SĐT:</strong> {order.shippingInfo.phone}</p>
                      <p className="mb-1"><strong>Email:</strong> {order.shippingInfo.email}</p>
                      <p className="mb-1"><strong>Địa chỉ:</strong> {order.shippingInfo.address}</p>
                      <p className="mb-1"><strong>Thành phố:</strong> {order.shippingInfo.city}</p>
                      <p className="mb-0"><strong>Quận/Huyện:</strong> {order.shippingInfo.district}</p>
                    </Col>
                    <Col md={6}>
                      <h6>Chi tiết đơn hàng</h6>
                      {order.items.map((item, index) => (
                        <div key={index} className="d-flex justify-content-between align-items-center mb-2">
                          <div className="d-flex align-items-center">
                            <img
                              src={item.image}
                              alt={item.name}
                              style={{
                                width: '40px',
                                height: '40px',
                                objectFit: 'cover',
                                borderRadius: '4px',
                                marginRight: '8px'
                              }}
                            />
                            <div>
                              <small className="d-block">{item.name}</small>
                              <small className="text-muted">SL: {item.quantity}</small>
                            </div>
                          </div>
                          <small className="text-end">
                            {formatCurrency(item.price * item.quantity)}
                          </small>
                        </div>
                      ))}
                      <hr />
                      <div className="d-flex justify-content-between">
                        <strong>Tổng cộng:</strong>
                        <strong className="text-primary">{formatCurrency(order.totalAmount)}</strong>
                      </div>
                      {order.note && (
                        <div className="mt-2">
                          <small className="text-muted">
                            <strong>Ghi chú:</strong> {order.note}
                          </small>
                        </div>
                      )}
                    </Col>
                  </Row>
                </div>
              )}
            </Card.Body>
          </Card>
        ))
      )}

      {/* Status Update Modal */}
      <Modal show={showStatusModal} onHide={() => setShowStatusModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Cập nhật trạng thái đơn hàng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            <strong>Đơn hàng:</strong> #{selectedOrder?.id?.slice(-8)}
          </p>
          <Form.Group>
            <Form.Label>Trạng thái mới</Form.Label>
            <Form.Select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowStatusModal(false)}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleStatusUpdate}>
            Cập nhật
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
