import React, { useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import TanstackGrid from '../components/TanstackGrid.jsx';

const tableLabels = {
        Items: 'Предметы',
        Users: 'Пользователи',
        Orders: 'Заказы'
    };
export default function HomePage() {
    const [selectedTable, setSelectedTable] = useState('Items');
    const tables = ['Items', 'Users', 'Orders'];
    const [refreshKey, setRefreshKey] = useState(0);
    const gridRef = useRef();
    const navigate = useNavigate();

    const handleAddRow = () => {
        if (gridRef.current) {
            gridRef.current.addRow();
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleGoToReport = () => {
        navigate(`/report/${selectedTable}`);
    }

    const forceRefresh = () => {
        setRefreshKey(oldKey => oldKey + 1);
    };

    return (
        <div className="home-layout">
            <aside className="sidebar">
                <h3>Таблицы</h3>
                <ul>
                    {tables.map(table => (
                        <li
                            key={table}
                            className={selectedTable === table ? 'active' : ''}
                            onClick={() => { setSelectedTable(table); forceRefresh(); }}
                        >
                            {tableLabels[table] || table}
                        </li>
                    ))}
                </ul>
            </aside>

            <section className="main-content">
                <div className="main-content-header">
                    <h1 className="title">{tableLabels[selectedTable] || selectedTable}</h1>
                    <div className="header-buttons"> 
                        <button className="btn" onClick={handleGoToReport}>Отчет</button>
                        <button className="btn" onClick={handleAddRow}>Добавить запись</button>
                        <button onClick={handleLogout} className="btn nav-btn">Выйти</button>
                    </div>
                </div>
                <TanstackGrid
                    key={refreshKey}
                    tableName={selectedTable}
                    ref={gridRef}
                    onDataChange={forceRefresh}
                />
            </section>
        </div>
    );
}
