import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
    FaBed,
    FaBath,
    FaRulerCombined,
    FaTree,
    FaHome,
    FaChevronLeft,
    FaChevronRight,
    FaHeart,
    FaExpand,
    FaTimes,
    FaPhone,
    FaWhatsapp,
    FaTelegramPlane,
    FaViber, FaTelegram
} from 'react-icons/fa';

import {
    Box,
    Container,
    Heading,
    Text,
    Button,
    Flex,
    Grid,
    GridItem,
    Image,
    VStack,
    HStack,
    Badge,
    Icon,
    SimpleGrid,
    AspectRatio,
    useToast,
    Spinner,
    Alert,
    AlertIcon,
    AlertTitle,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalCloseButton,
    useDisclosure,
    Stack,
    Divider
} from '@chakra-ui/react';
import { houseService } from '../../services/houseService';
import { houseWishlistService } from '../../services/houseWishlistService';
import { authService } from '../../services/authService';
import { processImages } from '../../utils/imageUtils';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import markerIconPng from 'leaflet/dist/images/marker-icon.png';
import markerShadowPng from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';

// Компонент для контактов
const ContactButtons = ({ contactInfo }) => {
    if (!contactInfo) return null;

    const { phone } = contactInfo;

    return (
        <VStack spacing={4} w="full">
            {/* Телефон */}
            {phone && (
                <Button
                    as="a"
                    href={`tel:${phone}`}
                    size={{ base: 'md', md: 'lg' }}
                    w="full"
                    bg="#F5A623"
                    color="white"
                    rounded="xl"
                    leftIcon={<FaPhone />}
                    _hover={{
                        bgGradient: 'linear(to-r, #F5A623, #F4B94F)',
                        color: "#9a4d07",
                        transform: 'translateY(-2px)',
                        boxShadow: 'lg'
                    }}
                    transition="all 0.3s ease"
                    fontWeight="semibold"
                >
                    Зателефонувати
                </Button>
            )}

            <Box textAlign="center" w="full">
                <Text fontSize="sm" color="gray.500" mb={2}>
                    Написати в месенджер
                </Text>
                <Divider />
            </Box>

            <Box w="full">
                {/* На больших экранах */}
                <HStack spacing={2} w="full" display={{ base: 'none', md: 'flex' }}>
                    <Button
                        as="a"
                        href="viber://chat?number=380671234567"
                        target="_blank"
                        rel="noopener noreferrer"
                        size="sm"
                        flex={1}
                        bg="#665CAC"
                        color="white"
                        rounded="lg"
                        leftIcon={<FaViber />}
                        fontSize="xs"
                        _hover={{ bg: "#5A4E9A", transform: "translateY(-1px)", shadow: "md" }}
                        transition="all 0.3s ease"
                    >
                        Viber
                    </Button>

                    <Button
                        as="a"
                        href="https://wa.me/380671234567"
                        target="_blank"
                        rel="noopener noreferrer"
                        size="sm"
                        flex={1}
                        bg="#25D366"
                        color="white"
                        rounded="lg"
                        leftIcon={<FaWhatsapp />}
                        fontSize="xs"
                        _hover={{ bg: "#20C55A", transform: "translateY(-1px)", shadow: "md" }}
                        transition="all 0.3s ease"
                    >
                        WhatsApp
                    </Button>

                    <Button
                        as="a"
                        href="https://t.me/username"
                        target="_blank"
                        rel="noopener noreferrer"
                        size="sm"
                        flex={1}
                        bg="#0088CC"
                        color="white"
                        rounded="lg"
                        leftIcon={<FaTelegram />}
                        fontSize="xs"
                        _hover={{ bg: "#007BB8", transform: "translateY(-1px)", shadow: "md" }}
                        transition="all 0.3s ease"
                    >
                        Telegram
                    </Button>
                </HStack>

                {/* На мобильных */}
                <HStack spacing={2} w="full" justify="center" display={{ base: 'flex', md: 'none' }}>
                    <Button
                        as="a"
                        href="viber://chat?number=380671234567"
                        target="_blank"
                        rel="noopener noreferrer"
                        size="sm"
                        bg="#665CAC"
                        color="white"
                        rounded="lg"
                        minW="70px"
                        px={2}
                        h="60px"
                        _hover={{ bg: "#5A4E9A", transform: "translateY(-1px)", shadow: "md" }}
                        transition="all 0.3s ease"
                    >
                        <VStack spacing={1}>
                            <FaViber size="14px" />
                            <Text fontSize="10px">Viber</Text>
                        </VStack>
                    </Button>

                    <Button
                        as="a"
                        href="https://wa.me/380671234567"
                        target="_blank"
                        rel="noopener noreferrer"
                        size="sm"
                        bg="#25D366"
                        color="white"
                        rounded="lg"
                        minW="70px"
                        px={2}
                        h="60px"
                        _hover={{ bg: "#20C55A", transform: "translateY(-1px)", shadow: "md" }}
                        transition="all 0.3s ease"
                    >
                        <VStack spacing={1}>
                            <FaWhatsapp size="14px" />
                            <Text fontSize="10px">WhatsApp</Text>
                        </VStack>
                    </Button>

                    <Button
                        as="a"
                        href="https://t.me/username"
                        target="_blank"
                        rel="noopener noreferrer"
                        size="sm"
                        bg="#0088CC"
                        color="white"
                        rounded="lg"
                        minW="70px"
                        px={2}
                        h="60px"
                        _hover={{ bg: "#007BB8", transform: "translateY(-1px)", shadow: "md" }}
                        transition="all 0.3s ease"
                    >
                        <VStack spacing={1}>
                            <FaTelegram size="14px" />
                            <Text fontSize="10px">Telegram</Text>
                        </VStack>
                    </Button>
                </HStack>
            </Box>
        </VStack>
    );
};


const HouseDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [mainImageError, setMainImageError] = useState(false);
    const [thumbnailErrors, setThumbnailErrors] = useState({});
    const [processedImages, setProcessedImages] = useState([]);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [fullscreenImageIndex, setFullscreenImageIndex] = useState(0);

    const [isInWishlist, setIsInWishlist] = useState(false);
    const [wishlistLoading, setWishlistLoading] = useState(false);

    const [mapCenter, setMapCenter] = useState([50.202664892265766, 30.274876895590857]);

    const { data: house, isLoading, error } = useQuery({
        queryKey: ['house', id],
        queryFn: () => houseService.getHouseById(id)
    });

    useEffect(() => {
        if (house && house.images && Array.isArray(house.images)) {
            const processed = processImages(house.images);
            setProcessedImages(processed);
        }

        if (house && house.coordinates) {
            setMapCenter(house.coordinates);
        }

        if (house && house._id) {
            checkWishlistStatus();
        }
    }, [house]);

    const checkWishlistStatus = async () => {
        try {
            const inWishlist = await houseWishlistService.isHouseInWishlist(house._id);
            setIsInWishlist(inWishlist);
        } catch {
            setIsInWishlist(false);
        }
    };

    const handleWishlistToggle = async () => {
        if (wishlistLoading) return;

        if (!authService.isAuthenticated()) {
            toast({
                title: "Потрібна реєстрація",
                description: "Щоб додавати будинки до обраних, потрібно зареєструватися",
                status: "warning",
                duration: 3000,
                isClosable: true,
            });
            setTimeout(() => navigate('/register'), 1000);
            return;
        }

        try {
            setWishlistLoading(true);

            if (isInWishlist) {
                await houseWishlistService.removeFromWishlist(house._id);
                setIsInWishlist(false);
                toast({
                    title: "Видалено з обраних",
                    description: "Будинок видалено зі списку обраних",
                    status: "success",
                    duration: 2000,
                    isClosable: true,
                });
            } else {
                await houseWishlistService.addToWishlist(house._id);
                setIsInWishlist(true);
                toast({
                    title: "Додано до обраних",
                    description: "Будинок додано до списку обраних",
                    status: "success",
                    duration: 2000,
                    isClosable: true,
                });
            }
        } catch (error) {
            toast({
                title: "Помилка",
                description: error.message || "Не вдалося оновити список обраних",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setWishlistLoading(false);
        }
    };

    const formatPrice = (price) => {
        return price?.toString().replace(/\\B(?=(\\d{3})+(?!\\d))/g, " ");
    };

    const handleMainImageError = (e) => {
        setMainImageError(true);
        e.target.src = '/images/placeholder-house.jpg';
        e.target.onerror = null;
    };

    const handleThumbnailError = (index, e) => {
        setThumbnailErrors(prev => ({ ...prev, [index]: true }));
        e.target.src = '/images/placeholder-house.jpg';
        e.target.onerror = null;
    };

    const handleThumbnailClick = (index) => {
        setSelectedImageIndex(index);
        setMainImageError(false);
    };

    const handlePrevImage = () => {
        if (processedImages.length > 0) {
            setSelectedImageIndex((prevIndex) =>
                prevIndex > 0 ? prevIndex - 1 : processedImages.length - 1
            );
            setMainImageError(false);
        }
    };

    const handleNextImage = () => {
        if (processedImages.length > 0) {
            setSelectedImageIndex((prevIndex) =>
                prevIndex < processedImages.length - 1 ? prevIndex + 1 : 0
            );
            setMainImageError(false);
        }
    };

    const openFullscreen = () => {
        setFullscreenImageIndex(selectedImageIndex);
        onOpen();
    };

    const handleFullscreenPrev = () => {
        setFullscreenImageIndex((prevIndex) =>
            prevIndex > 0 ? prevIndex - 1 : processedImages.length - 1
        );
    };

    const handleFullscreenNext = () => {
        setFullscreenImageIndex((prevIndex) =>
            prevIndex < processedImages.length - 1 ? prevIndex + 1 : 0
        );
    };

    if (isLoading) {
        return (
            <Box bg="#f7f8fa" minH="100vh" py={8}>
                <Container maxW="container.xl">
                    <VStack spacing={4} align="center" py={20}>
                        <Spinner size="xl" color="#F5A623" thickness="4px" />
                        <Text fontSize="lg" color="#666">Завантаження інформації про будинок...</Text>
                    </VStack>
                </Container>
            </Box>
        );
    }

    if (error) {
        return (
            <Box bg="#f7f8fa" minH="100vh" py={8}>
                <Container maxW="container.xl">
                    <Alert status="error" rounded="xl" maxW="md" mx="auto">
                        <AlertIcon />
                        <AlertTitle fontSize="sm">Помилка завантаження: {error.message}</AlertTitle>
                    </Alert>
                </Container>
            </Box>
        );
    }

    if (!house) {
        return (
            <Box bg="#f7f8fa" minH="100vh" py={8}>
                <Container maxW="container.xl">
                    <Alert status="warning" rounded="xl" maxW="md" mx="auto">
                        <AlertIcon />
                        <AlertTitle fontSize="sm">Будинок не знайдено</AlertTitle>
                    </Alert>
                </Container>
            </Box>
        );
    }

    const {
        title,
        price,
        address,
        description,
        bedrooms,
        bathrooms,
        area,
        plotArea,
        floors,
        characteristics,
        condition,
        communications,
        contactInfo = {
            phone: '+380633869806',  // номер телефона для Viber и WhatsApp
            telegram: '@m_nastya_a'     // username для Telegram
        }
    } = house;

    const mainImage = !mainImageError && processedImages.length > 0
        ? processedImages[selectedImageIndex]
        : '/images/placeholder-house.jpg';

    return (
        <>
            <Box bg="#f7f8fa" minH="100vh">
                {/* Хлебные крошки */}
                <Box bg="white" borderBottom="1px" borderColor="gray.100">
                    <Container maxW="container.xl" py={3}>
                        <HStack spacing={2} fontSize="sm" color="gray.600">
                            <Link to="/">Головна</Link>
                            <Text>/</Text>
                            <Link to="/houses">Будинки</Link>
                            <Text>/</Text>
                            <Text color="gray.800" isTruncated>{title}</Text>
                        </HStack>
                    </Container>
                </Box>

                <Container maxW="container.xl" py={{ base: 4, md: 8 }}>
                    {/* Заголовок и цена */}
                    <Box bg="white" rounded="2xl" p={{ base: 4, md: 6 }} mb={{ base: 4, md: 6 }} shadow="sm">
                        <Flex
                            direction={{ base: 'column', lg: 'row' }}
                            justify="space-between"
                            align={{ base: 'start', lg: 'flex-start' }}
                            gap={{ base: 4, lg: 6 }}
                        >
                            <VStack align="start" spacing={2} flex={1} minW={0}>
                                <Heading
                                    as="h1"
                                    fontSize={{ base: 'xl', md: '2xl', lg: '3xl' }}
                                    color="gray.900"
                                    fontWeight="700"
                                    lineHeight="1.2"
                                    wordBreak="break-word"
                                >
                                    {title}
                                </Heading>
                                <Text fontSize={{ base: 'md', md: 'lg' }} color="gray.600" fontWeight="500">
                                    {address}
                                </Text>
                                <Text
                                    fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}
                                    fontWeight="800"
                                    color="#F5A623"
                                    lineHeight="1"
                                >
                                    ${formatPrice(price)}
                                </Text>
                            </VStack>

                            <Button
                                onClick={handleWishlistToggle}
                                isLoading={wishlistLoading}
                                loadingText="..."
                                bg={isInWishlist ? "#F5A623" : "white"}
                                color={isInWishlist ? "white" : "#F5A623"}
                                border="2px solid #F5A623"
                                rounded="xl"
                                size={{ base: 'md', lg: 'lg' }}
                                leftIcon={<FaHeart />}
                                minW={{ base: 'full', lg: '200px' }}
                                _hover={{
                                    bg: isInWishlist ? "#F6AB5E" : "#F5A623",
                                    color: "white",
                                    transform: "translateY(-2px)",
                                    shadow: "lg"
                                }}
                                transition="all 0.3s ease"
                                fontWeight="600"
                            >
                                {isInWishlist ? 'В обраному' : 'До обраного'}
                            </Button>
                        </Flex>
                    </Box>

                    <Grid templateColumns={{ base: '1fr', xl: '2fr 1fr' }} gap={{ base: 4, md: 6 }}>
                        {/* Левая колонка */}
                        <VStack spacing={{ base: 4, md: 6 }} align="stretch">
                            {/* Галерея фотографий */}
                            <Box bg="white" rounded="2xl" overflow="hidden" shadow="sm">
                                <Box position="relative">
                                    <AspectRatio ratio={16/9}>
                                        <Image
                                            src={mainImage}
                                            alt={title}
                                            onError={handleMainImageError}
                                            objectFit="cover"
                                            fallbackSrc="/images/placeholder-house.jpg"
                                        />
                                    </AspectRatio>

                                    {/* Кнопка полноэкранного просмотра */}
                                    <Button
                                        onClick={openFullscreen}
                                        position="absolute"
                                        top={4}
                                        right={4}
                                        size="sm"
                                        bg="rgba(0,0,0,0.6)"
                                        color="white"
                                        rounded="lg"
                                        _hover={{ bg: "rgba(0,0,0,0.8)" }}
                                        leftIcon={<FaExpand />}
                                        fontSize="xs"
                                    >
                                        Повний екран
                                    </Button>

                                    {processedImages.length > 1 && (
                                        <>
                                            <Button
                                                onClick={handlePrevImage}
                                                position="absolute"
                                                left={4}
                                                top="50%"
                                                transform="translateY(-50%)"
                                                bg="rgba(255,255,255,0.9)"
                                                color="gray.800"
                                                rounded="full"
                                                size="sm"
                                                minW="40px"
                                                h="40px"
                                                _hover={{ bg: "white", shadow: "md" }}
                                            >
                                                <FaChevronLeft />
                                            </Button>

                                            <Button
                                                onClick={handleNextImage}
                                                position="absolute"
                                                right={4}
                                                top="50%"
                                                transform="translateY(-50%)"
                                                bg="rgba(255,255,255,0.9)"
                                                color="gray.800"
                                                rounded="full"
                                                size="sm"
                                                minW="40px"
                                                h="40px"
                                                _hover={{ bg: "white", shadow: "md" }}
                                            >
                                                <FaChevronRight />
                                            </Button>

                                            {/* Счетчик фото */}
                                            <Box
                                                position="absolute"
                                                bottom={4}
                                                right={4}
                                                bg="rgba(0,0,0,0.7)"
                                                color="white"
                                                px={3}
                                                py={1}
                                                rounded="md"
                                                fontSize="sm"
                                                fontWeight="600"
                                            >
                                                {selectedImageIndex + 1} / {processedImages.length}
                                            </Box>
                                        </>
                                    )}
                                </Box>

                                {/* Миниатюры */}
                                {processedImages.length > 1 && (
                                    <Box p={4}>
                                        <SimpleGrid
                                            columns={{ base: 4, sm: 5, md: 6, lg: 8 }}
                                            spacing={2}
                                            maxH="120px"
                                            overflowY="auto"
                                        >
                                            {processedImages.map((image, index) => (
                                                <AspectRatio key={index} ratio={1} cursor="pointer">
                                                    <Image
                                                        src={!thumbnailErrors[index] ? image : '/images/placeholder-house.jpg'}
                                                        alt={`${title} - зображення ${index + 1}`}
                                                        onError={(e) => handleThumbnailError(index, e)}
                                                        onClick={() => handleThumbnailClick(index)}
                                                        rounded="lg"
                                                        objectFit="cover"
                                                        border={selectedImageIndex === index ? "3px solid #F5A623" : "3px solid transparent"}
                                                        _hover={{
                                                            transform: "scale(1.05)",
                                                            shadow: "md"
                                                        }}
                                                        transition="all 0.2s ease"
                                                    />
                                                </AspectRatio>
                                            ))}
                                        </SimpleGrid>
                                    </Box>
                                )}
                            </Box>

                            {/* Основная информация */}
                            <Box bg="white" rounded="2xl" p={{ base: 4, md: 6 }} shadow="sm">
                                <Heading as="h2" fontSize={{ base: 'lg', md: 'xl' }} color="gray.900" mb={4} fontWeight="700">
                                    Основні характеристики
                                </Heading>
                                <SimpleGrid columns={{ base: 2, md: 3, lg: 5 }} spacing={4}>
                                    <VStack spacing={2} p={4} bg="gray.50" rounded="xl">
                                        <Icon as={FaBed} color="#F5A623" fontSize="xl" />
                                        <Text fontSize="lg" fontWeight="bold" color="gray.900">{bedrooms}</Text>
                                        <Text fontSize="xs" color="gray.600" textAlign="center">кімнат</Text>
                                    </VStack>
                                    <VStack spacing={2} p={4} bg="gray.50" rounded="xl">
                                        <Icon as={FaBath} color="#F5A623" fontSize="xl" />
                                        <Text fontSize="lg" fontWeight="bold" color="gray.900">{bathrooms}</Text>
                                        <Text fontSize="xs" color="gray.600" textAlign="center">с/в</Text>
                                    </VStack>
                                    <VStack spacing={2} p={4} bg="gray.50" rounded="xl">
                                        <Icon as={FaRulerCombined} color="#F5A623" fontSize="xl" />
                                        <Text fontSize="lg" fontWeight="bold" color="gray.900">{area}</Text>
                                        <Text fontSize="xs" color="gray.600" textAlign="center">м²</Text>
                                    </VStack>
                                    <VStack spacing={2} p={4} bg="gray.50" rounded="xl">
                                        <Icon as={FaTree} color="#F5A623" fontSize="xl" />
                                        <Text fontSize="lg" fontWeight="bold" color="gray.900">{plotArea}</Text>
                                        <Text fontSize="xs" color="gray.600" textAlign="center">соток</Text>
                                    </VStack>
                                    <VStack spacing={2} p={4} bg="gray.50" rounded="xl">
                                        <Icon as={FaHome} color="#F5A623" fontSize="xl" />
                                        <Text fontSize="lg" fontWeight="bold" color="gray.900">{floors}</Text>
                                        <Text fontSize="xs" color="gray.600" textAlign="center">поверх{floors > 1 ? 'и' : ''}</Text>
                                    </VStack>
                                </SimpleGrid>
                            </Box>

                            {/* Описание */}
                            <Box bg="white" rounded="2xl" p={{ base: 4, md: 6 }} shadow="sm">
                                <Heading as="h2" fontSize={{ base: 'lg', md: 'xl' }} color="gray.900" mb={4} fontWeight="700">
                                    Опис
                                </Heading>
                                <Text color="gray.700" lineHeight="1.6" fontSize="md" whiteSpace="pre-line">
                                    {description}
                                </Text>
                            </Box>

                            {/* Детальные характеристики */}
                            {(characteristics || condition || communications) && (
                                <Box bg="white" rounded="2xl" p={{ base: 4, md: 6 }} shadow="sm">
                                    <Heading as="h2" fontSize={{ base: 'lg', md: 'xl' }} color="gray.900" mb={6} fontWeight="700">
                                        Детальна інформація
                                    </Heading>

                                    <VStack spacing={6} align="stretch">
                                        {/* Характеристики дома */}
                                        {characteristics && (
                                            <Box>
                                                <Text fontSize="md" fontWeight="600" color="gray.800" mb={3}>
                                                    Будинок
                                                </Text>
                                                <VStack spacing={3} align="stretch">
                                                    {characteristics?.wallType && (
                                                        <Flex justify="space-between" align="center" py={2}>
                                                            <Text color="gray.600" fontSize="sm">Стіни:</Text>
                                                            <Text fontWeight="500" color="gray.900" fontSize="sm">
                                                                {characteristics.wallType}
                                                            </Text>
                                                        </Flex>
                                                    )}
                                                    {characteristics?.wallInsulation && (
                                                        <Flex justify="space-between" align="center" py={2}>
                                                            <Text color="gray.600" fontSize="sm">Утеплення:</Text>
                                                            <Text fontWeight="500" color="gray.900" fontSize="sm">
                                                                {characteristics.wallInsulation}
                                                            </Text>
                                                        </Flex>
                                                    )}
                                                    {characteristics?.roofType && (
                                                        <Flex justify="space-between" align="center" py={2}>
                                                            <Text color="gray.600" fontSize="sm">Дах:</Text>
                                                            <Text fontWeight="500" color="gray.900" fontSize="sm">
                                                                {characteristics.roofType}
                                                            </Text>
                                                        </Flex>
                                                    )}
                                                    {characteristics?.heating && (
                                                        <Flex justify="space-between" align="center" py={2}>
                                                            <Text color="gray.600" fontSize="sm">Опалення:</Text>
                                                            <Text fontWeight="500" color="gray.900" fontSize="sm">
                                                                {characteristics.heating}
                                                            </Text>
                                                        </Flex>
                                                    )}
                                                    {characteristics?.floorHeating !== undefined && (
                                                        <Flex justify="space-between" align="center" py={2}>
                                                            <Text color="gray.600" fontSize="sm">Тепла підлога:</Text>
                                                            <Badge
                                                                colorScheme={characteristics.floorHeating ? "green" : "red"}
                                                                variant="subtle"
                                                                rounded="md"
                                                                fontSize="xs"
                                                            >
                                                                {characteristics.floorHeating ? 'Є' : 'Немає'}
                                                            </Badge>
                                                        </Flex>
                                                    )}
                                                </VStack>
                                                <Divider my={4} />
                                            </Box>
                                        )}

                                        {/* Состояние */}
                                        {condition && (
                                            <Box>
                                                <Text fontSize="md" fontWeight="600" color="gray.800" mb={3}>
                                                    Стан
                                                </Text>
                                                <VStack spacing={3} align="stretch">
                                                    {condition?.withRepair !== undefined && (
                                                        <Flex justify="space-between" align="center" py={2}>
                                                            <Text color="gray.600" fontSize="sm">Ремонт:</Text>
                                                            <Badge
                                                                colorScheme={condition.withRepair ? "green" : "red"}
                                                                variant="subtle"
                                                                rounded="md"
                                                                fontSize="xs"
                                                            >
                                                                {condition.withRepair ? 'Є' : 'Немає'}
                                                            </Badge>
                                                        </Flex>
                                                    )}
                                                    {condition?.repairType && (
                                                        <Flex justify="space-between" align="center" py={2}>
                                                            <Text color="gray.600" fontSize="sm">Тип ремонту:</Text>
                                                            <Text fontWeight="500" color="gray.900" fontSize="sm">
                                                                {condition.repairType}
                                                            </Text>
                                                        </Flex>
                                                    )}
                                                    {condition?.withFurniture !== undefined && (
                                                        <Flex justify="space-between" align="center" py={2}>
                                                            <Text color="gray.600" fontSize="sm">Меблі:</Text>
                                                            <Badge
                                                                colorScheme={condition.withFurniture ? "green" : "red"}
                                                                variant="subtle"
                                                                rounded="md"
                                                                fontSize="xs"
                                                            >
                                                                {condition.withFurniture ? 'Є' : 'Немає'}
                                                            </Badge>
                                                        </Flex>
                                                    )}
                                                    {condition?.yearBuilt && (
                                                        <Flex justify="space-between" align="center" py={2}>
                                                            <Text color="gray.600" fontSize="sm">Рік побудови:</Text>
                                                            <Text fontWeight="500" color="gray.900" fontSize="sm">
                                                                {condition.yearBuilt}
                                                            </Text>
                                                        </Flex>
                                                    )}
                                                </VStack>
                                                <Divider my={4} />
                                            </Box>
                                        )}

                                        {/* Коммуникации - исправлено для отображения каждого элемента в новом ряду */}
                                        {communications && (
                                            <Box>
                                                <Text fontSize="md" fontWeight="600" color="gray.800" mb={3}>
                                                    Комунікації
                                                </Text>
                                                <VStack spacing={3} align="stretch">
                                                    {communications?.electricity !== undefined && (
                                                        <Flex justify="space-between" align="center" py={2}>
                                                            <Text color="gray.600" fontSize="sm">Електрика:</Text>
                                                            <Badge
                                                                colorScheme={communications.electricity ? "green" : "red"}
                                                                variant="subtle"
                                                                rounded="md"
                                                                fontSize="xs"
                                                            >
                                                                {communications.electricity ? 'Є' : 'Немає'}
                                                            </Badge>
                                                        </Flex>
                                                    )}
                                                    {communications?.water && (
                                                        <Flex justify="space-between" align="center" py={2}>
                                                            <Text color="gray.600" fontSize="sm">Вода:</Text>
                                                            <Text fontWeight="500" color="gray.900" fontSize="sm">
                                                                {communications.water}
                                                            </Text>
                                                        </Flex>
                                                    )}
                                                    {communications?.gas !== undefined && (
                                                        <Flex justify="space-between" align="center" py={2}>
                                                            <Text color="gray.600" fontSize="sm">Газ:</Text>
                                                            <Badge
                                                                colorScheme={communications.gas ? "green" : "red"}
                                                                variant="subtle"
                                                                rounded="md"
                                                                fontSize="xs"
                                                            >
                                                                {communications.gas ? 'Є' : 'Немає'}
                                                            </Badge>
                                                        </Flex>
                                                    )}
                                                    {communications?.sewerage && (
                                                        <Flex justify="space-between" align="center" py={2}>
                                                            <Text color="gray.600" fontSize="sm">Каналізація:</Text>
                                                            <Text fontWeight="500" color="gray.900" fontSize="sm">
                                                                {communications.sewerage}
                                                            </Text>
                                                        </Flex>
                                                    )}
                                                    {communications?.internet !== undefined && (
                                                        <Flex justify="space-between" align="center" py={2}>
                                                            <Text color="gray.600" fontSize="sm">Інтернет:</Text>
                                                            <Badge
                                                                colorScheme={communications.internet ? "green" : "red"}
                                                                variant="subtle"
                                                                rounded="md"
                                                                fontSize="xs"
                                                            >
                                                                {communications.internet ? 'Є' : 'Немає'}
                                                            </Badge>
                                                        </Flex>
                                                    )}
                                                </VStack>
                                            </Box>
                                        )}

                                    </VStack>
                                </Box>
                            )}

                            {/* Карта */}
                            <Box bg="white" rounded="2xl" overflow="hidden" shadow="sm">
                                <Box p={{ base: 4, md: 6 }} pb={0}>
                                    <Heading as="h2" fontSize={{ base: 'lg', md: 'xl' }} color="gray.900" mb={4} fontWeight="700">
                                        Розташування
                                    </Heading>
                                </Box>
                                <Box h={{ base: "300px", md: "400px" }}>
                                    <MapContainer
                                        center={mapCenter}
                                        zoom={13}
                                        scrollWheelZoom={false}
                                        style={{ height: "100%", width: "100%" }}
                                    >
                                        <TileLayer
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            attribution="&copy; OpenStreetMap contributors"
                                        />
                                        <Marker
                                            position={mapCenter}
                                            icon={new L.Icon({
                                                iconUrl: markerIconPng,
                                                shadowUrl: markerShadowPng,
                                                iconSize: [25, 41],
                                                iconAnchor: [12, 41],
                                                popupAnchor: [1, -34],
                                                shadowSize: [41, 41]
                                            })}
                                        >
                                            <Popup>
                                                <Box>
                                                    <Text fontWeight="600">{title}</Text>
                                                    <Text fontSize="sm" color="gray.600">{address}</Text>
                                                </Box>
                                            </Popup>
                                        </Marker>
                                    </MapContainer>
                                </Box>
                            </Box>
                        </VStack>

                        {/* Правая колонка - Контакты */}
                        <Box position="sticky" top="20px" alignSelf="start">
                            <VStack spacing={{ base: 4, md: 6 }} align="stretch">
                                {/* Контактная информация - уменьшен размер для мобильных */}
                                {contactInfo && (
                                    <Box bg="white" rounded="2xl" p={{ base: 3, md: 6 }} shadow="sm" border="2px solid #F5A623">
                                        <VStack spacing={{ base: 3, md: 4 }} align="stretch">
                                            <Box textAlign="center">
                                                <Heading as="h3" fontSize={{ base: 'md', md: 'lg' }} color="gray.900" mb={2} fontWeight="700">
                                                    Контакти власника
                                                </Heading>
                                                {contactInfo.name && (
                                                    <Text fontSize={{ base: 'sm', md: 'md' }} fontWeight="600" color="gray.700" mb={{ base: 2, md: 4 }}>
                                                        {contactInfo.name}
                                                    </Text>
                                                )}
                                            </Box>

                                            <Divider />

                                            <ContactButtons contactInfo={contactInfo} />

                                            {contactInfo.email && (
                                                <Box textAlign="center" pt={2}>
                                                    <Text fontSize="xs" color="gray.600">
                                                        Email: {contactInfo.email}
                                                    </Text>
                                                </Box>
                                            )}
                                        </VStack>
                                    </Box>
                                )}
                            </VStack>
                        </Box>
                    </Grid>

                    {/* Навигация - исправлена для мобильных */}
                    <Box textAlign="center" mt={{ base: 6, md: 8 }}>
                        <Button
                            as={Link}
                            to="/houses"
                            size={{ base: 'md', md: 'lg' }}
                            bg="#F5A623"
                            color="white"
                            rounded="xl"
                            px={{ base: 4, md: 8 }}
                            fontSize={{ base: 'sm', md: 'md' }}
                            _hover={{
                                bg: "#F6AB5E",
                                transform: "translateY(-2px)",
                                shadow: "lg"
                            }}
                            transition="all 0.3s ease"
                            fontWeight="600"
                            maxW={{ base: "280px", md: "auto" }}
                        >
                            ← Повернутися до каталогу
                        </Button>
                    </Box>
                </Container>
            </Box>

            {/* Модальное окно полноэкранного просмотра - исправлено позиционирование кнопок */}
            <Modal isOpen={isOpen} onClose={onClose} size="full">
                <ModalOverlay bg="rgba(0,0,0,0.9)" />
                <ModalContent bg="transparent" m={0}>
                    <ModalCloseButton
                        color="white"
                        size="lg"
                        top={4}
                        right={4}
                        bg="rgba(0,0,0,0.5)"
                        rounded="full"
                        zIndex={10}
                        _hover={{ bg: "rgba(0,0,0,0.7)" }}
                    />
                    <Flex
                        h="100vh"
                        align="center"
                        justify="center"
                        direction="column"
                        position="relative"
                        p={4}
                    >
                        <Box
                            position="relative"
                            maxW="90vw"
                            maxH="80vh"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Image
                                src={processedImages[fullscreenImageIndex] || '/images/placeholder-house.jpg'}
                                alt={`${title} - полноразмерное изображение`}
                                maxW="100%"
                                maxH="100%"
                                objectFit="contain"
                            />

                            {/* Фиксированные кнопки навигации для десктопа */}
                            {processedImages.length > 1 && (
                                <>
                                    <Button
                                        onClick={handleFullscreenPrev}
                                        position="fixed"
                                        left={8}
                                        top="50%"
                                        transform="translateY(-50%)"
                                        bg="rgba(255,255,255,0.9)"
                                        color="gray.800"
                                        rounded="full"
                                        size="lg"
                                        minW="60px"
                                        h="60px"
                                        zIndex={5}
                                        _hover={{ bg: "white" }}
                                        display={{ base: 'none', md: 'flex' }}
                                    >
                                        <FaChevronLeft size="20px" />
                                    </Button>

                                    <Button
                                        onClick={handleFullscreenNext}
                                        position="fixed"
                                        right={8}
                                        top="50%"
                                        transform="translateY(-50%)"
                                        bg="rgba(255,255,255,0.9)"
                                        color="gray.800"
                                        rounded="full"
                                        size="lg"
                                        minW="60px"
                                        h="60px"
                                        zIndex={5}
                                        _hover={{ bg: "white" }}
                                        display={{ base: 'none', md: 'flex' }}
                                    >
                                        <FaChevronRight size="20px" />
                                    </Button>
                                </>
                            )}
                        </Box>

                        {/* Счетчик в полноэкранном режиме */}
                        {processedImages.length > 1 && (
                            <Text
                                color="white"
                                fontSize="lg"
                                mt={4}
                                bg="rgba(0,0,0,0.5)"
                                px={4}
                                py={2}
                                rounded="md"
                                fontWeight="600"
                            >
                                {fullscreenImageIndex + 1} / {processedImages.length}
                            </Text>
                        )}

                        {/* Кнопки навигации для мобильных */}
                        {processedImages.length > 1 && (
                            <HStack
                                spacing={4}
                                mt={4}
                                display={{ base: 'flex', md: 'none' }}
                            >
                                <Button
                                    onClick={handleFullscreenPrev}
                                    bg="rgba(255,255,255,0.9)"
                                    color="gray.800"
                                    rounded="full"
                                    size="lg"
                                    minW="50px"
                                    h="50px"
                                    _hover={{ bg: "white" }}
                                >
                                    <FaChevronLeft />
                                </Button>

                                <Button
                                    onClick={handleFullscreenNext}
                                    bg="rgba(255,255,255,0.9)"
                                    color="gray.800"
                                    rounded="full"
                                    size="lg"
                                    minW="50px"
                                    h="50px"
                                    _hover={{ bg: "white" }}
                                >
                                    <FaChevronRight />
                                </Button>
                            </HStack>
                        )}
                    </Flex>
                </ModalContent>
            </Modal>
        </>
    );
};

export default HouseDetailPage;