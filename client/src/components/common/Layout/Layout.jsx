import { Outlet } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

const Layout = () => {
    return (
        <Box
            display="flex"
            flexDirection="column"
            minHeight="100vh"
            bg="gray.50"
        >
            <Header />

            <Box
                as="main"
                flex="1"
                width="100%"
                minHeight="calc(100vh - 160px)"
            >
                <Box width="100%" height="100%">
                    <Outlet />
                </Box>
            </Box>

            <Footer />
        </Box>
    );
};

export default Layout;
