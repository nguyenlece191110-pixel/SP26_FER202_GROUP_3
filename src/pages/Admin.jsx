import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { Container, Row, Col, Card, Alert, Button } from 'react-bootstrap';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Admin = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [stats, setStats] = useState({ totalProducts: 0, chartData: [] });

    // Lấy dữ liệu để vẽ biểu đồ
    useEffect(() => {
        if (user && user.role === 'admin') {
            fetch('http://localhost:5000/products')
                .then(res => res.json())
                .then(data => {
                    // Đếm số lượng sản phẩm
                    const total = data.length;

                    // Gom nhóm sản phẩm theo danh mục để vẽ biểu đồ
                    const categories = data.reduce((acc, curr) => {
                        const cat = curr.category || 'Khác';
                        acc[cat] = (acc[cat] || 0) + 1;
                        return acc;
                    }, {});

                    const chartData = Object.keys(categories).map(key => ({
                        name: key.toUpperCase(),
                        "Số lượng": categories[key]
                    }));

                    setStats({ totalProducts: total, chartData });
                });
        }
    }, [user]);

    if (!user || user.role !== 'admin') {
        return (
            <Container className="mt-5 text-center">
                <Alert variant="danger" className="py-5 shadow-sm border-0">
                    <h2 className="fw-bold">TRUY CẬP BỊ TỪ CHỐI!</h2>
                    <Button variant="primary" className="mt-3" onClick={() => navigate('/login')}>Đăng nhập Admin</Button>
                </Alert>
            </Container>
        );
    }

    return (
        <Container className="mt-5 mb-5">
            <div className="bg-light p-4 rounded-3 shadow-sm mb-4 border-start border-primary border-5 d-flex justify-content-between align-items-center">
                <div>
                    <h2 className="fw-bold text-primary mb-1">Bảng Điều Khiển (Dashboard)</h2>
                    <p className="text-muted mb-0">Xin chào, <strong>{user.name}</strong>!</p>
                </div>
            </div>

            {/* Các thẻ thống kê */}
            <Row className="g-4 mb-5">
                <Col md={4}>
                    <Card className="shadow-sm border-0 bg-primary text-white h-100">
                        <Card.Body className="d-flex align-items-center">
                            <i className="bi bi-box-seam display-4 me-3 opacity-75"></i>
                            <div>
                                <h5 className="mb-0">Tổng Sản Phẩm</h5>
                                <h2 className="fw-bold mb-0">{stats.totalProducts} thiết bị</h2>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="shadow-sm border-0 bg-success text-white h-100">
                        <Card.Body className="d-flex align-items-center justify-content-between">
                            <div>
                                <h5 className="mb-2">Quản Lý Kho Hàng</h5>
                                <p className="mb-0 small opacity-75">Thêm, sửa, xóa, tìm kiếm thiết bị</p>
                            </div>
                            <Link to="/admin/products" className="btn btn-light text-success fw-bold stretched-link">Vào Kho</Link>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="shadow-sm border-0 bg-warning text-dark h-100">
                        <Card.Body className="d-flex align-items-center justify-content-between">
                            <div>
                                <h5 className="mb-2 fw-bold">Quản Lý Đơn Hàng</h5>
                                <p className="mb-0 small opacity-75">Xem và xử lý hóa đơn khách hàng</p>
                            </div>
                            <Link to="/admin/orders" className="btn btn-light text-warning fw-bold stretched-link">
                                Kiểm tra
                            </Link>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Biểu đồ Thống kê */}
            <h4 className="fw-bold mb-3 text-secondary">Phân bổ danh mục sản phẩm</h4>
            <div className="bg-white p-4 rounded shadow-sm border" style={{ height: '400px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Số lượng" fill="#0d6efd" barSize={50} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Container>
    );
};

export default Admin;