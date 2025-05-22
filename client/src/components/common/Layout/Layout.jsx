import { Outlet } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import './Layout.css';

const Layout = () => {
    return (
        <>
            <Header />
            <main className="main">
                <div className="container">
                    <Outlet />
                </div>
            </main>
            <Footer />
        </>
    );
};

export default Layout;