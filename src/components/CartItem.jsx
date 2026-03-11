import React from 'react';
import { Card, Row, Col, Form } from 'react-bootstrap';
import { useCart } from '../contexts/CartContext';

const CartItem = ({ item, onUpdateQuantity, readOnly = false }) => {
    const { isItemSelected, toggleSelectItem } = useCart();

    const handleQuantityChange = (newQuantity) => {
        // Nếu quantity = 0 thì xóa sản phẩm
        if (newQuantity === 0) {
            onUpdateQuantity(item.id, 0);
        } else if (newQuantity >= 0 && newQuantity <= 99) {
            onUpdateQuantity(item.id, newQuantity);
        }
    };

    const renderPrice = (product) => {
        // Sử dụng data từ cart đã được truyền từ ProductDetail
        const originalPrice = product.originalPrice || product.price;
        const discountPrice = product.discountPrice || product.price;
        const discount = product.discount || 0;

        // Nếu có giảm giá
        if (discount > 0 && discountPrice !== originalPrice) {
            const percent = Math.round(((originalPrice - discountPrice) / originalPrice) * 100);
            
            return (
                <div className="d-flex align-items-baseline">
                    <span style={{color: '#333', marginRight: '8px'}}>
                        {new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND'
                        }).format(originalPrice)}
                    </span>
                    <span style={{color: '#dc3545', fontWeight: 'bold', marginRight: '8px'}}>
                        →
                    </span>
                    <span style={{color: '#dc3545', fontWeight: 'bold', marginRight: '8px'}}>
                        {new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND'
                        }).format(discountPrice)}
                    </span>
                    <span style={{color: 'white', background: '#dc3545', padding: '2px 6px', borderRadius: '4px', fontSize: '0.8em'}}>
                        -{percent}%
                    </span>
                </div>
            );
        }

        // Nếu không có giảm giá
        return (
            <span className="fw-bold">
                {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                }).format(discountPrice)}
            </span>
        );
    };

    // Giá giảm (ưu tiên discountPrice, nếu không có thì dùng price)
    const finalPrice = item.discountPrice || item.price;
    const itemTotal = finalPrice * item.quantity;

    // Hàm format tiền VND
    const formatMoney = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    return (
        <Card className="mb-3 cart-item">
            <Card.Body>
                <Row className="align-items-center">
                    {/* Checkbox */}
                    <Col xs={1} className="text-center">
                        <Form.Check
                            type="checkbox"
                            checked={isItemSelected(item.id)}
                            onChange={() => toggleSelectItem(item.id)}
                            className="form-check-lg"
                        />
                    </Col>

                    {/* Product Image */}
                    <Col xs={11} md={3} className="mb-3 mb-md-0">
                        <img
                            src={item.image}
                            alt={item.name}
                            className="img-fluid rounded"
                            style={{ 
                                maxHeight: '120px', 
                                objectFit: 'contain',
                                width: '100%',
                                backgroundColor: '#f8f9fa',
                                padding: '10px'
                            }}
                        />
                    </Col>

                    {/* Product Info */}
                    <Col xs={12} md={4} className="mb-3 mb-md-0">
                        <h6 className="mb-1 fw-bold">{item.name}</h6>
                    </Col>

                    {/* Quantity Control */}
                    <Col xs={12} md={2} className="mb-3 mb-md-0">
                        <Form.Control
                            type="number"
                            value={item.quantity}
                            onChange={(e) => !readOnly && handleQuantityChange(parseInt(e.target.value) || 0)}
                            min="0"
                            max="99"
                            className="text-center"
                            style={{ width: '100px' }}
                            disabled={readOnly} // Vô hiệu hóa khi chưa đăng nhập
                        />
                    </Col>

                    {/* Item Total */}
                    <Col xs={12} md={2} className="mb-3 mb-md-0">
                        <div className="text-end">
                            <p className="mb-0 fw-bold">
                                {new Intl.NumberFormat('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND'
                                }).format(itemTotal)}
                            </p>
                        </div>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
};

export default CartItem;
