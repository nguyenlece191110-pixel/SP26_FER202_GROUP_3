import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    // Kiểm tra trạng thái đăng nhập khi load lại trang
    useEffect(() => {
        // sessionStorage is cleared automatically when browser/tab closes
        const storedUser = sessionStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    // Xử lý Đăng nhập với dữ liệu thật từ JSON-server
    const login = async (email, password) => {
        console.debug('login called with', { email, password });
        try {
            // fetch full list then filter locally to avoid query encoding quirks
            const res = await axios.get('http://localhost:5000/users');
            console.log('fetched users', res.data);
            const candidates = Array.isArray(res.data) ? res.data : [];
            const loggedInUser = candidates.find(u => u.email === email && u.password === password);

            if (loggedInUser) {
                console.log('login success, user=', loggedInUser);
                setUser(loggedInUser);
                // persist only for current browsing session
                sessionStorage.setItem('user', JSON.stringify(loggedInUser));
                navigate('/');
            } else {
                console.warn('login failed: no matching user', { email, password });
                alert("Email hoặc mật khẩu không chính xác!");
            }
        } catch (error) {
            console.error("Lỗi kết nối server:", error);
            alert("Kiểm tra JSON Server đang chạy tại http://localhost:5000!");
        }
    };

    const logout = () => {
        setUser(null);
        sessionStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = React.useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};