import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert, Pagination } from 'react-bootstrap';
import ProductGallery from '../components/ProductGallery';

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
        }
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
        }
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
        }
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
        }
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
        }
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
        }
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
        }
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
        }
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
        }
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
        }
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
        }
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
            cpu: 'Intel Core i5-1335U',
            ram: '8GB DDR4',
            storage: '512GB NVMe SSD',
            display: '15.6" Full HD',
            graphics: 'Intel Iris Xe',
            weight: '1.8kg'
        }
    },
    {
        id: 13,
        name: 'ASUS Zenbook 14',
        price: 24990000,
        description: 'Ultrabook cao cấp với Intel Core i7, màn hình 14 inch OLED, trọng lượng siêu nhẹ',
        images: ['/images/ASUSZenbook14.png'],
        inStock: true,
        discount: 0,
        category: 'laptop',
        brand: 'ASUS',
        specs: {
            cpu: 'Intel Core i7-1360P',
            ram: '16GB LPDDR5',
            storage: '1TB NVMe SSD',
            display: '14" 2.8K OLED',
            graphics: 'Intel Iris Xe',
            weight: '1.2kg'
        }
    },
    {
        id: 14,
        name: 'Baseus Adaman',
        price: 890000,
        description: 'Sạc dự phòng 20000mAh nhanh, hỗ trợ PD 65W, thiết kế kim loại',
        images: ['/images/BaseusAdaman.png'],
        inStock: true,
        discount: 0,
        category: 'accessories',
        brand: 'Baseus',
        specs: {
            capacity: '20000mAh',
            output: '65W PD',
            ports: '2x USB-C, 2x USB-A',
            charging: 'USB-C 30W input',
            weight: '420g',
            features: 'LED Display, Metal Case'
        }
    },
    {
        id: 15,
        name: 'Dell G15',
        price: 19990000,
        description: 'Laptop gaming tầm trung với RTX 4050, Intel Core i5, màn hình 15.6 inch 120Hz',
        images: ['/images/DellG15.png'],
        inStock: true,
        discount: 10,
        category: 'laptop',
        brand: 'Dell',
        specs: {
            cpu: 'Intel Core i5-12450H',
            ram: '8GB DDR4',
            storage: '512GB NVMe SSD',
            display: '15.6" Full HD 120Hz',
            graphics: 'NVIDIA RTX 4050 6GB',
            weight: '2.6kg'
        }
    },
    {
        id: 16,
        name: 'Dell G16',
        price: 34990000,
        description: 'Laptop gaming cao cấp với RTX 4070, Intel Core i7, màn hình 16 inch QHD 165Hz',
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
            graphics: 'NVIDIA RTX 4070 8GB',
            weight: '2.8kg'
        }
    },
    {
        id: 17,
        name: 'Dell Inspiron 14',
        price: 15990000,
        description: 'Laptop văn phòng nhỏ gọn với Intel Core i5, màn hình 14 inch, thiết kế hiện đại',
        images: ['/images/DellInspiron14.png'],
        inStock: true,
        discount: 5,
        category: 'laptop',
        brand: 'Dell',
        specs: {
            cpu: 'Intel Core i5-1335U',
            ram: '8GB DDR4',
            storage: '512GB NVMe SSD',
            display: '14" Full HD',
            graphics: 'Intel Iris Xe',
            weight: '1.5kg'
        }
    },
    {
        id: 18,
        name: 'Dell Inspiron 16',
        price: 18990000,
        description: 'Laptop văn phòng màn hình lớn 16 inch với Intel Core i7, RAM 16GB',
        images: ['/images/DellInspiron16.png'],
        inStock: true,
        discount: 0,
        category: 'laptop',
        brand: 'Dell',
        specs: {
            cpu: 'Intel Core i7-1360P',
            ram: '16GB DDR4',
            storage: '1TB NVMe SSD',
            display: '16" Full HD',
            graphics: 'Intel Iris Xe',
            weight: '1.9kg'
        }
    },
    {
        id: 19,
        name: 'Dell XPS 13',
        price: 35990000,
        description: 'Ultrabook cao cấp với Intel Core i7, màn hình 13.4 inch 4K, thiết kế siêu mỏng',
        images: ['/images/DellXPS13.png'],
        inStock: true,
        discount: 0,
        category: 'laptop',
        brand: 'Dell',
        specs: {
            cpu: 'Intel Core i7-1360P',
            ram: '16GB LPDDR5',
            storage: '1TB NVMe SSD',
            display: '13.4" 4K OLED',
            graphics: 'Intel Iris Xe',
            weight: '1.2kg'
        }
    },
    {
        id: 20,
        name: 'Dell XPS 15',
        price: 52990000,
        description: 'Laptop creative cao cấp với Intel Core i9, RTX 4060, màn hình 15.6 inch 4K OLED',
        images: ['/images/DellXPS15.png'],
        inStock: true,
        discount: 0,
        category: 'laptop',
        brand: 'Dell',
        specs: {
            cpu: 'Intel Core i9-13900H',
            ram: '32GB DDR5',
            storage: '2TB NVMe SSD',
            display: '15.6" 4K OLED',
            graphics: 'NVIDIA RTX 4060 8GB',
            weight: '1.8kg'
        }
    },
    {
        id: 21,
        name: 'HP Envy x360',
        price: 27990000,
        description: 'Laptop 2-in-1 với Intel Core i7, màn hình 15.6 inch touchscreen, bút cảm ứng',
        images: ['/images/HPEnvyx360.png'],
        inStock: true,
        discount: 8,
        category: 'laptop',
        brand: 'HP',
        specs: {
            cpu: 'Intel Core i7-1355U',
            ram: '16GB DDR4',
            storage: '1TB NVMe SSD',
            display: '15.6" Full HD Touch',
            graphics: 'Intel Iris Xe',
            weight: '1.4kg'
        }
    },
    {
        id: 22,
        name: 'HP Laptop 15s',
        price: 11990000,
        description: 'Laptop giá tốt cho sinh viên với Intel Core i3, màn hình 15.6 inch',
        images: ['/images/HPLaptop15s.png'],
        inStock: true,
        discount: 10,
        category: 'laptop',
        brand: 'HP',
        specs: {
            cpu: 'Intel Core i3-1215U',
            ram: '8GB DDR4',
            storage: '512GB NVMe SSD',
            display: '15.6" Full HD',
            graphics: 'Intel UHD Graphics',
            weight: '1.7kg'
        }
    },
    {
        id: 23,
        name: 'HP Omen 16',
        price: 38990000,
        description: 'Laptop gaming cao cấp với RTX 4070, Intel Core i7, màn hình 16 inch QHD 165Hz',
        images: ['/images/HPOMen16.png'],
        inStock: true,
        discount: 0,
        category: 'laptop',
        brand: 'HP',
        specs: {
            cpu: 'Intel Core i7-13700HX',
            ram: '16GB DDR5',
            storage: '1TB NVMe SSD',
            display: '16" QHD 165Hz',
            graphics: 'NVIDIA RTX 4070 8GB',
            weight: '2.3kg'
        }
    },
    {
        id: 24,
        name: 'HP Pavilion 14',
        price: 14990000,
        description: 'Laptop văn phòng nhẹ với Intel Core i5, màn hình 14 inch, thiết kế trẻ trung',
        images: ['/images/HPPavilion14.png'],
        inStock: true,
        discount: 0,
        category: 'laptop',
        brand: 'HP',
        specs: {
            cpu: 'Intel Core i5-1335U',
            ram: '8GB DDR4',
            storage: '512GB NVMe SSD',
            display: '14" Full HD',
            graphics: 'Intel Iris Xe',
            weight: '1.4kg'
        }
    },
    {
        id: 25,
        name: 'HP Spectre x360',
        price: 42990000,
        description: 'Laptop premium 2-in-1 với Intel Core i7, màn hình 13.5 inch 4K OLED, bút cảm ứng',
        images: ['/images/HPSpectrex360.png'],
        inStock: true,
        discount: 0,
        category: 'laptop',
        brand: 'HP',
        specs: {
            cpu: 'Intel Core i7-1360P',
            ram: '16GB LPDDR5',
            storage: '1TB NVMe SSD',
            display: '13.5" 4K OLED Touch',
            graphics: 'Intel Iris Xe',
            weight: '1.4kg'
        }
    },
    {
        id: 26,
        name: 'HP Victus 16',
        price: 24990000,
        description: 'Laptop gaming giá tốt với RTX 4060, Intel Core i5, màn hình 16 inch 144Hz',
        images: ['/images/HPVictus16.png'],
        inStock: true,
        discount: 5,
        category: 'laptop',
        brand: 'HP',
        specs: {
            cpu: 'Intel Core i5-13420H',
            ram: '16GB DDR4',
            storage: '512GB NVMe SSD',
            display: '16" Full HD 144Hz',
            graphics: 'NVIDIA RTX 4060 8GB',
            weight: '2.4kg'
        }
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
        }
    },
    {
        id: 28,
        name: 'iPhone 14 Pro Max',
        price: 28990000,
        description: 'iPhone Pro Max với chip A16, màn hình 6.7 inch, camera 48MP, Dynamic Island',
        images: ['/images/iphone14promax.png'],
        inStock: true,
        discount: 5,
        category: 'phone',
        brand: 'Apple',
        specs: {
            cpu: 'A16 Bionic',
            ram: '6GB',
            storage: '256GB',
            display: '6.7" Super Retina XDR ProMotion',
            camera: '48MP + 12MP + 12MP',
            battery: '4323mAh',
            weight: '240g'
        }
    },
    {
        id: 29,
        name: 'iPhone 16 Pro',
        price: 32990000,
        description: 'iPhone 16 Pro với chip A18 Pro, màn hình 6.3 inch, camera 48MP, titanium',
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
            weight: '197g'
        }
    },
    {
        id: 30,
        name: 'iPhone 17',
        price: 24990000,
        description: 'iPhone thế hệ mới với chip A19, màn hình 6.1 inch, camera cải tiến',
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
            battery: '3349mAh',
            weight: '171g'
        }
    },
    {
        id: 31,
        name: 'iPhone 17 Plus',
        price: 27990000,
        description: 'iPhone 17 Plus màn hình lớn 6.7 inch với chip A19, camera nâng cấp',
        images: ['/images/iphone17plus.png'],
        inStock: true,
        discount: 0,
        category: 'phone',
        brand: 'Apple',
        specs: {
            cpu: 'A19',
            ram: '8GB',
            storage: '256GB',
            display: '6.7" Super Retina XDR',
            camera: '24MP + 12MP',
            battery: '4352mAh',
            weight: '199g'
        }
    },
    {
        id: 32,
        name: 'iPhone 17 Pro',
        price: 34990000,
        description: 'iPhone 17 Pro với chip A19 Pro, màn hình 6.3 inch, camera 48MP ProRAW',
        images: ['/images/iphone17pro.png'],
        inStock: true,
        discount: 0,
        category: 'phone',
        brand: 'Apple',
        specs: {
            cpu: 'A19 Pro',
            ram: '12GB',
            storage: '512GB',
            display: '6.3" Super Retina XDR ProMotion',
            camera: '48MP + 12MP + 12MP',
            battery: '3582mAh',
            weight: '197g'
        }
    },
    {
        id: 33,
        name: 'iPhone 17 Pro Max',
        price: 39990000,
        description: 'iPhone 17 Pro Max flagship với chip A19 Pro, màn hình 6.9 inch, camera 48MP',
        images: ['/images/iphone17promax.png'],
        inStock: true,
        discount: 0,
        category: 'phone',
        brand: 'Apple',
        specs: {
            cpu: 'A19 Pro',
            ram: '12GB',
            storage: '1TB',
            display: '6.9" Super Retina XDR ProMotion',
            camera: '48MP + 12MP + 12MP',
            battery: '4422mAh',
            weight: '221g'
        }
    },
    {
        id: 34,
        name: 'Laptop ASUS Vivobook S14',
        price: 17990000,
        description: 'Laptop mỏng nhẹ với Intel Core i5, màn hình 14 inch OLED, thiết kế hiện đại',
        images: ['/images/LaptopASUSVivobookS14.png'],
        inStock: true,
        discount: 7,
        category: 'laptop',
        brand: 'ASUS',
        specs: {
            cpu: 'Intel Core i5-1335U',
            ram: '8GB LPDDR4',
            storage: '512GB NVMe SSD',
            display: '14" Full HD OLED',
            graphics: 'Intel Iris Xe',
            weight: '1.4kg'
        }
    },
    {
        id: 35,
        name: 'Lenovo IdeaPad 3',
        price: 10990000,
        description: 'Laptop giá tốt cho sinh viên với AMD Ryzen 5, màn hình 15.6 inch',
        images: ['/images/LenovoIdeaPad3.png'],
        inStock: true,
        discount: 10,
        category: 'laptop',
        brand: 'Lenovo',
        specs: {
            cpu: 'AMD Ryzen 5 5500U',
            ram: '8GB DDR4',
            storage: '512GB NVMe SSD',
            display: '15.6" Full HD',
            graphics: 'AMD Radeon Graphics',
            weight: '1.8kg'
        }
    },
    {
        id: 36,
        name: 'Lenovo IdeaPad Slim 5',
        price: 14990000,
        description: 'Laptop mỏng nhẹ với AMD Ryzen 7, màn hình 14 inch, thiết kế hiện đại',
        images: ['/images/LenovoIdeaPadSlim5.png'],
        inStock: true,
        discount: 0,
        category: 'laptop',
        brand: 'Lenovo',
        specs: {
            cpu: 'AMD Ryzen 7 7730U',
            ram: '16GB LPDDR5',
            storage: '512GB NVMe SSD',
            display: '14" Full HD',
            graphics: 'AMD Radeon Graphics',
            weight: '1.3kg'
        }
    },
    {
        id: 37,
        name: 'Lenovo Legion 5 Pro',
        price: 32990000,
        description: 'Laptop gaming với RTX 4070, AMD Ryzen 7, màn hình 16 inch QHD 165Hz',
        images: ['/images/LenovoLegion5Pro.png'],
        inStock: true,
        discount: 0,
        category: 'laptop',
        brand: 'Lenovo',
        specs: {
            cpu: 'AMD Ryzen 7 7840HS',
            ram: '32GB DDR5',
            storage: '1TB NVMe SSD',
            display: '16" QHD 165Hz IPS',
            graphics: 'NVIDIA RTX 4070 8GB',
            weight: '2.5kg'
        }
    },
    {
        id: 38,
        name: 'Lenovo Legion 7i',
        price: 49990000,
        description: 'Laptop gaming cao cấp với RTX 4080, Intel Core i9, màn hình 16 inch QHD 240Hz',
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
        }
    },
    {
        id: 39,
        name: 'Lenovo Yoga 7i',
        price: 24990000,
        description: 'Laptop 2-in-1 với Intel Core i7, màn hình 14 inch touchscreen, bút cảm ứng',
        images: ['/images/LenovoYoga7i.png'],
        inStock: true,
        discount: 5,
        category: 'laptop',
        brand: 'Lenovo',
        specs: {
            cpu: 'Intel Core i7-1355U',
            ram: '16GB LPDDR5',
            storage: '1TB NVMe SSD',
            display: '14" Full HD Touch',
            graphics: 'Intel Iris Xe',
            weight: '1.4kg'
        }
    },
    {
        id: 40,
        name: 'Lenovo Yoga 9i',
        price: 38990000,
        description: 'Laptop premium 2-in-1 với Intel Core i7, màn hình 14 inch 4K OLED, bút cảm ứng',
        images: ['/images/LenovoYoga9i.png'],
        inStock: true,
        discount: 0,
        category: 'laptop',
        brand: 'Lenovo',
        specs: {
            cpu: 'Intel Core i7-1360P',
            ram: '16GB LPDDR5',
            storage: '1TB NVMe SSD',
            display: '14" 4K OLED Touch',
            graphics: 'Intel Iris Xe',
            weight: '1.4kg'
        }
    },
    {
        id: 41,
        name: 'Redmi Note 11 Pro+',
        price: 8990000,
        description: 'Điện thoại gaming với Snapdragon 870, màn hình 120Hz, sạc 120W',
        images: ['/images/nubiaredmagic11proplus.png'],
        inStock: true,
        discount: 10,
        category: 'phone',
        brand: 'Redmi',
        specs: {
            cpu: 'Snapdragon 870',
            ram: '8GB',
            storage: '256GB',
            display: '6.67" AMOLED 120Hz',
            camera: '108MP + 8MP + 2MP',
            battery: '4500mAh',
            weight: '204g'
        }
    },
    {
        id: 42,
        name: 'OPPO A3',
        price: 3990000,
        description: 'Điện thoại giá tốt với MediaTek Helio, màn hình 6.7 inch, pin 5000mAh',
        images: ['/images/oppoa3.png'],
        inStock: true,
        discount: 5,
        category: 'phone',
        brand: 'OPPO',
        specs: {
            cpu: 'MediaTek Helio G85',
            ram: '6GB',
            storage: '128GB',
            display: '6.7" HD+',
            camera: '50MP + 2MP',
            battery: '5000mAh',
            weight: '188g'
        }
    },
    {
        id: 43,
        name: 'OPPO A59',
        price: 4490000,
        description: 'Điện thoại tầm trung với MediaTek Dimensity, màn hình 6.56 inch',
        images: ['/images/oppoa59.png'],
        inStock: true,
        discount: 0,
        category: 'phone',
        brand: 'OPPO',
        specs: {
            cpu: 'MediaTek Dimensity 700',
            ram: '6GB',
            storage: '128GB',
            display: '6.56" HD+',
            camera: '13MP + 2MP',
            battery: '5000mAh',
            weight: '189g'
        }
    },
    {
        id: 44,
        name: 'OPPO A79',
        price: 5990000,
        description: 'Điện thoại tầm trung với MediaTek Helio, màn hình 6.72 inch, camera 50MP',
        images: ['/images/oppoa79.png'],
        inStock: true,
        discount: 0,
        category: 'phone',
        brand: 'OPPO',
        specs: {
            cpu: 'MediaTek Helio G85',
            ram: '8GB',
            storage: '128GB',
            display: '6.72" HD+',
            camera: '50MP + 2MP',
            battery: '5000mAh',
            weight: '195g'
        }
    },
    {
        id: 45,
        name: 'OPPO Find N3',
        price: 24990000,
        description: 'Điện thoại gập cao cấp với Snapdragon 8 Gen 2, màn hình gập 7.82 inch',
        images: ['/images/oppofindn3.png'],
        inStock: true,
        discount: 0,
        category: 'phone',
        brand: 'OPPO',
        specs: {
            cpu: 'Snapdragon 8 Gen 2',
            ram: '16GB',
            storage: '512GB',
            display: '7.82" Foldable AMOLED',
            camera: '50MP + 48MP + 32MP',
            battery: '4805mAh',
            weight: '236g'
        }
    },
    {
        id: 46,
        name: 'OPPO Find X7 Ultra',
        price: 22990000,
        description: 'Điện thoại flagship với Snapdragon 8 Gen 3, camera Hasselblad, màn hình 120Hz',
        images: ['/images/oppofindx7ultra.png'],
        inStock: true,
        discount: 5,
        category: 'phone',
        brand: 'OPPO',
        specs: {
            cpu: 'Snapdragon 8 Gen 3',
            ram: '16GB',
            storage: '256GB',
            display: '6.82" AMOLED 120Hz',
            camera: '50MP + 50MP + 50MP',
            battery: '5000mAh',
            weight: '221g'
        }
    },
    {
        id: 47,
        name: 'OPPO K12x',
        price: 4990000,
        description: 'Điện thoại gaming giá tốt với MediaTek Helio, màn hình 120Hz, pin 5000mAh',
        images: ['/images/oppok12x.png'],
        inStock: true,
        discount: 0,
        category: 'phone',
        brand: 'OPPO',
        specs: {
            cpu: 'MediaTek Helio G99',
            ram: '8GB',
            storage: '128GB',
            display: '6.67" AMOLED 120Hz',
            camera: '64MP + 8MP',
            battery: '5000mAh',
            weight: '186g'
        }
    },
    {
        id: 48,
        name: 'OPPO Reno 12',
        price: 8990000,
        description: 'Điện thoại camera mạnh với MediaTek Dimensity, màn hình 120Hz, thiết kế đẹp',
        images: ['/images/opporeno12.png'],
        inStock: true,
        discount: 0,
        category: 'phone',
        brand: 'OPPO',
        specs: {
            cpu: 'MediaTek Dimensity 8200',
            ram: '8GB',
            storage: '256GB',
            display: '6.7" AMOLED 120Hz',
            camera: '50MP + 32MP + 8MP',
            battery: '4800mAh',
            weight: '182g'
        }
    },
    {
        id: 49,
        name: 'OPPO Reno 12 Pro',
        price: 12990000,
        description: 'Điện thoại camera chuyên nghiệp với Snapdragon 7 Gen 3, telephoto 2x',
        images: ['/images/opporeno12pro.png'],
        inStock: true,
        discount: 0,
        category: 'phone',
        brand: 'OPPO',
        specs: {
            cpu: 'Snapdragon 7 Gen 3',
            ram: '12GB',
            storage: '256GB',
            display: '6.7" AMOLED 120Hz',
            camera: '50MP + 50MP + 8MP',
            battery: '4800mAh',
            weight: '184g'
        }
    },
    {
        id: 50,
        name: 'Realme 12 Pro+',
        price: 7990000,
        description: 'Điện thoại camera telephoto 3x với Snapdragon 6 Gen 1, màn hình 120Hz',
        images: ['/images/realme12pro+.png'],
        inStock: true,
        discount: 10,
        category: 'phone',
        brand: 'Realme',
        specs: {
            cpu: 'Snapdragon 6 Gen 1',
            ram: '8GB',
            storage: '256GB',
            display: '6.7" AMOLED 120Hz',
            camera: '50MP + 8MP + 32MP',
            battery: '5000mAh',
            weight: '196g'
        }
    },
    {
        id: 51,
        name: 'Realme 13 Pro',
        price: 8990000,
        description: 'Điện thoại tầm trung với Snapdragon 7s Gen 2, camera 50MP, sạc 67W',
        images: ['/images/realme13pro.png'],
        inStock: true,
        discount: 0,
        category: 'phone',
        brand: 'Realme',
        specs: {
            cpu: 'Snapdragon 7s Gen 2',
            ram: '8GB',
            storage: '256GB',
            display: '6.7" AMOLED 120Hz',
            camera: '50MP + 8MP',
            battery: '5000mAh',
            weight: '191g'
        }
    },
    {
        id: 52,
        name: 'Realme 15 Pro 5G',
        price: 10990000,
        description: 'Điện thoại 5G tầm trung với Snapdragon 6 Gen 1, màn hình 120Hz',
        images: ['/images/realme15pro5g.png'],
        inStock: true,
        discount: 5,
        category: 'phone',
        brand: 'Realme',
        specs: {
            cpu: 'Snapdragon 6 Gen 1',
            ram: '8GB',
            storage: '256GB',
            display: '6.7" AMOLED 120Hz',
            camera: '64MP + 8MP + 2MP',
            battery: '5000mAh',
            weight: '189g'
        }
    },
    {
        id: 53,
        name: 'Realme C63',
        price: 3490000,
        description: 'Điện thoại giá tốt với Unisoc T606, màn hình 6.8 inch, pin 5000mAh',
        images: ['/images/realmeC63.png'],
        inStock: true,
        discount: 0,
        category: 'phone',
        brand: 'Realme',
        specs: {
            cpu: 'Unisoc T606',
            ram: '4GB',
            storage: '64GB',
            display: '6.8" HD+',
            camera: '50MP + 0.08MP',
            battery: '5000mAh',
            weight: '199g'
        }
    },
    {
        id: 54,
        name: 'Realme C67',
        price: 4290000,
        description: 'Điện thoại giá tốt với Snapdragon 685, màn hình 90Hz, sạc 33W',
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
            weight: '189g'
        }
    },
    {
        id: 55,
        name: 'Realme GT 6',
        price: 15990000,
        description: 'Điện thoại flagship với Snapdragon 8 Gen 3, màn hình 144Hz, sạc 120W',
        images: ['/images/realmeGT6.png'],
        inStock: true,
        discount: 0,
        category: 'phone',
        brand: 'Realme',
        specs: {
            cpu: 'Snapdragon 8 Gen 3',
            ram: '16GB',
            storage: '256GB',
            display: '6.78" AMOLED 144Hz',
            camera: '50MP + 50MP + 8MP',
            battery: '5500mAh',
            weight: '199g'
        }
    },
    {
        id: 56,
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
        }
    },
    {
        id: 57,
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
        }
    },
    {
        id: 58,
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
        }
    },
    {
        id: 59,
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
        }
    },
    {
        id: 60,
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
        }
    },
    {
        id: 61,
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
        }
    },
    {
        id: 62,
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
        }
    },
    {
        id: 63,
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
        }
    },
    {
        id: 64,
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
        }
    },
    {
        id: 65,
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
        }
    }
];

