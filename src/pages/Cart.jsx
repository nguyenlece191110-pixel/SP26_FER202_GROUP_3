import React from 'react';
import { Container } from 'react-bootstrap';

export default function Cart() {
    return (
        <Container className="mt-5">
            <h2 className="mb-4">Giỏ hàng</h2>
            <div className="text-center text-muted">
                <p>Giỏ hàng của bạn đang trống</p>
            </div>
        </Container>
    );
}
