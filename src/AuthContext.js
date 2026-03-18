import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const USERS_API = 'http://localhost:5000/users';

    // Kiểm tra trạng thái đăng nhập khi load lại trang
    useEffect(() => {
        // Kiểm tra localStorage trước (Remember me), sau đó kiểm tra sessionStorage
        const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                // Kiểm tra user có hợp lệ không (có trong database)
                if (!parsedUser || !parsedUser.email) {
                    localStorage.removeItem('user');
                    sessionStorage.removeItem('user');
                    setUser(null);
                    return;
                }
                setUser(parsedUser);
            } catch (error) {
                console.error('Error parsing stored user:', error);
                localStorage.removeItem('user');
                sessionStorage.removeItem('user');
                setUser(null);
            }
        }
    }, []);

    // Xử lý Đăng nhập với dữ liệu thật từ JSON-server
    const login = async (email, password, rememberMe = false) => {
        console.debug('login called with', { email, password, rememberMe });
        try {
            // fetch full list then filter locally to avoid query encoding quirks
            const res = await axios.get(USERS_API);
            console.log('fetched users', res.data);
            const candidates = Array.isArray(res.data) ? res.data : [];
            const loggedInUser = candidates.find(u => u.email === email && u.password === password);

            if (loggedInUser) {
                console.log('login success, user=', loggedInUser);
                setUser(loggedInUser);
                // Lưu vào localStorage nếu chọn "Ghi nhớ tôi", ngược lại lưu vào sessionStorage
                if (rememberMe) {
                    localStorage.setItem('user', JSON.stringify(loggedInUser));
                    sessionStorage.removeItem('user');
                } else {
                    sessionStorage.setItem('user', JSON.stringify(loggedInUser));
                    localStorage.removeItem('user');
                }
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
        localStorage.removeItem('user');
        sessionStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook để sử dụng AuthContext
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};