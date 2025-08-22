import { useState, useEffect } from 'react';
import {
    Container,
    Box,
    Heading,
    Text,
    Grid,
    Flex,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    useColorModeValue,
    VStack,
    SimpleGrid,
    Image,
    useBreakpointValue,
    Icon,
    Badge
} from '@chakra-ui/react';
import { FaHome, FaSearch } from 'react-icons/fa';
import HouseCard from '../../components/house/HouseCard';
import FilterPanel from '../../components/house/FilterPanel/FilterPanel';
import Pagination from '../../components/house/Pagination/Pagination';
import { houseService } from '../../services/houseService';

const HouseListPage = () => {
    const [houses, setHouses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentFilters, setCurrentFilters] = useState({});
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalHouses: 0,
        limit: 10,
        hasNextPage: false,
        hasPrevPage: false
    });

    // Улучшенная адаптивность для карточек
    const columns = useBreakpointValue({
        base: 1,      // мобильные: 1 колонка
        sm: 1,        // маленькие планшеты: 1 колонка
        md: 2,        // средние планшеты: 2 колонки
        lg: 2,        // большие планшеты: 2 колонки
        xl: 3,        // десктоп: 3 колонки
        '2xl': 3      // большие мониторы: 3 колонки
    });

    const headerPadding = useBreakpointValue({ base: 6, md: 10, lg: 16 });
    const headerTextAlign = useBreakpointValue({ base: 'center', md: 'center' });
    const layoutDirection = useBreakpointValue({ base: 'column', lg: 'row' });

    const bgColor = useColorModeValue('gray.50', 'gray.900');
    const headerBgColor = useColorModeValue('brand.600', 'brand.800');
    const headerTextColor = useColorModeValue('white', 'white');
    const sectionBgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    const fetchHouses = async (filters = {}, page = 1) => {
        try {
            setLoading(true);
            const data = await houseService.getHousesWithPagination(filters, page, 10);
            setHouses(data.houses);
            setPagination(data.pagination);
            setError(null);
        } catch (err) {
            setError('Не вдалося завантажити будинки. Спробуйте пізніше.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHouses();
    }, []);

    const handleFilterChange = (filters) => {
        setCurrentFilters(filters);
        fetchHouses(filters, 1); // При изменении фильтров возвращаемся на первую страницу
    };

    const handlePageChange = (page) => {
        fetchHouses(currentFilters, page);
        // Прокручиваем страницу наверх при переходе на новую страницу
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const LoaderComponent = () => (
        <Box
            bg="white"
            rounded="2xl"
            p={{ base: 8, md: 10 }}
            shadow="sm"
            textAlign="center"
        >
            <Flex
                justify="center"
                align="center"
                direction="column"
                minH="300px"
            >
                <Box
                    as="div"
                    className="loader-spinner"
                    w="50px"
                    h="50px"
                    border="3px solid"
                    borderColor="gray.100"
                    borderTopColor="#F5A623"
                    borderRadius="50%"
                    animation="spin 1s linear infinite"
                />
                <Text mt={4} fontSize="lg" color="gray.600" fontWeight="500">
                    Завантаження будинків...
                </Text>
            </Flex>
        </Box>
    );

    return (
        <Box bg="#f7f8fa" minH="100vh">
            {/* Hero Header */}
            <Box
                bgGradient="linear(135deg, #F7C272 0%, #F4B94F 100%)"
                color="white"
                py={headerPadding}
                px={4}
                textAlign={headerTextAlign}
                position="relative"
                overflow="hidden"
            >
                <Box
                    position="absolute"
                    top={0}
                    left={0}
                    right={0}
                    bottom={0}
                    opacity={0.1}
                    backgroundImage="url('/images/HomePageImages/main-image.jpg')"
                    backgroundSize="cover"
                    backgroundPosition="center"
                    filter="blur(2px)"
                />

                <Container maxW="container.xl" position="relative" zIndex={1}>
                    <VStack spacing={4}>
                        <Icon as={FaHome} boxSize={12} />
                        <Heading
                            as="h1"
                            fontSize={{ base: 'xl', md: '2xl', lg: '3xl' }}
                            fontWeight="800"
                            letterSpacing="tight"
                            lineHeight="1.2"
                            textShadow="0 2px 4px rgba(0, 0, 0, 0.3)"
                            color="rgba(255, 255, 255, 0.95)"
                        >
                            Знайдіть свій новий будинок
                        </Heading>
                        <Text
                            fontSize={{ base: 'md', md: 'lg', lg: 'xl' }}
                            maxW="600px"
                            fontWeight="600"
                            lineHeight="1.6"
                            textShadow="0 1px 3px rgba(0, 0, 0, 0.3)"
                            color="rgba(255, 255, 255, 0.92)"
                        >
                            Широкий вибір якісних будинків для вашої родини
                        </Text>

                        {Object.keys(currentFilters).some(key =>
                            currentFilters[key] !== '' && currentFilters[key] !== false
                        ) && (
                            <Badge
                                bg="rgba(255, 255, 255, 0.2)"
                                color="white"
                                px={4}
                                py={2}
                                rounded="full"
                                fontSize="md"
                                fontWeight="600"
                                backdropFilter="blur(10px)"
                                border="1px solid rgba(255, 255, 255, 0.1)"
                            >
                                <Icon as={FaSearch} mr={2} />
                                Застосовано фільтри пошуку
                            </Badge>
                        )}
                    </VStack>
                </Container>
            </Box>

            {/* Main Content */}
            <Container maxW="container.xl" py={{ base: 4, md: 8 }}>
                <Flex
                    direction={layoutDirection}
                    gap={{ base: 4, md: 6 }}
                    align="flex-start"
                >
                    {/* Sidebar */}
                    <Box
                        w={layoutDirection === 'row' ? '320px' : 'full'}
                        position={layoutDirection === 'row' ? 'sticky' : 'static'}
                        top="20px"
                    >
                        <FilterPanel onFilterChange={handleFilterChange} />
                    </Box>

                    {/* Main Content */}
                    <Box flex="1">
                        {loading ? (
                            <LoaderComponent />
                        ) : error ? (
                            <Alert
                                status="error"
                                variant="subtle"
                                flexDirection="column"
                                alignItems="center"
                                justifyContent="center"
                                textAlign="center"
                                bg="white"
                                rounded="2xl"
                                shadow="sm"
                                py={8}
                                border="1px solid"
                                borderColor="red.100"
                            >
                                <AlertIcon boxSize="40px" mr={0} color="red.400" />
                                <AlertTitle
                                    mt={4}
                                    mb={1}
                                    fontSize="lg"
                                    fontWeight="700"
                                    color="gray.900"
                                >
                                    Помилка завантаження
                                </AlertTitle>
                                <AlertDescription maxWidth="sm" color="gray.600" fontSize="md">
                                    {error}
                                </AlertDescription>
                            </Alert>
                        ) : houses.length ? (
                            <>
                                {/* Улучшенная сетка с центрированием */}
                                <Box
                                    display="flex"
                                    flexWrap="wrap"
                                    gap={{ base: 4, md: 6 }}
                                    justifyContent={{
                                        base: "center",      // центрируем на мобильных
                                        sm: "center",        // центрируем на маленьких планшетах
                                        md: houses.length === 1 ? "center" : "flex-start",  // если одна карточка - центрируем
                                        lg: houses.length <= 2 ? "center" : "flex-start",   // если <= 2 карточек - центрируем
                                        xl: houses.length <= 3 ? "center" : "flex-start"    // если <= 3 карточек - центрируем
                                    }}
                                    mt={2}
                                >
                                    {houses.map(house => (
                                        <Box
                                            key={house._id}
                                            w={{
                                                base: "100%",
                                                sm: "100%",
                                                md: columns === 2 ? "calc(50% - 12px)" : "100%",
                                                lg: columns === 2 ? "calc(50% - 12px)" : "100%",
                                                xl: columns === 3 ? "calc(33.333% - 16px)" :
                                                    columns === 2 ? "calc(50% - 12px)" : "100%"
                                            }}
                                            maxW={{
                                                base: "400px",  // максимальная ширина на мобильных
                                                sm: "400px",
                                                md: "none"
                                            }}
                                            flex="none"
                                        >
                                            <HouseCard house={house} />
                                        </Box>
                                    ))}
                                </Box>

                                {/* Компонент пагинации */}
                                <Box mt={{ base: 6, md: 8 }}>
                                    <Pagination
                                        currentPage={pagination.currentPage}
                                        totalPages={pagination.totalPages}
                                        totalHouses={pagination.totalHouses}
                                        limit={pagination.limit}
                                        onPageChange={handlePageChange}
                                    />
                                </Box>
                            </>
                        ) : (
                            <Box
                                bg="white"
                                p={{ base: 6, md: 8 }}
                                rounded="2xl"
                                textAlign="center"
                                shadow="sm"
                                border="1px solid"
                                borderColor="gray.100"
                            >
                                <Icon as={FaSearch} boxSize={12} color="#F5A623" mb={4} />
                                <Heading
                                    fontSize={{ base: 'md', md: 'lg' }}
                                    mb={2}
                                    color="gray.900"
                                    fontWeight="700"
                                >
                                    Будинки не знайдено
                                </Heading>
                                <Text color="gray.600" fontSize="md" lineHeight="1.6">
                                    Спробуйте змінити фільтри пошуку або перегляньте всі доступні будинки.
                                </Text>
                            </Box>
                        )}
                    </Box>
                </Flex>
            </Container>

            {/* Add keyframes for spinner animation */}
            <Box
                as="style"
                dangerouslySetInnerHTML={{
                    __html: `
                        @keyframes spin {
                            to { transform: rotate(360deg); }
                        }
                    `
                }}
            />
        </Box>
    );
};

export default HouseListPage;