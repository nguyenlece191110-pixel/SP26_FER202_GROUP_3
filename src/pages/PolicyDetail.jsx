import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Button, Row, Col, Badge, Spinner } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';

const PolicyDetail = () => {
    const { type } = useParams();
    const navigate = useNavigate();

    const policyContent = {
        'bao-hanh': {
            title: "Chính sách bảo hành",
            icon: <Icon.ShieldCheck size={44} />,
            theme: "primary",
            content: (
                <div className="policy-body">
                    <h5 className="fw-bold border-start border-4 border-primary ps-3 mb-3 text-primary">1. Thời hạn bảo hành</h5>
                    <p className="ms-4 text-secondary lh-lg">Bảo hành 12 tháng chính hãng cho tất cả các dòng iPhone, Samsung, Laptop tại hệ thống TechHub kể từ ngày mua hàng.</p>
                    <h5 className="fw-bold border-start border-4 border-primary ps-3 mt-4 mb-3 text-primary">2. Điều kiện bảo hành</h5>
                    <p className="ms-4 text-secondary lh-lg">Sản phẩm phải còn nguyên tem bảo hành, không có dấu hiệu rơi vỡ, vào nước hoặc bị can thiệp phần cứng bởi bên thứ ba.</p>
                </div>
            )
        },
        'doi-tra': {
            title: "Chính sách đổi trả",
            icon: <Icon.Recycle size={44} />,
            theme: "success",
            content: <p className="text-secondary fs-5 ms-3">Sản phẩm bị lỗi phần cứng từ nhà sản xuất sẽ được hỗ trợ 1 đổi 1 trong vòng 30 ngày đầu tiên (áp dụng cho máy ngoại hình đẹp, đầy đủ hộp phụ kiện).</p>
        },
        'bao-mat': {
            title: "Chính sách bảo mật",
            icon: <Icon.ShieldLock size={44} />,
            theme: "dark",
            content: <p className="text-secondary fs-5">Mọi thông tin cá nhân của khách hàng (Tên, Số điện thoại, Địa chỉ) đều được mã hóa và bảo mật tuyệt đối trên hệ thống của TechHub. Chúng tôi cam kết không chia sẻ dữ liệu cho bất kỳ đơn vị nào khác.
                .</p>
        },
        'tra-gop': { title: "Chính sách trả góp", icon: <Icon.CashCoin size={44} />, theme: "info", isComingSoon: true },
        'khui-hop': { title: "Chính sách khui hộp", icon: <Icon.BoxSeam size={44} />, theme: "secondary", isComingSoon: true },
        'giao-hang': { title: "Giao hàng & Lắp đặt", icon: <Icon.Truck size={44} />, theme: "danger", isComingSoon: true }
    };

    const policy = policyContent[type];

    if (!policy) {
        return (
            <Container className="text-center py-5">
                <Icon.InfoCircle size={60} className="text-danger mb-3" />
                <h2 className="fw-bold">404 - Không tìm thấy</h2>
                <Button variant="primary" onClick={() => navigate('/')} className="mt-3 rounded-pill px-4">Quay về Trang Chủ</Button>
            </Container>
        );
    }

    return (
        <Container className="py-4">
            <Button variant="outline-primary" className="mb-4 rounded-pill fw-bold border-2" onClick={() => navigate('/')}>
                <Icon.ArrowLeft className="me-2" /> TRANG CHỦ
            </Button>

            <Row className="justify-content-center">
                <Col lg={10} xl={8}>
                    <Card className="border-0 shadow-lg rounded-4 overflow-hidden">
                        <div className={`bg-${policy.theme} bg-gradient p-5 text-center text-white`}>
                            <div className="mb-3">{policy.icon}</div>
                            <h2 className="fw-bold text-uppercase mb-0">{policy.title}</h2>
                        </div>

                        <Card.Body className="p-4 p-md-5">
                            {policy.isComingSoon ? (
                                <div className="text-center py-5 bg-light rounded-4 border border-warning-subtle">
                                    <Icon.HourglassSplit size={50} className="text-warning mb-3" />
                                    <h3 className="fw-bold">Đang phát triển</h3>
                                    <Badge bg="warning" text="dark" className="px-3 py-2 rounded-pill my-3">
                                        <Spinner animation="grow" size="sm" className="me-2 bg-white" /> Coming soon...
                                    </Badge>
                                    <p className="text-muted">Nội dung này đang được xây dựng.</p>
                                    <div className="text-primary fw-bold mt-3">
                                        <Icon.TelephoneFill className="me-2" /> Hotline: 0856 357 069
                                    </div>
                                </div>
                            ) : (
                                <div className="lh-lg">{policy.content}</div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default PolicyDetail;