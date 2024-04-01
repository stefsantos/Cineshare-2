import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../src/UserContext';
import AdminPage from "../src/pages/admin_page";

const AdminGuard = () => {
    const { activeusername } = useUser(); 
    const isAdmin = activeusername === 'admin123';

    return isAdmin ? <AdminPage /> : <Navigate to="/home_page" replace />;
};

export default AdminGuard;
