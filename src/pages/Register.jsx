import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import axios from 'axios';
import emailjs from '@emailjs/browser';
import { API_ENDPOINTS } from '../config/api';

const OTP_TTL_MS = 5 * 60 * 1000;

const Register = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // Bước 1: Điền thông tin, Bước 2: Nhập OTP
    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [systemOtp, setSystemOtp] = useState(''); // Lưu mã máy tạo ra
    const [otpExpiresAt, setOtpExpiresAt] = useState(null); // Thời điểm OTP hết hạn
    const [userOtp, setUserOtp] = useState('');     // Lưu mã người dùng nhập
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    // HÀM GỬI OTP QUA EMAIL THẬT
    const handleSendOtp = async (e) => {
        e.preventDefault();
        setError('');

        // Read values directly from form to avoid missing browser autofill values.
        const form = e.currentTarget;
        const normalizedData = {
            name: (formData.name || form.name?.value || '').trim(),
            email: (formData.email || form.email?.value || '').trim(),
            password: formData.password || form.password?.value || '',
            confirmPassword: formData.confirmPassword || form.confirmPassword?.value || ''
        };

        setFormData(normalizedData);

        if (!normalizedData.name || !normalizedData.email || !normalizedData.password || !normalizedData.confirmPassword) {
            return setError('Vui lòng nhập đầy đủ thông tin.');
        }

        if (!/\S+@\S+\.\S+/.test(normalizedData.email)) {
            return setError('Email không hợp lệ!');
        }

        if (normalizedData.password !== normalizedData.confirmPassword) return setError('Mật khẩu không khớp!');

        setLoading(true);
        try {
            // 1. Kiểm tra email đã tồn tại chưa
            const res = await axios.get(`${API_ENDPOINTS.USERS}?email=${encodeURIComponent(normalizedData.email)}`);
            if (res.data.length > 0) {
                setLoading(false);
                return setError('Email này đã được sử dụng!');
            }

            // 2. Tạo mã OTP ngẫu nhiên 6 số
            const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
            const expiresAt = Date.now() + OTP_TTL_MS;
            const expiresAtText = new Date(expiresAt).toLocaleString('vi-VN', { hour12: false });
            setSystemOtp(newOtp);
            setOtpExpiresAt(expiresAt);

            // 3. Gửi mail thông qua EmailJS
            const templateParams = {
                to_email: normalizedData.email,
                email: normalizedData.email,
                user_email: normalizedData.email,
                recipient_email: normalizedData.email,
                to_name: normalizedData.name,
                name: normalizedData.name,
                username: normalizedData.name,
                user_name: normalizedData.name,
                otp: newOtp, // Phải khớp với {{otp}} trong Template của bạn
                otp_ttl_minutes: 5,
                otp_countdown: '05:00',
                otp_expires_at: expiresAtText,
                otp_expire_time: expiresAtText,
                time: expiresAtText
            };

            await emailjs.send(
                'service_ugdo9iz',   // DÁN SERVICE ID VÀO ĐÂY
                'template_8bwu5in',  // DÁN TEMPLATE ID VÀO ĐÂY
                templateParams,
                'xWKN2ZcMfxpmGDmHA'    // DÁN PUBLIC KEY VÀO ĐÂY
            );

            setStep(2); // Chuyển sang màn hình nhập OTP
        } catch (err) {
            setError('Lỗi khi gửi mail: ' + (err?.text || err?.message || 'Vui lòng kiểm tra lại cấu hình!'));
        } finally {
            setLoading(false);
        }
    };

    // HÀM XÁC THỰC VÀ ĐĂNG KÝ
    const handleFinalRegister = async (e) => {
        e.preventDefault();
        if (!otpExpiresAt || Date.now() > otpExpiresAt) {
            return setError('Mã OTP đã hết hạn (5 phút). Vui lòng gửi lại mã mới.');
        }
        if (userOtp !== systemOtp) return setError('Mã OTP không đúng!');

        try {
            await axios.post(API_ENDPOINTS.USERS, {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: 'user'
            });
            alert('Đăng ký thành công!');
            navigate('/login');
        } catch (err) {
            setError('Lỗi máy chủ, không thể tạo tài khoản.');
        }
    };

    return (
        <Container className="mt-5 d-flex justify-content-center">
            <Card style={{ width: '400px' }} className="p-4 shadow">
                <h3 className="text-center mb-4">{step === 1 ? 'Đăng Ký' : 'Xác Thực OTP'}</h3>
                {error && <Alert variant="danger">{error}</Alert>}

                {step === 1 ? (
                    <Form onSubmit={handleSendOtp}>
                        <Form.Group className="mb-3">
                            <Form.Label>Họ tên</Form.Label>
                            <Form.Control name="name" value={formData.name} required onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" name="email" value={formData.email} required onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Mật khẩu</Form.Label>
                            <Form.Control type="password" name="password" value={formData.password} required onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-4">
                            <Form.Label>Xác nhận</Form.Label>
                            <Form.Control type="password" name="confirmPassword" value={formData.confirmPassword} required onChange={handleChange} />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="w-100" disabled={loading}>
                            {loading ? 'Đang gửi mã...' : 'Tiếp tục'}
                        </Button>
                    </Form>
                ) : (
                    <Form onSubmit={handleFinalRegister}>
                        <Alert variant="info">
                            Mã OTP đã gửi đến: {formData.email}
                            {otpExpiresAt ? ` | Hết hạn lúc: ${new Date(otpExpiresAt).toLocaleTimeString('vi-VN', { hour12: false })}` : ''}
                        </Alert>
                        <Form.Group className="mb-3 text-center">
                            <Form.Label>Nhập mã 6 chữ số</Form.Label>
                            <Form.Control 
                                className="text-center fs-4" 
                                maxLength="6" 
                                required 
                                onChange={(e) => setUserOtp(e.target.value)} 
                            />
                        </Form.Group>
                        <Button variant="success" type="submit" className="w-100 mb-2">Xác nhận đăng ký</Button>
                        <Button variant="link" onClick={() => setStep(1)} className="w-100">Quay lại</Button>
                    </Form>
                )}
            </Card>
        </Container>
    );
};

export default Register;