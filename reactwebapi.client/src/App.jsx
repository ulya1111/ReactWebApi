import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Layout from './components/Layout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import ReportPage from './pages/ReportPage.jsx';

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route
                    index 
                    element={
                        <ProtectedRoute>
                            <HomePage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="report/:tableName"
                    element={<ProtectedRoute><ReportPage /></ProtectedRoute>}
                />

                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />

            </Route>
        </Routes>
    );
}
// сделать сортировку по имени в таблицах
// исправить данные в консоли таблицах, добавить реальные данные в бд (более интересные
