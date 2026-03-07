import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function HeroBanner() {
    return (
        <div className="bg-primary text-white p-5 rounded-3 mb-4 text-center">
            <Container>
                <Row>
                    <Col>
                        <h1 className="display-4 fw-bold">Chào mừng đến với TechHub</h1>
                        <p className="lead">Nơi cung cấp Điện thoại và Laptop chính hãng với giá tốt nhất.</p>
                        <Button as={Link} to="/shop" variant="light" size="lg" className="mt-3">
                            Mua sắm ngay
                        </Button>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}