import React, { useState, useEffect } from 'react';
import { houseService } from '../../../services/houseService';
import HouseCard from '../HouseCard/HouseCard';
import FilterPanel from '../FilterPanel/FilterPanel';
import {
    Box,
    Container,
    Grid,
    Text,
    Flex,
    useDisclosure,
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    Button,
    Icon,
    useBreakpointValue
} from '@chakra-ui/react';
import { FaFilter } from 'react-icons/fa';

// Константы стилей
const accent = '#F5A623';
const accentHover = '#F6AB5E';
const bgLight = '#f9f9f9';
const bgWhite = '#ffffff';
const textDark = '#111111';
const textDark2 = '#222222';

const HouseList = () => {
    const [houses, setHouses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({});
    const { isOpen, onOpen, onClose } = useDisclosure();

    // Адаптивные настройки
    const isMobile = useBreakpointValue({ base: true, md: false });
    const sidebarWidth = { base: "100%", md: "300px" };
    const gridColumns = {
        base: "repeat(1, 1fr)",
        sm: "repeat(2, 1fr)",
        lg: "repeat(3, 1fr)",
        xl: "repeat(4, 1fr)"
    };

    useEffect(() => {
        const fetchHouses = async () => {
            try {
                const data = await houseService.getAllHouses(filters);
                setHouses(data);
                setError(null);
            } catch (err) {
                setError('Не вдалося завантажити будинки. Спробуйте пізніше.');
                console.error('Error fetching houses:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchHouses();
    }, [filters]);

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        if (isMobile) onClose();
    };

    if (loading) {
        return (
            <Flex justify="center" align="center" minH="400px">
                <Text fontSize="lg" color={accent}>
                    Завантаження будинків...
                </Text>
            </Flex>
        );
    }

    if (error) {
        return (
            <Flex justify="center" align="center" minH="400px">
                <Text fontSize="lg" color="red.500">
                    {error}
                </Text>
            </Flex>
        );
    }

    const FilterSection = () => (
        <Box
            bg={bgWhite}
            p={6}
            borderRadius="xl"
            boxShadow="md"
            height="fit-content"
            borderWidth="1px"
            borderColor="gray.200"
        >
            <FilterPanel onFilterChange={handleFilterChange} />
        </Box>
    );

    return (
        <Box bg={bgLight} py={8}>
            <Container maxW="container.xl">
                {isMobile && (
                    <Button
                        leftIcon={<Icon as={FaFilter} />}
                        onClick={onOpen}
                        mb={4}
                        w="100%"
                        bgGradient={`linear(to-r, ${accent}, ${accentHover})`}
                        color={bgWhite}
                        _hover={{
                            transform: 'translateY(-2px)',
                            boxShadow: 'lg'
                        }}
                        transition="all 0.3s ease"
                    >
                        Фільтри
                    </Button>
                )}

                <Flex gap={8} direction={{ base: "column", md: "row" }}>
                    {!isMobile && (
                        <Box flex="0 0 auto" width={sidebarWidth}>
                            <FilterSection />
                        </Box>
                    )}

                    <Box flex="1">
                        {houses.length === 0 ? (
                            <Box
                                bg={bgWhite}
                                p={8}
                                borderRadius="xl"
                                textAlign="center"
                                boxShadow="md"
                            >
                                <Text fontSize="lg" color={textDark2}>
                                    Будинки не знайдено. Спробуйте змінити параметри фільтрації.
                                </Text>
                            </Box>
                        ) : (
                            <Grid
                                templateColumns={gridColumns}
                                gap={6}
                                autoRows="1fr"
                            >
                                {houses.map(house => (
                                    <HouseCard key={house._id} house={house} />
                                ))}
                            </Grid>
                        )}
                    </Box>
                </Flex>

                <Drawer
                    isOpen={isOpen}
                    placement="left"
                    onClose={onClose}
                    size="full"
                >
                    <DrawerOverlay />
                    <DrawerContent bg={bgLight}>
                        <DrawerCloseButton size="lg" color={accent} />
                        <DrawerHeader color={textDark}>Фільтри</DrawerHeader>
                        <DrawerBody>
                            <FilterSection />
                        </DrawerBody>
                    </DrawerContent>
                </Drawer>
            </Container>
        </Box>
    );
};

export default HouseList;