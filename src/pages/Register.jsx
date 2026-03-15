import React, { useState } from 'react';
import { Container, Form, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';

export default function Register() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newUser = { name, email, password, role: "user" };
        try {
            // Lệnh quan trọng nhất để dữ liệu hiện lên tab Network
            await axios.post('http://localhost:5000/users', newUser);
            alert('Đăng ký thành công!');
            navigate('/login');
        } catch (error) {
            alert('Lỗi! Bạn đã bật json-server chưa?');
        }
    };

    return (
        <Container className="d-flex justify-content-center mt-5">
            <Card style={{ width: '400px' }} className="p-4 shadow">
                <h3 className="text-center mb-4">Đăng ký</h3>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Họ tên</Form.Label>
                        <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Mật khẩu</Form.Label>
                        <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </Form.Group>
                    <Button variant="success" type="submit" className="w-100">Đăng ký ngay</Button>
                </Form>
            </Card>
        </Container>
    );
}