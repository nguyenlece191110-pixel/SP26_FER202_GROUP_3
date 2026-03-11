import React from 'react';

const ProductCard = ({ item }) => {
  // item.images là mảng nên ta lấy phần tử đầu tiên [0]
  const imageUrl = item.images && item.images.length > 0 ? item.images[0] : '/images/default.png';

  return (
    <div className="card h-100 shadow-sm border-0">
      {/* Hiển thị ảnh sản phẩm */}
      <img src={imageUrl} className="card-img-top p-3" alt={item.name} style={{ height: '200px', objectFit: 'contain' }} />
      
      <div className="card-body">
        <span className="badge bg-secondary mb-2">{item.brand}</span>
        <h5 className="card-title fw-bold">{item.name}</h5>
        <p className="card-text text-truncate">{item.description}</p>
        
        <div className="d-flex justify-content-between align-items-center mt-3">
          <h5 className="text-danger mb-0">
            {item.price.toLocaleString('vi-VN')} VND
          </h5>
          <button className="btn btn-outline-primary">Chi tiết</button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;