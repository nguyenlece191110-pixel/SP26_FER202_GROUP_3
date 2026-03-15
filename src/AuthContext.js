import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

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

    const loginWithGoogle = async (credentialResponse) => {
        try {
            if (!credentialResponse?.credential) {
                alert('Không nhận được dữ liệu từ Google. Vui lòng thử lại.');
                return;
            }

            const decoded = jwtDecode(credentialResponse.credential);
            const googleEmail = decoded?.email;

            if (!googleEmail) {
                alert('Không thể đọc email từ tài khoản Google.');
                return;
            }

            const usersResponse = await axios.get('http://localhost:5000/users');
            const candidates = Array.isArray(usersResponse.data) ? usersResponse.data : [];
            let loggedInUser = candidates.find((u) => u.email === googleEmail);

            if (!loggedInUser) {
                const newGoogleUser = {
                    name: decoded?.name || googleEmail,
                    email: googleEmail,
                    password: '',
                    role: 'user',
                    googleId: decoded?.sub || null,
                    avatar: decoded?.picture || ''
                };

                const createdUserRes = await axios.post('http://localhost:5000/users', newGoogleUser);
                loggedInUser = createdUserRes.data;
            }

            setUser(loggedInUser);
            sessionStorage.setItem('user', JSON.stringify(loggedInUser));
            navigate('/');
        } catch (error) {
            console.error('Google login error:', error);
            alert('Đăng nhập Google thất bại. Vui lòng thử lại.');
        }
    };

    const logout = () => {
        setUser(null);
        sessionStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, loginWithGoogle, logout }}>
            {children}
        </AuthContext.Provider>
    );
};