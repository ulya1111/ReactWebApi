import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const API_URL = 'http://localhost:5285/api/auth';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        if (!username || !password) {
            setError('Пожалуйста, заполните все поля.');
            return;
        }

        try {
            const response = await axios.post(`${API_URL}/login`, {
                username,
                password,
            });

            
            localStorage.setItem('token', response.data.token);
            navigate('/');
            window.location.reload();

        } catch (err) {
            console.error("Login error:", err);
            if (err.response && err.response.status === 400) {
                setError('Неверное имя пользователя или пароль.');
            } else {
                setError('Произошла ошибка. Попробуйте снова позже.');
            }
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-tabs">
                <Link to="/login" className="auth-tab active">
                    Вход
                </Link>
                <Link to="/register" className="auth-tab">
                    Регистрация
                </Link>
            </div>

            <div className="form-card">
                <h2 className="title" style={{ marginBottom: '1.5rem' }}>Вход в аккаунт</h2>
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>Имя пользователя</label>
                        <input
                            className="input"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Пароль</label>
                        <input
                            className="input"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p style={{ color: 'red', textAlign: 'center', marginTop: '1rem' }}>{error}</p>}
                    <button type="submit" className="btn" style={{ marginTop: '1rem' }}>
                        Войти
                    </button>
                </form>
            </div>
        </div>
    );
}
