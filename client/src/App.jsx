import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/common/Layout';
import HomePage from './pages/HomePage/HomePage';
import HouseListPage from './pages/HouseListPage/HouseListPage';
import HouseDetailPage from './pages/HouseDetailPage/HouseDetailPage';
import AboutPage from './pages/AboutPage/AboutPage';
import ContactPage from './pages/ContactPage/ContactPage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import AdminLoginPage from './pages/AdminLoginPage/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage/AdminDashboardPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import './App.css';
import {ROUTES} from "./constans/rotes.js";

const queryClient = new QueryClient();

const App = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<HomePage />} />
                        <Route path="houses" element={<HouseListPage />} />
                        <Route path="houses/:id" element={<HouseDetailPage />} />
                        <Route path="about" element={<AboutPage />} />
                        <Route path="contact" element={<ContactPage />} />
                        <Route path="*" element={<NotFoundPage />} />
                    </Route>

                    {/* Admin Routes */}
                    <Route path={ROUTES.ADMIN.LOGIN} element={<AdminLoginPage />} />
                    <Route element={<ProtectedRoute />}>
                        <Route path={ROUTES.ADMIN.DASHBOARD} element={<AdminDashboardPage />} />
                    </Route>
                </Routes>
            </AuthProvider>
        </QueryClientProvider>
    );
};

export default App;
