import React, { useContext, useState } from 'react';
import { Navbar, Nav, Container, Button, Badge, Form, InputGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { useCart } from '../contexts/CartContext';
import { Cart3, Clipboard2, Search } from 'react-bootstrap-icons';

export default function Header() {
    const { user, logout } = useContext(AuthContext);
    const { totalItems } = useCart();

    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const handleSearch = (e) => {
        e.preventDefault();
        const keyword = searchTerm.trim();

        if (!keyword) return;

        // Chuyển hướng sang trang Shop kèm từ khóa tìm kiếm (URL-safe)
        navigate(`/shop?search=${encodeURIComponent(keyword)}`);
    };

    return (
        <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
            <Container fluid className="px-4">
                <Navbar.Brand as={Link} to="/" aria-label="TechHub Home" style={{ padding: 0, marginRight: '1.25rem' }}>
                    <img
                        src="/images/logo.png"
                        alt="TechHub"
                        style={{ height: '44px', width: 'auto', display: 'block' }}
                    />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">Trang chủ</Nav.Link>
                        <Nav.Link as={Link} to="/shop">Sản phẩm</Nav.Link>
                        <Nav.Link as={Link} to="/cart" className="position-relative">
                            <Cart3 className="me-1" />
                            Giỏ hàng
                            {totalItems > 0 && (
                                <Badge
                                    bg="danger"
                                    pill
                                    className="position-absolute top-0 start-100 translate-middle"
                                    style={{ fontSize: '0.7em' }}
                                >
                                    {totalItems}
                                </Badge>
                            )}
                        </Nav.Link>
                        {user && (
                            <Nav.Link as={Link} to="/orders">
                                <Clipboard2 className="me-1" />
                                Đơn hàng
                            </Nav.Link>
                        )}
                        {user?.role === 'admin' && (
                            <Nav.Link as={Link} to="/admin">Quản trị</Nav.Link>
                        )}
                    </Nav>

                    {/* --- THANH TÌM KIẾM --- */}
                    <Form className="d-flex me-3" onSubmit={handleSearch}>
                        <style>
                            {`
                                .custom-search::placeholder {
                                    color: white !important;
                                    opacity: 0.7; /* Độ mờ nhẹ để trông chuyên nghiệp hơn */
                                }
                                .custom-search::-webkit-input-placeholder {
                                    color: white !important;
                                }
                            `}
                        </style>
                        <InputGroup size="sm">
                            <Form.Control
                                type="search"
                                placeholder="Tìm sản phẩm..."
                                className="bg-dark text-white border-secondary custom-search"
                                aria-label="Search"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Button variant="outline-secondary" type="submit" className="border-secondary">
                                <Search className="text-white" />
                            </Button>
                        </InputGroup>
                    </Form>

                    <Nav>
                        {user ? (
                            <>
                                <Navbar.Text className="me-3">
                                    Xin chào, {user.name}
                                </Navbar.Text>
                                <Button variant="outline-light" size="sm" onClick={logout}>Đăng xuất</Button>
                            </>
                        ) : (
                            <>
                                <Nav.Link as={Link} to="/login">Đăng nhập</Nav.Link>
                                <Nav.Link as={Link} to="/register">Đăng ký</Nav.Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}