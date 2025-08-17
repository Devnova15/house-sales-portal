import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt, FaHeart } from 'react-icons/fa';
import { processImagePath } from '../../../utils/imageUtils';
import { houseWishlistService } from '../../../services/houseWishlistService';
import { authService } from '../../../services/authService';
import {
    Box,
    Card,
    CardBody,
    Image,
    Stack,
    Heading,
    Text,
    Flex,
    Badge,
    Icon,
    IconButton,
    LinkBox,
    LinkOverlay,
    useColorModeValue,
    useToast,
    Tooltip
} from '@chakra-ui/react';


const HouseCard = ({ house, onWishlistChange }) => {
    // State to track if the main image failed to load
    const [imageError, setImageError] = useState(false);

    // State to track if the card is being hovered
    const [isHovered, setIsHovered] = useState(false);

    // State to track if house is in wishlist
    const [isInWishlist, setIsInWishlist] = useState(false);

    // State to track wishlist loading
    const [wishlistLoading, setWishlistLoading] = useState(false);

    const toast = useToast();
    const navigate = useNavigate();

    // Check if house is in wishlist on component mount
    useEffect(() => {
        checkWishlistStatus();
    }, [house._id]);

    const checkWishlistStatus = async () => {
        try {
            const inWishlist = await houseWishlistService.isHouseInWishlist(house._id);
            setIsInWishlist(inWishlist);
        } catch (error) {
            // Silently fail - user might not be authenticated
            setIsInWishlist(false);
        }
    };

    const handleWishlistToggle = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (wishlistLoading) return;

        // Check if user is authenticated
        if (!authService.isAuthenticated()) {
            toast({
                title: 'Необхідна реєстрація',
                description: 'Щоб додавати будинки до обраних, потрібно зареєструватися',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                onCloseComplete: () => {
                    navigate('/register');
                }
            });
            return;
        }

        try {
            setWishlistLoading(true);

            if (isInWishlist) {
                await houseWishlistService.removeFromWishlist(house._id);
                setIsInWishlist(false);
                toast({
                    title: 'Видалено з обраних',
                    description: 'Будинок видалено зі списку обраних',
                    status: 'success',
                    duration: 2000,
                    isClosable: true,
                });
            } else {
                await houseWishlistService.addToWishlist(house._id);
                setIsInWishlist(true);
                toast({
                    title: 'Додано до обраних',
                    description: 'Будинок додано до списку обраних',
                    status: 'success',
                    duration: 2000,
                    isClosable: true,
                });
            }

            // Call parent callback if provided (for wishlist page refresh)
            if (onWishlistChange) {
                onWishlistChange();
            }
        } catch (error) {
            toast({
                title: 'Помилка',
                description: error.message || 'Не вдалося оновити список обраних',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setWishlistLoading(false);
        }
    };

    const handleImageError = (e) => {
        console.error('Помилка завантаження зображення:', e.target.src);
        setImageError(true);
        e.target.src = '/images/placeholder-house.jpg';
        e.target.onerror = null; // Prevent infinite error loop
    };

    // Determine which image to display (first house image or placeholder)
    const mainImage = !imageError && house.images && house.images.length > 0
        ? processImagePath(house.images[0])
        : '/images/placeholder-house.jpg';

    // Format the price with thousand separators
    const formattedPrice = house.price?.toLocaleString() || "0";

    const themeColors = {
        cardBg: useColorModeValue('white', 'gray.800'),
        priceBadgeBg: useColorModeValue('brand.600', 'brand.400'),
        borderColor: useColorModeValue('gray.100', 'gray.700'),
        hoverShadow: useColorModeValue('2xl', 'dark-lg'),
        textColor: useColorModeValue('gray.700', 'white'),
        mutedColor: useColorModeValue('gray.500', 'gray.400'),
        accentColor: useColorModeValue('brand.500', 'brand.400')
    };

    return (
        <LinkBox 
            as={Card}
            maxW="100%"
            borderRadius="lg"
            overflow="hidden"
            boxShadow="lg"
            transition="all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
            _hover={{ 
                transform: 'translateY(-12px)', 
                boxShadow: themeColors.hoverShadow,
                borderColor: themeColors.accentColor
            }}
            bg={themeColors.cardBg}
            borderWidth="1px"
            borderColor={themeColors.borderColor}
            position="relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            height="100%"
        >
            {/* Image container with overlay effects */}
            <Box position="relative" height="260px" overflow="hidden">
                {/* Main house image */}
                <Image
                    src={mainImage}
                    alt={house.title}
                    onError={handleImageError}
                    objectFit="cover"
                    width="100%"
                    height="100%"
                    transition="transform 0.7s ease"
                    _groupHover={{ transform: 'scale(1.1)' }}
                    filter="contrast(1.05)"
                />

                {/* Hover overlay effect */}
                <Box
                    position="absolute"
                    top={0}
                    left={0}
                    right={0}
                    bottom={0}
                    bg="blackAlpha.300"
                    opacity={0}
                    transition="opacity 0.3s ease"
                    _groupHover={{ opacity: 1 }}
                />

                {/* Price badge */}
                <Badge
                    position="absolute"
                    bottom="4"
                    right="4"
                    px="4"
                    py="2"
                    bg={themeColors.priceBadgeBg}
                    color="white"
                    fontSize="lg"
                    fontWeight="bold"
                    borderRadius="full"
                    boxShadow="lg"
                    letterSpacing="tight"
                >
                    ${formattedPrice}
                </Badge>

                {/* Favorite button (appears on hover) */}
                <Tooltip label={isInWishlist ? "Видалити з обраного" : "Додати до обраного"} placement="top">
                    <IconButton
                        aria-label={isInWishlist ? "Видалити з обраного" : "Додати до обраного"}
                        icon={<Icon as={FaHeart} boxSize={4} />}
                        position="absolute"
                        top="4"
                        left="4"
                        size="md"
                        colorScheme="red"
                        bg={isInWishlist ? "red.500" : "whiteAlpha.800"}
                        color={isInWishlist ? "white" : "gray.600"}
                        _hover={{ 
                            bg: isInWishlist ? "red.600" : "white", 
                            color: isInWishlist ? "white" : "red.500",
                            transform: "scale(1.1)"
                        }}
                        borderRadius="full"
                        boxShadow="md"
                        opacity={isHovered ? 1 : 0}
                        transform={isHovered ? "translateY(0)" : "translateY(-10px)"}
                        transition="all 0.3s ease"
                        isLoading={wishlistLoading}
                        onClick={handleWishlistToggle}
                    />
                </Tooltip>
            </Box>

            {/* Card content */}
            <CardBody py={5} px={5}>
                <Stack spacing={4}>
                    {/* House title (clickable link to detail page) */}
                    <LinkOverlay as={RouterLink} to={`/houses/${house._id}`}>
                        <Heading 
                            size="md" 
                            noOfLines={2} 
                            height="3rem" 
                            color={themeColors.textColor}
                            fontWeight="700"
                            letterSpacing="tight"
                            _hover={{ color: themeColors.accentColor }}
                            transition="color 0.3s ease"
                        >
                            {house.title}
                        </Heading>
                    </LinkOverlay>

                    {/* House address */}
                    <Flex align="center" color={themeColors.mutedColor}>
                        <Icon as={FaMapMarkerAlt} mr={2} color={themeColors.accentColor} />
                        <Text fontSize="sm" noOfLines={1} fontWeight="medium">{house.address}</Text>
                    </Flex>

                    {/* House features (bedrooms, bathrooms, area) */}
                    <Flex 
                        justify="space-between" 
                        pt={4} 
                        mt={2}
                        borderTopWidth="1px" 
                        borderColor={themeColors.borderColor}
                    >
                        {/* Bedrooms */}
                        <Flex 
                            align="center" 
                            bg="gray.50" 
                            p={2} 
                            borderRadius="md" 
                            flex={1} 
                            mr={2}
                            justify="center"
                        >
                            <Icon as={FaBed} color={themeColors.accentColor} />
                            <Text ml={2} fontSize="sm" fontWeight="bold" color={themeColors.textColor}>
                                {house.bedrooms} кімн.
                            </Text>
                        </Flex>

                        {/* Bathrooms */}
                        <Flex 
                            align="center" 
                            bg="gray.50" 
                            p={2} 
                            borderRadius="md" 
                            flex={1} 
                            mx={1}
                            justify="center"
                        >
                            <Icon as={FaBath} color={themeColors.accentColor} />
                            <Text ml={2} fontSize="sm" fontWeight="bold" color={themeColors.textColor}>
                                {house.bathrooms} ванн.
                            </Text>
                        </Flex>

                        {/* Area */}
                        <Flex 
                            align="center" 
                            bg="gray.50" 
                            p={2} 
                            borderRadius="md" 
                            flex={1} 
                            ml={2}
                            justify="center"
                        >
                            <Icon as={FaRulerCombined} color={themeColors.accentColor} />
                            <Text ml={2} fontSize="sm" fontWeight="bold" color={themeColors.textColor}>
                                {house.area} м²
                            </Text>
                        </Flex>
                    </Flex>
                </Stack>
            </CardBody>
        </LinkBox>
    );
};

export default HouseCard;
