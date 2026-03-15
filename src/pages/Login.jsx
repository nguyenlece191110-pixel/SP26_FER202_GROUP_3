import React, { useState, useContext } from 'react';
import { AuthContext } from '../AuthContext'; 
import { Container, Form, Button, Card } from 'react-bootstrap';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, loginWithGoogle } = useContext(AuthContext);

    const handleSubmit = (e) => {
        e.preventDefault();
        // loại bỏ dấu cách vô ý ở đầu/cuối
        const cleanEmail = email.trim();
        const cleanPassword = password; // có thể trim nếu cần
        console.debug('submitting', { cleanEmail, cleanPassword });
        login(cleanEmail, cleanPassword);
    };

    const handleGoogleSuccess = (credentialResponse) => {
        try {
            if (!credentialResponse?.credential) {
                throw new Error('Missing Google credential');
            }
            const decoded = jwtDecode(credentialResponse.credential);
            loginWithGoogle({
                email: decoded.email,
                name: decoded.name,
                picture: decoded.picture
            });
        } catch (error) {
            console.error('Google decode error:', error);
            alert('Không thể đọc dữ liệu từ Google. Vui lòng thử lại.');
        }
    };

    return (
        <Container className="d-flex justify-content-center mt-5">
            <Card style={{ width: '400px' }} className="p-4 shadow">
                <h3 className="text-center mb-4">Đăng nhập TechHub</h3>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Mật khẩu</Form.Label>
                        <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </Form.Group>
                    <Button variant="primary" type="submit" className="w-100">Vào hệ thống</Button>
                </Form>

                <div className="text-center my-3 text-muted">hoặc</div>
                <div className="d-flex justify-content-center">
                    <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => alert('Đăng nhập Google thất bại!')} />
                </div>
            </Card>
        </Container>
    );
}