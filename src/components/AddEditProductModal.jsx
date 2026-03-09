import React, { useState, useEffect } from 'react';

const AddEditProductModal = ({ show, handleClose, currentProduct, refreshData }) => {
    const [formData, setFormData] = useState({ name: '', price: '', category: '', image: '' });

    // Cập nhật form mỗi khi mở popup
    useEffect(() => {
        if (currentProduct) {
            setFormData(currentProduct);
        } else {
            setFormData({ name: '', price: '', category: '', image: '' });
        }
    }, [currentProduct, show]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const isEdit = currentProduct ? true : false;
        const url = isEdit
            ? `http://localhost:5000/products/${currentProduct.id}`
            : 'http://localhost:5000/products';
        const method = isEdit ? 'PUT' : 'POST';

        fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        })
            .then(res => res.json())
            .then(() => {
                alert(isEdit ? "Cập nhật thành công!" : "Thêm mới thành công!");
                refreshData(); // Gọi hàm của Cha để load lại bảng
                handleClose(); // Tắt popup
            })
            .catch(err => console.error(err));
    };

    if (!show) return null;

    return (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 shadow">

                    <div className="modal-header bg-dark text-white">
                        <h5 className="modal-title">{currentProduct ? 'Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới'}</h5>
                        <button type="button" className="btn-close btn-close-white" onClick={handleClose}></button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label className="form-label fw-bold">Tên sản phẩm</label>
                                <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label fw-bold">Giá tiền ($)</label>
                                <input type="number" name="price" className="form-control" value={formData.price} onChange={handleChange} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label fw-bold">Danh mục</label>
                                <select name="category" className="form-select" value={formData.category} onChange={handleChange} required>
                                    <option value="">-- Chọn danh mục --</option>
                                    <option value="Laptop">Laptop</option>
                                    <option value="Điện thoại">Điện thoại</option>
                                    <option value="Phụ kiện">Phụ kiện</option>
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="form-label fw-bold">Link Hình ảnh (URL)</label>
                                <input type="text" name="image" className="form-control" placeholder="https://..." value={formData.image} onChange={handleChange} />
                            </div>
                        </div>

                        <div className="modal-footer bg-light">
                            <button type="button" className="btn btn-secondary" onClick={handleClose}>Hủy</button>
                            <button type="submit" className="btn btn-success">Lưu thay đổi</button>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    );
};

export default AddEditProductModal;