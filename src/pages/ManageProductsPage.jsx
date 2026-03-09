import React, { useState, useEffect } from 'react';
import ProductTable from '../components/ProductTable';
import AddEditProductModal from '../components/AddEditProductModal';
import { Link } from 'react-router-dom';

const ManageProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    // READ: Lấy dữ liệu
    const fetchProducts = () => {
        fetch('http://localhost:5000/products')
            .then(res => res.json())
            .then(data => setProducts(data))
            .catch(err => console.error("Lỗi fetch API:", err));
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // DELETE: Xóa dữ liệu
    const handleDelete = (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) {
            fetch(`http://localhost:5000/products/${id}`, { method: 'DELETE' })
                .then(() => {
                    alert("Đã xóa thành công!");
                    fetchProducts();
                })
                .catch(err => console.error("Lỗi xóa:", err));
        }
    };

    // Mở popup
    const handleAddNew = () => {
        setEditingProduct(null);
        setShowModal(true);
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setShowModal(true);
    };

    return (
        <div className="container mt-5 mb-5">
            {/* Nút quay lại Dashboard */}
            <Link to="/admin" className="text-decoration-none text-muted mb-3 d-inline-block">
                <i className="bi bi-arrow-left me-1"></i> Quay lại Admin Dashboard
            </Link>

            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold text-primary">Quản lý Sản phẩm</h2>
                <button className="btn btn-primary" onClick={handleAddNew}>
                    <i className="bi bi-plus-lg me-2"></i>Thêm sản phẩm
                </button>
            </div>

            {/* Lắp cái Bảng vào */}
            <div className="card shadow border-0">
                <div className="card-body p-0">
                    <ProductTable products={products} onEdit={handleEdit} onDelete={handleDelete} />
                </div>
            </div>

            {/* Lắp cái Popup vào */}
            <AddEditProductModal
                show={showModal}
                handleClose={() => setShowModal(false)}
                currentProduct={editingProduct}
                refreshData={fetchProducts}
            />
        </div>
    );
};

export default ManageProductsPage;