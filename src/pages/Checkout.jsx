import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowLeft, Cart3, Truck, ShieldCheck, Shield, CreditCard } from 'react-bootstrap-icons';
import { useAuth } from '../AuthContext';
import { useCart } from '../contexts/CartContext';
import { useOrder } from '../contexts/OrderContext';

export default function Checkout() {
    const { 
        items, 
        selectedItems, 
        getSelectedItemsTotal, 
        getSelectedItemsCount,
        isAllItemsSelected,
        selectAllItems,
        deselectAllItems,
        clearSelectedItems
    } = useCart();

    const { createOrder } = useOrder();
    const { user } = useAuth();

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        district: '',
        zipCode: '',
        paymentMethod: 'cod',
        note: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderComplete, setOrderComplete] = useState(false);
    const [orderId, setOrderId] = useState(null);

    const selectedItemsList = items.filter(item => selectedItems.includes(item.id));
    const selectedTotal = getSelectedItemsTotal();
    const selectedCount = getSelectedItemsCount();

    // Load payment info from session storage
    useEffect(() => {
        const paymentInfo = sessionStorage.getItem('paymentInfo');
        if (paymentInfo) {
            const info = JSON.parse(paymentInfo);
            setFormData(prev => ({
                ...prev,
                fullName: info.fullName || '',
                email: info.email || '',
                phone: info.phone || '',
                address: info.address || '',
                city: info.city || '',
                district: info.district || '',
                zipCode: info.zipCode || ''
            }));
        }
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Vui lòng nhập họ tên';
        } else if (formData.fullName.trim().length < 2) {
            newErrors.fullName = 'Họ tên phải có ít nhất 2 ký tự';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Vui lòng nhập email';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email không hợp lệ';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Vui lòng nhập số điện thoại';
        } else if (!/^(0|\+84)[0-9]{9,10}$/.test(formData.phone.replace(/\s/g, ''))) {
            newErrors.phone = 'Số điện thoại không hợp lệ (bắt đầu bằng 0 hoặc +84)';
        }

        if (!formData.address.trim()) {
            newErrors.address = 'Vui lòng nhập địa chỉ';
        } else if (formData.address.trim().length < 5) {
            newErrors.address = 'Địa chỉ phải có ít nhất 5 ký tự';
        }

        if (!formData.city.trim()) {
            newErrors.city = 'Vui lòng chọn thành phố';
        }

        if (!formData.district.trim()) {
            newErrors.district = 'Vui lòng chọn quận/huyện';
        }

        if (formData.zipCode && formData.zipCode.trim() && !/^\d{5,6}$/.test(formData.zipCode.trim())) {
            newErrors.zipCode = 'Mã bưu điện không hợp lệ (5-6 số)';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (selectedItems.length === 0) {
            alert('Vui lòng chọn ít nhất một sản phẩm để thanh toán');
            return;
        }

        if (!validateForm()) {
            // Scroll to first error field
            const firstErrorField = Object.keys(errors)[0];
            const errorElement = document.querySelector(`[name="${firstErrorField}"]`);
            if (errorElement) {
                errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                errorElement.focus();
            }
            return;
        }

        if (!user) {
            alert('Vui lòng đăng nhập để đặt hàng');
            return;
        }

        setIsSubmitting(true);

        try {
            const orderData = {
                userId: user.id,
                items: selectedItemsList,
                totalAmount: selectedTotal,
                shippingInfo: {
                    fullName: formData.fullName,
                    email: formData.email,
                    phone: formData.phone,
                    address: formData.address,
                    city: formData.city,
                    district: formData.district,
                    zipCode: formData.zipCode
                },
                paymentMethod: formData.paymentMethod,
                note: formData.note
            };

            const createdOrder = await createOrder(orderData);
            
            // Clear selected items from cart
            clearSelectedItems();
            
            // Show success with actual order ID
            setOrderComplete(true);
            setOrderId(createdOrder.id);
            
            // Show success message
            alert(`Đặt hàng thành công! Mã đơn hàng: #${createdOrder.id.slice(-8)}`);
            
        } catch (error) {
            console.error('Order creation error:', error);
            alert('Đặt hàng không thành công. Vui lòng thử lại.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (orderComplete) {
        return (
            <Container className="mt-5">
                <div className="text-center py-5">
                    <CheckCircle size={80} className="text-success mb-4" />
                    <h2 className="mb-3">Đặt hàng thành công!</h2>
                    <p className="text-muted mb-4">
                        Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ liên hệ với bạn sớm nhất.
                    </p>
                    <div className="mb-4">
                        <h5>Mã đơn hàng: #{orderId ? orderId.slice(-8) : 'N/A'}</h5>
                        <p className="text-muted">
                            Đơn hàng gồm {selectedCount} sản phẩm với tổng giá trị {new Intl.NumberFormat('vi-VN', {
                                style: 'currency',
                                currency: 'VND'
                            }).format(selectedTotal)}
                        </p>
                    </div>
                    <div className="d-flex gap-2 justify-content-center">
                        <Button variant="primary" href="/orders">
                            Xem đơn hàng
                        </Button>
                        <Button variant="outline-primary" href="/shop">
                            Tiếp tục mua sắm
                        </Button>
                    </div>
                </div>
            </Container>
        );
    }

    if (items.length === 0) {
        return (
            <Container className="mt-5">
                <div className="text-center">
                    <h3>Giỏ hàng của bạn đang trống</h3>
                    <p className="text-muted mb-4">
                        Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán
                    </p>
                    <Button variant="primary" href="/shop">
                        Quay lại cửa hàng
                    </Button>
                </div>
            </Container>
        );
    }

    // Check if payment info exists
    const paymentInfo = sessionStorage.getItem('paymentInfo');
    if (!paymentInfo) {
        return (
            <Container className="mt-5">
                <Alert variant="warning" className="text-center">
                    <h5>Vui lòng nhập thông tin thanh toán trước</h5>
                    <p className="mb-3">Bạn cần điền thông tin giao hàng trước khi tiếp tục thanh toán.</p>
                    <Button variant="primary" href="/payment-info">
                        <ArrowLeft className="me-2" />
                        Quay lại nhập thông tin
                    </Button>
                </Alert>
            </Container>
        );
    }

    return (
        <Container className="mt-4 mb-5">
            <div className="d-flex align-items-center mb-4">
                <Button variant="outline-secondary" href="/payment-info" className="me-3">
                    <ArrowLeft className="me-2" />
                    Quay lại thông tin
                </Button>
                <h2 className="mb-0">Xác nhận thanh toán</h2>
            </div>

            <Row>
                {/* Shipping Information */}
                <Col lg={7} className="mb-4">
                    <Card>
                        <Card.Header className="bg-info text-white">
                            <h5 className="mb-0">
                                <Truck className="me-2" />
                                Thông tin giao hàng
                            </h5>
                        </Card.Header>
                        <Card.Body>
                            <div className="mb-3">
                                <h6 className="text-muted mb-3">Thông tin người nhận</h6>
                                <p className="mb-2"><strong>Họ tên:</strong> {formData.fullName}</p>
                                <p className="mb-2"><strong>Email:</strong> {formData.email}</p>
                                <p className="mb-2"><strong>SĐT:</strong> {formData.phone}</p>
                            </div>
                            <div className="mb-3">
                                <h6 className="text-muted mb-3">Địa chỉ giao hàng</h6>
                                <p className="mb-2"><strong>Địa chỉ:</strong> {formData.address}</p>
                                <p className="mb-2"><strong>Quận/Huyện:</strong> {formData.district}</p>
                                <p className="mb-2"><strong>Tỉnh/Thành phố:</strong> {formData.city}</p>
                                {formData.zipCode && <p className="mb-2"><strong>Mã bưu điện:</strong> {formData.zipCode}</p>}
                            </div>
                            <div className="d-flex gap-2">
                                <Button variant="outline-primary" href="/payment-info" size="sm">
                                    <ArrowLeft className="me-1" />
                                    Chỉnh sửa thông tin
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Order Summary */}
                <Col lg={5} className="mb-4">
                    <Card>
                        <Card.Header className="bg-primary text-white">
                            <h5 className="mb-0">Tóm tắt đơn hàng</h5>
                        </Card.Header>
                        <Card.Body>
                            {/* Select All */}
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <Form.Check
                                    type="checkbox"
                                    label="Chọn tất cả"
                                    checked={isAllItemsSelected()}
                                    onChange={() => isAllItemsSelected() ? deselectAllItems() : selectAllItems()}
                                />
                                <Badge bg="secondary">{selectedItems.length} sản phẩm</Badge>
                            </div>

                            {/* Selected Items */}
                            {selectedItemsList.map(item => (
                                <div key={item.id} className="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom">
                                    <div className="d-flex align-items-center">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            style={{
                                                width: '60px',
                                                height: '60px',
                                                objectFit: 'cover',
                                                borderRadius: '8px',
                                                marginRight: '12px'
                                            }}
                                        />
                                        <div>
                                            <h6 className="mb-1">{item.name}</h6>
                                            <small className="text-muted">Số lượng: {item.quantity}</small>
                                        </div>
                                    </div>
                                    <div className="text-end">
                                        <strong>
                                            {new Intl.NumberFormat('vi-VN', {
                                                style: 'currency',
                                                currency: 'VND'
                                            }).format(item.price * item.quantity)}
                                        </strong>
                                    </div>
                                </div>
                            ))}

                            {/* Price Summary */}
                            <div className="mt-3">
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Tạm tính:</span>
                                    <span>{new Intl.NumberFormat('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND'
                                    }).format(selectedTotal)}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Phí vận chuyển:</span>
                                    <span className="text-success">Miễn phí</span>
                                </div>
                                <hr />
                                <div className="d-flex justify-content-between">
                                    <h5 className="mb-0">Tổng cộng:</h5>
                                    <h5 className="mb-0 text-primary">
                                        {new Intl.NumberFormat('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND'
                                        }).format(selectedTotal)}
                                    </h5>
                                </div>
                            </div>

                            {/* Benefits */}
                            <Alert variant="info" className="mt-3">
                                <div className="d-flex align-items-center mb-2">
                                    <Truck className="me-2" />
                                    <small>Miễn phí vận chuyển đơn hàng từ 500.000 VNĐ</small>
                                </div>
                                <div className="d-flex align-items-center mb-2">
                                    <Shield className="me-2" />
                                    <small>Bảo hành chính hãng 12 tháng</small>
                                </div>
                                <div className="d-flex align-items-center">
                                    <CreditCard className="me-2" />
                                    <small>Thanh toán an toàn 100%</small>
                                </div>
                            </Alert>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Payment Method */}
                <Col lg={7} className="mb-4">
                    <Card>
                        <Card.Header className="bg-success text-white">
                            <h5 className="mb-0">
                                <CreditCard className="me-2" />
                                Phương thức thanh toán
                            </h5>
                        </Card.Header>
                        <Card.Body>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group>
                                    <Form.Label>Chọn phương thức thanh toán</Form.Label>
                                    <div className="mb-3">
                                        <Form.Check
                                            type="radio"
                                            name="paymentMethod"
                                            value="cod"
                                            checked={formData.paymentMethod === 'cod'}
                                            onChange={handleInputChange}
                                            label="Thanh toán khi nhận hàng (COD)"
                                            id="cod"
                                        />
                                        <small className="text-muted d-block ms-4">
                                            Thanh toán bằng tiền mặt khi nhận được hàng
                                        </small>
                                    </div>
                                    <div className="mb-3">
                                        <Form.Check
                                            type="radio"
                                            name="paymentMethod"
                                            value="banking"
                                            checked={formData.paymentMethod === 'banking'}
                                            onChange={handleInputChange}
                                            label="Chuyển khoản ngân hàng"
                                            id="banking"
                                        />
                                        <small className="text-muted d-block ms-4">
                                            Chuyển khoản trước khi giao hàng
                                        </small>
                                    </div>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Ghi chú</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        name="note"
                                        value={formData.note}
                                        onChange={handleInputChange}
                                        rows={3}
                                        placeholder="Nhập ghi chú cho đơn hàng (không bắt buộc)"
                                    />
                                </Form.Group>

                                <Alert variant="warning">
                                    <small>
                                        <strong>Lưu ý:</strong> Bằng việc đặt hàng, bạn đồng ý với 
                                        <a href="/terms" className="text-decoration-none"> điều khoản dịch vụ</a> và 
                                        <a href="/privacy" className="text-decoration-none"> chính sách bảo mật</a> của chúng tôi.
                                    </small>
                                </Alert>

                                <div className="d-flex gap-2">
                                    <Button variant="primary" type="submit" disabled={isSubmitting}>
                                        {isSubmitting ? (
                                            <>
                                                <Spinner as="span" animation="border" size="sm" className="me-2" />
                                                Đang đặt hàng...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle className="me-2" />
                                                Xác nhận đặt hàng
                                            </>
                                        )}
                                    </Button>
                                    <Button variant="outline-secondary" href="/payment-info">
                                        <ArrowLeft className="me-2" />
                                        Quay lại
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}
