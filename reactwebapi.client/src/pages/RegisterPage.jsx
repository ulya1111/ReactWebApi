import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const API_URL = 'http://localhost:5285/api/auth';

export default function RegisterPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (password.length < 8) {
            setError("Пароль должен быть не менее 8 символов.");
            return;
        }

        try {
            await axios.post(`${API_URL}/register`, {
                username,
                password,
            });
            setSuccess('Регистрация прошла успешно! Сейчас вы будете перенаправлены на страницу входа.');

            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (err) {
            console.error("Registration error:", err);
            if (err.response && err.response.status === 400) {
                setError('Пользователь с таким именем уже существует.');
            } else {
                setError('Произошла ошибка на сервере. Попробуйте снова позже.');
            }
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-tabs">
                <Link to="/login" className="auth-tab">
                    Вход
                </Link>
                <Link to="/register" className="auth-tab active">
                    Регистрация
                </Link>
            </div>

            <div className="form-card">
                <h2 className="title" style={{ marginBottom: '1.5rem' }}>Создание аккаунта</h2>
                <form onSubmit={handleRegister}>
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
                            placeholder="Минимум 8 символов"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && <p style={{ color: 'red', textAlign: 'center', marginTop: '1rem' }}>{error}</p>}
                    {success && <p style={{ color: 'green', textAlign: 'center', marginTop: '1rem' }}>{success}</p>}

                    <button type="submit" className="btn" style={{ marginTop: '1rem' }}>
                        Зарегистрироваться
                    </button>
                </form>
            </div>
        </div>
    );
}
