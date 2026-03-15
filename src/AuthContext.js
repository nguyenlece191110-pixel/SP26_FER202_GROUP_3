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
        // sessionStorage is cleared automatically when browser/tab closes
        const storedUser = sessionStorage.getItem('user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                // Kiểm tra user có hợp lệ không (có trong database)
                // Nếu không hợp lệ, xóa và đăng xuất lại
                if (!parsedUser || !parsedUser.email) {
                    sessionStorage.removeItem('user');
                    setUser(null);
                    return;
                }
                setUser(parsedUser);
            } catch (error) {
                console.error('Error parsing stored user:', error);
                sessionStorage.removeItem('user');
                setUser(null);
            }
        }
    }, []);

    // Xử lý Đăng nhập với dữ liệu thật từ JSON-server
    const login = async (email, password) => {
        console.debug('login called with', { email, password });
        try {
            // fetch full list then filter locally to avoid query encoding quirks
            const res = await axios.get(USERS_API);
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

    const loginWithGoogle = async (googleUser) => {
        try {
            const { email, name, picture } = googleUser || {};

            if (!email) {
                alert('Không lấy được email từ Google. Vui lòng thử lại.');
                return;
            }

            const res = await axios.get(USERS_API);
            const candidates = Array.isArray(res.data) ? res.data : [];
            const existingUser = candidates.find(u => u.email === email);

            if (existingUser) {
                const mergedUser = {
                    ...existingUser,
                    authProvider: existingUser.authProvider || 'google',
                    avatar: existingUser.avatar || picture || ''
                };
                setUser(mergedUser);
                sessionStorage.setItem('user', JSON.stringify(mergedUser));
                navigate('/');
                return;
            }

            const newGoogleUser = {
                id: Date.now().toString(),
                name: name || email.split('@')[0],
                email,
                password: '',
                role: 'user',
                authProvider: 'google',
                avatar: picture || ''
            };

            const created = await axios.post(USERS_API, newGoogleUser);
            setUser(created.data);
            sessionStorage.setItem('user', JSON.stringify(created.data));
            navigate('/');
        } catch (error) {
            console.error('Lỗi đăng nhập Google:', error);
            alert('Đăng nhập Google thất bại. Kiểm tra JSON Server và thử lại.');
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

// Custom hook để sử dụng AuthContext
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};