import React, { useState, useEffect } from 'react';

export default function EditableCell({ getValue, row, column, table }) {
    const initialValue = getValue() ?? '';
    const [value, setValue] = useState(initialValue);

    const onBlur = () => {
        table.options.meta?.updateData(row.index, column.id, value);
    };

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    return (
        <input
            value={value}
            onChange={e => setValue(e.target.value)}
            onBlur={onBlur}
            style={{
                width: '100%',
                border: 'none',
                background: 'transparent',
                padding: '3px 3px',
                margin: 0,
                font: 'inherit'
            }}
        />
    );
}
