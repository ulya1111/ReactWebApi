import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
// 👇 Импортируем компоненты для ДВУХ типов графиков
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js';
import { Pie, Line } from 'react-chartjs-2';

// 👇 "Регистрируем" все необходимые части
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title);

const API_BASE_URL = 'http://localhost:5285/api';

// Вспомогательная функция для создания данных для графика
const createChartJsData = (labels, counts, chartLabel, isLine = false) => ({
    labels,
    datasets: [
        {
            label: chartLabel,
            data: counts,
            // Для линейного графика используем один цвет с прозрачностью
            backgroundColor: isLine
                ? 'rgba(0, 123, 255, 0.2)'
                : ['rgba(255, 99, 132, 0.5)', 'rgba(54, 162, 235, 0.5)', 'rgba(255, 206, 86, 0.5)', 'rgba(75, 192, 192, 0.5)'],
            borderColor: isLine
                ? 'rgba(0, 123, 255, 1)'
                : ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)'],
            borderWidth: 2,
            fill: isLine, // Закрашивать только если это линия
            tension: 0.4, // Делает линию плавной (кривая)
        },
    ],
});

const lineDescriptions = {
    items: "График роста базы (ступеньками вверх по мере добавления записей).",
    users: "График «всплесков» активности входов (сколько человек вошло сегодня, сколько вчера).",
    orders: "График объемов заказов (количество товаров в каждой записи)."
};


export default function ReportPage() {
    const { tableName } = useParams();
    const [pieChartData, setPieChartData] = useState(null);
    const [lineChartData, setLineChartData] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        setPieChartData(null);
        setLineChartData(null);
        setError('');

        const fetchReportData = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/report/${tableName}`);
                const report = response.data;

                if (report.pieChart?.labels && report.pieChart?.counts) {
                    setPieChartData(createChartJsData(report.pieChart.labels, report.pieChart.counts, 'Распределение'));
                }

                if (report.lineChart?.labels && report.lineChart?.counts) {
                    // 👇 Добавили true в конце, чтобы функция знала, что это линия
                    setLineChartData(createChartJsData(report.lineChart.labels, report.lineChart.counts, 'Динамика / Прогресс', true));
                }
            } catch (err) {
                console.error("Failed to fetch report data:", err);
                setError(`Не удалось загрузить отчет для "${tableName}".`);
            }
        };

        fetchReportData();
    }, [tableName]);

    return (
        <div className="report-container">
            <div className="main-content-header">
                <h1 className="title">Отчет по таблице: {tableName}</h1>
                <Link to="/" className="btn">Назад к таблицам</Link>
                <p style={{
                    marginTop: '15px',
                    fontSize: '14px',
                    color: '#666',
                    fontStyle: 'italic',
                    textAlign: 'center'
                }}>
                    {lineDescriptions[tableName.toLowerCase()]}
                </p>
            </div>

            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

            <div className="charts-grid">
                {pieChartData && pieChartData.labels?.length > 0 && (
                    <div className="chart-container">
                        <h3>Распределение по категориям</h3>
                        <Pie data={pieChartData} />
                    </div>
                )}

                {lineChartData && lineChartData.labels?.length > 0 && (
                    <div className="chart-container">
                        <h3>Прогресс / Динамика</h3>
                        <Line data={lineChartData} options={{ responsive: true }} />
                    </div>
                )}
            </div>
        </div>
    );
}



