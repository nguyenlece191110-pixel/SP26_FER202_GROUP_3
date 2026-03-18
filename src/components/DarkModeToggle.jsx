import React, { useContext } from 'react';
import { Button } from 'react-bootstrap';
import { ThemeContext } from '../contexts/ThemeContext';

const DarkModeToggle = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);

    return (
        <Button 
            variant={theme === 'light' ? 'dark' : 'light'} 
            onClick={toggleTheme} 
            className="rounded-circle shadow-lg border-0"
            style={{
                position: 'fixed',
                bottom: '40px',
                left: '40px', 
                width: '50px',
                height: '50px',
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease-in-out'
            }}
            title={theme === 'light' ? "Bật chế độ tối" : "Bật chế độ sáng"}
        >
            {theme === 'light' ? (
                <i className="bi bi-moon-stars-fill text-warning fs-4 animate__animated animate__fadeIn"></i>
            ) : (
                <i className="bi bi-sun-fill text-warning fs-4 animate__animated animate__fadeIn"></i>
            )}
        </Button>
    );
};

export default DarkModeToggle;