import React, { useState, useEffect, useMemo, forwardRef, useImperativeHandle } from 'react';
import axios from 'axios';
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';
import EditableCell from './EditableCell.jsx';

const columnLabels = {
    id: 'ID',
    name: 'Название',
    value: 'Значение',
    username: 'Имя пользователя',
    lastLoginDate: 'Последний вход',
    item: 'Товар',
    quantity: 'Количество',
    status: 'Статус',
    actions: 'Действия'
};

const columnDefsConfig = {
    items: ['id', 'name', 'value'],
    users: ['id', 'username', 'lastLoginDate'],
    orders: ['id', 'item', 'quantity', 'status'],
};

const API_BASE_URL = 'http://localhost:5285/api';

const TanstackGrid = forwardRef(function TanstackGrid({ tableName, onDataChange }, ref) {
    const [data, setData] = useState([]);

    useEffect(() => {
        axios.get(`${API_BASE_URL}/table/${tableName}`)
            .then(response => {
                const sortedData = Array.isArray(response.data)
                    ? response.data.sort((a, b) => a.id - b.id)
                    : [];
                setData(sortedData);
            })
            .catch(error => {
                console.error(`Ошибка загрузки таблицы ${tableName}:`, error);
                setData([]);
            });
    }, [tableName]);

    const saveNewRow = async (rowToSave) => {
        const { isNew, id, ...payload } = rowToSave;
        if (tableName.toLowerCase() === 'items' && (!payload.name || payload.name.trim() === '')) {
            alert("Поле 'Название' обязательно для заполнения.");
            return;
        }
        try {
            await axios.post(`${API_BASE_URL}/table/${tableName}`, payload);
            onDataChange();
        } catch (error) {
            console.error("Ошибка при создании записи:", error);
            alert("Не удалось создать запись.");
        }
    };

    const removeRow = async (rowIndex) => {
        const rowId = data[rowIndex]?.id;
        if (!rowId) {
            setData(old => old.filter((_, index) => index !== rowIndex));
            return;
        }
        if (!window.confirm("Вы уверены, что хотите удалить эту запись?")) return;
        try {
            await axios.delete(`${API_BASE_URL}/table/${tableName}/${rowId}`);
            onDataChange();
        } catch (error) {
            console.error("Ошибка при удалении записи:", error);
            alert("Не удалось удалить запись.");
        }
    };

    useImperativeHandle(ref, () => ({
        addRow: () => setData(old => [...old, { isNew: true }])
    }));

    const columns = useMemo(() => {
        const fields = columnDefsConfig[tableName.toLowerCase()] || [];
        const tableColumns = fields.map(field => {
            if (field === 'lastLoginDate') {
                return {
                    accessorKey: field,
                    header: columnLabels[field] || field.toUpperCase(),
                    cell: info => {
                        const val = info.getValue();
                        return val ? new Date(val).toLocaleString('ru-RU') : 'Никогда';
                    }
                };
            }
            return {
                accessorKey: field,
                header: columnLabels[field] || field.toUpperCase(),
                cell: (info) => {
                    if (info.row.original?.isNew || field !== 'id') {
                        return <EditableCell {...info} />;
                    }
                    return info.getValue();
                }
            };
        });
        return [
            ...tableColumns,
            {
                id: 'actions',
                header: columnLabels['actions'],
                cell: ({ row }) => (
                    <div style={{ textAlign: 'center' }}>
                        {row.original?.isNew ? (
                            <button className="btn" style={{ backgroundColor: '#28a745' }} onClick={() => saveNewRow(row.original)}>Сохранить</button>
                        ) : (
                            <button className="btn delete" onClick={() => removeRow(row.index)}>Удалить</button>
                        )}
                    </div>
                ),
            }
        ];
    }, [tableName, data]);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        meta: {
            updateData: (rowIndex, columnId, value) => {
                setData(old => old.map((row, index) => (index === rowIndex ? { ...row, [columnId]: value } : row)));
                const rowToUpdate = data[rowIndex];
                if (rowToUpdate && !rowToUpdate.isNew) {
                    axios.put(`${API_BASE_URL}/table/${tableName}/${rowToUpdate.id}`, { [columnId]: value })
                        .then(() => onDataChange())
                        .catch(err => {
                            console.error("Ошибка при обновлении записи:", err);
                            onDataChange();
                        });
                }
            },
        },
    });

    const sortById = () => {
        const sorted = [...data].sort((a, b) => {
            if (data.length > 1 && data[0].id < data[1].id) {
                return b.id - a.id;
            }
            return a.id - b.id;
        });
        setData(sorted);
    };

    return (
        <div className="table-container">
            <table className="tanstack-table">
                <thead>
                    {table.getHeaderGroups().map(hg => (
                        <tr key={hg.id}>
                            {hg.headers.map(h => {
                                const isIdColumn = h.id === 'id';
                                return (
                                    <th
                                        key={h.id}
                                        colSpan={h.colSpan}
                                        className={isIdColumn ? 'sortable id-header' : ''}
                                        onClick={isIdColumn ? sortById : undefined}
                                    >
                                        {flexRender(h.column.columnDef.header, h.getContext())}
                                    </th>
                                );
                            })}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map(row => (
                        <tr key={row.id}>
                            {row.getVisibleCells().map(c => (
                                <td key={c.id}>{flexRender(c.column.columnDef.cell, c.getContext())}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
});

export default TanstackGrid;
