import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext'; 
import { Container, Alert, Button } from 'react-bootstrap';

const Admin = () => {
    const { user } = useContext(AuthContext); 
    const navigate = useNavigate();

    if (!user || user.role !== 'admin') {
        return (
            <Container className="mt-5 text-center">
                <Alert variant="danger" className="py-5 shadow-sm border-0">
                    <i className="bi bi-shield-lock display-1 d-block mb-3 text-danger"></i>
                    <h2 className="fw-bold">TRUY CẬP BỊ TỪ CHỐI!</h2>
                    <p className="lead text-muted">Bạn không có quyền quản trị để truy cập vào Bảng điều khiển (Dashboard).</p>
                    <hr className="my-4" />
                    <Button variant="primary" size="lg" onClick={() => navigate('/login')}>
                        Đăng nhập bằng tài khoản Admin
                    </Button>
                </Alert>
            </Container>
        );
    }
    return (
        <div className="container mt-5">
            <div className="bg-light p-5 rounded-3 shadow-sm mb-5">
                <h1 className="fw-bold text-primary mb-3">Trang Quản Trị Hệ Thống</h1>
                <p className="lead text-muted">Chào mừng Admin đã quay trở lại. Hãy chọn chức năng bạn muốn thao tác hôm nay.</p>
            </div>

            <div className="row g-4">
                <div className="col-md-4">
                    <div className="card text-white bg-dark h-100 shadow border-0">
                        <div className="card-body d-flex flex-column align-items-center justify-content-center py-5">
                            <i className="bi bi-laptop display-1 mb-3 text-info"></i>
                            <h4 className="card-title fw-bold">Quản Lý Sản Phẩm</h4>
                            <p className="text-center text-light opacity-75">Thêm, sửa, xóa các thiết bị trong cửa hàng.</p>
                            <Link to="/admin/products" className="btn btn-info mt-3 fw-bold px-4">
                                Truy cập ngay
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card text-white bg-primary h-100 shadow border-0">
                        <div className="card-body d-flex flex-column align-items-center justify-content-center py-5">
                            <i className="bi bi-clipboard-data display-1 mb-3 text-warning"></i>
                            <h4 className="card-title fw-bold">Quản Lý Đơn Hàng</h4>
                            <p className="text-center text-light opacity-75">Xem, cập nhật trạng thái và quản lý đơn hàng.</p>
                            <Link to="/admin/orders" className="btn btn-warning mt-3 fw-bold px-4">
                                Truy cập ngay
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Admin;