import React from 'react';
import HeroBanner from '../components/HeroBanner';
import { Container } from 'react-bootstrap';

export default function Home() {
    return (
        <>
            <HeroBanner />
            <Container className="mt-5 text-center">
                <h2>Sản phẩm nổi bật</h2>
                <p>Khu vực này sẽ do Minh (feature/shop) gọi API đổ dữ liệu ProductCard vào đây.</p>
            </Container>
        </>
    );
}