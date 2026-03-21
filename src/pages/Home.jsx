import React, { useState, useEffect, useContext } from 'react';
import HeroBanner from '../components/HeroBanner';
import { Container, Row, Col, Button, Spinner, Card, Nav, Tab } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom'; // Thêm useNavigate
import { ThemeContext } from '../contexts/ThemeContext'; 
import axios from 'axios';
import './Home.css';

// Component Chính sách dịch vụ (Sử dụng đuôi .jpg như bạn yêu cầu)
const ServicePolicy = () => (
    <div className="service-policy-section py-5">
        <Container>
            <Row className="text-center g-4">
                {[
                    { img: 'a1.jpg', title: 'Thương hiệu đảm bảo', desc: 'Nhập khẩu, bảo hành chính hãng' },
                    { img: 'a2.jpg', title: 'Đổi trả dễ dàng', desc: 'Theo chính sách đổi trả tại cửa hàng' },
                    { img: 'a3.jpg', title: 'Giao hàng tận nơi', desc: 'Chính sách giao hàng toàn quốc' },
                    { img: 'a4.jpg', title: 'Sản phẩm chất lượng', desc: 'Đảm bảo tương thích và độ bền cao' }
                ].map((item, index) => (
                    <Col key={index} xs={6} md={3}>
                        <div className="policy-item">
                            <div className="policy-icon-wrapper shadow-sm">
                                <img src={`/images/${item.img}`} alt={item.title} className="policy-icon" />
                            </div>
                            <h6 className="fw-bold mt-3 mb-1">{item.title}</h6>
                            <p className="text-muted small">{item.desc}</p>
                        </div>
                    </Col>
                ))}
            </Row>
        </Container>
    </div>
);

export default function Home() {
    const { theme } = useContext(ThemeContext);
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('laptop'); 

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

    const getFeaturedProducts = (category) => products.filter(p => p.category === category).slice(0, 4);

    const getImageUrl = (item) => {
        const img = (item.images && item.images.length > 0) ? item.images[0] : (item.image || '/images/default.png');
        return img.startsWith('/') ? img : `/${img}`;
    };

    return (
        <div className={`home-page ${theme}`}>
            <HeroBanner />

            {/* Khu vực Deal Online */}
            <Container className="deal-section">
                <div className="deal-wrapper-bg shadow-sm">
                    <div className="deal-title-wrapper">
                        <div className="deal-main-title">DEAL ONLINE GIẢM KỊCH SÀN</div>
                    </div>

                    <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
                        <Nav variant="tabs" className="justify-content-center custom-deal-tabs border-0">
                            <Nav.Item><Nav.Link eventKey="laptop" className="fw-bold">LAPTOP</Nav.Link></Nav.Item>
                            <Nav.Item><Nav.Link eventKey="phone" className="fw-bold">ĐIỆN THOẠI</Nav.Link></Nav.Item>
                            <Nav.Item><Nav.Link eventKey="accessories" className="fw-bold">KHÁC</Nav.Link></Nav.Item>
                        </Nav>

                        <div className="deal-content-padding">
                            {loading ? (
                                <div className="text-center py-5"><Spinner animation="border" variant="danger" /></div>
                            ) : (
                                <>
                                    <Tab.Content>
                                        <Tab.Pane eventKey={activeTab}>
                                            <Row className="g-3">
                                                {getFeaturedProducts(activeTab).map(item => {
                                                    const hasDiscount = item.oldPrice && item.oldPrice > item.price;
                                                    const discountPercent = hasDiscount ? Math.round(((item.oldPrice - item.price) / item.oldPrice) * 100) : 0;
                                                    return (
                                                        <Col key={item.id} xs={12} sm={6} md={3}>
                                                            <Card className="h-100 border-0 shadow-sm product-deal-card">
                                                                <div className="position-relative p-3 text-center">
                                                                    <span className="badge-discount">-{discountPercent}%</span>
                                                                    <Card.Img variant="top" src={getImageUrl(item)} style={{ height: '160px', objectFit: 'contain' }} />
                                                                </div>
                                                                <Card.Body className="text-center pt-0 px-3 pb-3">
                                                                    <Card.Title className="fs-6 fw-bold text-truncate">{item.name}</Card.Title>
                                                                    <div className="price-now text-danger fw-bold fs-5">{item.price?.toLocaleString('vi-VN')}đ</div>
                                                                    <Button as={Link} to={`/product/${item.id}`} variant="danger" className="w-100 rounded-pill mt-3 fw-bold btn-buy">
                                                                        MUA NGAY
                                                                    </Button>
                                                                </Card.Body>
                                                            </Card>
                                                        </Col>
                                                    );
                                                })}
                                            </Row>
                                        </Tab.Pane>
                                    </Tab.Content>

                                    {/* Nút Xem tất cả để nhảy sang trang Shop */}
                                    <div className="text-center mt-4">
                                        <Button 
                                            variant="outline-danger" 
                                            className="px-5 rounded-pill fw-bold btn-view-all"
                                            onClick={() => navigate('/shop')}
                                        >
                                            Xem tất cả sản phẩm
                                        </Button>
                                    </div>
                                </>
                            )}
                        </div>
                    </Tab.Container>
                </div>
            </Container>

            <ServicePolicy />
        </div>
    );
}