import React from 'react';

const ProductTable = ({ products, onEdit, onDelete }) => {
    return (
        <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle shadow-sm">
                <thead className="table-dark">
                    <tr>
                        <th className="text-center">ID</th>
                        <th>Hình ảnh</th>
                        <th>Tên sản phẩm</th>
                        <th>Giá</th>
                        <th>Danh mục</th>
                        <th className="text-center">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.id}>
                            <td className="text-center">{product.id}</td>
                            <td>
                                <img
                                    src={product.image || 'https://via.placeholder.com/50'}
                                    alt={product.name}
                                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                    className="rounded border"
                                />
                            </td>
                            <td className="fw-bold">{product.name}</td>
                            <td className="text-danger fw-bold">${product.price}</td>
                            <td>{product.category}</td>
                            <td className="text-center">
                                <button className="btn btn-warning btn-sm me-2" onClick={() => onEdit(product)}>
                                    <i className="bi bi-pencil-square me-1"></i> Sửa
                                </button>
                                <button className="btn btn-danger btn-sm" onClick={() => onDelete(product.id)}>
                                    <i className="bi bi-trash me-1"></i> Xóa
                                </button>
                            </td>
                        </tr>
                    ))}

                    {products.length === 0 && (
                        <tr>
                            <td colSpan="6" className="text-center text-muted py-4">
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