import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaFacebook } from 'react-icons/fa';
import { SiZalo } from 'react-icons/si';
import { Link } from 'react-router-dom';

export default function Footer() {
    const linkStyle = {
        textDecoration: 'none',
        color: 'inherit',
        transition: 'color 0.2s'
    };

    return (
        <footer className="bg-dark text-white pt-5 pb-3 mt-5 shadow-lg">
            <Container>
                <Row className="g-4">
                    {/* Cột 1: Kết nối với TechHub */}
                    <Col xs={12} md={4}>
                        <h6 className="fw-bold mb-3 text-uppercase small">Kết nối với TechHub</h6>
                        <div className="d-flex gap-3 mb-4">
                            {/* đường dẫn tới trang fb */}
                            <a href="https://www.facebook.com/share/14Zozu5frnu/" target="_blank" rel="noreferrer"
                                className="d-flex align-items-center justify-content-center rounded-circle"
                                style={{ width: '36px', height: '36px', backgroundColor: '#3b5998' }}>
                                <FaFacebook className="text-white fs-5" />
                            </a>
                            {/* đường dẫn tới trnag zalo */}
                            <a href="https://zalo.me/0856357069" target="_blank" rel="noreferrer"
                                className="d-flex align-items-center justify-content-center rounded-circle"
                                style={{ width: '36px', height: '36px', backgroundColor: '#0088ff' }}>
                                <SiZalo className="text-white fs-5" />
                            </a>
                        </div>

                        <div className="contact-info small text-secondary">
                            <p className="mb-2 fw-bold text-white">TỔNG ĐÀI MIỄN PHÍ</p>
                            <p className="mb-1">Tư vấn mua hàng (Miễn phí): 0941041650</p>
                            <p className="mb-1">Hỗ trợ kỹ thuật (8h00-22h00): 0843798921</p>
                            <p className="mb-0">Góp ý, khiếu nại (8h00 - 22h00): 0856357069</p>
                        </div>
                    </Col>

                    {/* Cột 2: Về chúng tôi*/}
                    <Col xs={12} md={4}>
                        <h6 className="fw-bold mb-3 text-uppercase small">Về chúng tôi - Group 3</h6>
                        <ul className="list-unstyled small text-secondary lh-lg">
                            <li>Nguyễn Trung Hậu</li>
                            <li>Tường Lộc Ninh</li>
                            <li>Lê Nguyên</li>
                            <li>Phạm Nguyên Phước</li>
                            <li>Huỳnh Lê Nhật Minh</li>
                        </ul>
                    </Col>

                    {/* Cột 3: Chính sách - ĐÃ CẬP NHẬT LINK */}
                    <Col xs={12} md={4}>
                        <h6 className="fw-bold mb-3 text-uppercase small">Chính sách</h6>
                        <ul className="list-unstyled small text-secondary lh-lg">
                            <li>
                                <Link to="/policy/bao-hanh" style={linkStyle} className="policy-link">Chính sách bảo hành</Link>
                            </li>
                            <li>
                                <Link to="/policy/doi-tra" style={linkStyle} className="policy-link">Chính sách đổi trả</Link>
                            </li>
                            <li>
                                <Link to="/policy/bao-mat" style={linkStyle} className="policy-link">Chính sách bảo mật</Link>
                            </li>
                            <li>
                                <Link to="/policy/tra-gop" style={linkStyle} className="policy-link">Chính sách trả góp</Link>
                            </li>
                            <li>
                                <Link to="/policy/khui-hop" style={linkStyle} className="policy-link">Chính sách khui hộp sản phẩm</Link>
                            </li>
                            <li>
                                <Link to="/policy/giao-hang" style={linkStyle} className="policy-link">Chính sách giao hàng & lắp đặt</Link>
                            </li>
                        </ul>
                    </Col>
                </Row>

                <hr className="my-4 border-secondary" />
                <div className="text-center small text-secondary">
                    <p className="mb-0">&copy; 2026 TechHub. Bản quyền thuộc về Nhóm 3 - FER202.</p>
                </div>
            </Container>

            {/* Thêm một chút CSS inline để hiệu ứng đẹp hơn */}
            <style>{`
                .policy-link:hover {
                    color: #0088ff !important;
                    padding-left: 5px;
                    transition: all 0.3s ease;
                }
            `}</style>
        </footer>
    );
}