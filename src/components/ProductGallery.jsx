import React, { useState } from 'react';
import { Card, Button, Row, Col, Badge } from 'react-bootstrap';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const ProductGallery = ({ products }) => {
    const { addToCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [selectedImage, setSelectedImage] = useState({});

    const handleImageClick = (productId, imageUrl) => {
        setSelectedImage(prev => ({
            ...prev,
            [productId]: imageUrl
        }));
    };

    const handleAddToCart = (product) => {
        // Kiểm tra user đã đăng nhập chưa
        if (!user) {
            // Nếu chưa đăng nhập, chuyển đến trang đăng nhập
            navigate('/login');
            return;
        }

        // Calculate the discounted price
        const finalPrice = product.discount ? product.price * (1 - product.discount / 100) : product.price;
        
        addToCart({
            id: product.id,
            name: product.name,
            price: finalPrice, // Use discounted price
            originalPrice: product.price,
            discountPrice: finalPrice,
            discount: product.discount || 0,
            image: product.images?.[0] || product.image,
            quantity: 1
        });
    };

    if (!products || products.length === 0) {
        return (
            <div className="text-center text-muted my-5">
                <h4>Chưa có sản phẩm nào</h4>
                <p>Vui lòng quay lại sau!</p>
            </div>
        );
    }

    return (
        <Row className="g-4">
            {products.map(product => (
                <Col key={product.id} md={6} lg={4} xl={3}>
                    <Card className="h-100 product-card">
                        {/* Gallery Images */}
                        <div className="product-gallery-container">
                            <div className="main-image-container">
                                <Card.Img
                                    variant="top"
                                    src={selectedImage[product.id] || product.images?.[0] || product.image}
                                    alt={product.name}
                                    className="main-image"
                                    style={{ height: '200px', objectFit: 'cover' }}
                                />
                                {product.discount && (
                                    <Badge 
                                        bg="danger" 
                                        className="position-absolute top-0 start-0 m-2"
                                    >
                                        -{product.discount}%
                                    </Badge>
                                )}
                            </div>
                            
                            {/* Thumbnail Images */}
                            {product.images && product.images.length > 1 && (
                                <div className="thumbnail-container d-flex gap-1 p-2">
                                    {product.images.map((image, index) => (
                                        <img
                                            key={index}
                                            src={image}
                                            alt={`${product.name} ${index + 1}`}
                                            className={`thumbnail ${selectedImage[product.id] === image ? 'active' : ''}`}
                                            style={{
                                                width: '40px',
                                                height: '40px',
                                                objectFit: 'cover',
                                                cursor: 'pointer',
                                                border: selectedImage[product.id] === image ? '2px solid #0d6efd' : '1px solid #dee2e6',
                                                borderRadius: '4px'
                                            }}
                                            onClick={() => handleImageClick(product.id, image)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        <Card.Body className="d-flex flex-column">
                            <Card.Title className="fs-6">{product.name}</Card.Title>
                            <Card.Text className="text-muted small flex-grow-1">
                                {product.description && (
                                    <div className="product-description">
                                        {product.description.length > 50 
                                            ? `${product.description.substring(0, 50)}...` 
                                            : product.description}
                                    </div>
                                )}
                            </Card.Text>
                            
                            <div className="price-section mb-3">
                                {product.discount ? (
                                    <div>
                                        <span className="text-decoration-line-through text-muted me-2">
                                            {new Intl.NumberFormat('vi-VN', {
                                                style: 'currency',
                                                currency: 'VND'
                                            }).format(product.price)}
                                        </span>
                                        <span className="text-danger fw-bold">
                                            {new Intl.NumberFormat('vi-VN', {
                                                style: 'currency',
                                                currency: 'VND'
                                            }).format(product.price * (1 - product.discount / 100))}
                                        </span>
                                    </div>
                                ) : (
                                    <span className="fw-bold">
                                        {new Intl.NumberFormat('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND'
                                        }).format(product.price)}
                                    </span>
                                )}
                            </div>

                            <div className="d-grid gap-2">
                                <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={() => handleAddToCart(product)}
                                    disabled={!product.inStock}
                                >
                                    {product.inStock ? 'Thêm vào giỏ hàng' : 'Hết hàng'}
                                </Button>
                                <Button
                                    variant="outline-secondary"
                                    size="sm"
                                    as={Link}
                                    to={`/product/${product.id}`}
                                >
                                    Xem chi tiết
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            ))}
        </Row>
    );
};

// Add CSS styles to remove any potential "0" content
ProductGallery.defaultProps = {
    // Ensure no default content that could show "0"
};

// Add inline styles to prevent any "0" from appearing
const styles = `
    .product-card::before,
    .product-card::after,
    .main-image::before,
    .main-image::after,
    .thumbnail::before,
    .thumbnail::after {
        content: none !important;
    }
`;

if (typeof document !== 'undefined') {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
}

export default ProductGallery;
