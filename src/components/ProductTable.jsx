import React from 'react';

const ProductTable = ({ products, onEdit, onDelete }) => {
    const formatVND = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    return (
        <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle shadow-sm mb-0">
                <thead className="table-dark">
                    <tr>
                        <th className="text-center" style={{ width: '5%' }}>STT</th>
                        <th className="text-center" style={{ width: '10%' }}>Hình ảnh</th>
                        <th style={{ width: '25%' }}>Tên sản phẩm</th>
                        <th style={{ width: '15%' }}>Giá</th>
                        <th style={{ width: '15%' }}>Danh mục</th>
                        <th style={{ width: '10%' }}>Trạng thái</th>
                        <th className="text-center" style={{ width: '20%' }}>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product, index) => {
                        const imageUrl = (product.images && product.images.length > 0)
                            ? product.images[0]
                            : (product.image || 'https://via.placeholder.com/50');

                        return (
                            <tr key={product.id}>
                                <td className="text-center text-muted fw-bold">{index + 1}</td>
                                <td className="text-center">
                                    <img
                                        src={imageUrl}
                                        alt={product.name}
                                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                        className="rounded border shadow-sm"
                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/50'; }}
                                    />
                                </td>
                                <td className="fw-bold">{product.name}</td>
                                <td className="text-danger fw-bold">{formatVND(product.price)}</td>
                                <td>
                                    <span className="badge bg-secondary text-uppercase">
                                        {product.category}
                                    </span>
                                </td>
                                <td>
                                    {product.inStock ?
                                        <span className="text-success small fw-bold">● Còn hàng</span> :
                                        <span className="text-danger small fw-bold">○ Hết hàng</span>
                                    }
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
                            <td colSpan="7" className="text-center text-muted py-5">
                                <i className="bi bi-inbox display-4 d-block mb-2"></i>
                                Chưa có sản phẩm nào trong kho.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ProductTable;