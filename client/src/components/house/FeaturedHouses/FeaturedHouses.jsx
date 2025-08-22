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
    Skeleton
} from '@chakra-ui/react';
import { FaChevronLeft, FaChevronRight, FaHome } from 'react-icons/fa';
import HouseCard from '../HouseCard/HouseCard';
import { houseService } from '../../../services/houseService';

// Константы стилей
const accent = '#F5A623';
const accentHover = '#F6AB5E';
const accentGradient = 'linear(to-r, #F7C272, #F4B94F)';
const bgLight = '#f9f9f9';
const bgWhite = '#ffffff';
const textDark = '#111111';
const textDark2 = '#222222';
const borderRadius = '1rem';

const FeaturedHouses = () => {
    const [houses, setHouses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const containerRef = useRef(null);

    // Адаптивные настройки
    const cardsToShow = useBreakpointValue({ base: 1, sm: 2, md: 3, xl: 4 });
    const cardWidth = useBreakpointValue({ base: '100%', sm: '280px', md: '300px', lg: '320px' });
    const gapSize = useBreakpointValue({ base: 4, md: 6 });

    // Базовая логика остается без изменений
    useEffect(() => {
        const fetchHouses = async () => {
            try {
                setLoading(true);
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
        setCurrentIndex(prevIndex => prevIndex > 0 ? prevIndex - 1 : 0);
    };

    const handleNext = () => {
        setCurrentIndex(prevIndex =>
            prevIndex < houses.length - cardsToShow ? prevIndex + 1 : prevIndex
        );
    };

    const isPrevDisabled = currentIndex === 0;
    const isNextDisabled = currentIndex >= houses.length - cardsToShow;

    // Обновленные стили для скелетона
    const loadingSkeletons = Array(cardsToShow).fill(0).map((_, index) => (
        <Box
            key={`skeleton-${index}`}
            width={cardWidth}
            minWidth={cardWidth}
            height="450px"
            rounded={borderRadius}
            overflow="hidden"
            boxShadow="lg"
            bg={bgWhite}
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
        <Box py={12} bg={bgLight} width="100%">
            <Container maxW="container.xl" px={[4, 6, 8]}>
                <Flex
                    align="center"
                    mb={6}
                    direction={{ base: 'column', md: 'row' }}
                    textAlign={{ base: 'center', md: 'left' }}
                >
                    <Flex align="center" mb={{ base: 4, md: 0 }}>
                        <Box
                            as={FaHome}
                            size="24px"
                            color={accent}
                            mr={3}
                        />
                        <Heading
                            as="h2"
                            fontSize={{ base: '2xl', md: '3xl' }}
                            fontWeight="bold"
                            color={textDark}
                        >
                            Популярні пропозиції
                        </Heading>
                    </Flex>
                </Flex>

                <Text
                    fontSize={{ base: 'md', md: 'lg' }}
                    mb={8}
                    color={textDark2}
                    maxW="800px"
                    textAlign={{ base: 'center', md: 'left' }}
                >
                    Перегляньте наші найкращі пропозиції будинків. Кожен будинок унікальний та має свої особливості.
                </Text>

                <Flex position="relative" width="100%">
                    <IconButton
                        icon={<FaChevronLeft />}
                        aria-label="Попередні будинки"
                        position="absolute"
                        left={{ base: -2, md: -4 }}
                        top="50%"
                        transform="translateY(-50%)"
                        zIndex={2}
                        onClick={handlePrev}
                        isDisabled={isPrevDisabled || loading || error}
                        bg={accent}
                        color={bgWhite}
                        rounded="full"
                        size="lg"
                        boxShadow="lg"
                        opacity={isPrevDisabled ? 0.5 : 1}
                        _hover={{
                            bg: accentHover,
                            transform: "translateY(-50%) scale(1.1)",
                        }}
                        _active={{ bg: accent }}
                        transition="all 0.3s ease"
                    />

                    <Box
                        width="100%"
                        overflow="hidden"
                        position="relative"
                        px={{ base: 1, md: 2 }}
                    >
                        <Flex
                            ref={containerRef}
                            transition="transform 0.5s ease"
                            transform={`translateX(-${currentIndex * (parseInt(cardWidth) || 300) + gapSize * currentIndex}px)`}
                            gap={gapSize}
                        >
                            {loading ? loadingSkeletons : error ? (
                                <Box
                                    width="100%"
                                    p={8}
                                    textAlign="center"
                                    bg={bgWhite}
                                    color="red.500"
                                    rounded={borderRadius}
                                    boxShadow="md"
                                >
                                    <Text fontSize="lg" fontWeight="medium">{error}</Text>
                                    <Button
                                        mt={4}
                                        bg={accent}
                                        color={bgWhite}
                                        _hover={{ bg: accentHover }}
                                        size="sm"
                                        onClick={() => window.location.reload()}
                                        rounded={borderRadius}
                                    >
                                        Спробувати знову
                                    </Button>
                                </Box>
                            ) : houses.length === 0 ? (
                                <Box
                                    width="100%"
                                    p={8}
                                    textAlign="center"
                                    bg={bgWhite}
                                    color={textDark2}
                                    rounded={borderRadius}
                                    boxShadow="md"
                                >
                                    <Text fontSize="lg" fontWeight="medium">
                                        Наразі немає доступних будинків
                                    </Text>
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
                        right={{ base: -2, md: -4 }}
                        top="50%"
                        transform="translateY(-50%)"
                        zIndex={2}
                        onClick={handleNext}
                        isDisabled={isNextDisabled || loading || error}
                        bg={accent}
                        color={bgWhite}
                        rounded="full"
                        size="lg"
                        boxShadow="lg"
                        opacity={isNextDisabled ? 0.5 : 1}
                        _hover={{
                            bg: accentHover,
                            transform: "translateY(-50%) scale(1.1)",
                        }}
                        _active={{ bg: accent }}
                        transition="all 0.3s ease"
                    />
                </Flex>

                <Flex justify="center" mt={8}>
                    <Button
                        as="a"
                        href="/houses"
                        bgGradient={accentGradient}
                        color={textDark}
                        size="lg"
                        rightIcon={<FaChevronRight />}
                        _hover={{
                            bgGradient: 'linear(to-r, #F5A623, #F4B94F)',
                            color: textDark,
                            transform: 'translateY(-2px)',
                            boxShadow: 'lg'
                        }}
                        rounded={borderRadius}
                        transition="all 0.3s ease"
                        fontWeight="600"
                        px={8}
                    >
                        Переглянути всі будинки
                    </Button>

                </Flex>
            </Container>
        </Box>
    );
};

export default FeaturedHouses;