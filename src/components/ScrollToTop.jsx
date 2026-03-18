import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';

const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
        if (window.pageYOffset > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    if (!isVisible) return null;

    return (
        <Button 
            variant="primary" 
            onClick={scrollToTop} 
            className="rounded-circle shadow-lg"
            style={{
                position: 'fixed',
                bottom: '40px',
                right: '40px',
                width: '50px',
                height: '50px',
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease-in-out'
            }}
            title="Lên đầu trang"
        >
            <i className="bi bi-arrow-up fs-4"></i>
        </Button>
    );
};

export default ScrollToTop;