import React, { useState, useEffect } from 'react';
import HeroBanner from '../components/HeroBanner';
// Thêm InputGroup và Form từ bootstrap
import { Container, Row, Col, Button, Spinner, Card, Form, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Search } from 'react-bootstrap-icons'; // Cài nếu chưa có: npm install react-bootstrap-icons
import axios from 'axios';
import './Home.css';

export default function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState(''); // Lưu từ khóa tìm kiếm
    const [visibleCount, setVisibleCount] = useState(12);

    useEffect(() => {
        axios.get('http://localhost:5000/products')
            .then(res => {
                setProducts(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Lỗi:", err);
                setLoading(false);
            });
    }, []);

    const handleLoadMore = () => setVisibleCount(prev => prev + 8);

    // Logic lọc sản phẩm theo tên
    const filteredProducts = products.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getImageUrl = (item) => {
        const img = (item.images && item.images.length > 0) ? item.images[0] : (item.image || '/images/default.png');
        return img.startsWith('/') ? img : `/${img}`;
    };

    return (
        <div className="home-page">
            <HeroBanner />

            <Container className="mt-4">
                {/* THANH TÌM KIẾM */}
                <Row className="justify-content-center mb-5">
                    <Col md={8} lg={6}>
                        <InputGroup className="search-bar-container shadow-sm">
                            <InputGroup.Text className="bg-white border-end-0">
                                <Search text="primary" />
                            </InputGroup.Text>
                            <Form.Control
                                placeholder="Bạn cần tìm gì..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="border-start-0 search-input"
                            />
                            {searchTerm && (
                                <Button
                                    variant="outline-secondary"
                                    className="border-start-0 border-end-0 bg-white text-muted"
                                    onClick={() => setSearchTerm('')}
                                >
                                    ✕
                                </Button>
                            )}
                        </InputGroup>
                    </Col>
                </Row>

                <h2 className="home-title text-center">
                    {searchTerm ? `Kết quả cho: "${searchTerm}"` : "Sản phẩm nổi bật"}
                </h2>

                {loading ? (
                    <div className="text-center my-5">
                        <Spinner animation="border" variant="primary" />
                    </div>
                ) : (
                    <>
                        <Row className="g-4">
                            {/* Chuyển sang map trên filteredProducts thay vì products */}
                            {filteredProducts.length > 0 ? (
                                filteredProducts.slice(0, visibleCount).map(item => (
                                    <Col key={item.id} xs={12} sm={6} md={4} lg={3}>
                                        <Card className="home-product-card h-100 shadow-sm border-0">
                                            <div className="img-container p-3 text-center">
                                                <Card.Img
                                                    variant="top"
                                                    src={getImageUrl(item)}
                                                    style={{ height: '180px', objectFit: 'contain' }}
                                                />
                                            </div>
                                            <Card.Body className="d-flex flex-column">
                                                <Card.Title className="fw-bold mb-2 h6 text-truncate text-center">
                                                    {item.name}
                                                </Card.Title>
                                                <Card.Text className="text-danger fw-bold fs-5 mt-auto text-center">
                                                    {item.price?.toLocaleString('vi-VN')} VND
                                                </Card.Text>
                                                <Button
                                                    as={Link}
                                                    to={`/product/${item.id}`}
                                                    variant="outline-primary"
                                                    className="mt-3 w-100 fw-bold btn-detail"
                                                >
                                                    Xem chi tiết
                                                </Button>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))
                            ) : (
                                <Col className="text-center py-5">
                                    <p className="text-muted fs-5">Rất tiếc, TechHub không tìm thấy sản phẩm này... 😅</p>
                                </Col>
                            )}
                        </Row>

                        {visibleCount < filteredProducts.length && (
                            <div className="load-more-container">
                                <Button variant="primary" className="btn-load-more" onClick={handleLoadMore}>
                                    Xem thêm sản phẩm
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </Container>
        </div>
    );
}