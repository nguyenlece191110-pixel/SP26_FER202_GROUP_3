import React, { useState, useEffect } from 'react';
import HeroBanner from '../components/HeroBanner';
import { Container, Row, Col, Button, Spinner } from 'react-bootstrap';
import ProductCard from '../components/ProductCard';
import axios from 'axios';
import './Home.css';

export default function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [visibleCount, setVisibleCount] = useState(12);

    useEffect(() => {
        axios.get('http://localhost:5000/products')
            .then(res => {
                setProducts(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const handleLoadMore = () => setVisibleCount(prev => prev + 8);

    return (
        <>
            <HeroBanner />
            <Container className="mt-5 mb-5">
                <h2 className="home-title">Sản phẩm nổi bật</h2>

                {loading ? (
                    <div className="text-center my-5">
                        <Spinner animation="border" variant="primary" />
                        <p className="loading-text">Đang tìm sản phẩm tốt nhất cho bạn...</p>
                    </div>
                ) : (
                    <>
                        <Row className="g-4">
                            {products.slice(0, visibleCount).map(item => (
                                <Col key={item.id} xs={12} sm={6} md={4} lg={3}>
                                    <ProductCard item={item} />
                                </Col>
                            ))}
                        </Row>

                        {visibleCount < products.length && (
                            <div className="load-more-container">
                                <Button
                                    variant="outline-primary"
                                    className="btn-load-more shadow-sm"
                                    onClick={handleLoadMore}
                                >
                                    Xem thêm sản phẩm
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </Container>
        </>
    );
}