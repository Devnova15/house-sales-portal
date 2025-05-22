// client/src/App.jsx
import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/common/Layout';
import HomePage from './pages/HomePage/HomePage';
import HouseListPage from './pages/HouseListPage/HouseListPage';
import HouseDetailPage from './pages/HouseDetailPage/HouseDetailPage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
// import AdminPanel from './pages/AdminPanel/AdminPanel';
import './App.css';

// Инициализируем QueryClient
const queryClient = new QueryClient();

const App = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<HomePage />} />
                    <Route path="houses" element={<HouseListPage />} />
                    <Route path="houses/:id" element={<HouseDetailPage />} />
                    {/* <Route path="admin/*" element={<AdminPanel />} /> */}
                    <Route path="*" element={<NotFoundPage />} />
                </Route>
            </Routes>
        </QueryClientProvider>
    );
};

export default App;