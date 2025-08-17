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
  useColorModeValue,
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
  Tooltip
} from '@chakra-ui/react';
import { FaHome, FaList, FaInfoCircle, FaPhone, FaBars, FaTimes, FaHeart, FaUser, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import { authService } from '../../../services/authService';

const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const bgColor = useColorModeValue('white', 'gray.900');
  const borderColor = useColorModeValue('gray.100', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'white');
  const hoverBgColor = useColorModeValue('gray.50', 'gray.800');
  const accentColor = useColorModeValue('brand.600', 'brand.400');

  useEffect(() => {
    checkAuthStatus();
    
    // Listen for storage changes (logout from other tabs)
    const handleStorageChange = () => {
      checkAuthStatus();
    };
    
    // Listen for custom auth state changes
    const handleAuthStateChange = () => {
      checkAuthStatus();
    };
    
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
          // Если токен есть, но данные пользователя не получены
          console.warn('User data could not be retrieved from token');
          setIsAuthenticated(false);
          setUser(null);
          authService.logout(); // Сбрасываем некорректный токен
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
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
    { name: 'Контакти', path: '/contact', icon: FaPhone }
  ];

  return (
    <Box 
      as="header" 
      bg={bgColor} 
      px={0} 
      boxShadow="md" 
      position="sticky" 
      top="0" 
      zIndex="1000"
      borderBottom="1px"
      borderColor={borderColor}
      width="100%"
    >
      <Container maxW="100%" px={[4, 6, 8]}>
        <Flex h={20} alignItems="center" justifyContent="space-between">
          <Link
            as={RouterLink}
            to="/"
            fontSize={["lg", "xl", "2xl"]}
            fontWeight="bold"
            letterSpacing="wider"
            color={textColor}
            _hover={{ textDecoration: 'none', color: accentColor }}
            display="flex"
            alignItems="center"
          >
            <Icon as={FaHome} mr={3} color={accentColor} boxSize={[5, 6]} />
            <Text>Продаж будинків</Text>
          </Link>

          <HStack spacing={10} alignItems="center" display={{ base: 'none', md: 'flex' }}>
            <HStack as="nav" spacing={8}>
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  as={RouterLink}
                  to={item.path}
                  px={3}
                  py={2}
                  rounded="md"
                  _hover={{
                    textDecoration: 'none',
                    bg: hoverBgColor,
                    color: accentColor,
                    transform: 'translateY(-2px)',
                    transition: 'all 0.3s ease'
                  }}
                  fontWeight="500"
                  fontSize="md"
                  color={textColor}
                  display="flex"
                  alignItems="center"
                  transition="all 0.3s ease"
                >
                  <Icon as={item.icon} mr={2} />
                  {item.name}
                </Link>
              ))}
            </HStack>

            {/* Auth Section */}
            <HStack spacing={4}>
              {isAuthenticated ? (
                <Menu>
                  <MenuButton
                    as={Button}
                    variant="ghost"
                    leftIcon={<FaUser />}
                    _hover={{ bg: hoverBgColor, color: accentColor }}
                    color={textColor}
                    fontWeight="500"
                  >
                    {user?.firstName || 'Профіль'}
                  </MenuButton>
                  <MenuList>
                    <MenuItem as={RouterLink} to="/profile" icon={<FaUser />} color="gray.800" fontWeight="600">
                      Мій профіль
                    </MenuItem>
                    <MenuItem 
                      icon={<FaHeart />}
                      as={RouterLink} 
                      to="/wishlist"
                      color="gray.800"
                      fontWeight="600"
                    >
                      Обране
                    </MenuItem>
                  </MenuList>
                </Menu>
              ) : (
                <>
                  <Button
                    as={RouterLink}
                    to="/login"
                    variant="ghost"
                    leftIcon={<FaSignInAlt />}
                    _hover={{ bg: hoverBgColor, color: accentColor }}
                    color={textColor}
                    fontWeight="500"
                    size="sm"
                  >
                    Увійти
                  </Button>
                  <Button
                    as={RouterLink}
                    to="/register"
                    colorScheme="blue"
                    leftIcon={<FaUserPlus />}
                    size="sm"
                    fontWeight="500"
                  >
                    Реєстрація
                  </Button>
                </>
              )}
            </HStack>
          </HStack>

          <IconButton
            display={{ base: 'flex', md: 'none' }}
            onClick={onOpen}
            icon={<FaBars />}
            variant="ghost"
            aria-label="Відкрити меню"
            size="lg"
            color={accentColor}
            _hover={{
              bg: hoverBgColor,
              transform: 'scale(1.1)',
              transition: 'all 0.3s ease'
            }}
            transition="all 0.3s ease"
          />
        </Flex>
      </Container>

      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="xs">
        <DrawerOverlay backdropFilter="blur(2px)" />
        <DrawerContent bg={bgColor} boxShadow="xl">
          <DrawerCloseButton color={accentColor} size="lg" />
          <DrawerHeader 
            borderBottomWidth="1px" 
            borderColor={borderColor}
            fontSize="xl"
            fontWeight="bold"
            color={accentColor}
          >
            Меню
          </DrawerHeader>
          <DrawerBody>
            <VStack spacing={6} align="stretch" mt={6}>
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  as={RouterLink}
                  to={item.path}
                  px={3}
                  py={4}
                  rounded="md"
                  _hover={{
                    textDecoration: 'none',
                    bg: hoverBgColor,
                    color: accentColor,
                    transform: 'translateX(5px)',
                    transition: 'all 0.3s ease'
                  }}
                  fontWeight="500"
                  fontSize="lg"
                  onClick={onClose}
                  display="flex"
                  alignItems="center"
                  transition="all 0.3s ease"
                  borderBottom="1px"
                  borderColor={borderColor}
                  pb={4}
                >
                  <Icon as={item.icon} mr={3} boxSize={5} />
                  {item.name}
                </Link>
              ))}

              {/* Mobile Auth Section */}
              <Box borderTop="1px" borderColor={borderColor} pt={6} mt={6}>
                {isAuthenticated ? (
                  <VStack spacing={4} align="stretch">
                    <Text 
                      fontSize="lg" 
                      fontWeight="600" 
                      color={accentColor}
                      px={3}
                    >
                      Привіт, {user?.firstName || 'Користувач'}!
                    </Text>
                    <Link
                      as={RouterLink}
                      to="/profile"
                      px={3}
                      py={4}
                      rounded="md"
                      _hover={{
                        textDecoration: 'none',
                        bg: hoverBgColor,
                        color: accentColor,
                        transform: 'translateX(5px)',
                        transition: 'all 0.3s ease'
                      }}
                      fontWeight="600"
                      fontSize="lg"
                      onClick={onClose}
                      display="flex"
                      alignItems="center"
                      transition="all 0.3s ease"
                      borderBottom="1px"
                      borderColor={borderColor}
                      pb={4}
                      color="gray.800"
                    >
                      <Icon as={FaUser} mr={3} boxSize={5} />
                      Мій профіль
                    </Link>
                  </VStack>
                ) : (
                  <VStack spacing={4} align="stretch">
                    <Button
                      as={RouterLink}
                      to="/login"
                      variant="ghost"
                      leftIcon={<FaSignInAlt />}
                      justifyContent="flex-start"
                      onClick={onClose}
                      size="lg"
                      fontWeight="500"
                    >
                      Увійти
                    </Button>
                    <Button
                      as={RouterLink}
                      to="/register"
                      colorScheme="blue"
                      leftIcon={<FaUserPlus />}
                      justifyContent="flex-start"
                      onClick={onClose}
                      size="lg"
                      fontWeight="500"
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
