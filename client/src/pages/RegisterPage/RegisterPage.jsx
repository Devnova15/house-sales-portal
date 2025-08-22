import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
    Box,
    Container,
    VStack,
    Heading,
    Text,
    FormControl,
    FormLabel,
    Input,
    Button,
    Alert,
    AlertIcon,
    Link,
    useToast,
    Card,
    CardBody,
    Divider,
    InputGroup,
    InputRightElement,
    IconButton,
    SimpleGrid
} from '@chakra-ui/react';
import { FaEye, FaEyeSlash, FaUserPlus } from 'react-icons/fa';
import { authService } from '../../services/authService';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        login: '',
        email: '',
        password: '',
        confirmPassword: '',
        telephone: ''
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const navigate = useNavigate();
    const toast = useToast();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear specific error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'Ім\'я є обов\'язковим';
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Прізвище є обов\'язковим';
        }

        if (!formData.login.trim()) {
            newErrors.login = 'Логін є обов\'язковим';
        } else if (formData.login.length < 3) {
            newErrors.login = 'Логін має містити мінімум 3 символи';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email є обов\'язковим';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Невірний формат email';
        }

        if (!formData.password) {
            newErrors.password = 'Пароль є обов\'язковим';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Пароль має містити мінімум 6 символів';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Підтвердження паролю є обов\'язковим';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Паролі не співпадають';
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);
        setErrors({});

        try {
            const response = await authService.register({
                firstName: formData.firstName,
                lastName: formData.lastName,
                login: formData.login,
                email: formData.email,
                password: formData.password,
                telephone: formData.telephone
            });

            if (response.success) {
                toast({
                    title: 'Успішна реєстрація',
                    description: 'Ваш акаунт було створено та ви автоматично увійшли в систему',
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                });

                // Redirect to home page or wishlist if that's where they came from
                navigate('/', { replace: true });
            }
        } catch (error) {
            console.error('Registration error:', error);

            if (error.email || error.login || error.auth) {
                setErrors(error);
            } else {
                toast({
                    title: 'Помилка реєстрації',
                    description: error.message || 'Сталася помилка під час реєстрації',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            bg="#f9f9f9"
            minH="100vh"
            py={{ base: 6, md: 12 }}
            px={{ base: 4, md: 6 }}
        >
            <Container maxW={{ base: "full", sm: "lg", md: "2xl" }} px={0}>
                <VStack spacing={{ base: 6, md: 8 }}>
                    <Box textAlign="center" w="full">
                        <Heading
                            size={{ base: "lg", md: "xl" }}
                            mb={{ base: 3, md: 4 }}
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            color="#111111"
                            fontFamily="Inter, sans-serif"
                            fontWeight="700"
                            flexDir={{ base: "column", sm: "row" }}
                            gap={{ base: 2, sm: 0 }}
                        >
                            <Box as={FaUserPlus} mr={{ base: 0, sm: 3 }} color="#F5A623" />
                            Реєстрація
                        </Heading>
                        <Text
                            color="#222222"
                            fontWeight="400"
                            fontSize={{ base: "md", md: "lg" }}
                            fontFamily="Inter, sans-serif"
                            maxW="500px"
                            mx="auto"
                            lineHeight="1.6"
                        >
                            Створіть свій акаунт для додавання будинків до обраних
                        </Text>
                    </Box>

                    <Card
                        bg="#ffffff"
                        w="full"
                        maxW="700px"
                        mx="auto"
                        boxShadow="0 10px 25px rgba(0, 0, 0, 0.08)"
                        borderRadius="xl"
                        border="1px solid"
                        borderColor="gray.50"
                        transition="all 0.3s ease"
                        _hover={{
                            boxShadow: "0 15px 35px rgba(0, 0, 0, 0.12)",
                            transform: "translateY(-2px)"
                        }}
                    >
                        <CardBody p={{ base: 6, md: 8 }}>
                            <form onSubmit={handleSubmit}>
                                <VStack spacing={{ base: 5, md: 6 }}>
                                    {/* Имя и Фамилия в одной строке на десктопе */}
                                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 5, md: 6 }} w="full">
                                        <FormControl isInvalid={!!errors.firstName}>
                                            <FormLabel
                                                color="#111111"
                                                fontWeight="600"
                                                fontSize={{ base: "sm", md: "md" }}
                                                fontFamily="Inter, sans-serif"
                                                mb={2}
                                            >
                                                Ім'я *
                                            </FormLabel>
                                            <Input
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleInputChange}
                                                placeholder="Введіть ваше ім'я"
                                                color="#111111"
                                                bg="#ffffff"
                                                border="2px solid"
                                                borderColor="gray.200"
                                                borderRadius="xl"
                                                fontSize={{ base: "md", md: "lg" }}
                                                h={{ base: "48px", md: "52px" }}
                                                fontFamily="Inter, sans-serif"
                                                _placeholder={{
                                                    color: "#666666",
                                                    fontSize: { base: "md", md: "lg" }
                                                }}
                                                _focus={{
                                                    borderColor: "#F5A623",
                                                    boxShadow: "0 0 0 3px rgba(245, 166, 35, 0.1)",
                                                    bg: "#ffffff"
                                                }}
                                                _hover={{
                                                    borderColor: "#F6AB5E"
                                                }}
                                                transition="all 0.3s ease"
                                            />
                                            {errors.firstName && (
                                                <Text
                                                    color="red.500"
                                                    fontSize="sm"
                                                    mt={2}
                                                    fontFamily="Inter, sans-serif"
                                                    fontWeight="500"
                                                >
                                                    {errors.firstName}
                                                </Text>
                                            )}
                                        </FormControl>

                                        <FormControl isInvalid={!!errors.lastName}>
                                            <FormLabel
                                                color="#111111"
                                                fontWeight="600"
                                                fontSize={{ base: "sm", md: "md" }}
                                                fontFamily="Inter, sans-serif"
                                                mb={2}
                                            >
                                                Прізвище *
                                            </FormLabel>
                                            <Input
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleInputChange}
                                                placeholder="Введіть ваше прізвище"
                                                color="#111111"
                                                bg="#ffffff"
                                                border="2px solid"
                                                borderColor="gray.200"
                                                borderRadius="xl"
                                                fontSize={{ base: "md", md: "lg" }}
                                                h={{ base: "48px", md: "52px" }}
                                                fontFamily="Inter, sans-serif"
                                                _placeholder={{
                                                    color: "#666666",
                                                    fontSize: { base: "md", md: "lg" }
                                                }}
                                                _focus={{
                                                    borderColor: "#F5A623",
                                                    boxShadow: "0 0 0 3px rgba(245, 166, 35, 0.1)",
                                                    bg: "#ffffff"
                                                }}
                                                _hover={{
                                                    borderColor: "#F6AB5E"
                                                }}
                                                transition="all 0.3s ease"
                                            />
                                            {errors.lastName && (
                                                <Text
                                                    color="red.500"
                                                    fontSize="sm"
                                                    mt={2}
                                                    fontFamily="Inter, sans-serif"
                                                    fontWeight="500"
                                                >
                                                    {errors.lastName}
                                                </Text>
                                            )}
                                        </FormControl>
                                    </SimpleGrid>

                                    {/* Логин и Email в одной строке на десктопе */}
                                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 5, md: 6 }} w="full">
                                        <FormControl isInvalid={!!errors.login}>
                                            <FormLabel
                                                color="#111111"
                                                fontWeight="600"
                                                fontSize={{ base: "sm", md: "md" }}
                                                fontFamily="Inter, sans-serif"
                                                mb={2}
                                            >
                                                Логін *
                                            </FormLabel>
                                            <Input
                                                name="login"
                                                value={formData.login}
                                                onChange={handleInputChange}
                                                placeholder="Введіть логін"
                                                color="#111111"
                                                bg="#ffffff"
                                                border="2px solid"
                                                borderColor="gray.200"
                                                borderRadius="xl"
                                                fontSize={{ base: "md", md: "lg" }}
                                                h={{ base: "48px", md: "52px" }}
                                                fontFamily="Inter, sans-serif"
                                                _placeholder={{
                                                    color: "#666666",
                                                    fontSize: { base: "md", md: "lg" }
                                                }}
                                                _focus={{
                                                    borderColor: "#F5A623",
                                                    boxShadow: "0 0 0 3px rgba(245, 166, 35, 0.1)",
                                                    bg: "#ffffff"
                                                }}
                                                _hover={{
                                                    borderColor: "#F6AB5E"
                                                }}
                                                transition="all 0.3s ease"
                                            />
                                            {errors.login && (
                                                <Text
                                                    color="red.500"
                                                    fontSize="sm"
                                                    mt={2}
                                                    fontFamily="Inter, sans-serif"
                                                    fontWeight="500"
                                                >
                                                    {errors.login}
                                                </Text>
                                            )}
                                        </FormControl>

                                        <FormControl isInvalid={!!errors.email}>
                                            <FormLabel
                                                color="#111111"
                                                fontWeight="600"
                                                fontSize={{ base: "sm", md: "md" }}
                                                fontFamily="Inter, sans-serif"
                                                mb={2}
                                            >
                                                Email *
                                            </FormLabel>
                                            <Input
                                                name="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                placeholder="Введіть email"
                                                color="#111111"
                                                bg="#ffffff"
                                                border="2px solid"
                                                borderColor="gray.200"
                                                borderRadius="xl"
                                                fontSize={{ base: "md", md: "lg" }}
                                                h={{ base: "48px", md: "52px" }}
                                                fontFamily="Inter, sans-serif"
                                                _placeholder={{
                                                    color: "#666666",
                                                    fontSize: { base: "md", md: "lg" }
                                                }}
                                                _focus={{
                                                    borderColor: "#F5A623",
                                                    boxShadow: "0 0 0 3px rgba(245, 166, 35, 0.1)",
                                                    bg: "#ffffff"
                                                }}
                                                _hover={{
                                                    borderColor: "#F6AB5E"
                                                }}
                                                transition="all 0.3s ease"
                                            />
                                            {errors.email && (
                                                <Text
                                                    color="red.500"
                                                    fontSize="sm"
                                                    mt={2}
                                                    fontFamily="Inter, sans-serif"
                                                    fontWeight="500"
                                                >
                                                    {errors.email}
                                                </Text>
                                            )}
                                        </FormControl>
                                    </SimpleGrid>

                                    {/* Телефон отдельно */}
                                    <FormControl isInvalid={!!errors.telephone}>
                                        <FormLabel
                                            color="#111111"
                                            fontWeight="600"
                                            fontSize={{ base: "sm", md: "md" }}
                                            fontFamily="Inter, sans-serif"
                                            mb={2}
                                        >
                                            Телефон
                                        </FormLabel>
                                        <Input
                                            name="telephone"
                                            value={formData.telephone}
                                            onChange={handleInputChange}
                                            placeholder="Введіть номер телефону"
                                            color="#111111"
                                            bg="#ffffff"
                                            border="2px solid"
                                            borderColor="gray.200"
                                            borderRadius="xl"
                                            fontSize={{ base: "md", md: "lg" }}
                                            h={{ base: "48px", md: "52px" }}
                                            fontFamily="Inter, sans-serif"
                                            _placeholder={{
                                                color: "#666666",
                                                fontSize: { base: "md", md: "lg" }
                                            }}
                                            _focus={{
                                                borderColor: "#F5A623",
                                                boxShadow: "0 0 0 3px rgba(245, 166, 35, 0.1)",
                                                bg: "#ffffff"
                                            }}
                                            _hover={{
                                                borderColor: "#F6AB5E"
                                            }}
                                            transition="all 0.3s ease"
                                        />
                                        {errors.telephone && (
                                            <Text
                                                color="red.500"
                                                fontSize="sm"
                                                mt={2}
                                                fontFamily="Inter, sans-serif"
                                                fontWeight="500"
                                            >
                                                {errors.telephone}
                                            </Text>
                                        )}
                                    </FormControl>

                                    {/* Пароли в одной строке на десктопе */}
                                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 5, md: 6 }} w="full">
                                        <FormControl isInvalid={!!errors.password}>
                                            <FormLabel
                                                color="#111111"
                                                fontWeight="600"
                                                fontSize={{ base: "sm", md: "md" }}
                                                fontFamily="Inter, sans-serif"
                                                mb={2}
                                            >
                                                Пароль *
                                            </FormLabel>
                                            <InputGroup>
                                                <Input
                                                    name="password"
                                                    type={showPassword ? 'text' : 'password'}
                                                    value={formData.password}
                                                    onChange={handleInputChange}
                                                    placeholder="Введіть пароль"
                                                    color="#111111"
                                                    bg="#ffffff"
                                                    border="2px solid"
                                                    borderColor="gray.200"
                                                    borderRadius="xl"
                                                    fontSize={{ base: "md", md: "lg" }}
                                                    h={{ base: "48px", md: "52px" }}
                                                    fontFamily="Inter, sans-serif"
                                                    _placeholder={{
                                                        color: "#666666",
                                                        fontSize: { base: "md", md: "lg" }
                                                    }}
                                                    _focus={{
                                                        borderColor: "#F5A623",
                                                        boxShadow: "0 0 0 3px rgba(245, 166, 35, 0.1)",
                                                        bg: "#ffffff"
                                                    }}
                                                    _hover={{
                                                        borderColor: "#F6AB5E"
                                                    }}
                                                    transition="all 0.3s ease"
                                                />
                                                <InputRightElement h={{ base: "48px", md: "52px" }}>
                                                    <IconButton
                                                        aria-label={showPassword ? "Приховати пароль" : "Показати пароль"}
                                                        icon={showPassword ? <FaEyeSlash /> : <FaEye />}
                                                        variant="ghost"
                                                        size="sm"
                                                        color="#666666"
                                                        _hover={{
                                                            color: "#F5A623",
                                                            bg: "rgba(245, 166, 35, 0.1)"
                                                        }}
                                                        transition="all 0.3s ease"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                    />
                                                </InputRightElement>
                                            </InputGroup>
                                            {errors.password && (
                                                <Text
                                                    color="red.500"
                                                    fontSize="sm"
                                                    mt={2}
                                                    fontFamily="Inter, sans-serif"
                                                    fontWeight="500"
                                                >
                                                    {errors.password}
                                                </Text>
                                            )}
                                        </FormControl>

                                        <FormControl isInvalid={!!errors.confirmPassword}>
                                            <FormLabel
                                                color="#111111"
                                                fontWeight="600"
                                                fontSize={{ base: "sm", md: "md" }}
                                                fontFamily="Inter, sans-serif"
                                                mb={2}
                                            >
                                                Підтвердження паролю *
                                            </FormLabel>
                                            <InputGroup>
                                                <Input
                                                    name="confirmPassword"
                                                    type={showConfirmPassword ? 'text' : 'password'}
                                                    value={formData.confirmPassword}
                                                    onChange={handleInputChange}
                                                    placeholder="Підтвердіть пароль"
                                                    color="#111111"
                                                    bg="#ffffff"
                                                    border="2px solid"
                                                    borderColor="gray.200"
                                                    borderRadius="xl"
                                                    fontSize={{ base: "md", md: "lg" }}
                                                    h={{ base: "48px", md: "52px" }}
                                                    fontFamily="Inter, sans-serif"
                                                    _placeholder={{
                                                        color: "#666666",
                                                        fontSize: { base: "md", md: "lg" }
                                                    }}
                                                    _focus={{
                                                        borderColor: "#F5A623",
                                                        boxShadow: "0 0 0 3px rgba(245, 166, 35, 0.1)",
                                                        bg: "#ffffff"
                                                    }}
                                                    _hover={{
                                                        borderColor: "#F6AB5E"
                                                    }}
                                                    transition="all 0.3s ease"
                                                />
                                                <InputRightElement h={{ base: "48px", md: "52px" }}>
                                                    <IconButton
                                                        aria-label={showConfirmPassword ? "Приховати пароль" : "Показати пароль"}
                                                        icon={showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                                        variant="ghost"
                                                        size="sm"
                                                        color="#666666"
                                                        _hover={{
                                                            color: "#F5A623",
                                                            bg: "rgba(245, 166, 35, 0.1)"
                                                        }}
                                                        transition="all 0.3s ease"
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    />
                                                </InputRightElement>
                                            </InputGroup>
                                            {errors.confirmPassword && (
                                                <Text
                                                    color="red.500"
                                                    fontSize="sm"
                                                    mt={2}
                                                    fontFamily="Inter, sans-serif"
                                                    fontWeight="500"
                                                >
                                                    {errors.confirmPassword}
                                                </Text>
                                            )}
                                        </FormControl>
                                    </SimpleGrid>

                                    {errors.auth && (
                                        <Alert
                                            status="error"
                                            borderRadius="xl"
                                            bg="red.50"
                                            border="1px solid"
                                            borderColor="red.200"
                                        >
                                            <AlertIcon color="red.500" />
                                            <Text
                                                color="red.700"
                                                fontFamily="Inter, sans-serif"
                                                fontWeight="500"
                                            >
                                                {errors.auth}
                                            </Text>
                                        </Alert>
                                    )}

                                    <Button
                                        type="submit"
                                        size="lg"
                                        width="100%"
                                        h={{ base: "52px", md: "56px" }}
                                        isLoading={loading}
                                        loadingText="Реєстрація..."
                                        bg="linear-gradient(135deg, #F7C272 0%, #F4B94F 100%)"
                                        color="#ffffff"
                                        fontFamily="Inter, sans-serif"
                                        fontWeight="600"
                                        fontSize={{ base: "md", md: "lg" }}
                                        borderRadius="xl"
                                        border="none"
                                        transition="all 0.3s ease"
                                        _hover={{
                                            bg: "linear-gradient(135deg, #F6AB5E 0%, #F5A623 100%)",
                                            transform: "translateY(-1px)",
                                            boxShadow: "0 8px 25px rgba(245, 166, 35, 0.3)"
                                        }}
                                        _active={{
                                            transform: "translateY(0px)"
                                        }}
                                        _focus={{
                                            boxShadow: "0 0 0 3px rgba(245, 166, 35, 0.3)"
                                        }}
                                    >
                                        Зареєструватися
                                    </Button>
                                </VStack>
                            </form>

                            <Divider
                                my={{ base: 5, md: 6 }}
                                borderColor="gray.200"
                                borderWidth="1px"
                            />

                            <Text
                                textAlign="center"
                                color="#222222"
                                fontWeight="400"
                                fontSize={{ base: "md", md: "lg" }}
                                fontFamily="Inter, sans-serif"
                                lineHeight="1.6"
                            >
                                Вже маєте акаунт?{' '}
                                <Link
                                    as={RouterLink}
                                    to="/login"
                                    color="#F5A623"
                                    fontWeight="600"
                                    textDecoration="none"
                                    transition="all 0.3s ease"
                                    _hover={{
                                        color: "#F6AB5E",
                                        textDecoration: "underline"
                                    }}
                                >
                                    Увійти
                                </Link>
                            </Text>
                        </CardBody>
                    </Card>
                </VStack>
            </Container>
        </Box>
    );
};

export default RegisterPage;