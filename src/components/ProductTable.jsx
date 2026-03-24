import React from 'react';
import { Form } from 'react-bootstrap';

const ProductTable = ({ products, onEdit, onDelete, onToggle, selectedIds, setSelectedIds, startIndex = 0 }) => {
    
    // Xử lý tick chọn "Tất cả"
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedIds(products.map(p => p.id));
        } else {
            setSelectedIds([]);
        }
    };

    // Xử lý tick chọn từng dòng
    const handleSelectOne = (e, id) => {
        if (e.target.checked) {
            setSelectedIds([...selectedIds, id]);
        } else {
            setSelectedIds(selectedIds.filter(itemId => itemId !== id));
        }
    };

    const formatVND = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    return (
        <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle shadow-sm mb-0">
                <thead className="table-dark">
                    <tr>
                        <th className="text-center" style={{ width: '5%' }}>
                            <Form.Check 
                                type="checkbox" 
                                onChange={handleSelectAll} 
                                checked={products.length > 0 && selectedIds.length === products.length} 
                            />
                        </th>
                        <th className="text-center" style={{ width: '5%' }}>STT</th>
                        <th className="text-center" style={{ width: '10%' }}>Hình ảnh</th>
                        <th style={{ width: '25%' }}>Tên sản phẩm</th>
                        <th style={{ width: '15%' }}>Giá</th>
                        <th style={{ width: '20%' }}>Email</th>
                        <th style={{ width: '15%' }}>Trạng thái (Kho)</th>
                        <th className="text-center" style={{ width: '20%' }}>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product, index) => {
                        const imageUrl = (product.images && product.images.length > 0) ? product.images[0] : (product.image || 'https://via.placeholder.com/50');
                        return (
                            <tr key={product.id} className={selectedIds.includes(product.id) ? "table-primary" : ""}>
                                <td className="text-center">
                                    <Form.Check 
                                        type="checkbox" 
                                        onChange={(e) => handleSelectOne(e, product.id)} 
                                        checked={selectedIds.includes(product.id)} 
                                    />
                                </td>
                                <td className="text-center text-muted fw-bold">{startIndex + index + 1}</td>
                                <td className="text-center">
                                    <img src={imageUrl} alt={product.name} style={{ width: '50px', height: '50px', objectFit: 'cover' }} className="rounded border shadow-sm" onError={(e) => { e.target.src = 'https://via.placeholder.com/50'; }} />
                                </td>
                                <td className="fw-bold">
                                    {product.name}
                                    <br/>
                                    <span className="badge bg-secondary text-uppercase" style={{fontSize: '10px'}}>{product.category}</span>
                                </td>
                                <td className="text-danger fw-bold">{formatVND(product.price)}</td>
                                <td className="text-truncate" title={product.email || 'N/A'}>{product.email || 'N/A'}</td>
                                {/* Cột Trạng thái mới với thanh Toggle Gạt */}
                                <td>
                                    <div className="d-flex align-items-center gap-2">
                                        <Form.Check 
                                            type="switch" 
                                            id={`switch-${product.id}`}
                                            checked={product.quantity > 0} 
                                            onChange={() => onToggle(product)} 
                                            className="fs-5"
                                        />
                                        <div>
                                            {product.quantity > 0 ? (
                                                <span className="text-success fw-bold small">Kho: {product.quantity}</span>
                                            ) : (
                                                <span className="text-danger fw-bold small">Hết hàng</span>
                                            )}
                                        </div>
                                    </div>
                                </td>

                                <td>
                                    <div className="d-flex justify-content-center gap-2">
                                        <button className="btn btn-warning btn-sm d-flex align-items-center text-nowrap" onClick={() => onEdit(product)}>
                                            <i className="bi bi-pencil-square me-1"></i> Sửa
                                        </button>
                                        <button className="btn btn-danger btn-sm d-flex align-items-center text-nowrap" onClick={() => onDelete(product.id)}>
                                            <i className="bi bi-trash me-1"></i> Xóa
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                    {products.length === 0 && (
                        <tr>
                            <td colSpan="8" className="text-center text-muted py-5">
                                <i className="bi bi-inbox display-4 d-block mb-2"></i>
                                Không tìm thấy sản phẩm nào.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ProductTable;