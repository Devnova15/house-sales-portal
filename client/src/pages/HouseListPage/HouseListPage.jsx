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

    const columns = useBreakpointValue({ base: 1, md: 2, lg: 3 });
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
        <Flex 
            justify="center" 
            align="center" 
            direction="column" 
            py={10} 
            bg={sectionBgColor} 
            borderRadius="xl" 
            boxShadow="md"
            minH="300px"
        >
            <Box 
                as="div" 
                className="loader-spinner" 
                w="50px" 
                h="50px" 
                border="3px solid" 
                borderColor="gray.200" 
                borderTopColor="brand.500" 
                borderRadius="50%" 
                animation="spin 1s linear infinite"
            />
            <Text mt={4} fontSize="lg" color="gray.600">
                Завантаження будинків...
            </Text>
        </Flex>
    );

    return (
        <Box bg={bgColor} minH="100vh">
            {/* Hero Header */}
            <Box 
                bg={headerBgColor} 
                color={headerTextColor} 
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
                            size="2xl" 
                            fontWeight="bold"
                            letterSpacing="tight"
                        >
                            Знайдіть свій новий будинок
                        </Heading>
                        <Text 
                            fontSize="xl" 
                            maxW="container.md" 
                            opacity={0.9}
                        >
                            Широкий вибір якісних будинків для вашої родини
                        </Text>

                        {Object.keys(currentFilters).some(key => 
                            currentFilters[key] !== '' && currentFilters[key] !== false
                        ) && (
                            <Badge 
                                colorScheme="yellow" 
                                p={2} 
                                borderRadius="full"
                                fontSize="md"
                            >
                                <Icon as={FaSearch} mr={2} />
                                Застосовано фільтри пошуку
                            </Badge>
                        )}
                    </VStack>
                </Container>
            </Box>

            {/* Main Content */}
            <Container maxW="container.xl" py={8}>
                <Flex 
                    direction={layoutDirection} 
                    gap={6} 
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
                                borderRadius="xl"
                                py={8}
                            >
                                <AlertIcon boxSize="40px" mr={0} />
                                <AlertTitle mt={4} mb={1} fontSize="lg">
                                    Помилка завантаження
                                </AlertTitle>
                                <AlertDescription maxWidth="sm">
                                    {error}
                                </AlertDescription>
                            </Alert>
                        ) : houses.length ? (
                            <>
                                <SimpleGrid 
                                    columns={columns} 
                                    spacing={6}
                                    mt={2}
                                >
                                    {houses.map(house => (
                                        <HouseCard key={house._id} house={house} />
                                    ))}
                                </SimpleGrid>
                                
                                {/* Компонент пагинации */}
                                <Pagination
                                    currentPage={pagination.currentPage}
                                    totalPages={pagination.totalPages}
                                    totalHouses={pagination.totalHouses}
                                    limit={pagination.limit}
                                    onPageChange={handlePageChange}
                                />
                            </>
                        ) : (
                            <Box 
                                bg={sectionBgColor} 
                                p={8} 
                                borderRadius="xl" 
                                textAlign="center"
                                boxShadow="md"
                                borderWidth="1px"
                                borderColor={borderColor}
                            >
                                <Icon as={FaSearch} boxSize={12} color="gray.400" mb={4} />
                                <Heading size="md" mb={2} color="gray.600">
                                    Будинки не знайдено
                                </Heading>
                                <Text color="gray.500">
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
