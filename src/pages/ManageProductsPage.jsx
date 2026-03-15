import React, { useState, useEffect, useContext } from 'react';
import ProductTable from '../components/ProductTable';
import AddEditProductModal from '../components/AddEditProductModal';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { Container, Button, Alert } from 'react-bootstrap';

const ManageProductsPage = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const fetchProducts = () => {
        fetch('http://localhost:5000/products')
            .then(res => res.json())
            .then(data => setProducts(data))
            .catch(err => console.error("Lỗi fetch API:", err));
    };

    useEffect(() => {
        if (user && user.role === 'admin') {
            fetchProducts();
        }
    }, [user]);

    if (!user || user.role !== 'admin') {
        return (
            <Container className="mt-5 text-center">
                <Alert variant="danger" className="py-5 shadow">
                    <i className="bi bi-shield-lock display-1 d-block mb-3 text-danger"></i>
                    <h2 className="fw-bold">TRUY CẬP BỊ TỪ CHỐI!</h2>
                    <p>Bạn không có quyền quản trị để thao tác với dữ liệu sản phẩm.</p>
                    <Button variant="primary" className="mt-3" onClick={() => navigate('/login')}>Đăng nhập lại</Button>
                </Alert>
            </Container>
        );
    }

    const handleDelete = (id) => {
        if (window.confirm("Hành động này không thể hoàn tác. Bạn có chắc chắn xóa?")) {
            fetch(`http://localhost:5000/products/${id}`, { method: 'DELETE' })
                .then(() => fetchProducts())
                .catch(err => console.error("Lỗi xóa:", err));
        }
    };

    const handleAddNew = () => {
        setEditingProduct(null);
        setShowModal(true);
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setShowModal(true);
    };

    return (
        <Container className="mt-5 mb-5">
            <Link to="/admin" className="btn btn-link text-decoration-none text-muted p-0 mb-3">
                <i className="bi bi-arrow-left me-1"></i> Quay lại Dashboard
            </Link>

            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold text-primary mb-0">Hệ thống kho hàng</h2>
                <Button variant="primary" onClick={handleAddNew} className="shadow-sm">
                    <i className="bi bi-plus-lg me-2"></i>Thêm sản phẩm
                </Button>
            </div>

            <div className="card shadow border-0">
                <div className="card-body p-0">
                    <ProductTable products={products} onEdit={handleEdit} onDelete={handleDelete} />
                </div>
            </div>

            <AddEditProductModal
                show={showModal}
                handleClose={() => setShowModal(false)}
                currentProduct={editingProduct}
                refreshData={fetchProducts}
            />
        </Container>
    );
};

export default ManageProductsPage;