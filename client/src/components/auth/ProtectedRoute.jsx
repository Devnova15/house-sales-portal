import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES } from '../../constans/rotes';

const ProtectedRoute = () => {
    const { isAuthenticated, loading, user } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    // Check if user is authenticated and is an admin
    if (!isAuthenticated || !user || !user.isAdmin) {
        return <Navigate to={ROUTES.ADMIN.LOGIN} replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;