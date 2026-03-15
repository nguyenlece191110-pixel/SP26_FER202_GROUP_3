<<<<<<< Updated upstream
import React from 'react';
import { Container } from 'react-bootstrap';
=======
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext'; 
import { Container, Alert, Button } from 'react-bootstrap';
>>>>>>> Stashed changes

export default function Admin() {
    return (
        <Container className="mt-5">
            <h2 className="mb-4">Trang Quản Trị</h2>
            <p>Đây là trang quản trị dành cho admin</p>
        </Container>
    );
}
