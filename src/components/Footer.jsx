import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaFacebook } from 'react-icons/fa';
import { SiZalo } from 'react-icons/si';

export default function Footer() {
    return (
        <footer className="bg-dark text-white pt-5 pb-3 mt-5 shadow-lg">
            <Container>
                <Row className="g-4">
                    {/* Cột 1: Kết nối với TechHub */}
                    <Col xs={12} md={4}>
                        <h6 className="fw-bold mb-3 text-uppercase small">Kết nối với TechHub</h6>
                        <div className="d-flex gap-3 mb-4">
                            <a href="https://www.facebook.com/share/14Zozu5frnu/" target="_blank" rel="noreferrer"
                                className="d-flex align-items-center justify-content-center rounded-circle"
                                style={{ width: '36px', height: '36px', backgroundColor: '#3b5998' }}>
                                <FaFacebook className="text-white fs-5" />
                            </a>
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

                    {/* Cột 3: Chính sách */}
                    <Col xs={12} md={4}>
                        <h6 className="fw-bold mb-3 text-uppercase small">Chính sách</h6>
                        <ul className="list-unstyled small text-secondary lh-lg">
                            <li>Chính sách bảo hành</li>
                            <li>Chính sách đổi trả</li>
                            <li>Chính sách bảo mật</li>
                            <li>Chính sách trả góp</li>
                            <li>Chính sách khui hộp sản phẩm</li>
                            <li>Chính sách giao hàng & lắp đặt</li>
                        </ul>
                    </Col>
                </Row>

                <hr className="my-4 border-secondary" />
                <div className="text-center small text-secondary">
                    <p className="mb-0">&copy; 2026 TechHub. Bản quyền thuộc về Nhóm 3 - FER202.</p>
                </div>
            </Container>
        </footer>
    );
}