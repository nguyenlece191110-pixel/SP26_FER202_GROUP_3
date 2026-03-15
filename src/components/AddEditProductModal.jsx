import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';

const AddEditProductModal = ({ show, handleClose, currentProduct, refreshData }) => {
    const [formData, setFormData] = useState({ 
        name: '', price: '', category: '', brand: '', image: '', description: '', discount: 0, inStock: true 
    });

    useEffect(() => {
        if (currentProduct) {
            setFormData({
                ...currentProduct,
                image: currentProduct.images ? currentProduct.images[0] : currentProduct.image || '',
            });
        } else {
            setFormData({ name: '', price: '', category: '', brand: '', image: '', description: '', discount: 0, inStock: true });
        }
    }, [currentProduct, show]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.price <= 0) return alert("Giá sản phẩm phải lớn hơn 0!");

        const isEdit = !!currentProduct;
        const url = isEdit ? `http://localhost:5000/products/${currentProduct.id}` : 'http://localhost:5000/products';
        
        const payload = {
            ...formData,
            price: Number(formData.price),
            discount: Number(formData.discount),
            images: [formData.image], 
        };

        fetch(url, {
            method: isEdit ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        .then(() => {
            alert(isEdit ? "Cập nhật thành công!" : "Thêm mới thành công!");
            refreshData();
            handleClose();
        })
        .catch(err => console.error("Lỗi API:", err));
    };

    return (
        <Modal show={show} onHide={handleClose} centered size="lg">
            <Modal.Header closeButton className="bg-dark text-white">
                <Modal.Title>{currentProduct ? 'Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới'}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    <Row className="mb-3">
                        <Col md={8}><Form.Label className="fw-bold">Tên sản phẩm</Form.Label><Form.Control name="name" value={formData.name} onChange={handleChange} required /></Col>
                        <Col md={4}><Form.Label className="fw-bold">Giá (VND)</Form.Label><Form.Control type="number" name="price" value={formData.price} onChange={handleChange} required /></Col>
                    </Row>
                    <Row className="mb-3">
                        <Col md={4}>
                            <Form.Label className="fw-bold">Danh mục (Khớp với Shop)</Form.Label>
                            <Form.Select name="category" value={formData.category} onChange={handleChange} required>
                                <option value="">-- Chọn --</option>
                                <option value="laptop">Laptop</option>
                                <option value="phone">Điện thoại</option>
                                <option value="accessories">Phụ kiện & Khác</option>
                            </Form.Select>
                        </Col>
                        <Col md={4}>
                            <Form.Label className="fw-bold">Thương hiệu</Form.Label>
                            <Form.Control type="text" name="brand" placeholder="Vd: Acer, Apple..." value={formData.brand} onChange={handleChange} required />
                        </Col>
                        <Col md={4}>
                            <Form.Label className="fw-bold">% Giảm giá</Form.Label>
                            <Form.Control type="number" name="discount" value={formData.discount} onChange={handleChange} min="0" max="100" />
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col md={12}><Form.Label className="fw-bold">Link Hình ảnh (URL)</Form.Label><Form.Control name="image" value={formData.image} onChange={handleChange} placeholder="https://..." required /></Col>
                    </Row>
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">Mô tả chi tiết</Form.Label>
                        <Form.Control as="textarea" rows={3} name="description" value={formData.description} onChange={handleChange} />
                    </Form.Group>
                    <Form.Check type="checkbox" label="Còn hàng (Hiển thị nút Mua)" name="inStock" checked={formData.inStock} onChange={handleChange} className="fw-bold text-success" />
                </Modal.Body>
                <Modal.Footer className="bg-light">
                    <Button variant="secondary" onClick={handleClose}>Hủy</Button>
                    <Button variant="primary" type="submit">Lưu dữ liệu</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default AddEditProductModal;