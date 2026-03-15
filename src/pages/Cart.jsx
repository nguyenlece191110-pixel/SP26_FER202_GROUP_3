import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Spinner, Modal } from 'react-bootstrap';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../AuthContext';
import { useOrder } from '../contexts/OrderContext';
import { Person, Envelope, Telephone, House, CreditCard, Cash, Phone, ArrowLeft, QrCode, Cart3, Dash, Plus, Trash2 } from 'react-bootstrap-icons';

export default function Cart() {
    const { user } = useAuth();
    const { createOrder } = useOrder();
    const { 
        items, 
        totalItems, 
        updateQuantity, 
        removeFromCart,
        clearCart,
        selectedItems,
        getSelectedItemsTotal,
        getSelectedItemsCount,
        isAllItemsSelected,
        selectAllItems,
        deselectAllItems,
        toggleSelectItem,
        clearSelectedItems
    } = useCart();

    // Debug: Log cart data
    console.log('Cart Debug - Items:', items);
    console.log('Cart Debug - Total Items:', totalItems);
    console.log('Cart Debug - User:', user);

    // Modal state
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentStep, setPaymentStep] = useState(1); // 1: Info, 2: Payment Method, 3: QR Code
    const [paymentFormData, setPaymentFormData] = useState({
        fullName: user?.name || '',
        email: user?.email || '',
        phone: '',
        address: '',
        city: '',
        district: '',
        zipCode: ''
    });
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('cod');
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [qrCodeUrl, setQrCodeUrl] = useState('');

    // Nếu chưa đăng nhập và có sản phẩm trong giỏ, xóa giỏ hàng
    useEffect(() => {
        if (!user && items.length > 0) {
            clearCart();
        }
    }, [user, items.length, clearCart]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const totalPrice = getSelectedItemsTotal();

    // District data for each city
    const districtsData = {
        'Hà Nội': [
            'Ba Đình', 'Cầu Giấy', 'Đống Đa', 'Hai Bà Trưng', 'Hoàn Kiếm',
            'Hoàng Mai', 'Long Biên', 'Tây Hồ', 'Thanh Xuân', 'Đông Anh',
            'Gia Lâm', 'Sóc Sơn', 'Bắc Từ Liêm', 'Nam Từ Liêm', 'Mê Linh',
            'Quốc Oai', 'Chương Mỹ', 'Đan Phượng', 'Hoài Đức', 'Phú Xuyên',
            'Phúc Thọ', 'Quốc Oai', 'Sơn Tây', 'Thạch Thất', 'Thường Tín', 'Ứng Hòa'
        ],
        'TP. Hồ Chí Minh': [
            'Quận 1', 'Quận 2', 'Quận 3', 'Quận 4', 'Quận 5', 'Quận 6',
            'Quận 7', 'Quận 8', 'Quận 10', 'Quận 11', 'Quận 12', 'Bình Thạnh',
            'Bình Tân', 'Bình Chánh', 'Gò Vấp', 'Hóc Môn', 'Nhà Bè', 'Phú Nhuận',
            'Tân Bình', 'Tân Phú', 'Thủ Đức', 'Củ Chi', 'Cần Giờ'
        ],
        'Đà Nẵng': [
            'Hải Châu', 'Thanh Khê', 'Sơn Trà', 'Ngũ Hành Sơn', 'Liên Chiểu',
            'Cẩm Lệ', 'Hòa Vang', 'Hoàng Sa'
        ],
        'Hải Phòng': [
            'Hồng Bàng', 'Ngô Quyền', 'Lê Chân', 'Kiến An', 'Dương Kinh',
            'Hải An', 'Đồ Sơn', 'Kinh Dương', 'An Dương', 'Thủy Nguyên',
            'Tiên Lãng', 'Vĩnh Bảo', 'An Lão', 'Kiến Thụy', 'Cát Hải', 'Bạch Long Vĩ'
        ],
        'Cần Thơ': [
            'Ninh Kiều', 'Bình Thủy', 'Cái Răng', 'Ô Môn', 'Thốt Nốt',
            'Vĩnh Thạnh', 'Cờ Đỏ', 'Phong Điền', 'Thới Lai'
        ]
    };

    // Payment form handlers
    const handlePaymentFormChange = (e) => {
        const { name, value } = e.target;
        setPaymentFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear district when city changes
        if (name === 'city') {
            setPaymentFormData(prev => ({
                ...prev,
                [name]: value,
                district: '' // Reset district when city changes
            }));
        }
        
        // Clear error when user starts typing
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validatePaymentForm = () => {
        const newErrors = {};

        if (!paymentFormData.fullName.trim()) {
            newErrors.fullName = 'Vui lòng nhập họ tên';
        } else if (paymentFormData.fullName.trim().length < 2) {
            newErrors.fullName = 'Họ tên phải có ít nhất 2 ký tự';
        }

        if (!paymentFormData.email.trim()) {
            newErrors.email = 'Vui lòng nhập email';
        } else if (!/\S+@\S+\.\S+/.test(paymentFormData.email)) {
            newErrors.email = 'Email không hợp lệ';
        }

        if (!paymentFormData.phone.trim()) {
            newErrors.phone = 'Vui lòng nhập số điện thoại';
        } else if (!/^(0|\+84)[0-9]{9,10}$/.test(paymentFormData.phone.replace(/\s/g, ''))) {
            newErrors.phone = 'Số điện thoại không hợp lệ (bắt đầu bằng 0 hoặc +84)';
        }

        if (!paymentFormData.address.trim()) {
            newErrors.address = 'Vui lòng nhập địa chỉ';
        } else if (paymentFormData.address.trim().length < 5) {
            newErrors.address = 'Địa chỉ phải có ít nhất 5 ký tự';
        }

        if (!paymentFormData.city.trim()) {
            newErrors.city = 'Vui lòng chọn thành phố';
        }

        if (!paymentFormData.district.trim()) {
            newErrors.district = 'Vui lòng chọn quận/huyện';
        }

        setFormErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Generate QR Code for payment
    // Generate QR code when moving to step 3
    useEffect(() => {
        if (paymentStep === 3 && selectedPaymentMethod !== 'cod') {
            setQrCodeUrl(selectedPaymentMethod === 'momo' ? '/images/momo-qr.png' : '/images/banking-qr.png');
        }
        if (paymentStep !== 3 || selectedPaymentMethod === 'cod') {
            setQrCodeUrl('');
        }
    }, [paymentStep, selectedPaymentMethod]);

    const handlePaymentSubmit = (e) => {
        e.preventDefault();
        
        if (selectedItems.length === 0) {
            alert('Vui lòng chọn ít nhất một sản phẩm để thanh toán');
            return;
        }

        if (paymentStep === 1) {
            // Validate info form
            if (!validatePaymentForm()) {
                return;
            }
            // Move to payment method step
            setPaymentStep(2);
        } else if (paymentStep === 2) {
            // Check payment method and move accordingly
            if (selectedPaymentMethod === 'cod') {
                // Directly submit for COD - create order immediately
                submitOrder();
            } else {
                // Show QR code for MoMo and Banking
                setPaymentStep(3);
            }
        } else {
            // Final submission from QR step
            submitOrder();
        }
    };

    const submitOrder = async () => {
        setIsSubmitting(true);
        
        try {
            // Check if user is logged in
            if (!user) {
                alert('Vui lòng đăng nhập để đặt hàng');
                setIsSubmitting(false);
                return;
            }

            // Get selected items
            const selectedItemsList = items.filter(item => selectedItems.includes(item.id));
            
            if (selectedItemsList.length === 0) {
                alert('Vui lòng chọn ít nhất một sản phẩm');
                setIsSubmitting(false);
                return;
            }

            // Prepare order data
            const orderData = {
                userId: user.id,
                items: selectedItemsList.map(item => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    image: item.image
                })),
                totalAmount: getSelectedItemsTotal(),
                shippingInfo: {
                    fullName: paymentFormData.fullName,
                    email: paymentFormData.email,
                    phone: paymentFormData.phone,
                    address: paymentFormData.address,
                    city: paymentFormData.city,
                    district: paymentFormData.district,
                    zipCode: paymentFormData.zipCode
                },
                paymentMethod: selectedPaymentMethod,
                status: selectedPaymentMethod === 'cod' ? 'pending' : 'awaiting_payment',
                createdAt: new Date().toISOString()
            };

            // Create order
            const newOrder = await createOrder(orderData);
            
            // Clear selected items from cart
            clearSelectedItems();
            
            // Store payment info in session storage
            sessionStorage.setItem('paymentInfo', JSON.stringify({
                ...paymentFormData,
                paymentMethod: selectedPaymentMethod,
                orderId: newOrder.id
            }));
            
            // Show success message
            alert(`Đặt hàng thành công! Mã đơn hàng: ${newOrder.id}`);
            
            // Close modal and navigate to orders
            setTimeout(() => {
                setShowPaymentModal(false);
                setPaymentStep(1); // Reset step for next time
                window.location.href = '/orders';
            }, 1000);
            
        } catch (error) {
            console.error('Error creating order:', error);
            alert(error.message || 'Không thể tạo đơn hàng. Vui lòng thử lại.');
            setIsSubmitting(false);
        }
    };

    const handlePaymentClick = () => {
        if (selectedItems.length === 0) {
            alert('Vui lòng chọn ít nhất một sản phẩm để thanh toán');
            return;
        }
        
        // Check if user is logged in
        if (!user) {
            alert('Vui lòng đăng nhập để đặt hàng');
            window.location.href = '/login';
            return;
        }
        
        setShowPaymentModal(true);
        setPaymentStep(1); // Always start from step 1
    };

    const handleBackToInfo = () => {
        setPaymentStep(1);
    };

    const handleCloseModal = () => {
        setShowPaymentModal(false);
        setPaymentStep(1); // Reset step
    };

    const handleBackToPaymentMethod = () => {
        setPaymentStep(2);
    };

    // CartItem component
    const CartItem = ({ item, onUpdateQuantity, onRemove, readOnly = false }) => {
        const [quantity, setQuantity] = useState(item.quantity);
        const isSelected = selectedItems.includes(item.id);

        const handleQuantityChange = (newQuantity) => {
            if (newQuantity > 0 && newQuantity <= 99) {
                setQuantity(newQuantity);
                onUpdateQuantity(item.id, newQuantity);
            }
        };

        const handleRemove = () => {
            if (readOnly) {
                return;
            }
            if (window.confirm(`Bạn có chắc chắn muốn xóa "${item.name}" khỏi giỏ hàng?`)) {
                onRemove(item.id);
            }
        };

        return (
            <Card className="mb-3">
                <Card.Body>
                    <div className="d-flex align-items-center">
                        <Form.Check
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectItem(item.id)}
                            className="me-3"
                        />
                        <img
                            src={item.image}
                            alt={item.name}
                            style={{
                                width: '80px',
                                height: '80px',
                                objectFit: 'cover',
                                borderRadius: '8px',
                                marginRight: '15px'
                            }}
                        />
                        <div className="flex-grow-1">
                            <h6 className="mb-1">{item.name}</h6>
                            <p className="text-muted mb-2 small">{item.description}</p>
                            <div className="d-flex align-items-center">
                                <span className="text-primary fw-bold me-3">
                                    {formatCurrency(item.price)}
                                </span>
                                <div className="d-flex align-items-center">
                                    <Button
                                        variant="outline-secondary"
                                        size="sm"
                                        onClick={() => handleQuantityChange(quantity - 1)}
                                        disabled={readOnly || quantity <= 1}
                                    >
                                        <Dash size={12} />
                                    </Button>
                                    <span className="mx-3 fw-bold">{quantity}</span>
                                    <Button
                                        variant="outline-secondary"
                                        size="sm"
                                        onClick={() => handleQuantityChange(quantity + 1)}
                                            disabled={readOnly || quantity >= 99}
                                    >
                                        <Plus size={12} />
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="text-end">
                            <div className="fw-bold text-primary mb-2">
                                {formatCurrency(item.price * quantity)}
                            </div>
                            <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={handleRemove}
                                disabled={readOnly}
                            >
                                <Trash2 size={14} />
                            </Button>
                        </div>
                    </div>
                </Card.Body>
            </Card>
        );
    };

    if (items.length === 0) {
        return (
            <Container className="mt-5">
                <div className="text-center">
                    <Cart3 size={64} className="text-muted mb-3" />
                    <h2 className="mb-3">Giỏ hàng của bạn</h2>
                    <div className="text-muted mb-4">
                        <p>Giỏ hàng của bạn đang trống</p>
                        <p>Hãy thêm một số sản phẩm vào giỏ hàng!</p>
                        {!user && (
                            <Alert variant="info" className="mt-3">
                                <strong>Đăng nhập để quản lý giỏ hàng</strong>
                                <br />
                                <small>Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng và thực hiện thanh toán.</small>
                            </Alert>
                        )}
                    </div>
                    <Button variant="primary" href="/shop">
                        Tiếp tục mua sắm
                    </Button>
                </div>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">
                    <Cart3 className="me-2" />
                    Giỏ hàng ({totalItems} sản phẩm)
                </h2>
            </div>
            

            {/* Select All Bar */}
            {items.length > 0 && (
                <Card className="mb-3">
                    <Card.Body className="py-2">
                        <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                                <Form.Check
                                    type="checkbox"
                                    checked={isAllItemsSelected()}
                                    onChange={() => isAllItemsSelected() ? deselectAllItems() : selectAllItems()}
                                    label="Chọn tất cả"
                                    className="me-3"
                                />
                                <span className="text-muted">
                                    Đã chọn {selectedItems.length} sản phẩm
                                </span>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            )}


            <Row>
                {/* Cart Items */}
                <Col lg={8}>
                    {items.map(item => (
                        user ? (
                            // Đã đăng nhập: Hiển thị CartItem đầy đủ
                            <CartItem
                                key={item.id}
                                item={item}
                                onUpdateQuantity={updateQuantity}
                                onRemove={removeFromCart}
                            />
                        ) : (
                            // Chưa đăng nhập: Hiển thị CartItem chỉ xem
                            <CartItem
                                key={item.id}
                                item={item}
                                onUpdateQuantity={() => {}} // Không cho thay đổi quantity
                                onRemove={removeFromCart}
                                readOnly={true}
                            />
                        )
                    ))}
                </Col>

                {/* Order Summary */}
                <Col lg={4}>
                    <Card className="order-summary">
                        <Card.Header className="bg-primary text-white">
                            <h5 className="mb-0">
                                <CreditCard className="me-2" />
                                Tóm tắt đơn hàng
                            </h5>
                        </Card.Header>
                        <Card.Body>
                            <div className="mb-3">
                                <Row className="mb-2">
                                    <Col>
                                        <span className="text-muted">Tổng sản phẩm:</span>
                                    </Col>
                                    <Col className="text-end">
                                        <span>{totalItems}</span>
                                    </Col>
                                </Row>
                            </div>
                            
                            <hr />
                            
                            <Row className="mb-3">
                                <Col>
                                    <span className="text-muted">Tạm tính:</span>
                                </Col>
                                <Col className="text-end">
                                    <span>{formatCurrency(totalPrice)}</span>
                                </Col>
                            </Row>
                            

                            <hr />

                            <Row className="mb-4">
                                <Col>
                                    <h6 className="mb-0">Tổng cộng:</h6>
                                </Col>
                                <Col className="text-end">
                                    <h5 className="mb-0 text-primary">
                                        {formatCurrency(totalPrice)}
                                    </h5>
                                </Col>
                            </Row>

                            <div className="d-grid mb-3">
                                <Button 
                                    variant="primary" 
                                    size="lg"
                                    onClick={handlePaymentClick}
                                    disabled={selectedItems.length === 0}
                                >
                                    {selectedItems.length > 0 
                                        ? `Thanh toán (${getSelectedItemsCount()} sản phẩm)` 
                                        : 'Chọn sản phẩm để thanh toán'
                                    }
                                </Button>
                                <Button variant="outline-secondary" href="/orders">
                                    Xem lịch sử đơn hàng
                                </Button>
                                <Button variant="outline-secondary" href="/shop">
                                    Tiếp tục mua sắm
                                </Button>
                            </div>

                            <div className="mt-3 text-center">
                                <small className="text-muted">
                                    <i className="bi bi-shield-check me-1"></i>
                                    Mua sắm an toàn và bảo mật
                                </small>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Additional Info */}
            <Alert variant="info" className="mt-4">
                <h6 className="alert-heading">
                    <i className="bi bi-info-circle me-2"></i>
                    Thông tin đơn hàng
                </h6>
                <p className="mb-2">
                    • Miễn phí vận chuyển cho đơn hàng từ 500.000 VNĐ
                </p>
                <p className="mb-2">
                    • Đổi trả trong vòng 7 ngày nếu sản phẩm có lỗi
                </p>
                <p className="mb-0">
                    • Bảo hành chính hãng 12 tháng
                </p>
            </Alert>

            {/* Payment Modal */}
            <Modal show={showPaymentModal} onHide={handleCloseModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        <CreditCard className="me-2" />
                        {paymentStep === 1 ? 'Thông tin thanh toán' : 
                         paymentStep === 2 ? 'Phương thức thanh toán' : 
                         'Quét mã QR thanh toán'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {paymentStep === 1 ? (
                        // Step 1: Personal Information
                        <Form onSubmit={handlePaymentSubmit}>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>
                                            <Person className="me-1" />
                                            Họ tên *
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="fullName"
                                            value={paymentFormData.fullName}
                                            onChange={handlePaymentFormChange}
                                            isInvalid={!!formErrors.fullName}
                                            placeholder="Nhập họ tên của bạn"
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {formErrors.fullName}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>
                                            <Envelope className="me-1" />
                                            Email *
                                        </Form.Label>
                                        <Form.Control
                                            type="email"
                                            name="email"
                                            value={paymentFormData.email}
                                            onChange={handlePaymentFormChange}
                                            isInvalid={!!formErrors.email}
                                            placeholder="email@example.com"
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {formErrors.email}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Form.Group className="mb-3">
                                <Form.Label>
                                    <Telephone className="me-1" />
                                    Số điện thoại *
                                </Form.Label>
                                <Form.Control
                                    type="tel"
                                    name="phone"
                                    value={paymentFormData.phone}
                                    onChange={handlePaymentFormChange}
                                    isInvalid={!!formErrors.phone}
                                    placeholder="09xxxxxxxx hoặc +849xxxxxxxx"
                                />
                                <Form.Control.Feedback type="invalid">
                                    {formErrors.phone}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>
                                    <House className="me-1" />
                                    Địa chỉ giao hàng *
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    name="address"
                                    value={paymentFormData.address}
                                    onChange={handlePaymentFormChange}
                                    isInvalid={!!formErrors.address}
                                    placeholder="Số nhà, tên đường..."
                                />
                                <Form.Control.Feedback type="invalid">
                                    {formErrors.address}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Row>
                                <Col md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Tỉnh/Thành phố *</Form.Label>
                                        <Form.Select
                                            name="city"
                                            value={paymentFormData.city}
                                            onChange={handlePaymentFormChange}
                                            isInvalid={!!formErrors.city}
                                        >
                                            <option value="">Chọn tỉnh/thành phố</option>
                                            <option value="Hà Nội">Hà Nội</option>
                                            <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                                            <option value="Đà Nẵng">Đà Nẵng</option>
                                            <option value="Hải Phòng">Hải Phòng</option>
                                            <option value="Cần Thơ">Cần Thơ</option>
                                        </Form.Select>
                                        <Form.Control.Feedback type="invalid">
                                            {formErrors.city}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Quận/Huyện *</Form.Label>
                                        <Form.Select
                                            name="district"
                                            value={paymentFormData.district}
                                            onChange={handlePaymentFormChange}
                                            isInvalid={!!formErrors.district}
                                            disabled={!paymentFormData.city}
                                        >
                                            <option value={paymentFormData.city ? 'Chọn quận/huyện' : 'Chọn tỉnh/thành phố trước'}>
                                            </option>
                                            {districtsData[paymentFormData.city]?.map(district => (
                                                <option key={district} value={district}>
                                                    {district}
                                                </option>
                                            ))}
                                        </Form.Select>
                                        <Form.Control.Feedback type="invalid">
                                            {formErrors.district}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Mã bưu điện</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="zipCode"
                                            value={paymentFormData.zipCode}
                                            onChange={handlePaymentFormChange}
                                            isInvalid={!!formErrors.zipCode}
                                            placeholder="Không bắt buộc"
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {formErrors.zipCode}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Alert variant="info">
                                <small>
                                    <strong>Lưu ý:</strong> Thông tin của bạn sẽ được bảo mật và chỉ sử dụng cho việc giao hàng.
                                </small>
                            </Alert>
                        </Form>
                    ) : paymentStep === 2 ? (
                        // Step 2: Payment Method
                        <div>
                            <h5 className="mb-4">Chọn phương thức thanh toán</h5>
                            
                            <div className="mb-4">
                                <div className="payment-option p-3 border rounded mb-3">
                                    <Form.Check
                                        type="radio"
                                        name="paymentMethod"
                                        value="cod"
                                        checked={selectedPaymentMethod === 'cod'}
                                        onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                                        label={
                                            <div className="d-flex align-items-center">
                                                <Cash className="me-3 text-success" size={24} />
                                                <div>
                                                    <h6 className="mb-1">Thanh toán khi nhận hàng (COD)</h6>
                                                    <small className="text-muted">Thanh toán bằng tiền mặt khi nhận được hàng</small>
                                                </div>
                                            </div>
                                        }
                                    />
                                </div>

                                <div className="payment-option p-3 border rounded mb-3">
                                    <Form.Check
                                        type="radio"
                                        name="paymentMethod"
                                        value="momo"
                                        checked={selectedPaymentMethod === 'momo'}
                                        onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                                        label={
                                            <div className="d-flex align-items-center">
                                                <Phone className="me-3 text-primary" size={24} />
                                                <div>
                                                    <h6 className="mb-1">Chuyển khoản qua MoMo</h6>
                                                    <small className="text-muted">Quét mã QR hoặc chuyển khoản qua ứng dụng MoMo</small>
                                                </div>
                                            </div>
                                        }
                                    />
                                </div>

                                <div className="payment-option p-3 border rounded mb-3">
                                    <Form.Check
                                        type="radio"
                                        name="paymentMethod"
                                        value="banking"
                                        checked={selectedPaymentMethod === 'banking'}
                                        onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                                        label={
                                            <div className="d-flex align-items-center">
                                                <CreditCard className="me-3 text-info" size={24} />
                                                <div>
                                                    <h6 className="mb-1">Chuyển khoản ngân hàng</h6>
                                                    <small className="text-muted">Chuyển khoản qua internet banking hoặc quầy ngân hàng</small>
                                                </div>
                                            </div>
                                        }
                                    />
                                </div>
                            </div>

                            {/* Order Summary */}
                            <Card className="bg-light">
                                <Card.Body>
                                    <h6 className="mb-3">Tóm tắt đơn hàng</h6>
                                    <div className="d-flex justify-content-between mb-2">
                                        <span>Số lượng sản phẩm:</span>
                                        <span className="fw-bold">{getSelectedItemsCount()}</span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-2">
                                        <span>Tạm tính:</span>
                                        <span className="fw-bold">{formatCurrency(getSelectedItemsTotal())}</span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-2">
                                        <span>Phí vận chuyển:</span>
                                        <span className="text-success">Miễn phí</span>
                                    </div>
                                    <hr />
                                    <div className="d-flex justify-content-between">
                                        <h6 className="mb-0">Tổng cộng:</h6>
                                        <h5 className="mb-0 text-primary">{formatCurrency(getSelectedItemsTotal())}</h5>
                                    </div>
                                </Card.Body>
                            </Card>
                        </div>
                    ) : (
                        // Step 3: QR Code Display
                        <div className="text-center">
                            <h5 className="mb-4">
                                <QrCode className="me-2" />
                                Quét mã QR để thanh toán
                            </h5>
                            
                            <div className="mb-4">
                                {qrCodeUrl ? (
                                    <div className="qr-code-container d-inline-block p-4 border-2 border-dark rounded">
                                        <img 
                                            src={qrCodeUrl} 
                                            alt="Payment QR Code" 
                                            style={{ 
                                                width: '256px', 
                                                height: '256px',
                                                display: 'block'
                                            }} 
                                        />
                                    </div>
                                ) : (
                                    <div className="qr-code-container d-inline-block p-4 border-2 border-dark rounded">
                                        <div className="qr-placeholder" style={{ 
                                            width: '256px', 
                                            height: '256px', 
                                            background: 'linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc), linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc)',
                                            backgroundSize: '20px 20px',
                                            backgroundPosition: '0 0, 10px 10px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexDirection: 'column'
                                        }}>
                                            <QrCode size={64} className="text-muted mb-2" />
                                            <small className="text-muted">QR Code</small>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <Alert variant="info">
                                <h6 className="alert-heading">
                                    {selectedPaymentMethod === 'momo' ? 'Hướng dẫn thanh toán MoMo:' : 'Hướng dẫn chuyển khoản:'}
                                </h6>
                                <ol className="mb-0 small text-start">
                                    <li>Quét mã QR bằng ứng dụng {selectedPaymentMethod === 'momo' ? 'MoMo' : 'ngân hàng'}</li>
                                    <li>Kiểm tra lại thông tin đơn hàng</li>
                                    <li>Nhập chính xác số tiền: <strong>{formatCurrency(getSelectedItemsTotal())}</strong></li>
                                    <li>Xác nhận thanh toán</li>
                                </ol>
                            </Alert>

                            {/* Order Summary */}
                            <Card className="bg-light mt-3">
                                <Card.Body>
                                    <h6 className="mb-3">Thông tin thanh toán</h6>
                                    <div className="d-flex justify-content-between mb-2">
                                        <span>Phương thức:</span>
                                        <span className="fw-bold">
                                            {selectedPaymentMethod === 'momo' ? 'Ví MoMo' : 'Chuyển khoản ngân hàng'}
                                        </span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-2">
                                        <span>Số tiền:</span>
                                        <span className="fw-bold text-primary">{formatCurrency(getSelectedItemsTotal())}</span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-2">
                                        <span>Nội dung:</span>
                                        <span className="fw-bold">THANHTOAN_{Date.now()}</span>
                                    </div>
                                    {selectedPaymentMethod === 'momo' && (
                                        <div className="mt-3 p-2 bg-warning bg-opacity-10 rounded">
                                            <small className="text-muted">
                                                <strong>Số điện thoại MoMo:</strong> 0338815265<br />
                                                <strong>Tên tài khoản:</strong> LAPTOP STORE
                                            </small>
                                        </div>
                                    )}
                                    {selectedPaymentMethod === 'banking' && (
                                        <div className="mt-3 p-2 bg-info bg-opacity-10 rounded">
                                            <small className="text-muted">
                                                <strong>Ngân hàng:</strong> Vietcombank<br />
                                                <strong>Số tài khoản:</strong> 1234567890<br />
                                                <strong>Chủ tài khoản:</strong> LAPTOP STORE
                                            </small>
                                        </div>
                                    )}
                                </Card.Body>
                            </Card>

                            <Alert variant="warning" className="mt-3">
                                <small>
                                    <strong>Lưu ý:</strong> Sau khi thanh toán thành công, vui lòng nhấn "Xác nhận đã thanh toán" để hoàn tất đơn hàng.
                                </small>
                            </Alert>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    {paymentStep === 3 && (
                        <Button variant="secondary" onClick={handleBackToPaymentMethod}>
                            <ArrowLeft className="me-2" />
                            Quay lại
                        </Button>
                    )}
                    {paymentStep === 2 && (
                        <Button variant="secondary" onClick={handleBackToInfo}>
                            <ArrowLeft className="me-2" />
                            Quay lại
                        </Button>
                    )}
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Hủy
                    </Button>
                    <Button 
                        variant="primary" 
                        type="submit" 
                        onClick={handlePaymentSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <Spinner as="span" animation="border" size="sm" className="me-2" />
                                Đang xử lý...
                            </>
                        ) : paymentStep === 1 ? (
                            <>
                                Tiếp tục thanh toán
                                <ArrowLeft className="ms-2" style={{ transform: 'rotate(180deg)' }} />
                            </>
                        ) : paymentStep === 2 ? (
                            <>
                                {selectedPaymentMethod === 'cod' ? (
                                    <>
                                        <CreditCard className="me-2" />
                                        Xác nhận đặt hàng
                                    </>
                                ) : (
                                    <>
                                        <QrCode className="me-2" />
                                        Hiển thị mã QR
                                    </>
                                )}
                            </>
                        ) : (
                            <>
                                <CreditCard className="me-2" />
                                Xác nhận đã thanh toán
                            </>
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}
