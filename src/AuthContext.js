import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    // Kiểm tra trạng thái đăng nhập khi load lại trang
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    // Xử lý Đăng nhập với dữ liệu thật từ JSON-server
    const login = async (email, password) => {
        try {
            const res = await axios.get(`http://localhost:5000/users?email=${email}&password=${password}`);

            if (res.data.length > 0) {
                const loggedInUser = res.data[0];
                setUser(loggedInUser);
                localStorage.setItem('user', JSON.stringify(loggedInUser));
                navigate('/');
            } else {
                alert("Email hoặc mật khẩu không chính xác!");
            }
        } catch (error) {
            console.error("Lỗi kết nối server:", error);
            alert("Kiểm tra JSON Server đang chạy tại http://localhost:5000!");
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};