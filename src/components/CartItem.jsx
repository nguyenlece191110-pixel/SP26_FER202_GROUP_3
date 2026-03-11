import React from 'react';
import { Card, Row, Col, Form, Button } from 'react-bootstrap';
import { Plus, Dash } from 'react-bootstrap-icons';
import { useCart } from '../contexts/CartContext';

const CartItem = ({ item, onUpdateQuantity }) => {
    const { isItemSelected, toggleSelectItem } = useCart();

    const handleQuantityChange = (newQuantity) => {
        // Nếu quantity = 0 thì xóa sản phẩm
        if (newQuantity === 0) {
            onUpdateQuantity(item.id, 0);
        } else if (newQuantity >= 0 && newQuantity <= 99) {
            onUpdateQuantity(item.id, newQuantity);
        }
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
                                maxHeight: '80px', 
                                objectFit: 'cover',
                                width: '100%'
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
                            onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 0)}
                            min="0"
                            max="99"
                            className="text-center quantity-input"
                            style={{ width: '60px' }}
                        />
                    </Col>

                    {/* Item Total */}
                    <Col xs={12} md={2} className="mb-3 mb-md-0 d-flex align-items-center justify-content-end">
                        <p className="mb-0 fw-bold" style={{ color: '#dc3545', fontSize: '1.1rem' }}>
                            {formatMoney(itemTotal)}
                        </p>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
};

export default CartItem;
