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
  useColorModeValue,
  Card,
  CardBody,
  Divider,
  InputGroup,
  InputRightElement,
  IconButton
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
  
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  
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
    <Box bg={bgColor} minH="100vh" py={8}>
      <Container maxW="md">
        <VStack spacing={8}>
          <Box textAlign="center">
            <Heading size="xl" mb={4} display="flex" alignItems="center" justifyContent="center">
              <FaUserPlus style={{ marginRight: '12px' }} />
              Реєстрація
            </Heading>
            <Text color="gray.800" fontWeight="500">
              Створіть свій акаунт для додавання будинків до обраних
            </Text>
          </Box>
          
          <Card bg={cardBg} w="100%" boxShadow="lg">
            <CardBody p={8}>
              <form onSubmit={handleSubmit}>
                <VStack spacing={4}>
                  <FormControl isInvalid={!!errors.firstName}>
                    <FormLabel>Ім'я *</FormLabel>
                    <Input
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Введіть ваше ім'я"
                      color="black"
                      _placeholder={{ color: "gray.600" }}
                    />
                    {errors.firstName && (
                      <Text color="red.500" fontSize="sm" mt={1}>
                        {errors.firstName}
                      </Text>
                    )}
                  </FormControl>
                  
                  <FormControl isInvalid={!!errors.lastName}>
                    <FormLabel>Прізвище *</FormLabel>
                    <Input
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Введіть ваше прізвище"
                      color="black"
                      _placeholder={{ color: "gray.600" }}
                    />
                    {errors.lastName && (
                      <Text color="red.500" fontSize="sm" mt={1}>
                        {errors.lastName}
                      </Text>
                    )}
                  </FormControl>
                  
                  <FormControl isInvalid={!!errors.login}>
                    <FormLabel>Логін *</FormLabel>
                    <Input
                      name="login"
                      value={formData.login}
                      onChange={handleInputChange}
                      placeholder="Введіть логін"
                      color="black"
                      _placeholder={{ color: "gray.600" }}
                    />
                    {errors.login && (
                      <Text color="red.500" fontSize="sm" mt={1}>
                        {errors.login}
                      </Text>
                    )}
                  </FormControl>
                  
                  <FormControl isInvalid={!!errors.email}>
                    <FormLabel>Email *</FormLabel>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Введіть email"
                      color="black"
                      _placeholder={{ color: "gray.600" }}
                    />
                    {errors.email && (
                      <Text color="red.500" fontSize="sm" mt={1}>
                        {errors.email}
                      </Text>
                    )}
                  </FormControl>
                  
                  <FormControl isInvalid={!!errors.telephone}>
                    <FormLabel>Телефон</FormLabel>
                    <Input
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleInputChange}
                      placeholder="Введіть номер телефону"
                      color="black"
                      _placeholder={{ color: "gray.600" }}
                    />
                    {errors.telephone && (
                      <Text color="red.500" fontSize="sm" mt={1}>
                        {errors.telephone}
                      </Text>
                    )}
                  </FormControl>
                  
                  <FormControl isInvalid={!!errors.password}>
                    <FormLabel>Пароль *</FormLabel>
                    <InputGroup>
                      <Input
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Введіть пароль"
                        color="black"
                        _placeholder={{ color: "gray.600" }}
                      />
                      <InputRightElement>
                        <IconButton
                          aria-label={showPassword ? "Приховати пароль" : "Показати пароль"}
                          icon={showPassword ? <FaEyeSlash /> : <FaEye />}
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowPassword(!showPassword)}
                        />
                      </InputRightElement>
                    </InputGroup>
                    {errors.password && (
                      <Text color="red.500" fontSize="sm" mt={1}>
                        {errors.password}
                      </Text>
                    )}
                  </FormControl>
                  
                  <FormControl isInvalid={!!errors.confirmPassword}>
                    <FormLabel>Підтвердження паролю *</FormLabel>
                    <InputGroup>
                      <Input
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Підтвердіть пароль"
                        color="black"
                        _placeholder={{ color: "gray.600" }}
                      />
                      <InputRightElement>
                        <IconButton
                          aria-label={showConfirmPassword ? "Приховати пароль" : "Показати пароль"}
                          icon={showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        />
                      </InputRightElement>
                    </InputGroup>
                    {errors.confirmPassword && (
                      <Text color="red.500" fontSize="sm" mt={1}>
                        {errors.confirmPassword}
                      </Text>
                    )}
                  </FormControl>
                  
                  {errors.auth && (
                    <Alert status="error">
                      <AlertIcon />
                      {errors.auth}
                    </Alert>
                  )}
                  
                  <Button
                    type="submit"
                    colorScheme="blue"
                    size="lg"
                    width="100%"
                    isLoading={loading}
                    loadingText="Реєстрація..."
                  >
                    Зареєструватися
                  </Button>
                </VStack>
              </form>
              
              <Divider my={6} />
              
              <Text textAlign="center" color="gray.800" fontWeight="500">
                Вже маєте акаунт?{' '}
                <Link as={RouterLink} to="/login" color="blue.500" fontWeight="semibold">
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