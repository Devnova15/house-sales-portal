import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    VStack,
    HStack,
    Card,
    CardBody,
    Text,
    Heading,
    Button,
    Avatar,
    Flex,
    Icon,
    Spinner,
    Alert,
    AlertIcon,
    Badge,
    SimpleGrid,
    useToast,
    Stack,
    Divider
} from '@chakra-ui/react';
import { FaUser, FaSignOutAlt, FaHeart, FaEdit, FaEnvelope, FaPhone, FaUserCircle } from 'react-icons/fa';
import { authService } from '../../services/authService';
import { houseWishlistService } from '../../services/houseWishlistService';

const UserProfilePage = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const [user, setUser] = useState(null);
    const [wishlistCount, setWishlistCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        setLoading(true);

        // Check if user is authenticated
        if (!authService.isAuthenticated()) {
            navigate('/login');
            return;
        }

        const currentUser = authService.getCurrentUser();
        console.log('Current user data:', currentUser); // Добавляем отладочный вывод
        setUser(currentUser);

        // Load wishlist count
        try {
            const wishlist = await houseWishlistService.getWishlist();
            setWishlistCount(wishlist.length);
        } catch (error) {
            console.error('Error loading wishlist:', error);
            setWishlistCount(0);
        }

        setLoading(false);
    };

    const handleLogout = () => {
        authService.logout();
        navigate('/');

        toast({
            title: 'Успішний вихід',
            description: 'Ви успішно вийшли з системи',
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
    };

    if (loading) {
        return (
            <Box
                bg="linear-gradient(135deg, #f9f9f9 0%, #ffffff 50%, #f5f5f5 100%)"
                minH="100vh"
                py={{ base: 8, md: 16 }}
                px={{ base: 4, md: 6 }}
            >
                <Container maxW="6xl">
                    <Flex
                        justify="center"
                        align="center"
                        direction="column"
                        minH="70vh"
                        gap={8}
                    >
                        <Box
                            w="80px"
                            h="80px"
                            borderRadius="full"
                            bg="linear-gradient(135deg, #F7C272 0%, #F4B94F 100%)"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            position="relative"
                            _before={{
                                content: '""',
                                position: 'absolute',
                                inset: '-4px',
                                borderRadius: 'full',
                                background: 'linear-gradient(135deg, #F7C272, #F4B94F, #F6AB5E)',
                                zIndex: -1,
                                filter: 'blur(8px)',
                                opacity: 0.7
                            }}
                        >
                            <Spinner
                                size="xl"
                                color="#ffffff"
                                thickness="4px"
                            />
                        </Box>
                        <Text
                            color="#222222"
                            fontSize={{ base: "lg", md: "xl" }}
                            fontFamily="Inter, sans-serif"
                            fontWeight="600"
                            textAlign="center"
                        >
                            Завантаження вашого профілю...
                        </Text>
                    </Flex>
                </Container>
            </Box>
        );
    }

    if (!user) {
        return (
            <Box
                bg="linear-gradient(135deg, #f9f9f9 0%, #ffffff 50%, #f5f5f5 100%)"
                minH="100vh"
                py={{ base: 8, md: 16 }}
                px={{ base: 4, md: 6 }}
            >
                <Container maxW="2xl">
                    <Flex justify="center" align="center" minH="70vh">
                        <Card
                            bg="rgba(255, 255, 255, 0.9)"
                            backdropFilter="blur(10px)"
                            maxW="500px"
                            w="full"
                            boxShadow="0 20px 60px rgba(0, 0, 0, 0.1)"
                            borderRadius="2xl"
                            border="1px solid rgba(245, 166, 35, 0.1)"
                        >
                            <CardBody p={10} textAlign="center">
                                <VStack spacing={8}>
                                    <Alert
                                        status="error"
                                        borderRadius="xl"
                                        bg="rgba(254, 178, 178, 0.1)"
                                        border="1px solid rgba(239, 68, 68, 0.2)"
                                        backdropFilter="blur(10px)"
                                    >
                                        <AlertIcon color="red.500" />
                                        <Text
                                            color="#dc2626"
                                            fontFamily="Inter, sans-serif"
                                            fontWeight="500"
                                        >
                                            Помилка завантаження профілю користувача
                                        </Text>
                                    </Alert>

                                    <Button
                                        onClick={() => navigate('/login')}
                                        size="lg"
                                        h="56px"
                                        px={8}
                                        bg="linear-gradient(135deg, #F7C272 0%, #F4B94F 100%)"
                                        color="#ffffff"
                                        fontFamily="Inter, sans-serif"
                                        fontWeight="600"
                                        borderRadius="xl"
                                        boxShadow="0 8px 25px rgba(245, 166, 35, 0.3)"
                                        transition="all 0.4s ease"
                                        _hover={{
                                            bg: "linear-gradient(135deg, #F6AB5E 0%, #F5A623 100%)",
                                            transform: "translateY(-2px)",
                                            boxShadow: "0 12px 35px rgba(245, 166, 35, 0.4)"
                                        }}
                                        _active={{
                                            transform: "translateY(0px)"
                                        }}
                                    >
                                        Увійти в систему
                                    </Button>
                                </VStack>
                            </CardBody>
                        </Card>
                    </Flex>
                </Container>
            </Box>
        );
    }

    return (
        <Box
            bg="linear-gradient(135deg, #f9f9f9 0%, #ffffff 50%, #f5f5f5 100%)"
            minH="100vh"
            py={{ base: 8, md: 16 }}
            px={{ base: 4, md: 6 }}
        >
            <Container maxW="6xl">
                <VStack spacing={{ base: 8, md: 12 }}>
                    {/* Page Title */}
                    <Box textAlign="center" w="full">
                        <Heading
                            size={{ base: "xl", md: "2xl" }}
                            mb={4}
                            color="#111111"
                            fontFamily="Inter, sans-serif"
                            fontWeight="700"
                            bgGradient="linear(135deg, #F7C272, #F4B94F)"
                            bgClip="text"
                        >
                            Мій профіль
                        </Heading>
                        <Text
                            color="#666666"
                            fontSize={{ base: "md", md: "lg" }}
                            fontFamily="Inter, sans-serif"
                            maxW="600px"
                            mx="auto"
                        >
                            Керуйте своїм акаунтом та переглядайте обрані оголошення
                        </Text>
                    </Box>

                    {/* Profile Header Card */}
                    <Card
                        bg="rgba(255, 255, 255, 0.9)"
                        backdropFilter="blur(10px)"
                        w="full"
                        maxW="4xl"
                        boxShadow="0 20px 60px rgba(0, 0, 0, 0.08)"
                        borderRadius="2xl"
                        border="1px solid rgba(245, 166, 35, 0.1)"
                        transition="all 0.4s ease"
                        _hover={{
                            boxShadow: "0 25px 70px rgba(0, 0, 0, 0.12)",
                            transform: "translateY(-4px)"
                        }}
                    >
                        <CardBody p={{ base: 8, md: 12 }}>
                            <Stack
                                direction={{ base: "column", lg: "row" }}
                                align="center"
                                spacing={{ base: 8, md: 10 }}
                                textAlign={{ base: "center", lg: "left" }}
                            >
                                {/* Avatar Section */}
                                <Box position="relative">
                                    <Box
                                        position="absolute"
                                        inset="-6px"
                                        borderRadius="full"
                                        bgGradient="linear(135deg, #F7C272, #F4B94F, #F6AB5E)"
                                        opacity={0.6}
                                        filter="blur(15px)"
                                    />
                                    <Avatar
                                        size="2xl"
                                        w={{ base: "120px", md: "150px" }}
                                        h={{ base: "120px", md: "150px" }}
                                        bg="linear-gradient(135deg, #F7C272 0%, #F4B94F 100%)"
                                        color="#ffffff"
                                        icon={<FaUserCircle size="70%" />}
                                        border="4px solid rgba(255, 255, 255, 0.8)"
                                        position="relative"
                                        zIndex={1}
                                    />
                                    <Box
                                        position="absolute"
                                        bottom={2}
                                        right={2}
                                        w="40px"
                                        h="40px"
                                        borderRadius="full"
                                        bg="#10B981"
                                        border="3px solid white"
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                    >
                                        <Box w="10px" h="10px" borderRadius="full" bg="white" />
                                    </Box>
                                </Box>

                                {/* Profile Info */}
                                <VStack
                                    align={{ base: "center", lg: "flex-start" }}
                                    spacing={6}
                                    flex="1"
                                    w="full"
                                >
                                    <VStack align={{ base: "center", lg: "flex-start" }} spacing={2}>
                                        <Heading
                                            size={{ base: "xl", md: "2xl" }}
                                            color="#111111"
                                            fontFamily="Inter, sans-serif"
                                            fontWeight="700"
                                        >
                                            {user.firstName} {user.lastName}
                                        </Heading>
                                        <Text
                                            color="#666666"
                                            fontSize="lg"
                                            fontFamily="Inter, sans-serif"
                                            fontWeight="500"
                                        >
                                            Активний користувач
                                        </Text>
                                    </VStack>

                                    <Divider borderColor="rgba(245, 166, 35, 0.2)" />

                                    <VStack
                                        spacing={4}
                                        align={{ base: "center", lg: "flex-start" }}
                                        w="full"
                                    >
                                        <HStack
                                            spacing={4}
                                            w="full"
                                            justify={{ base: "center", lg: "flex-start" }}
                                            p={4}
                                            borderRadius="xl"
                                            bg="rgba(245, 166, 35, 0.05)"
                                            transition="all 0.3s ease"
                                            _hover={{ bg: "rgba(245, 166, 35, 0.1)" }}
                                        >
                                            <Box
                                                w="45px"
                                                h="45px"
                                                borderRadius="lg"
                                                bg="linear-gradient(135deg, #F7C272, #F4B94F)"
                                                display="flex"
                                                alignItems="center"
                                                justifyContent="center"
                                            >
                                                <Icon as={FaEnvelope} color="white" boxSize={5} />
                                            </Box>
                                            <VStack align="flex-start" spacing={0}>
                                                <Text
                                                    color="#888888"
                                                    fontSize="sm"
                                                    fontFamily="Inter, sans-serif"
                                                    fontWeight="500"
                                                >
                                                    Email
                                                </Text>
                                                <Text
                                                    color="#222222"
                                                    fontSize={{ base: "md", md: "lg" }}
                                                    fontFamily="Inter, sans-serif"
                                                    fontWeight="600"
                                                >
                                                    {user.email || 'Не вказано'}
                                                </Text>
                                            </VStack>
                                        </HStack>

                                        <HStack
                                            spacing={4}
                                            w="full"
                                            justify={{ base: "center", lg: "flex-start" }}
                                            p={4}
                                            borderRadius="xl"
                                            bg="rgba(245, 166, 35, 0.05)"
                                            transition="all 0.3s ease"
                                            _hover={{ bg: "rgba(245, 166, 35, 0.1)" }}
                                        >
                                            <Box
                                                w="45px"
                                                h="45px"
                                                borderRadius="lg"
                                                bg="linear-gradient(135deg, #F7C272, #F4B94F)"
                                                display="flex"
                                                alignItems="center"
                                                justifyContent="center"
                                            >
                                                <Icon as={FaUser} color="white" boxSize={5} />
                                            </Box>
                                            <VStack align="flex-start" spacing={0}>
                                                <Text
                                                    color="#888888"
                                                    fontSize="sm"
                                                    fontFamily="Inter, sans-serif"
                                                    fontWeight="500"
                                                >
                                                    Логін
                                                </Text>
                                                <Text
                                                    color="#222222"
                                                    fontSize={{ base: "md", md: "lg" }}
                                                    fontFamily="Inter, sans-serif"
                                                    fontWeight="600"
                                                >
                                                    {user.login || 'Не вказано'}
                                                </Text>
                                            </VStack>
                                        </HStack>

                                        {user.telephone && (
                                            <HStack
                                                spacing={4}
                                                w="full"
                                                justify={{ base: "center", lg: "flex-start" }}
                                                p={4}
                                                borderRadius="xl"
                                                bg="rgba(245, 166, 35, 0.05)"
                                                transition="all 0.3s ease"
                                                _hover={{ bg: "rgba(245, 166, 35, 0.1)" }}
                                            >
                                                <Box
                                                    w="45px"
                                                    h="45px"
                                                    borderRadius="lg"
                                                    bg="linear-gradient(135deg, #F7C272, #F4B94F)"
                                                    display="flex"
                                                    alignItems="center"
                                                    justifyContent="center"
                                                >
                                                    <Icon as={FaPhone} color="white" boxSize={5} />
                                                </Box>
                                                <VStack align="flex-start" spacing={0}>
                                                    <Text
                                                        color="#888888"
                                                        fontSize="sm"
                                                        fontFamily="Inter, sans-serif"
                                                        fontWeight="500"
                                                    >
                                                        Телефон
                                                    </Text>
                                                    <Text
                                                        color="#222222"
                                                        fontSize={{ base: "md", md: "lg" }}
                                                        fontFamily="Inter, sans-serif"
                                                        fontWeight="600"
                                                    >
                                                        {user.telephone}
                                                    </Text>
                                                </VStack>
                                            </HStack>
                                        )}
                                    </VStack>
                                </VStack>
                            </Stack>
                        </CardBody>
                    </Card>

                    {/* Action Cards */}
                    <SimpleGrid
                        columns={{ base: 1, md: 2 }}
                        spacing={{ base: 6, md: 8 }}
                        w="full"
                        maxW="4xl"
                    >
                        {/* Wishlist Card */}
                        <Card
                            bg="rgba(255, 255, 255, 0.9)"
                            backdropFilter="blur(10px)"
                            boxShadow="0 20px 60px rgba(245, 166, 35, 0.1)"
                            borderRadius="2xl"
                            border="1px solid rgba(245, 166, 35, 0.15)"
                            cursor="pointer"
                            transition="all 0.4s ease"
                            _hover={{
                                boxShadow: "0 25px 70px rgba(245, 166, 35, 0.2)",
                                transform: "translateY(-4px)",
                                borderColor: "rgba(245, 166, 35, 0.3)"
                            }}
                            onClick={() => navigate('/wishlist')}
                            position="relative"
                            overflow="hidden"
                        >
                            <Box
                                position="absolute"
                                top={0}
                                left={0}
                                w="full"
                                h="4px"
                                bgGradient="linear(to-r, #F7C272, #F4B94F)"
                            />
                            <CardBody p={{ base: 8, md: 10 }}>
                                <VStack spacing={6} textAlign="center">
                                    <Box position="relative">
                                        <Box
                                            w="80px"
                                            h="80px"
                                            borderRadius="2xl"
                                            bg="linear-gradient(135deg, #F7C272 0%, #F4B94F 100%)"
                                            display="flex"
                                            alignItems="center"
                                            justifyContent="center"
                                            transition="all 0.4s ease"
                                            _groupHover={{ transform: "scale(1.1) rotate(5deg)" }}
                                            position="relative"
                                            _before={{
                                                content: '""',
                                                position: 'absolute',
                                                inset: '-4px',
                                                borderRadius: '2xl',
                                                background: 'linear-gradient(135deg, #F7C272, #F4B94F)',
                                                zIndex: -1,
                                                filter: 'blur(10px)',
                                                opacity: 0.5
                                            }}
                                        >
                                            <Icon as={FaHeart} color="#ffffff" boxSize={8} />
                                        </Box>
                                        {wishlistCount > 0 && (
                                            <Badge
                                                position="absolute"
                                                top="-8px"
                                                right="-8px"
                                                bg="#10B981"
                                                color="white"
                                                borderRadius="full"
                                                minW="32px"
                                                h="32px"
                                                display="flex"
                                                alignItems="center"
                                                justifyContent="center"
                                                fontSize="sm"
                                                fontWeight="bold"
                                                border="3px solid white"
                                            >
                                                {wishlistCount}
                                            </Badge>
                                        )}
                                    </Box>

                                    <VStack spacing={3}>
                                        <Heading
                                            size="lg"
                                            color="#111111"
                                            fontFamily="Inter, sans-serif"
                                            fontWeight="700"
                                        >
                                            Обране
                                        </Heading>

                                        <Text
                                            color="#666666"
                                            fontSize="md"
                                            fontFamily="Inter, sans-serif"
                                            fontWeight="500"
                                        >
                                            {wishlistCount === 0 ? 'Немає обраних оголошень' :
                                                wishlistCount === 1 ? '1 обране оголошення' :
                                                    `${wishlistCount} обраних оголошень`}
                                        </Text>

                                        <Text
                                            color="#F5A623"
                                            fontSize="sm"
                                            fontFamily="Inter, sans-serif"
                                            fontWeight="600"
                                            textTransform="uppercase"
                                            letterSpacing="1px"
                                        >
                                            Переглянути →
                                        </Text>
                                    </VStack>
                                </VStack>
                            </CardBody>
                        </Card>

                        {/* Logout Card */}
                        <Card
                            bg="rgba(255, 255, 255, 0.9)"
                            backdropFilter="blur(10px)"
                            boxShadow="0 20px 60px rgba(239, 68, 68, 0.1)"
                            borderRadius="2xl"
                            border="1px solid rgba(239, 68, 68, 0.15)"
                            cursor="pointer"
                            transition="all 0.4s ease"
                            _hover={{
                                boxShadow: "0 25px 70px rgba(239, 68, 68, 0.2)",
                                transform: "translateY(-4px)",
                                borderColor: "rgba(239, 68, 68, 0.3)"
                            }}
                            onClick={handleLogout}
                            position="relative"
                            overflow="hidden"
                        >
                            <Box
                                position="absolute"
                                top={0}
                                left={0}
                                w="full"
                                h="4px"
                                bgGradient="linear(to-r, #ff6b6b, #ee5a5a)"
                            />
                            <CardBody p={{ base: 8, md: 10 }}>
                                <VStack spacing={6} textAlign="center">
                                    <Box
                                        w="80px"
                                        h="80px"
                                        borderRadius="2xl"
                                        bg="linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%)"
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                        transition="all 0.4s ease"
                                        _groupHover={{ transform: "scale(1.1) rotate(-5deg)" }}
                                        position="relative"
                                        _before={{
                                            content: '""',
                                            position: 'absolute',
                                            inset: '-4px',
                                            borderRadius: '2xl',
                                            background: 'linear-gradient(135deg, #ff6b6b, #ee5a5a)',
                                            zIndex: -1,
                                            filter: 'blur(10px)',
                                            opacity: 0.5
                                        }}
                                    >
                                        <Icon as={FaSignOutAlt} color="#ffffff" boxSize={8} />
                                    </Box>

                                    <VStack spacing={3}>
                                        <Heading
                                            size="lg"
                                            color="#111111"
                                            fontFamily="Inter, sans-serif"
                                            fontWeight="700"
                                        >
                                            Вийти
                                        </Heading>

                                        <Text
                                            color="#666666"
                                            fontSize="md"
                                            fontFamily="Inter, sans-serif"
                                            fontWeight="500"
                                        >
                                            Завершити поточний сеанс роботи
                                        </Text>

                                        <Text
                                            color="#ef4444"
                                            fontSize="sm"
                                            fontFamily="Inter, sans-serif"
                                            fontWeight="600"
                                            textTransform="uppercase"
                                            letterSpacing="1px"
                                        >
                                            Вийти →
                                        </Text>
                                    </VStack>
                                </VStack>
                            </CardBody>
                        </Card>
                    </SimpleGrid>
                </VStack>
            </Container>
        </Box>
    );
};

export default UserProfilePage;