import React, { useState, useContext } from 'react';
import { AuthContext } from '../AuthContext'; 
import { Form, Button, Card } from 'react-bootstrap';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import '../App.css'; // Import file CSS hiệu ứng kính mờ

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, loginWithGoogle } = useContext(AuthContext);

    const handleSubmit = (e) => {
        e.preventDefault();
        const cleanEmail = email.trim();
        const cleanPassword = password; 
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
        // Thẻ bọc ngoài cùng chứa background image
        <div className="login-page-bg">
            <Card style={{ width: '420px' }} className="p-4 glass-card">
                <h3 className="text-center mb-4 fw-bold">Đăng nhập TechHub</h3>
                
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control 
                            type="email" 
                            className="glass-input p-2"
                            value={email} 
                            placeholder="Nhập email của bạn"
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </Form.Group>
                    
                    <Form.Group className="mb-4">
                        <Form.Label>Mật khẩu</Form.Label>
                        <Form.Control 
                            type="password" 
                            className="glass-input p-2"
                            value={password} 
                            placeholder="Nhập mật khẩu"
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </Form.Group>
                    
                    <Button type="submit" className="w-100 py-2 btn-login-custom">
                        Vào hệ thống
                    </Button>
                </Form>

                <div className="text-center my-4">
                    <span
                        style={{ color: '#eee', fontSize: '0.9rem' }}
                    >
                        hoặc đăng nhập bằng
                    </span>
                </div>
                
                <div className="d-flex justify-content-center">
                    <GoogleLogin 
                        onSuccess={handleGoogleSuccess} 
                        onError={() => alert('Đăng nhập Google thất bại!')}
                        theme="outline" // Giúp nút Google nhìn gọn gàng hơn trên nền tối/kính
                    />
                </div>
            </Card>
        </div>
    );
}