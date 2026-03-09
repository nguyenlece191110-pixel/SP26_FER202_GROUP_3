import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Badge } from 'react-bootstrap';
import { useCart } from '../contexts/CartContext';
import { ArrowLeft, Truck, Shield, CreditCard, CheckCircle } from 'react-bootstrap-icons';

export default function Checkout() {
    const { 
        items, 
        selectedItems, 
        getSelectedItemsTotal, 
        getSelectedItemsCount,
        isAllItemsSelected,
        selectAllItems,
        deselectAllItems 
    } = useCart();

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

    const selectedItemsList = items.filter(item => selectedItems.includes(item.id));
    const selectedTotal = getSelectedItemsTotal();
    const selectedCount = getSelectedItemsCount();

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

        if (!formData.fullName.trim()) newErrors.fullName = 'Vui lòng nhập họ tên';
        if (!formData.email.trim()) newErrors.email = 'Vui lòng nhập email';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email không hợp lệ';
        if (!formData.phone.trim()) newErrors.phone = 'Vui lòng nhập số điện thoại';
        else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ''))) newErrors.phone = 'Số điện thoại không hợp lệ';
        if (!formData.address.trim()) newErrors.address = 'Vui lòng nhập địa chỉ';
        if (!formData.city.trim()) newErrors.city = 'Vui lòng chọn thành phố';
        if (!formData.district.trim()) newErrors.district = 'Vui lòng chọn quận/huyện';

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
            return;
        }

        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setOrderComplete(true);
        }, 2000);
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
                        <h5>Mã đơn hàng: #{Date.now().toString().slice(-8)}</h5>
                        <p className="text-muted">
                            Đơn hàng gồm {selectedCount} sản phẩm với tổng giá trị {new Intl.NumberFormat('vi-VN', {
                                style: 'currency',
                                currency: 'VND'
                            }).format(selectedTotal)}
                        </p>
                    </div>
                    <Button variant="primary" href="/shop">
                        Tiếp tục mua sắm
                    </Button>
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

    return (
        <Container className="mt-4 mb-5">
            <div className="d-flex align-items-center mb-4">
                <Button variant="outline-secondary" href="/cart" className="me-3">
                    <ArrowLeft className="me-2" />
                    Quay lại giỏ hàng
                </Button>
                <h2 className="mb-0">Thanh toán</h2>
            </div>

            <Row>
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

                {/* Shipping & Payment Form */}
                <Col lg={7}>
                    <Card>
                        <Card.Header>
                            <h5 className="mb-0">Thông tin giao hàng</h5>
                        </Card.Header>
                        <Card.Body>
                            <Form onSubmit={handleSubmit}>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Họ và tên *</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="fullName"
                                                value={formData.fullName}
                                                onChange={handleInputChange}
                                                isInvalid={!!errors.fullName}
                                                placeholder="Nhập họ và tên"
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.fullName}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Email *</Form.Label>
                                            <Form.Control
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                isInvalid={!!errors.email}
                                                placeholder="email@example.com"
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.email}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Số điện thoại *</Form.Label>
                                            <Form.Control
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                isInvalid={!!errors.phone}
                                                placeholder="0901234567"
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.phone}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Mã bưu điện</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="zipCode"
                                                value={formData.zipCode}
                                                onChange={handleInputChange}
                                                placeholder="700000"
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-3">
                                    <Form.Label>Địa chỉ *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        isInvalid={!!errors.address}
                                        placeholder="Số nhà, tên đường"
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.address}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Thành phố *</Form.Label>
                                            <Form.Select
                                                name="city"
                                                value={formData.city}
                                                onChange={handleInputChange}
                                                isInvalid={!!errors.city}
                                            >
                                                <option value="">Chọn thành phố</option>
                                                <option value="hanoi">Hà Nội</option>
                                                <option value="hcmc">TP. Hồ Chí Minh</option>
                                                <option value="danang">Đà Nẵng</option>
                                                <option value="haiphong">Hải Phòng</option>
                                                <option value="cantho">Cần Thơ</option>
                                            </Form.Select>
                                            <Form.Control.Feedback type="invalid">
                                                {errors.city}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Quận/Huyện *</Form.Label>
                                            <Form.Select
                                                name="district"
                                                value={formData.district}
                                                onChange={handleInputChange}
                                                isInvalid={!!errors.district}
                                            >
                                                <option value="">Chọn quận/huyện</option>
                                                <option value="quan1">Quận 1</option>
                                                <option value="quan3">Quận 3</option>
                                                <option value="binhthanh">Bình Thạnh</option>
                                                <option value="govap">Gò Vấp</option>
                                                <option value="phunhuan">Phú Nhuận</option>
                                            </Form.Select>
                                            <Form.Control.Feedback type="invalid">
                                                {errors.district}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-4">
                                    <Form.Label>Ghi chú</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        name="note"
                                        value={formData.note}
                                        onChange={handleInputChange}
                                        rows={3}
                                        placeholder="Ghi chú về đơn hàng (tùy chọn)"
                                    />
                                </Form.Group>

                                <h5 className="mb-3">Phương thức thanh toán</h5>
                                <div className="mb-4">
                                    {['cod', 'transfer', 'card'].map((method) => (
                                        <Form.Check
                                            key={method}
                                            type="radio"
                                            name="paymentMethod"
                                            id={method}
                                            value={method}
                                            checked={formData.paymentMethod === method}
                                            onChange={handleInputChange}
                                            label={
                                                method === 'cod' ? 'Thanh toán khi nhận hàng (COD)' :
                                                method === 'transfer' ? 'Chuyển khoản ngân hàng' :
                                                'Thẻ tín dụng/Ghi nợ'
                                            }
                                            className="mb-2"
                                        />
                                    ))}
                                </div>

                                <Alert variant="warning">
                                    <small>
                                        <strong>Lưu ý:</strong> Bằng việc đặt hàng, bạn đồng ý với 
                                        <a href="/terms" className="text-decoration-none"> điều khoản dịch vụ</a> và 
                                        <a href="/privacy" className="text-decoration-none"> chính sách bảo mật</a> của chúng tôi.
                                    </small>
                                </Alert>

                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="lg"
                                    className="w-100"
                                    disabled={selectedItems.length === 0 || isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                            Đang xử lý...
                                        </>
                                    ) : (
                                        `Đặt hàng (${selectedCount} sản phẩm) - ${new Intl.NumberFormat('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND'
                                        }).format(selectedTotal)}`
                                    )}
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}
