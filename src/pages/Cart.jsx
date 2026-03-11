import React from 'react';
import { Container, Row, Col, Button, Alert, Card, Form } from 'react-bootstrap';
import { useCart } from '../contexts/CartContext';
import CartItem from '../components/CartItem';
import { Cart3, CreditCard } from 'react-bootstrap-icons';

export default function Cart() {
    const { 
        items, 
        totalItems, 
        totalPrice, 
        updateQuantity, 
        removeFromCart,
        selectedItems,
        getSelectedItemsTotal,
        getSelectedItemsCount,
        isAllItemsSelected,
        selectAllItems,
        deselectAllItems
    } = useCart();

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
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
                        <CartItem
                            key={item.id}
                            item={item}
                            onUpdateQuantity={updateQuantity}
                        />
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
                                    href="/checkout"
                                    disabled={items.length === 0}
                                >
                                    Thanh toán ({totalItems} sản phẩm)
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

        </Container>
    );
}
