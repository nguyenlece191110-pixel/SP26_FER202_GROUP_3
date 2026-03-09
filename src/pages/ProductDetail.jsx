import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge, Alert, Tabs, Tab, Form } from 'react-bootstrap';
import { useCart } from '../contexts/CartContext';
import { Cart3, ArrowLeft, Star, Truck, Shield, CreditCard, Plus, Dash } from 'react-bootstrap-icons';

// Sample product data - trong thực tế sẽ gọi API
const sampleProducts = [
    {
        id: 1,
        name: 'Acer Aspire 5',
        price: 15990000,
        description: 'Laptop văn phòng hiệu năng cao với màn hình 15.6 inch Full HD, Intel Core i5, 8GB RAM, 512GB SSD',
        images: ['/images/AcerAspire5.png'],
        inStock: true,
        discount: 5,
        category: 'laptop',
        brand: 'Acer',
        specs: {
            cpu: 'Intel Core i5-1335U',
            ram: '8GB DDR4',
            storage: '512GB NVMe SSD',
            display: '15.6" Full HD (1920x1080)',
            graphics: 'Intel Iris Xe',
            weight: '1.8kg'
        },
        features: [
            'Màn hình Full HD sắc nét',
            'Hiệu năng mạnh mẽ với Intel Core i5',
            'SSD siêu nhanh 512GB',
            'Thiết kế mỏng nhẹ 1.8kg',
            'Pin lâu dài',
            'Bảo hành 24 tháng'
        ]
    },
    {
        id: 2,
        name: 'Acer Aspire 7',
        price: 21990000,
        description: 'Laptop gaming tầm trung với NVIDIA GeForce RTX 3050, Intel Core i5, màn hình 15.6 inch',
        images: ['/images/AcerAspire7.png'],
        inStock: true,
        discount: 0,
        category: 'laptop',
        brand: 'Acer',
        specs: {
            cpu: 'Intel Core i5-12450H',
            ram: '8GB DDR4',
            storage: '512GB NVMe SSD',
            display: '15.6" Full HD 144Hz',
            graphics: 'NVIDIA RTX 3050 4GB',
            weight: '2.1kg'
        },
        features: [
            'Card đồ họa RTX 3050',
            'Màn hình 144Hz mượt mà',
            'CPU Intel Core i5 thế hệ mới',
            'SSD NVMe tốc độ cao',
            'Thiết kế gaming hiện đại',
            'Bảo hành 24 tháng'
        ]
    },
    {
        id: 3,
        name: 'Acer Nitro 5',
        price: 25990000,
        description: 'Laptop gaming mạnh mẽ với RTX 3060, Intel Core i7, màn hình 15.6 inch 144Hz',
        images: ['/images/AcerNitro5.png'],
        inStock: true,
        discount: 10,
        category: 'laptop',
        brand: 'Acer',
        specs: {
            cpu: 'Intel Core i7-11800H',
            ram: '16GB DDR4',
            storage: '1TB NVMe SSD',
            display: '15.6" Full HD 144Hz',
            graphics: 'NVIDIA RTX 3060 6GB',
            weight: '2.3kg'
        },
        features: [
            'RTX 3060 6GB VRAM',
            'Intel Core i7 8 cores',
            'RAM 16GB DDR4',
            'SSD 1TB siêu nhanh',
            'Màn hình 144Hz',
            'Bảo hành 24 tháng'
        ]
    },
    {
        id: 4,
        name: 'Acer Predator Helios 16',
        price: 45990000,
        description: 'Laptop gaming cao cấp với RTX 4070, Intel Core i9, màn hình 16 inch QHD 165Hz',
        images: ['/images/AcerPredatorHelios16.png'],
        inStock: true,
        discount: 0,
        category: 'laptop',
        brand: 'Acer',
        specs: {
            cpu: 'Intel Core i9-13900HX',
            ram: '32GB DDR5',
            storage: '2TB NVMe SSD',
            display: '16" QHD 165Hz IPS',
            graphics: 'NVIDIA RTX 4070 8GB',
            weight: '2.8kg'
        },
        features: [
            'RTX 4070 8GB VRAM',
            'Intel Core i9 24 cores',
            'RAM DDR5 32GB',
            'SSD 2TB siêu nhanh',
            'Màn hình QHD 165Hz',
            'Bảo hành 24 tháng'
        ]
    },
    {
        id: 5,
        name: 'Acer Swift Go 14',
        price: 18990000,
        description: 'Ultrabook mỏng nhẹ với Intel Core i7, màn hình 14 inch OLED, trọng lượng chỉ 1.3kg',
        images: ['/images/AcerSwiftGo14.png'],
        inStock: true,
        discount: 0,
        category: 'laptop',
        brand: 'Acer',
        specs: {
            cpu: 'Intel Core i7-13700H',
            ram: '16GB LPDDR5',
            storage: '1TB NVMe SSD',
            display: '14" 2.8K OLED',
            graphics: 'Intel Iris Xe',
            weight: '1.3kg'
        },
        features: [
            'Màn hình OLED 2.8K',
            'Intel Core i7 thế hệ mới',
            'Thiết kế siêu mỏng nhẹ',
            'RAM LPDDR5 tiết kiệm điện',
            'SSD 1TB tốc độ cao',
            'Bảo hành 24 tháng'
        ]
    },
    {
        id: 6,
        name: 'Acer Swift X',
        price: 32990000,
        description: 'Ultrabook creative với RTX 3050 Ti, AMD Ryzen 7, màn hình 14 inch 100% sRGB',
        images: ['/images/AcerSwiftX.png'],
        inStock: true,
        discount: 8,
        category: 'laptop',
        brand: 'Acer',
        specs: {
            cpu: 'AMD Ryzen 7 5800U',
            ram: '16GB LPDDR4X',
            storage: '1TB NVMe SSD',
            display: '14" Full HD 100% sRGB',
            graphics: 'NVIDIA RTX 3050 Ti 4GB',
            weight: '1.4kg'
        },
        features: [
            'RTX 3050 Ti 4GB',
            'AMD Ryzen 7 8 cores',
            'Màn hình 100% sRGB',
            'Thiết kế mỏng nhẹ',
            'SSD 1TB siêu nhanh',
            'Bảo hành 24 tháng'
        ]
    },
    {
        id: 7,
        name: 'AKKO 3087 Silent',
        price: 2499000,
        description: 'Bàn phím cơ gaming silent switch, layout TKL, RGB lighting',
        images: ['/images/AKKO3087Silent.png'],
        inStock: true,
        discount: 0,
        category: 'accessories',
        brand: 'AKKO',
        specs: {
            type: 'Mechanical Gaming Keyboard',
            switch: 'AKKO Silent Switch',
            layout: '87-Key TKL',
            connectivity: 'USB-C',
            backlight: 'RGB',
            weight: '650g'
        },
        features: [
            'Switch silent không tiếng',
            'Layout TKL compact',
            'RGB lighting',
            'USB-C reversible',
            'Hot-swappable switches',
            'Bảo hành 12 tháng'
        ]
    },
    {
        id: 8,
        name: 'Apple AirPods 3',
        price: 4990000,
        description: 'Tai nghe không dây thế hệ thứ 3 với Spatial Audio, Adaptive EQ',
        images: ['/images/AppleAirPods3.png'],
        inStock: true,
        discount: 5,
        category: 'accessories',
        brand: 'Apple',
        specs: {
            type: 'Wireless Earbuds',
            driver: 'Custom high-excursion',
            battery: '6 hours + 24 hours case',
            connectivity: 'Bluetooth 5.0',
            features: 'Spatial Audio, Adaptive EQ',
            weight: '4.4g per earbud'
        },
        features: [
            'Spatial Audio 3D',
            'Adaptive EQ tự động',
            'MagSafe charging',
            'Sweat and water resistant',
            'Hey Siri',
            'Bảo hành 12 tháng'
        ]
    },
    {
        id: 9,
        name: 'ASUS ExpertBook B5',
        price: 28990000,
        description: 'Laptop doanh nhân với Intel Core i7, màn hình 14 inch, bảo mật vân tay',
        images: ['/images/ASUSExpertBookB5.png'],
        inStock: true,
        discount: 0,
        category: 'laptop',
        brand: 'ASUS',
        specs: {
            cpu: 'Intel Core i7-1360P',
            ram: '16GB LPDDR5',
            storage: '1TB NVMe SSD',
            display: '14" Full HD 400nits',
            graphics: 'Intel Iris Xe',
            weight: '1.1kg'
        },
        features: [
            'Bảo mật vân tay',
            'Màn hình 400nits sáng',
            'Thiết kế siêu nhẹ 1.1kg',
            'Intel Core i7 thế hệ mới',
            'SSD 1TB tốc độ cao',
            'Bảo hành 24 tháng'
        ]
    },
    {
        id: 10,
        name: 'ASUS ROG Zephyrus G16',
        price: 52990000,
        description: 'Laptop gaming cao cấp với RTX 4080, Intel Core i9, màn hình 16 inch QHD 240Hz',
        images: ['/images/ASUSROGZephyrusG16.png'],
        inStock: true,
        discount: 0,
        category: 'laptop',
        brand: 'ASUS',
        specs: {
            cpu: 'Intel Core i9-13900H',
            ram: '32GB DDR5',
            storage: '2TB NVMe SSD',
            display: '16" QHD 240Hz IPS',
            graphics: 'NVIDIA RTX 4080 12GB',
            weight: '2.1kg'
        },
        features: [
            'RTX 4080 12GB VRAM',
            'Intel Core i9 14 cores',
            'Màn hình QHD 240Hz',
            'RAM DDR5 32GB',
            'SSD 2TB siêu nhanh',
            'Bảo hành 24 tháng'
        ]
    },
    {
        id: 11,
        name: 'ASUS TUF Gaming F15',
        price: 22990000,
        description: 'Laptop gaming bền bỉ với RTX 4060, Intel Core i7, màn hình 15.6 inch 144Hz',
        images: ['/images/ASUSTUFGamingF15.png'],
        inStock: true,
        discount: 7,
        category: 'laptop',
        brand: 'ASUS',
        specs: {
            cpu: 'Intel Core i7-12700H',
            ram: '16GB DDR4',
            storage: '1TB NVMe SSD',
            display: '15.6" Full HD 144Hz',
            graphics: 'NVIDIA RTX 4060 8GB',
            weight: '2.3kg'
        },
        features: [
            'RTX 4060 8GB VRAM',
            'Màn hình 144Hz',
            'Thiết kế quân đội MIL-STD',
            'Intel Core i7 12 cores',
            'SSD 1TB tốc độ cao',
            'Bảo hành 24 tháng'
        ]
    },
    {
        id: 12,
        name: 'ASUS Vivobook 15',
        price: 12990000,
        description: 'Laptop văn phòng giá tốt với Intel Core i5, màn hình 15.6 inch, thiết kế mỏng nhẹ',
        images: ['/images/ASUSVivobook15.png'],
        inStock: true,
        discount: 0,
        category: 'laptop',
        brand: 'ASUS',
        specs: {
            cpu: 'Intel Core i5-1135G7',
            ram: '8GB DDR4',
            storage: '512GB NVMe SSD',
            display: '15.6" Full HD',
            graphics: 'Intel Iris Xe',
            weight: '1.7kg'
        },
        features: [
            'Thiết kế mỏng nhẹ',
            'Intel Core i5 thế hệ 11',
            'SSD NVMe 512GB',
            'Màn hình Full HD',
            'Pin lâu dài',
            'Bảo hành 24 tháng'
        ]
    },
    {
        id: 13,
        name: 'ASUS Zenbook 14',
        price: 24990000,
        description: 'Ultrabook cao cấp với Intel Core i7, màn hình 14 inch OLED, trọng lượng chỉ 1.2kg',
        images: ['/images/ASUSZenbook14.png'],
        inStock: true,
        discount: 0,
        category: 'laptop',
        brand: 'ASUS',
        specs: {
            cpu: 'Intel Core i7-1360P',
            ram: '16GB LPDDR5',
            storage: '1TB NVMe SSD',
            display: '14" 2.8K OLED 90Hz',
            graphics: 'Intel Iris Xe',
            weight: '1.2kg'
        },
        features: [
            'Màn hình OLED 2.8K',
            'Tần số quét 90Hz',
            'Thiết kế siêu mỏng nhẹ',
            'Intel Core i7 thế hệ mới',
            'SSD 1TB tốc độ cao',
            'Bảo hành 24 tháng'
        ]
    },
    {
        id: 14,
        name: 'Baseus Adaman',
        price: 1990000,
        description: 'Sạc dự phòng 20000mAh với công suất 65W, hỗ trợ PD 3.0, QC 4.0',
        images: ['/images/BaseusAdaman.png'],
        inStock: true,
        discount: 0,
        category: 'accessories',
        brand: 'Baseus',
        specs: {
            capacity: '20000mAh',
            power: '65W',
            ports: '2x USB-C, 2x USB-A',
            protocols: 'PD 3.0, QC 4.0, FCP',
            weight: '400g',
            materials: 'Aluminum alloy'
        },
        features: [
            'Công suất 65W cao',
            'Hỗ trợ sạc nhanh đa chuẩn',
            'Thiết kế nhôm cao cấp',
            'LED display',
            'An toàn với nhiều lớp bảo vệ',
            'Bảo hành 12 tháng'
        ]
    },
    {
        id: 15,
        name: 'Dell G15',
        price: 24990000,
        description: 'Laptop gaming với RTX 4050, Intel Core i7, màn hình 15.6 inch 120Hz',
        images: ['/images/DellG15.png'],
        inStock: true,
        discount: 0,
        category: 'laptop',
        brand: 'Dell',
        specs: {
            cpu: 'Intel Core i7-12650H',
            ram: '16GB DDR4',
            storage: '1TB NVMe SSD',
            display: '15.6" Full HD 120Hz',
            graphics: 'NVIDIA RTX 4050 6GB',
            weight: '2.6kg'
        },
        features: [
            'RTX 4050 6GB VRAM',
            'Màn hình 120Hz',
            'Intel Core i7 10 cores',
            'SSD 1TB tốc độ cao',
            'Thiết kế gaming Alienware',
            'Bảo hành 24 tháng'
        ]
    },
    {
        id: 16,
        name: 'Dell G16',
        price: 32990000,
        description: 'Laptop gaming cao cấp với RTX 4060, Intel Core i7, màn hình 16 inch QHD 165Hz',
        images: ['/images/DellG16.png'],
        inStock: true,
        discount: 0,
        category: 'laptop',
        brand: 'Dell',
        specs: {
            cpu: 'Intel Core i7-13700HX',
            ram: '16GB DDR5',
            storage: '1TB NVMe SSD',
            display: '16" QHD 165Hz',
            graphics: 'NVIDIA RTX 4060 8GB',
            weight: '2.8kg'
        },
        features: [
            'RTX 4060 8GB VRAM',
            'Màn hình QHD 165Hz',
            'Intel Core i7 16 cores',
            'RAM DDR5 thế hệ mới',
            'SSD 1TB tốc độ cao',
            'Bảo hành 24 tháng'
        ]
    },
    {
        id: 17,
        name: 'Dell Inspiron 14',
        price: 15990000,
        description: 'Laptop văn phòng với Intel Core i5, màn hình 14 inch, thiết kế mỏng nhẹ',
        images: ['/images/DellInspiron14.png'],
        inStock: true,
        discount: 0,
        category: 'laptop',
        brand: 'Dell',
        specs: {
            cpu: 'Intel Core i5-1235U',
            ram: '8GB DDR4',
            storage: '512GB NVMe SSD',
            display: '14" Full HD',
            graphics: 'Intel Iris Xe',
            weight: '1.4kg'
        },
        features: [
            'Thiết kế mỏng nhẹ',
            'Intel Core i5 thế hệ 12',
            'SSD NVMe 512GB',
            'Màn hình Full HD',
            'Pin lâu dài',
            'Bảo hành 24 tháng'
        ]
    },
    {
        id: 18,
        name: 'Dell Inspiron 16',
        price: 18990000,
        description: 'Laptop văn phòng màn hình lớn với Intel Core i7, màn hình 16 inch',
        images: ['/images/DellInspiron16.png'],
        inStock: true,
        discount: 0,
        category: 'laptop',
        brand: 'Dell',
        specs: {
            cpu: 'Intel Core i7-1255U',
            ram: '16GB DDR4',
            storage: '1TB NVMe SSD',
            display: '16" Full HD',
            graphics: 'Intel Iris Xe',
            weight: '2.0kg'
        },
        features: [
            'Màn hình 16 inch lớn',
            'Intel Core i7 thế hệ 12',
            'RAM 16GB DDR4',
            'SSD 1TB tốc độ cao',
            'Thiết kế mỏng nhẹ',
            'Bảo hành 24 tháng'
        ]
    },
    {
        id: 19,
        name: 'Dell XPS 13',
        price: 34990000,
        description: 'Ultrabook cao cấp với Intel Core i7, màn hình 13.4 inch OLED, thiết kế siêu mỏng',
        images: ['/images/DellXPS13.png'],
        inStock: true,
        discount: 0,
        category: 'laptop',
        brand: 'Dell',
        specs: {
            cpu: 'Intel Core i7-1260P',
            ram: '16GB LPDDR5',
            storage: '1TB NVMe SSD',
            display: '13.4" 3.5K OLED',
            graphics: 'Intel Iris Xe',
            weight: '1.17kg'
        },
        features: [
            'Màn hình OLED 3.5K',
            'Thiết kế siêu mỏng nhẹ',
            'Intel Core i7 thế hệ mới',
            'RAM LPDDR5 tiết kiệm điện',
            'SSD 1TB tốc độ cao',
            'Bảo hành 24 tháng'
        ]
    },
    {
        id: 20,
        name: 'Dell XPS 15',
        price: 42990000,
        description: 'Ultrabook creative với Intel Core i9, màn hình 15.6 inch OLED, RTX 3050 Ti',
        images: ['/images/DellXPS15.png'],
        inStock: true,
        discount: 0,
        category: 'laptop',
        brand: 'Dell',
        specs: {
            cpu: 'Intel Core i9-12900HK',
            ram: '32GB DDR5',
            storage: '2TB NVMe SSD',
            display: '15.6" 3.5K OLED',
            graphics: 'NVIDIA RTX 3050 Ti 4GB',
            weight: '1.8kg'
        },
        features: [
            'Màn hình OLED 3.5K',
            'Intel Core i9 14 cores',
            'RTX 3050 Ti 4GB',
            'RAM DDR5 32GB',
            'SSD 2TB siêu nhanh',
            'Bảo hành 24 tháng'
        ]
    },
    {
        id: 21,
        name: 'HP Envy x360',
        price: 27990000,
        description: 'Laptop 2-in-1 với Intel Core i7, màn hình 13.3 inch cảm ứng, có thể xoay 360 độ',
        images: ['/images/HPEnvyx360.png'],
        inStock: true,
        discount: 0,
        category: 'laptop',
        brand: 'HP',
        specs: {
            cpu: 'Intel Core i7-1250U',
            ram: '16GB LPDDR4X',
            storage: '1TB NVMe SSD',
            display: '13.3" Full HD Touch',
            graphics: 'Intel Iris Xe',
            weight: '1.3kg'
        },
        features: [
            'Màn hình cảm ứng',
            'Xoay 360 độ',
            'Intel Core i7 thế hệ 12',
            'RAM LPDDR4X tiết kiệm điện',
            'SSD 1TB tốc độ cao',
            'Bảo hành 24 tháng'
        ]
    },
    {
        id: 22,
        name: 'HP Laptop 15s',
        price: 11990000,
        description: 'Laptop văn phòng giá tốt với Intel Core i3, màn hình 15.6 inch',
        images: ['/images/HPLaptop15s.png'],
        inStock: true,
        discount: 0,
        category: 'laptop',
        brand: 'HP',
        specs: {
            cpu: 'Intel Core i3-1215U',
            ram: '8GB DDR4',
            storage: '512GB NVMe SSD',
            display: '15.6" Full HD',
            graphics: 'Intel UHD Graphics',
            weight: '1.7kg'
        },
        features: [
            'Giá cả hợp lý',
            'Intel Core i3 thế hệ 12',
            'SSD NVMe 512GB',
            'Màn hình Full HD',
            'Thiết kế mỏng nhẹ',
            'Bảo hành 24 tháng'
        ]
    },
    {
        id: 23,
        name: 'HP Omen 16',
        price: 44990000,
        description: 'Laptop gaming cao cấp với RTX 4070, Intel Core i9, màn hình 16 inch QHD 165Hz',
        images: ['/images/HPOMen16.png'],
        inStock: true,
        discount: 0,
        category: 'laptop',
        brand: 'HP',
        specs: {
            cpu: 'Intel Core i9-13900HX',
            ram: '32GB DDR5',
            storage: '2TB NVMe SSD',
            display: '16" QHD 165Hz IPS',
            graphics: 'NVIDIA RTX 4070 8GB',
            weight: '2.4kg'
        },
        features: [
            'RTX 4070 8GB VRAM',
            'Intel Core i9 24 cores',
            'Màn hình QHD 165Hz',
            'RAM DDR5 32GB',
            'SSD 2TB siêu nhanh',
            'Bảo hành 24 tháng'
        ]
    },
    {
        id: 24,
        name: 'HP Pavilion 14',
        price: 14990000,
        description: 'Laptop văn phòng với Intel Core i5, màn hình 14 inch, thiết kế thời trang',
        images: ['/images/HPVavilion14.png'],
        inStock: true,
        discount: 0,
        category: 'laptop',
        brand: 'HP',
        specs: {
            cpu: 'Intel Core i5-1235U',
            ram: '8GB DDR4',
            storage: '512GB NVMe SSD',
            display: '14" Full HD',
            graphics: 'Intel Iris Xe',
            weight: '1.4kg'
        },
        features: [
            'Thiết kế thời trang',
            'Intel Core i5 thế hệ 12',
            'SSD NVMe 512GB',
            'Màn hình Full HD',
            'Thiết kế mỏng nhẹ',
            'Bảo hành 24 tháng'
        ]
    },
    {
        id: 25,
        name: 'HP Spectre x360',
        price: 38990000,
        description: 'Laptop 2-in-1 cao cấp với Intel Core i7, màn hình 13.5 inch OLED 3K2K',
        images: ['/images/HPSpectrex360.png'],
        inStock: true,
        discount: 0,
        category: 'laptop',
        brand: 'HP',
        specs: {
            cpu: 'Intel Core i7-1255U',
            ram: '16GB LPDDR4X',
            storage: '1TB NVMe SSD',
            display: '13.5" 3K2K OLED Touch',
            graphics: 'Intel Iris Xe',
            weight: '1.4kg'
        },
        features: [
            'Màn hình OLED 3K2K',
            'Cảm ứng đa điểm',
            'Xoay 360 độ',
            'Intel Core i7 thế hệ 12',
            'Thiết kế cao cấp',
            'Bảo hành 24 tháng'
        ]
    },
    {
        id: 26,
        name: 'HP Victus 16',
        price: 21990000,
        description: 'Laptop gaming tầm trung với RTX 4050, Intel Core i5, màn hình 16.1 inch 144Hz',
        images: ['/images/HPVictus16.png'],
        inStock: true,
        discount: 0,
        category: 'laptop',
        brand: 'HP',
        specs: {
            cpu: 'Intel Core i5-12450H',
            ram: '16GB DDR4',
            storage: '512GB NVMe SSD',
            display: '16.1" Full HD 144Hz',
            graphics: 'NVIDIA RTX 4050 6GB',
            weight: '2.5kg'
        },
        features: [
            'RTX 4050 6GB VRAM',
            'Màn hình 144Hz',
            'Intel Core i5 thế hệ 12',
            'RAM 16GB DDR4',
            'SSD 512GB tốc độ cao',
            'Bảo hành 24 tháng'
        ]
    },
    {
        id: 27,
        name: 'iPhone 14',
        price: 18990000,
        description: 'iPhone thế hệ 14 với chip A15, màn hình 6.1 inch, camera 12MP',
        images: ['/images/iphone14.png'],
        inStock: true,
        discount: 0,
        category: 'phone',
        brand: 'Apple',
        specs: {
            cpu: 'A15 Bionic',
            ram: '6GB',
            storage: '128GB',
            display: '6.1" Super Retina XDR',
            camera: '12MP + 12MP',
            battery: '3279mAh',
            weight: '172g'
        },
        features: [
            'Chip A15 Bionic',
            'Màn hình Super Retina XDR',
            'Camera kép 12MP',
            'Face ID',
            'iOS 16',
            'Bảo hành 12 tháng'
        ]
    },
    {
        id: 28,
        name: 'iPhone 14 Pro Max',
        price: 24990000,
        description: 'iPhone Pro Max với chip A16, màn hình 6.7 inch, camera 48MP',
        images: ['/images/iphone14promax.png'],
        inStock: true,
        discount: 0,
        category: 'phone',
        brand: 'Apple',
        specs: {
            cpu: 'A16 Bionic',
            ram: '8GB',
            storage: '256GB',
            display: '6.7" Super Retina XDR ProMotion',
            camera: '48MP + 12MP + 12MP',
            battery: '4323mAh',
            weight: '240g'
        },
        features: [
            'Chip A16 Bionic',
            'Màn hình ProMotion 120Hz',
            'Camera chính 48MP',
            'Dynamic Island',
            'iOS 16',
            'Bảo hành 12 tháng'
        ]
    },
    {
        id: 29,
        name: 'iPhone 16 Pro',
        price: 27990000,
        description: 'iPhone Pro thế hệ mới với chip A18 Pro, màn hình 6.3 inch, camera 48MP',
        images: ['/images/iphone16pro.png'],
        inStock: true,
        discount: 0,
        category: 'phone',
        brand: 'Apple',
        specs: {
            cpu: 'A18 Pro',
            ram: '8GB',
            storage: '256GB',
            display: '6.3" Super Retina XDR ProMotion',
            camera: '48MP + 12MP + 12MP',
            battery: '3582mAh',
            weight: '199g'
        },
        features: [
            'Chip A18 Pro',
            'Màn hình ProMotion 120Hz',
            'Camera 48MP',
            'Action Button',
            'iOS 18',
            'Bảo hành 12 tháng'
        ]
    },
    {
        id: 30,
        name: 'iPhone 17',
        price: 21990000,
        description: 'iPhone thế hệ mới với chip A19, màn hình 6.1 inch, camera 24MP',
        images: ['/images/iphone17.png'],
        inStock: true,
        discount: 0,
        category: 'phone',
        brand: 'Apple',
        specs: {
            cpu: 'A19',
            ram: '8GB',
            storage: '256GB',
            display: '6.1" Super Retina XDR',
            camera: '24MP + 12MP',
            battery: '3561mAh',
            weight: '173g'
        },
        features: [
            'Chip A19 mới nhất',
            'Màn hình Super Retina XDR',
            'Camera 24MP',
            'Dynamic Island',
            'iOS 18',
            'Bảo hành 12 tháng'
        ]
    },
    {
        id: 31,
        name: 'iPhone 17 Plus',
        price: 24990000,
        description: 'iPhone Plus màn hình lớn với chip A19, màn hình 6.7 inch',
        images: ['/images/iphone17plus.png'],
        inStock: true,
        discount: 0,
        category: 'phone',
        brand: 'Apple',
        specs: {
            cpu: 'A19',
            ram: '8GB',
            storage: '512GB',
            display: '6.7" Super Retina XDR',
            camera: '24MP + 12MP',
            battery: '4383mAh',
            weight: '221g'
        },
        features: [
            'Chip A19 mới nhất',
            'Màn hình lớn 6.7 inch',
            'Camera 24MP',
            'Dynamic Island',
            'iOS 18',
            'Bảo hành 12 tháng'
        ]
    },
    {
        id: 32,
        name: 'iPhone 17 Pro',
        price: 32990000,
        description: 'iPhone Pro cao cấp với chip A19 Pro, màn hình 6.3 inch, camera 48MP',
        images: ['/images/iphone17pro.png'],
        inStock: true,
        discount: 0,
        category: 'phone',
        brand: 'Apple',
        specs: {
            cpu: 'A19 Pro',
            ram: '12GB',
            storage: '1TB',
            display: '6.3" Super Retina XDR ProMotion',
            camera: '48MP + 12MP + 12MP',
            battery: '3582mAh',
            weight: '199g'
        },
        features: [
            'Chip A19 Pro',
            'Màn hình ProMotion 120Hz',
            'Camera 48MP',
            'Action Button',
            'iOS 18',
            'Bảo hành 12 tháng'
        ]
    },
    {
        id: 33,
        name: 'iPhone 17 Pro Max',
        price: 39990000,
        description: 'iPhone Pro Max cao cấp nhất với chip A19 Pro, màn hình 6.7 inch, camera 48MP',
        images: ['/images/iphone17promax.png'],
        inStock: true,
        discount: 0,
        category: 'phone',
        brand: 'Apple',
        specs: {
            cpu: 'A19 Pro',
            ram: '12GB',
            storage: '1TB',
            display: '6.7" Super Retina XDR ProMotion',
            camera: '48MP + 12MP + 12MP + 12MP',
            battery: '4674mAh',
            weight: '221g'
        },
        features: [
            'Chip A19 Pro',
            'Màn hình ProMotion 120Hz',
            'Camera 48MP',
            'Periscope zoom',
            'iOS 18',
            'Bảo hành 12 tháng'
        ]
    },
    {
        id: 34,
        name: 'Laptop ASUS Vivobook S14',
        price: 17990000,
        description: 'Laptop văn phòng với Intel Core i5, màn hình 14 inch, thiết kế mỏng nhẹ',
        images: ['/images/LaptopASUSVivobookS14.png'],
        inStock: true,
        discount: 0,
        category: 'laptop',
        brand: 'ASUS',
        specs: {
            cpu: 'Intel Core i5-1335U',
            ram: '8GB DDR4',
            storage: '512GB NVMe SSD',
            display: '14" Full HD',
            graphics: 'Intel Iris Xe',
            weight: '1.5kg'
        },
        features: [
            'Thiết kế mỏng nhẹ',
            'Intel Core i5 thế hệ 13',
            'SSD NVMe 512GB',
            'Màn hình Full HD',
            'Pin lâu dài',
            'Bảo hành 24 tháng'
        ]
    },
    {
        id: 35,
        name: 'Lenovo IdeaPad 3',
        price: 10990000,
        description: 'Laptop giá tốt với Intel Core i3, màn hình 15.6 inch',
        images: ['/images/LenovoIdeaPad3.png'],
        inStock: true,
        discount: 0,
        category: 'laptop',
        brand: 'Lenovo',
        specs: {
            cpu: 'Intel Core i3-1115G4',
            ram: '8GB DDR4',
            storage: '256GB NVMe SSD',
            display: '15.6" Full HD',
            graphics: 'Intel UHD Graphics',
            weight: '1.85kg'
        },
        features: [
            'Giá cả hợp lý',
            'Intel Core i3 thế hệ 11',
            'SSD NVMe 256GB',
            'Màn hình Full HD',
            'Thiết kế bền bỉ',
            'Bảo hành 24 tháng'
        ]
    },
    {
        id: 36,
        name: 'Lenovo IdeaPad Slim 5',
        price: 15990000,
        description: 'Laptop mỏng nhẹ với Intel Core i5, màn hình 14 inch',
        images: ['/images/LenovoIdeaPadSlim5.png'],
        inStock: true,
        discount: 0,
        category: 'laptop',
        brand: 'Lenovo',
        specs: {
            cpu: 'Intel Core i5-1240P',
            ram: '8GB LPDDR4X',
            storage: '512GB NVMe SSD',
            display: '14" Full HD',
            graphics: 'Intel Iris Xe',
            weight: '1.4kg'
        },
        features: [
            'Thiết kế siêu mỏng',
            'Intel Core i5 thế hệ 12',
            'RAM LPDDR4X tiết kiệm điện',
            'SSD NVMe 512GB',
            'Màn hình Full HD',
            'Bảo hành 24 tháng'
        ]
    },
    {
        id: 37,
        name: 'Lenovo Legion 5 Pro',
        price: 35990000,
        description: 'Laptop gaming cao cấp với RTX 4070, AMD Ryzen 7, màn hình 16 inch QHD 165Hz',
        images: ['/images/LenovoLegion5Pro.png'],
        inStock: true,
        discount: 0,
        category: 'laptop',
        brand: 'Lenovo',
        specs: {
            cpu: 'AMD Ryzen 7 7840HS',
            ram: '32GB DDR5',
            storage: '2TB NVMe SSD',
            display: '16" QHD 165Hz IPS',
            graphics: 'NVIDIA RTX 4070 8GB',
            weight: '2.5kg'
        },
        features: [
            'RTX 4070 8GB VRAM',
            'AMD Ryzen 7 8 cores',
            'Màn hình QHD 165Hz',
            'RAM DDR5 32GB',
            'SSD 2TB siêu nhanh',
            'Bảo hành 24 tháng'
        ]
    },
    {
        id: 38,
        name: 'Lenovo Legion 7i',
        price: 49990000,
        description: 'Laptop gaming cao cấp nhất với RTX 4080, Intel Core i9, màn hình 16 inch QHD 240Hz',
        images: ['/images/LenovoLegion7i.png'],
        inStock: true,
        discount: 0,
        category: 'laptop',
        brand: 'Lenovo',
        specs: {
            cpu: 'Intel Core i9-13900HX',
            ram: '32GB DDR5',
            storage: '2TB NVMe SSD',
            display: '16" QHD 240Hz IPS',
            graphics: 'NVIDIA RTX 4080 12GB',
            weight: '2.8kg'
        },
        features: [
            'RTX 4080 12GB VRAM',
            'Intel Core i9 24 cores',
            'Màn hình QHD 240Hz',
            'RAM DDR5 32GB',
            'SSD 2TB siêu nhanh',
            'Bảo hành 24 tháng'
        ]
    },
    {
        id: 39,
        name: 'Lenovo Yoga 7i',
        price: 25990000,
        description: 'Laptop 2-in-1 với Intel Core i7, màn hình 14 inch cảm ứng, xoay 360 độ',
        images: ['/images/LenovoYoga7i.png'],
        inStock: true,
        discount: 0,
        category: 'laptop',
        brand: 'Lenovo',
        specs: {
            cpu: 'Intel Core i7-1260P',
            ram: '16GB LPDDR4X',
            storage: '1TB NVMe SSD',
            display: '14" Full HD Touch',
            graphics: 'Intel Iris Xe',
            weight: '1.4kg'
        },
        features: [
            'Màn hình cảm ứng',
            'Xoay 360 độ',
            'Intel Core i7 thế hệ 12',
            'RAM LPDDR4X tiết kiệm điện',
            'SSD 1TB tốc độ cao',
            'Bảo hành 24 tháng'
        ]
    },
    {
        id: 40,
        name: 'Lenovo Yoga 9i',
        price: 34990000,
        description: 'Laptop 2-in-1 cao cấp với Intel Core i7, màn hình 14 inch OLED 2.8K',
        images: ['/images/LenovoYoga9i.png'],
        inStock: true,
        discount: 0,
        category: 'laptop',
        brand: 'Lenovo',
        specs: {
            cpu: 'Intel Core i7-1360P',
            ram: '16GB LPDDR5',
            storage: '1TB NVMe SSD',
            display: '14" 2.8K OLED Touch',
            graphics: 'Intel Iris Xe',
            weight: '1.4kg'
        },
        features: [
            'Màn hình OLED 2.8K',
            'Cảm ứng đa điểm',
            'Xoay 360 độ',
            'Intel Core i7 thế hệ mới',
            'RAM LPDDR5 tiết kiệm điện',
            'Bảo hành 24 tháng'
        ]
    },
    {
        id: 41,
        name: 'Nubia Red Magic 11 Pro Plus',
        price: 12990000,
        description: 'Điện thoại gaming với Snapdragon 8 Gen 1, màn hình 120Hz, hệ thống làm mát',
        images: ['/images/nubiaredmagic11proplus.png'],
        inStock: true,
        discount: 0,
        category: 'phone',
        brand: 'Nubia',
        specs: {
            cpu: 'Snapdragon 8 Gen 1',
            ram: '12GB',
            storage: '256GB',
            display: '6.8" AMOLED 120Hz',
            camera: '64MP + 8MP + 2MP',
            battery: '4500mAh',
            weight: '199g'
        },
        features: [
            'Snapdragon 8 Gen 1',
            'Màn hình AMOLED 120Hz',
            'Camera 64MP',
            'Hệ thống làm mát',
            'Gaming triggers',
            'Bảo hành 12 tháng'
        ]
    },
    {
        id: 42,
        name: 'OPPO A3',
        price: 3990000,
        description: 'Điện thoại giá rẻ với MediaTek Helio G85, màn hình 6.5 inch, pin 5000mAh',
        images: ['/images/oppoa3.png'],
        inStock: true,
        discount: 0,
        category: 'phone',
        brand: 'OPPO',
        specs: {
            cpu: 'MediaTek Helio G85',
            ram: '4GB',
            storage: '64GB',
            display: '6.5" HD+',
            camera: '13MP + 2MP',
            battery: '5000mAh',
            weight: '190g'
        },
        features: [
            'Pin 5000mAh',
            'MediaTek Helio G85',
            'Màn hình lớn 6.5 inch',
            'Camera 13MP',
            'Sạc nhanh 18W',
            'Bảo hành 12 tháng'
        ]
    },
    {
        id: 43,
        name: 'OPPO A59',
        price: 4990000,
        description: 'Điện thoại tầm trung với MediaTek Helio G85, màn hình 6.5 inch',
        images: ['/images/oppoa59.png'],
        inStock: true,
        discount: 0,
        category: 'phone',
        brand: 'OPPO',
        specs: {
            cpu: 'MediaTek Helio G85',
            ram: '6GB',
            storage: '128GB',
            display: '6.5" HD+',
            camera: '13MP + 2MP',
            battery: '5000mAh',
            weight: '191g'
        },
        features: [
            'Pin 5000mAh',
            'RAM 6GB',
            'Màn hình lớn',
            'Camera 13MP',
            'Sạc nhanh 33W',
            'Bảo hành 12 tháng'
        ]
    },
    {
        id: 44,
        name: 'OPPO A79',
        price: 6990000,
        description: 'Điện thoại tầm trung với MediaTek Helio G95, màn hình 6.5 inch 90Hz',
        images: ['/images/oppoa79.png'],
        inStock: true,
        discount: 0,
        category: 'phone',
        brand: 'OPPO',
        specs: {
            cpu: 'MediaTek Helio G95',
            ram: '8GB',
            storage: '128GB',
            display: '6.5" HD+ 90Hz',
            camera: '50MP + 2MP',
            battery: '5000mAh',
            weight: '188g'
        },
        features: [
            'Màn hình 90Hz',
            'MediaTek Helio G95',
            'Camera 50MP',
            'RAM 8GB',
            'Sạc nhanh 33W',
            'Bảo hành 12 tháng'
        ]
    },
    {
        id: 45,
        name: 'OPPO Find N3',
        price: 21990000,
        description: 'Điện thoại gập cao cấp với Snapdragon 8 Gen 2, màn hình gập 7.8 inch',
        images: ['/images/oppofindn3.png'],
        inStock: true,
        discount: 0,
        category: 'phone',
        brand: 'OPPO',
        specs: {
            cpu: 'Snapdragon 8 Gen 2',
            ram: '12GB',
            storage: '512GB',
            display: '7.8" AMOLED 120Hz',
            camera: '50MP + 48MP + 32MP',
            battery: '4805mAh',
            weight: '233g'
        },
        features: [
            'Snapdragon 8 Gen 2',
            'Màn hình gập 7.8 inch',
            'Camera 50MP',
            'RAM 12GB',
            'Hinge mới',
            'Bảo hành 12 tháng'
        ]
    },
    {
        id: 46,
        name: 'OPPO Find X7 Ultra',
        price: 24990000,
        description: 'Điện thoại flagship với Snapdragon 8 Gen 3, camera 50MP, sạc 100W',
        images: ['/images/oppofindx7ultra.png'],
        inStock: true,
        discount: 0,
        category: 'phone',
        brand: 'OPPO',
        specs: {
            cpu: 'Snapdragon 8 Gen 3',
            ram: '16GB',
            storage: '512GB',
            display: '6.82" AMOLED 120Hz',
            camera: '50MP + 50MP + 50MP',
            battery: '5000mAh',
            weight: '221g'
        },
        features: [
            'Snapdragon 8 Gen 3',
            'Camera 50MP Hasselblad',
            'Sạc siêu nhanh 100W',
            'RAM 16GB',
            'AMOLED 120Hz',
            'Bảo hành 12 tháng'
        ]
    },
    {
        id: 47,
        name: 'OPPO K12x',
        price: 5990000,
        description: 'Điện thoại giá tốt với MediaTek Dimensity 810, màn hình 120Hz',
        images: ['/images/oppok12x.png'],
        inStock: true,
        discount: 0,
        category: 'phone',
        brand: 'OPPO',
        specs: {
            cpu: 'MediaTek Dimensity 810',
            ram: '8GB',
            storage: '128GB',
            display: '6.7" AMOLED 120Hz',
            camera: '64MP + 8MP',
            battery: '5000mAh',
            weight: '185g'
        },
        features: [
            'Màn hình AMOLED 120Hz',
            'MediaTek Dimensity 810',
            'Camera 64MP',
            'RAM 8GB',
            'Sạc nhanh 67W',
            'Bảo hành 12 tháng'
        ]
    },
    {
        id: 48,
        name: 'OPPO Reno 12',
        price: 8990000,
        description: 'Điện thoại tầm trung với Snapdragon 7 Gen 1, camera 64MP',
        images: ['/images/opporeno12.png'],
        inStock: true,
        discount: 0,
        category: 'phone',
        brand: 'OPPO',
        specs: {
            cpu: 'Snapdragon 7 Gen 1',
            ram: '8GB',
            storage: '256GB',
            display: '6.7" AMOLED 120Hz',
            camera: '64MP + 8MP + 2MP',
            battery: '4800mAh',
            weight: '180g'
        },
        features: [
            'Snapdragon 7 Gen 1',
            'Camera 64MP',
            'Màn hình AMOLED 120Hz',
            'RAM 8GB',
            'Sạc nhanh 67W',
            'Bảo hành 12 tháng'
        ]
    },
    {
        id: 49,
        name: 'OPPO Reno 12 Pro',
        price: 11990000,
        description: 'Điện thoại tầm trung cao cấp với Snapdragon 7+ Gen 1, camera 50MP',
        images: ['/images/opporeno12pro.png'],
        inStock: true,
        discount: 0,
        category: 'phone',
        brand: 'OPPO',
        specs: {
            cpu: 'Snapdragon 7+ Gen 1',
            ram: '12GB',
            storage: '256GB',
            display: '6.7" AMOLED 120Hz',
            camera: '50MP + 8MP + 2MP',
            battery: '5000mAh',
            weight: '183g'
        },
        features: [
            'Snapdragon 7+ Gen 1',
            'Camera 50MP',
            'Màn hình AMOLED 120Hz',
            'RAM 12GB',
            'Sạc nhanh 80W',
            'Bảo hành 12 tháng'
        ]
    },
    {
        id: 50,
        name: 'Picture 1',
        price: 999000,
        description: 'Hình ảnh minh họa sản phẩm',
        images: ['/images/Picture1.png'],
        inStock: true,
        discount: 0,
        category: 'accessories',
        brand: 'Generic',
        specs: {
            type: 'Digital Image',
            resolution: '1920x1080',
            format: 'PNG',
            size: '2MB',
            color: 'RGB',
            quality: 'High'
        },
        features: [
            'Độ phân giải cao',
            'Màu sắc sắc nét',
            'Định dạng PNG',
            'Tối ưu cho web',
            'Chất lượng cao',
            'Bảo hành 6 tháng'
        ]
    },
    {
        id: 51,
        name: 'Realme 12 Pro+',
        price: 9990000,
        description: 'Điện thoại tầm trung với Snapdragon 7 Gen 3, camera 50MP, sạc 67W',
        images: ['/images/realme12pro+.png'],
        inStock: true,
        discount: 0,
        category: 'phone',
        brand: 'Realme',
        specs: {
            cpu: 'Snapdragon 7 Gen 3',
            ram: '12GB',
            storage: '256GB',
            display: '6.7" AMOLED 120Hz',
            camera: '50MP + 8MP + 2MP',
            battery: '5000mAh',
            weight: '190g'
        },
        features: [
            'Snapdragon 7 Gen 3',
            'Camera 50MP',
            'Màn hình AMOLED 120Hz',
            'RAM 12GB',
            'Sạc nhanh 67W',
            'Bảo hành 12 tháng'
        ]
    },
    {
        id: 52,
        name: 'Realme 13 Pro',
        price: 8990000,
        description: 'Điện thoại tầm trung với Snapdragon 7s Gen 2, camera 50MP',
        images: ['/images/realme13pro.png'],
        inStock: true,
        discount: 0,
        category: 'phone',
        brand: 'Realme',
        specs: {
            cpu: 'Snapdragon 7s Gen 2',
            ram: '8GB',
            storage: '128GB',
            display: '6.7" AMOLED 120Hz',
            camera: '50MP + 8MP + 2MP',
            battery: '5000mAh',
            weight: '185g'
        },
        features: [
            'Snapdragon 7s Gen 2',
            'Camera 50MP',
            'Màn hình AMOLED 120Hz',
            'RAM 8GB',
            'Sạc nhanh 67W',
            'Bảo hành 12 tháng'
        ]
    },
    {
        id: 53,
        name: 'Realme 15 Pro 5G',
        price: 7990000,
        description: 'Điện thoại 5G giá tốt với Snapdragon 6 Gen 1, màn hình 120Hz',
        images: ['/images/realme15pro5g.png'],
        inStock: true,
        discount: 0,
        category: 'phone',
        brand: 'Realme',
        specs: {
            cpu: 'Snapdragon 6 Gen 1',
            ram: '8GB',
            storage: '128GB',
            display: '6.7" AMOLED 120Hz',
            camera: '64MP + 8MP + 2MP',
            battery: '5000mAh',
            weight: '189g'
        },
        features: [
            'Hỗ trợ 5G',
            'Snapdragon 6 Gen 1',
            'Màn hình AMOLED 120Hz',
            'Camera 64MP',
            'Sạc nhanh 67W',
            'Bảo hành 12 tháng'
        ]
    },
    {
        id: 54,
        name: 'Realme C63',
        price: 3990000,
        description: 'Điện thoại giá rẻ với Unisoc T606, pin 5000mAh',
        images: ['/images/realmeC63.png'],
        inStock: true,
        discount: 0,
        category: 'phone',
        brand: 'Realme',
        specs: {
            cpu: 'Unisoc T606',
            ram: '4GB',
            storage: '64GB',
            display: '6.74" HD+',
            camera: '8MP + 0.08MP',
            battery: '5000mAh',
            weight: '188g'
        },
        features: [
            'Pin 5000mAh',
            'Unisoc T606',
            'Giá cả hợp lý',
            'Camera 8MP',
            'Sạc nhanh 18W',
            'Bảo hành 12 tháng'
        ]
    },
    {
        id: 55,
        name: 'Realme C67',
        price: 4490000,
        description: 'Điện thoại giá rẻ với Snapdragon 685, pin 5000mAh',
        images: ['/images/realmeC67.png'],
        inStock: true,
        discount: 0,
        category: 'phone',
        brand: 'Realme',
        specs: {
            cpu: 'Snapdragon 685',
            ram: '6GB',
            storage: '128GB',
            display: '6.72" HD+ 90Hz',
            camera: '50MP + 2MP',
            battery: '5000mAh',
            weight: '188g'
        },
        features: [
            'Snapdragon 685',
            'Pin 5000mAh',
            'Màn hình 90Hz',
            'Camera 50MP',
            'Sạc nhanh 33W',
            'Bảo hành 12 tháng'
        ]
    },
    {
        id: 56,
        name: 'Realme GT 6',
        price: 14990000,
        description: 'Điện thoại flagship với Snapdragon 8 Gen 3, camera 50MP, sạc 120W',
        images: ['/images/realmeGT6.png'],
        inStock: true,
        discount: 0,
        category: 'phone',
        brand: 'Realme',
        specs: {
            cpu: 'Snapdragon 8 Gen 3',
            ram: '16GB',
            storage: '256GB',
            display: '6.74" AMOLED 144Hz',
            camera: '50MP + 8MP + 2MP',
            battery: '5500mAh',
            weight: '199g'
        },
        features: [
            'Snapdragon 8 Gen 3',
            'Camera 50MP',
            'Màn hình 144Hz',
            'RAM 16GB',
            'Sạc siêu nhanh 120W',
            'Bảo hành 12 tháng'
        ]
    },
    {
        id: 57,
        name: 'Realme Narzo 70 Pro',
        price: 6990000,
        description: 'Điện thoại gaming giá tốt với MediaTek Dimensity 7050, màn hình 120Hz',
        images: ['/images/realmenarzo70pro.png'],
        inStock: true,
        discount: 0,
        category: 'phone',
        brand: 'Realme',
        specs: {
            cpu: 'MediaTek Dimensity 7050',
            ram: '8GB',
            storage: '256GB',
            display: '6.67" AMOLED 120Hz',
            camera: '50MP + 8MP',
            battery: '5000mAh',
            weight: '188g'
        },
        features: [
            'MediaTek Dimensity 7050',
            'Màn hình AMOLED 120Hz',
            'Camera 50MP',
            'RAM 8GB',
            'Sạc nhanh 67W',
            'Bảo hành 12 tháng'
        ]
    },
    {
        id: 58,
        name: 'Realme Note 50',
        price: 2990000,
        description: 'Điện thoại giá rẻ với Unisoc T606, màn hình 6.74 inch, pin 5000mAh',
        images: ['/images/realmeNote50.png'],
        inStock: true,
        discount: 0,
        category: 'phone',
        brand: 'Realme',
        specs: {
            cpu: 'Unisoc T606',
            ram: '4GB',
            storage: '64GB',
            display: '6.74" HD+',
            camera: '13MP + 0.08MP',
            battery: '5000mAh',
            weight: '187g'
        },
        features: [
            'Pin 5000mAh',
            'Unisoc T606',
            'Giá cả hợp lý',
            'Màn hình lớn',
            'Camera 13MP',
            'Bảo hành 12 tháng'
        ]
    },
    {
        id: 59,
        name: 'Samsung Galaxy A55',
        price: 9490000,
        description: 'Điện thoại tầm trung với Exynos 1480, màn hình 120Hz, camera 50MP',
        images: ['/images/samsunggalaxya55.png'],
        inStock: true,
        discount: 0,
        category: 'phone',
        brand: 'Samsung',
        specs: {
            cpu: 'Exynos 1480',
            ram: '8GB',
            storage: '256GB',
            display: '6.6" Super AMOLED 120Hz',
            camera: '50MP + 12MP + 5MP',
            battery: '5000mAh',
            weight: '213g'
        },
        features: [
            'Exynos 1480',
            'Màn hình Super AMOLED 120Hz',
            'Camera 50MP',
            'RAM 8GB',
            'Sạc nhanh 25W',
            'Bảo hành 12 tháng'
        ]
    },
    {
        id: 60,
        name: 'Samsung Galaxy M55',
        price: 8990000,
        description: 'Điện thoại tầm trung với Snapdragon 7 Gen 1, màn hình 120Hz, sạc 45W',
        images: ['/images/samsunggalaxym55.png'],
        inStock: true,
        discount: 5,
        category: 'phone',
        brand: 'Samsung',
        specs: {
            cpu: 'Snapdragon 7 Gen 1',
            ram: '8GB',
            storage: '256GB',
            display: '6.7" Super AMOLED 120Hz',
            camera: '50MP + 8MP + 2MP',
            battery: '5000mAh',
            weight: '183g'
        },
        features: [
            'Snapdragon 7 Gen 1',
            'Màn hình Super AMOLED 120Hz',
            'Camera 50MP',
            'RAM 8GB',
            'Sạc nhanh 45W',
            'Bảo hành 12 tháng'
        ]
    },
    {
        id: 61,
        name: 'Samsung Galaxy S24 FE',
        price: 14990000,
        description: 'Điện thoại flagship giá tốt với Exynos 2400, màn hình 120Hz, camera 50MP',
        images: ['/images/samsunggalaxys24fe.png'],
        inStock: true,
        discount: 0,
        category: 'phone',
        brand: 'Samsung',
        specs: {
            cpu: 'Exynos 2400',
            ram: '8GB',
            storage: '256GB',
            display: '6.4" Dynamic AMOLED 120Hz',
            camera: '50MP + 12MP + 10MP',
            battery: '4500mAh',
            weight: '209g'
        },
        features: [
            'Exynos 2400',
            'Màn hình Dynamic AMOLED 120Hz',
            'Camera 50MP',
            'RAM 8GB',
            'Sạc nhanh 25W',
            'Bảo hành 12 tháng'
        ]
    },
    {
        id: 62,
        name: 'Samsung Galaxy S25',
        price: 22990000,
        description: 'Điện thoại flagship với Snapdragon 8 Gen 3, màn hình 120Hz, AI Galaxy',
        images: ['/images/samsunggalaxys25.png'],
        inStock: true,
        discount: 0,
        category: 'phone',
        brand: 'Samsung',
        specs: {
            cpu: 'Snapdragon 8 Gen 3',
            ram: '8GB',
            storage: '256GB',
            display: '6.2" Dynamic AMOLED 120Hz',
            camera: '50MP + 12MP + 10MP',
            battery: '4000mAh',
            weight: '167g'
        },
        features: [
            'Snapdragon 8 Gen 3',
            'Màn hình Dynamic AMOLED 120Hz',
            'Camera 50MP',
            'AI Galaxy',
            'Android 14',
            'Bảo hành 12 tháng'
        ]
    },
    {
        id: 63,
        name: 'Samsung Galaxy S25 Plus',
        price: 27990000,
        description: 'Điện thoại flagship màn hình lớn với Snapdragon 8 Gen 3, camera 50MP',
        images: ['/images/samsunggalaxys25plus.png'],
        inStock: true,
        discount: 0,
        category: 'phone',
        brand: 'Samsung',
        specs: {
            cpu: 'Snapdragon 8 Gen 3',
            ram: '12GB',
            storage: '512GB',
            display: '6.7" Dynamic AMOLED 120Hz',
            camera: '50MP + 12MP + 10MP',
            battery: '4900mAh',
            weight: '195g'
        },
        features: [
            'Snapdragon 8 Gen 3',
            'Màn hình Dynamic AMOLED 120Hz',
            'Camera 50MP',
            'RAM 12GB',
            'Android 14',
            'Bảo hành 12 tháng'
        ]
    },
    {
        id: 64,
        name: 'Samsung Galaxy S25 Ultra',
        price: 34990000,
        description: 'Điện thoại flagship cao cấp với Snapdragon 8 Gen 3, S Pen, camera 200MP',
        images: ['/images/samsunggalaxys25ultra.png'],
        inStock: true,
        discount: 0,
        category: 'phone',
        brand: 'Samsung',
        specs: {
            cpu: 'Snapdragon 8 Gen 3',
            ram: '12GB',
            storage: '1TB',
            display: '6.8" Dynamic AMOLED 120Hz',
            camera: '200MP + 50MP + 12MP + 10MP',
            battery: '5000mAh',
            weight: '234g'
        },
        features: [
            'Snapdragon 8 Gen 3',
            'Camera 200MP',
            'S Pen',
            'RAM 12GB',
            'Android 14',
            'Bảo hành 12 tháng'
        ]
    },
    {
        id: 65,
        name: 'Samsung Galaxy Z Flip 6',
        price: 24990000,
        description: 'Điện thoại gập màn hình nhỏ với Snapdragon 8 Gen 3, Flex Mode, camera 50MP',
        images: ['/images/samsunggalaxyzflip6.png'],
        inStock: true,
        discount: 0,
        category: 'phone',
        brand: 'Samsung',
        specs: {
            cpu: 'Snapdragon 8 Gen 3',
            ram: '12GB',
            storage: '512GB',
            display: '6.7" Dynamic AMOLED 120Hz',
            camera: '50MP + 12MP + 10MP',
            battery: '4000mAh',
            weight: '187g'
        },
        features: [
            'Snapdragon 8 Gen 3',
            'Flex Mode',
            'Camera 50MP',
            'RAM 12GB',
            'Android 14',
            'Bảo hành 12 tháng'
        ]
    },
    {
        id: 66,
        name: 'Samsung Galaxy Z Fold 6',
        price: 39990000,
        description: 'Điện thoại gập cao cấp với Snapdragon 8 Gen 3, màn hình gập 7.6 inch',
        images: ['/images/samsunggalaxyzfold6.png'],
        inStock: true,
        discount: 0,
        category: 'phone',
        brand: 'Samsung',
        specs: {
            cpu: 'Snapdragon 8 Gen 3',
            ram: '12GB',
            storage: '1TB',
            display: '7.6" Dynamic AMOLED 120Hz',
            camera: '50MP + 12MP + 10MP',
            battery: '4400mAh',
            weight: '239g'
        },
        features: [
            'Snapdragon 8 Gen 3',
            'Màn hình gập 7.6 inch',
            'Camera 50MP',
            'RAM 12GB',
            'Android 14',
            'Bảo hành 12 tháng'
        ]
    }
];

