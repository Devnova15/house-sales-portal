import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
    Box,
    Flex,
    HStack,
    Link,
    IconButton,
    Button,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    useDisclosure,
    Container,
    Text,
    Icon,
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    VStack,
    Tooltip,
    useBreakpointValue,
} from '@chakra-ui/react';
import {
    FaHome,
    FaList,
    FaInfoCircle,
    FaPhone,
    FaBars,
    FaHeart,
    FaUser,
    FaSignInAlt,
    FaUserPlus,
} from 'react-icons/fa';
import { authService } from '../../../services/authService';

const accent = '#F5A623';
const accentHover = 'rgba(245, 166, 35, 0.15)';
const accentGradient = 'linear(to-r, #F7C272, #F4B94F)';
const bgWhite = '#ffffff';
const textDark = '#111111';
const textDark2 = '#222222';
const borderRadius = '1rem';

const Header = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        checkAuthStatus();
        const handleStorageChange = () => checkAuthStatus();
        const handleAuthStateChange = () => checkAuthStatus();
        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('authStateChanged', handleAuthStateChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('authStateChanged', handleAuthStateChange);
        };
    }, []);

    const checkAuthStatus = () => {
        try {
            const authenticated = authService.isAuthenticated();
            setIsAuthenticated(authenticated);
            if (authenticated) {
                const currentUser = authService.getCurrentUser();
                if (currentUser) {
                    setUser(currentUser);
                } else {
                    setIsAuthenticated(false);
                    setUser(null);
                    authService.logout();
                }
            } else {
                setUser(null);
            }
        } catch {
            setIsAuthenticated(false);
            setUser(null);
            authService.logout();
        }
    };

    const navItems = [
        { name: 'Головна', path: '/', icon: FaHome },
        { name: 'Оголошення', path: '/houses', icon: FaList },
        { name: 'Обране', path: '/wishlist', icon: FaHeart },
        { name: 'Про нас', path: '/about', icon: FaInfoCircle },
        { name: 'Контакти', path: '/contact', icon: FaPhone },
    ];

    // Настройки отображения по брейкпоинтам
    const showLogoText = useBreakpointValue({ base: false, sm: false, md: true });
    const showFullNav = useBreakpointValue({ base: false, xl: true });
    const showButtonText = useBreakpointValue({ base: false, xl: true });



    return (
        <Box
            as="header"
            bg={bgWhite}
            px={0}
            boxShadow="lg"
            position="sticky"
            top="0"
            zIndex="1000"
            borderBottom="1px solid"
            borderColor="#ececec"
            width="100%"
            fontFamily="'Inter', sans-serif"
        >
            <Container maxW="100%" px={[2, 3, 4, 8]}>
                <Flex h={16} alignItems="center" justifyContent="space-between">
                    {/* Логотип */}
                    <Link
                        as={RouterLink}
                        to="/"
                        display="flex"
                        alignItems="center"
                        rounded={borderRadius}
                        px={2}
                        py={1}
                        flexShrink={0}
                    >
                        <Icon as={FaHome} color={accent} boxSize={[6, 7]} mr={{ base: 0, sm: 0, md: 2 }} />
                        {showLogoText && (
                            <Text fontWeight="bold" fontSize={{ base: 'sm', md: 'lg', lg: 'xl' }} color={textDark}>
                                Продаж будинків
                            </Text>
                        )}
                    </Link>

                    {/* Центральная часть - навигация */}
                    <Box display={{ base: 'none', xl: 'flex' }} flex="1" justifyContent="center" mx={4}>
                        {showFullNav && (
                            // Полная навигация только для больших экранов
                            <HStack as="nav" spacing={3} wrap="nowrap">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.name}
                                        as={RouterLink}
                                        to={item.path}
                                        px={3}
                                        py={2}
                                        rounded="xl"
                                        _hover={{ textDecoration: 'none', bg: accentHover, color: textDark, transform: 'translateY(-1px)' }}
                                        fontWeight="500"
                                        fontSize="md"
                                        color={textDark2}
                                        display="flex"
                                        alignItems="center"
                                        transition="all 0.3s ease"
                                        whiteSpace="nowrap"
                                    >
                                        <Icon as={item.icon} mr={2} color={accent} />
                                        {item.name}
                                    </Link>
                                ))}
                            </HStack>
                        )}
                    </Box>

                    {/* Правая часть - кнопки пользователя */}
                    <HStack spacing={2} alignItems="center" display={{ base: 'none', md: 'flex' }} flexShrink={0}>
                        {isAuthenticated ? (
                            <Menu>
                                <MenuButton
                                    as={Button}
                                    variant="ghost"
                                    leftIcon={<FaUser />}
                                    _hover={{ bg: accentHover, color: textDark }}
                                    color={textDark2}
                                    fontWeight="500"
                                    fontSize="sm"
                                    px={3}
                                    py={2}
                                    rounded="xl"
                                    size="sm"
                                >
                                    {showButtonText && <Text>{user?.firstName || 'Профіль'}</Text>}
                                </MenuButton>
                                <MenuList rounded="xl" boxShadow="lg" border="none" bg={bgWhite}>
                                    <MenuItem as={RouterLink} to="/profile" icon={<FaUser />} color={textDark2} _hover={{ bg: accentHover }} rounded="xl">
                                        Мій профіль
                                    </MenuItem>
                                    <MenuItem as={RouterLink} to="/wishlist" icon={<FaHeart />} color={textDark2} _hover={{ bg: accentHover }} rounded="xl">
                                        Обране
                                    </MenuItem>
                                </MenuList>
                            </Menu>
                        ) : (
                            <HStack spacing={2}>
                                <Tooltip label="Увійти" placement="bottom" isDisabled={showButtonText}>
                                    {showButtonText ? (
                                        <Button
                                            as={RouterLink}
                                            to="/login"
                                            leftIcon={<FaSignInAlt />}
                                            variant="outline"
                                            size="sm"
                                            fontWeight="500"
                                            rounded="xl"
                                            color={textDark2}
                                            borderColor={textDark2}
                                            _hover={{ bg: accentHover, borderColor: accent }}
                                        >
                                            Увійти
                                        </Button>
                                    ) : (
                                        <IconButton
                                            as={RouterLink}
                                            to="/login"
                                            icon={<FaSignInAlt />}
                                            variant="outline"
                                            size="sm"
                                            rounded="xl"
                                            color={textDark2}
                                            borderColor={textDark2}
                                            _hover={{ bg: accentHover, borderColor: accent }}
                                            aria-label="Увійти"
                                        />
                                    )}
                                </Tooltip>
                                <Tooltip label="Реєстрація" placement="bottom" isDisabled={showButtonText}>
                                    {showButtonText ? (
                                        <Button
                                            as={RouterLink}
                                            to="/register"
                                            leftIcon={<FaUserPlus />}
                                            bgGradient={accentGradient}
                                            color={textDark}
                                            size="sm"
                                            fontWeight="600"
                                            rounded="xl"
                                            _hover={{ bg: accentHover }}
                                        >
                                            Реєстрація
                                        </Button>
                                    ) : (
                                        <IconButton
                                            as={RouterLink}
                                            to="/register"
                                            icon={<FaUserPlus />}
                                            bgGradient={accentGradient}
                                            color={textDark}
                                            size="sm"
                                            rounded="xl"
                                            _hover={{ bg: accentHover }}
                                            aria-label="Реєстрація"
                                        />
                                    )}
                                </Tooltip>
                            </HStack>
                        )}
                    </HStack>

                    {/* Бургер для мобильных и планшетов */}
                    <IconButton
                        display={{ base: 'flex', xl: 'none' }}
                        onClick={onOpen}
                        icon={<FaBars />}
                        variant="ghost"
                        aria-label="Відкрити меню"
                        size="lg"
                        color={accent}
                        rounded="xl"
                        _hover={{ bg: accentHover, color: textDark }}
                    />
                </Flex>
            </Container>

            {/* Мобильное меню */}
            <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="xs">
                <DrawerOverlay backdropFilter="blur(2px)" />
                <DrawerContent bg={bgWhite} boxShadow="2xl" roundedLeft={borderRadius}>
                    <DrawerCloseButton color={accent} size="lg" rounded="xl" />
                    <DrawerHeader borderBottomWidth="1px" borderColor="#ececec" fontSize="xl" fontWeight="bold" color={accent}>
                        Меню
                    </DrawerHeader>
                    <DrawerBody>
                        <VStack spacing={4} align="stretch" mt={4}>
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    as={RouterLink}
                                    to={item.path}
                                    px={4}
                                    py={3}
                                    rounded="xl"
                                    _hover={{ bg: accentHover, color: textDark }}
                                    fontWeight="500"
                                    fontSize="md"
                                    onClick={onClose}
                                    display="flex"
                                    alignItems="center"
                                    color={textDark2}
                                >
                                    <Icon as={item.icon} mr={3} color={accent} />
                                    {item.name}
                                </Link>
                            ))}

                            <Box borderTop="1px solid" borderColor="#ececec" pt={4} mt={4}>
                                {isAuthenticated ? (
                                    <VStack spacing={4} align="stretch">
                                        <Text fontSize="md" fontWeight="600" color={accent} px={4}>
                                            Привіт, {user?.firstName || 'Користувач'}!
                                        </Text>
                                        <Link
                                            as={RouterLink}
                                            to="/profile"
                                            px={4}
                                            py={3}
                                            rounded="xl"
                                            _hover={{ bg: accentHover, color: textDark }}
                                            fontWeight="500"
                                            fontSize="md"
                                            onClick={onClose}
                                            display="flex"
                                            alignItems="center"
                                            color={textDark2}
                                        >
                                            <Icon as={FaUser} mr={3} color={accent} />
                                            Мій профіль
                                        </Link>
                                        <Link
                                            as={RouterLink}
                                            to="/wishlist"
                                            px={4}
                                            py={3}
                                            rounded="xl"
                                            _hover={{ bg: accentHover, color: textDark }}
                                            fontWeight="500"
                                            fontSize="md"
                                            onClick={onClose}
                                            display="flex"
                                            alignItems="center"
                                            color={textDark2}
                                        >
                                            <Icon as={FaHeart} mr={3} color={accent} />
                                            Обране
                                        </Link>
                                    </VStack>
                                ) : (
                                    <VStack spacing={4} align="stretch">
                                        <Button
                                            as={RouterLink}
                                            to="/login"
                                            variant="outline"
                                            leftIcon={<FaSignInAlt />}
                                            onClick={onClose}
                                            size="md"
                                            fontWeight="500"
                                            rounded="xl"
                                            color={textDark2}
                                            borderColor={textDark2}
                                            _hover={{ bg: accentHover, borderColor: accent }}
                                        >
                                            Увійти
                                        </Button>
                                        <Button
                                            as={RouterLink}
                                            to="/register"
                                            bgGradient={accentGradient}
                                            color={textDark}
                                            leftIcon={<FaUserPlus />}
                                            onClick={onClose}
                                            size="md"
                                            fontWeight="600"
                                            rounded="xl"
                                            _hover={{ bg: accentHover }}
                                        >
                                            Реєстрація
                                        </Button>
                                    </VStack>
                                )}
                            </Box>
                        </VStack>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </Box>
    );
};

export default Header;