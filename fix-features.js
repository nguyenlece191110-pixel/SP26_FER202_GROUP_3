const fs = require('fs');

try {
  // Đọc file db.json
  const content = fs.readFileSync('./db.json', 'utf8');
  const db = JSON.parse(content);
  
  // Features mẫu
  const laptopFeatures = [
    "Màn hình Full HD sắc nét",
    "Hiệu năng mạnh mẽ",
    "SSD siêu nhanh", 
    "Thiết kế mỏng nhẹ",
    "Pin lâu dài",
    "Bảo hành 24 tháng"
  ];
  
  const phoneFeatures = [
    "Màn hình cảm ứng sắc nét",
    "Camera chất lượng cao",
    "Pin dung lượng lớn",
    "Hệ điều hành mới",
    "5G tốc độ cao",
    "Bảo hành 12 tháng"
  ];
  
  const accessoryFeatures = [
    "Thiết kế hiện đại",
    "Chất lượng cao",
    "Dễ sử dụng",
    "Tương thích tốt",
    "Giá trị cao",
    "Bảo hành 12 tháng"
  ];
  
  // Thêm features cho từng sản phẩm
  db.products.forEach(product => {
    if (!product.features) {
      if (product.category === 'laptop') {
        product.features = laptopFeatures;
      } else if (product.category === 'phone') {
        product.features = phoneFeatures;
      } else {
        product.features = accessoryFeatures;
      }
    }
  });
  
  // Ghi lại file
  fs.writeFileSync('./db.json', JSON.stringify(db, null, 2));
  console.log('Đã thêm features cho tất cả sản phẩm!');
  
} catch (error) {
  console.error('Lỗi:', error.message);
}
