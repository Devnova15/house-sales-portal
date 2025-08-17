import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Button,
  useToast,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Spinner,
  Center,
  VStack,
  Icon,
  useColorModeValue,
  Link
} from '@chakra-ui/react';
import { FaHeart, FaHeartBroken, FaUserPlus, FaSignInAlt } from 'react-icons/fa';
import HouseCard from '../../components/house/HouseCard/HouseCard';
import { houseWishlistService } from '../../services/houseWishlistService';
import { authService } from '../../services/authService';

const WishlistPage = () => {
  const [wishlistHouses, setWishlistHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.900', 'white');
  const mutedColor = useColorModeValue('gray.700', 'gray.300');

  useEffect(() => {
    checkAuthAndLoadWishlist();
  }, []);

  const checkAuthAndLoadWishlist = async () => {
    setLoading(true);
    
    // Check if user is authenticated
    if (!authService.isAuthenticated()) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }
    
    setIsAuthenticated(true);
    await loadWishlist();
  };

  const loadWishlist = async () => {
    try {
      setLoading(true);
      setError(null);
      const houses = await houseWishlistService.getWishlist();
      setWishlistHouses(houses);
    } catch (err) {
      setError(err.message);
      if (err.message === 'Необхідно авторизуватися') {
        toast({
          title: 'Помилка',
          description: 'Для перегляду обраних будинків необхідно увійти в систему',
          status: 'warning',
          duration: 5000,
          isClosable: true,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClearWishlist = async () => {
    try {
      await houseWishlistService.clearWishlist();
      setWishlistHouses([]);
      toast({
        title: 'Успішно',
        description: 'Список обраних будинків очищено',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: 'Помилка',
        description: 'Не вдалося очистити список',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (loading) {
    return (
      <Box bg={bgColor} minH="100vh" py={8}>
        <Container maxW="container.xl">
          <Center py={20}>
            <VStack spacing={4}>
              <Spinner size="xl" color="brand.500" thickness="4px" />
              <Text color={mutedColor}>Завантаження обраних будинків...</Text>
            </VStack>
          </Center>
        </Container>
      </Box>
    );
  }

  if (error && error !== 'Необходимо авторизоваться') {
    return (
      <Box bg={bgColor} minH="100vh" py={8}>
        <Container maxW="container.xl">
          <Alert status="error" borderRadius="lg">
            <AlertIcon />
            <Box>
              <AlertTitle>Помилка!</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Box>
          </Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box bg={bgColor} minH="100vh" py={8}>
      <Container maxW="container.xl">
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <Box textAlign="center">
            <Heading 
              as="h1" 
              size="2xl" 
              color={textColor}
              mb={4}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Icon as={FaHeart} mr={3} color="red.500" />
              Обрані будинки
            </Heading>
            <Text fontSize="lg" color={mutedColor} maxW="600px" mx="auto">
              Тут зібрані всі будинки, які ви додали до свого списку обраних
            </Text>
          </Box>

          {/* Content */}
          {!isAuthenticated ? (
            <Center py={20}>
              <VStack spacing={6} textAlign="center">
                <Icon as={FaUserPlus} boxSize={20} color="blue.500" />
                <Heading size="lg" color={textColor}>
                  Необхідна реєстрація
                </Heading>
                <Text color={mutedColor} fontSize="lg" maxW="500px">
                  Щоб додавати будинки до списку обраних, вам потрібно зареєструватися або увійти в систему
                </Text>
                <VStack spacing={4}>
                  <Button
                    colorScheme="blue"
                    size="lg"
                    leftIcon={<FaUserPlus />}
                    onClick={() => navigate('/register')}
                  >
                    Зареєструватися
                  </Button>
                  <Text color={mutedColor}>
                    Вже маєте акаунт?{' '}
                    <Link as={RouterLink} to="/login" color="blue.500" fontWeight="semibold">
                      Увійти в систему
                    </Link>
                  </Text>
                </VStack>
              </VStack>
            </Center>
          ) : wishlistHouses.length === 0 ? (
            <Center py={20}>
              <VStack spacing={6} textAlign="center">
                <Icon as={FaHeartBroken} boxSize={20} color={mutedColor} />
                <Heading size="lg" color={textColor}>
                  Ваш список обраних поки що пустий
                </Heading>
                <Text color={mutedColor} fontSize="lg" maxW="400px">
                  Додайте будинки до обраних, щоб вони з'явились тут. 
                  Просто натисніть на іконку серця на картці будинку.
                </Text>
                <Button
                  colorScheme="brand"
                  size="lg"
                  onClick={() => window.location.href = '/houses'}
                >
                  Переглянути оголошення
                </Button>
              </VStack>
            </Center>
          ) : (
            <>
              {/* Wishlist Actions */}
              <Box 
                bg={cardBg} 
                p={4} 
                borderRadius="lg" 
                boxShadow="md"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                flexWrap="wrap"
                gap={4}
              >
                <Text fontSize="lg" fontWeight="semibold" color={textColor}>
                  Знайдено: {wishlistHouses.length} {wishlistHouses.length === 1 ? 'будинок' : 'будинків'}
                </Text>
                <Button
                  variant="outline"
                  colorScheme="red"
                  onClick={handleClearWishlist}
                  size="sm"
                >
                  Очистити список
                </Button>
              </Box>

              {/* Houses Grid */}
              <SimpleGrid 
                columns={{ base: 1, sm: 2, md: 3, lg: 4 }} 
                spacing={6}
              >
                {wishlistHouses.map((house) => (
                  <HouseCard 
                    key={house._id} 
                    house={house}
                    onWishlistChange={loadWishlist}
                  />
                ))}
              </SimpleGrid>
            </>
          )}
        </VStack>
      </Container>
    </Box>
  );
};

export default WishlistPage;