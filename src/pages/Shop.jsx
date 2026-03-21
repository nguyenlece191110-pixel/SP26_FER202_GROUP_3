import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert, Pagination, Tab, Nav } from 'react-bootstrap';
import ProductGallery from '../components/ProductGallery';

export default function Shop() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [filterCategory, setFilterCategory] = useState('all');
    const [filterBrand, setFilterBrand] = useState('all');
    const [activeTab, setActiveTab] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 12;

    // Fetch products from API
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:5000/products');
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                const data = await response.json();
                setProducts(data);
                setFilteredProducts(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching products:', error);
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Filter and sort products
    useEffect(() => {
        let result = [...products];

        // Filter by search term (only by name)
        if (searchTerm) {
            result = result.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by category (from tab)
        if (activeTab !== 'all') {
            result = result.filter(product => product.category === activeTab);
        }

        // Filter by dropdown category
        if (filterCategory !== 'all') {
            result = result.filter(product => product.category === filterCategory);
        }

        // Filter by brand
        if (filterBrand !== 'all') {
            result = result.filter(product => product.brand === filterBrand);
        }

        // Sort products
        switch (sortBy) {
            case 'price-asc':
                result.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                result.sort((a, b) => b.price - a.price);
                break;
            case 'name':
                result.sort((a, b) => a.name.localeCompare(b.name));
                break;
            default:
                break;
        }

        setFilteredProducts(result);
        setCurrentPage(1); // Reset to first page when filtering
    }, [products, searchTerm, sortBy, filterCategory, filterBrand, activeTab]);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Get unique categories and brands
    const brands = ['all', ...new Set(products.map(p => p.brand))];

    // Handle tab change
    const handleTabSelect = (tabKey) => {
        setActiveTab(tabKey);
        setFilterCategory('all'); // Reset dropdown when tab changes
        setFilterBrand('all');
    };

    if (loading) {
        return (
            <Container className="mt-5">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Đang tải...</span>
                    </div>
                    <p className="mt-3">Đang tải sản phẩm...</p>
                </div>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <h1 className="mb-4">Cửa hàng TechHub</h1>
            
            {/* Category Tabs */}
            <Tab.Container activeKey={activeTab} onSelect={handleTabSelect}>
                <Nav variant="tabs" className="mb-4">
                    <Nav.Item>
                        <Nav.Link eventKey="all">Tất cả</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="laptop">Laptop</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="phone">Điện thoại</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="accessories">Khác</Nav.Link>
                    </Nav.Item>
                </Nav>
                
                <Tab.Content>
                    <Tab.Pane eventKey="all">
                        {renderShopContent()}
                    </Tab.Pane>
                    <Tab.Pane eventKey="laptop">
                        {renderShopContent()}
                    </Tab.Pane>
                    <Tab.Pane eventKey="phone">
                        {renderShopContent()}
                    </Tab.Pane>
                    <Tab.Pane eventKey="accessories">
                        {renderShopContent()}
                    </Tab.Pane>
                </Tab.Content>
            </Tab.Container>
        </Container>
    );

    function renderShopContent() {
        return (
            <>
                {/* Search and Filter */}
                <Row className="mb-4">
                    <Col md={4}>
                        <Form.Control
                            type="text"
                            placeholder="Tìm kiếm sản phẩm..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </Col>
                    <Col md={2}>
                        <Form.Select
                            value={filterBrand}
                            onChange={(e) => setFilterBrand(e.target.value)}
                        >
                            <option value="all">Tất cả thương hiệu</option>
                            {brands.filter(brand => brand !== 'all').map(brand => (
                                <option key={brand} value={brand}>{brand}</option>
                            ))}
                        </Form.Select>
                    </Col>
                    <Col md={2}>
                        <Form.Select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="name">Sắp xếp theo tên</option>
                            <option value="price-asc">Giá: Thấp đến cao</option>
                            <option value="price-desc">Giá: Cao đến thấp</option>
                        </Form.Select>
                    </Col>
                    <Col md={2}>
                        <Button variant="outline-secondary" onClick={() => {
                            setSearchTerm('');
                            setFilterBrand('all');
                            setSortBy('name');
                        }}>
                            Đặt lại
                        </Button>
                    </Col>
                </Row>

                {/* Results count */}
                <div className="mb-3">
                    <p className="text-muted">
                        Tìm thấy {filteredProducts.length} sản phẩm
                        {filteredProducts.length > 0 && (
                            <span className="ms-2">
                                - Trang {currentPage} của {Math.ceil(filteredProducts.length / productsPerPage)}
                            </span>
                        )}
                    </p>
                </div>

                {/* Products Grid */}
                <ProductGallery products={filteredProducts.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage)} />

                {/* Pagination */}
                {Math.ceil(filteredProducts.length / productsPerPage) > 1 && (
                    <div className="d-flex justify-content-center mt-4">
                        <Pagination>
                            <Pagination.Prev
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                            />
                            
                            {Array.from({ length: Math.ceil(filteredProducts.length / productsPerPage) }, (_, index) => (
                                <Pagination.Item
                                    key={index + 1}
                                    active={index + 1 === currentPage}
                                    onClick={() => paginate(index + 1)}
                                >
                                    {index + 1}
                                </Pagination.Item>
                            ))}
                            
                            <Pagination.Next
                                onClick={() => paginate(currentPage + 1)}
                                disabled={currentPage === Math.ceil(filteredProducts.length / productsPerPage)}
                            />
                        </Pagination>
                    </div>
                )}

                {/* No results */}
                {filteredProducts.length === 0 && !loading && (
                    <Alert variant="info" className="text-center">
                        <h4>Không tìm thấy sản phẩm nào</h4>
                        <p>Vui lòng thử lại với từ khóa khác!</p>
                    </Alert>
                )}
            </>
        );
    }
}