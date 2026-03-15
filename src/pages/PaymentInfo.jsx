import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { useCart } from '../contexts/CartContext';
import { ArrowLeft, Person, Envelope, Telephone, House, CreditCard } from 'react-bootstrap-icons';

export default function PaymentInfo() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { selectedItems, getSelectedItemsTotal, getSelectedItemsCount } = useCart();

    const [formData, setFormData] = useState({
        fullName: user?.name || '',
        email: user?.email || '',
        phone: '',
        address: '',
        city: '',
        district: '',
        zipCode: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const selectedTotal = getSelectedItemsTotal();
    const selectedCount = getSelectedItemsCount();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Vui lòng nhập họ tên';
        } else if (formData.fullName.trim().length < 2) {
            newErrors.fullName = 'Họ tên phải có ít nhất 2 ký tự';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Vui lòng nhập email';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email không hợp lệ';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Vui lòng nhập số điện thoại';
        } else if (!/^(0|\+84)[0-9]{9,10}$/.test(formData.phone.replace(/\s/g, ''))) {
            newErrors.phone = 'Số điện thoại không hợp lệ (bắt đầu bằng 0 hoặc +84)';
        }

        if (!formData.address.trim()) {
            newErrors.address = 'Vui lòng nhập địa chỉ';
        } else if (formData.address.trim().length < 5) {
            newErrors.address = 'Địa chỉ phải có ít nhất 5 ký tự';
        }

        if (!formData.city.trim()) {
            newErrors.city = 'Vui lòng chọn thành phố';
        }

        if (!formData.district.trim()) {
            newErrors.district = 'Vui lòng chọn quận/huyện';
        }

        if (formData.zipCode && formData.zipCode.trim() && !/^\d{5,6}$/.test(formData.zipCode.trim())) {
            newErrors.zipCode = 'Mã bưu điện không hợp lệ (5-6 số)';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (selectedItems.length === 0) {
            alert('Vui lòng chọn ít nhất một sản phẩm để thanh toán');
            return;
        }

        if (!validateForm()) {
            // Scroll to first error field
            const firstErrorField = Object.keys(errors)[0];
            const errorElement = document.querySelector(`[name="${firstErrorField}"]`);
            if (errorElement) {
                errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                errorElement.focus();
            }
            return;
        }

        try {
            setIsSubmitting(true);
            sessionStorage.setItem('paymentInfo', JSON.stringify(formData));
            navigate('/checkout');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (selectedItems.length === 0) {
        return (
            <Container className="mt-5">
                <div className="text-center">
                    <h3>Giỏ hàng của bạn đang trống</h3>
                    <p className="text-muted mb-4">
                        Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán
                    </p>
                    <Button variant="primary" href="/cart">
                        <ArrowLeft className="me-2" />
                        Quay lại giỏ hàng
                    </Button>
                </div>
            </Container>
        );
    }

    return (
        <Container className="mt-4 mb-5">
            <Row>
                <Col lg={8}>
                    <Card className="shadow-sm">
                        <Card.Header className="bg-primary text-white">
                            <h5 className="mb-0">
                                <CreditCard className="me-2" />
                                Thông tin thanh toán
                            </h5>
                        </Card.Header>
                        <Card.Body>
                            <Form onSubmit={handleSubmit}>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>
                                                <Person className="me-1" />
                                                Họ tên *
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="fullName"
                                                value={formData.fullName}
                                                onChange={handleInputChange}
                                                isInvalid={!!errors.fullName}
                                                placeholder="Nhập họ tên của bạn"
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.fullName}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>
                                                <Envelope className="me-1" />
                                                Email *
                                            </Form.Label>
                                            <Form.Control
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                isInvalid={!!errors.email}
                                                placeholder="email@example.com"
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.email}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-3">
                                    <Form.Label>
                                        <Telephone className="me-1" />
                                        Số điện thoại *
                                    </Form.Label>
                                    <Form.Control
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        isInvalid={!!errors.phone}
                                        placeholder="09xxxxxxxx hoặc +849xxxxxxxx"
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.phone}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>
                                        <House className="me-1" />
                                        Địa chỉ giao hàng *
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        isInvalid={!!errors.address}
                                        placeholder="Số nhà, tên đường..."
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.address}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Row>
                                    <Col md={4}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Tỉnh/Thành phố *</Form.Label>
                                            <Form.Select
                                                name="city"
                                                value={formData.city}
                                                onChange={handleInputChange}
                                                isInvalid={!!errors.city}
                                            >
                                                <option value="">Chọn tỉnh/thành phố</option>
                                                <option value="Hà Nội">Hà Nội</option>
                                                <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                                                <option value="Đà Nẵng">Đà Nẵng</option>
                                                <option value="Hải Phòng">Hải Phòng</option>
                                                <option value="Cần Thơ">Cần Thơ</option>
                                                <option value="An Giang">An Giang</option>
                                                <option value="Bà Rịa - Vũng Tàu">Bà Rịa - Vũng Tàu</option>
                                                <option value="Bắc Giang">Bắc Giang</option>
                                                <option value="Bắc Kạn">Bắc Kạn</option>
                                                <option value="Bạc Liêu">Bạc Liêu</option>
                                                <option value="Bến Tre">Bến Tre</option>
                                                <option value="Bình Định">Bình Định</option>
                                                <option value="Bình Dương">Bình Dương</option>
                                                <option value="Bình Phước">Bình Phước</option>
                                                <option value="Bình Thuận">Bình Thuận</option>
                                                <option value="Cà Mau">Cà Mau</option>
                                                <option value="Cao Bằng">Cao Bằng</option>
                                                <option value="Đắk Lắk">Đắk Lắk</option>
                                                <option value="Đắk Nông">Đắk Nông</option>
                                                <option value="Điện Biên">Điện Biên</option>
                                                <option value="Đồng Nai">Đồng Nai</option>
                                                <option value="Đồng Tháp">Đồng Tháp</option>
                                                <option value="Gia Lai">Gia Lai</option>
                                                <option value="Hà Giang">Hà Giang</option>
                                                <option value="Hà Nam">Hà Nam</option>
                                                <option value="Hà Tĩnh">Hà Tĩnh</option>
                                                <option value="Hải Dương">Hải Dương</option>
                                                <option value="Hậu Giang">Hậu Giang</option>
                                                <option value="Hòa Bình">Hòa Bình</option>
                                                <option value="Hưng Yên">Hưng Yên</option>
                                                <option value="Kiên Giang">Kiên Giang</option>
                                                <option value="Kon Tum">Kon Tum</option>
                                                <option value="Lai Châu">Lai Châu</option>
                                                <option value="Lâm Đồng">Lâm Đồng</option>
                                                <option value="Lạng Sơn">Lạng Sơn</option>
                                                <option value="Lào Cai">Lào Cai</option>
                                                <option value="Long An">Long An</option>
                                                <option value="Nam Định">Nam Định</option>
                                                <option value="Nghệ An">Nghệ An</option>
                                                <option value="Ninh Bình">Ninh Bình</option>
                                                <option value="Ninh Thuận">Ninh Thuận</option>
                                                <option value="Phú Thọ">Phú Thọ</option>
                                                <option value="Phú Yên">Phú Yên</option>
                                                <option value="Quảng Bình">Quảng Bình</option>
                                                <option value="Quảng Nam">Quảng Nam</option>
                                                <option value="Quảng Ngãi">Quảng Ngãi</option>
                                                <option value="Quảng Ninh">Quảng Ninh</option>
                                                <option value="Quảng Trị">Quảng Trị</option>
                                                <option value="Sóc Trăng">Sóc Trăng</option>
                                                <option value="Sơn La">Sơn La</option>
                                                <option value="Tây Ninh">Tây Ninh</option>
                                                <option value="Thái Bình">Thái Bình</option>
                                                <option value="Thái Nguyên">Thái Nguyên</option>
                                                <option value="Thanh Hóa">Thanh Hóa</option>
                                                <option value="Thừa Thiên Huế">Thừa Thiên Huế</option>
                                                <option value="Tiền Giang">Tiền Giang</option>
                                                <option value="Trà Vinh">Trà Vinh</option>
                                                <option value="Tuyên Quang">Tuyên Quang</option>
                                                <option value="Vĩnh Long">Vĩnh Long</option>
                                                <option value="Vĩnh Phúc">Vĩnh Phúc</option>
                                                <option value="Yên Bái">Yên Bái</option>
                                            </Form.Select>
                                            <Form.Control.Feedback type="invalid">
                                                {errors.city}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Quận/Huyện *</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="district"
                                                value={formData.district}
                                                onChange={handleInputChange}
                                                isInvalid={!!errors.district}
                                                placeholder="Nhập quận/huyện"
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.district}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Mã bưu điện</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="zipCode"
                                                value={formData.zipCode}
                                                onChange={handleInputChange}
                                                isInvalid={!!errors.zipCode}
                                                placeholder="Không bắt buộc"
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.zipCode}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <div className="d-flex gap-2 mt-4">
                                    <Button variant="secondary" href="/cart">
                                        <ArrowLeft className="me-2" />
                                        Quay lại giỏ hàng
                                    </Button>
                                    <Button type="submit" variant="primary" disabled={isSubmitting}>
                                        {isSubmitting ? (
                                            <>
                                                <Spinner as="span" animation="border" size="sm" className="me-2" />
                                                Đang xử lý...
                                            </>
                                        ) : (
                                            <>
                                                <CreditCard className="me-2" />
                                                Tiếp tục thanh toán
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={4}>
                    <Card className="shadow-sm">
                        <Card.Header className="bg-light">
                            <h6 className="mb-0">Tóm tắt đơn hàng</h6>
                        </Card.Header>
                        <Card.Body>
                            <div className="mb-3">
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Số lượng sản phẩm:</span>
                                    <span className="fw-bold">{selectedCount}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Tạm tính:</span>
                                    <span className="fw-bold">
                                        {new Intl.NumberFormat('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND'
                                        }).format(selectedTotal)}
                                    </span>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Phí vận chuyển:</span>
                                    <span className="fw-bold text-success">Miễn phí</span>
                                </div>
                                <hr />
                                <div className="d-flex justify-content-between">
                                    <span className="fw-bold">Tổng cộng:</span>
                                    <span className="fw-bold text-primary fs-5">
                                        {new Intl.NumberFormat('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND'
                                        }).format(selectedTotal)}
                                    </span>
                                </div>
                            </div>

                            <Alert variant="info" className="mb-0">
                                <small>
                                    <strong>Lưu ý:</strong> Thông tin của bạn sẽ được bảo mật và chỉ sử dụng cho việc giao hàng.
                                </small>
                            </Alert>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}
