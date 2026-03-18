import React, { useState, useEffect, useContext } from 'react';
import ProductTable from '../components/ProductTable';
import AddEditProductModal from '../components/AddEditProductModal';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { Container, Button, Alert, Form, InputGroup, Pagination, Row, Col } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
const ManageProductsPage = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    // States cho Tìm kiếm, Lọc, Phân trang và Chọn hàng loạt
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [sortOption, setSortOption] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedIds, setSelectedIds] = useState([]); // Chứa danh sách ID đang được tick
    const itemsPerPage = 10;

    const fetchProducts = () => {
        fetch('http://localhost:5000/products')
            .then(res => res.json())
            .then(data => setProducts(data));
    };

    useEffect(() => {
        if (user && user.role === 'admin') fetchProducts();
    }, [user]);

    if (!user || user.role !== 'admin') {
        return <Container className="mt-5 text-center"><Alert variant="danger"><h2>TRUY CẬP BỊ TỪ CHỐI!</h2></Alert></Container>;
    }

    // 1. Xóa 1 sản phẩm
    const handleDelete = (id) => {
        Swal.fire({
            title: 'Bạn có chắc chắn muốn xóa?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            confirmButtonText: 'Đồng ý xóa!',
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`http://localhost:5000/products/${id}`, { method: 'DELETE' })
                    .then(() => { fetchProducts(); toast.success("Đã xóa sản phẩm!"); });
            }
        });
    };

    // 2. Xóa hàng loạt (Bulk Delete)
    const handleBulkDelete = () => {
        Swal.fire({
            title: `Xóa ${selectedIds.length} sản phẩm đã chọn?`,
            text: "Không thể hoàn tác thao tác này!",
            icon: 'danger',
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            confirmButtonText: 'Xóa tất cả',
        }).then((result) => {
            if (result.isConfirmed) {
                // Gửi cùng lúc nhiều lệnh Xóa
                Promise.all(selectedIds.map(id =>
                    fetch(`http://localhost:5000/products/${id}`, { method: 'DELETE' })
                )).then(() => {
                    fetchProducts();
                    setSelectedIds([]); // Xóa xong thì làm trống danh sách chọn
                    setCurrentPage(1);
                    toast.success("Đã dọn dẹp kho hàng thành công!");
                });
            }
        });
    };

    // 3. Nút Gạt Trạng Thái Nhanh (Toggle Status)
    const handleToggleStatus = (product) => {
        const newQuantity = product.quantity > 0 ? 0 : 10; // Nếu hết hàng, gạt bật lên sẽ mặc định là 10 cái
        fetch(`http://localhost:5000/products/${product.id}`, {
            method: 'PATCH', // PATCH dùng để update một phần dữ liệu
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quantity: newQuantity, inStock: newQuantity > 0 })
        }).then(() => {
            fetchProducts();
            toast.info(`Đã cập nhật trạng thái kho của ${product.name}`);
        });
    };

    const handleAddNew = () => { setEditingProduct(null); setShowModal(true); };
    const handleEdit = (product) => { setEditingProduct(product); setShowModal(true); };

    // 4. Logic Xử lý: Tìm Kiếm + Lọc + Sắp Xếp
    let processedProducts = products.filter(p =>
        (p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.category.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (filterCategory === '' || p.category === filterCategory)
    );

    if (sortOption === 'priceAsc') processedProducts.sort((a, b) => a.price - b.price);
    else if (sortOption === 'priceDesc') processedProducts.sort((a, b) => b.price - a.price);
    else if (sortOption === 'nameAsc') processedProducts.sort((a, b) => a.name.localeCompare(b.name));

    // Phân Trang
    const totalPages = Math.ceil(processedProducts.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProducts = processedProducts.slice(indexOfFirstItem, indexOfLastItem);

    // Cấu hình cột khi xuất Excel
    // Hàm xuất Excel chuyên nghiệp
    const exportToExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Báo Cáo Kho Hàng');

        // Định nghĩa các cột và độ rộng tự động
        worksheet.columns = [
            { header: 'STT', key: 'stt', width: 10 },
            { header: 'Tên sản phẩm', key: 'name', width: 40 },
            { header: 'Thương hiệu', key: 'brand', width: 15 },
            { header: 'Danh mục', key: 'category', width: 15 },
            { header: 'Giá bán (VND)', key: 'price', width: 20 },
            { header: 'Số lượng tồn', key: 'quantity', width: 15 }
        ];

        // Trang trí cho dòng Tiêu đề (Header)
        const headerRow = worksheet.getRow(1);
        headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } }; // Chữ trắng in đậm
        headerRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF0D6EFD' } // Màu nền xanh dương giống giao diện Admin
        };
        headerRow.alignment = { vertical: 'middle', horizontal: 'center' }; // Căn giữa

        // Đổ dữ liệu vào bảng
        processedProducts.forEach((product, index) => {
            worksheet.addRow({
                stt: index + 1,
                name: product.name,
                brand: product.brand,
                category: product.category.toUpperCase(),
                price: product.price,
                quantity: product.quantity
            });
        });

        // Định dạng lại các cột cho đẹp
        worksheet.getColumn('stt').alignment = { horizontal: 'center' };
        worksheet.getColumn('quantity').alignment = { horizontal: 'center' };
        worksheet.getColumn('price').numFmt = '#,##0'; // Định dạng số tiền có dấu phẩy (VD: 15,000,000)
        worksheet.getColumn('price').font = { color: { argb: 'FFDC3545' }, bold: true }; // Tô màu đỏ cho giá tiền

        // Tạo file và tải về máy
        const buffer = await workbook.xlsx.writeBuffer();
        const data = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(data, 'BaoCao_KhoHang_TechHub.xlsx');
    };

    return (
        <Container className="mt-5 mb-5">
            <ToastContainer position="top-right" autoClose={2000} />
            <Link to="/admin" className="btn btn-link text-decoration-none text-muted p-0 mb-3">
                <i className="bi bi-arrow-left me-1"></i> Quay lại Dashboard
            </Link>

            <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
                <h2 className="fw-bold text-primary mb-3 mb-md-0">Hệ thống kho hàng</h2>
                <div className="d-flex gap-2">
                    <Button variant="success" onClick={exportToExcel} className="text-nowrap shadow-sm">
                        <i className="bi bi-file-earmark-excel me-2"></i>Xuất Excel
                    </Button>
                    <Button variant="primary" onClick={handleAddNew} className="text-nowrap shadow-sm">
                        <i className="bi bi-plus-lg me-2"></i>Thêm sản phẩm
                    </Button>
                </div>
            </div>

            {/* Bộ Lọc & Tìm Kiếm */}
            <div className="bg-light p-3 rounded shadow-sm border mb-4">
                <Row className="g-2 align-items-center">
                    <Col md={4}>
                        <InputGroup>
                            <InputGroup.Text className="bg-white"><i className="bi bi-search"></i></InputGroup.Text>
                            <Form.Control placeholder="Tìm tên..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} />
                        </InputGroup>
                    </Col>
                    <Col md={3}>
                        <Form.Select value={filterCategory} onChange={(e) => { setFilterCategory(e.target.value); setCurrentPage(1); }}>
                            <option value="">Tất cả danh mục</option>
                            <option value="laptop">Laptop</option>
                            <option value="phone">Điện thoại</option>
                            <option value="accessories">Phụ kiện & Khác</option>
                        </Form.Select>
                    </Col>
                    <Col md={3}>
                        <Form.Select value={sortOption} onChange={(e) => { setSortOption(e.target.value); setCurrentPage(1); }}>
                            <option value="">Sắp xếp mặc định</option>
                            <option value="priceAsc">Giá: Thấp đến Cao</option>
                            <option value="priceDesc">Giá: Cao xuống Thấp</option>
                            <option value="nameAsc">Tên: A - Z</option>
                        </Form.Select>
                    </Col>
                    <Col md={2} className="text-end">
                        {selectedIds.length > 0 && (
                            <Button variant="danger" className="w-100 fw-bold animate__animated animate__fadeIn" onClick={handleBulkDelete}>
                                <i className="bi bi-trash3-fill me-1"></i> Xóa ({selectedIds.length})
                            </Button>
                        )}
                    </Col>
                </Row>
            </div>

            <div className="card shadow border-0 mb-4">
                <div className="card-body p-0">
                    <ProductTable
                        products={currentProducts}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onToggle={handleToggleStatus}
                        selectedIds={selectedIds}
                        setSelectedIds={setSelectedIds}
                        startIndex={indexOfFirstItem}
                    />
                </div>
            </div>

            {totalPages > 1 && (
                <Pagination className="justify-content-center">
                    <Pagination.Prev onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} />
                    {[...Array(totalPages)].map((_, i) => (
                        <Pagination.Item key={i + 1} active={i + 1 === currentPage} onClick={() => setCurrentPage(i + 1)}>
                            {i + 1}
                        </Pagination.Item>
                    ))}
                    <Pagination.Next onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} />
                </Pagination>
            )}

            <AddEditProductModal show={showModal} handleClose={() => setShowModal(false)} currentProduct={editingProduct} refreshData={fetchProducts} />
        </Container>
    );
};

export default ManageProductsPage;