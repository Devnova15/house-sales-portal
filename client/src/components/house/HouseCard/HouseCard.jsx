import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt, FaHeart } from 'react-icons/fa';
import { processImagePath } from '../../../utils/imageUtils';
import { houseWishlistService } from '../../../services/houseWishlistService';
import { authService } from '../../../services/authService';
import {
    Box, Image, Text, Flex, Icon, IconButton, Badge,
    Stack, LinkBox, LinkOverlay, useToast
} from '@chakra-ui/react';

const accent = '#F5A623';
const bgWhite = '#ffffff';
const textDark = '#111111';
const textDark2 = '#222222';

const HouseCard = ({ house, onWishlistChange }) => {
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [imageError, setImageError] = useState(false);
    const navigate = useNavigate();
    const toast = useToast();

    useEffect(() => {
        checkWishlistStatus();
    }, [house._id]);

    const checkWishlistStatus = async () => {
        try {
            if (authService.isAuthenticated()) {
                const status = await houseWishlistService.isHouseInWishlist(house._id);
                setIsWishlisted(status);
            }
        } catch (error) {
            console.error('Error checking wishlist status:', error);
        }
    };

    const handleWishlistClick = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!authService.isAuthenticated()) {
            navigate('/login');
            return;
        }

        try {
            setIsLoading(true);
            if (isWishlisted) {
                await houseWishlistService.removeFromWishlist(house._id);
                setIsWishlisted(false);
                toast({ title: 'Видалено з обраного', status: 'success', duration: 2000 });
            } else {
                await houseWishlistService.addToWishlist(house._id);
                setIsWishlisted(true);
                toast({ title: 'Додано до обраного', status: 'success', duration: 2000 });
            }
            if (onWishlistChange) onWishlistChange();
        } catch (error) {
            toast({
                title: 'Помилка',
                description: 'Не вдалося оновити список бажань',
                status: 'error',
                duration: 3000,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <LinkBox
            position="relative"
            bg={bgWhite}
            borderRadius="xl"
            overflow="hidden"
            boxShadow="md"
            borderWidth="1px"
            borderColor="gray.200"
            transition="all 0.3s ease"
            _hover={{ transform: 'translateY(-8px)', boxShadow: 'xl', borderColor: accent }}
            height="100%"
            display="flex"
            flexDirection="column"
        >
            {/* Изображение и кнопка wishlist */}
            <Box position="relative" height={{ base: "200px", md: "260px" }}>
                <Image
                    src={!imageError && house.images?.[0] ? processImagePath(house.images[0]) : '/images/placeholder-house.jpg'}
                    alt={house.title}
                    objectFit="cover"
                    width="100%"
                    height="100%"
                    transition="transform 0.5s ease"
                    onError={(e) => {
                        setImageError(true);
                        e.target.src = '/images/placeholder-house.jpg';
                    }}
                    _groupHover={{ transform: 'scale(1.05)' }}
                />
                <Badge
                    position="absolute"
                    bottom="4"
                    right="4"
                    px="4"
                    py="2"
                    bg={accent}
                    color={bgWhite}
                    fontSize={{ base: "md", md: "lg" }}
                    fontWeight="bold"
                    borderRadius="full"
                    boxShadow="md"
                >
                    ${house.price?.toLocaleString()}
                </Badge>
                <Box position="absolute" top="4" right="4" zIndex="2">
                    <IconButton
                        aria-label={isWishlisted ? "Видалити з обраного" : "Додати до обраного"}
                        icon={<Icon as={FaHeart} />}
                        onClick={handleWishlistClick}
                        isLoading={isLoading}
                        color={isWishlisted ? accent : 'gray.400'}
                        bg={bgWhite}
                        size="lg"
                        borderRadius="full"
                        boxShadow="md"
                        _hover={{ transform: 'scale(1.1)', color: accent }}
                        transition="all 0.3s ease"
                    />
                </Box>
            </Box>

            {/* Контент карточки */}
            <Stack spacing={4} p={{ base: 4, md: 6 }} flex="1" justifyContent="space-between">
                {/* Заголовок и адрес */}
                <Box>
                    <LinkOverlay as={RouterLink} to={`/houses/${house._id}`}>
                        <Text
                            fontSize={{ base: "lg", md: "xl" }}
                            fontWeight="700"
                            color={textDark}
                            noOfLines={2}
                            mb={2}
                            minH={{ base: "40px", md: "50px" }} // фиксированная высота заголовка
                        >
                            {house.title}
                        </Text>
                    </LinkOverlay>
                    <Flex align="center" color={textDark2}>
                        <Icon as={FaMapMarkerAlt} color={accent} mr={2} />
                        <Text fontSize="sm" noOfLines={1}>{house.address}</Text>
                    </Flex>
                </Box>

                {/* Характеристики: комнаты, ванные, площадь */}
                <Flex
                    mt={4}
                    pt={4}
                    borderTopWidth="1px"
                    borderColor="gray.200"
                    flexWrap="wrap"
                    justify="space-between"
                >
                    {[
                        { icon: FaBed, label: `${house.bedrooms} кімн.` },
                        { icon: FaBath, label: `${house.bathrooms} ванн.` },
                        { icon: FaRulerCombined, label: `${house.area} м²` }
                    ].map((item, idx) => (
                        <Flex
                            key={idx}
                            align="center"
                            bg="gray.50"
                            p={{ base: 2, md: 3 }}
                            borderRadius="lg"
                            flex="1 1 30%"
                            m="1"
                            justify="center"
                            transition="all 0.3s ease"
                            _hover={{ bg: 'gray.100' }}
                        >
                            <Icon as={item.icon} color={accent} />
                            <Text ml={2} fontSize={{ base: "xs", md: "sm" }} fontWeight="600" color={textDark2} noOfLines={1}>
                                {item.label}
                            </Text>
                        </Flex>
                    ))}
                </Flex>
            </Stack>
        </LinkBox>
    );
};

export default HouseCard;
