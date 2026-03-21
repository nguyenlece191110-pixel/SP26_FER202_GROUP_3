import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Alert, Form, Badge, Tabs, Tab } from 'react-bootstrap';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../AuthContext';
import { API_ENDPOINTS } from '../config/api';
import { Cart3, ArrowLeft, Truck, Shield, CreditCard, Plus, Dash } from 'react-bootstrap-icons';
import './ProductDetail.css';

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate(); // Khai báo navigate
    const location = useLocation();
    const { addToCart } = useCart();
    const { user } = useAuth(); // Lấy thông tin user
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [activeTab, setActiveTab] = useState('description');
    const [showDiscountAlert, setShowDiscountAlert] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(API_ENDPOINTS.PRODUCT(id));
                if (!response.ok) {
                    throw new Error('Failed to fetch product');
                }
                const data = await response.json();
                setProduct(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching product:', error);
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        if (product && product.inStock) {
            // Kiểm tra user đã đăng nhập chưa
            if (!user) {
                // Nếu chưa đăng nhập, chuyển đến trang đăng nhập
                navigate('/login');
                return;
            }

            // Lấy giá giảm từ db.json nếu có, nếu không thì tính
            const discountPrice = product.discountPrice || (product.discount ? product.price * (1 - product.discount / 100) : product.price);

            addToCart({
                id: product.id,
                name: product.name,
                price: product.price, // Giá gốc
                originalPrice: product.price, // Giá gốc
                discountPrice: discountPrice, // Giá giảm
                discount: product.discount || 0, // % giảm giá
                image: product.images[0],
                quantity: quantity
            });

            // Hiển thị thông báo giảm giá
            if (product.discount && product.discount > 0) {
                setShowDiscountAlert(true);
                setTimeout(() => setShowDiscountAlert(false), 3000);
            }
        }
    };

    const handleQuantityChange = (newQuantity) => {
        if (newQuantity >= 1 && newQuantity <= 99) {
            setQuantity(newQuantity);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const handleBackToProducts = () => {
        navigate(location.state?.from || '/shop');
    };

    if (loading) {
        return (
            <Container className="mt-5">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Đang tải...</span>
                    </div>
                    <p className="mt-3">Đang tải thông tin sản phẩm...</p>
                </div>
            </Container>
        );
    }

    if (!product) {
        return (
            <Container className="mt-5">
                <Alert variant="danger">
                    <h4>Không tìm thấy sản phẩm</h4>
                    <p>Sản phẩm bạn tìm kiếm không tồn tại hoặc đã bị xóa.</p>
                    <Button variant="primary" onClick={handleBackToProducts}>
                        Quay lại cửa hàng
                    </Button>
                </Alert>
            </Container>
        );
    }

    const discountedPrice = product.discount ? product.price * (1 - product.discount / 100) : product.price;

    return (
        <Container className="mt-4 mb-5">
            {/* Breadcrumb */}
            <nav aria-label="breadcrumb" className="mb-4">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                        <Link to="/">Trang chủ</Link>
                    </li>
                    <li className="breadcrumb-item">
                        <Link to="/shop">Cửa hàng</Link>
                    </li>
                    <li className="breadcrumb-item active">{product.name}</li>
                </ol>
            </nav>

            {/* Discount Alert */}
            {showDiscountAlert && (
                <Alert variant="success" className="mb-4">
                    <strong>Chúc mừng! Bạn đã được giảm giá {product.discount}% cho sản phẩm này.</strong>
                    <br />
                    <small>Giá gốc: {formatCurrency(product.price)} → Giá giảm: {formatCurrency(discountedPrice)}</small>
                </Alert>
            )}

            {/* Back Button */}
            <Button variant="outline-secondary" onClick={handleBackToProducts} className="mb-4">
                <ArrowLeft className="me-2" />
                Quay lại sản phẩm
            </Button>

            <Row>
                {/* Product Images */}
                <Col lg={6} className="mb-4">
                    <div className="product-images">
                        {/* Main Image */}
                        <div className="main-image-container mb-3">
                            <img
                                src={product.images[selectedImage]}
                                alt={product.name}
                                className="img-fluid rounded"
                                style={{
                                    width: '100%',
                                    height: '400px',
                                    objectFit: 'contain',
                                    backgroundColor: '#f8f9fa'
                                }}
                            />
                            {product.discount && (
                                <Badge
                                    bg="danger"
                                    className="position-absolute top-0 start-0 m-3"
                                    style={{ fontSize: '1.2em' }}
                                >
                                    -{product.discount}%
                                </Badge>
                            )}
                        </div>

                        {/* Thumbnail Images */}
                        {product.images.length > 1 && (
                            <div className="thumbnail-container d-flex gap-2">
                                {product.images.map((image, index) => (
                                    <img
                                        key={index}
                                        src={image}
                                        alt={`${product.name} ${index + 1}`}
                                        className={`thumbnail rounded ${selectedImage === index ? 'border-primary border-2' : 'border'}`}
                                        style={{
                                            width: '80px',
                                            height: '80px',
                                            objectFit: 'cover',
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => setSelectedImage(index)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </Col>

                {/* Product Info */}
                <Col lg={6} className="mb-4">
                    <div className="product-info">
                        {/* Product Name */}
                        <h1 className="h2 mb-3">{product.name}</h1>

                        <Badge bg="success" className="mb-3">Bán chạy</Badge>

                        {/* Price */}
                        <div className="price-section mb-4">
                            {product.discount ? (
                                <div className="d-flex flex-column align-items-start">
                                    <span className="text-decoration-line-through text-muted h5 mb-1">
                                        {formatCurrency(product.price)}
                                    </span>
                                    <div className="d-flex align-items-baseline">
                                        <span className="text-danger h2">
                                            {formatCurrency(discountedPrice)}
                                        </span>
                                        <Badge bg="danger" className="ms-2">
                                            -{product.discount}%
                                        </Badge>
                                    </div>
                                </div>
                            ) : (
                                <span className="h2 text-primary">
                                    {formatCurrency(product.price)}
                                </span>
                            )}
                        </div>

                        {/* Stock Status */}
                        <div className="mb-4">
                            {product.inStock ? (
                                <Alert variant="success" className="d-inline-block">
                                    ✓ Còn hàng - Sẵn sàng giao hàng
                                </Alert>
                            ) : (
                                <Alert variant="danger" className="d-inline-block">
                                    ✗ Hết hàng
                                </Alert>
                            )}
                        </div>

                        {/* Quantity Selector */}
                        <div className="quantity-selector mb-4">
                            <h6 className="mb-3">Số lượng:</h6>
                            <div className="d-flex align-items-center">
                                <Button
                                    variant="outline-secondary"
                                    size="sm"
                                    onClick={() => handleQuantityChange(quantity - 1)}
                                    disabled={quantity <= 1 || !user}
                                >
                                    <Dash size={16} />
                                </Button>
                                <Form.Control
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                                    min="1"
                                    max="99"
                                    className="mx-3 text-center"
                                    style={{ width: '80px' }}
                                    disabled={!user}
                                />
                                <Button
                                    variant="outline-secondary"
                                    size="sm"
                                    onClick={() => handleQuantityChange(quantity + 1)}
                                    disabled={quantity >= 99 || !user}
                                >
                                    <Plus size={16} />
                                </Button>
                            </div>
                        </div>

                        {/* Add to Cart Button */}
                        <div className="d-grid gap-2 mb-4">
                            <Button
                                variant="primary"
                                size="lg"
                                onClick={handleAddToCart}
                                disabled={!product.inStock}
                            >
                                <Cart3 className="me-2" />
                                {product.inStock ? 'Thêm vào giỏ hàng' : 'Hết hàng'}
                            </Button>
                        </div>

                        {/* Benefits */}
                        <div className="benefits">
                            <div className="d-flex align-items-center mb-2">
                                <Truck className="me-2 text-primary" />
                                <span>Miễn phí vận chuyển</span>
                            </div>
                            <div className="d-flex align-items-center mb-2">
                                <Shield className="me-2 text-primary" />
                                <span>Bảo hành chính hãng 24 tháng</span>
                            </div>
                            <div className="d-flex align-items-center">
                                <CreditCard className="me-2 text-primary" />
                                <span>Thanh toán an toàn 100%</span>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>

            {/* Product Details Tabs */}
            <Row className="mt-5">
                <Col>
                    <Card className="border-0 shadow-sm">
                        <Card.Header className="bg-body-tertiary">
                            <Tabs
                                activeKey={activeTab}
                                onSelect={(k) => setActiveTab(k)}
                                className="nav-pills product-detail-tabs"
                            >
                                {/* Đã xóa các thẻ <span className="text-dark"> gây lỗi */}
                                <Tab eventKey="description" title="Mô tả sản phẩm" />
                                <Tab eventKey="specs" title="Thông số kỹ thuật" />
                            </Tabs>
                        </Card.Header>
                        <Card.Body>
                            <Tab.Content>
                                {/* Description Tab */}
                                {activeTab === 'description' && (
                                    <div className="text-body"> {/* Đổi thành text-body */}
                                        <h5 className="mb-3">Mô tả chi tiết</h5>
                                        <h6 className="mb-3">Tính năng nổi bật:</h6>
                                        <ul>
                                            {product.features && product.features.map((feature, index) => (
                                                <li key={index}>{feature}</li>
                                            ))}
                                        </ul>
                                        <p className="mt-4">{product.description}</p>
                                    </div>
                                )}

                                {/* Specs Tab */}
                                {activeTab === 'specs' && (
                                    <div className="text-body"> {/* Đổi thành text-body */}
                                        <h5 className="mb-3">Cấu hình chi tiết</h5>
                                        {/* Bảng (table) của Bootstrap 5 sẽ tự động đổi màu theo theme */}
                                        <table className="table table-bordered table-striped">
                                            <tbody>
                                                {product.specs && Object.entries(product.specs).map(([key, value]) => (
                                                    <tr key={key}>
                                                        <td className="fw-bold text-uppercase" style={{ width: '30%' }}>{key}</td>
                                                        <td>{value}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </Tab.Content>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

        </Container>
    );
}