export default function ProductDetail() {
    const { id } = useParams();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [activeTab, setActiveTab] = useState('description');

    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            const foundProduct = sampleProducts.find(p => p.id === parseInt(id));
            setProduct(foundProduct || null);
            setLoading(false);
        }, 500);
    }, [id]);

    const handleAddToCart = () => {
        if (product && product.inStock) {
            addToCart({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.images[0],
                quantity: quantity
            });
        }
    };

    const handleQuantityChange = (newQuantity) => {
        if (newQuantity >= 1 && newQuantity <= 99) {
            setQuantity(newQuantity);
        }
    };

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                size={16}
                className={i < rating ? 'text-warning' : 'text-muted'}
                fill={i < rating ? 'currentColor' : 'none'}
            />
        ));
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    if (loading) {
        return (
            <Container className="mt-5">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Đang tải...</span>
                    </div>
                    <p className="mt-3">Đang tải thông tin sản phẩm...</p>
                </div>
            </Container>
        );
    }

    if (!product) {
        return (
            <Container className="mt-5">
                <Alert variant="danger">
                    <h4>Không tìm thấy sản phẩm</h4>
                    <p>Sản phẩm bạn tìm kiếm không tồn tại hoặc đã bị xóa.</p>
                    <Button variant="primary" href="/shop">
                        Quay lại cửa hàng
                    </Button>
                </Alert>
            </Container>
        );
    }

    const discountedPrice = product.discount ? product.price * (1 - product.discount / 100) : product.price;

    return (
        <Container className="mt-4 mb-5">
            {/* Breadcrumb */}
            <nav aria-label="breadcrumb" className="mb-4">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                        <Link to="/">Trang chủ</Link>
                    </li>
                    <li className="breadcrumb-item">
                        <Link to="/shop">Cửa hàng</Link>
                    </li>
                    <li className="breadcrumb-item active">{product.name}</li>
                </ol>
            </nav>

            {/* Back Button */}
            <Button variant="outline-secondary" href="/shop" className="mb-4">
                <ArrowLeft className="me-2" />
                Quay lại sản phẩm
            </Button>

            <Row>
                {/* Product Images */}
                <Col lg={6} className="mb-4">
                    <div className="product-images">
                        {/* Main Image */}
                        <div className="main-image-container mb-3">
                            <img
                                src={product.images[selectedImage]}
                                alt={product.name}
                                className="img-fluid rounded"
                                style={{
                                    width: '100%',
                                    height: '400px',
                                    objectFit: 'contain',
                                    backgroundColor: '#f8f9fa'
                                }}
                            />
                            {product.discount && (
                                <Badge
                                    bg="danger"
                                    className="position-absolute top-0 start-0 m-3"
                                    style={{ fontSize: '1.2em' }}
                                >
                                    -{product.discount}%
                                </Badge>
                            )}
                        </div>

                        {/* Thumbnail Images */}
                        {product.images.length > 1 && (
                            <div className="thumbnail-container d-flex gap-2">
                                {product.images.map((image, index) => (
                                    <img
                                        key={index}
                                        src={image}
                                        alt={`${product.name} ${index + 1}`}
                                        className={`thumbnail rounded ${selectedImage === index ? 'border-primary border-2' : 'border'}`}
                                        style={{
                                            width: '80px',
                                            height: '80px',
                                            objectFit: 'cover',
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => setSelectedImage(index)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </Col>

                {/* Product Info */}
                <Col lg={6} className="mb-4">
                    <div className="product-info">
                        {/* Product Name */}
                        <h1 className="h2 mb-3">{product.name}</h1>

                        {/* Rating */}
                        <div className="d-flex align-items-center mb-3">
                            <div className="me-2">
                                {renderStars(5)}
                            </div>
                            <span className="text-muted">(Chưa có đánh giá)</span>
                            <Badge bg="success" className="ms-2">Bán chạy</Badge>
                        </div>

                        {/* Price */}
                        <div className="price-section mb-4">
                            {product.discount ? (
                                <div className="d-flex align-items-baseline">
                                    <span className="text-decoration-line-through text-muted me-3 h5">
                                        {formatCurrency(product.price)}
                                    </span>
                                    <span className="text-danger h2">
                                        {formatCurrency(discountedPrice)}
                                    </span>
                                    <Badge bg="danger" className="ms-2">
                                        -{product.discount}%
                                    </Badge>
                                </div>
                            ) : (
                                <span className="h2 text-primary">
                                    {formatCurrency(product.price)}
                                </span>
                            )}
                        </div>

                        {/* Stock Status */}
                        <div className="mb-4">
                            {product.inStock ? (
                                <Alert variant="success" className="d-inline-block">
                                    ✓ Còn hàng - Sẵn sàng giao hàng
                                </Alert>
                            ) : (
                                <Alert variant="danger" className="d-inline-block">
                                    ✗ Hết hàng
                                </Alert>
                            )}
                        </div>

                        {/* Description */}
                        <p className="text-muted mb-4">{product.description}</p>

                        {/* Quantity Selector */}
                        <div className="quantity-selector mb-4">
                            <h6 className="mb-3">Số lượng:</h6>
                            <div className="d-flex align-items-center">
                                <Button
                                    variant="outline-secondary"
                                    size="sm"
                                    onClick={() => handleQuantityChange(quantity - 1)}
                                    disabled={quantity <= 1}
                                >
                                    <Dash size={16} />
                                </Button>
                                <Form.Control
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                                    min="1"
                                    max="99"
                                    className="mx-3 text-center"
                                    style={{ width: '80px' }}
                                />
                                <Button
                                    variant="outline-secondary"
                                    size="sm"
                                    onClick={() => handleQuantityChange(quantity + 1)}
                                    disabled={quantity >= 99}
                                >
                                    <Plus size={16} />
                                </Button>
                            </div>
                        </div>

                        {/* Add to Cart Button */}
                        <div className="d-grid gap-2 mb-4">
                            <Button
                                variant="primary"
                                size="lg"
                                onClick={handleAddToCart}
                                disabled={!product.inStock}
                            >
                                <Cart3 className="me-2" />
                                {product.inStock ? 'Thêm vào giỏ hàng' : 'Hết hàng'}
                            </Button>
                        </div>

                        {/* Benefits */}
                        <div className="benefits">
                            <div className="d-flex align-items-center mb-2">
                                <Truck className="me-2 text-primary" />
                                <span>Miễn phí vận chuyển</span>
                            </div>
                            <div className="d-flex align-items-center mb-2">
                                <Shield className="me-2 text-primary" />
                                <span>Bảo hành chính hãng 24 tháng</span>
                            </div>
                            <div className="d-flex align-items-center">
                                <CreditCard className="me-2 text-primary" />
                                <span>Thanh toán an toàn 100%</span>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>

            {/* Product Details Tabs */}
            <Row className="mt-5">
                <Col>
                    <Card>
                        <Card.Header>
                            <Tabs
                                activeKey={activeTab}
                                onSelect={(k) => setActiveTab(k)}
                                className="nav-pills"
                            >
                                <Tab eventKey="description" title="Mô tả sản phẩm" />
                                <Tab eventKey="specs" title="Thông số kỹ thuật" />
                            </Tabs>
                        </Card.Header>
                        <Card.Body>
                            <Tab.Content>
                                {/* Description Tab */}
                                {activeTab === 'description' && (
                                    <div className="text-dark">
                                        <h5 className="mb-3 text-dark">Mô tả chi tiết</h5>
                                        <p className="text-dark">{product.description}</p>
                                        
                                        <h6 className="mb-3 text-dark">Tính năng nổi bật:</h6>
                                        <ul className="text-dark">
                                            {product.features.map((feature, index) => (
                                                <li key={index}>{feature}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Specifications Tab */}
                                {activeTab === 'specs' && (
                                    <div className="text-dark">
                                        <h5 className="mb-3 text-dark">Thông số kỹ thuật</h5>
                                        <table className="table table-bordered">
                                            <tbody>
                                                {Object.entries(product.specs).map(([key, value]) => (
                                                    <tr key={key}>
                                                        <td className="fw-bold text-dark" style={{ width: '30%' }}>
                                                            {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                                                        </td>
                                                        <td className="text-dark">{value}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </Tab.Content>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            </Container>
    );
}
