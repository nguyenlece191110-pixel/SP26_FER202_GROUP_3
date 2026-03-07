import React, { useContext } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

export default function Header() {
    const { user, logout } = useContext(AuthContext);

    return (
        <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
            <Container>
                <Navbar.Brand as={Link} to="/">TechHub</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">Trang chủ</Nav.Link>
                        <Nav.Link as={Link} to="/shop">Sản phẩm</Nav.Link>
                        <Nav.Link as={Link} to="/cart">Giỏ hàng</Nav.Link>
                        {user?.role === 'admin' && (
                            <Nav.Link as={Link} to="/admin">Quản trị</Nav.Link>
                        )}
                    </Nav>
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