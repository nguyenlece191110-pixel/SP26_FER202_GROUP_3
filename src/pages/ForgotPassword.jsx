import React, { useContext, useMemo, useState } from 'react';
import { Alert, Button, Card, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import emailjs from '@emailjs/browser';
import { AuthContext } from '../AuthContext';
import { API_ENDPOINTS } from '../config/api';
import '../App.css';

const OTP_TTL_MS = 5 * 60 * 1000;

export default function ForgotPassword() {
    const navigate = useNavigate();
    const { resetPassword } = useContext(AuthContext);

    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [systemOtp, setSystemOtp] = useState('');
    const [userOtp, setUserOtp] = useState('');
    const [otpExpiresAt, setOtpExpiresAt] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const formattedExpiresAt = useMemo(() => {
        if (!otpExpiresAt) return '';
        return new Date(otpExpiresAt).toLocaleTimeString('vi-VN', { hour12: false });
    }, [otpExpiresAt]);

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const cleanEmail = email.trim();
        if (!cleanEmail) {
            setError('Vui lòng nhập email.');
            return;
        }

        setLoading(true);
        try {
            const userRes = await axios.get(`${API_ENDPOINTS.USERS}?email=${encodeURIComponent(cleanEmail)}`);
            if (!Array.isArray(userRes.data) || userRes.data.length === 0) {
                setError('Email chưa được đăng ký trong hệ thống.');
                return;
            }

            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const expiresAt = Date.now() + OTP_TTL_MS;
            const expiresAtText = new Date(expiresAt).toLocaleString('vi-VN', { hour12: false });

            await emailjs.send(
                'service_ugdo9iz',
                'template_8bwu5in',
                {
                    to_email: cleanEmail,
                    email: cleanEmail,
                    user_email: cleanEmail,
                    recipient_email: cleanEmail,
                    otp,
                    otp_ttl_minutes: 5,
                    otp_countdown: '05:00',
                    otp_expires_at: expiresAtText,
                    otp_expire_time: expiresAtText,
                    time: expiresAtText
                },
                'xWKN2ZcMfxpmGDmHA'
            );

            setSystemOtp(otp);
            setOtpExpiresAt(expiresAt);
            setStep(2);
            setSuccess('Mã OTP đã được gửi vào email của bạn.');
        } catch (err) {
            setError('Không thể gửi OTP. Vui lòng kiểm tra lại cấu hình EmailJS.');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!otpExpiresAt || Date.now() > otpExpiresAt) {
            setError('Mã OTP đã hết hạn. Vui lòng gửi lại mã mới.');
            setStep(1);
            return;
        }

        if (userOtp.trim() !== systemOtp) {
            setError('Mã OTP không chính xác.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Mật khẩu xác nhận không khớp.');
            return;
        }

        setLoading(true);
        try {
            const result = await resetPassword(email, newPassword);
            if (!result.success) {
                setError(result.message);
                return;
            }

            setSuccess('Đổi mật khẩu thành công. Bạn có thể đăng nhập lại ngay bây giờ.');
            setTimeout(() => navigate('/login'), 900);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page-bg">
            <Card style={{ width: '420px' }} className="p-4 glass-card">
                <h3 className="text-center mb-4 fw-bold">Quên Mật Khẩu</h3>
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}

                {step === 1 ? (
                    <Form onSubmit={handleSendOtp}>
                        <Form.Group className="mb-3">
                            <Form.Label>Email tài khoản</Form.Label>
                            <Form.Control
                                className="glass-input p-2"
                                type="email"
                                placeholder="Nhập email đã đăng ký"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Button type="submit" className="w-100 py-2 btn-login-custom" disabled={loading}>
                            {loading ? 'Đang gửi OTP...' : 'Gửi mã OTP'}
                        </Button>
                    </Form>
                ) : (
                    <Form onSubmit={handleResetPassword}>
                        <Alert variant="info">
                            OTP đã gửi tới: {email}
                            {formattedExpiresAt ? ` | Hết hạn lúc: ${formattedExpiresAt}` : ''}
                        </Alert>

                        <Form.Group className="mb-3">
                            <Form.Label>Mã OTP</Form.Label>
                            <Form.Control
                                className="glass-input p-2"
                                placeholder="Nhập 6 chữ số"
                                maxLength={6}
                                value={userOtp}
                                onChange={(e) => setUserOtp(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Mật khẩu mới</Form.Label>
                            <Form.Control
                                className="glass-input p-2"
                                type="password"
                                placeholder="Nhập mật khẩu mới"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Xác nhận mật khẩu mới</Form.Label>
                            <Form.Control
                                className="glass-input p-2"
                                type="password"
                                placeholder="Nhập lại mật khẩu mới"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Button type="submit" className="w-100 py-2 btn-login-custom" disabled={loading}>
                            {loading ? 'Đang cập nhật...' : 'Đặt lại mật khẩu'}
                        </Button>
                    </Form>
                )}

                <div className="text-center mt-3">
                    <Link to="/login" style={{ color: '#fff' }}>
                        Quay lại đăng nhập
                    </Link>
                </div>
            </Card>
        </div>
    );
}
