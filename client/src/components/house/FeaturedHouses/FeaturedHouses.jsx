import { useState, useEffect, useRef } from 'react';
import { 
    Box, 
    Heading, 
    Text, 
    Flex, 
    Button, 
    IconButton, 
    Container, 
    useBreakpointValue,
    useColorModeValue,
    Skeleton
} from '@chakra-ui/react';
import { FaChevronLeft, FaChevronRight, FaHome } from 'react-icons/fa';
import HouseCard from '../HouseCard/HouseCard';
import { houseService } from '../../../services/houseService';

const FeaturedHouses = () => {
    const [houses, setHouses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const containerRef = useRef(null);

    // Responsive settings
    const cardsToShow = useBreakpointValue({ base: 1, sm: 2, md: 3, lg: 3, xl: 4 }) || 3;
    const cardWidth = useBreakpointValue({ base: '100%', sm: '280px', md: '300px', lg: '320px' });
    const gapSize = useBreakpointValue({ base: 4, md: 6 });

    // Colors
    const bgColor = useColorModeValue('gray.50', 'gray.900');
    const headingColor = useColorModeValue('gray.800', 'white');
    const textColor = useColorModeValue('gray.600', 'gray.300');
    const accentColor = useColorModeValue('brand.600', 'brand.400');

    useEffect(() => {
        const fetchHouses = async () => {
            try {
                setLoading(true);
                // Fetch all houses and then take only the first 8
                const data = await houseService.getAllHouses();
                setHouses(data.slice(0, 8));
                setError(null);
            } catch (err) {
                console.error('Помилка при завантаженні будинків:', err);
                setError('Не вдалося завантажити будинки. Спробуйте пізніше.');
            } finally {
                setLoading(false);
            }
        };

        fetchHouses();
    }, []);

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex > 0 ? prevIndex - 1 : 0
        );
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex < houses.length - cardsToShow ? prevIndex + 1 : prevIndex
        );
    };

    // Calculate if prev/next buttons should be disabled
    const isPrevDisabled = currentIndex === 0;
    const isNextDisabled = currentIndex >= houses.length - cardsToShow;

    // Loading skeletons
    const loadingSkeletons = Array(cardsToShow).fill(0).map((_, index) => (
        <Box 
            key={`skeleton-${index}`} 
            width={cardWidth} 
            minWidth={cardWidth}
            height="450px"
            borderRadius="lg"
            overflow="hidden"
            boxShadow="md"
            flex="0 0 auto"
        >
            <Skeleton height="260px" />
            <Box p={4}>
                <Skeleton height="24px" width="70%" mb={2} />
                <Skeleton height="20px" width="90%" mb={4} />
                <Skeleton height="16px" width="60%" mb={2} />
                <Skeleton height="16px" width="80%" mb={4} />
                <Flex justify="space-between">
                    <Skeleton height="20px" width="30%" />
                    <Skeleton height="20px" width="30%" />
                    <Skeleton height="20px" width="30%" />
                </Flex>
            </Box>
        </Box>
    ));

    return (
        <Box py={12} bg={bgColor} width="100%">
            <Container maxW="container.xl" px={4}>
                <Flex align="center" mb={6}>
                    <Box 
                        as={FaHome} 
                        size="24px" 
                        color={accentColor} 
                        mr={3}
                    />
                    <Heading 
                        as="h2" 
                        fontSize={{ base: '2xl', md: '3xl' }} 
                        fontWeight="bold"
                        color={headingColor}
                    >
                        Популярні пропозиції
                    </Heading>
                </Flex>

                <Text 
                    fontSize={{ base: 'md', md: 'lg' }} 
                    mb={8} 
                    color={textColor}
                    maxW="800px"
                >
                    Перегляньте наші найкращі пропозиції будинків. Кожен будинок унікальний та має свої особливості.
                </Text>

                <Flex position="relative" width="100%">
                    <IconButton
                        icon={<FaChevronLeft />}
                        aria-label="Попередні будинки"
                        position="absolute"
                        left={{ base: 0, md: -4 }}
                        top="50%"
                        transform="translateY(-50%)"
                        zIndex={2}
                        onClick={handlePrev}
                        isDisabled={isPrevDisabled || loading || error}
                        colorScheme="brand"
                        variant="solid"
                        rounded="full"
                        size="lg"
                        boxShadow="lg"
                        opacity={isPrevDisabled ? 0.5 : 1}
                        _hover={{ bg: accentColor, transform: "translateY(-50%) scale(1.1)" }}
                        transition="all 0.2s ease"
                    />

                    <Box 
                        width="100%" 
                        overflow="hidden" 
                        position="relative"
                        px={2}
                    >
                        <Flex
                            ref={containerRef}
                            transition="transform 0.5s ease"
                            transform={`translateX(-${currentIndex * (parseInt(cardWidth) || 300) + gapSize * currentIndex}px)`}
                            gap={gapSize}
                        >
                            {loading ? (
                                loadingSkeletons
                            ) : error ? (
                                <Box 
                                    width="100%" 
                                    p={8} 
                                    textAlign="center"
                                    bg="red.50"
                                    color="red.500"
                                    borderRadius="md"
                                >
                                    <Text fontSize="lg" fontWeight="medium">{error}</Text>
                                    <Button 
                                        mt={4} 
                                        colorScheme="red" 
                                        size="sm"
                                        onClick={() => window.location.reload()}
                                    >
                                        Спробувати знову
                                    </Button>
                                </Box>
                            ) : houses.length === 0 ? (
                                <Box 
                                    width="100%" 
                                    p={8} 
                                    textAlign="center"
                                    bg="gray.50"
                                    color="gray.500"
                                    borderRadius="md"
                                >
                                    <Text fontSize="lg" fontWeight="medium">Наразі немає доступних будинків</Text>
                                </Box>
                            ) : (
                                houses.map((house) => (
                                    <Box 
                                        key={house._id} 
                                        width={cardWidth}
                                        minWidth={cardWidth}
                                        flex="0 0 auto"
                                    >
                                        <HouseCard house={house} />
                                    </Box>
                                ))
                            )}
                        </Flex>
                    </Box>

                    <IconButton
                        icon={<FaChevronRight />}
                        aria-label="Наступні будинки"
                        position="absolute"
                        right={{ base: 0, md: -4 }}
                        top="50%"
                        transform="translateY(-50%)"
                        zIndex={2}
                        onClick={handleNext}
                        isDisabled={isNextDisabled || loading || error}
                        colorScheme="brand"
                        variant="solid"
                        rounded="full"
                        size="lg"
                        boxShadow="lg"
                        opacity={isNextDisabled ? 0.5 : 1}
                        _hover={{ bg: accentColor, transform: "translateY(-50%) scale(1.1)" }}
                        transition="all 0.2s ease"
                    />
                </Flex>

                <Flex justify="center" mt={8}>
                    <Button 
                        as="a" 
                        href="/houses" 
                        colorScheme="brand" 
                        size="lg" 
                        rightIcon={<FaChevronRight />}
                        _hover={{ transform: 'translateY(-2px)', boxShadow: 'md' }}
                        transition="all 0.3s ease"
                    >
                        Переглянути всі будинки
                    </Button>
                </Flex>
            </Container>
        </Box>
    );
};

export default FeaturedHouses;
