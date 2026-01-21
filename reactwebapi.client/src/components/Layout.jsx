import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';

export default function Layout() {
    const location = useLocation();
    const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

    const wrapperClassName = isAuthPage
        ? "layout-wrapper auth-mode"  
        : "layout-wrapper app-mode"; 

    return (
        <div className={wrapperClassName}>
            <Outlet />
        </div>
    );
}