export default function Shop() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 12;

    // Simulate API call
    useEffect(() => {
        setTimeout(() => {
            setProducts(sampleProducts);
            setFilteredProducts(sampleProducts);
            setLoading(false);
        }, 1000);
    }, []);

    // Filter and sort products
    useEffect(() => {
        let result = [...products];

        // Filter by search term
        if (searchTerm) {
            result = result.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Sort products
        switch (sortBy) {
            case 'price-asc':
                result.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                result.sort((a, b) => b.price - a.price);
                break;
            case 'name':
                result.sort((a, b) => a.name.localeCompare(b.name));
                break;
            default:
                break;
        }

        setFilteredProducts(result);
        setCurrentPage(1); // Reset to first page when filtering
    }, [products, searchTerm, sortBy]);

    // Pagination
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (loading) {
        return (
            <Container className="mt-5">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Đang tải...</span>
                    </div>
                    <p className="mt-3">Đang tải sản phẩm...</p>
                </div>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <h1 className="mb-4">Cửa hàng TechHub</h1>
            
            {/* Search and Filter */}
            <Row className="mb-4">
                <Col md={6}>
                    <Form.Control
                        type="text"
                        placeholder="Tìm kiếm sản phẩm..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </Col>
                <Col md={3}>
                    <Form.Select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="name">Sắp xếp theo tên</option>
                        <option value="price-asc">Giá: Thấp đến cao</option>
                        <option value="price-desc">Giá: Cao đến thấp</option>
                    </Form.Select>
                </Col>
                <Col md={3}>
                    <Button variant="outline-secondary" onClick={() => {
                        setSearchTerm('');
                        setSortBy('name');
                    }}>
                        Đặt lại
                    </Button>
                </Col>
            </Row>

            {/* Results count */}
            <div className="mb-3">
                <p className="text-muted">
                    Tìm thấy {filteredProducts.length} sản phẩm
                    {filteredProducts.length > 0 && (
                        <span className="ms-2">
                            - Trang {currentPage} của {totalPages}
                        </span>
                    )}
                </p>
            </div>

            {/* Products Grid */}
            <ProductGallery products={currentProducts} />

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-4">
                    <Pagination>
                        <Pagination.Prev
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                        />
                        
                        {Array.from({ length: totalPages }, (_, index) => (
                            <Pagination.Item
                                key={index + 1}
                                active={index + 1 === currentPage}
                                onClick={() => paginate(index + 1)}
                            >
                                {index + 1}
                            </Pagination.Item>
                        ))}
                        
                        <Pagination.Next
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        />
                    </Pagination>
                </div>
            )}

            {/* No results */}
            {filteredProducts.length === 0 && !loading && (
                <Alert variant="info" className="text-center">
                    <h4>Không tìm thấy sản phẩm nào</h4>
                    <p>Vui lòng thử lại với từ khóa khác!</p>
                </Alert>
            )}
        </Container>
    );
}