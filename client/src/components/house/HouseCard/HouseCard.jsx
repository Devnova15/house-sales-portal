// src/components/house/HouseCard.jsx
import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt, FaHeart } from 'react-icons/fa';
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
    useDisclosure,
    Tooltip
} from '@chakra-ui/react';

const HouseCard = ({ house }) => {
    const [imageError, setImageError] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const handleImageError = (e) => {
        console.error('Помилка завантаження зображення:', e.target.src);
        setImageError(true);
        e.target.src = '/images/placeholder-house.jpg';
        e.target.onerror = null;
    };

    // Отримуємо зображення
    const mainImage = !imageError && house.images && house.images.length > 0
        ? (house.images[0].startsWith('/') ? house.images[0] : `/images/houses/house_1/${house.images[0]}`)
        : '/images/placeholder-house.jpg';

    // Форматуємо ціну
    const formattedPrice = house.price?.toLocaleString() || "0";

    // Кольори - оновлені для відповідності дизайну Solus
    const cardBg = useColorModeValue('white', 'gray.800');
    const priceBadgeBg = useColorModeValue('brand.600', 'brand.400');
    const borderColor = useColorModeValue('gray.100', 'gray.700');
    const hoverShadow = useColorModeValue('2xl', 'dark-lg');
    const textColor = useColorModeValue('gray.700', 'white');
    const mutedColor = useColorModeValue('gray.500', 'gray.400');
    const accentColor = useColorModeValue('brand.500', 'brand.400');

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
                boxShadow: hoverShadow,
                borderColor: accentColor
            }}
            bg={cardBg}
            borderWidth="1px"
            borderColor={borderColor}
            position="relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            height="100%"
        >
            <Box position="relative" height="260px" overflow="hidden">
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

                <Badge
                    position="absolute"
                    bottom="4"
                    right="4"
                    px="4"
                    py="2"
                    bg={priceBadgeBg}
                    color="white"
                    fontSize="lg"
                    fontWeight="bold"
                    borderRadius="full"
                    boxShadow="lg"
                    letterSpacing="tight"
                >
                    ${formattedPrice}
                </Badge>

                <Tooltip label="Додати до обраного" placement="top">
                    <IconButton
                        aria-label="Додати до обраного"
                        icon={<Icon as={FaHeart} boxSize={4} />}
                        position="absolute"
                        top="4"
                        left="4"
                        size="md"
                        colorScheme="red"
                        bg="whiteAlpha.800"
                        color="gray.600"
                        _hover={{ 
                            bg: "white", 
                            color: "red.500",
                            transform: "scale(1.1)"
                        }}
                        borderRadius="full"
                        boxShadow="md"
                        opacity={isHovered ? 1 : 0}
                        transform={isHovered ? "translateY(0)" : "translateY(-10px)"}
                        transition="all 0.3s ease"
                        onClick={(e) => {
                            e.preventDefault();
                            // Логіка додавання до обраного
                        }}
                    />
                </Tooltip>
            </Box>

            <CardBody py={5} px={5}>
                <Stack spacing={4}>
                    <LinkOverlay as={RouterLink} to={`/houses/${house._id}`}>
                        <Heading 
                            size="md" 
                            noOfLines={2} 
                            height="3rem" 
                            color={textColor}
                            fontWeight="700"
                            letterSpacing="tight"
                            _hover={{ color: accentColor }}
                            transition="color 0.3s ease"
                        >
                            {house.title}
                        </Heading>
                    </LinkOverlay>

                    <Flex align="center" color={mutedColor}>
                        <Icon as={FaMapMarkerAlt} mr={2} color={accentColor} />
                        <Text fontSize="sm" noOfLines={1} fontWeight="medium">{house.address}</Text>
                    </Flex>

                    <Flex 
                        justify="space-between" 
                        pt={4} 
                        mt={2}
                        borderTopWidth="1px" 
                        borderColor={borderColor}
                    >
                        <Flex 
                            align="center" 
                            bg="gray.50" 
                            p={2} 
                            borderRadius="md" 
                            flex={1} 
                            mr={2}
                            justify="center"
                        >
                            <Icon as={FaBed} color={accentColor} />
                            <Text ml={2} fontSize="sm" fontWeight="bold" color={textColor}>
                                {house.bedrooms} кімн.
                            </Text>
                        </Flex>

                        <Flex 
                            align="center" 
                            bg="gray.50" 
                            p={2} 
                            borderRadius="md" 
                            flex={1} 
                            mx={1}
                            justify="center"
                        >
                            <Icon as={FaBath} color={accentColor} />
                            <Text ml={2} fontSize="sm" fontWeight="bold" color={textColor}>
                                {house.bathrooms} ванн.
                            </Text>
                        </Flex>

                        <Flex 
                            align="center" 
                            bg="gray.50" 
                            p={2} 
                            borderRadius="md" 
                            flex={1} 
                            ml={2}
                            justify="center"
                        >
                            <Icon as={FaRulerCombined} color={accentColor} />
                            <Text ml={2} fontSize="sm" fontWeight="bold" color={textColor}>
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
