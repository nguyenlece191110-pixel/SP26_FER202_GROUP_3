# QR Code Instructions

## Cách thêm QR code của bạn

### 1. Chuẩn bị QR code
- Lưu QR code ngân hàng của bạn với tên: `banking-qr.png`
- Định dạng: PNG, JPG hoặc JPEG
- Kích thước đề xuất: 256x256 pixels

### 2. Upload QR codes
- Copy file `banking-qr.png` vào thư mục `public/images/`

### 3. Cấu hình thông tin thanh toán
Trong file `src/pages/Cart.jsx`, bạn có thể thay đổi thông tin:

```javascript
// Banking thông tin
<strong>Ngân hàng:</strong> Vietcombank<br />
<strong>Số tài khoản:</strong> 1234567890<br />
<strong>Chủ tài khoản:</strong> LAPTOP STORE
```

### 4. File paths
- Banking QR: `/images/banking-qr.png`

### 5. Test
- Thêm sản phẩm vào giỏ hàng
- Chọn thanh toán Banking
- Kiểm tra QR code hiển thị đúng chưa

## Lưu ý
- QR code phải là ảnh thật của tài khoản của bạn
- Người dùng sẽ quét mã này để thanh toán
- Đảm bảo thông tin hiển thị khớp với QR code
