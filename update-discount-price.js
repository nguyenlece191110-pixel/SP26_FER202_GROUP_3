const fs = require('fs');

// Đọc db.json
const db = JSON.parse(fs.readFileSync('./db.json', 'utf8'));

// Cập nhật tất cả sản phẩm có discount để thêm discountPrice
db.products.forEach(product => {
    if (product.discount && product.discount > 0) {
        // Tính giá giảm
        product.discountPrice = Math.round(product.price * (1 - product.discount / 100));
        console.log(`Updated ${product.name}: price=${product.price}, discount=${product.discount}%, discountPrice=${product.discountPrice}`);
    } else {
        // Đảm bảo không có discountPrice cho sản phẩm không giảm giá
        if (product.discountPrice) {
            delete product.discountPrice;
        }
    }
});

// Ghi lại db.json
fs.writeFileSync('./db.json', JSON.stringify(db, null, 2));

console.log('Đã cập nhật discountPrice cho tất cả sản phẩm!');
