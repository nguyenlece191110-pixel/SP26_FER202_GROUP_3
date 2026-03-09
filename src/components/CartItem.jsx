import React from 'react';
import { Card, Button, Row, Col, Form } from 'react-bootstrap';
import { Trash3, Plus, Dash } from 'react-bootstrap-icons';
import { useCart } from '../contexts/CartContext';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
    const { isItemSelected, toggleSelectItem } = useCart();

    const handleQuantityChange = (newQuantity) => {
        if (newQuantity >= 1 && newQuantity <= 99) {
            onUpdateQuantity(item.id, newQuantity);
        }
    };

    const handleIncrement = () => {
        handleQuantityChange(item.quantity + 1);
    };

    const handleDecrement = () => {
        handleQuantityChange(item.quantity - 1);
    };

    const handleRemove = () => {
        onRemove(item.id);
    };

    const itemTotal = item.price * item.quantity;

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
                    <Col xs={11} md={2} className="mb-3 mb-md-0">
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
                        <p className="text-muted mb-0 small">
                            {new Intl.NumberFormat('vi-VN', {
                                style: 'currency',
                                currency: 'VND'
                            }).format(item.price)}
                        </p>
                    </Col>

                    {/* Quantity Control */}
                    <Col xs={12} md={3} className="mb-3 mb-md-0">
                        <div className="d-flex align-items-center">
                            <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={handleDecrement}
                                disabled={item.quantity <= 1}
                                className="quantity-btn"
                            >
                                <Dash size={12} />
                            </Button>
                            
                            <Form.Control
                                type="number"
                                value={item.quantity}
                                onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                                min="1"
                                max="99"
                                className="mx-2 text-center quantity-input"
                                style={{ width: '60px' }}
                            />
                            
                            <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={handleIncrement}
                                disabled={item.quantity >= 99}
                                className="quantity-btn"
                            >
                                <Plus size={12} />
                            </Button>
                        </div>
                    </Col>

                    {/* Item Total */}
                    <Col xs={6} md={2} className="mb-3 mb-md-0">
                        <div className="text-end">
                            <p className="mb-0 fw-bold">
                                {new Intl.NumberFormat('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND'
                                }).format(itemTotal)}
                            </p>
                        </div>
                    </Col>

                    {/* Remove Button */}
                    <Col xs={6} md={1}>
                        <div className="text-end">
                            <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={handleRemove}
                                className="remove-btn"
                                title="Xóa khỏi giỏ hàng"
                            >
                                <Trash3 size={16} />
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Card.Body>
            
            <style jsx>{`
                .cart-item {
                    transition: box-shadow 0.2s ease-in-out;
                }
                
                .cart-item:hover {
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                }
                
                .quantity-btn {
                    border-radius: 4px;
                    padding: 0.25rem 0.5rem;
                }
                
                .quantity-input {
                    border-radius: 4px;
                }
                
                .remove-btn:hover {
                    transform: scale(1.1);
                    transition: transform 0.2s ease-in-out;
                }
                
                @media (max-width: 768px) {
                    .cart-item .row {
                        text-align: center;
                    }
                    
                    .cart-item .text-end {
                        text-align: center !important;
                    }
                }
            `}</style>
        </Card>
    );
};

export default CartItem;
