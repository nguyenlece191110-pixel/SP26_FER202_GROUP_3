import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';

const AddEditProductModal = ({ show, handleClose, currentProduct, refreshData }) => {
    const [formData, setFormData] = useState({
        name: '', price: '', category: '', brand: '', image: '', description: '', discount: 0, quantity: 0
    });

    useEffect(() => {
        if (currentProduct) {
            setFormData({ ...currentProduct, image: currentProduct.images ? currentProduct.images[0] : currentProduct.image || '', quantity: currentProduct.quantity || 0 });
        } else {
            setFormData({ name: '', price: '', category: '', brand: '', image: '', description: '', discount: 0, quantity: 0 });
        }
    }, [currentProduct, show]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.price <= 0) {
            toast.error("Giá sản phẩm phải lớn hơn 0!");
            return;
        }

        const isEdit = !!currentProduct;
        const url = isEdit ? `http://localhost:5000/products/${currentProduct.id}` : 'http://localhost:5000/products';
        const payload = {
            ...formData, price: Number(formData.price), discount: Number(formData.discount), quantity: Number(formData.quantity),
            inStock: Number(formData.quantity) > 0, images: [formData.image]
        };

        fetch(url, {
            method: isEdit ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        }).then(() => {
            toast.success(isEdit ? "Cập nhật thành công!" : "Đã thêm sản phẩm mới!");
            refreshData();
            handleClose();
        });
    };

    return (
        <Modal show={show} onHide={handleClose} centered size="lg">
            <Modal.Header closeButton className="bg-dark text-white">
                <Modal.Title>{currentProduct ? 'Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới'}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    <Row className="mb-3">
                        <Col md={8}><Form.Label>Tên sản phẩm</Form.Label><Form.Control name="name" value={formData.name} onChange={handleChange} required /></Col>
                        <Col md={4}><Form.Label>Giá (VND)</Form.Label><Form.Control type="number" name="price" value={formData.price} onChange={handleChange} required /></Col>
                    </Row>
                    <Row className="mb-3">
                        <Col md={4}><Form.Label>Danh mục</Form.Label>
                            <Form.Select name="category" value={formData.category} onChange={handleChange} required>
                                <option value="">-- Chọn --</option><option value="laptop">Laptop</option><option value="phone">Điện thoại</option><option value="accessories">Phụ kiện & Khác</option>
                            </Form.Select>
                        </Col>
                        <Col md={4}><Form.Label>Thương hiệu</Form.Label><Form.Control type="text" name="brand" value={formData.brand} onChange={handleChange} required /></Col>
                        <Col md={4}><Form.Label>% Giảm giá</Form.Label><Form.Control type="number" name="discount" value={formData.discount} onChange={handleChange} min="0" max="100" /></Col>
                    </Row>
                    <Row className="mb-3">
                        <Col md={9}><Form.Label>Link Hình ảnh</Form.Label><Form.Control name="image" value={formData.image} onChange={handleChange} required /></Col>
                        <Col md={3} className="d-flex align-items-end">
                            {/* Hiển thị ảnh xem trước */}
                            {formData.image ?
                                <img src={formData.image} alt="preview" className="img-thumbnail" style={{ height: '60px', width: '100%', objectFit: 'contain' }} onError={(e) => e.target.src = 'https://via.placeholder.com/60'} />
                                : <div className="border text-center text-muted p-2 w-100" style={{ height: '60px', fontSize: '12px' }}>Chưa có ảnh</div>
                            }
                        </Col>
                    </Row>
                    <Form.Group className="mb-3"><Form.Label>Mô tả</Form.Label><Form.Control as="textarea" rows={2} name="description" value={formData.description} onChange={handleChange} /></Form.Group>
                    <Row className="mb-3">
                        <Col md={12}>
                            <Form.Group>
                                <Form.Label className="fw-bold text-success">Số lượng nhập kho</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="quantity"
                                    value={formData.quantity}
                                    onChange={handleChange}
                                    min="0"
                                    required
                                />
                            </Form.Group>
                        </Col>
                    </Row>                </Modal.Body>
                <Modal.Footer><Button variant="secondary" onClick={handleClose}>Hủy</Button><Button variant="primary" type="submit">Lưu</Button></Modal.Footer>
            </Form>
        </Modal>
    );
};
export default AddEditProductModal;