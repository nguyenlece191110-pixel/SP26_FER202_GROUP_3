import React from 'react';
import { Carousel, Container } from 'react-bootstrap';

export default function HeroBanner() {
    return (
        /* Dùng class 'overflow-hidden' và 'rounded-bottom' của Bootstrap để bo góc dưới banner */
        <Carousel className="hero-carousel shadow-sm mb-4 overflow-hidden rounded-bottom">
            
            {/* Slide 1: brand1.jpg */}
            <Carousel.Item interval={3000}>
                <img
                    className="d-block w-100"
                    src="/images/brand1.png"
                    alt="First slide"
                    style={{ height: '450px', objectFit: 'cover', backgroundColor: '#f1f1f1' }}
                />
            </Carousel.Item>

            {/* Slide 2: brand2.jpg */}
            <Carousel.Item interval={3000}>
                <img
                    className="d-block w-100"
                    src="/images/brand2.jpg"
                    alt="Second slide"
                    style={{ height: '450px', objectFit: 'cover', backgroundColor: '#f1f1f1' }}
                />
            </Carousel.Item>

            {/* Slide 3: brand3.jpg */}
            <Carousel.Item interval={3000}>
                <img
                    className="d-block w-100"
                    src="/images/brand3.png"
                    alt="Third slide"
                    style={{ height: '450px', objectFit: 'cover', backgroundColor: '#f1f1f1' }}
                />
            </Carousel.Item>
            
        </Carousel>
    );
}